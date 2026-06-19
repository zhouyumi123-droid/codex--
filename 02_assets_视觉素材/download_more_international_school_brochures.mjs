import fs from "fs";
import path from "path";

const outRoot = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/02_assets_视觉素材/国际学校招生宣传册_外网参考_2026-06-04";
fs.mkdirSync(outRoot, { recursive: true });

const items = [
  {
    folder: "14_UWC_East_Africa",
    school: "UWC East Africa",
    url: "https://www.uwcea.org/wp-content/docs/InfoPack.pdf",
    file: "UWC_East_Africa_InfoPack.pdf",
    notes: "UWC信息包；含IB PYP/MYP/DP、住宿、户外教育、学生支持、社区与升学。"
  },
  {
    folder: "15_BSC_Boarding_School",
    school: "BSC Boarding School",
    url: "https://studyinternational.s3.eu-west-2.amazonaws.com/BSC-Boarding-Prospectus-Digital.pdf",
    file: "BSC_Boarding_Prospectus_Digital.pdf",
    notes: "寄宿学校 prospectus；含住宿管理、学生服务、校园生活和课程信息，视觉较完整。"
  },
  {
    folder: "16_Regent_Hill_International_School",
    school: "Regent Hill International School",
    url: "https://rhis.ac.bw/dist/documents/2025/2025%20Moleps%20Secondary.pdf",
    file: "Regent_Hill_International_School_Secondary_Prospectus_2025.pdf",
    notes: "Cambridge international education secondary prospectus；含课程、招生、校园支持。"
  },
  {
    folder: "17_Takshila_International_School",
    school: "Takshila International School",
    url: "https://takshilamandi.edu.in/wp-content/uploads/2025/03/Takshila-Prospectus.pdf",
    file: "Takshila_International_School_Prospectus.pdf",
    notes: "完整 prospectus；含学校介绍、课程、校园设施、活动和招生信息。"
  },
  {
    folder: "18_Baridhara_Scholars_International_School_and_College",
    school: "Baridhara Scholars' International School and College",
    url: "https://bsidhaka.edu.bd/wp-content/uploads/2025/01/prospectus.pdf",
    file: "BSISC_Prospectus.pdf",
    notes: "完整 prospectus；可参考课程、管理、活动、招生说明等结构。"
  },
  {
    folder: "19_Thonon_International_School",
    school: "Thonon International School",
    url: "https://ecb0177c26.clvaw-cdnwnd.com/15dd470fcbd55b54733c2ec4bc636bdb/200000880-3692f36931/School%20brochure%202022-2023-0.pdf?ph=ecb0177c26",
    file: "Thonon_International_School_Brochure_2022_2023.pdf",
    notes: "双语国际学校 brochure；规模较小，但可参考精简型招生册结构。"
  },
  {
    folder: "20_Bavarian_International_School",
    school: "Bavarian International School",
    url: "https://resources.finalsite.net/images/v1678883071/bavarianis/xsfleuhbzkhb0ocekp4e/SchoolProspectus2023-2024.pdf",
    file: "Bavarian_International_School_Prospectus_2023_2024.pdf",
    notes: "BIS school prospectus/fees document；偏收费和政策，可补充费用/条款/管理信息参考。"
  },
  {
    folder: "21_SJI_International_Singapore",
    school: "SJI International Singapore",
    url: "https://resources.finalsite.net/images/v1770185042/sjiinternationalcomsg/vyncghn5ye3qt2jfulis/HS_Prospectus_2027.pdf",
    file: "SJI_International_Singapore_High_School_Prospectus_2027.pdf",
    notes: "High School prospectus；含IB Diploma、课程路径、大学升学、学生发展和服务体系，适合高中国际部参考。"
  }
];

function sourceMarkdown(item, status, size) {
  return `# ${item.school}

- Source URL: ${item.url}
- Local PDF: ${item.file}
- Status: ${status}
- Size: ${size} bytes
- Notes: ${item.notes}

Use: 招生宣传册/展会物料设计参考。请勿直接复制原设计、图片或文字。
`;
}

async function download(item) {
  const dir = path.join(outRoot, item.folder);
  fs.mkdirSync(dir, { recursive: true });
  const target = path.join(dir, item.file);
  let status = "FAILED";
  let size = 0;
  try {
    console.log(`Downloading ${item.school}`);
    const res = await fetch(item.url, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/pdf,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const body = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(target, body);
    size = body.length;
    status = size > 1024 ? "OK" : "SMALL_FILE_CHECK";
  } catch (err) {
    status = `FAILED: ${err.message}`;
  }
  fs.writeFileSync(path.join(dir, "SOURCE.md"), sourceMarkdown(item, status, size), "utf8");
  return { ...item, status, sizeBytes: size };
}

const supplement = [];
for (const item of items) supplement.push(await download(item));

fs.writeFileSync(path.join(outRoot, "download_manifest_supplement.json"), JSON.stringify(supplement, null, 2), "utf8");

const allPdfs = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    if (entry.isFile() && entry.name.toLowerCase().endsWith(".pdf")) {
      const stat = fs.statSync(full);
      if (stat.size > 1024) allPdfs.push({ file: full, size: stat.size });
    }
  }
}
walk(outRoot);

const lines = [
  "# 已成功下载 PDF 总表",
  "",
  `- Total valid PDFs: ${allPdfs.length}`,
  "- Date: 2026-06-04",
  "",
  "## Files",
  ""
];
allPdfs.sort((a, b) => a.file.localeCompare(b.file, "zh-CN"));
for (const item of allPdfs) {
  lines.push(`- ${path.relative(outRoot, item.file).replaceAll("\\", "/")} (${item.size} bytes)`);
}
fs.writeFileSync(path.join(outRoot, "ALL_DOWNLOADED_FILES.md"), lines.join("\r\n"), "utf8");

console.log(`Supplement done. Valid PDFs now: ${allPdfs.length}`);
console.log(outRoot);
