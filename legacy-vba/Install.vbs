' =====================================================
' DocSoThanhChu - One-Click Install Script
' No Admin Required | AV-Safe | Pure VBScript
' =====================================================

Option Explicit

Dim fso, shell, scriptDir, sourcePath, destPath, destFolder
Dim msg, title

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

title = "DocSoThanhChu Installer"

' Get script directory
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Source and destination paths
sourcePath = scriptDir & "\DocSoThanhChu.xlam"
destFolder = shell.ExpandEnvironmentStrings("%APPDATA%") & "\Microsoft\AddIns"
destPath = destFolder & "\DocSoThanhChu.xlam"

' Check if source file exists
If Not fso.FileExists(sourcePath) Then
    MsgBox "ERROR: DocSoThanhChu.xlam not found!" & vbCrLf & vbCrLf & _
           "Make sure this script is in the same folder as DocSoThanhChu.xlam", _
           vbCritical, title
    WScript.Quit 1
End If

' Create AddIns folder if not exists
If Not fso.FolderExists(destFolder) Then
    fso.CreateFolder(destFolder)
End If

' Copy file (overwrite if exists)
On Error Resume Next
fso.CopyFile sourcePath, destPath, True
If Err.Number <> 0 Then
    MsgBox "ERROR: Cannot copy file!" & vbCrLf & vbCrLf & _
           "Please close Excel first and try again." & vbCrLf & _
           "Error: " & Err.Description, vbCritical, title
    WScript.Quit 1
End If
On Error Goto 0

' Success message
msg = "=== INSTALL SUCCESS ===" & vbCrLf & vbCrLf
msg = msg & "DocSoThanhChu Add-in v1.1.0 installed!" & vbCrLf & vbCrLf
msg = msg & "NEXT STEPS:" & vbCrLf
msg = msg & "1. Open Excel" & vbCrLf
msg = msg & "2. File > Options > Add-ins" & vbCrLf
msg = msg & "3. Manage: Excel Add-ins > Go..." & vbCrLf
msg = msg & "4. Check 'DocSoThanhChu' > OK" & vbCrLf & vbCrLf
msg = msg & "FUNCTIONS:" & vbCrLf
msg = msg & "=VND_Vi(A1)  VND Vietnamese" & vbCrLf
msg = msg & "=VND_En(A1)  VND English" & vbCrLf
msg = msg & "=USD_Vi(A1)  USD Vietnamese" & vbCrLf
msg = msg & "=USD_En(A1)  USD English" & vbCrLf
msg = msg & "=So_Vi(A1)   Number Vietnamese" & vbCrLf
msg = msg & "=So_En(A1)   Number English" & vbCrLf & vbCrLf
msg = msg & "---" & vbCrLf
msg = msg & "Author: Le Van An (@anlvdt)" & vbCrLf
msg = msg & "Support: MB Bank 0360126996868"

MsgBox msg, vbInformation, title

' Clean up
Set fso = Nothing
Set shell = Nothing
