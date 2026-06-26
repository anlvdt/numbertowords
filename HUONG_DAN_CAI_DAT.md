# Hướng Dẫn Cài Đặt

Chọn một trong ba kênh tùy nhu cầu:

| Kênh | Phù hợp khi | AI |
|------|-------------|-----|
| **Web** (`docs/`) | Dùng nhanh trên trình duyệt, nhiều công cụ (VAT, VietQR…) | Không |
| **VBA (.xlam)** | Excel cổ điển, offline, chỉ cần hàm trong ô | Không |
| **Office.js** | Excel 365 / Mac / Online, Task Pane + hàm `DOCSO.*` | Có (Groq, tùy chọn) |

---

## 1. Web (không cài đặt)

Mở [anlvdt.github.io/numbertowords](https://anlvdt.github.io/numbertowords/) hoặc chạy local:

```bash
cd docs && python3 -m http.server 8765
```

- Đọc số, VAT, lương, font, XML: xử lý trên trình duyệt.
- VietQR: cần internet (img.vietqr.io).

---

## 2. VBA (.xlam) — Windows / Mac (hàm trong ô)

**Hàm:** `=VND_Vi(A1)`, `=USD_Vi(A1)`, `=So_Vi(A1)`… (không phải `DOCSO.*`)

**Cài đặt Windows — one-click:**
1. Tải `legacy-vba/DocSoThanhChu.xlam` và `legacy-vba/Install.vbs`
2. Double-click `Install.vbs`
3. Excel → File → Options → Add-ins → Go... → tick **DocSoThanhChu**

**Hoặc:** chạy `CAI_DAT_WINDOWS.cmd` (copy vào `%APPDATA%\Microsoft\AddIns\`).

**Mac:** cài `.xlam` tương tự nhưng **không có Task Pane AI** — chỉ dùng hàm trong ô.

---

## 3. Office.js — Excel 365 (Task Pane + AI tùy chọn)

**Hàm:** `=DOCSO.VND_VI(A1)`, `=DOCSO.AI_SO(A1,"vi","vnd")`…

**Dev (localhost):**
```bash
cd web-addin && npm install && npm run start
```
Sideload `web-addin/manifest.xml`.

**Production:** sideload `manifest-prod.xml` (host GitHub Pages).

**AI:** cần API key Groq miễn phí tại [console.groq.com](https://console.groq.com) — nhập trong Task Pane. Không có key → tự fallback rule-based.

**Lưu ý:** Task Pane **không** gồm toàn bộ dashboard web (VAT, VietQR, XML…).

---

## Tài liệu thêm

- [README.md](README.md) — tổng quan dự án
- [docs/DEPLOY.md](docs/DEPLOY.md) — GitHub Pages
