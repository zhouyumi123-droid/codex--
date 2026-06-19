import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "08_展会VI易拉宝公众号方案", "04_展会视觉稿_可预览HTML");
const assetDir = path.join(root, "05_总招生手册_初稿图文版", "assets");
fs.mkdirSync(outDir, { recursive: true });

const relAsset = name => `../../05_总招生手册_初稿图文版/assets/${name}`;
const write = (name, html) => fs.writeFileSync(path.join(outDir, name), html, "utf8");

const contact = {
  school: "深圳奥斯翰外语学校国际部",
  en: "OXSTAND INTERNATIONAL SCHOOL",
  address: "深圳市罗湖区布心路 2040 号",
  phone: "0755-25805707 / 0755-25813956",
};

const courses = [
  ["OSSD 中加课程", "安省高中毕业文凭，过程评价，6 门 12 年级成绩申请", "加拿大、英美澳港多国"],
  ["AP 国际课程", "College Board 授权，School Code 579073，高挑战学科证明", "美国、香港及多国申请"],
  ["日韩小语种升学", "TOPIK / JLPT / EJU / 面试，发挥外语学校特色", "韩国、日本本科"],
  ["IGCSE / A-Level", "IGCSE 打基础，A-Level 选科冲刺", "英国、香港、澳洲、加拿大"],
  ["新加坡 IFD", "国内完成语言与预科能力建设，再衔接新加坡本科路径", "新加坡本科与后期转轨"],
];

const shell = (title, body, extraCss = "") => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root {
  --navy:#18265A;
  --blue:#0E8FD8;
  --purple:#33215F;
  --gold:#D4A843;
  --ivory:#FBFAF6;
  --paper:#FFFFFF;
  --soft:#F0F4FA;
  --ink:#26303D;
  --muted:#687180;
}
* { box-sizing: border-box; }
body { margin: 0; background: #d8dbe3; color: var(--ink); font-family: "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif; }
h1,h2,h3,p { margin-top: 0; }
h1 { letter-spacing: 0; }
.brand { font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: rgba(255,255,255,.82); font-weight: 700; }
.gold { color: var(--gold); }
.qr { background: white; color: var(--purple); display: grid; place-items: center; text-align: center; font-weight: 800; border: 3px solid var(--gold); }
.tag { display: inline-flex; align-items: center; justify-content: center; min-height: 28px; padding: 5px 11px; border-radius: 999px; background: rgba(212,168,67,.16); color: var(--gold); font-weight: 800; font-size: 13px; }
.visual-note { max-width: 980px; margin: 24px auto 10px; padding: 14px 18px; background: white; border-left: 5px solid var(--gold); color: var(--muted); line-height: 1.7; }
${extraCss}
</style>
</head>
<body>${body}</body>
</html>`;

function rollupCard(kicker, title, subtitle, image, middle, footerMode = "default") {
  return `<section class="rollup">
    <div class="roll-head">
      <div>
        <p class="brand">${contact.en}</p>
        <p class="school">${contact.school}</p>
      </div>
      <div class="mark">OX</div>
    </div>
    <div class="hero">
      <img src="${relAsset(image)}" alt="">
      <div class="shade"></div>
      <div class="hero-copy">
        <p>${kicker}</p>
        <h1>${title}</h1>
        <span>${subtitle}</span>
      </div>
    </div>
    <div class="middle">${middle}</div>
    <div class="roll-foot ${footerMode}">
      <div class="qr">二维码<br>占位</div>
      <div>
        <b>扫码预约 1 对 1 学业评估</b>
        <p>获取专属国际课程路径建议</p>
        <small>${contact.address}<br>${contact.phone}</small>
      </div>
    </div>
  </section>`;
}

const rollupCss = `
.wrap { width: 1260px; margin: 0 auto; padding: 28px 0 42px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; align-items: start; }
.rollup { width: 386px; min-height: 960px; background: var(--ivory); position: relative; overflow: hidden; box-shadow: 0 18px 45px rgba(20,28,55,.22); }
.rollup:before { content:""; position:absolute; inset:0 auto 0 0; width:18px; background: var(--purple); z-index:2; }
.roll-head { height: 112px; background: linear-gradient(135deg, var(--navy), var(--purple)); color:white; padding: 28px 28px 22px 42px; display:flex; justify-content:space-between; align-items:flex-start; }
.school { font-size: 20px; margin: 8px 0 0; font-weight: 800; }
.mark { width:54px; height:54px; border:1px solid rgba(212,168,67,.7); display:grid; place-items:center; color:var(--gold); font-weight:900; }
.hero { height: 270px; position: relative; }
.hero img { width:100%; height:100%; object-fit:cover; display:block; }
.shade { position:absolute; inset:0; background:linear-gradient(90deg, rgba(24,38,90,.92), rgba(51,33,95,.28)); }
.hero-copy { position:absolute; left:42px; right:28px; top:42px; color:white; }
.hero-copy p { color:var(--gold); font-weight:900; letter-spacing:.04em; margin-bottom:10px; }
.hero-copy h1 { font-size:38px; line-height:1.12; margin-bottom:14px; }
.hero-copy span { display:block; font-size:16px; line-height:1.55; color:rgba(255,255,255,.9); }
.middle { padding: 28px 26px 26px 42px; min-height: 404px; }
.metric-grid { display:grid; gap:16px; }
.metric { border-left:5px solid var(--gold); background:white; padding:16px 18px; min-height:90px; }
.metric b { display:block; color:var(--navy); font-size:21px; margin-bottom:6px; }
.metric p { margin:0; color:var(--muted); line-height:1.55; font-size:14px; }
.path-list { display:grid; gap:12px; }
.path { background:white; border:1px solid #DFE5F0; border-radius:8px; padding:13px 14px; }
.path b { color:var(--navy); font-size:18px; }
.path p { margin:6px 0 0; font-size:13px; line-height:1.45; color:var(--muted); }
.flow { display:grid; gap:13px; margin-top:12px; }
.flow div { display:flex; gap:12px; align-items:flex-start; background:white; padding:13px; border-radius:8px; }
.flow i { flex:0 0 30px; height:30px; border-radius:50%; background:var(--gold); color:var(--purple); display:grid; place-items:center; font-style:normal; font-weight:900; }
.flow b { display:block; color:var(--navy); margin-bottom:3px; }
.flow p { margin:0; color:var(--muted); font-size:13px; line-height:1.45; }
.roll-foot { height: 166px; background: var(--navy); color:white; display:grid; grid-template-columns:98px 1fr; gap:16px; align-items:center; padding: 22px 24px 22px 42px; }
.roll-foot .qr { width:92px; height:92px; font-size:15px; }
.roll-foot b { font-size:18px; color:white; }
.roll-foot p { color:var(--gold); margin:8px 0; font-weight:700; }
.roll-foot small { color:rgba(255,255,255,.76); line-height:1.55; }
`;

const rollups = shell("展会易拉宝三款视觉稿", `
<div class="visual-note">三款易拉宝按 80cm x 200cm 的信息比例设计，页面为缩放预览。二维码、LOGO、最终照片和印刷出血需在定稿前替换确认。</div>
<main class="wrap">
${rollupCard(
  "学校总览",
  "精品国际课程<br>多路径升学规划",
  "深圳老牌民办国际化高中，以外语特色和多元课程，为学生打开更适合的海外升学选择。",
  "campus1.jpg",
  `<div class="metric-grid">
    <div class="metric"><b>20+ 年办学积累</b><p>2004 年创校，形成稳定教学体系与升学服务基础。</p></div>
    <div class="metric"><b>外语特色底色</b><p>英语、日语、韩语等语言资源，服务不同国家出口。</p></div>
    <div class="metric"><b>多路径升学规划</b><p>OSSD、AP、日韩、IGCSE/A-Level、新加坡 IFD，按学生基础匹配方向。</p></div>
  </div>`
)}
${rollupCard(
  "课程路径地图",
  "奥斯翰国际<br>课程地图",
  "先看目标国家，再选择课程路径；先看学生基础，再设计三年学习节奏。",
  "class1.jpg",
  `<div class="path-list">${courses.map(([name, desc, dir]) => `<div class="path"><b>${name}</b><p>${desc}</p><p class="gold">${dir}</p></div>`).join("")}</div>`
)}
${rollupCard(
  "升学服务闭环",
  "入学不是<br>简单报名",
  "先判断孩子适合哪一条课程路线，再安排语言、学科、考试和升学节点。",
  "graduation.jpg",
  `<div class="flow">
    ${[
      ["1", "1 对 1 学业评估", "了解语言基础、数学与学科能力、学习习惯和目标国家。"],
      ["2", "课程路径建议", "匹配 OSSD、AP、日韩、IGCSE/A-Level 或新加坡方向。"],
      ["3", "阶段成长规划", "安排入学后语言、学科、考试和升学节点。"],
      ["4", "持续跟踪支持", "学习进度、语言能力、家校沟通、方向动态调整。"],
    ].map(([n, t, d]) => `<div><i>${n}</i><span><b>${t}</b><p>${d}</p></span></div>`).join("")}
  </div>`
)}
</main>`, rollupCss);

const boothCss = `
.booth-page { width: 1280px; margin: 28px auto 46px; display:grid; gap:28px; }
.backwall { height: 760px; position:relative; overflow:hidden; background:linear-gradient(120deg, rgba(24,38,90,.98), rgba(51,33,95,.93)); color:white; box-shadow:0 22px 55px rgba(20,28,55,.28); }
.backwall img { position:absolute; right:0; top:0; width:56%; height:100%; object-fit:cover; opacity:.58; }
.backwall:before { content:""; position:absolute; inset:0; background:linear-gradient(90deg, rgba(24,38,90,1) 0%, rgba(24,38,90,.94) 42%, rgba(24,38,90,.1)); }
.back-copy { position:relative; z-index:2; padding:72px 70px; width:720px; }
.back-copy h1 { font-size:72px; line-height:1.05; margin:30px 0 20px; }
.back-copy .sub { font-size:24px; line-height:1.55; color:rgba(255,255,255,.86); }
.course-tags { display:flex; flex-wrap:wrap; gap:12px; margin:34px 0; max-width:680px; }
.course-tags .tag { min-height:38px; padding:8px 16px; font-size:17px; background:rgba(212,168,67,.18); }
.three { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:28px; }
.three div { border-top:3px solid var(--gold); background:rgba(255,255,255,.1); padding:18px; min-height:94px; }
.three b { display:block; font-size:21px; color:white; }
.three p { margin:7px 0 0; color:rgba(255,255,255,.78); line-height:1.45; }
.back-qr { position:absolute; right:64px; bottom:58px; z-index:3; display:grid; grid-template-columns:126px 220px; gap:18px; align-items:center; }
.back-qr .qr { width:126px; height:126px; font-size:18px; }
.back-qr b { display:block; color:white; font-size:25px; margin-bottom:8px; }
.back-qr p { color:rgba(255,255,255,.76); line-height:1.6; margin:0; }
.fascia { height:150px; background:var(--navy); color:white; display:flex; align-items:center; justify-content:space-between; padding:0 54px; border-bottom:10px solid var(--gold); }
.fascia h2 { font-size:42px; margin:0; letter-spacing:0; }
.fascia span { color:var(--gold); font-weight:800; letter-spacing:.08em; }
.tabletop { display:grid; grid-template-columns:1fr 1fr; gap:28px; }
.desk { min-height:310px; background:white; padding:34px; border-top:12px solid var(--gold); box-shadow:0 16px 42px rgba(20,28,55,.18); display:grid; grid-template-columns:1fr 140px; gap:30px; align-items:center; }
.desk h3 { color:var(--navy); font-size:34px; line-height:1.15; margin-bottom:14px; }
.desk p { color:var(--muted); line-height:1.7; font-size:17px; }
.desk .qr { width:140px; height:140px; }
`;

const booth = shell("展位主背板与VI视觉稿", `
<div class="visual-note">展位主背板按 300cm x 230cm 的远距离识别逻辑做信息层级，门头只保留学校识别，桌牌承担扫码转化。</div>
<main class="booth-page">
  <section class="backwall">
    <img src="${relAsset("group.jpg")}" alt="">
    <div class="back-copy">
      <p class="brand">${contact.en}</p>
      <h1>精品国际课程<br><span class="gold">多路径</span>升学规划</h1>
      <p class="sub">深圳老牌民办国际化高中，以外语特色和多元课程，为学生打开更适合的海外升学选择。</p>
      <div class="course-tags">${courses.map(([n]) => `<span class="tag">${n}</span>`).join("")}</div>
      <div class="three">
        <div><b>2004 年创校</b><p>20+ 年本土办学积累</p></div>
        <div><b>外语特色</b><p>多语种升学出口</p></div>
        <div><b>全流程跟进</b><p>入学评估与升学服务闭环</p></div>
      </div>
    </div>
    <div class="back-qr">
      <div class="qr">二维码<br>占位</div>
      <div><b>扫码预约 1 对 1 学业评估</b><p>${contact.address}<br>${contact.phone}</p></div>
    </div>
  </section>
  <section class="fascia">
    <h2>${contact.school}</h2>
    <span>${contact.en}</span>
  </section>
  <section class="tabletop">
    <div class="desk">
      <div><h3>领取课程路径建议</h3><p>现场扫码预约评估，招生老师将根据学生语言基础、学科能力、目标国家和家庭规划，给出课程路径建议。</p></div>
      <div class="qr">预约评估<br>二维码</div>
    </div>
    <div class="desk">
      <div><h3>关注招生简章</h3><p>获取 OSSD、AP、日韩、IGCSE/A-Level、新加坡 IFD 课程说明、费用与报名流程。</p></div>
      <div class="qr">公众号<br>二维码</div>
    </div>
  </section>
</main>`, boothCss);

const wechatCss = `
.wechat { width: 760px; margin: 26px auto 48px; background:white; padding-bottom:34px; box-shadow:0 18px 48px rgba(20,28,55,.18); }
.wx-cover { height: 420px; position:relative; overflow:hidden; color:white; background:var(--navy); }
.wx-cover img { width:100%; height:100%; object-fit:cover; opacity:.58; }
.wx-cover:before { content:""; position:absolute; inset:0; background:linear-gradient(90deg, rgba(24,38,90,.96), rgba(51,33,95,.58)); }
.wx-cover div { position:absolute; left:48px; right:44px; bottom:48px; }
.wx-cover h1 { font-size:48px; line-height:1.08; margin:16px 0; }
.wx-cover p { font-size:20px; line-height:1.5; color:rgba(255,255,255,.86); }
.article { padding:40px 52px; }
.article h2 { color:var(--navy); font-size:30px; margin:34px 0 14px; border-left:6px solid var(--gold); padding-left:14px; letter-spacing:0; }
.article h3 { color:var(--purple); font-size:21px; margin:22px 0 10px; }
.article p, .article li { font-size:17px; line-height:1.85; color:#303642; }
.leadbox { background:var(--soft); border-left:5px solid var(--gold); padding:20px 22px; margin:20px 0; }
.wx-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin:18px 0; }
.wx-card { border:1px solid #E1E6EF; border-radius:8px; padding:16px; background:#fff; }
.wx-card b { color:var(--navy); font-size:19px; }
.wx-card p { margin:8px 0 0; font-size:15px; color:var(--muted); line-height:1.65; }
.wx-table { width:100%; border-collapse:collapse; margin:18px 0; }
.wx-table th { background:var(--navy); color:white; padding:12px; text-align:left; font-size:15px; }
.wx-table td { border-bottom:1px solid #E1E6EF; padding:12px; font-size:15px; line-height:1.55; }
.cta { margin:28px 0; padding:24px; background:linear-gradient(135deg, var(--navy), var(--purple)); color:white; text-align:center; border-radius:10px; }
.cta b { display:block; font-size:25px; margin-bottom:8px; color:white; }
.cta p { color:rgba(255,255,255,.84); margin:0; }
`;

const article = shell("公众号招生简章排版稿", `
<main class="wechat">
  <section class="wx-cover">
    <img src="${relAsset("cover.jpg")}" alt="">
    <div>
      <p class="brand">${contact.en}</p>
      <h1>精品国际课程<br><span class="gold">多路径升学规划</span></h1>
      <p>${contact.school} 2026 招生简章</p>
    </div>
  </section>
  <article class="article">
    <div class="leadbox">如果孩子正在面临初升高、高中转轨或国际课程选择，家长最关心的往往不是“学校有多少课程”，而是孩子适合哪一个国家方向、现在的语言和学科基础能进入什么课程，以及三年后如何形成可申请大学的成绩和材料。</div>
    <h2>01 关于奥斯翰</h2>
    <p>深圳奥斯翰外语学校创办于 2004 年，是深圳本土办学二十余年的民办学校。学校位于深圳市罗湖区布心路 2040 号，以“与世界同步，培育跨时代精英人才”为育人目标，植根中华传统文化，融贯东西方教育思想，依托外语特色，持续建设多元国际课程与海外升学服务体系。</p>
    <div class="wx-grid">
      <div class="wx-card"><b>20 余年办学积累</b><p>熟悉深圳家庭对国际升学的真实需求，形成稳定教学体系与升学服务基础。</p></div>
      <div class="wx-card"><b>外语特色底色</b><p>英语、日语、韩语等语言资源，为不同国家出口提供语言基础。</p></div>
      <div class="wx-card"><b>小规模精细化支持</b><p>更短反馈链条、更近师生关系，便于持续跟踪学习状态。</p></div>
      <div class="wx-card"><b>多路径升学规划</b><p>OSSD、AP、日韩、IGCSE/A-Level、新加坡 IFD，按目标国家、语言基础和学科优势匹配课程。</p></div>
    </div>
    <h2>02 课程体系总览</h2>
    <p>奥斯翰国际部的课程选择逻辑，不是把所有学生推向同一条路，而是从目标国家、语言基础、学科优势和申请方式四个维度，帮助学生匹配更适合的高中阶段学习路径。</p>
    <table class="wx-table">
      <tr><th>课程方向</th><th>核心特点</th><th>主要升学方向</th></tr>
      ${courses.map(([a,b,c]) => `<tr><td>${a}</td><td>${b}</td><td>${c}</td></tr>`).join("")}
    </table>
    <div class="cta"><b>展会现场开放 1 对 1 课程路径咨询</b><p>扫码预约评估，领取专属课程路径建议。</p></div>
    ${[
      ["03 OSSD 中加课程", "OSSD 是加拿大安大略省高中毕业文凭，以过程评价、安省课程和多国申请通道为核心优势。适合希望避开单一考试路径，重视平时学习积累，希望用更灵活方式申请加拿大、英国、美国、澳洲、香港等方向的学生。"],
      ["04 AP 国际课程", "AP 是美国大学理事会推出的大学先修课程体系，帮助学生用高挑战度学科成绩展示大学学习潜力。深圳奥斯翰外语学校具备 College Board AP 授权，School Code 579073。"],
      ["05 日韩小语种升学", "奥斯翰发挥外语学校特色，开设韩国大学直升课程 KUPP 与日本大学直升课程 JUPP，为目标韩国、日本本科的学生提供语言、文化、考试和申请支持。"],
      ["06 IGCSE / A-Level", "IGCSE 是 A-Level 前的学术准备阶段，帮助学生完成国际课程学习习惯、学术英语和学科基础建设。A-Level 阶段学生选择 3-4 门与未来专业相关的核心科目，形成面向大学申请的学术成绩。"],
      ["07 新加坡 IFD 方向", "新加坡 IFD 方向帮助学生先在国内完成语言、基础学科和大学预科能力建设，再衔接新加坡本科路径，同时保留后期升级转轨空间。"],
    ].map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`).join("")}
    <h2>08 师资与升学服务</h2>
    <p>优秀课程最终要落到教师、管理和升学服务上。奥斯翰国际部围绕课程学习、学生成长和大学申请，提供持续跟踪支持。</p>
    <div class="leadbox">入学评估 → 课程匹配 → 目标院校 → 语言考试 → 材料文书 → 面试签证</div>
    <h2>09 招生对象与报名流程</h2>
    <p>招生对象包括初三在读学生、初中毕业学生，以及高中在读且有国际课程升学需求的学生。入学评估包括学业测试、面试与课程咨询。</p>
    <div class="cta"><b>欢迎预约访校</b><p>${contact.address}<br>${contact.phone}</p></div>
  </article>
</main>`, wechatCss);

const flyerCss = `
@page { size:A4 portrait; margin:0; }
.flyer { width:210mm; min-height:297mm; margin:18px auto; background:white; box-shadow:0 16px 44px rgba(20,28,55,.18); position:relative; overflow:hidden; page-break-after:always; }
.flyer.front { color:white; background:var(--navy); }
.flyer.front img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; opacity:.45; }
.flyer.front:before { content:""; position:absolute; inset:0; background:linear-gradient(120deg, rgba(24,38,90,.96), rgba(51,33,95,.78) 58%, rgba(24,38,90,.2)); }
.flyer-copy { position:relative; z-index:2; padding:28mm 18mm; }
.flyer h1 { font-size:38pt; line-height:1.1; margin:18mm 0 8mm; }
.flyer .sub { font-size:14pt; line-height:1.7; width:145mm; color:rgba(255,255,255,.88); }
.flyer-tags { display:flex; flex-wrap:wrap; gap:8px; margin-top:18mm; width:160mm; }
.flyer-tags .tag { font-size:10pt; min-height:9mm; }
.flyer-bottom { position:absolute; left:18mm; right:18mm; bottom:18mm; display:grid; grid-template-columns:38mm 1fr; gap:8mm; align-items:center; z-index:2; }
.flyer-bottom .qr { width:38mm; height:38mm; }
.flyer-bottom b { color:white; font-size:16pt; }
.flyer-bottom p { color:rgba(255,255,255,.8); line-height:1.55; }
.flyer.back { padding:18mm; }
.flyer.back h2 { color:var(--navy); font-size:24pt; margin-bottom:7mm; letter-spacing:0; }
.mini-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:5mm; }
.mini-card { border:1px solid #E0E5EF; border-left:1.5mm solid var(--gold); padding:5mm; min-height:31mm; }
.mini-card b { color:var(--navy); font-size:12pt; }
.mini-card p { font-size:9pt; line-height:1.55; color:var(--muted); margin:2mm 0 0; }
.process-line { margin:8mm 0; padding:6mm; background:#F0F4FA; color:var(--navy); font-weight:800; line-height:1.8; }
.fee { width:100%; border-collapse:collapse; margin-top:5mm; }
.fee th { background:var(--navy); color:white; padding:3mm; font-size:9pt; text-align:left; }
.fee td { border-bottom:1px solid #E0E5EF; padding:3mm; font-size:9pt; }
@media print { body { background:white; } .flyer { margin:0; box-shadow:none; } }
`;

const flyer = shell("A4招生单页双面视觉稿", `
<section class="flyer front">
  <img src="${relAsset("campus2.jpg")}" alt="">
  <div class="flyer-copy">
    <p class="brand">${contact.en}</p>
    <h1>精品国际课程<br><span class="gold">多路径升学规划</span></h1>
    <p class="sub">深圳老牌民办国际化高中，以外语特色和多元课程，为学生打开更适合的海外升学选择。</p>
    <div class="flyer-tags">${courses.map(([n]) => `<span class="tag">${n}</span>`).join("")}</div>
  </div>
  <div class="flyer-bottom">
    <div class="qr">二维码<br>占位</div>
    <div><b>扫码预约 1 对 1 学业评估</b><p>${contact.address}<br>${contact.phone}</p></div>
  </div>
</section>
<section class="flyer back">
  <h2>奥斯翰国际课程地图</h2>
  <div class="mini-grid">${courses.map(([a,b,c]) => `<div class="mini-card"><b>${a}</b><p>${b}</p><p class="gold">${c}</p></div>`).join("")}</div>
  <div class="process-line">报名流程：预约咨询 → 入学评估 → 路径建议 → 确认课程 → 办理入读</div>
  <h2>费用摘要</h2>
  <table class="fee">
    <tr><th>课程方向</th><th>学费/年</th><th>住宿餐食/年</th></tr>
    <tr><td>OSSD 中加课程</td><td>158000 元</td><td>20300 元</td></tr>
    <tr><td>AP 国际课程</td><td>189000 元</td><td>20300 元</td></tr>
    <tr><td>日韩/新加坡方向</td><td>128000 元</td><td>20300 元</td></tr>
    <tr><td>IGCSE / A-Level</td><td>128000 元</td><td>20300 元</td></tr>
  </table>
  <p style="font-size:9pt;color:#687180;line-height:1.7;margin-top:6mm;">学费、住宿、餐食及其他费用以学校最终公示和招生办确认为准。招生办公室：${contact.phone}；地址：${contact.address}</p>
</section>`, flyerCss);

write("01_易拉宝三款_视觉稿.html", rollups);
write("02_展位主背板门头桌牌_视觉稿.html", booth);
write("03_公众号招生简章_排版稿.html", article);
write("04_A4招生单页双面_视觉稿.html", flyer);

const manifest = `# 展会视觉稿可预览 HTML

本目录为 2026-06-13 展会物料的第一轮视觉母版，统一采用蓝金/紫金高端国际学校风格。

## 文件

- \`01_易拉宝三款_视觉稿.html\`：学校总览、课程地图、入学评估与升学服务三款易拉宝。
- \`02_展位主背板门头桌牌_视觉稿.html\`：展位主背板、楣板/门头、桌牌/二维码牌。
- \`03_公众号招生简章_排版稿.html\`：公众号招生简章可发布排版稿。
- \`04_A4招生单页双面_视觉稿.html\`：展会现场派发 A4 双面单页。

## 定稿前需替换/确认

- 学校 LOGO 文件。
- 预约评估二维码、公众号二维码、留资二维码。
- 展会日期是否最终确认为 2026-06-13。
- 展位主背板、门头、易拉宝的供应商实际尺寸和出血要求。
- 照片授权与是否需要替换为更高清校园实拍。
`;
write("README.md", manifest);

console.log(`Generated expo visual material HTML in ${outDir}`);
