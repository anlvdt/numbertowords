# DocSoThanhChu - Excel Add-in

[![Excel](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/excel)
[![VBA](https://img.shields.io/badge/VBA-867DB0?style=for-the-badge&logo=visual-basic&logoColor=white)](https://docs.microsoft.com/office/vba/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/anlvdt/numbertowords?style=for-the-badge)](https://github.com/anlvdt/numbertowords/releases)

**English** | [Tiếng Việt](#tiếng-việt)

---

## English

Excel Add-in to convert numbers to words, supporting **VND** and **USD** in both **Vietnamese** and **English**. Perfect for accounting, invoices, and financial documents.

### Features

| Function | Description | Example Output |
|----------|-------------|----------------|
| `VND_Vi(number)` | VND to Vietnamese | "Một triệu hai trăm ba mươi bốn nghìn... đồng" |
| `VND_En(number)` | VND to English | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `USD_Vi(number)` | USD to Vietnamese | "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu" |
| `USD_En(number)` | USD to English | "One thousand two hundred and thirty-four dollars and fifty-six cents" |
| `So_Vi(number)` | Number to Vietnamese | Read integer without currency |
| `So_En(number)` | Number to English | Read integer without currency |

### Installation

**Option 1: One-Click Install**
1. Download `DocSoThanhChu.xlam` and `Install.vbs` from [Releases](https://github.com/anlvdt/numbertowords/releases)
2. Double-click `Install.vbs`
3. Open Excel > File > Options > Add-ins > Go... > Check "DocSoThanhChu" > OK

**Option 2: Manual Install**
1. Download `DocSoThanhChu.xlam`
2. Copy to `%APPDATA%\Microsoft\AddIns\`
3. Open Excel > File > Options > Add-ins > Go... > Check "DocSoThanhChu" > OK

### Usage

```excel
=VND_Vi(A1)        ' 1234567 -> "Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng"
=VND_En(A1)        ' 1234567 -> "One million... Vietnamese dong"
=USD_Vi(1234.56)   ' "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu"
=USD_En(1234.56)   ' "One thousand two hundred and thirty-four dollars and fifty-six cents"
=So_Vi(-500000)    ' "Âm năm trăm nghìn"
```

### Compatibility

- Microsoft 365 (32-bit & 64-bit)
- Excel 2021, 2019, 2016, 2013, 2010
- Antivirus safe: Windows Defender, CrowdStrike, Trend Micro

> **Pure VBA** - No Windows API calls, no external DLLs, no auto-execution.

### Vietnamese Number Rules (Accounting Standard)

Compliant with Vietnamese Accounting Law 88/2015/QH13, Circular 39/2014/TT-BTC:

| Rule | Condition | Example |
|------|-----------|---------|
| **mười** | Numbers 10-19 | 15 -> mười lăm |
| **mươi** | Tens digit >= 2 | 25 -> hai mươi lăm |
| **mốt** | Units = 1, tens >= 2 | 21 -> hai mươi mốt |
| **lăm** | Units = 5, tens >= 1 | 15 -> mười lăm |
| **tư** | Units = 4, tens >= 2 | 24 -> hai mươi tư |
| **lẻ** | Tens = 0, units > 0 | 101 -> một trăm lẻ một |
| **nghìn** | Standard (currency) | 1000 -> một nghìn |

---

## Tiếng Việt

Add-in Excel đọc số tiền thành chữ, hỗ trợ **VND** và **USD** bằng **tiếng Việt** và **tiếng Anh**. Phù hợp cho kế toán, hóa đơn, và chứng từ tài chính.

### Tính năng

| Hàm | Mô tả | Kết quả |
|-----|-------|---------|
| `VND_Vi(số)` | VND -> Tiếng Việt | "Một triệu hai trăm ba mươi bốn nghìn... đồng" |
| `VND_En(số)` | VND -> Tiếng Anh | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `USD_Vi(số)` | USD -> Tiếng Việt | "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu" |
| `USD_En(số)` | USD -> Tiếng Anh | "One thousand two hundred and thirty-four dollars and fifty-six cents" |
| `So_Vi(số)` | Số -> Tiếng Việt | Đọc số nguyên không có đơn vị tiền |
| `So_En(số)` | Số -> Tiếng Anh | Read integer without currency |

### Cài đặt

**Cách 1: One-Click (khuyên dùng)**
1. Tải `DocSoThanhChu.xlam` và `Install.vbs` từ [Releases](https://github.com/anlvdt/numbertowords/releases)
2. Double-click file `Install.vbs`
3. Mở Excel > File > Options > Add-ins > Go... > Check "DocSoThanhChu" > OK

**Cách 2: Thủ công**
1. Tải `DocSoThanhChu.xlam`
2. Copy vào `%APPDATA%\Microsoft\AddIns\`
3. Mở Excel > File > Options > Add-ins > Go... > Check "DocSoThanhChu" > OK

### Hướng dẫn sử dụng

```excel
=VND_Vi(A1)        ' 1234567 -> "Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng"
=VND_En(A1)        ' 1234567 -> "One million... Vietnamese dong"
=USD_Vi(1234.56)   ' "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu"
=USD_En(1234.56)   ' "One thousand two hundred and thirty-four dollars and fifty-six cents"
=VND_Vi(-500000)   ' "Âm năm trăm nghìn đồng"
```

### Tương thích

- Microsoft 365 (32-bit & 64-bit)
- Excel 2021, 2019, 2016, 2013, 2010
- Không bị chặn bởi: Windows Defender, CrowdStrike, Trend Micro

> **Pure VBA** - Không gọi Windows API, không có DLL ngoài, không tự động chạy code.

### Quy tắc đọc số tiếng Việt (Chuẩn kế toán)

Tuân thủ Luật Kế toán 88/2015/QH13, Thông tư 39/2014/TT-BTC:

| Quy tắc | Điều kiện | Ví dụ |
|---------|-----------|-------|
| **mười** | Số 10-19 | 15 -> mười lăm |
| **mươi** | Hàng chục >= 2 | 25 -> hai mươi lăm |
| **mốt** | Đơn vị = 1, chục >= 2 | 21 -> hai mươi mốt |
| **lăm** | Đơn vị = 5, chục >= 1 | 15 -> mười lăm |
| **tư** | Đơn vị = 4, chục >= 2 | 24 -> hai mươi tư |
| **lẻ** | Chục = 0, đơn vị > 0 | 101 -> một trăm lẻ một |
| **nghìn** | Chuẩn trên tiền tệ | 1000 -> một nghìn (không dùng "ngàn") |

---

## Build from Source / Tạo từ mã nguồn

```bash
git clone https://github.com/anlvdt/numbertowords.git
cd numbertowords

# Build using PowerShell
.\Build-AddIn.ps1

# Test
.\Test-AddIn.ps1
```

---

## Author / Tác giả

**Le Van An** (Vietnam IT)

[![GitHub](https://img.shields.io/badge/GitHub-@anlvdt-181717?style=for-the-badge&logo=github)](https://github.com/anlvdt)
[![Facebook](https://img.shields.io/badge/Facebook-Laptop%20Le%20An-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/laptopleandotcom)

---

## Support / Ủng hộ

If you find this project useful, please consider supporting the developer:

Nếu bạn thấy dự án này hữu ích, hãy cân nhắc ủng hộ tác giả:

| Method | Account | Name |
|--------|---------|------|
| **MB Bank** | `0360126996868` | LE VAN AN |
| **Momo** | `0976896621` | LE VAN AN |

[![Shopee](https://img.shields.io/badge/Shopee-Laptop%20Le%20An-EE4D2D?style=for-the-badge&logo=shopee&logoColor=white)](https://collshp.com/laptopleandotcom?view=storefront)

> **Tip**: You can support by just clicking the link - no purchase required!
>
> Bạn có thể hỗ trợ chỉ bằng cách click link - không cần mua hàng!

---

## License

MIT License - Free for personal and commercial use.

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.
