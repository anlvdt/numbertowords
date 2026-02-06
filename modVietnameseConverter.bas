Attribute VB_Name = "modVietnameseConverter"
Option Explicit

' =====================================================
' Module: modVietnameseConverter
' Description: Chuyển đổi số thành chữ tiếng Việt
' Compatible: Microsoft 365 (32-bit và 64-bit)
' Author: Le Van An (@anlvdt)
' =====================================================

Private Const DONVI = "đồng"
Private Const USD_DONVI = "đô la Mỹ"
Private Const USD_XU = "xu"

' Mảng chữ số
Private Function GetSoTiengViet() As Variant
    GetSoTiengViet = Array("không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín")
End Function

' Đọc số có 1 chữ số
Private Function DocSo1ChuSo(ByVal so As Integer) As String
    Dim arrSo As Variant
    arrSo = GetSoTiengViet()
    If so >= 0 And so <= 9 Then
        DocSo1ChuSo = arrSo(so)
    Else
        DocSo1ChuSo = ""
    End If
End Function

' Đọc số có 2 chữ số
Private Function DocSo2ChuSo(ByVal so As Integer) As String
    Dim chuc As Integer, donvi As Integer
    Dim arrSo As Variant
    Dim kq As String
    
    arrSo = GetSoTiengViet()
    chuc = so \ 10
    donvi = so Mod 10
    
    If chuc = 0 Then
        kq = DocSo1ChuSo(donvi)
    ElseIf chuc = 1 Then
        kq = "mười"
        If donvi = 5 Then
            kq = kq & " lăm"
        ElseIf donvi > 0 Then
            ' 14 → mười bốn (không dùng "tư" cho 14)
            kq = kq & " " & arrSo(donvi)
        End If
    Else
        kq = arrSo(chuc) & " mươi"
        If donvi = 0 Then
            ' không thêm gì
        ElseIf donvi = 1 Then
            kq = kq & " mốt"
        ElseIf donvi = 4 Then
            ' Chỉ dùng "tư" khi hàng chục >= 2 (24, 34, 44...)
            kq = kq & " tư"
        ElseIf donvi = 5 Then
            kq = kq & " lăm"
        Else
            kq = kq & " " & arrSo(donvi)
        End If
    End If
    
    DocSo2ChuSo = kq
End Function

' Đọc số có 3 chữ số
Private Function DocSo3ChuSo(ByVal so As Integer, Optional ByVal coLe As Boolean = False) As String
    Dim tram As Integer, chuc As Integer, donvi As Integer
    Dim arrSo As Variant
    Dim kq As String
    
    arrSo = GetSoTiengViet()
    tram = so \ 100
    chuc = (so Mod 100) \ 10
    donvi = so Mod 10
    
    If tram > 0 Then
        kq = arrSo(tram) & " trăm"
    ElseIf coLe Then
        kq = "không trăm"
    Else
        kq = ""
    End If
    
    If chuc = 0 And donvi > 0 Then
        kq = kq & " lẻ " & arrSo(donvi)
    ElseIf chuc > 0 Or donvi > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo2ChuSo(chuc * 10 + donvi)
    End If
    
    DocSo3ChuSo = Trim(kq)
End Function

' Đọc số nguyên thành chữ tiếng Việt
Public Function DocSoNguyenTiengViet(ByVal soNguyen As Variant) As String
    Dim so As Double
    Dim kq As String
    Dim ty As Long, trieu As Long, nghin As Long, donViSo As Long
    Dim arrSo As Variant
    Dim isNegative As Boolean
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(soNguyen) Or soNguyen = "" Then
        DocSoNguyenTiengViet = ""
        Exit Function
    End If
    
    so = CDbl(soNguyen)
    
    ' Xử lý số âm
    If so < 0 Then
        isNegative = True
        so = Abs(so)
    End If
    
    ' Làm tròn về số nguyên
    so = Fix(so)
    
    If so = 0 Then
        DocSoNguyenTiengViet = "không"
        Exit Function
    End If
    
    arrSo = GetSoTiengViet()
    
    ' Tách thành các nhóm: tỷ, triệu, nghìn, đơn vị
    ty = Fix(so / 1000000000#)
    so = so - ty * 1000000000#
    
    trieu = Fix(so / 1000000)
    so = so - trieu * 1000000
    
    nghin = Fix(so / 1000)
    donViSo = Fix(so - nghin * 1000)
    
    kq = ""
    
    ' Đọc phần tỷ
    If ty > 0 Then
        kq = DocSo3ChuSo(CInt(ty), False) & " tỷ"
    End If
    
    ' Đọc phần triệu
    If trieu > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo3ChuSo(CInt(trieu), ty > 0) & " triệu"
    ElseIf ty > 0 And (nghin > 0 Or donViSo > 0) Then
        kq = kq & " không trăm triệu"
    End If
    
    ' Đọc phần nghìn
    If nghin > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo3ChuSo(CInt(nghin), (ty > 0 Or trieu > 0)) & " nghìn"
    ElseIf (ty > 0 Or trieu > 0) And donViSo > 0 Then
        kq = kq & " không trăm nghìn"
    End If
    
    ' Đọc phần đơn vị
    If donViSo > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo3ChuSo(CInt(donViSo), (ty > 0 Or trieu > 0 Or nghin > 0))
    End If
    
    ' Thêm "âm" nếu số âm
    If isNegative Then
        kq = "âm " & kq
    End If
    
    ' Viết hoa chữ cái đầu
    If Len(kq) > 0 Then
        kq = UCase(Left(kq, 1)) & Mid(kq, 2)
    End If
    
    DocSoNguyenTiengViet = Trim(kq)
    Exit Function
    
ErrorHandler:
    DocSoNguyenTiengViet = "#LỖI#"
End Function

' Đọc số tiền VND thành chữ tiếng Việt
Public Function DocTienVND_TiengViet(ByVal soTien As Variant) As String
    Dim kq As String
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(soTien) Or soTien = "" Then
        DocTienVND_TiengViet = ""
        Exit Function
    End If
    
    kq = DocSoNguyenTiengViet(Fix(CDbl(soTien)))
    
    If kq <> "#LỖI#" And kq <> "" Then
        kq = kq & " " & DONVI
    End If
    
    DocTienVND_TiengViet = kq
    Exit Function
    
ErrorHandler:
    DocTienVND_TiengViet = "#LỖI#"
End Function

' Đọc số tiền USD thành chữ tiếng Việt
Public Function DocTienUSD_TiengViet(ByVal soTien As Variant) As String
    Dim nguyen As Double, le As Integer
    Dim kq As String, kqLe As String
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(soTien) Or soTien = "" Then
        DocTienUSD_TiengViet = ""
        Exit Function
    End If
    
    nguyen = Fix(CDbl(soTien))
    le = CInt(Round((CDbl(soTien) - nguyen) * 100, 0))
    
    kq = DocSoNguyenTiengViet(nguyen)
    
    If kq <> "#LỖI#" And kq <> "" Then
        kq = kq & " " & USD_DONVI
        
        If le > 0 Then
            kqLe = DocSoNguyenTiengViet(le)
            If kqLe <> "#LỖI#" And kqLe <> "" Then
                ' Viết thường chữ cái đầu của phần xu
                kqLe = LCase(Left(kqLe, 1)) & Mid(kqLe, 2)
                kq = kq & " và " & kqLe & " " & USD_XU
            End If
        End If
    End If
    
    DocTienUSD_TiengViet = kq
    Exit Function
    
ErrorHandler:
    DocTienUSD_TiengViet = "#LỖI#"
End Function
