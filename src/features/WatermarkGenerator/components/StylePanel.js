import React from "react";
import {
    Maximize,
    Layout as LayoutIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from "lucide-react";

/**
 * 外觀面板組件 - 處理版面比例、配色主題、字體風格、大小、行距和對齊方式
 */
const StylePanel = ({
    aspectRatio,
    setAspectRatio,
    theme,
    setTheme,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    textAlign,
    setTextAlign,
}) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                    版面比例
                </label>
                <div className="glass-segment flex rounded-full p-1" role="group">
                    <button
                        onClick={() => setAspectRatio("9/16")}
                        className={`glass-btn px-2 py-2.5 flex-1 rounded-full flex items-center justify-center gap-2 transition-all ${aspectRatio === "9/16"
                                ? "bg-white shadow text-indigo-700"
                                : "hover:bg-white/60 text-gray-600"
                            }`}
                    >
                        <Maximize size={18} className="text-gray-500" />
                        <span className="text-sm">9:16</span>
                    </button>
                    <button
                        onClick={() => setAspectRatio("3/4")}
                        className={`glass-btn px-2 py-2.5 flex-1 rounded-full flex items-center justify-center gap-2 transition-all ${aspectRatio === "3/4"
                                ? "bg-white shadow text-indigo-700"
                                : "hover:bg-white/60 text-gray-600"
                            }`}
                    >
                        <LayoutIcon
                            size={18}
                            className="text-gray-500 scale-y-110"
                        />
                        <span className="text-sm">3:4</span>
                    </button>
                    <button
                        onClick={() => setAspectRatio("1/1")}
                        className={`glass-btn px-2 py-2.5 flex-1 rounded-full flex items-center justify-center gap-2 transition-all ${aspectRatio === "1/1"
                                ? "bg-white shadow text-indigo-700"
                                : "hover:bg-white/60 text-gray-600"
                            }`}
                    >
                        <LayoutIcon size={18} className="text-gray-500" />
                        <span className="text-sm">1:1</span>
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                    配色主題
                </label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: "light", color: "bg-white border-gray-200" },
                        { id: "sepia", color: "bg-[#f4ecd8] border-[#dccfc0]" },
                        { id: "dark", color: "bg-gray-800 border-gray-700" },
                        {
                            id: "midnight",
                            color: "bg-[#1a202c] border-slate-700",
                        },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTheme(t.id)}
                            className={`h-12 rounded-lg border-2 flex items-center justify-center transition-all ${t.color
                                } ${theme === t.id
                                    ? "ring-2 ring-indigo-500"
                                    : "border-gray-200"
                                }`}
                        >
                            {theme === t.id && (
                                <span
                                    className={`w-2 h-2 rounded-full ${t.id === "light" || t.id === "sepia"
                                            ? "bg-indigo-600"
                                            : "bg-white"
                                        }`}
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                    字體風格
                </label>
                <div className="glass-segment flex rounded-full p-1" role="group">
                    <button
                        onClick={() => setFontFamily("rounded")}
                        className={`glass-btn px-4 py-2 text-sm flex-1 rounded-full ${fontFamily === "rounded"
                                ? "bg-white shadow text-indigo-700"
                                : "hover:bg-white/60 text-gray-600"
                            }`}
                    >
                        圓體
                    </button>
                    <button
                        onClick={() => setFontFamily("sans")}
                        className={`glass-btn px-4 py-2 text-sm flex-1 rounded-full ${fontFamily === "sans"
                                ? "bg-white shadow text-indigo-700"
                                : "hover:bg-white/60 text-gray-600"
                            }`}
                    >
                        黑體
                    </button>
                    <button
                        onClick={() => setFontFamily("serif")}
                        className={`glass-btn px-4 py-2 text-sm flex-1 rounded-full ${fontFamily === "serif"
                                ? "bg-white shadow text-indigo-700"
                                : "hover:bg-white/60 text-gray-600"
                            }`}
                    >
                        宋體
                    </button>
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-500">
                        字體大小{" "}
                        <span className="text-xs font-mono text-indigo-600 ml-2">
                            {fontSize}px
                        </span>
                    </label>
                </div>
                <input
                    type="range"
                    min="14"
                    max="32"
                    step="1"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-2 accent-indigo-600"
                />
            </div>

            <div>
                <div className="flex justify-between mb-2">
                    <label className="block text-xs font-semibold text-gray-500">
                        行距{" "}
                        <span className="text-xs font-mono text-indigo-600 ml-2">
                            {lineHeight}
                        </span>
                    </label>
                </div>
                <input
                    type="range"
                    min="1.4"
                    max="2.4"
                    step="0.1"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                    className="w-full h-2 accent-indigo-600"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                    對齊方式
                </label>
                <div className="glass-segment flex gap-1 p-1 rounded-full w-max">
                    <button
                        onClick={() => setTextAlign("left")}
                        className={`glass-btn p-2 rounded-full ${textAlign === "left"
                                ? "bg-white shadow text-indigo-600"
                                : "text-gray-500 hover:bg-white/60"
                            }`}
                    >
                        <AlignLeft size={18} />
                    </button>
                    <button
                        onClick={() => setTextAlign("center")}
                        className={`glass-btn p-2 rounded-full ${textAlign === "center"
                                ? "bg-white shadow text-indigo-600"
                                : "text-gray-500 hover:bg-white/60"
                            }`}
                    >
                        <AlignCenter size={18} />
                    </button>
                    <button
                        onClick={() => setTextAlign("right")}
                        className={`glass-btn p-2 rounded-full ${textAlign === "right"
                                ? "bg-white shadow text-indigo-600"
                                : "text-gray-500 hover:bg-white/60"
                            }`}
                    >
                        <AlignRight size={18} />
                    </button>
                    <button
                        onClick={() => setTextAlign("justify")}
                        className={`glass-btn p-2 rounded-full ${textAlign === "justify"
                                ? "bg-white shadow text-indigo-600"
                                : "text-gray-500 hover:bg-white/60"
                            }`}
                    >
                        <AlignJustify size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StylePanel;
