export const CONTAINER_WIDTH = 600;

export const LAYOUT_CONFIG = {
  "9/16": {
    headerRatio: 0.12,
    footerRatio: 0.12,
    bodyRatio: 0.76,
    paddingV: 64,
    paddingH: 72,
  },
  "3/4": {
    headerRatio: 0.15,
    footerRatio: 0.15,
    bodyRatio: 0.7,
    paddingV: 56,
    paddingH: 72,
  },
  "4/5": {
    headerRatio: 0.16,
    footerRatio: 0.16,
    bodyRatio: 0.68,
    paddingV: 52,
    paddingH: 72,
  },
  "1/1": {
    headerRatio: 0.18,
    footerRatio: 0.18,
    bodyRatio: 0.64,
    paddingV: 48,
    paddingH: 64,
  },
};

// 網站風主題專用比例覆寫（v19）：只動三個非 9:16 比例，9:16 不動，其他主題不動。
// 刊頭往下一點：刊頭區加高（3:4/4:5 各＋8px，1:1 ＋18px），讓 strip 上方留白回到與 9:16 相近的水位。
//   實測基準（v18）：strip 距卡片頂邊 9:16＝24.7px、3:4/4:5＝16.8px（餘裕只剩 0.8px）、1:1＝13.3px（被往上推 2.7px，
//   刊頭內容 103px 塞不進 108px 減 12px 上 padding 後的 96px 內容區，flex justify-end 把 strip 往上推出去）。
// 頁尾瘦身：頁尾只剩一根線＋一行落款，120/108px 大半是空的，縮到約 64–68px 還給內文（3:4 64px、4:5 67.5px、1:1 66px）。
// bodyRatio 一律由 1 − headerRatio − footerRatio 算出，分頁（useWatermarkCore）與渲染（flex-1）才會一致。
export const SITE_LAYOUT_OVERRIDES = {
  "3/4": { headerRatio: 0.16, footerRatio: 0.08 },
  "4/5": { headerRatio: 0.17, footerRatio: 0.09 },
  "1/1": { headerRatio: 0.21, footerRatio: 0.11 },
};

export const THEMES = {
  light: {
    bg: "bg-white",
    text: "text-gray-900",
    sub: "text-gray-500",
    border: "border-gray-200",
  },
  sepia: {
    bg: "bg-[#f4ecd8]",
    text: "text-[#5b4636]",
    sub: "text-[#8b7e74]",
    border: "border-[#dccfc0]",
  },
  dark: {
    bg: "bg-gray-900",
    text: "text-gray-100",
    sub: "text-gray-400",
    border: "border-gray-700",
  },
  // site：網站風特別版（paper #F5F4EE＋ink #0A0A0A），v16 取代 paper。
  // variant: "site" 時 WatermarkCard 走專屬版式（刊頭列、雙線、落款頁尾、4px 外框），
  // 字體／字級／行距鎖定（黑體內文、21px、行距 1.6），--- 渲染成 /// 分隔線。
  site: {
    bg: "bg-[#F5F4EE]",
    text: "text-[#0A0A0A]",
    sub: "text-gray-500",
    border: "border-[#0A0A0A]",
    variant: "site",
  },
};

export const QR_COLORS = {
  light: "#111827",
  sepia: "#5b4636",
  dark: "#f3f4f6",
  site: "#0A0A0A",
};

export const FONT_STYLES = {
  // 修改：移除未載入的 Zen Maru Gothic 與 M PLUS Rounded 1c，只保留有效的丸子圓體與系統後備
  rounded: {
    fontFamily:
      '"MarukoGothicCJKtc-Regular", "Microsoft JhengHei", "Arial Rounded MT Bold", sans-serif',
  },
  sans: {
    fontFamily:
      '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", "Arial", sans-serif',
  },
  serif: {
    fontFamily:
      '"Noto Serif TC", "Songti TC", "PMingLiU", "New York", "Times New Roman", serif',
  },
};

export const DEFAULT_INSTRUCTION = `歡迎使用文手排版助手！\n\n使用說明：\n1. 在左側輸入您的標題與筆名。\n2. 貼上您的小說內文，系統會自動分頁。\n3. 支援<b>粗體</b>與<i>斜體</i>編輯，請選取文字後使用上方按鈕。\n4. 選擇適合的版面比例 (手機 9:16 / 社群 4:5 / 貼文 3:4 / 正方 1:1)。\n5. 最後點擊「打包全部」下載高畫質圖片！\n\n💡 核心升級：\n本工具採用「滿版流體排版」引擎。\n- 系統會像倒水一樣，將文字自然填滿版面。\n- <b>粗體</b>與<i>斜體</i>樣式現在可以完美跨頁，不會中斷。\n- 系統會自動偵測避頭點，並將未閉合的樣式標籤帶到下一頁。\n\n（您可以直接刪除這段文字，開始創作！）`;
