# Test DocSoThanhChu Add-in v1.1.0
# Comprehensive test suite with edge case coverage
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " DocSoThanhChu Add-in Test Suite v1.1.0" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$excel = $null
$workbook = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Open the Add-in
    $addInPath = Join-Path $PSScriptRoot "DocSoThanhChu.xlam"
    if (-not (Test-Path $addInPath)) {
        $addInPath = Join-Path $PSScriptRoot "DocSoThanhChu_v1.1.0.xlam"
    }
    if (-not (Test-Path $addInPath)) {
        Write-Host "[ERROR] No .xlam file found! Run Build-AddIn.ps1 first." -ForegroundColor Red
        exit 1
    }
    $excel.Workbooks.Open($addInPath) | Out-Null
    
    # Create a test workbook
    $workbook = $excel.Workbooks.Add()
    $sheet = $workbook.Sheets.Item(1)
    
    # ==============================
    # Test Cases
    # ==============================
    $tests = @(
        # --- VND Vietnamese ---
        @{Group = "VND_Vi"; Formula = '=VND_Vi(0)'; Expected = $null; MustNotContain = "#" },
        @{Group = "VND_Vi"; Formula = '=VND_Vi(1000000)'; Expected = $null; MustNotContain = "#" },
        @{Group = "VND_Vi"; Formula = '=VND_Vi(123456)'; Expected = $null; MustNotContain = "#" },
        @{Group = "VND_Vi"; Formula = '=VND_Vi(-500000)'; Expected = $null; MustNotContain = "#" },
        @{Group = "VND_Vi"; Formula = '=VND_Vi(1000000000)'; Expected = $null; MustNotContain = "#" },
        
        # --- VND English ---
        @{Group = "VND_En"; Formula = '=VND_En(0)'; Expected = "Zero Vietnamese dong." },
        @{Group = "VND_En"; Formula = '=VND_En(1000000)'; Expected = "One million Vietnamese dong." },
        @{Group = "VND_En"; Formula = '=VND_En(100)'; Expected = "One hundred Vietnamese dong." },
        
        # --- USD English ---
        @{Group = "USD_En"; Formula = '=USD_En(1)'; Expected = "One dollar." },
        @{Group = "USD_En"; Formula = '=USD_En(1234.56)'; Expected = "One thousand two hundred and thirty-four dollars and fifty-six cents." },
        @{Group = "USD_En"; Formula = '=USD_En(1.01)'; Expected = "One dollar and one cent." },
        @{Group = "USD_En"; Formula = '=USD_En(0)'; Expected = "Zero dollars." },
        
        # --- USD Vietnamese ---
        @{Group = "USD_Vi"; Formula = '=USD_Vi(100.50)'; Expected = $null; MustNotContain = "#" },
        
        # --- Number Vietnamese ---
        @{Group = "So_Vi"; Formula = '=So_Vi(0)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(10)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(14)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(15)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(21)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(24)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(101)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(1001)'; Expected = $null; MustNotContain = "#" },
        @{Group = "So_Vi"; Formula = '=So_Vi(-999)'; Expected = $null; MustNotContain = "#" },
        
        # --- Number English ---
        @{Group = "So_En"; Formula = '=So_En(0)'; Expected = "Zero" },
        @{Group = "So_En"; Formula = '=So_En(100)'; Expected = "One hundred" },
        @{Group = "So_En"; Formula = '=So_En(1000)'; Expected = "One thousand" },
        @{Group = "So_En"; Formula = '=So_En(1000000)'; Expected = "One million" },
        @{Group = "So_En"; Formula = '=So_En(-42)'; Expected = "Negative forty-two" },
        
        # --- Trailing Period Check ---
        @{Group = "Period"; Formula = '=VND_Vi(100)'; Expected = $null; MustContain = "." },
        @{Group = "Period"; Formula = '=VND_En(100)'; Expected = $null; MustContain = "." },
        @{Group = "Period"; Formula = '=USD_Vi(100)'; Expected = $null; MustContain = "." },
        @{Group = "Period"; Formula = '=USD_En(100)'; Expected = $null; MustContain = "." },
        
        # --- Input Validation ---
        @{Group = "Validation"; Formula = '=VND_Vi("")'; Expected = "" },
        @{Group = "Validation"; Formula = '=So_En("")'; Expected = "" }
    )
    
    $passed = 0
    $failed = 0
    $currentGroup = ""
    
    foreach ($test in $tests) {
        if ($test.Group -ne $currentGroup) {
            $currentGroup = $test.Group
            Write-Host ""
            Write-Host "--- $currentGroup ---" -ForegroundColor Yellow
        }
        
        $sheet.Cells.Item(1, 1).Formula = $test.Formula
        $result = $sheet.Cells.Item(1, 1).Value
        if ($null -eq $result) { $result = "" }
        $resultStr = $result.ToString()
        
        $testPassed = $true
        $reason = ""
        
        # Check for error
        if ($null -ne $test.MustNotContain -and $resultStr -like "*#*") {
            $testPassed = $false
            $reason = "Got error: $resultStr"
        }
        
        # Check exact match
        if ($null -ne $test.Expected -and $resultStr -ne $test.Expected) {
            $testPassed = $false
            $reason = "Expected: '$($test.Expected)' Got: '$resultStr'"
        }
        
        # Check MustContain
        if ($null -ne $test.MustContain -and -not $resultStr.Contains($test.MustContain)) {
            $testPassed = $false
            $reason = "Must contain '$($test.MustContain)' but got: '$resultStr'"
        }
        
        # Check MustNotContain
        if ($null -ne $test.MustNotContain -and $resultStr.Contains($test.MustNotContain)) {
            $testPassed = $false
            $reason = "Must NOT contain '$($test.MustNotContain)' but got: '$resultStr'"
        }
        
        if ($testPassed) {
            Write-Host "  [PASS] $($test.Formula)" -ForegroundColor Green
            Write-Host "         $resultStr" -ForegroundColor Gray
            $passed++
        }
        else {
            Write-Host "  [FAIL] $($test.Formula)" -ForegroundColor Red
            Write-Host "         $reason" -ForegroundColor Red
            $failed++
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Results: $passed passed, $failed failed (total: $($passed + $failed))" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
    Write-Host "========================================" -ForegroundColor Cyan
    
}
catch {
    Write-Host "[ERROR] $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    if ($workbook) {
        $workbook.Close($false)
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($workbook) | Out-Null
    }
    if ($excel) {
        $excel.Quit()
        [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}
