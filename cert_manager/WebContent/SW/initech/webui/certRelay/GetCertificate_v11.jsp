<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.security.SecureRandom"%>
<%@ page import="java.io.*,java.util.*,java.lang.*,java.text.*" %>
<%@ include file="VFileTable.jsp"%>
<%!
	/** <환경설정부분> 시작 */
	/**
	 * NAS구성일 경우 VFileTableStorePath 를 설정(인증서가 저장될 디렉토리). ex:) "/usr/certImport/v11"
	 * (주의할것인 이 디렉토리는 인증서가져오기 용도로만 쓰는 디렉토리로 사용할것. 인식할 수 없는 파일이 있으면 삭제됨)
	 * 이 값을 설정할 경우 THIS_SERVER_INDEX = 0, SERVER_URLS = new String[0] 와 같이 설정하도록 해야함
	 */
	String VFileTableStorePath = null;

	/**
	 * 이 jsp 가 설치된 서버 인덱스 지정. (0부터 시작됨)
	 * 각 서버는 unique 한 인덱스를 가지고 있어야 하며 단말기에서 인증서를 요청할때
	 * 수신된 인증코드의 첫번째 블럭에서 서버인덱스번호를 추출하여 해당 서버인덱스 URL로 bypass 함
	 */
	int THIS_SERVER_INDEX = 0;
	
	/** 각 서버의 인증서 가져오기 URL. */
	final String SERVER_URLS[] = new String[0];
	/*
	final String SERVER_URLS[] = {
		"http://test1/CertMgmt/GetCertificate.jsp",
		"http://test2/CertMgmt/GetCertificate.jsp",
		"http://test3/CertMgmt/GetCertificate.jsp"
	};
	*/
	
	String listViewPwd = "123ewq"; //버퍼에 저장된 인증서 목록 조회 패스워드
	long listRemoveTimeout = 60000 * 3; //인증서 목록 지우기 타임아웃 설정 ( 5분설정예 : "60000 * 5" ) 
	/** <환경설정부분> 끝 */
	
	/** 상수정의 */
	final static String BYPASS_CODE = "aUuolqpzhJw1imrn3gx5iPWM8Iq";
	final static String CERTTABLE_KEY = "CertTable_v11";
	
	final static int MIN_AUTHCODE_SIZE = 8;
	final static int MAX_AUTHCODE_SIZE = 32;
	final static String ACTION_REQ_AUTHCODE = "REQ_AUTHCODE";
	final static String ACTION_EXPORT = "EXPORT";
	final static String ACTION_IMPORT = "IMPORT";
	final static String ACTION_LISTVIEW = "LISTVIEW";
	final static int AUTHCODE_BLOCK_SIZE = 4;
	
	final int SERVER_NUM = SERVER_URLS.length;
	
	/** 생성할 숫자범위를 미리 계산 */
	final int AUTHCODE_BLOCK_GSCOPE = (int)Math.pow(10, AUTHCODE_BLOCK_SIZE);
	
	/** 첫번째 생성블럭의 범위를 미리 계산. 단 첫번째 블럭에는 서버인덱스를 계산하여 생성할 수 있도록 서버갯수만큼 뺌 */
	final int FIRST_AUTHCODE_BLOCK_GSCOPE = (10^AUTHCODE_BLOCK_SIZE) - (SERVER_NUM+2);
	
	/**
	 * data Integer를 String으로 변환하고 size 크기에 맞추어 앞에 '0'를 패딩시킨다.
	 * @param size 생성할 문자열의 길이
	 * @param data Integer 수
	 * @return
	 */
	public static String toZeroPad(int size, int data) {
		String intToStr = String.valueOf( data );
		int zeroPadSize = size - intToStr.length();
		if( zeroPadSize <= 0 ) {
			return intToStr;
		}
		
		byte zeroPadded[] = new byte[size];
		
		for (int i = 0; i < zeroPadSize ; i++) {
			zeroPadded[i] = '0';
		}
		
		byte srcBytes[] = intToStr.getBytes();
		System.arraycopy(srcBytes, 0, zeroPadded, zeroPadSize, srcBytes.length);
		
		return new String(zeroPadded);
	}

	String generateAuthCode(int size) {
		Random rand = null;
		try {
			rand = SecureRandom.getInstance("SHA1PRNG");
		} catch(Exception ex) {
			rand = new Random(System.currentTimeMillis());
		}
		
		StringBuffer sb = new StringBuffer();
		int blockCount = (size/AUTHCODE_BLOCK_SIZE);
		for( int i=0; i<blockCount; i++ ) {
			int blockInt = 0;
			/** 첫번째 블럭코드는 이 서버의 인덱스에 맞추도록 한다 */
			if( i == 0 && SERVER_NUM > 0 ) {
				blockInt = rand.nextInt( FIRST_AUTHCODE_BLOCK_GSCOPE );
				int accServerIndex = blockInt%SERVER_NUM;
				/** 서버인덱스 할당 */
				if( accServerIndex != THIS_SERVER_INDEX ) {
					blockInt += (THIS_SERVER_INDEX - accServerIndex);
				}
			} else {
				blockInt = rand.nextInt( AUTHCODE_BLOCK_GSCOPE );
			}
			String blockIntStr = toZeroPad( AUTHCODE_BLOCK_SIZE, blockInt );
			sb.append( blockIntStr );
		}
		return sb.toString();
	}
	
	int getServerIndex(String authCode) {
		if( SERVER_NUM > 0 ) {
			String firstBlock = authCode.substring(0,AUTHCODE_BLOCK_SIZE);
			int blockInt = Integer.parseInt( firstBlock );
			return (blockInt % SERVER_NUM);
		} else {
			return 0;
		}
	}
	
	/** XSSFilter */
	String XSSFilter(String sInvalid) {
		if (sInvalid == null || sInvalid.equals("")) {
			return "";
		}
		String sValid = sInvalid.trim();
		sValid = sValid.replaceAll("&", "&amp;");
		sValid = sValid.replaceAll("<", "&lt;");
		sValid = sValid.replaceAll(">", "&gt;");
		sValid = sValid.replaceAll("\"", "&qout;");
		sValid = sValid.replaceAll("\'", "&#039;");
		sValid = sValid.replaceAll("\\n", "");
		sValid = sValid.replaceAll("\\r", "");
		return sValid;
	}

	/**
	 * Context 에 저장되는 Hashtable
	 * Object[]{Long, String} 가 저장된다 (저장시간, 인증서)
	 */
	synchronized Hashtable getTable(ServletContext application) {
		Hashtable table = (Hashtable)application.getAttribute(CERTTABLE_KEY);
		if( table == null ) {
			if( VFileTableStorePath != null ) {
				table = new VFileTable( VFileTableStorePath, "_v11" );
			} else {
				table = new Hashtable();
			}
			application.setAttribute(CERTTABLE_KEY, table);
		} else {
			String tableClassName = table.getClass().getName();
			/** 파일테이블경로가 설정되어 있지 않은데 컨텍스트에 저장된 테이블이 VFileTable 클래스일 경우 */
			if( VFileTableStorePath == null && tableClassName.indexOf( "VFileTable" ) != -1 ) {
				table = new Hashtable();
				application.setAttribute(CERTTABLE_KEY, table );
			} 
			/** 파일테이블경로가 설정되어 있는데 컨텍스트에 저장된 테이블이 VFileTable 클래스가 아닐 경우 */
			else if( VFileTableStorePath != null && tableClassName.indexOf( "VFileTable" ) == -1 ) {
				table = new VFileTable( VFileTableStorePath, "_v11" );
				application.setAttribute(CERTTABLE_KEY, table );
			}
		}
		return table;
	}
	
	/** 비어있는 문자열일 경우 null 리턴 */
	String emptyToNull(String data) {
		if( data != null && "".equals( data.trim() ) ) {
			return null;
		}
		return data;
	}
	
	/** timeout 된 리스트 제거 */
	void removeTimeoutList(Hashtable table) {
		Enumeration keys = table.keys();
		while( keys.hasMoreElements() ) {
			String key = (String)keys.nextElement();
			Object target[] = (Object[])table.get(key);
			if( target == null ) continue;
			Long storedTime = (Long)target[0];
			long elapsedTime = System.currentTimeMillis()-storedTime.longValue();
			if( elapsedTime > listRemoveTimeout ) {
				table.remove( key );
			}
		}
	}
	
	/** 
	 * 인증코드의 첫번째 블럭에서 계산된 서버인덱스 주소로 bypass 할 경우 호출되는 함수 
	 */
	void bypassAction(int serverIndex, HttpServletRequest request, HttpServletResponse response, JspWriter out) throws IOException {
		String query = request.getQueryString();
		String targetServerUrl = SERVER_URLS[serverIndex] + "SVer=1.1?bypassCode=" + BYPASS_CODE;
		String connUrlStr = (query != null && !query.equals("") ? targetServerUrl+"&"+query : targetServerUrl);
		java.net.URL url = new java.net.URL( connUrlStr );
		java.net.URLConnection urlConn = url.openConnection();
		urlConn.setRequestProperty("Content-Type", request.getContentType());
		urlConn.setDoOutput(true);
		OutputStream centerOuts = urlConn.getOutputStream();
		centerOuts.write( toByteArray(request.getInputStream()) );
		centerOuts.flush();
		centerOuts.close();
		InputStream centerIns = urlConn.getInputStream();
		byte readData[] = toByteArray( centerIns );
		centerIns.close();
		
		/** for iPhone.... */
		if( urlConn.getHeaderField("IsAuthCodeResponse") != null ) {
			response.setHeader("IsAuthCodeResponse","YES");
		}
		if( urlConn.getHeaderField("IsCertRoamingResponse") != null ) {
			response.setHeader("IsCertRoamingResponse","YES");
		}
		out.print( new String(readData) );
	}
	
	byte[] toByteArray(InputStream input) throws IOException {
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		byte[] buffer = new byte[2048];
		long count = 0;
		int n = 0;
		while (-1 != (n = input.read(buffer))) {
			bos.write(buffer, 0, n);
			count += n;
		}
		return bos.toByteArray();
	}
%><%
	response.setHeader("Cache-Control","no-store");
	response.setHeader("Pragma", "no-cache");
	response.setDateHeader("Expires", 0);
	if(request.getProtocol().equals("HTTP/1.1")) {
	   response.setHeader("Cache-Control", "no-cache");
	}
	
	/**
	 * bypass 일 경우 Secure-SessionID가 존재하지 않기 때문에
	 * (즉 암호화 되지 않음)bypassCode 확인
	 */
	String sfilterSID = request.getHeader("Secure-SessionID");
	if( sfilterSID == null ) {
		/*
		if( !BYPASS_CODE.equals( request.getParameter("bypassCode") ) ) {
			out.print("ERROR$ACCESS_DENIED$");
			return;
		}
		*/
	}
	
	/**
	 * HashMap 과 다르게 Hashtable은 Thread-safe 오브젝트임.
	 * 업무 특성상 많은 오브젝트가 저장될수는 없기 때문에 요청처리시
	 * 타임아웃된 리스트를 제거하여도 성능에 문제 없음
	 */
	Hashtable certTable = getTable( application );
	removeTimeoutList( certTable );
	
	String action = XSSFilter(request.getParameter("Action"));
	String strRegNum = XSSFilter(request.getParameter("AuthNum"));
	String strEncCert = XSSFilter(request.getParameter("EncCert"));
	String pwd = XSSFilter(request.getParameter("Pwd"));
	
	strRegNum = emptyToNull( strRegNum );
	strEncCert = emptyToNull( strEncCert );
	
	/**
	 * 수신된 인증코드에서 계산된 서버인덱스가 자신의 인덱스(THIS_SERVER_INDEX)와 다를 경우
	 * bypass 처리함
	 */
	if( strRegNum != null ) {
		int serverIndex = getServerIndex( strRegNum );
		if( serverIndex != THIS_SERVER_INDEX ) {
			bypassAction( serverIndex, request, response, out );
			return;
		}
	}
	
	/** 단말기에서 요청한 인증코드 처리 부분 */
	if( ACTION_REQ_AUTHCODE.equals(action) ) {
		/** for iPhone */
		response.setHeader("IsAuthCodeResponse","YES");
		int authCodeSize = 0;
		try {
			authCodeSize = Integer.parseInt( request.getParameter("Size") );
		} catch(Exception ex) {
			out.print("ERROR$INVALID_SIZE$요청한 인증코드의 크기가 부적절합니다.("+request.getParameter("Size")+")");
			return;
		}
		
		if( authCodeSize % AUTHCODE_BLOCK_SIZE != 0 ) {
			out.print("ERROR$INVALID_AUTHCODE_SIZE$인증코드는 블럭크기("+AUTHCODE_BLOCK_SIZE+")의 배수이어야 합니다");
			return;
		}
		if( authCodeSize < MIN_AUTHCODE_SIZE || authCodeSize > MAX_AUTHCODE_SIZE ) {
			out.print("ERROR$INVALID_AUTHCODE_SIZE$요청한 인증코드의 길이("+authCodeSize+")는 허용되지 않습니다 (허용길이:"+MIN_AUTHCODE_SIZE+"-"+MAX_AUTHCODE_SIZE+")");
			return;
		}
		
		String generatedCode = null;
		/** 최대 retry 횟수는 1000 으로 제한 */
		for( int i=0; i<1000; i++ ) {
			String tempGenCode = generateAuthCode( authCodeSize );
			if( !certTable.containsKey( tempGenCode ) ) {
				generatedCode = tempGenCode;
				break;
			}
		}
		
		if( generatedCode != null ) {
			Object storeObject[] = new Object[]{new Long(System.currentTimeMillis()), null};
			certTable.put( generatedCode, storeObject );
			out.print("OK$"+generatedCode);
		} else {
			out.print("ERROR$TOO_MANY_SERVICES$서비스가 너무 많습니다");
		}
	} 
	/** ActiveX 에서 전송된 인증서 저장 처리 부분 */
	else if( ACTION_EXPORT.equals(action) ) {
		if( strRegNum == null || strEncCert == null ) {
			out.print("ERROR$NO_PARAMS$인증코드 또는 인증서가 수신되지 않았습니다");
			return;
		}
		
		Object storedObject[] = (Object[])certTable.get( strRegNum );
		if( storedObject == null ) {
			out.print("ERROR$INVALID_AUTHCODE$인증코드가 맞지 않습니다");
			return;
		}
		storedObject[0] = new Long(System.currentTimeMillis());
		storedObject[1] = strEncCert;

		/** 다시 저장함. NAS구성일 경우를 위해 */
		certTable.put( strRegNum, storedObject );
		out.println("OK");
	}
	/** 스마트폰에서 인증서를 가져오기할때의 처리 부분 */
	else if ( ACTION_IMPORT.equals(action) ) {
		/** for iPhone */
		response.setHeader("IsCertRoamingResponse","YES");
		if( strRegNum != null ) {
			Object target[] = (Object[])certTable.get( strRegNum );
			if( target != null ) {
				if( target[1] != null ) {
					out.println("OK$"+target[1]);
					certTable.remove( strRegNum );
				} else {
					out.println("ERROR$NO_CERT$등록된 인증서가 없음");
					return;
				}
			} else {
				out.println("ERROR$BAD_PARAMS$인증코드가 잘못되었거나 시간이 너무 지체됨");
				return;
			}
		} else {
			out.println("ERROR$NO_PARAMS$수신된 인증코드가 없음");
			return;
		}
	}
	/** 인증서 목록 조회 (브라우져) */
	else if ( ACTION_LISTVIEW.equals(action) ) {
		if( listViewPwd.equals(pwd) ) {
			Enumeration keys = certTable.keys();
			int count = 0;
			while( keys.hasMoreElements() ) {
				String key = (String)keys.nextElement();
				Object target[] = (Object[])certTable.get(key);
				if( target == null ) continue;
				Long storedTime = ((Long)target[0]);
				String encCert = ((String)target[1]);
				if( encCert != null && encCert.length() > 30 ) {
					// encCert = encCert.substring(0,30);
				}
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy.MM.dd HH:mm:ss");
				out.println("(" + (++count) + ")[" + sdf.format(new Date(storedTime.longValue())) + "][" + key + "][" + encCert + "]<br>");
			}
		}
		/** 암호입력이 틀렸다는 내용은 표시하지 않음 */
	}
	/** Unknown */
	else {
		out.println("Unknown action : "+action);
	}
%>
