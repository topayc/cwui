<%@ page language="java"  contentType="text/html;charset=UTF-8" import=" javax.servlet.*,javax.servlet.http.*,java.io.*,sun.misc.*,com.initech.iniplugin.Nonce" %><% 
	String time= Long.toString(System.currentTimeMillis()) + "_" + ((int)0x0ff & java.net.InetAddress.getLocalHost().getAddress()[3]); 

	Nonce new_time = new Nonce();
	new_time.setValue(time);

	session.setAttribute("__INIts__", new_time);
	
	try { 	
		ByteArrayInputStream bais = new ByteArrayInputStream(time.getBytes()); 
		ByteArrayOutputStream baos = new ByteArrayOutputStream(); 
		BASE64Encoder b64ec = new BASE64Encoder(); 
		b64ec.encodeBuffer(bais, baos);
		byte[] bytes = baos.toByteArray(); 
		out.println(new String(bytes));
	} catch (Exception e){ };
%>