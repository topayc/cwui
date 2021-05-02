<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>공인인증서 스마트폰 복사</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">

<script src="/initech/demo/common/script/jquery-3.2.1.min.js"></script>
<script src="/initech/demo/common/script/jquery-migrate-3.0.0.min.js"></script>
<!-- <script type="text/javascript" src="../../../demo/common/script/html5.js"></script> -->
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
function RunCertImportV12() {
	var frm = document.readForm;
	var isHtml5 = frm.isHtml5.checked;
	var version = "1.2";
	
	INIWEBEX.importCert({
		isHtml5 : isHtml5,
		version	: version
	});
	//CertImportV12WithForm(isHtml5);
}
function RunCertExportV12() {
	var frm = document.readForm;
	var isHtml5 = frm.isHtml5.checked;
	var version = "1.2";
	
	INIWEBEX.exportCert({
		isHtml5 : isHtml5,
		version	: version
	});
	//CertExportV12WithForm(isHtml5);
}
function RunCertImportV11() {
	var frm = document.readForm;
	var isHtml5 = frm.isHtml5.checked;
	var version = "1.1";
	
	INIWEBEX.importCert({
		isHtml5 : isHtml5,
		version	: version
	});
	//CertImportV11WithForm(isHtml5);
}
function RunCertExportV11() {
	var frm = document.readForm;
	var isHtml5 = frm.isHtml5.checked;
	var version = "1.1";
	
	INIWEBEX.exportCert({
		isHtml5 : isHtml5,
		version	: version
	});
	//CertExportV11WithForm(isHtml5);
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
			<form name="readForm" id="readForm" method="post" onSubmit="return false;">
			<!-- contents start -->
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<h2 class="ini-demo-title">공인인증서 스마트폰 복사</h2>
				<div class="row ini-demo-copy text-center">
					<div class="col-sm-6">
						<dl class="panel panel-default">
							<dt class="panel-heading"><b>PC에서 스마트폰 인증서 복사하기 v1.2</b></dt>
							<dd class="panel-body">
								<p>내보내기</p>
								<br>
								<button type="button" class="btn btn-info btn-lg" onclick="javascript:RunCertExportV12(true); return false;">PC &gt; 스마트폰<br>인증서 복사하기</button>
							</dd>
						</dl>
					</div>
					<div class="col-sm-6">
						<dl class="panel panel-default">
							<dt class="panel-heading"><b>스마트폰에서  PC 인증서 복사하기 v1.2</b></dt>
							<dd class="panel-body">
								<p>가져오기</p>
								<br>
								<button type="button" class="btn btn-info btn-lg" onclick="javascript:RunCertImportV12(true); return false;">스마트폰 &gt; PC<br>인증서 복사하기</button>
							</dd>
						</dl>
					</div>
				</div>
				<div class="row ini-demo-copy text-center">
					<div class="col-sm-6">
						<dl class="panel panel-default">
							<dt class="panel-heading"><b>PC에서 스마트폰 인증서 복사하기 v1.1</b></dt>
							<dd class="panel-body">
								<p>내보내기</p>
								<br>
								<button type="button" class="btn btn-info btn-lg" onclick="javascript:RunCertExportV11(true); return false;">PC &gt; 스마트폰<br>인증서 복사하기</button>
							</dd>
						</dl>
					</div>
					<div class="col-sm-6">
						<dl class="panel panel-default">
							<dt class="panel-heading"><b>스마트폰에서  PC 인증서 복사하기 v1.1</b></dt>
							<dd class="panel-body">
								<p>가져오기</p>
								<br>
								<button type="button" class="btn btn-info btn-lg" onclick="javascript:RunCertImportV11(true); return false;">스마트폰 &gt; PC<br>인증서 복사하기</button>
							</dd>
						</dl>
					</div>
				</div>
				<h2 class="ini-demo-subtitle">Option 설정</h3>
				<div class="dl-table">
					<dl>
						<dt class="col-sm-3 col-xs-3"><label for="input8">HTML5 사용</label></dt>
						<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5"  checked/>  (※ 체크 시 HTML5 UI 사용)</label></dd>
					</dl>
				</div>
			</div>
			
			<!-- contents end -->
			</form>
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