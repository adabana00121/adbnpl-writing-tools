import React, { useState, useEffect } from "react";

// 引入功能模組 (指向 features 資料夾)
import HomePage from "./features/HomePage";
import ReceiptGenerator from "./features/ReceiptGenerator";
import WatermarkGenerator from "./features/WatermarkGenerator";

// 尚未實作的功能先用簡單的 Placeholder 代替
// (等到之後開發 CommissionForm 時再替換掉)
const CommissionForm = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    <div className="glass-panel text-center rounded-3xl px-10 py-8">
      <h2 className="text-2xl font-bold mb-2">需求表單</h2>
      <p className="mb-4">功能開發中...</p>
      <button
        onClick={onBack}
        className="glass-btn-solid px-4 py-2 bg-indigo-600 text-white rounded-full"
      >
        返回
      </button>
    </div>
  </div>
);

const CharacterCard = ({ onBack }) => (
  <div className="min-h-screen flex items-center justify-center text-gray-500">
    <div className="glass-panel text-center rounded-3xl px-10 py-8">
      <h2 className="text-2xl font-bold mb-2">角色設定卡</h2>
      <p className="mb-4">功能開發中...</p>
      <button
        onClick={onBack}
        className="glass-btn-solid px-4 py-2 bg-indigo-600 text-white rounded-full"
      >
        返回
      </button>
    </div>
  </div>
);

const App = () => {
  // 頁面狀態: 'home', 'receipt', 'watermark', 'commission-form', 'character-card'
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
      <ReceiptGenerator
        globalAuthor={globalAuthor}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "watermark") {
    return (
      <WatermarkGenerator
        globalAuthor={globalAuthor}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "commission-form") {
    return (
      <CommissionForm
        globalAuthor={globalAuthor}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  if (currentPage === "character-card") {
    return (
      <CharacterCard
        globalAuthor={globalAuthor}
        onBack={() => setCurrentPage("home")}
      />
    );
  }

  // 預設顯示首頁
  return (
    <HomePage
      onSelectTool={setCurrentPage}
      globalAuthor={globalAuthor}
      setGlobalAuthor={setGlobalAuthor}
    />
  );
};

export default App;
