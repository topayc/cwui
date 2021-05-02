<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" session="false"%>
<%@ page import="com.rimesoft.uniwebkey.toolkit.ProcessRequest"%>
<% request.setCharacterEncoding("utf-8"); %>
<% 
String keyPadType = request.getParameter("keypad_type");
String keypad_language = request.getParameter("keypad_language");
if(keypad_language == null || "".equals(keypad_language)){
	keypad_language = "kor";
}

String UNIWEBKEY_ROOT_PATH = "/home/rib2017domain/rib2017App/sw/initech/unikey/keypad/keypadTable/tstrib3.shinhan.com/Blue/";
// String UNIWEBKEY_ROOT_PATH = "D:/project/web/HTML5_0/WebContent/initech/unikey/keypad/keypadTable/tstrib3.shinhan.com/Blue/";
if(keyPadType.equals("PC")){
	UNIWEBKEY_ROOT_PATH = "/home/rib2017domain/rib2017App/sw/initech/unikey/keypad/keypadTable/tstrib3.shinhan.com/Blue/" + keypad_language + "/";
// 	UNIWEBKEY_ROOT_PATH = "D:/project/web/HTML5_0/WebContent/initech/unikey/keypad/keypadTable/tstrib3.shinhan.com/Blue/" + keypad_language + "/";
}
// UniWebKey 데이 가 있는 기준 폴더를 지정
int KEYPAD_COUNT = 10;		// 키패드 개수...

out.clear();
out = pageContext.pushBody();
// 수행 : 내부에서 수행하고 종료한다.
ProcessRequest ajaxProcess = new ProcessRequest();
ajaxProcess.setDebugMode(false);
ajaxProcess.process(request, response, UNIWEBKEY_ROOT_PATH, KEYPAD_COUNT);
%>