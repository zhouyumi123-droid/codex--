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
const inputXlsx = path.join(root, "04_课程卖点统筹/课程卖点信息采集汇总表_填写版.xlsx");
const outputXlsx = path.join(root, "04_课程卖点统筹/课程卖点信息采集汇总表_第一轮补充版.xlsx");
const jinDocx = path.join(root, "02_金校_课程内容采集/金校_课程卖点信息采集问答_第一轮补充版.docx");
const alizerDocx = path.join(root, "03_alizer_课程内容采集/alizer_课程卖点信息采集问答_第一轮补充版.docx");
const sourceNote = "来源：2026-05-26最新Word优先，旧PDF宣传册补充；需项目负责人最终核对。";

const common = "奥斯翰共通底座：深圳本土办学20余年，深圳市一级学校、深圳市高考先进单位、广东省民办教育“示范名校”；2004年经深圳市教育局批准设立，具备全日制办学基础；多课程出口并行，能为学生提供分流与升学路径选择。";

const rowMap = [
  ["定位", "一句话说明这是什么课程"],
  ["学生", "主要面向哪些学生"],
  ["年级", "适合年级/阶段"],
  ["升学", "主要升学方向"],
  ["优势1", "优势1：奥斯翰能做到、别人不一定能做到的点"],
  ["优势2", "优势2：奥斯翰能做到、别人不一定能做到的点"],
  ["优势3", "优势3：奥斯翰能做到、别人不一定能做到的点"],
  ["学制", "学制/学习周期"],
  ["模块", "核心课程模块"],
  ["考试", "考试或评价方式"],
  ["路径", "入学到升学路径"],
  ["师资", "师资或教学团队优势"],
  ["管理", "班级管理/学业管理方式"],
  ["指导", "升学指导方式"],
  ["案例", "学生案例"],
  ["结果", "升学结果"],
  ["资源", "合作资源/证书/图片/链接"],
  ["问答1", "家长最常问的问题及回答1"],
  ["问答2", "家长最常问的问题及回答2"],
  ["竞品", "家长通常会拿谁比较？奥斯翰差异是什么？"],
  ["风险", "不能写、不能承诺、需要保守表达的内容"],
  ["短句1", "可用于宣传的短句1"],
  ["短句2", "可用于宣传的短句2"],
  ["短句3", "可用于宣传的短句3"],
];

const data = {
  "韩国课程": {
    owner: "金校",
    source: "Word：韩国留学方向项目信息收集清单；PDF：韩国课程宣传册",
    fields: {
      定位: "韩国大学直升课程，覆盖韩语课程、TOPIK 1-6级备考与韩国本科申请指导，帮助学生以校内成绩、TOPIK成绩和申请材料进入韩国本科院校。",
      学生: "目标韩国本科、希望避开单一高考路径、愿意系统学习韩语并接受海外升学规划的高中学生；艺术类学生可作为拓展方向，但作品集目前需校外完成。",
      年级: "高中阶段，高一开始准备最合适；课程规划为高一TOPIK 1-2级、高二TOPIK 3-4级、高三TOPIK 5-6级。",
      升学: "韩国本科院校，重点面向韩国TOP20大学、SKY等顶尖大学，以及经营、金融、经济、理工、艺术等方向。",
      优势1: "分阶段TOPIK教学+韩语环境沉浸：高一到高三按TOPIK等级递进，既做语言能力，也服务本科申请。",
      优势2: "申请全流程支持：提供选校、文书、自我介绍、学习计划、面试辅导、网申、签证协助等，不把学生简单推给中介。",
      优势3: "已有升学结果支撑：近三年韩国方向毕业生47人、录取47人；资料显示长期保持100%升学率、90%以上TOP20、40%以上TOP10录取率。",
      学制: "建议三年制高中路径：高一语言基础，高二语言进阶与申请准备，高三TOPIK冲刺和本科申请。",
      模块: "韩语外教/中教课程、TOPIK备考、韩国大学申请材料、面试辅导、韩国文化与留学适应、签证与行前指导。",
      考试: "TOPIK为核心语言考试；高考成绩非必需，可作为辅助材料；韩国本科申请还需校内成绩证明和其他申请材料。",
      路径: "入学评估 → 韩语分级学习 → TOPIK等级提升 → 选校定位 → 文书/面试/网申 → 录取 → 签证与行前指导。",
      师资: "柯珍：成均馆大学背景，TOPIK 6级，6年教龄；Mr. HEO：韩国籍首席韩国语教师，10年以上教龄；Mrs. JANG：韩国籍专家/KIEP学术副校长，20年教龄。",
      管理: "升学指导老师全程跟踪，查缺补漏；通过校内学习计划推进TOPIK目标，辅以家校沟通和申请节点管理。",
      指导: "有韩国籍或留韩背景升学顾问；学校每年邀请韩国高丽大学、成均馆大学等院校来校教育交流与招生说明。",
      案例: "资料暂未提供具体学生化名案例；已提供2023-2025年度录取总览，需补充可公开学生案例、专业和奖学金情况。",
      结果: "2025年毕业生16人、韩国大学录取16人、SKY录取2人；2024年14人、录取14人、SKY录取4人；2023年17人、录取17人、SKY录取2人。",
      资源: "与成均馆大学、韩国京畿大学、全州大学保持交流合作；但资料明确说明韩国本科院校不签署保录协议。",
      问答1: "问：不会韩语能去韩国留学吗？答：可以，但需根据目标专业和授课语言规划；部分经营、金融、经济等英文授课专业可用英语成绩申请，韩语路径建议系统学习TOPIK。",
      问答2: "问：韩国留学一年费用多少？答：资料口径为约15-20万元；首尔地区通常高于地方城市，最终以学校、专业和生活方式为准。",
      竞品: "竞品包括新东方韩语、蔚蓝韩国留学、金吉列、韩国语学院/中介项目。奥斯翰差异在于全日制学校环境、韩语外教、升学指导全程跟踪、录取数据支撑，并强调真实合规而非夸大保录。",
      风险: "不能写“保录”“无条件直录”“一定进SKY”。资料明确：韩国本科院校不会与海外高中签署保录协议；升学率、TOP20/TOP10数据需项目负责人确认可公开口径。",
      短句1: "不靠保录话术，靠韩语能力、校内成绩和申请规划，把韩国升学做成可跟踪的路径。",
      短句2: "从TOPIK 1级到本科申请，奥斯翰把韩语学习和升学结果连在一起。",
      短句3: "全日制韩语环境、外教教学、升学指导和录取数据，是韩国方向最核心的招生说服力。",
    },
  },
  "日本课程": {
    owner: "金校",
    source: "Word：日本留学方向项目信息收集清单（多数待填）；PDF：日本课程宣传册",
    fields: {
      定位: "日本留学班，覆盖日语课程、JLPT/NAT/EJU备考、升学指导、日本文化与留学生活适应，面向计划赴日升读本科的学生。",
      学生: "目标日本本科、希望通过日语/EJU/校内考进入日本大学的初三毕业生、高中在读生；零基础可入读，需通过学校入学测试与面试。",
      年级: "初三在读、初中毕业、高中在读均可咨询；课程宣传册显示高一N5/N4、高二N3/N2、高三N2/N1递进。",
      升学: "日本公立/私立大学、艺术类大学、合作本科院校及语言学校衔接路径。",
      优势1: "深圳较早开设全日制日本留学课程，宣传册显示14年专业经验，适合希望在国内完成系统日语和升学准备的学生。",
      优势2: "零基础分层教学：资深日籍外教与中方日语教师共同授课，面向JLPT、NAT、EJU做专项备考。",
      优势3: "升学服务覆盖面较完整：选校、考试、面试、签证、出国适应和出国后反馈均有服务设计。",
      学制: "可按3年奥斯翰高中+日本本科，或3年奥斯翰高中+0.5年日本合作语言学校+本科等路径规划；具体以最新合作政策核对。",
      模块: "日语听力/阅读/写作、日语会话演讲、JLPT备考、EJU留考、国学、日本文化、国际交流、升学面试辅导、留学生活指导。",
      考试: "JLPT/NAT/J.TEST等日语能力考试、EJU日本留学生考试、院校网考/面试；EJU总分800分，日语400、数学200、文/理综合200。",
      路径: "入学测试 → 日语分层学习 → JLPT/NAT/EJU备考 → 选校与出愿 → 网考/面试 → 录取 → 签证与行前服务。",
      师资: "PDF提到资深日籍外教及中方日语教师共同授课；具体教师姓名、教龄、等级、留日经历需金校补充。",
      管理: "可结合学校全日制管理、分层教学、家校沟通和出国前后服务；具体课堂跟踪和模考频率需补充。",
      指导: "宣传册提到15年以上资深升学顾问一对一全学程定制升学方案；需确认当前顾问团队和可公开表述。",
      案例: "PDF列出部分优秀毕业生录取学校，如东京大学、京都精华大学、静冈大学、立命馆大学、关西学院大学等；需补充学生届别、专业和可公开姓名口径。",
      结果: "PDF写明签证率99%以上、升学率100%；该数据需金校确认年份、统计口径和是否可公开使用。",
      资源: "PDF列出合作本科院校、合作高中、合作语言学校及语言学校推荐大学；需确认最新合作名单和合作形式。",
      问答1: "问：不会日语可以读吗？答：可以，课程面向零基础学生设置日语入门、会话、词汇语法和分层教学，但目标大学越高，对日语/EJU/英语要求越高。",
      问答2: "问：日本留学一年费用多少？答：PDF口径为约12-16万元/年；东京等城市费用可能更高，需按院校和生活方式核对。",
      竞品: "竞品包括新东方日本留学、樱花国际日语、行知学园、名校志向塾等。奥斯翰差异在于全日制高中场景、日语+EJU+升学指导一体化、出国前后服务链条。",
      风险: "旧PDF中“保送本科”“绿色通道直升”等表述需谨慎，建议改为“合作衔接/推荐/符合条件可申请”，避免绝对化承诺。",
      短句1: "从零基础日语到EJU和日本本科申请，奥斯翰把赴日升学做成一条可规划的全日制路径。",
      短句2: "不是只学日语，而是把语言、EJU、面试、签证和留学适应一起准备。",
      短句3: "适合想去日本、但需要学校系统管理和升学陪跑的学生。",
    },
  },
  "新加坡课程": {
    owner: "金校",
    source: "Word：新加坡方向（IFD课程）项目信息收集清单；PDF：新加坡留学课程宣传册",
    fields: {
      定位: "新加坡IFD/大学直升方向：国内2年预科，高一英语强化，高二修读IFD国际预科文凭课程，完成后衔接新加坡合作本科；顶尖大学目标可加读A-Level/SAT/AP再申请。",
      学生: "初中毕业、高一或高二在读、国际插班生；适合希望缩短升学周期、目标新加坡高校或希望以新加坡为跳板进入国际本科/硕士路径的学生。",
      年级: "高一以英语强化为主，高二进入IFD课程；PDF招生对象包含初中毕业生、高一/高二在读学生、国际插班生。",
      升学: "新加坡合作本科院校，如SIM、Kaplan、PSB、MDIS、JCU Singapore等；冲刺路径面向NUS/NTU/SMU等。",
      优势1: "2+2学制节省时间：国内2年+新加坡本科2年，最快4年完成高中到本科，较传统高中+本科路径节省时间成本。",
      优势2: "英语基础薄弱学生有缓冲：高一先做全年英语强化和学术英语训练，再进入IFD课程，降低直接出国风险。",
      优势3: "新加坡路径兼具安全、距离、费用和就业优势：PDF强调安全宜居、华人比例高、费用相对欧美低、就业政策友好。",
      学制: "直升合作大学路径：国内2年+新加坡本科2年，总约4年；冲刺顶尖大学路径：国内2年+1年A-Level/SAT/AP+本科3-4年。",
      模块: "第一年：综合英语、英美文学、基础科学、世界历史、全球视野、数学、中文；第二年：学术用途英语、大学研究与学习技巧、英语语言技巧、大学数学及商科/科学/计算机/艺术等选修。",
      考试: "IFD课程成绩、学术用途英语、合作院校内测或雅思/托福等；具体IFD认证机构和评分比例需项目负责人补充。",
      路径: "入学考试/面试 → 高一英语强化 → 高二IFD课程 → 合作院校申请/内测 → 新加坡本科阶段 → 本科/硕士深造或就业。",
      师资: "Word未提供具体教师；PDF提到双语教师、全英文浸润式教学辅以中文支持。需补充教师姓名、资质、科目和海外背景。",
      管理: "国内阶段通过英语强化、学术写作、必修+选修学分课程管理；出国阶段提供学业跟踪、学业指导、心理辅导、论文/作业支持。",
      指导: "升学通道嵌入新方院校导师一对一规划、模拟面试及文书优化服务；入学服务包含签证办理、学生公寓安排等。",
      案例: "Word暂未提供往届录取案例；需补充直升合作大学案例、IFD成绩、录取学校和冲刺NUS/NTU案例。",
      结果: "目前缺少可核对的年度升学数据；PDF主张最快4年获得世界排名前200大学学位，需确认对应合作院校与学位授予方。",
      资源: "PDF列出SIM、PSB、MDIS、Kaplan、JCU Singapore、EGA等升学途径；语言要求页列出多个院校内测/雅思要求和学位颁发院校。",
      问答1: "问：高一只学英语会不会耽误学科？答：高一是为IFD和海外本科打底的学术英语/基础学科阶段，不是只学口语，而是为后续全英课程做过渡。",
      问答2: "问：合作院校是否正规？答：需逐所说明Edutrust认证、中国教育部留服认证和学位颁发院校；该部分必须由项目负责人核对最新名单。",
      竞品: "竞品包括新加坡ACE、辅仁国际学校、国内其他新加坡预科项目。奥斯翰差异在于国内2年缓冲、英语强化、IFD课程、合作院校衔接和可选顶尖大学冲刺路径。",
      风险: "不能写“一定能去新加坡”“保证录取NUS/NTU”。合作院校、认证、内测、语言成绩、学位颁发方必须逐项核对。",
      短句1: "给英语基础还需要时间的学生，一条更稳的新加坡本科衔接路径。",
      短句2: "国内先完成语言和预科能力建设，再进入新加坡本科，不把孩子过早推到海外试错。",
      短句3: "2+2节省时间成本，英语强化+IFD课程+新加坡升学服务形成完整闭环。",
    },
  },
  "AP课程": {
    owner: "金校",
    source: "PDF：AP课程宣传册；Word：国际初中分流资料中AP方向补充",
    fields: {
      定位: "AP课程是美国大学先修课程，奥斯翰为College Board官方授权AP学校，面向目标美国、加拿大、香港、英国、澳洲、新加坡等方向的学生。",
      学生: "初高中在读生，不限户籍；有海外升学规划、通过学校入学测试与面试的学生。",
      年级: "Pre-program G7-G9完成基础准备；G10-G12进入AP/SAT冲刺和大学申请阶段。",
      升学: "美国、加拿大、英国、澳洲、中国香港、新加坡等高校；资料显示AP成绩被全球76个国家、5000+高校认可。",
      优势1: "官方授权与全球认可：奥斯翰为College Board官方授权AP学校，AP成绩可用于全球多地区本科申请。",
      优势2: "分阶培养路径：G7-G9做英语、数学、科学和学科探索，G10-G12冲刺AP、SAT/标化和大学申请。",
      优势3: "一生一案+双师护航：学科教师和语言导师双轨支持，入学做潜力评估，每学期更新成长档案。",
      学制: "G7-G9基础准备，G10-G12 AP/SAT冲刺与申请；高中阶段通常2-3年完成AP课程组合和申请准备。",
      模块: "必修课程：综合英语、英美文学、数学、综合科学、世界历史、全球视野、基础经济学、运动科学、中文等；AP课程：微积分AB/BC、预科微积分、化学、生物、物理、微观/宏观经济、世界历史、中文等；选修含语言与标化课程。",
      考试: "AP考试、SAT/托福/雅思等标化；AP成绩可用于申请竞争力提升和部分大学学分兑换。",
      路径: "入学测试 → 基础/荣誉/冲刺分层 → AP选课规划 → AP与标化备考 → 成长档案跟踪 → 一对一升学申请。",
      师资: "PDF提到拥有多年AP教学经验的专业教师和语言导师；国际初中资料显示在录AP教师共7人。具体教师名单与科目需补充。",
      管理: "基础班、荣誉班、冲刺班三级进阶；根据学习进度动态调整班级和学习路径，不浪费优秀学生潜力，也不放弃基础薄弱学生。",
      指导: "一对一升学指导，根据AP成绩、标化成绩和学生目标定制大学申请路径，精准定位目标院校。",
      案例: "国际初中资料中分流案例包括：2025朴同学PP2→PP3→AP→香港中文大学；2024权同学PP3→AP→首尔大学；2023李同学PP1→PP2→PP3→AP→香港大学。",
      结果: "PDF写明所有学生均能拿到海外大学录取通知书；国际初中资料列出AP方向往届录取含香港中文大学、香港大学、滑铁卢大学、多伦多大学及韩国知名大学。需确认口径。",
      资源: "College Board官方授权；AP成绩全球认可；课程覆盖STEM、人文、创意艺术、语言等方向。",
      问答1: "问：AP适合哪些国家申请？答：AP最适配美国，也被英国、加拿大、澳洲、香港、新加坡等高校认可，尤其适合目标多国家、多地区申请的学生。",
      问答2: "问：AP除了申请还有什么价值？答：高分AP可提升申请竞争力，也可在部分美国大学兑换学分，节省时间与学费。",
      竞品: "竞品包括深圳其他AP国际学校、纯标化培训机构。奥斯翰差异在于全日制学校管理、AP官方授权、分层教学、语言+学科双师、升学跟踪。",
      风险: "不能写“AP高分必然录取名校”。录取仍取决于AP成绩、标化、GPA、活动、文书和综合申请。",
      短句1: "AP不是单科培训，而是一套从基础、选课、考试到申请的全球升学方案。",
      短句2: "官方授权AP学校，给目标多国联申的学生更灵活的学术筹码。",
      短句3: "学科教师+语言导师+升学指导，把AP成绩变成真正能服务申请的竞争力。",
    },
  },
  "A-Level": {
    owner: "alizer",
    source: "PDF：A-Level课程宣传册",
    fields: {
      定位: "两年制A-Level高中课程，融合Edexcel与AQA两大考试局体系，G10提供IGCSE准备，面向英国、香港、澳洲、加拿大及多国大学申请。",
      学生: "初三在读、初中毕业、高中在读学生；零基础可咨询入读，需通过学校入学测试与面试。",
      年级: "G10进行IGCSE准备，G11-G12完成A-Level课程；招生页显示不限学籍和户籍、无须中考分数要求、无须语言基础。",
      升学: "英国、香港、澳洲、加拿大等英联邦方向，也可作为美国等顶尖大学申请材料的一部分。",
      优势1: "双考试局体系：课程深度融合Edexcel与AQA，路径更灵活，能按学生目标选择更适合的科目和考试体系。",
      优势2: "学术路径清晰：STEM、人文社科、创意艺术三大方向均有科目组合和专业出口说明。",
      优势3: "教学保障+语言支持：雅思/托福课程、学术英语工坊、定期测试和个性化反馈，帮助学生兼顾学科与语言。",
      学制: "G10 IGCSE准备 + G11-G12两年制A-Level课程。",
      模块: "STEM：物理、进阶数学、计算机科学等；人文社科：经济学、心理学、历史、社会学、商科；创意艺术：艺术设计、英语文学与语言、音乐等；另含PSHE全人教育。",
      考试: "A-Level考试，结合雅思/托福等语言考试；课程对接Edexcel/AQA考试局标准。",
      路径: "入学测试 → G10 IGCSE准备 → G11-G12 A-Level科目组合 → 语言/学术支持 → 大学申请。",
      师资: "PDF提到课程由受训并认证的A-Level教师和考官执教；具体教师名单、考官资质需alizer补充。",
      管理: "小班教学、定期测试、个性化反馈、学术英语四维能力工坊；同时开设PSHE关注学生福祉与品格塑造。",
      指导: "提供定制化升学支持，解析全球顶尖大学英语成绩要求，帮助学生进行目标对接。",
      案例: "PDF未提供具体录取案例；需补充学生案例、成绩、申请国家和录取院校。",
      结果: "PDF写明2025届90%学生在两条考试路径中取得A*至B成绩；需确认统计人数、科目范围和可公开口径。",
      资源: "Edexcel与AQA两大考试局授权/体系资源；A-Level资格面向英国及英联邦大学体系，也被部分美国顶尖大学认可。",
      问答1: "问：A-Level适合什么学生？答：适合目标英国、香港、澳洲、加拿大等方向，或希望通过少而精的科目组合突出学术优势的学生。",
      问答2: "问：英语基础弱能不能读？答：可以咨询入读，但需要同步完成学术英语、雅思/托福等语言支持；最终申请仍需满足目标大学语言要求。",
      竞品: "竞品包括其他A-Level国际学校和培训式课程。奥斯翰差异在于全日制学校环境、IGCSE衔接、双考试局体系、小班教学、学术英语和升学指导整合。",
      风险: "不能写“冲击牛剑/藤校必然成功”。需用“支持学生冲击/提升竞争力”等保守表达。",
      短句1: "Edexcel+AQA双体系，让A-Level选科和升学路径更灵活。",
      短句2: "从IGCSE准备到A-Level申请，奥斯翰把学科、语言和升学支持放在同一套体系里。",
      短句3: "适合目标英港澳加等方向、希望用清晰科目组合突出优势的学生。",
    },
  },
  "IG": {
    owner: "alizer",
    source: "Word：国际初中（PP课程+IGCSE）项目信息收集清单",
    fields: {
      定位: "PP课程+IGCSE衔接项目：初中阶段通过自研PP1/PP2/PP3为IGCSE打基础，高一完成IGCSE内容，高二再分流到AP、A-Level、新加坡、OSSD等方向。",
      学生: "初一至高一阶段，希望进入国际课程但需要过渡期、英语和学科基础仍需提升、暂未完全确定未来国家方向的学生。",
      年级: "PP1对应G7/G8，PP2对应G9，PP3对应G10；G11根据方向分流。",
      升学: "先完成IGCSE基础，再分流至AP、A-Level、新加坡、OSSD、日本、韩国等路径，最终申请全球高校。",
      优势1: "更适合中国学生的缓冲衔接：PP课程使用衔接IGCSE的教材和自研体系，降低学生直接进入IGCSE的落差。",
      优势2: "高二才分流，给学生更长探索时间：相比初三或高一过早定方向，奥斯翰让学生在G10后结合成绩、兴趣和升学目标再选择。",
      优势3: "英语支持与分层教学：为英语薄弱学生设置选修课和English Learning Workshop，并在英语、数学、中文等科目进行分层教学。",
      学制: "PP1/PP2/PP3三阶段衔接IGCSE；G11分流至两年制高中课程，G12完成大学申请。",
      模块: "PP阶段包括英语、数学、科学、人文、艺术/体育等；IGCSE阶段包括ESL、English Literature、Chemistry、Biology、Physics、Economics、Global Perspective、Mathematics。",
      考试: "IGCSE全球统考通常在高一下学期；预计报考5-8门。当前资料显示目前学生暂无IGCSE统考需求和历史成绩。",
      路径: "入学英语/数学测试 → PP1/PP2/PP3 → IGCSE内容学习 → 学业成绩分析/兴趣测评/方向说明会/试听/家长面谈 → G11分流。",
      师资: "PP/IG教师包括Kai、Rachel、Jin、Julia、Jaime、Linlin、Vivian、Vanece Fan等，覆盖ESL、文学、全球视野、历史、科学、经济、数学等。",
      管理: "老师全程监督学业进度，与家长沟通反馈；学生通过课堂参与、任务完成、期中期末测试呈现学术能力；学校手机和宿舍管理较严格。",
      指导: "升学指导老师全程参与分流，学生从入学开始进行1对1升学指导；每位学生有自己的指导老师随时跟进。",
      案例: "2025朴同学：PP2→PP3→AP→香港中文大学；2024权同学：PP3→AP→首尔大学；2023李同学：PP1→PP2→PP3→AP→香港大学。",
      结果: "资料暂未提供IGCSE考试成绩；分流后AP方向已有香港中文大学、香港大学、滑铁卢大学、多伦多大学、首尔大学等案例。",
      资源: "剑桥大学出版社衔接IGCSE教材；学校组织海外大学招生官来访、夏校、科研项目、阿斯丹竞赛、湾区模联等活动。",
      问答1: "问：孩子英语不好能跟上吗？答：可以通过选修课、课外辅导和English Learning Workshop支持；PP1从基础开始，先做缓冲衔接。",
      问答2: "问：高二分流是什么意思？答：PP3结束后，学生和家长结合成绩、兴趣和升学方向选择AP、A-Level、新加坡、OSSD等下一阶段课程。",
      竞品: "竞品包括直接开IGCSE的国际初中和公立初中+课外补习。奥斯翰差异在于PP缓冲衔接、多方向分流、全日制管理、1对1升学指导和全人教育。",
      风险: "不能写“可随意换方向”。资料显示G11后换方向会影响升学准备，一般不建议，特殊情况需学期结束后评估。",
      短句1: "先探索，再分流；先筑基，再冲刺。",
      短句2: "PP不是简单初中课程，而是为中国学生进入IGCSE和国际升学设计的缓冲系统。",
      短句3: "给还没确定国家方向的孩子更多时间，也给家长更稳的升学选择。",
    },
  },
  "OSSD": {
    owner: "金校",
    source: "暂无Word/PDF资料",
    fields: Object.fromEntries(rowMap.map(([k]) => [k, "暂无资料，待金校补充。"])),
  },
  "DSE": {
    owner: "alizer",
    source: "暂无Word/PDF资料",
    fields: Object.fromEntries(rowMap.map(([k]) => [k, "暂无资料，待alizer补充。"])),
  },
};

function styleCell(cell, opts = {}) {
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

function fillSheet(ws, course) {
  const info = data[course];
  if (!info) return;
  ws.getCell("A2").value = `${sourceNote} 本页来源：${info.source}`;
  styleCell(ws.getCell("A2"), { fill: "FFFFF2CC", color: "FF7A4B00" });
  for (let i = 0; i < rowMap.length; i++) {
    const row = ws.getRow(i + 4);
    const key = rowMap[i][0];
    row.getCell(3).value = info.fields[key] || "";
    row.getCell(4).value = info.source;
    row.getCell(5).value = (info.fields[key] || "").includes("待") ? "待确认" : "是";
    row.getCell(6).value = info.owner;
    row.getCell(7).value = i < 14 || key === "风险" ? "P0" : i < 21 ? "P1" : "P2";
    row.getCell(8).value = `${common} ${key === "风险" ? "此项需最终合规核对。" : "已由资料提炼，建议项目负责人核对。"}`
    row.height = Math.max(42, Math.min(120, Math.ceil(String(row.getCell(3).value).length / 28) * 18));
    row.eachCell((c, col) => styleCell(c, { fill: col <= 2 ? "FFF8FAFC" : undefined }));
  }
}

const wb = new ExcelJS.Workbook();
await wb.xlsx.readFile(inputXlsx);
for (const course of ["OSSD", "韩国课程", "日本课程", "AP课程", "新加坡课程", "A-Level", "IG", "DSE"]) {
  fillSheet(wb.getWorksheet(course), course);
}
await wb.xlsx.writeFile(outputXlsx);

const docBorder = { style: BorderStyle.SINGLE, size: 1, color: "D6DEE8" };
function run(text, opts = {}) {
  return new TextRun({ text, font: "Microsoft YaHei", size: opts.size ?? 20, bold: !!opts.bold, color: opts.color ?? "1F2937" });
}
function para(text, opts = {}) {
  return new Paragraph({ heading: opts.heading, alignment: opts.alignment, spacing: { before: opts.before ?? 80, after: opts.after ?? 80 }, children: [run(text, opts)] });
}
function cell(text, opts = {}) {
  return new TableCell({
    borders: { top: docBorder, bottom: docBorder, left: docBorder, right: docBorder },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    width: { size: opts.width ?? 3000, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [run(text || "", { size: opts.size ?? 18, bold: !!opts.bold })] })],
  });
}
function courseDocSection(course, first = false) {
  const info = data[course];
  const children = [];
  if (!first) children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(para(`${course}：第一轮资料补充`, { heading: HeadingLevel.HEADING_1, size: 28, bold: true, color: "0B2A4A" }));
  children.push(para(`资料来源：${info.source}`, { color: "64748B" }));
  children.push(para("说明：以下内容已按招生表达做第一轮提炼，最终仍需课程负责人核对事实、数据、合作院校、师资和可公开口径。", { color: "7A4B00" }));
  const rows = [
    new TableRow({ tableHeader: true, children: [cell("模块", { fill: "DCEBFF", bold: true, width: 1800 }), cell("已补充内容", { fill: "DCEBFF", bold: true, width: 7600 })] }),
    ...rowMap.map(([key, label]) => new TableRow({ children: [cell(label, { fill: "F8FAFC", bold: true, width: 1800 }), cell(info.fields[key] || "", { width: 7600 })] })),
  ];
  children.push(new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }));
  return children;
}
async function writeOwnerDoc(owner, courses, file) {
  const children = [
    para(`${owner}课程卖点信息采集问答：第一轮补充版`, { heading: HeadingLevel.TITLE, size: 34, bold: true, alignment: AlignmentType.CENTER, color: "0B2A4A" }),
    para(`生成日期：2026-05-26    填写原则：Word优先，PDF次之；缺失项标注待补充。`, { alignment: AlignmentType.CENTER, color: "64748B" }),
    para("下一步建议", { heading: HeadingLevel.HEADING_1, size: 28, bold: true }),
    para("请课程负责人重点核对：1. 数据是否可公开；2. 合作院校/认证是否最新；3. 师资姓名和资质是否准确；4. 是否存在不能承诺的表述；5. 能否补充学生案例、录取通知书、课程大纲和图片素材。"),
    ...courses.flatMap((c, idx) => courseDocSection(c, idx === 0)),
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
      properties: { page: { margin: { top: 800, right: 700, bottom: 800, left: 700 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run("奥斯翰课程宣传物料第一轮补充", { size: 17, color: "64748B" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run("第 ", { size: 17, color: "64748B" }), new TextRun({ children: [PageNumber.CURRENT], font: "Microsoft YaHei", size: 17, color: "64748B" }), run(" 页", { size: 17, color: "64748B" })] })] }) },
      children,
    }],
  });
  fs.writeFileSync(file, await Packer.toBuffer(doc));
}

await writeOwnerDoc("金校", ["OSSD", "韩国课程", "日本课程", "AP课程", "新加坡课程"], jinDocx);
await writeOwnerDoc("alizer", ["A-Level", "IG", "DSE"], alizerDocx);

const summary = [
  "# 第一轮资料补充说明",
  "",
  "生成时间：2026-05-26",
  "",
  "## 已处理资料",
  "- Word优先：韩国、日本、新加坡、国际初中/IGCSE 四份项目信息收集清单。",
  "- PDF补充：A-Level、AP、日本、韩国、新加坡、课程介绍等旧宣传册。",
  "",
  "## 已填课程",
  "- 金校：韩国课程、日本课程、AP课程、新加坡课程；OSSD暂无资料，保留待补充。",
  "- alizer：A-Level、IG；DSE暂无资料，保留待补充。",
  "",
  "## 关键提醒",
  "- 韩国、日本旧资料中出现“直升、保送、升学率100%”等强表述，已在风险边界中提示需要合规核对。",
  "- 新加坡合作院校、IFD认证、学位颁发方与留服认证需要逐项核对。",
  "- A-Level/AP主要来自PDF宣传册，需补充最新师资、录取案例、考试成绩。",
  "- IG来自国际初中Word，内容相对完整，但IGCSE成绩为空，需要补充或明确“不以统考成绩为主要宣传点”。",
].join("\n");
fs.writeFileSync(path.join(root, "04_课程卖点统筹/第一轮资料补充说明.md"), summary, "utf8");

console.log("filled first round");
