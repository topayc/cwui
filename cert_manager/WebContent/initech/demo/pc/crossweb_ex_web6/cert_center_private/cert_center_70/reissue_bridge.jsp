<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*,java.lang.*,java.net.URLDecoder,java.net.URLEncoder"%>
<%@ include file="import/iniplugin_init.jsp" %>
<% m_How = "certRevokeAndNew"; %>
<%@ include file="import/inica70_init.jsp" %>
<%@ include file="import/inica70_db_check.jsp" %>
<%@ include file="import/inica70_ca_send.jsp" %>

<html>
<head>
	<title>인증서 재발급</title>	
	<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
	<meta http-equiv="Progma" content="no-cache">
	<script type="text/javascript">
	   var TNK_SR = '';
	</script>
	<script type="text/javascript" src="/SW/vender/TouchEn/nxKey/js/TouchEnNx.js?dt=20170523"></script>
	<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?dt=20170523"></script>

	<script type="text/javascript">
	window.onload = function() {
		
		if (typeof TouchEnKey_installpage != "string" && useTouchEnnxKey){
			TK_Loading();
			
			INIWEBEX.setProperty({
				name: "SetBitPKCS10CertRequest",	
				value: <%=m_keybits%>,
				processCallback: "",
				isHtml5 :<%=m_html5%>
			});
		
			INIWEBEX.requestCert({
				frm: sendForm,	
				processCallback: "CertRequestCallback",
				isHtml5 : <%=m_html5%>
			});
				
		}else{
			/**
			 * 키보드보안 미지원 OS 또는 브라우저입니다. 가상키패드 사용 Default로 변경 필요합니다.
			 * 가상키패드 제품이 없을 경우 안내 페이지로 이동하여 브라우저 업데이트 또는 타 OS사용 권장이 필요합니다.
			**/
		}
	};
	
	function CertRequestCallback(result) {
		
		if(result){
			document.sendForm.submit();
		}else{
			alert("인증서 발급 중 오류가 발생하였습니다.")
		}
	}
	

	</script>
</head>

<form name=sendForm method=POST action='./reissue_complete.jsp'>
	<input type=hidden name=user_id value="<%=URLEncoder.encode(m_ID,"UTF-8")%>">
	<input type=hidden name=DeptName value="<%=URLEncoder.encode(m_O,"UTF-8")%>">
	<input type=hidden name=PartName value="<%=URLEncoder.encode(m_OU,"UTF-8")%>">
	<input type=hidden name=UserName value="<%=URLEncoder.encode(m_CN,"UTF-8")%>">
	<input type=hidden name=EMAIL value="<%=m_MAIL%>">
	<input type=hidden name=keybits value="<%=m_keybits%>">
	<input type=hidden name=req value="">
	<input type=hidden name=challenge value="1111">	
	<input type=hidden name=strHtml5 value="<%=m_html5%>">	
	
</form>
</body>
</html>
