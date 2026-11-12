import React from "react";
import { ArrowLeft } from "lucide-react";

/**
 * 通用頁面框架
 * @param {ReactNode} sidebar - 左側側邊欄的內容
 * @param {ReactNode} children - 右側主要內容 (預覽區)
 * @param {string} title - 工具標題
 * @param {ReactNode} icon - 工具圖標 Component
 * @param {function} onBack - 返回首頁的函式
 */
const Layout = ({ sidebar, children, title, icon: Icon, onBack }) => {
  return (
    // Root: 手機版 min-h-screen (可捲動), 電腦版 h-screen (固定視窗)
    <div className="min-h-screen md:h-screen md:overflow-hidden bg-gray-50 flex flex-col md:flex-row font-sans text-gray-800">
      {/* 側邊欄容器 */}
      {/* 手機版 h-auto (自然撐開), 電腦版 h-full (填滿) */}
      <div className="w-full md:w-96 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col h-auto md:h-full shadow-lg z-30 shrink-0">
        {/* 側邊欄標題列 */}
        <div className="p-4 border-b border-gray-200 bg-indigo-600 text-white flex items-center shrink-0">
          <button
            onClick={onBack}
            className="mr-3 hover:bg-white/20 p-1 rounded transition-colors"
            title="返回首頁"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold flex items-center gap-2">
            {Icon && <Icon size={20} />}
            {title}
          </h1>
        </div>

        {/* 側邊欄內容 */}
        {/* 手機版 overflow-visible (隨頁面捲動), 電腦版 overflow-y-auto (內部捲動) */}
        <div className="flex-1 overflow-visible md:overflow-y-auto flex flex-col">
          {sidebar}
        </div>
      </div>

      {/* 右側主要內容區 (預覽區) */}
      {/* 手機版 h-[80vh] (給予足夠的預覽空間), 電腦版 flex-1 (填滿剩餘寬度) */}
      {/* 加上 relative 確保內部 absolute 定位正常 */}
      <div className="relative w-full h-[80vh] md:h-full md:flex-1 bg-gray-200">
        {children}
      </div>
    </div>
  );
};

export default Layout;
