import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const cli = "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\lark-cli.cmd";
const spec = JSON.parse(readFileSync(new URL("./feishu_live_base_spec.json", import.meta.url), "utf8"));
const as = process.argv.includes("--as-user") ? "user" : "bot";
const baseTokenArgIndex = process.argv.indexOf("--base-token");
const existingBaseToken = baseTokenArgIndex >= 0 ? process.argv[baseTokenArgIndex + 1] : null;
mkdirSync(".lark_tmp", { recursive: true });

function run(args, inputPath = null) {
  const finalArgs = [...args, "--as", as];
  const cmd = `${cli} ${finalArgs.map(a => a.includes(" ") ? `"${a}"` : a).join(" ")}`;
  console.log(`\n> ${cmd}`);
  try {
    const out = execFileSync(cli, finalArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], shell: true });
    if (out.trim()) console.log(out.trim());
    return JSON.parse(out);
  } catch (err) {
    const stdout = err.stdout?.toString() || "";
    const stderr = err.stderr?.toString() || "";
    if (stdout.trim()) console.error(stdout.trim());
    if (stderr.trim()) console.error(stderr.trim());
    throw err;
  }
}

function writeJson(name, obj) {
  writeFileSync(name, JSON.stringify(obj, null, 2), "utf8");
  return `@${name}`;
}

function getBaseToken(res) {
  return res?.base?.token || res?.base?.app_token || res?.data?.base?.token || res?.data?.base?.app_token || res?.token || res?.app_token;
}

function getTableId(res) {
  return res?.table?.table_id || res?.table?.id || res?.data?.table?.table_id || res?.data?.table?.id;
}

function listTables(baseToken) {
  const res = run(["base", "+table-list", "--base-token", baseToken, "--offset", "0", "--limit", "100"]);
  return res?.data?.tables || res?.tables || [];
}

function listFields(baseToken, tableId) {
  const res = run(["base", "+field-list", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]);
  return res?.data?.fields || res?.fields || [];
}

function listViews(baseToken, tableId) {
  const res = run(["base", "+view-list", "--base-token", baseToken, "--table-id", tableId, "--offset", "0", "--limit", "200"]);
  return res?.data?.views || res?.views || [];
}

let baseToken = existingBaseToken;
if (!baseToken) {
  const baseRes = run(["base", "+base-create", "--name", spec.baseName, "--time-zone", spec.timeZone]);
  baseToken = getBaseToken(baseRes);
  if (!baseToken) throw new Error("Base created but token was not found in CLI output.");
}

const result = { baseName: spec.baseName, baseToken, tables: {} };
let existingTables = listTables(baseToken);

for (const table of spec.tables) {
  const tableKey = table.name.replace(/[^\w-]/g, "_");
  let existingTable = existingTables.find(t => t.name === table.name || t.table_name === table.name);
  let tableId = existingTable?.id || existingTable?.table_id;
  if (!tableId) {
    const tableRes = run([
      "base", "+table-create",
      "--base-token", baseToken,
      "--name", table.name
    ]);
    tableId = getTableId(tableRes);
    existingTables = listTables(baseToken);
  }
  if (!tableId) throw new Error(`Table ${table.name} created but table id was not found.`);
  result.tables[table.name] = { tableId };

  let existingFields = listFields(baseToken, tableId);
  const existingFieldNames = new Set(existingFields.map(f => f.name));
  for (const field of table.fields) {
    if (existingFieldNames.has(field.name)) continue;
    run([
      "base", "+field-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", writeJson(`.lark_tmp/field_${tableKey}_${field.name.replace(/[^\w-]/g, "_")}.json`, field)
    ]);
    existingFieldNames.add(field.name);
  }

  let existingViews = listViews(baseToken, tableId);
  const existingViewNames = new Set(existingViews.map(v => v.name));
  for (const view of table.views || []) {
    if (existingViewNames.has(view.name)) continue;
    run([
      "base", "+view-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", writeJson(`.lark_tmp/view_${tableKey}_${view.name.replace(/[^\w-]/g, "_")}.json`, view)
    ]);
    existingViewNames.add(view.name);
  }
}

for (const [tableName, payload] of Object.entries(spec.seedRecords || {})) {
  const tableId = result.tables[tableName]?.tableId;
  if (!tableId) continue;
  const path = `.lark_tmp/seed_${tableName.replace(/[^\w-]/g, "_")}.json`;
  run([
    "base", "+record-batch-create",
    "--base-token", baseToken,
    "--table-id", tableId,
    "--json", writeJson(path, payload)
  ]);
}

writeFileSync("feishu_live_base_result.json", JSON.stringify(result, null, 2), "utf8");
console.log("\nDONE");
console.log(JSON.stringify(result, null, 2));
