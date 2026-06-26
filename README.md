# DocSoThanhChu AI

[![Excel](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/excel)
[![Office.js](https://img.shields.io/badge/Office.js-0078D4?style=for-the-badge&logo=microsoft&logoColor=white)](https://learn.microsoft.com/office/dev/add-ins/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/anlvdt/numbertowords?style=for-the-badge)](https://github.com/anlvdt/numbertowords/releases)

Công cụ đọc số thành chữ tiếng Việt/Anh chuyên nghiệp — Excel Add-in, Web Tool, và AI Mode.

**Live demo:** [anlvdt.github.io/numbertowords](https://anlvdt.github.io/numbertowords/)

---

## Giới thiệu / Introduction

**[VIE]** DocSoThanhChu AI chuyển đổi số liệu thành chữ theo chuẩn kế toán Việt Nam và ngữ pháp tiếng Anh. Phiên bản 2.x tích hợp động cơ AI (Llama-3 qua Groq) cùng lõi rule-based độ chính xác cao. Hỗ trợ Excel (Windows, macOS, Web) và công cụ web độc lập.

**[ENG]** Enterprise-grade number-to-words utility with Vietnamese accounting standards compliance. Version 2.x adds Groq Llama-3 AI alongside a high-precision rule-based core. Cross-platform Excel (Windows, macOS, Web) and standalone web tool.

> **Lưu ý:** Repo `docsothanhchu` đã gộp vào đây (2026-06). Mã VBA nằm tại `legacy-vba/`.

---

## Tính năng / Features

| Tính năng | Mô tả |
|-----------|-------|
| **Rule-based engine** | Không lỗi làm tròn float, chạy offline 100% |
| **Web Add-in (Office.js)** | Mac, Windows, Excel Online — Task Pane + Custom Functions |
| **Legacy VBA (.xlam)** | Windows/Mac classic — hàm `=VND_Vi(A1)` |
| **Web Tool** | Dashboard đa công cụ kế toán tại `/docs` |
| **AI Mode** | Groq Llama-3.1 — fallback tự động về rule-based |
| **Song ngữ** | Tiếng Việt + English, VND + USD |

---

## Cấu trúc dự án

```
numbertowords/
├── legacy-vba/       ← VBA Add-in (.xlam, build, Install.vbs)
├── web-addin/        ← Office.js Add-in (dev server + manifest)
├── docs/             ← Web tool + GitHub Pages (production)
├── manifest-prod.xml ← Manifest production (GitHub Pages hosted)
├── sync-docs.sh      ← Đồng bộ web-addin/src → docs/src
└── CAI_DAT_WINDOWS.cmd
```

---

## Cài đặt / Installation

### Option 1: Web Add-in (Mac / Windows / Excel Online) — Khuyên dùng

Cần thiết cho Mac nếu muốn Task Pane AI trên Ribbon.

```bash
cd web-addin
npm install
npm run start
```

1. Mở Excel → **Insert** → **Get Add-ins** → **Upload My Add-in**
2. Chọn `web-addin/manifest.xml` (dev) hoặc `manifest-prod.xml` (production)
3. Tab **DocSo AI** xuất hiện trên Home

Chi tiết: [HUONG_DAN_CAI_DAT.md](HUONG_DAN_CAI_DAT.md)

### Option 2: Legacy VBA (.xlam)

**Windows — One-click:**
1. Tải `legacy-vba/DocSoThanhChu.xlam` + `legacy-vba/Install.vbs`
2. Double-click `Install.vbs`
3. Excel → File → Options → Add-ins → Go... → Tick **DocSoThanhChu**

**Windows — Batch:** Chạy `CAI_DAT_WINDOWS.cmd` (copy tự động vào `%APPDATA%\Microsoft\AddIns\`)

**Thủ công:** Copy `legacy-vba/DocSoThanhChu.xlam` → `%APPDATA%\Microsoft\AddIns\` → bật trong Excel Add-ins.

> **Mac + .xlam:** Chỉ dùng được hàm tĩnh, không có Task Pane AI. Dùng Option 1 trên Mac.

### Option 3: Web Tool (không cần Excel)

Truy cập [anlvdt.github.io/numbertowords](https://anlvdt.github.io/numbertowords/) hoặc mở `docs/index.html` locally.

---

## Hàm Excel / Excel Functions

### Office.js (namespace `DOCSO`)

| Cú pháp | Mô tả |
|---------|-------|
| `=DOCSO.VND_VI(A1)` | VND → Tiếng Việt |
| `=DOCSO.VND_EN(A1)` | VND → English |
| `=DOCSO.USD_VI(A1)` | USD → Tiếng Việt |
| `=DOCSO.USD_EN(A1)` | USD → English |
| `=DOCSO.SO_VI(A1)` | Số thuần → Tiếng Việt |
| `=DOCSO.SO_EN(A1)` | Số thuần → English |
| `=DOCSO.AI_SO(A1,"vi","vnd")` | AI (Groq) — fallback rule-based |

### Legacy VBA

| Cú pháp | Mô tả |
|---------|-------|
| `=VND_Vi(A1)` | VND → Tiếng Việt |
| `=VND_En(A1)` | VND → English |
| `=USD_Vi(A1)` | USD → Tiếng Việt |
| `=USD_En(A1)` | USD → English |
| `=So_Vi(A1)` | Số thuần → Tiếng Việt |
| `=So_En(A1)` | Số thuần → English |

---

## Quy tắc đọc số VN (Chuẩn kế toán)

Tuân thủ Luật Kế toán 88/2015/QH13, Thông tư 39/2014/TT-BTC:

| Quy tắc | Điều kiện | Ví dụ |
|---------|-----------|-------|
| **mười** | Số 10–19 | 15 → mười lăm |
| **mươi** | Hàng chục ≥ 2 | 25 → hai mươi lăm |
| **mốt** | Đơn vị = 1, chục ≥ 2 | 21 → hai mươi mốt |
| **lăm** | Đơn vị = 5, chục ≥ 1 | 15 → mười lăm |
| **tư** | Đơn vị = 4, chục ≥ 2 | 24 → hai mươi tư |
| **lẻ** | Chục = 0, đơn vị > 0 | 101 → một trăm lẻ một |
| **nghìn** | Chuẩn trên tiền tệ | 1000 → một nghìn |

---

## Cấu hình AI / AI Configuration

1. Truy cập [console.groq.com](https://console.groq.com) → tạo API key (`gsk_...`)
2. Mở Task Pane trong Excel → tab Cài đặt → lưu key
3. Dùng `=DOCSO.AI_SO(A1,"vi","vnd")`

Gói miễn phí: ~14,400 requests/ngày. Không có key → tự động fallback rule-based offline.

---

## Build từ mã nguồn / Build from Source

### VBA Add-in (Windows)

```powershell
cd legacy-vba
.\Build-AddIn.ps1
.\Test-AddIn.ps1
```

### Deploy Web (GitHub Pages)

```bash
npm run sync-docs   # đồng bộ web-addin/src → docs/src
npm test            # kiểm tra converter engine
git push            # GitHub Pages serve từ /docs
```

Chi tiết: [docs/DEPLOY.md](docs/DEPLOY.md)

---

## Tương thích / Compatibility

- Microsoft 365 (32-bit & 64-bit), Excel 2021–2010
- Pure VBA — không gọi Windows API, không DLL ngoài
- Antivirus safe: Windows Defender, CrowdStrike, Trend Micro

---

## Tham khảo / Reference

Dựa trên thuật toán VBA gốc của [Nguyễn Đức Thanh — Học Excel Online](https://blog.hocexcel.online/doc-so-thanh-chu-bang-add-in-tu-hoc-excel-online.html).

Cải tiến: VND/USD, song ngữ, Office.js cross-platform, AI Groq, web dashboard.

---

## Tác giả / Author

**Le Van An** (Vietnam IT)

[![GitHub](https://img.shields.io/badge/GitHub-@anlvdt-181717?style=for-the-badge&logo=github)](https://github.com/anlvdt)

---

## Ủng hộ / Support

| Phương thức | Tài khoản | Tên |
|-------------|-----------|-----|
| **MB Bank** | `0360126996868` | LE VAN AN |
| **Momo** | `0976896621` | LE VAN AN |

---

## License

MIT License — Free for personal and commercial use.
