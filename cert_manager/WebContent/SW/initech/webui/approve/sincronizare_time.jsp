<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Date"%><%
	String time = Long.toString(System.currentTimeMillis() / 1000);
	out.print(time);
%>
