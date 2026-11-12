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
  "1/1": {
    headerRatio: 0.18,
    footerRatio: 0.18,
    bodyRatio: 0.64,
    paddingV: 48,
    paddingH: 64,
  },
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
  midnight: {
    bg: "bg-[#1a202c]",
    text: "text-slate-200",
    sub: "text-slate-500",
    border: "border-slate-700",
  },
};

export const QR_COLORS = {
  light: "#111827",
  sepia: "#5b4636",
  dark: "#f3f4f6",
  midnight: "#e2e8f0",
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

export const DEFAULT_INSTRUCTION = `歡迎使用文手排版助手！\n\n使用說明：\n1. 在左側輸入您的標題與筆名。\n2. 貼上您的小說內文，系統會自動分頁。\n3. 支援<b>粗體</b>與<i>斜體</i>編輯，請選取文字後使用上方按鈕。\n4. 選擇適合的版面比例 (手機 9:16 / 貼文 3:4 / 正方 1:1)。\n5. 最後點擊「打包全部」下載高畫質圖片！\n\n💡 核心升級：\n本工具採用「滿版流體排版」引擎。\n- 系統會像倒水一樣，將文字自然填滿版面。\n- <b>粗體</b>與<i>斜體</i>樣式現在可以完美跨頁，不會中斷。\n- 系統會自動偵測避頭點，並將未閉合的樣式標籤帶到下一頁。\n\n（您可以直接刪除這段文字，開始創作！）`;
