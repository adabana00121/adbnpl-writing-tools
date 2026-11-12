import React from "react";
import {
  Type,
  Receipt as ReceiptIcon,
  FileText,
  User,
  TreeDeciduous,
} from "lucide-react";

/**
 * 首頁元件
 * @param {function} onSelectTool - 切換頁面的 callback
 * @param {string} globalAuthor - 全域筆名
 * @param {function} setGlobalAuthor - 設定全域筆名的方法
 */
const HomePage = ({ onSelectTool, globalAuthor, setGlobalAuthor }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans text-gray-800">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
        {/* 1. 頂部標題區 */}
        <div className="bg-green-500 p-8 text-center relative overflow-hidden">
          {/* 背景裝飾 */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-40 h-40 bg-white rounded-full mix-blend-overlay blur-xl"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-40 h-40 bg-white rounded-full mix-blend-overlay blur-xl"></div>
          </div>

          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-md relative z-10">
            <TreeDeciduous className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1 relative z-10">
            文手工具箱
          </h1>
          <p className="text-green-200 text-sm relative z-10">
            專為文手打造的生產力工具
          </p>
        </div>

        <div className="p-6 space-y-8">
          {/* 2. 全域設定區 */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              您的筆名{" "}
              <span className="font-normal text-gray-400 normal-case">
                (全站共用)
              </span>
            </label>
            <input
              type="text"
              value={globalAuthor}
              onChange={(e) => setGlobalAuthor(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-gray-300"
              placeholder="請在此輸入筆名..."
            />
          </div>

          {/* 3. 工具選單區 (4格) */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              工具列表
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* 工具 A: 排版助手 */}
              <button
                onClick={() => onSelectTool("watermark")}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group bg-white"
              >
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Type size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  排版助手
                </span>
              </button>

              {/* 工具 B: 收據產生器 */}
              <button
                onClick={() => onSelectTool("receipt")}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 hover:shadow-md transition-all group bg-white"
              >
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <ReceiptIcon size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  收據產生器
                </span>
              </button>

              {/* 工具 C: 需求表單 (開發中) */}
              <button
                onClick={() => onSelectTool("commission-form")}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 hover:shadow-md transition-all group bg-white opacity-60 cursor-not-allowed"
                disabled
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2">
                  <FileText size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  需求表單(開發中)
                </span>
              </button>

              {/* 工具 D: 角色設定 (開發中) */}
              <button
                onClick={() => onSelectTool("character-card")}
                className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 hover:shadow-md transition-all group bg-white opacity-60 cursor-not-allowed"
                disabled
              >
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2">
                  <User size={20} />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  角色設定(開發中)
                </span>
              </button>
            </div>
          </div>

          {/* 4. 關於與贊助區 */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-2">關於作者</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">
              嗨！我是謊花，希望這個小工具可以幫助跟我一樣的迷你創作者。
              <br />
              基礎架構由Gemini生成。目前使用Vercel免費方案，流量有限，請盡量不要濫用（✿◡‿◡）
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>我的噗浪</span>
              </a>

              <a
                href="#"
                className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
              >
                <span>我的Threads</span>
              </a>
            </div>

            <a
              href="#"
              className="mt-3 w-full py-3 px-4 bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700 border border-pink-200 rounded-lg text-sm font-bold text-center transition-all flex items-center justify-center gap-2 group"
            >
              <span className="group-hover:scale-110 transition-transform">
                🥤
              </span>
              請作者喝杯手搖 (贊助)
            </a>
          </div>
        </div>

        {/* 5. 頁尾版權宣告 */}
        <div className="bg-gray-50 p-4 text-center text-[10px] text-gray-400 border-t border-gray-100">
          © 2025 Adabanipal Library • Free & Open Source
        </div>
      </div>
    </div>
  );
};

export default HomePage;
