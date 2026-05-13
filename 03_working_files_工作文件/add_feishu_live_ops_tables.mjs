import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const cli = "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\lark-cli.cmd";
const baseToken = "TlV5boVxna6LTLsdl5PcFbRunv4";
const as = "bot";
mkdirSync(".lark_tmp", { recursive: true });

function run(args) {
  const finalArgs = [...args, "--as", as];
  console.log(`\n> ${cli} ${finalArgs.join(" ")}`);
  const out = execFileSync(cli, finalArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: true });
  if (out.trim()) console.log(out.trim());
  return JSON.parse(out);
}

function writeJson(name, obj) {
  writeFileSync(name, JSON.stringify(obj, null, 2), "utf8");
  return `@${name}`;
}

function safeName(value) {
  return String(value).replace(/[\\/:*?"<>|\s]+/g, "_");
}

function listTables() {
  return run(["base", "+table-list", "--base-token", baseToken, "--offset", "0", "--limit", "100"]).data.tables;
}

function listFields(tableId) {
  return run(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]).data.fields;
}

function listViews(tableId) {
  return run(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]).data.views;
}

const tables = [
  {
    name: "工具账号清单",
    fields: [
      { type: "text", name: "工具名称" },
      { type: "select", name: "工具类别", multiple: false, options: [{ name: "直播开播" }, { name: "内容生产" }, { name: "视觉设计" }, { name: "视频剪辑" }, { name: "数据分析" }, { name: "投流" }, { name: "协作自动化" }] },
      { type: "select", name: "对应课程", multiple: true, options: [{ name: "A-Level" }, { name: "IG" }, { name: "DSE" }, { name: "通用" }] },
      { type: "text", name: "用途" },
      { type: "select", name: "开通状态", multiple: false, options: [{ name: "待开通" }, { name: "已开通" }, { name: "免费可用" }, { name: "按需开通" }, { name: "暂停" }] },
      { type: "text", name: "负责人" },
      { type: "datetime", name: "到期/复核日期", style: { format: "yyyy-MM-dd" } },
      { type: "text", name: "关联表" },
      { type: "text", name: "备注" }
    ],
    views: [{ name: "工具总览", type: "grid" }, { name: "按类别看板", type: "kanban" }],
    seed: {
      fields: ["工具名称", "工具类别", "对应课程", "用途", "开通状态", "负责人", "关联表", "备注"],
      rows: [
        ["抖音直播伴侣", "直播开播", ["通用"], "抖音开播、弹幕互动、直播数据来源", "免费可用", "直播运营", "直播执行表 / 直播复盘表", "确认账号直播权限"],
        ["微信视频号直播助手", "直播开播", ["通用"], "视频号预约、开播、微信生态分发", "免费可用", "直播运营", "直播排期表 / 直播复盘表", "适合家长私域承接"],
        ["OBS Studio", "直播开播", ["通用"], "多机位、贴片、画面编排、录屏备份", "免费可用", "直播运营", "直播执行表 / 物料资产表", "开播前必须测试"],
        ["Claude Max", "内容生产", ["A-Level", "IG", "DSE"], "脚本、标题、复盘、话术、周报", "待开通", "卓", "脚本生产表 / 评论问题库 / 直播复盘表", "财务下款后优先开通"],
        ["飞书 AI", "协作自动化", ["通用"], "复盘摘要、周报、待办提取", "待开通", "卓", "直播复盘表 / 自动化规则清单", "会员开通后接入"],
        ["Gemini Flash Image", "视觉设计", ["A-Level", "IG", "DSE"], "封面、海报、课程图", "待开通", "卓/AI视觉", "物料资产表", "用于批量视觉生产"],
        ["剪映 SVIP", "视频剪辑", ["通用"], "切片、字幕、竖版视频、封面适配", "待开通", "剪辑", "切片分发表", "直播后 48 小时内出片"],
        ["蝉妈妈", "数据分析", ["通用"], "竞品直播、话术、选题趋势", "待开通", "卓", "选题库 / 直播复盘表", "用于选题和竞品监测"],
        ["抖音罗盘", "数据分析", ["通用"], "抖音直播数据、观看、停留、互动", "免费可用", "直播运营", "直播复盘表", "每场结束后录入"],
        ["视频号助手", "数据分析", ["通用"], "视频号数据、预约、互动", "免费可用", "直播运营", "直播复盘表", "每场结束后录入"]
      ]
    }
  },
  {
    name: "切片分发表",
    fields: [
      { type: "text", name: "切片标题" },
      { type: "text", name: "来源直播主题" },
      { type: "select", name: "课程方向", multiple: false, options: [{ name: "A-Level" }, { name: "IG" }, { name: "DSE" }, { name: "综合择校" }] },
      { type: "select", name: "切片类型", multiple: false, options: [{ name: "信任型" }, { name: "问答型" }, { name: "转化型" }, { name: "知识点" }, { name: "高频问题" }] },
      { type: "select", name: "发布平台", multiple: true, options: [{ name: "抖音" }, { name: "视频号" }, { name: "小红书" }, { name: "朋友圈" }, { name: "家长群" }] },
      { type: "text", name: "剪辑负责人" },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待剪辑" }, { name: "剪辑中" }, { name: "待审核" }, { name: "已发布" }, { name: "复用" }, { name: "暂停" }] },
      { type: "datetime", name: "计划发布时间", style: { format: "yyyy-MM-dd HH:mm" } },
      { type: "number", name: "播放量", style: { type: "plain", precision: 0 } },
      { type: "number", name: "互动量", style: { type: "plain", precision: 0 } },
      { type: "number", name: "私信/留资", style: { type: "plain", precision: 0 } },
      { type: "checkbox", name: "是否值得复用" },
      { type: "text", name: "优化备注" }
    ],
    views: [{ name: "待剪辑", type: "grid" }, { name: "发布排期", type: "calendar" }, { name: "切片状态看板", type: "kanban" }],
    seed: {
      fields: ["切片标题", "来源直播主题", "课程方向", "切片类型", "发布平台", "剪辑负责人", "状态", "是否值得复用", "优化备注"],
      rows: [
        ["A-Level难不难，关键看这3个判断", "A-Level到底难不难？家长最容易误解的5件事", "A-Level", "知识点", ["抖音", "视频号"], "剪辑", "待剪辑", false, "首场直播后从片段中截取"],
        ["IG不是多读一年，而是国际课程地基", "IG是什么？为什么很多国际课程学生要先读IG", "IG", "信任型", ["视频号", "小红书"], "剪辑", "待剪辑", false, "用于解释IG定位"],
        ["DSE和A-Level怎么选，先看出口目标", "DSE适合哪些孩子？和A-Level怎么选", "DSE", "问答型", ["视频号", "小红书"], "剪辑", "待剪辑", false, "适合家长群二次分发"]
      ]
    }
  },
  {
    name: "自动化规则清单",
    fields: [
      { type: "text", name: "规则名称" },
      { type: "select", name: "触发表", multiple: false, options: [{ name: "直播排期表" }, { name: "直播执行表" }, { name: "评论问题库" }, { name: "线索跟进表" }, { name: "直播复盘表" }, { name: "切片分发表" }] },
      { type: "text", name: "触发条件" },
      { type: "text", name: "自动动作" },
      { type: "select", name: "优先级", multiple: false, options: [{ name: "P0" }, { name: "P1" }, { name: "P2" }] },
      { type: "select", name: "实现方式", multiple: false, options: [{ name: "飞书自动化" }, { name: "飞书 AI" }, { name: "手动导入+自动提醒" }, { name: "后续 API" }] },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待配置" }, { name: "已配置" }, { name: "测试中" }, { name: "暂停" }] },
      { type: "text", name: "负责人" },
      { type: "text", name: "备注" }
    ],
    views: [{ name: "P0优先规则", type: "grid" }, { name: "规则状态看板", type: "kanban" }],
    seed: {
      fields: ["规则名称", "触发表", "触发条件", "自动动作", "优先级", "实现方式", "状态", "负责人", "备注"],
      rows: [
        ["新增排期生成脚本/物料/执行任务", "直播排期表", "新增直播排期", "创建脚本任务、封面任务、执行检查任务", "P0", "飞书自动化", "待配置", "卓", "6月开播前必须配置"],
        ["直播前24小时提醒", "直播排期表", "直播日期前24小时", "提醒刘校长、运营、场控、顾问确认", "P0", "飞书自动化", "待配置", "卓", "先用飞书提醒"],
        ["直播结束生成复盘和切片任务", "直播执行表", "直播状态=已结束", "创建复盘记录和3条切片任务", "P0", "飞书自动化", "待配置", "卓", "直播后24小时闭环"],
        ["A/B线索24小时首联提醒", "线索跟进表", "线索等级=A或B", "提醒顾问首联，3天未更新提醒", "P0", "飞书自动化", "待配置", "顾问负责人", "转化闭环关键"],
        ["评论问题生成短视频任务", "评论问题库", "是否可做短视频=是", "创建问答型切片任务", "P1", "飞书自动化", "待配置", "内容/剪辑", "飞书AI开通后自动改写标题"],
        ["周报自动生成", "直播复盘表", "每周日21:00", "汇总直播数据并生成周报草稿", "P1", "飞书 AI", "待配置", "卓", "飞书AI会员开通后配置"]
      ]
    }
  }
];

let existingTables = listTables();
const tableResult = {};

for (const table of tables) {
  let found = existingTables.find(t => t.name === table.name);
  let tableId = found?.id;
  if (!tableId) {
    const created = run(["base", "+table-create", "--base-token", baseToken, "--name", table.name]);
    tableId = created.data.table.id;
    existingTables = listTables();
  }
  tableResult[table.name] = tableId;

  const fields = listFields(tableId);
  const fieldNames = new Set(fields.map(f => f.name));
  for (const field of table.fields) {
    if (fieldNames.has(field.name)) continue;
    run(["base", "+field-create", "--base-token", baseToken, "--table-id", tableId, "--json", writeJson(`.lark_tmp/ops_field_${safeName(table.name)}_${safeName(field.name)}.json`, field)]);
    fieldNames.add(field.name);
  }

  const views = listViews(tableId);
  const viewNames = new Set(views.map(v => v.name));
  for (const view of table.views) {
    if (viewNames.has(view.name)) continue;
    run(["base", "+view-create", "--base-token", baseToken, "--table-id", tableId, "--json", writeJson(`.lark_tmp/ops_view_${safeName(table.name)}_${safeName(view.name)}.json`, view)]);
    viewNames.add(view.name);
  }

  if (table.seed) {
    run(["base", "+record-batch-create", "--base-token", baseToken, "--table-id", tableId, "--json", writeJson(`.lark_tmp/ops_seed_${safeName(table.name)}.json`, table.seed)]);
  }
}

writeFileSync("03_working_files_工作文件/feishu_live_ops_tables_result.json", JSON.stringify({ baseToken, tables: tableResult }, null, 2), "utf8");
console.log(JSON.stringify({ baseToken, tables: tableResult }, null, 2));
