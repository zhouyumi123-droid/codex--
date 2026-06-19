import fs from "fs";
import path from "path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageBreak,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import ExcelJS from "exceljs";

const root = path.resolve("03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付");
const jinDir = path.join(root, "02_金校_课程内容采集");
const alizerDir = path.join(root, "03_alizer_课程内容采集");
const summaryDir = path.join(root, "04_课程卖点统筹");
const designDir = path.join(root, "06_设计模板与视觉指引");

const people = [
  {
    name: "金校",
    role: "项目负责人",
    courses: ["OSSD", "韩国课程", "日本课程", "AP课程", "新加坡课程"],
    output: path.join(jinDir, "金校_课程卖点信息采集问答_填写版.docx"),
  },
  {
    name: "alizer",
    role: "项目负责人",
    courses: ["A-Level", "IG", "DSE"],
    output: path.join(alizerDir, "alizer_课程卖点信息采集问答_填写版.docx"),
  },
];

const border = { style: BorderStyle.SINGLE, size: 1, color: "D6DEE8" };
const borders = { top: border, bottom: border, left: border, right: border };

function tr(text, opts = {}) {
  return new TextRun({
    text,
    font: "Microsoft YaHei",
    size: opts.size ?? 21,
    bold: opts.bold ?? false,
    color: opts.color ?? "1F2937",
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    heading: opts.heading,
    alignment: opts.alignment,
    spacing: { before: opts.before ?? 80, after: opts.after ?? 80 },
    children: [tr(text, opts)],
  });
}

function cell(children, opts = {}) {
  return new TableCell({
    borders,
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    width: { size: opts.width ?? 3000, type: WidthType.DXA },
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: Array.isArray(children) ? children : [p(children, { size: opts.size ?? 20, bold: opts.bold ?? false })],
  });
}

function table(rows, widths) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: widths,
    rows,
  });
}

function headerRow(labels, widths) {
  return new TableRow({
    tableHeader: true,
    children: labels.map((label, i) =>
      cell([new Paragraph({ alignment: AlignmentType.CENTER, children: [tr(label, { bold: true, size: 20, color: "0F172A" })] })], {
        fill: "EAF2FF",
        width: widths[i],
      }),
    ),
  });
}

function blankLine(label, hint = "请填写") {
  return new TableRow({
    children: [
      cell(label, { width: 2200, fill: "F8FAFC", bold: true }),
      cell(hint, { width: 7200 }),
    ],
  });
}

function sectionTitle(text) {
  return p(text, { heading: HeadingLevel.HEADING_2, size: 26, bold: true, color: "123B73", before: 220, after: 120 });
}

function courseSection(course, first = false) {
  const children = [];
  if (!first) children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(p(`${course} 课程信息采集表`, { heading: HeadingLevel.HEADING_1, size: 32, bold: true, color: "0B2A4A" }));
  children.push(p("请尽量写事实、案例、机制和差异，不需要写成宣传文案。周玉田会统一提炼和改写。", { size: 20, color: "475569" }));

  children.push(sectionTitle("1. 课程基本定位"));
  children.push(
    table(
      [
        blankLine("课程名称", course),
        blankLine("一句话说明", "这是什么课程？解决什么问题？"),
        blankLine("主要面向学生", "例如：初三后转轨、普高转轨、目标海外本科等"),
        blankLine("适合年级/阶段", "例如：G9-G12 / 高一高二 / 初三毕业等"),
        blankLine("主要升学方向", "国家、地区、大学类型或专业方向"),
      ],
      [2200, 7200],
    ),
  );

  children.push(sectionTitle("2. 家长选择这门课程的核心理由"));
  children.push(p("请至少填写 3 条，优先写“奥斯翰能做到、别人不一定能做到”的点。", { size: 20, color: "475569" }));
  const advRows = [headerRow(["序号", "核心优势", "为什么重要", "证据/案例/机制"], [900, 2800, 2800, 2900])];
  for (let i = 1; i <= 5; i++) advRows.push(new TableRow({ children: [cell(String(i), { width: 900 }), cell("", { width: 2800 }), cell("", { width: 2800 }), cell("", { width: 2900 })] }));
  children.push(table(advRows, [900, 2800, 2800, 2900]));

  children.push(sectionTitle("3. 课程结构与学习路径"));
  children.push(
    table(
      [
        blankLine("学制/学习周期"),
        blankLine("核心课程模块"),
        blankLine("考试或评价方式"),
        blankLine("入学到升学路径"),
        blankLine("学习进度跟踪方式"),
      ],
      [2400, 7000],
    ),
  );

  children.push(sectionTitle("4. 奥斯翰支持体系"));
  children.push(
    table(
      [
        blankLine("师资/教学团队优势"),
        blankLine("班级管理/学业管理"),
        blankLine("升学指导方式"),
        blankLine("语言/学术能力提升"),
        blankLine("家校沟通机制"),
      ],
      [2400, 7000],
    ),
  );

  children.push(sectionTitle("5. 成果与证据"));
  children.push(
    table(
      [
        blankLine("学生案例", "能公开使用的案例，请注明是否可写姓名/年级/录取结果"),
        blankLine("升学结果", "可公开的数据、录取方向、代表性结果"),
        blankLine("合作资源", "合作院校、考试机构、课程资源等"),
        blankLine("过往成绩", "考试成绩、竞赛、升学、活动成果"),
        blankLine("图片/证书/截图/链接", "请列出文件名或发送方式"),
      ],
      [2400, 7000],
    ),
  );

  children.push(sectionTitle("6. 家长常见问题"));
  const faqRows = [headerRow(["问题", "建议回答"], [4700, 4700])];
  for (let i = 1; i <= 6; i++) faqRows.push(new TableRow({ children: [cell("", { width: 4700 }), cell("", { width: 4700 })] }));
  children.push(table(faqRows, [4700, 4700]));

  children.push(sectionTitle("7. 竞品对比与差异"));
  children.push(
    table(
      [
        blankLine("家长通常会比较谁", "学校/机构/课程/路径"),
        blankLine("奥斯翰差异是什么"),
        blankLine("我们不能说什么", "不能承诺、不能夸大、需要保守表达的内容"),
      ],
      [2400, 7000],
    ),
  );

  children.push(sectionTitle("8. 宣传风险边界"));
  children.push(
    table(
      [
        blankLine("不能写的升学承诺"),
        blankLine("暂不能公开的数据"),
        blankLine("需要校方确认的表述"),
        blankLine("必须保守表达的内容"),
      ],
      [2400, 7000],
    ),
  );

  children.push(sectionTitle("9. 可直接用于宣传的短句"));
  const sloganRows = [headerRow(["序号", "短句"], [900, 8500])];
  for (let i = 1; i <= 5; i++) sloganRows.push(new TableRow({ children: [cell(String(i), { width: 900 }), cell("", { width: 8500 })] }));
  children.push(table(sloganRows, [900, 8500]));

  return children;
}

async function createDoc(person) {
  const children = [
    p(`${person.name}课程卖点信息采集问答`, { heading: HeadingLevel.TITLE, size: 38, bold: true, alignment: AlignmentType.CENTER, color: "0B2A4A" }),
    p(`负责人：${person.name}    提交对象：周玉田    建议提交：2026-05-26 中午前`, { alignment: AlignmentType.CENTER, size: 20, color: "475569" }),
    p(`课程范围：${person.courses.join("、")}`, { alignment: AlignmentType.CENTER, size: 20, color: "475569" }),
    sectionTitle("填写说明"),
    p("1. 每门课程单独填写一套表，不需要写成长文。", { size: 21 }),
    p("2. 请优先填写事实、案例、机制、数据和差异化，不要只写口号。", { size: 21 }),
    p("3. 如果某项暂时没有，请写“暂无”或“待确认”，不要留空。", { size: 21 }),
    p("4. 周玉田会基于本表统一提炼为宣传册、公众号、PPT、易拉宝等内容。", { size: 21 }),
    ...person.courses.flatMap((course, i) => courseSection(course, i === 0)),
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Microsoft YaHei", size: 21 } } },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 38, bold: true, color: "0B2A4A" }, paragraph: { spacing: { after: 240 }, alignment: AlignmentType.CENTER } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 32, bold: true, color: "0B2A4A" }, paragraph: { spacing: { before: 260, after: 160 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 26, bold: true, color: "123B73" }, paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 1 } },
      ],
    },
    sections: [
      {
        properties: { page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } } },
        headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [tr("奥斯翰课程宣传物料内容采集", { size: 18, color: "64748B" })] })] }) },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [tr("第 ", { size: 18, color: "64748B" }), new TextRun({ children: [PageNumber.CURRENT], font: "Microsoft YaHei", size: 18, color: "64748B" }), tr(" 页", { size: 18, color: "64748B" })],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });
  fs.writeFileSync(person.output, await Packer.toBuffer(doc));
}

function styleCell(cell, opts = {}) {
  cell.font = { name: "微软雅黑", size: opts.size ?? 10, bold: opts.bold ?? false, color: { argb: opts.color ?? "FF1F2937" } };
  cell.alignment = { vertical: "middle", horizontal: opts.horizontal ?? "left", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "FFD6DEE8" } },
    left: { style: "thin", color: { argb: "FFD6DEE8" } },
    bottom: { style: "thin", color: { argb: "FFD6DEE8" } },
    right: { style: "thin", color: { argb: "FFD6DEE8" } },
  };
  if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
}

function setupSheet(ws, title) {
  ws.properties.defaultRowHeight = 24;
  ws.views = [{ state: "frozen", ySplit: 3 }];
  ws.mergeCells("A1:H1");
  ws.getCell("A1").value = title;
  styleCell(ws.getCell("A1"), { bold: true, size: 16, fill: "FFEAF2FF", horizontal: "center", color: "FF0B2A4A" });
  ws.getCell("A2").value = "填写原则：写事实、机制、案例和证据；暂无内容请写“待确认”；不要写夸大升学承诺。";
  ws.mergeCells("A2:H2");
  styleCell(ws.getCell("A2"), { fill: "FFF8FAFC", color: "FF475569" });
}

function addCourseSheet(wb, owner, course) {
  const ws = wb.addWorksheet(course.replace(/[\\/*?:[\]]/g, "-"));
  setupSheet(ws, `${owner} - ${course} 课程内容采集`);
  const headers = ["模块", "问题", "填写内容", "证据/附件", "是否可公开", "需谁确认", "优先级", "备注"];
  ws.addRow(headers);
  ws.getRow(3).eachCell((c) => styleCell(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  ws.columns = [
    { width: 18 },
    { width: 34 },
    { width: 48 },
    { width: 28 },
    { width: 14 },
    { width: 16 },
    { width: 12 },
    { width: 24 },
  ];
  const rows = [
    ["基本定位", "一句话说明这是什么课程", "", "", "是/否", "", "P0", ""],
    ["基本定位", "主要面向哪些学生", "", "", "是/否", "", "P0", ""],
    ["基本定位", "适合年级/阶段", "", "", "是/否", "", "P0", ""],
    ["基本定位", "主要升学方向", "", "", "是/否", "", "P0", ""],
    ["核心优势", "优势1：奥斯翰能做到、别人不一定能做到的点", "", "", "是/否", "", "P0", ""],
    ["核心优势", "优势2：奥斯翰能做到、别人不一定能做到的点", "", "", "是/否", "", "P0", ""],
    ["核心优势", "优势3：奥斯翰能做到、别人不一定能做到的点", "", "", "是/否", "", "P0", ""],
    ["课程结构", "学制/学习周期", "", "", "是/否", "", "P0", ""],
    ["课程结构", "核心课程模块", "", "", "是/否", "", "P0", ""],
    ["课程结构", "考试或评价方式", "", "", "是/否", "", "P0", ""],
    ["课程结构", "入学到升学路径", "", "", "是/否", "", "P0", ""],
    ["支持体系", "师资或教学团队优势", "", "", "是/否", "", "P0", ""],
    ["支持体系", "班级管理/学业管理方式", "", "", "是/否", "", "P0", ""],
    ["支持体系", "升学指导方式", "", "", "是/否", "", "P0", ""],
    ["证据成果", "学生案例", "", "", "是/否", "", "P1", ""],
    ["证据成果", "升学结果", "", "", "是/否", "", "P1", ""],
    ["证据成果", "合作资源/证书/图片/链接", "", "", "是/否", "", "P1", ""],
    ["家长问题", "家长最常问的问题及回答1", "", "", "是/否", "", "P1", ""],
    ["家长问题", "家长最常问的问题及回答2", "", "", "是/否", "", "P1", ""],
    ["竞品对比", "家长通常会拿谁比较？奥斯翰差异是什么？", "", "", "是/否", "", "P1", ""],
    ["风险边界", "不能写、不能承诺、需要保守表达的内容", "", "", "否", "", "P0", ""],
    ["宣传短句", "可用于宣传的短句1", "", "", "是/否", "", "P2", ""],
    ["宣传短句", "可用于宣传的短句2", "", "", "是/否", "", "P2", ""],
    ["宣传短句", "可用于宣传的短句3", "", "", "是/否", "", "P2", ""],
  ];
  rows.forEach((r) => ws.addRow(r));
  for (let i = 4; i <= ws.rowCount; i++) {
    ws.getRow(i).height = 36;
    ws.getRow(i).eachCell((c, col) => styleCell(c, { fill: col <= 2 ? "FFF8FAFC" : undefined }));
  }
  ws.autoFilter = "A3:H3";
  ["E", "G"].forEach((col) => {
    for (let r = 4; r <= ws.rowCount; r++) {
      ws.getCell(`${col}${r}`).dataValidation = col === "E"
        ? { type: "list", allowBlank: true, formulae: ['"是,否,待确认"'] }
        : { type: "list", allowBlank: true, formulae: ['"P0,P1,P2"'] };
    }
  });
}

async function createWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "周玉田";
  wb.created = new Date();
  const guide = wb.addWorksheet("填写说明");
  guide.columns = [{ width: 20 }, { width: 90 }];
  [
    ["用途", "本表用于收集8门课程的原始信息，方便周玉田统一提炼宣传册、公众号、PPT、易拉宝等内容。"],
    ["填写原则", "尽量填写事实、机制、案例和证据；没有的信息写“待确认”；不要只写口号。"],
    ["金校课程", "OSSD、韩国课程、日本课程、AP课程、新加坡课程"],
    ["alizer课程", "A-Level、IG、DSE"],
    ["提交建议", "2026-05-26 中午前提交第一版，5月27日补齐证据材料。"],
  ].forEach((r) => guide.addRow(r));
  guide.eachRow((row, idx) => row.eachCell((c) => styleCell(c, { bold: idx === 1, fill: idx === 1 ? "FFEAF2FF" : undefined })));

  people.forEach((person) => person.courses.forEach((course) => addCourseSheet(wb, person.name, course)));

  const design = wb.addWorksheet("设计排期参考");
  design.columns = [
    { width: 18 }, { width: 26 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 18 }, { width: 30 },
  ];
  design.addRow(["物料", "设计前需要内容", "预计设计周期", "最晚收稿时间", "最晚初稿时间", "最晚定稿时间", "备注"]);
  design.getRow(1).eachCell((c) => styleCell(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  [
    ["纸质宣传册", "目录、课程文案、图片、二维码、联系方式", "", "", "", "", ""],
    ["电子宣传册/PDF/H5", "定稿文案、移动端阅读要求、图片素材", "", "", "", "", ""],
    ["易拉宝/喷绘", "主标题、核心卖点、CTA、二维码", "", "", "", "", ""],
    ["展会背板/VI", "展会主题、主视觉口号、展位尺寸", "", "", "", "", ""],
    ["宣传单页", "短文案、课程卖点、联系方式", "", "", "", "", ""],
  ].forEach((r) => design.addRow(r));
  design.eachRow((row, idx) => row.eachCell((c) => styleCell(c, { fill: idx > 1 && c.col <= 2 ? "FFF8FAFC" : undefined })));

  await wb.xlsx.writeFile(path.join(summaryDir, "课程卖点信息采集汇总表_填写版.xlsx"));
}

async function createDesignWorkbook() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "周玉田";
  wb.created = new Date();
  const ws = wb.addWorksheet("设计排期表");
  ws.columns = [
    { width: 18 },
    { width: 36 },
    { width: 16 },
    { width: 18 },
    { width: 18 },
    { width: 18 },
    { width: 20 },
    { width: 30 },
  ];
  ws.mergeCells("A1:H1");
  ws.getCell("A1").value = "孙吴华设计排期与内容交接表";
  styleCell(ws.getCell("A1"), { bold: true, size: 16, fill: "FFEAF2FF", horizontal: "center", color: "FF0B2A4A" });
  ws.mergeCells("A2:H2");
  ws.getCell("A2").value = "用途：请孙吴华在5月26日前填写预计周期、最晚收稿时间、初稿时间和定稿时间，方便品宣端倒排内容交付。";
  styleCell(ws.getCell("A2"), { fill: "FFF8FAFC", color: "FF475569" });
  ws.addRow(["物料", "设计前需要内容", "预计设计周期", "最晚收稿时间", "最晚初稿时间", "最晚定稿时间", "负责人", "备注"]);
  ws.getRow(3).eachCell((c) => styleCell(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  [
    ["纸质宣传册", "目录、课程文案、图片、二维码、联系方式", "", "", "", "", "孙吴华", ""],
    ["电子宣传册/PDF/H5", "定稿文案、移动端阅读要求、图片素材", "", "", "", "", "孙吴华", ""],
    ["易拉宝/喷绘", "主标题、核心卖点、CTA、二维码", "", "", "", "", "孙吴华", ""],
    ["展会背板/VI", "展会主题、主视觉口号、展位尺寸", "", "", "", "", "孙吴华", ""],
    ["宣传单页", "短文案、课程卖点、联系方式", "", "", "", "", "孙吴华", ""],
    ["PPT视觉模板", "PPT结构、封面标题、课程页样式要求", "", "", "", "", "孙吴华/周玉田", "如PPT由品宣端自行生成，此项可只做视觉规范"],
    ["公众号配图模板", "文章标题、封面图方向、课程图片素材", "", "", "", "", "孙吴华/周玉田", "公众号正文内容由品宣端生成"],
  ].forEach((r) => ws.addRow(r));
  ws.eachRow((row, idx) => {
    row.height = idx <= 3 ? 28 : 42;
    row.eachCell((c, col) => styleCell(c, { fill: idx > 3 && col <= 2 ? "FFF8FAFC" : undefined }));
  });
  ws.views = [{ state: "frozen", ySplit: 3 }];
  ws.autoFilter = "A3:H3";
  await wb.xlsx.writeFile(path.join(designDir, "孙吴华_设计排期表_填写版.xlsx"));
}

for (const person of people) {
  await createDoc(person);
}
await createWorkbook();
await createDesignWorkbook();

console.log("created");
