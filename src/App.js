import React, { useState, useEffect } from "react";

// 引入功能模組 (指向 features 資料夾)
import HomePage from "./features/HomePage";
import ReceiptGenerator from "./features/ReceiptGenerator";
import WatermarkGenerator from "./features/WatermarkGenerator";

// v9：面板折射改由 utils/lensRefraction.js 依面板尺寸生成 SDF 位移圖
// （#lg-thick 噪點位移已退役）；膠囊的 #lg-refract 仍由 PreviewCanvas 提供。
import { initLensRefraction } from "./utils/lensRefraction";

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
    // v9：Chromium 上再為 .glass-panel 掛上透鏡位移圖（非 Chromium 自動不做）
    initLensRefraction();
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
      <HomePage
        onSelectTool={setCurrentPage}
        globalAuthor={globalAuthor}
        setGlobalAuthor={setGlobalAuthor}
      />
    </>
  );
};

export default App;
