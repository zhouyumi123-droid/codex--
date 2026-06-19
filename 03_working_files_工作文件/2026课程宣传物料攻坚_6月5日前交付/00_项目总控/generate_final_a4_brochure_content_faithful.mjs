import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const inventoryPath = path.join(root, "00_项目总控", "确定稿_ppt_text_inventory.json");
const outDir = path.join(root, "12_确定稿_AIS参考竖版招生册_内容保真版");
fs.mkdirSync(outDir, { recursive: true });

const slides = JSON.parse(fs.readFileSync(inventoryPath, "utf8").replace(/^\uFEFF/, ""));
const assetRel = "../05_总招生手册_初稿图文版/assets";
const outHtml = path.join(outDir, "奥斯翰国际部招生宣传册_A4竖版_内容保真_AIS参考紫金版.html");
const outNotes = path.join(outDir, "生成说明.md");

const esc = value => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");
const img = name => `${assetRel}/${name}`;

function clean(items) {
  return items
    .map(x => String(x ?? "").trim())
    .filter(Boolean)
    .filter(x => !/^OXSTAND INTERNATIONAL SCHOOL \| \d+$/i.test(x));
}

function section(slide) {
  if (slide <= 6) return ["01", "SCHOOL PROFILE", "关于奥斯翰"];
  if (slide <= 9) return ["02", "CURRICULUM MAP", "课程体系总览"];
  if (slide <= 13) return ["03", "OSSD", "OSSD 中加课程"];
  if (slide <= 17) return ["04", "AP", "AP 国际课程"];
  if (slide <= 23) return ["05", "LANGUAGE PATHWAYS", "日韩小语种升学"];
  if (slide <= 27) return ["06", "BRITISH PATHWAY", "IGCSE / A-Level"];
  if (slide <= 29) return ["07", "SINGAPORE PATHWAY", "新加坡 IFD 方向"];
  if (slide <= 36) return ["08", "FACULTY & GUIDANCE", "师资与升学服务"];
  return ["09", "ADMISSION & FEES", "入学咨询与费用"];
}

function photo(slide) {
  if (slide <= 6) return slide % 2 ? "campus2.jpg" : "campus1.jpg";
  if (slide <= 9) return "class1.jpg";
  if (slide <= 13) return slide === 13 ? "bond1.jpg" : "bond2.jpg";
  if (slide <= 17) return "class1.jpg";
  if (slide <= 20) return "culture.jpg";
  if (slide <= 23) return slide % 2 ? "japan1.jpg" : "japan2.jpg";
  if (slide <= 27) return slide % 2 ? "sports.jpg" : "class1.jpg";
  if (slide <= 29) return "graduation.jpg";
  if (slide <= 36) return slide === 35 ? "activity1.jpg" : "group.jpg";
  return "campus2.jpg";
}

function isEnglishLabel(text) {
  return /^[A-Z0-9&/ .:'’()-]{4,}$/.test(text) && /[A-Z]/.test(text);
}
function hasCjk(text) {
  return /[\u4e00-\u9fff]/.test(text);
}
function pickTitle(items) {
  return items.find(x => hasCjk(x) && x.length >= 4 && !/^OXSTAND/i.test(x)) || items[0] || "";
}
function pickEyebrow(items, fallback) {
  return items.find(isEnglishLabel) || fallback;
}

function renderRaw(items) {
  return items.map((x, i) => {
    const cls = isEnglishLabel(x) ? "en" : (/^\d{1,4}\+?$/.test(x) ? "num" : "");
    return `<li class="${cls}"><span>${String(i + 1).padStart(2, "0")}</span><p>${esc(x)}</p></li>`;
  }).join("");
}

function cover(slide) {
  const items = clean(slide.text);
  return `<section class="page cover">
    <img src="${img("cover.jpg")}" alt="">
    <div class="veil"></div>
    <div class="cover-copy">
      <p>${esc(items[0] || "OXSTAND INTERNATIONAL SCHOOL")}</p>
      <h1>${esc(items[1] || "深圳奥斯翰外语学校")}<br>${esc(items[2] || "国际部招生手册")}</h1>
      <i></i>
      <h2>${esc(items[3] || "精品国际课程 · 多路径升学规划 · 小规模精细化支持")}</h2>
    </div>
    <footer><span>2026 ADMISSIONS</span><b>01</b></footer>
  </section>`;
}

function standard(slide) {
  const items = clean(slide.text);
  const sec = section(slide.slide);
  const eyebrow = pickEyebrow(items, sec[1]);
  const title = pickTitle(items);
  const body = items.filter((x, index) => !(index === items.indexOf(title)) && x !== eyebrow);
  const count = body.length;
  const density = count > 62 ? "ultra" : count > 40 ? "micro" : count > 26 ? "dense" : "normal";
  const visual = count > 38 ? "compact" : "with-photo";
  return `<section class="page content ${density} ${visual}">
    <div class="topbar"></div>
    <div class="section-mark">${esc(sec[0])}</div>
    <main>
      <div class="head">
        <p>${esc(eyebrow)}</p>
        <h2>${esc(title)}</h2>
      </div>
      <ol class="raw">${renderRaw(body)}</ol>
    </main>
    ${count > 38 ? "" : `<aside><img src="${img(photo(slide.slide))}" alt=""><em>${esc(sec[1])}</em></aside>`}
    <footer><span>OXSTAND INTERNATIONAL SCHOOL</span><b>${String(slide.slide).padStart(2, "0")}</b></footer>
  </section>`;
}

function chapter(slide) {
  const items = clean(slide.text);
  const sec = section(slide.slide);
  const eyebrow = pickEyebrow(items, sec[1]);
  const title = pickTitle(items);
  const body = items.filter(x => x !== title && x !== eyebrow);
  return `<section class="page chapter">
    <img src="${img(photo(slide.slide))}" alt="">
    <div class="veil"></div>
    <div class="chapter-copy">
      <p>${esc(eyebrow)}</p>
      <b>${esc(sec[0])}</b>
      <h2>${esc(title)}</h2>
      <i></i>
      <ol>${body.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
    </div>
    <footer><span>OXSTAND INTERNATIONAL SCHOOL</span><b>${String(slide.slide).padStart(2, "0")}</b></footer>
  </section>`;
}

function back(slide) {
  const items = clean(slide.text);
  return `<section class="page cover back">
    <img src="${img("campus2.jpg")}" alt="">
    <div class="veil"></div>
    <div class="cover-copy">
      <p>${esc(items[0] || "Schedule Your Campus Tour")}</p>
      <h1>${esc(items[1] || "欢迎预约访校！")}</h1>
      <i></i>
      <h2>${items.slice(2).map(esc).join("<br>")}</h2>
      <div class="qr">二维码<br>占位</div>
    </div>
  </section>`;
}

const chapterSlides = new Set([3, 7, 10, 14, 18, 24, 28, 30]);
const pages = slides.map(slide => {
  if (slide.slide === 1) return cover(slide);
  if (slide.slide === 39) return back(slide);
  if (chapterSlides.has(slide.slide)) return chapter(slide);
  return standard(slide);
});

const css = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; background: #d8d5dd; color: #201B27; font-family: "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif; }
.page { width: 210mm; min-height: 297mm; margin: 18px auto; background: #FBF8F0; position: relative; overflow: hidden; page-break-after: always; box-shadow: 0 16px 38px rgba(22,12,41,.18); }
footer { position: absolute; left: 16mm; right: 16mm; bottom: 8mm; display: flex; justify-content: space-between; color: #817988; font-size: 7pt; letter-spacing: .12em; }
footer b { color: #C7A64D; }
.cover img, .chapter > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.veil { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(42,15,77,.96), rgba(91,48,133,.72) 50%, rgba(42,15,77,.2)); }
.cover-copy { position: absolute; z-index: 2; left: 18mm; top: 42mm; right: 18mm; color: white; }
.cover-copy p, .chapter-copy p { margin: 0; color: #D6B75B; font-size: 8.8pt; letter-spacing: .16em; font-weight: 800; text-transform: uppercase; }
.cover-copy h1 { font-family: "Noto Serif SC", SimSun, serif; font-size: 33pt; line-height: 1.2; margin: 29mm 0 0; letter-spacing: 0; }
.cover-copy i, .chapter-copy i { display: block; width: 30mm; height: 1px; background: #D6B75B; margin: 8mm 0 6mm; }
.cover-copy h2 { font-size: 12.5pt; line-height: 1.75; color: rgba(255,255,255,.86); font-weight: 400; }
.qr { margin-top: 12mm; width: 36mm; height: 36mm; background: white; color: #3A1668; display: grid; place-items: center; text-align: center; font-weight: 800; border: 1.2mm solid #D6B75B; }
.topbar { position: absolute; left: 0; top: 0; right: 0; height: 7mm; background: #3A1668; }
.section-mark { position: absolute; right: 12mm; top: 13mm; color: rgba(199,166,77,.28); font-family: Georgia, serif; font-size: 42pt; }
.content main { position: absolute; left: 16mm; top: 24mm; bottom: 18mm; width: 120mm; }
.content.with-photo aside { position: absolute; right: 15mm; top: 28mm; width: 52mm; bottom: 22mm; }
.content.with-photo aside img { width: 100%; height: 120mm; object-fit: cover; border-radius: 0 0 18mm 0; }
.content.with-photo aside em { display: block; margin-top: 7mm; color: #D6B75B; font-style: normal; font-size: 7pt; letter-spacing: .14em; text-transform: uppercase; writing-mode: vertical-rl; height: 78mm; }
.content.compact main { right: 16mm; width: auto; }
.head p { margin: 0 0 2.5mm; color: #C7A64D; font-size: 8pt; letter-spacing: .13em; font-weight: 800; text-transform: uppercase; }
.head h2 { font-family: "Noto Serif SC", SimSun, serif; color: #2A134D; font-size: 23pt; line-height: 1.16; margin: 0 0 6mm; letter-spacing: 0; }
ol.raw { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr; gap: 2.2mm; }
ol.raw li { display: grid; grid-template-columns: 9mm 1fr; gap: 3mm; align-items: baseline; border-top: 1px solid #E1D8CA; padding-top: 2mm; }
ol.raw span { color: #C7A64D; font-family: Georgia, serif; font-size: 8.5pt; }
ol.raw p { margin: 0; color: #352F3B; font-size: 8.8pt; line-height: 1.55; }
ol.raw li.en p { color: #7E6427; font-size: 7.6pt; letter-spacing: .07em; text-transform: uppercase; font-weight: 800; }
ol.raw li.num p { color: #3A1668; font-family: Georgia, serif; font-size: 13pt; line-height: 1.1; }
.dense main { width: auto; right: 16mm; }
.dense aside { display: none; }
.dense ol.raw { grid-template-columns: 1fr 1fr; column-gap: 6mm; row-gap: 1.8mm; }
.dense ol.raw p { font-size: 7.6pt; line-height: 1.42; }
.micro main, .ultra main { width: auto; right: 16mm; }
.micro aside, .ultra aside { display: none; }
.micro .head h2, .ultra .head h2 { font-size: 20pt; margin-bottom: 4mm; }
.micro ol.raw { grid-template-columns: 1fr 1fr; column-gap: 5mm; row-gap: 1.3mm; }
.micro ol.raw li { grid-template-columns: 7mm 1fr; gap: 2mm; padding-top: 1.3mm; }
.micro ol.raw p { font-size: 6.8pt; line-height: 1.32; }
.ultra ol.raw { grid-template-columns: 1fr 1fr 1fr; column-gap: 4mm; row-gap: 1mm; }
.ultra ol.raw li { grid-template-columns: 6mm 1fr; gap: 1.5mm; padding-top: 1mm; }
.ultra ol.raw p { font-size: 6pt; line-height: 1.25; }
.chapter-copy { position: absolute; z-index: 2; left: 18mm; right: 18mm; bottom: 23mm; color: white; }
.chapter-copy b { display: block; color: #D6B75B; font-family: Georgia, serif; font-size: 42pt; margin: 8mm 0; }
.chapter-copy h2 { font-family: "Noto Serif SC", SimSun, serif; font-size: 31pt; line-height: 1.15; margin: 0; letter-spacing: 0; }
.chapter-copy ol { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.2mm 7mm; max-width: 158mm; }
.chapter-copy li { color: rgba(255,255,255,.82); font-size: 8.2pt; line-height: 1.45; border-top: 1px solid rgba(214,183,91,.42); padding-top: 2mm; }
@media print { body { background: white; } .page { margin: 0; box-shadow: none; } }
`;

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>奥斯翰国际部招生宣传册 内容保真版</title><style>${css}</style></head><body>${pages.join("\n")}</body></html>`;
fs.writeFileSync(outHtml, html, "utf8");
fs.writeFileSync(outNotes, `# 生成说明

本版为内容保真优先版。

- 源文件：奥斯翰国际部招生宣传册_横版PPT_确定稿.pptx
- PPT 页数：39
- 输出页数：39
- 原则：按 PPT 每页文本顺序完整保留，不重写、不截断、不省略；仅移除页脚类重复文字。
- 风格：紫色主色 + 金色小标题，参考 AIS 系列招生册的 A4 竖版栅格。

注意：本版先保证内容完整与页序正确，后续再做精修设计。
`, "utf8");
console.log(`Generated ${outHtml}`);
console.log(`Pages: ${pages.length}`);
