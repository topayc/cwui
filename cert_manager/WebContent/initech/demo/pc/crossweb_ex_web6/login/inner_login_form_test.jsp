<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>이니텍 공인인증서 데모</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">
<script type="text/javascript" src="../../../common/script/jquery-1.11.3.min.js"></script>
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->
<script type="text/javascript">
function login(isHtml5){
	var frm = document.readForm;
	var data = "rnd";
	PKCS7SignVIDForm(document.readForm, data, "SendForm", undefined, isHtml5);
}

function SendForm(result){
	if (result) {
		document.readForm.action="./login_result.jsp";
		document.readForm.submit();
	} else {
		if (INI_ALERT)
			INI_ALERT("로그인에 실패하였습니다.");
		else
			alert("로그인에 실패하였습니다.");
	}
}
</script>

</head>

<body>
<!-- skip navigation start -->
<div class="skip-navi">
	<a href="#content">본문 바로가기</a>
</div>
<!-- skip navigation end -->

<!-- wrapper start -->
<div class="ini-demo-wrapper">
	<!-- header start -->
	<header>
		<h1 class="sr-only">이니텍</h1>
	</header>
	<!-- header end -->
	
	<!-- main start -->
	<main class="ini-demo-container">
		<jsp:include page="../menu.jsp" />
		<!-- contents wrapper start -->
		<section class="ini-demo-contents-wrapper" id="content">
			<!-- contents start -->
			<div class="ini-demo-contents">
				<div class="ini-demo-login">
					<p class="ini-demo-logo"><img src="../../../../demo/common/images/img_customer_logo.png" alt="고객사 로고"></p>
					<h2 class="title"><b>인터넷 뱅킹 INNER</b> 로그인</h2>
					<div class="btns">
						<span class="col-sm-6 col-xs-12">
							<button type="button" class="btn btn-info btn-lg" onClick="javascript:login(true);">
								공인인증서 로그인
							</button>
						</span>
						<span class="col-sm-6 col-xs-12">
							<button type="button" class="btn btn-primary btn-lg hidden-xs" onClick="javascript:login();">
								INISAFE CROSS WEB<br>EX 로그인
							</button>
							<button type="button" class="btn btn-default btn-lg visible-xs-inline-block" >
								바로사인
							</button>
						</span>
					</div>
				</div>
			</div>
			<!-- contents end -->
		</section>
		<!-- contents wrapper end -->
	</main>
	<!-- main end -->
	
	<form name="readForm" id="readForm" method="post" target="signResultIfr" onSubmit="return false;">
		<input type="hidden" name="PKCS7SignedData">
		<input type="hidden" name="USERID" id="USERID" value="AAAA">
		<input type="hidden" name="USERNAME" id="USERNAME" value="홍길동">
		<input type="hidden" name="JUMINNO" id="JUMINNO" value="">
	</form>
			
	<form name="sendForm" id="sendForm" target="signResultIfr" method="post">
		<input type="hidden" name="INIpluginData">
	</form>
	
	<!-- footer end -->
	<footer class="ini-demo-footer">
		<div class="inner-wrap"><p>Copyright 2016. INITECH. ALL RIGHTS RESERVED</p></div>
	</footer>
	<!-- footer end -->
	
</div>
<!-- wrapper end -->
<!-- script -->
<script src="../../../../demo/common/script/bootstrap.min.js"></script>
<script src="../../../../demo/common/script/css_browser_selector.min.js"></script> <!-- 브라우저 식별 -->
<script src="../../../../demo/common/script/initech_demo_ui.js"></script> <!-- ui 관련 커스텀 -->
</body>
</html>