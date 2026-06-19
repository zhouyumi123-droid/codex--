const fs = require("fs");
const path = require("path");

const work = process.argv[2];
if (!work) {
  console.error("Usage: node tools/restyle_ois_pptx.js <unpacked-dir>");
  process.exit(1);
}

const slideDir = path.join(work, "ppt", "slides");
const slideFiles = fs.readdirSync(slideDir)
  .filter(f => /^slide\d+\.xml$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

const C = {
  ink: "23104F",
  purple: "3A1A70",
  royal: "55308F",
  amethyst: "7A56B3",
  gold: "C8A24A",
  gold2: "E5C875",
  ivory: "FBF7EC",
  paper: "FFFDF7",
  mist: "F1EAF8",
  lavender: "E7DDF2",
  slate: "382E48",
  muted: "716880",
  white: "FFFFFF"
};

const W = 16256000;
const H = 9144000;

function slideNo(file) {
  return Number(path.basename(file).match(/^slide(\d+)\.xml$/)[1]);
}

function maxId(xml) {
  let max = 1000;
  for (const m of xml.matchAll(/<p:cNvPr\s+id="(\d+)"/g)) max = Math.max(max, Number(m[1]));
  return max;
}

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function shape(id, name, x, y, cx, cy, fill, opts = {}) {
  const alpha = opts.alpha ? `<a:alpha val="${opts.alpha}"/>` : "";
  const ln = opts.line
    ? `<a:ln w="${opts.line.w || 9144}"><a:solidFill><a:srgbClr val="${opts.line.color}">${opts.line.alpha ? `<a:alpha val="${opts.line.alpha}"/>` : ""}</a:srgbClr></a:solidFill></a:ln>`
    : "<a:ln><a:noFill/></a:ln>";
  const rot = opts.rot ? ` rot="${opts.rot}"` : "";
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${esc(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm${rot}><a:off x="${Math.round(x)}" y="${Math.round(y)}"/><a:ext cx="${Math.round(cx)}" cy="${Math.round(cy)}"/></a:xfrm><a:prstGeom prst="${opts.geom || "rect"}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}">${alpha}</a:srgbClr></a:solidFill>${ln}</p:spPr></p:sp>`;
}

function line(id, name, x, y, cx, cy, color, w = 27432, alpha = "") {
  return shape(id, name, x, y, cx, cy, color, { alpha, line: { color, w, alpha }, geom: "rect" });
}

function watermark(id, text, x, y, cx, cy, size, color, alpha, align = "r") {
  return "";
}

function addUnderlay(xml, shapes) {
  return xml.replace(/(<p:grpSpPr>[\s\S]*?<\/p:grpSpPr>)/, `$1${shapes}`);
}

function setBg(xml, color) {
  const bg = `<p:bg><p:bgPr><a:solidFill><a:srgbClr val="${color}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>`;
  if (/<p:bg>[\s\S]*?<\/p:bg>/.test(xml)) return xml.replace(/<p:bg>[\s\S]*?<\/p:bg>/, bg);
  return xml.replace("<p:cSld>", `<p:cSld>${bg}`);
}

function recolor(xml, dark) {
  const map = new Map([
    ["1B2A5B", dark ? C.purple : C.purple],
    ["18265A", C.ink],
    ["5F499B", C.royal],
    ["D4A843", C.gold],
    ["D5A63A", C.gold],
    ["C7A34A", C.gold],
    ["0E8FD8", C.amethyst],
    ["2459A6", C.royal],
    ["F0F4FA", dark ? C.purple : C.mist],
    ["DFE7F0", C.lavender],
    ["E0E0E0", dark ? C.royal : C.lavender],
    ["333333", dark ? C.ivory : C.slate],
    ["666666", dark ? C.gold2 : C.muted],
    ["627386", dark ? C.gold2 : C.muted],
    ["687180", dark ? C.gold2 : C.muted]
  ]);
  for (const [from, to] of map) {
    xml = xml.replace(new RegExp(`val="${from}"`, "g"), `val="${to}"`);
  }
  return xml;
}

function typography(xml, dark) {
  xml = xml.replace(/typeface="(?:寰[^"]+|Microsoft YaHei UI|Noto Sans CJK SC|Source Han Sans CN Normal)"/g, 'typeface="Microsoft YaHei UI"');
  xml = xml.replace(/<a:rPr\b([^>]*)>/g, (m, attrs) => {
    if (/sz="\d+"/.test(attrs)) return `<a:rPr${attrs}>`;
    return `<a:rPr${attrs} sz="1500">`;
  });
  if (dark) {
    xml = xml.replace(/<a:rPr([^>]*)sz="(3[2-9]\d\d|4\d\d\d|5\d\d\d|6\d\d\d|7\d\d\d|8\d\d\d|9\d\d\d|10\d\d\d)"([^>]*)>/g,
      (m, a, sz, b) => `<a:rPr${a}sz="${sz}" b="1"${b}>`);
  }
  return xml;
}

function sectionUnderlay(startId, n) {
  let id = startId;
  return [
    shape(id++, "OIS deep purple field", 0, 0, W, H, C.ink),
    shape(id++, "OIS royal wash", W * 0.47, 0, W * 0.53, H, C.purple, { alpha: 78000 }),
    shape(id++, "OIS gold vertical", 0, 0, 182880, H, C.gold),
    shape(id++, "OIS gold panel", W - 2438400, 0, 2438400, H, C.gold, { alpha: 14000 }),
    line(id++, "OIS champagne hairline", 914400, 7543800, 2895600, 45720, C.gold, 45720),
    watermark(id++, "OXSTAND", 6130000, 6420000, 9200000, 1280000, 8400, C.white, 8000),
    watermark(id++, String(n).padStart(2, "0"), 13380000, 690000, 1280000, 720000, 3000, C.gold, 82000)
  ].join("");
}

function contentUnderlay(startId, n) {
  let id = startId;
  const variant = n % 3;
  const panelX = variant === 0 ? 914400 : 1280160;
  const panelY = 1234440;
  const panelW = W - panelX - 914400;
  const panelH = H - 2011680;
  return [
    shape(id++, "OIS ivory page", 0, 0, W, H, C.ivory),
    shape(id++, "OIS header band", 0, 0, W, 731520, C.ink),
    shape(id++, "OIS left brand rail", 0, 0, 365760, H, C.purple),
    shape(id++, "OIS gold rail", 365760, 0, 82296, H, C.gold),
    shape(id++, "OIS content plane", panelX, panelY, panelW, panelH, C.paper, {
      line: { color: C.gold, w: 9144, alpha: 50000 }
    }),
    shape(id++, "OIS lavender depth", panelX + 152400, panelY + 152400, panelW, panelH, C.lavender, { alpha: 36000 }),
    line(id++, "OIS footer rule", 1188720, H - 594360, W - 2377440, 18288, C.gold, 18288),
    watermark(id++, "OXSTAND INTERNATIONAL SCHOOL", W - 7430000, 205740, 6096000, 274320, 1120, C.gold, 88000),
    watermark(id++, String(n).padStart(2, "0"), 502920, H - 685800, 548640, 274320, 1200, C.gold, 88000, "l")
  ].join("");
}

function coverUnderlay(startId) {
  let id = startId;
  return [
    shape(id++, "OIS cover purple", 0, 0, W, H, C.ink),
    shape(id++, "OIS cover royal vertical", W * 0.58, 0, W * 0.42, H, C.purple, { alpha: 84000 }),
    shape(id++, "OIS cover gold veil", W * 0.72, 0, W * 0.28, H, C.gold, { alpha: 13000 }),
    shape(id++, "OIS cover crest line", 914400, 731520, 45720, 7223760, C.gold),
    line(id++, "OIS cover title rule", 1005840, 6436360, 1219200, 64008, C.gold, 64008),
    watermark(id++, "OXSTAND", 7600000, 6150000, 8200000, 1300000, 9800, C.white, 7000),
    watermark(id++, "INTERNATIONAL SCHOOL", 950000, 7700000, 7600000, 365760, 1450, C.gold2, 76000, "l")
  ].join("");
}

function endUnderlay(startId) {
  let id = startId;
  return [
    shape(id++, "OIS closing field", 0, 0, W, H, C.ink),
    shape(id++, "OIS closing gold side", 0, 0, 3150000, H, C.gold, { alpha: 18000 }),
    shape(id++, "OIS closing purple plane", 3150000, 0, W - 3150000, H, C.purple, { alpha: 72000 }),
    line(id++, "OIS closing rule", 1005840, 7290000, 3505200, 54864, C.gold, 54864),
    watermark(id++, "OXSTAND", 6460000, 6280000, 8500000, 1260000, 9000, C.white, 8000)
  ].join("");
}

const sectionSlides = new Set([3, 7, 10, 14, 18, 24, 28, 30]);

for (const file of slideFiles) {
  const n = slideNo(file);
  const p = path.join(slideDir, file);
  let xml = fs.readFileSync(p, "utf8");
  let id = maxId(xml) + 1;
  const isCover = n === 1;
  const isEnd = n === slideFiles.length;
  const isSection = sectionSlides.has(n);
  const dark = isCover || isEnd || isSection;
  xml = setBg(xml, dark ? C.ink : C.ivory);
  xml = recolor(xml, dark);
  xml = typography(xml, dark);
  const underlay = isCover ? coverUnderlay(id) : isEnd ? endUnderlay(id) : isSection ? sectionUnderlay(id, n) : contentUnderlay(id, n);
  xml = addUnderlay(xml, underlay);
  fs.writeFileSync(p, xml, "utf8");
}

// Tune the main theme so new edits opened in PowerPoint inherit the same palette.
const themePath = path.join(work, "ppt", "theme", "theme1.xml");
if (fs.existsSync(themePath)) {
  let theme = fs.readFileSync(themePath, "utf8");
  theme = theme
    .replace(/<a:dk1>[\s\S]*?<\/a:dk1>/, `<a:dk1><a:srgbClr val="${C.ink}"/></a:dk1>`)
    .replace(/<a:lt1>[\s\S]*?<\/a:lt1>/, `<a:lt1><a:srgbClr val="${C.ivory}"/></a:lt1>`)
    .replace(/<a:accent1>[\s\S]*?<\/a:accent1>/, `<a:accent1><a:srgbClr val="${C.purple}"/></a:accent1>`)
    .replace(/<a:accent2>[\s\S]*?<\/a:accent2>/, `<a:accent2><a:srgbClr val="${C.gold}"/></a:accent2>`)
    .replace(/<a:accent3>[\s\S]*?<\/a:accent3>/, `<a:accent3><a:srgbClr val="${C.royal}"/></a:accent3>`)
    .replace(/<a:accent4>[\s\S]*?<\/a:accent4>/, `<a:accent4><a:srgbClr val="${C.lavender}"/></a:accent4>`)
    .replace(/<a:latin typeface="[^"]*"\/>/g, `<a:latin typeface="Georgia"/>`)
    .replace(/<a:ea typeface="[^"]*"\/>/g, `<a:ea typeface="Microsoft YaHei UI"/>`);
  fs.writeFileSync(themePath, theme, "utf8");
}

console.log(`restyled=${slideFiles.length}`);
