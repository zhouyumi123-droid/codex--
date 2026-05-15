import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
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

const table = {
  name: "直播实时数据记录表",
  fields: [
    { type: "text", name: "记录编号" },
    { type: "text", name: "来源直播" },
    { type: "select", name: "平台", multiple: false, options: [{ name: "抖音" }, { name: "视频号" }, { name: "小红书" }, { name: "其他" }] },
    { type: "datetime", name: "记录时间点", style: { format: "yyyy-MM-dd HH:mm" } },
    { type: "select", name: "直播阶段", multiple: false, options: [{ name: "开场" }, { name: "主体1" }, { name: "主体2" }, { name: "Q&A" }, { name: "转化" }, { name: "结束" }, { name: "异常" }] },
    { type: "text", name: "当前话题" },
    { type: "number", name: "当前在线", style: { type: "plain", precision: 0 } },
    { type: "number", name: "累计场观", style: { type: "plain", precision: 0 } },
    { type: "number", name: "最高在线", style: { type: "plain", precision: 0 } },
    { type: "number", name: "平均停留秒数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "评论数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "点赞数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "新增关注", style: { type: "plain", precision: 0 } },
    { type: "number", name: "私信数", style: { type: "plain", precision: 0 } },
    { type: "number", name: "关键词数量", style: { type: "plain", precision: 0 } },
    { type: "text", name: "关键词明细" },
    { type: "text", name: "主要问题" },
    { type: "text", name: "场控动作" },
    { type: "text", name: "刘校调整建议" },
    { type: "text", name: "异常情况" },
    { type: "checkbox", name: "是否生成复盘点" },
    { type: "checkbox", name: "是否生成切片" },
    { type: "text", name: "备注" }
  ],
  views: [
    { name: "实时记录", type: "grid" },
    { name: "待复盘点", type: "grid" },
    { name: "切片候选", type: "grid" }
  ],
  seed: {
    fields: ["记录编号", "来源直播", "平台", "记录时间点", "直播阶段", "当前话题", "当前在线", "累计场观", "评论数", "新增关注", "私信数", "关键词数量", "关键词明细", "主要问题", "场控动作", "是否生成复盘点", "是否生成切片", "备注"],
    rows: [
      ["0601-DY-000", "北大校长视角：什么样的孩子适合读国际学校？", "抖音", "2026-06-01 19:30", "开场", "开播前测试记录", 0, 0, 0, 0, 0, 0, "", "测试画面、声音、贴片、录屏", "确认直播伴侣、手机观众视角、飞书表格已打开", false, false, "正式开播前可复制本行格式"],
      ["0601-SPH-000", "北大校长视角：什么样的孩子适合读国际学校？", "视频号", "2026-06-01 19:30", "开场", "开播前测试记录", 0, 0, 0, 0, 0, 0, "", "测试画面、声音、贴片、录屏", "确认视频号直播助手、手机观众视角、飞书表格已打开", false, false, "正式开播前可复制本行格式"]
    ]
  }
};

let existingTables = listTables();
let found = existingTables.find(t => t.name === table.name);
let tableId = found?.id;

if (!tableId) {
  const created = run(["base", "+table-create", "--base-token", baseToken, "--name", table.name]);
  tableId = created.data.table.id;
  existingTables = listTables();
}

const fields = listFields(tableId);
const fieldNames = new Set(fields.map(f => f.name));
for (const field of table.fields) {
  if (fieldNames.has(field.name)) continue;
  run(["base", "+field-create", "--base-token", baseToken, "--table-id", tableId, "--json", writeJson(`.lark_tmp/realtime_field_${safeName(field.name)}.json`, field)]);
  fieldNames.add(field.name);
}

const views = listViews(tableId);
const viewNames = new Set(views.map(v => v.name));
for (const view of table.views) {
  if (viewNames.has(view.name)) continue;
  run(["base", "+view-create", "--base-token", baseToken, "--table-id", tableId, "--json", writeJson(`.lark_tmp/realtime_view_${safeName(view.name)}.json`, view)]);
  viewNames.add(view.name);
}

if (table.seed) {
  run(["base", "+record-batch-create", "--base-token", baseToken, "--table-id", tableId, "--json", writeJson(".lark_tmp/realtime_seed.json", table.seed)]);
}

const previousPath = "03_working_files_工作文件/feishu_live_ops_tables_result.json";
let previous = { baseToken, tables: {} };
if (existsSync(previousPath)) {
  previous = JSON.parse(readFileSync(previousPath, "utf8"));
}
previous.baseToken = baseToken;
previous.tables = { ...previous.tables, [table.name]: tableId };
writeFileSync(previousPath, JSON.stringify(previous, null, 2), "utf8");
writeFileSync("03_working_files_工作文件/feishu_realtime_live_table_result.json", JSON.stringify({ baseToken, tables: { [table.name]: tableId } }, null, 2), "utf8");

console.log(JSON.stringify({ baseToken, tables: { [table.name]: tableId } }, null, 2));
