const fs = require("fs");
const path = require("path");

const root = process.cwd();
const template = path.join(root, "03_working_files_工作文件", "2026课程宣传物料攻坚_6月5日前交付", "05_总招生手册_初稿图文版", "PPT_横版招生手册SAIS风格V2", "_design_work");
const outDir = path.join(root, "04_outputs_输出结果", "AI智能体商业化项目提案");
const work = path.join(outDir, "_pptx_work");

if (!fs.existsSync(template)) {
  throw new Error(`Template unpacked PPTX not found: ${template}`);
}

function assertInside(p) {
  const resolved = path.resolve(p);
  const base = path.resolve(root);
  if (!resolved.startsWith(base + path.sep)) throw new Error(`Refusing to write outside workspace: ${resolved}`);
}

assertInside(outDir);
assertInside(work);
fs.mkdirSync(outDir, { recursive: true });
if (fs.existsSync(work)) fs.rmSync(work, { recursive: true, force: true });
fs.cpSync(template, work, { recursive: true });

const C = {
  ink: "22104A",
  purple: "3B1D6D",
  royal: "5A37A0",
  violet: "8062B7",
  gold: "C8A24A",
  gold2: "E6C879",
  ivory: "FBF7EC",
  paper: "FFFDF7",
  mist: "EFE7F6",
  lavender: "DFD2EE",
  slate: "372E44",
  muted: "776D82",
  white: "FFFFFF",
  red: "A2394F",
  green: "4E7D68"
};

const W = 16256000;
const H = 9144000;
const SLIDE_CT = "application/vnd.openxmlformats-officedocument.presentationml.slide+xml";

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function sp(id, name, x, y, cx, cy, fill, opts = "") {
  const line = opts.line ? `<a:ln w="${opts.line.w || 9144}"><a:solidFill><a:srgbClr val="${opts.line.color}">${opts.line.alpha ? `<a:alpha val="${opts.line.alpha}"/>` : ""}</a:srgbClr></a:solidFill></a:ln>` : "<a:ln><a:noFill/></a:ln>";
  const alpha = opts.alpha ? `<a:alpha val="${opts.alpha}"/>` : "";
  const geom = opts.geom || "rect";
  const rot = opts.rot ? ` rot="${opts.rot}"` : "";
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${esc(name)}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm${rot}><a:off x="${Math.round(x)}" y="${Math.round(y)}"/><a:ext cx="${Math.round(cx)}" cy="${Math.round(cy)}"/></a:xfrm><a:prstGeom prst="${geom}"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="${fill}">${alpha}</a:srgbClr></a:solidFill>${line}</p:spPr></p:sp>`;
}

function tx(id, name, x, y, cx, cy, paras, opts = {}) {
  const align = opts.align || "l";
  const anchor = opts.anchor || "t";
  const fill = opts.fill ? `<a:solidFill><a:srgbClr val="${opts.fill}"/></a:solidFill>` : "<a:noFill/>";
  const body = paras.map(p => {
    const runs = Array.isArray(p.runs) ? p.runs : [{ text: p.text || "", color: p.color, size: p.size, bold: p.bold }];
    const rXml = runs.map(r => `<a:r><a:rPr lang="zh-CN" sz="${r.size || p.size || 1500}"${r.bold || p.bold ? ' b="1"' : ""}><a:solidFill><a:srgbClr val="${r.color || p.color || opts.color || C.slate}"/></a:solidFill><a:latin typeface="${opts.latin || "Georgia"}"/><a:ea typeface="${opts.ea || "Microsoft YaHei UI"}"/><a:cs typeface="${opts.ea || "Microsoft YaHei UI"}"/></a:rPr><a:t>${esc(r.text)}</a:t></a:r>`).join("");
    return `<a:p><a:pPr algn="${p.align || align}"><a:lnSpc><a:spcPct val="${p.line || 115000}"/></a:lnSpc></a:pPr>${rXml}<a:endParaRPr lang="zh-CN" sz="${p.size || 1500}"/></a:p>`;
  }).join("");
  return `<p:sp><p:nvSpPr><p:cNvPr id="${id}" name="${esc(name)}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="${x}" y="${y}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom>${fill}<a:ln><a:noFill/></a:ln></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="${opts.pad || 0}" tIns="${opts.pad || 0}" rIns="${opts.pad || 0}" bIns="${opts.pad || 0}" anchor="${anchor}"/><a:lstStyle/>${body}</p:txBody></p:sp>`;
}

function bg(dark = false) {
  const base = dark ? C.ink : C.ivory;
  return [
    sp(2, "background", 0, 0, W, H, base),
    sp(3, "left rail", 0, 0, 365760, H, dark ? C.gold : C.purple),
    sp(4, "gold rail", 365760, 0, 91440, H, C.gold),
    sp(5, "top band", 0, 0, W, 685800, dark ? C.purple : C.ink),
    sp(6, "right wash", W * 0.73, 0, W * 0.27, H, dark ? C.purple : C.mist, { alpha: dark ? 54000 : 65000 }),
    sp(7, "footer line", 1150000, H - 560000, W - 2300000, 18288, C.gold, { alpha: 85000 })
  ].join("");
}

function titleBlock(id, eyebrow, title, subtitle, dark = false) {
  const titleColor = dark ? C.white : C.ink;
  const subColor = dark ? C.gold2 : C.muted;
  return [
    tx(id, "eyebrow", 900000, 530000, 6400000, 260000, [{ text: eyebrow, size: 1150, bold: true, color: C.gold }]),
    tx(id + 1, "title", 900000, 900000, 10800000, 1120000, [{ text: title, size: 3300, bold: true, color: titleColor, line: 104000 }]),
    tx(id + 2, "subtitle", 920000, 2050000, 10400000, 500000, [{ text: subtitle, size: 1450, color: subColor, line: 130000 }])
  ].join("");
}

function card(id, x, y, w, h, head, body, accent = C.gold) {
  return [
    sp(id, "card", x, y, w, h, C.paper, { line: { color: C.lavender, w: 9144 } }),
    sp(id + 1, "card accent", x, y, 64000, h, accent),
    tx(id + 2, "card head", x + 180000, y + 150000, w - 320000, 330000, [{ text: head, size: 1550, bold: true, color: C.ink }]),
    tx(id + 3, "card body", x + 180000, y + 520000, w - 320000, h - 620000, [{ text: body, size: 1200, color: C.slate, line: 132000 }])
  ].join("");
}

function pill(id, x, y, w, text, color = C.purple) {
  return [
    sp(id, "pill", x, y, w, 470000, color, { geom: "roundRect" }),
    tx(id + 1, "pill text", x + 120000, y + 105000, w - 240000, 260000, [{ text, size: 1150, bold: true, color: C.white }], { align: "c" })
  ].join("");
}

function slideXml(slide) {
  let id = 20;
  const dark = !!slide.dark;
  let shapes = bg(dark);
  shapes += titleBlock(id, slide.eyebrow, slide.title, slide.subtitle || "", dark);
  id += 10;
  shapes += slide.draw(id);
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="${dark ? C.ink : C.ivory}"/></a:solidFill><a:effectLst/></p:bgPr></p:bg><p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>${shapes}</p:spTree></p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr></p:sld>`;
}

const slides = [
  {
    dark: true,
    eyebrow: "PROJECT PROPOSAL | 2026",
    title: "AI智能体商业化项目提案",
    subtitle: "从奥斯翰招生自动化试点，到行业智能体产品公司",
    draw: id => [
      tx(id, "cover claim", 940000, 3050000, 7700000, 1050000, [{ text: "先用真实招生场景跑通一个可交付样板，再把方法复制到更多行业。", size: 2050, bold: true, color: C.white, line: 120000 }]),
      sp(id + 1, "gold slab", 940000, 4500000, 1320000, 73000, C.gold),
      card(id + 2, 9500000, 3000000, 4850000, 1300000, "核心判断", "智能体不是单点工具，而是把内容、执行、分发和复盘串成标准化工作流。", C.gold),
      card(id + 6, 9500000, 4600000, 4850000, 1300000, "项目切口", "奥斯翰招生线上端是第一个试验场，8月前跑出可展示成果。", C.violet)
    ].join("")
  },
  {
    eyebrow: "WHY NOW",
    title: "机会来自一个真实工作问题",
    subtitle: "我进入奥斯翰负责线上招生端，原本要解决的是内容矩阵、产出效率和标准化问题。",
    draw: id => [
      card(id, 900000, 2900000, 4200000, 1500000, "原始问题", "招生内容要持续产出，但选题、脚本、视频、投放、复盘分散在不同人和工具里。", C.gold),
      card(id + 4, 5950000, 2900000, 4200000, 1500000, "研究过程", "接触 AI coding 与 Coze 后发现：低代码工作流可以把重复任务变成可复制的智能体。", C.royal),
      card(id + 8, 11000000, 2900000, 4200000, 1500000, "思考升级", "如果招生能做，其他行业的标准化工作也能做，商业化不止服务学校内部。", C.green),
      sp(id + 12, "flow line", 2170000, 4850000, 10400000, 36576, C.gold),
      pill(id + 13, 1450000, 5300000, 2500000, "招生场景"),
      pill(id + 15, 5900000, 5300000, 2600000, "智能体试点", C.royal),
      pill(id + 17, 10450000, 5300000, 3000000, "公司化机会", C.green)
    ].join("")
  },
  {
    eyebrow: "SCHOOL PILOT",
    title: "奥斯翰招生端：最适合做第一个样板",
    subtitle: "它既有明确业务目标，也有持续高频的内容生产需求。",
    draw: id => [
      card(id, 900000, 2850000, 3300000, 1650000, "内容矩阵", "小红书、视频号、抖音、公众号等平台需要稳定选题和差异化表达。"),
      card(id + 4, 4700000, 2850000, 3300000, 1650000, "招生转化", "内容不只是曝光，还要围绕课程卖点、家长顾虑和咨询转化设计。", C.royal),
      card(id + 8, 8500000, 2850000, 3300000, 1650000, "素材复用", "学校已有课程、案例、活动、升学数据，需要被结构化调用。", C.green),
      card(id + 12, 12300000, 2850000, 2600000, 1650000, "复盘闭环", "要看到什么内容有效，而不是只靠感觉继续做。", C.red),
      tx(id + 16, "bottom note", 1150000, 5550000, 12600000, 850000, [{ text: "样板价值：把“我会做内容”变成“学校拥有一套可复制、可训练、可迭代的招生内容生产系统”。", size: 1850, bold: true, color: C.ink, line: 125000 }])
    ].join("")
  },
  {
    dark: true,
    eyebrow: "PRODUCT CONCEPT",
    title: "教育招生智能体：从文案到复盘的一条流水线",
    subtitle: "目标不是替代人，而是把重复劳动标准化，把判断节点留给人。",
    draw: id => [
      pill(id, 1000000, 3200000, 2100000, "选题/定位", C.royal),
      pill(id + 2, 3500000, 3200000, 2100000, "文案/脚本", C.royal),
      pill(id + 4, 6000000, 3200000, 2300000, "视频/数字人", C.royal),
      pill(id + 6, 8750000, 3200000, 2200000, "多平台分发", C.royal),
      pill(id + 8, 11350000, 3200000, 2500000, "数据复盘", C.royal),
      sp(id + 10, "connector 1", 3100000, 3410000, 360000, 55000, C.gold),
      sp(id + 11, "connector 2", 5600000, 3410000, 360000, 55000, C.gold),
      sp(id + 12, "connector 3", 8300000, 3410000, 360000, 55000, C.gold),
      sp(id + 13, "connector 4", 10950000, 3410000, 360000, 55000, C.gold),
      card(id + 14, 1350000, 5000000, 4100000, 1320000, "人负责", "品牌判断、招生策略、最终审核、家长沟通。", C.gold),
      card(id + 18, 6300000, 5000000, 4100000, 1320000, "智能体负责", "资料调用、初稿生成、批量改写、执行记录、数据汇总。", C.violet),
      card(id + 22, 11250000, 5000000, 3300000, 1320000, "结果", "降本、提速、标准化、可复盘。", C.green)
    ].join("")
  },
  {
    eyebrow: "FEASIBILITY",
    title: "低代码降低起步门槛，但不等于没有壁垒",
    subtitle: "我的判断：搭建一个能跑的智能体成本很低；做成可卖的产品，壁垒在交付质量。",
    draw: id => [
      card(id, 1000000, 2850000, 4200000, 1900000, "起步为什么快", "Coze 等平台把知识库、工作流、插件、模型调用做成可视化配置；Codex 可以补足我不懂程序的部分。", C.green),
      card(id + 4, 6100000, 2850000, 4200000, 1900000, "真正难在哪里", "客户不是买一个聊天框，而是买一个能稳定完成业务结果、可维护、可复盘的工作系统。", C.gold),
      card(id + 8, 11200000, 2850000, 3500000, 1900000, "我们的切入点", "先选高频、标准化、结果可验证的垂直场景，不从泛泛的“全能AI”切入。", C.royal),
      tx(id + 12, "verdict", 1200000, 5600000, 12800000, 780000, [{ text: "结论：技术门槛在下降，行业流程理解、数据整理、交付方法和持续运营会成为商业壁垒。", size: 1900, bold: true, color: C.ink }])
    ].join("")
  },
  {
    eyebrow: "MARKET SIGNALS",
    title: "市场窗口正在打开：需求大，但成熟供给不足",
    subtitle: "公开研究显示，企业正在从“会用AI”转向“把AI放进业务流程”。",
    draw: id => [
      card(id, 950000, 2850000, 3350000, 1750000, "AI agents 市场", "Grand View Research：2025年全球市场约 76.3亿美元，2033年预计约 1829.7亿美元，CAGR 49.6%。", C.gold),
      card(id + 4, 4700000, 2850000, 3350000, 1750000, "企业软件趋势", "Deloitte 引用 Gartner：到2028年，33%的企业软件应用将包含 agentic AI。", C.royal),
      card(id + 8, 8450000, 2850000, 3350000, 1750000, "生产落地缺口", "Deloitte：仅11%的组织已在生产环境主动使用 agentic AI，仍有大量试点到落地缺口。", C.red),
      card(id + 12, 12200000, 2850000, 2750000, 1750000, "垂直场景价值", "McKinsey：真正高价值的垂直用例，很多仍卡在试点阶段。", C.green),
      sp(id + 16, "bar 2025", 1500000, 5600000, 950000, 780000, C.gold),
      sp(id + 17, "bar 2033", 3000000, 4900000, 5900000, 1480000, C.purple),
      tx(id + 18, "bar labels", 1500000, 6550000, 7800000, 620000, [{ runs: [{ text: "2025 $7.63B", color: C.gold, size: 1300, bold: true }, { text: "      2033 $182.97B", color: C.purple, size: 1300, bold: true }] }]),
      tx(id + 19, "sources", 10100000, 5650000, 4200000, 850000, [{ text: "来源：Grand View Research, Deloitte Insights, McKinsey, Gartner Newsroom", size: 980, color: C.muted, line: 135000 }])
    ].join("")
  },
  {
    dark: true,
    eyebrow: "BUSINESS THESIS",
    title: "我们卖的不是“智能体”，而是可交付的行业工作流",
    subtitle: "市场上会有很多人做低价模板，差异化要落到行业、结果和服务。",
    draw: id => [
      card(id, 1100000, 3000000, 3900000, 1650000, "标准化产品", "围绕高频场景做可复制模板：招生、获客、客服、短视频矩阵、销售跟进。", C.gold),
      card(id + 4, 6200000, 3000000, 3900000, 1650000, "定制化交付", "根据企业资料、流程、角色权限和业务目标进行配置与训练。", C.violet),
      card(id + 8, 11300000, 3000000, 3200000, 1650000, "运营服务", "不是交付后结束，而是持续优化提示词、知识库、内容策略和数据复盘。", C.green),
      tx(id + 12, "formula", 1550000, 5550000, 11800000, 900000, [{ text: "产品化模板 + 行业数据包 + 交付SOP + 持续运营 = 可规模化的智能体公司", size: 2100, bold: true, color: C.white, line: 120000 }])
    ].join("")
  },
  {
    eyebrow: "FIRST PRODUCT",
    title: "第一款产品：招生内容增长智能体",
    subtitle: "先把奥斯翰跑通，再包装成教育行业可售卖样板。",
    draw: id => [
      card(id, 900000, 2700000, 3000000, 1450000, "知识库", "课程体系、招生政策、升学成果、家长问答、活动素材。", C.gold),
      card(id + 4, 4250000, 2700000, 3000000, 1450000, "内容引擎", "选题池、标题、脚本、平台化改写、素材调用。", C.royal),
      card(id + 8, 7600000, 2700000, 3000000, 1450000, "视频执行", "口播脚本、分镜、数字人视频、封面文案。", C.green),
      card(id + 12, 10950000, 2700000, 3650000, 1450000, "数据复盘", "发布记录、互动数据、咨询线索、下轮选题建议。", C.red),
      sp(id + 16, "matrix panel", 1500000, 5000000, 12000000, 1100000, C.mist, { line: { color: C.lavender, w: 9144 } }),
      tx(id + 17, "matrix", 1750000, 5250000, 11500000, 620000, [{ text: "交付物：一套 Coze/低代码工作流 + 招生知识库 + 内容模板库 + 审核SOP + 复盘看板", size: 1600, bold: true, color: C.ink }])
    ].join("")
  },
  {
    eyebrow: "ROADMAP",
    title: "8月前先跑通样板，再考虑公司化扩张",
    subtitle: "节奏要克制：先用真实场景证明价值，再拿样板去卖。",
    draw: id => [
      sp(id, "timeline", 1400000, 4700000, 12300000, 55000, C.gold),
      pill(id + 1, 1100000, 3400000, 2800000, "6月：需求拆解"),
      pill(id + 3, 4100000, 3400000, 2800000, "7月：工作流搭建", C.royal),
      pill(id + 5, 7100000, 3400000, 2800000, "8月：招生试跑", C.green),
      pill(id + 7, 10100000, 3400000, 3600000, "9-12月：产品化销售", C.red),
      card(id + 9, 1050000, 5400000, 3000000, 1200000, "第1阶段", "奥斯翰内部可用，验证效率、内容质量与咨询转化。"),
      card(id + 13, 4550000, 5400000, 3000000, 1200000, "第2阶段", "整理成教育招生产品包，沉淀案例和报价。", C.royal),
      card(id + 17, 8050000, 5400000, 3000000, 1200000, "第3阶段", "复制到其他学校、培训、留学、机构。", C.green),
      card(id + 21, 11550000, 5400000, 3000000, 1200000, "第4阶段", "拓展到其他行业标准化智能体。", C.red)
    ].join("")
  },
  {
    eyebrow: "GO-TO-MARKET",
    title: "商业化路径：先服务，再产品化，再规模化",
    subtitle: "不要一开始就卖“平台”，先卖客户听得懂的结果。",
    draw: id => [
      card(id, 950000, 2850000, 4300000, 1600000, "1. 样板项目", "用奥斯翰招生端做展示案例：流程图、前后对比、内容样张、数据复盘。", C.gold),
      card(id + 4, 6050000, 2850000, 4300000, 1600000, "2. 标准套餐", "按行业拆包：招生内容智能体、客服问答智能体、销售跟进智能体、老板助理智能体。", C.royal),
      card(id + 8, 11150000, 2850000, 3500000, 1600000, "3. 定制服务", "按企业资料和流程收费，形成项目制收入和持续维护收入。", C.green),
      tx(id + 12, "pricing idea", 1180000, 5600000, 12600000, 820000, [{ text: "收入结构设想：模板授权费 / 定制搭建费 / 月度运营维护费 / 内容代跑服务费", size: 1850, bold: true, color: C.ink }])
    ].join("")
  },
  {
    eyebrow: "RESOURCE ASK",
    title: "需要主席支持的不是研发重资产，而是样板和市场放大",
    subtitle: "研发成本可以压低，但要把盘子做大，需要资源把样板变成信任。",
    draw: id => [
      card(id, 1000000, 2850000, 3600000, 1650000, "样板权限", "授权奥斯翰招生端作为第一个试点，开放必要资料和业务反馈。", C.gold),
      card(id + 4, 5150000, 2850000, 3600000, 1650000, "营销宣发", "把“AI招生智能体样板”包装成可对外展示的案例，形成市场信任。", C.royal),
      card(id + 8, 9300000, 2850000, 3600000, 1650000, "交付团队", "小团队即可：产品/搭建、内容运营、销售、客户成功。", C.green),
      card(id + 12, 13450000, 2850000, 1500000, 1650000, "合规", "数据、内容、平台账号权限必须前置规范。", C.red),
      tx(id + 16, "ask", 1150000, 5600000, 12000000, 800000, [{ text: "建议：先以低成本内部孵化方式启动，等奥斯翰样板可展示后，再决定公司化投入强度。", size: 1800, bold: true, color: C.ink }])
    ].join("")
  },
  {
    eyebrow: "RISK CONTROL",
    title: "风险不是做不出来，而是做出来后能不能稳定交付",
    subtitle: "要在提案里主动讲风险，主席才会觉得这不是拍脑袋。",
    draw: id => [
      card(id, 900000, 2700000, 3300000, 1550000, "平台依赖", "Coze、模型、数字人、分发平台规则都可能变化；要保留替代方案。", C.red),
      card(id + 4, 4700000, 2700000, 3300000, 1550000, "内容合规", "招生宣传涉及事实准确、未成年人、学校品牌，不允许失控生成。", C.gold),
      card(id + 8, 8500000, 2700000, 3300000, 1550000, "客户预期", "智能体不是万能员工，要明确边界、人工审核和交付指标。", C.royal),
      card(id + 12, 12300000, 2700000, 2600000, 1550000, "数据安全", "客户资料、线索、账号权限需要分级管理。", C.green),
      tx(id + 16, "risk principle", 1150000, 5350000, 12600000, 1050000, [{ text: "控制原则：每个智能体必须有知识库边界、人工审核节点、输出记录、权限控制和复盘机制。", size: 1900, bold: true, color: C.ink, line: 125000 }])
    ].join("")
  },
  {
    dark: true,
    eyebrow: "DECISION",
    title: "建议先立项：用奥斯翰跑出AI智能体商业样板",
    subtitle: "这件事的核心不是追热点，而是用一个低成本试点验证可复制商业模式。",
    draw: id => [
      card(id, 1100000, 3000000, 3900000, 1700000, "短期目标", "8月前完成招生智能体第一版并进入真实内容生产。", C.gold),
      card(id + 4, 6200000, 3000000, 3900000, 1700000, "中期目标", "形成教育招生行业标准产品包和可展示案例。", C.violet),
      card(id + 8, 11300000, 3000000, 3200000, 1700000, "长期方向", "成立AI智能体公司，提供标准化产品与企业定制服务。", C.green),
      tx(id + 12, "closing", 1450000, 5650000, 11800000, 900000, [{ text: "先做出一个可验证样板，再用样板抢时间差、信任差和行业交付经验。", size: 2100, bold: true, color: C.white, line: 120000 }])
    ].join("")
  },
  {
    eyebrow: "REFERENCE",
    title: "资料来源与外部佐证",
    subtitle: "用于支撑市场窗口、落地缺口和企业智能体趋势。",
    draw: id => [
      card(id, 1000000, 2650000, 6500000, 1200000, "市场规模", "Grand View Research：AI agents 2025年约76.3亿美元，2033年预计约1829.7亿美元。", C.gold),
      card(id + 4, 1000000, 4150000, 6500000, 1200000, "企业采用", "Deloitte / Gartner：到2028年，33%的企业软件应用将包含 agentic AI。", C.royal),
      card(id + 8, 1000000, 5650000, 6500000, 1200000, "落地缺口", "McKinsey：企业广泛使用生成式AI，但高价值垂直用例仍大量卡在试点阶段。", C.green),
      card(id + 12, 8500000, 2650000, 5600000, 2700000, "待补充素材", "你提供的AI市场图片、会议纪要、抖音案例截图，可以作为下一版的真实截图页插入。", C.red),
      tx(id + 16, "links", 8700000, 5750000, 5300000, 780000, [{ text: "抖音链接已记录，但当前环境无法抓取短链页面；建议后续直接提供截图或原视频标题。", size: 1150, color: C.muted, line: 130000 }])
    ].join("")
  }
];

const slidesDir = path.join(work, "ppt", "slides");
const relsDir = path.join(slidesDir, "_rels");
for (const file of fs.readdirSync(slidesDir)) if (/^slide\d+\.xml$/.test(file)) fs.unlinkSync(path.join(slidesDir, file));
if (fs.existsSync(relsDir)) for (const file of fs.readdirSync(relsDir)) if (/^slide\d+\.xml\.rels$/.test(file)) fs.unlinkSync(path.join(relsDir, file));
fs.mkdirSync(relsDir, { recursive: true });

slides.forEach((s, i) => {
  const n = i + 1;
  fs.writeFileSync(path.join(slidesDir, `slide${n}.xml`), slideXml(s), "utf8");
  fs.writeFileSync(path.join(relsDir, `slide${n}.xml.rels`), `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/></Relationships>`, "utf8");
});

const presPath = path.join(work, "ppt", "presentation.xml");
let pres = fs.readFileSync(presPath, "utf8");
const sldIds = slides.map((_, i) => `<p:sldId id="${256 + i}" r:id="rId${1000 + i}"/>`).join("");
pres = pres.replace(/<p:sldIdLst>[\s\S]*?<\/p:sldIdLst>/, `<p:sldIdLst>${sldIds}</p:sldIdLst>`);
fs.writeFileSync(presPath, pres, "utf8");

const presRelsPath = path.join(work, "ppt", "_rels", "presentation.xml.rels");
let rels = fs.readFileSync(presRelsPath, "utf8");
rels = rels.replace(/<Relationship\b[^>]*Type="http:\/\/schemas\.openxmlformats\.org\/officeDocument\/2006\/relationships\/slide"[^>]*\/>/g, "");
const slideRels = slides.map((_, i) => `<Relationship Id="rId${1000 + i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide${i + 1}.xml"/>`).join("");
rels = rels.replace("</Relationships>", `${slideRels}</Relationships>`);
fs.writeFileSync(presRelsPath, rels, "utf8");

const ctPath = path.join(work, "[Content_Types].xml");
let ct = fs.readFileSync(ctPath, "utf8");
ct = ct.replace(/<Override PartName="\/ppt\/slides\/slide\d+\.xml" ContentType="application\/vnd\.openxmlformats-officedocument\.presentationml\.slide\+xml"\/>/g, "");
const overrides = slides.map((_, i) => `<Override PartName="/ppt/slides/slide${i + 1}.xml" ContentType="${SLIDE_CT}"/>`).join("");
ct = ct.replace("</Types>", `${overrides}</Types>`);
fs.writeFileSync(ctPath, ct, "utf8");

console.log(path.join(outDir, "AI智能体商业化项目提案_奥斯翰招生试点.pptx"));
