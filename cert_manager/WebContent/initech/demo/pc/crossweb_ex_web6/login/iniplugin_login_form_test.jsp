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
<script src="/initech/demo/common/script/jquery-3.2.1.min.js"></script>
<script src="/initech/demo/common/script/jquery-migrate-3.0.0.min.js"></script>

<script type="text/javascript">
var $j	=	jQuery.noConflict();
var TNK_SR = '';
</script>

<script type="text/javascript" src="/SW/vender/TouchEn/nxKey/js/TouchEnNx.js?dt=20170523"></script>
<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?dt=20170523"></script>

<script type="text/javascript">
window.onload = function() {
	
	if (typeof TouchEnKey_installpage != "string" && useTouchEnnxKey){
		TK_Loading();
	}else{
		/**
		 * 키보드보안 미지원 OS 또는 브라우저입니다. 가상키패드 사용 Default로 변경 필요합니다.
		 * 가상키패드 제품이 없을 경우 안내 페이지로 이동하여 브라우저 업데이트 또는 타 OS사용 권장이 필요합니다.
		**/
	}
};
</script>
<script type="text/javascript">
function check_send_form(isHtml) {
 	//var urlEnc = true;
	var frm = document.form1;
	var isHtml5 = frm.isHtml5.checked;
	var iniCache = frm.iniCache.checked
	var filterCert = frm.filterCert.checked;
	var viewType;
	var targetType;
	
	for(var i=0; i <= frm.viewType.length-1; i++){
		if(frm.viewType[i].checked){
			viewType = frm.viewType[i].value;
			break;
		}
	}
		
	INIWEBEX.login({
		sendForm		: document.form1,
		readForm		: document.form1,
		loginType		: "enc",		 				// 로그인 타입 (sign : 인증서 로그인 / enc : 암호화 + 인증서 로그인)
		data			: "login",		 				// 로그인 서명에 사용할 임의의 값
		processCallback	: "EncFormVerify2_Callback",	// 콜백함수
		isHtml5			: isHtml5,		 				// HTML5 UI 사용 여부 (true : 사용, false : CS UI사용)
		viewType 		: viewType, 		 			// 원문 영역 스타일 (NONE : 안보임, GRID : name | value형식, TEXT : string형식)
		iniCache		: iniCache,			 			// 필터링 등 캐시된 인증서 초기화 여부
		filterCertByIssuer : {enable:filterCert}				// IssuerDN 필터링 (true:사용, false:미사용)
	});
	
	/*
	var f = document.form1;
	var postData="login";
	InitCache();
	CrossWebExWeb6.EncFormVerify2(f, f, "EncFormVerify2_Callback");
	*/
}	

function EncFormVerify2_Callback(result) {
	var f = document.form1;
	if(result){
		f.menuNum.value = "103";
		f.submit();	
	}
}

</script>

</head>

<!--body onLoad="startInit();"-->
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
			<form name="form1" method="post" action="./iniplugin_login_result.jsp">
				<div class="ini-demo-login">
					<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
					<h2 class="title"><b>인터넷 뱅킹</b> 로그인</h2>
					
					
					<fieldset class="ini-demo-form">
						<h3 class="ini-demo-subtitle">Option 설정</h3>
						<div class="dl-table">
							<dl>
								<dt class="col-sm-3 col-xs-3"><label for="input1">주민번호</label></dt>
								<dd class="col-sm-9 col-xs-9"><input type="text" name="juminNO" id="juminNO" class="form-control"></dd>
							</dl>
							<dl>
								<dt class="col-sm-3 col-xs-3"><label for="input8">HTML5 사용</label></dt>
								<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5"  checked/><!-- (※ 체크 시 HTML5 UI 사용)--></label></dd>
							</dl>								
							<dl>
								<dt class="col-sm-3 col-xs-3"><label for="input12">InitCache 사용</label></dt>
								<dd class="col-sm-9 col-xs-9">
									<label><input type="checkbox" name="iniCache" checked="checked"/><!--  (※ 체크 시 InitCache 사용)--></label>
								</dd>
							</dl>
							<dl>
								<dt class="col-sm-3 col-xs-3"><label for="input11">FilterCert 사용</label></dt>
								<dd class="col-sm-9 col-xs-9">
									<label><input type="checkbox" name="filterCert"  /><!-- (※ 체크 시 filterCert 사용)--></label>
								</dd>
							</dl>
							<dl>
								<dt class="col-sm-3 col-xs-3"><label for="input13">원문 영영 Style</label></dt>
								<dd class="col-sm-9 col-xs-9"> 
									<label>NONE<input type="radio" name="viewType" value="NONE" checked="checked"/></label>&nbsp;
									<label>GRID <input type="radio" name="viewType"  value="GRID"/></label>&nbsp; 
									<label>TEXT <input type="radio" name="viewType"  value="TEXT" /></label>
								</dd>
							</dl>								
						</div>
					</fieldset>
				</div>									
				<div class="ini-demo-btns">
					<span class="col-sm-6 col-xs-12">
						<button type="button" class="btn btn-info btn-lg" onClick="javascript:check_send_form();">
							로그인(iniplugin)
						</button>
					</span>							
				</div>		
				
				<input type="hidden" name="INIpluginData" />
				<input type="hidden" id="menuNum" name="menuNum"/>				
			</form>
			</div>
			<!-- contents end -->
		</section>
		<!-- contents wrapper end -->
	</main>
	<!-- main end -->
	
	<form name="readForm" id="readForm" method="post" onSubmit="return false;">
		<input type="hidden" name="PKCS7SignedData">
		<input type="hidden" id="menuNum" name="menuNum"/>
	</form>

	<!-- footer start -->
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