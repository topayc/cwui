<%
function WriteToFile(FileName, Contents, Append)
on error resume next

if Append = true then
   iMode = 8
else 
   iMode = 2
end if
set oFs = server.createobject("Scripting.FileSystemObject")
set oTextFile = oFs.OpenTextFile(FileName, iMode, True)
oTextFile.WriteLine Contents
oTextFile.Close
set oTextFile = nothing
set oFS = nothing

end function

%>

<%
'Set MyCrypt = Server.CreateObject("INIpluginSDK.INIpluginServer2.1")
Set MyCrypt = Server.CreateObject("INISAFEWebSDK.INISAFEWebSDKATL.1")
INIts = "__INIts__"

rand = Mycrypt.GetRand()

' replay attack using session
Session(INIts) = rand

' just for debugging
'WriteToFile "C:\initech\iniplugin\logs\time.log", "SessionID : " + Session.SessionID, True  
'WriteToFile "C:\initech\iniplugin\logs\time.log", "INIts : " + Session.Contents(INIts), True

Set MyCrypt = nothing

%>
<%=rand%>

