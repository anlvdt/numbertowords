# DocSoThanhChu AI

A professional Excel Add-in and Web Tool for converting numbers to Vietnamese/English words.
Công cụ đọc số thành chữ tiếng Việt/Anh chuyên nghiệp dành cho Excel và Web.

---

## 1. Introduction / Giới thiệu

**[ENG]** DocSoThanhChu AI is an enterprise-grade utility that converts numerical values into written words based on Vietnamese accounting standards and English grammar. Version 2.0 introduces an AI-powered engine (Llama-3 via Groq) alongside the high-precision rule-based core. It supports cross-platform Microsoft Excel (Windows, macOS, Web).

**[VIE]** DocSoThanhChu AI là một tiện ích cấp doanh nghiệp giúp chuyển đổi số liệu thành chữ theo đúng chuẩn kế toán Việt Nam và ngữ pháp tiếng Anh. Phiên bản 2.0 tích hợp động cơ AI (Llama-3 qua Groq) cùng với lõi xử lý thuật toán tĩnh độ chính xác cực cao. Hỗ trợ đa nền tảng trên Microsoft Excel (Windows, macOS, Web).

## 2. Core Features / Tính năng cốt lõi

**[ENG]**
- Highest Precision: Zero float-point errors natively found in JS/VBA banker's rounding.
- Cross-platform Add-in: Works natively on Excel for Mac, Windows, and Excel Online.
- Bilingual Support: Outputs results in Vietnamese and English.
- Multi-currency: Supports VND (Vietnam Dong), USD (US Dollar), and plain numbers.
- AI Mode: Natural Language Processing fallback using Groq Llama-3.1 API.
- Offline Capability: Falls back automatically to the rule-based local core if AI limits are reached or internet drops.

**[VIE]**
- Độ Chính Xác Tuyệt Đối: Loại bỏ hoàn toàn lỗi làm tròn số thập phân thường gặp trong cấu trúc JS/VBA.
- Add-in Toàn Diện: Hoạt động trơn tru trên Excel for Mac, Windows và Excel Online.
- Hỗ Trợ Song Ngữ: Xuất kết quả bằng Tiếng Việt hoặc Tiếng Anh.
- Đa Ngoại Tệ: Hỗ trợ VND, USD và số đếm thông thường.
- AI Mode: Tích hợp chế độ xử lý bằng ngôn ngữ tự nhiên thông qua API Groq Llama-3.1.
- Tính Năng Ngoại Tuyến: Tự động chuyển về lõi tính toán Local thuần túy nếu mất mạng lưới Internet hoặc hết hạn định mức AI.

## 3. Installation / Hướng dẫn Cài đặt

### Option 1: Modern Web Add-in (Mac / Windows / Web)

The recommended approach for modern Office 365 environments.
Cách cài đặt khuyến nghị cho mọi môi trường Office 365 hiện đại.

**[ENG]** 
1. Open Excel -> Insert Menu -> Get Add-ins -> My Add-ins.
2. If running locally, execute `install-mac.sh` (Mac) or `install-win.bat` (Windows) in the `web-addin` folder to mount the sideload manifest.
3. Access the "DocSo AI" pane via the Home ribbon to use the Conversion tool or set the AI API Key.

**[VIE]**
1. Mở Excel -> Menu Insert -> Get Add-ins -> My Add-ins.
2. Nếu khởi chạy local, bật script `install-mac.sh` (Mac) hoặc `install-win.bat` (Windows) trong thư mục `web-addin` để tải manifest vào hệ thống.
3. Chọn "DocSo AI" trên thanh công cụ Home để mở hộp thoại chuyển đổi hoặc nhập API Key.

### Option 2: Legacy VBA Script (.xlam)

**[ENG]** For older versions of Microsoft Windows Excel. Load `DocSoThanhChu.xlam` from the Developer Add-ins tab.
**[VIE]** Dành cho các phiên bản Microsoft Excel Windows cũ. Cài đặt file `DocSoThanhChu.xlam` thông qua tab Developer Add-ins.

## 4. Excel Functions / Hàm Excel Hỗ Trợ

Once installed, use these functions directly within a spreadsheet cell:
Sau khi cài đặt xong, hãy gọi các hàm này trực tiếp trong một ô tính của Excel:

| Syntax / Cú pháp | Description / Mô tả |
|-------------------|---------------------|
| `=DOCSO.VND_VI(A1)` | VND -> Vietnamese (Tiếng Việt) |
| `=DOCSO.VND_EN(A1)` | VND -> English (Tiếng Anh) |
| `=DOCSO.USD_VI(A1)` | USD -> Vietnamese (Tiếng Việt) |
| `=DOCSO.USD_EN(A1)` | USD -> English (Tiếng Anh) |
| `=DOCSO.SO_VI(A1)`  | Number -> Vietnamese (Số thuần) |
| `=DOCSO.SO_EN(A1)`  | Number -> English (Số thuần) |
| `=DOCSO.AI_SO(A1, "vi", "vnd")` | AI Dynamic conversion / Chuyển đổi AI tùy biến |

## 5. Web Online Tool / Công cụ Trực tuyến

**[ENG]** A standalone web version is available in the `/docs` directory. It uses the exact same computation core without requiring Excel.
**[VIE]** Phiên bản độc lập trên nền tảng trình duyệt web được lưu trữ tại thư mục `/docs`. Dùng chung một lõi tính toán siêu tốc độ mà không yêu cầu cài đặt Excel.

Features: Batch conversion, one-click copy, and zero latency.
Tính năng: Chuyển đổi hàng loạt, copy nhanh, độ trễ tiệm cận 0ms.

## 6. AI Configuration / Cấu hình AI

**[ENG]** To use the `AI_SO` functions, obtain a free Groq API key:
1. Visit console.groq.com.
2. Create an API key (`gsk_...`).
3. Open the Add-in Taskpane in Excel, navigate to settings, and save your Key.
*Rate limits: The free tier allows 14,400 requests per day.*

**[VIE]** Để sử dụng hàm AI nâng cao `AI_SO`, bạn cần yêu cầu cung cấp API key miễn phí tại Groq:
1. Truy cập console.groq.com.
2. Tạo mã API Key nội bộ (Bắt đầu với `gsk_...`).
3. Mở bảng Add-in Taskpane trên Excel, thiết lập tab Cài đặt để lưu Key của bạn.
*Định mức: Gói chuẩn hệ điều hành miễn phí cho phép xử lý vượt nhịp 14,400 tác vụ/ngày.*

## 7. License / Bản quyền

MIT License. See LICENSE file for details.
Giấy phép hoạt động MIT. Tham khảo tệp định dạng LICENSE để nắm bắt chi tiết.
