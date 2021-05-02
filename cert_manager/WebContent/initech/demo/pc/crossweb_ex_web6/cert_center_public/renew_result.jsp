<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Properties"%>
<%@ page import="java.util.HashMap"%>

<%@ page import="com.initech.oppra.IniOPPRA"%>
<%@ page import="com.initech.oppra.util.OppraSendDataParser"%>
<%@ page import="com.initech.oppra.util.OppraMessageDataParser"%>
<%@include file="../top_path.jsp"%>
<%!
// v5이상만. 01=KFTC, 02=OTHER
private String serviceProviderCode = "01";

private String refNum;
private String appCode;

private String requestMsg;
private String responseMsg;

private OppraMessageDataParser sendRA(int requestCode, HashMap raMsg, boolean isGatwayRa){
	
	IniOPPRA oppra = null;
	try {
		// 01. RA 접속
		oppra = new IniOPPRA(IpAdd, raPort);
		oppra.setCharEncoding(RA_CHARTSET);
		
		// 02. 요청 메시지 생성
		OppraSendDataParser oppraSendDataParser = new OppraSendDataParser( requestCode , raMsg, isGatwayRa);
		this.requestMsg = oppraSendDataParser.getSendLastData();
		System.out.println(requestMsg);
		
		// 03. RA서버 요청
		oppra.initialize(RA_CHARTSET);
		this.responseMsg = oppra.requestRAW(requestMsg);
		System.out.println(responseMsg);
		
		return new OppraMessageDataParser( requestCode, oppra.getResDataPart() );
		
	}catch(Exception e){
		e.printStackTrace();
	}finally{
		if(oppra!=null) try{ oppra.close(); }catch(Exception e){}
	}
	
	return null;
}

private HashMap constructMsg(HttpServletRequest request){
	
	String USERCODE  = request.getParameter("usercode");
	String REGNO  = request.getParameter("regno");
	String CERTPOLICY  = request.getParameter("certpolicy"); //개인/범용
	String USERID  = request.getParameter("userid");
	String ORGNAME  = request.getParameter("orgname"); //법인명
	String DETAILNAME  = null;
	try{
		DETAILNAME = request.getParameter("detailname");
		DETAILNAME = new String(DETAILNAME.getBytes("8859_1"), "EUC-KR");
		
		USERID = request.getParameter("userid");
		USERID = new String(USERID.getBytes("8859_1"), "EUC-KR");
	}catch(Exception e){}
	
	String USERMAIL  = request.getParameter("usermail");
	String CACODE = request.getParameter("cacode");
	
	// CA 코드 값으로 RA Port를 정의 한다.
	initializeRaPort(CACODE);
	// 정책, 용도 구분
	initializePolicy(CERTPOLICY);
	
	HashMap raMsg = new HashMap();
	raMsg.put("MANAGERID", raUser); // 운영자아아디. OPTIONAL 속성
	raMsg.put("USERCODE", userCode); //가입자구분코드 "1" 개인   "2" 기업
	raMsg.put("OU_NAME", orgName); // 개인은 법인명이 OPTIONAL
	raMsg.put("CN_NAME", DETAILNAME); // 개인명, 법인/단체 세부명. "()"가 뒤에 포함되어야함. ex:) "홍길동()" 기업일 경우 "이니텍(INI)" ()안에 법인명이 들어감
	raMsg.put("IDNO", REGNO); //주민(사업자)등록번호
	raMsg.put("USERID", "IniDemo-"+USERID); //사이트아이디
	raMsg.put("SERVICEPROVIDER", serviceProviderCode); //01:금결원OPP(또는 범용게이트웨이), 02:타기관직접연동
	raMsg.put("CACODE", CACODE);
	raMsg.put("CERTCODE", CERTPOLICY); //01:개인범용  02:기업범용  04:개인(은행/보험)  05:기업범용
	raMsg.put("EMAIL", USERMAIL); //이메일
	raMsg.put("FAX", "02-6445-7040"); //팩스
	raMsg.put("POSTCODE", "152-050"); //우편번호
	raMsg.put("POSTADDR", "서울특별시 구로구 에이스하이엔드타워2차 11층"); //주소
	raMsg.put("PHONE", "02-6445-7200"); //전화
	
	if( CACODE.equals( "05" ) ){
		raMsg.put("STATISTICSCODE", "000386"); //for Advance version
	} else {
		raMsg.put("STATISTICSCODE", "InitechDemo"); //for Advance version
	}
	
	if( CACODE.equals( "05" ) ){
		raMsg.put("POSTCODE1", "152-050"); //우편번호
		raMsg.put("POSTADDR1", "서울특별시 구로구 에이스하이엔드타워2차 11층"); //주소
		raMsg.put("PHONE1", "02-6445-7200"); //전화
		raMsg.put("RESERVATION5", "0"); // 예약5
	}
	
	return raMsg;
}
%>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>공인인증서 갱신</title>
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
// 갱신
	function CertProcessRenew(caName) {
		var frm = document.readForm;
		var isHtml5 = frm.isHtml5.checked;
			
		INIWEBEX.updateCertificate({
			processCallback	: "CertProcessResult",			// 콜백함수
			isHtml5			: isHtml5,		 				// HTML5 UI 사용 여부 (true : 사용, false : CS UI사용)
			caName			: caName
		});
		
		//UpdateCertificate(caName, "CertProcessResult", isHtml5);
	}

	function CertProcessResult(result) {
		if(result){
			document.readForm.menuNum.value = "403";
			document.readForm.submit();
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
			<form name="readForm" id="readForm" method="POST" action="./renew_complete.jsp" onSubmit="return false;">
			<input type="hidden" id="menuNum" name="menuNum" value="<%= request.getParameter("menuNum") %>"/>
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<h2 class="ini-demo-title">공인인증서 갱신</h2>
				<div>
				<%
				boolean issueResult = true;
				int requestCode = 28; //20 신규 발급 전문 //재발급 25 //갱신 28
			
				OppraMessageDataParser oppMsg = null;
				try{
					// 01. Gateway RA Server / RA Server
					//boolean isGatewayRA = ("GATEWAY_RA".equals(request.getParameter("ra_system")) ? true : false);
					
					requestCode = Integer.parseInt(request.getParameter("reqcode"));
					System.out.println();
					System.out.println("reqcode : " + requestCode);
					// 02. 전문 생성
					HashMap raMsg = constructMsg(request);
					
					// 03. 요청
					oppMsg = sendRA(requestCode, raMsg, false);
					
					System.out.println("--CAName : " + caName);
					System.out.println("--CAIP : " + cmpCaIp);
					System.out.println("--CAPort : " + cmpCaPort);
					System.out.println("--IssueRefID : " + oppMsg.getCodeData("REFNUM"));
					System.out.println("--IssuePassword : " + oppMsg.getCodeData("APPCODE"));
					
					session.setAttribute("IssueRefID", oppMsg.getCodeData("REFNUM"));
					session.setAttribute("IssuePassword", oppMsg.getCodeData("APPCODE"));
					session.setAttribute("CAName", caName);
					session.setAttribute("CAIP", cmpCaIp);
					session.setAttribute("CAPort", cmpCaPort);
					
				}catch(Exception e){
					issueResult = false;
					e.printStackTrace();
				}
				%>
					<input type="hidden" name="reqcode" value="<%=requestCode%>"/>
					<table class="table">
						<caption>공인인증서 갱신을 위한 결과 항목, 내용 나타낸 표</caption>
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
						String responseCode = oppMsg.getCodeData("RESCODE");
			           	if("000".equals(responseCode)){
			           		refNum = oppMsg.getCodeData("REFNUM");
			           		appCode = oppMsg.getCodeData("APPCODE");
			            %>
							<tr>
								<td>처리 코드</td>
								<td class="text-left"><%= responseCode %></td>
							</tr>
							<tr>
								<td>처리 메세지</td>
								<td class="text-left">인증서 갱신을 완료 하였습니다.</td>
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
				<%if(issueResult){%>
				<h3 class="ini-demo-subtitle">Option 설정</h3>
				<div class="dl-table">
					<dl>
						<dt class="col-sm-3 col-xs-3"><label for="input8">HTML5 사용</label></dt>
						<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5"/> (※ 체크 시 HTML5 UI 사용)</label></dd>
					</dl>
				</div>
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onClick="CertProcessRenew('<%=caName %>')">Html5 공인인증서 갱신 저장</button>
					<!--button type="button" class="btn btn-primary btn-lg hidden-xs" onclick="CertProcessRenew('<%=caName %>', false)">INISAFE CROSS WEB EX 갱신 저장</button-->
				</div>
				<%} %>
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