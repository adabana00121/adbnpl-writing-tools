import React, { forwardRef } from "react";
import {
  Receipt as ReceiptIcon,
  User,
  Calendar,
  Terminal,
  Wifi,
  Battery,
  ShieldCheck,
  Cpu,
  Feather,
} from "lucide-react";
import { THANK_YOU_MESSAGES } from "./config";

// --- 輔助裝飾元件 ---

const JaggedDiv = ({ position, color }) => {
  const encodedColor = encodeURIComponent(color);
  const svgData = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='10' viewBox='0 0 20 10'%3E%3Cpolygon points='0,10 10,0 20,10' fill='${encodedColor}'/%3E%3C/svg%3E`;

  return (
    <div
      className="absolute left-0 w-full z-20 pointer-events-none"
      style={{
        height: "5px",
        backgroundImage: `url("${svgData}")`,
        backgroundRepeat: "repeat-x",
        backgroundSize: "10px 5px",
        [position]: "-4.5px",
        transform: position === "bottom" ? "rotate(180deg)" : "none",
      }}
    />
  );
};

const CheckerboardDiv = ({ position, color1 = "#000", color2 = "#fff" }) => {
  const svgData = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect x='0' y='0' width='10' height='10' fill='${encodeURIComponent(
    color1
  )}'/%3E%3Crect x='10' y='0' width='10' height='10' fill='${encodeURIComponent(
    color2
  )}'/%3E%3Crect x='0' y='10' width='10' height='10' fill='${encodeURIComponent(
    color2
  )}'/%3E%3Crect x='10' y='10' width='10' height='10' fill='${encodeURIComponent(
    color1
  )}'/%3E%3C/svg%3E`;

  return (
    <div
      className="absolute left-0 w-full z-20"
      style={{
        height: "30px", // 高度 30px
        [position]: "0",
        backgroundImage: `url("${svgData}")`,
        backgroundRepeat: "repeat",
        backgroundSize: "29px 29px",
        borderTop: position === "bottom" ? `2px solid ${color1}` : "none",
        borderBottom: position === "top" ? `2px solid ${color1}` : "none",
      }}
    />
  );
};

// --- 各風格渲染元件 ---

export const GuestCheck = forwardRef(
  ({ data, items, totalPrice, theme, t, lang }, ref) => (
    // 修正：加入 minWidth: "360px" 和 shrink-0 防止手機版寬度被擠壓
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: "360px", minWidth: "360px" }}
    >
      <div
        className={`w-full min-h-[600px] flex flex-col relative shadow-xl ${theme.bg} ${theme.text} ${theme.font} leading-[1.5]`}
        style={{
          background: `linear-gradient(to bottom, #e0f7fa 160px, transparent 160px), repeating-linear-gradient(0deg, transparent, transparent 29px, #b2dfdb 30px)`,
          backgroundColor: "#e0f7fa",
        }}
      >
        <div className="p-[16px] pb-[8px] border-b-[2px] border-[#005c4b]">
          <div className="flex justify-between items-end mb-[8px]">
            <div
              className="text-[36px] font-black transform scale-y-110 leading-none"
              style={{
                fontFamily: "Anton, sans-serif",
                letterSpacing: "0.5px",
              }}
            >
              {t.guest_check}
            </div>
            <div className="font-bold text-[18px] opacity-80 text-red-700">
              No. {Date.now().toString().slice(-6)}
            </div>
          </div>
          <div className="grid grid-cols-4 border-[2px] border-[#005c4b] bg-white text-center text-[14px] font-bold">
            <div className="border-r-[2px] border-[#005c4b] p-[4px]">
              <div className="text-[10px] uppercase opacity-60 scale-90">
                {t.date}
              </div>
              <div>{data.date}</div>
            </div>
            <div className="border-r-[2px] border-[#005c4b] p-[4px]">
              <div className="text-[10px] uppercase opacity-60 scale-90">
                {t.gc_table}
              </div>
              <div className="font-receipt-handwriting text-blue-700 text-[20px]">
                {data.table}
              </div>
            </div>
            <div className="border-r-[2px] border-[#005c4b] p-[4px]">
              <div className="text-[10px] uppercase opacity-60 scale-90">
                {t.gc_guests}
              </div>
              <div className="font-receipt-handwriting text-blue-700 text-[20px]">
                {data.guests}
              </div>
            </div>
            <div className="p-[4px]">
              <div className="text-[10px] uppercase opacity-60 scale-90">
                {t.gc_server}
              </div>
              <div className="font-receipt-handwriting text-blue-700 truncate">
                {data.issuer}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 relative" style={{ lineHeight: "30px" }}>
          <div className="px-[24px] py-0 min-h-[400px]">
            <div className="flex justify-between items-baseline border-b border-transparent h-[30px]">
              <span
                className="font-bold mr-[8px] text-[14px] uppercase opacity-70"
                style={{ transform: "translateY(4px)" }}
              >
                {t.client}:
              </span>
              <span className="flex-1 font-receipt-handwriting text-[20px] text-blue-800">
                {data.client}
              </span>
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-baseline h-[30px] text-[18px] font-bold"
              >
                <span className="flex-1 truncate pr-[8px] flex items-baseline">
                  {item.name}{" "}
                  <span className="text-[12px] ml-[8px] opacity-60 whitespace-nowrap">
                    x{item.count}
                  </span>
                </span>
                <span className="w-[80px] text-right whitespace-nowrap">
                  ${item.price}
                </span>
              </div>
            ))}
            {data.note && (
              <div className="mt-[16px] h-[60px] leading-[30px] font-receipt-handwriting text-blue-600 text-[14px] transform -rotate-1 opacity-80">
                * {data.note}
              </div>
            )}
          </div>
          <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-red-300 opacity-50 pointer-events-none"></div>
        </div>
        <div className="p-[16px] pt-[8px] border-t-[2px] border-[#005c4b] bg-[#e6f4f1]">
          <div className="flex justify-end gap-[12px] items-end">
            <div className="text-right space-y-[4px]">
              <div className="text-[12px] font-bold uppercase tracking-wider">
                {t.tax}
              </div>
              <div className="text-[20px] font-black uppercase tracking-wider">
                {t.total}
              </div>
            </div>
            <div className="w-[128px]">
              <div className="border-b-[2px] border-[#005c4b] text-right px-[8px] font-receipt-mono text-[14px] mb-[4px]">
                -
              </div>
              <div className="bg-white border-[2px] border-[#005c4b] text-right px-[8px] py-[4px] text-[24px] font-bold font-receipt-mono text-red-600 whitespace-nowrap">
                ${totalPrice.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="text-center mt-[24px] text-[14px] font-bold opacity-70 uppercase tracking-[0.2em]">
            {THANK_YOU_MESSAGES.guest_check[lang]}
          </div>
        </div>
      </div>
    </div>
  )
);

export const VintageReceipt = forwardRef(
  ({ data, items, totalPrice, theme, t, lang }, ref) => (
    // 修正：加入 minWidth: "360px" 和 shrink-0
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: "360px", minWidth: "360px" }}
    >
      <div
        className={`w-full min-h-[600px] flex flex-col relative shadow-xl p-[32px] ${theme.bg} ${theme.text} ${theme.font} ${theme.border} leading-relaxed`}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: theme.bgPattern }}
        ></div>

        <div className="flex justify-center mb-[24px]">
          <svg
            width="120"
            height="20"
            viewBox="0 0 120 20"
            className="opacity-50"
          >
            <path
              d="M0,10 Q30,20 60,10 T120,10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="text-center mb-[32px] relative z-10">
          <div
            className="font-receipt-cursive text-[60px] mb-[8px] leading-none"
            style={{ fontFamily: "'Pinyon Script', cursive" }}
          >
            {t.vintage_title}
          </div>
          <div className="text-[12px] uppercase tracking-[0.3em] opacity-60 border-t border-b border-current py-[4px] inline-block">
            No. {Date.now().toString().slice(-6)}
          </div>
        </div>

        <div className="flex justify-between text-[12px] uppercase tracking-wider mb-[32px] opacity-70 relative z-10 font-receipt-serif">
          <div className="text-left">
            <div>Date: {data.date}</div>
            <div>From: {data.issuer}</div>
          </div>
          <div className="text-right">
            <div>To: {data.client}</div>
          </div>
        </div>

        <div className="flex-1 relative z-10">
          <table className="w-full text-[14px] font-receipt-serif">
            <thead>
              <tr className="border-b border-current opacity-60">
                <th className="text-left pb-[8px] font-normal italic w-[40px]">
                  Qty
                </th>
                <th className="text-left pb-[8px] font-normal italic">
                  Description
                </th>
                <th className="text-right pb-[8px] font-normal italic w-[80px]">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 divide-opacity-30">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-[12px] opacity-70">{item.count}</td>
                  <td className="py-[12px]">{item.name}</td>
                  <td className="py-[12px] text-right whitespace-nowrap">
                    ${item.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-[32px] border-t-2 border-double border-current pt-[16px] relative z-10">
          <div className="flex justify-between items-end mb-[48px]">
            <div
              className="font-receipt-cursive text-[24px] opacity-60"
              style={{ fontFamily: "'Pinyon Script', cursive" }}
            >
              Total
            </div>
            <div className="text-[30px] font-receipt-serif font-bold whitespace-nowrap">
              ${totalPrice.toLocaleString()}
            </div>
          </div>

          {data.note && (
            <div className="text-center text-[12px] italic opacity-60 mb-[32px] font-receipt-serif">
              {data.note}
            </div>
          )}

          <div className="flex justify-center items-center gap-[8px] opacity-50">
            <Feather size={16} />
            <span className="text-[10px] uppercase tracking-widest">
              {THANK_YOU_MESSAGES.vintage[lang]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
);

export const WastelandReceipt = forwardRef(
  ({ data, items, totalPrice, t }, ref) => (
    // 修正：加入 minWidth: "360px" 和 shrink-0
    <div
      ref={ref}
      style={{ width: "360px", minWidth: "360px" }}
      className="relative shrink-0"
    >
      <div className="relative p-[4px] bg-[#0a0a0a] shadow-[0_0_20px_rgba(0,255,65,0.15)] rounded-sm">
        <div className="absolute inset-0 scanlines z-20 rounded-sm pointer-events-none"></div>
        <div className="w-full min-h-[600px] bg-[#0a0a0a] border-[2px] border-[#00ff41] p-[16px] flex flex-col font-receipt-tech text-[#00ff41] relative overflow-hidden rounded-sm leading-[1.4]">
          <div className="absolute top-0 left-0 w-[16px] h-[16px] border-t-[2px] border-l-[2px] border-[#00ff41]"></div>
          <div className="absolute top-0 right-0 w-[16px] h-[16px] border-t-[2px] border-r-[2px] border-[#00ff41]"></div>
          <div className="absolute bottom-0 left-0 w-[16px] h-[16px] border-b-[2px] border-l-[2px] border-[#00ff41]"></div>
          <div className="absolute bottom-0 right-0 w-[16px] h-[16px] border-b-[2px] border-r-[2px] border-[#00ff41]"></div>

          <div className="flex justify-between items-center border-b border-[#00ff41] border-opacity-50 pb-[8px] mb-[16px] text-[10px] leading-tight">
            <div className="flex items-center gap-[8px] whitespace-nowrap">
              <Terminal size={12} />
              <span>SYS.READY</span>
            </div>
            <div className="flex items-center gap-[12px]">
              <span className="animate-pulse whitespace-nowrap">● REC</span>
              <div className="flex items-center gap-[4px] whitespace-nowrap">
                <Wifi size={10} />
                <span>NET</span>
              </div>
              <div className="flex items-center gap-[4px] whitespace-nowrap">
                <Battery size={10} />
                <span>98%</span>
              </div>
            </div>
          </div>

          <div className="mb-[24px] text-center">
            <div className="inline-block border border-[#00ff41] px-[16px] py-[4px] mb-[8px] shadow-[0_0_10px_rgba(0,255,65,0.3)]">
              <h2 className="text-[20px] font-bold tracking-[0.2em] text-glow leading-none">
                TRANSACTION
              </h2>
            </div>
            <div className="flex justify-between text-[10px] opacity-80 mt-[4px] px-[8px] whitespace-nowrap">
              <span>ID: {Date.now().toString(16).toUpperCase()}</span>
              <span>{data.date}</span>
            </div>
          </div>

          <div className="mb-[24px] relative">
            <div className="text-[10px] mb-[4px] opacity-70 flex items-center gap-[4px] leading-tight">
              <User size={10} /> TARGET_CLIENT:
            </div>
            <div className="text-[18px] font-bold border-l-[2px] border-[#00ff41] pl-[12px] py-[4px] bg-[#003300] bg-opacity-30 text-glow whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
              {data.client}
            </div>
          </div>

          <div className="flex-1 space-y-[8px] mb-[24px] font-receipt-tech text-[14px] leading-tight">
            <div className="flex border-b border-[#00ff41] border-dashed pb-[4px] opacity-70 text-[10px] whitespace-nowrap">
              <span className="w-[32px]">IDX</span>
              <span className="flex-1">ITEM_DESC</span>
              <span className="w-[40px] text-right">QTY</span>
              <span className="w-[64px] text-right">UNIT</span>
            </div>
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-baseline hover:bg-[#00ff41] hover:text-black transition-colors px-[4px] -mx-[4px]"
              >
                <span className="w-[32px] opacity-60 text-[10px] whitespace-nowrap">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <span className="flex-1 truncate uppercase mr-[8px] whitespace-nowrap">
                  {item.name}
                </span>
                <span className="w-[40px] text-right opacity-80 whitespace-nowrap">
                  {item.count}
                </span>
                <span className="w-[64px] text-right whitespace-nowrap">
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t-[2px] border-[#00ff41] pt-[12px] mb-[24px]">
            <div className="flex justify-between items-end mb-[8px]">
              <div className="text-[10px] opacity-70 whitespace-nowrap">
                <div>&gt; SUMMATION_COMPLETE</div>
                <div>&gt; TAX_CALC: PENDING</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase mb-[4px] leading-tight">
                  Total Credits
                </div>
                <div className="text-[24px] font-bold text-glow bg-[#00ff41] text-black px-[8px] whitespace-nowrap">
                  ${totalPrice.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            {data.note && (
              <div className="mb-[16px] text-[10px] border border-[#00ff41] border-dashed p-[8px] opacity-80">
                <span className="bg-[#00ff41] text-black px-[4px] mr-[4px]">
                  NOTE
                </span>
                {data.note}
              </div>
            )}

            <div className="flex justify-between items-end text-[10px] opacity-60 border-t border-[#00ff41] border-opacity-30 pt-[8px] whitespace-nowrap">
              <div className="flex flex-col">
                <div className="flex items-center gap-[4px]">
                  <Cpu size={10} /> PROCESSOR: {data.issuer}
                </div>
                <div className="flex items-center gap-[4px]">
                  <ShieldCheck size={10} /> VERIFIED
                </div>
              </div>
              <div className="flex flex-col items-end gap-[4px]">
                <div className="h-[16px] flex gap-[1px]">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#00ff41]"
                      style={{
                        width: Math.random() > 0.5 ? "2px" : "1px",
                        opacity: Math.random() > 0.3 ? 1 : 0.5,
                      }}
                    ></div>
                  ))}
                </div>
                <div>END_OF_FILE</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
);

export const StandardReceipt = forwardRef(
  ({ data, items, totalPrice, theme, t, lang, style }, ref) => (
    // 修正：加入 minWidth: "360px" 和 shrink-0
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ width: "360px", padding: "12px 0", minWidth: "360px" }}
    >
      <div className={`relative ${theme.jagged ? "drop-shadow-lg" : ""}`}>
        {theme.jagged && <JaggedDiv position="top" color={theme.paperColor} />}
        <div
          className={`w-full min-h-[600px] p-[32px] flex flex-col relative ${
            theme.bg
          } ${theme.text} ${theme.font} ${theme.border} leading-normal ${
            !theme.jagged ? "shadow-2xl" : ""
          }`}
        >
          <div className="text-center mb-[24px] pb-[16px] border-b-[2px] border-current">
            <div className="flex items-center justify-center gap-[8px] mb-[8px] opacity-80">
              <ReceiptIcon size={24} />
            </div>
            <div className="text-[36px] font-bold tracking-widest uppercase">
              {t.title}
            </div>
            <div className="text-[12px] opacity-60 mt-[8px] tracking-wider font-receipt-mono">
              NO. {Date.now().toString().slice(-8)}
            </div>
          </div>
          <div className="flex-1 space-y-[24px]">
            <div>
              <div className="text-[12px] uppercase opacity-50">{t.client}</div>
              <div className="text-[20px] font-bold">{data.client}</div>
            </div>
            <div className="space-y-[8px]">
              <div className="flex text-[12px] uppercase opacity-50 border-b border-current pb-[4px]">
                <span className="flex-1">{t.item}</span>
                <span className="w-[64px] text-right">{t.price}</span>
              </div>
              {items.map((item) => (
                <div key={item.id} className="flex justify-between py-[4px]">
                  <span className="flex-1">
                    {item.name}{" "}
                    <small className="opacity-50">x{item.count}</small>
                  </span>
                  <span className="whitespace-nowrap">${item.price}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center text-[20px] font-bold pt-[16px] border-t-[2px] border-current">
              <span>{t.total}</span>
              <span className="whitespace-nowrap">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
            {data.note && (
              <div
                className={`text-[14px] italic opacity-60 text-center mt-[32px] ${
                  style === "wasteland" ? "font-receipt-mono" : ""
                }`}
              >
                {data.note}
              </div>
            )}
          </div>
          <div className="mt-[48px] text-center pt-[24px] opacity-80 border-t border-current">
            <div className="text-[14px] font-bold animate-pulse">
              {THANK_YOU_MESSAGES[style][lang]}
            </div>
            <div className="text-[12px] mt-[8px] opacity-50">
              Issued by {data.issuer}
            </div>
          </div>
        </div>
        {theme.jagged && (
          <JaggedDiv position="bottom" color={theme.paperColor} />
        )}
      </div>
    </div>
  )
);
