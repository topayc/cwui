<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.net.URLConnection"%>
<%@ page import="java.util.Enumeration"%>
<%@ page import="java.net.URLEncoder"%>
<%@ page import="java.io.*, java.net.HttpURLConnection, java.net.URL"%>
<%!

private static final boolean PRINT_LOG = false;

private static final char[] hexDigits = { '0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F' };

private static void appendHex(byte hex, StringBuffer str)	{
	str.append((char)hexDigits[(hex >>> 4) & 0x0F]);
	str.append((char)hexDigits[ hex        & 0x0F]);
}

public static String dumpHex(byte[] byteArray) {
	StringBuffer strBuf = new StringBuffer();

	char separator = (char)0x00;
	int length = byteArray.length;
	for (int i = 0; i < length; i++) {
		appendHex(byteArray[i], strBuf);
		if (separator != (char) 0x00 && i != length - 1) {
			strBuf.append(separator);
		}
	}
	return strBuf.toString();
}

private static byte parseHexaCharactor(char ch) {
	if ('0' <= ch && ch <= '9') {
		return (byte) (ch - 48);
	} else if ('A' <= ch && ch <= 'F') {
		return (byte) (ch - 55);
	} else if ('a' <= ch && ch <= 'f') {
		return (byte) (ch - 87);
	} else {
		return (byte) 0x00;
	}
}

public static byte[] stringToHexByte(String hexString) {
	StringBuffer sb = new StringBuffer();

	char current;
	int i;

	for (i = 0; i < hexString.length(); i++) {
		current = hexString.charAt(i);
		if (('0' <= current && current <= '9')
				|| ('A' <= current && current <= 'F')
				|| ('a' <= current && current <= 'f')) {
			sb.append(current);
		}
	}

	int leftover = sb.length() % 2;
	byte[] ret = new byte[sb.length() / 2 + leftover];
	if (leftover == 1) { // odd number of half hexadecimals
		ret[0] = parseHexaCharactor(sb.charAt(0));
		for (i = 0; i < sb.length() / 2; i++) {
			ret[i + 1] = (byte) ((parseHexaCharactor(sb.charAt(2 * i + 1)) << 4) | (parseHexaCharactor(sb
					.charAt(2 * i + 2))));
		}
	} else {
		for (i = 0; i < sb.length() / 2; i++) {
			ret[i] = (byte) ((parseHexaCharactor(sb.charAt(2 * i)) << 4) | (parseHexaCharactor(sb
					.charAt(2 * i + 1))));
		}
	}

	return ret;
}
%>
<%
	try {
		String serverName = request.getServerName();
		int serverPort = request.getServerPort();
		String contextPath = request.getContextPath();
		
		//연결할 controller의 @RequestMapping Value
		String chartUrl = "http://demo.initech.com:8111/initech/html5/cmp/cmp_gate2.jsp";
;
		Enumeration<?> params_enm = request.getParameterNames();
		StringBuffer paramsSb = new StringBuffer();
		while (params_enm.hasMoreElements()) {
			String paramName = params_enm.nextElement().toString();
			paramsSb.append(paramName);
			paramsSb.append("=");
			paramsSb.append(URLEncoder.encode(request.getParameter(paramName)));
			paramsSb.append("&");
		}
		
		String urlParameters  = paramsSb.toString().substring(0, paramsSb.toString().length() -1);

		StringBuffer traceLog = new StringBuffer();
		traceLog.append("[Request Information]");
		traceLog.append(" - Client IP : ").append(request.getRemoteAddr()).append("\n");
		traceLog.append(" - Server IP : ").append(request.getLocalAddr()).append(":").append(request.getLocalPort()).append("\n");
		traceLog.append(" - Target URL : ").append(chartUrl).append("\n");
		traceLog.append(" - urlParameters : ").append(urlParameters).append("\n");
		
		byte[] postData = urlParameters.getBytes("UTF-8");
// 		int postDataLength = postData.length;
		traceLog.append(" - by pass Length : ").append(postData.length).append("\n");
		/*###*/
		if(PRINT_LOG){
			System.out.print(traceLog.toString());
		}
		
		if (chartUrl != null) {
			//chart 요청 url 
			String address = chartUrl;

			URL url = null;
			HttpURLConnection conn = null;
			try{
				url = new URL(address);
				conn = (HttpURLConnection) url.openConnection();
			}catch(Exception es){
				throw new Exception("[ERROR_211]HTTP Connection Fail : " + es.toString());
			}
			
			try{
				// 헤더 세팅
				conn.setRequestMethod("POST");
				conn.setDoOutput( true );
				conn.setDoInput(true);
				conn.setUseCaches(false);
				conn.setDefaultUseCaches(false);
				// charset 세팅
				conn.setRequestProperty("charset", "utf-8");
				// param 세팅
	// 			conn.setRequestProperty("Content-Length", Integer.toString( postDataLength ));
	// 			conn.getOutputStream().write(postData);
				
				// 연결
	// 			conn.connect();
				
				OutputStream opstrm = conn.getOutputStream();
				opstrm.write(postData);
				opstrm.flush();
	// 			opstrm.close();
	
				String buffer = null;
				StringBuffer resultBuffer = new StringBuffer();
				BufferedReader in = new BufferedReader(new InputStreamReader (conn.getInputStream()));
				while ((buffer = in.readLine()) != null){
					resultBuffer.append(buffer);
				}
				in.close();
				if(PRINT_LOG){
					System.out.println("[Result] : " + resultBuffer.toString());
					System.out.println("[Result.length] : " + resultBuffer.toString().length());
				}
				
				out.clear();
				out.write(resultBuffer.toString());
				out.flush();
			}catch(Exception ex){
				throw new Exception("[ERROR_212]HTTP Read/Write Fail : " + ex.toString());
			}
		}
	} catch (Exception e) {
		//if(PRINT_LOG){
			System.err.println(e.toString());
		//}
		out.print(e.toString());
		out.flush();
	}
%>
