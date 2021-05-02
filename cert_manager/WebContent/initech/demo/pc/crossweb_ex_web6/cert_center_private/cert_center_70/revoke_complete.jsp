<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="java.io.*,java.util.*,java.lang.*,java.net.URLDecoder"%>
<%@ include file="import/iniplugin_init.jsp" %>
<% m_How = "certRevoke"; %>
<%@ include file="import/inica70_init.jsp" %>
<%@ include file="import/inica70_db_check.jsp" %>
<%@ include file="import/inica70_ca_send.jsp" %>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="Progma" content="no-cache">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>인증서 폐기</title>
<link rel="stylesheet" type="text/css" href="/initech/demo/common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="/initech/demo/common/style/initech_demo_ui.css">
<script type="text/javascript" src="/initech/demo/common/script/jquery-1.11.3.min.js"></script>

<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?dt=20170523"></script>

<script type="text/javascript">
	window.onload = function() {
		
		var UserCert;       
		<%=m_caCertString%>

		INIWEBEX.deleteUserCert({
			cert: UserCert,	
			processCallback: "DeleteUserCertCallback",
			isHtml5 : <%=m_html5%>
		});
	};

	function DeleteUserCertCallback(result){
		if(result){
			alert("인증서 삭제가 완료되었습니다.");
		}else{
			alert("보안상의 문제로 실패했습니다");
		}
		parent.document.location.reload();
	}
</script>
</head>

<body>
<!-- skip navigation start -->
<div class="skip-navi">
	<a href="#content">본문 바로가기</a>
</div>
<!-- skip navigation end -->

<!-- wrapper start -->
<div class="ini-demo-wrapper">
	<!-- header start -->
	<header>
		<h1 class="sr-only">이니텍</h1>
	</header>
	<!-- header end -->
	<!-- main start -->
	<main class="ini-demo-container">
		<!-- local navigation start -->
		<jsp:include page="../../menu.jsp" />
		<!-- local navigation end -->
		<!-- contents wrapper start -->
		<section class="ini-demo-contents-wrapper" id="content">
			<!-- contents start -->
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="/initech/demo/common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<h2 class="ini-demo-title">인증서 폐기</h2>
				<div class="panel panel-default">
					<div class="panel-heading">
						<div class="ini-demo-msg text-center">
						<span class="icon check"><img src="/initech/demo/common/images/ico_check.png" alt=""></span>
						<p><b><%=m_ID%>님의 인증서가 성공적으로 폐기 되었습니다.</b></p>
						</div>
					</div>
				</div>
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onclick="javascript:goPage('401'); return false;">신규발급/재발급</button>
<!-- 					<button type="button" class="btn btn-primary btn-lg hidden-xs">INISAFE CROSS WEB EX 발급</button> -->
				</div>
			</div>
			<!-- contents end -->
		</section>
		<!-- contents wrapper end -->
	</main>
	<!-- main end -->
	<!-- footer end -->
	<footer class="ini-demo-footer">
		<div class="inner-wrap"><p>Copyright 2016. INITECH. ALL RIGHTS RESERVED</p></div>
	</footer>
	<!-- footer end -->
</div>
<!-- wrapper end -->
<!-- script -->
<script src="/initech/demo/common/script/bootstrap.min.js"></script>
<script src="/initech/demo/common/script/css_browser_selector.min.js"></script> <!-- 브라우저 식별 -->
<script src="/initech/demo/common/script/initech_demo_ui.js"></script> <!-- ui 관련 커스텀 -->
</body>
</html>
