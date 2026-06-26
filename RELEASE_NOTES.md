# Release Notes

## v2.2.1 (2026-06-26)

### Content audit — accurate, truthful copy
- Phân tách rõ **Web (không AI)** vs **Excel Office.js (AI tùy chọn)** vs **VBA**
- Bỏ claim "100% offline", "tuyệt đối", "tuân thủ" → "tham khảo TT39", "xử lý local"
- Sửa hàm VBA `VND_Vi` (không phải `DOCSO.*` hay `VND(A1)`)
- VietQR: ghi rõ cần img.vietqr.io và đối chiếu trước chuyển khoản
- Lương: disclaimer tham khảo, LCS/LTTV nguồn NĐ
- FAQ: thêm câu hỏi "Bản web có AI không?"
- `docs/js/copy.js` — nguồn copy chuẩn hóa

---

### Web Dashboard — Deep Audit & Overhaul
- **Architecture**: Tách `docs/js/shared.js` — parser, font fix, salary, utils
- **Live convert**: Tự động chuyển đổi khi gõ (debounce 350ms), bỏ delay giả
- **parseLocaleNumber**: Hỗ trợ định dạng VN `1.234.567,89` và US `1,234,567.89`
- **Font VNI/TCVN3**: Sửa bảng mapping lỗi, preview realtime
- **Mobile UX**: Thanh công cụ cuộn ngang, sidebar ẩn trên mobile
- **Dark mode**: Toggle theme, lưu localStorage
- **VAT 5%**: Thêm mức thuế suất 5%
- **VietQR**: Trường tên chủ TK; HR email domain tùy chọn
- **XML**: Hỗ trợ thêm tag alias (Seller/Buyer/Product)
- **PWA**: Service worker network-first cho HTML, cache v2.2.0
- **A11y**: Skip link, focus-visible, prefers-reduced-motion
- **Tests**: `scripts/test-shared.js` cho parser

---

### Repository Merge & Audit
- **Merged `docsothanhchu`** into `numbertowords` — VBA source consolidated under `legacy-vba/`
- **Fixed broken download links** — `.xlam` now points to `legacy-vba/DocSoThanhChu.xlam`
- **Fixed `CAI_DAT_WINDOWS.cmd`** — copies from `legacy-vba/` path
- **Docs sync** — `sync-docs.sh` verified; web-addin and docs/src in sync
- **README unified** — badges, support info, accounting rules, and v2.x docs combined
- **Added** `ABOUT.md`, `docs/KARPATHY-AI-LEARNING-GUIDE.md` from legacy repo

---

## v2.1.0 (2026-04-14)

### 🎨 Major: Enterprise UI/UX Unification & Rebranding
- **Notion + Wise Design System**: Replaced the legacy dark mode in the Excel Taskpane with a bright, minimalist "Warm White & Finance Green" UI, matching the Web version precisely.
- **Emoji-Free Professionalism**: Removed all emojis (`✅`, `🤖`, `⚡`, `⭐`) across the UI, toast notifications, and AI fallback logic. Rendered a pure SVG `₫` icon to replace raster graphics.
- **Micro-interactions**: Added 250ms CSS standard transitions, hover-lifts, and refined loading spinners for immediate feedback.
- **Repository Optimization**: Deep cleaned the root directory, isolating legacy scripts to `legacy-vba/` and finalizing deployment structures for production.

---
## v2.0.0 (2026-04-14)

### 🚀 New: Office.js Web Add-in (Mac + Windows + Excel Online)
- **Cross-platform**: chạy trên Excel macOS, Windows, và Excel Online
- **Custom Functions**: `=DOCSO.VND_VI()`, `=DOCSO.VND_EN()`, `=DOCSO.USD_VI()`, `=DOCSO.USD_EN()`, `=DOCSO.SO_VI()`, `=DOCSO.SO_EN()`
- **AI Mode**: `=DOCSO.AI_SO(number, lang, currency)` — Groq Llama-3.1 API, fallback tự động về rule-based
- **Task Pane UI**: dark mode, convert nhanh, batch convert, insert-to-cell, AI toggle
- **Shared Runtime**: Task Pane và Custom Functions dùng chung JS context → API key nhập 1 lần, dùng được trong cả cell formula

### Bug Fixes (VBA v1.1.0 → v1.1.1)
- **FIXED floating-point decimal**: `USD_Vi`/`USD_En` chuyển sang integer arithmetic (`Math.round(n*100) mod 100`) để tránh precision loss khi tính xu/cents
- **FIXED array cache**: `GetSoTiengViet()` nay cache kết quả vào module-level variable, không rebuild array mỗi lần gọi
- **FIXED README**: "no auto-popup on startup" → "no popup after first use" (chính xác hơn — `Auto_Open` vẫn hiện popup lần đầu)

### Structure
```
numbertowords/
├── legacy-vba/           ← VBA Add-in (.xlam) + build scripts
├── web-addin/            ← Office.js Add-in (Mac + Win + Web)
│   ├── manifest.xml
│   └── src/
└── docs/                 ← Web tool + GitHub Pages
```

---

## v1.1.0 (2026-02-20)

### Bug Fixes
- **CRITICAL: Fixed CInt overflow** for numbers > 32,767 billion (changed all `Integer` to `Long`)
- **Removed Auto_Open dialog** - No more popup every time Excel starts. Use `DocSoThanhChu_Help` macro manually.
- **Fixed hardcoded "mười"** in `DocSo2ChuSoVi` - now uses `GetVietnameseWord("muoi")` for consistency

### Improvements
- **Input validation**: All 6 functions now check `IsNumeric()` before processing, returning clear error messages
- **Trailing period**: Currency functions (`VND_Vi`, `VND_En`, `USD_Vi`, `USD_En`) now append `.` per Vietnamese Accounting Standards
- **Comprehensive test suite**: `Test-AddIn.ps1` expanded from 5 to 34 test cases with edge case coverage
- **Added LICENSE file**: MIT License (was referenced in README but missing)
- **Updated Build-AddIn.bat**: Fixed outdated references to old separate modules

---

## v1.0.5 (2026-02-06)

### What's New
- **Merged modules**: Combined 3 VBA modules into single `modDocSoThanhChu.bas`
- **Shortened function names** for better UX:
  - `VND_Vi(A1)` - VND Vietnamese
  - `VND_En(A1)` - VND English
  - `USD_Vi(A1)` - USD Vietnamese
  - `USD_En(A1)` - USD English
  - `So_Vi(A1)` - Number Vietnamese
  - `So_En(A1)` - Number English
- **One-click installer**: Added `Install.vbs` (no admin required, AV-safe)
- **Cleaner autocomplete**: Internal functions now Private

### Breaking Changes
- Function names changed from `DocSoVND_Vi` to `VND_Vi` (shorter)
- Old function names no longer work

---

## v1.0.4 (2026-02-06)

### What's New
- Added welcome message with branding
- Added donation info (MB Bank, Momo)
- Fixed Vietnamese diacritics encoding

---

## v1.0.3 (2026-02-06)

### What's New
- Full Vietnamese diacritics support using ChrW()
- Welcome popup on Add-in load

---

## v1.0.2 (2026-02-06)

### What's New
- Added `DocSo_Vi()` and `DocSo_En()` functions
- Bilingual documentation (EN/VI)

---

## v1.0.1 (2026-02-06)

### What's New
- Added USD support (Vietnamese & English)
- Added negative number handling

---

## v1.0.0 (2026-02-06)

### Initial Release
- VND to Vietnamese text
- VND to English text
- Vietnamese accounting rules (mười/mươi, mốt/tư/lăm, lẻ, nghìn)
- Microsoft 365 compatible (32-bit & 64-bit)
- Pure VBA (antivirus safe)
