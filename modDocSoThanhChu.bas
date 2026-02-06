Attribute VB_Name = "modDocSoThanhChu"
Option Explicit

' =====================================================
' DocSoThanhChu - Number to Words Add-in
' Author: Le Van An (@anlvdt)
' Version: 1.0.5
' GitHub: github.com/anlvdt/numbertowords
' =====================================================
' PUBLIC FUNCTIONS (visible in Excel):
'   - VND_Vi(number)  : VND -> Vietnamese
'   - VND_En(number)  : VND -> English
'   - USD_Vi(number)  : USD -> Vietnamese
'   - USD_En(number)  : USD -> English
'   - So_Vi(number)   : Number -> Vietnamese
'   - So_En(number)   : Number -> English
' =====================================================

' --- CONSTANTS ---
Private Const VN_DONG As String = "dong"
Private Const VN_DOLA As String = "do la My"
Private Const VN_XU As String = "xu"
Private Const EN_VND_UNIT As String = "Vietnamese dong"
Private Const EN_USD_UNIT As String = "dollars"
Private Const EN_CENTS As String = "cents"
Private Const EN_CENT As String = "cent"
Private Const EN_DOLLAR As String = "dollar"

' =====================================================
' AUTO OPEN - Welcome Message
' =====================================================

Public Sub Auto_Open()
    Dim msg As String
    
    msg = "=== DOC SO THANH CHU ===" & vbCrLf
    msg = msg & "NUMBER TO WORDS ADD-IN v1.0.5" & vbCrLf & vbCrLf
    msg = msg & "Add-in installed successfully!" & vbCrLf & vbCrLf
    msg = msg & "FUNCTIONS:" & vbCrLf
    msg = msg & "--------------------------------------" & vbCrLf
    msg = msg & "=VND_Vi(A1)   VND Vietnamese" & vbCrLf
    msg = msg & "=VND_En(A1)   VND English" & vbCrLf
    msg = msg & "=USD_Vi(A1)   USD Vietnamese" & vbCrLf
    msg = msg & "=USD_En(A1)   USD English" & vbCrLf
    msg = msg & "=So_Vi(A1)    Number Vietnamese" & vbCrLf
    msg = msg & "=So_En(A1)    Number English" & vbCrLf & vbCrLf
    msg = msg & "EXAMPLE: =VND_Vi(1234567)" & vbCrLf & vbCrLf
    msg = msg & "--------------------------------------" & vbCrLf
    msg = msg & "Based on: blog.hocexcel.online" & vbCrLf
    msg = msg & "By Nguyen Duc Thanh" & vbCrLf & vbCrLf
    msg = msg & "SUPPORT:" & vbCrLf
    msg = msg & "MB Bank: 0360126996868" & vbCrLf
    msg = msg & "Momo: 0976896621 - LE VAN AN" & vbCrLf
    msg = msg & "GitHub: github.com/anlvdt"
    
    MsgBox msg, vbInformation, "DocSoThanhChu by AN LE (Vietnam IT)"
End Sub

Public Sub DocSoThanhChu_Help()
    Auto_Open
End Sub

' =====================================================
' PUBLIC FUNCTIONS - These appear in Excel autocomplete
' =====================================================

Public Function VND_Vi(ByVal soTien As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    Dim kq As String
    kq = DocSoNguyenVi(Fix(CDbl(soTien)))
    
    If kq <> "" And Left(kq, 1) <> "#" Then
        kq = kq & " " & GetVietnameseWord("dong")
    End If
    
    VND_Vi = kq
    Exit Function
    
ErrorHandler:
    VND_Vi = "#ERROR: " & Err.Description
End Function

Public Function VND_En(ByVal amount As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    Dim result As String
    result = DocSoNguyenEn(Fix(CDbl(amount)))
    
    If result <> "" And Left(result, 1) <> "#" Then
        result = result & " " & EN_VND_UNIT
    End If
    
    VND_En = result
    Exit Function
    
ErrorHandler:
    VND_En = "#ERROR: " & Err.Description
End Function

Public Function USD_Vi(ByVal soTien As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    Dim nguyen As Double, le As Integer
    Dim kq As String, kqLe As String
    
    nguyen = Fix(CDbl(soTien))
    le = CInt(Round((CDbl(soTien) - nguyen) * 100, 0))
    
    kq = DocSoNguyenVi(nguyen)
    
    If kq <> "" And Left(kq, 1) <> "#" Then
        kq = kq & " " & GetVietnameseWord("dola")
        
        If le > 0 Then
            kqLe = DocSoNguyenVi(le)
            If kqLe <> "" And Left(kqLe, 1) <> "#" Then
                kqLe = LCase(Left(kqLe, 1)) & Mid(kqLe, 2)
                kq = kq & " " & GetVietnameseWord("va") & " " & kqLe & " " & GetVietnameseWord("xu")
            End If
        End If
    End If
    
    USD_Vi = kq
    Exit Function
    
ErrorHandler:
    USD_Vi = "#ERROR: " & Err.Description
End Function

Public Function USD_En(ByVal amount As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    Dim integerPart As Double, decimalPart As Integer
    Dim result As String, centsResult As String
    Dim dollarUnit As String, centUnit As String
    
    integerPart = Fix(CDbl(amount))
    decimalPart = CInt(Round((CDbl(amount) - integerPart) * 100, 0))
    
    If integerPart = 1 Then
        dollarUnit = EN_DOLLAR
    Else
        dollarUnit = EN_USD_UNIT
    End If
    
    result = DocSoNguyenEn(integerPart)
    
    If result <> "" And Left(result, 1) <> "#" Then
        result = result & " " & dollarUnit
        
        If decimalPart > 0 Then
            If decimalPart = 1 Then
                centUnit = EN_CENT
            Else
                centUnit = EN_CENTS
            End If
            
            centsResult = DocSoNguyenEn(decimalPart)
            If centsResult <> "" And Left(centsResult, 1) <> "#" Then
                centsResult = LCase(Left(centsResult, 1)) & Mid(centsResult, 2)
                result = result & " and " & centsResult & " " & centUnit
            End If
        End If
    End If
    
    USD_En = result
    Exit Function
    
ErrorHandler:
    USD_En = "#ERROR: " & Err.Description
End Function

Public Function So_Vi(ByVal so As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    So_Vi = DocSoNguyenVi(so)
    Exit Function
    
ErrorHandler:
    So_Vi = "#ERROR: " & Err.Description
End Function

Public Function So_En(ByVal number As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    So_En = DocSoNguyenEn(number)
    Exit Function
    
ErrorHandler:
    So_En = "#ERROR: " & Err.Description
End Function

' =====================================================
' PRIVATE FUNCTIONS - Vietnamese helpers (hidden from Excel)
' =====================================================

Private Function GetVietnameseWord(ByVal word As String) As String
    Select Case word
        Case "dong": GetVietnameseWord = ChrW(273) & ChrW(7891) & "ng"
        Case "dola": GetVietnameseWord = ChrW(273) & ChrW(244) & " la M" & ChrW(7929)
        Case "xu": GetVietnameseWord = "xu"
        Case "va": GetVietnameseWord = "v" & ChrW(224)
        Case "khong": GetVietnameseWord = "kh" & ChrW(244) & "ng"
        Case "mot": GetVietnameseWord = "m" & ChrW(7897) & "t"
        Case "hai": GetVietnameseWord = "hai"
        Case "ba": GetVietnameseWord = "ba"
        Case "bon": GetVietnameseWord = "b" & ChrW(7889) & "n"
        Case "nam": GetVietnameseWord = "n" & ChrW(259) & "m"
        Case "sau": GetVietnameseWord = "s" & ChrW(225) & "u"
        Case "bay": GetVietnameseWord = "b" & ChrW(7843) & "y"
        Case "tam": GetVietnameseWord = "t" & ChrW(225) & "m"
        Case "chin": GetVietnameseWord = "ch" & ChrW(237) & "n"
        Case "muoi": GetVietnameseWord = "m" & ChrW(432) & ChrW(7901) & "i"
        Case "muoix": GetVietnameseWord = "m" & ChrW(432) & ChrW(417) & "i"
        Case "tram": GetVietnameseWord = "tr" & ChrW(259) & "m"
        Case "nghin": GetVietnameseWord = "ngh" & ChrW(236) & "n"
        Case "trieu": GetVietnameseWord = "tri" & ChrW(7879) & "u"
        Case "ty": GetVietnameseWord = "t" & ChrW(7927)
        Case "le": GetVietnameseWord = "l" & ChrW(7867)
        Case "lam": GetVietnameseWord = "l" & ChrW(259) & "m"
        Case "mot1": GetVietnameseWord = "m" & ChrW(7889) & "t"
        Case "tu": GetVietnameseWord = "t" & ChrW(432)
        Case "am": GetVietnameseWord = ChrW(226) & "m"
        Case Else: GetVietnameseWord = word
    End Select
End Function

Private Function GetSoTiengViet() As Variant
    GetSoTiengViet = Array(GetVietnameseWord("khong"), GetVietnameseWord("mot"), _
        GetVietnameseWord("hai"), GetVietnameseWord("ba"), GetVietnameseWord("bon"), _
        GetVietnameseWord("nam"), GetVietnameseWord("sau"), GetVietnameseWord("bay"), _
        GetVietnameseWord("tam"), GetVietnameseWord("chin"))
End Function

Private Function DocSo2ChuSoVi(ByVal so As Integer) As String
    Dim chuc As Integer, donvi As Integer
    Dim arrSo As Variant
    Dim kq As String
    
    arrSo = GetSoTiengViet()
    chuc = so \ 10
    donvi = so Mod 10
    
    If chuc = 0 Then
        kq = arrSo(donvi)
    ElseIf chuc = 1 Then
        kq = "m" & ChrW(432) & ChrW(7901) & "i"
        If donvi = 5 Then
            kq = kq & " " & GetVietnameseWord("lam")
        ElseIf donvi > 0 Then
            kq = kq & " " & arrSo(donvi)
        End If
    Else
        kq = arrSo(chuc) & " " & GetVietnameseWord("muoix")
        If donvi = 0 Then
            ' nothing
        ElseIf donvi = 1 Then
            kq = kq & " " & GetVietnameseWord("mot1")
        ElseIf donvi = 4 Then
            kq = kq & " " & GetVietnameseWord("tu")
        ElseIf donvi = 5 Then
            kq = kq & " " & GetVietnameseWord("lam")
        Else
            kq = kq & " " & arrSo(donvi)
        End If
    End If
    
    DocSo2ChuSoVi = kq
End Function

Private Function DocSo3ChuSoVi(ByVal so As Integer, Optional ByVal coLe As Boolean = False) As String
    Dim tram As Integer, chuc As Integer, donvi As Integer
    Dim arrSo As Variant
    Dim kq As String
    
    arrSo = GetSoTiengViet()
    tram = so \ 100
    chuc = (so Mod 100) \ 10
    donvi = so Mod 10
    
    If tram > 0 Then
        kq = arrSo(tram) & " " & GetVietnameseWord("tram")
    ElseIf coLe Then
        kq = GetVietnameseWord("khong") & " " & GetVietnameseWord("tram")
    Else
        kq = ""
    End If
    
    If chuc = 0 And donvi > 0 Then
        kq = kq & " " & GetVietnameseWord("le") & " " & arrSo(donvi)
    ElseIf chuc > 0 Or donvi > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo2ChuSoVi(chuc * 10 + donvi)
    End If
    
    DocSo3ChuSoVi = Trim(kq)
End Function

Private Function DocSoNguyenVi(ByVal soNguyen As Variant) As String
    Dim so As Double
    Dim kq As String
    Dim ty As Long, trieu As Long, nghin As Long, donViSo As Long
    Dim isNegative As Boolean
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(soNguyen) Or soNguyen = "" Then
        DocSoNguyenVi = ""
        Exit Function
    End If
    
    so = CDbl(soNguyen)
    
    If so < 0 Then
        isNegative = True
        so = Abs(so)
    End If
    
    so = Fix(so)
    
    If so = 0 Then
        DocSoNguyenVi = GetVietnameseWord("khong")
        Exit Function
    End If
    
    ty = Fix(so / 1000000000#)
    so = so - ty * 1000000000#
    
    trieu = Fix(so / 1000000)
    so = so - trieu * 1000000
    
    nghin = Fix(so / 1000)
    donViSo = Fix(so - nghin * 1000)
    
    kq = ""
    
    If ty > 0 Then
        kq = DocSo3ChuSoVi(CInt(ty), False) & " " & GetVietnameseWord("ty")
    End If
    
    If trieu > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo3ChuSoVi(CInt(trieu), ty > 0) & " " & GetVietnameseWord("trieu")
    ElseIf ty > 0 And (nghin > 0 Or donViSo > 0) Then
        kq = kq & " " & GetVietnameseWord("khong") & " " & GetVietnameseWord("tram") & " " & GetVietnameseWord("trieu")
    End If
    
    If nghin > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo3ChuSoVi(CInt(nghin), (ty > 0 Or trieu > 0)) & " " & GetVietnameseWord("nghin")
    ElseIf (ty > 0 Or trieu > 0) And donViSo > 0 Then
        kq = kq & " " & GetVietnameseWord("khong") & " " & GetVietnameseWord("tram") & " " & GetVietnameseWord("nghin")
    End If
    
    If donViSo > 0 Then
        If Len(kq) > 0 Then kq = kq & " "
        kq = kq & DocSo3ChuSoVi(CInt(donViSo), (ty > 0 Or trieu > 0 Or nghin > 0))
    End If
    
    If isNegative Then
        kq = GetVietnameseWord("am") & " " & kq
    End If
    
    If Len(kq) > 0 Then
        kq = UCase(Left(kq, 1)) & Mid(kq, 2)
    End If
    
    DocSoNguyenVi = Trim(kq)
    Exit Function
    
ErrorHandler:
    DocSoNguyenVi = "#ERROR#"
End Function

' =====================================================
' PRIVATE FUNCTIONS - English helpers (hidden from Excel)
' =====================================================

Private Function GetOnes() As Variant
    GetOnes = Array("", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", _
                    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", _
                    "seventeen", "eighteen", "nineteen")
End Function

Private Function GetTens() As Variant
    GetTens = Array("", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety")
End Function

Private Function ConvertUnder100(ByVal num As Integer) As String
    Dim ones As Variant, tens As Variant
    Dim result As String
    
    ones = GetOnes()
    tens = GetTens()
    
    If num < 20 Then
        result = ones(num)
    Else
        result = tens(num \ 10)
        If num Mod 10 > 0 Then
            result = result & "-" & ones(num Mod 10)
        End If
    End If
    
    ConvertUnder100 = result
End Function

Private Function ConvertUnder1000(ByVal num As Integer, Optional ByVal needAnd As Boolean = False) As String
    Dim hundreds As Integer, remainder As Integer
    Dim ones As Variant
    Dim result As String
    
    ones = GetOnes()
    hundreds = num \ 100
    remainder = num Mod 100
    
    If hundreds > 0 Then
        result = ones(hundreds) & " hundred"
        If remainder > 0 Then
            result = result & " " & ConvertUnder100(remainder)
        End If
    Else
        If needAnd And remainder > 0 Then
            result = "and " & ConvertUnder100(remainder)
        Else
            result = ConvertUnder100(remainder)
        End If
    End If
    
    ConvertUnder1000 = result
End Function

Private Function DocSoNguyenEn(ByVal number As Variant) As String
    Dim num As Double
    Dim isNegative As Boolean
    Dim billions As Long, millions As Long, thousands As Long, remainder As Long
    Dim result As String
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(number) Or number = "" Then
        DocSoNguyenEn = ""
        Exit Function
    End If
    
    num = CDbl(number)
    
    If num < 0 Then
        isNegative = True
        num = Abs(num)
    End If
    
    num = Fix(num)
    
    If num = 0 Then
        DocSoNguyenEn = "zero"
        Exit Function
    End If
    
    billions = Fix(num / 1000000000#)
    num = num - billions * 1000000000#
    
    millions = Fix(num / 1000000)
    num = num - millions * 1000000
    
    thousands = Fix(num / 1000)
    remainder = Fix(num - thousands * 1000)
    
    result = ""
    
    If billions > 0 Then
        result = ConvertUnder1000(CInt(billions)) & " billion"
    End If
    
    If millions > 0 Then
        If Len(result) > 0 Then result = result & " "
        result = result & ConvertUnder1000(CInt(millions)) & " million"
    End If
    
    If thousands > 0 Then
        If Len(result) > 0 Then result = result & " "
        result = result & ConvertUnder1000(CInt(thousands)) & " thousand"
    End If
    
    If remainder > 0 Then
        If Len(result) > 0 Then
            If remainder < 100 Then
                result = result & " and " & ConvertUnder1000(CInt(remainder))
            Else
                result = result & " " & ConvertUnder1000(CInt(remainder))
            End If
        Else
            result = ConvertUnder1000(CInt(remainder))
        End If
    End If
    
    If isNegative Then
        result = "negative " & result
    End If
    
    If Len(result) > 0 Then
        result = UCase(Left(result, 1)) & Mid(result, 2)
    End If
    
    DocSoNguyenEn = Trim(result)
    Exit Function
    
ErrorHandler:
    DocSoNguyenEn = "#ERROR#"
End Function
