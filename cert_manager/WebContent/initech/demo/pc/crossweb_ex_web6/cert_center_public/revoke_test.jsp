<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>공인인증서 폐기</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">
<script type="text/javascript" src="../../../common/script/jquery-1.11.3.min.js"></script>
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->

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
function CheckSendForm() {
	
	var frm = document.getElementById("readForm");
	var data = "cacode=" + frm.cacode.value;
	data += "&certpolicy=" + frm.certpolicy.value;
	var isHtml5 = frm.isHtml5.checked;
	/*
	if(!isHtml5){
		InitCache();
		// 로그인은 기본UI 서명창을 사용
	    SetProperty("certmanui_SelectCertUIMode", "no");
	}
	*/
	
	// TODO form 객체를 formname 스트링으로 변경하여 전송하여야 함
	INIWEBEX.login({
		data			: data,
		processCallback	: "SendForm",	// 콜백함수
		postdata		: undefined,
		isHtml5			: isHtml5,
		isCmp			: true,
		loginType		: "sign",
		iniCache		: true,
		viewType		: "NONE",
		vid				: true
	});
	//PKCS7SignVIDForm(document.readForm, undefined, "SendForm", undefined, isHtml5, true);
	// PKCS7SignVIDData(data, "SendForm", undefined, isHtml5, true);
}

function SendForm(result){
	if (result) {
		document.readForm.PKCS7SignedData.value = result;
		document.readForm.menuNum.value = "403";
		document.readForm.submit();
	}else{
// 		alert("실패");
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
		<!-- local navigation start -->
		<jsp:include page="../menu.jsp" />
		<!-- local navigation end -->
		<!-- contents wrapper start -->
		<section class="ini-demo-contents-wrapper" id="content">
			<!-- contents start -->
			<form name=readForm id=readForm action="./revoke_result.jsp" method="post">
			<input type="hidden" id="menuNum" name="menuNum"/>
			<input type="hidden" name="PKCS7SignedData">
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<h2 class="ini-demo-title">공인인증서 폐기</h2>
				<div>
					<fieldset class="ini-demo-form">
						<table class="table">
							<caption>공인인증서 폐기를 위한 입력 항목, 입력 내용을 나타낸 표</caption>
							<colgroup>
								<col style="width:30%">
								<col style="">
							</colgroup>
							<thead>
								<tr>
									<th scope="col">입력 항목</th>
									<th scope="col">입력 내용</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>발급기관(CA)</td>
									<td>
										<select class="form-control" name = 'cacode' >
											<option value = '01'>(01) 금융결제원(KFTC)</option>
											<!-- <option value = '03'>(03) 전자인증(CrossCert)</option> -->
											<option value = '04'>(04) 코스콤(SignKorea)</option>
											<!-- <option value = '05'>(05) 정보인증(SignGate)</option> -->
										</select>
									</td>
								</tr>
								<tr>
									<td>인증서 종류(정책)</td>
									<td>
										<select class="form-control" name='certpolicy'>
											<option value='01'>(01) 범용 개인인증서</option>
											<option value='02'>(02) 용도제한용 기업인증서</option>
											<option value='04' selected>(04) 용도제한용 개인인증서</option>
											<option value='05'>(05) 범용 기업인증서</option>
											<option value='68'>(68) 전자세금계산용인증서</option>
											<option value='61'>(61) 용도제한용 기업뱅킹 인증서</option>
									</select>
									</td>
								</tr>
								<tr>
									<td>RA 서버 선택</td>
									<td style="text-align:left" class="custom-control custom-radio">
<!-- 											<input type="radio" title="" class="form-control" name="ra_system" value="gateway_ra"> Gateway RA Server(2048) -->
										<input type="radio" title="" class="ustom-control-input" name="ra_system" value="RA" checked> RA Server (2048)
									</td>
								</tr>
							</tbody>
						</table>
						<h3 class="ini-demo-subtitle">Option 설정</h3>
						<div class="dl-table">
							<dl>
								<dt class="col-sm-3 col-xs-3"><label for="input8">HTML5 사용</label></dt>
								<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5" checked /> (※ 체크 시 HTML5 UI 사용)</label></dd>
							</dl>
						</div>
					</fieldset>
				</div>
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onclick="javascript:CheckSendForm(); return false;">인증서 폐기</button>
					<!--button type="button" class="btn btn-primary btn-lg hidden-xs" onclick="javascript:CheckSendForm(); return false;">INISAFE CROSS WEB EX 폐기</button-->
				</div>
			</div>
			</form>
			<!-- contents end -->
		</section>
		<!-- contents wrapper end -->
	</main>
	<!-- main end -->
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