# DocSoThanhChu - Excel Add-in Đọc Số Thành Chữ

[![Excel](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/excel)
[![VBA](https://img.shields.io/badge/VBA-867DB0?style=for-the-badge&logo=visual-basic&logoColor=white)](https://docs.microsoft.com/office/vba/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

Add-in Excel đọc số tiền thành chữ, hỗ trợ **VND** và **USD** bằng **tiếng Việt** và **tiếng Anh**.

---

## ✨ Tính năng | Features

| Hàm | Mô tả | Ví dụ |
|-----|-------|-------|
| `DocSoVND_Vi(số)` | VND → Tiếng Việt | "Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng" |
| `DocSoVND_En(số)` | VND → English | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `DocSoUSD_Vi(số)` | USD → Tiếng Việt | "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu" |
| `DocSoUSD_En(số)` | USD → English | "One thousand two hundred and thirty-four dollars and fifty-six cents" |
| `DocSo_Vi(số)` | Số → Tiếng Việt | Đọc số nguyên (không đơn vị tiền) |
| `DocSo_En(số)` | Number → English | Read integer (no currency unit) |

---

## 📖 Hướng dẫn sử dụng chi tiết | Detailed Usage

### Ví dụ 1: Đọc số tiền VND

```excel
' Ô A1 chứa số: 1234567
=DocSoVND_Vi(A1)
' Kết quả: Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng

=DocSoVND_En(A1)
' Result: One million two hundred thirty-four thousand five hundred and sixty-seven Vietnamese dong
```

### Ví dụ 2: Đọc số tiền USD (có cents)

```excel
' Ô B1 chứa số: 1234.56
=DocSoUSD_Vi(B1)
' Kết quả: Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu

=DocSoUSD_En(B1)
' Result: One thousand two hundred and thirty-four dollars and fifty-six cents
```

### Ví dụ 3: Đọc số nguyên (không đơn vị tiền)

```excel
' Ô C1 chứa số: 999
=DocSo_Vi(C1)
' Kết quả: Chín trăm chín mươi chín

=DocSo_En(C1)
' Result: Nine hundred and ninety-nine
```

### Ví dụ 4: Số âm

```excel
=DocSoVND_Vi(-500000)
' Kết quả: Âm năm trăm nghìn đồng

=DocSoUSD_En(-100)
' Result: Negative one hundred dollars
```

---

## 📥 Cài đặt | Installation

### Bước 1: Tải Add-in
Tải file `DocSoThanhChu.xlam` về máy tính.

### Bước 2: Cài đặt vào Excel

1. Mở **Excel**
2. Vào **File** → **Options** (hoặc **Tệp** → **Tùy chọn**)
3. Chọn **Add-ins** (Bổ trợ)
4. Ở dòng **Manage**, chọn **Excel Add-ins** → Click **Go...**
5. Click **Browse...** → Chọn file `DocSoThanhChu.xlam`
6. Đánh dấu checkbox ✅ bên cạnh **DocSoThanhChu**
7. Click **OK**

![Cài đặt Add-in](https://blog.hocexcel.online/wp-content/uploads/2017/04/doc_so_thanh_chu.png)

### Bước 3: Sử dụng

Trong ô Excel bất kỳ, nhập công thức:

```
=DocSoVND_Vi(A1)
=DocSoUSD_En(B2)
```

---

## 🔧 Tương thích | Compatibility

| Phiên bản | Hỗ trợ |
|-----------|--------|
| Microsoft 365 (32-bit) | ✅ |
| Microsoft 365 (64-bit) | ✅ |
| Excel 2021, 2019, 2016 | ✅ |
| Excel 2013, 2010 | ✅ |

**Antivirus Compatibility:**
- ✅ Windows Defender
- ✅ CrowdStrike Falcon
- ✅ Trend Micro
- ✅ Kaspersky, Norton, McAfee

> Add-in sử dụng **pure VBA** - không gọi Windows API, không có external DLL calls, không tự động chạy code.

---

## 🛠️ Tạo Add-in từ Source Code

Nếu bạn muốn tự tạo Add-in từ source code:

1. Mở **Excel** → **Alt + F11** để mở VBA Editor
2. Vào **File** → **Import File...**
3. Import lần lượt 3 file:
   - `modVietnameseConverter.bas`
   - `modEnglishConverter.bas`
   - `modMainFunctions.bas`
4. **File** → **Save As** → Chọn loại **Excel Add-in (*.xlam)**
5. Lưu với tên `DocSoThanhChu.xlam`

---

## 📝 Quy tắc đọc số tiếng Việt | Vietnamese Number Reading Rules

Add-in tuân thủ **chuẩn kế toán Việt Nam** theo các văn bản pháp lý:
- Luật Kế toán 88/2015/QH13
- Thông tư 39/2014/TT-BTC, 26/2015/TT-BTC
- Nghị định 123/2020/NĐ-CP

### Bảng quy tắc chi tiết | Detailed Rules

| Quy tắc | Điều kiện | Ví dụ |
|---------|-----------|-------|
| **mười** | Số 10-19 | 10 → mười, 15 → mười lăm |
| **mươi** | Hàng chục ≥ 2 | 20 → hai mươi, 55 → năm mươi lăm |
| **một** | Đứng một mình hoặc hàng chục ≤ 1 | 1, 11, 101 → một |
| **mốt** | Hàng đơn vị = 1, hàng chục ≥ 2 | 21 → hai mươi mốt, 91 → chín mươi mốt |
| **năm** | Đứng một mình hoặc đầu số | 5, 50, 500 → năm |
| **lăm** | Hàng đơn vị = 5, hàng chục ≥ 1 | 15 → mười lăm, 25 → hai mươi lăm |
| **bốn** | Đứng một mình hoặc 14 | 4, 14, 400 → bốn |
| **tư** | Hàng đơn vị = 4, hàng chục ≥ 2 | 24 → hai mươi tư, 94 → chín mươi tư |
| **lẻ** | Hàng chục = 0, đơn vị > 0 | 101 → một trăm lẻ một |
| **nghìn** | Chuẩn chính thức (trên tiền tệ) | 1000 → một nghìn ✅ (không dùng "ngàn") |

### Ví dụ đọc số phức tạp | Complex Number Examples

```
14        → Mười bốn (không phải "mười tư")
24        → Hai mươi tư
101       → Một trăm lẻ một
1.001     → Một nghìn không trăm lẻ một
1.234.567 → Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy
```

---

## 📚 Mã nguồn tham khảo | Reference Source

Add-in này được xây dựng dựa trên ý tưởng từ:

- **Học Excel Online** - [Đọc số thành chữ bằng Add-in](https://blog.hocexcel.online/doc-so-thanh-chu-bang-add-in-tu-hoc-excel-online.html)
- Tác giả gốc: **Nguyễn Đức Thanh** (dtnguyen)

Đã được rebuild và mở rộng với các tính năng:
- ✅ Hỗ trợ cả VND và USD
- ✅ Đọc bằng tiếng Việt và tiếng Anh
- ✅ Tương thích M365 32/64-bit
- ✅ Pure VBA (không bị antivirus chặn)

---

## 👤 Author | Tác giả (Rebuild)

**Le Van An** (Vietnam IT)

[![GitHub](https://img.shields.io/badge/GitHub-@anlvdt-181717?style=for-the-badge&logo=github)](https://github.com/anlvdt)
[![Facebook](https://img.shields.io/badge/Facebook-Laptop%20Le%20An-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/laptopleandotcom)

---

## 💖 Support the Developer | Ủng hộ tác giả

<a href="https://img.shields.io/badge/Sponsor-❤️-ea4aaa?style=for-the-badge">
  <img src="https://img.shields.io/badge/Sponsor_this_project-❤️-ea4aaa?style=for-the-badge" alt="Sponsor">
</a>

If you find this project useful, please consider supporting the developer:

Nếu bạn thấy dự án này hữu ích, hãy cân nhắc ủng hộ tác giả:

| 💳 Method | 🔢 Account | 👤 Name |
|-----------|------------|---------|
| **MB Bank** | `0360126996868` | LE VAN AN |
| **Momo** | `0976896621` | LE VAN AN |

### 🛒 Support via Shopee | Hỗ trợ qua Shopee

> 💡 **Tip**: You can support by just clicking the link - no purchase required!
>
> Bạn có thể hỗ trợ chỉ bằng cách click link - không cần mua hàng!

[![Shopee](https://img.shields.io/badge/Shopee-Laptop%20Le%20An-EE4D2D?style=for-the-badge&logo=shopee&logoColor=white)](https://collshp.com/laptopleandotcom?view=storefront)

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại.
