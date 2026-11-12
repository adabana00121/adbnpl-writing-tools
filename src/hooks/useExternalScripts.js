import { useState, useEffect } from "react";

/**
 * 用於動態載入外部 CDN 腳本的 Custom Hook
 * @param {string | string[]} src - 單一腳本網址或腳本網址陣列
 * @returns {boolean} isLoaded - 是否所有腳本都已載入完成
 */
const useExternalScripts = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 確保 src 是陣列
    const sources = Array.isArray(src) ? src : [src];

    // 如果沒有傳入任何來源，直接視為完成
    if (sources.length === 0) {
      setIsLoaded(true);
      return;
    }

    let loadedCount = 0;
    const total = sources.length;

    // 定義單一腳本載入函式
    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        // 1. 檢查是否已經存在於 DOM 中 (避免重複載入)
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }

        // 2. 建立 script 標籤
        const script = document.createElement("script");
        script.src = url;
        script.crossOrigin = "anonymous"; // 對於 html-to-image 來說很重要

        // 3. 監聽載入完成
        script.onload = () => resolve();
        script.onerror = () => {
          console.error(`Script load error: ${url}`);
          // 即使失敗也 resolve，避免卡死整個流程，但在實際專案可能需要更細緻的錯誤處理
          resolve();
        };

        document.head.appendChild(script);
      });
    };

    // 依序或平行載入所有腳本
    Promise.all(sources.map(loadScript))
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error("Error loading scripts:", err);
        setIsLoaded(true); // 發生錯誤也設為 true 以免畫面卡在 Loading
      });
  }, [JSON.stringify(src)]); // 當 src 陣列內容改變時重新執行

  return isLoaded;
};

export default useExternalScripts;
