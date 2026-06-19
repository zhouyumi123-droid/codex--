import fs from "fs";
import path from "path";
import pptxgen from "pptxgenjs";

const root = process.cwd();
const outDir = path.join(root, "04_outputs_输出结果", "港澳台联考招生宣传PPT");
fs.mkdirSync(outDir, { recursive: true });

const assetDir = path.join(
  root,
  "03_working_files_工作文件",
  "2026课程宣传物料攻坚_6月5日前交付",
  "05_总招生手册_初稿图文版",
  "assets"
);
const visualDir = path.join(root, "02_assets_视觉素材");
const outPath = path.join(outDir, "奥斯翰外语学校港澳台联考班_蓝白简约高级招商PPT.pptx");

const imgs = {
  cover: path.join(assetDir, "cover.jpg"),
  campus1: path.join(assetDir, "campus1.jpg"),
  campus2: path.join(assetDir, "campus2.jpg"),
  class1: path.join(assetDir, "class1.jpg"),
  activity: path.join(assetDir, "activity1.jpg"),
  graduation: path.join(assetDir, "graduation.jpg"),
  group: path.join(assetDir, "group.jpg"),
  culture: path.join(assetDir, "culture.jpg"),
  logo: path.join(visualDir, "old_logo_crop.png"),
  qr: path.join(visualDir, "contact_qr_crop.png"),
};

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Codex";
pptx.company = "奥斯翰外语学校";
pptx.subject = "港澳台联考班招生宣传PPT";
pptx.title = "奥斯翰外语学校 · 港澳台联考班";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  lang: "zh-CN",
};

const W = 13.333;
const H = 7.5;
const FONT = "Microsoft YaHei";
const AFONT = "Arial";
const C = {
  bg: "F7FAFD",
  white: "FFFFFF",
  navy: "0B1F36",
  navy2: "153A5C",
  blue: "1F5E8C",
  sky: "DCECF7",
  pale: "EDF5FB",
  line: "D6E4EF",
  text: "172033",
  muted: "617487",
  gold: "B58A35",
  green: "1F7A6D",
  red: "B94646",
};

function text(slide, value, x, y, w, h, opt = {}) {
  slide.addText(value, {
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

function rect(slide, x, y, w, h, fill, opt = {}) {
  slide.addShape(pptx.ShapeType.rect, {
    x,
    y,
    w,
    h,
    fill: { color: fill, transparency: opt.fillTransparency ?? 0 },
    line: { color: opt.line || fill, width: opt.lineWidth ?? 0.5, transparency: opt.lineTransparency ?? 0 },
  });
}

function line(slide, x, y, w, h, opt = {}) {
  slide.addShape(pptx.ShapeType.line, {
    x,
    y,
    w,
    h,
    line: {
      color: opt.color || C.line,
      width: opt.width ?? 0.8,
      transparency: opt.transparency ?? 0,
      endArrowType: opt.endArrowType,
    },
  });
}

function image(slide, file, x, y, w, h, transparency = 0) {
  if (!fs.existsSync(file)) return false;
  slide.addImage({
    path: file,
    x,
    y,
    w,
    h,
    transparency,
    sizing: { type: "cover", x, y, w, h },
  });
  return true;
}

function base(slide, n, section = "HK · MACAO · TAIWAN JOINT ENTRANCE EXAM") {
  slide.background = { color: C.bg };
  rect(slide, 0, 0, W, H, C.bg, { lineTransparency: 100 });
  rect(slide, 0, 0, W, 0.16, C.navy, { lineTransparency: 100 });
  text(slide, section, 0.55, 7.05, 5.4, 0.18, {
    fontFace: AFONT,
    fontSize: 6.6,
    bold: true,
    color: "8795A4",
  });
  text(slide, String(n).padStart(2, "0"), 12.15, 6.98, 0.55, 0.2, {
    fontFace: AFONT,
    fontSize: 8,
    bold: true,
    color: "8795A4",
    align: "right",
  });
}

function title(slide, eyebrow, heading, sub = "") {
  text(slide, eyebrow.toUpperCase(), 0.68, 0.58, 4.0, 0.18, {
    fontFace: AFONT,
    fontSize: 7.4,
    bold: true,
    color: C.gold,
  });
  text(slide, heading, 0.68, 0.86, 9.2, 0.48, {
    fontSize: 23,
    bold: true,
    color: C.navy,
  });
  if (sub) {
    text(slide, sub, 0.7, 1.36, 8.9, 0.24, {
      fontSize: 9.5,
      color: C.muted,
    });
  }
  line(slide, 0.68, sub ? 1.72 : 1.52, 11.9, 0, { color: C.line, width: 0.8 });
}

function card(slide, x, y, w, h, opt = {}) {
  rect(slide, x, y, w, h, opt.fill || C.white, {
    line: opt.line || C.line,
    lineWidth: opt.lineWidth ?? 0.6,
  });
  if (opt.bar) rect(slide, x, y, 0.06, h, opt.bar, { lineTransparency: 100 });
}

function tag(slide, value, x, y, w, color = C.blue, fill = C.pale) {
  rect(slide, x, y, w, 0.34, fill, { lineTransparency: 100 });
  text(slide, value, x + 0.12, y + 0.09, w - 0.24, 0.13, {
    fontSize: 8.2,
    bold: true,
    color,
    align: "center",
  });
}

function bulletList(slide, items, x, y, w, h, opt = {}) {
  const runs = [];
  items.forEach((item, idx) => {
    runs.push({
      text: item,
      options: { bullet: { type: "ul" }, breakLine: idx < items.length - 1 },
    });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontFace: FONT,
    fontSize: opt.fontSize ?? 10.2,
    color: opt.color || C.text,
    margin: opt.margin ?? 0.05,
    fit: "shrink",
    paraSpaceAfterPt: opt.paraSpaceAfterPt ?? 5,
    breakLine: false,
  });
}

function stat(slide, value, label, x, y, w, accent = C.blue) {
  card(slide, x, y, w, 0.9, { fill: C.white, bar: accent });
  text(slide, value, x + 0.25, y + 0.18, w - 0.4, 0.28, {
    fontFace: AFONT,
    fontSize: 18,
    bold: true,
    color: C.navy,
  });
  text(slide, label, x + 0.25, y + 0.55, w - 0.4, 0.18, {
    fontSize: 8.6,
    color: C.muted,
  });
}

function miniTable(slide, rows, x, y, widths, rowH, opt = {}) {
  rows.forEach((row, r) => {
    let cx = x;
    row.forEach((cell, c) => {
      const fill = r === 0 ? C.navy : c === 0 ? C.pale : C.white;
      rect(slide, cx, y + r * rowH, widths[c], rowH, fill, { line: C.line });
      text(slide, cell, cx + 0.08, y + r * rowH + 0.1, widths[c] - 0.16, rowH - 0.12, {
        fontSize: opt.fontSize ?? 8.4,
        bold: r === 0 || c === 0,
        color: r === 0 ? C.white : c === 0 ? C.blue : C.text,
        align: c === 0 ? "center" : "left",
        valign: "mid",
      });
      cx += widths[c];
    });
  });
}

function quote(slide, value, x, y, w, h) {
  card(slide, x, y, w, h, { fill: C.navy, bar: C.gold, line: C.navy });
  text(slide, value, x + 0.35, y + 0.22, w - 0.55, h - 0.35, {
    fontSize: 12,
    bold: true,
    color: C.white,
    align: "center",
    valign: "mid",
  });
}

function cover() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  image(slide, imgs.cover, 5.35, 0, 7.98, H, 5);
  rect(slide, 5.35, 0, 7.98, H, C.navy, { fillTransparency: 42, lineTransparency: 100 });
  rect(slide, 0, 0, 5.9, H, C.navy, { lineTransparency: 100 });
  rect(slide, 0.68, 0.72, 0.08, 5.88, C.gold, { lineTransparency: 100 });
  if (fs.existsSync(imgs.logo)) slide.addImage({ path: imgs.logo, x: 1.0, y: 0.72, w: 0.72, h: 0.72 });
  text(slide, "OXSTAND INTERNATIONAL SCHOOL", 1.92, 0.88, 3.2, 0.18, { fontFace: AFONT, fontSize: 7.4, bold: true, color: C.gold });
  text(slide, "奥斯翰外语学校 · 港澳台联考班", 1.0, 2.25, 4.65, 0.85, { fontSize: 28, bold: true, color: C.white });
  text(slide, "19年深耕，为港澳台学子铺就通往内地的名校之路", 1.02, 3.42, 4.6, 0.4, { fontSize: 13, color: "E4ECF5" });
  line(slide, 1.02, 4.1, 1.95, 0, { color: C.gold, width: 3 });
  text(slide, "深圳奥斯翰外语学校 · 2026年招生", 1.05, 4.52, 3.8, 0.22, { fontSize: 10.5, color: "CEDAE6" });
  ["19年联考沉淀", "独立编班", "AI精准教学", "一站式升学规划"].forEach((t, i) => {
    tag(slide, t, 7.0 + (i % 2) * 2.2, 5.58 + Math.floor(i / 2) * 0.52, 1.8, i === 0 ? C.white : C.navy, i === 0 ? C.gold : C.white);
  });
}

function history() {
  const slide = pptx.addSlide();
  base(slide, 2, "SCHOOL HISTORY");
  title(slide, "History", "深圳民办高中港澳台联考办学历史最悠久的学校", "办学历史——19年港澳台联考办学沉淀");
  image(slide, imgs.campus1, 8.25, 1.9, 4.25, 4.45, 0);
  rect(slide, 8.25, 1.9, 4.25, 4.45, C.navy, { fillTransparency: 58, lineTransparency: 100 });
  stat(slide, "2004", "奥斯翰外语学校成立", 0.86, 2.1, 2.35, C.gold);
  stat(slide, "22年", "办学历史", 3.48, 2.1, 2.35, C.blue);
  stat(slide, "19年", "港澳台联考项目沉淀", 6.1, 2.1, 2.35, C.green);
  card(slide, 0.86, 3.48, 6.95, 1.55, { fill: C.white, bar: C.blue });
  text(slide, "奥斯翰外语学校成立于2004年，至今已有22年办学历史。其中，港澳台联考项目已走过19个春秋，是深圳民办高中里港澳台联考办学历史最悠久的学校。", 1.15, 3.78, 6.35, 0.58, { fontSize: 10.4, color: C.text });
  text(slide, "十九年来，我们见证了数千名港澳台学子从这里走向内地名校。一届又一届的沉淀，让我们对联考的考纲、命题规律、学生学情有了最深刻的理解。", 1.15, 4.43, 6.35, 0.38, { fontSize: 10.1, color: C.muted });
  quote(slide, "不是每一所学校都有19年的联考办学经验——我们有。", 1.02, 5.55, 10.9, 0.74);
}

function threeIndependents() {
  const slide = pptx.addSlide();
  base(slide, 3, "FEATURES");
  title(slide, "Features", "三个独立，打造深圳最专业的港澳台联考班", "办学特色——独立编班、独立教研、独立管理");
  text(slide, "奥斯翰港澳台联考班实行独立办学体系，不混班、不将就：", 0.82, 1.9, 8.0, 0.24, { fontSize: 11.5, color: C.text });
  const rows = [
    ["独立维度", "具体做法"],
    ["独立编班", "港澳台学生单独编班，不与普高混班，教学进度、难度、深度完全针对联考要求"],
    ["独立教研", "配备专属联考教研团队，每周三次教研，紧跟考纲变化"],
    ["独立管理", "专项副校长直接管理，教学、德育、升学全流程一体化"],
  ];
  miniTable(slide, rows, 0.86, 2.45, [2.2, 7.35], 0.72, { fontSize: 9.5 });
  image(slide, imgs.class1, 10.15, 2.45, 2.55, 2.88, 0);
  rect(slide, 10.15, 2.45, 2.55, 2.88, C.navy, { fillTransparency: 58, lineTransparency: 100 });
  quote(slide, "我们承诺：每一个联考班学生，享受的都是最纯粹的联考教学服务。", 1.12, 5.92, 10.95, 0.62);
}

function teachingResearch() {
  const slide = pptx.addSlide();
  base(slide, 4, "TEACHING MANAGEMENT");
  title(slide, "Teaching", "每周三次教研，用严谨打磨每一节课", "教学管理——三备三研教研体系");
  text(slide, "我们的教学成绩，不是靠压榨学生压出来的，是老师们在教研上下足了功夫磨出来的。", 0.82, 1.92, 10.2, 0.26, { fontSize: 11, color: C.text });
  const steps = [
    ["第一研", "个人自研", "教师独立研究教材和考纲，形成初案"],
    ["第二研", "集体教研", "同科组教师集体碰撞，共享经验，统一核心教学标准"],
    ["第三研", "班级终研", "根据本班学情进行个性化调整，形成终案"],
  ];
  steps.forEach((s, i) => {
    const x = 0.85 + i * 4.1;
    card(slide, x, 2.55, 3.35, 1.55, { fill: i === 1 ? C.pale : C.white, bar: i === 2 ? C.gold : C.blue });
    text(slide, s[0], x + 0.25, 2.84, 0.9, 0.22, { fontFace: AFONT, fontSize: 12, bold: true, color: i === 2 ? C.gold : C.blue });
    text(slide, s[1], x + 1.15, 2.82, 1.6, 0.24, { fontSize: 13, bold: true, color: C.navy });
    text(slide, s[2], x + 0.25, 3.34, 2.75, 0.4, { fontSize: 9.2, color: C.muted });
    if (i < 2) line(slide, x + 3.46, 3.32, 0.42, 0, { color: C.blue, width: 2, endArrowType: "triangle" });
  });
  card(slide, 0.9, 4.78, 11.48, 0.8, { fill: C.white, bar: C.gold });
  text(slide, "教研时间： 每周二、周四下午各科组自行组织备课，周五下午全校集体教研，雷打不动。", 1.2, 5.05, 10.7, 0.22, { fontSize: 10.5, color: C.text });
  quote(slide, "我们认为：老师多研一课，学生少走一步弯路。", 1.42, 6.05, 10.0, 0.55);
}

function teachers() {
  const slide = pptx.addSlide();
  base(slide, 5, "FACULTY");
  title(slide, "Faculty", "十年以上联考教龄，把经验变成学生的分数", "师资介绍——平均10年以上联考教学经验");
  image(slide, imgs.group, 0.75, 1.9, 4.7, 4.45, 0);
  rect(slide, 0.75, 1.9, 4.7, 4.45, C.navy, { fillTransparency: 60, lineTransparency: 100 });
  text(slide, "奥斯翰港澳台联考班的教师团队，不是临时拼凑的，而是一支长期稳定、经验丰富的“联考专修队”。", 5.92, 1.98, 6.35, 0.42, { fontSize: 11.2, color: C.text });
  const points = [
    ["平均教龄", "10年以上港澳台联考教学经验"],
    ["教学成果", "多位教师所带学生考入清华、北大、复旦、交大、中山等名校"],
    ["稳定团队", "核心教师在校任职均超过5年，不存在频繁更换"],
  ];
  points.forEach((p, i) => {
    card(slide, 5.95, 2.75 + i * 0.95, 5.9, 0.68, { fill: i % 2 ? C.pale : C.white, bar: i === 0 ? C.gold : C.blue });
    text(slide, p[0], 6.22, 2.98 + i * 0.95, 1.25, 0.18, { fontSize: 11, bold: true, color: C.navy });
    text(slide, p[1], 7.6, 2.94 + i * 0.95, 3.75, 0.24, { fontSize: 9.4, color: C.muted });
  });
  text(slide, "（此处插入师资名录表格，含姓名、科目、教龄、联考教学年限、过往教学成绩）", 6.0, 5.72, 5.85, 0.22, { fontSize: 8.4, color: C.muted });
  quote(slide, "一句话：把孩子的联考，交给最懂联考的人。", 6.0, 6.1, 5.7, 0.55);
}

function examServices() {
  const slide = pptx.addSlide();
  base(slide, 6, "EXAM SERVICE");
  title(slide, "Service", "一站式考务服务 + 多元升学路径", "考务服务与升学规划——从报名到录取，全程无忧");
  card(slide, 0.82, 1.9, 4.65, 3.88, { fill: C.white, bar: C.blue });
  text(slide, "考务服务：", 1.12, 2.18, 1.3, 0.22, { fontSize: 14, bold: true, color: C.navy });
  bulletList(slide, [
    "港澳台身份材料预审与指导",
    "证件有效期提醒与续期协助",
    "联考报名全流程代办",
    "考场接送与考前心理辅导",
  ], 1.2, 2.72, 3.55, 1.32, { fontSize: 10.5, paraSpaceAfterPt: 7 });
  text(slide, "升学规划（多元路径）：", 1.12, 4.55, 2.2, 0.22, { fontSize: 12.5, bold: true, color: C.navy });
  text(slide, "很多家长不知道，港澳台学生不仅有“全国联考”一条路。奥斯翰为每位学生提供一对一的升学规划服务，帮助学生找到最适合的升学路径：", 1.2, 4.9, 3.55, 0.46, { fontSize: 8.8, color: C.muted });
  const rows = [
    ["考试名称", "适合对象", "目标院校"],
    ["全国联考", "全体港澳台学生", "内地300+所本科院校（含985/211）"],
    ["两校联考", "全体港澳台学生", "暨南大学、华侨大学"],
    ["四校联考", "澳门籍学生", "澳门大学、澳门理工、澳门旅游、澳门科技大学"],
  ];
  miniTable(slide, rows, 6.0, 2.12, [1.45, 1.88, 3.98], 0.74, { fontSize: 8.5 });
  image(slide, imgs.graduation, 6.0, 5.36, 6.6, 1.05, 0);
  rect(slide, 6.0, 5.36, 6.6, 1.05, C.navy, { fillTransparency: 55, lineTransparency: 100 });
}

function pathwayDetails() {
  const slide = pptx.addSlide();
  base(slide, 7, "PATHWAY PLANNING");
  title(slide, "Planning", "不让任何一个学生因为“不知道”而错过更好的升学机会", "两校联考 / 四校联考 / 一人一档升学保障");
  const blocks = [
    ["什么是两校联考？", "两校联考是暨南大学和华侨大学联合举办的单独招生考试，与全国联考不冲突，学生可以同时参加。两校联考的考试科目更少、难度相对较低，是港澳台学生的“保底优选”。2025年，两校联考报考人数首次突破1万人，暨大本科录取线380分，华侨大学低至330分。"],
    ["什么是四校联考？", "四校联考是澳门大学、澳门理工、澳门旅游学院、澳门科技大学四所高校联合举办的招生考试，主要面向澳门籍学生。考试科目少、竞争压力小，是澳门籍学生的升学捷径。"],
  ];
  blocks.forEach((b, i) => {
    card(slide, 0.85, 1.95 + i * 1.58, 6.15, 1.22, { fill: i === 1 ? C.pale : C.white, bar: i === 0 ? C.blue : C.gold });
    text(slide, b[0], 1.14, 2.2 + i * 1.58, 2.0, 0.22, { fontSize: 12.2, bold: true, color: C.navy });
    text(slide, b[1], 1.14, 2.58 + i * 1.58, 5.55, 0.42, { fontSize: 8.5, color: C.muted });
  });
  card(slide, 7.55, 1.95, 4.75, 2.82, { fill: C.white, bar: C.green });
  text(slide, "奥斯翰的升学保障：", 7.9, 2.28, 2.0, 0.22, { fontSize: 13.2, bold: true, color: C.navy });
  bulletList(slide, [
    "为每位学生建立“一人一档”的升学规划方案",
    "志愿填报一对一指导，院校专业深度解读",
    "面试辅导、文书指导全覆盖",
  ], 8.05, 2.82, 3.55, 0.94, { fontSize: 9.7, paraSpaceAfterPt: 6 });
  quote(slide, "我们的承诺：不让任何一个学生因为“不知道”而错过更好的升学机会。", 1.1, 5.55, 10.9, 0.72);
}

function aiSystem() {
  const slide = pptx.addSlide();
  base(slide, 8, "AI TEACHING SYSTEM");
  title(slide, "AI System", "AI赋能教学，让老师更懂学生，让学生更懂自己", "AI教学管理系统——精准教学，让每一次努力都有方向");
  text(slide, "奥斯翰全面引入AI教学管理系统，用科技为教学赋能。", 0.86, 1.88, 8.0, 0.24, { fontSize: 11.2, color: C.text });
  const rows = [
    ["功能模块", "对学生", "对老师"],
    ["学情分析", "实时了解自己的薄弱点，知道下一步学什么", "精准定位班级共性问题，调整教学重点"],
    ["分层作业", "作业不是全班一样，而是根据你的基础、你的需求精准布置", "一键生成分层作业，A层练综合、B层练基础"],
    ["错题本", "自动生成专属错题本，举一反三推送同类题", "减少重复劳动，聚焦关键问题"],
    ["学习报告", "每周自动生成学情报告，进步看得见", "家长沟通有理有据，精准反馈"],
  ];
  miniTable(slide, rows, 0.86, 2.35, [1.45, 4.75, 4.75], 0.64, { fontSize: 7.9 });
  quote(slide, "老师说：AI帮我省下批改作业的时间，我把这些时间全部还给了学生。", 1.2, 6.15, 10.65, 0.52);
}

function eveningStudy() {
  const slide = pptx.addSlide();
  base(slide, 9, "EVENING STUDY");
  title(slide, "Daily Close", "晚自习不是“自习”，是“解决问题的时间”", "晚自习管理——日日结，不让问题过夜");
  image(slide, imgs.class1, 0.78, 1.9, 4.85, 4.58, 0);
  rect(slide, 0.78, 1.9, 4.85, 4.58, C.navy, { fillTransparency: 58, lineTransparency: 100 });
  text(slide, "很多学校的晚自习，只是布置作业、学生自己做、做完就下课。但奥斯翰的晚自习，完全不同。", 6.05, 1.94, 5.9, 0.38, { fontSize: 10.8, color: C.text });
  card(slide, 6.05, 2.65, 5.9, 2.34, { fill: C.white, bar: C.blue });
  text(slide, "我们的做法：", 6.35, 2.92, 1.5, 0.22, { fontSize: 13, bold: true, color: C.navy });
  bulletList(slide, [
    "全科老师轮流值守晚自习",
    "不是被动等学生来问，而是主动找到没有完成任务的学生",
    "每一位学生，当天的知识当天过关，当天的问题当天解决",
    "老师根据当天的作业和测试情况，锁定“今日未达标学生”，人盯人辅导",
  ], 6.45, 3.35, 4.8, 1.08, { fontSize: 8.9, paraSpaceAfterPt: 4 });
  quote(slide, "我们不追求作业做完，我们追求的是——每一个知识点，今天真的懂了。", 6.05, 5.55, 5.75, 0.58);
}

function studyTrip() {
  const slide = pptx.addSlide();
  base(slide, 10, "MORAL EDUCATION");
  title(slide, "Study Trip", "从“逼着学”到“我要学”，只差一次“看见未来”的距离", "德育与研学——走进未来，激发原动力");
  image(slide, imgs.activity, 7.55, 1.9, 4.85, 4.58, 0);
  rect(slide, 7.55, 1.9, 4.85, 4.58, C.navy, { fillTransparency: 58, lineTransparency: 100 });
  text(slide, "奥斯翰每学期组织研学活动，带领学生走进高薪企业、走进高校校园。", 0.88, 1.92, 6.0, 0.26, { fontSize: 10.8, color: C.text });
  card(slide, 0.88, 2.45, 5.85, 1.28, { fill: C.white, bar: C.gold });
  text(slide, "我们的学生去过：", 1.16, 2.75, 1.65, 0.2, { fontSize: 12, bold: true, color: C.navy });
  bulletList(slide, [
    "华为、腾讯、大疆等深圳名企",
    "清华、北大、港中大（深圳）等知名高校",
    "科技园区、实验室、创业孵化器",
  ], 3.0, 2.62, 3.05, 0.62, { fontSize: 8.8, paraSpaceAfterPt: 2 });
  card(slide, 0.88, 4.15, 5.85, 1.52, { fill: C.pale, bar: C.blue });
  text(slide, "研学的意义：", 1.16, 4.42, 1.45, 0.2, { fontSize: 12, bold: true, color: C.navy });
  text(slide, "只有当学生亲眼看见“我的未来长什么样”，他们才会真正产生内驱力。从“老师逼我学”到“我自己想学”，从“陪他们学”到“帮他们学”，我们希望培养的不是只会考试的学生，而是有目标、有方向、有动力的年轻人。", 2.7, 4.32, 3.55, 0.74, { fontSize: 8.0, color: C.muted });
  quote(slide, "我们相信：看得见摸得着的梦想，才能真正推动他们前进。", 1.1, 6.22, 5.4, 0.48);
}

function results() {
  const slide = pptx.addSlide();
  base(slide, 11, "RESULTS");
  title(slide, "Results", "用成绩说话", "办学成绩（待补充数据）");
  image(slide, imgs.graduation, 0, 1.78, W, 2.65, 0);
  rect(slide, 0, 1.78, W, 2.65, C.navy, { fillTransparency: 66, lineTransparency: 100 });
  card(slide, 1.35, 4.85, 10.65, 1.18, { fill: C.white, bar: C.gold });
  text(slide, "（此处待补充具体数据，建议包含以下内容：）", 1.66, 5.13, 3.4, 0.2, { fontSize: 11.5, bold: true, color: C.navy });
  bulletList(slide, [
    "历年最高分/平均分",
    "本科上线率/重本上线率",
    "985/211录取率",
    "优秀学生录取案例（学校+专业+分数）",
    "（可附往届学生录取通知书照片、家长感谢信截图等）",
  ], 5.15, 5.0, 5.95, 0.66, { fontSize: 8.7, paraSpaceAfterPt: 2 });
}

function admissions() {
  const slide = pptx.addSlide();
  base(slide, 12, "ADMISSIONS");
  title(slide, "Admissions", "加入奥斯翰，让梦想起航", "招生信息");
  card(slide, 0.9, 2.0, 6.2, 3.68, { fill: C.white, bar: C.blue });
  const topRows = [
    ["招生对象：", "具有港澳台身份的学生（高一、高二、高三）"],
    ["招生人数：", "高一XX人，高二XX人，高三XX人"],
  ];
  topRows.forEach((r, i) => {
    const y = 2.35 + i * 0.58;
    text(slide, r[0], 1.25, y, 1.2, 0.18, { fontSize: 10.2, bold: true, color: C.navy });
    text(slide, r[1], 2.45, y, 3.8, 0.24, { fontSize: 9.6, color: C.muted });
  });
  rect(slide, 1.18, 3.54, 5.35, 0.06, C.line, { lineTransparency: 100 });
  text(slide, "报名方式：", 1.25, 3.82, 1.1, 0.18, { fontSize: 10.2, bold: true, color: C.navy });
  const contactRows = [
    ["电话咨询：", "XXX-XXXX-XXXX"],
    ["现场咨询：", "深圳市XXX区XXX路奥斯翰外语学校招生办"],
    ["开放日安排：", "每周六上午9:00-12:00，欢迎家长携学生来校参观咨询"],
  ];
  contactRows.forEach((r, i) => {
    const y = 4.18 + i * 0.48;
    text(slide, r[0], 1.25, y, 1.2, 0.18, { fontSize: 9.8, bold: true, color: C.navy });
    text(slide, r[1], 2.45, y, 3.85, 0.22, { fontSize: 9.0, color: C.muted });
  });
  card(slide, 8.1, 2.0, 3.05, 3.68, { fill: C.pale, bar: C.gold });
  if (fs.existsSync(imgs.qr)) slide.addImage({ path: imgs.qr, x: 8.72, y: 2.45, w: 1.85, h: 1.85 });
  text(slide, "扫码预约开放日（二维码）", 8.55, 4.55, 2.1, 0.22, { fontSize: 10.5, bold: true, color: C.navy, align: "center" });
  quote(slide, "奥斯翰外语学校 · 港澳台联考班", 1.15, 6.22, 10.9, 0.52);
}

cover();
history();
threeIndependents();
teachingResearch();
teachers();
examServices();
pathwayDetails();
aiSystem();
eveningStudy();
studyTrip();
results();
admissions();

await pptx.writeFile({ fileName: outPath });
console.log(outPath);
