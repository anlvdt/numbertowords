Attribute VB_Name = "modEnglishConverter"
Option Explicit

' =====================================================
' Module: modEnglishConverter
' Description: Convert numbers to English text
' Compatible: Microsoft 365 (32-bit and 64-bit)
' Author: Le Van An (@anlvdt)
' =====================================================

Private Const VND_UNIT = "Vietnamese dong"
Private Const USD_UNIT = "dollars"
Private Const USD_CENTS = "cents"
Private Const USD_CENT = "cent"
Private Const USD_DOLLAR = "dollar"

' Array of ones
Private Function GetOnes() As Variant
    GetOnes = Array("", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", _
                    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", _
                    "seventeen", "eighteen", "nineteen")
End Function

' Array of tens
Private Function GetTens() As Variant
    GetTens = Array("", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety")
End Function

' Convert number under 100 to English
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

' Convert number under 1000 to English
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

' Convert integer to English text
Public Function ConvertIntegerToEnglish(ByVal number As Variant) As String
    Dim num As Double
    Dim isNegative As Boolean
    Dim billions As Long, millions As Long, thousands As Long, remainder As Long
    Dim result As String
    Dim parts() As String
    Dim partCount As Integer
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(number) Or number = "" Then
        ConvertIntegerToEnglish = ""
        Exit Function
    End If
    
    num = CDbl(number)
    
    ' Handle negative numbers
    If num < 0 Then
        isNegative = True
        num = Abs(num)
    End If
    
    ' Round to integer
    num = Fix(num)
    
    If num = 0 Then
        ConvertIntegerToEnglish = "zero"
        Exit Function
    End If
    
    ' Split into groups
    billions = Fix(num / 1000000000#)
    num = num - billions * 1000000000#
    
    millions = Fix(num / 1000000)
    num = num - millions * 1000000
    
    thousands = Fix(num / 1000)
    remainder = Fix(num - thousands * 1000)
    
    result = ""
    
    ' Billions
    If billions > 0 Then
        result = ConvertUnder1000(CInt(billions)) & " billion"
    End If
    
    ' Millions
    If millions > 0 Then
        If Len(result) > 0 Then result = result & " "
        result = result & ConvertUnder1000(CInt(millions)) & " million"
    End If
    
    ' Thousands
    If thousands > 0 Then
        If Len(result) > 0 Then result = result & " "
        result = result & ConvertUnder1000(CInt(thousands)) & " thousand"
    End If
    
    ' Remainder
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
    
    ' Add negative prefix
    If isNegative Then
        result = "negative " & result
    End If
    
    ' Capitalize first letter
    If Len(result) > 0 Then
        result = UCase(Left(result, 1)) & Mid(result, 2)
    End If
    
    ConvertIntegerToEnglish = Trim(result)
    Exit Function
    
ErrorHandler:
    ConvertIntegerToEnglish = "#ERROR#"
End Function

' Convert VND amount to English text
Public Function ConvertVND_ToEnglish(ByVal amount As Variant) As String
    Dim result As String
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(amount) Or amount = "" Then
        ConvertVND_ToEnglish = ""
        Exit Function
    End If
    
    result = ConvertIntegerToEnglish(Fix(CDbl(amount)))
    
    If result <> "#ERROR#" And result <> "" Then
        result = result & " " & VND_UNIT
    End If
    
    ConvertVND_ToEnglish = result
    Exit Function
    
ErrorHandler:
    ConvertVND_ToEnglish = "#ERROR#"
End Function

' Convert USD amount to English text
Public Function ConvertUSD_ToEnglish(ByVal amount As Variant) As String
    Dim integerPart As Double, decimalPart As Integer
    Dim result As String, centsResult As String
    Dim dollarUnit As String, centUnit As String
    
    On Error GoTo ErrorHandler
    
    If IsEmpty(amount) Or amount = "" Then
        ConvertUSD_ToEnglish = ""
        Exit Function
    End If
    
    integerPart = Fix(CDbl(amount))
    decimalPart = CInt(Round((CDbl(amount) - integerPart) * 100, 0))
    
    ' Determine singular/plural for dollars
    If integerPart = 1 Then
        dollarUnit = USD_DOLLAR
    Else
        dollarUnit = USD_UNIT
    End If
    
    result = ConvertIntegerToEnglish(integerPart)
    
    If result <> "#ERROR#" And result <> "" Then
        result = result & " " & dollarUnit
        
        If decimalPart > 0 Then
            ' Determine singular/plural for cents
            If decimalPart = 1 Then
                centUnit = USD_CENT
            Else
                centUnit = USD_CENTS
            End If
            
            centsResult = ConvertIntegerToEnglish(decimalPart)
            If centsResult <> "#ERROR#" And centsResult <> "" Then
                ' Lowercase first letter for cents
                centsResult = LCase(Left(centsResult, 1)) & Mid(centsResult, 2)
                result = result & " and " & centsResult & " " & centUnit
            End If
        End If
    End If
    
    ConvertUSD_ToEnglish = result
    Exit Function
    
ErrorHandler:
    ConvertUSD_ToEnglish = "#ERROR#"
End Function
