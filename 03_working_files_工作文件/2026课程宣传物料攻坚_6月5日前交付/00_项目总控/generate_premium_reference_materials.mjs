import fs from "fs";
import path from "path";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const outDir = path.join(root, "10_高端参考优化版_招生物料");
fs.mkdirSync(outDir, { recursive: true });

const asset = name => `../05_总招生手册_初稿图文版/assets/${name}`;
const write = (name, body) => fs.writeFileSync(path.join(outDir, name), body, "utf8");

const school = {
  zh: "深圳奥斯翰外语学校国际部",
  en: "OXSTAND INTERNATIONAL SCHOOL",
  address: "深圳市罗湖区布心路 2040 号",
  tel: "0755-25805707 / 0755-25813956",
};

const pathways = [
  ["OSSD", "中加课程", "过程评价 / 安省文凭 / 多国申请"],
  ["AP", "国际课程", "College Board 授权 / 学科挑战 / 综合申请"],
  ["KUPP / JUPP", "日韩小语种", "韩语日语 / 文化适应 / 本科衔接"],
  ["IGCSE / A-Level", "英式路径", "IGCSE 打基础 / A-Level 选科冲刺"],
  ["IFD", "新加坡方向", "国内预科建设 / 新加坡本科衔接"],
];

const html = (title, css, body) => `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<style>
:root{
  --ink:#151922;
  --blue:#102B6F;
  --night:#0B1331;
  --purple:#2D214F;
  --gold:#B7954D;
  --paper:#F7F3EA;
  --stone:#D9D3C8;
  --mist:#EEF1F5;
  --muted:#6C7280;
}
*{box-sizing:border-box}
body{margin:0;background:#cfd3da;color:var(--ink);font-family:"Microsoft YaHei","Noto Sans SC",Arial,sans-serif}
h1,h2,h3,p{margin-top:0}
.serif{font-family:"Noto Serif SC","Source Han Serif SC","SimSun",serif}
.smallcap{font-size:9px;letter-spacing:.16em;text-transform:uppercase;font-weight:800}
.gold{color:var(--gold)}
.rule{height:1px;background:var(--gold);width:34mm}
.qr{background:#fff;border:1.5mm solid var(--gold);display:grid;place-items:center;text-align:center;color:var(--purple);font-weight:800}
${css}
</style>
</head>
<body>${body}</body>
</html>`;

const brochureCss = `
@page{size:A4 portrait;margin:0}
.page{width:210mm;height:297mm;margin:18px auto;background:var(--paper);position:relative;overflow:hidden;box-shadow:0 20px 45px rgba(9,17,38,.18);page-break-after:always}
.cover img,.photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cover:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,19,49,.96) 0%,rgba(11,19,49,.82) 38%,rgba(11,19,49,.18) 100%)}
.cover-copy{position:absolute;z-index:2;left:20mm;top:36mm;width:112mm;color:white}
.cover-copy .smallcap{color:rgba(255,255,255,.72)}
.cover-copy h1{font-size:37pt;line-height:1.12;letter-spacing:0;margin:22mm 0 7mm}
.cover-copy .sub{font-size:13pt;line-height:1.85;color:rgba(255,255,255,.84);width:92mm}
.cover-copy .rule{margin:12mm 0 7mm}
.cover-index{position:absolute;z-index:2;left:20mm;bottom:20mm;color:white;display:flex;gap:7mm;align-items:center}
.cover-index span{font-size:8.5pt;color:rgba(255,255,255,.7)}
.folio{position:absolute;left:16mm;bottom:12mm;color:#8d918f;font-size:7.5pt;letter-spacing:.14em}
.side-title{position:absolute;left:16mm;top:18mm;writing-mode:vertical-rl;font-size:7pt;letter-spacing:.18em;color:var(--gold);font-weight:800}
.content{position:absolute;left:30mm;right:18mm;top:24mm;bottom:18mm}
.spread-title{display:grid;grid-template-columns:32mm 1fr;gap:12mm;align-items:start;margin-bottom:14mm}
.spread-title b{font-size:36pt;line-height:.9;color:var(--gold);font-family:Georgia,serif}
.spread-title h2{font-size:26pt;line-height:1.14;margin:0;color:var(--night);letter-spacing:0}
.intro-grid{display:grid;grid-template-columns:1fr 57mm;gap:12mm;align-items:start}
.intro-grid p{font-size:10.4pt;line-height:1.95;color:#303746}
.pull{margin-top:10mm;padding:9mm 0;border-top:1px solid var(--stone);border-bottom:1px solid var(--stone);font-size:17pt;line-height:1.55;color:var(--blue)}
.stat-strip{position:absolute;left:30mm;right:18mm;bottom:23mm;display:grid;grid-template-columns:repeat(3,1fr);gap:8mm}
.stat-strip div{border-top:2px solid var(--gold);padding-top:4mm}
.stat-strip b{display:block;font-size:25pt;color:var(--blue);line-height:1}
.stat-strip span{display:block;font-size:8.5pt;color:var(--muted);margin-top:2mm}
.bleed-photo{position:absolute;right:0;top:0;width:84mm;height:100%}
.bleed-photo img{width:100%;height:100%;object-fit:cover}
.bleed-photo:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,19,49,.24),transparent)}
.path-page .content{right:96mm}
.path-list{position:absolute;left:30mm;right:18mm;bottom:22mm;display:grid;grid-template-columns:repeat(5,1fr);gap:2mm}
.path-list article{background:white;border-top:1.2mm solid var(--gold);padding:4mm;min-height:45mm}
.path-list h3{font-size:13pt;color:var(--blue);margin-bottom:2mm}
.path-list b{font-size:8pt;color:var(--gold);letter-spacing:.08em}
.path-list p{font-size:7.8pt;line-height:1.55;color:var(--muted)}
.service-page{background:#fff}
.service-page:before{content:"";position:absolute;left:0;top:0;bottom:0;width:62mm;background:var(--night)}
.service-page .content{left:22mm;color:white}
.service-page .spread-title{grid-template-columns:24mm 62mm;color:white}
.service-page .spread-title h2{color:white}
.service-body{position:absolute;left:84mm;right:18mm;top:32mm;bottom:22mm;color:var(--ink)}
.steps{display:grid;gap:6mm}
.steps div{display:grid;grid-template-columns:16mm 1fr;gap:5mm;border-bottom:1px solid #e6e2d8;padding-bottom:5mm}
.steps i{font-style:normal;font-family:Georgia,serif;color:var(--gold);font-size:24pt;line-height:1}
.steps b{display:block;font-size:12pt;color:var(--blue);margin-bottom:1.5mm}
.steps p{font-size:9.2pt;line-height:1.7;color:var(--muted);margin:0}
.image-led{background:#0b1331;color:white}
.image-led img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.62}
.image-led:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,19,49,.94),rgba(11,19,49,.14) 60%)}
.image-led .caption{position:absolute;z-index:2;left:20mm;right:20mm;bottom:20mm}
.image-led h2{font-size:30pt;line-height:1.16;color:white;letter-spacing:0}
.image-led p{font-size:12pt;line-height:1.8;width:118mm;color:rgba(255,255,255,.82)}
.back{background:var(--night);color:white}
.back:before{content:"";position:absolute;inset:18mm;border:1px solid rgba(183,149,77,.55)}
.back-copy{position:absolute;left:28mm;right:28mm;top:44mm}
.back h2{font-size:31pt;line-height:1.2;color:white;letter-spacing:0}
.contact{position:absolute;left:28mm;bottom:32mm;display:grid;grid-template-columns:36mm 1fr;gap:10mm;align-items:center}
.contact .qr{width:36mm;height:36mm}
.contact p{font-size:10pt;line-height:1.8;color:rgba(255,255,255,.78)}
@media print{body{background:white}.page{margin:0;box-shadow:none}}
`;

const brochure = html("高端参考优化版 A4 招生宣传册样张", brochureCss, `
<section class="page cover">
  <img src="${asset("cover.jpg")}" alt="">
  <div class="cover-copy">
    <p class="smallcap">${school.en}</p>
    <h1 class="serif">国际部<br>招生手册</h1>
    <p class="sub">精品国际课程，多路径升学规划。从学生基础出发，找到更适合的海外升学路径。</p>
    <div class="rule"></div>
    <p class="smallcap">OSSD / AP / KUPP / JUPP / IGCSE / A-Level / IFD</p>
  </div>
  <div class="cover-index"><span>2026 ADMISSIONS</span><span>SHENZHEN</span></div>
</section>

<section class="page">
  <div class="side-title">SCHOOL PROFILE</div>
  <div class="content">
    <div class="spread-title"><b>01</b><h2 class="serif">深圳本土办学二十余年</h2></div>
    <div class="intro-grid">
      <div>
        <p>深圳奥斯翰外语学校于 2004 年经深圳市教育局批准创办，位于深圳市罗湖区布心路 2040 号。学校以“与世界同步，培育跨时代精英人才”为育人目标，植根中华传统文化，融贯东西方教育思想，依托外语特色，持续建设多元国际课程与海外升学服务体系。</p>
        <div class="pull serif">不是把所有学生推向同一条路，而是帮助不同基础、不同目标的学生找到更适合的路径。</div>
      </div>
      <img style="width:57mm;height:118mm;object-fit:cover" src="${asset("campus1.jpg")}" alt="">
    </div>
  </div>
  <div class="stat-strip">
    <div><b>2004</b><span>创校时间</span></div>
    <div><b>20+</b><span>本土办学积累</span></div>
    <div><b>5</b><span>国际课程方向</span></div>
  </div>
  <p class="folio">${school.en}</p>
</section>

<section class="page path-page">
  <div class="bleed-photo"><img src="${asset("class1.jpg")}" alt=""></div>
  <div class="side-title">CURRICULUM MAP</div>
  <div class="content">
    <div class="spread-title"><b>02</b><h2 class="serif">先看目标国家，再选择课程路径</h2></div>
    <p style="font-size:11pt;line-height:1.95;color:#303746">奥斯翰国际部的课程选择逻辑，是从目标国家、语言基础、学科优势和申请方式四个维度，帮助学生匹配更适合的高中阶段学习节奏。</p>
  </div>
  <div class="path-list">
    ${pathways.map(([code, name, desc]) => `<article><b>${code}</b><h3>${name}</h3><p>${desc}</p></article>`).join("")}
  </div>
  <p class="folio">${school.en}</p>
</section>

<section class="page service-page">
  <div class="content">
    <div class="spread-title"><b>03</b><h2 class="serif">升学服务不是附加项，而是三年规划的一部分</h2></div>
  </div>
  <div class="service-body">
    <div class="steps">
      ${[
        ["入学评估", "了解英语/小语种基础、数学与学科能力、学习习惯和目标国家。"],
        ["课程匹配", "根据评估结果匹配 OSSD、AP、日韩、IGCSE/A-Level 或新加坡方向。"],
        ["目标院校", "结合学生成绩、兴趣、专业方向与家庭规划，建立阶段性目标。"],
        ["语言考试", "跟进托福、雅思、TOPIK、JLPT 等语言考试节奏。"],
        ["材料文书", "协助整理申请材料、活动经历、文书方向和推荐准备。"],
        ["面试签证", "面试辅导、签证材料与行前支持系统推进。"],
      ].map((x, i) => `<div><i>${String(i + 1).padStart(2, "0")}</i><span><b>${x[0]}</b><p>${x[1]}</p></span></div>`).join("")}
    </div>
  </div>
</section>

<section class="page image-led">
  <img src="${asset("graduation.jpg")}" alt="">
  <div class="caption">
    <p class="smallcap gold">FACULTY & GUIDANCE</p>
    <h2 class="serif">让课程、教师、管理和升学支持<br>形成同一个闭环</h2>
    <p>优秀课程最终要落到教师、管理和升学服务上。奥斯翰国际部围绕课程学习、学生成长和大学申请，提供持续跟踪支持。</p>
  </div>
</section>

<section class="page back">
  <div class="back-copy">
    <p class="smallcap gold">${school.en}</p>
    <h2 class="serif">预约访校，获取个性化课程路径建议</h2>
    <div class="rule" style="margin:12mm 0"></div>
    <p style="font-size:12pt;line-height:1.9;color:rgba(255,255,255,.78);width:118mm">如果你还不确定孩子适合哪条国际课程路径，建议先完成一次 1 对 1 学业评估。招生老师将根据学生当前语言基础、学科能力、目标国家和家庭规划，给出课程路径建议。</p>
  </div>
  <div class="contact">
    <div class="qr">二维码<br>占位</div>
    <p>${school.zh}<br>${school.address}<br>${school.tel}</p>
  </div>
</section>
`);

const expoCss = `
.canvas{width:1280px;margin:24px auto 50px;display:grid;gap:26px}
.note{background:white;border-left:5px solid var(--gold);padding:14px 18px;color:var(--muted);line-height:1.7}
.wall{height:720px;background:var(--night);position:relative;overflow:hidden;color:white;box-shadow:0 20px 50px rgba(9,17,38,.22)}
.wall img{position:absolute;right:0;top:0;width:58%;height:100%;object-fit:cover;filter:saturate(.82)}
.wall:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(11,19,49,1) 0%,rgba(11,19,49,.96) 37%,rgba(11,19,49,.28) 78%,rgba(11,19,49,.1))}
.wall-copy{position:absolute;z-index:2;left:70px;top:82px;width:610px}
.wall-copy h1{font-size:66px;line-height:1.05;margin:74px 0 28px;letter-spacing:0}
.wall-copy p{font-size:24px;line-height:1.58;color:rgba(255,255,255,.82)}
.line-tags{position:absolute;z-index:3;left:70px;bottom:78px;display:flex;gap:18px;align-items:center}
.line-tags span{font-size:17px;color:var(--gold);border-top:2px solid var(--gold);padding-top:12px;min-width:88px}
.wall-qr{position:absolute;z-index:4;right:70px;bottom:58px;display:grid;grid-template-columns:118px 210px;gap:18px;align-items:center}
.wall-qr .qr{width:118px;height:118px}
.wall-qr b{font-size:25px}
.wall-qr p{font-size:16px;line-height:1.7;color:rgba(255,255,255,.75)}
.rollups{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.roll{height:940px;background:var(--paper);position:relative;overflow:hidden;box-shadow:0 18px 44px rgba(9,17,38,.18)}
.roll img{position:absolute;left:0;top:0;width:100%;height:430px;object-fit:cover}
.roll:before{content:"";position:absolute;left:0;top:0;width:100%;height:430px;background:linear-gradient(0deg,rgba(11,19,49,.9),rgba(11,19,49,.12));z-index:1}
.roll-head{position:absolute;z-index:2;left:34px;right:34px;top:34px;color:white;display:flex;justify-content:space-between}
.roll-title{position:absolute;z-index:2;left:34px;right:34px;top:240px;color:white}
.roll-title h2{font-size:41px;line-height:1.08;margin-bottom:14px;letter-spacing:0}
.roll-title p{font-size:15px;line-height:1.65;color:rgba(255,255,255,.82)}
.roll-body{position:absolute;left:34px;right:34px;top:470px;bottom:142px}
.editorial-list{display:grid;gap:18px}
.editorial-list div{border-top:1px solid var(--stone);padding-top:16px}
.editorial-list b{display:block;font-size:25px;color:var(--blue);margin-bottom:6px}
.editorial-list p{font-size:14px;line-height:1.7;color:var(--muted);margin:0}
.route-row{display:grid;grid-template-columns:64px 1fr;gap:16px;border-bottom:1px solid var(--stone);padding:14px 0}
.route-row i{font-style:normal;color:var(--gold);font-family:Georgia,serif;font-size:28px}
.route-row b{display:block;color:var(--blue);font-size:19px;margin-bottom:5px}
.route-row p{margin:0;color:var(--muted);font-size:13px;line-height:1.55}
.roll-foot{position:absolute;left:0;right:0;bottom:0;height:118px;background:var(--night);color:white;display:grid;grid-template-columns:86px 1fr;gap:18px;align-items:center;padding:18px 28px 18px 34px}
.roll-foot .qr{width:74px;height:74px;font-size:12px}
.roll-foot b{font-size:18px}
.roll-foot p{font-size:12px;line-height:1.55;color:rgba(255,255,255,.7);margin:6px 0 0}
`;

const expo = html("高端参考优化版 展会物料样张", expoCss, `
<main class="canvas">
  <div class="note">这一版故意减少信息密度，学习海外 viewbook 的“远看主张、近看细节”逻辑：展位远距离只讲学校、主张和路径；易拉宝用于拆解细节。</div>
  <section class="wall">
    <img src="${asset("group.jpg")}" alt="">
    <div class="wall-copy">
      <p class="smallcap">${school.en}</p>
      <h1 class="serif">从学生基础出发<br><span class="gold">找到更适合</span><br>的国际升学路径</h1>
      <p>OSSD、AP、日韩小语种、IGCSE/A-Level、新加坡 IFD，多路径课程体系，一对一评估匹配。</p>
    </div>
    <div class="line-tags">${pathways.map(([a]) => `<span>${a}</span>`).join("")}</div>
    <div class="wall-qr"><div class="qr">二维码<br>占位</div><div><b>预约 1 对 1 学业评估</b><p>${school.address}<br>${school.tel}</p></div></div>
  </section>
  <section class="rollups">
    <article class="roll">
      <img src="${asset("campus2.jpg")}" alt="">
      <div class="roll-head"><span class="smallcap">${school.en}</span><span class="gold">01</span></div>
      <div class="roll-title"><h2 class="serif">深圳本土办学<br>二十余年</h2><p>老牌办学积累，外语特色底色，多路径国际升学规划。</p></div>
      <div class="roll-body"><div class="editorial-list">
        <div><b>2004 年创校</b><p>形成稳定教学体系与升学服务基础。</p></div>
        <div><b>外语特色</b><p>英语、日语、韩语等语言资源，服务不同国家出口。</p></div>
        <div><b>精细化支持</b><p>更短反馈链条、更近师生关系，持续跟踪学习状态。</p></div>
      </div></div>
      <div class="roll-foot"><div class="qr">二维码</div><div><b>扫码预约学业评估</b><p>${school.tel}</p></div></div>
    </article>
    <article class="roll">
      <img src="${asset("class1.jpg")}" alt="">
      <div class="roll-head"><span class="smallcap">CURRICULUM MAP</span><span class="gold">02</span></div>
      <div class="roll-title"><h2 class="serif">五条路径<br>对应不同目标</h2><p>先看目标国家，再选择课程路径；先看学生基础，再设计学习节奏。</p></div>
      <div class="roll-body">${pathways.map(([code, name, desc]) => `<div class="route-row"><i>${code}</i><span><b>${name}</b><p>${desc}</p></span></div>`).join("")}</div>
      <div class="roll-foot"><div class="qr">二维码</div><div><b>领取课程路径建议</b><p>${school.tel}</p></div></div>
    </article>
    <article class="roll">
      <img src="${asset("graduation.jpg")}" alt="">
      <div class="roll-head"><span class="smallcap">GUIDANCE</span><span class="gold">03</span></div>
      <div class="roll-title"><h2 class="serif">入学不是<br>简单报名</h2><p>先判断孩子适合哪一条路线，再安排语言、学科、考试和升学节点。</p></div>
      <div class="roll-body"><div class="editorial-list">
        <div><b>入学评估</b><p>语言基础、学科能力、学习习惯和目标国家。</p></div>
        <div><b>路径匹配</b><p>匹配课程方向，形成阶段成长规划。</p></div>
        <div><b>持续跟踪</b><p>学习进度、语言考试、家校沟通、申请节点。</p></div>
      </div></div>
      <div class="roll-foot"><div class="qr">二维码</div><div><b>预约访校咨询</b><p>${school.tel}</p></div></div>
    </article>
  </section>
</main>`);

const wechatCss = `
.article{width:760px;margin:28px auto 60px;background:#fff;box-shadow:0 18px 50px rgba(9,17,38,.18)}
.cover{height:520px;position:relative;overflow:hidden;background:var(--night);color:white}
.cover img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.58}
.cover:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(11,19,49,.94),rgba(11,19,49,.18))}
.cover-copy{position:absolute;z-index:2;left:48px;right:48px;bottom:46px}
.cover-copy h1{font-size:50px;line-height:1.1;margin:20px 0 14px;letter-spacing:0}
.cover-copy p{font-size:18px;line-height:1.7;color:rgba(255,255,255,.82)}
.body{padding:48px 56px}
.lead{font-size:22px;line-height:1.75;color:var(--blue);border-top:1px solid var(--gold);border-bottom:1px solid var(--gold);padding:24px 0;margin-bottom:38px}
.body h2{font-size:28px;color:var(--night);margin:38px 0 16px;letter-spacing:0}
.body p,.body li{font-size:16px;line-height:1.95;color:#303746}
.split{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:22px 0}
.split div{background:var(--paper);padding:18px;border-top:3px solid var(--gold)}
.split b{display:block;color:var(--blue);font-size:18px;margin-bottom:8px}
.route{border-bottom:1px solid #e5e0d5;padding:16px 0;display:grid;grid-template-columns:86px 1fr;gap:14px}
.route i{font-style:normal;font-family:Georgia,serif;font-size:24px;color:var(--gold)}
.route b{font-size:18px;color:var(--blue)}
.route p{margin:6px 0 0;font-size:14px;color:var(--muted);line-height:1.65}
.cta{margin:34px 0 0;background:var(--night);color:white;padding:30px;text-align:center}
.cta b{font-size:24px;color:white}
.cta p{color:rgba(255,255,255,.78)}
`;

const wechat = html("高端参考优化版 公众号招生简章样张", wechatCss, `
<main class="article">
  <section class="cover">
    <img src="${asset("cover.jpg")}" alt="">
    <div class="cover-copy">
      <p class="smallcap">${school.en}</p>
      <h1 class="serif">精品国际课程<br><span class="gold">多路径升学规划</span></h1>
      <p>${school.zh} 2026 招生简章</p>
    </div>
  </section>
  <section class="body">
    <div class="lead serif">真正重要的不是“学校有多少课程”，而是孩子适合哪一个国家方向、现在能进入什么课程，以及三年后如何形成可申请大学的成绩和材料。</div>
    <h2 class="serif">关于奥斯翰</h2>
    <p>深圳奥斯翰外语学校创办于 2004 年，是深圳本土办学二十余年的民办学校。学校以“与世界同步，培育跨时代精英人才”为育人目标，依托外语特色，持续建设多元国际课程与海外升学服务体系。</p>
    <div class="split">
      <div><b>20 余年办学积累</b><p>熟悉深圳家庭对国际升学的真实需求，形成稳定教学体系与升学服务基础。</p></div>
      <div><b>外语特色底色</b><p>英语、日语、韩语等语言资源，为不同国家出口提供语言基础。</p></div>
      <div><b>小规模精细化支持</b><p>更短反馈链条、更近师生关系，便于持续跟踪学习状态。</p></div>
      <div><b>多路径升学规划</b><p>按目标国家、语言基础和学科优势匹配课程。</p></div>
    </div>
    <h2 class="serif">课程体系总览</h2>
    ${pathways.map(([code, name, desc]) => `<div class="route"><i>${code}</i><span><b>${name}</b><p>${desc}</p></span></div>`).join("")}
    <h2 class="serif">升学服务闭环</h2>
    <p>入学评估 → 课程匹配 → 目标院校 → 语言考试 → 材料文书 → 面试签证。课程、教师、管理和升学支持需要形成同一个闭环，才能真正承托学生三年的成长。</p>
    <div class="cta"><b>预约 1 对 1 学业评估</b><p>${school.address}<br>${school.tel}</p></div>
  </section>
</main>`);

const notes = `# 高端参考优化版说明

这一版不是最终定稿，而是为后续设计定稿前提供一个更接近海外 independent school / boarding school viewbook 的方向样张。

## 参考提炼

- 少堆信息，多做摄影主导和大标题。
- 用 A4 纸张感、页码、竖排栏目、细线、留白建立“招生册”而不是“PPT”的感觉。
- 展会物料远距离只保留学校识别、核心主张、课程路径和预约入口。
- 易拉宝承担二级讲解，避免把宣传册全文搬上展板。
- 颜色从“蓝金/紫金渐变”收敛为深夜蓝、纸白、克制金色，少用大面积亮色。

## 参考来源

- Ransom Everglades School admissions viewbook / catalog, Communication Arts 案例页：强调摄影、章节叙事、装帧与印刷工艺，而不是模板化信息卡片。
- Choate Rosemary Hall Admission 页面：强调个人旅程、强主张、校园体验和清晰行动入口。
- Choate Rosemary Hall admissions package, Kelsh Wilson Design 案例页：招生包包含 viewbook 与 search piece，并使用定制插画和摄影。
- St. George's School BC Admissions 页面：招生入口清晰，围绕参观、申请、家庭支持展开。
- UWC 招生/招聘 brochure PDF：参考国际学校体系中照片、留白、信息层级和 PDF 传播方式。

## 输出

- \`01_A4竖版宣传册_高端参考样张.html\`
- \`01_A4竖版宣传册_高端参考样张.pdf\`
- \`02_展会主视觉与易拉宝_高端参考样张.html\`
- \`03_公众号招生简章_高端参考样张.html\`
- \`preview_premium_brochure.png\`
- \`preview_premium_expo.png\`

## 待替换

- 学校 LOGO。
- 真实二维码。
- 更高质量校园摄影。
- 你后续定稿的设计示意图。

## 当前需要继续修的点

- 展会主背板仍需按实际展位尺寸微调标题和二维码位置。
- 现有校园照片质量和构图有限，真正定稿前应替换为更高分辨率、更有国际学校气质的摄影。
- 本版只作为视觉方向样张，不建议直接送印。
`;

write("01_A4竖版宣传册_高端参考样张.html", brochure);
write("02_展会主视觉与易拉宝_高端参考样张.html", expo);
write("03_公众号招生简章_高端参考样张.html", wechat);
write("README.md", notes);

console.log(`Generated premium reference materials in ${outDir}`);
