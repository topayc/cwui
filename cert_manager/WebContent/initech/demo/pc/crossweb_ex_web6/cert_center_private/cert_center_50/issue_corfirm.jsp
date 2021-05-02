<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<%@ page import="java.util.*,java.lang.*, java.text.*"%>
<%@ page import="com.initech.oppra.*"%>
<%@ page import="com.initech.oppra.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<%
	boolean isAdv = true;

	// String DETAILNAME  = "moaCert()";
	String DETAILNAME = request.getParameter("detailName");
	DETAILNAME = new String(DETAILNAME.getBytes("8859_1"), "EUC-KR");
	String sREFNUM = null;
	String sAPPCODE = null;
	String RAIP = "118.219.55.139";
	int RAPORT = 4002;

	//	public void getIssueKeyInfo(int ReqCode) {

	String reissue = request.getParameter("isReissue");

	int ReqCode = 20;

	if (reissue == null) {
		ReqCode = 20;
	} else if (reissue.equals("on")) {
		ReqCode = 25;
	}

	String RAUSER = "INITECH";
	String USERCODE = "1";
	// String REGNO  = "9002022516163";
	String REGNO = request.getParameter("regno");
	String serviceProviderCode = "01";
	// String caCode = "01";
	String caCode = request.getParameter("select_ca");
	System.out.println("caCode: " + caCode);

	String CERTPOLICY = request.getParameter("certpolicy");

	if (caCode.equals("01")) { // 금결원
		RAPORT = 4002;
	} else if (caCode.equals("04")) { // 코스콤
		RAPORT = 4004;
	} else if (caCode.equals("03")) { // 전자인증
		RAPORT = 4000;
	} else if (caCode.equals("05")) { // 정보인증
		RAPORT = 4005;
	}

	System.out.println("RAPORT : " + RAPORT + " , CERTPOLICY : " + CERTPOLICY);

	//		String USERID  = "moa1005";
	String USERID = request.getParameter("userid");
	USERID = new String(USERID.getBytes("8859_1"), "EUC-KR");
	// String ORGNAME  = "moa1004";
	String ORGNAME = "";

	String USERMAIL = request.getParameter("usermail");
	
	String GUBUN = "";

	HashMap hash = null;
	String sRESCODE = null;
	String sRESMSG = null;

	String ErrorCode = null;
	String ErrorMessage = null;

	String dErrorCode = "";
	String dErrorMessage = "";

	String requestMsg = "";
	String responseMsg = "";

	IniOPPRA oppra = new IniOPPRA(RAIP, RAPORT);
	try {
		hash = new HashMap();
		hash.put("MANAGERID", RAUSER); // 운영자아아디. OPTIONAL 속성
		hash.put("USERCODE", USERCODE); //가입자구분코드 "1" 개인   "2" 기업
		hash.put("OU_NAME", ORGNAME); // 개인은 법인명이 OPTIONAL
		hash.put("CN_NAME", DETAILNAME); // 개인명, 법인/단체 세부명. "()"가 뒤에 포함되어야함. ex:) "홍길동()" 기업일 경우 "이니텍(INI)" ()안에 법인명이 들어감
		hash.put("IDNO", REGNO); //주민(사업자)등록번호
		hash.put("USERID", "IniDemo-" + USERID); //사이트아이디
		hash.put("SERVICEPROVIDER", serviceProviderCode); //01:금결원OPP(또는 범용게이트웨이), 02:타기관직접연동
		hash.put("CACODE", caCode); //01:금결원 02:SignKorea 03:전자인증
		hash.put("CERTCODE", CERTPOLICY); //01:개인범용  02:기업범용  04:개인(은행/보험)  05:기업범용
		hash.put("EMAIL", USERMAIL); //이메일
		hash.put("FAX", "02-2140-3699"); //팩스
		hash.put("POSTCODE", "138-816"); //우편번호
		hash.put("POSTADDR", "서울시 송파구 거여동 559-5 이니텍빌딩 6층"); //주소
		hash.put("PHONE", "02-2140-3500"); //전화
		hash.put("STATISTICSCODE", "InitechDemo"); //for Advance version

		if (caCode.equals("05")) {
			hash.put("STATISTICSCODE", "000386"); //for Advance version
		} else {
			hash.put("STATISTICSCODE", "InitechDemo"); //for Advance version
		}

		if (caCode.equals("05")) {
			hash.put("POSTCODE1", "152-050");
			hash.put("POSTADDR1", "서울시 송파구 거여동 559-5 이니텍빌딩 6층");
			hash.put("PHONE1", "02-6445-7200");
			hash.put("RESERVATION5", "0");
		}

		OppraSendDataParser oppraSendDataParser = new OppraSendDataParser(ReqCode, hash, isAdv);
		requestMsg = oppraSendDataParser.getSendLastData();

		System.out.println("[RequestMsg] : " + requestMsg);
		//Commucated with RA
		oppra.initialize();
		responseMsg = oppra.requestRAW(requestMsg);
		System.out.println("[ResponseMsg] : " + responseMsg);

		OppraMessageDataParser odp = new OppraMessageDataParser(ReqCode, oppra.getResDataPart());
		sRESCODE = odp.getCodeData("RESCODE"); //응답코드
		sRESMSG = odp.getCodeData("RESMSG"); //응답메세지
		sREFNUM = odp.getCodeData("REFNUM"); //참조번호
		sAPPCODE = odp.getCodeData("APPCODE"); //인가코드

		System.out.println("[REFNUM] : " + sREFNUM + ", [APPCODE] : " + sAPPCODE);

		// 응답코드가 "000"일 경우만 정상처리입니다.
		if (!sRESCODE.equals("000")) {
			ErrorCode = sRESCODE;
			ErrorMessage = sRESMSG;

			java.util.StringTokenizer token = new java.util.StringTokenizer(oppra.getResDataPart(), "$");
			ErrorCode = sRESCODE;
			ErrorMessage = sRESMSG;

			ErrorCode = token.nextToken().substring(4);
			ErrorMessage = token.nextToken();
			if (token.hasMoreElements()) {
				dErrorCode = token.nextToken();

				while (token.hasMoreElements())
					dErrorMessage += token.nextToken() + "$";
			}
		}
	} catch (com.initech.oppra.IniOPPRAConnectException ce) {
		sRESCODE = "000";
		ErrorCode = "999";
		ErrorMessage = ce.getMessage();
		dErrorCode = "999";
		dErrorMessage = "RA가 작동 하지 않습니다.";
	} catch (Exception ex) {
		ErrorCode = "999";
		ErrorMessage = ex.getMessage();
		ex.printStackTrace();
		System.out.println("Exception:[" + ex.getMessage() + "]");
	} finally {
		try {
			oppra.close();
		} catch (Exception e) {
		}
	}
	//	}

	//	getIssueKeyInfo( 20 );

	if (sREFNUM != null && sAPPCODE != null) {
		session.setAttribute("IssueRefID", new String(sREFNUM));
		session.setAttribute("IssuePassword", new String(sAPPCODE));
	}
%>
<head>
<link href="/common/style/body_style.css" rel="stylesheet" type="text/css"></link>
<link href="/common/style/table_style.css" rel="stylesheet" type="text/css"></link>
<link href="/common/style/text_style.css" rel="stylesheet" type="text/css"></link>
<link href="/common/style/form_style.css" rel="stylesheet" type="text/css"></link>
<script src="/initech/common/common.js"></script>
<script src="/common/script/jquery-1.11.1.js"></script>
<script src="/common/script/jquery.mobile-1.1.0-rc.1.min.js"></script>
<script language="javascript" src="/demo/pc/moasign/script/moasign.js"></script>

<script language="javascript">
	function certIssue(form) {
		try {
			// document.getElementById("submitBtn").disabled = true;
			<%if (caCode.equals("01")) { // 금결원
				out.print("moa_issue( 'issueCert' , form, certIssue_callback );");
			} else if (caCode.equals("04")) { // 코스콤
				out.print("moa_issue( 'issueCert_signkorea' , form, certIssue_callback );");
			} else if (caCode.equals("03")) {
				out.print("moa_issue( 'issueCert_crosscert' , form, certIssue_callback );");
			} else if (caCode.equals("05")) {
				if (reissue == null) {
					out.print("moa_issue( 'issueCert_signgate' , form, certIssue_callback );");
				} else {
					out.print("moa_issue( 'reissueCert_signgate' , form, certIssue_callback );");
				}
			}%>
			return false;
		} catch (e) {
			if (typeof (e) == "object")
				alert(e.description);
			else
				alert(e);

			return false;
		}
	}

	function certIssue_callback(retcode) {
		if (retcode != null && retcode != "" && retcode == "1") { // 성공
			alert("인증서 발급 성공");
		} else if (retcode == "2") {
			alert("인증서 발급 실패");
		} else if (retcode == "3") { // 취소
			alert('취소');
		} else if (retcode == "4") {
			alert('타임아웃');
		} else {
			alert('알수 없는 오류가 발생했음');
		}
	}
</script>
</head>
<body bgcolor="#f3f4f5">
	<div id=test_bed>
		<table border="0" width="800px">
			<tr><td align="right">
				<span id="menu_situation">PC Demo > INISAFE MoaSign S > 공인인증센터 예제 > 인증서 발급결과</span>
			</td></tr>
		</table>
		
		<jsp:include page="./test_menu.html" />
	
		<h1>설명</h1>
		<div class="desc" style="width:800px;">
			<h3>해당 페이지에서 발급하는 인증서는 테스트용 인증서 입니다.</h3>
			<h3>그러므로 테스트 CA에서만 정상처리 됩니다.</h3>
			<h3>리얼 인증서를 제출할 경우 테스트CA에서는 알 수가 없으므로 오류 메세지가 나올 수 있습니다.</h3>
			<h3>데모 페이지는 개발 및 테스트, 데모용으로만 사용하셔야 합니다.</h3>
			<h3>현재주소 : <%=request.getRequestURL()%></h3>
		</div>
		<br>
		<h1>인증서 발급 정보</h1>
		<div class="result" style="width:800px;">
		<table border=0>
		<tr>
			<td width="20px" rowspan="2"></td>
			<td width="750px">
			<!-- 입력 시작  -->
				<table class="basic_table" style="width:100%;">
	            <colgroup>
	                <col width="30%" />
	                <col width="70%" />
	            </colgroup>            
	            <tr>
	                <th>항목</th>
	                <th>내용</th>
	            </tr>
		<%
			if (ErrorCode == null) {
		%>
	            <tr>
	                <td align="center"><b>참조번호</b></td>
	                <td><%=sREFNUM%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>인가코드</b></td>
	                <td><%=sAPPCODE%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>응답코드</b></td>
	                <td><%=sRESCODE%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>응답메세지</b></td>
	                <td><%=sRESMSG%></td>
	            </tr>
		<%
			} else {
		%>
		 		<tr>
	                <td align="center"><b>에러코드</b></td>
	                <td><%=ErrorCode%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>에러메시지</b></td>
	                <td><%=ErrorMessage%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>상세에러코드</b></td>
	                <td><%=dErrorCode%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>상세에러메시지</b></td>
	                <td><%=dErrorMessage%></td>
	            </tr>
		<% } %>
	        	</table>
        	</td>
        </tr>
		</table>
		
		<form action="issue_corfirm.jsp" method="post" id="issueForm" onSubmit="return certIssue(this)" name="issueForm">
			<table border=0 width="100%">
			<tr>
				<td align="right">
					<input type="submit" id="submitBtn" name="submitBtn" class="button blue medium" value="인증서 발급">
				</td>
			</tr>
			</table>
		<input type="hidden" name="moa_securedata" id="moa_securedata" value="" />
		</form>
		
	</div>
	<%-- <div style="width:800px;" align="right">
		<a href="javaScript:view_source('<%=request.getRequestURL()%>');"> &lt; .jsp 소스보기 &gt; </a>
	</div> --%>
</div>
</body>
</html>
