import { useState, useCallback } from "react";
// 改用 modern-screenshot
import { domToPng } from "modern-screenshot";

/**
 * 圖片生成與下載 Hook (Modern Screenshot 版)
 */
const useDownloadImage = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * 執行下載
   */
  const downloadImage = useCallback(
    async (ref, fileName, options = {}, customConfig = {}) => {
      if (!ref.current) return;

      setIsGenerating(true);

      try {
        // 稍微延遲以確保 UI 更新
        await new Promise((resolve) => setTimeout(resolve, 50));

        const { width, height } = customConfig;

        // 若呼叫端提供了預建的字型 CSS（第一次匯出建好後快取），直接帶上，
        // 套件會跳過掃描與重抓字型；建置失敗時退回預設行為（慢，但保證能匯出）
        let fontOption = {};
        if (options.fontCssText) {
          try {
            const cssText = await options.fontCssText;
            if (cssText) fontOption = { font: { cssText } };
          } catch (err) {
            console.warn(
              "Font cssText unavailable, falling back to default font embedding:",
              err
            );
          }
        }

        // modern-screenshot 的 API 很類似
        const dataUrl = await domToPng(ref.current, {
          scale: options.pixelRatio || 2, // 它是用 scale 參數
          width: width || ref.current.offsetWidth,
          height: height || ref.current.offsetHeight,
          quality: options.quality !== undefined ? options.quality : 1.0,
          ...fontOption,
          // style 屬性它也支援
          style: {
            transform: "none",
            margin: 0,
            ...options.style,
          },
          // 它也有類似 skipFonts 的選項，或者是 font 相關的設定
          // 如果要保留字型，通常不需要特別設 skip
          // 但我們可以嘗試看看它的預設行為是否比 html-to-image 聰明

          // 注意：modern-screenshot 對於 filter 的處理可能不同
        });

        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Image generation failed:", err);
        alert("圖片生成失敗，請檢查瀏覽器相容性。");
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  return {
    isGenerating,
    downloadImage,
  };
};

export default useDownloadImage;
