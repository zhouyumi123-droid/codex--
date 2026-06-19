import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const inventoryPath = path.join(root, "00_项目总控", "确定稿_ppt_text_inventory.json");
const outDir = path.join(root, "11_确定稿_AIS参考竖版招生册");
const assetDirRel = "../05_总招生手册_初稿图文版/assets";
fs.mkdirSync(outDir, { recursive: true });

const slides = JSON.parse(fs.readFileSync(inventoryPath, "utf8").replace(/^\uFEFF/, ""));

const outHtml = path.join(outDir, "奥斯翰国际部招生宣传册_A4竖版_AIS参考紫金版.html");
const outNotes = path.join(outDir, "生成说明.md");

const img = name => `${assetDirRel}/${name}`;
const esc = value => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const sectionBySlide = n => {
  if (n <= 6) return ["01", "SCHOOL PROFILE", "关于奥斯翰"];
  if (n <= 9) return ["02", "CURRICULUM MAP", "课程体系总览"];
  if (n <= 13) return ["03", "OSSD", "OSSD 中加课程"];
  if (n <= 17) return ["04", "AP", "AP 国际课程"];
  if (n <= 23) return ["05", "LANGUAGE PATHWAYS", "日韩小语种升学"];
  if (n <= 27) return ["06", "BRITISH PATHWAY", "IGCSE / A-Level"];
  if (n <= 29) return ["07", "SINGAPORE PATHWAY", "新加坡 IFD 方向"];
  if (n <= 36) return ["08", "FACULTY & GUIDANCE", "师资与升学服务"];
  return ["09", "ADMISSION & FEES", "入学咨询与费用"];
};

const photoBySlide = n => {
  if (n === 1) return "cover.jpg";
  if (n <= 6) return n % 2 ? "campus2.jpg" : "campus1.jpg";
  if (n <= 9) return "class1.jpg";
  if (n <= 13) return n === 13 ? "bond1.jpg" : "bond2.jpg";
  if (n <= 17) return "class1.jpg";
  if (n <= 20) return "culture.jpg";
  if (n <= 23) return n % 2 ? "japan1.jpg" : "japan2.jpg";
  if (n <= 27) return n % 2 ? "sports.jpg" : "class1.jpg";
  if (n <= 29) return "graduation.jpg";
  if (n <= 36) return n === 35 ? "activity1.jpg" : "group.jpg";
  return "campus2.jpg";
};

const removeNoise = (items, slideNo) => {
  const skip = new Set([
    "OXSTAND",
    "OXSTAND International Department",
    "学校公众号",
    "小程序二维码",
    "学校官网",
    "学校视频号",
  ]);
  return items
    .map(x => String(x ?? "").trim())
    .filter(Boolean)
    .filter(x => !skip.has(x))
    .filter(x => !/^OXSTAND INTERNATIONAL SCHOOL \| \d+$/i.test(x))
    .filter(x => !(slideNo !== 6 && /^[|｜]+$/.test(x)));
};

const isEnglishLabel = text => /^[A-Z0-9&/ .:'’()-]{4,}$/.test(text) && /[A-Z]/.test(text);
const isNumberLike = text => /^\d{1,4}(\+)?$/.test(text) || /^\d{1,2}$/.test(text);
const hasCjk = text => /[\u4e00-\u9fff]/.test(text);

function pickTitle(items, fallback) {
  const cn = items.find(x => hasCjk(x) && x.length >= 4 && !isNumberLike(x) && !/^第/.test(x));
  return cn || fallback || items.find(x => x.length > 2) || "";
}

function pickEyebrow(items, section) {
  return items.find(isEnglishLabel) || section[1];
}

function bodyItems(items, title, eyebrow) {
  return items.filter(x => x !== title && x !== eyebrow);
}

function pageShell(slideNo, cls, inner) {
  const section = sectionBySlide(slideNo);
  return `<section class="page ${cls}">
    <div class="page-band"></div>
    <div class="page-kicker">${esc(section[0])} / ${esc(section[1])}</div>
    ${inner}
    <footer><span>OXSTAND INTERNATIONAL SCHOOL</span><b>${String(slideNo).padStart(2, "0")}</b></footer>
  </section>`;
}

function cover(slide) {
  const items = removeNoise(slide.text, slide.slide);
  return `<section class="page cover">
    <img class="cover-photo" src="${img("cover.jpg")}" alt="">
    <div class="cover-overlay"></div>
    <div class="cover-copy">
      <p>OXSTAND INTERNATIONAL SCHOOL</p>
      <h1>深圳奥斯翰外语学校<br>国际部招生手册</h1>
      <div class="gold-line"></div>
      <h2>${esc(items[3] || "精品国际课程 · 多路径升学规划 · 小规模精细化支持")}</h2>
    </div>
    <div class="cover-foot">
      <span>2026 ADMISSIONS</span>
      <span>A4 PORTRAIT BROCHURE</span>
    </div>
  </section>`;
}

function contentsPage() {
  const entries = [
    ["01", "关于奥斯翰", "School Profile"],
    ["02", "课程体系总览", "Curriculum Map"],
    ["03", "OSSD 中加课程", "Ontario Secondary School Diploma"],
    ["04", "AP 国际课程", "Advanced Placement"],
    ["05", "日韩小语种升学", "KUPP / JUPP"],
    ["06", "IGCSE / A-Level", "British Pathway"],
    ["07", "新加坡 IFD 方向", "Singapore Pathway"],
    ["08", "师资与升学服务", "Faculty & Guidance"],
    ["09", "入学咨询与费用", "Admission & Fees"],
  ];
  return `<section class="page contents">
    <div class="page-band"></div>
    <div class="content-header">
      <p>CONTENTS</p>
      <h2>目录</h2>
    </div>
    <div class="contents-grid">
      ${entries.map(([no, zh, en]) => `<article><b>${no}</b><span><strong>${esc(zh)}</strong><em>${esc(en)}</em></span></article>`).join("")}
    </div>
    <footer><span>OXSTAND INTERNATIONAL SCHOOL</span><b>02</b></footer>
  </section>`;
}

function chapterPage(slide) {
  const items = removeNoise(slide.text, slide.slide);
  const section = sectionBySlide(slide.slide);
  const title = pickTitle(items, section[2]);
  const eyebrow = pickEyebrow(items, section);
  const deck = bodyItems(items, title, eyebrow).filter(x => !isNumberLike(x)).slice(0, 3).join(" ");
  return `<section class="page chapter">
    <img class="chapter-photo" src="${img(photoBySlide(slide.slide))}" alt="">
    <div class="chapter-overlay"></div>
    <div class="chapter-copy">
      <p>${esc(eyebrow)}</p>
      <b>${esc(section[0])}</b>
      <h2>${esc(title)}</h2>
      <div class="gold-line"></div>
      <h3>${esc(deck)}</h3>
    </div>
    <footer><span>OXSTAND INTERNATIONAL SCHOOL</span><b>${String(slide.slide).padStart(2, "0")}</b></footer>
  </section>`;
}

function makeLead(items) {
  return items.find(x => hasCjk(x) && x.length >= 24) || "";
}

function normalPage(slide, mode = "standard") {
  const items = removeNoise(slide.text, slide.slide);
  const section = sectionBySlide(slide.slide);
  const eyebrow = pickEyebrow(items, section);
  const title = pickTitle(items, section[2]);
  const rest = bodyItems(items, title, eyebrow)
    .filter(x => x !== section[0])
    .filter(x => x.length > 1);
  const lead = makeLead(rest);
  const chunks = rest.filter(x => x !== lead).slice(0, 34);
  const photo = photoBySlide(slide.slide);
  const dense = chunks.length > 22 ? " dense" : "";

  return pageShell(slide.slide, `${mode}${dense}`, `
    <div class="layout">
      <div class="main">
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h2>${esc(title)}</h2>
        ${lead ? `<p class="lead">${esc(lead)}</p>` : ""}
        <div class="text-flow">
          ${renderChunks(chunks)}
        </div>
      </div>
      <aside class="visual">
        <img src="${img(photo)}" alt="">
        <div class="section-no">${esc(section[0])}</div>
      </aside>
    </div>
  `);
}

function renderChunks(chunks) {
  const out = [];
  for (let i = 0; i < chunks.length; i++) {
    const current = chunks[i];
    const next = chunks[i + 1];
    if (isNumberLike(current) && next && hasCjk(next) && next.length < 18) {
      out.push(`<div class="mini"><b>${esc(current)}</b><span>${esc(next)}</span></div>`);
      i++;
    } else if (current.length <= 18 && hasCjk(current) && next && next.length >= 12) {
      out.push(`<article><h3>${esc(current)}</h3><p>${esc(next)}</p></article>`);
      i++;
    } else if (isEnglishLabel(current)) {
      out.push(`<p class="tagline">${esc(current)}</p>`);
    } else {
      out.push(`<p>${esc(current)}</p>`);
    }
  }
  return out.join("");
}

function mapPage(slide) {
  const items = removeNoise(slide.text, slide.slide);
  const cards = [];
  const courseNames = ["OSSD", "AP", "日本留学课 / 韩国留学课", "IGCSE / A-Level", "新加坡 IFD"];
  for (const name of courseNames) {
    const idx = items.findIndex(x => x === name || x.includes(name));
    if (idx >= 0) {
      cards.push(items.slice(idx, idx + 6));
    }
  }
  return pageShell(slide.slide, "map", `
    <div class="content-wide">
      <p class="eyebrow">CURRICULUM MAP</p>
      <h2>奥斯翰国际课程地图</h2>
      <p class="lead">先看目标方向，再看考试体系；先看学生基础，再设计三年节奏。</p>
      <div class="map-grid">
        ${cards.map(card => `<article><b>${esc(card[0])}</b>${card.slice(1).map(x => `<p>${esc(x)}</p>`).join("")}</article>`).join("")}
      </div>
    </div>
  `);
}

function timelinePage(slide) {
  const items = removeNoise(slide.text, slide.slide);
  const pairs = [];
  for (let i = 0; i < items.length; i++) {
    if (/^(19|20)\d{2}$/.test(items[i]) && items[i + 1]) {
      pairs.push([items[i], items[i + 1]]);
      i++;
    }
  }
  return pageShell(slide.slide, "timeline", `
    <div class="content-wide">
      <p class="eyebrow">SCHOOL DEVELOPMENT HISTORY</p>
      <h2>创校历程</h2>
      <p class="lead">二十余年办学积累，形成外语特色、多元课程与国际升学服务基础。</p>
      <div class="timeline-grid">
        ${pairs.slice(0, 22).map(([year, text]) => `<article><b>${esc(year)}</b><p>${esc(text)}</p></article>`).join("")}
      </div>
    </div>
  `);
}

function tableLikePage(slide) {
  const items = removeNoise(slide.text, slide.slide);
  const section = sectionBySlide(slide.slide);
  const eyebrow = pickEyebrow(items, section);
  const title = pickTitle(items, section[2]);
  const rest = bodyItems(items, title, eyebrow).filter(x => x.length > 1);
  return pageShell(slide.slide, "tablelike", `
    <div class="content-wide">
      <p class="eyebrow">${esc(eyebrow)}</p>
      <h2>${esc(title)}</h2>
      <div class="panel-grid">
        ${rest.slice(0, 36).map((x, i) => `<article><b>${String(i + 1).padStart(2, "0")}</b><p>${esc(x)}</p></article>`).join("")}
      </div>
    </div>
  `);
}

function backPage(slide) {
  const items = removeNoise(slide.text, slide.slide);
  return `<section class="page back">
    <img class="cover-photo" src="${img("campus2.jpg")}" alt="">
    <div class="cover-overlay"></div>
    <div class="back-copy">
      <p>Schedule Your Campus Tour</p>
      <h2>欢迎预约访校</h2>
      <div class="gold-line"></div>
      <h3>${esc(items.find(x => x.includes("布心路")) || "深圳市罗湖区布心路2040号")}</h3>
      <h3>${esc(items.find(x => x.includes("招生办公室")) || "招生办公室：0755-25805707 / 0755-25813956")}</h3>
      <div class="qr">二维码<br>占位</div>
    </div>
  </section>`;
}

const chapterSlides = new Set([3, 7, 10, 14, 18, 24, 28, 30]);
const tableSlides = new Set([12, 16, 17, 20, 22, 23, 27, 31, 32, 33, 34, 37, 38]);

const pages = [];
for (const slide of slides) {
  if (slide.slide === 1) pages.push(cover(slide));
  else if (slide.slide === 2) pages.push(contentsPage());
  else if (slide.slide === 6) pages.push(timelinePage(slide));
  else if (slide.slide === 8) pages.push(mapPage(slide));
  else if (slide.slide === 39) pages.push(backPage(slide));
  else if (chapterSlides.has(slide.slide)) pages.push(chapterPage(slide));
  else if (tableSlides.has(slide.slide)) pages.push(tableLikePage(slide));
  else pages.push(normalPage(slide));
}

const css = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; background: #d7d4dc; color: #20202A; font-family: "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif; }
.page { width: 210mm; min-height: 297mm; margin: 18px auto; background: #FBF8F0; position: relative; overflow: hidden; page-break-after: always; box-shadow: 0 16px 38px rgba(20,12,40,.18); }
.page-band { position: absolute; top: 0; left: 0; right: 0; height: 7mm; background: #3A1668; }
.page-kicker { position: absolute; top: 15mm; left: 17mm; color: #C7A54D; font-size: 7.5pt; letter-spacing: .12em; font-weight: 800; text-transform: uppercase; }
footer { position: absolute; left: 17mm; right: 17mm; bottom: 9mm; display: flex; justify-content: space-between; color: #837C8B; font-size: 7pt; letter-spacing: .12em; }
footer b { color: #C7A54D; font-size: 9pt; }
.gold-line { width: 28mm; height: 1px; background: #C7A54D; margin: 9mm 0 7mm; }
.cover, .chapter, .back { background: #241044; color: white; }
.cover-photo, .chapter-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cover-overlay, .chapter-overlay { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(35,14,68,.96), rgba(58,22,104,.76) 48%, rgba(35,14,68,.18)); }
.cover-copy { position: absolute; left: 19mm; top: 42mm; width: 128mm; z-index: 2; }
.cover-copy p, .chapter-copy p, .back-copy p { margin: 0; color: #C7A54D; font-size: 9pt; letter-spacing: .16em; font-weight: 800; text-transform: uppercase; }
.cover-copy h1 { font-family: "Noto Serif SC", SimSun, serif; font-size: 34pt; line-height: 1.18; margin: 28mm 0 0; letter-spacing: 0; }
.cover-copy h2 { font-size: 13pt; line-height: 1.7; color: rgba(255,255,255,.86); font-weight: 500; width: 116mm; }
.cover-foot { position: absolute; z-index: 2; left: 19mm; bottom: 18mm; display: flex; gap: 12mm; color: rgba(255,255,255,.66); font-size: 7.5pt; letter-spacing: .12em; }
.contents { padding: 28mm 18mm 18mm; }
.content-header p { color: #C7A54D; letter-spacing: .16em; font-size: 9pt; font-weight: 800; }
.content-header h2 { font-family: "Noto Serif SC", SimSun, serif; color: #2A134D; font-size: 35pt; margin: 0 0 16mm; }
.contents-grid { display: grid; grid-template-columns: 1fr; gap: 5mm; }
.contents-grid article { display: grid; grid-template-columns: 20mm 1fr; gap: 8mm; align-items: baseline; border-top: 1px solid #DED5C7; padding-top: 5mm; }
.contents-grid b { color: #C7A54D; font-family: Georgia, serif; font-size: 23pt; line-height: 1; }
.contents-grid strong { display: block; color: #2A134D; font-size: 15pt; margin-bottom: 1mm; }
.contents-grid em { color: #6D6475; font-style: normal; font-size: 8pt; letter-spacing: .08em; text-transform: uppercase; }
.chapter-copy { position: absolute; z-index: 2; left: 18mm; right: 18mm; bottom: 24mm; }
.chapter-copy b { display: block; font-family: Georgia, serif; color: #C7A54D; font-size: 44pt; line-height: .9; margin: 9mm 0; }
.chapter-copy h2 { font-family: "Noto Serif SC", SimSun, serif; font-size: 33pt; line-height: 1.12; margin: 0; letter-spacing: 0; }
.chapter-copy h3 { width: 128mm; color: rgba(255,255,255,.82); font-size: 12.5pt; line-height: 1.75; font-weight: 400; }
.layout { position: absolute; inset: 28mm 16mm 18mm 17mm; display: grid; grid-template-columns: 1fr 58mm; gap: 12mm; }
.main h2, .content-wide h2 { font-family: "Noto Serif SC", SimSun, serif; color: #2A134D; font-size: 25pt; line-height: 1.16; letter-spacing: 0; margin: 0 0 6mm; }
.eyebrow { margin: 0 0 3mm; color: #C7A54D; font-size: 8pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
.lead { font-size: 11.2pt; line-height: 1.82; color: #51465E; border-left: 1.5mm solid #C7A54D; padding-left: 5mm; margin: 0 0 6mm; }
.visual { position: relative; min-height: 210mm; }
.visual img { width: 100%; height: 142mm; object-fit: cover; border-radius: 0 0 18mm 0; display: block; }
.section-no { position: absolute; right: -2mm; top: 130mm; color: rgba(199,165,77,.35); font-family: Georgia, serif; font-size: 46pt; }
.text-flow { display: grid; grid-template-columns: 1fr; gap: 2.5mm; }
.text-flow p { margin: 0; color: #37313E; font-size: 9.1pt; line-height: 1.62; }
.text-flow article { border-top: 1px solid #DCD2C3; padding-top: 3mm; }
.text-flow h3 { color: #3A1668; font-size: 11pt; margin: 0 0 1.5mm; }
.text-flow .tagline { color: #8A6C29; font-weight: 800; font-size: 7.8pt; letter-spacing: .08em; text-transform: uppercase; }
.mini { display: inline-grid; grid-template-columns: 13mm 1fr; gap: 3mm; align-items: baseline; border-top: 1px solid #E1D8CA; padding-top: 2mm; }
.mini b { color: #C7A54D; font-family: Georgia, serif; font-size: 14pt; }
.mini span { color: #352843; font-size: 9pt; line-height: 1.55; }
.dense .layout { grid-template-columns: 1fr 45mm; gap: 9mm; }
.dense .visual img { height: 96mm; }
.dense .text-flow { grid-template-columns: 1fr 1fr; column-gap: 6mm; row-gap: 2.5mm; }
.dense .text-flow p { font-size: 8pt; line-height: 1.5; }
.content-wide { position: absolute; inset: 28mm 17mm 18mm; }
.map-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6mm; margin-top: 12mm; }
.map-grid article { background: white; border-top: 1.4mm solid #C7A54D; padding: 6mm; min-height: 42mm; }
.map-grid b { display: block; color: #3A1668; font-size: 18pt; margin-bottom: 3mm; }
.map-grid p { margin: 0 0 1.5mm; color: #544C5D; font-size: 9.2pt; line-height: 1.55; }
.timeline-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm 8mm; margin-top: 8mm; }
.timeline-grid article { display: grid; grid-template-columns: 18mm 1fr; gap: 4mm; border-top: 1px solid #DCD2C3; padding-top: 3mm; min-height: 15mm; }
.timeline-grid b { color: #C7A54D; font-family: Georgia, serif; font-size: 15pt; }
.timeline-grid p { margin: 0; color: #42384E; font-size: 8.2pt; line-height: 1.45; }
.panel-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm 6mm; margin-top: 8mm; }
.panel-grid article { background: #FFFFFF; border-left: 1mm solid #C7A54D; padding: 3.8mm 4.5mm; min-height: 18mm; }
.panel-grid b { display: block; color: #C7A54D; font-family: Georgia, serif; font-size: 11pt; margin-bottom: 1mm; }
.panel-grid p { margin: 0; color: #362F3D; font-size: 8.1pt; line-height: 1.45; }
.back-copy { position: absolute; z-index: 2; left: 20mm; top: 52mm; right: 20mm; }
.back-copy h2 { font-family: "Noto Serif SC", SimSun, serif; font-size: 35pt; line-height: 1.16; margin: 18mm 0 0; }
.back-copy h3 { font-size: 13pt; line-height: 1.75; color: rgba(255,255,255,.86); font-weight: 400; margin: 0 0 3mm; }
.qr { margin-top: 16mm; width: 38mm; height: 38mm; background: white; color: #3A1668; display: grid; place-items: center; text-align: center; font-weight: 800; border: 1.2mm solid #C7A54D; }
@media print { body { background: white; } .page { margin: 0; box-shadow: none; } }
`;

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>奥斯翰国际部招生宣传册 A4竖版 AIS参考紫金版</title><style>${css}</style></head><body>${pages.join("\n")}</body></html>`;

fs.writeFileSync(outHtml, html, "utf8");
fs.writeFileSync(outNotes, `# 生成说明

- 源 PPT：PPT_横版招生手册SAIS风格V2/奥斯翰国际部招生宣传册_横版PPT_确定稿.pptx
- 文本清单：00_项目总控/确定稿_ppt_text_inventory.json
- 输出 HTML：奥斯翰国际部招生宣传册_A4竖版_AIS参考紫金版.html
- 输出风格：参考用户选中的 AIS 系列招生册，使用紫色主色、金色小标题、A4 竖版印刷式栅格。
- 注意：二维码、学校 LOGO、最终高清照片仍需在定稿前替换。
`, "utf8");

console.log(`Generated ${outHtml}`);
console.log(`Pages: ${pages.length}`);
