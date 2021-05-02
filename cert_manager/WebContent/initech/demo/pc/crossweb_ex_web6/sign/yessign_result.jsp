<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- 공통 관련 -->
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.security.cert.X509Certificate" %>

<!-- 이니텍 관련 -->
<%@ page import="com.initech.core.util.StringUtil"%>
<%@ page import="com.initech.iniplugin.*" %>
<%@ page import="com.initech.inisafesign.*" %> 
<%@ page import="com.initech.inisafesign.exception.*" %>
<%@ page import="com.initech.core.util.Base64Util"%>
<%@ page import="com.initech.iniplugin.vid.*" %>
<%@ page import="com.initech.ocspcd.OCSPCD"%>
<%@ page import="com.initech.ocspcd.OCSPCDException"%>

<!--
<@ page import="com.initech.pkix.ocsp.OCSPException"%>
<@ page import="com.initech.pkix.ocsp.OCSPManager"%>
<@ page import="com.initech.pkix.ocsp.SingleResponse"%>
-->

<!-- 공통 Path 로드 -->
<%@ include file="../top_path.jsp"%>
<!-- 공통 Path 로드 End -->

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>이니텍 공인인증서 데모</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->
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
		<jsp:include page="../menu.jsp" />
		<!-- contents wrapper start -->
		<section class="ini-demo-contents-wrapper" id="content">
			<!-- contents start -->
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<div class="ini-demo-transfer">
					<h2 class="ini-demo-title">당행&middot;타행이체</h2>
					<p class="ini-demo-subtitle"><span class="ini-step"><span>1<span class="sr-only">단계 </span></span><span class="on">2<span class="sr-only">단계 선택됨</span></span></span></p>
					<br>
			<%
			  	String orgData = "";
				String regDate = "";
				String dateTime = "";
				String DATEFORMATData = "yyyyMMddHHmmssSSS";
				//VID 검증
				boolean vidResult = false;
				String vidResultData = null;
				// 인증서 데이터
				X509Certificate cert = null;
				// 검증 결과
				boolean result = false;
				String errMsg = null;
			
				//전자서명 데이터 추출
				String SignedDataWithBase64 = request.getParameter("PKCS7SignedData");
				
				
				//System.out.println("-------------------------------------------------");
				//System.out.println(SignedDataWithBase64);
				//System.out.println("-------------------------------------------------");

				try {		    	

			    	INISAFESign signer2 = new INISAFESign(SignedDataWithBase64, SIGN_CONF_PATH);
					String yesP7 = signer2.addContentType(SignedDataWithBase64);
					
					// INISAFE Sign 초기화
			      	INISAFESign signer = new INISAFESign(yesP7, SIGN_CONF_PATH);
			      	  	
				  	// 전자서명 검증 
			      	// signer.verify(false);
					signer.verifyPKCS7();					
													      					
			      	orgData = URLDecoder.decode(signer.getData(),"UTF-8");

					// 서명 날짜
		            regDate = signer.getSigningTime();
					result = true;
				
					System.out.println("==================================================");
					System.out.println("orgData : " + orgData);
					System.out.println("==================================================");
				} catch(Exception e) {
					errMsg = e.toString();
					e.printStackTrace();
				}
				
				if(result){
				%>
					<div class="dl-table bg">														
						<dl>
							<dt class="col-sm-2 col-xs-4">서명시간</dt>
							<dd class="col-sm-10 col-xs-8"><%= regDate %></dd>
						</dl>
						
						<dl>
							<dt class="col-sm-2 col-xs-4">서명원문</dt>
							<dd class="col-sm-10 col-xs-8"><%= orgData %></dd>
						</dl>
					</div>
					<br>
					<div class="panel panel-default">
						<div class="panel-heading">
							<div class="row">
								<p class="col-md-6">아래와 같은 내용으로 이체가 정상적으로 처리되었습니다.</p>
								<p class="col-md-2"></p> 								
							</div>
						</div>
					</div>
					<br>
					<p class="ini-demo-subtitle">전자서명 검증을 완료 하였습니다.</p>	
				</div>
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onclick="javascript:goPage('202'); return false;">계속 이체</button>
				</div>
				<%
				} else {
				%>
				<p class="txt"><b>이체가 실패하였습니다.</b></p>
				<br>
				<div class="dl-table bg">
					<dl>
						<dt class="col-sm-2 col-xs-4">에러 메세지</dt>
						<dd class="col-sm-10 col-xs-8"><%= errMsg %></dd>
					</dl>
				</div>
				<%} %>
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
<!-- script -->
<script src="../../../../demo/common/script/bootstrap.min.js"></script>
<script src="../../../../demo/common/script/css_browser_selector.min.js"></script> <!-- 브라우저 식별 -->
<script src="../../../../demo/common/script/initech_demo_ui.js"></script> <!-- ui 관련 커스텀 -->
</body>
</html>