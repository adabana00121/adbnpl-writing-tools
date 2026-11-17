import React, { useState, useEffect } from "react";

// 引入功能模組 (指向 features 資料夾)
import HomePage from "./features/HomePage";
import ReceiptGenerator from "./features/ReceiptGenerator";
import WatermarkGenerator from "./features/WatermarkGenerator";

// Liquid Glass 面板折射濾鏡定義（#lg-thick）。只供 Chromium 的
// backdrop-filter: url() 使用；寬高 0 但不用 display:none，否則
// 濾鏡會失效。掛在 App 層、三頁都渲染，確保濾鏡本體永遠在 DOM
// 裡——面板的折射規則（.has-refraction .glass-panel）指著它，
// 濾鏡缺席時整條 backdrop-filter 會失效，面板就幾乎全透了。
// 膠囊的 #lg-refract 仍由 PreviewCanvas 提供，兩者不重複。
const GlassFilters = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <filter
        id="lg-thick"
        x="-20%"
        y="-20%"
        width="140%"
        height="140%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.015"
          numOctaves="2"
          seed="7"
          result="noise"
        />
        <feGaussianBlur in="noise" stdDeviation="2" result="smoothed" />
        <feDisplacementMap
          in="SourceGraphic"
          in2="smoothed"
          scale="56"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        />
        <feColorMatrix in="displaced" type="saturate" values="1.3" />
      </filter>
    </defs>
  </svg>
);

const App = () => {
  // 頁面狀態: 'home', 'receipt', 'watermark'
  const [currentPage, setCurrentPage] = useState("home");

  // 全域筆名狀態
  const [globalAuthor, setGlobalAuthor] = useState("@你的筆名");

  // 狀態：檢查樣式是否已載入 (Tailwind)
  const [isStyleLoaded, setIsStyleLoaded] = useState(false);

  // 折射偵測：只有 Chromium 能把 SVG url() 濾鏡用在 backdrop-filter 上。
  // 偵測到才在 <html> 掛 .has-refraction，讓縮放膠囊改用折射濾鏡；
  // Safari / Firefox 沒有這個 class，永遠走 blur 退路（Safari 會謊報
  // @supports，所以不能用 CSS 偵測，只能用 JS 看 window.chrome）。
  useEffect(() => {
    const brands = navigator.userAgentData?.brands || [];
    const isChromium =
      !!window.chrome || brands.some((b) => b.brand === "Chromium");
    if (isChromium) {
      document.documentElement.classList.add("has-refraction");
    }
  }, []);

  // 初始化：動態載入 Tailwind CSS CDN (僅在無本地 Tailwind 環境時啟用)
  useEffect(() => {
    if (window.tailwind || document.querySelector("style[data-tailwindcss]")) {
      setIsStyleLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.tailwindcss.com";
    script.onload = () => setTimeout(() => setIsStyleLoaded(true), 100);
    script.onerror = () => setIsStyleLoaded(true);
    document.head.appendChild(script);
  }, []);

  if (!isStyleLoaded) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}
      >
        Loading resources...
      </div>
    );
  }

  // --- 路由邏輯 ---

  if (currentPage === "receipt") {
    return (
      <>
        <GlassFilters />
        <ReceiptGenerator
          globalAuthor={globalAuthor}
          onBack={() => setCurrentPage("home")}
        />
      </>
    );
  }

  if (currentPage === "watermark") {
    return (
      <>
        <GlassFilters />
        <WatermarkGenerator
          globalAuthor={globalAuthor}
          onBack={() => setCurrentPage("home")}
        />
      </>
    );
  }

  // 預設顯示首頁
  return (
    <>
      <GlassFilters />
      <HomePage
        onSelectTool={setCurrentPage}
        globalAuthor={globalAuthor}
        setGlobalAuthor={setGlobalAuthor}
      />
    </>
  );
};

export default App;
