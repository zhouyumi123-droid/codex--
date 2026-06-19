import fs from "fs";
import path from "path";
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "05_总招生手册_初稿图文版");
const manifest = JSON.parse(fs.readFileSync(path.join(outDir, "asset_manifest.json"), "utf8"));
const asset = (k) => path.join(outDir, manifest[k] || "");

try {
  GlobalFonts.registerFromPath("C:/Windows/Fonts/msyh.ttc", "Microsoft YaHei");
  GlobalFonts.registerFromPath("C:/Windows/Fonts/simhei.ttf", "SimHei");
} catch {}

const C = {
  navy: "#102033",
  blue: "#0d496f",
  gold: "#b58b34",
  paleGold: "#ead7a7",
  cream: "#f7f3ea",
  text: "#26384c",
  muted: "#5d6d7e",
  white: "#ffffff",
};

const strengths = [
  ["2004", "深圳老牌民办国际化高中", "二十余年办学积累，强调稳定、经验与长期主义。"],
  ["多语种", "外语学校底色", "英语、日语、韩语等语言资源支撑多出口升学。"],
  ["小规模", "更近的师生关系", "便于跟踪学习状态、生活节奏和升学节点。"],
  ["多路径", "按目标国家规划课程", "AP、OSSD、韩国、日本、新加坡、IG/A-Level衔接。"],
];

const courses = [
  ["AP 国际课程", "美国/香港/多国申请", "适合目标美国、香港及多国综合申请的学生，用AP科目、标化与语言成绩共同构建申请竞争力。", ["College Board 授权学校，School code: 579073", "G7-G10夯实英语、数学、科学与全球视野", "G11-G12进入SAT与AP科目冲刺", "规划微积分、化学、生物、物理、经济、世界历史、中文等方向"], "基础能力搭建 → AP科目组合规划 → SAT/语言考试 → 多国大学申请", "class1"],
  ["OSSD 中加课程", "加拿大/英美澳港多国申请", "适合希望走加拿大安大略省高中课程体系、重视过程性评价和多国申请通道的学生。", ["与加拿大邦德多伦多学院合作设立", "高二注册安大略省高中学籍，最终口径以授权文件为准", "以12年级6门4U/4M课程成绩及语言成绩作为核心申请材料", "中加课程衔接，三年循序渐进完成学术能力过渡"], "中方基础课程 → 安省课程学习 → 12年级核心课程成绩 → 海外大学申请", "ossd1"],
  ["KUPP 韩国大学直升课程", "韩国名校/小语种方向", "适合目标韩国本科、愿意系统学习韩语并通过TOPIK能力提升进入韩国高校申请的学生。", ["TOPIK 1-2、3-4、5-6三年递进目标", "韩国语、韩国文化与历史、留学生活指导一体化推进", "可结合校内文化课程成绩与TOPIK进行韩国高校申请", "韩国方向师资与资源相对成熟，是本册重点呈现板块"], "韩语入门 → TOPIK分级提升 → 文化课程与面试准备 → 韩国大学申请", "activity1"],
  ["JUPP 日本大学直升课程", "日本本科/日语方向", "适合目标日本本科、愿意长期学习日语并准备EJU、JLPT或校内考面试的学生。", ["日语分层学习，逐步进入升学考试准备", "结合日本文化、留学生活适应与院校申请指导", "适合艺术、理工、商科、人文等不同专业方向规划", "游学与文化体验素材可强化课程真实感"], "日语基础 → JLPT/EJU准备 → 专业与院校定位 → 日本本科申请", "japan1"],
  ["新加坡 IFD 方向", "新加坡本科衔接", "适合希望先在国内完成语言、基础学科和预科能力建设，再衔接新加坡本科路径的学生。", ["两年制国内学习路径，强调语言、学科与预科能力", "覆盖学术用途英语、研究学习技巧、数学、商科、科学与艺术选修", "可面向SIM、PSB Academy等新加坡院校衔接方向规划", "合作与学分互认口径需以最终确认材料为准"], "国内语言与预科学习 → 学科选修与能力评估 → 新加坡院校衔接", "campus1"],
  ["IG / A-Level 衔接方向", "英联邦/香港/多国申请", "适合目标英国、香港、澳洲、加拿大等方向，需要用IGCSE与A-Level科目组合建立学术画像的学生。", ["G9-G10完成IGCSE准备，G11-G12进入A-Level阶段", "数学、物理、化学、经济、商科、艺术设计等方向可按目标专业组合", "采用双语过渡到全英学术环境的递进设计", "A-Level中心认证与师资案例仍需最终确认，初稿先作为规划板块呈现"], "IG基础 → A-Level选科 → AS/A2考试 → UCAS及多国申请", "campus2"],
];

function font(size, weight = 400) {
  return `${weight} ${size}px "Microsoft YaHei", "SimHei", Arial`;
}

function wrap(ctx, text, maxWidth, fontSpec) {
  ctx.font = fontSpec;
  const chars = [...String(text)];
  const lines = [];
  let line = "";
  for (const ch of chars) {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawText(ctx, text, x, y, maxWidth, size = 26, color = C.text, lineHeight = 1.55, weight = 400, maxLines = 99) {
  ctx.fillStyle = color;
  const f = font(size, weight);
  ctx.font = f;
  const lines = wrap(ctx, text, maxWidth, f).slice(0, maxLines);
  for (let i = 0; i < lines.length; i++) ctx.fillText(lines[i], x, y + i * size * lineHeight);
  return y + lines.length * size * lineHeight;
}

function fill(ctx, color, x, y, w, h) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

async function coverImage(ctx, imgPath, x, y, w, h, alpha = 1) {
  const image = await loadImage(imgPath);
  const scale = Math.max(w / image.width, h / image.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (image.width - sw) / 2;
  const sy = (image.height - sh) / 2;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function card(ctx, x, y, w, h, title, body, accent = C.gold) {
  fill(ctx, C.white, x, y, w, h);
  fill(ctx, accent, x, y, 8, h);
  drawText(ctx, title, x + 24, y + 42, w - 44, 24, C.navy, 1.25, 700, 2);
  drawText(ctx, body, x + 24, y + 88, w - 44, 19, C.muted, 1.5, 400, 4);
}

function sectionTitle(ctx, kicker, title, sub, x, y, w) {
  drawText(ctx, kicker, x, y, w, 18, C.gold, 1, 800, 1);
  const y2 = drawText(ctx, title, x, y + 42, w, 42, C.navy, 1.25, 800, 2);
  return sub ? drawText(ctx, sub, x, y2 + 18, w, 23, C.muted, 1.6, 400, 4) : y2;
}

function bulletList(ctx, items, x, y, w, size = 22) {
  let cy = y;
  for (const item of items) {
    fill(ctx, C.gold, x, cy + 8, 8, 8);
    cy = drawText(ctx, item, x + 22, cy, w - 22, size, C.text, 1.45, 400, 3) + 8;
  }
  return cy;
}

async function makeCanvas(w, h, painter) {
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  fill(ctx, C.cream, 0, 0, w, h);
  await painter(ctx, w, h);
  return canvas;
}

async function landscapePages() {
  const W = 1684, H = 1191;
  const pages = [];
  pages.push(await makeCanvas(W, H, async (ctx) => {
    await coverImage(ctx, asset("cover"), 0, 0, W, H);
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, "rgba(6,22,40,.94)");
    grad.addColorStop(.55, "rgba(6,22,40,.72)");
    grad.addColorStop(1, "rgba(6,22,40,.08)");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    drawText(ctx, "OXSTAND INTERNATIONAL SCHOOL", 110, 150, 720, 20, C.paleGold, 1, 800, 1);
    drawText(ctx, "深圳奥斯翰外语学校\n国际部招生宣传册", 110, 270, 820, 64, C.white, 1.28, 800, 3);
    drawText(ctx, "精品国际课程 · 多路径升学规划 · 小规模精细化支持", 112, 520, 780, 28, "#f1e4c1", 1.5, 400, 2);
    drawText(ctx, "2026 Admissions Brochure Draft", 112, 990, 540, 22, C.paleGold, 1, 700, 1);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    await coverImage(ctx, asset("campus1"), 70, 95, 650, 990);
    sectionTitle(ctx, "WHY OXSTAND", "一所更懂深圳家庭选择的老牌国际化高中", "先讲学校和国际部综合实力，再按学生目标方向推荐课程路径。", 790, 130, 760);
    let x = 790, y = 375, cw = 350, ch = 185;
    strengths.forEach((s, i) => card(ctx, x + (i % 2) * 380, y + Math.floor(i / 2) * 225, cw, ch, `${s[0]}  ${s[1]}`, s[2]));
    fill(ctx, C.navy, 790, 870, 730, 150);
    drawText(ctx, "家长不是只在选一门课程，而是在选择孩子未来三年的学习管理、语言成长和升学路线。", 830, 920, 660, 30, "#f4ead3", 1.45, 700, 3);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "SCHOOL PROFILE", "学校简介与信任背书", "2004年创办的深圳老牌民办国际化高中。", 85, 90, 760);
    fill(ctx, C.navy, 85, 330, 650, 600);
    drawText(ctx, "深圳奥斯翰外语学校位于深圳市罗湖区布心路2040号，2004年经深圳市教育局批准创办。学校以“与世界同步，培育跨时代精英人才”为育人目标，植根中华传统文化，融贯东西方教育思想，依托外语特色与多元课程，为学生提供面向不同国家和地区的升学路径。", 130, 390, 560, 27, "#f3ead8", 1.75, 400, 12);
    const tl = [["2004", "经深圳市教育局批准创办"], ["2006", "深圳市一级学校"], ["2008", "ISO9001国际优质教育管理认证"], ["2009", "引进韩国大学直升课程"], ["2012", "引进日本大学先修课程"], ["2016", "AP授权学校"], ["2024", "AP School code：579073"]];
    tl.forEach((t, i) => card(ctx, 800 + (i % 2) * 380, 170 + Math.floor(i / 2) * 210, 340, 160, t[0], t[1], i % 2 ? C.blue : C.gold));
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "COURSE MAP", "国际课程地图", "按目标地区规划，而不是简单堆课程名称。", 85, 80, 880);
    courses.forEach((c, i) => {
      const x = 85 + (i % 3) * 510, y = 280 + Math.floor(i / 3) * 350;
      fill(ctx, C.navy, x, y, 455, 285);
      drawText(ctx, c[1], x + 35, y + 48, 380, 18, C.paleGold, 1, 800, 1);
      drawText(ctx, c[0], x + 35, y + 92, 390, 30, C.white, 1.2, 800, 2);
      drawText(ctx, c[2], x + 35, y + 165, 380, 21, "#dce7ef", 1.55, 400, 4);
    });
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "TEACHING & SUPPORT", "学习管理与升学服务闭环", "让家长看到学校不只是教课，而是把课程、语言、背景、申请和生活管理放在同一套节奏里。", 85, 80, 1100);
    const items = ["课堂学习", "个性化辅导", "语言考试规划", "目标院校定位", "申请材料与文书", "面试与签证行前", "家校沟通", "活动与综合素养"];
    items.forEach((t, i) => card(ctx, 85 + (i % 4) * 390, 305 + Math.floor(i / 4) * 250, 340, 185, String(i + 1).padStart(2, "0"), `${t}：按学生目标和阶段推进。`, i % 2 ? C.blue : C.gold));
    await coverImage(ctx, asset("activity1"), 85, 850, 1490, 220);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "FACULTY", "师资团队版位预留", "初稿先统一包装为“奥斯翰国际课程教学与升学服务团队”，待补齐10-15位可公开师资后替换。", 85, 80, 1200);
    for (let i = 0; i < 8; i++) {
      const x = 85 + (i % 4) * 390, y = 290 + Math.floor(i / 4) * 340;
      fill(ctx, C.white, x, y, 340, 260);
      ctx.beginPath(); ctx.arc(x + 70, y + 75, 42, 0, Math.PI * 2); ctx.fillStyle = C.navy; ctx.fill();
      drawText(ctx, `T${i + 1}`, x + 48, y + 88, 80, 26, C.white, 1, 800, 1);
      drawText(ctx, "金牌师资待补充", x + 35, y + 150, 260, 25, C.navy, 1.2, 800, 1);
      drawText(ctx, "姓名 / 岗位 / 学历 / 教龄 / 主讲课程 / 可公开亮点 / 照片授权", x + 35, y + 195, 270, 19, C.muted, 1.45, 400, 3);
    }
  }));
  for (const c of courses) {
    pages.push(await makeCanvas(W, H, async (ctx) => {
      sectionTitle(ctx, "COURSE PATH", c[0], c[2], 85, 80, 1120);
      await coverImage(ctx, asset(c[5]), 85, 330, 620, 650);
      fill(ctx, C.white, 755, 330, 390, 650);
      drawText(ctx, "课程亮点", 795, 390, 300, 28, C.navy, 1.2, 800, 1);
      bulletList(ctx, c[3], 795, 455, 310, 22);
      fill(ctx, C.navy, 1190, 330, 360, 650);
      drawText(ctx, "升学规划路线", 1230, 395, 280, 28, C.white, 1.2, 800, 2);
      drawText(ctx, c[4], 1230, 480, 280, 25, "#f4ead3", 1.6, 700, 8);
      drawText(ctx, c[1], 1230, 860, 280, 20, C.paleGold, 1.4, 800, 2);
    }));
  }
  pages.push(await makeCanvas(W, H, async (ctx) => {
    await coverImage(ctx, asset("group"), 85, 90, 720, 860);
    sectionTitle(ctx, "CAMPUS LIFE", "校园生活与成长场景", "用真实校园、课堂、活动和游学画面，让家长感知孩子在这里的日常。", 870, 120, 620);
    drawText(ctx, "可用画面方向：校园环境、课堂互动、毕业合影、社团活动、运动会、非遗进校、日本游学、师生交流。后续设计可根据最终公开授权替换高清原图。", 870, 340, 620, 26, C.text, 1.7, 400, 7);
    await coverImage(ctx, asset("sports"), 870, 670, 300, 210);
    await coverImage(ctx, asset("culture"), 1200, 670, 300, 210);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "ADMISSION", "入学咨询与费用信息", "费用、电话、二维码以学校最终公示和招生办确认为准。", 85, 90, 1200);
    card(ctx, 120, 330, 430, 350, "招生对象", "初三在读、初中毕业、高中在读及有国际课程升学需求的学生。不同课程按入学测试、面试和学生目标进行匹配。");
    card(ctx, 625, 330, 430, 350, "入学流程", "咨询预约 → 课程评估 → 入学测试/面试 → 升学路线建议 → 确认课程与费用 → 办理入读。", C.blue);
    card(ctx, 1130, 330, 430, 350, "费用口径", "学费、住宿、餐费、杂费及项目费用待总裁办/招生办最终确认后填入。初稿暂不写死金额。");
    fill(ctx, C.navy, 120, 790, 1440, 180);
    drawText(ctx, "地址：深圳市罗湖区布心路2040号    招生热线与二维码待最终确认", 180, 860, 1320, 32, "#f4ead3", 1.4, 800, 2);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    await coverImage(ctx, asset("cover"), 0, 0, W, H);
    fill(ctx, "rgba(6,22,40,.76)", 0, 0, W, H);
    drawText(ctx, "OXSTAND INTERNATIONAL SCHOOL", 120, 190, 820, 22, C.paleGold, 1, 800, 1);
    drawText(ctx, "让合适的课程\n成为孩子走向世界的起点", 120, 340, 900, 58, C.white, 1.35, 800, 3);
    drawText(ctx, "深圳奥斯翰外语学校国际部", 120, 640, 680, 30, "#f4ead3", 1.4, 700, 1);
  }));
  return pages;
}

async function portraitPages() {
  const W = 1191, H = 1684;
  const pages = [];
  pages.push(await makeCanvas(W, H, async (ctx) => {
    await coverImage(ctx, asset("cover"), 0, 0, W, H);
    fill(ctx, "rgba(6,22,40,.62)", 0, 0, W, H);
    drawText(ctx, "OXSTAND INTERNATIONAL SCHOOL", 80, 920, 800, 22, C.paleGold, 1, 800, 1);
    drawText(ctx, "奥斯翰国际部\n精品课程招生简章", 80, 1010, 900, 62, C.white, 1.3, 800, 3);
    drawText(ctx, "多路径升学规划 · 小规模精细化支持", 82, 1240, 780, 30, "#f4ead3", 1.5, 400, 2);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "WHY OXSTAND", "为什么选择奥斯翰", "老牌办学、外语底色、小规模管理、多出口课程，是这版传单的主叙事。", 70, 85, 950);
    strengths.forEach((s, i) => card(ctx, 70 + (i % 2) * 525, 360 + Math.floor(i / 2) * 245, 470, 190, `${s[0]}  ${s[1]}`, s[2]));
    await coverImage(ctx, asset("campus1"), 70, 930, 1050, 520);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "COURSE MAP", "按目标选择课程", "先定方向，再选路径。", 70, 85, 900);
    const rows = [["美国/香港/多国", "AP"], ["加拿大/多国", "OSSD"], ["韩国本科", "KUPP"], ["日本本科", "JUPP"], ["新加坡本科", "IFD"], ["英联邦/香港", "IG/A-Level"]];
    rows.forEach((r, i) => card(ctx, 70 + (i % 2) * 525, 315 + Math.floor(i / 2) * 240, 470, 180, r[0], `建议路径：${r[1]}`, i % 2 ? C.blue : C.gold));
  }));
  for (let i = 0; i < courses.length; i += 2) {
    pages.push(await makeCanvas(W, H, async (ctx) => {
      sectionTitle(ctx, "COURSE PATH", i === 0 ? "国际课程路径" : "更多升学方向", "每条路径都对应不同学生画像与申请目标。", 70, 85, 900);
      courses.slice(i, i + 2).forEach((c, j) => {
        const y = 315 + j * 590;
        fill(ctx, C.white, 70, y, 1050, 500);
        drawText(ctx, c[1], 110, y + 55, 450, 20, C.gold, 1, 800, 1);
        drawText(ctx, c[0], 110, y + 105, 500, 34, C.navy, 1.2, 800, 2);
        drawText(ctx, c[2], 110, y + 205, 460, 22, C.muted, 1.55, 400, 5);
        bulletList(ctx, c[3].slice(0, 3), 620, y + 80, 430, 21);
        fill(ctx, C.navy, 620, y + 350, 430, 88);
        drawText(ctx, c[4], 650, y + 388, 370, 20, "#f4ead3", 1.35, 700, 3);
      });
    }));
  }
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "SUPPORT", "学习管理与升学支持", "把课程学习、语言提升、背景活动和大学申请放在同一套节奏里。", 70, 85, 900);
    ["课堂学习", "个性化辅导", "语言考试", "选校定位", "文书面试", "签证行前"].forEach((t, i) => card(ctx, 70 + (i % 2) * 525, 325 + Math.floor(i / 2) * 235, 470, 175, String(i + 1).padStart(2, "0"), `${t}：由国际部团队按学生目标和阶段推进。`));
    await coverImage(ctx, asset("activity1"), 70, 1120, 1050, 320);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "FACULTY & CAMPUS", "师资团队与校园场景", "师资页先预留，明天确认后替换为正式照片与履历。", 70, 85, 900);
    for (let i = 0; i < 6; i++) card(ctx, 70 + (i % 2) * 525, 300 + Math.floor(i / 2) * 205, 470, 155, `T${i + 1}`, "师资待补：姓名 / 岗位 / 课程 / 亮点", i % 2 ? C.blue : C.gold);
    await coverImage(ctx, asset("group"), 70, 1010, 510, 360);
    await coverImage(ctx, asset("sports"), 610, 1010, 510, 360);
  }));
  pages.push(await makeCanvas(W, H, async (ctx) => {
    sectionTitle(ctx, "ADMISSION", "招生咨询", "费用、电话、二维码以最终确认版为准。", 70, 85, 900);
    card(ctx, 90, 340, 1010, 210, "适合学生", "初三在读、初中毕业、高中在读及有国际课程升学需求的学生。");
    card(ctx, 90, 610, 1010, 210, "咨询流程", "预约咨询 → 学业评估 → 入学测试/面试 → 路线建议 → 确认入读。", C.blue);
    card(ctx, 90, 880, 1010, 210, "学校地址", "深圳市罗湖区布心路2040号");
    fill(ctx, C.navy, 90, 1240, 1010, 210);
    drawText(ctx, "选择一条更适合孩子的国际升学路线", 155, 1330, 880, 38, "#f4ead3", 1.3, 800, 2);
  }));
  return pages;
}

function pdfFromJpegs(jpegs, outPath, pageWPt, pageHPt) {
  const objects = [];
  const pagesKids = [];
  const catalogId = 1;
  const pagesId = 2;
  let id = 3;
  for (const img of jpegs) {
    const imageId = id++;
    const contentId = id++;
    const pageId = id++;
    objects[imageId] = { stream: img.data, dict: `<< /Type /XObject /Subtype /Image /Width ${img.w} /Height ${img.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.data.length} >>` };
    const content = Buffer.from(`q\n${pageWPt} 0 0 ${pageHPt} 0 0 cm\n/Im${imageId} Do\nQ`);
    objects[contentId] = { stream: content, dict: `<< /Length ${content.length} >>` };
    objects[pageId] = { text: `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pageWPt} ${pageHPt}] /Resources << /XObject << /Im${imageId} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>` };
    pagesKids.push(`${pageId} 0 R`);
  }
  objects[catalogId] = { text: `<< /Type /Catalog /Pages ${pagesId} 0 R >>` };
  objects[pagesId] = { text: `<< /Type /Pages /Kids [${pagesKids.join(" ")}] /Count ${jpegs.length} >>` };
  const chunks = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
  const offsets = [0];
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = Buffer.concat(chunks).length;
    const obj = objects[i];
    chunks.push(Buffer.from(`${i} 0 obj\n`));
    if (obj.stream) chunks.push(Buffer.from(`${obj.dict}\nstream\n`), obj.stream, Buffer.from("\nendstream\nendobj\n"));
    else chunks.push(Buffer.from(`${obj.text}\nendobj\n`));
  }
  const xref = Buffer.concat(chunks).length;
  chunks.push(Buffer.from(`xref\n0 ${objects.length}\n0000000000 65535 f \n`));
  for (let i = 1; i < objects.length; i++) chunks.push(Buffer.from(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`));
  chunks.push(Buffer.from(`trailer\n<< /Size ${objects.length} /Root ${catalogId} 0 R >>\nstartxref\n${xref}\n%%EOF`));
  fs.writeFileSync(outPath, Buffer.concat(chunks));
}

async function writeSet(kind, pages, pageWPt, pageHPt) {
  const imageDir = path.join(outDir, `${kind}_pages`);
  fs.mkdirSync(imageDir, { recursive: true });
  const jpegs = [];
  for (let i = 0; i < pages.length; i++) {
    const data = await pages[i].encode("jpeg", 86);
    fs.writeFileSync(path.join(imageDir, `page_${String(i + 1).padStart(2, "0")}.jpg`), data);
    jpegs.push({ data, w: pages[i].width, h: pages[i].height });
  }
  const outName = kind === "landscape" ? "奥斯翰国际部总招生手册_横版图文初稿.pdf" : "奥斯翰国际部总招生传单版_竖版图文初稿.pdf";
  pdfFromJpegs(jpegs, path.join(outDir, outName), pageWPt, pageHPt);
  console.log(`${outName}: ${pages.length} pages`);
}

await writeSet("landscape", await landscapePages(), 841.89, 595.28);
await writeSet("portrait", await portraitPages(), 595.28, 841.89);
