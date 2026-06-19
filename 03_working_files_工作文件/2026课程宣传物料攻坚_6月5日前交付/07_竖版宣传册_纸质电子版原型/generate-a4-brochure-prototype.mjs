import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = dirname(fileURLToPath(import.meta.url));

const pages = [
  {
    type: "cover",
    eyebrow: "OXSTAND INTERNATIONAL SCHOOL",
    title: ["深圳奥斯翰外国语学校", "国际部招生手册"],
    lead: "精品国际课程 · 多路径升学规划 · 小规模精细化支持",
    foot: "OXSTAND International",
  },
  {
    type: "contents",
    eyebrow: "CONTENTS",
    title: ["目录"],
    items: [
      ["01", "关于奥斯翰", "School Profile"],
      ["02", "课程体系总览", "Curriculum Map"],
      ["03", "OSSD 中加课程", "Ontario Secondary School Diploma"],
      ["04", "AP 国际课程", "Advanced Placement"],
      ["05", "KUPP / JUPP", "日韩小语种升学"],
      ["06", "IGCSE / A-Level", "British Pathway"],
      ["07", "新加坡 IFD 方向", "Singapore Pathway"],
      ["08", "师资与升学服务", "Faculty & Guidance"],
      ["09", "入学咨询与费用", "Admission & Fees"],
    ],
  },
  {
    type: "chapter",
    no: "01",
    eyebrow: "School Profile",
    title: ["关于奥斯翰"],
    lead: "深圳老牌民办国际化高中，以外语特色和多路径课程为学生打开更适合的升学选择。",
  },
  {
    type: "profile",
    eyebrow: "ABOUT OXSTAND",
    title: ["深圳本土办学二十余年"],
    body: [
      '2004年经深圳市教育局批准创办，位于罗湖区布心路2040号。学校以"与世界同步，培育跨时代精英人才"为育人目标，运用ISO9001国际优质管理系统，先后开设加拿大OSSD课程、韩国大学直升课程、日本大学直升课程、AP国际课程、IGCSE/A-Level衔接课程、新加坡IFD方向等多元升学路径。',
      "植根中华传统文化，融贯东西方教育思想，依托外语特色，为学生提供多元升学路径。",
    ],
    stats: [
      ["2004", "创校时间"],
      ["20+", "办学积累"],
      ["多语种", "外语学校底色"],
      ["多路径", "国际升学出口"],
    ],
  },
  {
    type: "cards",
    eyebrow: "WHY OXSTAND",
    title: ["奥斯翰的四个招生优势"],
    lead: "对家长而言，选择课程之前，首先要判断学校是否能稳定托举孩子三年的成长。",
    cards: [
      ["01", "老牌办学积累", "20余年本土办学经验，熟悉深圳家庭对国际升学的真实需求，形成稳定的教学体系与升学服务基础。"],
      ["02", "外语特色底色", "英语、日语、韩语等语言资源，为不同国家出口提供语言基础，发挥外语学校传统优势。"],
      ["03", "小规模精细管理", "更短的反馈链条、更近的师生关系，便于持续跟踪学习状态，实现个性化教学支持。"],
      ["04", "多路径升学规划", "OSSD、AP、日韩、IGCSE/A-Level、新加坡方向，按目标匹配课程，找到最适合的升学路径。"],
    ],
  },
  {
    type: "timeline",
    eyebrow: "SCHOOL DEVELOPMENT HISTORY",
    title: ["创校历程"],
    lead: "二十余年办学积累，形成外语特色、多元课程与国际升学服务基础。",
    steps: [
      ["2004", "学校创办"],
      ["2007", "加拿大国际课程通过安省教育部验收"],
      ["2009", "引进韩国大学直升课程"],
      ["2011", "英国留学直通车UCAS资质"],
      ["2012", "引进日本大学先修课程"],
      ["2016", "College Board批准成为AP授权学校"],
      ["2020", "IBDP世界学校"],
      ["2024", "AP授权代码579073可查"],
    ],
  },
  {
    type: "chapter",
    no: "02",
    eyebrow: "Curriculum Map",
    title: ["课程体系总览"],
    lead: "先看目标国家，再选择课程路径；先看学生基础，再设计三年学习节奏。",
  },
  {
    type: "pathways",
    eyebrow: "CURRICULUM MAP",
    title: ["奥斯翰国际课程地图"],
    lead: "先看目标方向，再看考试体系；先看学生基础，再设计三年节奏。",
    cards: [
      ["OSSD", "加拿大安省文凭", "过程评价 / 6门12年级成绩", "加拿大、英美澳港多国"],
      ["AP", "美国大学先修课程", "AP科目 + SAT/语言成绩", "美国、香港及多国申请"],
      ["KUPP/JUPP", "日韩小语种升学", "TOPIK / JLPT / EJU / 面试", "韩国、日本本科"],
      ["IGCSE/A-Level", "英式课程路径", "IGCSE衔接A-Level", "英国、香港、澳洲、加拿大等"],
      ["IFD", "新加坡方向", "语言 + 预科能力 + 学分衔接", "新加坡本科与后期转轨"],
    ],
  },
  {
    type: "cards",
    eyebrow: "HOW TO CHOOSE",
    title: ["家长如何理解课程选择"],
    lead: "从目标、语言、学科和家庭规划四个维度判断孩子适合哪条路径。",
    cards: [
      ["01", "目标国家", "先确定英美加澳、日韩、新加坡或多国申请方向"],
      ["02", "语言基础", "英语、韩语、日语基础决定进入课程后的适应速度"],
      ["03", "学科优势", "数学、理科、商科、艺术、人文方向决定选课组合"],
      ["04", "申请方式", "结合学生特点与家庭规划判断更适合的课程路径"],
    ],
  },
  {
    type: "program",
    eyebrow: "ONTARIO SECONDARY SCHOOL DIPLOMA",
    title: ["OSSD 中加课程"],
    lead: "加拿大安大略省高中课程路径，强调过程评价与多国大学申请。",
    body: "加拿大安大略省高中毕业文凭，以过程评价、安省课程与多国申请通道为核心优势。",
    cards: [
      ["过程评价更稳妥", "课堂表现、作业、项目、阶段测试与最终评价共同构成成绩，减少单次考试波动对升学的影响。"],
      ["6门12年级成绩申请", "学生以12年级6门4U/4M课程学术成绩与语言成绩作为核心材料，面向加拿大及多国大学申请。"],
      ["安省体系全球认可", "课程学习、学分要求和毕业文凭均服务海外本科申请，在高中阶段建立大学所需的学术英语与学科能力。"],
    ],
    note: "适合学生：希望避开单一高考路径，重视平时学习积累，希望用更灵活方式申请加拿大、英国、美国、澳洲、香港等方向的学生。",
  },
  {
    type: "program",
    eyebrow: "ADVANCED PLACEMENT PROGRAM",
    title: ["AP 国际课程"],
    lead: "美国大学理事会授权课程，School Code 579073，为学生提供高挑战度学科证明。",
    body: "AP（Advanced Placement）是由美国大学理事会主办的大学先修课程，旨在让高中生提前接触大学水平的学术内容。奥斯翰于2016年获College Board批准成为AP授权学校（Code: 579073），2024年授权代码可查。",
    cards: [
      ["全球认可度最高", "适用于美国、加拿大、英国、澳洲等多国申请"],
      ["可转换大学学分", "节省留学时间与费用"],
      ["科目选择灵活", "学生可根据兴趣与优势自由选择，定制个性化学习方案"],
    ],
    note: "适合学生：学术基础扎实、学习能力强、目标申请美国或多国顶尖大学、希望提前适应大学学习节奏的学生。",
  },
  {
    type: "timeline",
    eyebrow: "KOREAN PATHWAY",
    title: ["韩国方向升学模式"],
    lead: "韩国大学直升课程（KUPP），为有意向赴韩留学的学生提供系统化语言与学术准备。",
    steps: [
      ["奥斯翰高中阶段", "学术+韩语基础"],
      ["TOPIK韩语考试", "达到中高级水平"],
      ["韩国合作大学申请", "材料准备与递交"],
      ["韩国名校本科录取", "开启留学之旅"],
    ],
    note: "课程特色：系统韩语教学，从零基础到TOPIK中高级，循序渐进。",
  },
  {
    type: "table",
    eyebrow: "JAPANESE PATHWAY",
    title: ["日本方向升学模式"],
    lead: "日本大学直升课程（JUPP），根据学生日语基础、目标院校和家庭规划，形成不同升学衔接路径。",
    rows: [
      ["3+0 路径", "3年奥斯翰高中 → 日语N2以上 → 网上考试和面试 → 直升日本合作本科院校", "特点：直接升学，节省时间"],
      ["3+0.5", "3年奥斯翰高中 → 日语N2以上 → 0.5年合作语言学校 → 衔接日本名校本科", "特点：过渡平稳，名校率高"],
      ["2/2.5", "奥斯翰高中阶段 → JLPT N3以上 → 日本合作高中 → 推荐大学本科", "特点：提前融入，推荐入学"],
    ],
  },
  {
    type: "program",
    eyebrow: "BRITISH PATHWAY",
    title: ["IGCSE / A-Level"],
    lead: "英式课程路径，IGCSE衔接A-Level，面向英国、香港、澳洲、加拿大等英联邦国家。",
    body: "IGCSE（International General Certificate of Secondary Education）是国际普通中等教育证书，A-Level（Advanced Level）是英国高中高级课程，两者构成完整的英式国际教育路径。A-Level成绩被全球160多个国家的大学认可，是申请英国、香港、澳洲、加拿大等英联邦国家大学的主要依据。",
    cards: [
      ["IGCSE阶段 G9-G10", "奠定学科基础，通常选择8-10门课程"],
      ["A-Level阶段 G11-G12", "深入学习3-4门核心课程，对接大学专业"],
      ["课程优势", "选课灵活、全球认可、模块化考核、强适配中国学生"],
    ],
  },
  {
    type: "program",
    eyebrow: "SINGAPORE PATHWAY",
    title: ["新加坡 IFD 方向"],
    lead: "国内两年完成语言、学科和预科能力建设，再衔接新加坡本科路径。",
    body: "IFD（International Foundation Diploma）国际预科课程，为有意向赴新加坡留学的学生提供系统化准备。",
    cards: [
      ["国内完成两年预科学习", "节省海外预科费用，在国内打好语言与学科基础"],
      ["三维能力培养", "语言能力 + 学科基础 + 学习技能，全面衔接海外本科"],
      ["衔接新加坡本科", "完成IFD后可衔接新加坡多所合作大学本科课程"],
      ["适合学术基础中等学生", "希望稳妥过渡到海外本科学习的学生"],
    ],
    note: "IFD方向为意向赴新加坡留学的学生提供稳妥、经济、高效的升学通道。",
  },
  {
    type: "cards",
    eyebrow: "FACULTY & GUIDANCE",
    title: ["师资与升学服务"],
    lead: "从教学管理到升学规划，奥斯翰国际部为学生提供全流程支持。",
    cards: [
      ["01", "国际课程统筹", "协调多课程路径的教学资源与质量管控"],
      ["02", "升学路径规划", "根据学生特点定制最优升学方案"],
      ["03", "教学与学生发展管理", "监督教学质量，关注学生全面发展"],
      ["04", "家校沟通与资源协调", "搭建家校沟通桥梁，整合外部优质资源"],
    ],
    note: "奥斯翰国际部核心管理团队拥有丰富的国际教育经验，从课程设计到升学落地，为学生提供全流程专业支持。",
  },
  {
    type: "timeline",
    eyebrow: "GUIDANCE CENTER",
    title: ["升学指导中心"],
    lead: "从选课程到拿录取，帮助学生把目标国家、专业方向、申请材料和时间节点统一管理。",
    steps: [
      ["01 入学评估", "全面了解学生学术水平、语言能力和兴趣方向"],
      ["02 课程匹配", "根据评估结果推荐最适合的国际课程路径"],
      ["03 目标院校", "结合学生成绩和家庭规划确定目标院校清单"],
      ["04 语言考试", "制定雅思/托福/小语种考试计划并提供备考支持"],
      ["05 材料文书", "指导学生准备申请文书、推荐信等核心材料"],
      ["06 面试签证", "模拟面试训练，协助签证材料准备与递交"],
    ],
  },
  {
    type: "admission",
    eyebrow: "ADMISSION REQUIREMENTS",
    title: ["入学要求与学费标准"],
    groups: [
      ["入学要求", ["面向初中毕业生及高中在读学生", "通过学校入学测试（数学、英语笔试+面试）", "有明确出国留学意向", "品行端正，学习态度端正"]],
      ["学费参考", ["国际课程学费因课程类型不同有所差异，详情请联系招生办公室咨询。"]],
      ["其他费用", ["住宿费、餐费、教材费、校服费等按实际发生收取"]],
      ["学校提供", ["一对一课程咨询服务，帮助家长和学生深入了解各课程特点，选择最适合的升学路径。欢迎预约访校，获取个性化课程规划建议。"]],
    ],
  },
  {
    type: "contact",
    eyebrow: "CONTACT US",
    title: ["联系我们"],
    groups: [
      ["学校地址", "深圳市罗湖区布心路2040号"],
      ["招生办公室", "0755-25805707 / 0755-25813956"],
    ],
    lead: "欢迎预约访校，获取个性化课程规划建议，深入了解各课程特点，选择最适合的升学路径。",
  },
  {
    type: "back",
    eyebrow: "OXSTAND",
    title: ["预约访校"],
    lead: "Schedule Your Campus Tour",
    body: ["深圳市罗湖区布心路2040号", "招生办公室：0755-25805707 / 0755-25813956", "欢迎预约访校，获取个性化课程规划建议"],
    foot: "OXSTAND INTERNATIONAL SCHOOL",
  },
];

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function title(lines) {
  return `<h1>${lines.map((line) => `<span>${esc(line)}</span>`).join("")}</h1>`;
}

function header(page, index) {
  return `
    <header class="page-head">
      <span>${esc(page.eyebrow || "OXSTAND INTERNATIONAL SCHOOL")}</span>
      <i>${String(index + 1).padStart(2, "0")}</i>
    </header>`;
}

function visual(label = "OXSTAND") {
  return `<div class="visual"><span>${esc(label)}</span></div>`;
}

function renderPage(page, index) {
  if (page.type === "cover") {
    return `<section class="page cover">
      <div class="cover-bg"></div>
      <div class="cover-content">
        <p class="eyebrow">${esc(page.eyebrow)}</p>
        ${title(page.title)}
        <p class="lead">${esc(page.lead)}</p>
        <b class="gold-line"></b>
      </div>
      <footer>${esc(page.foot)}</footer>
    </section>`;
  }

  if (page.type === "back") {
    return `<section class="page back">
      <div class="cover-bg"></div>
      <div class="back-content">
        <p class="eyebrow">${esc(page.eyebrow)}</p>
        ${title(page.title)}
        <p class="lead">${esc(page.lead)}</p>
        <div class="back-lines">${page.body.map((x) => `<p>${esc(x)}</p>`).join("")}</div>
      </div>
      <footer>${esc(page.foot)}</footer>
    </section>`;
  }

  if (page.type === "contents") {
    return `<section class="page contents">
      ${header(page, index)}
      <div class="contents-grid">
        <div>
          <p class="eyebrow">${esc(page.eyebrow)}</p>
          ${title(page.title)}
          <b class="gold-line"></b>
        </div>
        <ol>
          ${page.items.map((item, i) => `<li><span>${esc(item[0])}</span><strong>${esc(item[1])}</strong><em>${esc(item[2])}</em><b>${String(i + 3).padStart(2, "0")}</b></li>`).join("")}
        </ol>
      </div>
      ${footer(index)}
    </section>`;
  }

  if (page.type === "chapter") {
    return `<section class="page chapter">
      ${header(page, index)}
      <div class="chapter-grid">
        <div class="chapter-no">${esc(page.no)}</div>
        <div>
          <p class="eyebrow">${esc(page.eyebrow)}</p>
          ${title(page.title)}
          <p class="lead">${esc(page.lead)}</p>
          <b class="gold-line"></b>
        </div>
        ${visual(page.title[0])}
      </div>
      ${footer(index)}
    </section>`;
  }

  if (page.type === "profile") {
    return `<section class="page profile">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <div class="two-col">
        <div>${page.body.map((x) => `<p class="body">${esc(x)}</p>`).join("")}</div>
        <div class="stats">${page.stats.map((x) => `<div><strong>${esc(x[0])}</strong><span>${esc(x[1])}</span></div>`).join("")}</div>
      </div>
      ${footer(index)}
    </section>`;
  }

  if (page.type === "cards") {
    return `<section class="page cards-page">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <p class="lead">${esc(page.lead)}</p>
      <div class="card-grid">${page.cards.map((card) => `<article class="info-card"><span>${esc(card[0])}</span><h2>${esc(card[1])}</h2><p>${esc(card[2])}</p></article>`).join("")}</div>
      ${page.note ? `<p class="note">${esc(page.note)}</p>` : ""}
      ${footer(index)}
    </section>`;
  }

  if (page.type === "pathways") {
    return `<section class="page pathways">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <p class="lead">${esc(page.lead)}</p>
      <div class="path-grid">${page.cards.map((card) => `<article><h2>${esc(card[0])}</h2><h3>${esc(card[1])}</h3><p>${esc(card[2])}</p><em>${esc(card[3])}</em></article>`).join("")}</div>
      ${footer(index)}
    </section>`;
  }

  if (page.type === "program") {
    return `<section class="page program">
      ${header(page, index)}
      <div class="program-head">
        <div>
          <p class="eyebrow">${esc(page.eyebrow)}</p>
          ${title(page.title)}
          <p class="lead">${esc(page.lead)}</p>
        </div>
        ${visual(page.title[0])}
      </div>
      <p class="body">${esc(page.body)}</p>
      <div class="card-grid compact">${page.cards.map((card) => `<article class="info-card"><h2>${esc(card[0])}</h2><p>${esc(card[1])}</p></article>`).join("")}</div>
      ${page.note ? `<p class="note">${esc(page.note)}</p>` : ""}
      ${footer(index)}
    </section>`;
  }

  if (page.type === "timeline") {
    return `<section class="page timeline-page">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <p class="lead">${esc(page.lead)}</p>
      <div class="timeline">${page.steps.map((step) => `<article><strong>${esc(step[0])}</strong><p>${esc(step[1])}</p></article>`).join("")}</div>
      ${page.note ? `<p class="note">${esc(page.note)}</p>` : ""}
      ${footer(index)}
    </section>`;
  }

  if (page.type === "table") {
    return `<section class="page table-page">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <p class="lead">${esc(page.lead)}</p>
      <table>
        <tbody>${page.rows.map((row) => `<tr><th>${esc(row[0])}</th><td>${esc(row[1])}</td><td>${esc(row[2])}</td></tr>`).join("")}</tbody>
      </table>
      ${footer(index)}
    </section>`;
  }

  if (page.type === "admission") {
    return `<section class="page admission">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <div class="admission-grid">
        ${page.groups.map((group) => `<article><h2>${esc(group[0])}</h2><ul>${group[1].map((x) => `<li>${esc(x)}</li>`).join("")}</ul></article>`).join("")}
      </div>
      ${footer(index)}
    </section>`;
  }

  if (page.type === "contact") {
    return `<section class="page contact">
      ${header(page, index)}
      <p class="eyebrow">${esc(page.eyebrow)}</p>
      ${title(page.title)}
      <div class="contact-grid">
        <div>${page.groups.map((g) => `<article><span>${esc(g[0])}</span><strong>${esc(g[1])}</strong></article>`).join("")}</div>
        <div class="qr">QR</div>
      </div>
      <p class="note">${esc(page.lead)}</p>
      ${footer(index)}
    </section>`;
  }

  return "";
}

function footer(index) {
  return `<footer class="page-foot"><span>OXSTAND INTERNATIONAL SCHOOL</span><b>${String(index + 1).padStart(2, "0")}</b></footer>`;
}

const css = `
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; background: #e7e7e7; color: #333; font-family: "Noto Sans SC", "Microsoft YaHei", Arial, sans-serif; }
.page { position: relative; width: 210mm; height: 297mm; margin: 12mm auto; padding: 18mm 16mm 16mm 20mm; overflow: hidden; background: #fff; page-break-after: always; }
.page::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 4mm; background: #1B2A5B; }
.page-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14mm; color: #666; font-size: 7.5pt; letter-spacing: .08em; text-transform: uppercase; }
.page-head i { color: #D4A843; font-style: normal; font-weight: 700; }
.page-foot { position: absolute; left: 20mm; right: 16mm; bottom: 10mm; display: flex; justify-content: space-between; border-top: .3mm solid #E0E0E0; padding-top: 3mm; color: #666; font-size: 7pt; }
.page-foot b { color: #1B2A5B; }
.eyebrow { margin: 0 0 3mm; color: #D4A843; font-size: 8pt; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
h1 { margin: 0; color: #1B2A5B; font-family: "Noto Serif SC", SimSun, serif; font-size: 24pt; line-height: 1.18; font-weight: 800; }
h1 span { display: block; }
.lead { margin: 5mm 0 0; max-width: 145mm; color: #555; font-size: 10pt; line-height: 1.65; }
.body { color: #333; font-size: 9.3pt; line-height: 1.7; }
.gold-line { display: block; width: 16mm; height: 1mm; margin-top: 7mm; background: #D4A843; }
.cover, .back { padding: 0; color: #fff; background: #1B2A5B; }
.cover::before, .back::before { display: none; }
.cover-bg { position: absolute; inset: 0; background: radial-gradient(circle at 75% 20%, rgba(14,143,216,.55), transparent 30%), linear-gradient(135deg, #1B2A5B 0%, #14204A 52%, #0E8FD8 160%); }
.cover-bg::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px); background-size: 18mm 18mm; opacity: .28; }
.cover-content, .back-content { position: absolute; left: 20mm; right: 20mm; bottom: 42mm; z-index: 1; }
.cover h1, .back h1 { color: #fff; font-size: 34pt; }
.cover .lead, .back .lead { color: rgba(255,255,255,.84); font-size: 12pt; }
.cover footer, .back footer { position: absolute; right: 18mm; bottom: 14mm; color: rgba(212,168,67,.72); z-index: 1; font-size: 9pt; }
.back-lines { margin-top: 12mm; font-size: 10pt; line-height: 1.8; }
.contents-grid { display: grid; grid-template-columns: 58mm 1fr; gap: 18mm; align-items: start; }
.contents ol { list-style: none; margin: 0; padding: 0; }
.contents li { display: grid; grid-template-columns: 12mm 1fr 10mm; gap: 4mm; padding: 4.2mm 0; border-bottom: .25mm solid #E7EAF0; }
.contents li span { color: #D4A843; font-weight: 800; }
.contents li strong { display: block; color: #1B2A5B; font-size: 11pt; }
.contents li em { display: block; grid-column: 2; color: #777; font-size: 7.5pt; font-style: normal; }
.contents li b { grid-row: 1 / span 2; grid-column: 3; justify-self: end; color: #999; font-size: 8pt; }
.chapter-grid { display: grid; grid-template-columns: 42mm 1fr; gap: 10mm; align-items: center; }
.chapter-no { color: #D4A843; font-size: 58pt; font-family: Georgia, serif; line-height: .9; }
.visual { min-height: 88mm; margin-top: 14mm; grid-column: 1 / -1; display: grid; place-items: center; border-radius: 4mm; background: linear-gradient(135deg, #F0F4FA, #FAF8F2); color: rgba(27,42,91,.2); font-size: 25pt; font-weight: 800; text-align: center; }
.two-col { display: grid; grid-template-columns: 1fr 58mm; gap: 14mm; margin-top: 12mm; }
.stats { display: grid; gap: 4mm; }
.stats div { padding: 5mm; background: #F0F4FA; border-left: 1mm solid #D4A843; }
.stats strong { display: block; color: #1B2A5B; font-size: 20pt; }
.stats span { color: #666; font-size: 8pt; }
.card-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; margin-top: 10mm; }
.card-grid.compact { grid-template-columns: repeat(3, 1fr); }
.info-card { min-height: 42mm; padding: 6mm; background: #F0F4FA; border-radius: 3mm; border-top: .8mm solid #D4A843; }
.info-card span { color: #0E8FD8; font-weight: 800; font-size: 16pt; }
.info-card h2 { margin: 3mm 0; color: #1B2A5B; font-size: 12pt; }
.info-card p { margin: 0; color: #444; font-size: 8.5pt; line-height: 1.55; }
.path-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; margin-top: 10mm; }
.path-grid article { padding: 5mm; border: .3mm solid #D8DDEA; border-radius: 3mm; }
.path-grid h2 { margin: 0; color: #D4A843; font-size: 18pt; }
.path-grid h3 { margin: 2mm 0; color: #1B2A5B; font-size: 11pt; }
.path-grid p, .path-grid em { display: block; margin: 0; color: #555; font-size: 8pt; line-height: 1.45; font-style: normal; }
.program-head { display: grid; grid-template-columns: 1fr 54mm; gap: 10mm; align-items: start; }
.program-head .visual { grid-column: auto; min-height: 50mm; margin-top: 0; font-size: 13pt; }
.note { margin-top: 8mm; padding: 5mm; border-left: 1mm solid #D4A843; background: #FAF8F2; color: #444; font-size: 9pt; line-height: 1.6; }
.timeline { position: relative; margin-top: 12mm; padding-left: 10mm; }
.timeline::before { content: ""; position: absolute; left: 2.5mm; top: 2mm; bottom: 2mm; width: .5mm; background: #D4A843; }
.timeline article { position: relative; margin-bottom: 7mm; padding: 5mm 6mm; background: #F0F4FA; border-radius: 3mm; }
.timeline article::before { content: ""; position: absolute; left: -9mm; top: 7mm; width: 5mm; height: 5mm; border-radius: 50%; background: #1B2A5B; border: .8mm solid #D4A843; }
.timeline strong { display: block; color: #1B2A5B; font-size: 12pt; }
.timeline p { margin: 2mm 0 0; color: #444; font-size: 9pt; line-height: 1.55; }
table { width: 100%; margin-top: 12mm; border-collapse: collapse; font-size: 8.5pt; line-height: 1.55; }
th, td { vertical-align: top; padding: 5mm; border-bottom: .3mm solid #E0E0E0; }
th { width: 28mm; color: #1B2A5B; text-align: left; background: #F0F4FA; }
.admission-grid { display: grid; gap: 6mm; margin-top: 14mm; }
.admission article { padding: 6mm; background: #F0F4FA; border-radius: 3mm; }
.admission h2 { margin: 0 0 3mm; color: #1B2A5B; font-size: 13pt; }
.admission ul { margin: 0; padding-left: 5mm; color: #444; font-size: 9pt; line-height: 1.7; }
.contact-grid { display: grid; grid-template-columns: 1fr 44mm; gap: 12mm; margin-top: 16mm; align-items: stretch; }
.contact article { padding: 8mm 0; border-bottom: .3mm solid #E0E0E0; }
.contact span { display: block; color: #D4A843; font-size: 8pt; font-weight: 700; }
.contact strong { display: block; margin-top: 2mm; color: #1B2A5B; font-size: 15pt; }
.qr { display: grid; place-items: center; border: .5mm solid #1B2A5B; color: #1B2A5B; font-weight: 800; }
@media print {
  body { background: #fff; }
  .page { margin: 0; box-shadow: none; }
}
`;

const html = `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>奥斯翰国际部 A4 竖版招生宣传册视觉原型</title>
  <style>${css}</style>
</head>
<body>
${pages.map(renderPage).join("\n")}
</body>
</html>`;

const outFile = join(outDir, "A4竖版招生宣传册_视觉原型.html");
writeFileSync(outFile, html, "utf8");
console.log(`Generated: ${outFile}`);
