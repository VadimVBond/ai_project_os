# Git Sync Script for AI Project OS
# Usage: ./scripts/git_sync.ps1 -Module "git_integration" -Progress 50 -Message "Implemented basic git sync script"

param (
    [string]$Module,
    [int]$Progress,
    [string]$Message
)

Write-Host "--- Git Sync Started ---" -ForegroundColor Cyan

# 1. Check if git is initialized
if (!(Test-Path .git)) {
    Write-Error "Git repository not found. Please run 'git init' first."
    exit 1
}

# 2. Sync state (This would normally call the state engine, but here we simulate or assume it's done)
Write-Host "Syncing state for module: $Module ($Progress%)..." -ForegroundColor Gray

# 3. Git Add
Write-Host "Staging changes..." -ForegroundColor Gray
git add <explicit paths>

# 4. Standardized Commit Message
$CommitMsg = "state: [$Module] updated to $Progress% - $Message"
Write-Host "Committing: $CommitMsg" -ForegroundColor Yellow

git commit -m "$CommitMsg"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully committed to Git." -ForegroundColor Green
} else {
    Write-Host "Git commit failed or nothing to commit." -ForegroundColor Red
}

Write-Host "--- Git Sync Finished ---" -ForegroundColor Cyan
