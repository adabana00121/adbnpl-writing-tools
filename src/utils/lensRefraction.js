// 透鏡式折射（v9，B 方案）：取代 v8 的均勻噪點位移（#lg-thick）。
// 原理：真透鏡中心幾乎不位移、扭曲集中在邊緣。按每個 .glass-panel
// 的實際尺寸與圓角，用圓角矩形 SDF 生成一張位移圖（中心灰 128＝
// 不位移、往邊緣漸強、方向朝中心＝放大感），餵給 feDisplacementMap。
// 只有 Chromium 能把 url() 濾鏡用在 backdrop-filter 上，非 Chromium
// 直接不做，面板走 CSS 的 blur 退路。
// 注意：只碰 .glass-panel（側欄／首頁面板），預覽與匯出節點內沒有
// .glass-panel，匯出圖不受影響。

const BAND = 64; // 邊緣帶寬度 px：超過此深度就完全不位移
const SCALE = 36; // feDisplacementMap scale：邊緣最大位移約 scale/2 px
const MAX_PIXELS = 250000; // 位移圖解析度上限，超過就降解析（feImage 會拉伸）

function isChromium() {
  const brands = navigator.userAgentData?.brands || [];
  return (
    !!window.chrome ||
    brands.some((b) => /Chromium|Google Chrome|Microsoft Edge/i.test(b.brand))
  );
}

function buildMap(w, h, r) {
  let scale = 1;
  if (w * h > MAX_PIXELS) scale = Math.sqrt(MAX_PIXELS / (w * h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");
  const img = ctx.createImageData(cw, ch);
  const d = img.data;
  const cx = cw / 2;
  const cy = ch / 2;
  const hx = cw / 2 - r * scale;
  const hy = ch / 2 - r * scale;
  const band = BAND * scale;
  const rr = r * scale;
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      // 圓角矩形 SDF（<=0 在內部，0 在邊緣）
      const qx = Math.abs(px - cx) - hx;
      const qy = Math.abs(py - cy) - hy;
      const ax = Math.max(qx, 0);
      const ay = Math.max(qy, 0);
      const sd =
        Math.sqrt(ax * ax + ay * ay) + Math.min(Math.max(qx, qy), 0) - rr;
      const inward = -sd; // 離邊緣向內的深度
      const t = 1 - Math.min(inward / band, 1); // 邊緣 1 → 帶外 0
      const f = t * t; // 二次方：越靠邊緣加速越快
      // 方向：朝中心（放大感）
      let dx = cx - px;
      let dy = cy - py;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      dx /= len;
      dy /= len;
      const amp = 127 * f;
      const i = (y * cw + x) * 4;
      d[i] = 128 + dx * amp;
      d[i + 1] = 128 + dy * amp;
      d[i + 2] = 128;
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas.toDataURL("image/png");
}

let defs = null;
let uid = 0;
const attached = new WeakMap(); // el -> { id, w, h, r }

function attachPanel(el) {
  const rect = el.getBoundingClientRect();
  const w = Math.round(rect.width);
  const h = Math.round(rect.height);
  if (w < 4 || h < 4) return;
  const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  const prev = attached.get(el);
  if (
    prev &&
    Math.abs(prev.w - w) <= 2 &&
    Math.abs(prev.h - h) <= 2 &&
    prev.r === r
  )
    return;
  const id = prev ? prev.id : `lens-panel-${uid++}`;
  const old = document.getElementById(id);
  if (old) old.remove();
  const SVGNS = "http://www.w3.org/2000/svg";
  const filter = document.createElementNS(SVGNS, "filter");
  filter.setAttribute("id", id);
  filter.setAttribute("filterUnits", "userSpaceOnUse");
  filter.setAttribute("x", "0");
  filter.setAttribute("y", "0");
  filter.setAttribute("width", String(w));
  filter.setAttribute("height", String(h));
  filter.setAttribute("color-interpolation-filters", "sRGB");
  const feImage = document.createElementNS(SVGNS, "feImage");
  feImage.setAttribute("href", buildMap(w, h, r));
  feImage.setAttribute("x", "0");
  feImage.setAttribute("y", "0");
  feImage.setAttribute("width", String(w));
  feImage.setAttribute("height", String(h));
  feImage.setAttribute("preserveAspectRatio", "none");
  feImage.setAttribute("result", "map");
  const disp = document.createElementNS(SVGNS, "feDisplacementMap");
  disp.setAttribute("in", "SourceGraphic");
  disp.setAttribute("in2", "map");
  disp.setAttribute("scale", String(SCALE));
  disp.setAttribute("xChannelSelector", "R");
  disp.setAttribute("yChannelSelector", "G");
  filter.appendChild(feImage);
  filter.appendChild(disp);
  defs.appendChild(filter);
  // 濾鏡只做位移，blur／saturate 由 CSS 函式串接（Chrome 對此組合最穩定）
  el.style.webkitBackdropFilter = `blur(6px) url(#${id}) saturate(1.6)`;
  el.style.backdropFilter = `blur(6px) url(#${id}) saturate(1.6)`;
  attached.set(el, { id, w, h, r });
}

export function initLensRefraction() {
  if (typeof window === "undefined" || !isChromium()) return;
  if (defs) return; // 只初始化一次
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "0");
  svg.setAttribute("height", "0");
  svg.setAttribute("aria-hidden", "true");
  svg.style.position = "absolute";
  defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  svg.appendChild(defs);
  document.body.appendChild(svg);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) attachPanel(entry.target);
  });
  const seen = new WeakSet();
  const scan = (root) => {
    if (root.classList && root.classList.contains("glass-panel")) {
      attachPanel(root);
      if (!seen.has(root)) {
        seen.add(root);
        resizeObserver.observe(root);
      }
    }
    const panels = root.querySelectorAll
      ? root.querySelectorAll(".glass-panel")
      : [];
    panels.forEach((el) => {
      attachPanel(el);
      if (!seen.has(el)) {
        seen.add(el);
        resizeObserver.observe(el);
      }
    });
  };
  scan(document);
  // 換頁時 React 會掛上新的面板，MutationObserver 補掛
  let pending = false;
  new MutationObserver(() => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      scan(document);
    });
  }).observe(document.body, { childList: true, subtree: true });
}
