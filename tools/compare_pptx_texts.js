const fs = require("fs");

const beforePath = process.argv[2];
const afterPath = process.argv[3];
if (!beforePath || !afterPath) {
  console.error("Usage: node tools/compare_pptx_texts.js <before.json> <after.json>");
  process.exit(1);
}

const before = JSON.parse(fs.readFileSync(beforePath, "utf8"));
const after = JSON.parse(fs.readFileSync(afterPath, "utf8"));

const issues = [];
if (before.length !== after.length) {
  issues.push(`node count changed: before=${before.length}, after=${after.length}`);
}

const count = Math.min(before.length, after.length);
for (let i = 0; i < count; i++) {
  const a = before[i];
  const b = after[i];
  if (a.slide !== b.slide || a.node !== b.node || a.text !== b.text) {
    issues.push(`mismatch at index ${i}: before slide=${a.slide} node=${a.node} text=${JSON.stringify(a.text)}; after slide=${b.slide} node=${b.node} text=${JSON.stringify(b.text)}`);
    if (issues.length >= 20) break;
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(2);
}

console.log(`text unchanged: ${before.length} nodes`);
