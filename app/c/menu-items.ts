export type MenuItemRecord = {
  id: string;
  name: string;
  price: number;
  /** http(s) URL 또는 `/로 시작하는 사이트 내 경로(예: 업로드 후 `/c-menu-uploads/...`) */
  imageUrl?: string;
  /** 메뉴 상세 설명(팝업 등) */
  description?: string;
};

/** 주문 수량이 반영된 한 줄 */
export type OrderedLineItem = MenuItemRecord & { quantity: number };

export const DEFAULT_SEAT_COUNT = 15;

export const DEFAULT_MENU_ITEMS: MenuItemRecord[] = [
  { id: "set-a", name: "세트 A", price: 12000, description: "메인·반찬·음료가 포함된 구성입니다." },
  { id: "set-b", name: "세트 B", price: 15000, description: "프리미엄 재료로 구성된 세트입니다." },
  { id: "single", name: "단품", price: 8000, description: "원하는 메인 한 가지를 선택하세요." },
  { id: "side", name: "사이드", price: 4000, description: "곁들임 메뉴입니다." },
  { id: "drink", name: "음료", price: 2500, description: "탄산·주스·커피 등에서 선택 가능합니다." },
];
