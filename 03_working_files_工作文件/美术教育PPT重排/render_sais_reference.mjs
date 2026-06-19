import fs from "fs";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const p = "01_source_materials_原始资料/资料文档/SAIS高中-全.pdf";
const out = "03_working_files_工作文件/美术教育PPT重排/reference_pages";
fs.mkdirSync(out, { recursive: true });

const data = new Uint8Array(fs.readFileSync(p));
const doc = await pdfjs.getDocument({
  data,
  disableFontFace: true,
  useWorkerFetch: false,
  isEvalSupported: false,
}).promise;

for (const n of [1, 2, 6, 8, 11, 14, 20, 26, 31, 37]) {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale: 1.5 });
  const canvas = createCanvas(vp.width, vp.height);
  const ctx = canvas.getContext("2d");
  await page.render({ canvasContext: ctx, viewport: vp }).promise;
  fs.writeFileSync(`${out}/sais_page_${String(n).padStart(2, "0")}.png`, canvas.toBuffer("image/png"));
}

console.log(`rendered ${doc.numPages} pages`);
