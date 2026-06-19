import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";
import pptxgen from "pptxgenjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(dir, "衍德教育科技有限公司2026年9月-2027年9月运营方案.docx");
const output = path.join(dir, "衍德教育科技有限公司2026年9月-2027年9月运营方案_完整文字设计版.pptx");
const outlineOut = path.join(dir, "衍德运营方案_完整文字抽取.json");
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

function lines(text, chars = 54) {
  return Math.max(1, Math.ceil(text.length / chars));
}

function blockHeight(item) {
  if (item.type === "p" && item.level === 2) return 0.42;
  return 0.24 + lines(item.text, 58) * 0.2;
}

function paragraphPages(items) {
  const pages = [];
  let cur = [];
  let h = 0;
  for (const item of items) {
    const bh = blockHeight(item);
    if (cur.length && h + bh > 4.65) {
      pages.push(cur);
      cur = [];
      h = 0;
    }
    cur.push(item);
    h += bh;
  }
  if (cur.length) pages.push(cur);
  return pages;
}

function tableRowHeight(row, headers) {
  const joined = row.map((c, i) => `${headers[i] || ""}${c}`).join("");
  return Math.max(0.72, Math.min(1.55, 0.38 + lines(joined, 72) * 0.22));
}

function tablePages(table) {
  const headers = table.rows[0] || [];
  const rows = table.rows.slice(1);
  const pages = [];
  let cur = [];
  let h = 0.55;
  for (const row of rows) {
    const rh = tableRowHeight(row, headers);
    if (cur.length && h + rh > 4.75) {
      pages.push(cur);
      cur = [];
      h = 0.55;
    }
    cur.push(row);
    h += rh;
  }
  if (cur.length) pages.push(cur);
  return { headers, pages };
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
      fontFace: "Arial", fontSize: 8.5,
      color: C.muted, align: "right", margin: 0, fit: "shrink",
    });
  }
}

function text(slide, value, x, y, w, h, opts = {}) {
  slide.addText(value, {
    x, y, w, h,
    fontFace: "Microsoft YaHei",
    fontSize: opts.fontSize ?? 10.8,
    color: opts.color ?? C.body,
    bold: opts.bold ?? false,
    valign: opts.valign ?? "top",
    margin: opts.margin ?? 0.03,
    breakLine: false,
    fit: opts.fit ?? "shrink",
    paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 2,
    ...opts,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.05,
    fill: { color: opts.fill ?? C.panel },
    line: { color: opts.line ?? C.faint, width: opts.lineWidth ?? 0.6 },
    shadow: opts.shadow ? { type: "outer", color: "D1D5DB", opacity: 0.14, blur: 1, angle: 45, distance: 1 } : undefined,
  });
}

function icon(slide, x, y, n, color = C.greenDark) {
  slide.addShape(ShapeType.ellipse, {
    x, y, w: 0.34, h: 0.34,
    fill: { color: "FFFFFF" },
    line: { color, width: 1.15 },
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: x + 0.045, y: y + 0.085, w: 0.25, h: 0.1,
    fontFace: "Arial", fontSize: 6.6, bold: true,
    color, margin: 0, align: "center", fit: "shrink",
  });
}

function pill(slide, value, x, y, w, color = C.ink, fill = C.soft) {
  slide.addShape(ShapeType.roundRect, {
    x, y, w, h: 0.32,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color: fill, transparency: 100 },
  });
  slide.addText(value, {
    x: x + 0.1, y: y + 0.065, w: w - 0.2, h: 0.14,
    fontFace: "Microsoft YaHei", fontSize: 7.5,
    bold: true, color, align: "center", margin: 0, fit: "shrink",
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
    fontFace: "Microsoft YaHei", fontSize: 27,
    bold: true, color: C.ink, margin: 0, fit: "shrink",
  });
  slide.addShape(ShapeType.line, {
    x: 0.72, y: 2.12, w: 2.25, h: 0,
    line: { color: C.green, width: 3 },
  });
  text(slide, sections[0].items.map((i) => i.text).join("\n"), 0.72, 2.42, 6.75, 0.62, {
    fontSize: 14, color: C.body,
  });
  card(slide, 8.48, 0.92, 3.9, 5.1, { fill: "F9FAFB", shadow: true });
  sections.slice(1).forEach((s, i) => {
    const y = 1.34 + i * 0.86;
    icon(slide, 8.9, y + 0.02, i + 1, i === 2 ? C.yellow : C.greenDark);
    text(slide, s.title, 9.38, y, 2.45, 0.32, {
      fontSize: 10.6, bold: true, color: C.ink, margin: 0,
    });
  });
  pill(slide, "完整文字版", 0.72, 6.15, 1.35, C.greenDark, "E9F8EF");
  pill(slide, "运营方案", 2.24, 6.15, 1.25, C.ink, "F3F4F6");
  pill(slide, "2026-2027", 3.66, 6.15, 1.35, C.red, "FEECEC");
}

function addSectionSlide(pptx, sec, no, page) {
  const slide = pptx.addSlide();
  addBg(slide);
  title(slide, sec.title, "SECTION");
  text(slide, sec.title, 0.74, 2.0, 7.2, 0.64, {
    fontSize: 28, bold: true, color: C.ink, margin: 0,
  });
  slide.addShape(ShapeType.line, {
    x: 0.78, y: 2.92, w: 2.05, h: 0,
    line: { color: C.green, width: 3 },
  });
  const heads = sec.items.filter((i) => i.type === "p" && i.level === 2).map((i) => i.text);
  card(slide, 8.25, 1.6, 3.92, 4.45, { fill: "F9FAFB" });
  heads.slice(0, 6).forEach((h, i) => {
    const y = 1.98 + i * 0.58;
    icon(slide, 8.7, y - 0.02, i + 1, i === 0 ? C.greenDark : "9CA3AF");
    text(slide, h, 9.2, y - 0.03, 2.35, 0.25, {
      fontSize: 10.1, bold: true, color: C.body, margin: 0,
    });
  });
  slide.addText(String(no).padStart(2, "0"), {
    x: 0.78, y: 4.76, w: 1.25, h: 0.55,
    fontFace: "Arial", fontSize: 30,
    bold: true, color: C.greenDark, margin: 0,
  });
  addFooter(slide, page);
}

function addParagraphSlide(pptx, sec, items, page, label) {
  const slide = pptx.addSlide();
  addBg(slide);
  title(slide, sec.title, label);
  let y = 1.52;
  let idx = 1;
  for (const item of items) {
    if (item.level === 2) {
      card(slide, 0.78, y, 11.55, 0.48, { fill: "F6FBF8", line: "CDEFD8" });
      icon(slide, 1.02, y + 0.07, idx++, C.greenDark);
      text(slide, item.text, 1.48, y + 0.1, 10.25, 0.22, {
        fontSize: 12.2, bold: true, color: C.ink, margin: 0,
      });
      y += 0.62;
    } else {
      const h = 0.16 + lines(item.text, 62) * 0.22;
      slide.addShape(ShapeType.ellipse, {
        x: 1.06, y: y + 0.08, w: 0.08, h: 0.08,
        fill: { color: C.greenDark },
        line: { color: C.greenDark, transparency: 100 },
      });
      text(slide, item.text, 1.32, y, 10.72, h, {
        fontSize: 10.8, color: C.body, margin: 0.01,
      });
      y += h + 0.14;
    }
  }
  addFooter(slide, page);
}

function addTableSlide(pptx, sec, table, rows, headers, page, label) {
  const slide = pptx.addSlide();
  addBg(slide);
  title(slide, sec.title, label);
  card(slide, 0.78, 1.45, 11.76, 0.5, { fill: "111827", line: "111827" });
  text(slide, headers.join(" / "), 1.08, 1.61, 11.1, 0.14, {
    fontSize: 9.6, bold: true, color: C.white, margin: 0,
  });
  let y = 2.12;
  rows.forEach((row, ri) => {
    const rh = tableRowHeight(row, headers);
    card(slide, 0.78, y, 11.76, rh, { fill: ri % 2 ? "FFFFFF" : "F9FAFB", line: C.faint });
    const cols = row.length;
    if (cols <= 2) {
      text(slide, row[0] || "", 1.08, y + 0.2, 2.1, Math.max(0.25, rh - 0.35), {
        fontSize: 11.2, bold: true, color: C.greenDark, margin: 0.01,
      });
      text(slide, row[1] || "", 3.45, y + 0.18, 8.55, Math.max(0.26, rh - 0.32), {
        fontSize: 10.4, color: C.body, margin: 0.01,
      });
    } else {
      const cellW = 10.92 / cols;
      row.forEach((cell, ci) => {
        const x = 1.08 + ci * cellW;
        if (headers[ci]) {
          text(slide, headers[ci], x, y + 0.16, cellW - 0.16, 0.14, {
            fontSize: 7.4, bold: true, color: "9CA3AF", fontFace: "Arial", margin: 0,
          });
        }
        text(slide, cell, x, y + 0.38, cellW - 0.18, Math.max(0.23, rh - 0.5), {
          fontSize: cell.length > 38 ? 8.7 : 9.6,
          bold: ci === 0,
          color: ci === 0 ? C.greenDark : C.body,
          margin: 0.01,
        });
      });
    }
    y += rh + 0.16;
  });
  addFooter(slide, page);
}

function flushParagraphs(pptx, sec, pending, pageRef) {
  if (!pending.length) return;
  const pages = paragraphPages(pending);
  pages.forEach((items, i) => addParagraphSlide(pptx, sec, items, pageRef.value++, pages.length > 1 ? `${i + 1}/${pages.length}` : ""));
  pending.length = 0;
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

  const pageRef = { value: 1 };
  addCover(pptx, sections);
  pageRef.value++;
  sections.slice(1).forEach((sec, idx) => {
    addSectionSlide(pptx, sec, idx + 1, pageRef.value++);
    const pending = [];
    sec.items.forEach((item) => {
      if (item.type === "table") {
        flushParagraphs(pptx, sec, pending, pageRef);
        const { headers, pages } = tablePages(item);
        pages.forEach((rows, i) => addTableSlide(pptx, sec, item, rows, headers, pageRef.value++, pages.length > 1 ? `${i + 1}/${pages.length}` : "TABLE"));
      } else {
        pending.push(item);
      }
    });
    flushParagraphs(pptx, sec, pending, pageRef);
  });

  await pptx.writeFile({ fileName: output });
  console.log(output);
  console.log(outlineOut);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
