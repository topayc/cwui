<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
	String menuUrl = request.getParameter("menu_url");
	String pageUrl = request.getParameter("page_url");
%>
<frameset cols="200px, *"  border="0px" frameborder="no">
	<frame src="<%=menuUrl %>" name="menu_frame" />
	<frame src="<%=pageUrl %>" name="body_frame" />
 </frameset> 
</HTML>