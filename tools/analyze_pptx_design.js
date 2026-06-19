const fs = require("fs");
const path = require("path");

const work = process.argv[2];
const out = process.argv[3];
if (!work || !out) {
  console.error("Usage: node tools/analyze_pptx_design.js <unpacked-dir> <out-dir>");
  process.exit(1);
}

fs.mkdirSync(out, { recursive: true });

function slideNo(file) {
  const m = path.basename(file).match(/^slide(\d+)\.xml$/);
  return m ? Number(m[1]) : 0;
}

function matches(text, re) {
  return Array.from(text.matchAll(re));
}

const slideDir = path.join(work, "ppt", "slides");
const slides = fs.readdirSync(slideDir)
  .filter(f => /^slide\d+\.xml$/.test(f))
  .sort((a, b) => slideNo(a) - slideNo(b));

const texts = [];
const shapes = [];
const colors = new Map();
const fonts = new Map();

for (const file of slides) {
  const num = slideNo(file);
  const xml = fs.readFileSync(path.join(slideDir, file), "utf8");
  const t = matches(xml, /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g);
  shapes.push({
    slide: num,
    text_nodes: t.length,
    shapes: matches(xml, /<p:sp[>\s]/g).length,
    pictures: matches(xml, /<p:pic[>\s]/g).length,
    graphic_frames: matches(xml, /<p:graphicFrame[>\s]/g).length
  });
  t.forEach((m, i) => texts.push({ slide: num, node: i, text: m[1] }));
  for (const m of matches(xml, /<a:srgbClr\b[^>]*\bval="([0-9A-Fa-f]{6})"/g)) {
    const c = m[1].toUpperCase();
    colors.set(c, (colors.get(c) || 0) + 1);
  }
  for (const m of matches(xml, /<a:(?:latin|ea|cs)\b[^>]*\btypeface="([^"]+)"/g)) {
    const f = m[1];
    fonts.set(f, (fonts.get(f) || 0) + 1);
  }
}

function sortedMap(map, key) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([k, count]) => ({ [key]: k, count }));
}

fs.writeFileSync(path.join(out, "text-before.json"), JSON.stringify(texts, null, 2), "utf8");
fs.writeFileSync(path.join(out, "shape-summary.json"), JSON.stringify(shapes, null, 2), "utf8");
fs.writeFileSync(path.join(out, "color-summary.json"), JSON.stringify(sortedMap(colors, "color").slice(0, 100), null, 2), "utf8");
fs.writeFileSync(path.join(out, "font-summary.json"), JSON.stringify(sortedMap(fonts, "font"), null, 2), "utf8");
console.log(`slides=${slides.length}; text_nodes=${texts.length}`);
