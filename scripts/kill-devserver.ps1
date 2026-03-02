# GreenLink dev server cleanup script
# Usage  : pwsh -File scripts/kill-devserver.ps1
# Options: -Ports 3000,3001  (target specific ports only)
#          -DryRun           (list targets without killing)

param(
    [int[]]$Ports = @(3000, 3001, 3002, 3003, 3004),
    [switch]$DryRun
)

# --- Step 1: Collect port-occupying PIDs ---
$portPattern = ($Ports | ForEach-Object { ":$_ " }) -join '|'
$rawNetstat  = & cmd.exe /c "netstat -ano" 2>$null
$portPids    = @{}

foreach ($line in $rawNetstat) {
    if ($line -match 'LISTENING' -and ($line | Select-String -Pattern $portPattern -Quiet)) {
        $parts = ($line.ToString().Trim() -split '\s+')
        $procId = $parts[-1]
        $port   = ($parts[1] -split ':')[-1]
        if ($procId -match '^\d+$') {
            $portPids[$procId] = $port
        }
    }
}

# --- Step 2: Collect dev-related processes (exclude VSCode internal nodes) ---
$devProcs = Get-Process | Where-Object {
    $_.Name -match '^(node|turbo|bun|esbuild)$'
} | ForEach-Object {
    $wmi = Get-WmiObject Win32_Process -Filter "ProcessId=$($_.Id)" -ErrorAction SilentlyContinue
    $cmd = if ($wmi) { $wmi.CommandLine } else { '' }
    [PSCustomObject]@{
        PID       = $_.Id
        Name      = $_.Name
        MemMB     = [math]::Round($_.WorkingSet / 1MB, 1)
        StartTime = if ($_.StartTime) { $_.StartTime.ToString('HH:mm:ss') } else { 'N/A' }
        Port      = if ($portPids.ContainsKey("$($_.Id)")) { $portPids["$($_.Id)"] } else { '-' }
        CmdLine   = $cmd
    }
}

$toKill = $devProcs | Where-Object {
    $_.CmdLine -notmatch 'Code\.exe|vscode|AppData\\Local\\Programs\\Microsoft VS Code'
}

Write-Host ""
Write-Host "--- GreenLink Dev Process Cleanup ---"

if (-not $toKill) {
    Write-Host "No dev server processes found. Already clean."
    exit 0
}

# --- Step 3: Print target list ---
Write-Host ""
Write-Host "Targets:"
$toKill | Format-Table -AutoSize -Property PID, Name, MemMB, StartTime, Port

if ($DryRun) {
    Write-Host "[DryRun] No processes killed."
    exit 0
}

# --- Step 4: Kill ---
Write-Host ""
Write-Host "Killing..."
$killed = 0
$failed = 0

foreach ($proc in $toKill) {
    & cmd.exe /c "taskkill /PID $($proc.PID) /F" 2>$null | Out-Null
    Start-Sleep -Milliseconds 150
    $still = Get-Process -Id $proc.PID -ErrorAction SilentlyContinue
    if ($still) {
        Write-Host "FAIL  PID=$($proc.PID)  $($proc.Name)"
        $failed++
    } else {
        Write-Host "OK    PID=$($proc.PID)  $($proc.Name)  port=$($proc.Port)"
        $killed++
    }
}

# --- Step 5: Summary ---
Write-Host ""
Write-Host "Result: $killed/$($killed + $failed) killed"

$remaining = $rawNetstat | Where-Object {
    $_ -match 'LISTENING' -and ($_ | Select-String -Pattern $portPattern -Quiet)
}

if ($remaining) {
    Write-Host "Ports still occupied:"
    $remaining | ForEach-Object { Write-Host "  $_" }
} else {
    Write-Host "All target ports released. Clean."
}
