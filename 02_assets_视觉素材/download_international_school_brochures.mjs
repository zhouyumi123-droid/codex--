import fs from "fs";
import path from "path";

const outRoot = "D:/codex/cdx-IDE/projects/奥斯翰国际学校/02_assets_视觉素材/国际学校招生宣传册_外网参考_2026-06-04";
fs.mkdirSync(outRoot, { recursive: true });

const items = [
  {
    folder: "01_Australian_International_School_Singapore",
    school: "Australian International School Singapore",
    url: "https://www.ais.com.sg/wp-content/uploads/sites/17/2022/05/AIS-Prospectus-Jan_2026_web.pdf",
    file: "AIS_Singapore_Prospectus_2026.pdf",
    notes: "完整 prospectus；含学校愿景、课程路径、学生支持、wellbeing、EAL、升学路径。"
  },
  {
    folder: "02_SPGS_International_School_Bangkok",
    school: "SPGS International School Bangkok",
    url: "https://www.spgsibangkok.com/assets/pdf/SPGSI_Bangkok_Prospectus.pdf",
    file: "SPGS_Bangkok_Prospectus.pdf",
    notes: "高端招生册；含学校定位、校长寄语、价值观、课程、wellbeing、招生流程。"
  },
  {
    folder: "03_Adelaide_International_School",
    school: "Adelaide International School",
    url: "https://ais.edu.au/wp-content/uploads/2025/03/AIS-Prospectus-2025-v1.8-compressed.pdf",
    file: "Adelaide_International_School_Prospectus_2025.pdf",
    notes: "完整 prospectus；含课程、个性化学习、wellbeing、管理支持、升学/职业规划。"
  },
  {
    folder: "04_St_Pauls_School_Queensland",
    school: "St Paul's School Queensland",
    url: "https://www.stpauls.qld.edu.au/wp-content/uploads/2022/09/SPS-International-Prospectus-2022-WEB.pdf",
    file: "St_Pauls_International_Prospectus_2022.pdf",
    notes: "国际学生 prospectus；含学校介绍、教学、wellbeing、寄宿/支持与国际学生服务。"
  },
  {
    folder: "05_European_International_School_HCMC",
    school: "European International School Ho Chi Minh City",
    url: "https://www.eishcmc.com/sites/school73/files/2026-05/eis_prospectus_0.pdf",
    file: "EIS_HCMC_School_Prospectus.pdf",
    notes: "完整 school prospectus；含 IB PYP/MYP/DP、校园、学生支持、招生与奖学金。"
  },
  {
    folder: "06_Mont_Kiara_International_School",
    school: "Mont'Kiara International School",
    url: "https://www.mkis.edu.my/assets/uploads/docs/MKIS-Prospectus-2021-2022.pdf",
    file: "MKIS_Prospectus_2021_2022.pdf",
    notes: "完整 prospectus；含 PYP/MYP/DP、EAL、Learning Support、活动、设施、招生FAQ、费用。"
  },
  {
    folder: "07_British_International_School_HCMC",
    school: "British International School Ho Chi Minh City",
    url: "https://studyinternational.com/wp-content/uploads/2021/03/BIS_prospectus-2019.pdf",
    file: "BIS_HCMC_Prospectus_2019.pdf",
    notes: "完整 prospectus；英式课程、IGCSE、IBDP、学校介绍、学生生活。"
  },
  {
    folder: "08_International_School_of_Florence",
    school: "International School of Florence",
    url: "https://resources.finalsite.net/images/v1724313781/isfitalyorg/fnybi06sfwzodljr2im5/ISFProspectus.pdf",
    file: "International_School_of_Florence_Prospectus.pdf",
    notes: "完整 prospectus；含学校介绍、国际化定位、课程体系与学生体验。"
  },
  {
    folder: "09_Hua_Hin_International_School",
    school: "Hua Hin International School",
    url: "https://resources.finalsite.net/images/v1764226105/huahinschoolcom/zxo1jxpp7qs5z7rz22cz/SchoolProspectus_25-26.pdf",
    file: "Hua_Hin_International_School_Prospectus_2025_2026.pdf",
    notes: "完整 school prospectus；含学校介绍、课程、校园生活、招生信息。"
  },
  {
    folder: "10_American_International_School_Guangzhou",
    school: "American International School of Guangzhou",
    url: "https://resources.finalsite.net/images/v1743994969/aisgzorg/vf8eecjomkp476lrir5d/AISG_Secondary_Prospectus_2025.pdf",
    file: "AISG_Secondary_Prospectus_2025.pdf",
    notes: "Secondary prospectus；含中学概览、课程、学生支持、升学/大学申请信息。"
  },
  {
    folder: "11_Ecolint_International_School_of_Geneva",
    school: "Ecolint - International School of Geneva",
    url: "https://www.ecolint.ch/en/file-download/download/public/469",
    file: "Ecolint_Prospectus.pdf",
    notes: "完整 prospectus；国际学校标杆，参考整体内容组织与国际化表达。"
  },
  {
    folder: "12_SCOTS_PGC_College",
    school: "SCOTS PGC College",
    url: "https://www.scotspgc.com.au/wp-content/uploads/2025/02/SCOTS-PGC-International-Prospectus-FINAL.pdf",
    file: "SCOTS_PGC_International_Prospectus.pdf",
    notes: "International prospectus；含国际学生招生、课程、住宿/服务、校园体验。"
  },
  {
    folder: "13_International_School_of_the_Sacred_Heart_Tokyo",
    school: "International School of the Sacred Heart Tokyo",
    url: "https://www.issh.ac.jp/uploaded/Boarding_Oct.2023.pdf",
    file: "ISSH_Tokyo_Boarding_Prospectus.pdf",
    notes: "寄宿项目 prospectus；不是全校总册，但设计和服务体系表达可参考。"
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

const summary = [];
for (const item of items) {
  summary.push(await download(item));
}

const okCount = summary.filter(item => item.status === "OK").length;
const lines = [
  "# 国际学校招生宣传册外网参考",
  "",
  `- Downloaded OK: ${okCount} / ${items.length}`,
  "- Date: 2026-06-04",
  `- Root: ${outRoot}`,
  "",
  "## 清单",
  ""
];

for (const item of summary) {
  lines.push(`### ${item.school}`);
  lines.push(`- Folder: \`${item.folder}\``);
  lines.push(`- File: \`${item.file}\``);
  lines.push(`- Status: ${item.status}`);
  lines.push(`- Size: ${item.sizeBytes} bytes`);
  lines.push(`- Source: ${item.url}`);
  lines.push(`- Notes: ${item.notes}`);
  lines.push("");
}

lines.push("## 使用提醒");
lines.push("");
lines.push("- 这些文件仅用于内部设计参考，不建议复制原文案、摄影或完整版式。");
lines.push("- 蓝紫色系、摄影主导、强留白、信息层级、服务体系表达，是主要借鉴方向。");
lines.push("- 后续可再筛选 3-5 个最适合奥斯翰的风格，做成 moodboard。");

fs.writeFileSync(path.join(outRoot, "README.md"), lines.join("\r\n"), "utf8");
fs.writeFileSync(path.join(outRoot, "download_manifest.json"), JSON.stringify(summary, null, 2), "utf8");

console.log(`Done. OK: ${okCount} / ${items.length}`);
console.log(outRoot);
