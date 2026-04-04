import { NextResponse } from "next/server";
import { getOrders, markOrderCompleted } from "@/lib/c-orders";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "주문 목록을 불러오지 못했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = (await req.json()) as { id?: string };
    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!id) {
      return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });
    }
    const result = await markOrderCompleted(id);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "처리에 실패했습니다.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
