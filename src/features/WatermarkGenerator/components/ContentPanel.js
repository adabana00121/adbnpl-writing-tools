import React from "react";
import {
    QrCode as QrCodeIcon,
    Upload,
    Bold as BoldIcon,
    Italic as ItalicIcon,
    Minus as MinusIcon,
    CheckCircle2,
    Minimize,
    Indent,
} from "lucide-react";

/**
 * 內容面板組件 - 處理標題、作者、文本輸入和QR Code設置
 */
const ContentPanel = ({
    title,
    setTitle,
    author,
    setAuthor,
    showQrCode,
    setShowQrCode,
    qrCodeContent,
    setQrCodeContent,
    qrCodeLabel,
    setQrCodeLabel,
    handleFileUpload,
    text,
    setText,
    textAreaRef,
    insertFormat,
    keepSentences,
    setKeepSentences,
    autoIndent,
    setAutoIndent,
    pages,
    isCalculating,
}) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    標題
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="輸入文章標題"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    筆名 / 帳號
                </label>
                <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="@yourname"
                />
            </div>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center mb-2 mt-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <QrCodeIcon size={14} /> 頁尾 QR Code
                    </label>
                    <button
                        onClick={() => setShowQrCode(!showQrCode)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${showQrCode ? "bg-indigo-600" : "bg-gray-300"
                            }`}
                    >
                        <span
                            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${showQrCode ? "translate-x-5" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
                {showQrCode && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={qrCodeContent}
                            onChange={(e) => setQrCodeContent(e.target.value)}
                            className="w-full p-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                            placeholder="輸入網址"
                        />
                        <input
                            type="text"
                            value={qrCodeLabel}
                            onChange={(e) => setQrCodeLabel(e.target.value)}
                            className="w-full p-2 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500"
                            placeholder="輸入小字"
                        />
                    </div>
                )}
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    匯入文字
                </label>
                <label className="flex items-center justify-center gap-2 p-2 border border-dashed border-gray-300 rounded hover:bg-gray-50 cursor-pointer text-sm text-gray-600 transition-colors">
                    <Upload size={16} /> <span>上傳 .txt 或 .docx</span>
                    <input
                        type="file"
                        accept=".txt,.docx,.doc"
                        onChange={handleFileUpload}
                        className="hidden"
                        onClick={(e) => {
                            e.target.value = null;
                        }}
                    />
                </label>
            </div>

            <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider flex justify-between items-center">
                    <span>內文 (總字數: {text.length})</span>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setAutoIndent(!autoIndent)}
                            className={`p-1 rounded ${autoIndent
                                ? "bg-indigo-100 text-indigo-600"
                                : "hover:bg-gray-100 text-gray-600"
                                }`}
                            title="段落自動縮排 (1字元)"
                        >
                            <Indent size={14} />
                        </button>
                        <button
                            onClick={() => insertFormat("b")}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="粗體"
                        >
                            <BoldIcon size={14} />
                        </button>
                        <button
                            onClick={() => insertFormat("i")}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="斜體"
                        >
                            <ItalicIcon size={14} />
                        </button>
                        <button
                            onClick={() => insertFormat("hr")}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="分隔線"
                        >
                            <MinusIcon size={14} />
                        </button>
                    </div>
                </label>
                <textarea
                    ref={textAreaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full h-48 p-3 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 text-sm leading-relaxed whitespace-pre-wrap font-mono"
                    placeholder="在此貼上你的小說內容..."
                />
            </div>

            <div className="p-3 bg-gray-100 rounded-lg space-y-3">
                <div className="flex items-center justify-between text-indigo-700 font-semibold text-sm">
                    <div>分頁資訊</div>{" "}
                    {isCalculating && <span className="animate-pulse">運算中...</span>}
                </div>
                <div className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        {keepSentences ? (
                            <CheckCircle2 size={16} />
                        ) : (
                            <Minimize size={16} />
                        )}
                        <span>
                            {keepSentences ? "完整句子優先" : "空間利用優先"}
                        </span>
                    </div>
                    <button
                        onClick={() => setKeepSentences(!keepSentences)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${keepSentences ? "bg-indigo-600" : "bg-gray-200"
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${keepSentences ? "translate-x-6" : "translate-x-1"
                                }`}
                        />
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center">
                    總頁數：{pages.length}
                </p>
            </div>
        </div>
    );
};

export default ContentPanel;
