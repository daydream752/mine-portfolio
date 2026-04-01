"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import styles from "../page.module.css";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export default function BCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("b-cart");
    if (raw) setCart(JSON.parse(raw) as CartItem[]);
  }, []);

  useEffect(() => {
    localStorage.setItem("b-cart", JSON.stringify(cart));
  }, [cart]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  function remove(id: string) {
    setCart((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.card}>
          <h1 style={{ marginTop: 0 }}>장바구니 페이지</h1>
          {cart.length === 0 ? (
            <p>장바구니가 비어 있습니다.</p>
          ) : (
            <>
              <ul className={styles.cartList}>
                {cart.map((c) => (
                  <li key={c.id} className={styles.cartItem}>
                    <div>
                      <strong>{c.name}</strong>
                      <p style={{ margin: "4px 0 0", color: "#7f6f62" }}>
                        {c.price.toLocaleString()}원 x {c.quantity}
                      </p>
                    </div>
                    <button className={styles.removeBtn} onClick={() => remove(c.id)}>
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
              <p className={styles.cartTotal}>합계: {total.toLocaleString()}원</p>
              <button className={styles.clearBtn} onClick={() => setCart([])}>
                장바구니 비우기
              </button>
            </>
          )}
        </section>

        <p style={{ marginTop: 16 }}>
          <Link href="/b" className={styles.link}>
            B 쇼핑몰로 돌아가기
          </Link>
        </p>
      </div>
    </main>
  );
}
