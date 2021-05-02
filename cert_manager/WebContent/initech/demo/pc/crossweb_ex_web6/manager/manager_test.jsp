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
function OpenCertManagerForm(isHtml5,taskNm) {
	/* 메뉴 선택 상수
	CERT_COPY
	CERT_REMOVE
	CERT_SEARCH
	CERT_DETAIL
	CERT_PWD_CHANGE
	CERT_EXPORT
*/
	//CertManagerWithForm(isHtml5,taskNm);
	INIWEBEX.openCertManager({
		taskNm : taskNm,
		isHtml5 : isHtml5
	});
}
</script>
</head>

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
					<h2 class="title">공인인증서 관리</h2>
					<div class="btns">
						<span class="col-sm-6 col-xs-12">
						<button type="button" onclick="javascript:OpenCertManagerForm(true); return false;" class="btn btn-info btn-lg">인증서 관리</button>
						</span>
						<span class="col-sm-6 col-xs-12">
						<button type="button" onclick="javascript:OpenCertManagerForm(); return false;" class="btn btn-primary btn-lg hidden-xs">
							INISAFE CROSS WEB<br>EX 관리
						</button>
						</span>
					</div>
					<div class="btns">
						<span class="col-sm-3 col-xs-6">
						<button type="button" onclick="javascript:OpenCertManagerForm(true,'CERT_COPY'); return false;" class="btn btn-success btn-sm">인증서 복사</button>
						</span>
						<span class="col-sm-3 col-xs-6">
						<button type="button" onclick="javascript:OpenCertManagerForm(true,'CERT_REMOVE'); return false;" class="btn btn-danger btn-sm">인증서 삭제</button>
						</span>
						<span class="col-sm-3 col-xs-6">
						<button type="button" onclick="javascript:OpenCertManagerForm(true,'CERT_SEARCH'); return false;" class="btn btn-active btn-sm">인증서 찾기</button>
						</span>
						<span class="col-sm-3 col-xs-6">
						<button type="button" onclick="javascript:OpenCertManagerForm(true,'CERT_PWD_CHANGE'); return false;" class="btn btn-warning btn-sm">인증서 암호변경</button>
						</span>
						<span class="col-sm-12 col-xs-12">
						<button type="button" onclick="javascript:OpenCertManagerForm(true,'CERT_EXPORT'); return false;" class="btn btn-info btn-sm">인증서 내보내기</button>
						</span>						
					</div>
				</div>
			</div>
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