<%@ page language="java" contentType="text/html;charset=utf-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.net.URLDecoder" %>
<!--  이니텍 관련 -->
<%@ page import="java.security.cert.X509Certificate" %>
<%@ page import="com.initech.iniplugin.*" %>
<%@ page import="com.initech.iniplugin.vid.*" %>
<%@ page import="com.initech.inisafesign.*" %>
<%@ page import="com.initech.inisafesign.exception.*" %>
<%@ page import="com.initech.util.Base64Util" %>

<%-- decEx.jsp로 변경하여서 정상적으로 동작하도록 합니다. --%>
<%@ include file ="/initech/demo6/include/Init.jsp"%>
<html>
<head>
	<title>popupForward.jsp</title>
	<meta http-equiv="Content-Type" content = "text/html; charset=utf-8">
	<meta http-equiv="Cache-control" content = "no-cache">
	<meta http-equiv="Pragma" content = "no-cache">
	<script type="text/javascript" src="/initech/extension/crosswebex6.js"></script>
	<script type="text/javascript" src="/TouchEn/nxKey/js/TouchEnNx.js"></script>
	<script type="text/javascript">
		cwOnloadDisable();
		window.onload = function() {
			cwInit("initCallback"); 
		};
		
		function initCallback(result){
			if(result){
				EncForm2(readForm, sendForm, function(result){
					if(result){
						sendForm.submit();
					}
				});
			}
		}
	</script>
<%
String forwardUrl = request.getParameter("iniForwardUrl");
if(forwardUrl == null || "".equals(forwardUrl)){
%>
	<script type="text/javascript">
		cwInit = function(){};
		alert("iniForwardUrl이 없습니다.");
	</script>
<%
}
%>
</head>
<body>
<form name="readForm" id="readForm">
<%
	String value = "";
	Enumeration enumlist = m_IP.getParameterNames();
	while(enumlist.hasMoreElements()){
		String name = (String)enumlist.nextElement();
		value = (String)m_IP.getParameter(name);
		if(!"INIpluginData".equals(name) && !"iniForwardUrl".equals(name)){
%>
	<input type="hidden" name="<%=name%>" value="<%=value%>">
<%
		}
	}
%>
</form>
<form name="sendForm" id="sendForm" method="post" action="<%= forwardUrl%>">
	<input type="hidden" name="INIpluginData">
</form>
</body>
</html>