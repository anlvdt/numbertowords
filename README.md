# DocSoThanhChu - Excel Add-in

[![Excel](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/excel)
[![VBA](https://img.shields.io/badge/VBA-867DB0?style=for-the-badge&logo=visual-basic&logoColor=white)](https://docs.microsoft.com/office/vba/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

**English** | [Tiếng Việt](#tiếng-việt)

---

## English

Excel Add-in to convert numbers to words, supporting **VND** and **USD** in both **Vietnamese** and **English**.

### Features

| Function | Description | Example Output |
|----------|-------------|----------------|
| `DocSoVND_Vi(number)` | VND to Vietnamese | "Một triệu hai trăm ba mươi bốn nghìn... đồng" |
| `DocSoVND_En(number)` | VND to English | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `DocSoUSD_Vi(number)` | USD to Vietnamese | "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu" |
| `DocSoUSD_En(number)` | USD to English | "One thousand two hundred and thirty-four dollars and fifty-six cents" |
| `DocSo_Vi(number)` | Number to Vietnamese | Read integer without currency |
| `DocSo_En(number)` | Number to English | Read integer without currency |

### Installation

1. Download `DocSoThanhChu.xlam` from [Releases](https://github.com/anlvdt/numbertowords/releases)
2. Open **Excel** > **File** > **Options** > **Add-ins**
3. **Manage**: Excel Add-ins > **Go...**
4. **Browse...** > Select `DocSoThanhChu.xlam`
5. Check the checkbox > **OK**

### Usage

```excel
=DocSoVND_Vi(A1)      ' 1234567 -> "Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng"
=DocSoVND_En(A1)      ' 1234567 -> "One million... Vietnamese dong"
=DocSoUSD_Vi(1234.56) ' "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu"
=DocSoUSD_En(1234.56) ' "One thousand two hundred and thirty-four dollars and fifty-six cents"
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

Add-in Excel đọc số tiền thành chữ, hỗ trợ **VND** và **USD** bằng **tiếng Việt** và **tiếng Anh**.

### Tính năng

| Hàm | Mô tả | Kết quả |
|-----|-------|---------|
| `DocSoVND_Vi(số)` | VND -> Tiếng Việt | "Một triệu hai trăm ba mươi bốn nghìn... đồng" |
| `DocSoVND_En(số)` | VND -> Tiếng Anh | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `DocSoUSD_Vi(số)` | USD -> Tiếng Việt | "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu" |
| `DocSoUSD_En(số)` | USD -> Tiếng Anh | "One thousand two hundred and thirty-four dollars and fifty-six cents" |
| `DocSo_Vi(số)` | Số -> Tiếng Việt | Đọc số nguyên không có đơn vị tiền |
| `DocSo_En(số)` | Số -> Tiếng Anh | Read integer without currency |

### Cài đặt

1. Tải `DocSoThanhChu.xlam` từ [Releases](https://github.com/anlvdt/numbertowords/releases)
2. Mở **Excel** > **File** > **Options** (Tùy chọn) > **Add-ins** (Bổ trợ)
3. **Manage**: Excel Add-ins > **Go...**
4. **Browse...** > Chọn file `DocSoThanhChu.xlam`
5. Đánh dấu checkbox > **OK**

### Hướng dẫn sử dụng

```excel
=DocSoVND_Vi(A1)      ' 1234567 -> "Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng"
=DocSoVND_En(A1)      ' 1234567 -> "One million... Vietnamese dong"
=DocSoUSD_Vi(1234.56) ' "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu"
=DocSoUSD_En(1234.56) ' "One thousand two hundred and thirty-four dollars and fifty-six cents"
=DocSoVND_Vi(-500000) ' "Âm năm trăm nghìn đồng"
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
# Clone repository
git clone https://github.com/anlvdt/numbertowords.git

# Open Excel > Alt+F11 > File > Import File
# Import: modVietnameseConverter.bas, modEnglishConverter.bas, modMainFunctions.bas
# File > Save As > Excel Add-in (*.xlam)
```

Or run: `Build-AddIn.ps1` or `Build-AddIn.bat`

---

## Reference / Tham khảo

Based on:
- [Học Excel Online](https://blog.hocexcel.online/doc-so-thanh-chu-bang-add-in-tu-hoc-excel-online.html) - Nguyễn Đức Thanh

Enhanced with:
- VND + USD support
- Vietnamese + English output
- M365 32/64-bit compatible
- Pure VBA (antivirus safe)

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
