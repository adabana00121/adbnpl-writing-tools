import { useState, useEffect, useRef } from "react";

// 輔助函式：自動閉合 HTML 標籤
const autoCloseTags = (html) => {
  let fixed = html;
  const bCount = (html.match(/<b>/g) || []).length;
  const bCloseCount = (html.match(/<\/b>/g) || []).length;
  const iCount = (html.match(/<i>/g) || []).length;
  const iCloseCount = (html.match(/<\/i>/g) || []).length;
  if (iCount > iCloseCount) fixed += "</i>";
  if (bCount > bCloseCount) fixed += "</b>";
  return fixed;
};

// 輔助函式：取得未閉合的標籤
const getOpenTags = (html) => {
  let tags = "";
  const bCount = (html.match(/<b>/g) || []).length;
  const bCloseCount = (html.match(/<\/b>/g) || []).length;
  if (bCount > bCloseCount) tags += "<b>";
  const iCount = (html.match(/<i>/g) || []).length;
  const iCloseCount = (html.match(/<\/i>/g) || []).length;
  if (iCount > iCloseCount) tags += "<i>";
  return tags;
};

// 輔助函式：檢查結尾是否為不完整標籤
const endsWithIncompleteTag = (str) => {
  return /<[^>]*$/.test(str);
};

const useWatermarkCore = ({
  text,
  containerWidth,
  containerHeight,
  layoutConfig,
  fontConfig, // { fontFamily, fontSize, lineHeight, textAlign, keepSentences, autoIndent }
}) => {
  // 預設給一頁空的，避免畫面全白
  const [pages, setPages] = useState([""]);
  const [isCalculating, setIsCalculating] = useState(false);

  // 使用 ref 來避免閉包陷阱，但這裡依賴 useEffect 的 deps 應該足夠

  useEffect(() => {
    // 基礎防呆：如果沒有文字或版面設定還沒載入，就不計算
    if (!text || !layoutConfig || !containerHeight) {
      return;
    }

    setIsCalculating(true);

    const timer = setTimeout(() => {
      try {
        const { headerRatio, footerRatio, bodyRatio, paddingV, paddingH } =
          layoutConfig;
        const { fontFamily, fontSize, lineHeight, textAlign, keepSentences, autoIndent } =
          fontConfig;

        // 計算內文可用高度
        const bodyTotalHeight = Math.floor(containerHeight * bodyRatio);
        // 渲染時只有 paddingTop (paddingV / 2)，沒有 paddingBottom，統一測量環境
        const availableTextHeight = bodyTotalHeight - Math.floor(paddingV / 2);
        const availableTextWidth = containerWidth - paddingH;

        // 建立測量用隱形 div
        const measureDiv = document.createElement("div");
        Object.assign(measureDiv.style, {
          position: "fixed",
          top: "-9999px",
          left: "-9999px",
          visibility: "hidden",
          width: `${availableTextWidth}px`,
          fontSize: `${fontSize}px`,
          lineHeight: `${lineHeight}`,
          fontFamily: fontFamily,
          whiteSpace: "pre-wrap",
          wordBreak: "normal",
          lineBreak: "strict",
          textAlign: textAlign,
          overflowWrap: "break-word",
        });

        if (textAlign === "justify") {
          measureDiv.style.textAlignLast = "left";
          measureDiv.style.textJustify = "inter-ideograph";
        }
        document.body.appendChild(measureDiv);

        const newPages = [];
        // 統一換行符號
        const normalizedText = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        // 將 --- 替換為低存在感的分隔線
        // 因為 pre-wrap 會渲染 \n，我們讓 hr 垂直有 2.5rem 的留白 (讓空間多一點)，但前後不需要因為取代而產生額外的 \n
        const hrStyle = 'width: 30%; border: none; border-top: 1px solid currentColor; opacity: 0.2; margin: 2.5rem auto;';
        // 修正正規表達式：只取代單獨一行的 ---，不再將它包圍的額外換行清除
        const processedText = normalizedText.replace(/^---$/gm, `<hr style="${hrStyle}" />`);
        const paragraphs = processedText.split("\n");
        let currentPageContent = "";

        // --- 分頁演算法開始 ---
        for (let i = 0; i < paragraphs.length; i++) {
          let p = paragraphs[i];
          // 自動縮排邏輯：如果是開啟狀態且段落非空，且不是分隔線標籤，就無條件補上
          if (autoIndent && p.trim().length > 0 && !p.startsWith('<hr')) {
            p = "\u3000" + p;
          }

          // 如果不是最後一段，補上換行符號
          // 恢復純粹補上 \n，不阻擋原作者有意加上的多個空行 (\n\n)
          // 但如果自身或下一個是 <hr>，仍然不補，避免 <hr> 區塊元素自動換行再加 \n 造成的不對稱。
          // 針對使用者的回饋：「上面要加到第二行才會顯示」，這是因為原本的邏輯把 <hr> 上的 \n 吃了。
          let pWithNewline = p;
          if (i < paragraphs.length - 1) {
            // 只處理「我們用 --- 自動轉成 <hr>，但不想因為 \n 多空行」的情境。
            const isCurrentHr = p?.trim()?.startsWith('<hr');
            const nextP = paragraphs[i + 1];
            const isNextHr = nextP?.trim()?.startsWith('<hr');
            // 如果當前段落完全空白，代表使用者多按了 Enter，我們就尊重這個空行。
            const isEmptyLine = p.trim().length === 0;
            
            // 如果當前行不是分隔線，且「下一行不是分隔線 或 這是一行純空白行」，就正常補上換行符號
            if (!isCurrentHr && (!isNextHr || isEmptyLine)) {
               pWithNewline += "\n";
            }
          }

          // 嘗試把整段加進去
          measureDiv.innerHTML = autoCloseTags(
            currentPageContent + pWithNewline
          );

          if (measureDiv.offsetHeight <= availableTextHeight) {
            currentPageContent += pWithNewline;
          } else {
            // 塞不下了，開始切字
            let remaining = pWithNewline;

            while (remaining.length > 0) {
              // 先檢查剩下的能不能直接塞進目前頁面 (極少發生，但為了邏輯完整)
              measureDiv.innerHTML = autoCloseTags(
                currentPageContent + remaining
              );
              if (measureDiv.offsetHeight <= availableTextHeight) {
                currentPageContent += remaining;
                remaining = "";
                break;
              }

              // 二分搜尋法找切點
              let low = 0;
              let high = remaining.length;
              let bestFitIndex = 0;

              while (low <= high) {
                const mid = Math.floor((low + high) / 2);
                const chunk = remaining.slice(0, mid);
                measureDiv.innerHTML = autoCloseTags(
                  currentPageContent + chunk
                );

                if (measureDiv.offsetHeight <= availableTextHeight) {
                  bestFitIndex = mid;
                  low = mid + 1;
                } else {
                  high = mid - 1;
                }
              }

              // 回退機制：避免切在 HTML 標籤中間 (例如 < b > 的一半)
              while (
                bestFitIndex > 0 &&
                endsWithIncompleteTag(remaining.slice(0, bestFitIndex))
              ) {
                bestFitIndex--;
              }

              // 避頭點機制 (完整句子優先)
              if (
                keepSentences &&
                bestFitIndex > 0 &&
                bestFitIndex < remaining.length
              ) {
                const lookBack = Math.min(bestFitIndex, 15); // 往回看 15 個字
                const chunkToCheck = remaining.slice(
                  bestFitIndex - lookBack,
                  bestFitIndex
                );
                // 常見標點符號
                const punctuationRegex = /[。！？…」』，、；：]/;
                let lastPuncIndex = -1;

                for (let k = chunkToCheck.length - 1; k >= 0; k--) {
                  if (punctuationRegex.test(chunkToCheck[k])) {
                    lastPuncIndex = k;
                    break;
                  }
                }

                // 如果找到標點，就在標點後切斷
                if (lastPuncIndex !== -1) {
                  bestFitIndex = bestFitIndex - lookBack + lastPuncIndex + 1;
                }
              }

              // 為了防止無限迴圈，如果連一個字都塞不下 (bestFitIndex === 0)
              const fitChunk = remaining.slice(0, bestFitIndex);

              if (fitChunk.length === 0) {
                if (currentPageContent.length > 0) {
                  // 當前頁還有內容，直接換頁，把 remaining 留到下一頁處理
                  currentPageContent = currentPageContent.replace(/\n+$/, '');
                  newPages.push(autoCloseTags(currentPageContent));
                  currentPageContent = getOpenTags(currentPageContent);
                  continue;
                } else {
                  // 當前頁是空的還塞不下，代表這一個字太大了(或高度設太小)，強制塞一個字避免死迴圈
                  const oneChar = remaining.slice(0, 1);
                  currentPageContent += oneChar;
                  remaining = remaining.slice(1);
                }
              } else {
                // 正常切割
                currentPageContent += fitChunk;
                remaining = remaining.slice(bestFitIndex);
              }

              // 只要還有剩餘文字，就代表這一頁滿了，換頁
              if (remaining.length > 0) {
                currentPageContent = currentPageContent.replace(/\n+$/, '');
                newPages.push(autoCloseTags(currentPageContent));
                currentPageContent = getOpenTags(currentPageContent);
              }
            }
          }
        }
        // --- 分頁演算法結束 ---

        // 把最後一頁加進去
        if (currentPageContent.length > 0) {
          newPages.push(autoCloseTags(currentPageContent.replace(/\n+$/, '')));
        }

        setPages(newPages);
        document.body.removeChild(measureDiv);
        setIsCalculating(false);
      } catch (e) {
        console.error("Pagination failed: ", e.message, "\nStack: ", e.stack);
        setPages([`[系統發生錯誤，排版已中斷]\n${e.message}\n${e.stack}`]);
        setIsCalculating(false);
      }
    }, 100); // 100ms Debounce

    return () => clearTimeout(timer);
  }, [
    text,
    containerWidth,
    containerHeight,
    layoutConfig,
    // 使用 JSON.stringify 避免 fontConfig 物件參照改變導致無限重渲染
    JSON.stringify(fontConfig),
  ]);

  return { pages, isCalculating };
};

export default useWatermarkCore;
