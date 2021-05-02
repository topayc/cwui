<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.util.Locale"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.util.Random"%>
<%@ page import="java.security.SecureRandom"%>

<%@ page import="com.initech.core.util.Base64Util"%><%
	SimpleDateFormat sdfDt = new SimpleDateFormat("yyyyMMddHHmmss", Locale.KOREA);
	String svrTime = sdfDt.format(new Date());
	
	session.setAttribute("INITECH_APPROVE_TIME", svrTime);
	
	Random random = new Random(System.currentTimeMillis());
	byte[] rnd = new byte[32];
	random.nextBytes(rnd);
	
	String rndStr = new String(Base64Util.encode(rnd));
	
	String resMsg = (svrTime + rndStr).trim();
	
	session.setAttribute("INITECH_APPROVE_RANDOM", resMsg);
	
	out.print(resMsg);
%>
