import fs from "fs";
import path from "path";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

const files = process.argv.slice(2);
for (const file of files) {
  const data = new Uint8Array(fs.readFileSync(file));
  const doc = await pdfjs.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, disableFontFace: true }).promise;
  const pages = [];
  const maxPages = Math.min(doc.numPages, Number(process.env.PDF_MAX_PAGES || 20));
  for (let i = 1; i <= maxPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ").replace(/\s+/g, " ").trim();
    pages.push(`\n[PAGE ${i}]\n${text}`);
  }
  const out = path.join(
    "03_working_files_工作文件/2026课程宣传物料攻坚_6月5日前交付/01_任务书与资料/extracted_pdf_text",
    path.basename(file, path.extname(file)) + ".txt",
  );
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, pages.join("\n"), "utf8");
  console.log(`${path.basename(file)} -> ${out} (${doc.numPages} pages, extracted ${maxPages})`);
}
