<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>인증서 재발급</title>
<link rel="stylesheet" type="text/css" href="/initech/demo/common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="/initech/demo/common/style/initech_demo_ui.css">

<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?dt=20170523"></script>


<script type="text/javascript">
	function CheckSendForm(readForm) {		
	
		if (readForm.user_id.value.length <3) {
			alert("3자리 이상의 사용자 아이디를 입력해 주십시오.");
			readForm.user_id.focus();
			return false;
		}		
		return true;
	}
	//발급
	function RevokePrivateCert(isHtml5) {
	
	   if(CheckSendForm(readForm)){
		   
			readForm.user_id.value = encodeURIComponent(readForm.user_id.value);
			
			if(isHtml5) { 
			   readForm.strHtml5.value = "true";
			}
			document.readForm.target = "hiddenIFrame";
			document.readForm.submit();	
		   
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
		<jsp:include page="../../menu.jsp" />
		<!-- local navigation end -->
		<!-- contents wrapper start -->
		<section class="ini-demo-contents-wrapper" id="content">
			<!-- contents start -->
			<div class="ini-demo-contents">
				<p class="ini-demo-logo"><img src="/initech/demo/common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<h2 class="ini-demo-title">사설 인증서 폐기</h2>
				<div>
					<fieldset class="ini-demo-form">
						<legend>폐기할 인증서 정보</legend>
						<form id="readForm" name="readForm" action="./revoke_complete.jsp" method="post">
							<input type="hidden" id="menuNum" name="menuNum"/>
							<input type="hidden" id="strHtml5" name="strHtml5"/>
							<table class="table">
								<caption>인증서 발급을 위한 입력 항목, 입력 내용을 나타낸 표</caption>
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
										<td>사용자ID</td>
										<td>
											<input type="text" title="" class="form-control" id="user_id" name="user_id" />
										</td>
									</tr>
						</form>
					</fieldset>
				</div>
				<div class="ini-demo-btns">
					<button type="button" class="btn btn-info btn-lg" onClick="RevokePrivateCert(false)">폐기</button>
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
<!-- wrapper end -->
<!-- script -->
<script src="/initech/demo/common/script/bootstrap.min.js"></script>
<script src="/initech/demo/common/script/css_browser_selector.min.js"></script> <!-- 브라우저 식별 -->
<script src="/initech/demo/common/script/initech_demo_ui.js"></script> <!-- ui 관련 커스텀 -->
<iframe name="hiddenIFrame" width="0" height="0" frameborder="0"></iframe>

</body>
</html>