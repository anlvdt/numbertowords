# DocSoThanhChu - Excel Add-in

[![Excel](https://img.shields.io/badge/Excel-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)](https://www.microsoft.com/excel)
[![VBA](https://img.shields.io/badge/VBA-867DB0?style=for-the-badge&logo=visual-basic&logoColor=white)](https://docs.microsoft.com/office/vba/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Release](https://img.shields.io/github/v/release/anlvdt/numbertowords?style=for-the-badge)](https://github.com/anlvdt/numbertowords/releases)

**English** | [Tieng Viet](#tieng-viet)

---

## English

Excel Add-in to convert numbers to words, supporting **VND** and **USD** in both **Vietnamese** and **English**.

### Features

| Function | Description | Example Output |
|----------|-------------|----------------|
| `DocSoVND_Vi(number)` | VND to Vietnamese | "Mot trieu hai tram ba muoi tu nghin... dong" |
| `DocSoVND_En(number)` | VND to English | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `DocSoUSD_Vi(number)` | USD to Vietnamese | "Mot nghin hai tram ba muoi tu do la My va nam muoi sau xu" |
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
=DocSoVND_Vi(A1)      ' 1234567 -> "Mot trieu hai tram ba muoi tu nghin nam tram sau muoi bay dong"
=DocSoVND_En(A1)      ' 1234567 -> "One million... Vietnamese dong"
=DocSoUSD_Vi(1234.56) ' "Mot nghin hai tram ba muoi tu do la My va nam muoi sau xu"
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
| **muoi** | Numbers 10-19 | 15 -> muoi lam |
| **muoi** | Tens digit >= 2 | 25 -> hai muoi lam |
| **mot** | Units = 1, tens >= 2 | 21 -> hai muoi mot |
| **lam** | Units = 5, tens >= 1 | 15 -> muoi lam |
| **tu** | Units = 4, tens >= 2 | 24 -> hai muoi tu |
| **le** | Tens = 0, units > 0 | 101 -> mot tram le mot |
| **nghin** | Standard (currency) | 1000 -> mot nghin |

---

## Tieng Viet

Add-in Excel doc so tien thanh chu, ho tro **VND** va **USD** bang **tieng Viet** va **tieng Anh**.

### Tinh nang

| Ham | Mo ta | Ket qua |
|-----|-------|---------|
| `DocSoVND_Vi(so)` | VND -> Tieng Viet | "Mot trieu hai tram ba muoi tu nghin... dong" |
| `DocSoVND_En(so)` | VND -> Tieng Anh | "One million two hundred thirty-four thousand... Vietnamese dong" |
| `DocSoUSD_Vi(so)` | USD -> Tieng Viet | "Mot nghin hai tram ba muoi tu do la My va nam muoi sau xu" |
| `DocSoUSD_En(so)` | USD -> Tieng Anh | "One thousand two hundred and thirty-four dollars and fifty-six cents" |
| `DocSo_Vi(so)` | So -> Tieng Viet | Doc so nguyen khong co don vi tien |
| `DocSo_En(so)` | So -> Tieng Anh | Read integer without currency |

### Cai dat

1. Tai `DocSoThanhChu.xlam` tu [Releases](https://github.com/anlvdt/numbertowords/releases)
2. Mo **Excel** > **File** > **Options** (Tuy chon) > **Add-ins** (Bo tro)
3. **Manage**: Excel Add-ins > **Go...**
4. **Browse...** > Chon file `DocSoThanhChu.xlam`
5. Danh dau checkbox > **OK**

### Huong dan su dung

```excel
=DocSoVND_Vi(A1)      ' 1234567 -> "Mot trieu hai tram ba muoi tu nghin nam tram sau muoi bay dong"
=DocSoVND_En(A1)      ' 1234567 -> "One million... Vietnamese dong"
=DocSoUSD_Vi(1234.56) ' "Mot nghin hai tram ba muoi tu do la My va nam muoi sau xu"
=DocSoUSD_En(1234.56) ' "One thousand two hundred and thirty-four dollars and fifty-six cents"
=DocSoVND_Vi(-500000) ' "Am nam tram nghin dong"
```

### Tuong thich

- Microsoft 365 (32-bit & 64-bit)
- Excel 2021, 2019, 2016, 2013, 2010
- Khong bi chan boi: Windows Defender, CrowdStrike, Trend Micro

> **Pure VBA** - Khong goi Windows API, khong co DLL ngoai, khong tu dong chay code.

### Quy tac doc so tieng Viet (Chuan ke toan)

Tuan thu Luat Ke toan 88/2015/QH13, Thong tu 39/2014/TT-BTC:

| Quy tac | Dieu kien | Vi du |
|---------|-----------|-------|
| **muoi** | So 10-19 | 15 -> muoi lam |
| **muoi** | Hang chuc >= 2 | 25 -> hai muoi lam |
| **mot** | Don vi = 1, chuc >= 2 | 21 -> hai muoi mot |
| **lam** | Don vi = 5, chuc >= 1 | 15 -> muoi lam |
| **tu** | Don vi = 4, chuc >= 2 | 24 -> hai muoi tu |
| **le** | Chuc = 0, don vi > 0 | 101 -> mot tram le mot |
| **nghin** | Chuan tren tien te | 1000 -> mot nghin (khong dung "ngan") |

---

## Build from Source | Tao tu ma nguon

```bash
# Clone repository
git clone https://github.com/anlvdt/numbertowords.git

# Open Excel > Alt+F11 > File > Import File
# Import: modVietnameseConverter.bas, modEnglishConverter.bas, modMainFunctions.bas
# File > Save As > Excel Add-in (*.xlam)
```

Or run: `Build-AddIn.ps1` or `Build-AddIn.bat`

---

## Reference | Tham khao

Based on:
- [Hoc Excel Online](https://blog.hocexcel.online/doc-so-thanh-chu-bang-add-in-tu-hoc-excel-online.html) - Nguyen Duc Thanh

Enhanced with:
- VND + USD support
- Vietnamese + English output
- M365 32/64-bit compatible
- Pure VBA (antivirus safe)

---

## Author | Tac gia

**Le Van An** (Vietnam IT)

[![GitHub](https://img.shields.io/badge/GitHub-@anlvdt-181717?style=for-the-badge&logo=github)](https://github.com/anlvdt)
[![Facebook](https://img.shields.io/badge/Facebook-Laptop%20Le%20An-1877F2?style=for-the-badge&logo=facebook&logoColor=white)](https://www.facebook.com/laptopleandotcom)

---

## Support | Ung ho

If you find this project useful, please consider supporting the developer:

Neu ban thay du an nay huu ich, hay can nhac ung ho tac gia:

| Method | Account | Name |
|--------|---------|------|
| **MB Bank** | `0360126996868` | LE VAN AN |
| **Momo** | `0976896621` | LE VAN AN |

[![Shopee](https://img.shields.io/badge/Shopee-Laptop%20Le%20An-EE4D2D?style=for-the-badge&logo=shopee&logoColor=white)](https://collshp.com/laptopleandotcom?view=storefront)

> **Tip**: You can support by just clicking the link - no purchase required!
>
> Ban co the ho tro chi bang cach click link - khong can mua hang!

---

## License

MIT License - Free for personal and commercial use.

MIT License - Tu do su dung cho muc dich ca nhan va thuong mai.
