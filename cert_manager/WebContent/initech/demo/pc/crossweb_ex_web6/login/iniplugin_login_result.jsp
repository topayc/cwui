<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- 공통 관련 -->
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.net.*" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.security.cert.X509Certificate" %>
<!-- 이니텍 관련 -->
<%@ page import="com.initech.iniplugin.*" %>
<%@ page import="com.initech.inisafesign.*" %> 
<%@ page import="com.initech.inisafesign.exception.*" %>
<%@ page import="com.initech.iniplugin.vid.*" %>
<%@ page import="com.initech.iniplugin.oid.CertOIDUtil "%>
<%@ page import="com.initech.iniplugin.oid.OIDException" %>
<!-- 1. CRL용SDK -->
<%@ page import="com.initech.iniplugin.crl.*" %>
<%@ page import="com.initech.iniplugin.crl.exception.*" %>
<!-- 2.OCSPCD SDK for Java 데몬 연결을 위한 SDK -->
<%@ page import="com.initech.ocspcd.OCSPCD" %>
<%@ page import="com.initech.ocspcd.OCSPCDException" %>

<!-- 공통 Path 로드 -->
<%@ include file="../top_path.jsp"%>
<!-- INIpluginData 복호화를 위한 INISAFE Web초기화 -->
<%@ include file="../Init.jsp"%>

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
	
		//OID검증
		String oidResult = "";
		
		//인증서 폐기 여부
		String certInfo = "";
		
		String kordata = "";
		String userip = "";
		String usermac ="";
		
		if (m_IP.isClientAuth()) {
			result = true;
			cert = m_IP.getClientCertificate();
			String juminNO = m_IP.getParameter("juminNO");
			userip  = m_IP.getParameter("userip");
			usermac = m_IP.getParameter("usermac");
			
			//System.out.println("매체정보:"+m_IP.getParameter("INIS60_STORE"));
			//System.out.println("kordata:"+kordata);

			//본인확인 검증 
			try{
				String vid = m_IP.getVIDRandom();
				System.out.println("test : " + vid);
				IDVerifier idv = new IDVerifier();

				boolean vidCheck = idv.checkVID(cert, juminNO, vid.getBytes());
				System.out.println("iniplugin vid :"+vid);
				if(vidCheck) {
					vidResult = "본인확인에 성공하였습니다";
				}else{
					vidResult = "본인확인에 실패하였습니다";
				}
			
			}catch(Exception e){
				vidResult = "본인확인에 실패하였습니다 ["+e.getMessage()+"]";
				e.printStackTrace();
			}					
				
			//OID 검증	
			try{
				CertOIDUtil cou = new CertOIDUtil(OID_CONF_PATH);
				if (cou.checkOID(cert) == true) {
					oidResult="OID검증에 성공하였습니다.";
				} 					
			} catch(Exception e) {
				oidResult = "OID검증에 오류가 발생하였습니다. ["+e.getMessage()+"]";
				e.printStackTrace();
			}
				
			//인증서 폐기여부 확인
			/* OCSPCD SDK for Java를 사용하여 OCSP또는 CRL검증을 하는 경우 */
				
			/*try {
	
				OCSPCD ocspcd = new OCSPCD(OCSP_CONF_PATH);
				String status = ocspcd.requestRAW(cert); //OCSPCD로 OCSP를 사용할 경우(properties의 recodeFlag=0이어야 함)
				//String status = ocspcd.requestCRL(cert);   //OCSPCD로 CRL를 사용하는 경우(내부적으로 recodeFlag=8로 데몬에 요청함)
				String resCode = ocspcd.getResCode();

				if (status != null) {
					if (status.equals("10")){
					  certInfo += "유효한 인증서입니다.["+resCode+"]</b>";
					}else if(status.equals("20"))  {
						certInfo += "만료된인증서입니다.["+resCode+"]</b>";
					}else if(status.equals("30")) {
						certInfo += "폐기된 인증서입니다.["+resCode+"]</b>";
					}else if(status.equals("40")) {
						certInfo += "유효성 검사에 실패하였습니다.["+resCode+"]</b>";
					}else{
						 certInfo += "조회결과 [" + status + "] success !!!!!!";
					}
				} else {
					certInfo += "조회결과 [" + status + "] fail !!!!!!";
				}
			  

			} catch(Exception e) {
				certInfo = "OCSPCD 검증에 오류가 발생하였습니다. ["+e.getMessage()+"]";				
				e.printStackTrace();
			}*/
		
			/* CRL SDK for Java를 사용하여 CRL검증을 하는 경우
			try {
	   
				CheckCRL ccrl = new CheckCRL();
				ccrl.init(CRL_CONF_PATH);
				boolean returnFlag = ccrl.isValid(cert);  

				if(returnFlag){
					certInfo += "유효한 인증서입니다.["+returnFlag+"]</b>";
				}else{
					certInfo += "폐기된 인증서입니다.["+returnFlag+"]</b>";
				}

			}catch (Exception e) {
				certInfo = "CRL 검증에 오류가 발생하였습니다.["+e.getMessage()+"]";	
				e.printStackTrace();
			}
			*/
		}else{
			m_IniErrMsg ="인증서가 제출되지 않았습니다.";
		}
				if(result){
				%>
					<p class="txt"><b>인증 되었습니다.<%=kordata%></b></p>
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
							<dt class="col-sm-2 col-xs-4">본인확인 결과</dt>
							<dd class="col-sm-10 col-xs-8"><%= vidResult %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">OID검증 결과</dt>
							<dd class="col-sm-10 col-xs-8"><%= oidResult %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">인증서 폐기여부 확인 결과</dt>
							<dd class="col-sm-10 col-xs-8"><%= certInfo %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">사용자IP</dt>
							<dd class="col-sm-10 col-xs-8"><%= userip %></dd>
						</dl>
						<dl>
							<dt class="col-sm-2 col-xs-4">사용자Mac주소</dt>
							<dd class="col-sm-10 col-xs-8"><%= usermac %></dd>
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
						<dd class="col-sm-10 col-xs-8"><%= m_IniErrMsg %></dd>
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