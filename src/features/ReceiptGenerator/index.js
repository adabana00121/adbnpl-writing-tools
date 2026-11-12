import React, { useState, useRef, useEffect } from "react";
import {
  Receipt as ReceiptIcon,
  Palette,
  Languages,
  Plus,
  Trash2,
  Loader2,
  Download,
} from "lucide-react";

// 引入共用模組 (保持模組化 import)
import Layout from "../../components/common/Layout";
import PreviewCanvas from "../../components/common/PreviewCanvas";
import useDownloadImage from "../../hooks/useDownloadImage";
import useReceiptGenerator from "../../hooks/useReceiptGenerator";

// 引入設定與渲染器
import { I18N, RECEIPT_THEMES } from "./config";
import {
  GuestCheck,
  WastelandReceipt,
  StandardReceipt,
  VintageReceipt,
} from "./ReceiptRenderers";

// 定義每個風格對應的 Google Fonts Import 語句
const FONT_IMPORTS = {
  guest_check: `
    @import url('https://fonts.googleapis.com/css2?family=Anton&text=GUEST%20CHECKNo.0123456789&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Yuji+Syuku&display=swap');
  `,
  vintage: `
    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&text=ReceiptTotalNo.0123456789&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap');
  `,
  modern: `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400&display=swap');
  `,
  wasteland: `
    @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
  `,
};

/**
 * 內部全域樣式元件
 * 將字體定義與樣式類別封裝在一起
 */
const GlobalStyle = ({ activeStyle }) => (
  <style>{`
    ${FONT_IMPORTS[activeStyle] || ""}

    .font-receipt-mono { font-family: 'Courier Prime', monospace !important; }
    .font-receipt-impact { font-family: 'Anton', sans-serif !important; letter-spacing: 0.5px; }
    .font-receipt-handwriting { font-family: 'Caveat', 'BiauKai', 'DFKai-SB', 'KaiTi', 'STKaiti', 'Yuji Syuku', serif !important; }
    .font-receipt-sans { font-family: 'Noto Sans TC', sans-serif !important; }
    .font-receipt-serif { font-family: 'Noto Serif TC', serif !important; }
    .font-receipt-cursive { font-family: 'Pinyon Script', cursive !important; }
    .font-receipt-tech { font-family: 'Share Tech Mono', monospace !important; }

    .text-glow { text-shadow: 0 0 5px rgba(0, 255, 65, 0.6), 0 0 10px rgba(0, 255, 65, 0.4); }
    .scanlines {
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        background-size: 100% 3px, 3px 100%;
        pointer-events: none;
    }

    /* 介面相關微調 */
    .label-header { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 700; color: #6b7280; text-transform: uppercase; margin-bottom: 0.5rem; }
    .label-text { display: block; font-size: 0.75rem; font-weight: 600; color: #9ca3af; margin-bottom: 0.1rem; }
    .input-field { width: 100%; padding: 0.5rem; border: 1px solid #e5e7eb; border-radius: 0.375rem; transition: all; background: white; }
    .input-field:focus { outline: none; border-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1); }
  `}</style>
);

const ReceiptGenerator = ({ globalAuthor, onBack }) => {
  const [lang, setLang] = useState("zh");
  const [style, setStyle] = useState("guest_check");

  const { isGenerating, downloadImage } = useDownloadImage();
  const { items, totalPrice, addItem, removeItem, updateItem } =
    useReceiptGenerator();

  const previewRef = useRef(null);

  const [meta, setMeta] = useState({
    client: "委託人名稱",
    date: new Date().toISOString().split("T")[0],
    issuer: globalAuthor || "@你的筆名",
    table: "05",
    guests: "1",
    note: "僅供個人收藏，禁止商用。",
  });

  const [contentDimensions, setContentDimensions] = useState({
    width: 360,
    height: 600,
  });

  const t = I18N[lang];
  const currentTheme = RECEIPT_THEMES[style];

  // 監聽內容變化更新預覽尺寸
  useEffect(() => {
    const timer = setTimeout(() => {
      if (previewRef.current) {
        setContentDimensions({
          width: 360,
          height: previewRef.current.offsetHeight,
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [style, items, meta]);

  // 下載邏輯：採用排版助手的「顯式尺寸傳入」策略
  const onDownloadClick = async () => {
    if (!previewRef.current) return;

    // 1. 強制等待字體載入完成
    await document.fonts.ready;

    // 2. 計算精確的高度
    const containerHeight = previewRef.current.offsetHeight;

    downloadImage(
      previewRef,
      `Receipt_${meta.client}_${meta.date}.png`,
      {
        pixelRatio: 2, // 從 3 降為 2，提升速度約 40-50%，品質仍佳
        backgroundColor: null,
      },
      {
        width: 360,
        height: containerHeight,
      }
    );
  };

  return (
    <Layout
      title="收據產生器"
      icon={ReceiptIcon}
      onBack={onBack}
      sidebar={
        <>
          <div className="flex border-b border-gray-200">
            <div className="flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50">
              基本設定
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 text-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-header">
                  <Palette size={14} /> {t.style}
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="input-field w-full p-2 border rounded"
                >
                  {Object.keys(RECEIPT_THEMES).map((k) => (
                    <option key={k} value={k}>
                      {RECEIPT_THEMES[k].name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-header">
                  <Languages size={14} /> 語言
                </label>
                <div className="flex bg-gray-100 rounded p-1">
                  {["zh", "en"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`flex-1 text-xs py-1.5 rounded ${lang === l
                          ? "bg-white shadow text-emerald-600 font-bold"
                          : "text-gray-500"
                        }`}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 border-b border-gray-100 pb-5">
              <h3 className="text-xs font-bold text-gray-400">基本資料</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="label-text">{t.date}</label>
                  <input
                    type="date"
                    value={meta.date}
                    onChange={(e) => setMeta({ ...meta, date: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1">
                  <label className="label-text">{t.issuer}</label>
                  <input
                    type="text"
                    value={meta.issuer}
                    onChange={(e) =>
                      setMeta({ ...meta, issuer: e.target.value })
                    }
                    className="input-field"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="label-text">{t.client}</label>
                <input
                  type="text"
                  value={meta.client}
                  onChange={(e) => setMeta({ ...meta, client: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="space-y-3 border-b border-gray-100 pb-5">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-400">消費項目</h3>
                <button
                  onClick={addItem}
                  className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded hover:bg-emerald-100 flex items-center gap-1 font-bold"
                >
                  <Plus size={12} /> {t.addItem}
                </button>
              </div>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-gray-50 p-3 rounded border border-gray-200 relative group"
                  >
                    <button
                      onClick={() => removeItem(item.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="mb-2 pr-6">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateItem(item.id, "name", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-gray-300 focus:outline-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">
                          {t.count}
                        </span>
                        <input
                          type="number"
                          value={item.count}
                          onChange={(e) =>
                            updateItem(item.id, "count", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">$</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) =>
                            updateItem(item.id, "price", e.target.value)
                          }
                          className="w-full bg-white border border-gray-200 rounded px-1 py-0.5 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-sm font-bold text-gray-500">
                  {t.total}
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
            <div>
              <label className="label-text">{t.note}</label>
              <textarea
                value={meta.note}
                onChange={(e) => setMeta({ ...meta, note: e.target.value })}
                className="input-field h-16 resize-none"
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              onClick={onDownloadClick}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isGenerating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Download size={20} />
              )}
              {t.download}
            </button>
          </div>
        </>
      }
    >
      <PreviewCanvas
        contentWidth={contentDimensions.width}
        contentHeight={contentDimensions.height}
      >
        <div className="h-full w-full flex items-center justify-center">
          {/* 修復核心：將 GlobalStyle 置於 ref 內部，確保字體定義被擷取引擎抓取 */}
          <div ref={previewRef} className="inline-block relative">
            <GlobalStyle activeStyle={style} />

            {style === "guest_check" && (
              <GuestCheck
                data={meta}
                items={items}
                totalPrice={totalPrice}
                theme={currentTheme}
                t={t}
                lang={lang}
              />
            )}
            {style === "wasteland" && (
              <WastelandReceipt
                data={meta}
                items={items}
                totalPrice={totalPrice}
                t={t}
              />
            )}
            {style === "vintage" && (
              <VintageReceipt
                data={meta}
                items={items}
                totalPrice={totalPrice}
                theme={currentTheme}
                t={t}
                lang={lang}
              />
            )}
            {style === "modern" && (
              <StandardReceipt
                data={meta}
                items={items}
                totalPrice={totalPrice}
                theme={currentTheme}
                t={t}
                lang={lang}
                style={style}
              />
            )}
          </div>
        </div>
      </PreviewCanvas>
    </Layout>
  );
};

export default ReceiptGenerator;
