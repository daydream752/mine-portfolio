"use client";

import type { OrderRecord } from "@/lib/c-orders";
import { useCallback, useEffect, useState } from "react";
import styles from "./orders.module.css";

function formatWhen(iso: string): string {
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function OrdersClient() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/c/orders");
      const data = (await res.json()) as OrderRecord[] | { error?: string };
      if (!res.ok) {
        throw new Error((data as { error?: string }).error ?? "불러오기 실패");
      }
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const complete = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/c/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "처리 실패");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "처리 실패");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className={styles.hint}>주문을 불러오는 중…</p>;
  }

  return (
    <div className={styles.panel}>
      {error ? <p className={styles.error}>{error}</p> : null}
      <div className={styles.toolbar}>
        <button type="button" className={styles.secondaryBtn} onClick={() => void load()}>
          새로고침
        </button>
      </div>
      {orders.length === 0 ? (
        <p className={styles.empty}>아직 저장된 주문이 없습니다.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>접수 시각</th>
                <th>좌석</th>
                <th>주문 내용</th>
                <th>금액</th>
                <th>결제</th>
                <th>상태</th>
                <th aria-label="처리" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={o.status === "completed" ? styles.rowDone : undefined}>
                  <td>{formatWhen(o.createdAt)}</td>
                  <td>{o.seat}번</td>
                  <td className={styles.summaryCell}>{o.summary}</td>
                  <td>{o.amount.toLocaleString("ko-KR")}원</td>
                  <td>{o.method}</td>
                  <td>
                    {o.status === "completed" ? (
                      <span className={styles.badgeDone}>완료</span>
                    ) : (
                      <span className={styles.badgePending}>접수</span>
                    )}
                  </td>
                  <td>
                    {o.status === "pending" ? (
                      <button
                        type="button"
                        className={styles.completeBtn}
                        disabled={busyId === o.id}
                        onClick={() => void complete(o.id)}
                      >
                        {busyId === o.id ? "처리 중…" : "완료 처리"}
                      </button>
                    ) : (
                      <span className={styles.doneMeta}>
                        {o.completedAt ? formatWhen(o.completedAt) : "—"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
