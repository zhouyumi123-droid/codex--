import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "09_竖版招生宣传册_主控生成版");
const assetDir = path.join(root, "05_总招生手册_初稿图文版/assets");
fs.mkdirSync(outDir, { recursive: true });

const outHtml = path.join(outDir, "奥斯翰国际部招生宣传册_A4竖版_紫金蓝金主控版.html");
const outMd = path.join(outDir, "奥斯翰国际部招生宣传册_A4竖版_紫金蓝金主控版_说明.md");

const img = name => {
  const p = path.join(assetDir, name);
  return fs.existsSync(p) ? `../05_总招生手册_初稿图文版/assets/${name}` : "";
};
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function list(items) {
  return `<ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;
}
function chips(items) {
  return `<div class="chips">${items.map(i => `<span>${esc(i)}</span>`).join("")}</div>`;
}
function courseCard(title, meta, body, tags = []) {
  return `<article class="course-card"><p class="meta">${esc(meta)}</p><h3>${esc(title)}</h3><p>${esc(body)}</p>${chips(tags)}</article>`;
}
function page(cls, inner) {
  return `<section class="page ${cls}">${inner}</section>`;
}

const pages = [
  page("cover", `
    <img class="cover-img" src="${img("cover.jpg")}" alt="">
    <div class="cover-shade"></div>
    <div class="cover-copy">
      <p class="eyebrow">OXSTAND INTERNATIONAL SCHOOL</p>
      <h1>深圳奥斯翰外语学校<br>国际部招生手册</h1>
      <p class="lead">精品国际课程 · 多路径升学规划 · 小规模精细化支持</p>
      <div class="rule"></div>
      <p class="cover-note">OSSD / AP / 日韩小语种 / IGCSE-A-Level / 新加坡 IFD</p>
    </div>
    <div class="cover-mark">OXSTAND</div>
  `),
  page("intro", `
    <div class="side-no">01</div>
    <p class="eyebrow">School Profile</p>
    <h2>深圳本土办学二十余年</h2>
    <p class="deck">2004年经深圳市教育局批准创办，学校位于深圳市罗湖区布心路2040号。</p>
    <div class="split">
      <div>
        <p>学校以“与世界同步，培育跨时代精英人才”为育人目标，运用ISO9001国际优质管理系统，植根中华传统文化，融贯东西方教育思想，依托外语特色，先后开设加拿大OSSD课程、韩国大学直升课程、日本大学直升课程、AP国际课程、IGCSE/A-Level衔接课程、新加坡IFD方向等多元升学路径。</p>
        <div class="stats">
          <b>2004<span>创校时间</span></b>
          <b>20+<span>办学积累</span></b>
          <b>多语种<span>外语学校底色</span></b>
        </div>
      </div>
      <img src="${img("campus1.jpg")}" alt="">
    </div>
  `),
  page("why", `
    <p class="eyebrow">Why Oxstand</p>
    <h2>奥斯翰四大优势</h2>
    <p class="deck">对家长而言，选择课程之前，首先要判断学校是否能稳定托举孩子三年的成长。</p>
    <div class="quad">
      ${courseCard("老牌办学积累", "01", "20余年本土办学经验，熟悉深圳家庭对国际升学的真实需求，形成稳定的教学体系与升学服务基础。")}
      ${courseCard("外语特色底色", "02", "英语、日语、韩语、西班牙语等语言资源，为不同国家出口提供语言基础，发挥外语学校传统优势。")}
      ${courseCard("小规模精细管理", "03", "更短的反馈链条、更近的师生关系，便于持续跟踪学习状态，实现个性化教学支持。")}
      ${courseCard("多路径升学规划", "04", "OSSD、AP、日韩、IGCSE/A-Level、新加坡方向，按目标匹配课程，找到最适合的升学路径。")}
    </div>
    <blockquote>奥斯翰的优势不是把所有学生推向同一条路，而是让不同语言基础、学科优势与家庭规划的学生，都能找到更适合的升学路径。</blockquote>
  `),
  page("timeline", `
    <p class="eyebrow">School Development History</p>
    <h2>创校历程</h2>
    <p class="deck">二十余年办学积累，形成外语特色、多元课程与国际升学服务基础。</p>
    <div class="timeline-grid">
      ${["2004 学校创办","2006 深圳市一级学校","2007 加拿大国际课程通过安省教育部资质验收","2008 ISO9001国际优质教育管理认证","2009 引进韩国大学直升课程","2010 广东省民办教育发展示范名校","2011 英国留学直通车 UCAS资质","2012 引进日本大学先修课程","2016 College Board批准成为AP授权学校","2020 IBDP世界学校","2023 清华美院美育课题项目合作学校","2024 AP授权代码579073可查","2026 获得BTEC艺术课程授权教学资质"].map(x=>`<div><b>${esc(x.split(" ")[0])}</b><span>${esc(x.replace(/^\S+\s?/,""))}</span></div>`).join("")}
    </div>
  `),
  page("map", `
    <div class="side-no">02</div>
    <p class="eyebrow">Curriculum Map</p>
    <h2>奥斯翰国际课程地图</h2>
    <p class="deck">先看目标方向，再看考试体系；先看学生基础，再设计三年节奏。</p>
    <div class="course-map">
      ${courseCard("OSSD", "加拿大安省文凭", "过程评价 / 6门12年级成绩", ["加拿大、英美澳港多国"])}
      ${courseCard("AP", "美国大学先修课程", "AP科目 + SAT/语言成绩", ["美国、香港及多国申请"])}
      ${courseCard("日本留学课 / 韩国留学课", "日韩小语种升学", "TOPIK / JLPT / EJU / 面试", ["韩国、日本本科"])}
      ${courseCard("IG / A-Level", "英式课程路径", "IGCSE + 3-4门A-Level", ["英国、香港、澳洲、加拿大"])}
      ${courseCard("IFD", "新加坡方向", "语言 + 预科能力 + 学分衔接", ["新加坡本科与后期转轨"])}
    </div>
  `),
  page("ossd", `
    <div class="side-no">03</div>
    <p class="eyebrow">Ontario Secondary School Diploma</p>
    <h2>OSSD 中加课程</h2>
    <p class="deck">加拿大安大略省高中毕业文凭，以过程评价、安省课程与多国申请通道为核心优势。</p>
    <div class="feature-row">
      ${courseCard("过程评价更稳妥", "OSSD 01", "课堂表现、作业、项目、阶段测试与最终评价共同构成成绩，减少单次考试波动对升学的影响。")}
      ${courseCard("6门12年级成绩申请", "OSSD 02", "学生以12年级6门4U/4M课程学术成绩与语言成绩作为核心材料，面向加拿大及多国大学申请。")}
      ${courseCard("安省体系全球认可", "OSSD 03", "课程学习、学分要求和毕业文凭均服务海外本科申请，在高中阶段建立大学所需的学术英语与学科能力。")}
    </div>
    <div class="note-box">适合学生：希望避开单一高考路径，重视平时学习积累，希望用更灵活方式申请加拿大、英国、美国、澳洲、香港等方向的学生。</div>
  `),
  page("ossd2", `
    <p class="eyebrow">Oxstand Bond OSSD Program</p>
    <h2>奥斯翰邦德 OSSD 项目</h2>
    <p class="deck">项目与加拿大邦德多伦多学院合作设立，学生在奥斯翰完成中加两国高中课程。</p>
    <div class="split">
      <img src="${img("bond1.jpg")}" alt="">
      <div class="stack">
        ${courseCard("安省学籍路径", "01", "学生按课程进度注册安大略省高中学籍，以安省高中课程成绩服务海外本科申请。")}
        ${courseCard("中加课程衔接", "02", "中方基础课程与加方课程共同构成高中阶段学习体系，循序渐进完成学术过渡。")}
        ${courseCard("一站式升学服务", "03", "课程学习、语言标化、社会实践、申请文书、签证与行前支持系统推进。")}
      </div>
    </div>
  `),
  page("ap", `
    <div class="side-no">04</div>
    <p class="eyebrow">Advanced Placement Program</p>
    <h2>AP 国际课程</h2>
    <p class="deck">AP是美国大学理事会推出的大学先修课程体系，帮助学生用高挑战度学科成绩展示大学学习潜力。</p>
    <div class="code-panel">
      <p>School Code</p><b>579073</b><span>College Board 授权身份清晰可查</span>
    </div>
    <div class="quad compact">
      ${courseCard("官方体系背书", "01", "授权代码可查，让课程身份与考试路径更加清晰，是AP招生表达中的核心信任点。")}
      ${courseCard("高挑战学科证明", "02", "AP成绩可展示学生提前学习大学先修内容的能力。")}
      ${courseCard("多国申请适配", "03", "适合美国、香港及多国综合申请，与SAT、托福/雅思共同规划。")}
      ${courseCard("专业画像更鲜明", "04", "通过微积分、科学、经济、历史等科目强化目标专业竞争力，覆盖多科目专业组合。")}
    </div>
  `),
  page("language", `
    <div class="side-no">05</div>
    <p class="eyebrow">KUPP / JUPP</p>
    <h2>日 / 韩小语种升学</h2>
    <p class="deck">两条小语种路径，一条通向韩国名校，一条通向日本名校，奥斯翰外语学校核心特色。</p>
    <div class="split two-cards">
      <div>
        <h3>韩国大学直升课程 KUPP</h3>
        <p>深圳首家开设韩国语小语种课的全日制高中之一，深耕韩国留学教育，帮助学生从韩语能力（TOPIK）走向韩国本科申请。</p>
        <div class="stats mini"><b>100%<span>整体升学率</span></b><b>40%+<span>TOP10录取率</span></b><b>90%+<span>TOP20重本率</span></b></div>
      </div>
      <div>
        <h3>日本大学直升课程 JUPP</h3>
        <p>专为目标日本本科的高中生设计，围绕日语能力、EJU留考、JLPT考试、升学规划和日本文化适应展开。</p>
        <div class="stats mini"><b>14年<span>办学经验</span></b><b>100%<span>升学率</span></b><b>99%+<span>签证率</span></b></div>
      </div>
    </div>
    <img class="wide-photo" src="${img("japan1.jpg")}" alt="">
  `),
  page("alevel", `
    <div class="side-no">06</div>
    <p class="eyebrow">British Pathway</p>
    <h2>IGCSE / A-Level</h2>
    <p class="deck">IGCSE是A-Level前的学术准备阶段，帮助学生完成国际课程学习习惯、学术英语和学科基础建设。</p>
    <div class="feature-row">
      ${courseCard("IGCSE阶段", "G9-G10", "完成英语、数学、科学、人文社科、艺术与PSHE等基础课程，为后续A-Level选科打底。")}
      ${courseCard("A-Level阶段", "G11-G12", "选择3-4门与未来专业相关的核心科目，形成面向大学申请的学术成绩。")}
      ${courseCard("升学方向", "Global", "面向英国、香港、澳洲、加拿大等英联邦方向，也可作为美国等多国申请材料之一。")}
    </div>
    <div class="note-box">适合学生：目标英港澳加等方向，希望通过优势科目组合突出学术竞争力，并逐步完成全英文学术表达过渡的学生。</div>
  `),
  page("ifd", `
    <div class="side-no">07</div>
    <p class="eyebrow">Singapore Pathway</p>
    <h2>新加坡 IFD 方向</h2>
    <p class="deck">国内完成语言与大学预科能力建设，再衔接新加坡本科路径，同时保留后期升级转轨空间。</p>
    <div class="feature-row">
      ${courseCard("2+2高效路径", "IFD 01", "前两年在国内完成语言、基础学科和大学预科内容，再衔接新加坡本科，缩短适应周期。")}
      ${courseCard("语言先行", "IFD 02", "第一年重点提升英语与基础学科能力，为后续IFD课程和海外学习打底。")}
      ${courseCard("后期转轨空间", "IFD 03", "若学生语言与学术能力提升明显，可根据目标调整到AP、A-Level等更高挑战路径。")}
    </div>
    <div class="note-box">适合学生：希望先在国内完成语言与预科能力建设，以更稳妥、更具性价比的方式衔接新加坡本科的学生。</div>
  `),
  page("faculty", `
    <div class="side-no">08</div>
    <p class="eyebrow">Faculty & Guidance</p>
    <h2>师资与升学服务</h2>
    <p class="deck">优秀课程最终要落到教师、管理和升学服务上。</p>
    <div class="split">
      <div class="leader-card">
        <p>CORE FACULTY</p>
        <h3>刘总裁</h3>
        <b>集团总裁 | Dr. Arthur Liu</b>
        <span>中科院心理学博士 / 北大金融学硕士</span>
        <p>20余年国际学校管理经验，精通 AP、A-Level、IBDP、VCE、OSSD 等项目与国内课程的融合。</p>
      </div>
      <div class="stack">
        ${courseCard("国际部校长", "金伶納", "深耕国际教育领域十五年，长期专注于国际高中课程建设、海外升学规划、中外合作办学及学生综合发展指导。")}
        ${courseCard("项目负责人", "Leadership Team", "OSSD、AP、日韩、IG/A-Level、新加坡等课程由项目负责人协同推进。")}
      </div>
    </div>
  `),
  page("service", `
    <div class="side-no">09</div>
    <p class="eyebrow">Student Support System</p>
    <h2>学生成长与升学服务体系</h2>
    <p class="deck">我们提供的不是一次性咨询，而是从入学到申请的长期陪伴。</p>
    <div class="quad">
      ${courseCard("学生导师课", "Care", "帮助新生适应课堂、宿舍、人际关系与国际课程节奏。")}
      ${courseCard("模拟联合国", "Growth", "在辩论、表达、协作中建立全球视野和领导力。")}
      ${courseCard("个性化辅导", "Academic", "第7节后自选辅导、小组课堂、按需走班，补强真实所需能力。")}
      ${courseCard("住宿管理", "Life", "晚自习、手机管理、宿舍巡访与家校反馈，照顾学习也照顾生活。")}
    </div>
    <blockquote>家长看到的是服务表格，学生感受到的是每天有人看见、有人提醒、有人陪他往前走。</blockquote>
  `),
  page("admission", `
    <p class="eyebrow">Personalized Admission Pathway</p>
    <h2>入学评估与持续跟踪指导</h2>
    <p class="deck">先判断孩子适合哪条路，再持续陪伴每个阶段的变化。</p>
    <div class="split two-cards">
      <div>
        <h3>入学前：把路径选准</h3>
        ${list(["1对1学业评估：了解英语/小语种基础、数学与学科能力、学习习惯和目标国家。","课程路径建议：根据评估结果匹配 OSSD、AP、日韩、IGCSE/A-Level 或新加坡方向。","阶段成长规划：制定入学后语言、学科、考试和升学节点安排。"])}
      </div>
      <div>
        <h3>入学后：把成长跟住</h3>
        ${list(["学习进度跟踪：阶段测试、课堂表现、作业反馈。","语言能力跟踪：托福/雅思/TOPIK/JLPT 等考试规划。","家校沟通：班主任、导师、升学老师多方同步。","方向动态调整：根据成绩、兴趣和目标院校变化调整路径。"])}
      </div>
    </div>
    <div class="process">入学评估 → 课程匹配 → 目标院校 → 语言考试 → 材料文书 → 面试签证</div>
  `),
  page("life", `
    <p class="eyebrow">Campus Life</p>
    <h2>校园生活</h2>
    <p class="deck">真实的课堂、活动和校园生活，让学生在学术之外拥有完整的高中成长体验。</p>
    <div class="photo-grid">
      <figure><img src="${img("sports.jpg")}" alt=""><figcaption>活动与社团</figcaption></figure>
      <figure><img src="${img("culture.jpg")}" alt=""><figcaption>文化与表达</figcaption></figure>
      <figure><img src="${img("graduation.jpg")}" alt=""><figcaption>成长与毕业</figcaption></figure>
    </div>
    <div class="feature-row small">
      ${courseCard("活动与社团", "Campus", "运动会、社团、国际文化交流与兴趣发展。")}
      ${courseCard("文化与表达", "Culture", "多语种、非遗、跨文化体验共同支撑综合素养。")}
      ${courseCard("成长与毕业", "Growth", "用真实场景呈现学生在校成长与阶段成果。")}
    </div>
  `),
  page("fees", `
    <p class="eyebrow">Admission Requirements</p>
    <h2>招生对象与报名流程</h2>
    <p class="deck">适合有国际课程升学需求，希望在高中阶段完成多路径规划的学生。</p>
    <table>
      <tr><th>项目</th><th>内容</th><th>说明</th></tr>
      <tr><td>招生对象</td><td>初三在读、初中毕业、高中在读学生</td><td>不同课程按目标国家、语言基础和学科能力匹配</td></tr>
      <tr><td>入学评估</td><td>学业测试 + 面试 + 课程咨询</td><td>评估英语/小语种、数学、综合学习能力与目标方向</td></tr>
      <tr><td>报名流程</td><td>预约咨询 → 入学评估 → 路径建议 → 确认课程 → 办理入读</td><td>由招生与课程团队共同完成</td></tr>
    </table>
    <h3>费用信息</h3>
    <table>
      <tr><th>课程方向</th><th>学费</th><th>住宿/餐食</th><th>备注</th></tr>
      <tr><td>OSSD中加课程</td><td>咨询招生办公室</td><td>按学校公示执行</td><td>以当年招生政策为准</td></tr>
      <tr><td>AP国际课程</td><td>咨询招生办公室</td><td>按学校公示执行</td><td>以当年招生政策为准</td></tr>
      <tr><td>日韩/新加坡方向</td><td>咨询招生办公室</td><td>按学校公示执行</td><td>以当年招生政策为准</td></tr>
      <tr><td>IGCSE/A-Level</td><td>咨询招生办公室</td><td>按学校公示执行</td><td>以当年招生政策为准</td></tr>
    </table>
  `),
  page("back", `
    <img class="cover-img" src="${img("group.jpg")}" alt="">
    <div class="cover-shade purple"></div>
    <div class="cover-copy">
      <p class="eyebrow">Schedule Your Campus Tour</p>
      <h1>预约访校</h1>
      <p class="lead">深圳市罗湖区布心路2040号</p>
      <p class="cover-note">招生办公室：0755-25805707 / 0755-25813956<br>欢迎预约访校，获取个性化课程规划建议</p>
    </div>
    <div class="qr-placeholder">二维码区域</div>
  `),
];

const css = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; background: #d9d9de; color: #252B33; font-family: "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif; }
.page { width: 210mm; min-height: 297mm; margin: 18px auto; padding: 20mm 18mm 16mm; background: #FBFAF6; position: relative; overflow: hidden; page-break-after: always; box-shadow: 0 10px 30px rgba(0,0,0,.16); }
.page:before { content: ""; position: absolute; left: 0; top: 0; bottom: 0; width: 7mm; background: #33215F; }
.page:after { content: "OXSTAND INTERNATIONAL SCHOOL"; position: absolute; left: 18mm; bottom: 8mm; font-size: 8pt; color: #8A8F98; letter-spacing: .08em; }
.eyebrow { color: #C7A34A; text-transform: uppercase; letter-spacing: .08em; font-size: 10pt; font-weight: 700; margin: 0 0 8px; }
h1,h2,h3,p { margin-top: 0; }
h1 { font-size: 38pt; line-height: 1.12; color: white; letter-spacing: 0; }
h2 { font-size: 28pt; line-height: 1.08; color: #18265A; margin-bottom: 10px; letter-spacing: 0; }
h3 { font-size: 15pt; color: #18265A; margin-bottom: 8px; letter-spacing: 0; }
p, li, td { font-size: 10.5pt; line-height: 1.62; }
.deck { font-size: 12.5pt; color: #687180; max-width: 155mm; margin-bottom: 16px; }
.side-no { position: absolute; right: 14mm; top: 13mm; font-size: 44pt; color: rgba(199,163,74,.25); font-weight: 800; }
.cover { padding: 0; background: #18265A; }
.cover:before, .cover:after, .back:before, .back:after { display: none; }
.cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cover-shade { position: absolute; inset: 0; background: linear-gradient(105deg, rgba(24,38,90,.92), rgba(51,33,95,.72) 52%, rgba(24,38,90,.22)); }
.cover-shade.purple { background: linear-gradient(105deg, rgba(51,33,95,.9), rgba(24,38,90,.68) 55%, rgba(24,38,90,.2)); }
.cover-copy { position: absolute; left: 20mm; top: 58mm; width: 135mm; }
.lead { color: rgba(255,255,255,.88); font-size: 15pt; }
.cover-note { color: rgba(255,255,255,.82); font-size: 12pt; line-height: 1.8; }
.cover .rule { width: 22mm; height: 1.2mm; background: #C7A34A; margin: 18px 0; }
.cover-mark { position: absolute; right: 12mm; bottom: 18mm; color: rgba(255,255,255,.08); font-size: 44pt; font-weight: 800; }
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: stretch; }
.split > img, .wide-photo { width: 100%; height: 100%; object-fit: cover; border-radius: 8px; min-height: 112mm; }
.stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 16px; }
.stats b { display: block; color: #C7A34A; background: #33215F; padding: 12px 8px; border-radius: 8px; font-size: 19pt; text-align: center; }
.stats b span { display: block; color: white; font-size: 8.5pt; margin-top: 5px; }
.stats.mini b { font-size: 15pt; }
.quad, .course-map, .feature-row { display: grid; grid-template-columns: repeat(2,1fr); gap: 12px; }
.feature-row { grid-template-columns: repeat(3,1fr); }
.course-map { grid-template-columns: 1fr; }
.course-card { background: white; border: 1px solid #D8DDE8; border-left: 4px solid #C7A34A; border-radius: 8px; padding: 13px 14px; min-height: 34mm; }
.course-card .meta { color: #5A3D8E; font-size: 8.5pt; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
.course-card p { margin-bottom: 0; }
.chips { margin-top: 9px; display: flex; flex-wrap: wrap; gap: 6px; }
.chips span { background: #F4EBD4; color: #33215F; border-radius: 999px; padding: 4px 8px; font-size: 8.5pt; font-weight: 700; }
blockquote, .note-box, .process { margin: 18px 0 0; padding: 14px 18px; border-radius: 9px; background: #F4EBD4; color: #18265A; font-size: 12pt; line-height: 1.6; font-weight: 700; }
.timeline-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 9px; margin-top: 14px; }
.timeline-grid div { background: white; border: 1px solid #D8DDE8; border-radius: 8px; padding: 9px 11px; }
.timeline-grid b { display: inline-block; color: #C7A34A; width: 15mm; font-size: 13pt; }
.timeline-grid span { font-size: 9.6pt; color: #252B33; }
.code-panel { background: #18265A; border-radius: 12px; color: white; padding: 18px; width: 78mm; margin: 8px 0 14px; }
.code-panel p { color: #C7A34A; text-transform: uppercase; font-weight: 700; margin-bottom: 3px; }
.code-panel b { font-size: 40pt; line-height: 1; }
.code-panel span { display: block; margin-top: 7px; color: rgba(255,255,255,.8); }
.two-cards > div { background: white; border: 1px solid #D8DDE8; border-radius: 10px; padding: 16px; }
.stack { display: grid; gap: 10px; }
.leader-card { background: #18265A; color: white; border-radius: 12px; padding: 20px; }
.leader-card h3 { color: white; font-size: 30pt; }
.leader-card b, .leader-card span { display: block; color: #C7A34A; margin-bottom: 8px; }
.photo-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin: 14px 0; }
figure { margin: 0; position: relative; border-radius: 9px; overflow: hidden; height: 78mm; }
figure img { width: 100%; height: 100%; object-fit: cover; }
figcaption { position: absolute; left: 0; right: 0; bottom: 0; padding: 10px; color: white; font-weight: 700; background: linear-gradient(transparent, rgba(24,38,90,.86)); }
table { width: 100%; border-collapse: collapse; margin: 12px 0 20px; background: white; border-radius: 8px; overflow: hidden; }
th { background: #18265A; color: white; font-size: 9.5pt; padding: 9px; text-align: left; }
td { border-bottom: 1px solid #D8DDE8; padding: 9px; vertical-align: top; }
.qr-placeholder { position: absolute; right: 22mm; bottom: 25mm; width: 35mm; height: 35mm; border-radius: 8px; background: white; color: #33215F; display: grid; place-items: center; font-weight: 700; }
@media print { body { background: white; } .page { margin: 0; box-shadow: none; } }
`;

const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>奥斯翰国际部招生宣传册 A4竖版</title><style>${css}</style></head><body>${pages.join("\n")}</body></html>`;
fs.writeFileSync(outHtml, html, "utf8");
fs.writeFileSync(outMd, `# A4竖版招生宣传册主控版\n\n- 输出HTML：${outHtml}\n- 页数：${pages.length}\n- 规格：A4竖版，适合纸质装订与电子PDF导出\n- 视觉：紫金/蓝金，高端国际学校风格\n- 说明：本版基于当前V2 PPT内容重组为正式招生册，不复刻PPT横版版式；后续可继续导出PDF或拆分给设计师精修。\n`, "utf8");
console.log(`Generated ${outHtml}`);
console.log(`Pages: ${pages.length}`);
