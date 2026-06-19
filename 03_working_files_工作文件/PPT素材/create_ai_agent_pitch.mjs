import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校";
const outDir = path.join(root, "04_outputs_输出结果/AI智能体商业化项目提案");
const assetDir = path.join(root, "03_working_files_工作文件/PPT素材");
fs.mkdirSync(outDir, { recursive: true });

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "奥斯翰国际学校";
pptx.company = "奥斯翰国际学校";
pptx.subject = "AI智能体商业化项目提案";
pptx.title = "AI智能体商业化项目提案";
pptx.lang = "zh-CN";
pptx.theme = {
  headFontFace: "Microsoft YaHei",
  bodyFontFace: "Microsoft YaHei",
  lang: "zh-CN",
};
pptx.defineLayout({ name: "CUSTOM_WIDE", width: 13.333, height: 7.5 });
pptx.layout = "CUSTOM_WIDE";
pptx.margin = 0;

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

const W = 13.333;
const H = 7.5;

function addBg(slide) {
  slide.background = { color: C.white };
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: H,
    fill: { color: C.white },
    line: { color: C.white, transparency: 100 },
  });
}

function addFooter(slide, page) {
  slide.addText("AI Agent Initiative / OXSTAND", {
    x: 0.55,
    y: 7.08,
    w: 3,
    h: 0.18,
    fontFace: "Arial",
    fontSize: 6.8,
    color: "9CA3AF",
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });
  slide.addText(String(page).padStart(2, "0"), {
    x: 12.25,
    y: 7.05,
    w: 0.55,
    h: 0.22,
    fontFace: "Arial",
    fontSize: 7.5,
    color: "9CA3AF",
    align: "right",
    margin: 0,
  });
}

function title(slide, t, sub = "") {
  slide.addText(t, {
    x: 0.62,
    y: 0.48,
    w: 8.3,
    h: 0.48,
    fontSize: 24,
    fontFace: "Microsoft YaHei",
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  slide.addShape(pptx.ShapeType.line, {
    x: 0.62,
    y: 1.12,
    w: 11.95,
    h: 0,
    line: { color: C.faint, width: 0.8 },
  });
  if (sub) {
    slide.addText(sub, {
      x: 9.0,
      y: 0.62,
      w: 3.55,
      h: 0.25,
      fontSize: 8.5,
      color: C.muted,
      align: "right",
      margin: 0,
      fit: "shrink",
    });
  }
}

function bodyText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x,
    y,
    w,
    h,
    fontFace: "Microsoft YaHei",
    fontSize: opts.fontSize ?? 13,
    color: opts.color ?? C.body,
    bold: opts.bold ?? false,
    valign: opts.valign ?? "top",
    margin: opts.margin ?? 0.06,
    breakLine: false,
    fit: "shrink",
    paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 6,
    ...opts,
  });
}

function pill(slide, text, x, y, w, color = C.ink, fill = C.soft) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h: 0.32,
    rectRadius: 0.06,
    fill: { color: fill },
    line: { color: fill, transparency: 100 },
  });
  slide.addText(text, {
    x: x + 0.1,
    y: y + 0.065,
    w: w - 0.2,
    h: 0.14,
    fontSize: 7.5,
    bold: true,
    color,
    align: "center",
    margin: 0,
    fit: "shrink",
  });
}

function metric(slide, num, label, x, y, w, color = C.greenDark) {
  slide.addText(num, {
    x,
    y,
    w,
    h: 0.54,
    fontFace: "Arial",
    fontSize: 26,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
  slide.addText(label, {
    x,
    y: y + 0.55,
    w,
    h: 0.52,
    fontSize: 9.5,
    color: C.body,
    margin: 0,
    fit: "shrink",
    breakLine: false,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    fill: { color: opts.fill ?? C.panel },
    line: { color: opts.line ?? "E5E7EB", width: opts.lineWidth ?? 0.6 },
    shadow: opts.shadow ? { type: "outer", color: "D1D5DB", opacity: 0.18, blur: 1, angle: 45, distance: 1 } : undefined,
  });
}

function sectionLabel(slide, text, x, y, color = C.greenDark) {
  slide.addText(text, {
    x,
    y,
    w: 1.5,
    h: 0.18,
    fontFace: "Arial",
    fontSize: 6.8,
    bold: true,
    color,
    margin: 0,
    fit: "shrink",
  });
}

function addBullets(slide, items, x, y, w, h, opts = {}) {
  slide.addText(items.map((item) => ({
    text: item,
    options: { bullet: { type: "bullet" }, hanging: 3, breakLine: true },
  })), {
    x,
    y,
    w,
    h,
    fontFace: "Microsoft YaHei",
    fontSize: opts.fontSize ?? 12.5,
    color: opts.color ?? C.body,
    margin: 0.04,
    breakLine: false,
    fit: "shrink",
    paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 7,
  });
}

function flowNode(slide, text, x, y, w, h, fill = C.panel, line = C.faint) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    rectRadius: 0.05,
    fill: { color: fill },
    line: { color: line, width: 0.8 },
  });
  slide.addText(text, {
    x: x + 0.12,
    y: y + 0.13,
    w: w - 0.24,
    h: h - 0.24,
    fontSize: 10.5,
    bold: true,
    color: C.ink,
    align: "center",
    valign: "mid",
    margin: 0,
    fit: "shrink",
  });
}

function arrow(slide, x1, y1, x2, y2, color = "9CA3AF") {
  slide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: { color, width: 1.4, beginArrowType: "none", endArrowType: "triangle" },
  });
}

function slide1() {
  const s = pptx.addSlide();
  addBg(s);
  s.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 0.16,
    h: H,
    fill: { color: C.greenDark },
    line: { color: C.greenDark, transparency: 100 },
  });
  s.addText("AI智能体商业化项目提案", {
    x: 0.72,
    y: 1.1,
    w: 6.8,
    h: 0.55,
    fontSize: 28,
    bold: true,
    color: C.ink,
    margin: 0,
    fit: "shrink",
  });
  s.addText("从奥斯翰招生线上端自动化切入，验证智能体能力，并延展为标准化/定制化智能体业务", {
    x: 0.72,
    y: 1.86,
    w: 7.3,
    h: 0.62,
    fontSize: 15,
    color: C.body,
    margin: 0,
    breakLine: false,
    fit: "shrink",
  });
  s.addShape(pptx.ShapeType.line, {
    x: 0.72,
    y: 2.74,
    w: 2.25,
    h: 0,
    line: { color: C.green, width: 3 },
  });
  bodyText(s, "汇报目标：争取立项支持，8月前先跑通招生智能体MVP，再评估公司化扩张路径。", 0.72, 3.05, 6.6, 0.5, {
    fontSize: 12,
    color: C.muted,
  });
  card(s, 8.55, 0.92, 3.85, 4.88, { fill: "F9FAFB" });
  metric(s, "1个月", "跑通奥斯翰招生智能体初版", 8.95, 1.42, 2.2);
  metric(s, "8月前", "完成真实业务闭环验证", 8.95, 2.75, 2.2, C.ink);
  metric(s, "2条线", "标准化产品 + 企业定制服务", 8.95, 4.08, 2.2, C.yellow);
  pill(s, "内部降本增效", 0.72, 6.18, 1.55, C.greenDark, "E9F8EF");
  pill(s, "外部商业化", 2.43, 6.18, 1.55, C.ink, "F3F4F6");
  pill(s, "抢占时间差", 4.14, 6.18, 1.55, C.red, "FEECEC");
  s.addText("2026.06", { x: 11.35, y: 6.82, w: 1, h: 0.2, fontSize: 8, color: "9CA3AF", margin: 0, align: "right" });
}

function slide2() {
  const s = pptx.addSlide();
  addBg(s); title(s, "一句话结论", "Executive Summary");
  bodyText(s, "奥斯翰招生线上端不是单点内容问题，而是“内容生产、视频生成、分发、数据回溯”整条链路的人效问题。AI智能体可以先作为内部生产工具降本增效，跑通后再沉淀为面向教育和其他行业的商业化产品。", 0.72, 1.55, 7.4, 1.0, {
    fontSize: 18,
    bold: true,
    color: C.ink,
    paraSpaceAfterPt: 2,
  });
  const items = [
    ["为什么从奥斯翰切入", "业务需求真实、数据反馈直接、成果能快速展示给管理层"],
    ["为什么现在做", "低代码平台和AI Coding降低研发门槛，企业端正在从“聊天工具”转向“工作流工具”"],
    ["为什么能商业化", "各行业都有重复流程、内容生产、客服销售、数据复盘等可标准化场景"],
    ["本阶段要的支持", "先给1个月验证周期和小规模预算，用实际招生智能体交付结果说话"],
  ];
  items.forEach((it, i) => {
    const y = 3.05 + i * 0.78;
    s.addText(`0${i + 1}`, { x: 0.78, y, w: 0.45, h: 0.23, fontFace: "Arial", fontSize: 10, bold: true, color: C.greenDark, margin: 0 });
    bodyText(s, it[0], 1.35, y - 0.03, 2.05, 0.28, { fontSize: 12, bold: true, color: C.ink });
    bodyText(s, it[1], 3.55, y - 0.03, 7.9, 0.35, { fontSize: 11.2, color: C.body });
  });
  card(s, 9.1, 1.44, 3.05, 1.0, { fill: "F0FBF4", line: "CDEFD8" });
  bodyText(s, "先做内部工具", 9.43, 1.66, 1.4, 0.2, { fontSize: 12, bold: true, color: C.greenDark, align: "center" });
  arrow(s, 10.95, 1.93, 11.35, 1.93, C.greenDark);
  bodyText(s, "再做外部产品", 10.98, 1.66, 1.05, 0.2, { fontSize: 12, bold: true, color: C.ink, align: "center" });
  addFooter(s, 2);
}

function slide3() {
  const s = pptx.addSlide();
  addBg(s); title(s, "项目起点：招生线上端的人效问题", "Oshan Use Case");
  card(s, 0.72, 1.55, 3.55, 4.9, { fill: "FAFAFA" });
  sectionLabel(s, "CURRENT PAIN", 1.02, 1.88, C.red);
  addBullets(s, [
    "线上招生内容需要持续产出：文案、脚本、图片、视频、数字人",
    "摄影、剪辑、投放、运营复盘都依赖人力，成本高且标准不统一",
    "多平台矩阵运营难以形成稳定流程，数据回溯与复盘容易断层",
  ], 1.05, 2.2, 2.78, 2.75, { fontSize: 12.2 });
  card(s, 4.9, 1.55, 3.55, 4.9, { fill: "F6FBF8", line: "D7F0DF" });
  sectionLabel(s, "AI AGENT ANSWER", 5.2, 1.88, C.greenDark);
  addBullets(s, [
    "把招生内容链路拆成可复用节点：选题、文案、脚本、视频、分发、复盘",
    "通过Coze等低代码平台先搭建工作流，不等完整技术团队再启动",
    "让每一次产出都沉淀模板、数据和标准，形成可迭代资产",
  ], 5.23, 2.2, 2.78, 2.75, { fontSize: 12.2 });
  card(s, 9.08, 1.55, 3.0, 4.9, { fill: "FFFDF5", line: "F6E6AA" });
  sectionLabel(s, "BUSINESS SPILLOVER", 9.38, 1.88, C.yellow);
  addBullets(s, [
    "奥斯翰是第一个试点，不是唯一市场",
    "招生智能体跑通后，可复制到教育、服装、本地生活、企业营销等场景",
    "从“自己用”升级为“对外卖工具和交付服务”",
  ], 9.4, 2.2, 2.18, 2.75, { fontSize: 12.2 });
  addFooter(s, 3);
}

function slide4() {
  const s = pptx.addSlide();
  addBg(s); title(s, "市场窗口：大多数人还停留在“用过聊天机器人”", "Adoption Gap");
  const img = path.join(assetDir, "市场现状.png");
  s.addImage({ path: img, x: 0.82, y: 1.38, w: 5.1, h: 5.92 });
  bodyText(s, "这张图的关键信号不是“AI没人用”，而是“深度使用和付费使用比例还很低”。", 6.35, 1.62, 5.5, 0.55, {
    fontSize: 18,
    bold: true,
    color: C.ink,
  });
  addBullets(s, [
    "灰色部分代表大量人群仍未真正进入AI工作流，说明教育和企业端渗透空间仍大。",
    "绿色部分代表免费聊天机器人用户，说明需求教育已开始，但还没有形成稳定生产力系统。",
    "黄色/红色部分代表付费AI与Coding/脚手架用户，比例很小，但正是工具化和智能体化的先行人群。",
    "我们的机会：把“少数人会搭建的AI工作流”包装成企业能直接购买、部署、培训、复盘的产品。"
  ], 6.42, 2.56, 5.35, 2.88, { fontSize: 12.5, paraSpaceAfterPt: 9 });
  card(s, 6.38, 5.88, 5.35, 0.7, { fill: "F8FAFC" });
  bodyText(s, "判断：当前市场不是没有工具，而是缺少“懂业务、能交付、能标准化复用”的智能体服务商。", 6.65, 6.1, 4.8, 0.23, {
    fontSize: 11.5,
    bold: true,
    color: C.ink,
  });
  addFooter(s, 4);
}

function slide5() {
  const s = pptx.addSlide();
  addBg(s); title(s, "外部趋势：企业AI正在从问答走向执行", "Market Signals");
  const metrics = [
    ["15%", "Gartner预测：到2028年，至少15%的日常工作决策将通过Agentic AI自主完成。"],
    ["49.6%", "Grand View Research预计：全球AI Agents市场2026-2033年复合增长率约49.6%。"],
    ["治理缺口", "Deloitte指出：智能体能加速业务价值，但数据、风险、组织变革仍是关键门槛。"],
  ];
  metrics.forEach((m, i) => {
    const x = 0.82 + i * 4.12;
    card(s, x, 1.55, 3.55, 2.25, { fill: i === 0 ? "F6FBF8" : "F9FAFB", line: i === 0 ? "CDEFD8" : "E5E7EB" });
    s.addText(m[0], {
      x: x + 0.26,
      y: 1.9,
      w: 2.8,
      h: 0.5,
      fontFace: "Arial",
      fontSize: i === 2 ? 23 : 30,
      bold: true,
      color: i === 1 ? C.greenDark : C.ink,
      margin: 0,
      fit: "shrink",
    });
    bodyText(s, m[1], x + 0.27, 2.68, 2.95, 0.65, { fontSize: 11.5, color: C.body });
  });
  s.addShape(pptx.ShapeType.line, { x: 1.05, y: 4.62, w: 10.95, h: 0, line: { color: C.faint, width: 1 } });
  const stages = [
    ["聊天", "员工自己提问，结果不可控"],
    ["工作流", "节点化处理，形成标准动作"],
    ["智能体", "在目标、工具、数据之间自动执行"],
    ["智能体公司", "把能力产品化、行业化、交付化"],
  ];
  stages.forEach((st, i) => {
    const x = 1.0 + i * 3.05;
    flowNode(s, st[0], x, 4.25, 1.15, 0.55, i === 2 ? "E9F8EF" : C.panel, i === 2 ? "BFEACD" : C.faint);
    bodyText(s, st[1], x - 0.45, 5.05, 2.05, 0.42, { fontSize: 9.5, color: C.muted, align: "center" });
    if (i < stages.length - 1) arrow(s, x + 1.32, 4.52, x + 2.12, 4.52);
  });
  bodyText(s, "资料依据：Gartner 2025战略技术趋势、Deloitte《State of AI in the Enterprise》、Grand View Research全球AI Agents市场报告。", 0.83, 6.55, 11.4, 0.28, {
    fontSize: 8.2,
    color: "9CA3AF",
  });
  addFooter(s, 5);
}

function slide6() {
  const s = pptx.addSlide();
  addBg(s); title(s, "奥斯翰招生智能体：先跑通一条完整闭环", "MVP Workflow");
  const nodes = [
    ["招生目标输入", "年级 / 城市 / 卖点 / 活动"],
    ["内容策略", "选题库 / 人群画像 / 爆点角度"],
    ["文案脚本", "短视频脚本 / 小红书 / 朋友圈"],
    ["视觉生成", "图片 / 海报 / 数字人视频"],
    ["矩阵分发", "抖音 / 小红书 / 视频号 / 私域"],
    ["数据回溯", "线索 / 互动 / 转化 / 复盘建议"],
  ];
  nodes.forEach((n, i) => {
    const row = i < 3 ? 0 : 1;
    const col = i % 3;
    const x = 0.78 + col * 4.08;
    const y = 1.64 + row * 2.25;
    card(s, x, y, 3.25, 1.42, { fill: i === 0 ? "F6FBF8" : "F9FAFB", line: i === 0 ? "CDEFD8" : "E5E7EB" });
    s.addText(`0${i + 1}`, { x: x + 0.22, y: y + 0.2, w: 0.4, h: 0.18, fontFace: "Arial", fontSize: 8, bold: true, color: C.greenDark, margin: 0 });
    bodyText(s, n[0], x + 0.7, y + 0.18, 2.1, 0.25, { fontSize: 13, bold: true, color: C.ink });
    bodyText(s, n[1], x + 0.7, y + 0.68, 2.2, 0.38, { fontSize: 10.5, color: C.body });
    if (i !== 2 && i !== 5) arrow(s, x + 3.34, y + 0.72, x + 3.72, y + 0.72);
  });
  arrow(s, 11.9, 2.36, 11.9, 3.88);
  arrow(s, 8.95, 5.28, 7.92, 5.28);
  arrow(s, 4.86, 5.28, 3.83, 5.28);
  card(s, 0.78, 6.15, 11.65, 0.55, { fill: "111827", line: "111827" });
  bodyText(s, "MVP原则：不追求一步到位，先把“从输入需求到发布复盘”的最小闭环跑通，再按真实业务反馈迭代。", 1.12, 6.32, 11.0, 0.16, {
    fontSize: 10.5,
    color: C.white,
    bold: true,
    margin: 0,
  });
  addFooter(s, 6);
}

function slide7() {
  const s = pptx.addSlide();
  addBg(s); title(s, "给奥斯翰的直接价值：降本、提效、标准化", "Internal ROI");
  const vals = [
    ["降低人力成本", "减少重复文案、脚本、剪辑沟通、分发整理等低价值耗时，把人力集中到选题判断和线索转化。", C.greenDark],
    ["提升内容产能", "招生节点可以批量生成多平台内容版本，适配不同人群与渠道，缩短从想法到发布的周期。", C.ink],
    ["统一工作标准", "把过往经验沉淀成模板、提示词、流程节点和审核标准，减少个人发挥带来的质量波动。", C.yellow],
    ["形成数据复盘", "每条内容的表现、线索与转化结果回流到智能体，指导下一轮选题和投放动作。", C.red],
  ];
  vals.forEach((v, i) => {
    const x = 0.85 + (i % 2) * 5.9;
    const y = 1.58 + Math.floor(i / 2) * 2.35;
    card(s, x, y, 5.25, 1.7, { fill: "F9FAFB" });
    s.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h: 1.7, fill: { color: v[2] }, line: { color: v[2], transparency: 100 } });
    bodyText(s, v[0], x + 0.35, y + 0.28, 2.2, 0.25, { fontSize: 15, bold: true, color: C.ink });
    bodyText(s, v[1], x + 0.35, y + 0.76, 4.45, 0.45, { fontSize: 11.2, color: C.body });
  });
  card(s, 0.85, 6.25, 11.18, 0.55, { fill: "F6FBF8", line: "CDEFD8" });
  bodyText(s, "衡量口径：内容生产耗时、单条内容成本、发布频率、有效线索数、线索转化率、复盘迭代速度。", 1.12, 6.43, 10.5, 0.15, {
    fontSize: 10.5,
    bold: true,
    color: C.greenDark,
    margin: 0,
  });
  addFooter(s, 7);
}

function slide8() {
  const s = pptx.addSlide();
  addBg(s); title(s, "可行性判断：低代码降低门槛，但交付壁垒在业务理解", "Feasibility");
  card(s, 0.82, 1.55, 5.25, 4.8, { fill: "F9FAFB" });
  sectionLabel(s, "BUILDING BLOCKS", 1.12, 1.9);
  addBullets(s, [
    "Coze等平台提供可视化节点、知识库、插件、API连接能力",
    "Codex/AI Coding可辅助非程序人员完成脚本、接口、自动化和网页工具",
    "视频生成、数字人、图像生成、平台分发工具已经具备可组合基础",
    "因此早期验证不需要重资产研发团队，可以用轻量方式快速试错",
  ], 1.1, 2.25, 4.35, 2.95, { fontSize: 12.3 });
  card(s, 7.08, 1.55, 4.65, 4.8, { fill: "FFFDF5", line: "F6E6AA" });
  sectionLabel(s, "REAL BARRIERS", 7.38, 1.9, C.yellow);
  addBullets(s, [
    "不是会连线就有产品，关键在业务SOP、审核标准和结果闭环",
    "企业真正购买的是“可落地的工作系统”，不是单个AI聊天窗口",
    "后续壁垒来自行业模板库、案例数据、交付方法、培训体系和服务口碑",
    "越早做真实项目，越早沉淀别人短期难复制的行业资产",
  ], 7.36, 2.25, 3.7, 2.95, { fontSize: 12.3 });
  addFooter(s, 8);
}

function slide9() {
  const s = pptx.addSlide();
  addBg(s); title(s, "商业模式：标准化智能体 + 企业定制化交付", "Business Model");
  const rows = [
    ["标准化智能体", "教育招生、短视频矩阵、客服销售、招聘筛选、门店运营等高频场景", "低价/订阅/模板市场", "快速铺量，建立市场认知"],
    ["定制化智能体", "围绕企业现有流程、数据、工具链做专属工作流搭建", "项目制/年服务费", "更高客单价，沉淀行业案例"],
    ["培训与陪跑", "老板/团队学习智能体使用、内容标准、数据复盘", "课程/顾问/运营陪跑", "提高续费和复购"],
  ];
  const colX = [0.82, 2.75, 6.5, 9.18];
  const colW = [1.55, 3.15, 2.05, 2.95];
  ["产品线", "适用场景", "收入方式", "战略作用"].forEach((h, i) => {
    bodyText(s, h, colX[i], 1.52, colW[i], 0.25, { fontSize: 10, bold: true, color: C.muted });
  });
  rows.forEach((r, ri) => {
    const y = 2.0 + ri * 1.35;
    s.addShape(pptx.ShapeType.line, { x: 0.82, y: y - 0.22, w: 11.1, h: 0, line: { color: C.faint, width: 0.8 } });
    r.forEach((cell, ci) => {
      bodyText(s, cell, colX[ci], y, colW[ci], 0.78, {
        fontSize: ci === 0 ? 12.2 : 10.7,
        bold: ci === 0,
        color: ci === 0 ? C.ink : C.body,
      });
    });
  });
  card(s, 0.82, 6.16, 11.1, 0.55, { fill: "111827", line: "111827" });
  bodyText(s, "定位建议：不要只卖“智能体搭建”，而是卖“行业流程自动化解决方案”。", 1.15, 6.35, 10.1, 0.16, {
    fontSize: 11,
    bold: true,
    color: C.white,
    margin: 0,
  });
  addFooter(s, 9);
}

function slide10() {
  const s = pptx.addSlide();
  addBg(s); title(s, "竞争判断：先发不是靠技术炫技，而是靠落地速度", "Competitive Logic");
  const left = [
    ["市场已有玩家", "说明需求被验证，不代表格局已定。多数玩家仍停留在模板售卖、课程引流或浅层代搭。"],
    ["我们的切入点", "先以奥斯翰真实招生场景做样板，把“能用、能省、能复盘”的案例跑出来。"],
    ["可建立壁垒", "行业SOP库、提示词/工作流资产、客户案例、交付流程、数据复盘方法。"],
  ];
  left.forEach((l, i) => {
    const y = 1.55 + i * 1.42;
    bodyText(s, l[0], 0.88, y, 1.8, 0.28, { fontSize: 13.5, bold: true, color: C.ink });
    bodyText(s, l[1], 3.0, y, 4.45, 0.58, { fontSize: 11.2, color: C.body });
    s.addShape(pptx.ShapeType.line, { x: 0.88, y: y + 0.92, w: 6.6, h: 0, line: { color: C.faint, width: 0.8 } });
  });
  card(s, 8.18, 1.42, 3.65, 4.75, { fill: "F6FBF8", line: "CDEFD8" });
  s.addText("时间差打法", { x: 8.58, y: 1.82, w: 1.8, h: 0.32, fontSize: 16, bold: true, color: C.greenDark, margin: 0 });
  addBullets(s, [
    "先做内部MVP，拿结果",
    "再包装教育行业样板",
    "同步开发2-3个高频行业模板",
    "用案例内容反向做市场宣发",
    "形成“懂业务的智能体服务商”心智",
  ], 8.58, 2.48, 2.55, 2.7, { fontSize: 12.2, paraSpaceAfterPt: 8 });
  addFooter(s, 10);
}

function slide11() {
  const s = pptx.addSlide();
  addBg(s); title(s, "推进节奏：8月前先验证招生智能体，再决定公司化扩张", "Roadmap");
  const phases = [
    ["6月", "需求拆解与MVP搭建", "拆招生内容流程、确定工具组合、搭建Coze工作流初版"],
    ["7月", "真实内容生产与分发测试", "跑选题-脚本-视频-发布-数据回收闭环，记录效率和成本变化"],
    ["8月前", "复盘与样板包装", "形成奥斯翰案例、标准流程、演示Demo和对外产品雏形"],
    ["后续", "公司化试点", "教育行业模板优先，再扩展到服装/本地生活/企业营销等场景"],
  ];
  phases.forEach((p, i) => {
    const x = 0.78 + i * 3.05;
    card(s, x, 1.72, 2.45, 3.95, { fill: i === 2 ? "F6FBF8" : "F9FAFB", line: i === 2 ? "CDEFD8" : "E5E7EB" });
    s.addText(p[0], { x: x + 0.25, y: 2.08, w: 1.25, h: 0.35, fontSize: 20, bold: true, color: i === 2 ? C.greenDark : C.ink, margin: 0 });
    bodyText(s, p[1], x + 0.25, 2.78, 1.9, 0.48, { fontSize: 13, bold: true, color: C.ink });
    bodyText(s, p[2], x + 0.25, 3.68, 1.85, 0.92, { fontSize: 10.5, color: C.body });
    if (i < phases.length - 1) arrow(s, x + 2.55, 3.55, x + 2.9, 3.55);
  });
  bodyText(s, "阶段性判断点：如果奥斯翰内部无法明显提效，就暂停公司化；如果能形成可展示成果，则启动品牌、销售和团队配置。", 0.92, 6.32, 11.2, 0.28, {
    fontSize: 11.2,
    bold: true,
    color: C.ink,
  });
  addFooter(s, 11);
}

function slide12() {
  const s = pptx.addSlide();
  addBg(s); title(s, "本次希望达成的决策", "Decision Needed");
  card(s, 0.88, 1.52, 3.25, 4.65, { fill: "F6FBF8", line: "CDEFD8" });
  card(s, 5.02, 1.52, 3.25, 4.65, { fill: "F9FAFB" });
  card(s, 9.15, 1.52, 3.25, 4.65, { fill: "FFFDF5", line: "F6E6AA" });
  const asks = [
    ["批准试点", "给1个月时间，以奥斯翰招生线上端为真实场景，完成智能体MVP。"],
    ["允许小额试错", "按工具订阅、素材生成、平台测试等方式配置轻量预算，避免重资产投入。"],
    ["8月前复盘", "根据真实效率、成本、内容产出和线索数据，决定是否成立独立AI智能体公司。"],
  ];
  asks.forEach((a, i) => {
    const x = [0.88, 5.02, 9.15][i];
    s.addText(`0${i + 1}`, { x: x + 0.35, y: 1.95, w: 0.7, h: 0.35, fontFace: "Arial", fontSize: 13, bold: true, color: i === 1 ? C.ink : C.greenDark, margin: 0 });
    bodyText(s, a[0], x + 0.35, 2.62, 1.8, 0.35, { fontSize: 17, bold: true, color: C.ink });
    bodyText(s, a[1], x + 0.35, 3.38, 2.35, 1.0, { fontSize: 12.2, color: C.body });
  });
  bodyText(s, "核心原则：先用奥斯翰自己的招生场景把能力跑实，再谈公司化、品牌化和规模化。", 1.0, 6.65, 11.25, 0.28, {
    fontSize: 12,
    bold: true,
    color: C.ink,
    align: "center",
  });
  addFooter(s, 12);
}

[
  slide1,
  slide2,
  slide3,
  slide4,
  slide5,
  slide6,
  slide7,
  slide8,
  slide9,
  slide10,
  slide11,
  slide12,
].forEach((fn) => fn());

const fileName = path.join(outDir, "AI智能体商业化项目提案_奥斯翰招生试点_v2.pptx");
await pptx.writeFile({ fileName });
console.log(fileName);
