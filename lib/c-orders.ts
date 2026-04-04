import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import path from "path";

const ORDERS_PATH = path.join(process.cwd(), "data", "c-orders.json");

export type OrderStatus = "pending" | "completed";

export type OrderRecord = {
  id: string;
  tossOrderId: string;
  paymentKey: string;
  seat: number;
  /** 결제 URL의 items 쿼리 (id:수량,…) */
  itemsRaw: string;
  /** 목록용 한 줄 요약 */
  summary: string;
  amount: number;
  method: string;
  approvedAt: string | null;
  createdAt: string;
  status: OrderStatus;
  completedAt?: string;
};

async function readOrders(): Promise<OrderRecord[]> {
  try {
    const raw = await fs.readFile(ORDERS_PATH, "utf8");
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data.filter((x): x is OrderRecord => x && typeof x === "object" && typeof (x as OrderRecord).id === "string");
  } catch {
    return [];
  }
}

async function writeOrders(orders: OrderRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(ORDERS_PATH), { recursive: true });
  await fs.writeFile(ORDERS_PATH, JSON.stringify(orders, null, 2), "utf8");
}

/** 결제 승인 직후 호출. 동일 paymentKey는 한 번만 저장 (새로고침 중복 방지). */
export async function recordOrderIfNew(input: {
  paymentKey: string;
  tossOrderId: string;
  seat: number;
  itemsRaw: string;
  summary: string;
  amount: number;
  method: string;
  approvedAt: string | null;
}): Promise<void> {
  const orders = await readOrders();
  if (orders.some((o) => o.paymentKey === input.paymentKey)) {
    return;
  }
  const row: OrderRecord = {
    id: randomUUID(),
    paymentKey: input.paymentKey,
    tossOrderId: input.tossOrderId,
    seat: input.seat,
    itemsRaw: input.itemsRaw,
    summary: input.summary,
    amount: input.amount,
    method: input.method,
    approvedAt: input.approvedAt,
    createdAt: new Date().toISOString(),
    status: "pending",
  };
  orders.unshift(row);
  await writeOrders(orders);
}

export async function getOrders(): Promise<OrderRecord[]> {
  const list = await readOrders();
  return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function markOrderCompleted(orderId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const orders = await readOrders();
  const i = orders.findIndex((o) => o.id === orderId);
  if (i === -1) {
    return { ok: false, error: "주문을 찾을 수 없습니다." };
  }
  if (orders[i].status === "completed") {
    return { ok: false, error: "이미 완료 처리된 주문입니다." };
  }
  orders[i] = {
    ...orders[i],
    status: "completed",
    completedAt: new Date().toISOString(),
  };
  await writeOrders(orders);
  return { ok: true };
}
