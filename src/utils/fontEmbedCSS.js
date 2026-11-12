// 字型內嵌 CSS 快取：匯出 PNG 時，modern-screenshot 需要把字型檔案以 base64 塞進圖片，
// 否則字體度量不同會換行跑位。但每次匯出都重抓全部字型檔案非常慢（Noto TC 三個字重
// 共 324 個子集、本地圓體單檔 12.7MB），批次打包時每頁還會重做一次。
// 這個模組把「目前選用字族」的已內嵌 CSS 建好並快取起來，第一次匯出建一次，之後直接重用。
// 傳給 domToPng 的 font.cssText 會讓套件跳過掃描與抓檔（見 modern-screenshot embedWebFont）。

const GOOGLE_FONTS_CSS_URLS = {
  sans: "https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap",
  serif: "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;700&display=swap",
};

const cache = new Map();

async function fetchAsDataURL(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// 把 Google Fonts CSS 裡的全部 woff2 網址換成 data URI，保留原本的 @font-face 規則
//（字重、unicode-range 都不動，渲染結果與套件自己內嵌完全一致）。
async function buildGoogleFontsCssText(cssUrl) {
  const response = await fetch(cssUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${cssUrl}: ${response.status}`);
  }
  const css = await response.text();
  const urls = [
    ...new Set(
      [...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1])
    ),
  ];
  const entries = await Promise.all(
    urls.map(async (url) => [url, await fetchAsDataURL(url)])
  );
  const lookup = new Map(entries);
  return css.replace(
    /url\((https:[^)]+)\)/g,
    (match, url) => `url(${lookup.get(url)})`
  );
}

async function buildLocalFontCssText() {
  const fontUrl = `${process.env.PUBLIC_URL}/fonts/MarukoGothicCJKtc-Regular.woff2`;
  const dataUrl = await fetchAsDataURL(fontUrl);
  return `@font-face { font-family: 'MarukoGothicCJKtc-Regular'; src: url(${dataUrl}) format('woff2'); font-display: swap; }`;
}

export function getFontCssText(fontKey) {
  if (!cache.has(fontKey)) {
    const promise = (async () => {
      if (fontKey === "rounded") return buildLocalFontCssText();
      const cssUrl = GOOGLE_FONTS_CSS_URLS[fontKey];
      if (!cssUrl) throw new Error(`Unknown font key: ${fontKey}`);
      return buildGoogleFontsCssText(cssUrl);
    })();
    // 建置失敗時清掉快取，讓下次匯出可以重試（呼叫端會退回套件預設內嵌流程）
    promise.catch(() => cache.delete(fontKey));
    cache.set(fontKey, promise);
  }
  return cache.get(fontKey);
}
