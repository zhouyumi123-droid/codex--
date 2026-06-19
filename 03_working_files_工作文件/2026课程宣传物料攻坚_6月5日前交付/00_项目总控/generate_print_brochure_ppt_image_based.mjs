import fs from "fs";
import path from "path";
import JSZip from "jszip";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const baseDir = path.join(root, "05_总招生手册_初稿图文版");
const outDir = path.join(baseDir, "PPT_横版招生手册重构版");
const pageDir = path.join(outDir, "pages");
const assetManifest = JSON.parse(fs.readFileSync(path.join(baseDir, "asset_manifest.json"), "utf8"));
const outPptx = path.join(outDir, "奥斯翰国际部招生宣传册_横版PPT重构初稿.pptx");
const outMd = path.join(outDir, "奥斯翰国际部招生宣传册_横版PPT重构初稿_说明.md");

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(pageDir, { recursive: true });

try {
  GlobalFonts.registerFromPath("C:/Windows/Fonts/msyh.ttc", "Microsoft YaHei");
  GlobalFonts.registerFromPath("C:/Windows/Fonts/msyhbd.ttc", "Microsoft YaHei");
  GlobalFonts.registerFromPath("C:/Windows/Fonts/simhei.ttf", "SimHei");
} catch {}

const W = 1920;
const H = 1080;
const P = {
  ink: "#102033",
  navy: "#122B45",
  blue: "#0D5B78",
  teal: "#3C8D8F",
  gold: "#C89B3C",
  coral: "#D86747",
  sage: "#6C8B78",
  cream: "#F6F1E7",
  paper: "#FBF8F1",
  white: "#FFFFFF",
  muted: "#5C6A78",
  light: "#E8EDF0",
  dark2: "#1D3854",
};
const asset = (k) => path.join(baseDir, assetManifest[k] || "");

function font(size, weight = 400) {
  return `${weight} ${size}px "Microsoft YaHei", "SimHei", Arial`;
}
function fill(ctx, c, x, y, w, h) {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
}
function roundRect(ctx, x, y, w, h, r = 18, fillColor = P.white, strokeColor = null, lw = 2) {
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
  if (fillColor) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if (strokeColor) {
    ctx.lineWidth = lw;
    ctx.strokeStyle = strokeColor;
    ctx.stroke();
  }
}
function wrap(ctx, text, maxWidth, spec) {
  ctx.font = spec;
  const lines = [];
  for (const para of String(text).split("\n")) {
    let line = "";
    for (const ch of [...para]) {
      const next = line + ch;
      if (ctx.measureText(next).width > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else line = next;
    }
    if (line) lines.push(line);
  }
  return lines;
}
function text(ctx, t, x, y, w, size = 28, color = P.ink, lh = 1.45, weight = 400, maxLines = 99, align = "left") {
  const spec = font(size, weight);
  ctx.font = spec;
  ctx.fillStyle = color;
  ctx.textBaseline = "alphabetic";
  const lines = wrap(ctx, t, w, spec).slice(0, maxLines);
  for (let i = 0; i < lines.length; i++) {
    let tx = x;
    if (align === "center") tx = x + (w - ctx.measureText(lines[i]).width) / 2;
    if (align === "right") tx = x + w - ctx.measureText(lines[i]).width;
    ctx.fillText(lines[i], tx, y + i * size * lh);
  }
  return y + lines.length * size * lh;
}
function label(ctx, t, x, y, color = P.gold) {
  text(ctx, t.toUpperCase(), x, y, 760, 20, color, 1, 800, 1);
}
function title(ctx, cn, en, x = 110, y = 140, w = 980, dark = false) {
  label(ctx, en, x, y, dark ? "#EBD39C" : P.gold);
  const yy = text(ctx, cn, x, y + 68, w, 54, dark ? P.white : P.ink, 1.18, 800, 2);
  return yy + 18;
}
async function coverImage(ctx, imgPath, x, y, w, h, alpha = 1) {
  const image = await loadImage(imgPath);
  const scale = Math.max(w / image.width, h / image.height);
  const sw = w / scale, sh = h / scale;
  const sx = (image.width - sw) / 2, sy = (image.height - sh) / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}
function arrow(ctx, x1, y1, x2, y2, color = P.gold, width = 6) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  const a = Math.atan2(y2 - y1, x2 - x1);
  const s = 18;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - s * Math.cos(a - Math.PI / 6), y2 - s * Math.sin(a - Math.PI / 6));
  ctx.lineTo(x2 - s * Math.cos(a + Math.PI / 6), y2 - s * Math.sin(a + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function footer(ctx, n) {
  text(ctx, `OXSTAND INTERNATIONAL SCHOOL  |  ${String(n).padStart(2, "0")}`, 110, 1030, 600, 16, "#8A96A3", 1, 700, 1);
}
function init() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");
  fill(ctx, P.paper, 0, 0, W, H);
  return { canvas, ctx };
}
function chip(ctx, t, x, y, c = P.blue, w = null) {
  const tw = w || Math.max(150, t.length * 26 + 42);
  roundRect(ctx, x, y, tw, 48, 24, c);
  text(ctx, t, x + 20, y + 32, tw - 40, 21, P.white, 1, 700, 1, "center");
}
function card(ctx, x, y, w, h, head, body, accent = P.gold, opts = {}) {
  roundRect(ctx, x, y, w, h, opts.r ?? 18, opts.fill ?? P.white, opts.stroke ?? null, 2);
  fill(ctx, accent, x, y, opts.barW ?? 10, h);
  text(ctx, head, x + 32, y + 48, w - 64, opts.headSize ?? 28, opts.headColor ?? P.ink, 1.2, 800, 2);
  if (body) text(ctx, body, x + 32, y + (opts.bodyY ?? 105), w - 64, opts.bodySize ?? 21, opts.bodyColor ?? P.muted, 1.55, 400, opts.bodyLines ?? 5);
}
function bullet(ctx, items, x, y, w, color = P.gold, size = 24) {
  let cy = y;
  for (const item of items) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x + 8, cy - 8, 6, 0, Math.PI * 2);
    ctx.fill();
    cy = text(ctx, item, x + 28, cy, w - 28, size, P.ink, 1.45, 400, 3) + 14;
  }
}
function processNode(ctx, num, head, body, x, y, w, c) {
  roundRect(ctx, x, y, w, 168, 20, P.white);
  ctx.beginPath();
  ctx.arc(x + 62, y + 62, 38, 0, Math.PI * 2);
  ctx.fillStyle = c;
  ctx.fill();
  text(ctx, num, x + 39, y + 73, 48, 26, P.white, 1, 800, 1, "center");
  text(ctx, head, x + 118, y + 55, w - 150, 26, P.ink, 1.2, 800, 1);
  text(ctx, body, x + 118, y + 98, w - 150, 19, P.muted, 1.4, 400, 3);
}

async function saveSlide(pages, name, painter) {
  const { canvas, ctx } = init();
  await painter(ctx);
  footer(ctx, pages.length + 1);
  const file = path.join(pageDir, `${String(pages.length + 1).padStart(2, "0")}_${name}.jpg`);
  fs.writeFileSync(file, await canvas.encode("jpeg", 88));
  pages.push(file);
}

async function buildPages() {
  const pages = [];
  await saveSlide(pages, "cover", async (ctx) => {
    await coverImage(ctx, asset("cover"), 0, 0, W, H);
    const g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, "rgba(10,28,48,.95)");
    g.addColorStop(.56, "rgba(10,28,48,.72)");
    g.addColorStop(1, "rgba(10,28,48,.12)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    text(ctx, "OXSTAND INTERNATIONAL SCHOOL", 118, 190, 780, 24, "#EAD7A7", 1, 800, 1);
    text(ctx, "深圳奥斯翰外语学校\n国际部招生手册", 118, 330, 900, 78, P.white, 1.18, 800, 3);
    text(ctx, "以多路径国际课程，帮助学生找到更适合自己的升学方向", 122, 612, 820, 32, "#F4EAD3", 1.4, 400, 2);
    chip(ctx, "2026 招生季初稿", 122, 750, P.gold, 250);
  });

  await saveSlide(pages, "contents", async (ctx) => {
    title(ctx, "目录", "Contents", 110, 105, 700);
    const items = [
      ["01", "关于奥斯翰", "学校概况 / 办学积累 / 外语特色"],
      ["02", "课程总览", "目标地区 / 年级衔接 / 课程选择"],
      ["03", "IGCSE / A-Level", "英联邦与香港方向的学术路径"],
      ["04", "AP 国际课程", "美本、香港及多国申请路径"],
      ["05", "OSSD 中加课程", "加拿大安省课程与多国申请"],
      ["06", "日韩小语种方向", "韩国KUPP / 日本JUPP"],
      ["07", "新加坡方向", "IFD预科衔接与本科规划"],
      ["08", "师资与升学支持", "团队版位 / 服务体系 / 校园生活"],
      ["09", "入学咨询", "招生对象 / 流程 / 联系方式"],
    ];
    items.forEach((it, i) => {
      const x = 118 + (i % 3) * 575, y = 270 + Math.floor(i / 3) * 225;
      roundRect(ctx, x, y, 505, 155, 22, i % 2 ? "#FFFFFF" : "#F0E7D4", "#E6D5AD");
      text(ctx, it[0], x + 32, y + 58, 86, 42, i % 2 ? P.gold : P.blue, 1, 800, 1);
      text(ctx, it[1], x + 118, y + 56, 330, 28, P.ink, 1.1, 800, 1);
      text(ctx, it[2], x + 118, y + 100, 330, 19, P.muted, 1.3, 400, 2);
    });
  });

  await saveSlide(pages, "chapter01", async (ctx) => {
    fill(ctx, P.navy, 0, 0, W, H);
    await coverImage(ctx, asset("campus1"), 960, 0, 960, H, .72);
    fill(ctx, "rgba(18,43,69,.34)", 960, 0, 960, H);
    text(ctx, "01", 120, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "关于奥斯翰", 120, 360, 780, 72, P.white, 1.18, 800, 2);
    text(ctx, "先让家长相信学校，再让家长理解课程选择。", 124, 540, 720, 32, "#EAD7A7", 1.5, 400, 2);
  });

  await saveSlide(pages, "school-profile", async (ctx) => {
    await coverImage(ctx, asset("cover"), 1100, 0, 820, H, .95);
    fill(ctx, "rgba(246,241,231,.88)", 0, 0, 1220, H);
    title(ctx, "深圳老牌民办国际化高中", "School Profile", 110, 108, 900);
    text(ctx, "深圳奥斯翰外语学校位于深圳市罗湖区布心路2040号，2004年经深圳市教育局批准创办。学校以“与世界同步，培育跨时代精英人才”为育人目标，植根中华传统文化，融贯东西方教育思想，依托外语特色与多元课程，为学生提供面向不同国家和地区的升学路径。", 112, 330, 880, 28, P.ink, 1.75, 400, 9);
    const stats = [["2004", "创办时间"], ["20+", "办学积累"], ["多语种", "外语特色"], ["多路径", "升学出口"]];
    stats.forEach((s, i) => {
      const x = 115 + i * 245;
      roundRect(ctx, x, 760, 205, 145, 18, P.white);
      text(ctx, s[0], x + 18, 820, 170, 38, i === 2 ? P.blue : P.gold, 1, 800, 1, "center");
      text(ctx, s[1], x + 18, 870, 170, 21, P.muted, 1, 700, 1, "center");
    });
  });

  await saveSlide(pages, "positioning", async (ctx) => {
    title(ctx, "把奥斯翰的长板讲成家长的选择理由", "Why Oxstand", 110, 105, 980);
    const items = [
      ["老牌办学", "二十余年本土办学积累，让家长先看到稳定与经验。", P.gold],
      ["外语底色", "英语、日语、韩语等语言资源，支撑多国家升学路径。", P.teal],
      ["小规模陪伴", "师生关系近、反馈链条短，更适合需要被持续托举的学生。", P.coral],
      ["多路径规划", "AP、OSSD、日韩、新加坡、IG/A-Level按目标地区组合。", P.blue],
    ];
    items.forEach((it, i) => {
      const x = 115 + i * 440;
      roundRect(ctx, x, 292, 360, 460, 24, P.white);
      ctx.beginPath();
      ctx.arc(x + 180, 405, 74, 0, Math.PI * 2);
      ctx.fillStyle = it[2];
      ctx.fill();
      text(ctx, String(i + 1).padStart(2, "0"), x + 126, 425, 110, 42, P.white, 1, 800, 1, "center");
      text(ctx, it[0], x + 40, 565, 280, 32, P.ink, 1.1, 800, 1, "center");
      text(ctx, it[1], x + 46, 640, 268, 22, P.muted, 1.55, 400, 4, "center");
    });
    arrow(ctx, 480, 522, 555, 522, P.gold);
    arrow(ctx, 920, 522, 995, 522, P.gold);
    arrow(ctx, 1360, 522, 1435, 522, P.gold);
    text(ctx, "在奥斯翰，课程不是孤立选择，而是与学生目标、学习基础、语言能力和升学规划共同组成一条清晰路线。", 230, 850, 1450, 30, P.ink, 1.45, 700, 3, "center");
  });

  await saveSlide(pages, "history", async (ctx) => {
    title(ctx, "办学历程与可信背书", "School Development", 110, 105, 900);
    const years = [["2004", "学校创办"], ["2006", "深圳市一级学校"], ["2008", "ISO9001管理认证"], ["2009", "韩国课程引进"], ["2012", "日本课程引进"], ["2016", "AP授权学校"], ["2024", "AP code: 579073"]];
    const baseY = 560;
    ctx.strokeStyle = P.gold;
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(170, baseY);
    ctx.lineTo(1750, baseY);
    ctx.stroke();
    years.forEach((it, i) => {
      const x = 170 + i * 263;
      ctx.beginPath();
      ctx.arc(x, baseY, 24, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? P.blue : P.gold;
      ctx.fill();
      const y = i % 2 ? baseY + 70 : baseY - 170;
      roundRect(ctx, x - 100, y, 200, 100, 16, P.white);
      text(ctx, it[0], x - 78, y + 42, 156, 28, P.ink, 1, 800, 1, "center");
      text(ctx, it[1], x - 80, y + 78, 160, 17, P.muted, 1, 600, 1, "center");
    });
    text(ctx, "持续积累的办学经验，让学校能够为不同升学方向的学生提供更稳定的课程与管理支持。", 112, 925, 1180, 24, "#5C6A78", 1.3, 700, 1);
  });

  await saveSlide(pages, "chapter02", async (ctx) => {
    fill(ctx, P.cream, 0, 0, W, H);
    await coverImage(ctx, asset("activity1"), 0, 0, 760, H, .9);
    fill(ctx, "rgba(18,43,69,.72)", 0, 0, 760, H);
    text(ctx, "02", 845, 220, 200, 86, P.gold, 1, 800, 1);
    text(ctx, "国际课程地图", 845, 360, 780, 72, P.ink, 1.18, 800, 2);
    text(ctx, "先看目标方向，再匹配课程路径。", 850, 540, 720, 34, P.muted, 1.4, 400, 2);
  });

  await saveSlide(pages, "course-map", async (ctx) => {
    title(ctx, "按目标地区选择课程路径", "Course Map", 110, 105, 900);
    const nodes = [
      ["英联邦 / 香港", "IGCSE / A-Level", 370, 290, P.blue],
      ["美国 / 香港 / 多国", "AP", 930, 255, P.gold],
      ["加拿大 / 多国", "OSSD", 1455, 290, P.teal],
      ["韩国本科", "KUPP", 610, 710, P.coral],
      ["日本本科", "JUPP", 1120, 710, P.sage],
      ["新加坡本科", "IFD", 1560, 710, P.dark2],
    ];
    ctx.beginPath();
    ctx.arc(960, 535, 130, 0, Math.PI * 2);
    ctx.fillStyle = P.navy;
    ctx.fill();
    text(ctx, "奥斯翰\n国际部", 870, 512, 180, 34, P.white, 1.25, 800, 2, "center");
    nodes.forEach((n) => {
      arrow(ctx, 960, 535, n[2], n[3], n[4], 5);
      roundRect(ctx, n[2] - 160, n[3] - 78, 320, 156, 26, P.white, n[4], 3);
      text(ctx, n[0], n[2] - 130, n[3] - 18, 260, 25, P.ink, 1, 800, 1, "center");
      text(ctx, n[1], n[2] - 130, n[3] + 34, 260, 27, n[4], 1, 800, 1, "center");
    });
    text(ctx, "低年级或方向未定的学生，可先通过IG/Pre-Program完成语言、数学、科学与学术习惯的过渡，再选择后续出口。", 245, 930, 1430, 29, P.ink, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "path-selection", async (ctx) => {
    title(ctx, "家长真正关心的是：我的孩子该走哪条路", "Pathway Selection", 110, 105, 1050);
    const rows = [
      ["目标英港澳加", "IGCSE/A-Level", "适合按专业方向选择3-4门核心科目，突出优势学科。"],
      ["目标美本/香港", "AP", "适合学科能力强、希望用AP科目与标化组合提升竞争力。"],
      ["目标加拿大/多国", "OSSD", "适合重视过程性评价、希望走安省课程体系的学生。"],
      ["目标韩国", "KUPP", "适合愿意系统学习韩语，通过TOPIK和文化课程申请韩国高校。"],
      ["目标日本", "JUPP", "适合愿意长期学习日语，并准备EJU/JLPT/校内考面试。"],
      ["目标新加坡", "IFD", "适合先在国内完成预科能力建设，再衔接新加坡本科。"],
    ];
    rows.forEach((r, i) => {
      const y = 300 + i * 105;
      fill(ctx, i % 2 ? "#FFFFFF" : "#F1E9D9", 160, y, 1600, 78);
      text(ctx, r[0], 205, y + 50, 310, 25, P.ink, 1, 800, 1);
      chip(ctx, r[1], 555, y + 15, [P.blue, P.gold, P.teal, P.coral, P.sage, P.dark2][i], 270);
      text(ctx, r[2], 890, y + 49, 780, 23, P.muted, 1, 400, 1);
    });
  });

  await saveSlide(pages, "chapter-ig", async (ctx) => {
    fill(ctx, P.navy, 0, 0, W, H);
    await coverImage(ctx, asset("class1"), 900, 0, 1020, H, .82);
    fill(ctx, "rgba(18,43,69,.28)", 900, 0, 1020, H);
    text(ctx, "03", 115, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "IGCSE / A-Level\n英联邦升学路径", 115, 360, 820, 68, P.white, 1.18, 800, 3);
    text(ctx, "IG不是孤立课程，而是A-Level前的学术准备阶段。", 120, 615, 760, 31, "#EAD7A7", 1.45, 400, 2);
  });

  await saveSlide(pages, "ig-alevel-overview", async (ctx) => {
    title(ctx, "IGCSE 与 A-Level 是一套连续路径", "IGCSE / A-Level Pathway", 110, 100, 1050);
    const x0 = 180, y = 430;
    const stages = [
      ["G9-G10", "IGCSE准备", "学术英语、数学、科学、人文社科、艺术与PSHE，建立国际课程学习习惯。", P.blue],
      ["G11", "AS阶段", "确定3-4门A-Level科目组合，围绕目标专业推进学科深度学习。", P.gold],
      ["G12", "A2与申请", "完成最终考试、大学申请、文书面试与语言成绩补强。", P.coral],
    ];
    stages.forEach((s, i) => {
      const x = x0 + i * 560;
      roundRect(ctx, x, y, 430, 300, 28, P.white, s[3], 3);
      text(ctx, s[0], x + 38, y + 75, 160, 34, s[3], 1, 800, 1);
      text(ctx, s[1], x + 38, y + 135, 340, 33, P.ink, 1, 800, 1);
      text(ctx, s[2], x + 38, y + 205, 350, 22, P.muted, 1.45, 400, 4);
      if (i < 2) arrow(ctx, x + 440, y + 150, x + 540, y + 150, s[3], 7);
    });
    text(ctx, "从IGCSE到A-Level，学生逐步完成语言、学科、选科和申请能力建设，形成通往英联邦及香港方向的连续升学方案。", 260, 850, 1380, 30, P.ink, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "alevel-subjects", async (ctx) => {
    title(ctx, "按专业方向组织选科，而不是只列科目", "Subject Pathways", 110, 105, 900);
    const blocks = [
      ["STEM", "数学 / 进阶数学 / 物理 / 化学 / 计算机", "工程、人工智能、数据科学、金融、医学预备", P.blue],
      ["商科与社科", "经济 / 商科 / 历史 / 心理 / 社会学", "商科、PPE、法律、国际关系、传媒", P.gold],
      ["创意艺术", "艺术设计 / 英语文学 / 音乐 / 作品集", "建筑、时尚、视觉传达、传媒与电影", P.coral],
    ];
    blocks.forEach((b, i) => {
      const x = 130 + i * 585;
      roundRect(ctx, x, 300, 500, 540, 26, P.white);
      fill(ctx, b[3], x, 300, 500, 18);
      text(ctx, b[0], x + 45, 405, 400, 42, b[3], 1, 800, 1, "center");
      text(ctx, b[1], x + 50, 535, 400, 28, P.ink, 1.45, 700, 3, "center");
      fill(ctx, "#F3EFE6", x + 45, 690, 410, 90);
      text(ctx, b[2], x + 70, 745, 360, 22, P.muted, 1.35, 400, 2, "center");
    });
  });

  await saveSlide(pages, "alevel-language", async (ctx) => {
    title(ctx, "从双语过渡到全英学术表达", "Language Support", 110, 100, 960);
    const stages = [
      ["双语基础", "核心概念用中文托底，英文术语逐步渗透。"],
      ["双语融合", "作业、小测、课堂讨论逐步提高英文占比。"],
      ["全英浸润", "以英文授课、展示、论文和研讨会为训练场。"],
      ["申请输出", "语言成绩、学术写作、面试表达同步服务申请。"],
    ];
    stages.forEach((s, i) => {
      const x = 140 + i * 430;
      processNode(ctx, `0${i + 1}`, s[0], s[1], x, 360, 365, [P.blue, P.teal, P.gold, P.coral][i]);
      if (i < 3) arrow(ctx, x + 365, 445, x + 420, 445, P.gold, 6);
    });
    await coverImage(ctx, asset("class1"), 140, 665, 1640, 270, .88);
    fill(ctx, "rgba(18,43,69,.55)", 140, 665, 1640, 270);
    text(ctx, "奥斯翰的语言支持，不是把学生直接推入全英文环境，而是根据基础逐步提升学术表达能力。", 230, 825, 1460, 32, P.white, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "chapter-ap", async (ctx) => {
    fill(ctx, P.cream, 0, 0, W, H);
    text(ctx, "04", 120, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "AP 国际课程\n美本与多国申请路径", 120, 360, 780, 68, P.ink, 1.18, 800, 3);
    await coverImage(ctx, asset("campus2"), 920, 90, 860, 860, .92);
    fill(ctx, "rgba(255,255,255,.16)", 920, 90, 860, 860);
    text(ctx, "College Board Authorized  |  School Code: 579073", 124, 650, 840, 30, P.blue, 1.2, 800, 2);
  });

  await saveSlide(pages, "ap-position", async (ctx) => {
    title(ctx, "AP：用学科挑战度增强大学申请画像", "Advanced Placement", 110, 105, 980);
    const circles = [
      ["官方授权", "College Board\nSchool Code 579073", P.blue],
      ["学科组合", "微积分 / 科学\n经济 / 历史 / 中文", P.gold],
      ["申请协同", "SAT / 托福雅思\n活动与文书", P.coral],
    ];
    circles.forEach((c, i) => {
      const x = 380 + i * 560, y = 500;
      ctx.beginPath();
      ctx.arc(x, y, 155, 0, Math.PI * 2);
      ctx.fillStyle = c[2];
      ctx.fill();
      text(ctx, c[0], x - 110, y - 30, 220, 34, P.white, 1, 800, 1, "center");
      text(ctx, c[1], x - 125, y + 48, 250, 24, "#F9F2DF", 1.35, 400, 2, "center");
      if (i < 2) arrow(ctx, x + 170, y, x + 380, y, P.gold, 7);
    });
    text(ctx, "适合目标美国、香港及多国综合申请的学生。AP不是单纯考试，而是与目标专业、语言成绩、标化和申请材料共同构成竞争力。", 245, 820, 1420, 30, P.ink, 1.45, 700, 3, "center");
  });

  await saveSlide(pages, "ap-pathway", async (ctx) => {
    title(ctx, "三阶段递进：准备、过渡、冲刺", "AP Learning Journey", 110, 105, 1000);
    const stages = [
      ["G7-G8", "准备阶段", "强化英语听说读写、代数几何、基础科学和全球视野。"],
      ["G9-G10", "过渡阶段", "提升学科英语能力，开始AP相关学科基础学习。"],
      ["G11-G12", "冲刺阶段", "进入AP科目、SAT和语言考试组合规划。"],
    ];
    stages.forEach((s, i) => {
      const x = 180 + i * 560;
      roundRect(ctx, x, 355, 420, 360, 34, i === 1 ? "#F3EFE6" : P.white, [P.blue, P.gold, P.coral][i], 4);
      text(ctx, s[0], x + 40, 445, 330, 40, [P.blue, P.gold, P.coral][i], 1, 800, 1, "center");
      text(ctx, s[1], x + 40, 525, 330, 34, P.ink, 1, 800, 1, "center");
      text(ctx, s[2], x + 50, 630, 320, 24, P.muted, 1.45, 400, 4, "center");
      if (i < 2) arrow(ctx, x + 430, 535, x + 540, 535, P.gold, 7);
    });
  });

  await saveSlide(pages, "ap-subjects", async (ctx) => {
    title(ctx, "AP科目不是越多越好，而是服务目标专业", "AP Subject Planning", 110, 105, 1100);
    const groups = [
      ["数学与理工", ["AP微积分AB/BC", "AP预科微积分", "AP物理/化学/生物"], P.blue],
      ["商科与社科", ["AP微观经济", "AP宏观经济", "AP世界历史"], P.gold],
      ["语言与文化", ["AP中文", "英语学术写作", "韩语/日语/西语选修"], P.coral],
    ];
    groups.forEach((g, i) => {
      const x = 150 + i * 565;
      card(ctx, x, 310, 480, 450, g[0], "", g[2], { bodyY: 120 });
      bullet(ctx, g[1], x + 60, 465, 360, g[2], 25);
    });
    text(ctx, "申请香港方向时，建议至少配置一门数学相关AP科目；申请美国方向则需结合专业、标化和活动背景综合规划。", 230, 850, 1460, 30, P.ink, 1.4, 700, 2, "center");
  });

  await saveSlide(pages, "chapter-ossd", async (ctx) => {
    fill(ctx, P.navy, 0, 0, W, H);
    await coverImage(ctx, asset("bond2"), 950, 0, 970, H, .78);
    fill(ctx, "rgba(18,43,69,.36)", 950, 0, 970, H);
    text(ctx, "05", 120, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "OSSD 中加课程\n加拿大安省课程路径", 120, 360, 820, 68, P.white, 1.18, 800, 3);
    text(ctx, "过程性评价、多国认可、以12年级核心课程成绩申请大学。", 125, 635, 780, 31, "#EAD7A7", 1.45, 400, 2);
  });

  await saveSlide(pages, "ossd-advantages", async (ctx) => {
    title(ctx, "OSSD的卖点，要讲清楚制度优势", "OSSD Advantages", 110, 105, 980);
    const items = [
      ["过程评价", "强调平时成绩、作业、项目与最终评价结合。"],
      ["多国申请", "可用于加拿大、英国、美国、澳洲、香港等方向。"],
      ["安省课程", "以6门12年级4U/4M课程成绩作为核心材料。"],
      ["中加衔接", "三年从中方基础逐步过渡到加方学术课程。"],
    ];
    items.forEach((it, i) => {
      const x = 155 + (i % 2) * 810, y = 300 + Math.floor(i / 2) * 270;
      processNode(ctx, `0${i + 1}`, it[0], it[1], x, y, 700, [P.blue, P.gold, P.teal, P.coral][i]);
    });
    text(ctx, "对外准确口径：项目学生高二注册安大略省高中学籍；合作、文凭样本、官网录取许可等证据需最终确认后放入正式版。", 220, 900, 1480, 28, P.ink, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "ossd-curriculum", async (ctx) => {
    title(ctx, "高一到高三：逐步从中方基础过渡到加方课程", "OSSD Curriculum Structure", 110, 105, 1080);
    const stages = [
      ["高一", "中方基础课程 + 2-3门加方语言和文科课程"],
      ["高二", "少量中方基础课 + 6门加方文理科学术课程"],
      ["高三", "6-7门加方学术课程，围绕大学申请完成成绩输出"],
    ];
    stages.forEach((s, i) => {
      const x = 170 + i * 560;
      roundRect(ctx, x, 360, 440, 280, 26, P.white, [P.blue, P.gold, P.coral][i], 4);
      text(ctx, s[0], x + 50, 450, 340, 48, [P.blue, P.gold, P.coral][i], 1, 800, 1, "center");
      text(ctx, s[1], x + 55, 545, 330, 26, P.ink, 1.5, 700, 3, "center");
      if (i < 2) arrow(ctx, x + 450, 500, x + 540, 500, P.gold, 7);
    });
    fill(ctx, "#F0E7D4", 190, 760, 1540, 110);
    text(ctx, "可呈现课程：ESL、ENG2D/3U/4U、MCR3U、MHF4U、MCV4U、SPU3U、SPH4U、SCH4U、CIE3M、BBB4M等。", 240, 826, 1440, 28, P.ink, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "chapter-kj", async (ctx) => {
    fill(ctx, P.cream, 0, 0, W, H);
    await coverImage(ctx, asset("japan1"), 0, 0, 960, H, .86);
    fill(ctx, "rgba(18,43,69,.52)", 0, 0, 960, H);
    text(ctx, "06", 1080, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "日韩小语种方向\n一面日本，一面韩国", 1080, 360, 760, 68, P.ink, 1.18, 800, 3);
    text(ctx, "把小语种优势做成奥斯翰的差异化入口。", 1085, 635, 690, 31, P.muted, 1.45, 400, 2);
  });

  await saveSlide(pages, "korea", async (ctx) => {
    title(ctx, "KUPP 韩国大学直升课程", "Korea University Pathway Program", 110, 100, 1180);
    await coverImage(ctx, asset("activity1"), 1180, 150, 620, 760, .9);
    const levels = [["高一", "TOPIK 1-2", "韩语入门 / 文化学科 / 跨文化学习"], ["高二", "TOPIK 3-4", "中级韩国语 / 韩国文化与历史 / 学业规划"], ["高三", "TOPIK 5-6", "高级韩国语 / TOPIK冲刺 / 升学指导"]];
    levels.forEach((l, i) => {
      const y = 310 + i * 190;
      roundRect(ctx, 130, y, 900, 135, 24, i % 2 ? "#FFFFFF" : "#F0E7D4");
      text(ctx, l[0], 170, y + 70, 120, 32, [P.coral, P.gold, P.blue][i], 1, 800, 1);
      text(ctx, l[1], 330, y + 70, 220, 30, P.ink, 1, 800, 1);
      text(ctx, l[2], 590, y + 68, 390, 24, P.muted, 1.2, 400, 1);
    });
    text(ctx, "韩国方向以语言能力、文化课程和升学指导同步推进，为目标韩国本科的学生提供更清晰的成长节奏。", 145, 910, 880, 27, P.ink, 1.35, 700, 2);
  });

  await saveSlide(pages, "japan", async (ctx) => {
    title(ctx, "JUPP 日本大学直升课程", "Japan University Pathway Program", 110, 100, 1180);
    await coverImage(ctx, asset("japan2"), 1120, 150, 660, 760, .88);
    const steps = [
      ["语言基础", "日语分层学习，逐步进入JLPT/NAT/J.TEST等能力准备。"],
      ["留考准备", "围绕EJU、校内考、面试等日本本科申请节点推进。"],
      ["文化适应", "通过日本文化、游学和留学生活指导降低适应成本。"],
      ["升学申请", "结合专业方向、院校层级和材料要求完成申请规划。"],
    ];
    steps.forEach((s, i) => processNode(ctx, `0${i + 1}`, s[0], s[1], 130 + (i % 2) * 470, 330 + Math.floor(i / 2) * 250, 410, [P.sage, P.gold, P.blue, P.coral][i]));
  });

  await saveSlide(pages, "korea-japan-spread", async (ctx) => {
    title(ctx, "日韩方向可以做成展开页：左日本，右韩国", "Spread Layout Concept", 110, 100, 1200);
    fill(ctx, "#EFE6D5", 130, 280, 800, 630);
    fill(ctx, "#E9F0EF", 990, 280, 800, 630);
    text(ctx, "日本 JUPP", 190, 380, 680, 44, P.sage, 1, 800, 1, "center");
    text(ctx, "日语能力 → EJU/JLPT → 校内考/面试 → 日本本科", 230, 485, 600, 30, P.ink, 1.4, 700, 3, "center");
    text(ctx, "韩国 KUPP", 1050, 380, 680, 44, P.coral, 1, 800, 1, "center");
    text(ctx, "韩语能力 → TOPIK递进 → 文化课程 → 韩国本科", 1090, 485, 600, 30, P.ink, 1.4, 700, 3, "center");
    arrow(ctx, 515, 680, 770, 680, P.sage, 7);
    arrow(ctx, 1375, 680, 1630, 680, P.coral, 7);
    text(ctx, "同样是小语种升学，日本方向更强调日语能力与留考准备，韩国方向更强调TOPIK递进与韩国高校申请，两条路径各有侧重。", 250, 960, 1420, 28, P.ink, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "chapter-singapore", async (ctx) => {
    fill(ctx, P.navy, 0, 0, W, H);
    await coverImage(ctx, asset("campus1"), 980, 0, 940, H, .75);
    fill(ctx, "rgba(18,43,69,.42)", 980, 0, 940, H);
    text(ctx, "07", 120, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "新加坡 IFD 方向\n国内预科能力建设", 120, 360, 820, 68, P.white, 1.18, 800, 3);
    text(ctx, "先在国内完成语言、学科和预科能力，再衔接新加坡本科路径。", 125, 635, 780, 31, "#EAD7A7", 1.45, 400, 2);
  });

  await saveSlide(pages, "singapore-path", async (ctx) => {
    title(ctx, "新加坡方向：2年国内学习 + 本科衔接规划", "Singapore IFD Pathway", 110, 105, 1150);
    const blocks = [
      ["第一年", "综合英语 / 英美文学 / 基础科学 / 世界历史 / 全球视野 / 数学 / 中文"],
      ["第二年", "学术用途英语 / 研究学习技巧 / 英语语言技巧 / 大学数学 / 商科与科学选修"],
      ["衔接阶段", "SIM、PSB Academy等新加坡院校方向规划，合作与学分口径以最终确认材料为准"],
    ];
    blocks.forEach((b, i) => {
      const x = 175 + i * 550;
      roundRect(ctx, x, 360, 420, 310, 26, P.white, [P.blue, P.gold, P.teal][i], 4);
      text(ctx, b[0], x + 60, 455, 300, 38, [P.blue, P.gold, P.teal][i], 1, 800, 1, "center");
      text(ctx, b[1], x + 52, 550, 316, 23, P.muted, 1.5, 400, 5, "center");
      if (i < 2) arrow(ctx, x + 430, 515, x + 520, 515, P.gold, 7);
    });
    text(ctx, "新加坡方向重在先完成语言、学科与预科能力建设，让学生在进入海外本科学习前拥有更扎实的学术适应力。", 260, 850, 1400, 28, P.ink, 1.35, 700, 2, "center");
  });

  await saveSlide(pages, "chapter-team", async (ctx) => {
    fill(ctx, P.cream, 0, 0, W, H);
    text(ctx, "08", 120, 220, 220, 86, P.gold, 1, 800, 1);
    text(ctx, "师资团队与升学支持", 120, 360, 900, 72, P.ink, 1.18, 800, 2);
    text(ctx, "师资不按课程重复露出，统一包装为奥斯翰国际课程教学与升学服务团队。", 125, 545, 870, 32, P.muted, 1.45, 400, 2);
    await coverImage(ctx, asset("group"), 1030, 120, 760, 820, .9);
  });

  await saveSlide(pages, "faculty-grid", async (ctx) => {
    title(ctx, "奥斯翰国际课程教学与升学服务团队", "Faculty Introduction", 110, 100, 1180);
    for (let i = 0; i < 10; i++) {
      const x = 110 + (i % 5) * 350, y = 280 + Math.floor(i / 5) * 305;
      roundRect(ctx, x, y, 300, 235, 24, P.white);
      ctx.beginPath();
      ctx.arc(x + 150, y + 82, 54, 0, Math.PI * 2);
      ctx.fillStyle = i % 2 ? "#DFE8E9" : "#EFE2C3";
      ctx.fill();
      text(ctx, "PHOTO", x + 105, y + 91, 90, 20, P.muted, 1, 700, 1, "center");
      text(ctx, "核心师资", x + 55, y + 165, 190, 25, P.ink, 1, 800, 1, "center");
      text(ctx, "学科 / 课程 / 升学方向", x + 35, y + 205, 230, 17, P.muted, 1, 400, 1, "center");
    }
  });

  await saveSlide(pages, "guidance-system", async (ctx) => {
    title(ctx, "从课程学习到大学申请的升学闭环", "University Guidance", 110, 105, 1120);
    const items = [
      ["选课规划", "按目标专业反推课程组合"],
      ["语言考试", "托福/雅思/TOPIK/JLPT分阶段推进"],
      ["院校定位", "国家、专业、预算、能力综合匹配"],
      ["材料申请", "成绩单、推荐信、文书、面试辅导"],
      ["签证行前", "录取后继续服务留学落地"],
    ];
    items.forEach((it, i) => {
      const x = 160 + i * 330;
      ctx.beginPath();
      ctx.arc(x + 105, 505, 95, 0, Math.PI * 2);
      ctx.fillStyle = [P.blue, P.gold, P.teal, P.coral, P.sage][i];
      ctx.fill();
      text(ctx, String(i + 1), x + 67, 526, 76, 50, P.white, 1, 800, 1, "center");
      text(ctx, it[0], x + 10, 680, 190, 28, P.ink, 1, 800, 1, "center");
      text(ctx, it[1], x - 15, 735, 240, 20, P.muted, 1.35, 400, 2, "center");
      if (i < 4) arrow(ctx, x + 205, 505, x + 315, 505, P.gold, 6);
    });
  });

  await saveSlide(pages, "campus-life", async (ctx) => {
    title(ctx, "校园生活：让家长看到孩子真实的三年", "Campus Life", 110, 100, 1050);
    await coverImage(ctx, asset("sports"), 115, 300, 520, 300, .9);
    await coverImage(ctx, asset("culture"), 700, 300, 520, 300, .9);
    await coverImage(ctx, asset("graduation"), 1285, 300, 520, 300, .9);
    card(ctx, 115, 670, 520, 170, "活动与社团", "运动会、社团、校园活动帮助学生建立参与感和归属感。", P.gold);
    card(ctx, 700, 670, 520, 170, "文化与表达", "外语、非遗、跨文化体验共同支撑综合素养。", P.teal);
    card(ctx, 1285, 670, 520, 170, "成长与毕业", "用真实场景强化学校陪伴学生成长的画面。", P.coral);
  });

  await saveSlide(pages, "admission-results", async (ctx) => {
    title(ctx, "录取成果展示区", "Admission Results", 110, 105, 1000);
    text(ctx, "升学成果是家长判断课程质量的重要依据。正式版可集中呈现录取院校、学生案例、奖学金、AP/OSSD成绩及日韩新方向成果。", 112, 250, 1180, 28, P.ink, 1.5, 700, 4);
    for (let i = 0; i < 6; i++) {
      const x = 150 + (i % 3) * 560, y = 430 + Math.floor(i / 3) * 240;
      roundRect(ctx, x, y, 480, 170, 22, P.white, "#E1D3AC");
      text(ctx, "OFFER / CASE", x + 48, y + 72, 380, 28, i % 2 ? P.blue : P.gold, 1, 800, 1, "center");
      text(ctx, "学生案例、录取院校、专业、年份", x + 58, y + 120, 360, 20, P.muted, 1, 400, 1, "center");
    }
  });

  await saveSlide(pages, "admission", async (ctx) => {
    title(ctx, "入学咨询", "Admission Requirements", 110, 100, 880);
    const items = [
      ["招生对象", "初三在读、初中毕业、高中在读及有国际课程升学需求的学生。"],
      ["入学评估", "咨询预约、学业评估、入学测试/面试、课程路径建议。"],
      ["费用信息", "学费、住宿、餐费、杂费以学校最终公示和招生办确认版为准。"],
      ["联系方式", "地址：深圳市罗湖区布心路2040号；招生热线与二维码待最终确认。"],
    ];
    items.forEach((it, i) => card(ctx, 170 + (i % 2) * 790, 320 + Math.floor(i / 2) * 250, 680, 180, it[0], it[1], [P.blue, P.gold, P.teal, P.coral][i]));
  });

  await saveSlide(pages, "back", async (ctx) => {
    await coverImage(ctx, asset("cover"), 0, 0, W, H);
    fill(ctx, "rgba(11,31,50,.76)", 0, 0, W, H);
    text(ctx, "OXSTAND INTERNATIONAL SCHOOL", 120, 230, 780, 24, "#EAD7A7", 1, 800, 1);
    text(ctx, "让合适的课程\n成为孩子走向世界的起点", 120, 390, 920, 64, P.white, 1.26, 800, 3);
    text(ctx, "深圳奥斯翰外语学校国际部", 124, 700, 720, 32, "#F4EAD3", 1, 700, 1);
  });

  return pages;
}

function escXml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function slideXml(idx) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>
    <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
    <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    <p:pic>
      <p:nvPicPr><p:cNvPr id="2" name="slide-image-${idx}"/><p:cNvPicPr/><p:nvPr/></p:nvPicPr>
      <p:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></p:blipFill>
      <p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="6858000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></p:spPr>
    </p:pic>
  </p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>
</p:sld>`;
}

async function makePptx(imageFiles) {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${imageFiles.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst><p:sldIdLst>${imageFiles.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${imageFiles.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("")}<Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Oxstand"><a:themeElements><a:clrScheme name="Oxstand"><a:dk1><a:srgbClr val="102033"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="122B45"/></a:dk2><a:lt2><a:srgbClr val="F6F1E7"/></a:lt2><a:accent1><a:srgbClr val="0D5B78"/></a:accent1><a:accent2><a:srgbClr val="C89B3C"/></a:accent2><a:accent3><a:srgbClr val="D86747"/></a:accent3><a:accent4><a:srgbClr val="6C8B78"/></a:accent4><a:accent5><a:srgbClr val="3C8D8F"/></a:accent5><a:accent6><a:srgbClr val="1D3854"/></a:accent6><a:hlink><a:srgbClr val="0D5B78"/></a:hlink><a:folHlink><a:srgbClr val="6C8B78"/></a:folHlink></a:clrScheme><a:fontScheme name="Oxstand"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:minorFont></a:fontScheme><a:fmtScheme name="Oxstand"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`);
  imageFiles.forEach((file, i) => {
    zip.file(`ppt/media/image${i + 1}.jpg`, fs.readFileSync(file));
    zip.file(`ppt/slides/slide${i + 1}.xml`, slideXml(i + 1));
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image${i + 1}.jpg"/></Relationships>`);
  });
  fs.writeFileSync(outPptx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

const pages = await buildPages();
await makePptx(pages);
fs.writeFileSync(outMd, `# 奥斯翰国际部招生宣传册横版PPT重构初稿

已按 SAIS 总册结构重构为横版PPT招生手册。

- 输出PPT：${outPptx}
- 页面预览：${pageDir}
- 页数：${pages.length}

本版为打印视觉初稿，所有页面以整页高分辨率图片嵌入PPT，便于先看整体叙事和排版节奏。后续若需要精修可继续拆成可编辑文本/形状版本。
`, "utf8");
console.log(`PPT generated: ${outPptx}`);
console.log(`Slides: ${pages.length}`);
