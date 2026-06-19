import ExcelJS from "exceljs";
import { mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const imagePath = path.join(root, "04_outputs_输出结果", "image_ocr_crops", "normalized.jpg");
const sourcePath = "e:/Desktop/claude-code-now-main/微信图片_20260516104023_342_367.jpg";
const outputDir = path.join(root, "04_outputs_输出结果");
const outputPath = path.join(outputDir, "热门国际化学校_学校探校表_图片识别版.xlsx");

if (!existsSync(imagePath)) {
  throw new Error(`Missing normalized image: ${imagePath}`);
}
mkdirSync(outputDir, { recursive: true });

const wb = new ExcelJS.Workbook();
wb.creator = "Codex";
wb.created = new Date();
wb.modified = new Date();
wb.properties.date1904 = false;

const ws = wb.addWorksheet("学校探校表", {
  pageSetup: {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    margins: { left: 0.25, right: 0.25, top: 0.25, bottom: 0.25, header: 0.1, footer: 0.1 }
  },
  views: [{ showGridLines: false }]
});

ws.columns = [
  { key: "booth", width: 9 },
  { key: "check", width: 10 },
  { key: "school", width: 44 },
  { key: "target", width: 28 },
  { key: "courses", width: 86 }
];

const font = { name: "Microsoft YaHei", size: 10 };
const bold = { name: "Microsoft YaHei", size: 10, bold: true };
const titleFont = { name: "Microsoft YaHei", size: 18, bold: true };
const smallFont = { name: "Microsoft YaHei", size: 8 };
const border = {
  top: { style: "thin", color: { argb: "FF000000" } },
  left: { style: "thin", color: { argb: "FF000000" } },
  bottom: { style: "thin", color: { argb: "FF000000" } },
  right: { style: "thin", color: { argb: "FF000000" } }
};

function setRangeBorder(row, c1 = 1, c2 = 5) {
  for (let c = c1; c <= c2; c++) ws.getCell(row, c).border = border;
}

function merge(row, from, to, value, opts = {}) {
  ws.mergeCells(row, from, row, to);
  const cell = ws.getCell(row, from);
  cell.value = value;
  cell.font = opts.font || font;
  cell.alignment = opts.alignment || { vertical: "middle", horizontal: "left", wrapText: true };
  if (opts.border) {
    for (let c = from; c <= to; c++) ws.getCell(row, c).border = border;
  }
  if (opts.fill) cell.fill = opts.fill;
  return cell;
}

function rowHeight(row, height) {
  ws.getRow(row).height = height;
}

function tableRow(row, booth, school, target, courses, height = 31) {
  ws.getCell(row, 1).value = booth;
  ws.getCell(row, 2).value = "";
  ws.getCell(row, 3).value = school;
  ws.getCell(row, 4).value = target;
  ws.getCell(row, 5).value = courses;
  for (let c = 1; c <= 5; c++) {
    const cell = ws.getCell(row, c);
    cell.font = c === 1 ? bold : font;
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = border;
  }
  ws.getCell(row, 3).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  ws.getCell(row, 5).alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  rowHeight(row, height);
}

merge(1, 1, 2, "远播教育\n一站式升学服务平台", { font: { name: "Microsoft YaHei", size: 14, bold: true }, alignment: { vertical: "middle", horizontal: "left", wrapText: true } });
merge(1, 3, 5, "一站式规划服务平台 TEL：400-820-0288", { font: { name: "Microsoft YaHei", size: 18 }, alignment: { vertical: "middle", horizontal: "right" } });
rowHeight(1, 42);

merge(2, 1, 5, "热门国际化学校 · 学校探校表", { font: titleFont, alignment: { vertical: "middle", horizontal: "center" } });
rowHeight(2, 32);

const privacy =
  "为了向您提供【升学相关咨询】服务，我们将收集您的个人信息(具体信息类型详见下表)。此外，为了进一步优化服务质量，更加针对性地向您提供【个性化升学咨询】服务，您可选择提供【学生姓名、年级、学习成绩、兴趣特长、现读学校、意向就读学校等】信息，如您不提供此类信息，将不会影响我们向您提供【基础升学相关咨询服务】。您知悉并确认，我们将严格按照上述处理目的、处理方式处理您的相关个人信息，如需变更处理目的、处理方式的，将重新取得您的同意。\n" +
  "您的上述信息我们将存储【至服务完成后】或您提出删除要求时，我们将立即对您的个人信息进行删除。\n" +
  "如果您对我们的个人信息处理行为有任何问题，或想要行使您根据《中华人民共和国个人信息保护法》所享有的个人信息权益的，您可通过下述联系方式联系我们：\n" +
  "公司名称：（个人信息处理者）：【上海远播教育科技集团股份有限公司、上海远播商务咨询有限公司、远播国际留学服务有限公司、北京世青教育科技有限公司、远播国际旅行社(上海)有限公司】\n" +
  "信件地址：【上海市徐汇区宜山路333号一号楼汇鑫国际大厦1901、1903和1905】\n" +
  "客服电话：【400-820-0288】";
merge(3, 1, 4, privacy, { font: smallFont, alignment: { vertical: "top", horizontal: "left", wrapText: true } });
merge(3, 5, 5, "此表用于\n主办方回收\n以便后期预约访校", {
  font: { name: "Microsoft YaHei", size: 8, bold: true },
  alignment: { vertical: "middle", horizontal: "center", wrapText: true },
  border: true
});
rowHeight(3, 72);

merge(4, 1, 5, "本人 □ 已理解、知晓同意上述内容。如不同意上述内容的，请勿填写下表。", {
  font: { name: "Microsoft YaHei", size: 11, bold: true },
  alignment: { vertical: "middle", horizontal: "left" }
});
rowHeight(4, 22);

merge(5, 1, 5, "学生信息 Applicant Details", { font: { name: "Microsoft YaHei", size: 16, bold: true } });
rowHeight(5, 26);

const infoRows = [
  ["学生姓名：", "性别：   □ 男    □ 女", "现读年级：", "申请年级：", "现读城市："],
  ["家长手机：", "", "其他紧急联系方式：", "", ""],
  ["希望平时来访远播咨询： □ 是  □ 否 / 约定来访日期：__________", "", "未来您家庭是否有移民计划□", "", ""],
  ["学生国籍：外籍□________________", "", "中国港澳台籍□", "中国大陆籍□", ""]
];
for (let i = 0; i < infoRows.length; i++) {
  const r = 6 + i;
  if (i === 1) {
    merge(r, 1, 2, infoRows[i][0], { font, border: true });
    merge(r, 3, 5, infoRows[i][2], { font, border: true });
  } else if (i === 2) {
    merge(r, 1, 3, infoRows[i][0], { font, border: true });
    merge(r, 4, 5, infoRows[i][2], { font, border: true, alignment: { vertical: "middle", horizontal: "center" } });
  } else if (i === 3) {
    merge(r, 1, 2, infoRows[i][0], { font, border: true });
    ws.getCell(r, 3).value = infoRows[i][2];
    ws.getCell(r, 4).value = infoRows[i][3];
    ws.getCell(r, 5).value = "";
    setRangeBorder(r, 3, 5);
    for (let c = 3; c <= 5; c++) ws.getCell(r, c).font = font;
  } else {
    for (let c = 1; c <= 5; c++) {
      ws.getCell(r, c).value = infoRows[i][c - 1];
      ws.getCell(r, c).font = font;
      ws.getCell(r, c).alignment = { vertical: "middle", horizontal: "left", wrapText: true };
      ws.getCell(r, c).border = border;
    }
  }
  rowHeight(r, 30);
}

merge(10, 1, 5, "意向学校 Intention School（亲爱的家长，如果您想了解以下任意学校，请直接在学校后打“√”，我们会为您优先安排访校时间哦！可多选）", {
  font: { name: "Microsoft YaHei", size: 14, bold: true },
  alignment: { vertical: "middle", horizontal: "left", wrapText: true }
});
rowHeight(10, 26);

["展位号", "请打“√”", "学校名称", "招收对象", "开设课程"].forEach((v, i) => {
  const cell = ws.getCell(11, i + 1);
  cell.value = v;
  cell.font = bold;
  cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
  cell.border = border;
});
rowHeight(11, 28);

const rows = [
  ["A1", "深圳新哲文院\n深圳实验学校国际教育基地", "初中、高中", "AP 课程、A-Level 课程、艺术音乐体育课程", 34],
  ["A2", "实验 ALevel（新哲文院 A-Level 学部）", "初中、高中", "IGCSE、A-Level", 30],
  ["A3", "深圳华朗学校（国际部）", "7-12 年级", "IGCSE/A-Level", 30],
  ["A4", "天立国际·深美宝安", "1-12 年级", "G1-G5 英式创新小学课程\nG6-G8 英美融合国际课程\nG9-G12 IGCSE&A-Level 课程\nG9-G12 艺术专业课程\nG10-G12 IC 国际双学分课程", 86],
  ["A5", "香港力迈学校", "大陆 6-12 年级（香港 7-13 年级）", "A-LEVEL", 30],
  ["A6", "深圳 富源·英美学校", "高中预备班，高中", "Pre-IGCSE 国际高中预备班\nIGCSE&A-Level 剑桥国际高中\nHKDSE 威学班", 62],
  ["A7", "深圳富源英美学校 DSE", "高中", "HKDSE 课程", 30],
  ["B1", "深圳曼彻斯通城堡学校", "学前班-13 年级", "A-Level", 30],
  ["B2", "狄邦 KCS 国际高中（中荟校区）", "9-11 年级", "A-Level&AP", 30],
  ["B3", "深圳市承翰学校（国际课程实验校区）\n深圳市承翰学校 HKDSE", "初中、高中", "AP、A-Level、DSE、艺术课程", 42],
  ["B4", "深国预 SIPC 初中部", "G7、G8", "美国 CCSS 课程和英国爱德思 i LOWER Secondary", 30],
  ["B5", "汉开·剑桥国际书院", "7-12 年级", "A-Level/DSE", 30],
  ["B6", "深圳市新福景双语学校", "初中、高中", "Alevel、AP、IB 及 DSE 课程", 30],
  ["C1", "桃李未来｜湾区国际书院", "初三 / 高一 / 高二", "A-LEVEL", 30],
  ["C2", "深圳（南山）中加学校", "高中", "中加、AP、DSE", 30],
  ["C3", "香港遵理国际教育", "G9-G12DSE 高中课程；\nG7-G12 补习", "HKDSE 国际高中课程，香港插班服务", 44],
  ["C4", "深圳市普林云海港人子弟学校\n云海谷书院 HKDSE", "幼儿园、小一至中六", "“IB+剑桥+香港”三维课程", 42],
  ["C5", "哈尔滨工业大学（深圳）", "G10 以上", "香港&英联邦国际本科", 30],
  ["C6", "深圳市南山为明学校\n（原北大附中深圳南山分校）", "初中、高中", "美国高中课程&AP 课程、澳大利亚 SACE 课程体系", 42],
  ["D1", "深圳奥斯翰外语学校", "7-12 年级", "A-level、AP、BTEC、普高、港澳台联考、日本、韩国、新加坡", 34],
  ["D2", "深圳市枫叶学校", "小初高", "枫叶世界学校课程 +AP 课程", 30],
  ["D3", "深圳市桃源居中澳实验学校", "1-12 年级", "小、初、普高、国际高中（A-level、北美 2+1 OSSD、港澳台侨联考）", 34],
  ["D4", "ALV 爱乐惟国际教育", "三年级 - 研究生", "1、国际学校入学备考\n英系：深国交、展华国际部、云海谷书院、城市绿洲、广碧（含美系港系课程）等\n美系：万科梅沙、贝赛思、清澜山、荟同等；港系：培侨书院、民心、暨大港澳等\n2. 国际课程同步辅导\n国际学校同步课：IGCSE、A-Level、AP、IB、DSE 等\n竞赛课：AMC、UKChO、Physics Bowl、BPhO、NEC、IEO、BBO 等\n标化语言：雅思、托福等；其他：ACT、SAT 课程\n3. 留学规划辅导\n藤校 / 牛剑 / G5 规划、背景提升、PS 指导、笔面试辅导等", 178],
  ["D5", "育华高级中学国际部", "9-12 年级", "Alevel、OSSD、新加坡大学预科", 30],
  ["D6", "深圳外国语学校（集团）湾区学校", "1-12 年级", "IB", 30],
  ["D7", "深圳三高国际部中美双学籍班\n新东方国际教育湾区择校 / 香港插班 /\n全日制脱产学习", "小学、初中、高中", "国际学校备考、中美班", 54],
  ["T1", "威学一百", "幼儿园 - 研究生", "托福、雅思、SAT、DSE、IGCSE、A-Level、AP、IB、OSSD 脱产培训、国际学校同步衔接课程、国际学校备考（深国交、贝赛思、万科梅沙、城市绿洲、哈罗、培侨书院等等）、map、日语、韩语、法语、西语、德语", 62]
];

let r = 12;
for (const [booth, school, target, courses, height] of rows) {
  tableRow(r, booth, school, target, courses, height);
  r++;
}

merge(r, 1, 5, "在这里写出您想了解的其他国际化学校，我们将为您倾力邀请帮您预约访校并第一时间通知您哦！", {
  font: { name: "Microsoft YaHei", size: 12, bold: true },
  alignment: { vertical: "middle", horizontal: "left", wrapText: true }
});
rowHeight(r, 34);
r++;
merge(r, 1, 5, "________________________________________________________________________________________________________________", { font });
rowHeight(r, 28);

ws.eachRow(row => {
  row.eachCell(cell => {
    cell.alignment = cell.alignment || { vertical: "middle", horizontal: "center", wrapText: true };
  });
});
ws.pageSetup.printArea = `A1:E${r}`;

const imgSheet = wb.addWorksheet("原图核对", {
  pageSetup: { paperSize: 9, orientation: "landscape", fitToPage: true, fitToWidth: 1, fitToHeight: 1 },
  views: [{ showGridLines: false }]
});
imgSheet.getCell("A1").value = "原图核对（方向已校正）；源文件：" + sourcePath;
imgSheet.getCell("A1").font = { name: "Microsoft YaHei", size: 12, bold: true };
imgSheet.getRow(1).height = 24;
const imageId = wb.addImage({ filename: imagePath, extension: "jpeg" });
imgSheet.addImage(imageId, { tl: { col: 0, row: 1 }, ext: { width: 1200, height: 1600 } });

await wb.xlsx.writeFile(outputPath);
console.log(outputPath);
