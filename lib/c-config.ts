import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import type { MenuItemRecord, OrderedLineItem } from "@/app/c/menu-items";
import { DEFAULT_MENU_ITEMS, DEFAULT_SEAT_COUNT } from "@/app/c/menu-items";

const CONFIG_PATH = path.join(process.cwd(), "data", "c-config.json");

const imageUrlSchema = z
  .string()
  .max(2048)
  .optional()
  .refine((s) => {
    if (s === undefined) return true;
    const t = s.trim();
    return t === "" || /^https?:\/\//i.test(t) || t.startsWith("/");
  }, { message: "이미지는 http(s) URL 또는 /로 시작하는 경로여야 합니다." });

const menuItemSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(64)
    .regex(/^[a-z0-9-]+$/i, "id는 영문, 숫자, 하이픈만 사용하세요."),
  name: z.string().min(1).max(100),
  price: z.number().int().min(100).max(50_000_000),
  imageUrl: imageUrlSchema,
  description: z.string().max(2000).optional(),
});

export const cConfigSchema = z.object({
  seatCount: z.number().int().min(1).max(500),
  menuItems: z.array(menuItemSchema).min(1).max(200),
});

export type CConfig = z.infer<typeof cConfigSchema>;

function stripOptionalMenuFields(items: unknown[]): unknown[] {
  return items.map((row) => {
    if (!row || typeof row !== "object") return row;
    const m = row as Record<string, unknown>;
    const u = m.imageUrl;
    const imageUrl =
      typeof u === "string" && u.trim() !== "" ? u.trim() : undefined;
    const d = m.description;
    const description =
      typeof d === "string" && d.trim() !== "" ? d.trim() : undefined;
    return { ...m, imageUrl, description };
  });
}

function normalizeConfig(raw: unknown): CConfig {
  const base: CConfig = {
    seatCount: DEFAULT_SEAT_COUNT,
    menuItems: DEFAULT_MENU_ITEMS.map((m) => ({ ...m })),
  };
  if (!raw || typeof raw !== "object") return base;
  const o = raw as Record<string, unknown>;
  const seatCount = typeof o.seatCount === "number" ? o.seatCount : base.seatCount;
  const rawItems = Array.isArray(o.menuItems) ? o.menuItems : base.menuItems;
  const menuItems = stripOptionalMenuFields(rawItems);
  const parsed = cConfigSchema.safeParse({ seatCount, menuItems });
  return parsed.success ? parsed.data : base;
}

export async function getCConfig(): Promise<CConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, "utf8");
    return normalizeConfig(JSON.parse(raw));
  } catch {
    return {
      seatCount: DEFAULT_SEAT_COUNT,
      menuItems: DEFAULT_MENU_ITEMS.map((m) => ({ ...m })),
    };
  }
}

export async function saveCConfig(config: CConfig): Promise<void> {
  const normalized: CConfig = {
    ...config,
    menuItems: config.menuItems.map((m) => ({
      ...m,
      imageUrl: m.imageUrl?.trim() || undefined,
      description: m.description?.trim() || undefined,
    })),
  };
  const parsed = cConfigSchema.safeParse(normalized);
  if (!parsed.success) {
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  }
  const ids = new Set<string>();
  for (const m of parsed.data.menuItems) {
    if (ids.has(m.id)) throw new Error(`메뉴 id 중복: ${m.id}`);
    ids.add(m.id);
  }
  await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
  await fs.writeFile(CONFIG_PATH, JSON.stringify(parsed.data, null, 2), "utf8");
}

/**
 * `items` 쿼리: `id:수량,id:수량` 또는 레거시 `id,id` (수량 1).
 * 동일 id가 여러 번 나오면 수량을 합산합니다.
 */
export function parseMenuOrderFromQuery(
  raw: string | undefined,
  menuItems: MenuItemRecord[]
): OrderedLineItem[] {
  if (!raw || !raw.trim()) return [];
  const defMap = new Map(menuItems.map((m) => [m.id, m]));
  const qtyById = new Map<string, number>();

  for (const part of raw.split(",").map((s) => s.trim()).filter(Boolean)) {
    let id: string;
    let qty = 1;
    const colon = part.indexOf(":");
    if (colon !== -1) {
      id = part.slice(0, colon).trim();
      const q = Number.parseInt(part.slice(colon + 1), 10);
      qty = Number.isFinite(q) && q > 0 ? Math.min(q, 999) : 1;
    } else {
      id = part;
    }
    if (!defMap.has(id)) continue;
    qtyById.set(id, (qtyById.get(id) ?? 0) + qty);
  }

  const out: OrderedLineItem[] = [];
  for (const [id, quantity] of qtyById) {
    const def = defMap.get(id);
    if (def && quantity > 0) {
      out.push({ ...def, quantity });
    }
  }
  return out;
}
