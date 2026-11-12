import React from "react";
import { Grid3X3, Stamp, Image as ImageIcon } from "lucide-react";

/**
 * 防盜浮水印面板組件 - 處理浮水印文字、模式和透明度設置
 */
const WatermarkPanel = ({
    watermarkText,
    setWatermarkText,
    author,
    watermarkType,
    setWatermarkType,
    watermarkOpacity,
    setWatermarkOpacity,
}) => {
    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                    防盜文字
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        onClick={() => setWatermarkText(author)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-xs rounded"
                    >
                        筆名
                    </button>
                </div>
                <div className="mt-1 text-right">
                    <button
                        onClick={() => setWatermarkText("禁止轉載")}
                        className="text-[10px] text-gray-400 hover:text-indigo-600"
                    >
                        重設為「禁止轉載」
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                    浮水印模式
                </label>
                <div className="grid grid-cols-3 gap-2">
                    <button
                        onClick={() => setWatermarkType("grid")}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg ${watermarkType === "grid"
                                ? "border-indigo-500 bg-indigo-50"
                                : "bg-white"
                            }`}
                    >
                        <Grid3X3 size={20} />
                        <span className="text-xs">全版</span>
                    </button>
                    <button
                        onClick={() => setWatermarkType("center")}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg ${watermarkType === "center"
                                ? "border-indigo-500 bg-indigo-50"
                                : "bg-white"
                            }`}
                    >
                        <Stamp size={20} />
                        <span className="text-xs">中央</span>
                    </button>
                    <button
                        onClick={() => setWatermarkType("corner")}
                        className={`flex flex-col items-center justify-center p-3 border rounded-lg ${watermarkType === "corner"
                                ? "border-indigo-500 bg-indigo-50"
                                : "bg-white"
                            }`}
                    >
                        <ImageIcon size={20} />
                        <span className="text-xs">角落</span>
                    </button>
                </div>
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-500">
                        透明度
                    </label>
                    <span className="text-xs text-indigo-600">
                        {Math.round(watermarkOpacity * 100)}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 accent-indigo-600"
                />
            </div>
        </div>
    );
};

export default WatermarkPanel;
