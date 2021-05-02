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
function sign(vid, isHtml5, innerHtml5){
    var data="";
	var frm = document.readForm;
    data += "아이디=" + frm.USERID.value;
	data += "&사용자명=" + frm.USERNAME.value;
	data += "&주민등록번호=" + frm.JUMINNO.value;

	// 암호화 전송 유무 및 전자서명
	var retCallback = "";
	if(frm.enc.checked){
		retCallback = "EncSendForm";
	} else {
		retCallback = "SendForm";
	}

	if(vid){
		var retCallback = "";
		if(document.readForm.enc.checked){
			retCallback = "EncSendForm";
		} else {
			retCallback = "SendForm";
		}
		PKCS7SignVIDForm(document.readForm, data, retCallback, undefined, isHtml5);
	} else {
		var retCallback = "";
		if(document.readForm.enc.checked){
			retCallback = "EncSendForm";
		} else {
			retCallback = "SendForm";
		}
		if(innerHtml5){
			PKCS7SignedDataForm(document.readForm, data, retCallback, undefined, isHtml5, true);
		}else{
			PKCS7SignedDataForm(document.readForm, data, retCallback, undefined, isHtml5);
		}
	}
}

function EncSendFormCallback(result){
	if(result){
		document.sendForm.action="../login/signEncResult.jsp";
		document.sendForm.submit();
	} else {
		alert("보안상 문제가 생겨 전송이 취소 되었습니다.");
	}
}

function EncSendForm(result){
	var readForm = document.readForm;
	var sendForm = document.sendForm;
	if (result) {
		NoCertVerify2(readForm, sendForm, "EncSendFormCallback");
		return false;
	} else {
		alert("전자서명값이 올바르게 생성되지 않았습니다.");
	}
}

function SendForm(result){
	var readForm = document.readForm;
	if (result) {
		document.readForm.action="../login/signPKCS7Result.jsp";
		readForm.submit();
	} else {
		alert("전자서명값이 올바르게 생성되지 않았습니다.");
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
					<h2 class="title"><b>인터넷 뱅킹 INNER</b> 전자서명</h2>
					<div class="btns">
						<span class="col-sm-6 col-xs-12">
							<button type="button" class="btn btn-info btn-lg" onClick="sign(undefined, true);">
								공인인증서 전자서명
							</button>
						</span>
						<span class="col-sm-6 col-xs-12">
							<button type="button" class="btn btn-primary btn-lg hidden-xs" onClick="javascript:sign(undefined);">
								INISAFE CROSS WEB<br>EX 전자서명
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
	
	<!-- inner html area -->		
	<div id="INI_inner_area">
		<p>이곳에 전자서명  div 가 표시됩니다.</p> 
	</div>
	
	<form name="readForm" id="readForm" method="post" target="signResultIfr" onSubmit="return false;">
		<input type="hidden" name="PKCS7SignedData">
		<input type="hidden" name="USERID" id="USERID" value="AAAA">
		<input type="hidden" name="USERNAME" id="USERNAME" value="홍길동">
		<input type="hidden" name="JUMINNO" id="JUMINNO" value="">
		<input type="hidden" name="enc" id="enc" type="checkbox">
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
