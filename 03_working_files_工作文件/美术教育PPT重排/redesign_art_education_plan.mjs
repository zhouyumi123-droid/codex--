import fs from "fs";
import path from "path";
import pptxgen from "pptxgenjs";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校";
const work = path.join(root, "03_working_files_工作文件/美术教育PPT重排");
const outDir = path.join(root, "04_outputs_输出结果/美术教育商业计划书重排");
fs.mkdirSync(outDir, { recursive: true });

const inv = JSON.parse(fs.readFileSync(path.join(work, "original_text_inventory.json"), "utf8"));

const pptx = new pptxgen();
pptx.defineLayout({ name: "WIDE", width: 13.333, height: 7.5 });
pptx.layout = "WIDE";
pptx.author = "Codex";
pptx.company = "沐清学堂";
pptx.subject = "美术教育商业计划书 redesign";
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
  bg: "F5F1EA",
  navy: "0E2438",
  navy2: "153B5C",
  blue: "1F5E8C",
  paleBlue: "E8F1F7",
  gold: "B58A35",
  text: "172234",
  muted: "667481",
  line: "D9DEE2",
  white: "FFFFFF",
};

function clean(parts) {
  const s = Array.isArray(parts) ? parts.join("") : parts;
  return s
    .replace(/\s+/g, " ")
    .replace(/ ,/g, "，")
    .replace(/ \./g, "。")
    .replace(/ ?， ?/g, "，")
    .replace(/ ?。 ?/g, "。")
    .replace(/ ?： ?/g, "：")
    .replace(/ ?； ?/g, "；")
    .replace(/ ?）/g, "）")
    .replace(/（ ?/g, "（")
    .replace(/([A-Za-z]) ?([A-Za-z])/g, "$1$2")
    .trim();
}

function chunks(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function addBase(slide, n, section = "") {
  slide.background = { color: C.bg };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.bg }, line: { color: C.bg, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.18, fill: { color: C.navy }, line: { color: C.navy, transparency: 100 } });
  slide.addText(section || "MUQING ART EDUCATION", {
    x: 0.6, y: 7.05, w: 4, h: 0.18, fontFace: "Arial", fontSize: 6.8, color: "8A949E", margin: 0, fit: "shrink",
  });
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.15, y: 6.98, w: 0.55, h: 0.22, fontFace: "Arial", fontSize: 8, bold: true, color: "8A949E", align: "right", margin: 0,
  });
}

function titleBlock(slide, section, title, opts = {}) {
  slide.addText(section.toUpperCase(), {
    x: 0.68, y: 0.62, w: 3.1, h: 0.22, fontFace: "Arial", fontSize: 8, bold: true, color: C.gold, margin: 0, fit: "shrink",
  });
  slide.addText(title, {
    x: 0.68, y: 0.9, w: opts.w || 8.2, h: 0.48, fontFace: "Microsoft YaHei", fontSize: opts.size || 24, bold: true, color: C.navy, margin: 0, fit: "shrink",
  });
  slide.addShape(pptx.ShapeType.line, { x: 0.68, y: 1.48, w: 11.9, h: 0, line: { color: C.line, width: 0.8 } });
}

function addText(slide, text, x, y, w, h, opts = {}) {
  slide.addText(text, {
    x, y, w, h,
    fontFace: "Microsoft YaHei",
    fontSize: opts.fontSize ?? 12,
    bold: opts.bold ?? false,
    color: opts.color ?? C.text,
    margin: opts.margin ?? 0.05,
    breakLine: false,
    fit: "shrink",
    valign: opts.valign ?? "top",
    align: opts.align,
    paraSpaceAfterPt: opts.paraSpaceAfterPt ?? 4,
    ...opts,
  });
}

function card(slide, x, y, w, h, opts = {}) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: opts.fill || C.white, transparency: opts.transparency },
    line: { color: opts.line || C.line, width: opts.lineWidth ?? 0.6, transparency: opts.lineTransparency },
  });
  if (opts.bar) {
    slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.06, h, fill: { color: opts.bar }, line: { color: opts.bar, transparency: 100 } });
  }
}

function splitSentences(text) {
  return clean(text)
    .split(/(?<=[。；])|(?=痛点[一二三]：)|(?=①)|(?=②)|(?=③)|(?=④)|(?=⑤)|(?=\d[、.])/)
    .map(s => s.trim())
    .filter(s => s && !/^[，。；：、]$/.test(s));
}

function getSlide(n) {
  return inv.find(s => s.slide === n);
}

function sectionOf(n) {
  if (n <= 10) return "PROJECT OVERVIEW";
  if (n <= 20) return "BUSINESS MODEL";
  if (n <= 26) return "BUSINESS DESCRIPTION";
  if (n <= 31) return "PRICING STRATEGY";
  if (n <= 40) return "ORGANIZATION";
  if (n <= 47) return "OPERATION PLAN";
  return "FINAL";
}

function mainTitle(s) {
  const overrides = {
    4: "艺考市场规模 / 市场特征",
    5: "目标市场",
    6: "市场规模",
    7: "行业痛点",
    8: "沐清定位",
    10: "SWOT 策略总结",
    12: "商业模式总览",
    14: "名师IP矩阵：线上获客引擎",
    15: "IP运营与收益分配机制",
    16: "四级门店经济模型",
    17: "门店单店经济模型测算",
    18: "B端渠道合作：批量锁量模型",
    19: "核心交付：集训校区",
    20: "商业模式总结",
    22: "生源孵化漏斗",
    23: "全学段业务总览",
    24: "衔接阶段 - 业务详情",
    25: "初中阶段 - 业务详情",
    26: "高中阶段 - 业务详情",
    28: "定价原则",
    29: "定价表",
    30: "优惠策略",
    31: "定价策略总结",
    33: "组织架构图",
    34: "架构说明",
    35: "办公室职责与设计用意",
    36: "教学部职责与设计用意",
    37: "规划部职责与设计用意",
    38: "运营部职责与设计用意",
    39: "人员中心",
    40: "组织架构总结",
    42: "三年总运营目标（2026年5月-2029年9月）",
    43: "第一个12个月工作拆解（按季度）",
    44: "第一年财务预测（简版）- 营收构成",
    45: "第一年财务预测（简版）- 成本构成",
    46: "第一年财务预测（简版）- 盈亏测算",
    47: "第一年六大核心任务及风险预案",
  };
  if (overrides[s.slide]) return overrides[s.slide];
  const t = s.texts.filter(Boolean);
  if ([3, 11, 21, 27, 32, 41].includes(s.slide)) return t[0];
  if (s.slide === 2) return "目录";
  if (s.slide === 1) return "美术教育商业计划书";
  if (s.slide === 48) return clean(t);
  const first = t[0] || "";
  let rest = t.slice(1, 5).join("");
  rest = rest.replace(/[，。：；]/g, "").trim();
  if (rest.length > 0 && rest.length < 20) return clean(rest);
  return clean(first);
}

function coverSlide(s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 8.55, y: 0, w: 4.78, h: H, fill: { color: "173F61" }, line: { color: "173F61", transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 9.0, y: 0.76, w: 0.08, h: 5.7, fill: { color: C.gold }, line: { color: C.gold, transparency: 100 } });
  slide.addText("MUQING ART EDUCATION", { x: 0.82, y: 0.9, w: 4.2, h: 0.2, fontFace: "Arial", fontSize: 9, bold: true, color: C.gold, margin: 0 });
  slide.addText(s.texts[0], { x: 0.82, y: 2.18, w: 4.2, h: 0.55, fontSize: 30, bold: true, color: C.white, margin: 0 });
  slide.addText(s.texts[1], { x: 0.82, y: 3.05, w: 6.7, h: 0.6, fontSize: 28, bold: true, color: C.white, margin: 0 });
  slide.addShape(pptx.ShapeType.line, { x: 0.82, y: 4.08, w: 2.2, h: 0, line: { color: C.gold, width: 3 } });
  slide.addText("商业计划书 / Business Plan", { x: 0.86, y: 4.45, w: 3.2, h: 0.22, fontSize: 10, color: "D7DEE6", margin: 0 });
  ["文化专业闭环", "升学规划", "封闭园区", "IP获客"].forEach((t, i) => {
    const y = 1.22 + i * 1.15;
    card(slide, 9.42, y, 2.35, 0.62, { fill: C.white, bar: i % 2 ? C.blue : C.gold });
    addText(slide, t, 9.72, y + 0.19, 1.7, 0.18, { fontSize: 12, bold: true, color: C.navy, align: "center" });
  });
  slide.addText("2026", { x: 11.3, y: 6.72, w: 0.8, h: 0.22, fontFace: "Arial", fontSize: 10, bold: true, color: C.gold, margin: 0, align: "right" });
}

function agendaSlide(s) {
  const slide = pptx.addSlide();
  addBase(slide, 2, "CONTENTS");
  titleBlock(slide, "CONTENTS", "目录");
  const groups = [
    ["01", "项目概诉", ["市场特征", "目标市场", "市场规模", "行业痛点", "沐清定位", "SWOT分析"]],
    ["02", "商业模式", ["商业模式总览", "名师IP矩阵", "四级门店经济模型", "B端渠道合作", "核心交付"]],
    ["03", "业务描述", ["生源孵化漏斗", "全学段业务总览", "衔接阶段业务", "初中阶段业务", "高中阶段业务"]],
    ["04", "定价策略", ["定价原则", "定价表总览", "优惠策略", "定价策略总结"]],
    ["05", "组织架构", ["组织架构总览", "四大部门职责与设计用意", "人员中心"]],
    ["06", "运营计划", ["三年运营目标", "第一个12个月工作拆解", "第一年财务测算", "风险预案"]],
  ];
  groups.forEach((g, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.82 + col * 4.08;
    const y = 1.82 + row * 2.25;
    card(slide, x, y, 3.35, 1.72, { fill: C.white, bar: i % 2 ? C.blue : C.gold });
    addText(slide, g[0], x + 0.22, y + 0.18, 0.48, 0.26, { fontFace: "Arial", fontSize: 13, bold: true, color: i % 2 ? C.blue : C.gold, margin: 0 });
    addText(slide, g[1], x + 0.78, y + 0.14, 1.9, 0.26, { fontSize: 13.5, bold: true, color: C.navy, margin: 0 });
    addText(slide, g[2].join(" / "), x + 0.78, y + 0.62, 2.25, 0.62, { fontSize: 8.5, color: C.muted, margin: 0, fit: "shrink" });
  });
}

function sectionSlide(s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.72, y: 0.72, w: 0.1, h: 5.7, fill: { color: C.gold }, line: { color: C.gold, transparency: 100 } });
  slide.addText(sectionOf(s.slide), { x: 1.05, y: 1.18, w: 4.2, h: 0.22, fontFace: "Arial", fontSize: 9, bold: true, color: C.gold, margin: 0 });
  slide.addText(clean(s.texts), { x: 1.05, y: 2.55, w: 6.4, h: 0.75, fontSize: 34, bold: true, color: C.white, margin: 0, fit: "shrink" });
  slide.addText("MUQING ART EDUCATION BUSINESS PLAN", { x: 1.08, y: 4.02, w: 4.9, h: 0.22, fontFace: "Arial", fontSize: 8.2, color: "B7C3CF", margin: 0 });
  slide.addShape(pptx.ShapeType.rect, { x: 8.72, y: 0, w: 4.61, h: H, fill: { color: "173F61" }, line: { color: "173F61", transparency: 100 } });
  for (let i = 0; i < 5; i++) {
    card(slide, 9.35, 1.25 + i * 0.86, 2.5, 0.42, { fill: i % 2 ? "214E74" : C.white, lineTransparency: 100, bar: C.gold });
  }
  slide.addText(String(s.slide).padStart(2, "0"), { x: 11.35, y: 6.65, w: 0.8, h: 0.2, fontFace: "Arial", fontSize: 10, bold: true, color: C.gold, margin: 0, align: "right" });
}

function tableRowsFromTokens(tokens, seq, colCount) {
  const start = tokens.findIndex(t => t === seq[0]);
  if (start < 0) return [];
  const body = tokens.slice(start + seq.length).filter(t => t !== "/" && t !== "-");
  return chunks(body, colCount).filter(r => r.length >= 2);
}

function addPptTable(slide, headers, rows, x, y, w, h, opts = {}) {
  const maxRows = opts.maxRows || rows.length;
  const shown = rows.slice(0, maxRows);
  const colW = opts.colW || headers.map(() => w / headers.length);
  const data = [
    headers.map(t => ({ text: t, options: { fill: { color: C.navy }, color: C.white, bold: true, margin: 0.04 } })),
    ...shown.map((r, ri) => headers.map((_, ci) => ({
      text: clean(r[ci] || ""),
      options: {
        fill: { color: ri % 2 ? "F7F9FB" : C.white },
        color: C.text,
        margin: 0.035,
        bold: ci === 0,
      },
    }))),
  ];
  slide.addTable(data, {
    x, y, w, h,
    colW,
    border: { type: "solid", color: "D6DCE2", pt: 0.5 },
    fontFace: "Microsoft YaHei",
    fontSize: opts.fontSize || 6.5,
    valign: "mid",
    fit: "shrink",
    margin: 0.02,
  });
}

function swotSlide(s) {
  const slide = pptx.addSlide();
  addBase(slide, s.slide, sectionOf(s.slide));
  titleBlock(slide, "SWOT ANALYSIS", "SWOT 分析");
  const txt = clean(s.texts.slice(3));
  const blocks = [
    ["S", "优势", txt.match(/S（优势）(.+?)W（劣势）/)?.[1] || ""],
    ["W", "劣势", txt.match(/W（劣势）(.+?)O（机会）/)?.[1] || ""],
    ["O", "机会", txt.match(/O（机会）(.+?)T（威胁）/)?.[1] || ""],
    ["T", "威胁", txt.match(/T（威胁）(.+)/)?.[1] || ""],
  ];
  blocks.forEach((b, i) => {
    const x = 0.76 + (i % 2) * 6.04;
    const y = 1.8 + Math.floor(i / 2) * 2.35;
    card(slide, x, y, 5.28, 1.86, { fill: C.white, bar: i % 2 ? C.blue : C.gold });
    addText(slide, b[0], x + 0.28, y + 0.18, 0.45, 0.36, { fontFace: "Arial", fontSize: 20, bold: true, color: i % 2 ? C.blue : C.gold, margin: 0 });
    addText(slide, b[1], x + 0.85, y + 0.24, 1.3, 0.22, { fontSize: 12, bold: true, color: C.navy, margin: 0 });
    const items = splitSentences(b[2]).slice(0, 5).map(v => v.replace(/^①|②|③|④|⑤/, ""));
    addText(slide, items.join("\n"), x + 0.34, y + 0.68, 4.48, 0.9, { fontSize: 7.8, color: C.text, fit: "shrink", paraSpaceAfterPt: 2 });
  });
}

function flowSlide(s) {
  const slide = pptx.addSlide();
  addBase(slide, s.slide, sectionOf(s.slide));
  titleBlock(slide, sectionOf(s.slide), mainTitle(s));
  const t = s.texts;
  const nodes = s.slide === 13
    ? ["名师IP矩阵\n让别人知道", "四级门店\n就近服务", "B端合作\n批量锁量", "集训冲刺\n确保成绩", "品牌信任\n反哺增长"]
    : s.slide === 22
      ? ["衔接段", "初中段", "高中段", "录取"]
      : ["IP获客", "门店承接", "渠道锁量", "集训交付", "录取反哺"];
  nodes.forEach((n, i) => {
    const x = 0.85 + i * (11.3 / nodes.length);
    card(slide, x, 2.05, 1.78, 0.92, { fill: i % 2 ? C.paleBlue : C.white, bar: i % 2 ? C.blue : C.gold });
    addText(slide, n, x + 0.13, 2.28, 1.5, 0.32, { fontSize: 10.5, bold: true, color: C.navy, align: "center", valign: "mid" });
    if (i < nodes.length - 1) {
      slide.addShape(pptx.ShapeType.line, { x: x + 1.9, y: 2.51, w: 0.55, h: 0, line: { color: C.blue, width: 1.4, endArrowType: "triangle" } });
    }
  });
  const body = splitSentences(t.slice(2).join(""));
  const cols = chunks(body, Math.ceil(body.length / 2));
  cols.forEach((col, i) => {
    card(slide, 0.88 + i * 5.95, 3.55, 5.18, 1.9, { fill: C.white, bar: i ? C.blue : C.gold });
    addText(slide, col.join("\n"), 1.16 + i * 5.95, 3.86, 4.52, 1.15, { fontSize: 8.7, color: C.text, fit: "shrink" });
  });
}

function orgChartSlide(s) {
  const slide = pptx.addSlide();
  addBase(slide, s.slide, sectionOf(s.slide));
  titleBlock(slide, "ORGANIZATION", "组织架构图");
  function node(text, x, y, w, h, fill = C.white) {
    card(slide, x, y, w, h, { fill, bar: fill === C.white ? C.gold : C.gold });
    addText(slide, text, x + 0.08, y + 0.13, w - 0.16, h - 0.2, { fontSize: 9.8, bold: true, color: fill === C.navy ? C.white : C.navy, align: "center", valign: "mid" });
  }
  node("总经理", 5.42, 1.58, 1.8, 0.55, C.navy);
  const deps = [["教学部\n教学总监", 1.0], ["规划部\n规划总监", 4.05], ["运营部\n运营总监", 7.1], ["办公室\n办公室主任", 10.15]];
  deps.forEach(d => { node(d[0], d[1], 2.65, 1.82, 0.62); slide.addShape(pptx.ShapeType.line, { x: 6.32, y: 2.13, w: d[1] + 0.91 - 6.32, h: 0.52, line: { color: C.blue, width: 1.0 } }); });
  [["专业课", "文化课", "教务"], ["课程顾问", "学生档案", "政策数据"], ["一级门店", "二级门店", "三/四级门店", "集训校区"], ["财务", "人事", "人员中心"]].forEach((arr, ci) => {
    arr.forEach((a, ri) => node(a, 0.9 + ci * 3.05, 3.75 + ri * 0.65, 1.95, 0.44, C.white));
  });
}

function finalSlide(s) {
  const slide = pptx.addSlide();
  slide.background = { color: C.navy };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.navy }, line: { color: C.navy, transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 8.65, y: 0, w: 4.7, h: H, fill: { color: "173F61" }, line: { color: "173F61", transparency: 100 } });
  slide.addShape(pptx.ShapeType.rect, { x: 0.88, y: 1.1, w: 0.08, h: 5.1, fill: { color: C.gold }, line: { color: C.gold, transparency: 100 } });
  addText(slide, clean(s.texts), 1.24, 2.56, 5.6, 0.86, { fontSize: 34, bold: true, color: C.white, margin: 0 });
  addText(slide, "MUQING ART EDUCATION", 1.27, 3.82, 3.2, 0.22, { fontFace: "Arial", fontSize: 9, bold: true, color: C.gold, margin: 0 });
}

function makeGenericSlide(s) {
  const slide = pptx.addSlide();
  addBase(slide, s.slide, sectionOf(s.slide));
  const title = mainTitle(s);
  titleBlock(slide, sectionOf(s.slide), title, { size: title.length > 14 ? 20 : 24 });
  let bodyTokens = s.texts.slice(1);
  if (bodyTokens.length > 1 && clean(bodyTokens.slice(0, 3)).includes(title.replace(/\s/g, ""))) bodyTokens = bodyTokens.slice(3);
  const body = splitSentences(bodyTokens.join(""));

  if (body.length <= 4) {
    card(slide, 0.85, 1.92, 5.62, 3.55, { fill: C.navy, lineTransparency: 100 });
    addText(slide, body.join("\n"), 1.25, 2.35, 4.85, 2.35, { fontSize: 14, bold: true, color: C.white, fit: "shrink", paraSpaceAfterPt: 8 });
    for (let i = 0; i < 4; i++) card(slide, 7.08, 1.92 + i * 0.9, 4.35, 0.56, { fill: i % 2 ? C.paleBlue : C.white, bar: i % 2 ? C.blue : C.gold });
    return;
  }

  const colCount = body.length > 10 ? 3 : 2;
  const per = Math.ceil(body.length / colCount);
  const cols = chunks(body, per);
  cols.forEach((col, i) => {
    const x = 0.78 + i * (11.8 / colCount);
    const w = colCount === 3 ? 3.45 : 5.45;
    card(slide, x, 1.82, w, 4.8, { fill: i === 0 ? C.navy : C.white, bar: i % 2 ? C.blue : C.gold });
    addText(slide, col.join("\n"), x + 0.28, 2.12, w - 0.55, 3.85, {
      fontSize: colCount === 3 ? 8.2 : 9.5,
      color: i === 0 ? C.white : C.text,
      fit: "shrink",
      paraSpaceAfterPt: 4,
    });
  });
}

function makeTableOrGeneric(s) {
  const t = s.texts;
  const slide = pptx.addSlide();
  addBase(slide, s.slide, sectionOf(s.slide));
  titleBlock(slide, sectionOf(s.slide), mainTitle(s), { size: 22 });

  const defs = {
    16: { headers: ["级别", "面积", "容量", "功能定位", "拓展方式", "预算", "2年目标"], seq: ["级别", "面积", "容量（人次）", "功能定位", "拓展方式", "单店预算", "2年目标"] },
    17: { headers: ["项目", "数值", "说明"], seq: ["项目", "数值", "说明"] },
    18: { headers: ["项目", "说明"], seq: ["项目", "说明"] },
    19: { headers: ["项目", "说明"], seq: ["项目", "说明"] },
    20: { headers: ["维度", "核心要点"], seq: ["维度", "核心要点"] },
    23: { headers: ["学段", "年级", "核心目标", "专业课", "文化课", "时间安排", "空间载体", "收费模式"], seq: ["学段", "年级", "核心目标", "专业课", "文化课", "时间安排", "空间载体", "收费模式"] },
    24: { headers: ["业务模块", "具体内容", "时间安排", "空间载体", "收费说明"], seq: ["业务模块", "具体内容", "时间安排", "空间载体", "收费说明"] },
    25: { headers: ["年级", "专业课", "文化课", "时间安排", "空间载体", "收费模式"], seq: ["年级", "专业课", "文化课", "时间安排", "空间载体", "收费模式"] },
    26: { headers: ["年级", "学生类型", "专业课", "文化课", "时间安排", "空间载体", "收费模式"], seq: ["年级", "学生类型", "专业课", "文化课", "时间安排", "空间载体", "收费模式"] },
    29: { headers: ["产品线", "学段", "定价（元）", "参考价（元）", "备注"], seq: ["产品线", "学段", "定价（元）", "第一梯队参考价（元）", "备注"] },
    30: { headers: ["优惠类型", "适用产品", "折扣幅度", "条件"], seq: ["优惠类型", "适用产品", "折扣幅度", "条件"] },
    31: { headers: ["维度", "策略"], seq: ["维度", "策略"] },
    35: { headers: ["职责", "具体内容"], seq: ["职责", "具体内容"] },
    36: { headers: ["岗位/模块", "职责"], seq: ["岗位", "/", "模块", "职责"] },
    37: { headers: ["职责", "具体内容"], seq: ["职责", "具体内容"] },
    38: { headers: ["阶段", "职责与设置"], seq: ["阶段", "职责与设置"] },
    39: { headers: ["问题", "解决方案"], seq: ["问题", "解决方案"] },
    40: { headers: ["原则", "体现"], seq: ["原则", "体现"] },
    42: { headers: ["维度", "指标", "2029年目标", "说明"], seq: ["维度", "指标", "2029年目标", "说明", "维度", "指标", "2029年目标", "说明"] },
    43: { headers: ["季度", "时间", "工作重点", "具体任务", "交付物/验收标准", "负责人"], seq: ["季度", "时间", "工作重点", "具体任务", "交付物", "/", "验收标准", "负责人"] },
    44: { headers: ["收入来源", "预计金额（万）", "说明"], seq: ["收入来源", "预计金额（万）", "说明"] },
    45: { headers: ["成本项", "预计金额（万）", "说明"], seq: ["成本项", "预计金额（万）", "说明"] },
    46: { headers: ["项目", "金额（万）", "说明"], seq: ["项目", "金额（万）", "说明"] },
    47: { headers: ["核心任务", "成功标准", "风险预案"], seq: ["核心任务", "成功标准", "风险预案"] },
  };
  const def = defs[s.slide];
  if (!def) {
    pptx._slides.pop();
    makeGenericSlide(s);
    return;
  }

  const headers = def.headers;
  let rows = tableRowsFromTokens(t, def.seq, headers.length);
  if (s.slide === 29) rows = rows.slice(0, 15);
  let intro = splitSentences(t.slice(2, Math.max(2, t.indexOf(headers[0]))).join(""));
  if ([42, 43].includes(s.slide)) intro = [];
  if (intro.length) addText(slide, intro.join(" "), 0.82, 1.62, 11.4, 0.38, { fontSize: 9.5, color: C.muted, fit: "shrink" });
  const fontSize = headers.length >= 6 ? 5.3 : rows.length > 8 ? 5.8 : 7.1;
  const y = intro.length ? 2.08 : 1.72;
  const h = 6.66 - y;
  addPptTable(slide, headers, rows, 0.72, y, 11.9, h, { fontSize, maxRows: rows.length });
}

for (const s of inv) {
  if (s.slide === 1) coverSlide(s);
  else if (s.slide === 2) agendaSlide(s);
  else if ([3, 11, 21, 27, 32, 41].includes(s.slide)) sectionSlide(s);
  else if (s.slide === 9) swotSlide(s);
  else if ([13, 22].includes(s.slide)) flowSlide(s);
  else if (s.slide === 33) orgChartSlide(s);
  else if (s.slide === 48) finalSlide(s);
  else if ([14, 15, 16, 17, 18, 19, 20, 23, 24, 25, 26, 29, 30, 31, 35, 36, 37, 38, 39, 40, 42, 43, 44, 45, 46, 47].includes(s.slide)) makeTableOrGeneric(s);
  else makeGenericSlide(s);
}

const out = path.join(outDir, "美术教育商业计划书_简约藏青蓝重排版.pptx");
await pptx.writeFile({ fileName: out });
console.log(out);
