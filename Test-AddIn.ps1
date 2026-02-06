# Test DocSoThanhChu Add-in
$ErrorActionPreference = "Stop"

Write-Host "Testing DocSoThanhChu Add-in..." -ForegroundColor Cyan
Write-Host ""

$excel = $null
$workbook = $null

try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    
    # Open the Add-in
    $addInPath = Join-Path $PSScriptRoot "DocSoThanhChu.xlam"
    $excel.Workbooks.Open($addInPath) | Out-Null
    
    # Create a test workbook
    $workbook = $excel.Workbooks.Add()
    $sheet = $workbook.Sheets.Item(1)
    
    # Test cases
    $tests = @(
        @{Formula = "=VND_Vi(123456)"; Expected = "Mot tram hai muoi ba nghin bon tram nam muoi sau dong" },
        @{Formula = "=VND_Vi(1000000)"; Expected = "Mot trieu dong" },
        @{Formula = "=USD_En(1234.56)"; Expected = "One thousand two hundred and thirty-four dollars and fifty-six cents" },
        @{Formula = "=So_Vi(21)"; Expected = "Hai muoi mot" },
        @{Formula = "=So_En(100)"; Expected = "One hundred" }
    )
    
    $passed = 0
    $failed = 0
    
    foreach ($test in $tests) {
        $sheet.Cells.Item(1, 1).Formula = $test.Formula
        $result = $sheet.Cells.Item(1, 1).Value
        
        if ($result -like "*#*") {
            Write-Host "[FAIL] $($test.Formula)" -ForegroundColor Red
            Write-Host "       Got: $result" -ForegroundColor Red
            $failed++
        }
        else {
            Write-Host "[PASS] $($test.Formula)" -ForegroundColor Green
            Write-Host "       Result: $result" -ForegroundColor Gray
            $passed++
        }
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Results: $passed passed, $failed failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Yellow" })
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
