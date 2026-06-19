import fs from "fs";
import path from "path";
import JSZip from "jszip";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas, loadImage } from "@napi-rs/canvas";

const projectRoot = "D:/codex/cdx-IDE/projects/奥斯翰国际学校";
const workRoot = path.join(projectRoot, "03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付");
const sourceRoot = path.join(projectRoot, "01_source_materials_原始资料/资料文档");
const round2 = path.join(workRoot, "二轮补充资料");
const outRoot = path.join(workRoot, "05_总招生手册_初稿图文版");
const assetDir = path.join(outRoot, "assets");
const refDir = path.join(outRoot, "reference_previews");
const extractDir = path.join(outRoot, "extracted_inputs");

for (const dir of [outRoot, assetDir, refDir, extractDir]) fs.mkdirSync(dir, { recursive: true });

function xmlText(s = "") {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function extractXlsx(file, outName) {
  if (!fs.existsSync(file)) return;
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const sharedXml = await zip.file("xl/sharedStrings.xml")?.async("string");
  const shared = [];
  if (sharedXml) {
    const items = sharedXml.match(/<si[\s\S]*?<\/si>/g) || [];
    for (const item of items) shared.push(xmlText(item));
  }
  const workbook = await zip.file("xl/workbook.xml")?.async("string");
  const rels = await zip.file("xl/_rels/workbook.xml.rels")?.async("string");
  const relMap = new Map();
  for (const m of rels?.matchAll(/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g) || []) {
    relMap.set(m[1], m[2].replace(/^\/?xl\//, ""));
  }
  const sheets = [];
  for (const m of workbook?.matchAll(/<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g) || []) {
    sheets.push({ name: m[1], target: relMap.get(m[2]) });
  }
  const lines = [`# ${path.basename(file)}`];
  for (const sheet of sheets) {
    const xml = await zip.file(`xl/${sheet.target}`)?.async("string");
    if (!xml) continue;
    lines.push(`\n## ${sheet.name}`);
    const rows = xml.match(/<row[\s\S]*?<\/row>/g) || [];
    for (const row of rows) {
      const cells = [];
      for (const c of row.matchAll(/<c([^>]*)>([\s\S]*?)<\/c>/g)) {
        const attrs = c[1];
        const body = c[2];
        const value = (body.match(/<v>([\s\S]*?)<\/v>/) || [])[1] || "";
        const inline = (body.match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1] || "";
        let text = inline ? xmlText(inline) : value;
        if (/t="s"/.test(attrs)) text = shared[Number(value)] || "";
        text = xmlText(text);
        if (text) cells.push(text);
      }
      if (cells.length) lines.push(cells.join(" | "));
    }
  }
  fs.writeFileSync(path.join(extractDir, outName), lines.join("\n"), "utf8");
}

async function extractPdfText(file, outName, maxPages = 80) {
  if (!fs.existsSync(file)) return;
  const data = new Uint8Array(fs.readFileSync(file));
  const pdf = await pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false }).promise;
  const lines = [`# ${path.basename(file)}`, `Pages: ${pdf.numPages}`];
  for (let i = 1; i <= Math.min(pdf.numPages, maxPages); i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    if (text) lines.push(`\n[PAGE ${i}]\n${text}`);
  }
  fs.writeFileSync(path.join(extractDir, outName), lines.join("\n"), "utf8");
}

async function renderPdfPreview(file, prefix, pages = [1, 2, 3]) {
  if (!fs.existsSync(file)) return;
  const data = new Uint8Array(fs.readFileSync(file));
  const pdf = await pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false }).promise;
  for (const pageNo of pages.filter((n) => n <= pdf.numPages)) {
    try {
      const page = await pdf.getPage(pageNo);
      const viewport = page.getViewport({ scale: 1.2 });
      const canvas = createCanvas(Math.round(viewport.width), Math.round(viewport.height));
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
      fs.writeFileSync(path.join(refDir, `${prefix}_p${pageNo}.png`), await canvas.encode("png"));
    } catch (error) {
      fs.writeFileSync(
        path.join(refDir, `${prefix}_p${pageNo}_render_skipped.txt`),
        `Preview render skipped: ${error.message}`,
        "utf8",
      );
    }
  }
}

async function makeContactSheet(files, outName, thumbW = 260, thumbH = 180) {
  const loaded = [];
  for (const file of files) {
    try {
      const img = await loadImage(file);
      loaded.push({ file, img });
    } catch {
      // Skip unreadable files.
    }
    if (loaded.length >= 40) break;
  }
  const cols = 4;
  const labelH = 42;
  const rows = Math.ceil(loaded.length / cols);
  const canvas = createCanvas(cols * thumbW, rows * (thumbH + labelH));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f5f2ea";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "16px Arial";
  ctx.fillStyle = "#1d2b3a";
  for (let i = 0; i < loaded.length; i++) {
    const { file, img } = loaded[i];
    const x = (i % cols) * thumbW;
    const y = Math.floor(i / cols) * (thumbH + labelH);
    const scale = Math.max(thumbW / img.width, thumbH / img.height);
    const sw = thumbW / scale;
    const sh = thumbH / scale;
    const sx = (img.width - sw) / 2;
    const sy = (img.height - sh) / 2;
    ctx.drawImage(img, sx, sy, sw, sh, x, y, thumbW, thumbH);
    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.fillRect(x, y + thumbH, thumbW, labelH);
    ctx.fillStyle = "#1d2b3a";
    const name = path.basename(file);
    ctx.fillText(name.slice(0, 30), x + 8, y + thumbH + 25);
  }
  fs.writeFileSync(path.join(refDir, outName), await canvas.encode("png"));
}

async function copyAsset(src, destName, maxW = 1800) {
  if (!fs.existsSync(src)) return null;
  const img = await loadImage(src);
  const scale = Math.min(1, maxW / img.width);
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  const canvas = createCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, w, h);
  const dest = path.join(assetDir, destName);
  fs.writeFileSync(dest, await canvas.encode("jpeg", 85));
  return dest;
}

function listImages(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .map((f) => path.join(dir, f));
}

await Promise.all([
  extractXlsx(path.join(round2, "aleezer IG A-Level_册子结构.xlsx"), "aleezer_IG_A-Level_册子结构.txt"),
  extractXlsx(path.join(workRoot, "04_课程卖点统筹/金校最终补充清单.xlsx"), "金校最终补充清单.txt"),
  extractPdfText(path.join(round2, "深圳奥斯翰外语学校2025-2026学费收费公示.pdf"), "深圳奥斯翰外语学校2025-2026学费收费公示.txt", 10),
  extractPdfText(path.join(sourceRoot, "A-Level.pdf"), "参考_A-Level横版册.txt", 20),
  extractPdfText(path.join(sourceRoot, "传单版/OIS-ALevel-sure.pdf"), "参考_OIS-ALevel竖版传单.txt", 20),
]);

await renderPdfPreview(path.join(sourceRoot, "A-Level.pdf"), "ref_A-Level_landscape", [1, 2, 3, 4]);
await renderPdfPreview(path.join(sourceRoot, "传单版/OIS-ALevel-sure.pdf"), "ref_OIS_ALevel_portrait", [1, 2, 3, 4]);

const photoMain = listImages(path.join(round2, "相片/相片"));
const photoNew = listImages(path.join(round2, "过往照片资料2"));
const ossd = listImages(path.join(round2, "OSSD特点和优势"));
await makeContactSheet(photoMain.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size), "contact_main_photos.png");
await makeContactSheet(photoNew.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size), "contact_new_photos.png");
await makeContactSheet(ossd, "contact_ossd_images.png");

const selected = {
  cover: path.join(round2, "相片/相片/学校图-正门2.jpg"),
  campus1: path.join(round2, "相片/相片/GW2A 5341.jpg"),
  campus2: path.join(round2, "相片/相片/GW2A5449.jpg"),
  class1: path.join(round2, "相片/相片/日老师授课 (2).jpg"),
  activity1: path.join(round2, "相片/相片/开场起立.JPG"),
  japan1: path.join(round2, "相片/相片/日本课程游学-1.jpg"),
  japan2: path.join(round2, "相片/相片/日本游学-3.jpg"),
  graduation: path.join(round2, "相片/相片/毕业相.jpg"),
  group: path.join(round2, "相片/相片/CIEP毕业生合照.JPG"),
  sports: path.join(round2, "相片/相片/运动会.jpg"),
  culture: path.join(round2, "相片/相片/非遗进校01.JPG"),
  ossd1: path.join(round2, "OSSD特点和优势/图片1.jpg"),
  ossd2: path.join(round2, "OSSD特点和优势/图片2.png"),
  bond1: path.join(round2, "邦德照片/IMG_0646.JPG"),
  bond2: path.join(round2, "邦德照片/DSCF0752.JPG"),
};

const copied = {};
for (const [key, src] of Object.entries(selected)) {
  try {
    const dest = await copyAsset(src, `${key}.jpg`);
    if (dest) copied[key] = path.relative(outRoot, dest).replaceAll("\\", "/");
  } catch {
    // Leave missing assets out; the brochure generator has fallbacks.
  }
}

fs.writeFileSync(path.join(outRoot, "asset_manifest.json"), JSON.stringify(copied, null, 2), "utf8");
console.log(`Prepared brochure assets in ${outRoot}`);
