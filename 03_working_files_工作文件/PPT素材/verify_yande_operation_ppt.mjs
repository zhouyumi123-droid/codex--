import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JSZip from "jszip";

const dir = path.dirname(fileURLToPath(import.meta.url));
const jsonFile = process.argv[2] || path.join(dir, "衍德运营方案_PPT抽取文本.json");
const pptFile = process.argv[3] || path.join(dir, "衍德教育科技有限公司2026年9月-2027年9月运营方案_简约高级排版.pptx");

function decodeXml(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function norm(s) {
  return s.replace(/\s+/g, "").trim();
}

async function main() {
  const outline = JSON.parse(fs.readFileSync(jsonFile, "utf8"));
  const source = [];
  source.push(outline.sections[0].title);
  for (const sec of outline.sections) {
    if (sec !== outline.sections[0]) source.push(sec.title);
    for (const it of sec.items) {
      if (it.type === "p") source.push(it.text);
      if (it.type === "table") it.rows.forEach((r) => r.forEach((c) => source.push(c)));
    }
  }

  const zip = await JSZip.loadAsync(fs.readFileSync(pptFile));
  const slideFiles = Object.keys(zip.files)
    .filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))
    .sort((a, b) => Number(a.match(/slide(\d+)/)[1]) - Number(b.match(/slide(\d+)/)[1]));
  const parts = [];
  for (const f of slideFiles) {
    const xml = await zip.file(f).async("string");
    const re = /<a:t>([\s\S]*?)<\/a:t>/g;
    let m;
    while ((m = re.exec(xml))) parts.push(decodeXml(m[1]));
  }
  const deck = norm(parts.join(""));
  const missing = source.filter((s) => s && !deck.includes(norm(s)));
  console.log(JSON.stringify({ slides: slideFiles.length, sourceItems: source.length, missing }, null, 2));
  if (missing.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
