import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
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

const root = "03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "04_课程卖点统筹");
const baseXlsx = path.join(outDir, "课程卖点信息采集汇总表_第一轮补充版.xlsx");
const outXlsx = path.join(outDir, "课程卖点信息采集汇总表_DSE参考补充版.xlsx");
const dseXlsx = path.join(outDir, "DSE课程信息采集表_按参考结构_待核对.xlsx");
const dseDocx = path.join(outDir, "DSE课程介绍参考结构与缺口核对清单.docx");
const dseMd = path.join(outDir, "DSE课程介绍参考结构与缺口核对清单.md");

const referenceStructure = [
  {
    section: "01 学校简介",
    ref: "参考文档先建立学校可信度：办学时间、官方认可、认证、校区位置、课程体系、校园设施、全人教育理念。",
    oxstandHave: "已有部分：奥斯翰2004年经深圳市教育局批准设立，深圳本土办学20余年，深圳市一级学校、深圳市高考先进单位、广东省民办教育示范名校，多课程体系。",
    needCheck: "需核对：奥斯翰DSE是否有独立办学资质/授权/备案口径；DSE项目所在年级、校区、是否住宿、招生身份范围。",
  },
  {
    section: "02 课程介绍",
    ref: "参考文档说明HKDSE课程依据香港考评局课程指南，以香港本土教材为主，按文、理、商三大核心知识板块设置；列出核心科目、选修科目、体育健康、活动、自主学习。",
    oxstandHave: "目前无奥斯翰DSE课程具体资料。",
    needCheck: "需补齐：核心科目、选修科目、教材体系、授课语言、是否中文作答、是否开M1/M2、可开哪些选修、每周课时、考试年级。",
  },
  {
    section: "03 课程优势",
    ref: "参考文档将DSE优势拆为：衔接内地体系、科目灵活、竞争力较小、全球认可、中文作答、成绩两年有效。",
    oxstandHave: "可先采用DSE通用优势，但必须改成奥斯翰口径。",
    needCheck: "需核对：奥斯翰能否提供DSE专门选科指导、是否有成熟复习体系、是否有港籍/非港籍学生升学路径说明。",
  },
  {
    section: "04 为什么选择本校DSE",
    ref: "参考文档给出8个本校卖点：升学成果、资深DSE团队、全面人才培养、学考独立教学法、英文个性化支持、全面发展理念、香港Band1资源、名校推荐计划。",
    oxstandHave: "奥斯翰已有共通优势：全日制学校、多课程分流、升学指导、外语特色、校园管理。",
    needCheck: "最缺：DSE专属成果、DSE师资、DSE教研资源、香港学校/机构资源、复习节奏、英文支持方案、竞赛活动、推荐/合作资源。",
  },
  {
    section: "05 英文个性化支持",
    ref: "参考文档细化为分层教学、课后辅导、课外学习活动、沉浸式语言环境。",
    oxstandHave: "IG资料里有EAL、English Learning Workshop、分层教学经验，可迁移为奥斯翰英文支持底座。",
    needCheck: "需确认DSE英文是否单独分层；是否有DSE英文科教师；是否有英语角、英文演讲、辩论、研学营等资源。",
  },
  {
    section: "06 课程规划",
    ref: "参考文档分四阶段：适应与过渡、知识巩固、知识梳理、冲刺阶段；每阶段列关键任务。",
    oxstandHave: "暂无DSE专属规划。",
    needCheck: "需补齐：G10-G12或中三-中六的DSE时间轴；何时定选修；何时结课；几轮复习；几次模考；何时申请。",
  },
  {
    section: "07 课程时间表",
    ref: "参考文档列每日课程时间、增益课堂、晚自习。",
    oxstandHave: "奥斯翰已有晚自习、宿舍管理等通用信息。",
    needCheck: "需给出DSE班作息、日课表、晚自习、增益课、周末/假期补习安排。",
  },
  {
    section: "08 师资团队",
    ref: "参考文档展示执行校长、学术校长、DSE课程顾问、DSE教学主任/M1M2教师等，强调香港八大、985/211、硕士以上、5年以上经验。",
    oxstandHave: "暂无DSE专属师资。",
    needCheck: "必须补齐：DSE中文、英文、数学、公民与社会发展、选修科教师；学历、教龄、DSE经验、是否港校/港八背景、是否能公开照片。",
  },
  {
    section: "09 录取成果",
    ref: "参考文档列TOP100、G5、港大、奖学金、港八录取率、综合录取率，以及具体学生案例。",
    oxstandHave: "暂无DSE成果；奥斯翰其他课程有港大、港中文等案例，但不能直接当DSE成果。",
    needCheck: "若没有DSE首届成果，应改为：学校整体升学成果+课程路径优势+目标院校清单，不能写DSE已录取。",
  },
  {
    section: "10 升学方向",
    ref: "参考文档拆成香港/澳门、内地免试、海外院校，并列举港八大、内地985/211、英澳加新美院校。",
    oxstandHave: "DSE通用升学方向可直接整理，但申请资格和身份要求必须核对。",
    needCheck: "需明确奥斯翰DSE主要服务哪类身份：港澳台/华侨/外籍/内地学生；不同身份能申请哪些院校。",
  },
  {
    section: "11 升学支持",
    ref: "参考文档包括名师指导、时间节点把控、择校建议、学术梳理、学生案例。",
    oxstandHave: "奥斯翰已有1对1升学指导、分流指导、海外大学来访等共通资源。",
    needCheck: "需确认DSE是否有专属升学老师、是否熟悉JUPAS/内地免试/海外申请、是否有文书与面试支持。",
  },
  {
    section: "12 校园风光与设施",
    ref: "参考文档展示校园面积、宿舍、饭堂、图书馆、智慧教室、多功能课室、活动。",
    oxstandHave: "已有校址、宿舍、晚自习、社团、MUN、科学展、夏校等信息。",
    needCheck: "需收集可用于DSE宣传册的校园图片、宿舍、教室、图书馆、饭堂、活动照片。",
  },
  {
    section: "13 入学要求与收费",
    ref: "参考文档列对象、选拔标准、申请流程、学费、住宿、餐食。",
    oxstandHave: "暂无DSE入学要求和收费。",
    needCheck: "必须核对：招生对象、身份要求、年级、考试/面试科目、学费、住宿费、餐费、是否滚动招生。",
  },
];

const dseQuestions = [
  ["项目定位", "奥斯翰DSE课程一句话定位是什么？", "建议：面向希望通过HKDSE申请香港、澳门、内地免试及海外高校的学生，提供中文作答优势、灵活选科和多路径升学支持。", "必须核对"],
  ["招生对象", "DSE班具体招哪些学生？港澳台/华侨/外籍/内地学生分别是否可读？", "参考深美写法：明确对象和身份类型。", "必须核对"],
  ["课程年级", "从几年级开始读？中三-中六、G10-G12，还是高中三年制？", "需形成课程时间轴。", "必须核对"],
  ["核心科目", "是否开设中国语文、英国语文、数学、公民与社会发展？", "DSE标准核心科目。", "必须核对"],
  ["选修科目", "可开哪些选修？物理、化学、生物、经济、中国历史、历史、视觉艺术、M1/M2是否能开？", "参考文档按文理商板块整理。", "必须核对"],
  ["教材资源", "是否使用香港本土教材、考评局资料、DSE真题、模拟卷、5**答案？", "可形成教研资源卖点。", "必须核对"],
  ["授课语言", "各科是中文、英文还是双语？英文科如何分层？", "DSE中文作答是卖点，但英文仍是短板。", "必须核对"],
  ["课程优势", "奥斯翰DSE相较高考/港澳台联考/A-Level/AP的差异是什么？", "可从中文作答、科目灵活、成绩两年有效、全球认可切入。", "建议核对"],
  ["英文支持", "是否有英文分层、课后辅导、英语角、演讲/辩论/研学等？", "可借鉴IG的EAL和English Learning Workshop。", "必须核对"],
  ["学习规划", "几年完成知识点？几轮复习？每学期几次模考？何时选科？何时申请？", "参考四阶段：适应、巩固、梳理、冲刺。", "必须核对"],
  ["时间表", "DSE班日课表、晚自习、增益课堂如何安排？", "参考文档有每日时间表。", "建议核对"],
  ["师资", "DSE各科老师是谁？学历、教龄、DSE经验、港校背景、是否可公开照片？", "这是宣传册核心篇幅。", "必须核对"],
  ["课程顾问", "是否有香港DSE顾问、香港学校资源、港校招生资源？", "若没有，不能写香港Band1资源。", "必须核对"],
  ["升学成果", "是否已有DSE学生录取成果？没有的话能否用学校整体升学成果替代？", "必须区分DSE成果和学校整体成果。", "必须核对"],
  ["升学方向", "DSE学生可申请哪些方向：香港、澳门、内地免试、海外？不同身份限制是什么？", "需要做成招生问答。", "必须核对"],
  ["升学支持", "是否支持JUPAS、内地免试收生、海外申请、文书、面试、择校？", "决定宣传可信度。", "必须核对"],
  ["学生案例", "有没有港籍/内地转轨/偏科逆袭/英文薄弱提升案例？", "没有就做虚拟画像，但必须标注为情景案例。", "建议核对"],
  ["校园设施", "DSE宣传册可用哪些校园照片？教室、宿舍、饭堂、图书馆、活动。", "设计物料必需。", "建议核对"],
  ["收费", "DSE学费、住宿、餐食、杂费分别是多少？", "财务口径必须准确。", "必须核对"],
  ["风险边界", "哪些不能承诺？如港八大录取率、985概率、名校推荐、直招名额等。", "防止宣传过度。", "必须核对"],
];

const proposedRows = [
  ["一句话说明这是什么课程", "【建议表达，待确认】奥斯翰DSE课程面向希望通过HKDSE申请香港、澳门、内地免试及海外高校的学生，围绕DSE核心科目、灵活选修、英文能力和升学规划建立完整培养路径。"],
  ["主要面向哪些学生", "【待确认】适合港澳台/华侨/外籍或具备相关升学身份规划的学生；也适合内地转轨、偏科明显、希望保留多地升学出口的学生。具体身份可申请范围需负责人核对。"],
  ["适合年级/阶段", "【待确认】建议明确为中三-中六或G10-G12路径；需确认奥斯翰从哪个年级开设DSE、是否支持插班。"],
  ["主要升学方向", "香港八大/澳门高校/内地免试收生高校/英澳加新美等认可DSE成绩的海外大学。不同身份路径需核对。"],
  ["优势1：奥斯翰能做到、别人不一定能做到的点", "【建议表达】中文作答+内地基础衔接：除英文科外，DSE更适合有中文学科基础的学生转轨，可降低学生从高考体系转向国际升学的适应成本。"],
  ["优势2：奥斯翰能做到、别人不一定能做到的点", "【建议表达】灵活选科+多路径升学：4门核心+2-3门选修的组合，能帮助偏科学生用优势科目构建申请竞争力。"],
  ["优势3：奥斯翰能做到、别人不一定能做到的点", "【建议表达，待确认】依托奥斯翰全日制学校管理、多课程体系和升学指导，DSE学生可获得课程学习、英文提升、选科规划和升学申请的连续支持。"],
  ["学制/学习周期", "【待确认】需明确DSE完整学制、各阶段任务、是否三年制、何时选科、何时报考。"],
  ["核心课程模块", "建议模块：中文、英文、数学、公民与社会发展；选修可按文/理/商设置，如物理、化学、生物、经济、历史、中国历史、视觉艺术、M1/M2等。实际开课需核对。"],
  ["考试或评价方式", "HKDSE公开考试；校内阶段应包含单元测试、阶段测评、模考、DSE真题训练、英文能力评估。实际频次需核对。"],
  ["入学到升学路径", "入学评估 → DSE基础适应 → 确定选修科目 → 系统学习核心/选修 → 多轮复习与模考 → DSE报考 → 香港/内地/海外申请。"],
  ["师资或教学团队优势", "【待补充】需提供DSE中文、英文、数学、公民与社会发展、选修科老师名单、学历、教龄、DSE经验、港校背景、照片。"],
  ["班级管理/学业管理方式", "【建议表达，待确认】全日制管理+晚自习+阶段测评+个性化补弱；英文科可采用分层教学和课后辅导。"],
  ["升学指导方式", "【待确认】需明确是否支持JUPAS、内地免试收生、澳门/海外申请、文书、面试、择校和时间节点管理。"],
  ["学生案例", "【待补充】优先收集：普高转轨DSE、偏科学生用优势科目申请、英文薄弱提升、港澳台身份学生申请内地/香港案例。"],
  ["升学结果", "【待补充】如无DSE成果，只能写学校整体升学成果和DSE目标路径，不能写成DSE项目录取成果。"],
  ["合作资源/证书/图片/链接", "【待补充】DSE教材、考评局资料、真题/模拟卷资源、香港学校/机构合作、校园设施图片。"],
  ["家长最常问的问题及回答1", "问：DSE和高考/港澳台联考/A-Level有什么区别？答：DSE以中文作答优势、选科灵活和多地升学认可为特点，但申请路径受身份、科目成绩和英文水平影响，需要提前规划。"],
  ["家长最常问的问题及回答2", "问：内地学生读DSE一定能申请香港/内地名校吗？答：不能保证。DSE提供多路径申请机会，但录取取决于身份条件、DSE成绩、英文能力、申请材料和当年院校政策。"],
  ["家长通常会拿谁比较？奥斯翰差异是什么？", "会比较：港澳台联考、A-Level/AP、深圳其他DSE学校、普高路线。奥斯翰可主打全日制管理、多课程出口、英文支持和升学规划；DSE专属师资与成果需补充。"],
  ["不能写、不能承诺、需要保守表达的内容", "不能写：保证港八大/985/211录取、名校直招、录取率数据、DSE成果、合作资源，除非金校提供可验证材料。竞品数据只能作为参考，不可直接套用奥斯翰。"],
  ["可用于宣传的短句1", "【建议】给有中文学科基础的学生，一条更适合转轨的国际升学路径。"],
  ["可用于宣传的短句2", "【建议】DSE不是逃避竞争，而是用更适合的考试体系，把学生优势重新放大。"],
  ["可用于宣传的短句3", "【建议】中文作答、灵活选科、多地认可，让升学选择不止一条路。"],
];

function style(cell, opts = {}) {
  cell.font = { name: "微软雅黑", size: opts.size ?? 10, bold: !!opts.bold, color: { argb: opts.color ?? "FF1F2937" } };
  cell.alignment = { vertical: "middle", horizontal: opts.horizontal ?? "left", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "FFD6DEE8" } },
    left: { style: "thin", color: { argb: "FFD6DEE8" } },
    bottom: { style: "thin", color: { argb: "FFD6DEE8" } },
    right: { style: "thin", color: { argb: "FFD6DEE8" } },
  };
  if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
}

async function updateMainXlsx() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(baseXlsx);
  const ws = wb.getWorksheet("DSE");
  ws.getCell("A2").value = "参考深美宝安DSE课程介绍生成第一版结构。所有奥斯翰自身事实均需金校/alizer核对。";
  style(ws.getCell("A2"), { fill: "FFFFF2CC", color: "FF7A4B00" });
  for (let i = 0; i < proposedRows.length; i++) {
    const row = ws.getRow(i + 4);
    row.getCell(3).value = proposedRows[i][1];
    row.getCell(4).value = "参考资料：深美宝安DSE课程介绍.pdf；奥斯翰事实待核对";
    row.getCell(5).value = proposedRows[i][1].includes("待") || proposedRows[i][1].includes("建议") ? "待确认" : "是";
    row.getCell(6).value = "DSE负责人（金校/alizer按实际分工）";
    row.getCell(7).value = i < 20 ? "P0" : "P1";
    row.getCell(8).value = "请负责人核对后改成奥斯翰真实口径。";
    row.height = Math.max(42, Math.min(130, Math.ceil(String(row.getCell(3).value).length / 28) * 18));
    row.eachCell((c, col) => style(c, { fill: col <= 2 ? "FFF8FAFC" : undefined }));
  }
  await wb.xlsx.writeFile(outXlsx);
}

async function createDseXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "周玉田";
  wb.created = new Date();
  const gap = wb.addWorksheet("DSE缺口总表");
  gap.columns = [
    { width: 22 }, { width: 48 }, { width: 44 }, { width: 52 }, { width: 12 }, { width: 20 },
  ];
  gap.addRow(["模块", "参考文档写法", "奥斯翰已有", "需要核对/补充", "优先级", "负责人"]);
  gap.getRow(1).eachCell((c) => style(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  referenceStructure.forEach((r, i) => gap.addRow([r.section, r.ref, r.oxstandHave, r.needCheck, i < 11 ? "P0" : "P1", "金校/alizer"]));
  gap.eachRow((row, idx) => {
    row.height = idx === 1 ? 28 : 72;
    row.eachCell((c) => style(c, { fill: idx > 1 && c.col === 4 ? "FFFFF2CC" : undefined }));
  });
  gap.views = [{ state: "frozen", ySplit: 1 }];

  const questions = wb.addWorksheet("发给负责人核对");
  questions.columns = [{ width: 18 }, { width: 48 }, { width: 56 }, { width: 14 }, { width: 50 }];
  questions.addRow(["模块", "需要问的问题", "可先采用的参考/建议表达", "确认级别", "负责人回复"]);
  questions.getRow(1).eachCell((c) => style(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  dseQuestions.forEach((q) => questions.addRow(q));
  questions.eachRow((row, idx) => {
    row.height = idx === 1 ? 28 : 64;
    row.eachCell((c, col) => style(c, { fill: idx > 1 && col === 5 ? "FFFFF2CC" : undefined }));
  });
  questions.views = [{ state: "frozen", ySplit: 1 }];

  const draft = wb.addWorksheet("DSE填写表初稿");
  draft.columns = [{ width: 36 }, { width: 76 }, { width: 18 }, { width: 46 }];
  draft.addRow(["采集表问题", "第一版建议填写内容", "状态", "核对要求"]);
  draft.getRow(1).eachCell((c) => style(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  proposedRows.forEach((r) => draft.addRow([r[0], r[1], r[1].includes("待") || r[1].includes("建议") ? "待确认" : "可参考", "请改成奥斯翰真实口径"]));
  draft.eachRow((row, idx) => {
    row.height = idx === 1 ? 28 : 58;
    row.eachCell((c, col) => style(c, { fill: idx > 1 && col === 3 ? "FFFFF2CC" : undefined }));
  });

  await wb.xlsx.writeFile(dseXlsx);
}

const border = { style: BorderStyle.SINGLE, size: 1, color: "D6DEE8" };
function run(text, opts = {}) {
  return new TextRun({ text, font: "Microsoft YaHei", size: opts.size ?? 20, bold: !!opts.bold, color: opts.color ?? "1F2937" });
}
function para(text, opts = {}) {
  return new Paragraph({ heading: opts.heading, alignment: opts.alignment, spacing: { before: 80, after: 80 }, children: [run(text, opts)] });
}
function cell(text, opts = {}) {
  return new TableCell({
    borders: { top: border, bottom: border, left: border, right: border },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    width: { size: opts.width ?? 3000, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [run(text || "", { size: opts.size ?? 18, bold: !!opts.bold })] })],
  });
}

async function createDocx() {
  const children = [
    para("DSE课程介绍参考结构与缺口核对清单", { heading: HeadingLevel.TITLE, size: 34, bold: true, alignment: AlignmentType.CENTER, color: "0B2A4A" }),
    para("参考资料：深美宝安DSE课程介绍.pdf。用途：反推奥斯翰DSE课程介绍需要补齐的资料和与负责人沟通的问题。", { alignment: AlignmentType.CENTER, color: "64748B" }),
    para("处理原则", { heading: HeadingLevel.HEADING_1, size: 28, bold: true }),
    para("竞品资料只能作为结构参考，不能直接套用为奥斯翰事实。DSE通用制度可写成科普内容；奥斯翰自身师资、成绩、合作资源、课表、收费、入学要求必须由课程负责人核对。"),
    para("建议沟通方式", { heading: HeadingLevel.HEADING_1, size: 28, bold: true }),
    para("不要只问“给我DSE资料”。建议直接把《DSE课程信息采集表_按参考结构_待核对.xlsx》发给负责人，让他按黄色列补充。你可以附一句：我们要做一份完整课程介绍，请按深美DSE文档的完整度补齐奥斯翰自己的真实口径，不能确认的请标注待确认。"),
    para("一、参考结构与奥斯翰缺口", { heading: HeadingLevel.HEADING_1, size: 28, bold: true }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ tableHeader: true, children: [cell("模块", { fill: "DCEBFF", bold: true, width: 1600 }), cell("参考文档写法", { fill: "DCEBFF", bold: true, width: 3000 }), cell("奥斯翰已有", { fill: "DCEBFF", bold: true, width: 2400 }), cell("需核对/补齐", { fill: "DCEBFF", bold: true, width: 3000 })] }),
        ...referenceStructure.map((r) => new TableRow({ children: [cell(r.section, { fill: "F8FAFC", bold: true, width: 1600 }), cell(r.ref, { width: 3000 }), cell(r.oxstandHave, { width: 2400 }), cell(r.needCheck, { fill: "FFF2CC", width: 3000 })] })),
      ],
    }),
    new Paragraph({ children: [new PageBreak()] }),
    para("二、发给负责人核对的问题", { heading: HeadingLevel.HEADING_1, size: 28, bold: true }),
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({ tableHeader: true, children: [cell("模块", { fill: "DCEBFF", bold: true, width: 1600 }), cell("问题", { fill: "DCEBFF", bold: true, width: 3900 }), cell("参考/建议表达", { fill: "DCEBFF", bold: true, width: 3900 })] }),
        ...dseQuestions.map((q) => new TableRow({ children: [cell(q[0], { fill: "F8FAFC", bold: true, width: 1600 }), cell(q[1], { width: 3900 }), cell(q[2], { width: 3900 })] })),
      ],
    }),
  ];

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Microsoft YaHei", size: 20 } } },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 34, bold: true, color: "0B2A4A" }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 28, bold: true, color: "0B2A4A" }, paragraph: { spacing: { before: 220, after: 120 }, outlineLevel: 0 } },
      ],
    },
    sections: [{
      properties: { page: { margin: { top: 800, right: 650, bottom: 800, left: 650 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run("奥斯翰DSE资料补齐工作", { size: 17, color: "64748B" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run("第 ", { size: 17, color: "64748B" }), new TextRun({ children: [PageNumber.CURRENT], font: "Microsoft YaHei", size: 17, color: "64748B" }), run(" 页", { size: 17, color: "64748B" })] })] }) },
      children,
    }],
  });
  fs.writeFileSync(dseDocx, await Packer.toBuffer(doc));
}

function createMd() {
  const lines = [
    "# DSE课程介绍参考结构与缺口核对清单",
    "",
    "参考资料：`深美宝安DSE课程介绍.pdf`",
    "",
    "## 处理原则",
    "",
    "- 竞品资料只作为结构参考，不能直接套用成奥斯翰事实。",
    "- DSE通用制度可写成科普内容。",
    "- 奥斯翰自身师资、成绩、合作资源、课表、收费、入学要求必须由负责人核对。",
    "",
    "## 建议发给负责人一句话",
    "",
    "我们要把DSE做成一份完整课程介绍，请按这份表补齐奥斯翰自己的真实口径；不能确认的请标注待确认，不能宣传的请直接写不能写。",
    "",
    "## 缺口总表",
    "",
    "| 模块 | 参考文档写法 | 奥斯翰已有 | 需要核对/补充 |",
    "| --- | --- | --- | --- |",
    ...referenceStructure.map((r) => `| ${r.section} | ${r.ref} | ${r.oxstandHave} | ${r.needCheck} |`),
    "",
    "## 发给负责人核对的问题",
    "",
    "| 模块 | 需要问的问题 | 可先采用的参考/建议表达 | 确认级别 |",
    "| --- | --- | --- | --- |",
    ...dseQuestions.map((q) => `| ${q[0]} | ${q[1]} | ${q[2]} | ${q[3]} |`),
  ];
  fs.writeFileSync(dseMd, lines.join("\n"), "utf8");
}

await updateMainXlsx();
await createDseXlsx();
await createDocx();
createMd();

console.log("DSE gap docs generated");
