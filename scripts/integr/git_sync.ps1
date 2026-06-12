param (
    [string]$Module,
    [int]$Progress,
    [string]$Message,
    [string]$Scope = "state"
)

Write-Host "--- Git Sync Started ---" -ForegroundColor Cyan

if (!(Test-Path .git)) {
    Write-Error "Git repository not found. Please run 'git init' first."
    exit 1
}

Write-Host "Syncing state for module: $Module ($Progress%)..." -ForegroundColor Gray

# ----------------------------
# SCOPE-BASED STAGING
# ----------------------------

switch ($Scope) {

    "state" {
        git add data/project.json
        git add .ai/context/PROJECT_STATE.md
    }

    "engine" {
        git add scripts/
        git add state_engine/
    }

    "ai" {
        git add .ai/
    }

    "ui" {
        git add dashboard/
        git add templates/
        git add docs/
    }

    default {
        Write-Host "⚠ Unknown scope. Using SAFE MODE (state only)" -ForegroundColor Yellow
        git add data/project.json
    }
}

# ----------------------------
# COMMIT
# ----------------------------

$CommitMsg = "state: [$Module] updated to $Progress% - $Message"
Write-Host "Committing: $CommitMsg" -ForegroundColor Yellow

git commit -m "$CommitMsg"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Successfully committed to Git." -ForegroundColor Green
} else {
    Write-Host "Nothing to commit or error occurred." -ForegroundColor Red
}

Write-Host "--- Git Sync Finished ---" -ForegroundColor Cyan