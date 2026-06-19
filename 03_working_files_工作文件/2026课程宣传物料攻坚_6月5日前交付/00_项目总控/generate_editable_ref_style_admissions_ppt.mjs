import fs from "fs";
import path from "path";
import JSZip from "jszip";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付";
const baseDir = path.join(root, "05_总招生手册_初稿图文版");
const manifest = JSON.parse(fs.readFileSync(path.join(baseDir, "asset_manifest.json"), "utf8"));
const outDir = path.join(baseDir, "PPT_横版招生手册SAIS风格V2");
const outPptx = path.join(outDir, "奥斯翰国际部招生宣传册_横版PPT_SAIS风格V2_可编辑版_参考风格.pptx");
const outMd = path.join(outDir, "奥斯翰国际部招生宣传册_横版PPT_SAIS风格V2_可编辑版_参考风格_说明.md");
fs.mkdirSync(outDir, { recursive: true });

const EMU = 914400;
const SLIDE_W = 16 / 9 * 10; // match the reference deck: 16:9, 10in high
const SLIDE_H = 10;
const CX = Math.round(SLIDE_W * EMU);
const CY = Math.round(SLIDE_H * EMU);

const C = {
  navy: "1B2A5B",
  cyan: "0E8FD8",
  gold: "D4A843",
  gray: "666666",
  dark: "333333",
  light: "F0F4FA",
  pale: "F5ECD7",
  white: "FFFFFF",
  line: "E0E0E0",
  red: "B74A3D",
  green: "5F7F69",
};
const font = "Microsoft YaHei";
const asset = (key) => path.join(baseDir, manifest[key] || "");
const extOf = (p) => path.extname(p).replace(".", "").toLowerCase().replace("jpeg", "jpg") || "jpg";
const emu = (v) => Math.round(v * EMU);
const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function solid(color, alpha = 100000) {
  if (!color) return "<a:noFill/>";
  const a = alpha < 100000 ? `<a:alpha val="${alpha}"/>` : "";
  return `<a:solidFill><a:srgbClr val="${color}">${a}</a:srgbClr></a:solidFill>`;
}
function line(color = null, width = 1) {
  if (!color) return "<a:ln/>";
  return `<a:ln w="${Math.round(width * 12700)}"><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:prstDash val="solid"/></a:ln>`;
}

class Slide {
  constructor(bg = C.white) {
    this.bg = bg;
    this.parts = [];
    this.rels = [];
    this.id = 2;
  }
  shape(type, x, y, w, h, opt = {}) {
    const adj = type === "roundRect" ? `<a:avLst><a:gd name="adj" fmla="val ${opt.adj ?? 8000}" /></a:avLst>` : "<a:avLst/>";
    this.parts.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Shape"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="${type}">${adj}</a:prstGeom>${solid(opt.fill, opt.alpha ?? 100000)}${line(opt.line, opt.lw ?? 1)}</p:spPr></p:sp>`);
  }
  connector(x1, y1, x2, y2, opt = {}) {
    const x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
    this.parts.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Connector"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="straightConnector1"><a:avLst/></a:prstGeom><a:noFill/><a:ln w="${Math.round((opt.lw ?? 2) * 12700)}"><a:solidFill><a:srgbClr val="${opt.color ?? C.gold}"/></a:solidFill><a:prstDash val="solid"/><a:headEnd type="none"/><a:tailEnd type="${opt.arrow ? "arrow" : "none"}"/></a:ln></p:spPr></p:sp>`);
  }
  text(txt, x, y, w, h, opt = {}) {
    const align = opt.align === "center" ? "ctr" : opt.align === "right" ? "r" : "l";
    const sz = Math.round((opt.size ?? 14) * 100);
    const b = opt.bold ? ' b="1"' : "";
    const color = opt.color ?? C.dark;
    const alpha = opt.alpha ? `<a:alpha val="${opt.alpha}"/>` : "";
    const paras = String(txt).split("\n").map(p => `<a:p><a:pPr algn="${align}"><a:lnSpc><a:spcPct val="${Math.round((opt.lh ?? 1.3) * 100000)}"/></a:lnSpc></a:pPr><a:r><a:rPr lang="zh-CN" sz="${sz}"${b}><a:solidFill><a:srgbClr val="${color}">${alpha}</a:srgbClr></a:solidFill><a:latin typeface="${font}"/><a:ea typeface="${font}"/><a:cs typeface="${font}"/></a:rPr><a:t>${esc(p)}</a:t></a:r><a:endParaRPr lang="zh-CN" sz="${sz}"/></a:p>`).join("");
    this.parts.push(`<p:sp><p:nvSpPr><p:cNvPr id="${this.id++}" name="Text"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/><a:ln/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="0" tIns="0" rIns="0" bIns="0" anchor="${opt.valign ?? "t"}"/><a:lstStyle/>${paras}</p:txBody></p:sp>`);
  }
  image(key, x, y, w, h, opt = {}) {
    const file = asset(key);
    if (!fs.existsSync(file)) return;
    const rId = `rId${this.rels.length + 1}`;
    this.rels.push({ rId, file });
    const alpha = opt.alpha ? `<a:alphaModFix amt="${opt.alpha}"/>` : "";
    this.parts.push(`<p:pic><p:nvPicPr><p:cNvPr id="${this.id++}" name="Image"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="${rId}">${alpha}</a:blip><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr><a:xfrm><a:off x="${emu(x)}" y="${emu(y)}"/><a:ext cx="${emu(w)}" cy="${emu(h)}"/></a:xfrm><a:prstGeom prst="${opt.round ? "roundRect" : "rect"}"><a:avLst/></a:prstGeom></p:spPr></p:pic>`);
  }
}

function footer(s, n) {
  s.connector(0.8, 9.62, 16.9, 9.62, { color: C.line, lw: 1 });
  s.text(`OXSTAND INTERNATIONAL SCHOOL | ${String(n).padStart(2, "0")}`, 0.8, 9.68, 6, 0.25, { size: 12, color: C.gray });
}
function head(s, en, cn, sub = "") {
  s.text(en.toUpperCase(), 0.8, 0.56, 4.5, 0.28, { size: 12, color: C.gold, bold: true });
  s.text(cn, 0.8, 0.92, 9.2, 0.68, { size: 32, color: C.navy, bold: true });
  if (sub) s.text(sub, 0.8, 1.62, 11.6, 0.45, { size: 14, color: C.gray, lh: 1.35 });
}
function card(s, x, y, w, h, title, body, accent = C.cyan) {
  s.shape("roundRect", x, y, w, h, { fill: C.light, adj: 6000 });
  s.shape("rect", x, y, 0.08, h, { fill: accent });
  s.text(title, x + 0.25, y + 0.28, w - 0.5, 0.38, { size: 18, color: C.navy, bold: true });
  if (body) s.text(body, x + 0.25, y + 0.85, w - 0.5, h - 1.0, { size: 13, color: C.gray, lh: 1.42 });
}
function metric(s, num, label, x, y, color = C.gold) {
  s.text(num, x, y, 2.2, 0.7, { size: 38, color, bold: true, align: "center" });
  s.text(label, x, y + 0.78, 2.2, 0.35, { size: 14, color: C.navy, bold: true, align: "center" });
}
function bullets(s, items, x, y, w, color = C.gold) {
  items.forEach((item, i) => {
    s.shape("ellipse", x, y + i * 0.45 + 0.08, 0.11, 0.11, { fill: color });
    s.text(item, x + 0.22, y + i * 0.45, w - 0.22, 0.35, { size: 13, color: C.dark });
  });
}
function table(s, x, y, colW, rowH, rows, opt = {}) {
  rows.forEach((row, r) => {
    let xx = x;
    const h = Array.isArray(rowH) ? (rowH[r] || rowH[rowH.length - 1]) : rowH;
    row.forEach((cell, c) => {
      const isHead = r === 0;
      s.shape("rect", xx, y, colW[c], h, { fill: isHead ? (opt.header || C.navy) : (r % 2 ? C.white : C.light), line: C.line, lw: 0.8 });
      s.text(cell, xx + 0.08, y + 0.1, colW[c] - 0.16, h - 0.14, { size: isHead ? (opt.headSize || 12) : (opt.size || 10.5), color: isHead ? C.white : C.dark, bold: isHead, align: opt.align || "left", lh: 1.25 });
      xx += colW[c];
    });
    y += h;
  });
}
function chapter(no, cn, en, desc) {
  const s = new Slide(C.navy);
  s.shape("ellipse", -2.7, -1.6, 9.8, 12.8, { fill: C.cyan, alpha: 45000 });
  s.shape("ellipse", 1.8, 2.9, 0.28, 0.28, { fill: C.gold });
  s.text(no, 1.25, 3.1, 4.2, 1.5, { size: 92, color: C.white });
  s.text(en, 6.2, 3.35, 8.8, 0.55, { size: 28, color: C.white });
  s.text(cn, 6.2, 4.15, 8.0, 0.8, { size: 32, color: C.white, bold: true });
  s.text(desc, 6.2, 5.05, 8.4, 0.8, { size: 16, color: C.white, alpha: 70000, lh: 1.45 });
  s.text("OXSTAND International", 12.3, 9.18, 4.0, 0.3, { size: 16, color: C.gold, alpha: 45000, align: "right" });
  return s;
}
function standard(en, cn, sub, n, fn) {
  const s = new Slide();
  head(s, en, cn, sub);
  fn(s);
  footer(s, n);
  return s;
}
function imageText(en, cn, sub, n, key, fn) {
  const s = new Slide();
  s.image(key, 0.85, 0.85, 7.1, 7.95, { round: true });
  s.shape("roundRect", 0.85, 0.85, 7.1, 7.95, { fill: null, line: C.line, lw: 0.8, adj: 6000 });
  s.text(en.toUpperCase(), 8.55, 0.85, 4.0, 0.25, { size: 12, color: C.gold, bold: true });
  s.text(cn, 8.55, 1.25, 7.6, 0.75, { size: 30, color: C.navy, bold: true });
  if (sub) s.text(sub, 8.55, 2.1, 7.2, 0.8, { size: 14, color: C.gray, lh: 1.4 });
  fn(s, 8.55, 3.0);
  footer(s, n);
  return s;
}

function buildSlides() {
  const slides = [];
  let n = 1;

  { const s = new Slide(C.navy); s.image("cover", 0, 0, SLIDE_W, SLIDE_H); s.shape("rect", 0, 0, SLIDE_W, SLIDE_H, { fill: C.navy, alpha: 76000 }); s.text("OXSTAND INTERNATIONAL SCHOOL", 1.1, 2.15, 7, 0.32, { size: 14, color: C.white }); s.text("深圳奥斯翰外语学校\n国际部招生手册", 1.1, 2.9, 8.5, 1.75, { size: 44, color: C.white, bold: true, lh: 1.25 }); s.text("精品国际课程 · 多路径升学规划 · 小规模精细化支持", 1.1, 5.35, 8.4, 0.35, { size: 18, color: C.white, alpha: 85000 }); s.shape("rect", 1.1, 6.0, 0.85, 0.06, { fill: C.gold }); s.text("SAIS", 10.2, 6.6, 7.0, 1.8, { size: 108, color: C.white, alpha: 9000, align: "right" }); slides.push(s); }

  { const s = new Slide(); s.shape("ellipse", -1.2, -0.2, 7.3, 10.6, { fill: C.navy }); s.shape("ellipse", -1.3, -0.6, 6.7, 11.1, { fill: C.cyan, alpha: 30000 }); s.text("CONTENTS", 1.1, 3.55, 5.0, 0.65, { size: 38, color: C.white, bold: true }); s.text("目录", 1.1, 4.4, 3.0, 0.5, { size: 28, color: C.white }); [["01","关于奥斯翰","School Profile"],["02","课程体系总览","Curriculum Map"],["03","OSSD 中加课程","Ontario Secondary School Diploma"],["04","AP 国际课程","Advanced Placement"],["05","日韩小语种升学","KUPP / JUPP"],["06","IGCSE / A-Level","British Pathway"],["07","新加坡 IFD 方向","Singapore Pathway"],["08","师资与升学服务","Faculty & Guidance"],["09","入学咨询与费用","Admission & Fees"]].forEach((it,i)=>{ const y=0.78+i*0.86; s.text(it[0],7.2,y,0.62,0.35,{size:28,color:C.navy,bold:true}); s.text(it[1],8.15,y+0.02,4.6,0.28,{size:18,color:C.navy,bold:true}); s.text(it[2],8.15,y+0.37,4.8,0.24,{size:12,color:C.gray}); }); footer(s, ++n); slides.push(s); }

  slides.push(chapter("01", "关于奥斯翰", "School Profile", "深圳老牌民办国际化高中，以外语特色和多路径课程为学生打开更适合的升学选择。")); n++;
  slides.push(imageText("About Oxstand", "深圳本土办学二十余年", "2004年经深圳市教育局批准创办，学校位于深圳市罗湖区布心路2040号。", ++n, "cover", s => { s.text("学校以“与世界同步，培育跨时代精英人才”为育人目标，运用ISO9001国际优质管理系统，植根中华传统文化，融贯东西方教育思想，依托外语特色，先后开设加拿大OSSD课程、韩国大学直升课程、日本大学直升课程、AP国际课程、IGCSE/A-Level衔接课程、新加坡IFD方向等多元升学路径。", 8.55, 3.0, 7.3, 2.05, { size: 15, color: C.dark, lh: 1.65 }); [["2004","创校时间"],["20+","办学积累"],["多语种","外语学校底色"],["多路径","国际升学出口"]].forEach((m,i)=>metric(s,m[0],m[1],8.55+i*1.8,6.4,i%2?C.cyan:C.gold)); }));
  slides.push(standard("Why Oxstand", "奥斯翰的四个招生优势", "对家长而言，选择课程之前，首先要判断学校是否能稳定托举孩子三年的成长。", ++n, s => { [["老牌办学积累","20余年本土办学经验，熟悉深圳家庭对国际升学的真实需求。"],["外语特色底色","英语、日语、韩语等语言资源，为不同国家出口提供语言基础。"],["小规模精细管理","更短的反馈链条、更近的师生关系，便于持续跟踪学习状态。"],["多路径升学规划","OSSD、AP、日韩、IGCSE/A-Level、新加坡方向，按目标匹配课程。"]].forEach((it,i)=>card(s,1.0+i*4.1,3.1,3.55,3.6,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));
  slides.push(standard("School Development History", "创校历程", "二十余年办学积累，形成外语特色、多元课程与国际升学服务基础。", ++n, s => { const nodes=[["2004","学校创办",0],["2006","深圳市一级学校",0],["2007","加拿大国际课程通过安省教育部资质验收",1],["2008","ISO9001国际优质教育管理认证",1],["2009","引进韩国大学直升课程",1],["2010","广东省民办教育发展示范名校",0],["2011","英国留学直通车UCAS资质",1],["2012","引进日本大学先修课程",1],["2013","深圳市高考先进单位",0],["2014","教育科研先进学校",0],["2016","College Board批准成为AP授权学校",1],["2017","广东省依法治校示范学校",0],["2018","罗湖区教育先进单位与德育先进单位",0],["2020","IBDP世界学校",1],["2023","清华美院美育课题项目合作学校",0],["2024","AP授权代码579073可查",1]]; nodes.forEach((it,i)=>{const x=0.9+(i%8)*2.08,y=2.8+Math.floor(i/8)*1.55; s.shape("roundRect",x,y,1.72,1.05,{fill:it[2]?C.pale:C.light,line:it[2]?C.gold:C.line,adj:7000}); s.text(it[0],x+0.1,y+0.18,1.5,0.28,{size:21,color:it[2]?C.gold:C.navy,bold:true,align:"center"}); s.text(it[1],x+0.12,y+0.53,1.48,0.42,{size:9.3,color:C.dark,bold:!!it[2],align:"center",lh:1.2});}); s.shape("roundRect",1.0,7.35,15.8,0.82,{fill:C.navy,adj:5000}); s.text("国际课程重点节点",1.4,7.62,2.5,0.28,{size:18,color:C.white,bold:true}); s.text("加拿大课程、日韩小语种、UCAS资质、AP授权、IBDP世界学校等节点，构成奥斯翰多路径升学体系的基础。",4.1,7.64,11.8,0.3,{size:14,color:C.white}); }));

  slides.push(chapter("02", "课程体系总览", "Curriculum Map", "先看目标国家，再选择课程路径；先看学生基础，再设计三年学习节奏。")); n++;
  slides.push(standard("Curriculum Map", "奥斯翰国际课程地图", "先看目标方向，再看考试体系；先看学生基础，再设计三年节奏。", ++n, s => { [["OSSD","加拿大安省文凭","过程评价 / 6门12年级成绩","加拿大、英美澳港多国",C.navy],["AP","美国大学先修课程","AP科目 + SAT/语言成绩","美国、香港及多国申请",C.cyan],["KUPP / JUPP","日韩小语种升学","TOPIK / JLPT / EJU / 面试","韩国、日本本科",C.gold],["IG / A-Level","英式课程路径","IGCSE + 3-4门A-Level","英国、香港、澳洲、加拿大",C.navy],["IFD","新加坡方向","语言 + 预科能力 + 学分衔接","新加坡本科与后期转轨",C.cyan]].forEach((r,i)=>{const x=0.85+i*3.25; s.shape("roundRect",x,2.35,2.95,4.2,{fill:C.light,adj:7000}); s.shape("roundRect",x,2.35,2.95,0.62,{fill:r[4],adj:7000}); s.text(r[0],x,2.48,2.95,0.34,{size:18,color:C.white,bold:true,align:"center"}); s.text(r[1],x+0.22,3.3,2.5,0.4,{size:14,color:r[4],bold:true,align:"center"}); s.text(r[2],x+0.22,4.25,2.5,0.55,{size:12,color:C.dark,align:"center"}); s.text("升学方向",x+0.22,5.1,2.5,0.25,{size:11,color:C.gray,align:"center"}); s.text(r[3],x+0.22,5.55,2.5,0.5,{size:12,color:C.dark,align:"center",bold:true}); }); s.shape("roundRect",1.1,7.05,15.0,0.9,{fill:C.pale,adj:6000}); s.text("奥斯翰的优势不是把所有学生推向同一条路，而是让不同语言基础、学科优势与家庭规划的学生，都能找到更适合的升学路径。",1.45,7.31,14.3,0.35,{size:16,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("How to Choose", "家长如何理解课程选择", "从目标、语言、学科和家庭规划四个维度判断孩子适合哪条路径。", ++n, s => { [["目标国家","先确定英美加澳、日韩、新加坡或多国申请方向"],["语言基础","英语、韩语、日语基础决定进入课程后的适应速度"],["学科优势","数学、理科、商科、艺术、人文方向决定选课组合"],["申请方式","标化、过程评价、语言考试、校内考等路径差异明显"]].forEach((it,i)=>card(s,1.0+i*4.05,3.1,3.4,2.8,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); s.shape("roundRect",1.5,7.15,14.4,0.72,{fill:C.pale,adj:5000}); s.text("奥斯翰的课程体系，让学生可以从基础能力建设出发，逐步找到更适合自己的国家方向、学术路径和大学申请方案。",1.9,7.35,13.6,0.28,{size:15,color:C.navy,bold:true,align:"center"}); }));

  slides.push(chapter("03", "OSSD 中加课程", "Ontario Secondary School Diploma", "加拿大安大略省高中课程路径，强调过程评价与多国大学申请。")); n++;
  slides.push(standard("Program Overview", "什么是 OSSD", "加拿大安大略省高中毕业文凭，以过程评价、安省课程与多国申请通道为核心优势。", ++n, s => { card(s,1.0,2.7,4.6,3.2,"过程评价更稳妥","课堂表现、作业、项目、阶段测试与最终评价共同构成成绩，减少单次考试波动对升学的影响。",C.gold); card(s,6.2,2.7,4.6,3.2,"6门12年级成绩申请","学生以12年级6门4U/4M课程学术成绩与语言成绩作为核心材料，面向加拿大及多国大学申请。",C.cyan); card(s,11.4,2.7,4.6,3.2,"安省体系全球认可","课程学习、学分要求和毕业文凭均服务海外本科申请，在高中阶段建立大学所需的学术英语与学科能力。",C.navy); s.text("适合学生：希望避开单一高考路径，重视平时学习积累，希望用更灵活方式申请加拿大、英国、美国、澳洲、香港等方向的学生。",1.4,7.0,15,0.6,{size:17,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("Oxstand Bond OSSD Program", "奥斯翰邦德 OSSD 项目", "项目与加拿大邦德多伦多学院合作设立，学生在奥斯翰完成中加两国高中课程。", ++n, s => { [["安省学籍路径","学生按课程进度注册安大略省高中学籍，以安省高中课程成绩服务海外本科申请。"],["中加课程衔接","中方基础课程与加方课程共同构成高中阶段学习体系，循序渐进完成学术过渡。"],["OCT外教课程","加方课程由具备安省教师资格背景的教师授课，重视课堂参与、项目作业与学术表达。"],["一站式升学服务","课程学习、语言标化、社会实践、申请文书、签证与行前支持系统推进。"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.6+Math.floor(i/2)*2.25,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));
  slides.push(standard("Curriculum Structure", "OSSD课程设置", "高一、高二、高三逐步从中方基础课程过渡到加方学术课程。", ++n, s => table(s,1.0,2.55,[2.3,5.0,5.0,3.7],[0.62,1.35,1.35,1.35],[["年级","课程重点","代表课程","阶段目标"],["高一","中方基础课程 + 2-3门加方语言和文科课程","ESL-C/D、Career Planning、生涯课程等","完成语言适应与加方课程入门"],["高二","少量中方基础课 + 6门加方文理科学术课程","ENG2D、ENG3U、MCR3U、SPU3U、CIE3M等","进入安省学术课程主线"],["高三","6-7门加方12年级学术课程","ENG4U、MHF4U、MCV4U、BBB4M、SPH4U、SCH4U等","形成大学申请核心成绩"]],{size:10.5})));
  slides.push(standard("University Guidance", "OSSD升学支持", "从入学到升学，围绕课程成绩、语言成绩与申请材料形成完整服务闭环。", ++n, s => { [["01","选课规划"],["02","语言标化"],["03","社会实践"],["04","院校申请"],["05","签证行前"]].forEach((it,i)=>{const x=1.2+i*3.15; s.shape("roundRect",x,3.15,2.4,1.75,{fill:C.light,adj:6000}); s.text(it[0],x+0.45,3.45,1.5,0.45,{size:32,color:[C.navy,C.cyan,C.gold,C.navy,C.cyan][i],bold:true,align:"center"}); s.text(it[1],x+0.25,4.22,1.9,0.32,{size:16,color:C.navy,bold:true,align:"center"}); if(i<4)s.connector(x+2.45,4.0,x+3.0,4.0,{color:C.gold,lw:2,arrow:true});}); s.text("家长看到的不只是课程名称，而是孩子从入学评估、课程学习、语言考试到大学申请的完整路径。",2.0,6.9,14.0,0.4,{size:17,color:C.navy,bold:true,align:"center"}); }));

  slides.push(chapter("04", "AP 国际课程", "Advanced Placement Program", "美国大学理事会授权课程，School Code 579073，为学生提供高挑战度学科证明。")); n++;
  slides.push(standard("Program Overview", "什么是 AP 课程", "AP是美国大学理事会推出的大学先修课程体系，帮助学生用高挑战度学科成绩展示大学学习潜力。", ++n, s => { s.shape("roundRect",1.0,2.6,5.4,4.25,{fill:C.navy,adj:6000}); s.text("School Code",1.5,3.35,4.4,0.38,{size:22,color:C.gold,bold:true,align:"center"}); s.text("579073",1.5,4.3,4.4,0.85,{size:52,color:C.white,bold:true,align:"center"}); s.text("College Board授权身份清晰可查",1.4,5.55,4.6,0.38,{size:17,color:C.white,bold:true,align:"center"}); [["官方体系背书","授权代码可查，让课程身份与考试路径更加清晰。"],["高挑战学科证明","AP成绩可展示学生提前学习大学先修内容的能力。"],["多国申请适配","适合美国、香港及多国综合申请，与SAT、托福/雅思共同规划。"],["专业画像更鲜明","通过微积分、科学、经济、历史等科目强化目标专业竞争力。"]].forEach((it,i)=>card(s,7.1+(i%2)*4.6,2.65+Math.floor(i/2)*2.2,4.0,1.65,it[0],it[1],[C.gold,C.cyan,C.navy,C.gold][i])); }));
  slides.push(standard("Course Offerings", "AP课程设置", "从Pre-Program到G11-G12 AP冲刺，逐步完成基础能力、学科能力与申请能力建设。", ++n, s => table(s,0.8,2.5,[2.7,4.4,4.25,4.7],[0.56,1.1,1.25,1.1],[["阶段","必修基础","AP科目方向","语言与申请支持"],["Pre-Program / G10","综合英语、数学、综合科学、世界历史、全球视野、基础经济学","完成AP前置能力建设","英语听说读写、学术写作、口语表达"],["G11-G12","英语语法与写作、数学、全球视野、英语文学鉴赏","AP微积分AB/BC、AP预科微积分、AP化学、生物、物理、微观/宏观经济、世界历史、中文","SAT数学、托福、雅思、选校规划"],["选修拓展","中文、中国文学、运动科学","韩国语、西班牙语、日语、韩国文化与历史","多语种能力与跨文化背景补充"]],{size:9.3})));
  slides.push(standard("Learning Journey", "AP学习路径", "三阶段递进：先打基础，再学科过渡，最后完成AP与大学申请冲刺。", ++n, s => { [["G7-G8","SAT&AP准备","英语基础与中级课程、代数几何、基础科学和地理课程。"],["G9-G10","SAT&AP过渡","提升学科英语能力，开始AP相关学科准备。"],["G11-G12","SAT&AP冲刺","AP科目学习、SAT/语言考试、申请材料同步推进。"]].forEach((it,i)=>{const x=1.5+i*5.1; card(s,x,3.0,4.1,2.8,it[1],it[2],[C.navy,C.cyan,C.gold][i]); s.text(it[0],x+0.35,3.35,3.4,0.4,{size:23,color:[C.navy,C.cyan,C.gold][i],bold:true,align:"center"}); if(i<2)s.connector(x+4.25,4.35,x+4.9,4.35,{color:C.gold,lw:2,arrow:true});}); }));
  slides.push(standard("Program Highlights", "为什么选择奥斯翰 AP", "奥斯翰AP把授权课程、学科组合、语言标化和升学申请放进同一套规划里。", ++n, s => { [["授权优势","College Board授权学校，School Code 579073，课程身份清晰可查，是AP招生表达中的核心信任点。"],["科目组合","覆盖数学、科学、经济、历史、中文等方向，服务理工、商科、人文多类专业。"],["申请协同","AP与SAT、托福/雅思、活动背景、文书规划联动，帮助学生把成绩转化为申请竞争力。"],["延时选修支持","托福、雅思、SAT数学、学术写作、英语口语、小语种等选修支持学生按目标补强。"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.8+Math.floor(i/2)*2.2,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));

  slides.push(chapter("05", "日韩小语种升学", "KUPP / JUPP", "两条小语种路径，一条通向韩国名校，一条通向日本本科，发挥奥斯翰外语学校特色。")); n++;
  slides.push(standard("Korea University Pathway Program", "韩国大学直升课程 KUPP", "深圳首家开设韩国语小语种课的全日制高中之一，深耕韩国留学教育，帮助学生从韩语能力走向韩国本科申请。", ++n, s => { metric(s,"100%","整体升学率",1.4,3.0,C.navy); metric(s,"40%+","TOP10顶尖本科录取率",4.6,3.0,C.gold); metric(s,"90%+","TOP20重本率",7.8,3.0,C.cyan); card(s,11.0,2.75,4.9,2.2,"课程定位","面向目标韩国本科的学生，围绕韩语学习、文化课程、TOPIK考试、院校申请和留学服务展开。",C.navy); s.text("学生通过校内课程成绩，TOPIK成绩及申请材料冲刺韩国知名大学；课程以语言、文化、升学三线并行推进。",1.8,7.1,14.0,0.45,{size:17,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("Three-Year Learning Journey", "三年TOPIK递进培养路径", "从零基础到TOPIK高级目标，语言学习与升学规划同步推进。", ++n, s => table(s,1.0,2.55,[2.3,3.6,4.9,4.9],[0.62,1.25,1.25,1.25],[["年级","TOPIK目标","课程重点","升学任务"],["高一","TOPIK 1-2","韩国语入门、文化学科、国际交流、跨文化学习","建立韩语基础，初步了解韩国高校与专业方向"],["高二","TOPIK 3-4","中级韩国语、韩国文化与历史、学业规划","确定目标院校与专业，准备申请材料"],["高三","TOPIK 5-6","高级韩国语、TOPIK冲刺、留学生活指导","一站式升学服务，完成申请与入学衔接"]],{size:10.5})));
  slides.push(standard("Academic Pathways", "韩国名校与优势专业", "韩国高校在商科、理工、艺术设计、传媒影视、医学与健康科学等方向具有较强优势。", ++n, s => table(s,0.8,2.25,[2.9,1.55,1.95,4.2,3.7],[0.52,0.65,0.65,0.65,0.65,0.65,0.65],[["韩国大学","韩国排名","QS排名","优势专业","对应国内院校"],["首尔国立大学","1","31","工科、医学、AI、商科、传媒","清华大学"],["韩国科学技术院","2","53","计算机、机器人、材料科学","北京大学"],["延世大学","3","56","医学、商科、经营管理","复旦大学"],["高丽大学","4","67","法学、传媒、半导体、商科","上海交通大学"],["成均馆大学","5","123","半导体、AI、经营学","中国科学技术大学"],["弘益大学","8","艺术类150","美术、设计类","中央美院、清华美院"]],{size:9.3})));
  slides.push(standard("Japan University Pathway Program", "日本大学直升课程 JUPP", "专为目标日本本科的高中生设计，围绕日语能力、EJU留考、JLPT考试、升学规划和日本文化适应展开。", ++n, s => { metric(s,"14年","日本方向办学经验",1.3,3.0,C.gold); metric(s,"100%","升学率",4.3,3.0,C.navy); metric(s,"99%+","签证率",7.3,3.0,C.cyan); card(s,10.7,2.75,5.1,2.4,"课程定位","零基础可入读，由日籍外教及中方日语教师共同授课，面向NAT、JLPT、EJU、校内考与面试进行专项指导。",C.gold); s.text("日本方向适合希望通过日语能力、留考成绩、面试与推荐通道申请日本本科的学生，文理、艺术方向均可规划。",1.6,7.1,14.4,0.45,{size:17,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("Pathway Options", "日本方向升学模式", "根据学生日语基础、目标院校和家庭规划，形成不同升学衔接路径。", ++n, s => { [["3+0","3年奥斯翰高中","日语N2以上","网上考试和面试","直升日本合作本科院校"],["3+0.5","3年奥斯翰高中","日语N2以上","0.5年合作语言学校","衔接日本名校本科"],["2/2.5+1.5","奥斯翰高中阶段","JLPT N3以上","日本合作高中","推荐大学本科"]].forEach((r,i)=>{const y=2.65+i*1.55; s.text(r[0],1.0,y+0.35,1.2,0.45,{size:28,color:[C.navy,C.cyan,C.gold][i],bold:true}); for(let j=1;j<r.length;j++){const x=2.4+(j-1)*3.55; s.shape("roundRect",x,y,2.55,0.92,{fill:C.light,adj:6000}); s.text(r[j],x+0.12,y+0.3,2.3,0.28,{size:11.8,color:C.dark,bold:true,align:"center"}); if(j<r.length-1)s.connector(x+2.62,y+0.46,x+3.35,y+0.46,{color:C.gold,lw:2,arrow:true});}}); }));
  slides.push(standard("Curriculum Structure", "日本课程设置", "日语能力、EJU留考、升学面试、国际交流与文化适应同步推进。", ++n, s => table(s,1.0,2.55,[2.2,4.5,4.4,5.0],[0.62,1.28,1.28,1.28],[["年级","语言目标","核心课程","升学支持"],["高一","N5 / N4","日语入门、日本文化、日语词汇语法、听力、会话演讲、国学","国际交流、综合拓展、基础规划"],["高二","N3 / N2","日语阅读写作、EJU留考、JLPT备考、日本文化、生涯规划","升学面试辅导、目标院校规划"],["高三","N2 / N1","JLPT冲刺、EJU留考、日语综合能力强化","一对一升学规划、出愿材料、面试与行前指导"]],{size:10})));
  slides.push(standard("Language Pathways", "日本与韩国：两条小语种升学路径", "同样发挥奥斯翰外语特色，但考试体系、目标院校和学生画像各有侧重。", ++n, s => { s.shape("roundRect",1.2,2.7,7.0,4.3,{fill:C.light,adj:6000}); s.shape("roundRect",9.4,2.7,7.0,4.3,{fill:C.pale,adj:6000}); s.text("日本 JUPP",1.8,3.15,5.8,0.45,{size:28,color:C.cyan,bold:true,align:"center"}); bullets(s,["日语分层学习","JLPT / EJU / 校内考","合作高中与本科衔接","文理与艺术均可规划"],2.2,4.0,5.4,C.cyan); s.text("韩国 KUPP",10.0,3.15,5.8,0.45,{size:28,color:C.gold,bold:true,align:"center"}); bullets(s,["TOPIK三年递进","韩国文化与历史","韩国名校申请服务","商科、传媒、理工、艺术方向突出"],10.4,4.0,5.4,C.gold); }));

  slides.push(chapter("06", "IGCSE / A-Level", "British Pathway", "从IGCSE基础到A-Level选科与申请，面向英国、香港、澳洲、加拿大及多国大学。")); n++;
  slides.push(standard("Program Overview", "什么是 IGCSE / A-Level", "IGCSE是A-Level前的学术准备阶段，帮助学生完成国际课程学习习惯、学术英语和学科基础建设。", ++n, s => { card(s,1.0,2.7,4.6,3.05,"IGCSE阶段","G9-G10完成英语、数学、科学、人文社科、艺术与PSHE等基础课程，为后续A-Level选科打底。",C.cyan); card(s,6.2,2.7,4.6,3.05,"A-Level阶段","G11-G12选择3-4门与未来专业相关的核心科目，形成面向大学申请的学术成绩。",C.gold); card(s,11.4,2.7,4.6,3.05,"升学方向","面向英国、香港、澳洲、加拿大等英联邦方向，也可作为美国等多国申请材料之一。",C.navy); s.text("适合学生：目标英港澳加等方向，希望通过优势科目组合突出学术竞争力，并逐步完成全英文学术表达过渡的学生。",1.6,7.05,14.6,0.5,{size:17,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("Program Highlights", "A-Level课程优势", "A-Level的核心价值在于选科灵活、全球认可、模块化考核和中国学生适配度高。", ++n, s => { [["选课灵活","学生可选择3-4门与未来专业相关的科目，集中发挥优势学科。"],["全球认可","英国、香港、澳洲、加拿大、新加坡等高校普遍认可A-Level成绩。"],["模块化考核","两年学习期间有阶段性考试机会，容错率相对更高。"],["强适配中国学生","数学、物理、化学、经济等科目更容易发挥国内基础教育优势。"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.8+Math.floor(i/2)*2.2,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));
  slides.push(standard("Subject Pathways", "按专业方向组织选科", "课程不是简单列科目，而是帮助学生围绕未来专业搭建学科组合。", ++n, s => table(s,1.25,2.75,[3.0,5.0,7.0],[0.62,1.28,1.28,1.28],[["方向","科目组合示例","升学目标"],["STEM","数学、进阶数学、物理、化学、计算机","工程、人工智能、航空航天、数据科学、医学预备、金融"],["商科与社科","经济学、商科、心理学、历史、社会学","PPE、法律、国际关系、管理、市场营销、传媒"],["创意艺术","艺术设计、英语文学与语言、音乐、美术","建筑设计、时尚产业、视觉传达、电影传媒、作品集方向"]],{size:11})));
  slides.push(standard("Language Support", "从双语起步到全英学术表达", "不盲目追求入学即全英文，而是根据学生基础逐步完成学术语言过渡。", ++n, s => { [["双语基础","20%-30%英文授课，核心概念中文托底，英文术语渗透"],["双语过渡","40%-60%英文授课，作业与小测逐步使用英文表达"],["全英浸润","70%-85%英文授课，课堂讨论、报告和测试使用英文"],["全英冲刺","90%-100%英文环境，衔接海外大学课堂与学术写作"]].forEach((it,i)=>{const x=1.0+i*4.05; card(s,x,3.0,3.45,2.35,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i]); if(i<3)s.connector(x+3.48,4.15,x+3.9,4.15,{color:C.gold,lw:2,arrow:true});}); s.shape("roundRect",1.5,7.1,14.5,0.8,{fill:C.pale,adj:6000}); s.text("语言支持与A-Level学科学习同步推进，让学生既能听懂课，也能完成大学申请需要的英文输出。",2.0,7.35,13.5,0.3,{size:16,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("Academic Timeline", "G9-G12关键节点", "从适应、巩固、梳理到冲刺，帮助学生按节奏完成考试与申请。", ++n, s => table(s,1.0,2.55,[2.25,3.9,4.7,5.0],[0.58,1.03,1.03,1.03,1.03],[["年级","阶段任务","关键考试/节点","升学准备"],["G9","双语适应，建立学科基础与学术词汇","可选IGCSE中文/数学等科目","校内测评，评估G10准备度"],["G10","系统学习IGCSE，部分学生提前接触A-Level数学","5-6月IGCSE全球统考","6-7月确定A-Level选课"],["G11","进入AS阶段，英文比例提升至70%-85%","5-6月AS考试","准备个人陈述、推荐信、语言考试"],["G12","A2冲刺，完成最终大考与大学申请","UCAS/港新加澳申请、面试、出分","换取无条件录取，签证与行前准备"]],{size:9.8})));
  slides.push(standard("Academic Pathways", "A-Level升学方向", "A-Level成绩被全球众多大学认可，可根据学生成绩、语言能力和专业方向规划多国申请。", ++n, s => table(s,1.0,2.45,[2.7,4.0,4.0,5.0],[0.55,0.82,0.82,0.82,0.82,0.82],[["国家/地区","代表院校","成绩参考","申请特点"],["英国","牛津、剑桥、G5、罗素集团","AAA-A*AA等","通过UCAS系统，部分专业需笔试与面试"],["香港","港大、港中文、港科大、城大、理工","AAB-AAA及以上","热门专业竞争高，部分专业要求面试"],["澳洲","墨尔本、悉尼、ANU、UNSW等","分数换算制","申请周期灵活，部分可先获有条件录取"],["加拿大","多伦多、麦吉尔、UBC等","至少3门A-Level","可直接申请本科，部分高分可换学分"],["美国/其他","综合大学及多国项目","结合SAT/ACT/语言成绩","适合综合能力强、活动背景丰富的学生"]],{size:9.5})));

  slides.push(chapter("07", "新加坡 IFD 方向", "Singapore Pathway", "国内两年完成语言、学科和预科能力建设，再衔接新加坡本科路径。")); n++;
  slides.push(standard("Program Overview", "新加坡方向课程介绍", "国内完成语言与大学预科能力建设，再衔接新加坡本科路径，同时保留后期升级转轨空间。", ++n, s => { card(s,1.1,2.7,4.6,2.9,"2+2高效路径","前两年在国内完成语言、基础学科和大学预科内容，再衔接新加坡本科，缩短适应周期。",C.gold); card(s,6.2,2.7,4.6,2.9,"语言先行","第一年重点提升英语与基础学科能力，为后续IFD课程和海外学习打底。",C.cyan); card(s,11.3,2.7,4.6,2.9,"后期转轨空间","若学生语言与学术能力提升明显，可根据目标调整到AP、A-Level等更高挑战路径。",C.navy); s.text("适合学生：希望先在国内完成语言与预科能力建设，以更稳妥、更具性价比的方式衔接新加坡本科的学生",1.6,7.1,14.5,0.45,{size:17,color:C.navy,bold:true,align:"center"}); }));
  slides.push(standard("Curriculum Structure", "IFD课程设置", "第一年夯实基础，第二年进入大学预科能力与专业方向选修。", ++n, s => table(s,1.1,2.6,[2.5,6.0,7.0],[0.62,1.35,1.35,1.35],[["阶段","课程内容","培养目标"],["第一年","综合英语、英美文学、基础科学、世界历史、全球视野、数学、中文","建立语言、学科与国际课程学习基础"],["第二年必修","学术用途英语、大学研究与学习技巧、英语语言技巧培养、大学数学","完成大学预科核心能力建设"],["第二年选修","经济学、会计、国际商务、进阶数学、Python、法律、物理、生物、化学、数字艺术、艺术与设计等","按专业兴趣与未来本科方向选择课程"]],{size:10.2})));
  slides.push(standard("Program Advantages", "新加坡方向的选择价值", "新加坡方向适合希望在亚洲范围内寻找国际化本科路径、兼顾成本和就业环境的家庭。", ++n, s => { [["中西结合","在国内完成语言与预科能力建设，降低海外适应成本。"],["升学选择灵活","商科、数学、计算机、艺术、科学等方向均可通过选修建立基础。"],["全方位支持","语言、面试、文书、行前与海外学习生活支持同步推进。"],["转轨空间","前期能力建设可与IG/AP等基础能力衔接，为后期定位保留弹性。"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.8+Math.floor(i/2)*2.2,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));

  slides.push(chapter("08", "师资与升学服务", "Faculty & Guidance", "优秀课程最终要落到教师、管理和升学服务上。")); n++;
  slides.push(standard("Leadership", "国际部核心负责人", "总册前段展示核心管理者，建立家长对课程统筹、教学管理和升学服务的信任。", ++n, s => { s.shape("roundRect",1.2,2.7,5.0,4.6,{fill:C.light,adj:7000}); s.shape("ellipse",2.7,3.55,2.0,2.0,{fill:C.white,line:C.line}); s.text("国际部总负责人",7.2,3.1,5.8,0.55,{size:30,color:C.navy,bold:true}); s.text("负责国际课程整体规划、教学管理、升学资源协调与学生发展支持，统筹奥斯翰国际部多课程路径。",7.2,4.0,7.2,1.1,{size:16,color:C.gray,lh:1.5}); bullets(s,["国际课程统筹","升学路径规划","教学与学生发展管理","家校沟通与资源协调"],7.3,5.85,6.5,C.gold); }));
  slides.push(standard("Program Directors", "项目负责人", "OSSD、AP、日韩、IG/A-Level、新加坡等课程由项目负责人协同推进。", ++n, s => { [["金校 / 项目负责人","负责OSSD、AP、韩国、日本、新加坡等方向课程资源与课程内容协调。"],["Aleezer / 项目负责人","负责IGCSE/A-Level方向课程结构、学术路径与升学内容协调。"]].forEach((it,i)=>{const x=1.4+i*7.8; s.shape("roundRect",x,2.9,6.8,4.0,{fill:C.light,adj:7000}); s.shape("ellipse",x+0.55,3.55,1.75,1.75,{fill:C.white,line:C.line}); s.text(it[0],x+2.7,3.45,3.5,0.45,{size:20,color:C.navy,bold:true}); s.text(it[1],x+2.7,4.35,3.6,1.35,{size:14,color:C.gray,lh:1.45}); }); }));
  slides.push(standard("Academic & Guidance Team", "课程与升学支持团队", "语言教师、学科教师、小语种教师、班主任/导师、升学指导共同构成学生支持网络。", ++n, s => { [["语言教师","英语/韩语/日语等语言能力建设"],["学科教师","数学、科学、经济、人文与艺术课程"],["升学指导","选校、文书、面试、签证与行前"],["班主任/导师","学习跟踪、生活管理、家校沟通"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.8+Math.floor(i/2)*2.2,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));
  slides.push(standard("Faculty Matrix", "国际课程师资团队", "多学科教师与升学顾问协同，覆盖语言、学科、申请与学生成长支持。", ++n, s => { for(let i=0;i<15;i++){const x=1.0+(i%5)*3.25,y=2.55+Math.floor(i/5)*1.65; s.shape("roundRect",x,y,2.85,1.25,{fill:C.light,adj:6000}); s.shape("ellipse",x+0.25,y+0.28,0.72,0.72,{fill:i%2?C.white:C.pale,line:C.line}); s.text("核心教师",x+1.1,y+0.32,1.55,0.28,{size:15,color:C.navy,bold:true}); s.text("课程方向 / 学科 /\n升学支持",x+1.1,y+0.7,1.55,0.42,{size:10.5,color:C.gray,lh:1.15}); }}));
  slides.push(standard("Student Support", "学生成长与升学服务体系", "课程之外，学校提供学习管理、活动拓展、升学规划和生活支持。", ++n, s => { [["学生导师课","通过学生导师帮助同伴适应学习和生活"],["模拟联合国","培养辩论、沟通、领导力与全球视野"],["个性化辅导","第7节后自选辅导、小组课堂、按需走班，补强真实所需能力"],["住宿管理","晚自习、手机管理、宿舍巡访与家校反馈"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.8+Math.floor(i/2)*2.2,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));
  slides.push(standard("University Guidance Center", "升学指导中心", "从选课程到拿录取，帮助学生把目标国家、专业方向、申请材料和时间节点统一管理。", ++n, s => { [["01","入学评估"],["02","课程匹配"],["03","目标院校"],["04","语言考试"],["05","材料文书"],["06","面试签证"]].forEach((it,i)=>{const x=0.9+i*2.65; s.shape("roundRect",x,3.3,2.1,1.75,{fill:C.light,adj:6000}); s.text(it[0],x+0.35,3.62,1.4,0.4,{size:28,color:[C.navy,C.cyan,C.gold,C.navy,C.cyan,C.gold][i],bold:true,align:"center"}); s.text(it[1],x+0.25,4.25,1.6,0.3,{size:14,color:C.navy,bold:true,align:"center"}); if(i<5)s.connector(x+2.15,4.08,x+2.55,4.08,{color:C.gold,lw:2,arrow:true});}); }));
  slides.push(standard("Campus Life", "校园生活", "真实的课堂、活动和校园生活，让学生在学术之外拥有完整的高中成长体验。", ++n, s => { [["sports","活动与社团","运动会、社团、国际文化交流与兴趣发展。"],["culture","文化与表达","多语种、非遗、跨文化体验共同支撑综合素养。"],["graduation","成长与毕业","用真实场景呈现学生在校成长与阶段成果。"]].forEach((it,i)=>{const x=1.0+i*5.35; s.image(it[0],x,2.6,4.6,2.4,{round:true}); card(s,x,5.25,4.6,1.35,it[1],it[2],[C.navy,C.cyan,C.gold][i]);}); }));

  slides.push(standard("Admission Assessment", "入学评估与路径建议", "入学不是简单报名，而是先判断孩子适合哪一条课程路线。", ++n, s => { [["1对1学业评估","了解学生英语/小语种基础、数学与学科能力、学习习惯和目标国家。"],["课程路径建议","根据评估结果匹配OSSD、AP、日韩、IGCSE/A-Level或新加坡方向。"],["阶段成长规划","为学生制定入学后语言、学科、考试和升学节点安排。"]].forEach((it,i)=>card(s,1.2+i*5.3,3.0,4.6,2.55,it[0],it[1],[C.navy,C.cyan,C.gold][i])); }));
  slides.push(standard("Ongoing Support", "入学后的持续跟踪指导", "从入学到申请，每个阶段都需要持续反馈和动态调整。", ++n, s => { [["学习进度跟踪","阶段测试、课堂表现、作业反馈"],["语言能力跟踪","托福/雅思/TOPIK/JLPT等考试规划"],["家校沟通","班主任、导师、升学老师多方同步"],["方向动态调整","根据成绩、兴趣和目标院校变化调整路径"]].forEach((it,i)=>card(s,1.1+(i%2)*8.0,2.8+Math.floor(i/2)*2.2,7.1,1.65,it[0],it[1],[C.navy,C.cyan,C.gold,C.navy][i])); }));
  slides.push(standard("Admission Requirements", "招生对象与报名流程", "适合有国际课程升学需求，希望在高中阶段完成多路径规划的学生。", ++n, s => table(s,1.4,2.75,[3.4,5.0,6.7],[0.62,1.1,1.1,1.1],[["项目","内容","说明"],["招生对象","初三在读、初中毕业、高中在读学生","不同课程按目标国家、语言基础和学科能力匹配"],["入学评估","学业测试 + 面试 + 课程咨询","评估英语/小语种、数学、综合学习能力与目标方向"],["报名流程","预约咨询 → 入学评估 → 路径建议 → 确认课程 → 办理入读","由招生与课程团队共同完成"]],{size:10.5})));
  slides.push(standard("Fee Policy", "费用信息", "学费、住宿、餐食及其他费用以学校最终公示和招生办确认为准。", ++n, s => table(s,2.1,2.9,[3.9,3.9,3.9,3.9],[0.72,1.05,1.05,1.05,1.05],[["课程方向","学费","住宿/餐食","备注"],["OSSD中加课程","咨询招生办公室","按学校公示执行","以当年招生政策为准"],["AP国际课程","咨询招生办公室","按学校公示执行","以当年招生政策为准"],["日韩/新加坡方向","咨询招生办公室","按学校公示执行","以当年招生政策为准"],["IGCSE/A-Level","咨询招生办公室","按学校公示执行","以当年招生政策为准"]],{align:"center",size:11})));
  { const s = new Slide(C.navy); s.image("cover",0,0,SLIDE_W,SLIDE_H); s.shape("rect",0,0,SLIDE_W,SLIDE_H,{fill:C.navy,alpha:78000}); s.text("Schedule Your Campus Tour",1.1,2.35,7.5,0.35,{size:18,color:C.gold,bold:true}); s.text("预约访校",1.1,3.25,6.0,0.8,{size:48,color:C.white,bold:true}); s.text("深圳市罗湖区布心路2040号",1.1,5.15,7.2,0.45,{size:22,color:C.white,alpha:85000}); s.text("招生办公室：0755-25805707 / 0755-25813956\n欢迎预约访校，获取个性化课程规划建议",1.1,6.45,8.5,0.85,{size:20,color:C.white,alpha:85000,lh:1.45}); s.text("OXSTAND International",12.2,9.18,4.0,0.3,{size:16,color:C.gold,alpha:50000,align:"right"}); slides.push(s); }

  return slides;
}

function slideXml(s) {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr>${solid(s.bg)}</p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${s.parts.join("")}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

async function makePptx(slides) {
  const zip = new JSZip();
  const media = [];
  slides.forEach(slide => slide.rels.forEach(r => { const ext = extOf(r.file); const name = `image${media.length + 1}.${ext}`; media.push({ ...r, name, ext }); r.target = name; }));
  zip.file("[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpg" ContentType="image/jpeg"/><Default Extension="png" ContentType="image/png"/><Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/><Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/><Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/><Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>${slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>`).join("")}</Types>`);
  zip.file("_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/></Relationships>`);
  zip.file("ppt/presentation.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster1"/></p:sldMasterIdLst><p:sldIdLst>${slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${i + 1}"/>`).join("")}</p:sldIdLst><p:sldSz cx="${CX}" cy="${CY}" type="wide"/><p:notesSz cx="${CY}" cy="${CX}"/></p:presentation>`);
  zip.file("ppt/_rels/presentation.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${slides.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("")}<Relationship Id="rIdMaster1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/slideMasters/slideMaster1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/><p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles></p:sldMaster>`);
  zip.file("ppt/slideMasters/_rels/slideMaster1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/></Relationships>`);
  zip.file("ppt/slideLayouts/slideLayout1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank" preserve="1"><p:cSld name="Blank"><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr></p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sldLayout>`);
  zip.file("ppt/slideLayouts/_rels/slideLayout1.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/></Relationships>`);
  zip.file("ppt/theme/theme1.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Oxstand Reference Style"><a:themeElements><a:clrScheme name="Oxstand"><a:dk1><a:srgbClr val="${C.navy}"/></a:dk1><a:lt1><a:srgbClr val="FFFFFF"/></a:lt1><a:dk2><a:srgbClr val="${C.dark}"/></a:dk2><a:lt2><a:srgbClr val="${C.light}"/></a:lt2><a:accent1><a:srgbClr val="${C.cyan}"/></a:accent1><a:accent2><a:srgbClr val="${C.gold}"/></a:accent2><a:accent3><a:srgbClr val="${C.navy}"/></a:accent3><a:accent4><a:srgbClr val="${C.green}"/></a:accent4><a:accent5><a:srgbClr val="${C.red}"/></a:accent5><a:accent6><a:srgbClr val="${C.pale}"/></a:accent6><a:hlink><a:srgbClr val="${C.cyan}"/></a:hlink><a:folHlink><a:srgbClr val="${C.gold}"/></a:folHlink></a:clrScheme><a:fontScheme name="Oxstand"><a:majorFont><a:latin typeface="${font}"/><a:ea typeface="${font}"/></a:majorFont><a:minorFont><a:latin typeface="${font}"/><a:ea typeface="${font}"/></a:minorFont></a:fontScheme><a:fmtScheme name="Oxstand"><a:fillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:fillStyleLst><a:lnStyleLst><a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val="phClr"/></a:solidFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>`);
  let mediaIdx = 0;
  slides.forEach((slide, i) => {
    zip.file(`ppt/slides/slide${i + 1}.xml`, slideXml(slide));
    const rels = slide.rels.map(r => {
      const m = media[mediaIdx++];
      zip.file(`ppt/media/${m.name}`, fs.readFileSync(m.file));
      return `<Relationship Id="${r.rId}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/${m.name}"/>`;
    }).join("");
    zip.file(`ppt/slides/_rels/slide${i + 1}.xml.rels`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdLayout" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>${rels}</Relationships>`);
  });
  fs.writeFileSync(outPptx, await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }));
}

const slides = buildSlides();
await makePptx(slides);
fs.writeFileSync(outMd, `# 可编辑版参考风格PPT\n\n- 输出PPT：${outPptx}\n- 页数：${slides.length}\n- 说明：本版使用可编辑文本框、形状、线条、表格和图片，不再使用整页图片作为页面主体。配色参考“深圳奥斯翰外国语学校 国际部招生手册.pptx”的深蓝、亮蓝、金色体系。\n`, "utf8");
console.log(`Generated ${outPptx}`);
console.log(`Slides: ${slides.length}`);
