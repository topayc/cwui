<%-- 
		//************************************************
        //      변수 선언 및 입력정보 복호화
        //************************************************
--%><%
	response.setHeader("Cache-Control", "no-cache, post-check=0, pre-check=0");
	response.setHeader("Pragma", "no-cache");
	response.setHeader("Expires", "0");
	
	//html사용여부
	String m_html5 = "false";
	String m_keybits ="2048";

	//사용자 신분확인 정보
	String m_ID = null;		// form name = id
	String m_REGNO = null;	// form name = regno

	// 조회 정보 (요청)
	String m_SEARCHCODE = null;		// form name = searchcode
	String m_SEARCHCONTENTS = null;	// form name = searchcontents

	// 조회 정보 (응답)
	String m_seCACODE			= null;
	String m_seMANAGERID		= null;
	String m_seCERTPOLICY		= null;
	String m_seCERTSERIAL		= null;
	String m_seUSERID			= null;
	String m_seSUBJECTDN		= null;
	String m_seIDNO				= null;
	String m_seSVDATE			= null;
	String m_seEVDATE			= null;
	String m_seCERTSTATUS		= null;
	String m_seTOTALRECORDNUM	= null;
	String m_seCURRENTRECORNUM	= null;

	//Challenge사용여부 : 일반적으로 사용안함
	boolean m_bChallenge = false;

	//LDAP 관련정보 : 변경하지 말것
	String m_certserial = null;
	String m_certs = null;
	String m_ldapchallenge = null;

	//인증서신청정보, 호스트에서 발아야 할정보 : 변경하지 말것
	String m_REQ = null; //cert request
	String m_CN = "홍길동";
	String m_MAIL = "mailto@initech.com";
	String m_OU = "인증서비스팀";	
	String m_O = "이니텍";
	String m_L = "서울특별시";
	String m_C = "KR";

	//인증서 신청(취소) 성공시 받아오는 값들 : 변경하지 말것
	String m_caSerial = null;
	String m_caSeqNo = null;
	String m_caIssueDate = null;
	String m_caExpireDate = null;
	String m_caRevokeDate = null;
	String m_caRejectReason = null;
	
	//발급(폐기)된 인증서를 PC에 저장(삭제)하기위한 정보 : 변경하지 말것
	String m_caCertString = null;
	String m_orgCertString = null;
	String m_caRevokedCertString = null;

    String base64Cert = null;

%><%

	try {
		if (m_bDebug) System.out.println("INIplugin" + m_How + " : start ip.init");
		
		if(m_bEncrypt && m_IniErrCode == null){
			m_keybits = m_IP.getParameter("keybits");
			m_html5 = m_IP.getParameter("strHtml5");
			if(m_html5==null || m_html5.equals("")) m_html5="false";
			m_ID = m_IP.getParameter("user_id");
			m_REGNO = lpad(m_ID,13, "0");
			//m_REGNO = m_IP.getParameter("user_id");
			//m_PW = m_IP.getParameter("pw");

			m_SEARCHCODE = m_IP.getParameter("searchcode");
			m_SEARCHCONTENTS = m_IP.getParameter("searchcontents");
			
			if (m_How.equals("certNew") || m_How.equals("certRenewal")|| m_How.equals("certRevokeAndNew")){ 
				m_REQ = m_IP.getParameter("req");
				m_CN = m_IP.getParameter("user_id"); //발급자가 id가 되도록수정 2016.10.20
				m_MAIL = m_IP.getParameter("EMAIL");
				m_OU = m_IP.getParameter("PartName"); 
				m_O = m_IP.getParameter("DeptName");
				m_L = m_IP.getParameter("L");
				m_C = m_IP.getParameter("C");
				m_certserial = m_IP.getParameter("serialno");
			}	
		}else{
			m_keybits = request.getParameter("keybits");
			m_html5 = request.getParameter("strHtml5");
			if(m_html5==null || m_html5.equals("")) m_html5="false";
			//사용자 확인 Parameter 입력폼이 추가되면 여기다가 추가하면 됨
			m_ID = request.getParameter("user_id");
			m_REGNO = lpad(m_ID,13, "0");
			//m_REGNO = request.getParameter("regno");
			//m_PW = request.getParameter("pw");

			m_SEARCHCODE = request.getParameter("searchcode");
			m_SEARCHCONTENTS = request.getParameter("searchcontents");
			
			if (m_How.equals("certNew") || m_How.equals("certRenewal")|| m_How.equals("certRevokeAndNew")){ 
				m_REQ = request.getParameter("req");
				m_CN = request.getParameter("UserName"); 
					if(m_CN !=null && !m_CN.equals("")) m_CN=URLDecoder.decode(m_CN,"UTF-8");				
				m_MAIL = request.getParameter("EMAIL");
				m_OU = request.getParameter("PartName");
					if(m_OU !=null && !m_OU.equals("")) m_OU=URLDecoder.decode(m_OU,"UTF-8");
				m_O = request.getParameter("DeptName");
					if(m_O !=null && !m_O.equals("")) m_O=URLDecoder.decode(m_O,"UTF-8");
				m_L = request.getParameter("L");
				m_C = request.getParameter("C");
				m_certserial = request.getParameter("serialno");
			}
		}

		if (m_bDebug) {
			System.out.println("\tID : " + m_ID);
			System.out.println("\tREGNO : " + m_REGNO);
			System.out.println("\tCN : " + m_CN);
			System.out.println("\tEMAIL : " + m_MAIL);
			System.out.println("\tSERIAL : " + m_certserial);			
			System.out.println("\tSEARCHCODE     : " + m_SEARCHCODE);			
			System.out.println("\tSEARCHCONTENTS : " + m_SEARCHCONTENTS);	
			System.out.println("\tm_html5 : " + m_html5);
		}
	} catch(Exception e){
		m_IniErrCode = "INICA70_INIT_ERROR";
		e.printStackTrace();
	}

%><%!
    public static String lpad(String str, int len, String addStr) {
         String result = str;
         if (result == null) return result;
         int templen   = len - result.length();

        for (int i = 0; i < templen; i++){
               result = addStr + result;
         }
         
         return result;
     }
	 
	 
%>
