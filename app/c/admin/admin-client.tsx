"use client";

import type { MenuItemRecord } from "../menu-items";
import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";

function randomId(): string {
  const s = Math.random().toString(36).slice(2, 8);
  return `m-${s}`;
}

export function AdminClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [seatCount, setSeatCount] = useState(15);
  const [menuItems, setMenuItems] = useState<MenuItemRecord[]>([]);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/c/config");
      const data = (await res.json()) as { error?: string; seatCount?: number; menuItems?: MenuItemRecord[] };
      if (!res.ok) {
        throw new Error(data.error ?? "불러오기 실패");
      }
      if (typeof data.seatCount === "number" && Array.isArray(data.menuItems)) {
        setSeatCount(data.seatCount);
        setMenuItems(data.menuItems.map((m) => ({ ...m })));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const updateRow = (index: number, patch: Partial<MenuItemRecord>) => {
    setMenuItems((rows) => {
      const next = [...rows];
      const row = { ...next[index], ...patch };
      if (patch.price !== undefined) {
        const n = Number(patch.price);
        row.price = Number.isFinite(n) ? Math.round(n) : 0;
      }
      next[index] = row;
      return next;
    });
    setSaved(false);
  };

  const removeRow = (index: number) => {
    setMenuItems((rows) => rows.filter((_, i) => i !== index));
    setSaved(false);
  };

  const addRow = () => {
    setMenuItems((rows) => [...rows, { id: randomId(), name: "새 메뉴", price: 5000 }]);
    setSaved(false);
  };

  const uploadFile = async (index: number, file: File) => {
    setError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/c/menu-image", { method: "POST", body: fd });
      const j = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(j.error ?? "업로드 실패");
      if (j.url) updateRow(index, { imageUrl: j.url });
    } catch (e) {
      setError(e instanceof Error ? e.message : "업로드 실패");
    }
  };

  const save = async () => {
    setError(null);
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/c/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seatCount, menuItems }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "저장 실패");
      }
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className={styles.hint}>설정을 불러오는 중…</p>;
  }

  return (
    <div className={styles.panel}>
      {error ? <p className={styles.error}>{error}</p> : null}
      {saved ? <p className={styles.saved}>저장되었습니다.</p> : null}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>좌석</h2>
        <label className={styles.field}>
          <span>좌석 수 (1~500)</span>
          <input
            type="number"
            min={1}
            max={500}
            value={seatCount}
            onChange={(e) => {
              setSeatCount(Number(e.target.value));
              setSaved(false);
            }}
          />
        </label>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>메뉴</h2>
          <button type="button" className={styles.secondaryBtn} onClick={addRow}>
            행 추가
          </button>
        </div>
        <p className={styles.hint}>
          메뉴 id는 영문·숫자·하이픈만 사용합니다. 결제·주문 URL에 쓰이므로 저장 후 바꾸면 기존 링크와 맞지 않을 수
          있습니다. 사진은 URL을 직접 넣거나 파일을 업로드하면 <code className={styles.code}>/c-menu-uploads/</code>{" "}
          경로가 자동으로 채워집니다.
        </p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>이름</th>
                <th>설명</th>
                <th>가격(원)</th>
                <th>이미지</th>
                <th aria-label="삭제" />
              </tr>
            </thead>
            <tbody>
              {menuItems.map((row, i) => (
                <tr key={`${row.id}-${i}`}>
                  <td>
                    <input
                      className={styles.cellInput}
                      value={row.id}
                      onChange={(e) => updateRow(i, { id: e.target.value })}
                      spellCheck={false}
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      value={row.name}
                      onChange={(e) => updateRow(i, { name: e.target.value })}
                    />
                  </td>
                  <td className={styles.descCell}>
                    <textarea
                      className={styles.cellTextarea}
                      rows={2}
                      placeholder="고객 팝업에 표시"
                      value={row.description ?? ""}
                      onChange={(e) =>
                        updateRow(i, { description: e.target.value ? e.target.value : undefined })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className={styles.cellInput}
                      type="number"
                      min={100}
                      value={row.price}
                      onChange={(e) => updateRow(i, { price: Number(e.target.value) })}
                    />
                  </td>
                  <td className={styles.imageCell}>
                    <input
                      className={styles.cellInput}
                      placeholder="https://… 또는 /경로"
                      value={row.imageUrl ?? ""}
                      onChange={(e) =>
                        updateRow(i, { imageUrl: e.target.value.trim() ? e.target.value : undefined })
                      }
                      spellCheck={false}
                    />
                    <label className={styles.uploadLabel}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className={styles.fileInput}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void uploadFile(i, f);
                          e.target.value = "";
                        }}
                      />
                      파일 업로드
                    </label>
                  </td>
                  <td>
                    <button type="button" className={styles.dangerBtn} onClick={() => removeRow(i)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className={styles.actions}>
        <button type="button" className={styles.primaryBtn} disabled={saving} onClick={() => void save()}>
          {saving ? "저장 중…" : "설정 저장"}
        </button>
        <button type="button" className={styles.secondaryBtn} onClick={() => void load()} disabled={saving}>
          다시 불러오기
        </button>
      </div>
    </div>
  );
}
