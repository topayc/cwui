<%@ page import="java.io.*,java.util.*,java.lang.*, java.text.*" %>
<%@ page import="com.initech.oppra.*" %>
<%@ page import="com.initech.oppra.util.*" %>
<%@ page import="com.initech.pki.util.PEMOutputStream"%> 

<%-- 
//************************************************
//	인증서버에 인증서 발급/갱신/변경/취소
//************************************************
--%>
<% if (m_IniErrCode == null && !m_How.equals("certRevokeAndNew")) 
{
	String userid = m_ID;	
	String regno = m_REGNO;
	String ou = m_OU;
	String cn = m_CN;
	String mail = m_MAIL;
	String policy = "71";

	HashMap hash = null;

	boolean ret = false;

	/* 요청 (C0:발급요청, C5:재발급요청, C8:갱신요청) */
	String CACode = null;
	if (m_How.equals("certNew")) 
	{
		CACode = "C0";
	}
	else if (m_How.equals("certReplace"))
	{
		CACode = "C5";
	}
	else if (m_How.equals("certRenewal"))
	{
		CACode = "C8";
	}
	else if (m_How.equals("certRevoke") || m_How.equals("certStop") || m_How.equals("certStart"))
	{
		CACode = "40";	/* 40:인증서 상태변경 요청 */
	}
	else if (m_How.equals("certSearch"))
	{
		CACode = "50";	/* 50:인증서 조회 요청 */
	}

	if (m_How.equals("certRevoke") || m_How.equals("certStop") || m_How.equals("certStart"))
	{
		String RAUSER = "TEST";					// 단말기 운영자 ID
		String SERVICEPROVIDER = "01";			// 서비스제공자   01 RA_v7, 02 AuthGD
		String CODE = "08";						// 인증기관 식별코드 01 금결원, 02 무역정보통신, 03 전자인증, 04 코스콤, 05 정보인증, 06 한국전산원, 08 사설CA
		String CERTPOLICY = policy;				// 인증정책 식별코드
		String CERTSERIAL = m_certserial;			// 인증서 일련번호
		String SERVICECODE = null;
		if (m_How.equals("certRevoke"))
			SERVICECODE = "30";				// 서비스 코드 30:폐기
		else if (m_How.equals("certStop"))
			SERVICECODE = "40";				// 서비스 코드 40:효력정지
		else if (m_How.equals("certStart"))
			SERVICECODE = "41";				// 서비스 코드 41:효력회복

		hash = new HashMap();
		hash.put("MANAGERID", RAUSER);
		hash.put("SERVICEPROVIDER", SERVICEPROVIDER);
		hash.put("CACODE", CODE);
		hash.put("CERTCODE", CERTPOLICY);
		hash.put("CERTSERIAL", CERTSERIAL);
		hash.put("SERVICECODE", SERVICECODE);
	}
	else if (m_How.equals("certSearch"))
	{
		String RAUSER = "TEST";					// 단말기 운영자 ID
		String SERVICEPROVIDER = "01";			// 서비스제공자   01 RA_v7, 02 AuthGD
		String CODE = "08";						// 인증기관 식별코드 01 금결원, 02 무역정보통신, 03 전자인증, 04 코스콤, 05 정보인증, 06 한국전산원, 08 사설CA
		String CERTPOLICY = policy;				// 인증정책 식별코드
		String SEARCHCODE = m_SEARCHCODE;
		String SEARCHCONTENTS = m_SEARCHCONTENTS;
		String REQRECORDSTARTNO = null;
		String REQRECORDNO = null;

		hash = new HashMap();
		hash.put("MANAGERID", RAUSER);
		hash.put("SERVICEPROVIDER", SERVICEPROVIDER);
		hash.put("CACODE", CODE);
		hash.put("CERTCODE", CERTPOLICY);
		hash.put("SEARCHCODE", SEARCHCODE);
		hash.put("SEARCHCONTENTS", SEARCHCONTENTS);
		hash.put("REQRECORDSTARTNO", REQRECORDSTARTNO);
		hash.put("REQRECORDNO", REQRECORDNO);
	}
	else
	{
		String RAUSER = "TEST";					// 단말기 운영자 ID
		String USERCODE = "1";					// 가입자 구분코드  1 개인, 2 기업, 3 기타
		String ORGNAME = ou;					// 기업명
		String DETAILNAME = cn;					// 개인/기업 세부명
		String REGNO = regno;					// 주민번호
		String BANKINGID = userid;				// 인터넷뱅킹ID
		String SERVICEPROVIDER = "01";			// 서비스제공자   01 RA_v7, 02 AuthGD
		String CODE = "08";						// 인증기관 식별코드 01 금결원, 02 무역정보통신, 03 전자인증, 04 코스콤, 05 정보인증, 06 한국전산원, 08 사설CA
		String CERTPOLICY = policy;				// 인증정책 식별코드
		String USERMAIL = mail;	// 이메일
		String PHONE = "010-123-1234";			// 폰
		String FAX = "02-6445-7200";			// FAX
		String POSTNUM = "123-123";				// 우편번호
		String ADDRESS ="서울 구로 구로동 에이스하이엔드타워2차 11층 1호"; // 주소
		String PKCS10MSG = m_REQ;

		hash = new HashMap();
		hash.put("MANAGERID", RAUSER);
		hash.put("USERCODE", USERCODE);
		hash.put("OU_NAME", ORGNAME);
		hash.put("CN_NAME", DETAILNAME);
		hash.put("IDNO", REGNO);
		hash.put("USERID", BANKINGID);
		hash.put("SERVICEPROVIDER", SERVICEPROVIDER);
		hash.put("CACODE", CODE);
		hash.put("CERTCODE", CERTPOLICY);
		hash.put("EMAIL", USERMAIL);
		hash.put("HANDPHONE", PHONE);
		hash.put("FAX", FAX);
		hash.put("POSTCODE", POSTNUM);
		hash.put("POSTADDR", ADDRESS);
		hash.put("PHONE", PHONE);
		hash.put("POSTCODE1", POSTNUM);
		hash.put("POSTADDR1", ADDRESS);
		hash.put("PHONE1", PHONE);
		hash.put("PKCS10MSG", PKCS10MSG);

		//System.out.println("inica70_ca_send.jsp==>"+hash);
	}


    String sRESLEN = null;			// 레코드길이
	String sRESCODE = null;		    // 응답코드
	String sRESMSG = null;			// 응답메세지
    OppraMessageDataParser odp = null;
	IniOPPRA iniRA = null;

   try{ 
       /* RA SDK 초기화 */
        iniRA = new IniOPPRA("172.20.26.23", 4000);
	    iniRA.setCharEncoding("euc-kr");
	
		iniRA.initialize();

		/* RA 요청 */
		OppraSendDataParser oppraSendDataParser = new OppraSendDataParser(CACode, hash, false);
		String requestMsg = oppraSendDataParser.getSendLastData();
		String rsp = iniRA.requestRAW(requestMsg);

	  /* 응답수신 [PKCS#10 인증서 발급통보 (C1) 포맷] */
		/* [정상응답: rescode=000]
		 * 01: RESLEN
		 * 02: RESCODE
		 * 03: RESMSG
		 * 04: CERTDATA (상태변경 메시지 요청의 응답일 경우 제외) */
		/* [오류응답: rescode=999]
		 * 01: RESLEN
		 * 02: RESCODE
		 * 03: RESMSG
		 * 04: ADDRESCODE
		 * 05: ADDRESMSG
		 * 06: RESERVE1
		 * 07: RESERVE2 */
		/* [오류응답: rescode=기타]
		 * 01: RESLEN
		 * 02: RESCODE
		 * 03: RESMSG
		 * 04: ADDRESCODE
		 * 05: ADDRESMSG
		 * 06: RESERVE1
		 * 07: RESERVE2
		 * 08: RESERVE3
		 * 09: RESERVE4 */
		odp = new OppraMessageDataParser(CACode, iniRA.getResDataPart());
		sRESLEN = odp.getCodeData("RESLEN");			// 레코드길이
		sRESCODE = odp.getCodeData("RESCODE");		// 응답코드
		sRESMSG = odp.getCodeData("RESMSG");			// 응답메세지

	} catch ( Exception e ) {
        //e.printStackTrace();
		// out.println("<script language='javascript'> location.href='err.jsp?id=" + m_ID + "&how=" + m_How + "&code=8888&msg=" + e.getMessage()+"'; </script>");
		  out.println("<script> alert('RA시스템에서 오류가 발생하였습니다.\\n[오류메시지:"+ e.getMessage()+"]'); </script>");
		//response.sendRedirect("err.jsp?id=" + m_ID + "&how=" + m_How + "&code=8888&msg=" + e.getMessage());
		return;
  }

 try{

	String sCERTDATA = null;
	String sADDRESCODE = null;
	String sADDRESMSG = null;
	String sRESERVE1 = null;
	String sRESERVE2 = null;
	String sRESERVE3 = null;
	String sRESERVE4 = null;
	String sCLICERTDATA = null;
	String sDELETECERTDATA = null;

	String sCACODE = null;
	String sMANAGERID = null;
	String sCERTPOLICY = null;
	String sCERTSERIAL = null;
	String sUSERID = null;
	String sSUBJECTDN = null;
	String sIDNO = null;
	String sSVDATE = null;
	String sEVDATE = null;
	String sCERTSTATUS = null;
	String sTOTALRECORDNUM = null;
	String sCURRENTRECORNUM = null;

	//System.out.println("inica70_ca_send.jsp==>requestMsg,"+requestMsg);

	if (sRESCODE.equals("000"))
	{
			if (m_How.equals("certRevoke") || m_How.equals("certStop") || m_How.equals("certStart"))
			{	
				 
			    /*if(x509 !=null){
				sDELETECERTDATA = makeCertString("UserCert", getPEMCert(x509), false);
			    }*/

				 if(m_certs != null){		
						/* 인증서 (클라이언트 전달 포맷) */
						sDELETECERTDATA = makeCertString("UserCert", m_certs, false);
						//System.out.println("inica70_ca_send.jsp===>m_certs:"+m_certs);
						//System.out.println("inica70_ca_send.jsp===>sDELETECERTDATA:"+sDELETECERTDATA);
				}
				
				if (m_bDebug)
				{
					System.out.println(m_ID + "( " + m_How + " ) - 디버그0(전체)       : " + iniRA.getResDataPart());
					System.out.println(m_ID + "( " + m_How + " ) - 디버그1(레코드길이) : " + sRESLEN);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그2(응답코드)   : " + sRESCODE);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그3(응답메세지) : " + sRESMSG);
				}
			}
			else if (m_How.equals("certSearch"))
			{
				sCACODE = odp.getStrCodeData("CACODE");						// 등록대행 기관코드
				sMANAGERID = odp.getStrCodeData("MANAGERID");				// 단말기 운영자 ID
				sCERTPOLICY = odp.getStrCodeData("CERTPOLICY");				// 인증정책식별코드
				sCERTSERIAL = odp.getStrCodeData("CERTSERIAL");				// 인증서일련번호
				sUSERID = odp.getStrCodeData("USERID");						// 가입자ID
				sSUBJECTDN = odp.getStrCodeData("SUBJECTDN");				// 가입자 DN명
				sIDNO = odp.getStrCodeData("IDNO");							// 주민(사업자)등록번호
				sSVDATE = odp.getStrCodeData("SVDATE");						// 유효기간시작
				sEVDATE = odp.getStrCodeData("EVDATE");						// 유효기간종료
				sCERTSTATUS = odp.getStrCodeData("CERTSTATUS");				// 인증서상태
				sTOTALRECORDNUM= odp.getStrCodeData("TOTALRECORDNUM");		// 총 레코드 수
				sCURRENTRECORNUM= odp.getStrCodeData("CURRENTRECORNUM");	// 현 레코드 번호
	
				if (m_bDebug)
				{
					System.out.println(m_ID + "( " + m_How + " ) - 디버그00(전체)       : " + iniRA.getResDataPart());
					System.out.println(m_ID + "( " + m_How + " ) - 디버그01(레코드길이) : " + sRESLEN);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그02(응답코드)   : " + sRESCODE);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그03(응답메세지) : " + sRESMSG);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그04(등록대행 기관코드)    : " + sCACODE);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그05(단말기 운영자 ID)     : " + sMANAGERID);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그06(인증정책식별코드)     : " + sCERTPOLICY);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그07(인증서일련번호)       : " + sCERTSERIAL);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그08(가입자ID)             : " + sUSERID);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그09(가입자 DN명)          : " + sSUBJECTDN);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그10(주민(사업자)등록번호) : " + sIDNO);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그11(유효기간시작)         : " + sSVDATE);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그12(유효기간종료)         : " + sEVDATE);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그13(인증서상태)           : " + sCERTSTATUS);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그14(총 레코드 수)         : " + sTOTALRECORDNUM);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그15(현 레코드 번호)       : " + sCURRENTRECORNUM);
				}
			}
			else
			{
				sCERTDATA = odp.getStrCodeData("CERTDATA");	// 인증서
	
				/* 인증서 (클라이언트 전달 포맷) */
				sCLICERTDATA = makeCertString("UserCert", sCERTDATA, false);
	
				if (m_bDebug)
				{
					System.out.println(m_ID + "( " + m_How + " ) - 디버그0(전체)       : " + iniRA.getResDataPart());
					System.out.println(m_ID + "( " + m_How + " ) - 디버그1(레코드길이) : " + sRESLEN);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그2(응답코드)   : " + sRESCODE);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그3(응답메세지) : " + sRESMSG);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그4(인증서)     : " + sCERTDATA);
					System.out.println(m_ID + "( " + m_How + " ) - 디버그5(인증서-클라이언트전달포맷) : " + sCLICERTDATA);
				}
			   
			}
	}
	else if (sRESCODE.equals("999"))
	{
		sADDRESCODE = odp.getStrCodeData("ADDRESCODE");
		sADDRESMSG = odp.getStrCodeData("ADDRESMSG");
		sRESERVE1 = odp.getStrCodeData("RESERVE1");
		sRESERVE2 = odp.getStrCodeData("RESERVE2");

			if (m_bDebug)
			{
				System.out.println(m_ID + "( " + m_How + " ) - 디버그0(전체)       : " + iniRA.getResDataPart());
				System.out.println(m_ID + "( " + m_How + " ) - 디버그1(레코드길이) : " + sRESLEN);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그2(응답코드)   : " + sRESCODE);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그3(응답메세지) : " + sRESMSG);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그4(ADDRESCODE) : " + sADDRESCODE);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그5(ADDRESMSG)  : " + sADDRESMSG);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그6(RESERVE1)   : " + sRESERVE1);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그7(RESERVE2)   : " + sRESERVE2);
			}
	}
	else
 {
		sADDRESCODE = odp.getStrCodeData("ADDRESCODE");
		sADDRESMSG = odp.getStrCodeData("ADDRESMSG");
		sRESERVE1 = odp.getStrCodeData("RESERVE1");
		sRESERVE2 = odp.getStrCodeData("RESERVE2");
		sRESERVE3 = odp.getStrCodeData("RESERVE3");
		sRESERVE4 = odp.getStrCodeData("RESERVE4");

			if (m_bDebug)
			{
				System.out.println(m_ID + "( " + m_How + " ) - 디버그0(전체)       : " + iniRA.getResDataPart());
				System.out.println(m_ID + "( " + m_How + " ) - 디버그1(레코드길이) : " + sRESLEN);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그2(응답코드)   : " + sRESCODE);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그3(응답메세지) : " + sRESMSG);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그4(ADDRESCODE) : " + sADDRESCODE);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그5(ADDRESMSG)  : " + sADDRESMSG);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그6(RESERVE1)   : " + sRESERVE1);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그7(RESERVE2)   : " + sRESERVE2);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그8(RESERVE3)   : " + sRESERVE3);
				System.out.println(m_ID + "( " + m_How + " ) - 디버그9(RESERVE4)   : " + sRESERVE4);
			}
	}

	if (sRESCODE.equals("000"))
	{
			if (m_How.equals("certNew") || m_How.equals("certRenewal") || m_How.equals("certReplace"))
			{
				/***********************************/
				/* 수신된 인증서 클라이언트로 전달 */
				/***********************************/
				m_caCertString = sCLICERTDATA;
			} else if(m_How.equals("certRevoke")){
			  
				m_caCertString = sDELETECERTDATA;

		    }else if (m_How.equals("certSearch"))
			{
				/***********************************/
				/* 조회된 결과를 클라이언트로 전달 */
				/***********************************/
				m_seCACODE			= sCACODE;			// 등록대행 기관코드
				m_seMANAGERID		= sMANAGERID;		// 단말기 운영자 ID
				m_seCERTPOLICY		= sCERTPOLICY;		// 인증정책식별코드
				m_seCERTSERIAL		= sCERTSERIAL;		// 인증서일련번호
				m_seUSERID			= sUSERID;			// 가입자ID
				m_seSUBJECTDN		= sSUBJECTDN;		// 가입자 DN명
				m_seIDNO			= sIDNO;			// 주민(사업자)등록번호
				m_seSVDATE			= sSVDATE;			// 유효기간시작
				m_seEVDATE			= sEVDATE;			// 유효기간종료
				m_seCERTSTATUS		= sCERTSTATUS;		// 인증서상태
				m_seTOTALRECORDNUM	= sTOTALRECORDNUM;	// 총 레코드 수
				m_seCURRENTRECORNUM	= sCURRENTRECORNUM;	// 현 레코드 번호
			}
	}
	else
	{
		/*************/
		/* 오류 응답 */
		/*************/
		m_IniErrCode = sRESCODE;
		m_IniErrMsg  = sRESMSG;
		
		
		if (sRESCODE.equals("999")){
		   m_IniErrCode = odp.getStrCodeData("ADDRESCODE");
		   m_IniErrMsg = odp.getStrCodeData("ADDRESMSG");
		}
		
		//m_IniErrMsg = java.net.URLEncoder.encode(m_IniErrMsg,"UTF-8");
		//out.println("<script language='javascript'> location.href='err.jsp?id=" + m_ID + "&how=" + m_How + "&code=" + m_IniErrCode + "&msg=" + m_IniErrMsg+"'; </script>");
		 out.println("<script> alert('인증서 처리중 오류가 발생하였습니다.\\n [("+m_IniErrCode+") 오류메시지:"+m_IniErrMsg+"]'); </script>");
		//response.sendRedirect("err.jsp?id=" + m_ID + "&how=" + m_How + "&code=" + m_IniErrCode + "&msg=" + m_IniErrMsg);
		return;
	}

  } catch ( Exception e ) {
        //e.printStackTrace();
		//out.println("<script language='javascript'> location.href='err.jsp?id=" + m_ID + "&how=" + m_How + "&code=8888&msg=" + e.getMessage()+"'; </script>");
		out.println("<script> alert('인증서 처리중 오류가 발생하였습니다.\\n [오류메시지:"+ e.getMessage()+"]'); /script>");
		return;
  }



	/* THE END */
}
%>

<%!
public static String makeCertString(String varName, String certificate, boolean doFromJSP)
{
	String usercert = null;
	String certstring = null;
	StringBuffer sb = null;
	StringTokenizer sToken = null;
	String sTokenTmp = "";

	certstring = certificate.replaceAll("-----BEGIN CERTIFICATE-----", "");
	certstring = certstring.replaceAll("-----END CERTIFICATE-----", "");

	sb = new StringBuffer();
	sToken = new StringTokenizer(certstring, "\n");

	sb.append("UserCert = \"-----BEGIN CERTIFICATE-----\\n\";\n");
	while (sToken.hasMoreTokens()) {
		sTokenTmp = sToken.nextToken();

		sb.append("UserCert +=\"");
		sb.append(sTokenTmp);
		sb.append("\\n\";\n");
	}
	sb.append("UserCert += \"-----END CERTIFICATE-----\\n\";\n");
	usercert = sb.toString();

	return usercert;
}
static public String getPEMCert(X509Certificate cert){
	String out = null;
	ByteArrayOutputStream baos = new ByteArrayOutputStream();
	PEMOutputStream  pout = null;
	try {
		pout = new PEMOutputStream(baos, "CERTIFICATE");
		pout.write(cert.getEncoded());
		pout.flush();
		out = baos.toString();
		pout.close();				baos.close();
	} catch (IOException e) {
		e.printStackTrace();
	} catch (Exception e) {
		e.printStackTrace();
	}
	return out;
}
%>

