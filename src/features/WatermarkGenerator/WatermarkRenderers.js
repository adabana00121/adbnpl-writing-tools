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
    
  return (
    <div className={`flex flex-col relative ${theme.bg} transition-colors duration-300`} style={{ width: `${width}px`, height: `${height}px`, overflow: "hidden" }}>
      
      <WatermarkOverlay settings={watermarkSettings} theme={theme} />
      
      {/* Header */}
      <div className={`flex-none w-full flex flex-col justify-end border-b-2 ${theme.border} ${theme.bg} z-20 relative`} style={{ height: `${height * layoutConfig.headerRatio}px`, padding: `32px 48px 12px 48px` }}>
        <h2 className={`text-3xl font-bold truncate pb-1 ${theme.text}`} style={fontStyle}>{meta.title}</h2>
        <div className={`text-sm font-medium tracking-wide ${theme.sub} flex justify-between items-center mt-2`} style={fontStyle}>
          <span className="truncate max-w-[60%]">{meta.author}</span>
          <span className="text-xs opacity-70 shrink-0">{meta.date}{totalPages > 1 && ` • ${pageIndex + 1}/${totalPages}`}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full relative z-10" style={{ height: `${height * layoutConfig.bodyRatio}px`, paddingLeft: `${layoutConfig.paddingH / 2}px`, paddingRight: `${layoutConfig.paddingH / 2}px`, paddingTop: `${layoutConfig.paddingV / 2}px` }}>
        <div className={`w-full h-full whitespace-pre-wrap break-words ${theme.text}`} style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight, textAlign: textAlign, textAlignLast: textAlign === "justify" ? "left" : "auto", textJustify: "inter-ideograph", wordBreak: "normal", lineBreak: "strict", ...fontStyle }} dangerouslySetInnerHTML={{ __html: pageText }} />
      </div>

      {/* Footer */}
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
    </div>
  );
};