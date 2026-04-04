const TOSS_API = "https://api.tosspayments.com/v1";

function authHeader(secretKey: string): string {
  return `Basic ${Buffer.from(`${secretKey}:`, "utf8").toString("base64")}`;
}

export type TossConfirmResult =
  | { ok: true; payment: Record<string, unknown> }
  | { ok: false; message: string; code?: string };

/** 결제 승인 (successUrl 도착 후 서버에서 1회 호출) */
export async function confirmTossPayment(params: {
  paymentKey: string;
  orderId: string;
  amount: number;
}): Promise<TossConfirmResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return { ok: false, message: "서버에 TOSS_SECRET_KEY가 설정되어 있지 않습니다." };
  }

  const res = await fetch(`${TOSS_API}/payments/confirm`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: authHeader(secretKey),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentKey: params.paymentKey,
      orderId: params.orderId,
      amount: params.amount,
    }),
  });

  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    return {
      ok: false,
      message: typeof data.message === "string" ? data.message : "결제 승인에 실패했습니다.",
      code: typeof data.code === "string" ? data.code : undefined,
    };
  }

  return { ok: true, payment: data };
}

/** 이미 승인된 결제 등으로 confirm이 실패했을 때 조회용 */
export async function getTossPayment(paymentKey: string): Promise<TossConfirmResult> {
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (!secretKey) {
    return { ok: false, message: "서버에 TOSS_SECRET_KEY가 설정되어 있지 않습니다." };
  }

  const res = await fetch(`${TOSS_API}/payments/${encodeURIComponent(paymentKey)}`, {
    method: "GET",
    cache: "no-store",
    headers: {
      Authorization: authHeader(secretKey),
    },
  });

  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    return {
      ok: false,
      message: typeof data.message === "string" ? data.message : "결제 조회에 실패했습니다.",
      code: typeof data.code === "string" ? data.code : undefined,
    };
  }

  return { ok: true, payment: data };
}
