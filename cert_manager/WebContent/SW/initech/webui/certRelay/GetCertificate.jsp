<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.lang.*" %>

<%
	/**
	 * SVer 이라는 파라미터값이 존재하지 않을 경우 "1.0" 버전으로 인식합니다.
	 * SVer="1.1" 일 경우 GetCertificate_v11.jsp 페이지로 포워드 됩니다.
	 */
	String version = request.getParameter("SVer");

	
	if( version == null ) {
		version = "1.0";
	}

	String forwardURL = null;
	if( "1.0".equals(version) ) {
		forwardURL = "GetCertificate_v10.jsp";
	} else if( "1.1".equals(version) ) {
		forwardURL = "GetCertificate_v11.jsp";
	} else if( "1.2".equals(version) ) {
		forwardURL = "GetCertificate_v12.jsp";
	}
	
	if( forwardURL != null ) {
		request.getRequestDispatcher( forwardURL ).forward( request, response );
	} else {
		out.print("ERR001_RequestValueisNULLn");
	}
%>