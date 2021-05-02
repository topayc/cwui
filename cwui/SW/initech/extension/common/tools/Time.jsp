<%@ page language="java" contentType="text/html;charset=euc-kr" import=" javax.servlet.*,javax.servlet.http.*,java.io.*,sun.misc.*"%><% 
String str = null; 
String time = Long.toString(System.currentTimeMillis() / 1000); 
try { 	
	ByteArrayInputStream bais = new ByteArrayInputStream(time.getBytes()); 
	ByteArrayOutputStream baos = new ByteArrayOutputStream(); 
	BASE64Encoder b64ec = new BASE64Encoder(); 
	b64ec.encodeBuffer(bais, baos);
	byte[] bytes = baos.toByteArray(); 
	out.println(new String(bytes)); 
} catch (Exception e){ };
%>