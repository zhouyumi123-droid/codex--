import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { beautifyPpt } from "./engine.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const OUTPUT_DIR = path.join(__dirname, "outputs");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const PORT = Number(process.env.PPT_BEAUTIFIER_PORT || 38787);

const STYLE_OPTIONS = [
  { id: "oxstand_bright", name: "\u5965\u65af\u7ff0\u660e\u4eae\u84dd\u767d\u98ce" },
  { id: "clean_business", name: "\u901a\u7528\u84dd\u767d\u5546\u52a1\u98ce" },
  { id: "fresh_edu", name: "\u6559\u80b2\u9752\u84dd\u6d3b\u529b\u98ce" },
];

function send(res, code, body, type = "text/plain; charset=utf-8") {
  res.writeHead(code, { "Content-Type": type });
  res.end(body);
}

function resultJson(res, data, code = 200) {
  send(res, code, JSON.stringify(data, null, 2), "application/json; charset=utf-8");
}

function safeJoin(base, target) {
  const resolved = path.resolve(base, target);
  if (!resolved.startsWith(path.resolve(base))) throw new Error("Invalid path");
  return resolved;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

function splitBuffer(buf, sep) {
  const out = [];
  let start = 0;
  let idx = buf.indexOf(sep, start);
  while (idx !== -1) {
    out.push(buf.subarray(start, idx));
    start = idx + sep.length;
    idx = buf.indexOf(sep, start);
  }
  out.push(buf.subarray(start));
  return out;
}

function parseMultipart(buffer, contentType) {
  const m = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  if (!m) throw new Error("Missing multipart boundary.");
  const boundary = Buffer.from(`--${m[1] || m[2]}`);
  const parts = splitBuffer(buffer, boundary)
    .map((p) => {
      if (p.subarray(0, 2).toString() === "\r\n") p = p.subarray(2);
      if (p.subarray(-2).toString() === "\r\n") p = p.subarray(0, -2);
      if (p.toString() === "--" || p.length < 4) return null;
      return p;
    })
    .filter(Boolean);
  const fields = {};
  const files = {};
  for (const part of parts) {
    const marker = Buffer.from("\r\n\r\n");
    const markerIdx = part.indexOf(marker);
    if (markerIdx < 0) continue;
    const header = part.subarray(0, markerIdx).toString("utf8");
    let body = part.subarray(markerIdx + marker.length);
    if (body.subarray(-2).toString() === "\r\n") body = body.subarray(0, -2);
    const name = /name="([^"]+)"/i.exec(header)?.[1];
    const filename = /filename="([^"]*)"/i.exec(header)?.[1];
    if (!name) continue;
    if (filename) files[name] = { filename: path.basename(filename), data: body };
    else fields[name] = body.toString("utf8");
  }
  return { fields, files };
}

async function handleGenerateFromPath(req, res) {
  const body = await readBody(req);
  const payload = JSON.parse(body.toString("utf8") || "{}");
  if (!payload.input) throw new Error("Please provide an input file path or upload a file.");
  const result = await beautifyPpt(payload.input, {
    style: payload.style || "oxstand_bright",
    title: payload.title || "",
    maxSlides: payload.maxSlides || 40,
    outDir: OUTPUT_DIR,
  });
  result.download = `/download/${encodeURIComponent(path.basename(result.output))}`;
  result.relativeOutput = path.relative(ROOT, result.output);
  resultJson(res, result);
}

async function handleUploadGenerate(req, res) {
  const buffer = await readBody(req);
  const { fields, files } = parseMultipart(buffer, req.headers["content-type"]);
  const file = files.file;
  if (!file || !file.data?.length) throw new Error("Please choose a file.");
  const safeName = `${Date.now()}_${file.filename.replace(/[\\/:*?"<>|]/g, "_")}`;
  const inputPath = path.join(UPLOAD_DIR, safeName);
  fs.writeFileSync(inputPath, file.data);
  const result = await beautifyPpt(inputPath, {
    style: fields.style || "oxstand_bright",
    title: fields.title || path.basename(file.filename, path.extname(file.filename)),
    maxSlides: fields.maxSlides || 40,
    outDir: OUTPUT_DIR,
  });
  result.download = `/download/${encodeURIComponent(path.basename(result.output))}`;
  result.relativeOutput = path.relative(ROOT, result.output);
  resultJson(res, result);
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  try {
    if (req.method === "GET" && url.pathname === "/") {
      send(res, 200, fs.readFileSync(path.join(__dirname, "index.html"), "utf8"), "text/html; charset=utf-8");
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/styles") {
      resultJson(res, STYLE_OPTIONS);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/generate") {
      await handleGenerateFromPath(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/upload-generate") {
      await handleUploadGenerate(req, res);
      return;
    }
    if (req.method === "GET" && url.pathname.startsWith("/download/")) {
      const fileName = decodeURIComponent(url.pathname.replace("/download/", ""));
      const filePath = safeJoin(OUTPUT_DIR, fileName);
      if (!fs.existsSync(filePath)) {
        send(res, 404, "File not found.");
        return;
      }
      res.writeHead(200, {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(path.basename(filePath))}`,
      });
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    send(res, 404, "Not found.");
  } catch (err) {
    resultJson(res, { error: err.message || String(err) }, 500);
  }
}

http.createServer(handleRequest).listen(PORT, "127.0.0.1", () => {
  console.log(`PPT Beautifier is running: http://127.0.0.1:${PORT}`);
  console.log(`Outputs: ${OUTPUT_DIR}`);
});
