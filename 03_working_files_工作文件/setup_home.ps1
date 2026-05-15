$ErrorActionPreference = "Stop"

Write-Host "Checking Git..." -ForegroundColor Cyan
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed or not in PATH."
}

Write-Host "Checking Node.js..." -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is not installed or not in PATH."
}

Write-Host "Checking lark-cli..." -ForegroundColor Cyan
$lark = Get-Command "lark-cli" -ErrorAction SilentlyContinue
if (-not $lark) {
  $fallback = Join-Path $env:APPDATA "npm\lark-cli.cmd"
  if (Test-Path $fallback) {
    $lark = $fallback
  } else {
    Write-Host "lark-cli not found. Installing/updating..." -ForegroundColor Yellow
    npm update -g @larksuite/cli
    $lark = Get-Command "lark-cli" -ErrorAction SilentlyContinue
  }
}

Write-Host "Updating project repo..." -ForegroundColor Cyan
$repo = Join-Path $PSScriptRoot ".."
$repo = (Resolve-Path $repo).Path
Set-Location $repo
git pull

Write-Host "Checking project entry files..." -ForegroundColor Cyan
$entry = Join-Path $repo "START_HERE_先读我.md"
if (Test-Path $entry) {
  Write-Host "Found: $entry" -ForegroundColor Green
} else {
  Write-Host "Missing: $entry" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next step: open Codex and say:" -ForegroundColor Cyan
Write-Host "继续刘校直播项目，按 START_HERE_先读我.md 恢复上下文。" -ForegroundColor Yellow
Write-Host ""
Write-Host "If you need 飞书授权, run:" -ForegroundColor Cyan
Write-Host "lark-cli auth login --domain base" -ForegroundColor Yellow
