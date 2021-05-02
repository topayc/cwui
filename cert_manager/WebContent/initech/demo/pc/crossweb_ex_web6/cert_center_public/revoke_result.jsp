<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="java.util.Enumeration"%>
<%@ page import="java.util.Properties"%>
<%@ page import="java.util.HashMap"%>
<%@ page import="java.security.cert.X509Certificate" %>

<%@ page import="com.initech.core.x509.x509CertificateInfo" %>
<%@ page import="com.initech.iniplugin.*" %>
<%@ page import="com.initech.inisafesign.*" %> 
<%@ page import="com.initech.inisafesign.exception.*" %>

<%@ page import="com.initech.oppra.IniOPPRA"%>
<%@ page import="com.initech.oppra.util.OppraSendDataParser"%>
<%@ page import="com.initech.oppra.util.OppraMessageDataParser"%>
<%@include file="../top_path.jsp"%>
<%!
private final int requestCode = 40; //20 신규 발급 전문 //재발급 25 //갱신 28 //폐기 40 

//v5이상만. 01=KFTC, 02=OTHER
private String serviceProviderCode = "01";

private String refNum;
private String appCode;

private String requestMsg;
private String responseMsg;


private OppraMessageDataParser sendRA(HashMap raMsg, boolean isGatwayRa){
	IniOPPRA oppra = null;
	try {
		oppra = new IniOPPRA(IpAdd, raPort);
		oppra.setCharEncoding(RA_CHARTSET);
		
		OppraSendDataParser oppraSendDataParser = new OppraSendDataParser( requestCode, raMsg, true);
		requestMsg = oppraSendDataParser.getSendLastData();
	
		System.out.println("[RequestMsg] : "+ requestMsg );
		//Commucated with RA
		oppra.initialize(RA_CHARTSET);
		responseMsg = oppra.requestRAW( requestMsg );
		System.out.println("[ResponseMsg] : "+ responseMsg );
		
		return new OppraMessageDataParser( requestCode, oppra.getResDataPart() );
		
	}catch(Exception e){
		e.printStackTrace();
	}finally{
		if(oppra!=null) try{ oppra.close(); }catch(Exception e){}
	}
	
	return null;
}

private HashMap constructMsg(HttpServletRequest request, String certSerialNo) throws Exception{
	
	String CERTPOLICY  = request.getParameter("certpolicy"); //개인/범용
	String CACODE = request.getParameter("cacode");
	System.out.println("CACODE : " + CACODE);
	System.out.println("CERTPOLICY : " + CERTPOLICY);
	// CA 코드 값으로 RA Port를 정의 한다.
	initializeRaPort(CACODE);
	// 정책, 용도 구분
	//initializePolicy(CERTPOLICY);
	
	HashMap raMsg = new HashMap();
	
	raMsg.put("MANAGERID", "InitechDemo"); // 운영자아아디. OPTIONAL 속성
	raMsg.put("SERVICEPROVIDER", "01"); //01:금결원OPP(또는 범용게이트웨이), 02:타기관직접연동
	raMsg.put("CACODE", CACODE); //01:금결원 02:SignKorea 03:전자인증
	raMsg.put("CERTCODE", CERTPOLICY); //01:개인범용  02:기업범용  04:개인(은행/보험)  05:기업범용
	raMsg.put("CERTSERIAL", certSerialNo); //구분자코드 1: 시리얼, 2:가입자 ID, 3: 주민 사업자 번호 
	raMsg.put("SERVICECODE", "30"); // 구분자코드에 대한 값
	if ( CACODE.equals("01") ) {
		// 아래 필드는 Yessign 연동 시 필수 설정
		raMsg.put("STATISTICSCODE", "InitechDemo"); //for Advance version
	} else if ( CACODE.equals("05") ) {
		//아래 필드는 SignGate 연동 시 필수 설정.
		raMsg.put("STATISTICSCODE", "000386");
		raMsg.put("RESERVATION5", "0");
	}
	
	return raMsg;
}
%>
<%
String CACODE  = request.getParameter("cacode");
String CERTPOLICY  = request.getParameter("certpolicy");

String sRESCODE = null;
String sRESMSG = null;

String ErrorCode = null;
String ErrorMessage = null;

//RA시스템에 전송할 요청전문을 만듬. v5 인가 아닌가에 따라 다름.
String requestMsg = "";
String responseMsg = "";

String HexCertSerial = "";

IniOPPRA oppra = null;
String CertSerialNo = "";
OppraMessageDataParser oppMsg = null;
try {
	String SignedDataWithBase64 = request.getParameter("PKCS7SignedData");
	INISAFESign signer =  new INISAFESign(SignedDataWithBase64, SIGN_CONF_PATH);
	signer.verify(true);
	boolean signRes = signer.verifyPKCS7();
	System.out.println("PKCS7 verify : " + signRes);
	
	X509Certificate certX509 = signer.getCertificate();
	
	
	CertSerialNo = certX509.getSerialNumber().toString(10);
	CertSerialNo = "0" + CertSerialNo;
	
	HexCertSerial = certX509.getSerialNumber().toString(16);
	System.out.println("-A Decimal : " + CertSerialNo);
	System.out.println("-B Hex Serial : " + HexCertSerial);
	
	
	session.setAttribute("CAName", caName);
	session.setAttribute("serialNO", CertSerialNo);
	
	//v5 인 경우 OppraSendDataParser에 의해서 전문을 생성해냄.
	//boolean isGatewayRA = ("GATEWAY_RA".equals(request.getParameter("ra_system")) ? true : false);
	
	HashMap raMsg = constructMsg(request, CertSerialNo);
	// 03. 요청
	oppra = new IniOPPRA(IpAdd, raPort);

	OppraSendDataParser oppraSendDataParser = new OppraSendDataParser( requestCode , raMsg, false);
	requestMsg = oppraSendDataParser.getSendLastData();

	System.out.println("[RequestMsg] : "+ requestMsg );
	//Commucated with RA
	oppra.initialize(RA_CHARTSET);
	responseMsg = oppra.requestRAW( requestMsg );
	System.out.println("[ResponseMsg] : "+ responseMsg );
	
	oppMsg = new OppraMessageDataParser( requestCode, oppra.getResDataPart() );

} catch(Exception ex) {
	ErrorCode = "999";
	ErrorMessage = ex.getMessage();
	ex.printStackTrace();
	System.out.println("Exception:[" + ex.getMessage() + "]");
} finally {
	try {
		oppra.close();
	} catch(Exception e) {
	}
}
%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>공인인증서 폐기 완료</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->

<script type="text/javascript">
var $j	=	jQuery.noConflict();
var TNK_SR = '';
</script>
<script type="text/javascript" src="/SW/vender/TouchEn/nxKey/js/TouchEnNx.js?dt=20170523"></script>
<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?dt=20170523"></script>

<script type="text/javascript">
window.onload = function() {
	
	if (typeof TouchEnKey_installpage != "string" && useTouchEnnxKey){
		TK_Loading();
	}else{
		/**
		 * 키보드보안 미지원 OS 또는 브라우저입니다. 가상키패드 사용 Default로 변경 필요합니다.
		 * 가상키패드 제품이 없을 경우 안내 페이지로 이동하여 브라우저 업데이트 또는 타 OS사용 권장이 필요합니다.
		**/
	}
};
</script>
<script type="text/javascript">
function CertProcessRevoke(caName, serial) {
	var frm = document.readForm;
	var isHtml5 = frm.isHtml5.checked;
		
	INIWEBEX.revokeCertificate({
		processCallback	: "CertProcessResult",			// 콜백함수
		isHtml5			: isHtml5,		 				// HTML5 UI 사용 여부 (true : 사용, false : CS UI사용)
		caName			: caName,
		serial			: serial
	});
		
		
	//RevokeCertificate(caName, serial, "CertProcessResult", isHtml5);
}

function CertProcessResult(result) {
	if (result == "true" || result == "TRUE") {
		var frm = document.getElementById("readForm");
		document.readForm.menuNum.value = "404";
		frm.submit();
	} else {
		return false;
	}
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
		<jsp:include page="../menu.jsp" />
		<!-- local navigation end -->
		<!-- contents wrapper start -->
		<section class="ini-demo-contents-wrapper" id="content">
			<!-- contents start -->
			<form name="readForm" id="readForm" method="POST" action="./revoke_complete.jsp" onSubmit="return false;">
			<input type="hidden" id="menuNum" name="menuNum" value="<%= request.getParameter("menuNum") %>"/>
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<h2 class="ini-demo-title">공인인증서 폐기</h2>
				<div>
					<table class="table">
						<caption>공인인증서 폐기완료를 결과 항목, 내용으로 나타낸 표</caption>
						<colgroup>
							<col style="width:30%">
							<col style="">
						</colgroup>
						<thead>
							<tr>
								<th scope="col">결과 항목</th>
								<th scope="col">내용</th>
							</tr>
						</thead>
						<tbody>
							<%
							boolean issueResult = true;
				            String responseCode = oppMsg.getCodeData("RESCODE");
			
				            if("000".equals(responseCode)){
				            %>
				            <tr>
								<td>처리 코드</td>
								<td class="text-left"><%= responseCode %></td>
							</tr>
							<tr>
								<td>처리 메세지</td>
								<td class="text-left">공인인증서 폐기 처리가 완료 되었습니다.</td>
							</tr>
							<%
				            }else{
			            		issueResult = false;
				            %>
				            <tr>
				            	<td><b>에러코드</b></td>
				            	<td class="text-left"><%= responseCode %></td>
				            </tr>
				            <tr>
				            	<td><b>에러메시지</b></td>
				            	<td class="text-left"><%= oppMsg.getCodeData("RESMSG") %></td>
				            </tr>
				            <tr>
				            	<td><b>상세 에러코드</b></td>
				            	<td class="text-left"><%= oppMsg.getCodeData("ADDRESCODE") %></td>
				            </tr>
				            <tr>
				            	<td><b>상세 에러메시지</b></td>
				            	<td class="text-left"><%= oppMsg.getCodeData("ADDRESMSG") %></td>
				            </tr>
				            <%}%>
						</tbody>
					</table>
				</div>
<%-- 				<%if(issueResult){%> --%>
					<h3 class="ini-demo-subtitle">Option 설정</h3>
					<div class="dl-table">
						<dl>
							<dt class="col-sm-3 col-xs-3"><label for="input8">HTML5 사용</label></dt>
							<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5"  /> (※ 체크 시 HTML5 UI 사용)</label></dd>
						</dl>
					</div>
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onclick="CertProcessRevoke('<%=caName%>','<%=HexCertSerial%>'); return false;">폐기된 인증서 삭제</button>
					<!--button type="button" class="btn btn-primary btn-lg hidden-xs" onclick="CertProcessRevoke('<%=caName%>','<%=HexCertSerial%>'); return false;">INISAFE CROSS WEB EX 폐기된 인증서 삭제</button-->
				</div>
<%-- 				<%} %> --%>
			</div>
			</form>
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
<script src="../../../../demo/common/script/bootstrap.min.js"></script>
<script src="../../../../demo/common/script/css_browser_selector.min.js"></script> <!-- 브라우저 식별 -->
<script src="../../../../demo/common/script/initech_demo_ui.js"></script> <!-- ui 관련 커스텀 -->
</body>
</html>