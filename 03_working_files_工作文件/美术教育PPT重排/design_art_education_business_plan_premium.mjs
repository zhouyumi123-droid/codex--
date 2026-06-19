import fs from "fs";
import path from "path";
import pptxgen from "pptxgenjs";

const root = process.cwd();
const workDir = path.join(root, "03_working_files_工作文件", "美术教育PPT重排");
const outDir = path.join(root, "04_outputs_输出结果", "美术教育商业计划书重排");
fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "美术教育商业计划书_高级蓝白商务设计版.pptx");
const imgDir = path.join(workDir, "web_images");
const images = {
  canvas: path.join(imgDir, "art_class_canvas.jpg"),
  teacher: path.join(imgDir, "teacher_student_studio.jpg"),
  studio: path.join(imgDir, "women_paint_studio.jpg"),
};

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Codex";
pptx.company = "沐清学堂";
pptx.subject = "美术教育商业计划书高级蓝白商务设计版";
pptx.title = "美术教育商业计划书";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  lang: "zh-CN",
};

const W = 13.333;
const H = 7.5;
const C = {
  bg: "F7FAFD",
  white: "FFFFFF",
  navy: "0B1F36",
  navy2: "143A5A",
  blue: "1E5B8C",
  sky: "DCECF7",
  pale: "EEF6FB",
  line: "D6E2EC",
  text: "172033",
  muted: "66788A",
  gold: "B58A35",
  green: "1F7A6D",
  orange: "C9782D",
  red: "B94646",
};

const FONT = "Microsoft YaHei";
const AFONT = "Arial";

function addText(slide, text, x, y, w, h, opt = {}) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: opt.fontFace || FONT,
    fontSize: opt.fontSize ?? 12,
    bold: opt.bold || false,
    color: opt.color || C.text,
    align: opt.align || "left",
    valign: opt.valign || "top",
    margin: opt.margin ?? 0.04,
    fit: opt.fit || "shrink",
    breakLine: false,
    paraSpaceAfterPt: opt.paraSpaceAfterPt ?? 3,
    bullet: opt.bullet,
    lineSpacingMultiple: opt.lineSpacingMultiple,
    rotate: opt.rotate,
    transparency: opt.transparency,
  });
}

function shape(slide, type, x, y, w, h, fill, line = {}) {
  slide.addShape(type, {
    x,
    y,
    w,
    h,
    fill: fill ? { color: fill, transparency: line.fillTransparency } : { transparency: 100 },
    line: {
      color: line.color || fill || C.line,
      width: line.width ?? 0.6,
      transparency: line.transparency ?? 0,
      dash: line.dash,
      beginArrowType: line.beginArrowType,
      endArrowType: line.endArrowType,
    },
    radius: line.radius,
    rotate: line.rotate,
  });
}

function rect(slide, x, y, w, h, fill, opt = {}) {
  shape(slide, pptx.ShapeType.rect, x, y, w, h, fill, opt);
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
      beginArrowType: opt.beginArrowType,
      endArrowType: opt.endArrowType,
      dash: opt.dash,
    },
  });
}

function addImage(slide, file, x, y, w, h, transparency = 0) {
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

function base(slide, n, section = "MUQING ART EDUCATION") {
  slide.background = { color: C.bg };
  rect(slide, 0, 0, W, H, C.bg, { transparency: 100 });
  rect(slide, 0, 0, W, 0.16, C.navy, { transparency: 100 });
  addText(slide, section, 0.55, 7.05, 3.6, 0.18, {
    fontFace: AFONT,
    fontSize: 6.8,
    color: "8291A0",
    bold: true,
  });
  addText(slide, String(n).padStart(2, "0"), 12.15, 6.98, 0.55, 0.2, {
    fontFace: AFONT,
    fontSize: 8,
    color: "8291A0",
    bold: true,
    align: "right",
  });
}

function title(slide, section, heading, sub = "") {
  addText(slide, section.toUpperCase(), 0.65, 0.62, 3.5, 0.2, {
    fontFace: AFONT,
    fontSize: 7.5,
    bold: true,
    color: C.gold,
  });
  addText(slide, heading, 0.65, 0.9, 8.3, 0.5, {
    fontSize: 24,
    bold: true,
    color: C.navy,
  });
  if (sub) {
    addText(slide, sub, 0.66, 1.4, 8.4, 0.22, {
      fontSize: 9.5,
      color: C.muted,
    });
  }
  line(slide, 0.65, sub ? 1.72 : 1.55, 11.95, 0, { color: C.line, width: 0.8 });
}

function card(slide, x, y, w, h, opt = {}) {
  rect(slide, x, y, w, h, opt.fill || C.white, {
    color: opt.line || C.line,
    width: opt.lineWidth ?? 0.6,
    transparency: opt.lineTransparency ?? 0,
  });
  if (opt.bar) rect(slide, x, y, 0.06, h, opt.bar, { transparency: 100 });
}

function pill(slide, text, x, y, w, h, fill = C.pale, color = C.blue) {
  rect(slide, x, y, w, h, fill, { color: fill, transparency: 100 });
  addText(slide, text, x + 0.12, y + 0.07, w - 0.24, h - 0.06, {
    fontSize: 9,
    bold: true,
    color,
    align: "center",
  });
}

function bigNumber(slide, value, label, x, y, w, h, accent = C.blue) {
  card(slide, x, y, w, h, { fill: C.white, bar: accent });
  addText(slide, value, x + 0.28, y + 0.25, w - 0.42, 0.48, {
    fontFace: AFONT,
    fontSize: 24,
    bold: true,
    color: C.navy,
  });
  addText(slide, label, x + 0.28, y + 0.84, w - 0.42, 0.42, {
    fontSize: 10.5,
    color: C.muted,
    lineSpacingMultiple: 0.9,
  });
}

function bullets(slide, items, x, y, w, h, opt = {}) {
  const runs = [];
  items.forEach((item, idx) => {
    runs.push({ text: item, options: { bullet: { type: "ul" }, breakLine: idx < items.length - 1 } });
  });
  slide.addText(runs, {
    x,
    y,
    w,
    h,
    fontFace: FONT,
    fontSize: opt.fontSize ?? 11,
    color: opt.color || C.text,
    margin: opt.margin ?? 0.05,
    fit: "shrink",
    paraSpaceAfterPt: opt.paraSpaceAfterPt ?? 7,
    breakLine: false,
  });
}

function node(slide, label, desc, x, y, w, h, fill = C.white, accent = C.blue) {
  card(slide, x, y, w, h, { fill, line: C.line });
  rect(slide, x, y, w, 0.11, accent, { transparency: 100 });
  addText(slide, label, x + 0.18, y + 0.28, w - 0.36, 0.22, { fontSize: 12, bold: true, color: C.navy });
  addText(slide, desc, x + 0.18, y + 0.62, w - 0.36, h - 0.74, { fontSize: 9.2, color: C.muted, lineSpacingMultiple: 0.9 });
}

function sectionSlide(n, section, cn, en, summary) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  rect(slide, 0, 0, W, H, C.navy, { transparency: 100 });
  rect(slide, 8.7, 0, 4.63, H, C.navy2, { transparency: 100 });
  rect(slide, 0.75, 0.75, 0.08, 5.95, C.gold, { transparency: 100 });
  addText(slide, String(n).padStart(2, "0"), 1.12, 1.03, 1.1, 0.34, { fontFace: AFONT, fontSize: 18, bold: true, color: C.gold });
  addText(slide, en.toUpperCase(), 1.12, 1.48, 5.2, 0.26, { fontFace: AFONT, fontSize: 9, bold: true, color: "B8C7D6" });
  addText(slide, cn, 1.1, 2.35, 5.6, 0.62, { fontSize: 31, bold: true, color: C.white });
  addText(slide, summary, 1.12, 3.35, 5.5, 0.58, { fontSize: 13, color: "DDE8F1", lineSpacingMultiple: 0.9 });
  ["市场验证", "模型设计", "组织交付", "财务测算"].forEach((t, i) => {
    pill(slide, t, 9.35, 1.3 + i * 1.12, 2.25, 0.45, i % 2 ? C.sky : C.white, C.navy);
  });
}

function cover() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  addImage(slide, images.canvas, 6.8, 0, 6.533, H, 18);
  rect(slide, 6.8, 0, 6.533, H, C.navy, { fillTransparency: 28, transparency: 100 });
  rect(slide, 0, 0, 7.25, H, C.navy, { transparency: 100 });
  rect(slide, 0.72, 0.72, 0.08, 5.85, C.gold, { transparency: 100 });
  addText(slide, "MUQING ART EDUCATION", 1.05, 0.92, 4.2, 0.22, { fontFace: AFONT, fontSize: 9, color: C.gold, bold: true });
  addText(slide, "沐清学堂", 1.05, 2.02, 4.4, 0.55, { fontSize: 28, color: C.white, bold: true });
  addText(slide, "美术教育商业计划书", 1.05, 2.85, 5.65, 0.68, { fontSize: 31, color: C.white, bold: true });
  addText(slide, "以录取为终点的美术艺考全科服务机构", 1.08, 3.85, 5.2, 0.3, { fontSize: 13, color: "DDE8F1" });
  line(slide, 1.08, 4.38, 2.1, 0, { color: C.gold, width: 3 });
  ["专业教学", "文化课辅导", "升学规划", "封闭园区管理"].forEach((t, i) => {
    pill(slide, t, 1.08 + i * 1.28, 4.78, 1.12, 0.42, i === 0 ? C.gold : "244765", i === 0 ? C.white : "EAF3FA");
  });
  addText(slide, "2026 BUSINESS PLAN", 10.4, 6.82, 1.7, 0.22, { fontFace: AFONT, fontSize: 8.5, color: C.white, bold: true, align: "right" });
}

function agenda() {
  const slide = pptx.addSlide();
  base(slide, 2, "CONTENTS");
  title(slide, "Contents", "目录", "从市场机会到商业模型，再到落地运营与财务测算。");
  const groups = [
    ["01", "项目概况", "市场特征 / 目标市场 / 市场规模 / 痛点 / 定位"],
    ["02", "商业模式", "线上IP引流 / 线下门店承接 / B端渠道 / 集训校区"],
    ["03", "业务产品", "生源漏斗 / 全学段培养 / 初高中阶段业务"],
    ["04", "定价策略", "价格原则 / 课程价格 / 优惠机制 / 盈利逻辑"],
    ["05", "组织架构", "部门设计 / 岗位职责 / 人员中心"],
    ["06", "运营计划", "三年目标 / 12个月节奏 / 财务预测 / 风险预案"],
  ];
  groups.forEach((g, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.78 + col * 4.05;
    const y = 2.05 + row * 2.0;
    card(slide, x, y, 3.55, 1.42, { fill: C.white, bar: i % 2 ? C.blue : C.gold });
    addText(slide, g[0], x + 0.28, y + 0.24, 0.58, 0.35, { fontFace: AFONT, fontSize: 15, bold: true, color: i % 2 ? C.blue : C.gold });
    addText(slide, g[1], x + 0.95, y + 0.25, 2.1, 0.3, { fontSize: 15, bold: true, color: C.navy });
    addText(slide, g[2], x + 0.95, y + 0.68, 2.26, 0.46, { fontSize: 8.7, color: C.muted, lineSpacingMultiple: 0.9 });
  });
}

function executiveSummary() {
  const slide = pptx.addSlide();
  base(slide, 3, "EXECUTIVE SUMMARY");
  title(slide, "Executive Summary", "项目核心判断", "在艺考人数下行背景下，行业从粗放招生转向产品、规划与交付体验竞争。");
  addImage(slide, images.teacher, 8.55, 1.85, 3.95, 4.55, 0);
  rect(slide, 8.55, 1.85, 3.95, 4.55, C.navy, { fillTransparency: 42, transparency: 100 });
  const points = [
    ["市场仍有体量", "深圳初高中美术培训市场合计约7亿元，5年目标为10%-15%市场占有率。"],
    ["机会来自升级", "家长不只买专业课，更买文化专业闭环、升学规划确定性和高标准交付环境。"],
    ["模型可复制", "线上IP负责获客，门店负责转化，B端渠道锁量，集训校区完成最终交付。"],
  ];
  points.forEach((p, i) => {
    node(slide, p[0], p[1], 0.82, 2.0 + i * 1.25, 6.95, 0.92, i === 1 ? C.pale : C.white, i === 1 ? C.gold : C.blue);
  });
}

function marketFeature() {
  const slide = pptx.addSlide();
  base(slide, 4, "PROJECT OVERVIEW");
  title(slide, "Market", "艺考市场进入精细化竞争", "2025年深圳美术艺考人数减少，但家长对确定性、规划和交付标准的要求更高。");
  bigNumber(slide, "2.8万", "2025年美术艺考人数", 0.82, 2.0, 2.8, 1.35, C.blue);
  bigNumber(slide, "-2000", "较2024年减少人数", 3.95, 2.0, 2.8, 1.35, C.orange);
  bigNumber(slide, "-6%", "人数降幅", 7.08, 2.0, 2.8, 1.35, C.red);
  card(slide, 0.82, 4.0, 11.65, 1.52, { fill: C.white, bar: C.gold });
  addText(slide, "关键结论", 1.12, 4.32, 1.25, 0.26, { fontSize: 14, bold: true, color: C.navy });
  bullets(slide, [
    "人数下降并不意味着需求消失，而是低标准、低规划能力的机构被淘汰。",
    "后续竞争重心从单一专业教学转向“文化课 + 专业课 + 升学规划 + 管理体验”的综合服务。",
    "高端硬件与可量化规划将成为家长筛选机构的重要信号。",
  ], 2.55, 4.18, 8.95, 0.98, { fontSize: 10.2, paraSpaceAfterPt: 5 });
}

function targetMarket() {
  const slide = pptx.addSlide();
  base(slide, 5, "PROJECT OVERVIEW");
  title(slide, "Target Market", "目标市场：六年长周期生源经营", "以初中提前锁定生源池，以高中阶段完成专业化冲刺与升学交付。");
  const stages = [
    ["初一至初三", "前置培养 / 兴趣筛选 / 低龄续费", "利润中心 + 高中部蓄水池"],
    ["高一至高三", "方向明确 / 集训冲刺 / 志愿规划", "渠道生 + 初中部生 + 散生"],
  ];
  stages.forEach((s, i) => {
    const x = i === 0 ? 0.9 : 7.0;
    card(slide, x, 2.0, 4.9, 3.6, { fill: i === 0 ? C.white : C.pale, bar: i === 0 ? C.blue : C.gold });
    addText(slide, s[0], x + 0.35, 2.35, 2.6, 0.38, { fontSize: 22, bold: true, color: C.navy });
    addText(slide, s[1], x + 0.35, 3.05, 3.9, 0.32, { fontSize: 13, bold: true, color: i === 0 ? C.blue : C.gold });
    addText(slide, s[2], x + 0.35, 3.75, 3.75, 0.48, { fontSize: 12, color: C.muted, lineSpacingMultiple: 0.9 });
    rect(slide, x + 0.35, 4.65, 3.85, 0.18, i === 0 ? C.sky : "E6D9BC", { transparency: 100 });
  });
  line(slide, 5.95, 3.8, 0.65, 0, { color: C.blue, width: 2.5, endArrowType: "triangle" });
  addText(slide, "6年培养周期", 5.75, 3.25, 1.15, 0.22, { fontSize: 10, bold: true, color: C.blue, align: "center" });
}

function marketSize() {
  const slide = pptx.addSlide();
  base(slide, 6, "PROJECT OVERVIEW");
  title(slide, "Market Size", "市场规模与占有率目标", "深圳初高中美术培训市场约7亿元，五年目标进入第一梯队。");
  const data = [
    ["初中市场", "约4亿元", C.blue],
    ["高中市场", "约3.5亿元", C.green],
    ["合计市场", "约7亿元", C.gold],
    ["5年目标", "10%-15%", C.orange],
  ];
  data.forEach((d, i) => {
    const x = 0.75 + i * 3.08;
    bigNumber(slide, d[1], d[0], x, 2.05, 2.55, 1.45, d[2]);
  });
  card(slide, 1.0, 4.35, 11.15, 1.2, { fill: C.white });
  addText(slide, "市场进入逻辑", 1.32, 4.68, 1.7, 0.26, { fontSize: 14, bold: true, color: C.navy });
  addText(slide, "先用标准化门店模型和B端渠道建立稳定生源，再通过名师IP矩阵降低获客成本，最后用集训校区和升学结果放大品牌势能。", 3.15, 4.63, 8.3, 0.38, { fontSize: 12, color: C.text });
}

function painPoints() {
  const slide = pptx.addSlide();
  base(slide, 7, "PROJECT OVERVIEW");
  title(slide, "Pain Points", "行业痛点与项目破局点", "痛点不是单点课程能力，而是教学、规划、管理与体验的系统短板。");
  const rows = [
    ["专业与文化割裂", "学生常在专业课、文化课之间反复切换，进度和目标缺乏统一调度。", "文化专业闭环"],
    ["规划依赖经验", "院校定位、联考校考节奏、志愿选择依赖老师个人经验，家长缺少数据化依据。", "数据化升学规划"],
    ["硬件参差不齐", "学习环境、住宿管理、作品展示与集训体验不稳定，影响高端家长信任。", "顶级硬件体验"],
  ];
  rows.forEach((r, i) => {
    const y = 2.0 + i * 1.25;
    card(slide, 0.82, y, 11.7, 0.92, { fill: i % 2 ? C.pale : C.white, bar: i === 1 ? C.gold : C.blue });
    addText(slide, r[0], 1.12, y + 0.23, 2.1, 0.3, { fontSize: 14, bold: true, color: C.navy });
    addText(slide, r[1], 3.45, y + 0.18, 5.0, 0.38, { fontSize: 9.7, color: C.muted });
    pill(slide, r[2], 9.25, y + 0.24, 2.05, 0.38, i === 1 ? "F1E8D5" : C.sky, i === 1 ? C.gold : C.blue);
  });
}

function positioning() {
  const slide = pptx.addSlide();
  base(slide, 8, "PROJECT OVERVIEW");
  title(slide, "Positioning", "项目定位：以录取为终点", "深圳首家配套高标准硬件的美术艺考全科服务机构。");
  addImage(slide, images.studio, 0.75, 1.85, 5.15, 4.6, 0);
  rect(slide, 0.75, 1.85, 5.15, 4.6, C.navy, { fillTransparency: 52, transparency: 100 });
  addText(slide, "专业教学 + 文化课辅导 + 升学规划 + 封闭式园区管理", 1.15, 5.68, 4.25, 0.36, { fontSize: 12.5, bold: true, color: C.white, align: "center" });
  const items = [
    ["录取导向", "以终局录取结果倒推学习路径、课程安排和阶段考核。"],
    ["全科服务", "把专业、文化、规划与管理放到同一个交付体系内。"],
    ["高端体验", "用硬件环境与标准化管理增强家长信任和溢价空间。"],
  ];
  items.forEach((it, i) => node(slide, it[0], it[1], 6.35, 2.0 + i * 1.27, 5.35, 0.94, i === 1 ? C.pale : C.white, i === 1 ? C.gold : C.blue));
}

function swot() {
  const slide = pptx.addSlide();
  base(slide, 9, "PROJECT OVERVIEW");
  title(slide, "SWOT", "SWOT分析", "用优势建立高端定位，用渠道和IP降低获客不确定性。");
  const cells = [
    ["S 优势", ["清央核心师资，覆盖联考/校考", "文化专业闭环 + 11000㎡封闭园区", "行政资源、门店输血与名师IP矩阵"], C.blue],
    ["W 劣势", ["品牌从0到1冷启动", "首年渠道与标准化体系仍需建立", "门店扩张需要资金和管理能力"], C.orange],
    ["O 机会", ["艺考培训加速品牌化、规范化", "深圳普高录取率约52%，二类自招刚需强", "IP内容获客可形成差异化壁垒"], C.green],
    ["T 威胁", ["头部画室已有品牌与渠道优势", "艺考人数下降和政策变化风险", "竞品可能跟进文化课与规划服务"], C.red],
  ];
  cells.forEach((c, i) => {
    const x = i % 2 === 0 ? 0.9 : 6.75;
    const y = i < 2 ? 2.0 : 4.25;
    card(slide, x, y, 5.15, 1.55, { fill: C.white, bar: c[2] });
    addText(slide, c[0], x + 0.28, y + 0.23, 1.35, 0.25, { fontFace: AFONT, fontSize: 13, bold: true, color: c[2] });
    bullets(slide, c[1], x + 0.3, y + 0.65, 4.25, 0.56, { fontSize: 9.7, paraSpaceAfterPt: 3 });
  });
}

function sectionBusiness() {
  sectionSlide(10, "Business Model", "商业模式", "Business Model", "把获客、转化、渠道锁量和集训交付拆成可运营、可复制的四个模块。");
}

function modelOverview() {
  const slide = pptx.addSlide();
  base(slide, 11, "BUSINESS MODEL");
  title(slide, "Business Model", "商业模式总览", "线上IP引流 + 线下门店承接 + B端渠道锁量 + 集训校区交付。");
  const steps = [
    ["线上IP引流", "内容种草 / 咨询线索"],
    ["线下门店承接", "体验课 / 测评 / 转化"],
    ["B端渠道锁量", "学校 / 画室 / 机构合作"],
    ["集训校区交付", "封闭管理 / 录取结果"],
  ];
  steps.forEach((s, i) => {
    const x = 0.75 + i * 3.08;
    node(slide, s[0], s[1], x, 2.25, 2.42, 1.45, i % 2 ? C.pale : C.white, i === 0 || i === 3 ? C.gold : C.blue);
    if (i < 3) line(slide, x + 2.48, 2.98, 0.42, 0, { color: C.blue, width: 2, endArrowType: "triangle" });
  });
  card(slide, 1.05, 4.75, 10.95, 0.88, { fill: C.white, bar: C.gold });
  addText(slide, "模型本质", 1.35, 5.06, 1.3, 0.22, { fontSize: 13, bold: true, color: C.navy });
  addText(slide, "用内容资产降低单一投流依赖，用门店和渠道提升转化稳定性，用集训校区承接高客单价与最终结果。", 2.85, 5.0, 8.3, 0.3, { fontSize: 11.2, color: C.text });
}

function flywheel() {
  const slide = pptx.addSlide();
  base(slide, 12, "BUSINESS MODEL");
  title(slide, "Flywheel", "增长飞轮：内容、口碑与结果相互放大", "把每一次交付结果转化为下一轮获客素材和品牌信任。");
  const centerX = 6.65;
  const centerY = 3.95;
  rect(slide, centerX - 1.0, centerY - 0.42, 2.0, 0.84, C.navy, { transparency: 100 });
  addText(slide, "录取结果", centerX - 0.7, centerY - 0.14, 1.4, 0.22, { fontSize: 15, bold: true, color: C.white, align: "center" });
  const around = [
    ["IP内容", 2.25, 2.2, C.gold],
    ["咨询线索", 7.85, 2.2, C.blue],
    ["门店转化", 8.5, 5.1, C.green],
    ["集训交付", 2.0, 5.1, C.orange],
  ];
  around.forEach((a) => {
    card(slide, a[1], a[2], 2.55, 0.95, { fill: C.white, bar: a[3] });
    addText(slide, a[0], a[1] + 0.3, a[2] + 0.34, 1.9, 0.22, { fontSize: 14, bold: true, color: C.navy, align: "center" });
  });
  line(slide, 4.85, 2.65, 2.6, 0, { color: C.blue, width: 1.8, endArrowType: "triangle" });
  line(slide, 9.05, 3.28, 0, 1.4, { color: C.blue, width: 1.8, endArrowType: "triangle" });
  line(slide, 8.25, 5.55, -3.2, 0, { color: C.blue, width: 1.8, endArrowType: "triangle" });
  line(slide, 2.7, 4.88, 0, -1.45, { color: C.blue, width: 1.8, endArrowType: "triangle" });
  addText(slide, "内容持续曝光 -> 线索进入门店 -> 产品体验转化 -> 集训结果沉淀 -> 反哺IP内容", 1.35, 6.45, 10.55, 0.26, { fontSize: 11, color: C.muted, align: "center" });
}

function ipMatrix() {
  const slide = pptx.addSlide();
  base(slide, 13, "BUSINESS MODEL");
  title(slide, "IP Matrix", "名师IP矩阵：线上获客引擎", "以短视频、直播、案例拆解和升学知识内容构建持续线索来源。");
  const cols = [
    ["名师账号", "专业点评 / 作品示范 / 方法论"],
    ["升学账号", "政策解读 / 院校选择 / 志愿策略"],
    ["学员案例", "进步记录 / 录取故事 / 家长反馈"],
    ["校区账号", "硬件展示 / 日常管理 / 活动传播"],
  ];
  cols.forEach((c, i) => {
    node(slide, c[0], c[1], 0.75 + i * 3.05, 2.05, 2.5, 1.8, i % 2 ? C.pale : C.white, i === 1 ? C.gold : C.blue);
  });
  card(slide, 0.95, 4.7, 11.25, 0.95, { fill: C.white, bar: C.gold });
  addText(slide, "收益分配机制", 1.25, 5.03, 1.65, 0.22, { fontSize: 13, bold: true, color: C.navy });
  addText(slide, "将内容生产、线索归因、到店转化和课程成交拆开核算，激励名师持续输出，同时保证公司掌握线索资产。", 3.05, 4.96, 8.2, 0.34, { fontSize: 10.8, color: C.text });
}

function storeModel() {
  const slide = pptx.addSlide();
  base(slide, 14, "BUSINESS MODEL");
  title(slide, "Store Model", "四级门店经济模型", "用不同体量门店覆盖不同区域半径，实现低成本试点和高标准复制。");
  const levels = [
    ["一级旗舰", "800-1000㎡ / 400人次", "预算300万 / 2年1家"],
    ["二级核心", "300-500㎡ / 250人次", "预算150-170万 / 2年4家"],
    ["三级标准", "200㎡ / 150人次", "预算80-100万 / 2年5家"],
    ["四级合作", "合作进驻 / 50人次", "预算5万/点 / 2年10个"],
  ];
  levels.forEach((l, i) => {
    const x = 1.05 + i * 2.88;
    const h = 0.95 + i * 0.35;
    card(slide, x, 4.75 - h, 2.1, h, { fill: i % 2 ? C.pale : C.white, bar: i === 3 ? C.gold : C.blue });
    addText(slide, l[0], x + 0.2, 4.93 - h, 1.45, 0.22, { fontSize: 12, bold: true, color: i === 3 ? C.gold : C.blue });
    addText(slide, l[1], x + 0.2, 5.27 - h, 1.58, 0.32, { fontSize: 8.4, bold: true, color: C.navy });
    addText(slide, l[2], x + 0.2, 5.72 - h, 1.62, 0.34, { fontSize: 8.0, color: C.muted });
  });
  addText(slide, "一级门店模型：满负荷400人次，80%饱和度年营收约544万，年净利润约214万，回本周期约16.8个月。", 1.12, 5.95, 10.5, 0.28, { fontSize: 10.8, color: C.muted, align: "center" });
}

function channelDelivery() {
  const slide = pptx.addSlide();
  base(slide, 15, "BUSINESS MODEL");
  title(slide, "Channel & Delivery", "B端渠道与集训校区交付", "渠道负责批量生源，校区负责结果交付，两者共同提升规模效率。");
  addImage(slide, images.teacher, 0.78, 2.05, 4.55, 3.65, 0);
  rect(slide, 0.78, 2.05, 4.55, 3.65, C.navy, { fillTransparency: 55, transparency: 100 });
  node(slide, "B端渠道合作", "优先宝安、龙岗等二类自招人数多的高中；高一高二驻点教学，高三统一进入集训校区，合作成本按40%返费测算。", 5.9, 2.05, 5.7, 1.28, C.white, C.blue);
  node(slide, "集训校区交付", "封闭园区承接初三脱产、高一高二寒暑假、高三联考/校考与考后文化冲刺；食宿费3000元/月独立核算。", 5.9, 3.65, 5.7, 1.28, C.pale, C.gold);
  addText(slide, "规模化增长 = 渠道锁量 + 标准化交付 + 录取结果传播", 1.1, 6.05, 10.7, 0.28, { fontSize: 14, bold: true, color: C.navy, align: "center" });
}

function sectionProduct() {
  sectionSlide(16, "Product System", "业务产品", "Product System", "围绕学生成长阶段设计产品，不只卖单节课，而是卖完整升学路径。");
}

function sourceFunnel() {
  const slide = pptx.addSlide();
  base(slide, 17, "BUSINESS DESCRIPTION");
  title(slide, "Student Funnel", "生源孵化漏斗", "从低龄体验到高三集训，持续筛选、培养、转化和复购。");
  const funnel = [
    ["兴趣体验", "初中低龄体验课 / 活动课"],
    ["基础培养", "基础造型 / 审美 / 学习习惯"],
    ["方向确认", "艺考意向 / 院校目标 / 家长决策"],
    ["集训冲刺", "联考校考 / 文化协同 / 录取交付"],
  ];
  funnel.forEach((f, i) => {
    const w = 10.4 - i * 1.55;
    const x = (W - w) / 2;
    const y = 2.02 + i * 0.95;
    rect(slide, x, y, w, 0.66, i % 2 ? C.pale : C.white, { color: C.line });
    addText(slide, f[0], x + 0.3, y + 0.19, 1.5, 0.2, { fontSize: 12.5, bold: true, color: i === 3 ? C.gold : C.blue });
    addText(slide, f[1], x + 2.15, y + 0.18, w - 2.6, 0.22, { fontSize: 10.3, color: C.muted });
  });
  addText(slide, "越早进入体系，越能降低高中阶段获客成本，并提高最终集训转化率。", 1.4, 6.15, 10.5, 0.28, { fontSize: 11.5, color: C.navy, bold: true, align: "center" });
}

function productSystem() {
  const slide = pptx.addSlide();
  base(slide, 18, "BUSINESS DESCRIPTION");
  title(slide, "Full Stage", "全学段业务总览", "按学段拆分不同任务：衔接、培养、冲刺与录取。");
  const stages = [
    ["衔接阶段", "测评体验 / 家长咨询 / 学习规划"],
    ["初中阶段", "兴趣培养 / 基础课 / 小班长期班"],
    ["高中阶段", "专业集训 / 文化协同 / 志愿规划"],
  ];
  stages.forEach((s, i) => {
    node(slide, s[0], s[1], 0.9 + i * 3.95, 2.25, 3.15, 1.85, i === 1 ? C.pale : C.white, i === 2 ? C.gold : C.blue);
    if (i < 2) line(slide, 4.15 + i * 3.95, 3.15, 0.42, 0, { color: C.blue, width: 2, endArrowType: "triangle" });
  });
  card(slide, 1.05, 5.0, 10.95, 0.9, { fill: C.white, bar: C.gold });
  addText(slide, "产品设计原则", 1.36, 5.32, 1.7, 0.22, { fontSize: 13, bold: true, color: C.navy });
  addText(slide, "低龄产品重在长期留存，高中产品重在结果交付；两端通过测评、规划和家长沟通形成连续经营。", 3.08, 5.25, 8.1, 0.34, { fontSize: 10.8, color: C.text });
}

function juniorSeniorBusiness() {
  const slide = pptx.addSlide();
  base(slide, 19, "BUSINESS DESCRIPTION");
  title(slide, "Stage Business", "初中与高中阶段业务重点", "初中做利润和蓄水池，高中做高客单价与录取结果。");
  const items = [
    ["初中阶段", ["基础造型与审美训练", "兴趣培养和艺考认知", "长期续费与高中转化"], C.blue],
    ["高中阶段", ["专业方向与目标院校规划", "联考/校考集训冲刺", "文化课协同与志愿填报"], C.gold],
  ];
  items.forEach((it, i) => {
    const x = i === 0 ? 0.95 : 6.85;
    card(slide, x, 2.05, 5.0, 3.45, { fill: i === 0 ? C.white : C.pale, bar: it[2] });
    addText(slide, it[0], x + 0.36, 2.42, 2.0, 0.32, { fontSize: 20, bold: true, color: C.navy });
    bullets(slide, it[1], x + 0.55, 3.15, 3.85, 1.42, { fontSize: 11, paraSpaceAfterPt: 8 });
  });
}

function pricing() {
  const slide = pptx.addSlide();
  base(slide, 20, "PRICING STRATEGY");
  title(slide, "Pricing", "定价策略：高客单价来自结果与体验", "价格不是单课时计算，而是课程、规划、管理和环境的组合价值。");
  const principles = [
    ["价值定价", "围绕录取结果、升学规划和交付体验建立溢价。"],
    ["分层产品", "体验课、常规班、集训营、规划服务形成不同价格阶梯。"],
    ["优惠可控", "早鸟、团报、渠道合作等优惠必须服从现金流与毛利底线。"],
  ];
  principles.forEach((p, i) => node(slide, p[0], p[1], 0.85 + i * 4.0, 2.1, 3.15, 1.55, i === 1 ? C.pale : C.white, i === 2 ? C.gold : C.blue));
  card(slide, 1.0, 5.0, 11.1, 0.9, { fill: C.white, bar: C.gold });
  addText(slide, "定价底层逻辑", 1.3, 5.32, 1.7, 0.22, { fontSize: 13, bold: true, color: C.navy });
  addText(slide, "用高标准交付支撑高客单，用阶段产品降低首次决策门槛，用长期培养提高单生生命周期价值。", 3.08, 5.25, 8.2, 0.34, { fontSize: 10.8, color: C.text });
}

function pricingTable() {
  const slide = pptx.addSlide();
  base(slide, 21, "PRICING STRATEGY");
  title(slide, "Price Architecture", "价格结构示意", "保留原方案的分层思路，表达为更适合汇报的价格架构。");
  const rows = [
    ["高三联考集训", "70,000", "7-12月约5-6个月，不含食宿"],
    ["校考冲刺", "35,000", "12-2月约2-3个月"],
    ["联考+校考连报", "100,000", "打包价，比单报优惠5,000元"],
    ["高一高二周末课", "350/节", "单节3小时；学期包约10,000元"],
    ["初中年包", "15,000-20,000", "初一初二约45节，初三约60节"],
    ["短期食宿", "130/天", "低于市场150-200元/天"],
  ];
  rows.forEach((r, i) => {
    const y = 1.92 + i * 0.62;
    rect(slide, 0.95, y, 2.1, 0.58, i === 0 ? C.navy : C.white, { color: C.line });
    rect(slide, 3.05, y, 2.2, 0.58, i === 0 ? C.navy : C.pale, { color: C.line });
    rect(slide, 5.25, y, 6.55, 0.58, i === 0 ? C.navy : C.white, { color: C.line });
    addText(slide, r[0], 1.12, y + 0.17, 1.78, 0.18, { fontSize: 9.2, bold: true, color: i === 0 ? C.white : C.navy, align: "center" });
    addText(slide, r[1], 3.22, y + 0.17, 1.86, 0.18, { fontSize: 9.2, bold: true, color: i === 0 ? C.white : C.blue, align: "center" });
    addText(slide, r[2], 5.55, y + 0.16, 5.75, 0.2, { fontSize: 8.9, color: i === 0 ? C.white : C.muted });
  });
  addText(slide, "优惠策略：总折扣不超过15%；早鸟10%-15%，3人团8%、5人团11%、10人团15%，老带新新生减5%、老生返10%课时费。", 1.08, 5.95, 11.1, 0.34, { fontSize: 10.0, color: C.text, align: "center" });
}

function organization() {
  const slide = pptx.addSlide();
  base(slide, 22, "ORGANIZATION");
  title(slide, "Organization", "组织架构：围绕交付闭环搭建", "办公室、教学部、规划部、运营部和人员中心共同支撑标准化复制。");
  rect(slide, 5.35, 1.95, 2.6, 0.62, C.navy, { transparency: 100 });
  addText(slide, "校区/公司管理层", 5.65, 2.17, 2.0, 0.2, { fontSize: 13, bold: true, color: C.white, align: "center" });
  const deps = [
    ["办公室", "行政财务 / 流程制度"],
    ["教学部", "专业教学 / 教研标准"],
    ["规划部", "升学规划 / 家长沟通"],
    ["运营部", "获客转化 / 活动渠道"],
    ["人员中心", "招聘培训 / 绩效管理"],
  ];
  deps.forEach((d, i) => {
    const x = 0.8 + i * 2.45;
    node(slide, d[0], d[1], x, 3.65, 2.0, 1.25, i % 2 ? C.pale : C.white, i === 2 ? C.gold : C.blue);
    line(slide, 6.65, 2.57, x + 1.0 - 6.65, 0.9, { color: C.line, width: 1.2 });
  });
}

function operatingGoals() {
  const slide = pptx.addSlide();
  base(slide, 23, "OPERATION PLAN");
  title(slide, "3-Year Goals", "三年运营目标", "用年度里程碑管理规模扩张、组织建设和品牌结果。");
  const goals = [
    ["教学成绩", "联考全省前十目标3人；清央录取至少3人；本科过线率95%以上。"],
    ["规模网络", "教学点20个：一级1家、二级4家、三级5家、四级10家；合作学校5所。"],
    ["品牌财务", "全网粉丝50万+；高三300人、初中1500人；年营收6000万、净利率25%。"],
  ];
  goals.forEach((g, i) => {
    node(slide, g[0], g[1], 0.9 + i * 3.95, 2.25, 3.15, 2.2, i === 1 ? C.pale : C.white, i === 2 ? C.gold : C.blue);
  });
  addText(slide, "目标管理要避免只看收入：同时跟踪线索成本、到店率、转化率、续费率、课消率、集训转化率和录取结果。", 1.05, 5.6, 10.95, 0.34, { fontSize: 10.8, color: C.muted, align: "center" });
}

function roadmap() {
  const slide = pptx.addSlide();
  base(slide, 24, "OPERATION PLAN");
  title(slide, "Roadmap", "第一年12个月工作拆解", "按季度推进：产品搭建、渠道启动、转化验证、模型复盘。");
  const qs = [
    ["Q1", "团队 + 门店 + IP", "核心团队到位80%；2家二级门店；IP发布100条；合作学校签约。"],
    ["Q2", "招生 + 门店磨合", "校考班40人；4家二级门店；暑假集训满意度90%；粉丝3万。"],
    ["Q3", "校考集训 + 一级店", "校考班开课；双11现金流活动；一级门店签约；粉丝6万。"],
    ["Q4", "成绩 + 开业 + 复盘", "人均拿证率1.5；初中寒假班200人；准高三80人；粉丝10万。"],
  ];
  line(slide, 1.25, 3.35, 10.65, 0, { color: C.blue, width: 2.2 });
  qs.forEach((q, i) => {
    const x = 0.95 + i * 3.0;
    rect(slide, x + 0.82, 3.05, 0.48, 0.48, i === 3 ? C.gold : C.blue, { color: i === 3 ? C.gold : C.blue });
    addText(slide, q[0], x + 0.68, 2.2, 0.78, 0.25, { fontFace: AFONT, fontSize: 15, bold: true, color: i === 3 ? C.gold : C.blue, align: "center" });
    card(slide, x, 3.82, 2.22, 1.35, { fill: i % 2 ? C.pale : C.white, bar: i === 3 ? C.gold : C.blue });
    addText(slide, q[1], x + 0.2, 4.08, 1.7, 0.22, { fontSize: 11.2, bold: true, color: C.navy, align: "center" });
    addText(slide, q[2], x + 0.22, 4.44, 1.72, 0.52, { fontSize: 7.7, color: C.muted, align: "center" });
  });
}

function financialRisk() {
  const slide = pptx.addSlide();
  base(slide, 25, "FINANCIAL & RISK");
  title(slide, "Financial Model", "第一年财务测算与风险预案", "以营收结构、成本结构和盈亏测算为核心，建立动态复盘机制。");
  const blocks = [
    ["营收构成", ["校考班150万", "渠道学校100万", "4家二级门店600万", "其他30万，合计880万"], C.blue],
    ["成本构成", ["人力300万", "门店摊销200万", "市场/IP 90万", "租金170万，合计790万"], C.orange],
    ["盈亏测算", ["预计营收800万", "预计成本790万", "基本持平，亏损≤100万", "现金流要求200万"], C.green],
    ["风险预案", ["招生不足40人仍聚焦交付", "渠道受阻则强化IP获客", "收购延迟则先直营1-2家", "亏损扩大则暂缓扩张"], C.red],
  ];
  blocks.forEach((b, i) => {
    const x = i % 2 === 0 ? 0.9 : 6.75;
    const y = i < 2 ? 2.0 : 4.2;
    card(slide, x, y, 5.1, 1.45, { fill: i % 2 ? C.pale : C.white, bar: b[2] });
    addText(slide, b[0], x + 0.28, y + 0.22, 1.5, 0.25, { fontSize: 13.5, bold: true, color: C.navy });
    bullets(slide, b[1], x + 0.42, y + 0.64, 4.1, 0.48, { fontSize: 8.8, paraSpaceAfterPt: 2 });
  });
}

function closing() {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  addImage(slide, images.canvas, 0, 0, W, H, 20);
  rect(slide, 0, 0, W, H, C.navy, { fillTransparency: 28, transparency: 100 });
  rect(slide, 1.0, 1.05, 0.08, 5.4, C.gold, { transparency: 100 });
  addText(slide, "LET'S BUILD A NEW STANDARD", 1.35, 1.42, 4.7, 0.24, { fontFace: AFONT, fontSize: 9, bold: true, color: C.gold });
  addText(slide, "让我们颠覆一下", 1.35, 2.55, 5.5, 0.66, { fontSize: 33, bold: true, color: C.white });
  addText(slide, "用结果导向、全科闭环和标准化交付，重新定义深圳美术艺考服务。", 1.38, 3.55, 6.0, 0.38, { fontSize: 14, color: "E6EEF6" });
  ["市场升级", "IP获客", "校区交付", "录取结果"].forEach((t, i) => {
    pill(slide, t, 1.38 + i * 1.32, 4.45, 1.12, 0.42, i === 1 ? C.gold : "244765", i === 1 ? C.white : "EAF3FA");
  });
}

cover();
agenda();
executiveSummary();
marketFeature();
targetMarket();
marketSize();
painPoints();
positioning();
swot();
sectionBusiness();
modelOverview();
flywheel();
ipMatrix();
storeModel();
channelDelivery();
sectionProduct();
sourceFunnel();
productSystem();
juniorSeniorBusiness();
pricing();
pricingTable();
organization();
operatingGoals();
roadmap();
financialRisk();
closing();

await pptx.writeFile({ fileName: outPath });
console.log(outPath);
