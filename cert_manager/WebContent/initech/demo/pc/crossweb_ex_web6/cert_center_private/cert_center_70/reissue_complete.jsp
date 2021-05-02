<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="java.io.*,java.util.*,java.lang.*,java.net.URLDecoder"%>
<%@ include file="import/iniplugin_init.jsp" %>
<% m_How = "certNew"; %>
<%@ include file="import/inica70_init.jsp" %>
<%@ include file="import/inica70_db_check.jsp" %>
<%@ include file="import/inica70_ca_send.jsp" %>

<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Progma" content="no-cache">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>사설 인증서 재발급</title>
<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?dt=20170523"></script>

<script type="text/javascript">
window.onload = function() {
	
	var UserCert;       
	<%=m_caCertString%>
	INIWEBEX.insertUserCert({
			cert: UserCert,	
			processCallback: "InsertUserCertCallback",
			isHtml5 : <%=m_html5%>
	});
};

function InsertUserCertCallback(result){
	if(!result){
		alert("발급된 인증서를 저장매체에 저장 중에 오류가 발생하였습니다.");
	}else{
		parent.document.location.reload();
	}
	
}
</script>
</head>

<body>
</body>
</html>
