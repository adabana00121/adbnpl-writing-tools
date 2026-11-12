import React, { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import useAutoFit from "../../hooks/useAutoFit"; // 記得要確保 useAutoFit.js 已經存在

/**
 * 通用預覽畫布元件
 * 負責：灰色背景、捲動條、縮放控制、內容置中
 */
const PreviewCanvas = ({
  children,
  contentWidth = 600,
  contentHeight = 800,
}) => {
  const containerRef = useRef(null);

  // 1. 使用 Hook 自動計算 "適合視窗大小" 的比例
  const autoScale = useAutoFit(containerRef, contentWidth, contentHeight);

  // 2. 內部狀態：記錄使用者是否有手動按過縮放 (覆蓋自動值)
  const [manualScale, setManualScale] = useState(null);

  // 3. 實際使用的比例：如果有手動調整過就用手動的，否則用自動計算的
  const scale = manualScale !== null ? manualScale : autoScale;

  // 當自動比例因為視窗改變而變化時，重置手動比例，讓它回歸自動適應
  useEffect(() => {
    setManualScale(null);
  }, [autoScale]);

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-200 relative flex flex-col overflow-hidden h-full"
    >
      {/* --- 右上角縮放控制列 --- */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 bg-white p-1 rounded-lg shadow border border-gray-200">
        <button
          onClick={() =>
            setManualScale((prev) => Math.max(0.3, (prev || scale) - 0.1))
          }
          className="p-2 hover:bg-gray-100 rounded text-gray-600"
          title="縮小"
        >
          <ZoomOut size={16} />
        </button>
        <span className="flex items-center text-xs font-mono w-12 justify-center select-none">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() =>
            setManualScale((prev) => Math.min(2.0, (prev || scale) + 0.1))
          }
          className="p-2 hover:bg-gray-100 rounded text-gray-600"
          title="放大"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* --- 捲動視窗 --- */}
      <div className="flex-1 overflow-auto custom-scrollbar relative flex">
        {/* m-auto 確保內容小於視窗時垂直水平置中；p-12 確保有留白 */}
        <div className="m-auto p-12">
          {/* 尺寸佔位層：撐開捲動範圍 */}
          <div
            style={{
              width: `${contentWidth * scale}px`,
              height: `${contentHeight * scale}px`,
              transition: "width 0.2s, height 0.2s",
            }}
          >
            {/* 內容縮放層：實際進行 transform 的地方 */}
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                transition: "transform 0.2s",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewCanvas;
