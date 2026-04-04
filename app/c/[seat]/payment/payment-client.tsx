"use client";

import type { OrderedLineItem } from "../../menu-items";
import styles from "./page.module.css";
import { TossPaymentWidget } from "./toss-payment-widget";

type Props = {
  seat: number;
  lineItems: OrderedLineItem[];
};

export function PaymentClient({ seat, lineItems }: Props) {
  const total = lineItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsQuery = lineItems.map((i) => `${i.id}:${i.quantity}`).join(",");
  const orderName =
    lineItems.length === 1
      ? `${lineItems[0].name}${lineItems[0].quantity > 1 ? ` ×${lineItems[0].quantity}` : ""}`
      : `${lineItems[0].name} 외 ${lineItems.length - 1}종`;

  return (
    <div className={styles.layout}>
      <section className={styles.summary} aria-labelledby="order-heading">
        <h2 id="order-heading" className={styles.sectionTitle}>
          주문 요약
        </h2>
        <ul className={styles.lineList}>
          {lineItems.map((item) => (
            <li key={item.id} className={styles.lineRow}>
              <span className={styles.lineRowMain}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt=""
                    className={styles.lineThumb}
                    width={44}
                    height={44}
                    loading="lazy"
                  />
                ) : null}
                <span>
                  {item.name}
                  {item.quantity > 1 ? (
                    <span className={styles.lineQty}> ×{item.quantity}</span>
                  ) : null}
                </span>
              </span>
              <span>{(item.price * item.quantity).toLocaleString("ko-KR")}원</span>
            </li>
          ))}
        </ul>
        <div className={styles.totalRow}>
          <span>합계</span>
          <span className={styles.totalAmount}>{total.toLocaleString("ko-KR")}원</span>
        </div>
      </section>

      <section className={styles.form} aria-labelledby="pay-heading">
        <h2 id="pay-heading" className={styles.sectionTitle}>
          결제 수단 선택
        </h2>
        <TossPaymentWidget seat={seat} total={total} orderName={orderName} itemsQuery={itemsQuery} />
      </section>
    </div>
  );
}
