import ExcelJS from "exceljs";
import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  Header,
  HeadingLevel,
  Packer,
  PageNumber,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import fs from "fs";
import path from "path";

const outDir = "03_working_files_工作文件/2026线上端软件费用发票核查";
const now = "2026-05-25";

const rows = [
  {
    no: "1",
    category: "直播运营工具端",
    name: "抖音直播伴侣（PC版）",
    fee: "免费",
    invoice: "免费无发票",
    domestic: "不涉及",
    link: "https://www.douyin.com/falcon/webcast_openpc/pages/streamingtool_download/index.html",
    path: "官方免费工具，无采购付款则无发票；若后续涉及抖音投流，走巨量千川/DOU+充值开票。",
    advice: "保留为免费工具，不列入固定软件采购开票清单。",
    risk: "粉丝/账号开播权限与发票无关。",
  },
  {
    no: "2",
    category: "直播运营工具端",
    name: "OBS Studio",
    fee: "免费",
    invoice: "免费无发票",
    domestic: "不涉及",
    link: "https://obsproject.com/",
    path: "开源免费软件，无采购付款则无发票。",
    advice: "不纳入报销，只作为免费工具备案。",
    risk: "无。",
  },
  {
    no: "3",
    category: "直播运营工具端",
    name: "微信视频号直播助手（PC）",
    fee: "免费",
    invoice: "免费无发票",
    domestic: "不涉及",
    link: "https://channels.weixin.qq.com/platform",
    path: "官方免费工具，无采购付款则无发票；如涉及视频号广告投流，走腾讯广告开票。",
    advice: "不纳入固定软件采购开票清单。",
    risk: "视频号工具免费，广告投放另行开票。",
  },
  {
    no: "4",
    category: "直播运营工具端",
    name: "剪映 SVIP 超级会员",
    fee: "599元/年",
    invoice: "需购买前确认",
    domestic: "有条件",
    link: "https://www.capcut.cn/",
    path: "优先使用企业主体/官网或官方客服确认开票；避免个人Apple/安卓应用商店代扣后无法按学校抬头开票。",
    advice: "采购前先问客服：是否可开学校抬头、税号、发票项目、普票/专票。",
    risk: "个人账号、移动端订阅、第三方代扣可能影响开票抬头。",
  },
  {
    no: "5",
    category: "直播运营工具端",
    name: "蝉妈妈·专业版（数据监测）",
    fee: "2400元/年",
    invoice: "需客服确认",
    domestic: "有条件",
    link: "https://www.chanmama.com/",
    path: "通过蝉妈妈官网/企业销售/客服确认会员采购开票方式。",
    advice: "付款前让对方提供开票信息说明，确认能否开学校抬头发票。",
    risk: "若通过代理或个人账号购买，可能影响发票主体。",
  },
  {
    no: "6",
    category: "直播运营工具端",
    name: "巨量千川（抖音官方投流）",
    fee: "按消耗充值",
    invoice: "可开国内发票",
    domestic: "可以",
    link: "https://support.oceanengine.com/",
    path: "使用巨量引擎/千川企业广告账户充值后，在广告后台/财务中心按消耗或充值记录申请发票。",
    advice: "必须用学校或公司主体开户注册、充值、开票；投流预算单独审批。",
    risk: "个人账户充值、代理代充会导致开票主体不一致。",
  },
  {
    no: "7",
    category: "直播运营工具端",
    name: "抖加 Dou+（内容加热）",
    fee: "按次充值",
    invoice: "条件可开/需确认",
    domestic: "有条件",
    link: "https://support.oceanengine.com/",
    path: "如走企业广告体系或官方充值记录，通常可按平台规则申请；抖音App个人小额加热需提前确认。",
    advice: "财务口径建议尽量转为巨量千川/企业广告账户投放，减少个人支付。",
    risk: "个人抖音账号小额DOU+可能难以开学校抬头发票。",
  },
  {
    no: "8",
    category: "直播运营工具端",
    name: "视频号广告后台（腾讯广告）",
    fee: "按消耗充值",
    invoice: "可开国内发票",
    domestic: "可以",
    link: "https://tencentads.com/Faqlist/Detail/630",
    path: "通过腾讯广告企业账户充值和投放，可按腾讯广告规则申请增值税发票。",
    advice: "用学校/公司主体开户注册；广告投流预算单独审批。",
    risk: "主体、合同、充值账户需一致。",
  },
  {
    no: "9",
    category: "直播运营工具端",
    name: "小红书笔记助手 / 薯条加热",
    fee: "按次充值",
    invoice: "条件可开/建议走聚光",
    domestic: "有条件",
    link: "https://ad.xiaohongshu.com/",
    path: "企业投放建议走小红书聚光广告平台，按企业广告账户申请发票；薯条个人加热需客服确认。",
    advice: "若财务要求发票，优先走聚光企业广告账户，不建议用个人薯条加热报销。",
    risk: "个人笔记加热、小额充值可能无法开学校抬头。",
  },
  {
    no: "11",
    category: "AI工具端",
    name: "Claude Max（Anthropic）",
    fee: "8640元/年（折算）",
    invoice: "仅海外invoice/receipt",
    domestic: "一般不能",
    link: "https://support.claude.com/en/articles/8325618-paid-plan-billing-faqs",
    path: "Claude账单页可获取invoice/receipt，但通常不是中国大陆增值税发票。",
    advice: "如财务必须要国内发票，改为通过国内合规服务商采购，由服务商开技术服务发票。",
    risk: "海外主体、美元支付、国内税票不匹配。",
  },
  {
    no: "12",
    category: "AI工具端",
    name: "Claude Team（团队版）",
    fee: "5184元/年（折算）",
    invoice: "仅海外invoice/receipt",
    domestic: "一般不能",
    link: "https://support.claude.com/en/articles/8325618-paid-plan-billing-faqs",
    path: "团队版同样可获取海外账单凭证，但不是国内增值税发票。",
    advice: "按需项，建议暂缓；若确需团队版，先让财务确认海外凭证是否可入账。",
    risk: "海外票据、外币支付、账号合规采购。",
  },
  {
    no: "13",
    category: "AI工具端",
    name: "Gemini 3.0 Flash Image / Google AI",
    fee: "3600元/年（预算）",
    invoice: "仅海外invoice/receipt",
    domestic: "一般不能",
    link: "https://docs.cloud.google.com/billing/docs/how-to/get-invoice",
    path: "若走Google Cloud Billing，可下载invoice/receipt；通常不是中国大陆增值税发票。",
    advice: "如财务必须要国内发票，需通过国内云/技术服务商采购替代方案或由服务商代采。",
    risk: "Google AI Studio/API按量费用可能与预算不完全一致，且发票口径为海外账单。",
  },
  {
    no: "14",
    category: "AI工具端",
    name: "即梦AI / 可灵AI（国产生图视频）",
    fee: "1188元/年",
    invoice: "需购买前确认",
    domestic: "有条件",
    link: "https://jimeng.jianying.com/",
    path: "国产平台理论上更容易取得国内发票，但需看购买入口、会员主体和付款渠道。",
    advice: "付款前分别向即梦/可灵客服确认企业抬头、税号、发票类型。",
    risk: "个人会员、App内购、第三方支付可能影响开票。",
  },
  {
    no: "15",
    category: "AI工具端",
    name: "飞书·商业版（协同办公）",
    fee: "3000元/年",
    invoice: "可开国内发票",
    domestic: "可以",
    link: "https://www.feishu.cn/hc/zh-CN/articles/360049067528",
    path: "飞书管理后台/订单/发票入口，由管理员按企业购买记录申请电子发票。",
    advice: "建议用学校主体购买商业版，统一走管理员开票。",
    risk: "购买主体、管理员权限、发票抬头需提前配置。",
  },
  {
    no: "16",
    category: "AI工具端",
    name: "飞书AI会员（个人席位）",
    fee: "360元/年",
    invoice: "可开国内发票",
    domestic: "可以",
    link: "https://www.feishu.cn/hc/zh-CN/articles/360049067528",
    path: "随飞书企业订单或个人席位订单，在飞书后台按订单申请发票。",
    advice: "建议与飞书商业版一并由企业管理员购买。",
    risk: "若个人自行购买，可能无法开学校抬头。",
  },
  {
    no: "17",
    category: "AI工具端",
    name: "飞书妙记（自动录音转文字）",
    fee: "含于飞书商业版",
    invoice: "不单独开票",
    domestic: "随飞书订单",
    link: "https://www.feishu.cn/hc/zh-CN/articles/360049067528",
    path: "本项作为飞书商业版包含功能，不产生独立采购订单。",
    advice: "不单独报销，随飞书商业版发票入账。",
    risk: "避免重复列支。",
  },
  {
    no: "18",
    category: "AI工具端",
    name: "飞书录音豆",
    fee: "899元/年/台或设备",
    invoice: "按采购渠道开票",
    domestic: "有条件",
    link: "https://www.feishu.cn/",
    path: "若通过飞书官方、京东/天猫企业采购或授权经销商购买，通常按硬件/设备采购开票。",
    advice: "建议走企业采购渠道，付款前确认发票项目和抬头。",
    risk: "个人渠道购买可能影响学校抬头。",
  },
  {
    no: "21",
    category: "投流与数据追踪端",
    name: "巨量云图（抖音官方人群洞察）",
    fee: "免费",
    invoice: "免费无发票",
    domestic: "不涉及",
    link: "https://www.oceanengine.com/",
    path: "官方数据/洞察工具，免费使用时无发票。",
    advice: "不纳入采购开票清单。",
    risk: "与巨量投流账户权限相关。",
  },
  {
    no: "22",
    category: "投流与数据追踪端",
    name: "抖音罗盘（数据后台）",
    fee: "免费",
    invoice: "免费无发票",
    domestic: "不涉及",
    link: "https://compass.jinritemai.com/",
    path: "官方数据后台，免费使用时无发票。",
    advice: "不纳入采购开票清单。",
    risk: "账号权限与开票无关。",
  },
  {
    no: "23",
    category: "投流与数据追踪端",
    name: "视频号助手（官方数据后台）",
    fee: "免费",
    invoice: "免费无发票",
    domestic: "不涉及",
    link: "https://channels.weixin.qq.com/platform",
    path: "官方数据后台，免费使用时无发票。",
    advice: "不纳入采购开票清单。",
    risk: "如发生广告消耗，走腾讯广告发票。",
  },
];

function statusFill(status) {
  if (status.includes("可开国内")) return "FFC6EFCE";
  if (status.includes("海外")) return "FFFFC7CE";
  if (status.includes("免费")) return "FFE7E6E6";
  if (status.includes("随飞书")) return "FFD9EAD3";
  return "FFFFEB9C";
}

function style(cell, opts = {}) {
  cell.font = { name: "微软雅黑", size: opts.size ?? 10, bold: !!opts.bold, color: { argb: opts.color ?? "FF1F2937" } };
  cell.alignment = { vertical: "middle", horizontal: opts.horizontal ?? "left", wrapText: true };
  cell.border = {
    top: { style: "thin", color: { argb: "FFD6DEE8" } },
    left: { style: "thin", color: { argb: "FFD6DEE8" } },
    bottom: { style: "thin", color: { argb: "FFD6DEE8" } },
    right: { style: "thin", color: { argb: "FFD6DEE8" } },
  };
  if (opts.fill) cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: opts.fill } };
}

async function makeXlsx() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "周玉田";
  wb.created = new Date();

  const dash = wb.addWorksheet("财务结论看板");
  dash.columns = [{ width: 24 }, { width: 18 }, { width: 80 }];
  dash.mergeCells("A1:C1");
  dash.getCell("A1").value = "OXSTAND线上端软件费用发票可行性核查";
  style(dash.getCell("A1"), { bold: true, size: 16, fill: "FFEAF2FF", horizontal: "center", color: "FF0B2A4A" });
  const counts = {
    can: rows.filter((r) => r.invoice === "可开国内发票").length,
    conditional: rows.filter((r) => r.domestic === "有条件").length,
    overseas: rows.filter((r) => r.invoice.includes("海外")).length,
    free: rows.filter((r) => r.invoice.includes("免费")).length,
  };
  [
    ["核查日期", now, "基于费用清单逐项判断；最终以平台后台、合同和财务审核为准。"],
    ["可开国内发票", counts.can, "优先用企业主体开户注册、充值或购买。"],
    ["有条件/需确认", counts.conditional, "付款前必须确认抬头、税号、发票类型和购买主体。"],
    ["仅海外invoice/receipt", counts.overseas, "通常不是中国大陆增值税发票，需财务先确认是否可入账。"],
    ["免费无发票", counts.free, "无采购付款，不应列入报销开票清单。"],
    ["最关键风险", "Claude / Gemini", "可取得海外账单凭证，但一般无法开国内增值税发票。"],
    ["建议采购原则", "企业主体优先", "国内平台走企业账户；海外AI如必须要国内票，改走国内合规服务商。"],
  ].forEach((r) => dash.addRow(r));
  dash.eachRow((row, idx) => {
    row.height = idx === 1 ? 32 : 42;
    row.eachCell((cell, col) => style(cell, { bold: col === 1 || idx === 1, fill: idx === 1 ? "FFEAF2FF" : col === 1 ? "FFF8FAFC" : undefined }));
  });

  const detail = wb.addWorksheet("逐项发票核查");
  detail.columns = [
    { header: "序号", key: "no", width: 8 },
    { header: "分类", key: "category", width: 18 },
    { header: "软件/平台", key: "name", width: 28 },
    { header: "费用口径", key: "fee", width: 16 },
    { header: "开票结论", key: "invoice", width: 18 },
    { header: "国内增值税发票", key: "domestic", width: 16 },
    { header: "开票/官方入口", key: "link", width: 34 },
    { header: "操作口径", key: "path", width: 48 },
    { header: "给财务的建议", key: "advice", width: 46 },
    { header: "风险点", key: "risk", width: 42 },
  ];
  detail.getRow(1).eachCell((c) => style(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  rows.forEach((r) => {
    const row = detail.addRow(r);
    row.getCell("link").value = { text: r.link, hyperlink: r.link };
    row.eachCell((c) => style(c, { fill: c.col === 5 ? statusFill(r.invoice) : undefined }));
  });
  detail.views = [{ state: "frozen", ySplit: 1 }];
  detail.autoFilter = "A1:J1";

  const src = wb.addWorksheet("来源与口径");
  src.columns = [{ width: 26 }, { width: 58 }, { width: 72 }];
  src.addRow(["来源类型", "链接", "说明"]);
  src.getRow(1).eachCell((c) => style(c, { bold: true, fill: "FFDCEBFF", horizontal: "center" }));
  [
    ["飞书发票", "https://www.feishu.cn/hc/zh-CN/articles/360049067528", "飞书管理员/订单发票入口，适用于飞书商业版、AI席位等。"],
    ["腾讯广告发票", "https://tencentads.com/Faqlist/Detail/630", "腾讯广告发票说明，适用于视频号广告/朋友圈广告等广告账户。"],
    ["Claude账单", "https://support.claude.com/en/articles/8325618-paid-plan-billing-faqs", "Claude可提供invoice/receipt，但通常不是国内增值税发票。"],
    ["Google Cloud账单", "https://docs.cloud.google.com/billing/docs/how-to/get-invoice", "Google Cloud可下载invoice/receipt，但通常不是国内增值税发票。"],
    ["巨量引擎支持", "https://support.oceanengine.com/", "巨量千川/巨量广告的发票以企业广告账户后台规则为准。"],
    ["小红书聚光", "https://ad.xiaohongshu.com/", "企业投放建议走聚光广告平台，不建议用个人薯条报销。"],
    ["OBS官网", "https://obsproject.com/", "免费开源工具，无采购发票。"],
  ].forEach((r) => {
    const row = src.addRow(r);
    row.getCell(2).value = { text: r[1], hyperlink: r[1] };
    row.eachCell((c) => style(c));
  });

  await wb.xlsx.writeFile(path.join(outDir, "OXSTAND线上端软件费用_发票可行性核查表.xlsx"));
}

const docBorder = { style: BorderStyle.SINGLE, size: 1, color: "D6DEE8" };
function run(text, opts = {}) {
  return new TextRun({ text, font: "Microsoft YaHei", size: opts.size ?? 21, bold: !!opts.bold, color: opts.color ?? "1F2937" });
}
function para(text, opts = {}) {
  return new Paragraph({ heading: opts.heading, alignment: opts.alignment, spacing: { before: 80, after: 80 }, children: [run(text, opts)] });
}
function docCell(text, opts = {}) {
  return new TableCell({
    borders: { top: docBorder, bottom: docBorder, left: docBorder, right: docBorder },
    shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR } : undefined,
    verticalAlign: VerticalAlign.CENTER,
    width: { size: opts.width ?? 2000, type: WidthType.DXA },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    children: [new Paragraph({ children: [run(text, { size: opts.size ?? 18, bold: !!opts.bold })] })],
  });
}
function docLink(text, url) {
  return new Paragraph({
    children: [
      new ExternalHyperlink({
        link: url,
        children: [new TextRun({ text, font: "Microsoft YaHei", size: 18, color: "2563EB", underline: {} })],
      }),
    ],
  });
}

async function makeDocx() {
  const header = new TableRow({
    tableHeader: true,
    children: ["项目", "开票结论", "财务处理建议", "入口"].map((h, i) => docCell(h, { bold: true, fill: "DCEBFF", width: [2300, 1700, 3800, 2600][i] })),
  });
  const tableRows = [header];
  rows.forEach((r) => {
    tableRows.push(new TableRow({
      children: [
        docCell(`${r.no}. ${r.name}`, { width: 2300 }),
        docCell(r.invoice, { width: 1700, fill: statusFill(r.invoice).slice(2) }),
        docCell(r.advice, { width: 3800 }),
        new TableCell({
          borders: { top: docBorder, bottom: docBorder, left: docBorder, right: docBorder },
          width: { size: 2600, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [docLink("查看入口", r.link)],
        }),
      ],
    }));
  });

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Microsoft YaHei", size: 21 } } },
      paragraphStyles: [
        { id: "Title", name: "Title", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 36, bold: true, color: "0B2A4A" }, paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 200 } } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", run: { font: "Microsoft YaHei", size: 28, bold: true, color: "123B73" }, paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 0 } },
      ],
    },
    sections: [{
      properties: { page: { margin: { top: 900, right: 700, bottom: 900, left: 700 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [run("OXSTAND软件费用发票核查", { size: 17, color: "64748B" })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [run("第 ", { size: 17, color: "64748B" }), new TextRun({ children: [PageNumber.CURRENT], font: "Microsoft YaHei", size: 17, color: "64748B" }), run(" 页", { size: 17, color: "64748B" })] })] }) },
      children: [
        para("OXSTAND线上端软件费用发票可行性核查", { heading: HeadingLevel.TITLE, size: 36, bold: true, alignment: AlignmentType.CENTER }),
        para(`核查日期：${now}`, { alignment: AlignmentType.CENTER, color: "64748B" }),
        para("核心结论", { heading: HeadingLevel.HEADING_1 }),
        para("国内平台和广告账户类费用，原则上应使用学校/公司企业主体开户注册、充值和购买，再按后台订单申请发票。Claude、Gemini 等海外AI工具通常只能提供海外 invoice/receipt，不等同于中国大陆增值税发票。"),
        para("给财务的处理建议", { heading: HeadingLevel.HEADING_1 }),
        para("1. 免费工具不列入开票清单。2. 国内软件和投流必须走企业主体。3. 个人App内购、个人小额加热尽量避免报销。4. 海外AI工具若财务不接受海外凭证，应改由国内合规服务商采购。"),
        para("逐项核查表", { heading: HeadingLevel.HEADING_1 }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: tableRows }),
      ],
    }],
  });
  fs.writeFileSync(path.join(outDir, "OXSTAND线上端软件费用_发票可行性核查报告.docx"), await Packer.toBuffer(doc));
}

await makeXlsx();
await makeDocx();
console.log("done");
