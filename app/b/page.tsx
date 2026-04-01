"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import styles from "./page.module.css";

type Item = {
  id: string;
  name: string;
  category: string;
  price: number;
  badge?: string;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const categories = ["전체", "신상품", "베스트", "아우터", "상의", "하의", "가방"];

const items: Item[] = [
  { id: "c1", name: "데일리 트렌치 코트", category: "아우터", price: 129000, badge: "NEW" },
  { id: "c2", name: "소프트 니트 탑", category: "상의", price: 49000 },
  { id: "c3", name: "와이드 슬랙스", category: "하의", price: 59000, badge: "BEST" },
  { id: "c4", name: "미니 크로스백", category: "가방", price: 69000 },
  { id: "c5", name: "오버핏 셔츠", category: "상의", price: 54000 },
  { id: "c6", name: "플리츠 스커트", category: "하의", price: 62000 },
];

export default function BPage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loginMsg, setLoginMsg] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("b-cart");
    if (raw) setCart(JSON.parse(raw) as CartItem[]);
  }, []);

  useEffect(() => {
    localStorage.setItem("b-cart", JSON.stringify(cart));
  }, [cart]);

  function submitLogin(e: FormEvent) {
    e.preventDefault();
    if (id === "demo_user" && pw === "demo1234") {
      setLoginMsg("로그인 성공 (데모)");
      return;
    }
    setLoginMsg("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  const filteredItems = items.filter((item) => {
    const byCategory =
      selectedCategory === "전체"
        ? true
        : selectedCategory === "베스트"
          ? item.badge === "BEST"
          : selectedCategory === "신상품"
            ? item.badge === "NEW"
            : item.category === selectedCategory;

    if (!byCategory) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.trim().toLowerCase();
    return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
  });

  function addToCart(item: Item) {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
        return next;
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  }

  const cartCount = cart.reduce((sum, x) => sum + x.quantity, 0);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <h1>Dream Closet</h1>
          <p>의상 쇼핑몰 샘플 페이지</p>
          <div className={styles.heroActions}>
            <button aria-label="검색" onClick={() => setOpenSearch((prev) => !prev)}>
              검색
            </button>
            <button onClick={() => setOpenLogin(true)}>로그인</button>
            <Link href="/b/cart" className={styles.cartLink}>
              장바구니 ({cartCount})
            </Link>
          </div>
          {openSearch && (
            <div className={styles.searchWrap}>
              <input
                className={styles.searchInput}
                placeholder="상품명/카테고리 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.searchResetBtn} onClick={() => setSearchQuery("")}>
                초기화
              </button>
            </div>
          )}
        </section>

        <section className={styles.card}>
          <h2>카테고리</h2>
          <div className={styles.categories}>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={selectedCategory === c ? styles.categoryActive : styles.categoryBtn}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2>상품 리스트</h2>
          <p style={{ marginTop: 0, color: "#7f6f62" }}>
            선택 카테고리: <strong>{selectedCategory}</strong> / 검색어:{" "}
            <strong>{searchQuery.trim() ? searchQuery : "없음"}</strong> ({filteredItems.length}개)
          </p>
          <div className={styles.grid}>
            {filteredItems.map((item) => (
              <article key={item.id} className={styles.productCard}>
                <div className={styles.thumb}>상품 이미지</div>
                <p className={styles.meta}>{item.category}</p>
                <h3>{item.name}</h3>
                {item.badge ? <span className={styles.badge}>{item.badge}</span> : <span className={styles.badgePlaceholder}>.</span>}
                <p className={styles.price}>{item.price.toLocaleString()}원</p>
                <button className={styles.cartBtn} onClick={() => addToCart(item)}>
                  장바구니 담기
                </button>
              </article>
            ))}
          </div>
          {filteredItems.length === 0 && <p className={styles.emptyText}>검색 결과가 없습니다.</p>}
        </section>

        <p style={{ marginTop: 16 }}>
          <Link href="/" className={styles.link}>
            메인으로 돌아가기
          </Link>
        </p>
      </div>

      {openLogin && (
        <div className={styles.modalOverlay} onClick={() => setOpenLogin(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginTop: 0 }}>로그인 페이지</h2>
            <form onSubmit={submitLogin} className={styles.loginForm}>
              <input
                placeholder="아이디"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
              />
              <input
                placeholder="비밀번호"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />
              <button type="submit">로그인</button>
            </form>
            <div className={styles.demoAccount}>
              <p style={{ margin: 0 }}>
                테스트 계정: <strong>demo_user</strong>
              </p>
              <p style={{ margin: "4px 0 0" }}>
                테스트 비밀번호: <strong>demo1234</strong>
              </p>
            </div>
            {loginMsg && <p style={{ marginTop: 10 }}>{loginMsg}</p>}
          </div>
        </div>
      )}
    </main>
  );
}
