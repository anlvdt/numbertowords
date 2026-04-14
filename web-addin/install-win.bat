@echo off
:: =============================================================
::  DocSoThanhChu AI — Windows Install Script
::  Sideloads manifest.xml into Excel for Windows (shared folder)
:: =============================================================

echo.
echo ╔══════════════════════════════════════════╗
echo ║  DocSoThanhChu AI — Windows Installer    ║
echo ╚══════════════════════════════════════════╝
echo.

set SCRIPT_DIR=%~dp0
set MANIFEST=%SCRIPT_DIR%manifest.xml
set CATALOG_DIR=%APPDATA%\Microsoft\Excel\AddIns\DocSoThanhChu

:: Check manifest
if not exist "%MANIFEST%" (
  echo [ERROR] manifest.xml not found: %MANIFEST%
  pause
  exit /b 1
)

:: Create catalog folder and copy manifest
if not exist "%CATALOG_DIR%" mkdir "%CATALOG_DIR%"
copy /Y "%MANIFEST%" "%CATALOG_DIR%\manifest.xml" >nul

echo [OK] Manifest copied to: %CATALOG_DIR%
echo.

:: Add trusted catalog to Excel registry
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\WEF\TrustedCatalogs\{DocSoThanhChu}" /v "Id" /t REG_SZ /d "{a8f3c2d7-5e91-4b63-8f2a-1d0e9c7b4f56}" /f >nul 2>&1
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\WEF\TrustedCatalogs\{DocSoThanhChu}" /v "Url" /t REG_SZ /d "https://localhost:3000" /f >nul 2>&1
reg add "HKCU\SOFTWARE\Microsoft\Office\16.0\WEF\TrustedCatalogs\{DocSoThanhChu}" /v "Flags" /t REG_DWORD /d 1 /f >nul 2>&1

echo [OK] Trusted catalog registered.
echo.
echo ══════════════════════════════════════════
echo   NEXT STEPS:
echo   1. Chay trong web-addin/: npm install ^&^& npm run dev
echo      (server phai chay truoc khi dung add-in)
echo.
echo   2. Mo Excel
echo   3. File ^> Options ^> Trust Center ^> Trust Center Settings
echo      ^> Trusted Add-in Catalogs
echo      ^> Catalog Url: https://localhost:3000 ^> Add to list
echo      ^> Check "Show in Menu" ^> OK
echo.
echo   4. Restart Excel
echo      Insert ^> My Add-ins ^> Shared Folder
echo      ^> DocSoThanhChu AI ^> Add
echo ══════════════════════════════════════════
echo.
pause
