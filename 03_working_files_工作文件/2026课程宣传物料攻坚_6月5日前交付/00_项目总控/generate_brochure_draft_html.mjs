import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "05_总招生手册_初稿图文版");
const manifest = JSON.parse(fs.readFileSync(path.join(outDir, "asset_manifest.json"), "utf8"));
const today = "2026.06";

fs.mkdirSync(outDir, { recursive: true });

const img = (key) => manifest[key] || "";

const strengths = [
  ["2004", "深圳老牌民办国际化高中", "二十余年办学积累，适合强调稳定、经验与长期主义。"],
  ["多语种", "外语学校底色", "英语、日语、韩语等语言资源，为多出口升学提供基础。"],
  ["小规模", "更近的师生关系", "便于跟踪学生状态、学习节奏和升学节点。"],
  ["多路径", "按目标国家规划课程", "AP、OSSD、韩国、日本、新加坡、IG/A-Level衔接，给学生更多选择。"],
];

const courses = [
  {
    name: "AP 国际课程",
    tag: "美国/香港/多国申请",
    one: "适合目标美国、香港及多国综合申请的学生，用AP科目成绩、标化与语言成绩共同构建申请竞争力。",
    points: ["College Board 授权学校，School code: 579073", "G7-G10夯实英语、数学、科学与全球视野", "G11-G12进入SAT与AP科目冲刺", "已规划微积分、化学、生物、物理、经济、世界历史、中文等AP方向"],
    route: "基础能力搭建 → AP科目组合规划 → SAT/语言考试 → 多国大学申请",
  },
  {
    name: "OSSD 中加课程",
    tag: "加拿大/英美澳港多国申请",
    one: "适合希望走加拿大安大略省高中课程体系、重视过程性评价和多国申请通道的学生。",
    points: ["与加拿大邦德多伦多学院合作设立", "高二注册安大略省高中学籍，口径需按最终授权文件确认", "以12年级6门4U/4M课程成绩及语言成绩作为核心申请材料", "中加课程衔接，三年循序渐进完成学术能力过渡"],
    route: "中方基础课程 → 安省课程学习 → 12年级核心课程成绩 → 海外大学申请",
  },
  {
    name: "KUPP 韩国大学直升课程",
    tag: "韩国名校/小语种方向",
    one: "适合目标韩国本科、愿意系统学习韩语并通过TOPIK能力提升进入韩国高校申请的学生。",
    points: ["TOPIK 1-2、3-4、5-6三年递进目标", "韩国语、韩国文化与历史、留学生活指导一体化推进", "可结合校内文化课程成绩与TOPIK进行韩国高校申请", "韩国方向师资与资源相对成熟，是本册重点呈现板块"],
    route: "韩语入门 → TOPIK分级提升 → 文化课程与面试准备 → 韩国大学申请",
  },
  {
    name: "JUPP 日本大学直升课程",
    tag: "日本本科/日语方向",
    one: "适合目标日本本科、愿意长期学习日语并准备EJU、JLPT或校内考面试的学生。",
    points: ["日语分层学习，逐步进入升学考试准备", "可结合日本文化、留学生活适应与院校申请指导", "适合艺术、理工、商科、人文等不同专业方向规划", "游学与文化体验素材可强化课程真实感"],
    route: "日语基础 → JLPT/EJU准备 → 专业与院校定位 → 日本本科申请",
  },
  {
    name: "新加坡 IFD 方向",
    tag: "新加坡本科衔接",
    one: "适合希望先在国内完成语言、基础学科和预科能力建设，再衔接新加坡本科路径的学生。",
    points: ["两年制国内学习路径，强调语言、学科与预科能力", "课程覆盖学术用途英语、研究学习技巧、数学、商科、科学与艺术选修", "可面向SIM、PSB Academy等新加坡院校衔接方向进行规划", "合作与学分互认口径需以最终确认材料为准"],
    route: "国内语言与预科学习 → 学科选修与能力评估 → 新加坡院校衔接 → 本科学位路径",
  },
  {
    name: "IG / A-Level 衔接方向",
    tag: "英联邦/香港/多国申请",
    one: "适合目标英国、香港、澳洲、加拿大等方向，需要用IGCSE与A-Level科目组合建立学术画像的学生。",
    points: ["G9-G10完成IGCSE准备，G11-G12进入A-Level阶段", "数学、物理、化学、经济、商科、艺术设计等方向可按目标专业组合", "采用双语过渡到全英学术环境的递进设计", "A-Level中心认证与师资案例仍需最终确认，初稿先作为规划板块呈现"],
    route: "IG基础 → A-Level选科 → AS/A2考试 → UCAS及多国申请",
  },
];

const timeline = [
  ["2004", "经深圳市教育局批准创办"],
  ["2006", "成为深圳市一级学校"],
  ["2008", "引入 ISO9001 国际优质教育管理认证"],
  ["2009", "引进韩国大学直升课程"],
  ["2012", "引进日本大学先修课程"],
  ["2016", "获 College Board 批准成为 AP 授权学校"],
  ["2024", "AP School code 可查：579073"],
];

function esc(s = "") {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function statCards(items) {
  return `<div class="stat-grid">${items.map(([num, title, text]) => `
    <div class="stat-card"><div class="stat-num">${esc(num)}</div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>
  `).join("")}</div>`;
}

function courseCards() {
  return `<div class="course-grid">${courses.map((c) => `
    <div class="course-card">
      <div class="tag">${esc(c.tag)}</div>
      <h3>${esc(c.name)}</h3>
      <p>${esc(c.one)}</p>
    </div>
  `).join("")}</div>`;
}

function routeTable() {
  return `<div class="route-table">${[
    ["目标美国/香港/多国", "AP", "适合学科能力较强、希望用AP科目与标化组合提升申请竞争力的学生。"],
    ["目标加拿大/英美澳港", "OSSD", "适合重视过程评价、希望借助安省高中课程体系申请多国大学的学生。"],
    ["目标韩国本科", "KUPP", "适合愿意系统学习韩语、目标韩国名校及优势专业的学生。"],
    ["目标日本本科", "JUPP", "适合愿意系统学习日语，并准备EJU/JLPT/校内考的学生。"],
    ["目标新加坡本科", "IFD", "适合希望先在国内完成预科学习，再衔接新加坡院校的学生。"],
    ["目标英联邦/香港", "IG/A-Level", "适合希望按专业方向选择3-4门核心科目并冲刺英港澳加的学生。"],
  ].map(([a, b, c]) => `<div><strong>${esc(a)}</strong><span>${esc(b)}</span><p>${esc(c)}</p></div>`).join("")}</div>`;
}

function page(content, cls = "") {
  return `<section class="page ${cls}">${content}</section>`;
}

function header(kicker, title, sub = "") {
  return `<div class="section-head"><div class="kicker">${esc(kicker)}</div><h2>${esc(title)}</h2>${sub ? `<p>${esc(sub)}</p>` : ""}</div>`;
}

function splitImageText({ kicker, title, sub, image, children, reverse = false }) {
  return page(`
    <div class="folio">${esc(kicker)}</div>
    <div class="split ${reverse ? "reverse" : ""}">
      <div class="visual"><img src="${esc(image)}" /></div>
      <div class="copy">${header(kicker, title, sub)}${children}</div>
    </div>
  `);
}

function coursePage(c, i) {
  const pics = [img("class1"), img("ossd1"), img("activity1"), img("japan1"), img("campus1"), img("campus2")];
  return page(`
    <div class="course-hero">
      <div>
        <div class="kicker">COURSE PATH 0${i + 1}</div>
        <h2>${esc(c.name)}</h2>
        <p>${esc(c.one)}</p>
      </div>
      <div class="course-tag">${esc(c.tag)}</div>
    </div>
    <div class="course-detail">
      <div class="image-tile"><img src="${esc(pics[i] || img("campus1"))}" /></div>
      <div class="bullet-panel">
        <h3>课程亮点</h3>
        <ul>${c.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
      </div>
      <div class="route-panel">
        <h3>升学规划路线</h3>
        <p>${esc(c.route)}</p>
      </div>
    </div>
  `);
}

function landscapeHtml() {
  const pages = [];
  pages.push(page(`
    <div class="cover-bg"><img src="${esc(img("cover"))}" /></div>
    <div class="cover-mask"></div>
    <div class="cover-content">
      <div class="brand">OXSTAND INTERNATIONAL SCHOOL</div>
      <h1>深圳奥斯翰外语学校<br/>国际部招生宣传册</h1>
      <p>精品国际课程 · 多路径升学规划 · 小规模精细化支持</p>
      <div class="cover-bottom"><span>2026 Admissions Brochure Draft</span><span>${today}</span></div>
    </div>
  `, "cover"));
  pages.push(splitImageText({
    kicker: "WHY OXSTAND",
    title: "一所更懂深圳家庭选择的老牌国际化高中",
    sub: "奥斯翰的优势不在于把所有课程讲成同一种模式，而在于为不同目标的学生提供多路径选择：英美加澳、韩国、日本、新加坡、香港等方向，都可以从同一套学校管理与升学支持中展开。",
    image: img("campus1"),
    children: statCards(strengths),
  }));
  pages.push(page(`
    ${header("SCHOOL PROFILE", "学校简介与信任背书", "从办学历史、外语特色、课程体系与管理服务建立家长第一层信任。")}
    <div class="profile-layout">
      <div class="profile-copy">
        <p>深圳奥斯翰外语学校位于深圳市罗湖区布心路2040号，2004年经深圳市教育局批准创办，是一所全日制民办国际化高中。学校以“与世界同步，培育跨时代精英人才”为育人目标，植根中华传统文化，融贯东西方教育思想，依托外语特色与多元课程，为学生提供面向不同国家和地区的升学路径。</p>
        <p>本册以“国际部总招生手册”为叙事主线，不把课程割裂成单一项目，而是先展示学校的综合支持体系，再根据学生目标地区与学术基础，说明不同课程如何承接升学规划。</p>
      </div>
      <div class="timeline">${timeline.map(([y, t]) => `<div><b>${esc(y)}</b><span>${esc(t)}</span></div>`).join("")}</div>
    </div>
  `));
  pages.push(splitImageText({
    kicker: "POSITIONING",
    title: "把短板藏进结构，把长板讲成选择理由",
    sub: "对外表达以老牌办学、小规模陪伴、外语底色、国际课程经验和升学服务为主，避免把尚未最终确认的师资、案例或合作资源写成硬承诺。",
    image: img("activity1"),
    reverse: true,
    children: `<div class="pill-list">
      <span>老牌办学积累</span><span>港风小规模</span><span>师生关系紧密</span><span>多语种资源</span><span>多路径升学</span><span>过程管理清晰</span>
    </div>
    <div class="quote">“家长不是只在选一门课程，而是在选择孩子未来三年的学习管理、语言成长和升学路线。”</div>`,
  }));
  pages.push(page(`
    ${header("COURSE MAP", "国际课程地图", "按目标地区和学生发展阶段呈现课程，而不是简单堆叠课程名称。")}
    ${courseCards()}
  `));
  pages.push(page(`
    ${header("HOW TO CHOOSE", "如何帮学生选择课程", "把课程选择讲成升学路线规划，让家长快速判断孩子适合哪条路径。")}
    ${routeTable()}
  `));
  pages.push(splitImageText({
    kicker: "TEACHING SYSTEM",
    title: "从课程学习到日常管理，形成可感知的陪伴",
    sub: "学校可将日课表、导师课、晚自习、社团活动和升学节点整合为一套家长看得懂的学习管理闭环。",
    image: img("class1"),
    children: `<div class="process">
      <div><b>01</b><h3>课堂学习</h3><p>学科课程、语言课程、国际课程模块同步推进。</p></div>
      <div><b>02</b><h3>个性化辅导</h3><p>课后答疑、走班辅导、导师跟进帮助学生补弱提优。</p></div>
      <div><b>03</b><h3>活动拓展</h3><p>MUN、社团、文化活动和游学素材支撑综合素养表达。</p></div>
      <div><b>04</b><h3>升学规划</h3><p>选课、语言考试、目标院校、文书面试与申请节奏统一管理。</p></div>
    </div>`,
  }));
  pages.push(page(`
    ${header("FACULTY", "师资团队版位预留", "初稿先用“国际课程教学与升学服务团队”统一包装，待金校补齐10-15位可公开师资后替换。")}
    <div class="faculty-grid">
      ${Array.from({ length: 8 }).map((_, i) => `<div class="faculty-card"><div class="avatar">T${i + 1}</div><h3>金牌师资待补充</h3><p>姓名 / 岗位 / 学历 / 教龄 / 主讲课程 / 可公开亮点 / 照片授权</p></div>`).join("")}
    </div>
  `));
  pages.push(page(`
    ${header("SUPPORT", "一站式升学服务体系", "让家长看到学校不只是教课，而是把课程、语言、背景、申请和行前支持串成闭环。")}
    <div class="support-grid">
      ${["选课规划", "语言考试规划", "标化考试规划", "院校定位", "申请材料", "文书面试", "签证行前", "家校沟通"].map((t, i) => `<div><b>${String(i + 1).padStart(2, "0")}</b><h3>${esc(t)}</h3><p>${["根据目标专业反推课程组合。", "托福/雅思/TOPIK/JLPT分阶段推进。", "SAT/AP/IG/A-Level等节奏协同。", "按国家、专业、预算和学生能力匹配。", "成绩单、推荐信、作品或活动材料整理。", "形成可被大学理解的个人叙事。", "录取后继续服务留学落地。", "关键节点让家长清楚进展。"][i]}</p></div>`).join("")}
    </div>
  `));
  courses.forEach((c, i) => pages.push(coursePage(c, i)));
  pages.push(splitImageText({
    kicker: "CAMPUS LIFE",
    title: "校园生活与成长场景",
    sub: "宣传册需要让家长看到学生每天在哪里学习、和谁一起成长、学校如何提供稳定的生活与活动环境。",
    image: img("group"),
    reverse: true,
    children: `<div class="photo-strip"><img src="${esc(img("sports"))}" /><img src="${esc(img("culture"))}" /><img src="${esc(img("japan2"))}" /></div>
    <p class="lead">可用画面方向：校园环境、课堂互动、毕业合影、社团活动、运动会、非遗进校、日本游学、师生交流。后续设计可根据最终公开授权替换高清原图。</p>`,
  }));
  pages.push(page(`
    ${header("ADMISSION", "入学咨询与费用信息", "本页用于把阅读兴趣转为咨询动作，费用以学校最终公示和招生办确认为准。")}
    <div class="admission">
      <div>
        <h3>招生对象</h3>
        <p>初三在读、初中毕业、高中在读及有国际课程升学需求的学生。不同课程按入学测试、面试和学生目标进行匹配。</p>
      </div>
      <div>
        <h3>入学流程</h3>
        <p>咨询预约 → 课程评估 → 入学测试/面试 → 升学路线建议 → 确认课程与费用 → 办理入读。</p>
      </div>
      <div>
        <h3>费用口径</h3>
        <p>学费、住宿、餐费、杂费及项目费用待总裁办/招生办最终确认后填入。初稿暂不写死金额。</p>
      </div>
    </div>
  `));
  pages.push(page(`
    <div class="back-cover">
      <img src="${esc(img("cover"))}" />
      <div>
        <div class="brand">OXSTAND INTERNATIONAL SCHOOL</div>
        <h2>让合适的课程<br/>成为孩子走向世界的起点</h2>
        <p>深圳奥斯翰外语学校国际部</p>
        <p>地址：深圳市罗湖区布心路2040号</p>
        <p>招生热线与二维码待最终确认</p>
      </div>
    </div>
  `, "back"));
  return baseHtml(pages.join("\n"), "landscape");
}

function portraitHtml() {
  const pages = [];
  pages.push(page(`
    <div class="flyer-cover">
      <img src="${esc(img("cover"))}" />
      <div><div class="brand">OXSTAND INTERNATIONAL SCHOOL</div><h1>奥斯翰国际部<br/>精品课程招生简章</h1><p>多路径升学规划 · 小规模精细化支持</p></div>
    </div>
  `, "flyer"));
  pages.push(page(`
    ${header("WHY OXSTAND", "为什么选择奥斯翰", "老牌办学、外语底色、小规模管理、多出口课程，是这版传单的主叙事。")}
    ${statCards(strengths)}
    <div class="portrait-image"><img src="${esc(img("campus1"))}" /></div>
  `, "flyer"));
  pages.push(page(`
    ${header("COURSE MAP", "按目标选择课程", "先定方向，再选路径。")}
    ${routeTable()}
  `, "flyer"));
  for (let i = 0; i < courses.length; i += 2) {
    pages.push(page(`
      ${header("COURSE PATH", i === 0 ? "国际课程路径" : "更多升学方向", "每条路径都对应不同学生画像与申请目标。")}
      <div class="portrait-courses">${courses.slice(i, i + 2).map((c) => `
        <div class="portrait-course">
          <div class="tag">${esc(c.tag)}</div>
          <h3>${esc(c.name)}</h3>
          <p>${esc(c.one)}</p>
          <ul>${c.points.slice(0, 3).map((p) => `<li>${esc(p)}</li>`).join("")}</ul>
          <div class="mini-route">${esc(c.route)}</div>
        </div>`).join("")}</div>
    `, "flyer"));
  }
  pages.push(page(`
    ${header("SUPPORT", "学习管理与升学支持", "把课程学习、语言提升、背景活动和大学申请放在同一套节奏里。")}
    <div class="support-grid portrait">${["课堂学习", "个性化辅导", "语言考试", "选校定位", "文书面试", "签证行前"].map((t, i) => `<div><b>${String(i + 1).padStart(2, "0")}</b><h3>${esc(t)}</h3><p>由国际部团队按学生目标和阶段推进。</p></div>`).join("")}</div>
    <div class="portrait-image"><img src="${esc(img("activity1"))}" /></div>
  `, "flyer"));
  pages.push(page(`
    ${header("FACULTY & CAMPUS", "师资团队与校园场景", "师资页先预留，明天确认后替换为正式照片与履历。")}
    <div class="faculty-grid portrait">${Array.from({ length: 6 }).map((_, i) => `<div class="faculty-card"><div class="avatar">T${i + 1}</div><h3>师资待补</h3><p>姓名 / 岗位 / 课程 / 亮点</p></div>`).join("")}</div>
    <div class="photo-strip portrait"><img src="${esc(img("group"))}" /><img src="${esc(img("sports"))}" /></div>
  `, "flyer"));
  pages.push(page(`
    ${header("ADMISSION", "招生咨询", "费用、电话、二维码以最终确认版为准。")}
    <div class="admission portrait">
      <div><h3>适合学生</h3><p>初三在读、初中毕业、高中在读及有国际课程升学需求的学生。</p></div>
      <div><h3>咨询流程</h3><p>预约咨询 → 学业评估 → 入学测试/面试 → 路线建议 → 确认入读。</p></div>
      <div><h3>学校地址</h3><p>深圳市罗湖区布心路2040号</p></div>
    </div>
    <div class="final-call">选择一条更适合孩子的国际升学路线</div>
  `, "flyer"));
  return baseHtml(pages.join("\n"), "portrait");
}

function baseHtml(body, mode) {
  const landscape = mode === "landscape";
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<title>奥斯翰国际部招生宣传册初稿</title>
<style>
@page { size: ${landscape ? "A4 landscape" : "A4 portrait"}; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; color: #102033; background: #eee; font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif; }
.page { position: relative; width: ${landscape ? "297mm" : "210mm"}; height: ${landscape ? "210mm" : "297mm"}; overflow: hidden; background: #f7f3ea; page-break-after: always; padding: ${landscape ? "16mm 18mm" : "14mm"}; }
.page::after { content: ""; position: absolute; inset: auto 18mm 10mm 18mm; height: 1px; background: rgba(16,32,51,.16); }
.brand { letter-spacing: .08em; font-size: 10px; font-weight: 700; color: #d8b76a; }
.cover { padding: 0; color: white; }
.cover-bg, .cover-bg img, .back-cover img, .flyer-cover img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cover-mask { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(4,19,36,.92) 0%, rgba(9,42,73,.78) 42%, rgba(9,42,73,.18) 100%); }
.cover-content { position: absolute; left: 20mm; top: 24mm; width: 58%; }
.cover-content h1 { margin: 18mm 0 8mm; font-size: 42px; line-height: 1.18; letter-spacing: 0; }
.cover-content p { font-size: 18px; line-height: 1.6; color: #f4ead3; }
.cover-bottom { position: absolute; top: 145mm; display: flex; gap: 20mm; font-size: 12px; color: #e8d9ad; }
.section-head .kicker, .kicker { color: #b58b34; font-size: 11px; font-weight: 800; letter-spacing: .12em; margin-bottom: 5mm; }
h2 { margin: 0; font-size: ${landscape ? "30px" : "26px"}; line-height: 1.25; color: #102033; letter-spacing: 0; }
.section-head p, .lead { font-size: 15px; line-height: 1.8; color: #46576b; margin: 5mm 0 0; }
.split { display: grid; grid-template-columns: 46% 1fr; gap: 14mm; height: 100%; align-items: stretch; }
.split.reverse { grid-template-columns: 1fr 46%; }
.split.reverse .visual { order: 2; }
.visual img, .image-tile img, .portrait-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 2mm; }
.visual { min-height: 160mm; }
.copy { align-self: center; }
.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 5mm; margin-top: 9mm; }
.stat-card { background: white; border-left: 4px solid #b58b34; padding: 6mm; min-height: 34mm; box-shadow: 0 8px 24px rgba(16,32,51,.08); }
.stat-num { color: #0d496f; font-size: 24px; font-weight: 800; }
h3 { margin: 2mm 0; font-size: 17px; color: #102033; }
p, li { font-size: 13px; line-height: 1.65; color: #425267; }
.profile-layout { display: grid; grid-template-columns: 45% 1fr; gap: 12mm; margin-top: 12mm; }
.profile-copy { background: #102033; color: white; padding: 10mm; }
.profile-copy p { color: #f3ead8; font-size: 15px; }
.timeline { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; }
.timeline div { background: white; padding: 5mm; border-top: 3px solid #b58b34; }
.timeline b { display: block; font-size: 24px; color: #0d496f; }
.timeline span { font-size: 13px; color: #425267; }
.pill-list { display: flex; flex-wrap: wrap; gap: 4mm; margin-top: 8mm; }
.pill-list span { border: 1px solid #d9c28a; color: #102033; padding: 3mm 5mm; background: white; font-size: 14px; }
.quote { margin-top: 10mm; padding: 8mm; background: #102033; color: #f4ead3; font-size: 19px; line-height: 1.7; }
.course-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin-top: 9mm; }
.course-card { background: #102033; color: white; min-height: 48mm; padding: 7mm; display: flex; flex-direction: column; justify-content: space-between; }
.course-card h3 { color: white; font-size: 20px; }
.course-card p { color: #d7e0e8; }
.tag, .course-tag { color: #d8b76a; font-size: 12px; font-weight: 800; }
.route-table { display: grid; grid-template-columns: repeat(2, 1fr); gap: 4mm; margin-top: 9mm; }
.route-table div { background: white; padding: 5mm; border-left: 4px solid #0d496f; }
.route-table strong { display: block; font-size: 17px; color: #102033; }
.route-table span { color: #b58b34; font-weight: 800; }
.process, .support-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-top: 8mm; }
.process div, .support-grid div { background: white; padding: 5mm; min-height: 44mm; }
.process b, .support-grid b { color: #b58b34; font-size: 24px; }
.faculty-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5mm; margin-top: 9mm; }
.faculty-card { background: white; padding: 5mm; min-height: 48mm; border-bottom: 3px solid #d8b76a; }
.avatar { width: 16mm; height: 16mm; border-radius: 50%; background: #102033; color: white; display: grid; place-items: center; font-weight: 800; }
.course-hero { display: flex; justify-content: space-between; gap: 12mm; align-items: end; padding-bottom: 8mm; border-bottom: 1px solid rgba(16,32,51,.18); }
.course-hero h2 { font-size: 34px; }
.course-hero p { font-size: 16px; max-width: 190mm; }
.course-tag { background: #102033; padding: 4mm 6mm; white-space: nowrap; }
.course-detail { display: grid; grid-template-columns: 42% 1fr 1fr; gap: 6mm; margin-top: 9mm; height: 125mm; }
.bullet-panel, .route-panel { background: white; padding: 7mm; }
.bullet-panel ul { padding-left: 5mm; }
.route-panel { background: #102033; }
.route-panel h3, .route-panel p { color: white; }
.photo-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 8mm; height: 44mm; }
.photo-strip img { width: 100%; height: 100%; object-fit: cover; }
.admission { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6mm; margin-top: 12mm; }
.admission div { background: white; padding: 8mm; min-height: 60mm; border-top: 4px solid #b58b34; }
.back { padding: 0; color: white; }
.back-cover { position: absolute; inset: 0; }
.back-cover::after { content:""; position:absolute; inset:0; background: linear-gradient(90deg, rgba(5,18,33,.90), rgba(5,18,33,.58)); }
.back-cover > div { position: absolute; z-index: 2; left: 22mm; top: 38mm; width: 58%; }
.back-cover h2 { color: white; font-size: 38px; margin: 14mm 0; }
.back-cover p { color: #f2e6c8; font-size: 16px; }
.folio { position: absolute; top: 8mm; right: 18mm; font-size: 10px; color: #9a7b3b; letter-spacing: .15em; }
.flyer-cover { position: absolute; inset: 0; color: white; }
.flyer-cover::after { content:""; position:absolute; inset:0; background: linear-gradient(180deg, rgba(7,25,44,.35), rgba(7,25,44,.95)); }
.flyer-cover div { position: absolute; z-index: 2; left: 14mm; right: 14mm; bottom: 24mm; }
.flyer-cover h1 { font-size: 37px; line-height: 1.22; margin: 8mm 0; }
.flyer .stat-grid { grid-template-columns: 1fr 1fr; }
.portrait-image { height: 85mm; margin-top: 8mm; }
.portrait-courses { display: grid; gap: 6mm; margin-top: 8mm; }
.portrait-course { background: white; padding: 6mm; border-left: 4px solid #0d496f; }
.portrait-course h3 { font-size: 21px; }
.mini-route { color: #102033; background: #f0e3c4; padding: 3mm; font-size: 12px; margin-top: 3mm; }
.support-grid.portrait { grid-template-columns: repeat(2, 1fr); }
.faculty-grid.portrait { grid-template-columns: repeat(2, 1fr); }
.photo-strip.portrait { grid-template-columns: repeat(2, 1fr); height: 66mm; }
.admission.portrait { grid-template-columns: 1fr; gap: 4mm; }
.admission.portrait div { min-height: auto; padding: 5mm; }
.final-call { margin-top: 10mm; background: #102033; color: #f4ead3; padding: 8mm; font-size: 22px; font-weight: 800; text-align: center; }
</style>
</head>
<body>${body}</body>
</html>`;
}

const landscape = landscapeHtml();
const portrait = portraitHtml();
fs.writeFileSync(path.join(outDir, "奥斯翰国际部总招生手册_横版图文初稿.html"), landscape, "utf8");
fs.writeFileSync(path.join(outDir, "奥斯翰国际部总招生传单版_竖版图文初稿.html"), portrait, "utf8");

const notes = `# 奥斯翰国际部总招生手册初稿内部说明

本轮已生成两套可交给设计继续深化的图文排布稿：

- 横版完整册子：奥斯翰国际部总招生手册_横版图文初稿.html / .pdf
- 竖版传单式排布：奥斯翰国际部总招生传单版_竖版图文初稿.html / .pdf

## 当前处理原则

- 不把师资、案例、合作证明等未确认信息写成最终承诺。
- 师资页以“国际课程教学与升学服务团队”统一包装，并预留8个教师版位。
- AP、OSSD、韩国、日本、新加坡、IG/A-Level进入初稿叙事。
- DSE暂不进入本轮公开册子。
- A-Level以“IG/A-Level衔接方向”呈现，认证与师资仍需最终确认。

## 明天优先补齐

1. 10-15位可公开师资：姓名、照片、岗位、学历、教龄、授课方向、可公开亮点。
2. OSSD合作证明、安省学籍注册准确口径、OCT师资、案例与费用。
3. AP授权证明截图、AP师资、AP成绩或升学案例。
4. 韩国课程强数据证据：100%升学率、顶尖大学46%、TOP20 90%以上。
5. 各课程最终学费、住宿餐食、入学测试和报名流程。
6. 选定最终可公开图片并确认授权。
`;
fs.writeFileSync(path.join(outDir, "奥斯翰国际部总招生手册_初稿内部说明.md"), notes, "utf8");

console.log("Generated brochure draft HTML files.");
