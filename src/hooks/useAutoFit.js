import { useState, useEffect } from "react";

/**
 * 自動計算縮放比例的 Hook
 * @param {React.RefObject} containerRef - 外部容器的 Ref (灰色背景區)
 * @param {number} contentWidth - 內容的原始寬度
 * @param {number} contentHeight - 內容的原始高度
 * @param {number} padding - 容器預留的邊距 (預設 96px)
 * @returns {number} scale - 計算出的縮放比例
 */
const useAutoFit = (
  containerRef,
  contentWidth,
  contentHeight,
  padding = 96
) => {
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // 計算可用空間
      const availableWidth = Math.max(300, containerWidth - padding);
      const availableHeight = Math.max(300, containerHeight - padding);

      // 計算寬高比例
      const scaleX = availableWidth / contentWidth;
      const scaleY = availableHeight / contentHeight;

      // 取較小者以確保內容完全放入 (Fit Inside)
      let newScale = Math.min(scaleX, scaleY);

      // 設定合理的上下限 (避免過大或過小)
      newScale = Math.min(Math.max(newScale, 0.3), 1.5);

      setScale(newScale);
    };

    // 初始計算
    calculateScale();

    // 使用 ResizeObserver 監聽容器變化 (比 window.resize 更準確且效能更好)
    const resizeObserver = new ResizeObserver(() => {
      calculateScale();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, contentWidth, contentHeight, padding]);

  return scale;
};

export default useAutoFit;
