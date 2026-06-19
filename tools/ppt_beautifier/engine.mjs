import fs from "fs";
import path from "path";
import JSZip from "jszip";
import pptxgen from "pptxgenjs";
import { fileURLToPath } from "url";

const ROOT = path.resolve(process.cwd());
const TOOL_DIR = path.resolve("tools/ppt_beautifier");
const DEFAULT_OUT_DIR = path.join(TOOL_DIR, "outputs");
const W = 13.333;
const H = 7.5;
const FONT = "Microsoft YaHei";
const AFONT = "Arial";
const SHAPES = new pptxgen().ShapeType;

const STYLE_NAMES = {
  oxstand_bright: "\u5965\u65af\u7ff0\u660e\u4eae\u84dd\u767d\u98ce",
  clean_business: "\u901a\u7528\u84dd\u767d\u5546\u52a1\u98ce",
  fresh_edu: "\u6559\u80b2\u9752\u84dd\u6d3b\u529b\u98ce",
};

const STYLES = {
  oxstand_bright: {
    bg: "F7FBFF",
    white: "FFFFFF",
    navy: "163B63",
    navy2: "255E91",
    blue: "1E88D1",
    blue2: "43A5E8",
    cyan: "38BDF8",
    teal: "16A7A0",
    pale: "EAF6FF",
    pale2: "F3FAFF",
    line: "CFE3F3",
    text: "17324D",
    muted: "5E7488",
    gold: "D6A84A",
    coral: "F47C64",
    green: "20A67A",
  },
  clean_business: {
    bg: "F8FBFE",
    white: "FFFFFF",
    navy: "1D4E7A",
    navy2: "2B6EA7",
    blue: "247BC2",
    blue2: "54A8E8",
    cyan: "60C7F2",
    teal: "21A0A0",
    pale: "EDF7FE",
    pale2: "F5FBFF",
    line: "D5E6F2",
    text: "1A2E42",
    muted: "66798A",
    gold: "C99A3A",
    coral: "EB745F",
    green: "279A72",
  },
  fresh_edu: {
    bg: "F8FCFF",
    white: "FFFFFF",
    navy: "205072",
    navy2: "2D7FB3",
    blue: "2F9BE0",
    blue2: "67B7EE",
    cyan: "42C6E8",
    teal: "26A69A",
    pale: "EAF8FF",
    pale2: "F1FBFA",
    line: "CFE8F0",
    text: "18364A",
    muted: "617888",
    gold: "D4A73E",
    coral: "F27A5E",
    green: "32A874",
  },
};

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) args[key] = true;
    else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function xmlDecode(s) {
  return String(s || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function extractWordTexts(xml) {
  return [...xml.matchAll(/<w:t(?:\s[^>]*)?>(.*?)<\/w:t>/g)].map((x) => xmlDecode(x[1]));
}

function normalizeLine(s) {
  return String(s || "")
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([，。；：、！？）])/g, "$1")
    .replace(/([（])\s+/g, "$1")
    .trim();
}

function sanitizeName(s) {
  return normalizeLine(s)
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "_")
    .slice(0, 72) || "ppt_beautified";
}

function walkFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

function findProjectImages() {
  const wanted = new Set([
    "cover.jpg",
    "campus1.jpg",
    "campus2.jpg",
    "class1.jpg",
    "activity1.jpg",
    "graduation.jpg",
    "group.jpg",
    "culture.jpg",
    "sports.jpg",
  ]);
  return walkFiles(ROOT)
    .filter((p) => wanted.has(path.basename(p).toLowerCase()))
    .sort((a, b) => {
      const order = ["cover.jpg", "campus1.jpg", "class1.jpg", "activity1.jpg", "graduation.jpg", "group.jpg"];
      return order.indexOf(path.basename(a).toLowerCase()) - order.indexOf(path.basename(b).toLowerCase());
    })
    .slice(0, 12);
}

function findByBasename(name) {
  return walkFiles(ROOT).find((p) => path.basename(p).toLowerCase() === name.toLowerCase()) || "";
}

const DEFAULT_IMAGES = findProjectImages();
const DEFAULT_LOGO = findByBasename("old_logo_crop.png");
const DEFAULT_QR = findByBasename("contact_qr_crop.png");

async function extractDocx(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const docFile = zip.file("word/document.xml");
  if (!docFile) throw new Error("Invalid DOCX: word/document.xml not found");
  const doc = await docFile.async("string");
  const blocks = [];
  const blockRegex = /<w:(p|tbl)(?:\s|>)[\s\S]*?<\/w:\1>/g;
  for (const m of doc.matchAll(blockRegex)) {
    const xml = m[0];
    if (m[1] === "tbl") {
      const rows = [];
      for (const tr of xml.matchAll(/<w:tr(?:\s|>)[\s\S]*?<\/w:tr>/g)) {
        const cells = [];
        for (const tc of tr[0].matchAll(/<w:tc(?:\s|>)[\s\S]*?<\/w:tc>/g)) {
          const txt = extractWordTexts(tc[0]).join("");
          cells.push(normalizeLine(txt));
        }
        if (cells.some(Boolean)) rows.push(cells);
      }
      if (rows.length) blocks.push({ type: "table", rows });
    } else {
      const txt = extractWordTexts(xml).join("");
      const line = normalizeLine(txt);
      if (line) blocks.push({ type: "p", text: line });
    }
  }
  return blocks;
}

async function extractPptx(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const slides = Object.keys(zip.files)
    .filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => +a.match(/slide(\d+)/)[1] - +b.match(/slide(\d+)/)[1]);
  const blocks = [];
  let n = 0;
  for (const s of slides) {
    const xml = await zip.file(s).async("string");
    const lines = [...xml.matchAll(/<a:t>(.*?)<\/a:t>/g)]
      .map((m) => normalizeLine(xmlDecode(m[1])))
      .filter(Boolean);
    if (!lines.length) continue;
    n += 1;
    blocks.push({ type: "slideBreak", text: `Slide ${n}` });
    lines.forEach((line) => blocks.push({ type: "p", text: line }));
  }
  return blocks;
}

async function extractPdf(file) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({
    data,
    disableFontFace: true,
    useWorkerFetch: false,
    isEvalSupported: false,
  }).promise;
  const blocks = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const line = normalizeLine(content.items.map((item) => item.str).join(" "));
    if (!line) continue;
    blocks.push({ type: "slideBreak", text: `Page ${i}` });
    splitLongText(line, 120).forEach((t) => blocks.push({ type: "p", text: t }));
  }
  return blocks;
}

async function extractText(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === ".docx") return extractDocx(file);
  if (ext === ".pptx") return extractPptx(file);
  if (ext === ".pdf") return extractPdf(file);
  const raw = fs.readFileSync(file, "utf8");
  return raw
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean)
    .map((text) => ({ type: "p", text }));
}

function splitLongText(s, max = 90) {
  const out = [];
  let rest = normalizeLine(s);
  while (rest.length > max) {
    let idx = Math.max(
      rest.lastIndexOf("。", max),
      rest.lastIndexOf("；", max),
      rest.lastIndexOf("，", max),
      rest.lastIndexOf(" ", max)
    );
    if (idx < max * 0.55) idx = max;
    out.push(rest.slice(0, idx + 1).trim());
    rest = rest.slice(idx + 1).trim();
  }
  if (rest) out.push(rest);
  return out;
}

function looksLikeHeading(line) {
  if (!line) return false;
  if (/^第?\d+[页\.、：:]/.test(line)) return true;
  if (/^(第[一二三四五六七八九十]+[章节页])/.test(line)) return true;
  if (/^(主标题|标题|副标题|正文|用途|编制|日期)[:：]/.test(line)) return false;
  if (line.length <= 28 && !/[。；！？]$/.test(line)) return true;
  return false;
}

function stripLabel(line, label) {
  return line.replace(new RegExp(`^${label}\\s*[:：]\\s*`), "").trim();
}

function blocksToDeck(blocks, opts = {}) {
  const sourceName = opts.title || "PPT";
  const pages = [];
  let current = null;

  function pushCurrent() {
    if (!current) return;
    current.body = current.body.filter(Boolean);
    if (current.title || current.body.length || current.tables.length) pages.push(current);
  }

  const hasExplicitPages = blocks.some((b) => b.type === "p" && /^第\d+页[:：]/.test(b.text));
  if (hasExplicitPages) {
    let started = false;
    for (const b of blocks) {
      if (b.type === "table") {
        if (!started) continue;
        if (!current) current = { title: sourceName, subtitle: "", body: [], tables: [] };
        current.tables.push(b.rows);
        continue;
      }
      if (b.type !== "p") continue;
      const line = b.text;
      if (/^第\d+页[:：]/.test(line)) {
        started = true;
        pushCurrent();
        const rawTitle = line.replace(/^第\d+页[:：]\s*/, "").trim() || sourceName;
        current = {
          rawTitle,
          title: rawTitle,
          subtitle: "",
          body: [],
          tables: [],
        };
      } else if (current) {
        if (/^主标题[:：]/.test(line)) current.title = stripLabel(line, "主标题") || current.title;
        else if (/^副标题[:：]/.test(line)) current.subtitle = stripLabel(line, "副标题");
        else if (/^正文[:：]/.test(line)) current.body.push(stripLabel(line, "正文"));
        else if (!/^(页码|标题|核心内容|各页宣传文稿|PPT整体结构)/.test(line)) current.body.push(line);
      }
    }
    pushCurrent();
  } else {
    for (const b of blocks) {
      if (b.type === "slideBreak") {
        pushCurrent();
        current = { title: b.text, subtitle: "", body: [], tables: [] };
        continue;
      }
      if (b.type === "table") {
        if (!current) current = { title: sourceName, subtitle: "", body: [], tables: [] };
        current.tables.push(b.rows);
        continue;
      }
      if (b.type !== "p") continue;
      const line = b.text;
      if (!current) current = { title: sourceName, subtitle: "", body: [], tables: [] };
      if (looksLikeHeading(line) && current.body.length > 0) {
        pushCurrent();
        current = { title: line, subtitle: "", body: [], tables: [] };
      } else if (looksLikeHeading(line) && current.title === sourceName && current.body.length === 0) {
        current.title = line;
      } else {
        splitLongText(line, 120).forEach((t) => current.body.push(t));
      }
    }
    pushCurrent();
  }

  if (!pages.length) {
    pages.push({ title: sourceName, subtitle: "", body: blocks.map((b) => b.text).filter(Boolean), tables: [] });
  }

  const first = pages[0];
  const cover = {
    kind: "cover",
    title: first.title || sourceName,
    subtitle: first.subtitle || first.body.find((x) => x.length <= 70) || "",
    body: first.body,
    tables: [],
  };
  const firstLooksLikeCover = hasExplicitPages && (
    /封面|cover/i.test(pages[0]?.title || "") ||
    /封面|cover/i.test(pages[0]?.rawTitle || "") ||
    pages[0]?.body?.some((x) => /^落款[:：]/.test(x))
  );
  const start = firstLooksLikeCover ? 1 : hasExplicitPages ? 0 : 1;
  return [cover, ...pages.slice(start).map(classifyPage)].slice(0, opts.maxSlides || 40);
}

function classifyPage(page) {
  const all = [page.title, page.subtitle, ...page.body].join(" ");
  if (page.tables.length || /表|维度|项目|考试名称|适合对象|功能模块|阶段|名称|内容/.test(all)) return { ...page, kind: "table" };
  if (/流程|路径|规划|步骤|体系|闭环|模型|三备|三研|阶段|路线|服务/.test(all)) return { ...page, kind: "process" };
  if (/招生|报名|咨询|电话|扫码|开放日|联系方式/.test(all)) return { ...page, kind: "contact" };
  if (/历史|沉淀|年|成立|成绩|数据|目标|规模|人数|分/.test(all)) return { ...page, kind: "stats" };
  if (/AI|系统|科技|数据|精准|学情/.test(all)) return { ...page, kind: "matrix" };
  return { ...page, kind: "content" };
}

function chooseImage(images, idx) {
  if (!images.length) return "";
  return images[idx % images.length];
}

function addText(slide, C, value, x, y, w, h, opt = {}) {
  slide.addText(value || "", {
    x,
    y,
    w,
    h,
    fontFace: opt.fontFace || FONT,
    fontSize: opt.fontSize ?? 11,
    bold: opt.bold || false,
    color: opt.color || C.text,
    align: opt.align || "left",
    valign: opt.valign || "top",
    margin: opt.margin ?? 0.04,
    fit: opt.fit || "shrink",
    paraSpaceAfterPt: opt.paraSpaceAfterPt ?? 4,
    breakLine: false,
    rotate: opt.rotate,
  });
}

function addRect(slide, C, x, y, w, h, fill, opt = {}) {
  slide.addShape(SHAPES.rect, {
    x,
    y,
    w,
    h,
    fill: { color: fill, transparency: opt.fillTransparency ?? 0 },
    line: { color: opt.line || fill, width: opt.lineWidth ?? 0.5, transparency: opt.lineTransparency ?? 0 },
  });
}

function addLine(slide, C, x, y, w, h, opt = {}) {
  slide.addShape(SHAPES.line, {
    x,
    y,
    w,
    h,
    line: {
      color: opt.color || C.line,
      width: opt.width ?? 0.8,
      beginArrowType: opt.beginArrowType,
      endArrowType: opt.endArrowType,
    },
  });
}

function addImage(slide, file, x, y, w, h, transparency = 0) {
  if (!file || !fs.existsSync(file)) return false;
  slide.addImage({ path: file, x, y, w, h, transparency, sizing: { type: "cover", x, y, w, h } });
  return true;
}

function addBase(slide, C, n, section) {
  slide.background = { color: C.bg };
  addRect(slide, C, 0, 0, W, H, C.bg, { lineTransparency: 100 });
  addRect(slide, C, 0, 0, W, 0.09, C.blue2, { lineTransparency: 100 });
  addText(slide, C, section || "PPT BEAUTIFIER", 0.58, 7.03, 5.2, 0.18, {
    fontFace: AFONT,
    fontSize: 6.4,
    bold: true,
    color: "7F92A4",
  });
  addText(slide, C, String(n).padStart(2, "0"), 12.18, 6.97, 0.5, 0.18, {
    fontFace: AFONT,
    fontSize: 8,
    bold: true,
    color: "7F92A4",
    align: "right",
  });
}

function addTitle(slide, C, eyebrow, heading, subtitle = "") {
  addRect(slide, C, 0.68, 0.68, 0.44, 0.06, C.gold, { lineTransparency: 100 });
  addText(slide, C, String(eyebrow || "Overview").toUpperCase(), 1.2, 0.58, 4.1, 0.18, {
    fontFace: AFONT,
    fontSize: 7.2,
    bold: true,
    color: C.blue,
  });
  addText(slide, C, heading, 0.68, 0.88, 9.4, 0.48, { fontSize: 23, bold: true, color: C.navy });
  if (subtitle) addText(slide, C, subtitle, 0.7, 1.38, 8.9, 0.24, { fontSize: 9.5, color: C.muted });
}

function addCard(slide, C, x, y, w, h, opt = {}) {
  addRect(slide, C, x, y, w, h, opt.fill || C.white, { line: opt.line || C.line, lineWidth: opt.lineWidth ?? 0.7 });
  if (opt.top) addRect(slide, C, x, y, w, 0.08, opt.top, { lineTransparency: 100 });
  if (opt.bar) addRect(slide, C, x, y, 0.07, h, opt.bar, { lineTransparency: 100 });
}

function addSoftBand(slide, C, x, y, w, h, color) {
  addRect(slide, C, x, y, w, h, color, { fillTransparency: 0, lineTransparency: 100 });
  addRect(slide, C, x + 0.12, y + 0.12, w - 0.24, h - 0.24, C.white, { fillTransparency: 18, lineTransparency: 100 });
}

function addBullets(slide, C, items, x, y, w, h, opt = {}) {
  const runs = [];
  items.filter(Boolean).forEach((item, idx, arr) => {
    runs.push({ text: item, options: { bullet: { type: "ul" }, breakLine: idx < arr.length - 1 } });
  });
  slide.addText(runs.length ? runs : "", {
    x,
    y,
    w,
    h,
    fontFace: FONT,
    fontSize: opt.fontSize ?? 9.8,
    color: opt.color || C.text,
    margin: opt.margin ?? 0.05,
    fit: "shrink",
    paraSpaceAfterPt: opt.paraSpaceAfterPt ?? 5,
    breakLine: false,
  });
}

function addMiniTable(slide, C, rows, x, y, widths, rowH, fontSize = 8.2) {
  rows.slice(0, 8).forEach((row, r) => {
    let cx = x;
    widths.forEach((cw, c) => {
      const cell = normalizeLine(row[c] || "");
      const fill = r === 0 ? C.blue : c === 0 ? C.pale : C.white;
      addRect(slide, C, cx, y + r * rowH, cw, rowH, fill, { line: C.line });
      addText(slide, C, cell, cx + 0.07, y + r * rowH + 0.08, cw - 0.14, rowH - 0.1, {
        fontSize,
        bold: r === 0 || c === 0,
        color: r === 0 ? C.white : c === 0 ? C.blue : C.text,
        align: c === 0 ? "center" : "left",
        valign: "mid",
      });
      cx += cw;
    });
  });
}

function renderCover(pptx, C, page, images, logo, options) {
  const slide = pptx.addSlide();
  slide.background = { color: C.bg };
  addRect(slide, C, 0, 0, W, H, C.bg, { lineTransparency: 100 });
  addSoftBand(slide, C, 0.48, 0.45, 5.35, 6.6, C.pale);
  addImage(slide, chooseImage(images, 0), 6.1, 0.54, 6.65, 6.25, 0);
  addRect(slide, C, 6.1, 0.54, 6.65, 6.25, C.blue, { fillTransparency: 78, lineTransparency: 100 });
  addRect(slide, C, 5.76, 1.06, 0.7, 0.16, C.gold, { lineTransparency: 100 });
  if (logo && fs.existsSync(logo)) slide.addImage({ path: logo, x: 0.95, y: 0.83, w: 0.7, h: 0.7 });
  addText(slide, C, options.brand || "PPT BEAUTIFIER", 1.78, 1.0, 3.6, 0.18, {
    fontFace: AFONT,
    fontSize: 7.4,
    bold: true,
    color: C.blue,
  });
  addText(slide, C, page.title || options.title || "Presentation", 0.95, 2.25, 4.45, 0.92, {
    fontSize: 27,
    bold: true,
    color: C.navy,
  });
  addText(slide, C, page.subtitle || "", 0.98, 3.5, 4.3, 0.42, { fontSize: 13, color: C.muted });
  addLine(slide, C, 0.98, 4.24, 1.85, 0, { color: C.gold, width: 3 });
  addText(slide, C, options.footer || "Auto generated by PPT Beautifier", 1.0, 4.66, 3.9, 0.22, {
    fontSize: 10,
    color: C.muted,
  });
  ["Auto Layout", "Blue + White", "Visual Cards"].forEach((t, i) => {
    addRect(slide, C, 0.98 + i * 1.42, 5.34, 1.18, 0.34, i === 1 ? C.gold : C.blue2, { lineTransparency: 100 });
    addText(slide, C, t, 1.04 + i * 1.42, 5.43, 1.05, 0.1, {
      fontFace: AFONT,
      fontSize: 6.6,
      bold: true,
      color: C.white,
      align: "center",
    });
  });
}

function renderContent(pptx, C, page, idx, images) {
  const slide = pptx.addSlide();
  addBase(slide, C, idx + 1, "CONTENT");
  addTitle(slide, C, page.kind, page.title || `Slide ${idx + 1}`, page.subtitle || "");
  const img = chooseImage(images, idx);
  const body = page.body.slice(0, 8);
  if (idx % 3 === 1 && addImage(slide, img, 0.78, 2.0, 4.45, 4.35, 0)) {
    addRect(slide, C, 0.78, 2.0, 4.45, 4.35, C.blue, { fillTransparency: 82, lineTransparency: 100 });
    body.slice(0, 5).forEach((item, i) => {
      const y = 2.05 + i * 0.82;
      addCard(slide, C, 5.75, y, 5.95, 0.58, { fill: i % 2 ? C.pale2 : C.white, top: i % 3 === 0 ? C.gold : C.cyan });
      addText(slide, C, item, 6.05, y + 0.15, 5.35, 0.18, { fontSize: 8.9, color: C.text });
    });
  } else {
    body.slice(0, 6).forEach((item, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = 0.78 + col * 4.1;
      const y = 2.05 + row * 1.72;
      addCard(slide, C, x, y, 3.45, 1.22, { fill: i % 2 ? C.pale2 : C.white, top: [C.blue2, C.teal, C.gold][i % 3] });
      addText(slide, C, String(i + 1).padStart(2, "0"), x + 0.22, y + 0.25, 0.42, 0.2, {
        fontFace: AFONT,
        fontSize: 12,
        bold: true,
        color: [C.blue, C.teal, C.gold][i % 3],
      });
      addText(slide, C, item, x + 0.75, y + 0.24, 2.35, 0.42, { fontSize: 8.6, color: C.text });
    });
    if (addImage(slide, img, 8.3, 5.08, 3.82, 0.78, 0)) {
      addRect(slide, C, 8.3, 5.08, 3.82, 0.78, C.blue, { fillTransparency: 80, lineTransparency: 100 });
    }
  }
}

function renderTable(pptx, C, page, idx) {
  const slide = pptx.addSlide();
  addBase(slide, C, idx + 1, "TABLE");
  addTitle(slide, C, "Table", page.title, page.subtitle);
  const table = page.tables[0] || toPseudoTable(page.body);
  const cols = Math.max(...table.map((r) => r.length), 2);
  const widths = Array.from({ length: cols }, (_, i) => (i === 0 ? 1.55 : (10.9 - 1.55) / Math.max(1, cols - 1)));
  addMiniTable(slide, C, table, 0.86, 2.0, widths, Math.min(0.66, 4.7 / Math.min(table.length, 8)), cols > 3 ? 7.2 : 8.2);
  const extra = page.body.filter((x) => !/^(正文|主标题|副标题)[:：]/.test(x)).slice(0, 3);
  if (extra.length) addBullets(slide, C, extra, 0.95, 6.0, 10.8, 0.56, { fontSize: 8.6, paraSpaceAfterPt: 2 });
}

function toPseudoTable(lines) {
  const rows = [["Module", "Content"]];
  lines.filter(Boolean).slice(0, 7).forEach((line, i) => {
    const parts = line.split(/[:：]/);
    if (parts.length > 1 && parts[0].length <= 12) rows.push([parts[0], parts.slice(1).join("：")]);
    else rows.push([`Point ${i + 1}`, line]);
  });
  return rows;
}

function renderProcess(pptx, C, page, idx, images) {
  const slide = pptx.addSlide();
  addBase(slide, C, idx + 1, "PROCESS");
  addTitle(slide, C, "Process", page.title, page.subtitle);
  const steps = page.body.filter(Boolean).slice(0, 5);
  steps.forEach((s, i) => {
    const x = 0.72 + i * 2.45;
    const y = 2.38 + (i % 2) * 1.55;
    addRect(slide, C, x, y, 1.72, 0.62, [C.blue2, C.teal, C.gold, C.coral, C.green][i % 5], { lineTransparency: 100 });
    addText(slide, C, `0${i + 1}`, x + 0.12, y + 0.19, 0.36, 0.14, {
      fontFace: AFONT,
      fontSize: 9,
      bold: true,
      color: C.white,
      align: "center",
    });
    addText(slide, C, s, x + 0.54, y + 0.12, 1.04, 0.24, { fontSize: 7.1, bold: true, color: C.white, align: "center" });
    if (i < steps.length - 1) addLine(slide, C, x + 1.83, y + 0.31, 0.43, (i % 2 === 0 ? 1.55 : -1.55), { color: C.blue2, width: 1.8, endArrowType: "triangle" });
  });
  addCard(slide, C, 1.0, 5.45, 10.95, 0.68, { fill: C.white, top: C.gold });
  addText(slide, C, page.body.slice(5).join(" ").slice(0, 180), 1.28, 5.67, 10.3, 0.18, { fontSize: 8.8, color: C.muted, align: "center" });
  addImage(slide, chooseImage(images, idx), 10.0, 1.95, 2.25, 1.32, 0);
}

function renderStats(pptx, C, page, idx, images) {
  const slide = pptx.addSlide();
  addBase(slide, C, idx + 1, "DATA");
  addTitle(slide, C, "Data", page.title, page.subtitle);
  const nums = extractNumbers([page.title, page.subtitle, ...page.body].join(" "));
  for (let i = 0; i < 4; i += 1) {
    const x = 0.78 + i * 3.05;
    addRect(slide, C, x, 2.1, 2.45, 1.02, i % 2 ? C.pale : C.white, { line: C.line });
    addRect(slide, C, x, 2.1, 2.45, 0.09, [C.blue2, C.teal, C.gold, C.coral][i], { lineTransparency: 100 });
    addText(slide, C, nums[i] || `0${i + 1}`, x + 0.24, 2.36, 1.6, 0.28, {
      fontFace: AFONT,
      fontSize: 19,
      bold: true,
      color: C.navy,
    });
    addText(slide, C, page.body[i] || "Key point", x + 0.24, 2.76, 1.85, 0.16, { fontSize: 7.6, color: C.muted });
  }
  addBullets(slide, C, page.body.slice(0, 6), 0.96, 3.85, 6.65, 1.7, { fontSize: 9.2 });
  addImage(slide, chooseImage(images, idx), 8.25, 3.7, 3.95, 1.98, 0);
}

function extractNumbers(s) {
  return [...String(s).matchAll(/\d+(?:\.\d+)?\s*(?:年|万|%|人|所|个|㎡|分|次|个月|天)?/g)]
    .map((m) => normalizeLine(m[0]))
    .filter((x) => x.length <= 10)
    .slice(0, 4);
}

function renderContact(pptx, C, page, idx, qr) {
  const slide = pptx.addSlide();
  addBase(slide, C, idx + 1, "CONTACT");
  addTitle(slide, C, "Admissions", page.title, page.subtitle);
  addSoftBand(slide, C, 0.86, 1.96, 6.7, 3.85, C.pale);
  addBullets(slide, C, page.body.slice(0, 8), 1.25, 2.35, 5.6, 2.65, { fontSize: 9.2, paraSpaceAfterPt: 5 });
  addCard(slide, C, 8.25, 1.96, 3.05, 3.85, { fill: C.white, top: C.gold });
  if (qr && fs.existsSync(qr)) slide.addImage({ path: qr, x: 8.82, y: 2.48, w: 1.85, h: 1.85 });
  else addText(slide, C, "QR", 9.1, 2.92, 1.2, 0.36, { fontFace: AFONT, fontSize: 28, bold: true, color: C.blue, align: "center" });
  addText(slide, C, "Scan / Contact", 8.56, 4.7, 2.1, 0.16, { fontFace: AFONT, fontSize: 9, bold: true, color: C.blue, align: "center" });
}

function renderDeck(deck, opts) {
  const C = STYLES[opts.style] || STYLES.oxstand_bright;
  const images = opts.images?.length ? opts.images : DEFAULT_IMAGES;
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: W, height: H });
  pptx.layout = "WIDE";
  pptx.author = "PPT Beautifier";
  pptx.company = opts.brand || "PPT Beautifier";
  pptx.subject = "Automated PPT redesign";
  pptx.title = opts.title || deck[0]?.title || "Presentation";
  pptx.lang = "zh-CN";
  pptx.theme = { headFontFace: FONT, bodyFontFace: FONT, lang: "zh-CN" };
  deck.forEach((page, idx) => {
    if (idx === 0 || page.kind === "cover") renderCover(pptx, C, page, images, opts.logo, opts);
    else if (page.kind === "table" || page.kind === "matrix") renderTable(pptx, C, page, idx);
    else if (page.kind === "process") renderProcess(pptx, C, page, idx, images);
    else if (page.kind === "stats") renderStats(pptx, C, page, idx, images);
    else if (page.kind === "contact") renderContact(pptx, C, page, idx, opts.qr);
    else renderContent(pptx, C, page, idx, images);
  });
  return pptx;
}

export async function beautifyPpt(input, options = {}) {
  const absInput = path.resolve(input);
  if (!fs.existsSync(absInput)) throw new Error(`Input not found: ${absInput}`);
  const blocks = await extractText(absInput);
  const title = options.title || path.basename(absInput, path.extname(absInput));
  const deck = blocksToDeck(blocks, { title, maxSlides: Number(options.maxSlides || 40) });
  const outDir = path.resolve(options.outDir || DEFAULT_OUT_DIR);
  fs.mkdirSync(outDir, { recursive: true });
  const styleId = options.style || "oxstand_bright";
  const fileName = `${sanitizeName(title)}_${STYLE_NAMES[styleId] || "beautified"}.pptx`;
  const outPath = path.resolve(options.output || path.join(outDir, fileName));
  const pptx = renderDeck(deck, {
    title,
    style: styleId,
    brand: options.brand || "PPT BEAUTIFIER",
    footer: options.footer || "Auto generated by PPT Beautifier",
    logo: options.logo === "none" ? "" : options.logo || DEFAULT_LOGO,
    qr: options.qr === "none" ? "" : options.qr || DEFAULT_QR,
    images: options.images || DEFAULT_IMAGES,
  });
  await pptx.writeFile({ fileName: outPath });
  return {
    input: absInput,
    output: outPath,
    slideCount: deck.length,
    blockCount: blocks.length,
    style: styleId,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs(process.argv);
  if (!args.input || args.help) {
    console.log(`Usage:
node tools/ppt_beautifier/engine.mjs --input <file.docx|pptx|pdf|txt|md> [--style oxstand_bright|clean_business|fresh_edu] [--output out.pptx]
`);
    process.exit(args.help ? 0 : 1);
  }
  beautifyPpt(args.input, args)
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((err) => {
      console.error(err.stack || err.message);
      process.exit(1);
    });
}
