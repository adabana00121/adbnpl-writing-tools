import React, { useState, useRef, useEffect } from "react";
import {
  Type,
  Palette,
  Stamp,
  QrCode as QrCodeIcon,
  Upload,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  FileText,
  CheckCircle2,
  Minimize,
  Maximize,
  Layout as LayoutIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  User,
  Grid3X3,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Archive,
  Loader2,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Zap,
  CheckCircle,
} from "lucide-react";

// --- NPM 套件引入 ---
import { domToPng, createContext, destroyContext } from "modern-screenshot";
import mammoth from "mammoth";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";

// 引入共用模組
import Layout from "../../components/common/Layout";
import PreviewCanvas from "../../components/common/PreviewCanvas";
import useDownloadImage from "../../hooks/useDownloadImage";
import useWatermarkCore from "../../hooks/useWatermarkCore";

// 引入設定檔與渲染器
import {
  CONTAINER_WIDTH,
  LAYOUT_CONFIG,
  THEMES,
  QR_COLORS,
  FONT_STYLES,
  DEFAULT_INSTRUCTION,
} from "./config";
import { WatermarkCard } from "./WatermarkRenderers";

// 引入拆分的 Panel 組件
import ContentPanel from "./components/ContentPanel";
import StylePanel from "./components/StylePanel";
import WatermarkPanel from "./components/WatermarkPanel";

// Global Styles (包含丸子圓體定義)
// 雖然不再手動注入給下載器，但預覽時仍需此樣式
const GlobalStyles = () => (
  <style>{`
    /* Google Fonts */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+TC:wght@400;500;700&display=swap');

    /* 自定義 Web Font: 丸子工坊 (繁體圓體) */
    @font-face {
      font-family: 'MarukoGothicCJKtc-Regular';
      src: url('/fonts/MarukoGothicCJKtc-Regular.woff2') format('woff2');
      font-display: swap;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(107, 114, 128, 0.8); }
  `}</style>
);

const WatermarkGenerator = ({ globalAuthor, onBack }) => {
  // --- 狀態管理 ---
  const [text, setText] = useState(DEFAULT_INSTRUCTION);
  const [title, setTitle] = useState("未命名篇章");
  const [author, setAuthor] = useState(globalAuthor || "@你的筆名");

  const [theme, setTheme] = useState("light");
  const [fontFamily, setFontFamily] = useState("rounded");
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [textAlign, setTextAlign] = useState("justify");

  const [aspectRatio, setAspectRatio] = useState("9/16");
  const [currentPage, setCurrentPage] = useState(0);
  const [keepSentences, setKeepSentences] = useState(true);
  const [autoIndent, setAutoIndent] = useState(false);

  const [watermarkType, setWatermarkType] = useState("grid");
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.15);
  const [watermarkText, setWatermarkText] = useState("禁止轉載");

  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeContent, setQrCodeContent] = useState(
    "https://instagram.com/your_account"
  );
  const [qrCodeLabel, setQrCodeLabel] = useState("掃描閱讀全文");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");

  const previewRef = useRef(null);
  const textAreaRef = useRef(null);
  const exportContainerRef = useRef(null);

  const [isZipping, setIsZipping] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  // 移除 fontLoadStatus 相關狀態

  // 1. 使用 Hook 處理下載
  const { isGenerating, downloadImage } = useDownloadImage();

  // 2. 計算容器高度
  const [containerHeight, setContainerHeight] = useState(600 * (16 / 9));

  useEffect(() => {
    let height;
    if (aspectRatio === "9/16") height = Math.floor(CONTAINER_WIDTH * (16 / 9));
    else if (aspectRatio === "3/4")
      height = Math.floor(CONTAINER_WIDTH * (4 / 3));
    else height = CONTAINER_WIDTH;
    setContainerHeight(height);
  }, [aspectRatio]);

  // 3. 核心排版邏輯
  const { pages, isCalculating } = useWatermarkCore({
    text,
    containerWidth: CONTAINER_WIDTH,
    containerHeight,
    layoutConfig: LAYOUT_CONFIG[aspectRatio],
    fontConfig: {
      fontFamily: FONT_STYLES[fontFamily].fontFamily,
      fontSize,
      lineHeight,
      textAlign,
      keepSentences,
      autoIndent,
    },
  });

  useEffect(() => {
    if (currentPage >= pages.length) {
      setCurrentPage(Math.max(0, pages.length - 1));
    }
  }, [pages.length, currentPage]);

  const insertFormat = (tag) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const scrollTop = textarea.scrollTop;
    const selectedText = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);
    
    let newText;
    let cursorOffset;
    let selectionOffset;

    if (tag === "hr") {
      const hrText = "\n---\n";
      newText = `${before}${hrText}${after}`;
      cursorOffset = hrText.length;
      selectionOffset = hrText.length;
    } else {
      newText = `${before}<${tag}>${selectedText}</${tag}>${after}`;
      cursorOffset = tag.length + 2;
      selectionOffset = tag.length + 2;
    }

    setText(newText);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
        if (tag === "hr") {
          textAreaRef.current.setSelectionRange(
            start + cursorOffset,
            start + cursorOffset
          );
        } else {
          textAreaRef.current.setSelectionRange(
            start + cursorOffset,
            end + selectionOffset
          );
        }
        textAreaRef.current.scrollTop = scrollTop;
      }
    }, 0);
  };

  useEffect(() => {
    if (showQrCode && qrCodeContent) {
      const darkColor = QR_COLORS[theme] || "#000000";
      QRCode.toDataURL(qrCodeContent, {
        margin: 0,
        width: 100,
        color: { dark: darkColor, light: "#00000000" },
      })
        .then((url) => setQrCodeDataUrl(url))
        .catch((err) => console.error("QR Code generation failed", err));
    }
  }, [showQrCode, qrCodeContent, theme]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n");
        setText(content);
        setCurrentPage(0);
      };
      reader.readAsText(file);
    } else if (fileName.endsWith(".docx")) {
      if (!window.mammoth) {
        alert("Word 解析組件尚未載入，請稍後再試。");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        mammoth
          .extractRawText({ arrayBuffer: arrayBuffer })
          .then((result) => {
            const content = result.value
              .replace(/\r\n/g, "\n")
              .replace(/\r/g, "\n");
            setText(content);
            setCurrentPage(0);
          })
          .catch((err) => {
            console.error(err);
            alert("讀取 Word 檔案失敗，請確認檔案未損毀。");
          });
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("目前僅支援 .txt 與 .docx 檔案格式。");
    }
  };

  // 下載單頁 (清理版)
  const onDownloadClick = () => {
    downloadImage(
      previewRef,
      `${title || "novel"}_p${currentPage + 1}.png`,
      {
        pixelRatio: 2, quality: 0.95, // 優化：輕微降低品質換取更快速度
        backgroundColor: THEMES[theme].bg === "bg-white" ? "#ffffff" : null,
        // modern-screenshot 通常不需要 skipFonts
      },
      {
        width: CONTAINER_WIDTH,
        height: containerHeight,
        // 移除 fontEmbedCSS，依賴 modern-screenshot 自動處理
      }
    );
  };

  // 批次下載 (清理版：改用 domToPng)
  const handleDownloadAll = async () => {
    if (!exportContainerRef.current) {
      alert("組件載入中，請稍候...");
      return;
    }
    setIsZipping(true);
    let zip = new JSZip();
    let context = null;
    try {
      const pageElements = exportContainerRef.current.children;

      // 建立共用 context，讓字型只被 fetch + base64 編碼一次
      try {
        context = await createContext(pageElements[0], {
          scale: 2,
          width: CONTAINER_WIDTH,
          height: containerHeight,
        });
      } catch (e) {
        console.warn('Context creation failed, falling back to per-page rendering', e);
      }

      for (let i = 0; i < pageElements.length; i++) {
        console.log(`處理中: ${i + 1}/${pageElements.length}`);

        const dataUrl = await domToPng(pageElements[i], {
          scale: 2,
          quality: 0.95,
          width: CONTAINER_WIDTH,
          height: containerHeight,
          style: { transform: "none", margin: 0 },
          ...(context ? { context } : {}),
          features: {
            fixSvgXmlDecode: false,
          }
        });
        
        const base64Data = dataUrl.split(",")[1];
        zip.file(`${title}_p${i + 1}.png`, base64Data, { base64: true });
        
        // 縮短等待時間，有 context 快取後記憶體壓力大幅降低
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      const content = await zip.generateAsync({
        type: "blob",
        compression: "STORE",
      });
      saveAs(content, `${title || "novel"}_全集.zip`);
    } catch (err) {
      console.error(err);
      alert("打包失敗，請重試");
    } finally {
      // 清理 context 和大物件，避免記憶體洩漏
      if (context) { try { destroyContext(context); } catch(e) {} }
      zip = null;
      context = null;
      setIsZipping(false);
    }
  };

  return (
    <Layout
      title="文手排版助手"
      icon={Type}
      onBack={onBack}
      sidebar={
        <>
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === "content"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <Type size={16} /> 內容
            </button>
            <button
              onClick={() => setActiveTab("style")}
              className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === "style"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <Palette size={16} /> 外觀
            </button>
            <button
              onClick={() => setActiveTab("watermark")}
              className={`flex-1 py-3 text-sm font-medium flex justify-center items-center gap-2 ${activeTab === "watermark"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <Stamp size={16} /> 防盜
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Sidebar Content */}
            {activeTab === "content" && (
              <ContentPanel
                title={title}
                setTitle={setTitle}
                author={author}
                setAuthor={setAuthor}
                showQrCode={showQrCode}
                setShowQrCode={setShowQrCode}
                qrCodeContent={qrCodeContent}
                setQrCodeContent={setQrCodeContent}
                qrCodeLabel={qrCodeLabel}
                setQrCodeLabel={setQrCodeLabel}
                handleFileUpload={handleFileUpload}
                text={text}
                setText={setText}
                textAreaRef={textAreaRef}
                insertFormat={insertFormat}
                keepSentences={keepSentences}
                setKeepSentences={setKeepSentences}
                autoIndent={autoIndent}
                setAutoIndent={setAutoIndent}
                pages={pages}
                isCalculating={isCalculating}
              />
            )}

            {activeTab === "style" && (
              <StylePanel
                aspectRatio={aspectRatio}
                setAspectRatio={setAspectRatio}
                theme={theme}
                setTheme={setTheme}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                fontSize={fontSize}
                setFontSize={setFontSize}
                lineHeight={lineHeight}
                setLineHeight={setLineHeight}
                textAlign={textAlign}
                setTextAlign={setTextAlign}
              />
            )}

            {activeTab === "watermark" && (
              <WatermarkPanel
                watermarkText={watermarkText}
                setWatermarkText={setWatermarkText}
                author={author}
                watermarkType={watermarkType}
                setWatermarkType={setWatermarkType}
                watermarkOpacity={watermarkOpacity}
                setWatermarkOpacity={setWatermarkOpacity}
              />
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-white space-y-3">
            {/* 分頁切換 */}
            {pages.length > 1 && (
              <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} / {pages.length}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(pages.length - 1, p + 1))
                  }
                  disabled={currentPage === pages.length - 1}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
            {/* 下載按鈕 */}
            <div className="flex gap-2">
              <button
                onClick={onDownloadClick}
                disabled={isGenerating}
                className="flex-1 py-3 px-3 rounded-lg flex items-center justify-center gap-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Download size={18} />
                )}{" "}
                下載此頁
              </button>
              <button
                onClick={handleDownloadAll}
                disabled={isGenerating || isZipping}
                className="flex-1 py-3 px-3 rounded-lg flex items-center justify-center gap-2 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                {isZipping ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Archive size={18} />
                )}{" "}
                打包全部
              </button>
            </div>
          </div>
        </>
      }
    >
      <GlobalStyles />
      <div
        className="fixed left-[-9999px] top-0 pointer-events-none opacity-0"
        ref={exportContainerRef}
      >
        {pages.map((p, i) => (
          <WatermarkCard
            key={i}
            pageText={p}
            pageIndex={i}
            totalPages={pages.length}
            width={CONTAINER_WIDTH}
            height={containerHeight}
            layoutConfig={LAYOUT_CONFIG[aspectRatio]}
            theme={THEMES[theme]}
            fontStyle={FONT_STYLES[fontFamily]}
            fontSize={fontSize}
            lineHeight={lineHeight}
            textAlign={textAlign}
            watermarkSettings={{
              type: watermarkType,
              opacity: watermarkOpacity,
              text: watermarkText,
            }}
            meta={{ title, author, date: new Date().toLocaleDateString() }}
            qrSettings={{
              show: showQrCode,
              dataUrl: qrCodeDataUrl,
              label: qrCodeLabel,
            }}
          />
        ))}
      </div>

      <PreviewCanvas
        contentWidth={CONTAINER_WIDTH}
        contentHeight={containerHeight}
      >
        <div ref={previewRef} className="h-full w-full">
          <WatermarkCard
            pageText={pages[currentPage] || ""}
            pageIndex={currentPage}
            totalPages={pages.length}
            width={CONTAINER_WIDTH}
            height={containerHeight}
            layoutConfig={LAYOUT_CONFIG[aspectRatio]}
            theme={THEMES[theme]}
            fontStyle={FONT_STYLES[fontFamily]}
            fontSize={fontSize}
            lineHeight={lineHeight}
            textAlign={textAlign}
            watermarkSettings={{
              type: watermarkType,
              opacity: watermarkOpacity,
              text: watermarkText,
            }}
            meta={{ title, author, date: new Date().toLocaleDateString() }}
            qrSettings={{
              show: showQrCode,
              dataUrl: qrCodeDataUrl,
              label: qrCodeLabel,
            }}
          />
        </div>
      </PreviewCanvas>
    </Layout>
  );
};

export default WatermarkGenerator;
