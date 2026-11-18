import React from "react";
import { Type, Receipt as ReceiptIcon, TreeDeciduous, ArrowUpRight } from "lucide-react";

/**
 * 首頁元件
 * v3 大改造：拆掉實色綠 hero 與一體成型的大白卡，改成多片浮動玻璃
 * 面板，顏色只留在圖示上；開發中的需求表單／角色設定已移除。
 * v10：圖示改墨色中性 chip（自用不分品牌色），贊助鈕改為網站連結。
 * v12：關於區改用網站關於頁自介原文；主色 emerald 全退役改墨色系。
 * v15：關於區補筆名「謊花」；噗浪／Threads 按鈕接上真連結（原為 href="#" 佔位）。
 * @param {function} onSelectTool - 切換頁面的 callback
 * @param {string} globalAuthor - 全域筆名
 * @param {function} setGlobalAuthor - 設定全域筆名的方法
 */
const HomePage = ({ onSelectTool, globalAuthor, setGlobalAuthor }) => {
  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-8 pb-10 font-sans text-gray-800">
      <div className="max-w-md w-full space-y-4">
        {/* 1. 標題：浮動玻璃面板 */}
        <header className="glass-panel rounded-[28px] px-6 py-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white/50 border border-white/70 flex items-center justify-center mx-auto mb-4">
            <TreeDeciduous className="text-gray-700" size={32} />
          </div>
          <h1 className="text-[28px] leading-tight font-bold text-gray-900 mb-1">
            文手工具箱
          </h1>
          <p className="text-sm text-gray-500">
            專為文手打造的生產力工具
          </p>
        </header>

        {/* 2. 全域設定區 */}
        <section className="glass-panel rounded-3xl p-5">
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
            className="glass-input w-full p-3 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none transition-all placeholder:text-gray-300"
            placeholder="請在此輸入筆名..."
          />
        </section>

        {/* 3. 工具選單：兩張直接浮在背景上的玻璃卡 */}
        <div className="grid grid-cols-2 gap-3">
          {/* 工具 A: 排版助手 */}
          <button
            onClick={() => onSelectTool("watermark")}
            className="glass-panel glass-btn flex flex-col items-center justify-center p-5 rounded-3xl group"
          >
            <div className="w-11 h-11 bg-white/50 border border-white/70 text-gray-700 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Type size={20} />
            </div>
            <span className="text-sm font-bold text-gray-800">排版助手</span>
          </button>

          {/* 工具 B: 收據產生器 */}
          <button
            onClick={() => onSelectTool("receipt")}
            className="glass-panel glass-btn flex flex-col items-center justify-center p-5 rounded-3xl group"
          >
            <div className="w-11 h-11 bg-white/50 border border-white/70 text-gray-700 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ReceiptIcon size={20} />
            </div>
            <span className="text-sm font-bold text-gray-800">
              收據產生器
            </span>
          </button>
        </div>

        {/* 4. 關於與贊助區 */}
        <section className="glass-panel rounded-3xl p-5">
          <div className="flex items-baseline gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900">謊花</h3>
            <span className="text-[10px] font-bold tracking-widest text-gray-400">
              關於作者
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Z世代佛系文手。台灣人。
            <br />
            <br />
            需要在不愁吃穿無病無痛心靈健全的情況下才能寫文，然而不幸是個有慢性背痛的社畜（三節獎金拿五百塊的那種），總而言之寫文很慢。
            <br />
            <br />
            有在接委託，原創努力中。
          </p>

          <div className="flex gap-3">
            <a
              href="https://www.plurk.com/adabana00121"
              target="_blank"
              rel="noreferrer"
              className="glass-well glass-btn flex-1 py-2 px-3 hover:bg-white/80 text-gray-700 rounded-full text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>我的噗浪</span>
            </a>

            <a
              href="https://www.threads.net/@adabanipal.library"
              target="_blank"
              rel="noreferrer"
              className="glass-well glass-btn flex-1 py-2 px-3 hover:bg-white/80 text-gray-700 rounded-full text-xs font-bold text-center transition-colors flex items-center justify-center gap-2"
            >
              <span>我的Threads</span>
            </a>
          </div>

          <a
            href="https://adabanipal.com"
            target="_blank"
            rel="noreferrer"
            className="glass-well glass-btn mt-3 w-full py-3 px-4 text-gray-700 rounded-full text-sm font-bold text-center transition-all flex items-center justify-center gap-2 group"
          >
            去我的網站看看
            <ArrowUpRight
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
          </a>
        </section>

        {/* 5. 頁尾：素字，不再是白條 */}
        <p className="text-center text-[10px] text-gray-400 pt-1">
          © 2025 Adabanipal Library • Free & Open Source
        </p>
      </div>
    </div>
  );
};

export default HomePage;
