import fs from "fs";
import path from "path";
import { createCanvas } from "@napi-rs/canvas";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

const root = "D:/codex/cdx-IDE/projects/奥斯翰国际学校";
const selected = path.join(root, "02_assets_视觉素材", "选中");
const outDir = path.join(selected, "_rendered_reference_pages");
fs.mkdirSync(outDir, { recursive: true });

const jobs = [
  { file: "AIS_Singapore_Prospectus_2026.pdf", pages: [1, 2, 3, 4, 5, 6, 10, 14] },
  { file: "AIS_Admissions_Booklet_2026.pdf", pages: [1, 2, 3, 4, 5, 8] },
  { file: "AIS_At_A_Glance_2026.pdf", pages: [1, 2, 3, 4] },
  { file: "SJI_International_Singapore_High_School_Prospectus_2027.pdf", pages: [1, 2, 3, 4, 8, 12] },
  { file: "SPGS_Bangkok_Prospectus.pdf", pages: [1, 2, 3, 4, 8] },
];

async function renderPage(pdfPath, outPath, pageNo) {
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, disableFontFace: true }).promise;
  if (pageNo > doc.numPages) return false;
  const page = await doc.getPage(pageNo);
  const viewport = page.getViewport({ scale: 1.7 });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, viewport }).promise;
  fs.writeFileSync(outPath, canvas.toBuffer("image/png"));
  return true;
}

const manifest = [];
for (const job of jobs) {
  const pdfPath = path.join(selected, job.file);
  if (!fs.existsSync(pdfPath)) continue;
  const name = path.basename(job.file, ".pdf");
  const dir = path.join(outDir, name);
  fs.mkdirSync(dir, { recursive: true });
  for (const page of job.pages) {
    const out = path.join(dir, `page_${String(page).padStart(2, "0")}.png`);
    try {
      const ok = await renderPage(pdfPath, out, page);
      if (ok) manifest.push({ pdf: job.file, page, out });
    } catch (err) {
      manifest.push({ pdf: job.file, page, error: err.message });
    }
  }
}

fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
console.log(`Rendered pages: ${manifest.filter(x => x.out).length}`);
console.log(outDir);
