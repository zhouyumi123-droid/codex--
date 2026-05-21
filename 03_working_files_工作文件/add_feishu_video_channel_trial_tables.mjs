import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const cli = "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\lark-cli.cmd";
const baseToken = "TlV5boVxna6LTLsdl5PcFbRunv4";
const as = process.argv.includes("--as-user") ? "user" : "bot";
const shouldSeed = process.argv.includes("--seed");
const seedAutomationOnly = process.argv.includes("--seed-automation-only");

mkdirSync(".lark_tmp", { recursive: true });

function run(args) {
  const finalArgs = [...args, "--as", as];
  console.log(`\n> ${cli} ${finalArgs.join(" ")}`);
  const out = execFileSync(cli, finalArgs, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: true
  });
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

function ensureTable(existingTables, tableName) {
  const found = existingTables.find(t => t.name === tableName || t.table_name === tableName);
  if (found) return found.id || found.table_id;
  const created = run(["base", "+table-create", "--base-token", baseToken, "--name", tableName]);
  return created.data.table.id || created.data.table.table_id;
}

function ensureFields(tableId, tableName, fields) {
  const existingFields = listFields(tableId);
  const names = new Set(existingFields.map(f => f.name));
  for (const field of fields) {
    if (names.has(field.name)) continue;
    run([
      "base", "+field-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", writeJson(`.lark_tmp/video_trial_field_${safeName(tableName)}_${safeName(field.name)}.json`, field)
    ]);
    names.add(field.name);
  }
}

function ensureViews(tableId, tableName, views) {
  const existingViews = listViews(tableId);
  const names = new Set(existingViews.map(v => v.name));
  for (const view of views || []) {
    if (names.has(view.name)) continue;
    run([
      "base", "+view-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", writeJson(`.lark_tmp/video_trial_view_${safeName(tableName)}_${safeName(view.name)}.json`, view)
    ]);
    names.add(view.name);
  }
}

function seed(tableId, tableName, payload) {
  if (!shouldSeed || seedAutomationOnly || !payload) return;
  run([
    "base", "+record-batch-create",
    "--base-token", baseToken,
    "--table-id", tableId,
    "--json", writeJson(`.lark_tmp/video_trial_seed_${safeName(tableName)}.json`, payload)
  ]);
}

const newTables = [
  {
    name: "投流记录表",
    fields: [
      { type: "auto_number", name: "投流编号", style: { rules: [{ type: "text", text: "AD-" }, { type: "created_time", date_format: "yyyyMM" }, { type: "incremental_number", length: 3 }] } },
      { type: "text", name: "关联直播主题" },
      { type: "select", name: "平台", multiple: false, options: [{ name: "视频号" }] },
      { type: "select", name: "投流阶段", multiple: false, options: [{ name: "预约加热" }, { name: "预热视频加热" }, { name: "直播间加热" }, { name: "切片加热" }, { name: "复盘测试" }] },
      { type: "select", name: "投放目标", multiple: false, options: [{ name: "直播预约" }, { name: "直播间进入" }, { name: "视频播放" }, { name: "私信咨询" }, { name: "留资" }, { name: "到校预约" }] },
      { type: "datetime", name: "投放时间", style: { format: "yyyy-MM-dd HH:mm" } },
      { type: "number", name: "投流金额", style: { type: "currency", precision: 2 } },
      { type: "text", name: "素材名称" },
      { type: "select", name: "素材类型", multiple: false, options: [{ name: "直播预约" }, { name: "预热视频" }, { name: "直播间" }, { name: "直播切片" }] },
      { type: "text", name: "定向/人群" },
      { type: "text", name: "预算策略" },
      { type: "number", name: "15分钟后当前在线", style: { type: "plain", precision: 0 } },
      { type: "number", name: "15分钟后累计观看", style: { type: "plain", precision: 0 } },
      { type: "number", name: "15分钟后评论数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "15分钟后私信数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "最终观看", style: { type: "plain", precision: 0 } },
      { type: "number", name: "最终私信", style: { type: "plain", precision: 0 } },
      { type: "number", name: "A/B线索数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "到校预约数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "单条有效线索成本", style: { type: "currency", precision: 2 } },
      { type: "checkbox", name: "是否继续投放" },
      { type: "text", name: "复盘结论" },
      { type: "text", name: "负责人" }
    ],
    views: [
      { name: "投流总览", type: "grid" },
      { name: "待复盘投流", type: "grid" },
      { name: "视频号小额测试", type: "grid" },
      { name: "按目标看板", type: "kanban" }
    ],
    seed: {
      fields: ["关联直播主题", "平台", "投流阶段", "投放目标", "投流金额", "素材名称", "素材类型", "定向/人群", "预算策略", "是否继续投放", "复盘结论", "负责人"],
      rows: [
        ["北大校长视角：什么样的孩子适合读国际学校？", "视频号", "预约加热", "直播预约", 100, "0601视频号直播预约", "直播预约", "深圳家长/国际教育兴趣", "首场只做小额预约验证", false, "首场不重投，重点验证预约和私信承接", "卓"],
        ["A-Level到底难不难？家长最容易误解的5件事", "视频号", "直播间加热", "直播间进入", 200, "A-Level误区直播间", "直播间", "初三/高一转轨家庭", "第二周开始测试直播间小额加热", false, "只改一个变量，观察A/B线索", "卓"],
        ["直播切片：中考后再转国际路线晚不晚", "视频号", "切片加热", "私信咨询", 200, "中考后转轨切片", "直播切片", "中考后转轨家长", "第三周测试切片加热带私信", false, "看单条有效线索成本", "卓"]
      ]
    }
  },
  {
    name: "周报表",
    fields: [
      { type: "text", name: "周报周期" },
      { type: "datetime", name: "周开始", style: { format: "yyyy-MM-dd" } },
      { type: "datetime", name: "周结束", style: { format: "yyyy-MM-dd" } },
      { type: "number", name: "直播场次", style: { type: "plain", precision: 0 } },
      { type: "number", name: "总观看", style: { type: "plain", precision: 0 } },
      { type: "number", name: "平均停留秒数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "总评论", style: { type: "plain", precision: 0 } },
      { type: "number", name: "总私信", style: { type: "plain", precision: 0 } },
      { type: "number", name: "A线索数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "B线索数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "C线索数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "到校预约数", style: { type: "plain", precision: 0 } },
      { type: "number", name: "投流花费", style: { type: "currency", precision: 2 } },
      { type: "number", name: "有效线索成本", style: { type: "currency", precision: 2 } },
      { type: "text", name: "最佳主题" },
      { type: "text", name: "最差主题" },
      { type: "text", name: "顾问反馈" },
      { type: "text", name: "下周动作" },
      { type: "text", name: "AI周报草稿" },
      { type: "select", name: "状态", multiple: false, options: [{ name: "待生成" }, { name: "AI已生成" }, { name: "人工已确认" }, { name: "已发送" }] },
      { type: "text", name: "负责人" }
    ],
    views: [
      { name: "6月周报", type: "grid" },
      { name: "待确认周报", type: "grid" },
      { name: "周报状态看板", type: "kanban" }
    ],
    seed: {
      fields: ["周报周期", "周开始", "周结束", "直播场次", "状态", "负责人", "下周动作"],
      rows: [
        ["6月第1周：首场闭环", "2026-06-01", "2026-06-07", 1, "待生成", "卓", "确认首场直播数据、线索、复盘和切片是否跑通"],
        ["6月第2周：主题验证", "2026-06-08", "2026-06-14", 3, "待生成", "卓", "比较2-3个主题带来的A/B线索"],
        ["6月第3周：转化优化", "2026-06-15", "2026-06-21", 3, "待生成", "卓", "固定高表现话术和顾问首联模板"],
        ["6月第4周：月度模型", "2026-06-22", "2026-06-30", 3, "待生成", "卓", "输出月度复盘并决定7月投流节奏"]
      ]
    }
  }
];

const supplementalFields = {
  "直播排期表": [
    { type: "text", name: "视频号预约链接" },
    { type: "select", name: "试播阶段", multiple: false, options: [{ name: "首场闭环" }, { name: "主题验证" }, { name: "转化优化" }, { name: "月度模型" }] },
    { type: "select", name: "投流策略", multiple: false, options: [{ name: "不投流" }, { name: "预约小额加热" }, { name: "预热视频加热" }, { name: "直播间小额加热" }, { name: "切片加热" }] },
    { type: "select", name: "私域预热渠道", multiple: true, options: [{ name: "微信群" }, { name: "朋友圈" }, { name: "公众号" }, { name: "学校社群" }, { name: "顾问私发" }] },
    { type: "text", name: "微信客服/私信负责人" }
  ],
  "直播执行表": [
    { type: "select", name: "视频号预约状态", multiple: false, options: [{ name: "未创建" }, { name: "已创建" }, { name: "已转发" }, { name: "异常" }] },
    { type: "checkbox", name: "微信客服检查" },
    { type: "text", name: "直播中记录节奏" },
    { type: "text", name: "视频号回放链接" }
  ],
  "直播实时数据记录表": [
    { type: "number", name: "预约数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "分享数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "微信客服新增咨询", style: { type: "plain", precision: 0 } }
  ],
  "线索跟进表": [
    { type: "select", name: "触发关键词", multiple: false, options: [{ name: "评估" }, { name: "路线" }, { name: "到校" }, { name: "资料" }, { name: "A-Level" }, { name: "DSE" }, { name: "费用" }, { name: "管理" }, { name: "其他" }] },
    { type: "select", name: "承接入口", multiple: false, options: [{ name: "视频号评论" }, { name: "视频号私信" }, { name: "微信客服" }, { name: "微信群" }, { name: "朋友圈" }] },
    { type: "select", name: "首联SLA", multiple: false, options: [{ name: "2小时内" }, { name: "24小时内" }, { name: "内容沉淀" }] },
    { type: "checkbox", name: "是否超时" },
    { type: "text", name: "顾问反馈" }
  ],
  "直播复盘表": [
    { type: "select", name: "平台", multiple: false, options: [{ name: "视频号" }] },
    { type: "number", name: "点赞数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "分享数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "新增关注", style: { type: "plain", precision: 0 } },
    { type: "number", name: "投流花费", style: { type: "currency", precision: 2 } },
    { type: "number", name: "A类线索数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "B类线索数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "C类线索数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "单条有效线索成本", style: { type: "currency", precision: 2 } },
    { type: "text", name: "视频号回放链接" },
    { type: "text", name: "AI复盘摘要" },
    { type: "text", name: "下场优化动作" }
  ]
};

const supplementalViews = {
  "直播排期表": [
    { name: "视频号6月试播排期", type: "grid" },
    { name: "本周视频号待开播", type: "grid" }
  ],
  "线索跟进表": [
    { name: "视频号A/B待跟进", type: "grid" },
    { name: "微信客服承接看板", type: "kanban" }
  ],
  "直播复盘表": [
    { name: "视频号6月复盘", type: "grid" },
    { name: "月度试播总览", type: "grid" }
  ],
  "直播实时数据记录表": [
    { name: "视频号实时记录", type: "grid" }
  ]
};

const automationSeed = {
  fields: ["规则名称", "触发表", "触发条件", "自动动作", "优先级", "实现方式", "状态", "负责人", "备注"],
  rows: [
    [
      "视频号新增排期生成任务",
      "直播排期表",
      "新增记录且平台包含视频号",
      "创建脚本任务、物料任务、执行检查任务、复盘占位记录",
      "P0",
      "飞书自动化",
      "待配置",
      "卓",
      "6月试播所有直播从排期表发起"
    ],
    [
      "视频号开播前24小时检查提醒",
      "直播排期表",
      "直播日期前24小时",
      "提醒刘校、运营、顾问确认脚本、物料、预约链接、微信客服/私信后台",
      "P0",
      "飞书自动化",
      "待配置",
      "卓",
      "首场直播前必须验证提醒能触达"
    ],
    [
      "视频号结束后生成复盘和切片",
      "直播执行表",
      "直播状态改为已结束",
      "创建直播复盘记录，创建3条切片任务，提醒运营24小时内补齐数据",
      "P0",
      "飞书自动化",
      "待配置",
      "卓",
      "切片默认为观点型、问答型、转化型"
    ],
    [
      "视频号A/B线索首联提醒",
      "线索跟进表",
      "来源平台=视频号且线索等级=A或B",
      "提醒顾问首联，A类2小时内，B类24小时内",
      "P0",
      "飞书自动化",
      "待配置",
      "顾问负责人",
      "承接入口为视频号私信或微信客服"
    ],
    [
      "视频号A/B线索3天未更新提醒",
      "线索跟进表",
      "A/B线索跟进状态3天未更新",
      "提醒顾问和运营负责人复查线索，更新下一步动作",
      "P0",
      "飞书自动化",
      "待配置",
      "顾问负责人",
      "避免高意向家长掉线"
    ],
    [
      "视频号周报AI草稿",
      "直播复盘表",
      "每周日21:00",
      "汇总本周观看、评论、私信、线索、到校、投流花费，生成周报草稿",
      "P1",
      "飞书 AI",
      "待配置",
      "卓",
      "飞书AI开通后启用，人工确认后发送"
    ]
  ]
};

let existingTables = listTables();
const result = { baseToken, tables: {}, updatedTables: {}, as, seeded: shouldSeed };

for (const table of newTables) {
  const tableId = ensureTable(existingTables, table.name);
  result.tables[table.name] = tableId;
  existingTables = listTables();
  ensureFields(tableId, table.name, table.fields);
  ensureViews(tableId, table.name, table.views);
  seed(tableId, table.name, table.seed);
}

existingTables = listTables();
for (const [tableName, fields] of Object.entries(supplementalFields)) {
  const found = existingTables.find(t => t.name === tableName || t.table_name === tableName);
  if (!found) {
    console.warn(`Skip missing table: ${tableName}`);
    continue;
  }
  const tableId = found.id || found.table_id;
  result.updatedTables[tableName] = tableId;
  ensureFields(tableId, tableName, fields);
  ensureViews(tableId, tableName, supplementalViews[tableName] || []);
}

if (shouldSeed || seedAutomationOnly) {
  existingTables = listTables();
  const automationTable = existingTables.find(t => t.name === "自动化规则清单" || t.table_name === "自动化规则清单");
  if (automationTable) {
    const automationTableId = automationTable.id || automationTable.table_id;
    seedAutomationOnly || console.log("Seeding video-channel automation rules");
    run([
      "base", "+record-batch-create",
      "--base-token", baseToken,
      "--table-id", automationTableId,
      "--json", writeJson(".lark_tmp/video_trial_seed_automation_rules.json", automationSeed)
    ]);
    result.updatedTables["自动化规则清单"] = automationTableId;
  } else {
    console.warn("Skip missing table: 自动化规则清单");
  }
}

const previousPath = "03_working_files_工作文件/feishu_live_ops_tables_result.json";
let previous = { baseToken, tables: {} };
if (existsSync(previousPath)) {
  previous = JSON.parse(readFileSync(previousPath, "utf8"));
}

previous.baseToken = baseToken;
previous.tables = { ...previous.tables, ...result.tables };
writeFileSync(previousPath, JSON.stringify(previous, null, 2), "utf8");
writeFileSync("03_working_files_工作文件/feishu_video_channel_trial_tables_result.json", JSON.stringify(result, null, 2), "utf8");

console.log(JSON.stringify(result, null, 2));
