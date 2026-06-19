import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const baseDir = path.join(root, "05_总招生手册_初稿图文版");
const manifest = JSON.parse(fs.readFileSync(path.join(baseDir, "asset_manifest.json"), "utf8"));
const outDir = path.join(baseDir, "PPT_横版招生手册SAIS风格V2");
const pageDir = path.join(outDir, "pages");
const outPptx = path.join(outDir, "奥斯翰国际部招生宣传册_横版PPT_SAIS风格V2.pptx");
const outMd = path.join(outDir, "奥斯翰国际部招生宣传册_横版PPT_SAIS风格V2_说明.md");
fs.mkdirSync(pageDir, { recursive: true });

try {
  GlobalFonts.registerFromPath("C:/Windows/Fonts/msyh.ttc", "Microsoft YaHei");
  GlobalFonts.registerFromPath("C:/Windows/Fonts/msyhbd.ttc", "Microsoft YaHei");
  GlobalFonts.registerFromPath("C:/Windows/Fonts/simhei.ttf", "SimHei");
} catch {}

const W = 1920, H = 1080;
const P = {
  paper: "#F8F4EC",
  cream: "#EFE7D7",
  white: "#FFFFFF",
  ink: "#152337",
  muted: "#65717E",
  gold: "#B89335",
  red: "#B74A3D",
  teal: "#126E78",
  green: "#5F7F69",
  blue: "#183D5A",
  pale: "#E7D8B5",
  line: "#D8CAA4",
};
const asset = (key) => path.join(baseDir, manifest[key] || "");

function font(size, weight = 400) {
  return `${weight} ${size}px "Microsoft YaHei", "SimHei", Arial`;
}
function fill(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function rr(ctx, x, y, w, h, r = 18, color = P.white, stroke = null, lw = 2) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (color) {
    ctx.fillStyle = color;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw;
    ctx.stroke();
  }
}
function wrap(ctx, text, maxW, spec) {
  ctx.font = spec;
  const lines = [];
  for (const p of String(text).split("\n")) {
    let line = "";
    for (const ch of [...p]) {
      const next = line + ch;
      if (ctx.measureText(next).width > maxW && line) {
        lines.push(line);
        line = ch;
      } else line = next;
    }
    if (line) lines.push(line);
  }
  return lines;
}
function text(ctx, str, x, y, w, size = 26, color = P.ink, lh = 1.45, weight = 400, maxLines = 99, align = "left") {
  const spec = font(size, weight);
  ctx.font = spec;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  const lines = wrap(ctx, str, w, spec).slice(0, maxLines);
  for (let i = 0; i < lines.length; i++) {
    let xx = x;
    const mw = ctx.measureText(lines[i]).width;
    if (align === "center") xx = x + (w - mw) / 2;
    if (align === "right") xx = x + w - mw;
    ctx.fillText(lines[i], xx, y + i * size * lh);
  }
  return y + lines.length * size * lh;
}
async function img(ctx, key, x, y, w, h, alpha = 1) {
  const file = asset(key);
  if (!fs.existsSync(file)) return;
  const image = await loadImage(file);
  const scale = Math.max(w / image.width, h / image.height);
  const sw = w / scale, sh = h / scale;
  const sx = (image.width - sw) / 2, sy = (image.height - sh) / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}
function arrow(ctx, x1, y1, x2, y2, color = P.gold, lw = 5) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lw;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1), s = 18;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * Math.cos(a - Math.PI / 6), y2 - s * Math.sin(a - Math.PI / 6));
  ctx.lineTo(x2 - s * Math.cos(a + Math.PI / 6), y2 - s * Math.sin(a + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function head(ctx, cn, en, sub = "", x = 110, y = 98, w = 1250) {
  text(ctx, en.toUpperCase(), x, y, w, 22, P.gold, 1, 800, 1);
  const yy = text(ctx, cn, x, y + 76, w, 54, P.ink, 1.15, 800, 2);
  if (sub) return text(ctx, sub, x, yy + 18, w, 24, P.muted, 1.45, 400, 3);
  return yy;
}
function footer(ctx, n) {
  text(ctx, `OXSTAND INTERNATIONAL SCHOOL  |  ${String(n).padStart(2, "0")}`, 110, 1032, 680, 16, "#8994A0", 1, 700, 1);
}
function dot(ctx, x, y, c = P.gold) {
  ctx.beginPath();
  ctx.arc(x, y, 7, 0, Math.PI * 2);
  ctx.fillStyle = c;
  ctx.fill();
}
function bullets(ctx, items, x, y, w, size = 23, color = P.gold) {
  let yy = y;
  for (const item of items) {
    dot(ctx, x + 8, yy - 8, color);
    yy = text(ctx, item, x + 28, yy, w - 28, size, P.ink, 1.45, 400, 3) + 12;
  }
  return yy;
}
function card(ctx, x, y, w, h, title, body, color = P.gold) {
  rr(ctx, x, y, w, h, 8, P.white, P.line);
  fill(ctx, color, x, y, 8, h);
  text(ctx, title, x + 28, y + 48, w - 56, 27, P.ink, 1.15, 800, 2);
  if (body) text(ctx, body, x + 28, y + 108, w - 56, 20, P.muted, 1.45, 400, 5);
}
function metric(ctx, num, label, x, y, c = P.red) {
  text(ctx, num, x, y, 220, 62, c, 1, 800, 1, "center");
  text(ctx, label, x - 15, y + 58, 250, 22, P.ink, 1.3, 700, 2, "center");
}
function table(ctx, x, y, colWs, rowH, rows, opts = {}) {
  const totalW = colWs.reduce((a, b) => a + b, 0);
  rows.forEach((row, r) => {
    let xx = x;
    const h = rowH[r] || rowH[rowH.length - 1];
    row.forEach((cell, c) => {
      const bg = r === 0 ? (opts.header || P.blue) : (r % 2 ? P.white : "#F3EBDD");
      fill(ctx, bg, xx, y, colWs[c], h);
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(xx, y, colWs[c], h);
      text(ctx, cell, xx + 14, y + (r === 0 ? 38 : 34), colWs[c] - 28, r === 0 ? 20 : 18, r === 0 ? P.white : P.ink, 1.25, r === 0 ? 800 : 400, 3, opts.align || "left");
      xx += colWs[c];
    });
    y += h;
  });
  return totalW;
}
function chapter(ctx, no, cn, en, desc, imageKey = "campus1", right = true) {
  fill(ctx, P.paper, 0, 0, W, H);
  if (right) {
    img(ctx, imageKey, 1040, 0, 880, H, .9);
    fill(ctx, "rgba(248,244,236,.16)", 1040, 0, 880, H);
    text(ctx, no, 120, 250, 220, 84, P.gold, 1, 800, 1);
    text(ctx, cn, 120, 390, 820, 70, P.ink, 1.18, 800, 3);
    text(ctx, en, 125, 630, 760, 24, P.gold, 1.2, 800, 2);
    text(ctx, desc, 125, 720, 790, 30, P.muted, 1.45, 400, 3);
  } else {
    img(ctx, imageKey, 0, 0, 860, H, .9);
    fill(ctx, "rgba(21,35,55,.55)", 0, 0, 860, H);
    text(ctx, no, 1010, 250, 220, 84, P.gold, 1, 800, 1);
    text(ctx, cn, 1010, 390, 780, 70, P.ink, 1.18, 800, 3);
    text(ctx, en, 1015, 630, 760, 24, P.gold, 1.2, 800, 2);
    text(ctx, desc, 1015, 720, 780, 30, P.muted, 1.45, 400, 3);
  }
}
function blank() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  fill(ctx, P.paper, 0, 0, W, H);
  return { canvas, ctx };
}
async function save(pages, name, fn) {
  const { canvas, ctx } = blank();
  await fn(ctx);
  footer(ctx, pages.length + 1);
  const file = path.join(pageDir, `${String(pages.length + 1).padStart(2, "0")}_${name}.jpg`);
  fs.writeFileSync(file, await canvas.encode("jpeg", 90));
  pages.push(file);
}

async function buildPages() {
  const pages = [];

  await save(pages, "cover", async (ctx) => {
    await img(ctx, "cover", 0, 0, W, H, 1);
    fill(ctx, "rgba(21,35,55,.72)", 0, 0, W, H);
    text(ctx, "OXSTAND INTERNATIONAL SCHOOL", 115, 185, 840, 23, "#E8D3A0", 1, 800, 1);
    text(ctx, "深圳奥斯翰外语学校\n国际部招生手册", 115, 340, 980, 78, P.white, 1.18, 800, 3);
    text(ctx, "精品国际课程 · 多路径升学规划 · 小规模精细化支持", 120, 620, 900, 32, "#F3E8CA", 1.4, 400, 2);
  });

  await save(pages, "contents", async (ctx) => {
    fill(ctx, P.paper, 0, 0, W, H);
    fill(ctx, "#EDE2CC", 0, 0, W, 138);
    text(ctx, "CONTENTS", 118, 92, 520, 38, P.gold, 1, 800, 1);
    text(ctx, "目录", 650, 92, 220, 44, P.ink, 1, 800, 1);
    const items = [
      ["01", "关于奥斯翰", "School Profile", P.gold],
      ["02", "课程体系总览", "Curriculum Map", P.teal],
      ["03", "OSSD 中加课程", "Ontario Secondary School Diploma", P.red],
      ["04", "AP 国际课程", "Advanced Placement", P.blue],
      ["05", "日韩小语种升学", "KUPP / JUPP", P.green],
      ["06", "IGCSE / A-Level", "British Pathway", P.gold],
      ["07", "新加坡 IFD 方向", "Singapore Pathway", P.teal],
      ["08", "师资与升学服务", "Faculty & Guidance", P.red],
      ["09", "入学咨询与费用", "Admission & Fees", P.blue],
    ];
    items.forEach((it, i) => {
      const col = i < 5 ? 0 : 1;
      const row = col === 0 ? i : i - 5;
      const x = 120 + col * 840;
      const y = 230 + row * 142;
      fill(ctx, i % 2 ? "#F2E8D6" : P.white, x, y, 735, 96);
      fill(ctx, it[3], x, y, 14, 96);
      text(ctx, it[0], x + 46, y + 62, 90, 44, it[3], 1, 800, 1);
      text(ctx, it[1], x + 150, y + 52, 360, 30, P.ink, 1, 800, 1);
      text(ctx, it[2], x + 150, y + 82, 450, 18, P.muted, 1, 400, 1);
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(x, y, 735, 96);
    });
    fill(ctx, P.gold, 1655, 208, 12, 665);
    text(ctx, "从学校实力到课程路径，从教学支持到入学咨询，一本册子讲清楚奥斯翰国际部的升学选择。", 126, 945, 1450, 24, P.muted, 1.4, 400, 2);
  });

  await save(pages, "about-chapter", async (ctx) => chapter(ctx, "01", "关于奥斯翰", "School Profile", "深圳老牌民办国际化高中，以外语特色和多路径课程为学生打开更适合的升学选择。", "campus1"));

  await save(pages, "school-profile", async (ctx) => {
    head(ctx, "深圳本土办学二十余年", "About Oxstand", "2004年经深圳市教育局批准创办，学校位于深圳市罗湖区布心路2040号。", 110, 100, 980);
    text(ctx, "学校以“与世界同步，培育跨时代精英人才”为育人目标，运用ISO9001国际优质管理系统，植根中华传统文化，融贯东西方教育思想，依托外语特色，先后开设加拿大OSSD课程、韩国大学直升课程、日本大学直升课程、AP国际课程、IGCSE/A-Level衔接课程、新加坡IFD方向等多元升学路径。", 116, 310, 1000, 29, P.ink, 1.65, 400, 8);
    const ms = [["2004", "创校时间"], ["20+", "办学积累"], ["多语种", "外语学校底色"], ["多路径", "国际升学出口"]];
    ms.forEach((m, i) => metric(ctx, m[0], m[1], 140 + i * 245, 775, i % 2 ? P.teal : P.gold));
    await img(ctx, "cover", 1250, 150, 520, 740, .92);
  });

  await save(pages, "advantages", async (ctx) => {
    head(ctx, "奥斯翰的四个招生优势", "Why Oxstand", "对家长而言，选择课程之前，首先要判断学校是否能稳定托举孩子三年的成长。", 110, 100, 1180);
    const items = [
      ["老牌办学积累", "20余年本土办学经验，熟悉深圳家庭对国际升学的真实需求。", P.gold],
      ["外语特色底色", "英语、日语、韩语等语言资源，为不同国家出口提供语言基础。", P.teal],
      ["小规模精细管理", "更短的反馈链条、更近的师生关系，便于持续跟踪学习状态。", P.red],
      ["多路径升学规划", "OSSD、AP、日韩、IGCSE/A-Level、新加坡方向，按目标匹配课程。", P.blue],
    ];
    items.forEach((it, i) => {
      const x = 140 + i * 435;
      rr(ctx, x, 330, 360, 450, 6, P.white, P.line);
      text(ctx, `0${i + 1}`, x + 36, 420, 160, 52, it[2], 1, 800, 1);
      text(ctx, it[0], x + 36, 540, 290, 31, P.ink, 1.15, 800, 2);
      text(ctx, it[1], x + 36, 660, 290, 22, P.muted, 1.5, 400, 4);
      fill(ctx, it[2], x, 330, 360, 12);
    });
  });

  await save(pages, "history", async (ctx) => {
    head(ctx, "创校历程", "School Development History", "二十余年办学积累，形成外语特色、多元课程与国际升学服务基础。", 110, 92, 1180);
    const nodes = [
      ["2004", "学校创办", false], ["2006", "深圳市一级学校", false], ["2007", "加拿大国际课程通过安省教育部资质验收", true],
      ["2008", "ISO9001国际优质教育管理认证", true], ["2009", "引进韩国大学直升课程", true], ["2010", "广东省民办教育发展示范名校", false],
      ["2011", "英国留学直通车UCAS资质", true], ["2012", "引进日本大学先修课程", true], ["2013", "深圳市高考先进单位", false],
      ["2014", "教育科研先进学校", false], ["2016", "College Board批准成为AP授权学校", true], ["2017", "广东省依法治校示范学校", false],
      ["2018", "罗湖区教育先进单位与德育先进单位", false], ["2020", "IBDP世界学校", true], ["2023", "清华美院美育课题项目合作学校", false], ["2024", "AP授权代码579073可查", true],
    ];
    fill(ctx, "#EEE4D1", 105, 292, 1710, 515);
    const x0 = 145, y0 = 330, gapX = 210, gapY = 178;
    nodes.forEach((n, i) => {
      const x = x0 + (i % 8) * gapX, y = y0 + Math.floor(i / 8) * gapY;
      rr(ctx, x, y, 175, 124, 8, n[2] ? "#FFF8ED" : P.white, n[2] ? P.red : P.line, n[2] ? 4 : 1.5);
      text(ctx, n[0], x + 12, y + 46, 150, 28, n[2] ? P.red : P.gold, 1, 800, 1, "center");
      text(ctx, n[1], x + 14, y + 82, 146, 15, P.ink, 1.22, n[2] ? 800 : 400, 4, "center");
      if (i % 8 !== 7) arrow(ctx, x + 178, y + 62, x + 203, y + 62, n[2] ? P.red : P.gold, 3);
    });
    fill(ctx, P.blue, 118, 855, 1660, 88);
    text(ctx, "国际课程重点节点", 158, 910, 250, 28, P.white, 1, 800, 1);
    text(ctx, "加拿大课程、日韩小语种、UCAS资质、AP授权、IBDP世界学校等节点，构成奥斯翰多路径升学体系的基础。", 430, 907, 1280, 22, "#F4EBD8", 1.35, 400, 2);
  });

  await save(pages, "curriculum-chapter", async (ctx) => chapter(ctx, "02", "课程体系总览", "Curriculum Map", "先看目标国家，再选择课程路径；先看学生基础，再设计三年学习节奏。", "activity1", false));

  await save(pages, "curriculum-map", async (ctx) => {
    head(ctx, "奥斯翰国际课程地图", "Curriculum Map", "先看目标方向，再看考试体系；先看学生基础，再设计三年节奏。", 110, 95, 1260);
    const routes = [
      ["OSSD", "加拿大安省文凭", "过程评价 / 6门12年级成绩", "加拿大、英美澳港多国", P.red],
      ["AP", "美国大学先修课程", "AP科目 + SAT/语言成绩", "美国、香港及多国申请", P.blue],
      ["KUPP / JUPP", "日韩小语种升学", "TOPIK / JLPT / EJU / 面试", "韩国、日本本科", P.green],
      ["IG / A-Level", "英式课程路径", "IGCSE + 3-4门A-Level", "英国、香港、澳洲、加拿大", P.gold],
      ["IFD", "新加坡方向", "语言 + 预科能力 + 学分衔接", "新加坡本科与后期转轨", P.teal],
    ];
    routes.forEach((r, i) => {
      const x = 125 + i * 350;
      fill(ctx, i % 2 ? "#F2E9D8" : P.white, x, 312, 310, 430);
      fill(ctx, r[4], x, 312, 310, 18);
      text(ctx, r[0], x + 28, 400, 250, 35, r[4], 1, 800, 1, "center");
      text(ctx, r[1], x + 26, 480, 258, 25, P.ink, 1.2, 800, 2, "center");
      text(ctx, r[2], x + 34, 590, 242, 19, P.muted, 1.35, 400, 3, "center");
      fill(ctx, "#EFE1C4", x + 28, 666, 254, 2);
      text(ctx, r[3], x + 34, 720, 242, 20, P.ink, 1.35, 700, 3, "center");
      ctx.strokeStyle = P.line;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(x, 312, 310, 430);
    });
    fill(ctx, P.blue, 160, 822, 1600, 92);
    text(ctx, "奥斯翰的优势不是把所有学生推向同一条路，而是让不同语言基础、学科优势与家庭规划的学生，都能找到更适合的升学路径。", 220, 880, 1480, 26, "#F5EBD4", 1.35, 800, 2, "center");
  });

  await save(pages, "pathway-choice", async (ctx) => {
    head(ctx, "家长如何理解课程选择", "How to Choose", "从目标、语言、学科和家庭规划四个维度判断孩子适合哪条路径。", 110, 95, 1150);
    const items = [
      ["目标国家", "先确定英美加澳、日韩、新加坡或多国申请方向"],
      ["语言基础", "英语、韩语、日语基础决定进入课程后的适应速度"],
      ["学科优势", "数学、理科、商科、艺术、人文方向决定选课组合"],
      ["申请方式", "标化、过程评价、语言考试、校内考等路径差异明显"],
    ];
    items.forEach((it, i) => {
      const x = 180 + i * 405;
      rr(ctx, x, 360, 310, 260, 8, P.white, P.line);
      text(ctx, `0${i + 1}`, x + 32, 430, 90, 42, [P.gold, P.teal, P.red, P.blue][i], 1, 800, 1);
      text(ctx, it[0], x + 32, 500, 250, 30, P.ink, 1, 800, 1);
      text(ctx, it[1], x + 32, 580, 240, 21, P.muted, 1.45, 400, 3);
      if (i < 3) arrow(ctx, x + 315, 490, x + 390, 490, P.gold, 5);
    });
    fill(ctx, P.cream, 190, 760, 1540, 120);
    text(ctx, "奥斯翰的课程体系，让学生可以从基础能力建设出发，逐步找到更适合自己的国家方向、学术路径和大学申请方案。", 250, 835, 1420, 30, P.ink, 1.35, 700, 2, "center");
  });

  await save(pages, "ossd-chapter", async (ctx) => chapter(ctx, "03", "OSSD 中加课程", "Ontario Secondary School Diploma", "加拿大安大略省高中课程路径，强调过程评价与多国大学申请。", "bond2"));

  await save(pages, "ossd-intro", async (ctx) => {
    head(ctx, "什么是 OSSD", "Program Overview", "加拿大安大略省高中毕业文凭，以过程评价、安省课程与多国申请通道为核心优势。", 110, 95, 1260);
    card(ctx, 130, 330, 500, 320, "过程评价更稳妥", "课堂表现、作业、项目、阶段测试与最终评价共同构成成绩，减少单次考试波动对升学的影响。", P.gold);
    card(ctx, 710, 330, 500, 320, "6门12年级成绩申请", "学生以12年级6门4U/4M课程学术成绩与语言成绩作为核心材料，面向加拿大及多国大学申请。", P.teal);
    card(ctx, 1290, 330, 500, 320, "安省体系全球认可", "课程学习、学分要求和毕业文凭均服务海外本科申请，在高中阶段建立大学所需的学术英语与学科能力。", P.red);
    text(ctx, "适合学生：希望避开单一高考路径，重视平时学习积累，希望用更灵活方式申请加拿大、英国、美国、澳洲、香港等方向的学生。", 180, 815, 1540, 30, P.ink, 1.35, 800, 2, "center");
  });

  await save(pages, "ossd-oxstand", async (ctx) => {
    head(ctx, "奥斯翰邦德 OSSD 项目", "Oxstand Bond OSSD Program", "项目与加拿大邦德多伦多学院合作设立，学生在奥斯翰完成中加两国高中课程。", 110, 95, 1260);
    const items = [
      ["安省学籍路径", "学生按课程进度注册安大略省高中学籍，以安省高中课程成绩服务海外本科申请。"],
      ["中加课程衔接", "中方基础课程与加方课程共同构成高中阶段学习体系，循序渐进完成学术过渡。"],
      ["OCT外教课程", "加方课程由具备安省教师资格背景的教师授课，重视课堂参与、项目作业与学术表达。"],
      ["一站式升学服务", "课程学习、语言标化、社会实践、申请文书、签证与行前支持系统推进。"],
    ];
    items.forEach((it, i) => card(ctx, 140 + (i % 2) * 820, 315 + Math.floor(i / 2) * 250, 720, 170, it[0], it[1], [P.gold, P.teal, P.red, P.blue][i]));
    await img(ctx, "ossd1", 1240, 690, 520, 240, .9);
  });

  await save(pages, "ossd-curriculum", async (ctx) => {
    head(ctx, "OSSD课程设置", "Curriculum Structure", "高一、高二、高三逐步从中方基础课程过渡到加方学术课程。", 110, 95, 1160);
    table(ctx, 120, 315, [250, 520, 520, 450], [62, 128, 128, 128], [
      ["年级", "课程重点", "代表课程", "阶段目标"],
      ["高一", "中方基础课程 + 2-3门加方语言和文科课程", "ESL-C/D、Career Planning、生涯课程等", "完成语言适应与加方课程入门"],
      ["高二", "少量中方基础课 + 6门加方文理科学术课程", "ENG2D、ENG3U、MCR3U、SPU3U、CIE3M等", "进入安省学术课程主线"],
      ["高三", "6-7门加方12年级学术课程", "ENG4U、MHF4U、MCV4U、BBB4M、SPH4U、SCH4U等", "形成大学申请核心成绩"],
    ]);
  });

  await save(pages, "ossd-services", async (ctx) => {
    head(ctx, "OSSD升学支持", "University Guidance", "从入学到升学，围绕课程成绩、语言成绩与申请材料形成完整服务闭环。", 110, 95, 1200);
    const steps = [["01", "选课规划"], ["02", "语言标化"], ["03", "社会实践"], ["04", "院校申请"], ["05", "签证行前"]];
    steps.forEach((s, i) => {
      const x = 170 + i * 330;
      rr(ctx, x, 390, 250, 210, 8, P.white, P.line);
      text(ctx, s[0], x + 45, 470, 160, 46, [P.gold, P.teal, P.red, P.blue, P.green][i], 1, 800, 1, "center");
      text(ctx, s[1], x + 45, 545, 160, 27, P.ink, 1, 800, 1, "center");
      if (i < 4) arrow(ctx, x + 255, 495, x + 320, 495, P.gold, 5);
    });
    text(ctx, "家长看到的不只是课程名称，而是孩子从入学评估、课程学习、语言考试到大学申请的完整路径。", 275, 785, 1380, 30, P.ink, 1.35, 800, 2, "center");
  });

  await save(pages, "ap-chapter", async (ctx) => chapter(ctx, "04", "AP 国际课程", "Advanced Placement Program", "美国大学理事会授权课程，School Code 579073，为学生提供高挑战度学科证明。", "campus2", false));

  await save(pages, "ap-intro", async (ctx) => {
    head(ctx, "什么是 AP 课程", "Program Overview", "AP是美国大学理事会推出的大学先修课程体系，帮助学生用高挑战度学科成绩展示大学学习潜力。", 110, 95, 1260);
    fill(ctx, P.blue, 130, 330, 600, 420);
    text(ctx, "School Code", 185, 445, 470, 34, "#D8C08A", 1, 800, 1, "center");
    text(ctx, "579073", 185, 555, 470, 82, P.white, 1, 800, 1, "center");
    text(ctx, "College Board授权身份清晰可查", 185, 665, 470, 27, "#F5E6C0", 1, 700, 1, "center");
    card(ctx, 820, 330, 430, 190, "官方体系背书", "授权代码可查，让课程身份与考试路径更加清晰。", P.gold);
    card(ctx, 1320, 330, 430, 190, "高挑战学科证明", "AP成绩可展示学生提前学习大学先修内容的能力。", P.teal);
    card(ctx, 820, 585, 430, 190, "多国申请适配", "适合美国、香港及多国综合申请，与SAT、托福/雅思共同规划。", P.red);
    card(ctx, 1320, 585, 430, 190, "专业画像更鲜明", "通过微积分、科学、经济、历史等科目强化目标专业竞争力。", P.blue);
  });

  await save(pages, "ap-curriculum", async (ctx) => {
    head(ctx, "AP课程设置", "Course Offerings", "从Pre-Program到G11-G12 AP冲刺，逐步完成基础能力、学科能力与申请能力建设。", 110, 95, 1200);
    table(ctx, 130, 300, [280, 480, 470, 520], [62, 110, 110, 110, 110], [
      ["阶段", "必修基础", "AP科目方向", "语言与申请支持"],
      ["Pre-Program / G10", "综合英语、数学、综合科学、世界历史、全球视野、基础经济学", "完成AP前置能力建设", "英语听说读写、学术写作、口语表达"],
      ["G11-G12", "英语语法与写作、数学、全球视野、英语文学鉴赏", "AP微积分AB/BC、AP预科微积分、AP化学、生物、物理、微观/宏观经济、世界历史、中文", "SAT数学、托福、雅思、选校规划"],
      ["选修拓展", "中文、中国文学、运动科学", "韩国语、西班牙语、日语、韩国文化与历史", "多语种能力与跨文化背景补充"],
    ]);
  });

  await save(pages, "ap-pathway", async (ctx) => {
    head(ctx, "AP学习路径", "Learning Journey", "三阶段递进：先打基础，再学科过渡，最后完成AP与大学申请冲刺。", 110, 95, 1160);
    const stages = [
      ["G7-G8", "SAT&AP准备", "英语基础与中级课程、代数几何、基础科学和地理课程。"],
      ["G9-G10", "SAT&AP过渡", "提升学科英语能力，开始AP相关学科准备。"],
      ["G11-G12", "SAT&AP冲刺", "AP科目学习、SAT/语言考试、申请材料同步推进。"],
    ];
    stages.forEach((s, i) => {
      const x = 190 + i * 560;
      rr(ctx, x, 390, 430, 310, 8, P.white, [P.gold, P.teal, P.red][i], 4);
      text(ctx, s[0], x + 50, 475, 330, 38, [P.gold, P.teal, P.red][i], 1, 800, 1, "center");
      text(ctx, s[1], x + 50, 545, 330, 32, P.ink, 1, 800, 1, "center");
      text(ctx, s[2], x + 55, 625, 320, 22, P.muted, 1.4, 400, 3, "center");
      if (i < 2) arrow(ctx, x + 440, 545, x + 535, 545, P.gold, 5);
    });
  });

  await save(pages, "ap-advantages", async (ctx) => {
    head(ctx, "为什么选择奥斯翰 AP", "Program Highlights", "奥斯翰AP把授权课程、学科组合、语言标化和升学申请放进同一套规划里。", 110, 95, 1260);
    const items = [
      ["授权优势", "College Board授权学校，School Code 579073，课程身份清晰可查，是AP招生表达中的核心信任点。"],
      ["科目组合", "覆盖数学、科学、经济、历史、中文等方向，服务理工、商科、人文多类专业。"],
      ["申请协同", "AP与SAT、托福/雅思、活动背景、文书规划联动，帮助学生把成绩转化为申请竞争力。"],
      ["延时选修支持", "托福、雅思、SAT数学、学术写作、英语口语、小语种等选修支持学生按目标补强。"],
    ];
    items.forEach((it, i) => card(ctx, 150 + (i % 2) * 820, 330 + Math.floor(i / 2) * 245, 720, 170, it[0], it[1], [P.gold, P.teal, P.red, P.blue][i]));
  });

  await save(pages, "jk-chapter", async (ctx) => chapter(ctx, "05", "日韩小语种升学", "KUPP / JUPP", "两条小语种路径，一条通向韩国名校，一条通向日本本科，发挥奥斯翰外语学校特色。", "japan1"));

  await save(pages, "korea-intro", async (ctx) => {
    head(ctx, "韩国大学直升课程 KUPP", "Korea University Pathway Program", "深圳首家开设韩国语小语种课的全日制高中之一，深耕韩国留学教育，帮助学生从韩语能力走向韩国本科申请。", 110, 95, 1300);
    metric(ctx, "100%", "整体升学率", 190, 390, P.red);
    metric(ctx, "40%+", "TOP10顶尖本科录取率", 520, 390, P.gold);
    metric(ctx, "90%+", "TOP20重本率", 850, 390, P.teal);
    card(ctx, 1220, 330, 520, 240, "课程定位", "面向目标韩国本科的学生，围绕韩语学习、文化课程、TOPIK考试、院校申请和留学服务展开。", P.red);
    text(ctx, "学生通过校内课程成绩、TOPIK成绩及申请材料冲刺韩国知名大学；课程以语言、文化、升学三线并行推进。", 180, 760, 1480, 30, P.ink, 1.4, 700, 2, "center");
  });

  await save(pages, "korea-pathway", async (ctx) => {
    head(ctx, "三年TOPIK递进培养路径", "Three-Year Learning Journey", "从零基础到TOPIK高级目标，语言学习与升学规划同步推进。", 110, 95, 1200);
    table(ctx, 130, 305, [250, 390, 520, 520], [62, 126, 126, 126], [
      ["年级", "TOPIK目标", "课程重点", "升学任务"],
      ["高一", "TOPIK 1-2", "韩国语入门、文化学科、国际交流、跨文化学习", "建立韩语基础，初步了解韩国高校与专业方向"],
      ["高二", "TOPIK 3-4", "中级韩国语、韩国文化与历史、学业规划", "确定目标院校与专业，准备申请材料"],
      ["高三", "TOPIK 5-6", "高级韩国语、TOPIK冲刺、留学生活指导", "一站式升学服务，完成申请与入学衔接"],
    ]);
  });

  await save(pages, "korea-universities", async (ctx) => {
    head(ctx, "韩国名校与优势专业", "Academic Pathways", "韩国高校在商科、理工、艺术设计、传媒影视、医学与健康科学等方向具有较强优势。", 110, 95, 1260);
    table(ctx, 130, 290, [300, 180, 250, 430, 390], [58, 74, 74, 74, 74, 74, 74], [
      ["韩国大学", "韩国排名", "QS排名", "优势专业", "对应国内院校"],
      ["首尔国立大学", "1", "31", "工科、医学、AI、商科、传媒", "清华大学"],
      ["韩国科学技术院", "2", "53", "计算机、机器人、材料科学", "北京大学"],
      ["延世大学", "3", "56", "医学、商科、经营管理", "复旦大学"],
      ["高丽大学", "4", "67", "法学、传媒、半导体、商科", "上海交通大学"],
      ["成均馆大学", "5", "123", "半导体、AI、经营学", "中国科学技术大学"],
      ["弘益大学", "8", "艺术类150", "美术、设计类", "中央美院、清华美院"],
    ]);
  });

  await save(pages, "japan-intro", async (ctx) => {
    head(ctx, "日本大学直升课程 JUPP", "Japan University Pathway Program", "专为目标日本本科的高中生设计，围绕日语能力、EJU留考、JLPT考试、升学规划和日本文化适应展开。", 110, 95, 1300);
    metric(ctx, "14年", "日本方向办学经验", 170, 380, P.gold);
    metric(ctx, "100%", "升学率", 500, 380, P.red);
    metric(ctx, "99%+", "签证率", 830, 380, P.teal);
    card(ctx, 1180, 330, 560, 270, "课程定位", "零基础可入读，由日籍外教及中方日语教师共同授课，面向NAT、JLPT、EJU、校内考与面试进行专项指导。", P.green);
    text(ctx, "日本方向适合希望通过日语能力、留考成绩、面试与推荐通道申请日本本科的学生，文理、艺术方向均可规划。", 185, 780, 1480, 30, P.ink, 1.4, 700, 2, "center");
  });

  await save(pages, "japan-pathway", async (ctx) => {
    head(ctx, "日本方向升学模式", "Pathway Options", "根据学生日语基础、目标院校和家庭规划，形成不同升学衔接路径。", 110, 95, 1180);
    const routes = [
      ["3+0", "3年奥斯翰高中", "日语N2以上", "网上考试和面试", "直升日本合作本科院校"],
      ["3+0.5", "3年奥斯翰高中", "日语N2以上", "0.5年合作语言学校", "衔接日本名校本科"],
      ["2/2.5+1.5", "奥斯翰高中阶段", "JLPT N3以上", "日本合作高中", "推荐大学本科"],
    ];
    routes.forEach((r, i) => {
      const y = 320 + i * 190;
      text(ctx, r[0], 150, y + 75, 150, 46, [P.gold, P.teal, P.red][i], 1, 800, 1);
      for (let j = 1; j < r.length; j++) {
        const x = 330 + (j - 1) * 345;
        rr(ctx, x, y, 260, 105, 6, P.white, P.line);
        text(ctx, r[j], x + 18, y + 60, 224, 20, P.ink, 1.2, 700, 2, "center");
        if (j < r.length - 1) arrow(ctx, x + 265, y + 52, x + 330, y + 52, P.gold, 4);
      }
    });
  });

  await save(pages, "japan-curriculum", async (ctx) => {
    head(ctx, "日本课程设置", "Curriculum Structure", "日语能力、EJU留考、升学面试、国际交流与文化适应同步推进。", 110, 95, 1160);
    table(ctx, 130, 305, [220, 480, 470, 540], [62, 128, 128, 128], [
      ["年级", "语言目标", "核心课程", "升学支持"],
      ["高一", "N5 / N4", "日语入门、日本文化、日语词汇语法、听力、会话演讲、国学", "国际交流、综合拓展、基础规划"],
      ["高二", "N3 / N2", "日语阅读写作、EJU留考、JLPT备考、日本文化、生涯规划", "升学面试辅导、目标院校规划"],
      ["高三", "N2 / N1", "JLPT冲刺、EJU留考、日语综合能力强化", "一对一升学规划、留学生活指导、职业规划"],
    ]);
  });

  await save(pages, "jk-spread", async (ctx) => {
    head(ctx, "日本与韩国：两条小语种升学路径", "Language Pathways", "同样发挥奥斯翰外语特色，但考试体系、目标院校和学生画像各有侧重。", 110, 95, 1200);
    fill(ctx, "#EFE6D5", 120, 300, 800, 560);
    fill(ctx, "#E9F0EF", 1000, 300, 800, 560);
    text(ctx, "日本 JUPP", 180, 390, 680, 45, P.green, 1, 800, 1, "center");
    bullets(ctx, ["日语分层学习", "JLPT / EJU / 校内考", "合作高中与本科衔接", "文理与艺术均可规划"], 240, 500, 580, 25, P.green);
    text(ctx, "韩国 KUPP", 1060, 390, 680, 45, P.red, 1, 800, 1, "center");
    bullets(ctx, ["TOPIK三年递进", "韩国文化与历史", "韩国名校申请服务", "商科、传媒、理工、艺术方向突出"], 1120, 500, 580, 25, P.red);
  });

  await save(pages, "ig-chapter", async (ctx) => chapter(ctx, "06", "IGCSE / A-Level", "British Pathway", "从IGCSE基础到A-Level选科与申请，面向英国、香港、澳洲、加拿大及多国大学。", "class1", false));

  await save(pages, "ig-intro", async (ctx) => {
    head(ctx, "什么是 IGCSE / A-Level", "Program Overview", "IGCSE是A-Level前的学术准备阶段，帮助学生完成国际课程学习习惯、学术英语和学科基础建设。", 110, 95, 1300);
    card(ctx, 130, 330, 500, 260, "IGCSE阶段", "G9-G10完成英语、数学、科学、人文社科、艺术与PSHE等基础课程，为后续A-Level选科打底。", P.teal);
    card(ctx, 710, 330, 500, 260, "A-Level阶段", "G11-G12选择3-4门与未来专业相关的核心科目，形成面向大学申请的学术成绩。", P.gold);
    card(ctx, 1290, 330, 500, 260, "升学方向", "面向英国、香港、澳洲、加拿大等英联邦方向，也可作为美国等多国申请材料之一。", P.red);
    text(ctx, "适合学生：目标英港澳加等方向，希望通过优势科目组合突出学术竞争力，并逐步完成全英文学术表达过渡的学生。", 200, 770, 1440, 30, P.ink, 1.4, 700, 2, "center");
  });

  await save(pages, "alevel-advantages", async (ctx) => {
    head(ctx, "A-Level课程优势", "Program Highlights", "A-Level的核心价值在于选科灵活、全球认可、模块化考核和中国学生适配度高。", 110, 95, 1260);
    const items = [
      ["选课灵活", "学生可选择3-4门与未来专业相关的科目，集中发挥优势学科。"],
      ["全球认可", "英国、香港、澳洲、加拿大、新加坡等高校普遍认可A-Level成绩。"],
      ["模块化考核", "两年学习期间有阶段性考试机会，容错率相对更高。"],
      ["强适配中国学生", "数学、物理、化学、经济等科目更容易发挥国内基础教育优势。"],
    ];
    items.forEach((it, i) => card(ctx, 150 + (i % 2) * 820, 330 + Math.floor(i / 2) * 240, 720, 165, it[0], it[1], [P.gold, P.teal, P.red, P.blue][i]));
  });

  await save(pages, "alevel-subjects", async (ctx) => {
    head(ctx, "按专业方向组织选科", "Subject Pathways", "课程不是简单列科目，而是帮助学生围绕未来专业搭建学科组合。", 110, 95, 1180);
    table(ctx, 160, 320, [320, 520, 760], [62, 122, 122, 122], [
      ["方向", "科目组合示例", "升学目标"],
      ["STEM", "数学、进阶数学、物理、化学、计算机", "工程、人工智能、航空航天、数据科学、医学预备、金融"],
      ["商科与社科", "经济学、商科、心理学、历史、社会学", "PPE、法律、国际关系、管理、市场营销、传媒"],
      ["创意艺术", "艺术设计、英语文学与语言、音乐、美术", "建筑设计、时尚产业、视觉传达、电影传媒、作品集方向"],
    ]);
  });

  await save(pages, "alevel-language", async (ctx) => {
    head(ctx, "从双语起步到全英学术表达", "Language Support", "不盲目追求入学即全英文，而是根据学生基础逐步完成学术语言过渡。", 110, 95, 1260);
    const stages = [["双语基础", "20%-30%英文授课，核心概念中文托底，英文术语渗透"], ["双语过渡", "40%-60%英文授课，作业与小测逐步使用英文表达"], ["全英浸润", "70%-85%英文授课，课堂讨论、报告和测试使用英文"], ["全英冲刺", "90%-100%英文环境，衔接海外大学课堂与学术写作"]];
    stages.forEach((s, i) => {
      const x = 145 + i * 430;
      rr(ctx, x, 360, 340, 250, 8, P.white, [P.teal, P.gold, P.red, P.blue][i], 4);
      text(ctx, s[0], x + 40, 455, 260, 31, [P.teal, P.gold, P.red, P.blue][i], 1, 800, 1, "center");
      text(ctx, s[1], x + 35, 545, 270, 20, P.muted, 1.4, 400, 4, "center");
      if (i < 3) arrow(ctx, x + 345, 485, x + 420, 485, P.gold, 4);
    });
    fill(ctx, P.cream, 170, 760, 1580, 110);
    text(ctx, "语言支持与A-Level学科学习同步推进，让学生既能听懂课，也能完成大学申请需要的英文输出。", 250, 828, 1420, 30, P.ink, 1.3, 800, 2, "center");
  });

  await save(pages, "alevel-timeline", async (ctx) => {
    head(ctx, "G9-G12关键节点", "Academic Timeline", "从适应、巩固、梳理到冲刺，帮助学生按节奏完成考试与申请。", 110, 95, 1160);
    table(ctx, 150, 315, [230, 410, 500, 520], [62, 118, 118, 118, 118], [
      ["年级", "阶段任务", "关键考试/节点", "升学准备"],
      ["G9", "双语适应，建立学科基础与学术词汇", "可选IGCSE中文/数学等科目", "校内测评，评估G10准备度"],
      ["G10", "系统学习IGCSE，部分学生提前接触A-Level数学", "5-6月IGCSE全球统考", "6-7月确定A-Level选课"],
      ["G11", "进入AS阶段，英文比例提升至70%-85%", "5-6月AS考试", "准备个人陈述、推荐信、语言考试"],
      ["G12", "A2冲刺，完成最终大考与大学申请", "UCAS/港新加澳申请、面试、出分", "换取无条件录取，签证与行前准备"],
    ]);
  });

  await save(pages, "alevel-destination", async (ctx) => {
    head(ctx, "A-Level升学方向", "Academic Pathways", "A-Level成绩被全球众多大学认可，可根据学生成绩、语言能力和专业方向规划多国申请。", 110, 95, 1280);
    table(ctx, 160, 320, [300, 420, 430, 520], [62, 96, 96, 96, 96, 96], [
      ["国家/地区", "代表院校", "成绩参考", "申请特点"],
      ["英国", "牛津、剑桥、G5、罗素集团", "AAA-A*AA等", "通过UCAS系统，部分专业需笔试与面试"],
      ["香港", "港大、港中文、港科大、城大、理工", "AAB-AAA及以上", "热门专业竞争高，部分专业要求面试"],
      ["澳洲", "墨尔本、悉尼、ANU、UNSW等", "分数换算制", "申请周期灵活，部分可先获有条件录取"],
      ["加拿大", "多伦多、麦吉尔、UBC等", "至少3门A-Level", "可直接申请本科，部分高分可换学分"],
      ["美国/其他", "综合大学及多国项目", "结合SAT/ACT/语言成绩", "适合综合能力强、活动背景丰富的学生"],
    ]);
  });

  await save(pages, "singapore-chapter", async (ctx) => chapter(ctx, "07", "新加坡 IFD 方向", "Singapore Pathway", "国内两年完成语言、学科和预科能力建设，再衔接新加坡本科路径。", "campus1"));

  await save(pages, "singapore-intro", async (ctx) => {
    head(ctx, "新加坡方向课程介绍", "Program Overview", "国内完成语言与大学预科能力建设，再衔接新加坡本科路径，同时保留后期升级转轨空间。", 110, 95, 1260);
    card(ctx, 140, 330, 500, 260, "2+2高效路径", "前两年在国内完成语言、基础学科和大学预科内容，再衔接新加坡本科，缩短适应周期。", P.gold);
    card(ctx, 710, 330, 500, 260, "语言先行", "第一年重点提升英语与基础学科能力，为后续IFD课程和海外学习打底。", P.teal);
    card(ctx, 1280, 330, 500, 260, "后期转轨空间", "若学生语言与学术能力提升明显，可根据目标调整到AP、A-Level等更高挑战路径。", P.red);
    text(ctx, "适合学生：希望先在国内完成语言与预科能力建设，以更稳妥、更具性价比的方式衔接新加坡本科的学生", 230, 770, 1400, 30, P.ink, 1.35, 800, 2, "center");
  });

  await save(pages, "singapore-curriculum", async (ctx) => {
    head(ctx, "IFD课程设置", "Curriculum Structure", "第一年夯实基础，第二年进入大学预科能力与专业方向选修。", 110, 95, 1160);
    table(ctx, 140, 320, [260, 620, 740], [62, 145, 145, 145], [
      ["阶段", "课程内容", "培养目标"],
      ["第一年", "综合英语、英美文学、基础科学、世界历史、全球视野、数学、中文", "建立语言、学科与国际课程学习基础"],
      ["第二年必修", "学术用途英语、大学研究与学习技巧、英语语言技巧培养、大学数学", "完成大学预科核心能力建设"],
      ["第二年选修", "经济学、会计、国际商务、进阶数学、Python、法律、物理、生物、化学、数字艺术、艺术与设计等", "按专业兴趣与未来本科方向选择课程"],
    ]);
  });

  await save(pages, "singapore-advantages", async (ctx) => {
    head(ctx, "新加坡方向的选择价值", "Program Advantages", "新加坡方向适合希望在亚洲范围内寻找国际化本科路径、兼顾成本和就业环境的家庭。", 110, 95, 1260);
    const items = [
      ["中西结合", "在国内完成语言与预科能力建设，降低海外适应成本。"],
      ["升学选择灵活", "商科、数学、计算机、艺术、科学等方向均可通过选修建立基础。"],
      ["全方位支持", "语言、面试、文书、行前与海外学习生活支持同步推进。"],
      ["转轨空间", "前期能力建设可与IG/AP等基础能力衔接，为后期定位保留弹性。"],
    ];
    items.forEach((it, i) => card(ctx, 150 + (i % 2) * 820, 330 + Math.floor(i / 2) * 245, 720, 170, it[0], it[1], [P.gold, P.teal, P.red, P.blue][i]));
  });

  await save(pages, "faculty-chapter", async (ctx) => chapter(ctx, "08", "师资与升学服务", "Faculty & Guidance", "优秀课程最终要落到教师、管理和升学服务上。", "group", false));

  await save(pages, "faculty-1", async (ctx) => {
    head(ctx, "国际部核心负责人", "Leadership", "总册前段展示核心管理者，建立家长对课程统筹、教学管理和升学服务的信任。", 110, 95, 1240);
    rr(ctx, 150, 310, 520, 540, 8, "#EFE6D5", P.line);
    text(ctx, "国际部总负责人", 770, 410, 620, 44, P.ink, 1, 800, 1);
    text(ctx, "负责国际课程整体规划、教学管理、升学资源协调与学生发展支持，统筹奥斯翰国际部多课程路径。", 770, 510, 840, 29, P.muted, 1.55, 400, 5);
    bullets(ctx, ["国际课程统筹", "升学路径规划", "教学与学生发展管理", "家校沟通与资源协调"], 780, 720, 720, 25, P.gold);
  });

  await save(pages, "faculty-2", async (ctx) => {
    head(ctx, "项目负责人", "Program Directors", "OSSD、AP、日韩、IG/A-Level、新加坡等课程由项目负责人协同推进。", 110, 95, 1240);
    for (let i = 0; i < 2; i++) {
      const x = 180 + i * 820;
      rr(ctx, x, 310, 700, 470, 8, P.white, P.line);
      rr(ctx, x + 40, 360, 190, 240, 8, "#EFE6D5", P.line);
      text(ctx, i === 0 ? "金校 / 项目负责人" : "Aleezer / 项目负责人", x + 275, 420, 360, 32, P.ink, 1, 800, 1);
      text(ctx, i === 0 ? "负责OSSD、AP、韩国、日本、新加坡等方向课程资源与课程内容协调。" : "负责IGCSE/A-Level方向课程结构、学术路径与升学内容协调。", x + 275, 505, 360, 24, P.muted, 1.45, 400, 4);
    }
  });

  await save(pages, "faculty-3", async (ctx) => {
    head(ctx, "课程与升学支持团队", "Academic & Guidance Team", "语言教师、学科教师、小语种教师、班主任/导师、升学指导共同构成学生支持网络。", 110, 95, 1240);
    const roles = [["语言教师", "英语/韩语/日语等语言能力建设"], ["学科教师", "数学、科学、经济、人文与艺术课程"], ["升学指导", "选校、文书、面试、签证与行前"], ["班主任/导师", "学习跟踪、生活管理、家校沟通"]];
    roles.forEach((r, i) => card(ctx, 150 + (i % 2) * 820, 335 + Math.floor(i / 2) * 240, 720, 160, r[0], r[1], [P.gold, P.teal, P.red, P.blue][i]));
  });

  await save(pages, "faculty-grid", async (ctx) => {
    head(ctx, "国际课程师资团队", "Faculty Matrix", "多学科教师与升学顾问协同，覆盖语言、学科、申请与学生成长支持。", 110, 95, 1200);
    for (let i = 0; i < 15; i++) {
      const x = 130 + (i % 5) * 350, y = 285 + Math.floor(i / 5) * 205;
      rr(ctx, x, y, 300, 165, 8, P.white, P.line);
      ctx.beginPath();
      ctx.arc(x + 70, y + 72, 46, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? "#E9F0EF" : "#EFE6D5";
      ctx.fill();
      text(ctx, "核心教师", x + 135, y + 58, 130, 22, P.ink, 1, 800, 1);
      text(ctx, "课程方向 / 学科 / 升学支持", x + 135, y + 98, 130, 15, P.muted, 1.25, 400, 2);
    }
  });

  await save(pages, "services", async (ctx) => {
    head(ctx, "学生成长与升学服务体系", "Student Support", "课程之外，学校提供学习管理、活动拓展、升学规划和生活支持。", 110, 95, 1240);
    const items = [["学生导师课", "通过学生导师帮助同伴适应学习和生活"], ["模拟联合国", "培养辩论、沟通、领导力与全球视野"], ["个性化辅导", "第7节后自选辅导、小组课堂、按需走班，补强真实所需能力"], ["住宿管理", "晚自习、手机管理、宿舍巡访与家校反馈"]];
    items.forEach((it, i) => card(ctx, 150 + (i % 2) * 820, 335 + Math.floor(i / 2) * 240, 720, 160, it[0], it[1], [P.gold, P.teal, P.red, P.blue][i]));
  });

  await save(pages, "guidance", async (ctx) => {
    head(ctx, "升学指导中心", "University Guidance Center", "从选课程到拿录取，帮助学生把目标国家、专业方向、申请材料和时间节点统一管理。", 110, 95, 1280);
    const steps = [["01", "入学评估"], ["02", "课程匹配"], ["03", "目标院校"], ["04", "语言考试"], ["05", "材料文书"], ["06", "面试签证"]];
    steps.forEach((s, i) => {
      const x = 130 + i * 285;
      rr(ctx, x, 390, 220, 220, 8, P.white, P.line);
      text(ctx, s[0], x + 50, 475, 120, 44, [P.gold, P.teal, P.red, P.blue, P.green, P.gold][i], 1, 800, 1, "center");
      text(ctx, s[1], x + 35, 555, 150, 24, P.ink, 1, 800, 1, "center");
      if (i < 5) arrow(ctx, x + 225, 500, x + 275, 500, P.gold, 4);
    });
  });

  await save(pages, "campus-life", async (ctx) => {
    head(ctx, "校园生活", "Campus Life", "真实的课堂、活动和校园生活，让学生在学术之外拥有完整的高中成长体验。", 110, 95, 1260);
    await img(ctx, "sports", 130, 310, 500, 300, .9);
    await img(ctx, "culture", 710, 310, 500, 300, .9);
    await img(ctx, "graduation", 1290, 310, 500, 300, .9);
    card(ctx, 130, 680, 500, 150, "活动与社团", "运动会、社团、国际文化交流与兴趣发展。", P.gold);
    card(ctx, 710, 680, 500, 150, "文化与表达", "多语种、非遗、跨文化体验共同支撑综合素养。", P.teal);
    card(ctx, 1290, 680, 500, 150, "成长与毕业", "用真实场景呈现学生在校成长与阶段成果。", P.red);
  });

  await save(pages, "admission-assessment", async (ctx) => {
    head(ctx, "入学评估与路径建议", "Admission Assessment", "入学不是简单报名，而是先判断孩子适合哪一条课程路线。", 110, 95, 1280);
    card(ctx, 160, 330, 480, 260, "1对1学业评估", "了解学生英语/小语种基础、数学与学科能力、学习习惯和目标国家。", P.gold);
    card(ctx, 720, 330, 480, 260, "课程路径建议", "根据评估结果匹配OSSD、AP、日韩、IGCSE/A-Level或新加坡方向。", P.teal);
    card(ctx, 1280, 330, 480, 260, "阶段成长规划", "为学生制定入学后语言、学科、考试和升学节点安排。", P.red);
  });

  await save(pages, "tracking", async (ctx) => {
    head(ctx, "入学后的持续跟踪指导", "Ongoing Support", "从入学到申请，每个阶段都需要持续反馈和动态调整。", 110, 95, 1260);
    const items = [["学习进度跟踪", "阶段测试、课堂表现、作业反馈"], ["语言能力跟踪", "托福/雅思/TOPIK/JLPT等考试规划"], ["家校沟通", "班主任、导师、升学老师多方同步"], ["方向动态调整", "根据成绩、兴趣和目标院校变化调整路径"]];
    items.forEach((it, i) => card(ctx, 150 + (i % 2) * 820, 335 + Math.floor(i / 2) * 240, 720, 160, it[0], it[1], [P.gold, P.teal, P.red, P.blue][i]));
  });

  await save(pages, "admission-requirements", async (ctx) => {
    head(ctx, "招生对象与报名流程", "Admission Requirements", "适合有国际课程升学需求，希望在高中阶段完成多路径规划的学生。", 110, 95, 1260);
    table(ctx, 170, 330, [360, 520, 720], [64, 110, 110, 110], [
      ["项目", "内容", "说明"],
      ["招生对象", "初三在读、初中毕业、高中在读学生", "不同课程按目标国家、语言基础和学科能力匹配"],
      ["入学评估", "学业测试 + 面试 + 课程咨询", "评估英语/小语种、数学、综合学习能力与目标方向"],
      ["报名流程", "预约咨询 → 入学评估 → 路径建议 → 确认课程 → 办理入读", "由招生与课程团队共同完成"],
    ]);
  });

  await save(pages, "fees", async (ctx) => {
    head(ctx, "费用信息", "Fee Policy", "学费、住宿、餐食及其他费用以学校最终公示和招生办确认为准。", 110, 95, 1260);
    table(ctx, 230, 330, [420, 420, 420, 420], [70, 110, 110, 110, 110], [
      ["课程方向", "学费", "住宿/餐食", "备注"],
      ["OSSD中加课程", "咨询招生办公室", "按学校公示执行", "以当年招生政策为准"],
      ["AP国际课程", "咨询招生办公室", "按学校公示执行", "以当年招生政策为准"],
      ["日韩/新加坡方向", "咨询招生办公室", "按学校公示执行", "以当年招生政策为准"],
      ["IGCSE/A-Level", "咨询招生办公室", "按学校公示执行", "以当年招生政策为准"],
    ], { align: "center" });
  });

  await save(pages, "contact", async (ctx) => {
    await img(ctx, "cover", 0, 0, W, H, 1);
    fill(ctx, "rgba(21,35,55,.75)", 0, 0, W, H);
    text(ctx, "Schedule Your Campus Tour", 120, 245, 850, 30, "#EAD7A7", 1, 800, 1);
    text(ctx, "预约访校", 120, 365, 700, 72, P.white, 1, 800, 1);
    text(ctx, "深圳市罗湖区布心路2040号", 125, 545, 820, 32, "#F3E8CA", 1.4, 400, 2);
    text(ctx, "招生办公室：0755-25805707 / 0755-25813956\n欢迎预约访校，获取个性化课程规划建议", 125, 700, 900, 31, "#F3E8CA", 1.55, 400, 3);
  });

  return pages;
}

function escXml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function slideXml(idx) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr><p:pic><p:nvPicPr><p:cNvPr id="2" name="slide-${idx}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="6858000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr></p:pic></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}
async function makePptx(files) {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${files.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst><p:sldIdLst>${files.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${files.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("")}<Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Oxstand"><a:themeElements><a:clrScheme name="Oxstand"><a:dk1><a:srgbClr val="152337"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="183D5A"/></a:dk2><a:lt2><a:srgbClr val="F8F4EC"/></a:lt2><a:accent1><a:srgbClr val="B89335"/></a:accent1><a:accent2><a:srgbClr val="B74A3D"/></a:accent2><a:accent3><a:srgbClr val="126E78"/></a:accent3><a:accent4><a:srgbClr val="5F7F69"/></a:accent4><a:accent5><a:srgbClr val="183D5A"/></a:accent5><a:accent6><a:srgbClr val="EFE7D7"/></a:accent6><a:hlink><a:srgbClr val="126E78"/></a:hlink><a:folHlink><a:srgbClr val="B74A3D"/></a:folHlink></a:clrScheme><a:fontScheme name="Oxstand"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:minorFont></a:fontScheme><a:fmtScheme name="Oxstand"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`);
  files.forEach((file, i) => {
    zip.file(`ppt/media/image${i + 1}.jpg`, fs.readFileSync(file));
    zip.file(`ppt/slides/slide${i + 1}.xml`, slideXml(i + 1));
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i + 1}.jpg"/></Relationships>`);
  });
  fs.writeFileSync(outPptx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

const pages = await buildPages();
await makePptx(pages);
fs.writeFileSync(outMd, `# 奥斯翰国际部招生宣传册横版PPT SAIS风格V2

- 输出PPT：${outPptx}
- 页面预览：${pageDir}
- 页数：${pages.length}

本版按用户反馈重构：课程顺序为 OSSD、AP、日韩、IGCSE/A-Level、新加坡；目录和配色参考SAIS白底金色总册风格；课程板块补充课程介绍、课程优势、课程设置、升学方向与奥斯翰服务；入学咨询拆为评估、跟踪、招生要求、费用、联系方式。
`, "utf8");
console.log(`Generated ${outPptx}`);
console.log(`Slides: ${pages.length}`);
