Attribute VB_Name = "modMainFunctions"
Option Explicit

' =====================================================
' Module: modMainFunctions
' Description: Các hàm chính để sử dụng trong Excel
' Compatible: Microsoft 365 (32-bit và 64-bit)
' Author: Le Van An (@anlvdt)
' Version: 1.0.0
' =====================================================

' =====================================================
' HƯỚNG DẪN SỬ DỤNG / HOW TO USE
' =====================================================
' 1. DocSoVND_Vi(số)  - Đọc số tiền VND bằng tiếng Việt
'    Ví dụ: =DocSoVND_Vi(1234567)
'    Kết quả: "Một triệu hai trăm ba mươi bốn nghìn năm trăm sáu mươi bảy đồng"
'
' 2. DocSoVND_En(số)  - Đọc số tiền VND bằng tiếng Anh
'    Ví dụ: =DocSoVND_En(1234567)
'    Kết quả: "One million two hundred thirty-four thousand five hundred and sixty-seven Vietnamese dong"
'
' 3. DocSoUSD_Vi(số)  - Đọc số tiền USD bằng tiếng Việt
'    Ví dụ: =DocSoUSD_Vi(1234.56)
'    Kết quả: "Một nghìn hai trăm ba mươi bốn đô la Mỹ và năm mươi sáu xu"
'
' 4. DocSoUSD_En(số)  - Đọc số tiền USD bằng tiếng Anh
'    Ví dụ: =DocSoUSD_En(1234.56)
'    Kết quả: "One thousand two hundred and thirty-four dollars and fifty-six cents"
' =====================================================

' Đọc số tiền VND bằng tiếng Việt
' Read VND amount in Vietnamese
Public Function DocSoVND_Vi(ByVal soTien As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    DocSoVND_Vi = DocTienVND_TiengViet(soTien)
    Exit Function
    
ErrorHandler:
    DocSoVND_Vi = "#LỖI: " & Err.Description
End Function

' Đọc số tiền VND bằng tiếng Anh
' Read VND amount in English
Public Function DocSoVND_En(ByVal amount As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    DocSoVND_En = ConvertVND_ToEnglish(amount)
    Exit Function
    
ErrorHandler:
    DocSoVND_En = "#ERROR: " & Err.Description
End Function

' Đọc số tiền USD bằng tiếng Việt
' Read USD amount in Vietnamese
Public Function DocSoUSD_Vi(ByVal soTien As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    DocSoUSD_Vi = DocTienUSD_TiengViet(soTien)
    Exit Function
    
ErrorHandler:
    DocSoUSD_Vi = "#LỖI: " & Err.Description
End Function

' Đọc số tiền USD bằng tiếng Anh
' Read USD amount in English
Public Function DocSoUSD_En(ByVal amount As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    DocSoUSD_En = ConvertUSD_ToEnglish(amount)
    Exit Function
    
ErrorHandler:
    DocSoUSD_En = "#ERROR: " & Err.Description
End Function

' =====================================================
' HÀM BỔ SUNG / ADDITIONAL FUNCTIONS
' =====================================================

' Đọc số nguyên bằng tiếng Việt (không có đơn vị tiền)
' Read integer in Vietnamese (no currency unit)
Public Function DocSo_Vi(ByVal so As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    DocSo_Vi = DocSoNguyenTiengViet(so)
    Exit Function
    
ErrorHandler:
    DocSo_Vi = "#LỖI: " & Err.Description
End Function

' Đọc số nguyên bằng tiếng Anh (không có đơn vị tiền)
' Read integer in English (no currency unit)
Public Function DocSo_En(ByVal number As Variant) As String
    Application.Volatile False
    On Error GoTo ErrorHandler
    
    DocSo_En = ConvertIntegerToEnglish(number)
    Exit Function
    
ErrorHandler:
    DocSo_En = "#ERROR: " & Err.Description
End Function
