<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="false"%>
<%@ page import="com.rimesoft.uniwebkey.toolkit.ProcessRequest"%>
<% request.setCharacterEncoding("utf-8"); %>
<% 
String keyPadType = request.getParameter("keypad_type");
String keypad_language = request.getParameter("keypad_language");
if(keypad_language == null || "".equals(keypad_language)){
	keypad_language = "kor";
}


String UNIWEBKEY_ROOT_PATH = request.getSession().getServletContext().getRealPath("/vender/unikey/keypad/keypadTable/localhost/Blue/");
// String UNIWEBKEY_ROOT_PATH = "D:/Development/INISAFE/workspace/95_HTML5_dev/WebContent/initech/unikey/keypad/demo.initech.com/";
if(keyPadType.equals("PC")){
	UNIWEBKEY_ROOT_PATH = request.getSession().getServletContext().getRealPath("/vender/unikey/keypad/keypadTable/localhost/Blue/" + keypad_language + "/");
}
int KEYPAD_COUNT = 20;		// 키패드 개수...

out.clear();
out = pageContext.pushBody();
// 수행 : 내부에서 수행하고 종료한다.
ProcessRequest ajaxProcess = new ProcessRequest();
// ajaxProcess.setDebugMode(false);
ajaxProcess.process(request, response, UNIWEBKEY_ROOT_PATH, KEYPAD_COUNT);
%>