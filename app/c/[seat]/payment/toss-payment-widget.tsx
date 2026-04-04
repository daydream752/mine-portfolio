"use client";

import {
  ANONYMOUS,
  loadTossPayments,
  type TossPaymentsWidgets,
  type WidgetAgreementWidget,
  type WidgetPaymentMethodWidget,
} from "@tosspayments/tosspayments-sdk";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

async function safeDestroyAgreement(w: WidgetAgreementWidget | null) {
  if (!w) return;
  try {
    await w.destroy();
  } catch {
    /* 이미 제거됨 */
  }
}

async function safeDestroyPaymentMethods(w: WidgetPaymentMethodWidget | null) {
  if (!w) return;
  try {
    await w.destroy();
  } catch {
    /* 이미 제거됨 */
  }
}

type Props = {
  seat: number;
  total: number;
  orderName: string;
  itemsQuery: string;
};

export function TossPaymentWidget({ seat, total, orderName, itemsQuery }: Props) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? "";
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const paymentMethodsWidgetRef = useRef<WidgetPaymentMethodWidget | null>(null);
  const agreementWidgetRef = useRef<WidgetAgreementWidget | null>(null);
  const initKeyRef = useRef(0);
  const totalRef = useRef(total);
  totalRef.current = total;

  useEffect(() => {
    if (!clientKey) {
      setError("NEXT_PUBLIC_TOSS_CLIENT_KEY 환경 변수를 설정하세요. (토스 개발자센터 테스트 키 사용 가능)");
      return;
    }

    const runId = ++initKeyRef.current;
    let cancelled = false;

    async function init() {
      setError(null);
      setReady(false);
      try {
        /* 이전 인스턴스 제거 — 결제수단/약관 위젯은 전역에서 하나만 허용 */
        await safeDestroyAgreement(agreementWidgetRef.current);
        agreementWidgetRef.current = null;
        await safeDestroyPaymentMethods(paymentMethodsWidgetRef.current);
        paymentMethodsWidgetRef.current = null;
        widgetsRef.current = null;

        const tossPayments = await loadTossPayments(clientKey);
        if (cancelled || runId !== initKeyRef.current) return;

        const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
        await widgets.setAmount({ currency: "KRW", value: totalRef.current });
        if (cancelled || runId !== initKeyRef.current) return;

        const pmw = await widgets.renderPaymentMethods({
          selector: "#c-payment-method",
          variantKey: "DEFAULT",
        });
        if (cancelled || runId !== initKeyRef.current) {
          await safeDestroyPaymentMethods(pmw);
          return;
        }
        paymentMethodsWidgetRef.current = pmw;

        const aw = await widgets.renderAgreement({
          selector: "#c-payment-agreement",
          variantKey: "AGREEMENT",
        });
        if (cancelled || runId !== initKeyRef.current) {
          await safeDestroyAgreement(aw);
          await safeDestroyPaymentMethods(pmw);
          paymentMethodsWidgetRef.current = null;
          return;
        }
        agreementWidgetRef.current = aw;
        widgetsRef.current = widgets;
        setReady(true);
      } catch (e) {
        if (cancelled || runId !== initKeyRef.current) return;
        setError(e instanceof Error ? e.message : "결제 UI를 불러오지 못했습니다.");
      }
    }

    void init();

    return () => {
      cancelled = true;
      void (async () => {
        await safeDestroyAgreement(agreementWidgetRef.current);
        agreementWidgetRef.current = null;
        await safeDestroyPaymentMethods(paymentMethodsWidgetRef.current);
        paymentMethodsWidgetRef.current = null;
        widgetsRef.current = null;
      })();
    };
  }, [clientKey]);

  useEffect(() => {
    const w = widgetsRef.current;
    if (!w || !ready) return;
    void w.setAmount({ currency: "KRW", value: total });
  }, [total, ready]);

  const requestPayment = useCallback(async () => {
    const widgets = widgetsRef.current;
    if (!widgets) return;
    const origin = window.location.origin;
    const orderId = `c-seat${seat}-${crypto.randomUUID()}`;
    await widgets.requestPayment({
      orderId,
      orderName,
      successUrl: `${origin}/c/${seat}/payment/success?items=${encodeURIComponent(itemsQuery)}`,
      failUrl: `${origin}/c/${seat}/payment/fail?items=${encodeURIComponent(itemsQuery)}`,
      customerName: "테이블 주문",
    });
  }, [seat, orderName, itemsQuery]);

  if (error) {
    return <p className={styles.tossError}>{error}</p>;
  }

  return (
    <div className={styles.tossSection}>
      <p className={styles.tossNote}>
        토스페이먼츠 결제창에서 <strong>카드</strong> 또는 <strong>계좌이체</strong>(퀵계좌이체) 등을 선택할 수
        있습니다. 계좌이체 시 은행앱 목록에서 <strong>카카오뱅크</strong> 등 원하는 은행을 고르시면 됩니다.
      </p>
      <div id="c-payment-method" className={styles.tossMount} />
      <div id="c-payment-agreement" className={styles.tossMount} />
      <button type="button" className={styles.payButton} disabled={!ready} onClick={() => void requestPayment()}>
        {total.toLocaleString("ko-KR")}원 결제하기
      </button>
    </div>
  );
}
