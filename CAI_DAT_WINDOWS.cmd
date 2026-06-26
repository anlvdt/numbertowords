@echo off
chcp 65001 >nul
:: Script Cài Đặt One-Click cho Kế Toán Windows
:: Phép màu 1-chạm: Đưa con cưng của lập trình viên vào đúng buồng trứng của Microsoft AddIns

set "addins_path=%APPDATA%\Microsoft\AddIns"
if not exist "%addins_path%" mkdir "%addins_path%"

copy /Y "%~dp0legacy-vba\DocSoThanhChu.xlam" "%addins_path%\DocSoThanhChu.xlam" >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo MsgBox "Đã sao chép thành công phần mềm Đọc Số Thành Chữ vào hệ thống cốt lõi của máy tính!" ^& vbCrLf ^& vbCrLf ^& "Bước Kích Hoạt Cuối Cùng:" ^& vbCrLf ^& "1. Mở phần mềm Excel" ^& vbCrLf ^& "2. Bấm vào File -> Options -> Add-ins" ^& vbCrLf ^& "3. Nhìn xuống dưới đáy có chữ Manage: Excel Add-ins, bấm nút [Go...]" ^& vbCrLf ^& "4. Đánh dấu thủ công vào ô [Docsothanhchu] và bấm OK là xong trọn đời.", vbInformation, "Cài đặt DocSoThanhChu AI Thành Công" > "%TEMP%\success_msg.vbs"
    cscript //nologo "%TEMP%\success_msg.vbs"
    del "%TEMP%\success_msg.vbs"
) else (
    echo LỖI BẤT NGỜ! 
    echo Bạn không thể chạy file này ngay trong WinRAR.
    echo Vui lòng bấm Giải nén (Extract) toàn bộ thư mục này ra màn hình Desktop trước, sau đó mới bấm file Cài Đặt.
    echo.
    pause
)
