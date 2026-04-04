import { NextResponse } from "next/server";
import { cConfigSchema, getCConfig, saveCConfig, type CConfig } from "@/lib/c-config";

function normalizePutBody(body: unknown): unknown {
  if (!body || typeof body !== "object") return body;
  const b = body as Record<string, unknown>;
  if (!Array.isArray(b.menuItems)) return body;
  return {
    ...b,
    menuItems: b.menuItems.map((m) => {
      if (!m || typeof m !== "object") return m;
      const row = { ...(m as Record<string, unknown>) };
      const u = row.imageUrl;
      if (u === null || u === undefined) {
        delete row.imageUrl;
      } else if (typeof u === "string" && u.trim() === "") {
        delete row.imageUrl;
      } else if (typeof u === "string") {
        row.imageUrl = u.trim();
      }
      const d = row.description;
      if (d === null || d === undefined) {
        delete row.description;
      } else if (typeof d === "string" && d.trim() === "") {
        delete row.description;
      } else if (typeof d === "string") {
        row.description = d.trim();
      }
      return row;
    }),
  };
}

export async function GET() {
  try {
    const config = await getCConfig();
    return NextResponse.json(config);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "설정을 불러오지 못했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const raw = (await req.json()) as unknown;
    const body = normalizePutBody(raw);
    const parsed = cConfigSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }
    const data: CConfig = parsed.data;
    const ids = new Set<string>();
    for (const m of data.menuItems) {
      if (ids.has(m.id)) {
        return NextResponse.json({ error: `메뉴 id 중복: ${m.id}` }, { status: 400 });
      }
      ids.add(m.id);
    }
    await saveCConfig(data);
    return NextResponse.json({ ok: true, config: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "저장에 실패했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
