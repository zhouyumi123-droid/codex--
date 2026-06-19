param(
  [Parameter(Mandatory=$true)][string]$WorkDir,
  [Parameter(Mandatory=$true)][string]$OutDir
)

$ErrorActionPreference = "Stop"
New-Item -ItemType Directory -Path $OutDir -Force | Out-Null

function Get-SlideNumber([string]$Path) {
  if ([IO.Path]::GetFileName($Path) -match 'slide(\d+)\.xml$') {
    return [int]$Matches[1]
  }
  return 0
}

$slides = Get-ChildItem -Path (Join-Path $WorkDir 'ppt\slides') -Filter 'slide*.xml' |
  Sort-Object { Get-SlideNumber $_.FullName }

$ns = New-Object Xml.XmlNamespaceManager((New-Object Xml.XmlDocument).NameTable)
$ns.AddNamespace('a', 'http://schemas.openxmlformats.org/drawingml/2006/main')
$ns.AddNamespace('p', 'http://schemas.openxmlformats.org/presentationml/2006/main')

$textRows = @()
$shapeRows = @()
$colors = @{}
$fonts = @{}

foreach ($slide in $slides) {
  [xml]$xml = Get-Content -LiteralPath $slide.FullName -Raw
  $num = Get-SlideNumber $slide.FullName
  $texts = $xml.SelectNodes('//a:t', $ns)
  $shapeRows += [pscustomobject]@{
    slide = $num
    text_nodes = $texts.Count
    shapes = $xml.SelectNodes('//p:sp', $ns).Count
    pictures = $xml.SelectNodes('//p:pic', $ns).Count
    graphic_frames = $xml.SelectNodes('//p:graphicFrame', $ns).Count
  }
  $i = 0
  foreach ($t in $texts) {
    $textRows += [pscustomobject]@{
      slide = $num
      node = $i
      text = $t.InnerText
    }
    $i++
  }
  foreach ($clr in $xml.SelectNodes('//a:srgbClr', $ns)) {
    $val = $clr.GetAttribute('val')
    if ($val) { $colors[$val] = 1 + ($colors[$val] | ForEach-Object { if($_){$_} else {0} }) }
  }
  foreach ($latin in $xml.SelectNodes('//a:latin', $ns)) {
    $typeface = $latin.GetAttribute('typeface')
    if ($typeface) { $fonts[$typeface] = 1 + ($fonts[$typeface] | ForEach-Object { if($_){$_} else {0} }) }
  }
}

$textRows | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $OutDir 'text-before.json') -Encoding UTF8
$shapeRows | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $OutDir 'shape-summary.json') -Encoding UTF8
$colors.GetEnumerator() | Sort-Object Value -Descending | Select-Object -First 80 |
  ForEach-Object { [pscustomobject]@{ color=$_.Key; count=$_.Value } } |
  ConvertTo-Json -Depth 3 | Set-Content -LiteralPath (Join-Path $OutDir 'color-summary.json') -Encoding UTF8
$fonts.GetEnumerator() | Sort-Object Value -Descending |
  ForEach-Object { [pscustomobject]@{ font=$_.Key; count=$_.Value } } |
  ConvertTo-Json -Depth 3 | Set-Content -LiteralPath (Join-Path $OutDir 'font-summary.json') -Encoding UTF8

Write-Output "slides=$($slides.Count); text_nodes=$($textRows.Count)"
