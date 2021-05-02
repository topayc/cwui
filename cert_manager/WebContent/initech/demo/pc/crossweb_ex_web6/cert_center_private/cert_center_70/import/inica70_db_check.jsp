<%@page import="java.sql.*" %><%-- 
	//************************************************
	//  입력 : 사용자 신분확인정보(m_ID, m_PW .. )
	//  출력 : DN정보(m_CN, m_MAIL, m_OU, m_O, m_L, m_C)
	//************************************************
--%><% 
if (m_IniErrCode == null) 
{
	if (m_bDebug) System.out.println(m_ID + m_How + " : host(DB) connect start ...");
		
	Connection conn = null;
	Statement stmt = null;
	ResultSet rs = null;
    
	String url = "jdbc:oracle:thin:@172.20.26.23:1521:INIDEMO";
	String user_id = "tsra7";
	String user_pw = "tsra7";
	
	 try {
			Class.forName("oracle.jdbc.driver.OracleDriver");
			//Class.forName("jeus.jdbc.pool.Driver");
				if (m_bDebug) System.out.println(m_ID + m_How + " : host(DB) connect OracleDriver.");
	    } catch ( Exception e ) {
			if (m_bDebug) System.out.println(m_ID+", inica70_db_check.jsp ERROR: Can't load Driver..: "+ e.getMessage()); 
			out.println("<script language='javascript'> alert('인증서버 DataBase Driver 로딩에 실패하였습니다.'); </script>");
			return;				
	   }

		try {
			conn = DriverManager.getConnection( url , user_id, user_pw );
			//conn = DriverManager.getConnection( "jdbc:jeus:pool:finescertcenterdb", null );
			if (m_bDebug) System.out.println(m_ID + m_How + " : host(DB) connect getConnection.");
		} catch ( SQLException se ) {
			if (m_bDebug) System.out.println(m_ID+", inica70_db_check.jsp ERROR: Can't Connect DataBase.."+ se.getMessage());
			out.println("<script language='javascript'> alert('인증서버 DataBase 연결에 실패하였습니다.'); </script>");

		}

  try{

		stmt = conn.createStatement();
         //유효하면 V, 효력정지면 S
		if(m_How.equals("certRevoke")||m_How.equals("certRevokeAndNew")){
			
			rs = stmt.executeQuery( "select serial,usercertificate from LDAP_INFO where userid='" + m_ID + "' and status='V'");

			while( rs.next() ) {
				m_certserial = rs.getString("serial");
				byte[] i_db_cert = rs.getBytes("usercertificate");
				if(i_db_cert.length>0) m_certs = new String(i_db_cert);
			}

		}else{
			
			rs = stmt.executeQuery( "select serial from LDAP_INFO where userid='" + m_ID + "' and status='V'");
		
			while( rs.next() ) {
				m_certserial = rs.getString("serial");
			}

		}

		if (m_bDebug) System.out.println(m_ID+", DB search ");
		if (m_bDebug) System.out.println(m_ID+","+m_How + " : m_certserial : "+m_certserial+",m_certs : "+m_certs);	

		if ((m_How.equals("certNew"))&& (m_certserial != null)){
		
			m_IniErrCode = "410";
			//m_IniErrMsg = java.net.URLEncoder.encode("유효한 인증서가 이미 발급되어 있습니다.재발급하시기 바랍니다.","EUC-KR");
			out.println("<script language='javascript'> alert('유효한 인증서가 이미 발급되어 있습니다.재발급하시기 바랍니다'); </script>");
			//response.sendRedirect("err.jsp?id=" + m_ID + "&how=" + m_How + "&code=" + m_IniErrCode + "&msg=" + m_IniErrMsg);
			return;	
		}
		
		if(m_How.equals("certRevoke")){
			 if ( m_certserial == null){		
					m_IniErrCode = "INICA410"; //폐기할 인증서가 없으므로 에러 종료처리
					//m_IniErrMsg = java.net.URLEncoder.encode("RA에 userid가 없거나 폐기 가능한 유효한 인증서가 DB에 없습니다.","EUC-KR");
					out.println("<script language='javascript'> alert('RA에 userid가 없거나 폐기 가능한 유효한 인증서가 DB에 없습니다');</script>");
					//response.sendRedirect("err.jsp?id=" + m_ID + "&how=" + m_How + "&code=" + m_IniErrCode + "&msg=" + m_IniErrMsg);
					return;
		       }		
		}
		
		if(m_How.equals("certRevokeAndNew")){
				if ( m_certserial != null){		
					//m_IniErrCode = "INICA410"; //RA에 userid가 없거나 폐기 가능한 유효한 인증서가 없음
					m_How = "certRevoke";
		        }	
		}	
						
	} catch(Exception e) {
		if (m_bDebug) System.out.println(m_ID+", DB ERROR: "+ e.getMessage());
	} finally {
		
		  if (rs != null) {
			  rs.close();
		  }
		  if (stmt != null) {
		      stmt.close();
		  }
		  if (conn != null) {
			  conn.close();
		  }
		  if (m_bDebug) System.out.println(m_ID +","+ m_How + " : host(DB) connect end ...");
	}

}
%>
