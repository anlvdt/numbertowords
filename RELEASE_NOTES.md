# Release Notes

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
