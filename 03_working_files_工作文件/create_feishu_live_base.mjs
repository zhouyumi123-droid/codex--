import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";

const cli = "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\lark-cli.cmd";
const spec = JSON.parse(readFileSync(new URL("./feishu_live_base_spec.json", import.meta.url), "utf8"));
const as = process.argv.includes("--as-user") ? "user" : "bot";

function run(args, inputPath = null) {
  const finalArgs = [...args, "--as", as];
  const cmd = `${cli} ${finalArgs.map(a => a.includes(" ") ? `"${a}"` : a).join(" ")}`;
  console.log(`\n> ${cmd}`);
  try {
    const out = execFileSync(cli, finalArgs, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
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

const baseRes = run(["base", "+base-create", "--name", spec.baseName, "--time-zone", spec.timeZone]);
const baseToken = getBaseToken(baseRes);
if (!baseToken) throw new Error("Base created but token was not found in CLI output.");

const result = { baseName: spec.baseName, baseToken, tables: {} };

for (const table of spec.tables) {
  const firstField = table.fields[0] || { type: "text", name: "标题" };
  const tableRes = run([
    "base", "+table-create",
    "--base-token", baseToken,
    "--name", table.name,
    "--fields", JSON.stringify([firstField])
  ]);
  const tableId = getTableId(tableRes);
  if (!tableId) throw new Error(`Table ${table.name} created but table id was not found.`);
  result.tables[table.name] = { tableId };

  for (const field of table.fields.slice(1)) {
    run([
      "base", "+field-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", JSON.stringify(field)
    ]);
  }

  for (const view of table.views || []) {
    run([
      "base", "+view-create",
      "--base-token", baseToken,
      "--table-id", tableId,
      "--json", JSON.stringify(view)
    ]);
  }
}

for (const [tableName, payload] of Object.entries(spec.seedRecords || {})) {
  const tableId = result.tables[tableName]?.tableId;
  if (!tableId) continue;
  const path = `seed_${tableName}.json`;
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
