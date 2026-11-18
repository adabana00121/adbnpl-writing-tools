import React from 'react';
import { 
  Stamp, Grid3X3, Image as ImageIcon, 
  QrCode as QrCodeIcon 
} from 'lucide-react';

// --- 浮水印圖層 ---
const WatermarkOverlay = ({ settings, theme }) => {
  const { type, opacity, text, color } = settings;
  const commonStyle = { opacity: opacity, pointerEvents: "none", userSelect: "none", color: color || 'inherit' };
  
  // 如果是全版或角落，使用 theme.sub 顏色；如果是中央，使用自訂顏色或預設
  // 這裡稍微調整邏輯以支援傳入顏色，若無則用 theme 預設
  const finalStyle = { 
      ...commonStyle, 
      color: color 
  };

  if (type === "grid") {
    return (
      <div className="absolute inset-0 overflow-hidden z-30 flex flex-wrap content-center justify-center pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-1/3 h-48 flex items-center justify-center transform -rotate-45" style={finalStyle}>
            <span className={`text-sm font-bold whitespace-nowrap ${!color && theme.sub}`}>{text}</span>
          </div>
        ))}
      </div>
    );
  } else if (type === "center") {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
        <div className={`text-4xl font-black border-4 p-8 transform -rotate-12 ${!color && theme.sub} border-current text-center leading-snug`} style={{ ...finalStyle, opacity: opacity + 0.1 }}>{text}</div>
      </div>
    );
  } else {
    // Corner
    return (
      <div className="absolute inset-0 z-30 pointer-events-none p-6 flex flex-col justify-between">
        <div className={`text-xs ${!color && theme.sub} text-right`} style={finalStyle}>{text}</div>
        <div className={`text-xs ${!color && theme.sub} text-left`} style={finalStyle}>{text}</div>
      </div>
    );
  }
};

// --- 網站風主題專用字族（鎖定，不跟隨字體設定）---
// 標題用襯線 700（站上載入的字重，不另加 900，免得匯出內嵌變慢）；標籤用 JetBrains Mono。
const SITE_TITLE_FONT = '"Noto Serif TC", "Songti TC", "PMingLiU", "New York", "Times New Roman", serif';
const SITE_MONO_FONT = '"JetBrains Mono", "Noto Sans TC", monospace';
const SITE_INK = "#0A0A0A";
const SITE_ACCENT = "#059669"; // 正式站預設 accent（emerald）

// --- 主要卡片渲染元件 ---
export const WatermarkCard = ({
    pageText,
    pageIndex,
    totalPages,
    width,
    height,
    layoutConfig,
    theme,
    fontStyle,
    fontSize,
    lineHeight,
    textAlign,
    watermarkSettings, // { type, opacity, text, color }
    meta, // { title, author, date }
    qrSettings // { show, dataUrl, label }
}) => {
  const isSite = theme.variant === "site";

  return (
    <div className={`flex flex-col relative ${theme.bg} transition-colors duration-300`} style={{ width: `${width}px`, height: `${height}px`, overflow: "hidden" }}>

      <WatermarkOverlay settings={watermarkSettings} theme={theme} />

      {/* Header：網站風是刊頭列（館名＋版本標籤、襯線標題、Mono 副列）＋粗細雙線；一般主題維持原版式 */}
      {isSite ? (
        <div className={`flex-none w-full flex flex-col justify-end ${theme.bg} z-20 relative`} style={{ height: `${height * layoutConfig.headerRatio}px`, padding: `12px 36px 0 36px` }}>
          <div className="flex justify-between items-center" style={{ marginBottom: 8 }}>
            <span className="flex items-center" style={{ gap: 8, fontFamily: SITE_MONO_FONT, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: SITE_INK }}>
              <span style={{ width: 12, height: 12, background: SITE_ACCENT, boxShadow: `2px 2px 0 0 ${SITE_INK}`, flex: "none" }} />
              ADABANIPAL LIBRARY
            </span>
            <span style={{ fontFamily: SITE_MONO_FONT, fontSize: 10, fontWeight: 700, color: "#fff", background: SITE_ACCENT, padding: "2px 6px" }}>VER_1.0</span>
          </div>
          <h2 className="truncate" style={{ fontFamily: SITE_TITLE_FONT, fontSize: 30, fontWeight: 700, lineHeight: 1.25, color: SITE_INK }}>{meta.title}</h2>
          <div className="flex justify-between items-center" style={{ marginTop: 6, fontFamily: SITE_MONO_FONT, fontSize: 12, color: "#4A4A4A" }}>
            <span className="truncate max-w-[60%]">BY {meta.author}</span>
            <span className="shrink-0">{meta.date}{totalPages > 1 && ` • ${pageIndex + 1}/${totalPages}`}</span>
          </div>
          <div style={{ flex: "none", height: 8, borderTop: `4px solid ${SITE_INK}`, borderBottom: `1px solid ${SITE_INK}`, marginTop: 8 }} />
        </div>
      ) : (
        <div className={`flex-none w-full flex flex-col justify-end border-b-2 ${theme.border} ${theme.bg} z-20 relative`} style={{ height: `${height * layoutConfig.headerRatio}px`, padding: `32px 48px 12px 48px` }}>
          <h2 className={`text-3xl font-bold truncate pb-1 ${theme.text}`} style={fontStyle}>{meta.title}</h2>
          <div className={`text-sm font-medium tracking-wide ${theme.sub} flex justify-between items-center mt-2`} style={fontStyle}>
            <span className="truncate max-w-[60%]">{meta.author}</span>
            <span className="text-xs opacity-70 shrink-0">{meta.date}{totalPages > 1 && ` • ${pageIndex + 1}/${totalPages}`}</span>
          </div>
        </div>
      )}

      {/* Body：paddingBottom 只在網站風主題有值（與上留白對稱），其他主題為 0，版式不變 */}
      <div className="flex-1 w-full relative z-10" style={{ height: `${height * layoutConfig.bodyRatio}px`, paddingLeft: `${layoutConfig.paddingH / 2}px`, paddingRight: `${layoutConfig.paddingH / 2}px`, paddingTop: `${layoutConfig.paddingV / 2}px`, paddingBottom: `${layoutConfig.paddingBottom || 0}px` }}>
        <div className={`w-full h-full whitespace-pre-wrap break-words ${theme.text}`} style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight, textAlign: textAlign, textAlignLast: textAlign === "justify" ? "left" : "auto", textJustify: "inter-ideograph", wordBreak: "normal", lineBreak: "strict", ...fontStyle }} dangerouslySetInnerHTML={{ __html: pageText }} />
      </div>

      {/* Footer：網站風是落款（館名＋作者 — 網域），不放 QR；一般主題維持原版式 */}
      {isSite ? (
        <div className={`flex-none w-full flex flex-col justify-center items-center text-center ${theme.bg} z-20 relative`} style={{ height: `${height * layoutConfig.footerRatio}px`, borderTop: `4px solid ${SITE_INK}`, padding: "0 32px" }}>
          <div style={{ fontFamily: SITE_MONO_FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.18em", color: SITE_INK }}>ADABANIPAL LIBRARY</div>
          <div style={{ fontFamily: SITE_MONO_FONT, fontSize: 11, color: "#4A4A4A", marginTop: 6 }}>{meta.author} — ADABANIPAL.COM</div>
        </div>
      ) : (
        <div className={`flex-none w-full flex items-start ${qrSettings.show ? "justify-between" : "justify-center"} border-t ${theme.border} ${theme.bg} z-20 relative`} style={{ height: `${height * layoutConfig.footerRatio}px`, paddingTop: "24px", paddingLeft: "32px", paddingRight: "32px" }}>
          <div className="flex flex-col justify-start">
            <p className={`text-xs ${theme.sub} tracking-widest truncate ${qrSettings.show ? "text-left" : "text-center"}`} style={fontStyle}>
              <span className="uppercase">Read more at</span> <br /><span className="font-bold">{meta.author}</span>
            </p>
          </div>
          {qrSettings.show && qrSettings.dataUrl && (
            <div className="flex flex-col items-center gap-1">
              <img src={qrSettings.dataUrl} alt="QR Code" className="w-12 h-12" /><span className={`text-[10px] ${theme.sub} tracking-wider`} style={fontStyle}>{qrSettings.label}</span>
            </div>
          )}
        </div>
      )}

      {/* 網站風 4px 外框：絕對定位覆蓋層，不佔版面、不影響分頁幾何 */}
      {isSite && (
        <div className="absolute inset-0 z-40 pointer-events-none" style={{ border: `4px solid ${SITE_INK}` }} />
      )}
    </div>
  );
};