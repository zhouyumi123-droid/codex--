import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import JSZip from "jszip";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "04_课程卖点统筹");
const sourceXlsx = path.join(outDir, "课程卖点信息采集汇总表_第一轮补充版.xlsx");
const outXlsx = path.join(outDir, "八门课程宣传册结构补齐采集表_按深美DSE参考.xlsx");
const outPptx = path.join(outDir, "八门课程宣传册结构补齐会议版.pptx");
const outMd = path.join(outDir, "八门课程宣传册结构补齐沟通说明.md");

const courses = [
  { name: "OSSD", owner: "金校" },
  { name: "韩国课程", owner: "金校" },
  { name: "日本课程", owner: "金校" },
  { name: "AP课程", owner: "金校" },
  { name: "新加坡课程", owner: "金校" },
  { name: "A-Level", owner: "alizer" },
  { name: "IG", owner: "alizer" },
  { name: "DSE", owner: "alizer/金校待确认" },
];

const modules = [
  {
    id: "01",
    name: "学校简介与信任背书",
    ref: "先建立学校可信度：办学时间、官方资质、校区、课程体系、校园设施、教育理念。",
    target: "作为每本课程册子的开篇，统一说明“为什么这所学校可信”。",
    keys: ["竞争", "不能写"],
    must: "确认各课程可共用的学校简介、荣誉、办学资质、校园图片、是否可公开使用。",
  },
  {
    id: "02",
    name: "课程介绍",
    ref: "清楚说明这是什么课程、面向谁、学什么、按什么考试/课程标准运行。",
    target: "解决家长第一眼的判断：这门课适不适合我的孩子。",
    keys: ["一句话", "主要面向", "适合年级", "核心课程模块", "考试或评价"],
    must: "补齐课程定位、招生对象、年级路径、核心科目、教材/考试局/课程标准。",
  },
  {
    id: "03",
    name: "课程优势",
    ref: "把课程本身的制度优势拆开写：路径优势、考试优势、选科优势、认可度优势。",
    target: "从“课程为什么值得选”形成招生说服力。",
    keys: ["优势1", "优势2", "优势3", "可用于宣传的短句"],
    must: "补齐3-5条真实优势，并说明优势背后的证据或机制。",
  },
  {
    id: "04",
    name: "为什么选择奥斯翰",
    ref: "把本校卖点具体化：团队、成果、管理、升学、资源、个性化支持。",
    target: "避免只讲课程通用优势，要讲奥斯翰相对竞品的差异。",
    keys: ["优势1", "优势2", "优势3", "班级管理", "竞争"],
    must: "补齐本校独有优势、和同类学校/机构相比的差异、不能夸大的边界。",
  },
  {
    id: "05",
    name: "英语/语言与个性化支持",
    ref: "深美DSE单独写英文个性化支持，包括分层、课后辅导、活动、沉浸式环境。",
    target: "每门课都要说明学生薄弱项如何被支持，而不是只列课程名。",
    keys: ["班级管理", "核心课程模块", "优势"],
    must: "补齐英语/小语种/学术能力分层、课后辅导、补弱机制、活动支持。",
  },
  {
    id: "06",
    name: "课程规划",
    ref: "按阶段写学习路线：适应、巩固、梳理、冲刺，每阶段有任务。",
    target: "让家长看到三年或两年的清晰路径。",
    keys: ["学制", "入学到升学路径", "适合年级"],
    must: "补齐年级时间轴、每学期任务、何时选课/考试/申请/冲刺。",
  },
  {
    id: "07",
    name: "课程时间表",
    ref: "展示日课表、增益课堂、晚自习、阶段性活动或假期补习。",
    target: "让课程从概念变成可感知的日常学习安排。",
    keys: ["班级管理", "学制"],
    must: "必须补：日课表/周课表、晚自习、模考、增益课、假期安排。",
  },
  {
    id: "08",
    name: "师资团队",
    ref: "展示校长、课程顾问、学科教师、升学老师的背景与经验。",
    target: "建立专业可信度，是册子里非常关键的篇幅。",
    keys: ["师资"],
    must: "补齐教师姓名/岗位/学历/教龄/课程经验/是否可放照片/是否可公开。",
  },
  {
    id: "09",
    name: "录取成果与学生案例",
    ref: "展示录取院校、奖学金、录取率、具体学生案例。",
    target: "提供最强信任证据；没有课程成果时要改写为学校整体成果和目标路径。",
    keys: ["学生案例", "升学结果"],
    must: "补齐可公开成果、学生案例、年份、院校、专业、奖学金；没有则明确不能写成课程成果。",
  },
  {
    id: "10",
    name: "升学方向",
    ref: "拆成国家/地区/院校类型/专业方向，给家长选择感。",
    target: "说明读完这门课可以去哪里。",
    keys: ["主要升学方向"],
    must: "补齐可申请国家地区、目标院校层级、代表院校、专业方向、身份限制。",
  },
  {
    id: "11",
    name: "升学支持",
    ref: "写清楚择校、文书、面试、时间节点、申请系统、材料指导。",
    target: "说明学校不是只教课，还负责把学生送到申请终点。",
    keys: ["升学指导", "入学到升学路径"],
    must: "补齐升学老师、申请系统支持、文书/面试/选校服务、家校沟通节点。",
  },
  {
    id: "12",
    name: "校园风光与设施",
    ref: "展示宿舍、饭堂、教室、图书馆、活动、社团、实验/艺术空间。",
    target: "支撑线下册子的画面和生活场景。",
    keys: ["合作资源", "班级管理"],
    must: "补齐可用图片清单：教室、宿舍、饭堂、图书馆、活动、课程课堂、学生照片授权。",
  },
  {
    id: "13",
    name: "入学要求与收费",
    ref: "列招生对象、选拔标准、申请流程、学费、住宿、餐食、杂费。",
    target: "把咨询转成报名动作，避免招生老师反复口头解释。",
    keys: ["主要面向", "适合年级"],
    must: "必须补：招生对象、入学测试/面试、费用、住宿餐食、报名流程、截止时间。",
  },
];

const commonSchoolBase =
  "可共用初稿：奥斯翰为深圳本土办学20余年的全日制学校，2004年经深圳市教育局批准设立，具备多课程出口和升学路径选择。荣誉、资质、校区、图片需由学校确认最新口径。";

const presetByCourse = {
  OSSD: "建议表达方向（待确认）：以加拿大安大略省高中课程体系为主线，强调学分制、过程性评价、加拿大/全球大学申请路径和英语学术能力建设。",
  DSE: "建议表达方向（待确认）：以HKDSE香港中学文凭考试为主线，强调中文作答优势、灵活选科、香港/澳门/内地免试/海外多路径升学。",
  "韩国课程": "可基于第一轮资料写成：TOPIK分阶段学习、韩语沉浸、韩国本科申请、韩国院校交流资源与真实录取成果。",
  "日本课程": "可基于第一轮资料写成：日语分层、JLPT/NAT/EJU备考、日本本科申请、面试与签证服务。",
  "AP课程": "可基于第一轮资料写成：College Board授权、AP全球认可、G7-G12分段培养、AP/SAT/申请规划。",
  "新加坡课程": "可基于第一轮资料写成：IFD预科、英语强化、2+2本科衔接、新加坡合作院校与冲刺路径。",
  "A-Level": "可基于第一轮资料写成：英式高中课程、考试局体系、G10-IGCSE衔接、英港澳加等方向申请。",
  IG: "可基于第一轮资料写成：PP+IGCSE衔接、初中到高中的国际课程缓冲、多方向分流基础。",
};

function normalize(v) {
  if (v == null) return "";
  if (typeof v === "object") return v.text || v.result || JSON.stringify(v);
  return String(v).trim();
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function short(s, n = 120) {
  const t = normalize(s).replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function readRows(ws) {
  const rows = [];
  for (let r = 4; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const item = {
      module: normalize(row.getCell(1).value),
      question: normalize(row.getCell(2).value),
      content: normalize(row.getCell(3).value),
      evidence: normalize(row.getCell(4).value),
      publicStatus: normalize(row.getCell(5).value),
      confirm: normalize(row.getCell(6).value),
      priority: normalize(row.getCell(7).value),
      remark: normalize(row.getCell(8).value),
    };
    if (item.question || item.content) rows.push(item);
  }
  return rows;
}

function findByKeys(rows, keys) {
  const found = rows.filter((row) => keys.some((key) => row.question.includes(key)));
  return found.map((row) => `${row.question}：${row.content}`).filter(Boolean);
}

function statusFor(course, mod, existing) {
  const text = existing.join(" ");
  if (mod.id === "01") return "共通可用";
  if (["07", "12", "13"].includes(mod.id)) return "缺关键资料";
  if (!text || /暂无资料|暂无Word|待.*补充|待.*确认/.test(text)) return "待补充";
  if (/需补充|需.*核对|待确认|暂无|必须/.test(text)) return "待核对";
  if (course === "OSSD" || course === "DSE") return "待补充";
  return "已有初稿";
}

function needFor(course, mod, status) {
  if (mod.id === "01") return "确认学校统一简介、荣誉、资质、校园图片是否可公开，后续八本册子共用。";
  if (course === "OSSD") return `${mod.must} 当前OSSD几乎无一手资料，请金校按本模块补齐。`;
  if (course === "DSE") return `${mod.must} 当前只有竞品参考结构，需负责人提供奥斯翰真实DSE口径。`;
  if (status === "缺关键资料") return `${mod.must} 这是所有课程册子从“文案”变成“完整册子”最缺的部分。`;
  if (status === "待核对") return `${mod.must} 第一轮已有内容，但需要确认是否准确、是否可公开。`;
  return `${mod.must} 如已有，请补证据、图片、可公开口径；如没有，请写“暂无”。`;
}

function fillCell(cell, opts = {}) {
  cell.font = { name: "微软雅黑", size: opts.size || 10, bold: !!opts.bold, color: { argb: opts.color || "FF1F2937" } };
  cell.alignment = { vertical: "middle", horizontal: opts.align || "left", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "FFD9E2EC" } },
    left: { style: "thin", color: { argb: "FFD9E2EC" } },
    bottom: { style: "thin", color: { argb: "FFD9E2EC" } },
    right: { style: "thin", color: { argb: "FFD9E2EC" } },
  };
  if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
}

const statusFill = {
  "已有初稿": "FFDFF3E3",
  "待核对": "FFFFF2CC",
  "待补充": "FFFFE4D6",
  "缺关键资料": "FFFFD7D7",
  "共通可用": "FFDCEBFF",
};

function styleSheet(ws) {
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.eachRow((row, rowNumber) => {
    row.eachCell((cell) => fillCell(cell, { fill: rowNumber === 1 ? "FF223047" : undefined, color: rowNumber === 1 ? "FFFFFFFF" : "FF1F2937", bold: rowNumber === 1 }));
  });
}

function addLongTable(ws, rows) {
  ws.columns = [
    { header: "课程", width: 14 },
    { header: "负责人", width: 14 },
    { header: "册子模块", width: 22 },
    { header: "参考册子标准", width: 38 },
    { header: "现有内容/第一轮基础", width: 52 },
    { header: "可预设表达方向", width: 42 },
    { header: "还需要负责人补充", width: 50 },
    { header: "状态", width: 12 },
    { header: "负责人填写区", width: 44 },
    { header: "证据/图片/附件", width: 32 },
    { header: "是否可公开", width: 14 },
  ];
  rows.forEach((r) => ws.addRow(r));
  styleSheet(ws);
  ws.eachRow((row, i) => {
    if (i === 1) return;
    row.height = 72;
    const status = normalize(row.getCell(8).value);
    row.getCell(8).fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusFill[status] || "FFF8FAFC" } };
    row.getCell(9).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    row.getCell(10).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    row.getCell(11).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
  });
  ws.autoFilter = "A1:K1";
}

function makeBox(id, x, y, w, h, text, fill = "FFFFFF", color = "1F2937", size = 1600, bold = false) {
  const emu = 914400;
  const lines = String(text).split("\n");
  const ps = lines
    .map(
      (line) => `<a:p><a:r><a:rPr lang="zh-CN" sz="${size}"${bold ? ' b="1"' : ""}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Microsoft YaHei"/><a:ea typeface="Microsoft YaHei"/></a:rPr><a:t>${esc(line)}</a:t></a:r></a:p>`,
    )
    .join("");
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Box ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${Math.round(x * emu)}" y="${Math.round(y * emu)}"/><a:ext cx="${Math.round(w * emu)}" cy="${Math.round(h * emu)}"/></a:xfrm><a:prstGeom prst="roundRect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="D9E2EC"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="91440" tIns="68580" rIns="91440" bIns="68580"/><a:lstStyle/>${ps}</p:txBody></p:sp>`;
}

function makeSlideXml(shapes) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

async function createPptx(summaryRows, longRows) {
  const zip = new JSZip();
  const slideXmls = [];
  let sid = 2;
  const title = (t, sub = "") => [
    makeBox(sid++, 0.4, 0.3, 12.5, 0.8, t, "223047", "FFFFFF", 2600, true),
    sub ? makeBox(sid++, 0.55, 1.15, 12.2, 0.55, sub, "F8FAFC", "475569", 1350, false) : "",
  ];

  slideXmls.push(makeSlideXml([
    makeBox(sid++, 0.55, 0.5, 12.2, 1.05, "八门课程宣传册结构补齐工作包", "223047", "FFFFFF", 3000, true),
    makeBox(sid++, 0.8, 1.85, 11.7, 1.2, "目标：把深美DSE那种“完整课程介绍册”的结构，复制成奥斯翰八门课程统一标准。\n方法：第一轮资料 + 预设表达 + 负责人补充 + 后续素材动作，最终形成八本可定稿课程文档。", "FFFFFF", "1F2937", 1650),
    makeBox(sid++, 0.8, 3.45, 3.6, 1.3, "PPT\n用于开会对齐差距", "DCEBFF", "1E3A8A", 1800, true),
    makeBox(sid++, 4.9, 3.45, 3.6, 1.3, "Excel\n用于逐项填写补齐", "FFF2CC", "7A4B00", 1800, true),
    makeBox(sid++, 9.0, 3.45, 3.3, 1.3, "最终文案\n生成八门课程册子", "DFF3E3", "166534", 1800, true),
  ]));

  slideXmls.push(makeSlideXml([
    ...title("统一宣传册结构：13个必备模块", "深美DSE不是只做DSE参考，而是给八门课程建立“完整课程册子”的标准。"),
    ...modules.slice(0, 7).map((m, i) => makeBox(sid++, 0.55 + (i % 2) * 6.25, 1.85 + Math.floor(i / 2) * 0.95, 5.9, 0.72, `${m.id} ${m.name}`, i < 4 ? "DCEBFF" : "F8FAFC", "1F2937", 1350, true)),
    ...modules.slice(7).map((m, i) => makeBox(sid++, 0.55 + (i % 2) * 6.25, 5.2 + Math.floor(i / 2) * 0.95, 5.9, 0.72, `${m.id} ${m.name}`, i < 2 ? "FFE4D6" : "F8FAFC", "1F2937", 1350, true)),
  ]));

  const heatShapes = title("八门课程当前完整度总览", "绿色=已有初稿；黄色=待核对；橙色=待补充；红色=缺关键资料。");
  summaryRows.forEach((r, i) => {
    const x = 0.55 + (i % 4) * 3.2;
    const y = 1.75 + Math.floor(i / 4) * 2.15;
    heatShapes.push(makeBox(sid++, x, y, 2.95, 1.75, `${r.course}\n负责人：${r.owner}\n已有 ${r.ready} / 待补 ${r.pending} / 缺关键 ${r.critical}`, r.critical > 2 ? "FFE4D6" : "DFF3E3", "1F2937", 1300, true));
  });
  slideXmls.push(makeSlideXml(heatShapes));

  const jin = longRows.filter((r) => r[1] === "金校" && ["缺关键资料", "待补充", "待核对"].includes(r[7])).slice(0, 7);
  slideXmls.push(makeSlideXml([
    ...title("金校补充重点", "OSSD、韩国、日本、AP、新加坡需要按统一册子结构补齐，重点不是重复第一轮表，而是补成可写册子的证据和素材。"),
    ...jin.map((r, i) => makeBox(sid++, 0.65, 1.85 + i * 0.66, 12.0, 0.52, `${r[0]}｜${r[2]}：${short(r[6], 68)}`, statusFill[r[7]]?.slice(2) || "F8FAFC", "1F2937", 1150)),
  ]));

  const ali = longRows.filter((r) => String(r[1]).includes("alizer") && ["缺关键资料", "待补充", "待核对"].includes(r[7])).slice(0, 7);
  slideXmls.push(makeSlideXml([
    ...title("alizer补充重点", "A-Level、IG、DSE要补的不只是课程介绍，还要补师资、课表、成果、升学支持、入学收费这些册子级内容。"),
    ...ali.map((r, i) => makeBox(sid++, 0.65, 1.85 + i * 0.66, 12.0, 0.52, `${r[0]}｜${r[2]}：${short(r[6], 68)}`, statusFill[r[7]]?.slice(2) || "F8FAFC", "1F2937", 1150)),
  ]));

  slideXmls.push(makeSlideXml([
    ...title("负责人填写方式", "发给负责人时，不要求他们写文案，而是让他们补事实、机制、证据、素材和禁区。"),
    makeBox(sid++, 0.75, 1.75, 5.7, 1.05, "1. 有资料：直接贴真实内容\n2. 没资料但会有：写预计补充时间和负责人\n3. 不确定：写“待确认”，不要硬写", "DCEBFF", "1E3A8A", 1500, true),
    makeBox(sid++, 6.9, 1.75, 5.7, 1.05, "4. 不能宣传：直接写不能写\n5. 成果/合作/录取率：必须给证据\n6. 图片/老师/学生案例：确认授权", "FFF2CC", "7A4B00", 1500, true),
    makeBox(sid++, 0.75, 3.4, 11.85, 1.25, "最适合发出的文件：Excel《八门课程宣传册结构补齐采集表_按深美DSE参考》。\nPPT用于会议说明，不建议让负责人只在PPT里填写，因为后续不好汇总成八本文案。", "FFFFFF", "1F2937", 1550),
  ]));

  slideXmls.push(makeSlideXml([
    ...title("后续产出路径", "补齐之后，我这边可以继续把内容统筹成最终招生文案。"),
    makeBox(sid++, 0.8, 1.8, 2.8, 1.25, "第一步\n负责人补齐Excel", "DCEBFF", "1E3A8A", 1700, true),
    makeBox(sid++, 3.95, 1.8, 2.8, 1.25, "第二步\n周玉田统筹确认", "FFF2CC", "7A4B00", 1700, true),
    makeBox(sid++, 7.1, 1.8, 2.8, 1.25, "第三步\n八门课程册子文案", "DFF3E3", "166534", 1700, true),
    makeBox(sid++, 10.25, 1.8, 2.4, 1.25, "第四步\n公众号/PPT/设计交付", "FFE4D6", "9A3412", 1600, true),
    makeBox(sid++, 0.8, 3.65, 11.85, 1.35, "册子文案定稿时，每门课都按13个模块写，但篇幅可以按课程实际强弱调整：成果强的多写成果，资料弱的先写路径和支持，缺证据的绝不写成确定承诺。", "F8FAFC", "1F2937", 1500),
  ]));

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${slideXmls.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst><p:sldIdLst>${slideXmls.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slideXmls.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("")}<Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Oxstand"><a:themeElements><a:clrScheme name="Oxstand"><a:dk1><a:srgbClr val="1F2937"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="223047"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="F59E0B"/></a:accent2><a:accent3><a:srgbClr val="16A34A"/></a:accent3><a:accent4><a:srgbClr val="DC2626"/></a:accent4><a:accent5><a:srgbClr val="7C3AED"/></a:accent5><a:accent6><a:srgbClr val="0891B2"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme><a:fontScheme name="Oxstand"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:minorFont></a:fontScheme><a:fmtScheme name="Oxstand"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`);
  slideXmls.forEach((xml, i) => {
    zip.file(`ppt/slides/slide${i + 1}.xml`, xml);
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`);
  });
  const buffer = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" });
  fs.writeFileSync(outPptx, buffer);
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const source = new ExcelJS.Workbook();
  await source.xlsx.readFile(sourceXlsx);

  const courseRows = new Map();
  for (const c of courses) {
    const ws = source.getWorksheet(c.name);
    courseRows.set(c.name, ws ? readRows(ws) : []);
  }

  const longRows = [];
  const summaryRows = [];
  for (const course of courses) {
    let ready = 0;
    let pending = 0;
    let critical = 0;
    for (const mod of modules) {
      const rows = courseRows.get(course.name) || [];
      let existing = findByKeys(rows, mod.keys);
      if (mod.id === "01") existing = [commonSchoolBase];
      const status = statusFor(course.name, mod, existing);
      if (status === "已有初稿" || status === "共通可用") ready++;
      else if (status === "缺关键资料") critical++;
      else pending++;
      longRows.push([
        course.name,
        course.owner,
        `${mod.id} ${mod.name}`,
        `${mod.ref}\n用途：${mod.target}`,
        existing.length ? existing.map((x) => short(x, 180)).join("\n") : "第一轮暂无直接对应内容。",
        mod.id === "01" ? commonSchoolBase : presetByCourse[course.name],
        needFor(course.name, mod, status),
        status,
        "",
        "",
        "",
      ]);
    }
    summaryRows.push({ course: course.name, owner: course.owner, ready, pending, critical });
  }

  const wb = new ExcelJS.Workbook();
  wb.creator = "周玉田";
  wb.created = new Date();

  const guide = wb.addWorksheet("使用说明");
  guide.columns = [{ width: 22 }, { width: 90 }];
  guide.addRows([
    ["用途", "本工作包不是第一轮采集表的重复版，而是把深美宝安DSE册子的完整结构抽象为八门课程统一宣传册标准。"],
    ["推荐用法", "PPT用于会议说明信息差；Excel用于金校/alizer逐格补事实、证据、图片、公开口径和不能写的边界。"],
    ["填写原则", "负责人不需要写成宣传文案，只需要补真实内容、机制、证据、素材。没有就写暂无，预计会有就写预计补充时间。"],
    ["后续动作", "周玉田汇总确认后，再统一生成八门课程完整宣传册文案、公众号招生简章、宣讲PPT和设计交付文案。"],
    ["风险边界", "录取率、保录、直升、合作资源、名校推荐、师资头衔、学生案例必须有证据，未确认内容只能写建议表达或待确认。"],
  ]);
  guide.eachRow((row, i) => {
    row.height = 42;
    row.eachCell((cell, col) => fillCell(cell, { bold: col === 1, fill: i === 1 ? "FFDCEBFF" : undefined }));
  });

  const overview = wb.addWorksheet("八课差距总览");
  overview.columns = [{ header: "课程", width: 14 }, { header: "负责人", width: 16 }, ...modules.map((m) => ({ header: `${m.id} ${m.name}`, width: 16 })), { header: "已有/共通", width: 12 }, { header: "待补/待核", width: 12 }, { header: "缺关键", width: 12 }];
  for (const course of courses) {
    const cells = modules.map((mod) => {
      const existing = mod.id === "01" ? [commonSchoolBase] : findByKeys(courseRows.get(course.name) || [], mod.keys);
      return statusFor(course.name, mod, existing);
    });
    const s = summaryRows.find((x) => x.course === course.name);
    overview.addRow([course.name, course.owner, ...cells, s.ready, s.pending, s.critical]);
  }
  styleSheet(overview);
  overview.eachRow((row, i) => {
    if (i === 1) return;
    row.height = 38;
    for (let c = 3; c < 3 + modules.length; c++) {
      const status = normalize(row.getCell(c).value);
      row.getCell(c).fill = { type: "pattern", pattern: "solid", fgColor: { argb: statusFill[status] || "FFF8FAFC" } };
    }
  });

  const all = wb.addWorksheet("八门课程补齐总表");
  addLongTable(all, longRows);
  const jin = wb.addWorksheet("发给金校填写");
  addLongTable(jin, longRows.filter((r) => r[1] === "金校" || r[0] === "DSE"));
  const ali = wb.addWorksheet("发给alizer填写");
  addLongTable(ali, longRows.filter((r) => String(r[1]).includes("alizer")));

  for (const course of courses) {
    const ws = wb.addWorksheet(`${course.name}_册子结构`);
    addLongTable(ws, longRows.filter((r) => r[0] === course.name));
  }

  const catalog = wb.addWorksheet("最终册子目录模板");
  catalog.columns = [{ header: "顺序", width: 8 }, { header: "目录模块", width: 24 }, { header: "建议篇幅", width: 18 }, { header: "本页要回答的问题", width: 58 }, { header: "设计素材需求", width: 42 }];
  modules.forEach((m, i) =>
    catalog.addRow([
      i + 1,
      m.name,
      ["01", "02", "03", "04", "08", "09"].includes(m.id) ? "重点页" : "支撑页",
      `${m.ref}\n${m.target}`,
      m.id === "08" ? "教师照片/简介" : m.id === "09" ? "录取offer/学生授权/院校Logo" : m.id === "12" ? "校园、课堂、宿舍、活动图片" : "图标、流程图、数据或配图",
    ]),
  );
  styleSheet(catalog);
  catalog.eachRow((row, i) => { if (i > 1) row.height = 60; });

  await wb.xlsx.writeFile(outXlsx);
  await createPptx(summaryRows, longRows);

  const md = `# 八门课程宣传册结构补齐沟通说明

## 这次不是单独做DSE

深美宝安DSE资料的价值，是它提供了一门课程宣传册应该具备的完整结构。因此本次处理逻辑是：把这套结构变成奥斯翰八门课程的统一内容标准，再反推每门课程还缺哪些事实、证据、素材和公开口径。

## 建议文件组合

- PPT：用于下午会议说明“为什么要补、补到什么程度、每门课差在哪”。
- Excel：用于金校/alizer逐项填写，后续可直接汇总生成八门课程宣传册文案。

## 发给负责人的话术

金校/alizer，我们这次不是让大家重新写一遍课程介绍，而是要把每门课都补成一份完整宣传册的内容底稿。参考标准是一份成熟DSE课程册子的结构：学校背书、课程介绍、课程优势、为什么选择奥斯翰、语言/个性化支持、课程规划、课表、师资、成果、升学方向、升学支持、校园设施、入学要求与收费。

我已经把第一轮已有资料和需要补齐的地方放进Excel。请重点补四类内容：

1. 真实事实：课程怎么开、谁来教、学什么、怎么考、怎么申请。
2. 证据素材：老师简介、录取数据、学生案例、合作资源、图片。
3. 公开口径：哪些能写，哪些只能内部说，哪些不能承诺。
4. 未来动作：目前没有但马上会有的内容，请写预计补充时间。

没有资料的地方请直接写“暂无”；不确定的写“待确认”；涉及录取率、保录、合作资源、名校推荐、师资头衔的内容，请务必给证据。

## 输出文件

- ${outXlsx}
- ${outPptx}
`;
  fs.writeFileSync(outMd, md, "utf8");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
