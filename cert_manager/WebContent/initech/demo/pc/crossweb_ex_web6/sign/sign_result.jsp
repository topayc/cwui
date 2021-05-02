<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!-- 공통 관련 -->
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.security.cert.X509Certificate" %>
<!-- 이니텍 관련 -->
<%@ page import="com.initech.inisafesign.*" %> 
<%@ page import="com.initech.inisafesign.exception.*" %>
<%@ page import="com.initech.iniplugin.vid.*" %>
<%@ page import="com.initech.iniplugin.oid.CertOIDUtil "%>
<%@ page import="com.initech.iniplugin.oid.OIDException" %>
<!-- CRL용SDK -->
<%@ page import="com.initech.iniplugin.crl.*" %>
<%@ page import="com.initech.iniplugin.crl.exception.*" %>
<!-- OCSPCD 데몬 연결을 위한 SDK -->
<%@ page import="com.initech.ocspcd.OCSPCD" %>
<%@ page import="com.initech.ocspcd.OCSPCDException" %>

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
					<h2 class="ini-demo-title">전자서명</h2>
			<%
			  	String orgData = "";
				String regDate = "";
				String dateTime = "";
				String DATEFORMATData = "yyyyMMddHHmmssSSS";
				//VID 검증
				String vidResult = "";
				//OID검증
				String oidResult = "";
                //인증서 폐기 여부
				String certInfo = "해당없음";
				// 인증서 데이터
				X509Certificate cert = null;
				// 검증 결과
				boolean result = false;
				String errMsg = null;
				
				INISAFESign signer=null;
			
				//전자서명 데이터 추출
				String SignedDataWithBase64 = request.getParameter("PKCS7SignedData");
 				String juminNO = request.getParameter("juminNO");
				String chkvid = request.getParameter("chkvid");
				
				try {
			    	//1. INISAFE Sign 초기화
			      	signer = new INISAFESign();								  	
				  	signer =  new INISAFESign(SignedDataWithBase64, SIGN_CONF_PATH);
					
					System.out.println("p7:"+SignedDataWithBase64);
				  	
				  	//2. 전자서명 검증 	
					if(chkvid.equals("1")){
						signer.verify(true); //인증서 제출시점에 PKCS7SignVIDData 함수 사용시(서명검증+본인확인)
					}else{
						signer.verify();   //인증서 제출시점에 PKCS7SignedData 함수 사용시(서명검증만)
					}
					result = true;
									
					// 서명에 사용된 원본데이터
				  orgData = URLDecoder.decode(signer.getData(),"UTF-8");
				// orgData = signer.getData();

				  // 서명 날짜
				  regDate = signer.getSigningTime();
			   
				  //(PKCS7 서명데이터에서 사용자 인증서 추출
				  cert = signer.getCertificate();      
	  					
				}catch(SignCertificateException e) {
					errMsg = "인증서가 만료되었거나 유효하지 않은 인증서입니다. ["+e.getMessage()+"]";
					e.printStackTrace();
				}catch(Exception e) {
					errMsg = "서명검증에 실패하였습니다. ["+e.getMessage()+"]";
					e.printStackTrace();
				}	
				
				// 인증서 제출시점에 PKCS7SignVIDData 함수 사용 시 본인확인 절차 수행
				if(chkvid.equals("1")){
					try{ 
						//3. 본인확인 검증 
						if((juminNO != null) && (juminNO.trim().length()>0)){
						
							byte[] rnd = signer.getPrivatekeyRandom();
							if(rnd != null) {
								String strR = new String(rnd, 0, rnd.length);;
					   
								if((signer.CheckVID(cert, juminNO, rnd)) == true) {
									vidResult = "본인확인에 성공하였습니다";
								}else{
									vidResult = "본인확인에 실패하였습니다";
								}
							} else {
								vidResult = "본인확인에 필요한 PrivatekeyRandom 값이 없습니다.";
							}
						
						}else{
							vidResult = "본인확인에 필요한 식별번호(주민번호 또는 사업자번호) 값이 없습니다.";
						}					
						
					} catch(Exception e) {
						vidResult = "본인확인에 실패하였습니다 ["+e.getMessage()+"]";
						e.printStackTrace();
					}
				}
				
				try{
					//4. OID 검증
					CertOIDUtil cou = new CertOIDUtil(OID_CONF_PATH);
					if (cou.checkOID(cert) == true) {
						oidResult="OID검증에 성공하였습니다.";
					} 					
				} catch(Exception e) {
					oidResult = "OID검증에 오류가 발생하였습니다. ["+e.getMessage()+"]";
					e.printStackTrace();
				}
				
				//5. 인증서 폐기여부 확인
				// OCSPCD SDK for Java를 사용하여 OCSP또는 CRL검증을 하는 경우
				/*
				try {
		
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
	            
				/* CRL SDK for Java를 사용하여 CRL검증을 하는 경우 */
				/*
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
				
				if(result){
				%>
					<p class="txt"><b>인증 되었습니다.</b></p>
					<br>
					<div class="dl-table bg">
					<% if(vidResult.equals("")){
						vidResult ="해당없음";
					}					
					%>
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
							<dt class="col-sm-2 col-xs-4">서명시간</dt>
							<dd class="col-sm-10 col-xs-8"><%= regDate %></dd>
						</dl>
						
						<dl>
							<dt class="col-sm-2 col-xs-4">서명원문</dt>
							<dd class="col-sm-10 col-xs-8"><%= orgData %></dd>
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
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onclick="javascript:goPage('201'); return false;">계속 이체</button>
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
<!-- script -->
<script src="../../../../demo/common/script/bootstrap.min.js"></script>
<script src="../../../../demo/common/script/css_browser_selector.min.js"></script> <!-- 브라우저 식별 -->
<script src="../../../../demo/common/script/initech_demo_ui.js"></script> <!-- ui 관련 커스텀 -->
</body>
</html>