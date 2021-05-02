<%@page import="java.net.URLEncoder"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.security.KeyPair"%>
<%@ page import="java.security.PrivateKey"%>
<%@ page import="java.security.PublicKey"%>
<%@ page import="com.initech.provider.crypto.InitechProvider"%>
<%@ page import="java.security.KeyPairGenerator"%>
<%@ page import="java.security.SecureRandom"%>
<%@ page import="java.net.URLEncoder"%>

<%@ page import="com.initech.core.util.Base64Util"%><%

	InitechProvider.addAsProvider(false, false);

	//SecureRandom rnd = SecureRandom.getInstance("FIPS186-2Appendix3");
	KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA", InitechProvider.NAME);
	//keyGen.initialize(2048, rnd);
	keyGen.initialize(2048);
	
	KeyPair key = keyGen.generateKeyPair();

	PublicKey pubKey = key.getPublic();
    PrivateKey priKey = key.getPrivate();
    
    try{
    	String resMsg = new String(Base64Util.encode(priKey.getEncoded())) +"|" + new String(Base64Util.encode(pubKey.getEncoded()));
    	out.print( URLEncoder.encode(resMsg) );	
    }catch(Exception e){}
%>
