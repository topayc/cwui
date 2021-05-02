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

	if (caCode.equals("01")) { // �ݰ��
		RAPORT = 4002;
	} else if (caCode.equals("04")) { // �ڽ���
		RAPORT = 4004;
	} else if (caCode.equals("03")) { // ��������
		RAPORT = 4000;
	} else if (caCode.equals("05")) { // ��������
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
		hash.put("MANAGERID", RAUSER); // ��ھƾƵ�. OPTIONAL �Ӽ�
		hash.put("USERCODE", USERCODE); //�����ڱ����ڵ� "1" ����   "2" ���
		hash.put("OU_NAME", ORGNAME); // ������ ���θ��� OPTIONAL
		hash.put("CN_NAME", DETAILNAME); // ���θ�, ����/��ü ���θ�. "()"�� �ڿ� ���ԵǾ����. ex:) "ȫ�浿()" ����� ��� "�̴���(INI)" ()�ȿ� ���θ��� ��
		hash.put("IDNO", REGNO); //�ֹ�(�����)��Ϲ�ȣ
		hash.put("USERID", "IniDemo-" + USERID); //����Ʈ���̵�
		hash.put("SERVICEPROVIDER", serviceProviderCode); //01:�ݰ��OPP(�Ǵ� �������Ʈ����), 02:Ÿ�����������
		hash.put("CACODE", caCode); //01:�ݰ�� 02:SignKorea 03:��������
		hash.put("CERTCODE", CERTPOLICY); //01:���ι���  02:�������  04:����(����/����)  05:�������
		hash.put("EMAIL", USERMAIL); //�̸���
		hash.put("FAX", "02-2140-3699"); //�ѽ�
		hash.put("POSTCODE", "138-816"); //�����ȣ
		hash.put("POSTADDR", "����� ���ı� �ſ��� 559-5 �̴��غ��� 6��"); //�ּ�
		hash.put("PHONE", "02-2140-3500"); //��ȭ
		hash.put("STATISTICSCODE", "InitechDemo"); //for Advance version

		if (caCode.equals("05")) {
			hash.put("STATISTICSCODE", "000386"); //for Advance version
		} else {
			hash.put("STATISTICSCODE", "InitechDemo"); //for Advance version
		}

		if (caCode.equals("05")) {
			hash.put("POSTCODE1", "152-050");
			hash.put("POSTADDR1", "����� ���ı� �ſ��� 559-5 �̴��غ��� 6��");
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
		sRESCODE = odp.getCodeData("RESCODE"); //�����ڵ�
		sRESMSG = odp.getCodeData("RESMSG"); //����޼���
		sREFNUM = odp.getCodeData("REFNUM"); //������ȣ
		sAPPCODE = odp.getCodeData("APPCODE"); //�ΰ��ڵ�

		System.out.println("[REFNUM] : " + sREFNUM + ", [APPCODE] : " + sAPPCODE);

		// �����ڵ尡 "000"�� ��츸 ����ó���Դϴ�.
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
		dErrorMessage = "RA�� �۵� ���� �ʽ��ϴ�.";
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
			<%if (caCode.equals("01")) { // �ݰ��
				out.print("moa_issue( 'issueCert' , form, certIssue_callback );");
			} else if (caCode.equals("04")) { // �ڽ���
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
		if (retcode != null && retcode != "" && retcode == "1") { // ����
			alert("������ �߱� ����");
		} else if (retcode == "2") {
			alert("������ �߱� ����");
		} else if (retcode == "3") { // ���
			alert('���');
		} else if (retcode == "4") {
			alert('Ÿ�Ӿƿ�');
		} else {
			alert('�˼� ���� ������ �߻�����');
		}
	}
</script>
</head>
<body bgcolor="#f3f4f5">
	<div id=test_bed>
		<table border="0" width="800px">
			<tr><td align="right">
				<span id="menu_situation">PC Demo > INISAFE MoaSign S > ������������ ���� > ������ �߱ް��</span>
			</td></tr>
		</table>
		
		<jsp:include page="./test_menu.html" />
	
		<h1>����</h1>
		<div class="desc" style="width:800px;">
			<h3>�ش� ���������� �߱��ϴ� �������� �׽�Ʈ�� ������ �Դϴ�.</h3>
			<h3>�׷��Ƿ� �׽�Ʈ CA������ ����ó�� �˴ϴ�.</h3>
			<h3>���� �������� ������ ��� �׽�ƮCA������ �� ���� �����Ƿ� ���� �޼����� ���� �� �ֽ��ϴ�.</h3>
			<h3>���� �������� ���� �� �׽�Ʈ, ��������θ� ����ϼž� �մϴ�.</h3>
			<h3>�����ּ� : <%=request.getRequestURL()%></h3>
		</div>
		<br>
		<h1>������ �߱� ����</h1>
		<div class="result" style="width:800px;">
		<table border=0>
		<tr>
			<td width="20px" rowspan="2"></td>
			<td width="750px">
			<!-- �Է� ����  -->
				<table class="basic_table" style="width:100%;">
	            <colgroup>
	                <col width="30%" />
	                <col width="70%" />
	            </colgroup>            
	            <tr>
	                <th>�׸�</th>
	                <th>����</th>
	            </tr>
		<%
			if (ErrorCode == null) {
		%>
	            <tr>
	                <td align="center"><b>������ȣ</b></td>
	                <td><%=sREFNUM%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>�ΰ��ڵ�</b></td>
	                <td><%=sAPPCODE%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>�����ڵ�</b></td>
	                <td><%=sRESCODE%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>����޼���</b></td>
	                <td><%=sRESMSG%></td>
	            </tr>
		<%
			} else {
		%>
		 		<tr>
	                <td align="center"><b>�����ڵ�</b></td>
	                <td><%=ErrorCode%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>�����޽���</b></td>
	                <td><%=ErrorMessage%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>�󼼿����ڵ�</b></td>
	                <td><%=dErrorCode%></td>
	            </tr>
	            <tr>
	                <td align="center"><b>�󼼿����޽���</b></td>
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
					<input type="submit" id="submitBtn" name="submitBtn" class="button blue medium" value="������ �߱�">
				</td>
			</tr>
			</table>
		<input type="hidden" name="moa_securedata" id="moa_securedata" value="" />
		</form>
		
	</div>
	<%-- <div style="width:800px;" align="right">
		<a href="javaScript:view_source('<%=request.getRequestURL()%>');"> &lt; .jsp �ҽ����� &gt; </a>
	</div> --%>
</div>
</body>
</html>
