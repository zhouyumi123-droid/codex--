import fs from "fs";
import path from "path";
import JSZip from "jszip";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "05_总招生手册_内容版");
const outPptx = path.join(outDir, "奥斯翰国际部总招生手册_内容框架版_负责人审阅.pptx");
const outMd = path.join(outDir, "奥斯翰国际部总招生手册_内容框架版_说明.md");

fs.mkdirSync(outDir, { recursive: true });

const slides = [
  {
    type: "cover",
    title: "深圳奥斯翰外语学校国际部",
    subtitle: "2026精品国际课程招生手册｜内容框架版",
    body: "负责人审阅用途：已有内容先进入框架，待补内容已在对应页面标注。",
  },
  {
    title: "本版手册定位",
    subtitle: "从“八门课分散介绍”调整为“国际部总招生手册”。",
    points: [
      "先讲学校与国际部综合实力：办学历史、外语特色、管理体系、师资团队、升学支持。",
      "再按学生目标方向介绍课程路径：AP、OSSD、韩国、日本、新加坡、IG/Pre-Program，A-Level占位，DSE暂缓。",
      "师资不强行绑定单一课程，统一包装为“奥斯翰国际课程教学与升学服务团队”。",
      "A-Level今年刚开，师资和案例暂不写；DSE合作机构未定，建议首版不放具体页。",
    ],
    todo: "请负责人确认：最终总册是否纳入A-Level占位页；DSE是否直接剔除。",
  },
  {
    title: "学校简介",
    subtitle: "2004年创办的深圳老牌民办国际化高中。",
    points: [
      "深圳奥斯翰外语学校位于深圳市罗湖区布心路2040号，2004年经深圳市教育局批准创办。",
      "学校育人目标为“与世界同步，培育跨时代精英人才”。",
      "学校植根中华传统文化，融贯东西方教育思想，依托外语特色，开设多元升学课程。",
      "宣传口径建议：严格定义为“民办国际化高中”，招生传播中可使用“国际高中/国际部精品课程”表达。",
    ],
    todo: "确认学校简介最终文字、校名英文、2026招生电话与二维码。",
  },
  {
    title: "学校优势表达",
    subtitle: "把老校区短板转化为“老牌、港风、小规模、师资扎实”的表达。",
    points: [
      "创办于2004年，是深圳较早开展国际教育探索的民办学校之一。",
      "学校具有港风、小规模、管理链条短、师生关系紧密的特点。",
      "硬件不是本轮主卖点，招生表达应强调：老牌办学积累、国际课程经验、师资团队和升学服务。",
      "未来如涉及新校区规划，可作为咨询沟通补充，不建议在物料中写成确定承诺。",
    ],
    todo: "补充可用校园图片：行政楼、教室、宿舍、饭堂、活动、学生作品/课堂照片。",
  },
  {
    title: "办学历程与资质荣誉",
    subtitle: "用时间轴建立可信度，但历史资质需逐项核对。",
    points: [
      "2004年创校；2006年成为深圳市一级学校。",
      "2008年引入ISO9001国际优质教育管理认证；2010年获广东省民办教育发展“示范名校”称号。",
      "2009年引进韩国大学直升课程；2012年引进日本大学先修课程。",
      "2016年获美国大学理事会College Board批准成为AP授权学校；2024年AP授权代码可查。",
      "学校曾获IBDP世界学校等资质，相关历史资质在对外使用前需确认当前状态。",
    ],
    todo: "逐项补证书照片/可公开口径。UCAS、IB、NCCT、HSK等历史资质需确认是否仍可写。",
  },
  {
    title: "国际课程地图",
    subtitle: "按目标地区规划，而不是简单堆课程名称。",
    points: [
      "英美加澳方向：AP、OSSD、A-Level占位、IG/Pre-Program衔接。",
      "韩国方向：KUPP韩国大学直升课程，TOPIK三年递进。",
      "日本方向：JUPP日本大学直升课程，日语/EJU/JLPT等路径。",
      "新加坡方向：IFD/新加坡方向，2年国内学习后衔接新加坡院校。",
      "低年级/未定方向：IG/Pre-Program作为国际课程缓冲和分流基础。",
    ],
    todo: "确认最终招生口径：各课程招生年级、是否接收插班、费用、入学测试。",
  },
  {
    title: "如何帮学生选择课程",
    subtitle: "把课程选择讲成升学路线规划。",
    points: [
      "目标美国/香港/多国申请：优先看AP与标化组合，匹配SAT、托福/雅思和AP科目。",
      "目标加拿大/多国申请：OSSD适合走安省课程、过程性评价和加拿大高中学分路径。",
      "目标韩国：适合愿意系统学习韩语、通过TOPIK和校内文化课成绩申请韩国高校的学生。",
      "目标日本：适合愿意系统学习日语，并准备EJU/JLPT/校内考/面试的学生。",
      "目标新加坡：适合希望先在国内完成语言和预科能力建设，再衔接新加坡本科的学生。",
    ],
    todo: "补各课程典型学生画像：成绩基础、英语/小语种基础、家庭预算、目标院校层级。",
  },
  {
    title: "奥斯翰国际课程师资团队",
    subtitle: "不按单课重复露出，统一做总师资矩阵。",
    points: [
      "师资展示建议分为：语言教师、学科教师、小语种教师、升学指导教师、班主任/导师团队。",
      "AP/A-Level/IG等课程可共用部分英语、数学、科学、经济等师资，不强行写成某一门课专属。",
      "韩国方向已有较强师资素材：韩国籍专家、韩国语研究中心顾问、KFL持证导师、韩国大学升学研究中心等。",
      "日本、OSSD、AP、新加坡方向需要补具体教师姓名、照片、学历、教龄和可公开亮点。",
    ],
    todo: "金校提供10-15位可公开师资；alizer确认IG/A-Level可公开师资或明确待定。",
  },
  {
    title: "学习管理与日常支持",
    subtitle: "让家长看到孩子每天怎么被管理、怎么被支持。",
    points: [
      "每日7:50到校，8:00-8:10班级早会；全天按课程表学习。",
      "第7节后设置个性化自选辅导班/小组课堂，按学生需求走班。",
      "住宿生周一至周四18:30-20:30晚自习，20:30交手机，22:30宿舍巡访点名。",
      "学生导师课、模拟联合国、社团活动等可作为学生支持和综合素养培养内容。",
    ],
    todo: "确认2026作息表是否沿用；补导师课、MUN、社团、晚自习现场照片。",
  },
  {
    title: "外语特色与多语种资源",
    subtitle: "奥斯翰作为外语学校的可传播优势。",
    points: [
      "学校开设英语、日语、韩国语、西班牙语、俄罗斯语等外国语课程。",
      "金校口径：多语种课程配备外教资源，韩国语外教资源较丰富，日本方向也有外教配置。",
      "口语类课程可强调外教授课，写作类/学术类课程可强调中外教协同。",
      "多语种资源可服务AP、韩国、日本、新加坡、IG等不同课程路径。",
    ],
    todo: "补各语种教师名单、外教国籍/资质、具体授课范围。西语/俄语是否进入总册需确认。",
  },
  {
    title: "升学服务体系",
    subtitle: "总册要证明学校不是只教课，而是提供升学闭环。",
    points: [
      "升学服务覆盖英美加澳、韩国、日本、新加坡、香港等方向。",
      "可写服务模块：选课规划、语言考试规划、标化考试规划、院校定位、申请材料、面试辅导、签证/行前支持。",
      "韩国、新加坡、OSSD等方向已有一站式服务表达基础。",
      "学籍问题建议作为咨询话术，不主动在总册中强调；如家长询问，说明国际升学通常不依赖国内学籍，是否保留按家庭需求另行沟通。",
    ],
    todo: "补升学老师名单、服务边界、过往录取案例、各方向申请时间轴。",
  },
  {
    title: "AP国际课程",
    subtitle: "College Board授权课程，适合美本及多国申请路径。",
    points: [
      "学校为College Board授权AP学校，School code: 579073。",
      "Pre-Program至G10阶段完成英语、数学、综合科学、世界历史、全球视野、基础经济学、运动科学、中文/中国文学等基础课程。",
      "G11-G12进入AP和SAT冲刺阶段，开设AP微积分AB/BC、AP预科微积分、AP化学、生物、物理、微观/宏观经济、世界历史、中文等。",
      "选修课包括韩语、西语、日语、韩国文化与历史、英语学术写作、英语口语、托福、雅思、SAT数学等。",
    ],
    todo: "补AP教师、近年AP成绩、学生案例、升学结果。AP授权证明建议放截图。",
  },
  {
    title: "AP课程路径",
    subtitle: "三阶段递进：准备、过渡、冲刺。",
    points: [
      "G7-G8：SAT&AP准备阶段，强化英语听说读写、代数几何、基础科学和地理等基础能力。",
      "G9-G10：SAT&AP过渡阶段，提升学科英语能力，开始AP相关学科学习，为后续考试做准备。",
      "G11-G12：SAT&AP冲刺阶段，英语以SAT考试为目标，数学进入AP微积分学习，科学和社科方向选择AP考试科目。",
      "申请香港方向时，建议至少配置一门数学相关AP科目；具体组合需结合学生目标专业和优势科目规划。",
    ],
    todo: "补AP选课建议表：目标美国/香港/理工/商科/文科分别推荐哪些组合。",
  },
  {
    title: "OSSD中加课程",
    subtitle: "加拿大安大略省高中课程路径，确定纳入总册重点课程。",
    points: [
      "OSSD是加拿大安大略省高中毕业文凭，可用于申请加拿大、英国、美国、澳洲、新西兰、欧洲、东南亚及香港等高校。",
      "奥斯翰邦德OSSD项目与加拿大邦德多伦多学院合作设立。",
      "项目学生高二注册安大略省高中学籍，这一点对外表述必须准确。",
      "学生在奥斯翰完成中加两国高中课程，中方基础课程转换部分加拿大学分，与加方课程共同构成30个学分。",
      "申请大学时以6门12年级4U/4M课程学术成绩和雅思成绩作为核心材料。",
    ],
    todo: "补邦德合作证明、安省学籍注册说明、OCT外教师资、OSSD文凭样本/官网录取许可截图授权。",
  },
  {
    title: "OSSD课程设置",
    subtitle: "高一、高二、高三逐步从中方基础过渡到加方学术课程。",
    points: [
      "高一：中方基础课程 + 2-3门加方语言和文科课程。",
      "高二：少量中方基础课 + 6门加方文理科学术课程。",
      "高三：6-7门加方学术课程。",
      "中方基础课程包括语文、数学、英语、物理、化学、政治、计算机、历史、地理、体育等。",
      "加方课程包括ESL、ENG2D/3U/4U、MCR3U、MHF4U、MCV4U、SPU3U、SPH4U、SCH4U、CIE3M、BBB4M等，具体可按学生程度微调。",
    ],
    todo: "确认最终课表、学分转换、每门课开课年级、是否高三必须赴加拿大等关键口径。",
  },
  {
    title: "韩国大学直升课程 KUPP",
    subtitle: "以TOPIK能力递进和韩国本科申请为主线。",
    points: [
      "高一：韩语入门、文化学科、国际交流活动、跨文化学习、个性化选课规划、1对1导师指导，TOPIK目标1-2级。",
      "高二：中级韩国语、TOPIK、韩国文化与历史、学业规划、国际交流活动，TOPIK目标3-4级。",
      "高三：高级韩国语、TOPIK冲刺、留学生活指导、职业规划、一站式留学服务、升学指导，TOPIK目标5-6级。",
      "学校是深圳较早开设韩国语小语种课的全日制高中之一，韩国方向师资和资源较强。",
    ],
    todo: "100%升学率、顶尖大学46%、TOP20 90%以上等强数据必须核对年份、统计口径和证据。",
  },
  {
    title: "韩国方向优势",
    subtitle: "适合目标韩国名校、愿意系统学习韩语的学生。",
    points: [
      "韩国高校在商科、理工、艺术设计、传媒影视、医学与健康科学等方向具备优势。",
      "韩国留学费用相对较低，资料口径约为每年人民币6-10万元。",
      "韩国文化与中国文化接近，学生适应成本相对低。",
      "国际学生可申请奖学金，部分学校学费减免比例较高。",
      "学校可结合TOPIK、文化课程成绩、面试与申请材料进行升学规划。",
    ],
    todo: "补具体学生案例、offer图片、奖学金案例、院校合作/交流证明。",
  },
  {
    title: "日本大学直升课程 JUPP",
    subtitle: "以日语能力、EJU留考和日本本科申请为主线。",
    points: [
      "课程方向包括日语分层学习、JLPT/NAT/J.TEST/EJU备考、日本文化与留学生活适应。",
      "适合目标日本本科、愿意长期学习日语并接受校内考/面试准备的学生。",
      "课程可结合日语外教、中方EJU学科教师和升学指导老师形成支持体系。",
      "金校录音提示：日本课程师资与合作资源需要进一步补齐，宣传时应包装现有长处，不暴露短板。",
    ],
    todo: "补日本师资、合作院校、过往录取、费用、EJU科目设置、学生案例。",
  },
  {
    title: "新加坡IFD方向",
    subtitle: "2年国内学习 + 新加坡本科衔接的规划路径。",
    points: [
      "学校两年制新加坡直升课程采用“2+2”路径，学生前两年在国内完成语言、基础学科和大学预科内容。",
      "第一年以综合英语、英美文学、基础科学、世界历史、全球视野、数学、中文等为基础。",
      "第二年课程设置18门，其中必修4门、选修14门，按必修+选修模式完成总计120学分。",
      "升学方向涉及SIM、PSB Academy等新加坡院校衔接资源。",
      "录音补充：新加坡合作单位第二年部分尚未完全谈定，建议先按学校自有新加坡方向谨慎表达。",
    ],
    todo: "核对IFD认证、合作院校、学分互认、内测、世界前200学位表述，避免过度承诺。",
  },
  {
    title: "IG / Pre-Program国际预备课程",
    subtitle: "给低年级学生一个进入国际课程的缓冲和分流基础。",
    points: [
      "Pre-Program覆盖G7-G10衔接，服务后续AP、A-Level、OSSD、韩国、日本、新加坡等路径。",
      "课程包括ESL、IG数学、全球视野、历史、文学、科学、中文、韩语、日语等。",
      "IG阶段用于完成学术英语、数学、科学、人文社科等基础能力建设。",
      "G10后可根据学生目标方向分流至AP、OSSD、新加坡、韩国、日本、A-Level等课程。",
    ],
    todo: "alizer补IG最终课程设置、师资、课表、分流机制、成果案例。",
  },
  {
    title: "A-Level课程（占位页）",
    subtitle: "今年刚开，建议只写体系和计划，不写师资与案例。",
    points: [
      "A-Level可作为英联邦方向的重要课程路径，适合目标英国、香港、澳洲、加拿大等方向的学生。",
      "现有资料可写：G10 IGCSE准备，G11-G12进入AS/A2阶段；数学、物理、化学、经济等方向可作为计划科目。",
      "公需课可包括ESL、中文、体育、CA、升学辅导等。",
      "由于今年刚开，暂无过往学生案例；师资尚未最终确定，不建议在首版写成事实。",
    ],
    todo: "alizer确认是否进入总册；若资料不足，最终版直接删除本页。",
  },
  {
    title: "DSE课程（暂缓页）",
    subtitle: "合作机构未定，不建议进入首版对外总册。",
    points: [
      "DSE目前仍在寻找合作机构，课程授权、师资、课表、费用和升学支持均未最终确认。",
      "可在内部保留为后续拓展方向，但不建议对外宣传具体课程优势。",
      "若后续确定合作机构，可按深美DSE参考结构补齐：课程介绍、优势、课程规划、师资、成果、升学方向、入学收费等。",
    ],
    todo: "确认是否从最终PPT删除。若保留，必须补合作机构、授权、师资、课程、收费和风险边界。",
  },
  {
    title: "校园环境与学生生活",
    subtitle: "作为总册视觉支撑，不作为主要卖点夸大。",
    points: [
      "可展示校园环境、教室、宿舍、饭堂、活动空间、社团活动、MUN、导师课、晚自习等场景。",
      "老校区表达应强调“港风、小规模、管理稳定、师生关系紧密”，避免与新校硬件正面比较。",
      "学生社团可展示OIEP乐队、机器人编程、记者团、韩国文化、摄影与影视编辑、社会统计、运动科学等。",
    ],
    todo: "从国际部PPT/2025国际部PDF提取高清图片，并确认学生肖像授权。",
  },
  {
    title: "入学要求与收费",
    subtitle: "这是从宣传转报名的关键页，目前必须补齐。",
    points: [
      "建议统一呈现：招生对象、入学测试、面试、学费、住宿费、餐费、杂费、报名流程、咨询方式。",
      "各课程可分别列年级入口：G7-G10预备课程、G10/G11课程入口、韩国/日本/新加坡/OSSD/AP方向入口。",
      "学籍问题不建议放入手册正文，可作为招生咨询FAQ处理。",
      "若家长主动询问学籍：国际升学通常不依赖国内学籍，是否保留按家庭未来规划另行沟通，费用需单独确认。",
    ],
    todo: "财务/负责人补各课程费用、入学要求、是否住宿、报名截止时间。",
  },
  {
    title: "宣传风险边界",
    subtitle: "负责人审阅时必须统一口径。",
    points: [
      "不能写“保录”“一定录取”“无条件直升”“名校保送”等绝对承诺。",
      "韩国100%升学率、TOP20比例、顶尖大学比例等可以作为强卖点，但必须确认统计年份、样本范围和证据。",
      "A-Level不能写过往案例和确定师资；DSE不能写合作资源、课程授权和师资成果。",
      "OSSD必须准确写“高二注册安省学籍”，不要写成入学即注册。",
      "合作院校、学分互认、内测、推荐、交流、正式授权必须区分。",
    ],
    todo: "请金校/alizer把不能写、只能内部说、可公开写的内容逐条标清楚。",
  },
  {
    title: "负责人最终补充清单",
    subtitle: "补完这些内容，就可以进入总册定稿和设计。",
    points: [
      "金校：10-15位可公开师资、OSSD合作证明与课程表、AP成绩与师资、韩国强数据证据、日本最新成果、新加坡合作口径。",
      "alizer：IG可写内容、A-Level是否纳入、A-Level课程设置与边界、DSE是否暂缓、IG/A-Level费用和入学要求。",
      "设计侧：校园高清图、课堂图、宿舍饭堂图、学生活动图、师资照片、offer/证书/授权截图。",
      "财务/招生侧：2026费用、报名流程、联系人、二维码、招生截止时间。",
    ],
    todo: "建议负责人逐页审阅，在对应页补“可写/不可写/待确认”。",
  },
  {
    title: "招生咨询",
    subtitle: "最终版需替换为2026招生季确认信息。",
    points: [
      "招生办公室：0755-25813956（待确认）",
      "国际课程中心：0755-25805707 / 13510068639（待确认）",
      "校长室：0755-25805887（待确认）",
      "课程顾问电话与二维码需统一更新。",
    ],
    todo: "确认最终联系人、电话、二维码、地址、公众号/小程序链接。",
  },
];

function esc(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

function tx(id, x, y, w, h, text, opts = {}) {
  const emu = 914400;
  const fill = opts.fill || "FFFFFF";
  const color = opts.color || "1F2937";
  const size = opts.size || 1300;
  const bold = opts.bold ? ' b="1"' : "";
  const paras = String(text)
    .split("\n")
    .map((line) => `<a:p><a:r><a:rPr lang="zh-CN" sz="${size}"${bold}><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:rPr><a:t>${esc(line)}</a:t></a:r></a:p>`)
    .join("");
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="Box ${id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${Math.round(x * emu)}" y="${Math.round(y * emu)}"/><a:ext cx="${Math.round(w * emu)}" cy="${Math.round(h * emu)}"/></a:xfrm><a:prstGeom prst="${opts.shape || "roundRect"}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}"/></a:solidFill><a:ln><a:solidFill><a:srgbClr val="${opts.line || "D9E2EC"}"/></a:solidFill></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="91440" tIns="68580" rIns="91440" bIns="68580"/><a:lstStyle/>${paras}</p:txBody></p:sp>`;
}

function slideXml(shapes) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

function bulletText(points) {
  return points.map((p) => `• ${p}`).join("\n");
}

async function main() {
  const zip = new JSZip();
  const xmls = [];
  let id = 2;
  for (let i = 0; i < slides.length; i++) {
    const s = slides[i];
    const shapes = [];
    if (s.type === "cover") {
      shapes.push(tx(id++, 0, 0, 13.333, 7.5, "", { fill: "223047", shape: "rect", line: "223047" }));
      shapes.push(tx(id++, 0.75, 0.9, 11.8, 1.35, s.title, { fill: "223047", line: "223047", color: "FFFFFF", size: 3300, bold: true }));
      shapes.push(tx(id++, 0.75, 2.45, 11.8, 0.65, s.subtitle, { fill: "223047", line: "223047", color: "DCEBFF", size: 1750, bold: true }));
      shapes.push(tx(id++, 0.75, 4.9, 11.8, 0.75, s.body, { fill: "FFFFFF", color: "1F2937", size: 1450, bold: true }));
    } else {
      shapes.push(tx(id++, 0.35, 0.25, 12.65, 0.68, `${String(i).padStart(2, "0")}  ${s.title}`, { fill: "223047", color: "FFFFFF", size: 1950, bold: true }));
      shapes.push(tx(id++, 0.55, 1.08, 12.25, 0.45, s.subtitle, { fill: "F8FAFC", color: "475569", size: 1150 }));
      shapes.push(tx(id++, 0.65, 1.75, 7.4, 4.85, bulletText(s.points), { fill: "FFFFFF", color: "1F2937", size: s.points.length > 4 ? 1120 : 1220 }));
      shapes.push(tx(id++, 8.35, 1.75, 4.25, 4.85, `待补/待确认\n${s.todo || "无"}`, { fill: "FFF2CC", color: "7A4B00", size: 1220, bold: true }));
    }
    shapes.push(tx(id++, 11.8, 6.95, 1.0, 0.25, `${i + 1}/${slides.length}`, { fill: "F8FAFC", color: "64748B", size: 800 }));
    xmls.push(slideXml(shapes));
  }

  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${xmls.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst><p:sldIdLst>${xmls.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="wide"/><p:notesSz cx="6858000" cy="9144000"/></p:presentation>`);
  zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${xmls.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("")}<Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Oxstand"><a:themeElements><a:clrScheme name="Oxstand"><a:dk1><a:srgbClr val="1F2937"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="223047"/></a:dk2><a:lt2><a:srgbClr val="F8FAFC"/></a:lt2><a:accent1><a:srgbClr val="2563EB"/></a:accent1><a:accent2><a:srgbClr val="F59E0B"/></a:accent2><a:accent3><a:srgbClr val="16A34A"/></a:accent3><a:accent4><a:srgbClr val="DC2626"/></a:accent4><a:accent5><a:srgbClr val="7C3AED"/></a:accent5><a:accent6><a:srgbClr val="0891B2"/></a:accent6><a:hlink><a:srgbClr val="2563EB"/></a:hlink><a:folHlink><a:srgbClr val="7C3AED"/></a:folHlink></a:clrScheme><a:fontScheme name="Oxstand"><a:majorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface="Microsoft YaHei"/></a:minorFont></a:fontScheme><a:fmtScheme name="Oxstand"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`);
  xmls.forEach((xml, i) => {
    zip.file(`ppt/slides/slide${i + 1}.xml`, xml);
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`);
  });

  fs.writeFileSync(outPptx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
  fs.writeFileSync(
    outMd,
    `# 奥斯翰国际部总招生手册内容框架版说明\n\n已整合第二轮新增资料、国际部PPT、OSSD补充文档、SAIS参考结构、四段金校录音妙记摘要。\n\n用途：给金校和alizer审阅，确认哪些内容可写、哪些需要补证据、哪些必须删除。\n\n输出文件：${outPptx}\n`,
    "utf8",
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
