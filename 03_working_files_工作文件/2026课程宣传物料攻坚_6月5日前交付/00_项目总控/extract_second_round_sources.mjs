import fs from "fs";
import path from "path";
import JSZip from "jszip";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校";
const sourceDir = path.join(root, "01_source_materials_原始资料");
const docDir = path.join(sourceDir, "资料文档");
const outDir = path.join(
  root,
  "03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付/01_任务书与资料/extracted_second_round",
);

const files = [
  path.join(docDir, "奥斯翰邦德OSSD项目招生简章参考内容.docx"),
  path.join(docDir, "国际部简介PPT.pptx"),
  path.join(docDir, "2025深圳奥斯翰外语学校（国际部）.pdf"),
  path.join(docDir, "SAIS高中-全.pdf"),
];

function decodeXml(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function stripXmlText(xml, tag = "t") {
  const parts = [];
  const re = tag === "a:t" ? /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g : /<w:t(?:\s[^>]*)?>([\s\S]*?)<\/w:t>/g;
  for (const m of xml.matchAll(re)) {
    parts.push(decodeXml(m[1]));
  }
  return parts.join(" ").replace(/\s+/g, " ").trim();
}

async function extractDocx(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) throw new Error(`No word/document.xml in ${file}`);
  let text = stripXmlText(documentXml, "w:t");
  text = text.replace(/(。|；|：|！|？)/g, "$1\n");
  const out = path.join(outDir, `${path.basename(file, path.extname(file))}.txt`);
  fs.writeFileSync(out, text, "utf8");
  return out;
}

async function extractPptx(file) {
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const slideFiles = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => Number(a.match(/slide(\d+)/)[1]) - Number(b.match(/slide(\d+)/)[1]));
  const slides = [];
  for (const slideFile of slideFiles) {
    const n = slideFile.match(/slide(\d+)/)[1];
    const xml = await zip.file(slideFile).async("string");
    const text = stripXmlText(xml, "a:t");
    if (text) slides.push(`\n[SLIDE ${n}]\n${text}`);
  }
  const out = path.join(outDir, `${path.basename(file, path.extname(file))}.txt`);
  fs.writeFileSync(out, slides.join("\n"), "utf8");
  return out;
}

async function extractPdf(file) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
  }).promise;
  const maxPages = Math.min(doc.numPages, Number(process.env.PDF_MAX_PAGES || 120));
  const pages = [];
  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    pages.push(`\n[PAGE ${i}]\n${text}`);
  }
  const out = path.join(outDir, `${path.basename(file, path.extname(file))}.txt`);
  fs.writeFileSync(out, pages.join("\n"), "utf8");
  return `${out} (${doc.numPages} pages, extracted ${maxPages})`;
}

fs.mkdirSync(outDir, { recursive: true });

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`MISSING ${file}`);
    continue;
  }
  const ext = path.extname(file).toLowerCase();
  let out;
  if (ext === ".docx") out = await extractDocx(file);
  else if (ext === ".pptx") out = await extractPptx(file);
  else if (ext === ".pdf") out = await extractPdf(file);
  else continue;
  console.log(`${path.basename(file)} -> ${out}`);
}
