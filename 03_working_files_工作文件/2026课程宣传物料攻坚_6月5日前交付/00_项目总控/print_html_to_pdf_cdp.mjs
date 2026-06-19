import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const job = process.argv[2];
if (!job || !["landscape", "portrait"].includes(job)) {
  console.error("Usage: node print_html_to_pdf_cdp.mjs landscape|portrait");
  process.exit(1);
}

const tmpRoot = "D:/codex/cdx-IDE/pdfwork_oxstand/brochure";
const html = path.join(tmpRoot, `${job}.html`);
const pdf = path.join(tmpRoot, `${job}.pdf`);
const profile = path.join(tmpRoot, `cdp-profile-${job}-${Date.now()}`);
const port = job === "landscape" ? 9223 : 9224;

fs.mkdirSync(profile, { recursive: true });
if (fs.existsSync(pdf)) fs.unlinkSync(pdf);

const proc = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--disable-extensions",
  "--allow-file-access-from-files",
  `--user-data-dir=${profile}`,
  `--remote-debugging-port=${port}`,
  "about:blank",
], { stdio: "ignore", windowsHide: true });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function putJson(url) {
  const res = await fetch(url, { method: "PUT" });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function waitForEndpoint() {
  for (let i = 0; i < 80; i++) {
    try {
      return await getJson(`http://127.0.0.1:${port}/json/version`);
    } catch {
      await sleep(250);
    }
  }
  throw new Error("Chrome DevTools endpoint did not start");
}

let id = 0;
const pending = new Map();
function send(ws, method, params = {}) {
  const msgId = ++id;
  ws.send(JSON.stringify({ id: msgId, method, params }));
  return new Promise((resolve, reject) => {
    pending.set(msgId, { resolve, reject });
  });
}

try {
  await waitForEndpoint();
  const targetUrl = `file:///${html.replaceAll("\\", "/")}`;
  let pageTarget;
  try {
    pageTarget = await putJson(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(targetUrl)}`);
  } catch {
    const tabs = await getJson(`http://127.0.0.1:${port}/json`);
    pageTarget = tabs.find((tab) => tab.type === "page") || tabs[0];
    await fetch(`http://127.0.0.1:${port}/json/activate/${pageTarget.id}`).catch(() => {});
  }
  const wsUrl = pageTarget.webSocketDebuggerUrl;
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  ws.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve: ok, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else ok(msg.result);
    }
  });
  await send(ws, "Page.enable");
  await send(ws, "Page.navigate", { url: targetUrl });
  await sleep(8000);
  const result = await send(ws, "Page.printToPDF", {
    landscape: job === "landscape",
    printBackground: true,
    preferCSSPageSize: true,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
  });
  fs.writeFileSync(pdf, Buffer.from(result.data, "base64"));
  ws.close();
  console.log(`${job} pdf written: ${pdf}`);
} finally {
  proc.kill();
}
