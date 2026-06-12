param (
    [Parameter(Mandatory=$true)]
    [ValidateSet("client", "developer")]
    [string]$Type
)

$dataPath = "data/project.json"
$templatePath = "templates/report_$Type.template.md"
$outputPath = "docs/REPORT_$($Type.ToUpper())_$((Get-Date).ToString('yyyy-MM-dd')).md"

if (-not (Test-Path $dataPath)) {
    Write-Error "Data file not found at $dataPath"
    return
}

if (-not (Test-Path $templatePath)) {
    Write-Error "Template file not found at $templatePath"
    return
}

$data = Get-Content $dataPath | ConvertFrom-Json
$template = Get-Content $templatePath -Raw

# Simple Template Engine (Replace placeholders)
$report = $template
$report = $report -replace "{{date}}", (Get-Date).ToString("yyyy-MM-dd")
$report = $report -replace "{{version}}", $data.project.version
$report = $report -replace "{{progress}}", $data.summary.progress_total
$report = $report -replace "{{status}}", $data.project.status

# Replace Lists (Simple logic for prototype)
if ($Type -eq "client") {
    $completed = ($data.modules | Where-Object { $_.status -eq "done" } | Select-Object -ExpandProperty name) -join "`n- "
    $active = ($data.modules | Where-Object { $_.status -eq "in_progress" } | ForEach-Object { "$($_.name) ($($_.progress)%)" }) -join "`n- "
    
    $report = $report -replace "{{#completed_work}}[\s\S]*?{{/completed_work}}", "- $completed"
    $report = $report -replace "{{#active_work}}[\s\S]*?{{/active_work}}", "- $active"
    $report = $report -replace "{{next_milestone}}", ($data.milestones | Where-Object { $_.status -eq "todo" } | Select-Object -First 1 -ExpandProperty name)
}

if ($Type -eq "developer") {
    $modulesStr = ""
    foreach ($m in $data.modules) {
        $modulesStr += "### $($m.name) ($($m.progress)%)\n- Status: $($m.status)\n- Complexity: $($m.complexity)/10\n\n"
    }
    $report = $report -replace "{{#modules}}[\s\S]*?{{/modules}}", $modulesStr
    
    $logs = ($data.logbook | Select-Object -Last 5 | ForEach-Object { "$($_.date): $($_.event)" }) -join "`n- "
    $report = $report -replace "{{#recent_logs}}[\s\S]*?{{/recent_logs}}", "- $logs"
}

$report | Out-File -FilePath $outputPath -Encoding utf8
Write-Host "Report generated: $outputPath" -ForegroundColor Green
