@echo off
REM ========================================
REM  DocSoThanhChu Add-in Manual Build Guide
REM ========================================
REM
REM If the PowerShell script doesn't work, follow these manual steps:
REM
REM 1. Open Excel
REM 2. Press Alt + F11 to open VBA Editor
REM 3. In VBA Editor: File > Import File...
REM 4. Import: modDocSoThanhChu.bas
REM 5. In VBA Editor: File > Save [workbook name]
REM 6. Close VBA Editor
REM 7. In Excel: File > Save As
REM    - Choose location
REM    - File name: DocSoThanhChu
REM    - Save as type: Excel Add-in (*.xlam)
REM 8. Click Save
REM
REM Your Add-in is now created!
REM
REM To install:
REM 1. File > Options > Add-ins
REM 2. Manage: Excel Add-ins > Go...
REM 3. Browse... > Select your .xlam file
REM 4. Check the checkbox > OK
REM
REM ========================================

echo.
echo ========================================
echo   DocSoThanhChu Add-in Builder v1.1.0
echo ========================================
echo.
echo Running PowerShell build script...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0Build-AddIn.ps1"

pause
