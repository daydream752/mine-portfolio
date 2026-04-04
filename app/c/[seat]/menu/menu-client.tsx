"use client";

import type { MenuItemRecord } from "../../menu-items";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Props = {
  seat: number;
  menuItems: MenuItemRecord[];
};

export function MenuClient({ seat, menuItems }: Props) {
  const router = useRouter();
  /** 메뉴 id → 수량 (0이면 장바구니에 없음) */
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [detailId, setDetailId] = useState<string | null>(null);

  const setQty = useCallback((id: string, next: number) => {
    const q = Math.max(0, Math.min(999, next));
    setQuantities((prev) => {
      const n = { ...prev };
      if (q === 0) {
        delete n[id];
      } else {
        n[id] = q;
      }
      return n;
    });
  }, []);

  const closeDetail = useCallback(() => setDetailId(null), []);

  useEffect(() => {
    if (!detailId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailId, closeDetail]);

  useEffect(() => {
    if (detailId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [detailId]);

  const total = useMemo(
    () =>
      menuItems.reduce((sum, it) => {
        const q = quantities[it.id] ?? 0;
        return sum + q * it.price;
      }, 0),
    [menuItems, quantities]
  );

  const goPayment = () => {
    const parts = Object.entries(quantities)
      .filter(([, q]) => q > 0)
      .map(([id, q]) => `${id}:${q}`);
    if (parts.length === 0) return;
    router.push(`/c/${seat}/payment?items=${encodeURIComponent(parts.join(","))}`);
  };

  const detailItem = detailId ? menuItems.find((m) => m.id === detailId) : null;
  const detailQty = detailItem ? quantities[detailItem.id] ?? 0 : 0;

  return (
    <>
      <ul className={styles.menuGrid} aria-label="메뉴 목록">
        {menuItems.map((item) => {
          const q = quantities[item.id] ?? 0;
          return (
            <li key={item.id}>
              <button
                type="button"
                className={`${styles.menuCard} ${q > 0 ? styles.menuCardSelected : ""}`}
                onClick={() => setDetailId(item.id)}
                aria-label={`${item.name} 상세 보기`}
              >
                {q > 0 ? <span className={styles.qtyBadge}>{q}</span> : null}
                {item.imageUrl ? (
                  <span className={styles.menuImageWrap}>
                    <img
                      src={item.imageUrl}
                      alt=""
                      className={styles.menuImage}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                ) : (
                  <span className={styles.menuImagePlaceholder} aria-hidden />
                )}
                <span className={styles.menuCardBody}>
                  <span className={styles.menuName}>{item.name}</span>
                  <span className={styles.menuPrice}>{item.price.toLocaleString("ko-KR")}원</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {detailItem ? (
        <div className={styles.modalBackdrop} onClick={closeDetail} role="presentation">
          <div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="menu-detail-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.modalClose} onClick={closeDetail} aria-label="닫기">
              ×
            </button>
            {detailItem.imageUrl ? (
              <div className={styles.modalImageWrap}>
                <img src={detailItem.imageUrl} alt="" className={styles.modalImage} />
              </div>
            ) : (
              <div className={styles.modalImagePlaceholder} aria-hidden />
            )}
            <div className={styles.modalBody}>
              <h2 id="menu-detail-title" className={styles.modalTitle}>
                {detailItem.name}
              </h2>
              <p className={styles.modalPrice}>{detailItem.price.toLocaleString("ko-KR")}원</p>
              <p className={styles.modalDesc}>
                {detailItem.description?.trim()
                  ? detailItem.description
                  : "등록된 설명이 없습니다."}
              </p>
              <div className={styles.modalQtyRow}>
                <span className={styles.modalQtyLabel}>수량</span>
                <div className={styles.modalQtyControls}>
                  <button
                    type="button"
                    className={styles.modalQtyBtn}
                    aria-label="수량 한 개 빼기"
                    disabled={detailQty <= 0}
                    onClick={() => setQty(detailItem.id, detailQty - 1)}
                  >
                    −
                  </button>
                  <span className={styles.modalQtyValue} aria-live="polite">
                    {detailQty}
                  </span>
                  <button
                    type="button"
                    className={styles.modalQtyBtn}
                    aria-label="수량 한 개 더하기"
                    disabled={detailQty >= 999}
                    onClick={() => setQty(detailItem.id, detailQty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <button type="button" className={styles.modalDone} onClick={closeDetail}>
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <footer className={styles.menuFooter}>
        <div className={styles.menuFooterSum}>
          <span className={styles.menuFooterLabel}>선택 합계</span>
          <span className={styles.menuFooterTotal}>{total.toLocaleString("ko-KR")}원</span>
        </div>
        <button
          type="button"
          className={styles.payNavButton}
          disabled={total === 0}
          onClick={goPayment}
        >
          결제하기
        </button>
      </footer>
    </>
  );
}
