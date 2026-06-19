import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpegPath from "ffmpeg-static";

const LARK = "C:\\Users\\Administrator\\AppData\\Roaming\\npm\\lark-cli.cmd";
const projectRoot = "D:\\codex\\cdx-IDE\\projects\\奥斯翰国际学校";
const defaultOutDir = path.join(
  projectRoot,
  "03_working_files_工作文件",
  "2026课程宣传物料攻坚_6月5日前交付",
  "01_任务书与资料",
  "audio_transcripts",
);

const files = process.argv.slice(2);

if (!files.length) {
  console.error("Usage: node transcribe_audio_with_lark_minutes.mjs <audio-or-video-file> [more files...]");
  process.exit(2);
}

function run(args, opts = {}) {
  const res = spawnSync(LARK, args, {
    encoding: "utf8",
    shell: true,
    maxBuffer: 1024 * 1024 * 20,
    ...opts,
  });
  if (res.error) throw res.error;
  if (res.status !== 0) {
    const text = [res.stdout, res.stderr].filter(Boolean).join("\n");
    throw new Error(`lark-cli ${args.join(" ")} failed with ${res.status}\n${text}`);
  }
  return res.stdout.trim();
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const first = text.indexOf("{");
    const last = text.lastIndexOf("}");
    if (first >= 0 && last > first) return JSON.parse(text.slice(first, last + 1));
    throw new Error(`Cannot parse JSON output:\n${text.slice(0, 2000)}`);
  }
}

function findDeep(obj, names) {
  if (!obj || typeof obj !== "object") return "";
  for (const name of names) {
    if (typeof obj[name] === "string" && obj[name]) return obj[name];
  }
  for (const value of Object.values(obj)) {
    const found = findDeep(value, names);
    if (found) return found;
  }
  return "";
}

function extractMinuteToken(minuteUrl) {
  const clean = String(minuteUrl).split("?")[0].replace(/\/$/, "");
  return clean.split("/").pop();
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function compressIfNeeded(file, itemOutDir) {
  const size = fs.statSync(file).size;
  if (size <= 19 * 1024 * 1024) return file;
  const out = path.join(itemOutDir, `${path.basename(file, path.extname(file))}_compressed_32k.mp3`);
  if (fs.existsSync(out) && fs.statSync(out).size > 0 && fs.statSync(out).size <= 19 * 1024 * 1024) return out;
  console.log(`File is ${(size / 1024 / 1024).toFixed(1)} MB; compressing to mp3 for Lark upload...`);
  const res = spawnSync(ffmpegPath, ["-y", "-i", file, "-vn", "-ac", "1", "-ar", "16000", "-b:a", "32k", out], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 20,
  });
  if (res.error) throw res.error;
  if (res.status !== 0) throw new Error(`ffmpeg failed with ${res.status}\n${res.stderr || res.stdout}`);
  const outSize = fs.statSync(out).size;
  if (outSize > 19 * 1024 * 1024) throw new Error(`Compressed file still too large: ${(outSize / 1024 / 1024).toFixed(1)} MB`);
  return out;
}

fs.mkdirSync(defaultOutDir, { recursive: true });

for (const rawFile of files) {
  const file = path.resolve(rawFile);
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);

  const base = path.basename(file, path.extname(file));
  const itemOutDir = path.join(defaultOutDir, base);
  fs.mkdirSync(itemOutDir, { recursive: true });

  console.log(`\n=== ${path.basename(file)} ===`);
  let minuteToken = "";
  let minuteUrl = "";
  const tokenPath = path.join(itemOutDir, "minute_token.txt");
  const urlPath = path.join(itemOutDir, "minute_url.txt");
  if (fs.existsSync(tokenPath)) {
    minuteToken = fs.readFileSync(tokenPath, "utf8").trim();
    minuteUrl = fs.existsSync(urlPath) ? fs.readFileSync(urlPath, "utf8").trim() : "";
    console.log(`Using existing minute token: ${minuteToken}`);
  } else {
    const uploadFile = compressIfNeeded(file, itemOutDir);
    console.log("1/3 Uploading to Lark Drive...");
    const uploadOut = run(["drive", "+upload", "--as", "user", "--file", `.${path.sep}${path.basename(uploadFile)}`], {
      cwd: path.dirname(uploadFile),
    });
    fs.writeFileSync(path.join(itemOutDir, "01_drive_upload_output.txt"), uploadOut, "utf8");
    const uploadJson = parseJson(uploadOut);
    const fileToken = findDeep(uploadJson, ["file_token", "token"]);
    if (!fileToken) throw new Error(`No file_token found in upload output:\n${uploadOut.slice(0, 2000)}`);

    console.log("2/3 Creating Lark Minutes...");
    const minuteOut = run(["minutes", "+upload", "--as", "user", "--file-token", fileToken, "--format", "json"]);
    fs.writeFileSync(path.join(itemOutDir, "02_minutes_upload_output.json"), minuteOut, "utf8");
    const minuteJson = parseJson(minuteOut);
    minuteUrl = findDeep(minuteJson, ["minute_url", "url"]);
    if (!minuteUrl) throw new Error(`No minute_url found in minutes output:\n${minuteOut.slice(0, 2000)}`);
    minuteToken = extractMinuteToken(minuteUrl);
    fs.writeFileSync(urlPath, minuteUrl, "utf8");
    fs.writeFileSync(tokenPath, minuteToken, "utf8");
  }

  console.log(`Minute URL: ${minuteUrl}`);
  console.log("3/3 Waiting for transcript artifacts...");
  let ok = false;
  let lastError = "";
  for (let i = 1; i <= 18; i++) {
    try {
      const notesOut = run([
        "vc",
        "+notes",
        "--as",
        "user",
        "--minute-tokens",
        minuteToken,
        "--output-dir",
        `.${path.sep}${base}`,
        "--overwrite",
        "--format",
        "json",
      ], { cwd: defaultOutDir });
      fs.writeFileSync(path.join(itemOutDir, "03_notes_output.json"), notesOut, "utf8");
      const transcriptCandidates = [];
      const stack = [parseJson(notesOut)];
      while (stack.length) {
        const cur = stack.pop();
        if (!cur || typeof cur !== "object") continue;
        for (const [k, v] of Object.entries(cur)) {
          if (k.includes("transcript") && typeof v === "string") transcriptCandidates.push(v);
          if (v && typeof v === "object") stack.push(v);
        }
      }
      const existing = transcriptCandidates.find((p) => fs.existsSync(path.resolve(p)));
      if (existing || transcriptCandidates.length) {
        ok = true;
        break;
      }
    } catch (err) {
      lastError = err.message;
      fs.writeFileSync(path.join(itemOutDir, "last_error.txt"), lastError, "utf8");
    }
    console.log(`  transcript not ready, retry ${i}/18`);
    sleep(20000);
  }

  if (!ok) {
    console.log("Transcript may still be processing. Re-run vc +notes later with the saved minute_token.");
    if (lastError) console.log(lastError.slice(0, 1000));
  } else {
    console.log(`Done. Output directory: ${itemOutDir}`);
  }
}
