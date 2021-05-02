<%@ page language="java" %><%@ page contentType="text/html" %><%@ page import=" javax.servlet.*,javax.servlet.http.*,java.io.*,sun.misc.*,com.initech.iniplugin.Nonce,java.net.*,java.util.Enumeration" %><%
 	String e2e_UniqueKey = null;
	e2e_UniqueKey = request.getParameter("UniqueKey");
	String time= Long.toString(System.currentTimeMillis()) + ((int)0x0ff & java.net.InetAddress.getLocalHost().getAddress()[3]);  
	Nonce e2e_value = new Nonce();
	e2e_value.setValue(e2e_UniqueKey+"|"+time);
	session.setAttribute("E2ERandom", e2e_value);	
	try { 	
		ByteArrayInputStream bais = new ByteArrayInputStream(time.getBytes()); 
		ByteArrayOutputStream baos = new ByteArrayOutputStream(); 
		BASE64Encoder b64ec = new BASE64Encoder(); 
		b64ec.encodeBuffer(bais, baos);
		byte[] bytes = baos.toByteArray(); 
		out.print(new String(bytes));
	} catch (Exception e){ };
%>