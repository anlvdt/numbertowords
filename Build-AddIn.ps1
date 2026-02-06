# Build Script for DocSoThanhChu Excel Add-in
# This script creates the .xlam file from VBA modules using Excel COM automation

param(
    [string]$OutputPath = ".\DocSoThanhChu.xlam"
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " DocSoThanhChu Add-in Builder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the current directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $ScriptDir) { $ScriptDir = Get-Location }

# Check for combined module first, then fallback to separate modules
$combinedModule = Join-Path $PSScriptRoot "modDocSoThanhChu.bas"
$separateModules = @(
    (Join-Path $PSScriptRoot "modVietnameseConverter.bas"),
    (Join-Path $PSScriptRoot "modEnglishConverter.bas"),
    (Join-Path $PSScriptRoot "modMainFunctions.bas")
)

$modulesToImport = @()

if (Test-Path $combinedModule) {
    Write-Host "Using combined module..." -ForegroundColor Yellow
    Write-Host "  [OK] modDocSoThanhChu.bas" -ForegroundColor Green
    $modulesToImport = @($combinedModule)
}
else {
    Write-Host "Using separate modules..." -ForegroundColor Yellow
    foreach ($file in $separateModules) {
        if (Test-Path $file) {
            Write-Host "  [OK] $(Split-Path $file -Leaf)" -ForegroundColor Green
            $modulesToImport += $file
        }
        else {
            Write-Host "  [ERROR] $(Split-Path $file -Leaf) not found!" -ForegroundColor Red
            exit 1
        }
    }
}
Write-Host ""
Write-Host "Creating Excel Add-in..." -ForegroundColor Yellow

try {
    # Create Excel COM object
    $Excel = New-Object -ComObject Excel.Application
    $Excel.Visible = $false
    $Excel.DisplayAlerts = $false
    
    # Create a new workbook
    $Workbook = $Excel.Workbooks.Add()
    
    # Get VBA project
    $VBProject = $Workbook.VBProject
    
    # Import modules
    foreach ($file in $modulesToImport) {
        Write-Host "  Importing $(Split-Path -Leaf $file)..." -ForegroundColor Gray
        $VBProject.VBComponents.Import($file) | Out-Null
    }
    
    # Set Add-in properties
    $Workbook.IsAddin = $false  # Leave as false during save, will become true when opened as .xlam
    
    # Save as Excel Add-in (.xlam)
    $OutputFullPath = Join-Path $ScriptDir (Split-Path -Leaf $OutputPath)
    
    # Remove existing file if exists
    if (Test-Path $OutputFullPath) {
        Remove-Item $OutputFullPath -Force
    }
    
    # 55 = xlAddIn8 (xlam format)
    $Workbook.SaveAs($OutputFullPath, 55)
    
    Write-Host ""
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "Add-in created: $OutputFullPath" -ForegroundColor Green
    
}
catch {
    Write-Host ""
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "1. Make sure Excel is installed" -ForegroundColor Gray
    Write-Host "2. Enable 'Trust access to VBA project object model' in Excel:" -ForegroundColor Gray
    Write-Host "   File > Options > Trust Center > Trust Center Settings > Macro Settings" -ForegroundColor Gray
    Write-Host "   Check 'Trust access to the VBA project object model'" -ForegroundColor Gray
    Write-Host ""
    exit 1
    
}
finally {
    # Clean up
    if ($Workbook) {
        $Workbook.Close($false)
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($Workbook) | Out-Null
    }
    if ($Excel) {
        $Excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($Excel) | Out-Null
    }
    [GC]::Collect()
    [GC]::WaitForPendingFinalizers()
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Installation Instructions" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Excel" -ForegroundColor White
Write-Host "2. File > Options > Add-ins" -ForegroundColor White
Write-Host "3. Manage: Excel Add-ins > Go..." -ForegroundColor White
Write-Host "4. Browse... > Select DocSoThanhChu.xlam" -ForegroundColor White
Write-Host "5. Check the checkbox and click OK" -ForegroundColor White
Write-Host ""
Write-Host "Available functions:" -ForegroundColor Yellow
Write-Host "  =VND_Vi(A1)  - VND in Vietnamese" -ForegroundColor Gray
Write-Host "  =VND_En(A1)  - VND in English" -ForegroundColor Gray
Write-Host "  =USD_Vi(A1)  - USD in Vietnamese" -ForegroundColor Gray
Write-Host "  =USD_En(A1)  - USD in English" -ForegroundColor Gray
Write-Host "  =So_Vi(A1)   - Number in Vietnamese" -ForegroundColor Gray
Write-Host "  =So_En(A1)   - Number in English" -ForegroundColor Gray
Write-Host ""
