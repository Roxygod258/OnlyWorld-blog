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
    Write-Host "No new changes to commit. Checking for commits that still need to be pushed." -ForegroundColor Yellow
  }
  elseif ($diffExitCode -eq 1) {
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
  }
  else {
    throw "Unable to inspect the staging area."
  }

  Write-Host "=== git push origin main ===" -ForegroundColor Cyan
  $pushSucceeded = $false
  for ($attempt = 1; $attempt -le 3; $attempt++) {
    & git push origin main
    if ($LASTEXITCODE -eq 0) {
      $pushSucceeded = $true
      break
    }

    if ($attempt -lt 3) {
      Write-Host "Push attempt $attempt failed. Retrying in 3 seconds..." -ForegroundColor Yellow
      Start-Sleep -Seconds 3
    }
  }
  if (-not $pushSucceeded) {
    throw "git push failed after 3 attempts. Check the network connection and run the script again."
  }

  Write-Host "Publish complete." -ForegroundColor Green
}
finally {
  Pop-Location
}
