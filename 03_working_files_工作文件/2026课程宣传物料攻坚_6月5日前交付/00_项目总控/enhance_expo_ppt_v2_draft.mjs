import fs from "fs";
import path from "path";
import JSZip from "jszip";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const pptDir = path.join(root, "05_总招生手册_初稿图文版/PPT_横版招生手册SAIS风格V2");
const src = path.join(pptDir, "奥斯翰国际部招生宣传册_横版PPT_V2初稿.pptx");
const out = path.join(pptDir, "奥斯翰国际部招生宣传册_横版PPT_V2初稿_展会宣讲优化版.pptx");
const note = path.join(pptDir, "奥斯翰国际部招生宣传册_横版PPT_V2初稿_展会宣讲优化版_说明.md");

const EMU = 914400;
const W = 16256000 / EMU;
const H = 10;
const C = {
  navy: "18265A",
  blue: "2459A6",
  purple: "38215D",
  violet: "5A3D8E",
  gold: "C7A34A",
  paleGold: "F4EBD4",
  light: "F6F7FB",
  ink: "252B33",
  gray: "687180",
  line: "D8DDE8",
  white: "FFFFFF",
  cyan: "2D9CDB",
};
const font = "Microsoft YaHei";
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
const emu = v => Math.round(v * EMU);

function fill(color, alpha = 100000) {
  if (!color) return "<a:noFill/>";
  const a = alpha < 100000 ? `<a:alpha val="${alpha}"/>` : "";
  return `<a:solidFill><a:srgbClr val="${color}">${a}</a:srgbClr></a:solidFill>`;
}
function ln(color = null, w = 1) {
  if (!color) return "<a:ln/>";
  return `<a:ln w="${Math.round(w * 12700)}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill></a:ln>`;
}

class S {
  constructor(bg = C.white) {
    this.bg = bg;
    this.parts = [];
    this.id = 2;
  }
  shape(type, x, y, w, h, opt = {}) {
    const adj = type === "roundRect" ? `<a:avLst><a:gd name="adj" fmla="val ${opt.adj ?? 7000}"/></a:avLst>` : "<a:avLst/>";
    this.parts.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Shape"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="${type}">${adj}</a:prstGeom>${fill(opt.fill, opt.alpha ?? 100000)}${ln(opt.line, opt.lw ?? 1)}</p:spPr></p:sp>`);
  }
  text(txt, x, y, w, h, opt = {}) {
    const align = opt.align === "center" ? "ctr" : opt.align === "right" ? "r" : "l";
    const sz = Math.round((opt.size ?? 14) * 100);
    const b = opt.bold ? ' b="1"' : "";
    const color = opt.color ?? C.ink;
    const alpha = opt.alpha ? `<a:alpha val="${opt.alpha}"/>` : "";
    const paras = String(txt).split("\n").map(p => `<a:p><a:pPr algn="${align}"><a:lnSpc><a:spcPct val="${Math.round((opt.lh ?? 1.25) * 100000)}"/></a:lnSpc></a:pPr><a:r><a:rPr lang="zh-CN" sz="${sz}"${b}><a:solidFill><a:srgbClr val="${color}">${alpha}</a:srgbClr></a:solidFill><a:latin typeface="${font}"/><a:ea typeface="${font}"/><a:cs typeface="${font}"/></a:rPr><a:t>${esc(p)}</a:t></a:r><a:endParaRPr lang="zh-CN" sz="${sz}"/></a:p>`).join("");
    this.parts.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Text"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" anchor="${opt.valign ?? "t"}"/><a:lstStyle/>${paras}</p:txBody></p:sp>`);
  }
  image(rId, x, y, w, h, opt = {}) {
    const alpha = opt.alpha ? `<a:alphaModFix amt="${opt.alpha}"/>` : "";
    this.parts.push(`<p:pic><p:nvPicPr><p:cNvPr id="${this.id++}" name="Image"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${rId}">${alpha}</a:blip><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="${opt.round ? "roundRect" : "rect"}"><a:avLst/></a:prstGeom>${ln(opt.line, opt.lw ?? 0.8)}</p:spPr></p:pic>`);
  }
  line(x1, y1, x2, y2, color = C.gold, w = 2) {
    const x = Math.min(x1, x2), y = Math.min(y1, y2);
    this.parts.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Line"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(Math.abs(x2 - x1))}" cy="${emu(Math.abs(y2 - y1))}"/></a:xfrm><a:prstGeom prst="straightConnector1"><a:avLst/></a:prstGeom><a:noFill/>${ln(color, w)}</p:spPr></p:sp>`);
  }
}

function bg(s, section, page) {
  s.shape("rect", 0, 0, W, H, { fill: C.white });
  s.shape("rect", 0, 0, 0.34, H, { fill: C.purple });
  s.shape("rect", 0.34, 0, 0.08, H, { fill: C.gold });
  s.shape("ellipse", 13.8, -2.6, 7.2, 7.2, { fill: C.light });
  s.shape("ellipse", -2.2, 7.2, 4.8, 4.8, { fill: C.paleGold, alpha: 65000 });
  s.text("OXSTAND INTERNATIONAL SCHOOL", 0.72, 9.42, 6, 0.22, { size: 10.5, color: C.gray });
  s.text(String(page).padStart(2, "0"), 16.4, 9.36, 0.7, 0.26, { size: 13, color: C.gold, bold: true, align: "right" });
  s.text(section.toUpperCase(), 0.72, 0.48, 5.2, 0.22, { size: 11, color: C.gold, bold: true });
}
function title(s, en, cn, sub) {
  s.text(en.toUpperCase(), 0.72, 0.78, 5.4, 0.24, { size: 11, color: C.gold, bold: true });
  s.text(cn, 0.72, 1.05, 7.4, 0.56, { size: 29, color: C.navy, bold: true });
  if (sub) s.text(sub, 0.74, 1.68, 9.2, 0.36, { size: 12.5, color: C.gray });
}
function card(s, x, y, w, h, t, b, accent = C.gold) {
  s.shape("roundRect", x, y, w, h, { fill: C.light, line: C.line, adj: 6000 });
  s.shape("rect", x, y, 0.08, h, { fill: accent });
  s.text(t, x + 0.25, y + 0.22, w - 0.45, 0.28, { size: 15, color: C.navy, bold: true });
  s.text(b, x + 0.25, y + 0.66, w - 0.45, h - 0.8, { size: 10.8, color: C.gray, lh: 1.35 });
}
function chip(s, x, y, txt, color = C.purple) {
  s.shape("roundRect", x, y, 2.05, 0.42, { fill: color, adj: 9000 });
  s.text(txt, x + 0.1, y + 0.12, 1.85, 0.18, { size: 10.5, color: C.white, bold: true, align: "center" });
}
function bullet(s, x, y, items, color = C.gold) {
  items.forEach((it, i) => {
    s.shape("ellipse", x, y + i * 0.42 + 0.06, 0.12, 0.12, { fill: color });
    s.text(it, x + 0.22, y + i * 0.42, 5.7, 0.25, { size: 11.2, color: C.ink });
  });
}
function xml(s) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr>${fill(s.bg)}</p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${s.parts.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}
function rels(layoutId, imageTargets = {}) {
  const items = Object.entries(imageTargets).map(([id, target]) => `<Relationship Id="${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${target}"/>`).join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="${layoutId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>${items}</Relationships>`;
}

function slide31() {
  const s = new S(); bg(s, "Faculty & Guidance", 31);
  s.shape("rect", 0, 0, W, H, { fill: C.navy });
  s.image("rId1", 9.35, 1.0, 6.7, 7.65, { round: true, line: C.gold, lw: 1.2 });
  s.shape("rect", 9.35, 1.0, 6.7, 7.65, { fill: C.navy, alpha: 18000 });
  s.image("rId2", 12.85, 6.55, 3.0, 1.72, { round: true, line: C.white, lw: 0.8 });
  s.text("CORE FACULTY", 0.85, 1.0, 4.2, 0.3, { size: 14, color: C.gold, bold: true });
  s.text("刘总裁", 0.85, 1.55, 3.5, 0.72, { size: 44, color: C.white, bold: true });
  s.text("集团总裁 | Dr. Arthur Liu", 0.9, 2.42, 5.8, 0.34, { size: 17, color: C.gold, bold: true });
  s.text("中科院心理学博士\n北大金融学硕士", 0.9, 3.05, 4.5, 0.78, { size: 24, color: C.white, bold: true, lh: 1.2 });
  s.text("20余年国际学校管理经验，精通 AP、A-Level、IBDP、VCE、OSSD 等项目与国内课程的融合。", 0.92, 4.15, 6.8, 0.86, { size: 16, color: C.white, alpha: 88000, lh: 1.35 });
  chip(s, 0.92, 5.55, "国际课程融合", C.violet);
  chip(s, 3.2, 5.55, "学校战略管理", C.blue);
  chip(s, 5.48, 5.55, "学生成长心理", C.gold);
  s.shape("roundRect", 0.92, 6.55, 7.55, 1.55, { fill: C.white, alpha: 9000, line: C.gold, adj: 5000 });
  s.text("从课程体系、学校管理到学生心理成长，构建国际部的顶层教育设计。", 1.25, 7.0, 6.8, 0.35, { size: 18, color: C.white, bold: true, align: "center" });
  return s;
}
function slide32() {
  const s = new S(); bg(s, "Faculty & Guidance", 32);
  title(s, "Leadership Team", "各位校长与项目负责人", "用稳定的课程管理、升学资源协调和学生发展支持，托举每一条国际升学路径。");
  s.image("rId1", 0.9, 2.35, 4.2, 5.55, { round: true, line: C.gold, lw: 1.1 });
  s.shape("roundRect", 5.45, 2.35, 5.25, 2.1, { fill: C.purple, adj: 6000 });
  s.text("金伶納", 5.82, 2.72, 2.2, 0.4, { size: 24, color: C.white, bold: true });
  s.text("国际部校长", 7.78, 2.83, 2.2, 0.26, { size: 14, color: C.gold, bold: true, align: "right" });
  s.text("深耕国际教育领域十五年，长期专注于国际高中课程建设、海外升学规划、中外合作办学及学生综合发展指导。", 5.82, 3.35, 4.45, 0.62, { size: 12.5, color: C.white, alpha: 88000, lh: 1.32 });
  bullet(s, 5.82, 4.8, ["韩国京畿大学中国区代表", "HSK国际汉语教师 & 阅卷组专家", "青少年心理健康教育（B证）辅导教师", "国际课程体系建设与海外升学规划专家"], C.gold);
  s.image("rId11", 11.2, 2.4, 2.25, 1.7, { round: true, line: C.line });
  s.image("rId13", 14.0, 2.4, 2.25, 1.7, { round: true, line: C.line });
  card(s, 11.2, 4.45, 2.35, 1.45, "方校", "奥斯翰国际学校总校长", C.purple);
  card(s, 13.9, 4.45, 2.45, 1.45, "JEFFREY FARBER", "OSSD课程加方校长", C.blue);
  card(s, 11.2, 6.45, 5.15, 1.45, "CHRIS CHANG", "韩国课程韩方校长，协同推进韩国方向课程、语言学习与高校资源衔接。", C.gold);
  return s;
}
function slide33() {
  const s = new S(); bg(s, "Faculty & Guidance", 33);
  title(s, "Faculty Matrix", "全体师资与升学支持团队", "多学科教师与升学顾问协同，覆盖语言、学科、申请与学生成长支持。");
  const ids = ["rId1", "rId2", "rId3", "rId4", "rId5", "rId6", "rId7"];
  const labels = ["Aleezer / IG & A-Level", "OSSD加方课程", "AP学科课程", "韩国语课程", "日本语课程", "升学指导", "班主任/导师"];
  ids.forEach((id, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = 0.95 + col * 4.05, y = 2.45 + row * 2.9;
    s.shape("roundRect", x, y, 3.55, 2.38, { fill: C.white, line: C.line, adj: 6000 });
    s.image(id, x + 0.16, y + 0.16, 3.23, 1.48, { round: true });
    s.text(labels[i], x + 0.22, y + 1.83, 3.1, 0.26, { size: 12.2, color: C.navy, bold: true, align: "center" });
    s.shape("rect", x + 0.45, y + 2.18, 2.65, 0.04, { fill: i % 2 ? C.gold : C.blue });
  });
  s.shape("roundRect", 1.15, 8.25, 15.15, 0.55, { fill: C.paleGold, adj: 7000 });
  s.text("语言教师、学科教师、升学顾问与班主任共同形成学生支持网络，让课程学习、心理成长、家校沟通和大学申请同步推进。", 1.45, 8.42, 14.55, 0.2, { size: 12.5, color: C.navy, bold: true, align: "center" });
  return s;
}
function slide34() {
  const s = new S(); bg(s, "Student Support", 34);
  title(s, "Student Support System", "学生成长与升学服务体系", "我们提供的不是一次性咨询，而是从入学到申请的长期陪伴。");
  [["学生导师课","帮助新生适应课堂、宿舍、人际关系与国际课程节奏。"],["模拟联合国","在辩论、表达、协作中建立全球视野和领导力。"],["个性化辅导","第7节后自选辅导、小组课堂、按需走班，补强真实所需能力。"],["住宿管理","晚自习、手机管理、宿舍巡访与家校反馈，照顾学习也照顾生活。"]].forEach((it,i)=>card(s,0.95+(i%2)*4.8,2.65+Math.floor(i/2)*2.05,4.15,1.45,it[0],it[1],[C.purple,C.blue,C.gold,C.violet][i]));
  s.shape("roundRect", 10.75, 2.65, 5.25, 5.55, { fill: C.navy, adj: 7000 });
  s.text("升学指导中心", 11.25, 3.05, 4.3, 0.45, { size: 26, color: C.white, bold: true, align: "center" });
  s.text("从选课程到拿录取，帮助学生把目标国家、专业方向、申请材料和时间节点统一管理。", 11.35, 3.82, 4.1, 0.72, { size: 13, color: C.white, alpha: 86000, lh: 1.35, align: "center" });
  ["入学评估","课程匹配","目标院校","语言考试","材料文书","面试签证"].forEach((t,i)=>{const x=11.05+(i%2)*2.45,y=5.05+Math.floor(i/2)*0.83; s.shape("roundRect",x,y,2.05,0.48,{fill:i%2?C.blue:C.gold,adj:8000}); s.text(`${String(i+1).padStart(2,"0")} ${t}`,x+0.08,y+0.15,1.9,0.16,{size:9.8,color:C.white,bold:true,align:"center"});});
  s.shape("roundRect", 1.2, 8.25, 14.9, 0.55, { fill: C.paleGold, adj: 8000 });
  s.text("家长看到的是服务表格，学生感受到的是每天有人看见、有人提醒、有人陪他往前走。", 1.55, 8.42, 14.2, 0.2, { size: 13.5, color: C.navy, bold: true, align: "center" });
  return s;
}
function slide35() {
  const s = new S(C.navy);
  s.image("rId2", 0, 0, 6.0, H, { alpha: 65000 });
  s.image("rId4", 5.8, 0, 6.05, H, { alpha: 65000 });
  s.image("rId6", 11.65, 0, 6.15, H, { alpha: 65000 });
  s.shape("rect", 0, 0, W, H, { fill: C.navy, alpha: 52000 });
  s.text("CAMPUS LIFE", 0.9, 1.05, 4.2, 0.35, { size: 16, color: C.gold, bold: true });
  s.text("校园生活", 0.9, 1.65, 4.5, 0.75, { size: 44, color: C.white, bold: true });
  s.text("真实的课堂、活动和校园生活，让学生在学术之外拥有完整的高中成长体验。", 0.95, 2.65, 7.4, 0.45, { size: 17, color: C.white, alpha: 88000 });
  [["活动与社团","运动会、社团、国际文化交流与兴趣发展。"],["文化与表达","多语种、非遗、跨文化体验共同支撑综合素养。"],["成长与毕业","用真实场景呈现学生在校成长与阶段成果。"]].forEach((it,i)=>card(s,1.0+i*5.45,6.45,4.75,1.25,it[0],it[1],[C.gold,C.blue,C.violet][i]));
  s.text("OXSTAND INTERNATIONAL SCHOOL | 35", 12.7, 9.35, 4.3, 0.24, { size: 11, color: C.white, alpha: 70000, align: "right" });
  return s;
}
function slide36() {
  const s = new S(); bg(s, "Admission Service", 36);
  title(s, "Personalized Admission Pathway", "入学评估与持续跟踪指导", "先判断孩子适合哪条路，再持续陪伴每个阶段的变化。");
  s.shape("roundRect", 0.95, 2.55, 7.6, 5.55, { fill: C.light, line: C.line, adj: 7000 });
  s.text("入学前：把路径选准", 1.35, 3.0, 3.6, 0.35, { size: 22, color: C.navy, bold: true });
  [["1对1学业评估","了解英语/小语种基础、数学与学科能力、学习习惯和目标国家。"],["课程路径建议","根据评估结果匹配 OSSD、AP、日韩、IGCSE/A-Level 或新加坡方向。"],["阶段成长规划","制定入学后语言、学科、考试和升学节点安排。"]].forEach((it,i)=>card(s,1.35,3.7+i*1.25,6.75,0.95,it[0],it[1],[C.purple,C.blue,C.gold][i]));
  s.shape("roundRect", 9.15, 2.55, 7.0, 5.55, { fill: C.purple, adj: 7000 });
  s.text("入学后：把成长跟住", 9.55, 3.0, 3.7, 0.35, { size: 22, color: C.white, bold: true });
  [["学习进度跟踪","阶段测试、课堂表现、作业反馈"],["语言能力跟踪","托福/雅思/TOPIK/JLPT 等考试规划"],["家校沟通","班主任、导师、升学老师多方同步"],["方向动态调整","根据成绩、兴趣和目标院校变化调整路径"]].forEach((it,i)=>{const x=9.55+(i%2)*3.2,y=3.78+Math.floor(i/2)*1.55; s.shape("roundRect",x,y,2.75,1.05,{fill:C.white,alpha:95000,adj:6000}); s.text(it[0],x+0.18,y+0.2,2.35,0.22,{size:12.8,color:C.navy,bold:true,align:"center"}); s.text(it[1],x+0.2,y+0.55,2.35,0.32,{size:9.4,color:C.gray,align:"center"});});
  s.shape("roundRect", 1.2, 8.35, 14.9, 0.5, { fill: C.paleGold, adj: 8000 });
  s.text("我们不只告诉家长“可以读什么课程”，更持续回答“孩子现在走得怎么样，下一步该怎么做”。", 1.55, 8.5, 14.2, 0.2, { size: 13, color: C.navy, bold: true, align: "center" });
  return s;
}

const relMaps = {
  31: { rId1: "../media/image27.png", rId2: "../media/image28.png" },
  32: { rId1: "../media/image29.jpeg", rId11: "../media/image30.png", rId13: "../media/image31.png" },
  33: { rId1: "../media/image32.png", rId2: "../media/image33.png", rId3: "../media/image34.png", rId4: "../media/image35.png", rId5: "../media/image36.png", rId6: "../media/image37.png", rId7: "../media/image38.png" },
  35: { rId2: "../media/image39.jpeg", rId4: "../media/image40.jpeg", rId6: "../media/image41.jpeg" },
};
const builders = { 31: slide31, 32: slide32, 33: slide33, 34: slide34, 35: slide35, 36: slide36 };
const layoutIds = { 31: "rId3", 32: "rId14", 33: "rId8", 34: "rIdLayout", 35: "rId19", 36: "rIdLayout" };

const zip = await JSZip.loadAsync(fs.readFileSync(src));
for (const [n, build] of Object.entries(builders)) {
  zip.file(`ppt/slides/slide${n}.xml`, xml(build()));
  zip.file(`ppt/slides/_rels/slide${n}.xml.rels`, rels(layoutIds[n], relMaps[n] || {}));
}
fs.writeFileSync(out, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
fs.writeFileSync(note, `# V2初稿展会宣讲优化版\n\n- 源文件：${src}\n- 输出文件：${out}\n- 修改范围：第31-36页\n- 第31页：刘总裁视觉化个人页\n- 第32页：各位校长与项目负责人页\n- 第33页：全体师资与升学支持团队页\n- 第34-36页：学生成长、升学服务、校园生活、入学评估与持续跟踪服务强化表达\n- 说明：前30页及37页以后未改动。\n`, "utf8");
console.log(`Generated ${out}`);
