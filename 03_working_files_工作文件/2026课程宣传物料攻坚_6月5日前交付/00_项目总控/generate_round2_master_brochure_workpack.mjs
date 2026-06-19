import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import JSZip from "jszip";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "04_课程卖点统筹");
const outXlsx = path.join(outDir, "第二轮_奥斯翰国际部总招生手册_内容汇总与补充清单.xlsx");
const outPptx = path.join(outDir, "第二轮_奥斯翰国际部总招生手册_PPT框架.pptx");
const outMd = path.join(outDir, "第二轮_总招生手册策略说明.md");

const materialDir = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/01_source_materials_原始资料";

const brochureSections = [
  ["01", "封面与总定位", "总册封面", "奥斯翰国际部/精品国际课程总招生手册", "需确定年份、主标题、招生热线、二维码、封面照片。", "待定稿"],
  ["02", "学校与国际部简介", "通用优势", "2004年经深圳市教育局批准创办；位于深圳市罗湖区布心路2040号；全日制民办国际化高中；育人目标“与世界同步，培育跨时代精英人才”；ISO9001国际优质管理系统；植根中华传统文化，融贯东西方教育思想，依托外语特色。", "确认学校简介最终口径、荣誉是否全部可公开、是否仍使用IBDP/UCAS/NCCT等历史资质表述。", "已有基础，需核口径"],
  ["03", "办学历程与资质荣誉", "通用优势", "2004创校；2006加拿大国际课程通过安省教育部资质验收；2008 ISO9001；2009引进韩国大学直升课程；2010广东省民办教育发展示范名校；2012引进日本大学先修课程；2016 AP授权学校；2024清华美院美育课题合作学校等。", "逐项确认年份、名称、证书/图片素材，避免历史资质失效仍按当前资质宣传。", "已有基础，需核证据"],
  ["04", "国际课程总览", "总册核心", "课程地图：AP、OSSD、韩国KUPP、日本JUPP、新加坡IFD、IG/Pre-Program、A-Level占位、DSE暂缓。用一张路径图说明不同孩子如何选择。", "确认最终是否纳入A-Level和DSE；若暂不纳入，总册保留“多元课程路径”但删除具体页。", "需要决策"],
  ["05", "奥斯翰师资与升学服务团队", "扬长避短", "不按单一课程绑定老师，而是提炼10余位中外方教师、课程教师、语言教师、升学顾问，包装为“奥斯翰国际课程教学与升学服务团队”。", "金校提供10几个师资：姓名、照片、职务、学历、教龄、可授课程、可公开亮点；alizer补充可公开教师或说明待定。", "重点待补"],
  ["06", "全流程学习管理与学生支持", "通用优势", "班级早会、日课表、个性化自选辅导班/小组课堂、住宿生晚自习、导师课、MUN、学生社团活动、摄影与影视编辑、机器人编程、韩国文化、运动科学等。", "确认这些活动是否2026招生季仍开设；补充活动照片、社团照片、作息表高清版。", "已有基础，需补素材"],
  ["07", "升学支持体系", "通用优势", "以香港升学服务中心、新加坡、英美加澳、韩国、日本、马来西亚、泰国等方向构成多出口升学服务；提供升学辅导、公需课、语言考试、选课规划、申请服务。", "明确升学服务团队人员、服务边界、是否包含文书/面试/签证/推荐信/家校沟通。", "待补"],
  ["08", "AP课程", "课程页", "College Board授权，School code: 579073；G7-G9准备、G10过渡、G11-G12 SAT&AP冲刺；课程含AP微积分AB/BC、预科微积分、化学、生物、物理、微观/宏观经济、世界历史、中文等。", "补AP师资名单、近年AP成绩/录取成果、可公开学生案例、课程收费与招生对象。", "可写，需补证据"],
  ["09", "OSSD课程", "课程页", "与加拿大邦德多伦多学院合作；高二注册安省高中学籍；中加双文凭；30学分；6门12年级4U/4M课程+雅思申请；高一中方基础+加方语言/文科，高二加方文理学术课，高三加方学术课。", "补邦德合作证明、OCT外教师资、学生案例、OSSD文凭样本/官网录取许可图片、费用、报名流程。注意“高二注册”不能写错。", "必须做，重点待补"],
  ["10", "韩国大学直升课程KUPP", "课程页", "高一TOPIK 1-2，高二TOPIK 3-4，高三TOPIK 5-6；韩语、韩国文化与历史、国际交流、跆拳道、升学指导、一站式留学服务；已有韩国师资和院校方向素材。", "核对100%升学率、TOP20/顶尖大学比例是否可公开；补录取offer、学生案例、师资照片授权。", "可写，需合规"],
  ["11", "日本大学直升课程JUPP", "课程页", "日语分层、JLPT/NAT/EJU备考、日本文化与留学生活适应、面试/签证/出国前后服务；可承接旧宣传册内容。", "补最新合作院校名单、升学成果、学生案例、教师资料、费用。", "可写，需补"],
  ["12", "新加坡IFD课程", "课程页", "两年制新加坡直升课程，2+2路径；前两年国内完成新加坡核心课程与大学预科，通过学分互认及合作院校内测衔接SIM、PSB Academy等；第一年基础学科与语言，第二年完成120学分。", "核对合作院校、学分互认、世界前200学位表述、升学导师、费用、学生案例。", "可写，需核证据"],
  ["13", "IG/Pre-Program衔接课程", "课程页", "G7-G10衔接IGCSE/A-Level/AP/OSSD等路径；英语、数学、科学、历史、文学、中文、韩国语、日语等；重点写成国际课程缓冲与分流基础。", "alizer后天补可写内容；补课程表、师资、分流机制、学生画像。", "可写，等alizer"],
  ["14", "A-Level课程", "占位课程页", "今年刚开，可先写课程路径和IGCSE-A-Level阶段逻辑：G10 IGCSE准备，G11-G12 AS/A2；数学、物化、经济、公需课ESL/中文/体育/CA/升学辅导。", "师资未定、过往案例不能写。待alizer补课程设置、考试局、招生对象、费用；如最终不做则从总册删除。", "占位/可剔除"],
  ["15", "DSE课程", "暂缓课程页", "目前仍在寻找合作机构，资料无法确认。仅可内部保留“未来可能补充路径”，不建议对外写具体课程页。", "确认是否进入本轮总册。若暂缓，不写具体优势、师资、成果、合作资源。", "暂缓/建议剔除"],
  ["16", "校园环境与生活场景", "通用支撑", "校园环境、住宿、饭堂、课堂、社团、MUN、导师课、晚自习、运动与活动，用于总册视觉支撑。", "2025国际部PDF为图片型，需设计从原PDF/PPT提取高清图；补可用照片授权。", "待设计提取"],
  ["17", "入学要求与收费", "转化页", "统一放招生对象、入学测试/面试、学费住宿餐费、报名流程、联系方式。", "各课程费用和入学要求必须由负责人/财务确认。A-Level/DSE若不做则不列费用。", "必须补"],
  ["18", "联系方式与咨询CTA", "转化页", "招生办公室、国际课程中心、校长室、课程顾问电话可从国际部PPT提取。", "确认2026招生季最终电话、二维码、联系人是否更新。", "待核"],
];

const courseStatus = [
  ["AP课程", "金校", "纳入总册", "国际部PPT与旧AP资料可写", "AP授权、School code、G7-G12路径、AP课程清单", "师资、AP成绩、录取案例、费用、招生对象", "可写但需证据"],
  ["OSSD课程", "金校", "纳入总册", "新增OSSD Word是关键资料", "邦德合作、安省学籍、高二注册、中加双文凭、30学分、4U/4M、雅思、一站式服务", "合作证明、OCT外教、案例、费用、文凭/官网截图授权", "重点补齐"],
  ["韩国课程", "金校", "纳入总册", "国际部PPT+旧Word/PDF可写", "TOPIK三年路径、韩国师资、院校方向、留学优势", "升学率/比例合规确认、offer、案例、费用", "可写但需合规"],
  ["日本课程", "金校", "纳入总册", "旧Word/PDF可写", "日语、JLPT/NAT/EJU、升学服务、留学适应", "最新成果、合作院校、师资、费用", "可写需补"],
  ["新加坡课程", "金校", "纳入总册", "国际部PPT+旧Word/PDF可写", "IFD、2+2、120学分、SIM/PSB、英语/学术模块", "合作与学位认证、内测机制、案例、费用", "可写需核"],
  ["IG/Pre-Program", "alizer", "纳入总册", "国际部PPT+第一轮资料可写", "G7-G10衔接、国际课程缓冲、多路径分流", "alizer后天补课程机制、师资、案例、课表", "待alizer补"],
  ["A-Level", "alizer", "占位，可剔除", "今年刚开，暂无师资和案例", "只写课程路径、考试逻辑、公需课和未来出口", "师资未定不能写；过往案例不能写；等alizer补课程设置", "谨慎占位"],
  ["DSE", "alizer/待确认", "暂缓，建议不进首版", "合作机构未定，资料无法确认", "不建议写具体页，只保留内部待补项", "合作机构、课程授权、师资、课表、费用、风险边界", "暂缓"],
];

const jinTasks = [
  ["总师资", "请给10-15位可用于总册的金牌师资", "姓名、照片、岗位、学历、教龄、可授课程、主讲科目、可公开亮点、是否外教/中教、是否可放照片", "P0"],
  ["OSSD", "补邦德OSSD项目的证据链", "合作证明/授权、邦德介绍、安省学籍注册流程、高二注册准确口径、OCT外教师资、课程表、费用", "P0"],
  ["OSSD", "补OSSD成果和案例", "学生案例可不标具体年份，但需确认能否公开；文凭样本、大学官网录取许可截图是否可放", "P0"],
  ["AP", "补AP师资与成绩", "AP教师名单、College Board授权证明、近年AP考试成绩/通过率/高分率、录取案例", "P0"],
  ["韩国", "核对韩国课程强数据", "100%升学率、顶尖大学46%、TOP20 90%以上是否可对外写；给统计年份和证据", "P0"],
  ["韩国", "补韩国师资照片与案例", "JANG Sangwon、Bae Heo、柯珍、Chris Chang等可公开姓名/照片/头衔/履历；offer或学生案例", "P1"],
  ["日本", "补最新日本课程资料", "合作院校、升学结果、语言考试成果、师资、费用、申请流程", "P0"],
  ["新加坡", "核对IFD合作与学位表述", "SIM、PSB Academy等合作/衔接关系、学分互认、内测、世界前200学位表述是否准确", "P0"],
  ["通用", "补校园与活动素材", "课堂、宿舍、饭堂、MUN、社团、导师课、晚自习、校园环境高清图与使用授权", "P1"],
  ["通用", "补费用与入学要求", "每门课学费、住宿、餐费、杂费、入学测试/面试、招生年级、报名流程", "P0"],
];

const alizerTasks = [
  ["IG", "补IG/Pre-Program可写内容", "课程定位、G7-G10阶段目标、IGCSE科目、课表、分流机制、学生画像、师资、可公开成果", "P0"],
  ["A-Level", "补A-Level可写边界", "今年刚开，可写课程路径、考试局、科目、招生对象、费用；不能写未定师资和过往案例", "P0"],
  ["A-Level", "确认是否进入本轮总册", "若师资和合作信息仍未定，建议只保留1页占位或直接剔除", "P0"],
  ["DSE", "确认是否暂缓", "合作机构未定时不建议进入对外总册；如要保留，需提供合作机构、授权、师资、课程、费用、风险边界", "P0"],
  ["通用", "补英语/学术支持机制", "ESL/EAL、学术英语、分层教学、课后辅导、导师制、升学辅导口径", "P1"],
  ["费用", "补IG/A-Level/DSE费用和入学要求", "学费、住宿、餐费、入学测试、招生年级、是否接受插班", "P0"],
];

const risks = [
  ["保录/直升", "不能写保证录取、无条件直升、名校保录，除非有正式协议且口径经学校确认。"],
  ["录取率", "韩国100%升学率、TOP20比例、顶尖大学比例等必须写统计年份、统计范围、证据来源。"],
  ["A-Level", "今年刚开，不能写过往案例和已确定师资；只能写课程体系、计划开设科目和待确认内容。"],
  ["DSE", "合作机构未定，不能写师资、合作、成果、课程安排；建议本轮不放具体页。"],
  ["OSSD", "高二注册安省学籍这一点必须准确，不要写成高一入学即注册。"],
  ["合作院校", "SIM、PSB、邦德、多所韩国/日本院校等必须确认合作性质：交流、推荐、衔接、内测、正式授权不能混写。"],
  ["师资", "多课程共用教师时，应写成奥斯翰国际部师资团队，不强行绑定到单一课程。"],
  ["图片授权", "学生照片、教师照片、offer、证书、官网截图、校园图都要确认可公开使用。"],
];

const audioFiles = [
  ["20260527_115716金校PPT讲解录音.m4a", "金校课程讲解录音", "待转写纳入最终口径"],
  ["20260527_120842金校PPT讲解录音.m4a", "金校课程讲解录音", "待转写纳入最终口径"],
  ["20260527_130012金校PPT讲解录音.m4a", "金校课程讲解录音", "待转写纳入最终口径"],
  ["20260527_140045金校PPT讲解录音.m4a", "金校课程讲解录音", "待转写纳入最终口径"],
];

function style(cell, opts = {}) {
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

function styleSheet(ws, widths) {
  widths.forEach((w, i) => (ws.getColumn(i + 1).width = w));
  ws.views = [{ state: "frozen", ySplit: 1 }];
  ws.getRow(1).eachCell((cell) => style(cell, { bold: true, color: "FFFFFFFF", fill: "FF223047", align: "center" }));
  ws.eachRow((row, i) => {
    if (i > 1) {
      row.height = 52;
      row.eachCell((cell) => style(cell));
    }
  });
  ws.autoFilter = { from: "A1", to: ws.getRow(1).getCell(ws.columnCount).address };
}

async function createXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "周玉田";
  wb.created = new Date();

  const guide = wb.addWorksheet("使用说明");
  guide.addRows([
    ["定位", "本版按“奥斯翰国际部总招生手册”重构，不再把八门课程拆成八本独立册子。"],
    ["核心策略", "先集中讲学校优势、国际部资源、师资团队、升学支持和学生管理，再分别介绍课程路径，扬长避短。"],
    ["课程处理", "AP/OSSD/韩国/日本/新加坡/IG纳入总册；A-Level占位可剔除；DSE暂缓，建议不进首版。"],
    ["本轮用途", "把现有第二轮资料先放进总册框架，同时列出金校和alizer最后一轮点对点补充清单。"],
    ["录音说明", "四段金校讲解录音已列入素材清单；当前本机无可用语音转写工具，待转写后再纳入最终稿。"],
  ]);
  styleSheet(guide, [18, 100]);

  const sections = wb.addWorksheet("总册PPT目录框架");
  sections.addRow(["序号", "模块", "页面角色", "现有可写内容", "待补/注意事项", "状态"]);
  brochureSections.forEach((r) => sections.addRow(r));
  styleSheet(sections, [8, 24, 16, 70, 58, 18]);

  const status = wb.addWorksheet("课程纳入状态");
  status.addRow(["课程", "负责人", "处理建议", "资料基础", "现有可写内容", "最后缺口", "状态"]);
  courseStatus.forEach((r) => status.addRow(r));
  styleSheet(status, [16, 14, 18, 28, 58, 48, 16]);

  const jin = wb.addWorksheet("金校最终补充清单");
  jin.addRow(["板块", "需要金校补什么", "具体填写要求", "优先级", "负责人回复区", "证据/附件"]);
  jinTasks.forEach((r) => jin.addRow([...r, "", ""]));
  styleSheet(jin, [16, 32, 64, 10, 42, 32]);
  jin.eachRow((row, i) => {
    if (i > 1) {
      row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
      row.getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    }
  });

  const ali = wb.addWorksheet("alizer最终补充清单");
  ali.addRow(["板块", "需要alizer补什么", "具体填写要求", "优先级", "负责人回复区", "证据/附件"]);
  alizerTasks.forEach((r) => ali.addRow([...r, "", ""]));
  styleSheet(ali, [16, 32, 64, 10, 42, 32]);
  ali.eachRow((row, i) => {
    if (i > 1) {
      row.getCell(5).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
      row.getCell(6).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFFF2CC" } };
    }
  });

  const faculty = wb.addWorksheet("师资素材总表模板");
  faculty.addRow(["姓名", "中/外教", "岗位/角色", "可支持课程", "学历/资质", "教龄/经验", "可公开亮点", "是否有照片", "是否可公开", "备注"]);
  for (let i = 0; i < 16; i++) faculty.addRow(["", "", "", "", "", "", "", "", "", ""]);
  styleSheet(faculty, [16, 12, 22, 28, 30, 20, 42, 14, 14, 28]);

  const risk = wb.addWorksheet("宣传风险边界");
  risk.addRow(["风险点", "建议处理"]);
  risks.forEach((r) => risk.addRow(r));
  styleSheet(risk, [18, 90]);

  const audios = wb.addWorksheet("录音素材清单");
  audios.addRow(["文件名", "内容判断", "当前状态", "路径"]);
  audioFiles.forEach((r) => audios.addRow([...r, path.join(materialDir, r[0])]));
  styleSheet(audios, [38, 24, 30, 90]);

  const source = wb.addWorksheet("第二轮资料索引");
  source.addRow(["资料", "用途", "处理状态"]);
  [
    ["奥斯翰邦德OSSD项目招生简章参考内容.docx", "OSSD课程核心补充", "已提取，已纳入框架"],
    ["国际部简介PPT.pptx", "学校简介、课程总览、AP/韩国/新加坡/活动/课表", "已提取，已纳入框架"],
    ["2025深圳奥斯翰外语学校（国际部）.pdf", "图片型旧册，可作视觉素材", "文本不可提取，建议设计提图"],
    ["SAIS高中-全.pdf", "总册结构参考", "已提取，用于目录结构参考"],
    ["四段金校PPT讲解录音.m4a", "金校口述课程优势", "待转写后纳入最终版"],
  ].forEach((r) => source.addRow(r));
  styleSheet(source, [42, 54, 32]);

  await wb.xlsx.writeFile(outXlsx);
}

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function box(id, x, y, w, h, text, fill = "FFFFFF", color = "1F2937", size = 1500, bold = false) {
  const emu = 914400;
  const paras = String(text)
    .split("\n")
    .map((line) => `<a:p><a:r><a:rPr lang="zh-CN" sz="${size}"${bold ? ' b="1"' : ""}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Microsoft YaHei"/><a:ea typeface="Microsoft YaHei"/></a:rPr><a:t>${esc(line)}</a:t></a:r></a:p>`)
    .join("");
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Box ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${Math.round(x * emu)}" y="${Math.round(y * emu)}"/><a:ext cx="${Math.round(w * emu)}" cy="${Math.round(h * emu)}"/></a:xfrm><a:prstGeom prst="roundRect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="D9E2EC"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="91440" tIns="68580" rIns="91440" bIns="68580"/><a:lstStyle/>${paras}</p:txBody></p:sp>`;
}

function slide(shapes) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

async function createPptx() {
  const zip = new JSZip();
  const slides = [];
  let id = 2;
  const title = (t, sub = "") => [box(id++, 0.45, 0.25, 12.45, 0.75, t, "223047", "FFFFFF", 2350, true), sub ? box(id++, 0.6, 1.08, 12.15, 0.48, sub, "F8FAFC", "475569", 1250) : ""];

  slides.push(slide([
    box(id++, 0.6, 0.55, 12.05, 1.0, "奥斯翰国际部总招生手册\n第二轮内容框架", "223047", "FFFFFF", 2600, true),
    box(id++, 0.85, 2.0, 11.55, 1.05, "本版按“总招生手册”重构：先统一讲学校优势、师资团队、升学服务和学生管理，再分课程呈现不同路径。", "FFFFFF", "1F2937", 1650, true),
    box(id++, 0.85, 3.55, 3.45, 1.15, "扬长\n通用优势先立住", "DCEBFF", "1E3A8A", 1700, true),
    box(id++, 4.95, 3.55, 3.45, 1.15, "避短\n未定课程先占位", "FFF2CC", "7A4B00", 1700, true),
    box(id++, 9.05, 3.55, 3.35, 1.15, "补齐\n点对点最后确认", "DFF3E3", "166534", 1700, true),
  ]));

  slides.push(slide([
    ...title("本轮战略调整", "从八门课程各自为战，转成一本完整的奥斯翰国际部总招生手册。"),
    box(id++, 0.7, 1.8, 5.85, 1.05, "原思路\n八门课分别补成完整课程册", "FFE4D6", "9A3412", 1550, true),
    box(id++, 6.85, 1.8, 5.85, 1.05, "新思路\n总册先讲国际部综合实力，再列课程路径", "DFF3E3", "166534", 1550, true),
    box(id++, 0.7, 3.25, 12.0, 1.25, "原因：A-Level今年刚开，师资和案例暂不能写；DSE合作机构未定，建议暂缓；多名教师跨课程授课，更适合包装成“奥斯翰国际课程教学与升学服务团队”。", "FFFFFF", "1F2937", 1500),
  ]));

  slides.push(slide([
    ...title("总册目录建议", "参考SAIS总册和深美DSE结构，做成学校总优势 + 课程路径 + 转化信息。"),
    ...[
      "学校与国际部简介", "办学历程与资质荣誉", "国际课程地图", "师资与升学服务团队", "学习管理与学生支持", "课程模块介绍", "校园环境与生活", "入学要求与收费",
    ].map((t, i) => box(id++, 0.7 + (i % 2) * 6.1, 1.7 + Math.floor(i / 2) * 0.85, 5.65, 0.58, `${i + 1}. ${t}`, i < 5 ? "DCEBFF" : "F8FAFC", "1F2937", 1350, true)),
  ]));

  slides.push(slide([
    ...title("学校与国际部可写内容", "来自国际部简介PPT，可作为总册开篇的信任背书。"),
    box(id++, 0.7, 1.75, 5.8, 2.5, "可写内容\n2004年经深圳市教育局批准创办\n罗湖区布心路2040号\n全日制民办国际化高中\nISO9001国际优质管理系统\n外语特色与多课程出口", "FFFFFF", "1F2937", 1300),
    box(id++, 6.9, 1.75, 5.7, 2.5, "待核内容\n荣誉证书年份和名称\nIBDP/UCAS/NCCT等历史资质是否仍可使用\n学校简介最终口径\n校园环境高清图与授权", "FFF2CC", "7A4B00", 1300, true),
  ]));

  slides.push(slide([
    ...title("师资策略", "不硬拆到单课，统一做成奥斯翰国际部师资矩阵。"),
    box(id++, 0.7, 1.75, 3.8, 1.2, "课程教师\n英语/数学/科学/经济/小语种", "DCEBFF", "1E3A8A", 1450, true),
    box(id++, 4.85, 1.75, 3.8, 1.2, "升学顾问\n英美加澳/日韩/新加坡/香港", "DFF3E3", "166534", 1450, true),
    box(id++, 9.0, 1.75, 3.55, 1.2, "管理支持\n班主任/导师/住宿/活动", "FFF2CC", "7A4B00", 1450, true),
    box(id++, 0.7, 3.55, 11.85, 1.25, "最后需要金校给10-15位可公开师资：姓名、照片、岗位、学历、教龄、可授课程、公开亮点。A-Level师资未定，不单独写。", "FFFFFF", "1F2937", 1450),
  ]));

  slides.push(slide([
    ...title("学生支持与校园生活", "这部分可以补足课程之外的学校优势，让总册更完整。"),
    box(id++, 0.65, 1.65, 5.9, 2.55, "已有内容\n班级早会、个性化自选辅导、小组课堂\n住宿生晚自习、导师课、MUN\nOIEP乐队、机器人编程、记者团\n韩国文化、摄影与影视编辑、运动科学", "FFFFFF", "1F2937", 1250),
    box(id++, 6.9, 1.65, 5.75, 2.55, "待补素材\n活动照片、社团照片、课堂照片\n宿舍/饭堂/校园环境高清图\n是否2026仍开设\n学生照片授权", "FFF2CC", "7A4B00", 1350, true),
  ]));

  slides.push(slide([
    ...title("课程纳入状态", "按当前确定性分层处理，后续可删减。"),
    ...courseStatus.map((r, i) => box(id++, 0.55 + (i % 4) * 3.18, 1.55 + Math.floor(i / 4) * 1.45, 2.9, 1.05, `${r[0]}\n${r[2]}\n${r[6]}`, r[2].includes("暂缓") ? "FFE4D6" : r[2].includes("占位") ? "FFF2CC" : "DFF3E3", "1F2937", 1050, true)),
  ]));

  slides.push(slide([
    ...title("OSSD课程页方向", "OSSD已经有新增资料，是本轮需要重点补齐的课程。"),
    box(id++, 0.7, 1.65, 5.85, 2.6, "可写内容\n邦德多伦多学院合作\n高二注册安省高中学籍\n中加双文凭、30学分\n6门12年级4U/4M课程+雅思\n一站式留学服务", "DFF3E3", "166534", 1250, true),
    box(id++, 6.9, 1.65, 5.75, 2.6, "必须补\n合作证明、OCT外教师资\n课程表、费用、报名流程\n学生案例、文凭样本、官网截图授权\n注意：不能写错“高二注册”", "FFF2CC", "7A4B00", 1250, true),
  ]));

  slides.push(slide([
    ...title("AP / 韩国 / 日本 / 新加坡", "这些课程可以进入总册，但成果和合作口径要核证据。"),
    box(id++, 0.55, 1.6, 3.0, 2.55, "AP\n授权School code 579073\nG7-G12路径\nAP/SAT课程清单\n缺师资/成绩/案例", "DCEBFF", "1E3A8A", 1120, true),
    box(id++, 3.75, 1.6, 3.0, 2.55, "韩国\nTOPIK三年路径\n师资和院校素材较强\n升学率等强数据需核", "DFF3E3", "166534", 1120, true),
    box(id++, 6.95, 1.6, 3.0, 2.55, "日本\n日语/EJU/JLPT\n升学服务可写\n缺最新案例和合作", "F8FAFC", "1F2937", 1120, true),
    box(id++, 10.15, 1.6, 2.65, 2.55, "新加坡\nIFD 2+2\n120学分\nSIM/PSB等需核合作性质", "FFF2CC", "7A4B00", 1080, true),
  ]));

  slides.push(slide([
    ...title("IG / A-Level / DSE处理方式", "alizer三门课要分开处理，避免把未定内容写成事实。"),
    box(id++, 0.65, 1.65, 3.75, 2.55, "IG\n可以写\n定位为国际课程缓冲与分流基础\n等alizer后天补可写内容", "DFF3E3", "166534", 1200, true),
    box(id++, 4.75, 1.65, 3.75, 2.55, "A-Level\n今年刚开\n只写课程路径和计划科目\n师资与案例不能写", "FFF2CC", "7A4B00", 1200, true),
    box(id++, 8.85, 1.65, 3.75, 2.55, "DSE\n合作机构未定\n建议首版暂缓\n不写具体课程页", "FFE4D6", "9A3412", 1200, true),
  ]));

  slides.push(slide([
    ...title("金校最终补充重点", "下一轮不是泛泛补资料，而是点对点补能进总册的证据。"),
    ...jinTasks.slice(0, 7).map((r, i) => box(id++, 0.65, 1.55 + i * 0.56, 12.0, 0.42, `${r[0]}｜${r[1]}：${r[2].slice(0, 58)}${r[2].length > 58 ? "…" : ""}`, r[3] === "P0" ? "FFF2CC" : "F8FAFC", "1F2937", 1050)),
  ]));

  slides.push(slide([
    ...title("alizer最终补充重点", "把IG写实，A-Level写边界，DSE做去留决策。"),
    ...alizerTasks.map((r, i) => box(id++, 0.65, 1.65 + i * 0.62, 12.0, 0.48, `${r[0]}｜${r[1]}：${r[2].slice(0, 68)}${r[2].length > 68 ? "…" : ""}`, r[3] === "P0" ? "FFF2CC" : "F8FAFC", "1F2937", 1080)),
  ]));

  slides.push(slide([
    ...title("下一步产出路径", "这版之后，等金校/alizer最后补齐，就可以进入总册定稿。"),
    box(id++, 0.75, 1.75, 2.8, 1.15, "1\n负责人补齐Excel", "DCEBFF", "1E3A8A", 1650, true),
    box(id++, 3.9, 1.75, 2.8, 1.15, "2\n录音转写并吸收", "FFF2CC", "7A4B00", 1650, true),
    box(id++, 7.05, 1.75, 2.8, 1.15, "3\n总册文案定稿", "DFF3E3", "166534", 1650, true),
    box(id++, 10.2, 1.75, 2.35, 1.15, "4\n设计/PPT/公众号", "FFE4D6", "9A3412", 1500, true),
    box(id++, 0.75, 3.55, 11.8, 1.15, "首版总册建议先保留A-Level占位、不放DSE具体页。若后续A-Level/DSE资料仍不确定，直接从最终总册删除，不影响整体结构。", "FFFFFF", "1F2937", 1450),
  ]));

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst><p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slides.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("")}<Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Oxstand"><a:themeElements><a:clrScheme name="Oxstand"><a:dk1><a:srgbClr val="1F2937"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="223047"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="F59E0B"/></a:accent2><a:accent3><a:srgbClr val="16A34A"/></a:accent3><a:accent4><a:srgbClr val="DC2626"/></a:accent4><a:accent5><a:srgbClr val="7C3AED"/></a:accent5><a:accent6><a:srgbClr val="0891B2"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme><a:fontScheme name="Oxstand"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:minorFont></a:fontScheme><a:fmtScheme name="Oxstand"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`);
  slides.forEach((xml, i) => {
    zip.file(`ppt/slides/slide${i + 1}.xml`, xml);
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`);
  });
  fs.writeFileSync(outPptx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

function createMd() {
  const md = `# 第二轮总招生手册策略说明

## 核心判断

本轮不建议继续按八门课程各自独立成册推进，而应改为一本“奥斯翰国际部总招生手册”。结构上先讲学校与国际部综合实力，再展示师资团队、学习管理、升学服务和校园生活，最后按课程路径分别介绍AP、OSSD、韩国、日本、新加坡、IG等课程。

这样处理的好处是：师资可以统一包装为“奥斯翰国际课程教学与升学服务团队”；A-Level今年刚开、DSE合作未定的短板不会暴露成硬伤；OSSD、韩国、新加坡、AP等已有资料的课程可以先撑起内容厚度。

## 课程处理建议

- AP、OSSD、韩国、日本、新加坡、IG：进入总册。
- A-Level：先占位，写课程路径和计划，不写师资和案例；后续资料不足可删除。
- DSE：合作机构未定，建议首版暂缓，不写具体课程页。

## 发给负责人的一句话

这次不是让大家重新写宣传文案，而是请你们补“总招生手册能落地的事实和证据”：师资、课程表、成果、案例、费用、入学要求、图片授权、不能写的风险边界。没有资料请写暂无，未确定请写待确认。

## 输出文件

- ${outPptx}
- ${outXlsx}
`;
  fs.writeFileSync(outMd, md, "utf8");
}

fs.mkdirSync(outDir, { recursive: true });
await createXlsx();
await createPptx();
createMd();
console.log(outXlsx);
console.log(outPptx);
console.log(outMd);
