[CmdletBinding()]
param(
  [string]$CommitMessage = "upgrade website content"
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location -LiteralPath $repoRoot

try {
  $branch = (& git branch --show-current).Trim()
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to read the current Git branch."
  }
  if ($branch -ne "main") {
    throw "Current branch is '$branch'. This script only pushes main."
  }

  Write-Host "=== git status ===" -ForegroundColor Cyan
  & git status
  if ($LASTEXITCODE -ne 0) {
    throw "git status failed."
  }

  Write-Host "=== git add . ===" -ForegroundColor Cyan
  & git add .
  if ($LASTEXITCODE -ne 0) {
    throw "git add failed."
  }

  # Exit code 0 means no staged changes; 1 means staged changes exist.
  & git diff --cached --quiet
  $diffExitCode = $LASTEXITCODE
  if ($diffExitCode -eq 0) {
    Write-Host "No changes found. Skipping commit and push." -ForegroundColor Yellow
    return
  }
  if ($diffExitCode -ne 1) {
    throw "Unable to inspect the staging area."
  }

  Write-Host "=== staged changes ===" -ForegroundColor Cyan
  & git status --short
  if ($LASTEXITCODE -ne 0) {
    throw "Unable to read the staged status."
  }

  Write-Host "=== git commit ===" -ForegroundColor Cyan
  & git commit -m $CommitMessage
  if ($LASTEXITCODE -ne 0) {
    throw "git commit failed."
  }

  Write-Host "=== git push origin main ===" -ForegroundColor Cyan
  & git push origin main
  if ($LASTEXITCODE -ne 0) {
    throw "git push failed."
  }

  Write-Host "Publish complete." -ForegroundColor Green
}
finally {
  Pop-Location
}
