<%@ page language="java" contentType="application/json; charset=UTF-8" pageEncoding="UTF-8"%>

<%@ page import="sun.misc.HexDumpEncoder"%>
<%@ page import="sun.misc.BASE64Decoder"%>
<%@ page import="sun.misc.BASE64Encoder"%>

<%@ page import="java.io.ByteArrayOutputStream"%>
<%@ page import="java.io.BufferedInputStream"%>
<%@ page import="java.nio.ByteBuffer"%>
<%@ page import="java.io.OutputStreamWriter"%>
<%@ page import="java.net.Socket"%>
<%@ page import="java.net.SocketAddress"%>
<%@ page import="java.net.InetSocketAddress"%>
<%@ page import="java.io.DataOutputStream"%>
<%@ page import="java.io.DataInputStream"%>
<%@ page import="java.io.InputStream"%>
<%@ page import="java.io.OutputStream"%>
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
	try{
		/* 	parameter
		 – type: 0 (default) (CA로 송신 후 수신, ex) genm/genp, ir/ip )
		 1 (CA 로 송신만 하고 수신하지 않음, ex) conf )
		 - msg: CA 로 bypass 할 메시지 (genm, ir, conf 등)
		 - ip: CA IP
		 - port : CA Port 
		 */
	
		StringBuffer traceLog = new StringBuffer();
		traceLog.append("[Request Information]");
		traceLog.append(" - Client IP : ").append(request.getRemoteAddr()).append("\n");
		traceLog.append(" - Server IP : ").append(request.getLocalAddr()).append(":").append(request.getLocalPort()).append("\n");
		
		// get parameter type, msg, ip, port 
		String type = request.getParameter("type");
		String msg = request.getParameter("msg");
		String msg2 = request.getParameter("msg2");
		String msg3 = request.getParameter("msg3");
		String ip = request.getParameter("ip");
		String port = request.getParameter("port");
	
		traceLog.append(" -- param[type] : ").append(type).append("\n");
		traceLog.append(" -- param[ip] : ").append(ip).append("\n");
		traceLog.append(" -- param[port] : ").append(port).append("\n");
		traceLog.append(" -- param[msg] : ").append(msg).append("\n");
		traceLog.append(" -- param[msg.length] : ").append(msg.length()).append("\n");
		traceLog.append(" -- param[msg2] : ").append(msg2).append("\n");
		traceLog.append(" -- param[msg2.length] : ").append(msg2.length()).append("\n");
		traceLog.append(" -- param[msg3] : ").append(msg3).append("\n");
		traceLog.append(" -- param[msg3.length] : ").append(msg3.length()).append("\n");
		/*###*/
		if(PRINT_LOG){
			System.out.println(traceLog.toString());
		}
	
		// b64dec_msg = base64decode(msg)
		byte[] b64dec_msg = new BASE64Decoder().decodeBuffer(msg);
		byte[] b64dec_msg2 = new BASE64Decoder().decodeBuffer(msg2);
		byte[] b64dec_msg3 = new BASE64Decoder().decodeBuffer(msg3);
	// 	byte[] b64dec_msg = Base64Util.decode(msg.getBytes());
	// 	byte[] b64dec_msg2 = Base64Util.decode(msg2.getBytes());
	// 	byte[] b64dec_msg3 = Base64Util.decode(msg3.getBytes());
	
		// connect CA ip:port
		// connect CA ip:port
		SocketAddress address = new InetSocketAddress(ip, Integer.parseInt(port));
		Socket socket = new Socket();
		try{
			socket.setSoTimeout(5000);		// InputStream에 대한 TimeOut
			socket.connect(address, 3000);	// connection에 대한 TimeOut
			
		}catch(Exception es){
			throw new Exception("[ERROR_201]Socket Connection Fail : " + es.toString());
		}
		
		OutputStream bos = null;
		InputStream bis = null;
		try{
			bos = socket.getOutputStream();
			bis = socket.getInputStream();
			
			ByteBuffer buff = ByteBuffer.allocate(4 + 1 + b64dec_msg.length);
			buff.putInt(b64dec_msg.length + 1);
			buff.put((byte) 0x00);
			buff.put(b64dec_msg);
			
			StringBuffer sendLog = new StringBuffer();
			sendLog.append("[Send Infomation]").append(type);
			sendLog.append(" - Client IP : ").append(request.getRemoteAddr()).append("\n");
			sendLog.append(" --(01) b64dec_msg : ").append(b64dec_msg).append("\n");
			sendLog.append(" --(02) b64dec_msg.length : ").append(b64dec_msg.length).append("\n");
			
			// send to CA : length(4byte: net Order)||version(1byte: 0x00)||b64dec_msg
			byte[] sendMsg = buff.array();
			bos.write(sendMsg);
			bos.flush();
			
			sendLog.append(" --(03) sendMsg.length : ").append(sendMsg.length).append("\n");
			/*###*/
			if(PRINT_LOG){
				System.out.println(sendLog.toString());
			}
			
		
			// recv : length(4byte)||version(1byte: 0x05)||msg
			byte[] bLen = new byte[4];
			bis.read(bLen);
			byte[] bVersion = new byte[1];
			bis.read(bVersion);
		
			StringBuffer receiveLog = new StringBuffer();
			receiveLog.append("[Receive Infomation]");
			receiveLog.append(" - Client IP : ").append(request.getRemoteAddr()).append("\n");
			receiveLog.append(" -- length : ").append( dumpHex(bLen)).append("\n");
			receiveLog.append(" -- Version : ").append( dumpHex(bVersion)).append("\n");
			
			int iLen = ((bLen[0] & 0xFF) << 24) + ((bLen[1] & 0xFF) << 16)
					+ ((bLen[2] & 0xFF) << 8) + (bLen[3] & 0xFF);
			int remain = iLen;
			// byte[] bMsg = new byte[iLen-1];
			byte[] tmp = new byte[3072];
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			while (true) {
				int l = bis.read(tmp);
				receiveLog.append(" -- read : ").append( dumpHex(tmp)).append("\n");
		
				if (l == -1) {
					break;
				}
				if (l <= 0)
					continue;
				baos.write(tmp, 0, l);
				if (baos.size() >= iLen - 1) {
					break;
				}
			}
		
			byte[] bMsg = baos.toByteArray();
			receiveLog.append(" -- ALL DATA : ").append( dumpHex(bMsg)).append("\n");
			String b64_msg = new BASE64Encoder().encode(bMsg);
			receiveLog.append(" -- Response Base64 : ").append( b64_msg).append("\n");
			/*###*/
			if(PRINT_LOG){
				System.out.println(receiveLog.toString());
			}
			
			
			
			
			
			ByteBuffer buff2 = ByteBuffer.allocate(4 + 1 + b64dec_msg2.length);
			buff2.putInt(b64dec_msg2.length + 1);
			buff2.put((byte) 0x00);
			buff2.put(b64dec_msg2);
		
			// send to CA : length(4byte: net Order)||version(1byte: 0x00)||b64dec_msg
			byte[] sendMsg2 = buff2.array();
			bos.write(sendMsg2);
			bos.flush();
			StringBuffer sendLog2 = new StringBuffer();
			sendLog2.append("[Send Infomation2]").append(type);
			sendLog2.append(" - Client IP : ").append(request.getRemoteAddr()).append("\n");
			sendLog2.append(" --(01) sendMsg2 : ").append(sendMsg2).append("\n");
			sendLog2.append(" --(02) sendMsg2.length : ").append(sendMsg2.length).append("\n");
			/*###*/
			if(PRINT_LOG){
				System.out.println(sendLog2.toString());
			}
			
		
			// recv : length(4byte)||version(1byte: 0x05)||msg
			byte[] bLen2 = new byte[4];
			bis.read(bLen2);
			byte[] bVersion2 = new byte[1];
			bis.read(bVersion2);
			
			StringBuffer receiveLog2 = new StringBuffer();
			receiveLog2.append("[Receive Infomation2]");
			receiveLog2.append(" - Client IP : ").append(request.getRemoteAddr()).append("\n");
			receiveLog2.append(" -- length : ").append( dumpHex(bLen2)).append("\n");
			receiveLog2.append(" -- Version : ").append( dumpHex(bVersion2)).append("\n");
			
			int iLen2 = ((bLen2[0] & 0xFF) << 24) + ((bLen2[1] & 0xFF) << 16)
					+ ((bLen2[2] & 0xFF) << 8) + (bLen2[3] & 0xFF);
			int remain2 = iLen2;
			// byte[] bMsg = new byte[iLen-1];
			
				
			byte[] tmp2 = new byte[4096];
			ByteArrayOutputStream baos2 = new ByteArrayOutputStream();
			while (true) {
				int l = bis.read(tmp2);
				
				receiveLog2.append(" -- read2 : ").append( dumpHex(tmp2)).append("\n");
				
				if (l == -1) {
					break;
				}
				if (l <= 0)
					continue;
				baos2.write(tmp2, 0, l);
				if (baos2.size() >= iLen2 - 1) {
					break;
				}
			}
		
			byte[] bMsg2 = baos2.toByteArray();
			receiveLog2.append(" -- ALL DATA2 : ").append( dumpHex(bMsg2)).append("\n");
			
			String b64_msg2 = new BASE64Encoder().encode(bMsg2);;
			receiveLog2.append(" -- Response Base64 : ").append( b64_msg2).append("\n");
			/*###*/
			if(PRINT_LOG){
				System.out.println(receiveLog2.toString());
			}
			
			out.print(b64_msg2);
		
			// confirm send 
			ByteBuffer buff3 = ByteBuffer.allocate(4 + 1 + b64dec_msg3.length);
			buff3.putInt(b64dec_msg3.length + 1);
			buff3.put((byte) 0x00);
			buff3.put(b64dec_msg3);
		
			// send to CA : length(4byte: net Order)||version(1byte: 0x00)||b64dec_msg
			byte[] sendMsg3 = buff3.array();
			bos.write(sendMsg3);
			bos.flush();
			/*###*/
			if(PRINT_LOG){
				System.out.println("sendMsg3 : " + dumpHex(sendMsg3));
			}
		}catch(Exception ex){
			throw new Exception("[ERROR_202]Socket Read/Write Fail : " + ex.toString());
		} finally{
			try{if(bos!=null) bos.close();}catch(Exception ee){}
			try{if(bis!=null) bis.close();}catch(Exception ee){}
			try{if(socket!=null) socket.close();}catch(Exception ee){}
		}
	}catch(Exception e){
		//if(PRINT_LOG){
			System.err.println(e.toString());
		//}
		out.print(e.toString());
		out.flush();
	}
%>
