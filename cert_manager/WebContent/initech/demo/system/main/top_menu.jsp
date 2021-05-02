<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script type="text/javascript" src="../../../../demo/common/script/jquery-1.11.1.js"></script>

<link href="../../../../demo/common/style/top_menu.css" rel="stylesheet" type="text/css"></link>

<script>	
	var demoRootPath = "";
	function goPage(url) {
		top.frames['content_frame'].location.href = demoRootPath + url;
	}
</script>
</head>

<body scroll="no"> 
<div id="header">
	<div class="top_logo"><a href="javascript:goPage('../../../../demo/system/main/home_content.jsp')"><img src="../../../../demo/common/image/main/logo_demo.gif" alt="logo" /></a></div>
    <ul class="gnb">
    	<li id="" class=""><a href="javascript:goPage('../../../../demo/system/main/home_content.jsp')"><span>Home</span></a></li>
        <li><img src="../../../../demo/common/image/main/menu_line.gif" alt="line" /></li>
        
    	<li id="" class=""><a href="javascript:goPage('../../../../demo/pc/pc_content.jsp')"><span>PC Demo</span></a></li>
        <li><img src="../../../../demo/common/image/main/menu_line.gif" alt="line" /></li>
        
    	<li id="" class=""><a href="javascript:goPage('../../../../demo/mobile/mobile_content.jsp')"><span>Mobile Demo</span></a></li>
        <li><img src="../../../../demo/common/image/main/menu_line.gif" alt="line" /></li>
        
    	<li id="" class=""><a href="javascript:alert('준비중...')"><span>License</span></a></li>
        <li><img src="../../../../demo/common/image/main/menu_line.gif" alt="line" /></li>
        
    	<li id="" class=""><a href="javascript:alert('준비중...')"><span>Plugin CA</span></a></li>
        <li><img src="../../../../demo/common/image/main/menu_line.gif" alt="line" /></li>
        
    	<li id="" class=""><a href="javascript:alert('준비중...')"><span>FAQ</span></a></li>
        <li><img src="../../../../demo/common/image/main/menu_line.gif" alt="line" /></li>
        
    </ul>
    <div class="topInfo">
        <span class="info">wanseok.ki(홍길동)</span>
    </div>

</div>
</body>
</html>
