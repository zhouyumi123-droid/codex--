$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $ProjectRoot

$LogDir = Join-Path $ProjectRoot "tools\ppt_beautifier\logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$LogFile = Join-Path $LogDir ("server_" + (Get-Date -Format "yyyyMMdd_HHmmss") + ".log")

$port = if ($env:PPT_BEAUTIFIER_PORT) { [int]$env:PPT_BEAUTIFIER_PORT } else { 38787 }
$url = "http://127.0.0.1:$port"

try {
  $node = Get-Command node -ErrorAction Stop
} catch {
  Write-Host "Node.js was not found. Please install Node.js or open this tool through Codex." -ForegroundColor Red
  throw
}

$busy = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
if ($busy) {
  $owners = $busy | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($owner in $owners) {
    $proc = Get-Process -Id $owner -ErrorAction SilentlyContinue
    if ($proc -and $proc.ProcessName -eq "node") {
      Write-Host "Stopping old PPT Beautifier node process: $owner" -ForegroundColor Yellow
      Stop-Process -Id $owner -Force -ErrorAction SilentlyContinue
    } elseif ($proc) {
      Write-Host "Port $port is used by $($proc.ProcessName) (PID $owner). Please close it or set PPT_BEAUTIFIER_PORT." -ForegroundColor Red
      throw "Port $port is occupied."
    }
  }
  Start-Sleep -Seconds 1
}

Write-Host "PPT Beautifier is starting..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Cyan
Write-Host "Log: $LogFile" -ForegroundColor DarkGray
Write-Host "Keep this window open while using the tool." -ForegroundColor DarkGray

Start-Process $url

try {
  node "tools\ppt_beautifier\server.mjs" 2>&1 | Tee-Object -FilePath $LogFile
} catch {
  Write-Host "Server failed to start. Log file: $LogFile" -ForegroundColor Red
  throw
}
