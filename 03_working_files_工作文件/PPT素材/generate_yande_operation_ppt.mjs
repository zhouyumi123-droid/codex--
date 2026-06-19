import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";
import pptxgen from "pptxgenjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(dir, "衍德教育科技有限公司2026年9月-2027年9月运营方案.docx");
const output = path.join(dir, "衍德教育科技有限公司2026年9月-2027年9月运营方案_简约高级排版.pptx");
const outlineOut = path.join(dir, "衍德运营方案_PPT抽取文本.json");
const ShapeType = new pptxgen().ShapeType;

const W = 13.333;
const H = 7.5;
const C = {
  ink: "111827",
  body: "374151",
  muted: "6B7280",
  faint: "E5E7EB",
  soft: "F5F6F8",
  panel: "F8FAFC",
  green: "57C785",
  greenDark: "128257",
  yellow: "F5C542",
  red: "E04444",
  black: "0B0F14",
  white: "FFFFFF",
};

function decodeXml(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function cleanText(s) {
  return decodeXml(s)
    .replace(/\s+/g, " ")
    .replace(/\s+([，。；：、！？）】])/g, "$1")
    .replace(/([（【])\s+/g, "$1")
    .trim();
}

function textFromXml(xml) {
  const parts = [];
  const re = /<w:(t|tab|br)\b[^>]*>([\s\S]*?)<\/w:t>|<w:(tab|br)\b[^>]*\/>/g;
  let m;
  while ((m = re.exec(xml))) {
    if (m[1] === "t") parts.push(decodeXml(m[2]));
    else if (m[3] === "tab") parts.push("\t");
    else if (m[3] === "br") parts.push("\n");
  }
  return cleanText(parts.join(""));
}

function splitBlocks(xml, tag) {
  const out = [];
  const re = new RegExp(`<w:${tag}\\b[\\s\\S]*?<\\/w:${tag}>`, "g");
  let m;
  while ((m = re.exec(xml))) out.push(m[0]);
  return out;
}

function paraLevel(pXml, text) {
  const style = pXml.match(/<w:pStyle[^>]+w:val="([^"]+)"/)?.[1] || "";
  if (/Title|标题|Heading1|1$|^[Aa]1/.test(style)) return 1;
  if (/Heading2|2$|^[Aa]2/.test(style)) return 2;
  if (/^第[一二三四五六七八九十]+部分[：:]/.test(text)) return 1;
  if (/^[一二三四五六七八九十]+[、.．]/.test(text)) return 1;
  if (/^板块[一二三四五六七八九十]+[：:]/.test(text)) return 2;
  if (/^（[一二三四五六七八九十]+）/.test(text)) return 2;
  if (/^\d+[.．、]/.test(text)) return 2;
  if (text.length <= 24 && /[：:]$/.test(text)) return 2;
  return 0;
}

async function extractDocx(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const xml = await zip.file("word/document.xml").async("string");
  const body = xml.match(/<w:body[\s\S]*?<\/w:body>/)?.[0] || xml;
  const blocks = [];
  const re = /<w:(p|tbl)\b[\s\S]*?<\/w:\1>/g;
  let m;
  while ((m = re.exec(body))) {
    if (m[1] === "p") {
      const text = textFromXml(m[0]);
      if (text) blocks.push({ type: "p", text, level: paraLevel(m[0], text) });
    } else {
      const rows = splitBlocks(m[0], "tr")
        .map((r) => splitBlocks(r, "tc").map(textFromXml).filter(Boolean))
        .filter((r) => r.length);
      if (rows.length) blocks.push({ type: "table", rows });
    }
  }
  return blocks;
}

function makeSections(blocks) {
  const first = blocks.find((b) => b.type === "p")?.text || "运营方案";
  const sections = [{ title: first, items: [] }];
  let seenTitle = false;
  for (const b of blocks) {
    if (b.type === "p" && b.text === first && !seenTitle) {
      seenTitle = true;
      continue;
    }
    if (b.type === "p" && b.level === 1) sections.push({ title: b.text, items: [] });
    else sections[sections.length - 1].items.push(b);
  }
  return sections.filter((s) => s.title || s.items.length);
}

function chunks(items, maxChars = 520) {
  const pages = [];
  let cur = [];
  let count = 0;
  for (const item of items) {
    const weight =
      item.type === "table"
        ? item.rows.flat().join("").length + item.rows.length * 36
        : item.text.length + (item.level === 2 ? 34 : 20);
    if (cur.length && count + weight > maxChars) {
      pages.push(cur);
      cur = [];
      count = 0;
    }
    cur.push(item);
    count += weight;
  }
  if (cur.length) pages.push(cur);
  return pages;
}

function addBg(slide) {
  slide.background = { color: C.white };
  slide.addShape(ShapeType.rect, {
    x: 0, y: 0, w: W, h: H,
    fill: { color: C.white },
    line: { color: C.white, transparency: 100 },
  });
}

function addFooter(slide, page) {
  slide.addText("YANDE OPERATION PLAN / OXSTAND", {
    x: 0.55, y: 7.08, w: 3.2, h: 0.18,
    fontFace: "Arial", fontSize: 6.8, color: "9CA3AF",
    margin: 0, breakLine: false, fit: "shrink",
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 12.25, y: 7.05, w: 0.55, h: 0.22,
    fontFace: "Arial", fontSize: 7.5, color: "9CA3AF",
    align: "right", margin: 0,
  });
}

function title(slide, t, sub = "") {
  slide.addText(t, {
    x: 0.62, y: 0.48, w: 8.65, h: 0.48,
    fontSize: 24, fontFace: "Microsoft YaHei",
    bold: true, color: C.ink, margin: 0, fit: "shrink",
  });
  slide.addShape(ShapeType.line, {
    x: 0.62, y: 1.12, w: 11.95, h: 0,
    line: { color: C.faint, width: 0.8 },
  });
  if (sub) {
    slide.addText(sub, {
      x: 9.0, y: 0.62, w: 3.55, h: 0.25,
      fontSize: 8.5, fontFace: "Arial",
      color: C.muted, align: "right", margin: 0, fit: "shrink",
    });
  }
}

function bodyText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: "Microsoft YaHei",
    fontSize: opts.fontSize ?? 12.2,
    color: opts.color ?? C.body,
    bold: opts.bold ?? false,
    valign: opts.valign ?? "top",
    margin: opts.margin ?? 0.05,
    breakLine: false,
    fit: "shrink",
    paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 5,
    ...opts,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.05,
    fill: { color: opts.fill ?? C.panel },
    line: { color: opts.line ?? C.faint, width: opts.lineWidth ?? 0.6 },
    shadow: opts.shadow ? { type: "outer", color: "D1D5DB", opacity: 0.16, blur: 1, angle: 45, distance: 1 } : undefined,
  });
}

function pill(slide, text, x, y, w, color = C.ink, fill = C.soft) {
  slide.addShape(ShapeType.roundRect, {
    x, y, w, h: 0.32,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color: fill, transparency: 100 },
  });
  slide.addText(text, {
    x: x + 0.1, y: y + 0.065, w: w - 0.2, h: 0.14,
    fontFace: "Microsoft YaHei", fontSize: 7.5,
    bold: true, color, align: "center", margin: 0, fit: "shrink",
  });
}

function sectionLabel(slide, text, x, y, color = C.greenDark) {
  slide.addText(text, {
    x, y, w: 2.0, h: 0.18,
    fontFace: "Arial", fontSize: 6.8,
    bold: true, color, margin: 0, fit: "shrink",
  });
}

function addIcon(slide, x, y, n, color = C.greenDark) {
  slide.addShape(ShapeType.ellipse, {
    x, y, w: 0.34, h: 0.34,
    fill: { color: "FFFFFF" },
    line: { color, width: 1.2 },
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: x + 0.045, y: y + 0.085, w: 0.25, h: 0.1,
    fontFace: "Arial", fontSize: 6.6, bold: true,
    color, margin: 0, align: "center", fit: "shrink",
  });
}

function arrow(slide, x1, y1, x2, y2, color = "9CA3AF") {
  slide.addShape(ShapeType.line, {
    x: x1, y: y1, w: x2 - x1, h: y2 - y1,
    line: { color, width: 1.25, beginArrowType: "none", endArrowType: "triangle" },
  });
}

function addCover(pptx, sections) {
  const slide = pptx.addSlide();
  addBg(slide);
  slide.addShape(ShapeType.rect, {
    x: 0, y: 0, w: 0.16, h: H,
    fill: { color: C.greenDark },
    line: { color: C.greenDark, transparency: 100 },
  });
  slide.addText(sections[0].title, {
    x: 0.72, y: 1.08, w: 7.5, h: 0.7,
    fontSize: 27, fontFace: "Microsoft YaHei",
    bold: true, color: C.ink, margin: 0, fit: "shrink",
  });
  slide.addShape(ShapeType.line, {
    x: 0.72, y: 2.12, w: 2.25, h: 0,
    line: { color: C.green, width: 3 },
  });
  bodyText(slide, sections[0].items.map((i) => i.text).join("\n"), 0.72, 2.42, 6.75, 0.62, {
    fontSize: 14,
    color: C.body,
  });
  card(slide, 8.48, 0.92, 3.9, 5.1, { fill: "F9FAFB", shadow: true });
  const cards = sections.slice(1).map((s) => s.title);
  cards.slice(0, 5).forEach((t, i) => {
    const y = 1.34 + i * 0.86;
    addIcon(slide, 8.9, y + 0.02, i + 1, i === 2 ? C.yellow : C.greenDark);
    bodyText(slide, t, 9.38, y, 2.45, 0.32, {
      fontSize: 10.6,
      bold: true,
      color: C.ink,
      margin: 0,
    });
  });
  pill(slide, "简约版式", 0.72, 6.15, 1.25, C.greenDark, "E9F8EF");
  pill(slide, "运营方案", 2.14, 6.15, 1.25, C.ink, "F3F4F6");
  pill(slide, "2026-2027", 3.56, 6.15, 1.35, C.red, "FEECEC");
}

function addSectionSlide(pptx, sec, no, page) {
  const slide = pptx.addSlide();
  addBg(slide);
  title(slide, sec.title, "SECTION");
  const heads = sec.items.filter((i) => i.type === "p" && i.level === 2).map((i) => i.text);
  bodyText(slide, sec.title, 0.74, 2.0, 7.2, 0.64, {
    fontSize: 28,
    bold: true,
    color: C.ink,
    margin: 0,
  });
  slide.addShape(ShapeType.line, {
    x: 0.78, y: 2.92, w: 2.05, h: 0,
    line: { color: C.green, width: 3 },
  });
  card(slide, 8.25, 1.6, 3.92, 4.45, { fill: "F9FAFB" });
  heads.slice(0, 6).forEach((h, i) => {
    const y = 1.98 + i * 0.58;
    addIcon(slide, 8.7, y - 0.02, i + 1, i === 0 ? C.greenDark : "9CA3AF");
    bodyText(slide, h, 9.2, y - 0.03, 2.35, 0.25, {
      fontSize: 10.1,
      bold: true,
      color: C.body,
      margin: 0,
    });
  });
  slide.addText(String(no).padStart(2, "0"), {
    x: 0.78, y: 4.76, w: 1.25, h: 0.55,
    fontFace: "Arial", fontSize: 30,
    bold: true, color: C.greenDark, margin: 0,
  });
  addFooter(slide, page);
}

function groupBlocks(items) {
  const groups = [];
  let cur = null;
  for (const item of items) {
    if (item.type === "p" && item.level === 2) {
      cur = { title: item.text, blocks: [] };
      groups.push(cur);
    } else {
      if (!cur) {
        cur = { title: "", blocks: [] };
        groups.push(cur);
      }
      cur.blocks.push(item);
    }
  }
  return groups;
}

function textHeight(t) {
  return Math.min(0.76, Math.max(0.22, Math.ceil(t.length / 44) * 0.22));
}

function addTable(slide, item, x, y, w, h) {
  const rows = item.rows;
  const cols = Math.max(...rows.map((r) => r.length));
  const table = rows.map((r, i) =>
    Array.from({ length: cols }, (_, c) => ({
      text: r[c] || "",
      options: {
        fontFace: "Microsoft YaHei",
        fontSize: rows.length > 5 || cols > 3 ? 8.8 : 9.8,
        bold: i === 0,
        color: i === 0 ? C.white : C.body,
        fill: { color: i === 0 ? C.greenDark : i % 2 ? "FFFFFF" : "F9FAFB" },
        margin: 0.05,
        valign: "mid",
      },
    }))
  );
  slide.addTable(table, {
    x, y, w, h,
    colW: Array(cols).fill(w / cols),
    rowH: Array(rows.length).fill(h / rows.length),
    border: { type: "solid", color: "DDE3EA", pt: 0.5 },
    valign: "mid",
    margin: 0.04,
  });
}

function addMixedSlide(pptx, sec, items, page, pageLabel) {
  const slide = pptx.addSlide();
  addBg(slide);
  title(slide, sec.title, pageLabel);

  const tables = items.filter((i) => i.type === "table");
  const groups = groupBlocks(items.filter((i) => i.type !== "table"));
  if (tables.length) {
    const leftW = groups.some((g) => g.title || g.blocks.length) ? 4.2 : 0;
    if (leftW) {
      card(slide, 0.72, 1.55, leftW, 4.86, { fill: "F9FAFB" });
      let y = 1.88;
      groups.forEach((g, gi) => {
        if (g.title) {
          addIcon(slide, 1.02, y - 0.02, gi + 1);
          bodyText(slide, g.title, 1.47, y - 0.03, 2.85, 0.26, { fontSize: 11.2, bold: true, color: C.ink, margin: 0 });
          y += 0.42;
        }
        g.blocks.forEach((b) => {
          const h = textHeight(b.text);
          bodyText(slide, b.text, 1.08, y, 3.3, h, { fontSize: b.text.length > 70 ? 9.7 : 10.5, color: C.body });
          y += h + 0.12;
        });
      });
    }
    let tx = leftW ? 5.32 : 0.82;
    let tw = leftW ? 6.78 : 11.35;
    let y = 1.55;
    tables.forEach((t, i) => {
      const th = Math.min(4.84 - (i * 0.2), Math.max(1.25, t.rows.length * 0.45));
      card(slide, tx, y, tw, th + 0.18, { fill: "FFFFFF", line: "E5E7EB", shadow: true });
      addTable(slide, t, tx + 0.12, y + 0.12, tw - 0.24, th - 0.05);
      y += th + 0.34;
    });
  } else {
    const cols = groups.length <= 2 ? 2 : 3;
    const x0 = 0.82;
    const gap = 0.28;
    const cw = cols === 2 ? 5.5 : 3.55;
    groups.forEach((g, idx) => {
      const row = Math.floor(idx / cols);
      const col = idx % cols;
      const x = x0 + col * (cw + gap);
      const y = 1.55 + row * 2.35;
      const ch = groups.length <= 3 ? 4.75 : 2.02;
      card(slide, x, y, cw, ch, { fill: idx === 0 ? "F6FBF8" : "F9FAFB", line: idx === 0 ? "CDEFD8" : C.faint });
      if (g.title) {
        sectionLabel(slide, `ITEM ${String(idx + 1).padStart(2, "0")}`, x + 0.3, y + 0.28, idx === 0 ? C.greenDark : "9CA3AF");
        bodyText(slide, g.title, x + 0.3, y + 0.58, cw - 0.6, 0.25, { fontSize: 12.3, bold: true, color: C.ink, margin: 0 });
      }
      let ty = y + (g.title ? 1.02 : 0.32);
      g.blocks.forEach((b, bi) => {
        addIcon(slide, x + 0.3, ty + 0.02, bi + 1, idx === 0 ? C.greenDark : "9CA3AF");
        const h = textHeight(b.text);
        bodyText(slide, b.text, x + 0.76, ty - 0.01, cw - 1.05, h, {
          fontSize: b.text.length > 70 ? 9.6 : 10.5,
          color: C.body,
          margin: 0.01,
        });
        ty += h + 0.13;
      });
    });
  }
  addFooter(slide, page);
}

async function main() {
  const blocks = await extractDocx(input);
  const sections = makeSections(blocks);
  fs.writeFileSync(outlineOut, JSON.stringify({ input, sections }, null, 2), "utf8");

  const pptx = new pptxgen();
  pptx.defineLayout({ name: "CUSTOM_WIDE", width: W, height: H });
  pptx.layout = "CUSTOM_WIDE";
  pptx.margin = 0;
  pptx.author = "衍德教育科技有限公司";
  pptx.company = "衍德教育科技有限公司";
  pptx.subject = "2026年9月-2027年9月运营方案";
  pptx.title = sections[0].title;
  pptx.lang = "zh-CN";
  pptx.theme = {
    headFontFace: "Microsoft YaHei",
    bodyFontFace: "Microsoft YaHei",
    lang: "zh-CN",
  };

  let page = 1;
  addCover(pptx, sections);
  page++;
  sections.slice(1).forEach((sec, idx) => {
    addSectionSlide(pptx, sec, idx + 1, page++);
    const pages = chunks(sec.items, 520);
    pages.forEach((items, i) => addMixedSlide(pptx, sec, items, page++, pages.length > 1 ? `${i + 1}/${pages.length}` : ""));
  });
  await pptx.writeFile({ fileName: output });
  console.log(output);
  console.log(outlineOut);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
