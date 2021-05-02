<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- 공통 관련 -->
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.security.cert.X509Certificate" %>
<!-- 이니텍 관련 -->
<%@ page import="com.initech.inisafesign.*" %> 
<%@ page import="com.initech.inisafesign.exception.*" %>
<%@ page import="com.initech.oppra.*" %>
<%@ page import="com.initech.oppra.util.*" %>
<!-- 공통 Path 로드 -->
<%@ include file="../top_path.jsp"%>
<!-- 공통 Path 로드 End -->

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="euc-kr">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>이니텍 공인인증서 데모</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">
<!--[if lt IE 9]>
	<script src="../../common/script/html5.js"></script>
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
					<h2 class="ini-demo-title">로그인</h2>
			<%
			
			  	String orgData = "";
				String regDate = "";
				String dateTime = "";
				String DATEFORMATData = "yyyyMMddHHmmssSSS";
				
				//VID 검증
				String vidResult = "";
				String vidResultData = null;
				
				// 인증서 데이터
				X509Certificate cert = null;
				
				// 검증 결과
				boolean result = false;
				String errMsg = null;
			
				//전자서명 데이터 추출
				String SignedDataWithBase64 = request.getParameter("PKCS7SignedData");
			
			
			//System.out.println("      pkcs#7    ");
			//System.out.println(SignedDataWithBase64);
			//System.out.println("      pkcs#7    ");			
				
                //인증서 폐기 여부
				String certInfo = "";
                
				INISAFESign signer=null;
							
				try {
			    	//1. INISAFE Sign 초기화

				  	signer =  new INISAFESign(SignedDataWithBase64, SIGN_CONF_PATH);
				  	
				  	//2. 전자서명 검증 **/
				  	signer.verify();
					
					result = true;					
			   
				   //3.서명데이터에서 사용자 인증서 추출
				   cert = signer.getCertificate();      
				  
				}catch(SignCertificateException e) {
					errMsg = "인증서가 만료되었거나 유효하지 않은 인증서입니다. ["+e.getMessage()+"]";
					e.printStackTrace();
				}catch(Exception e) {
					errMsg = "서명검증에 실패하였습니다. ["+e.getMessage()+"]";
					e.printStackTrace();
				}	
												
				
				//4. 인증서 폐기여부 확인
                //50번 전문
				
				if(result){
				%>
					<p class="txt"><b>인증 되었습니다.</b></p>
					<br>
					<div class="dl-table bg">
						<dl>
							<dt class="col-sm-2 col-xs-4">사용자 인증서의 발급자(IssuerDN)</dt>
							<dd class="col-sm-10 col-xs-8"><%= cert.getIssuerDN().toString() %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">사용자 인증서 주체(SubjectDN)</dt>
							<dd class="col-sm-10 col-xs-8"><%= cert.getSubjectDN().toString() %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">사용자 인증서 시리얼번호</dt>
							<dd class="col-sm-10 col-xs-8"><%= cert.getSerialNumber() %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">인증서 폐기여부 확인 결과</dt>
							<dd class="col-sm-10 col-xs-8"></dd>
						</dl>
					</div>
					<br>
					
				</div>

				<%
				} else {
				%>
				<p class="txt"><b>인증에 실패하였습니다.</b></p>
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