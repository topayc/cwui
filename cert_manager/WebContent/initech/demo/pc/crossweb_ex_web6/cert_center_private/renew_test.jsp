<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<!DOCTYPE HTML>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<title>공인인증서 신규발급/재발급</title>
<link rel="stylesheet" type="text/css" href="../../../common/style/bootstrap.css">
<link rel="stylesheet" type="text/css" href="../../../common/style/initech_demo_ui.css">
<script type="text/javascript" src="../../../common/script/jquery-1.11.3.min.js"></script>
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->
<script type="text/javascript">
function CheckSendForm(isHtml5) {
	var readForm = document.getElementById("readForm");
	
	if (readForm.regno.value.length <10) {
		alert("정확한 주민등록번호를 입력해 주십시오.");
		readForm.regno.focus();
		return false;
	}

	if (readForm.userid.value.length <3) {
		alert("3자리 이상의 사용자 아이디를 입력해 주십시오.");
		readForm.userid.focus();
		return false;
	}

	if (readForm.detailname.value.length <1) {
		alert("이름(한글,영문) 혹은 법인명을 입력해 주십시오.");
		readForm.detailname.focus();
		return false;
	}
	
	var frm = document.getElementById("readForm");
	
	/*
	if(!isHtml5){
		InitCache();
		// 로그인은 기본UI 서명창을 사용
	    SetProperty("certmanui_SelectCertUIMode", "no");
	}
	*/
	
	// TODO form 객체를 formname 스트링으로 변경하여 전송하여야 함
	var frm = document.getElementById("readForm");
	var data = "regno=" + frm.regno.value;
	//PKCS7SignVIDData(data, "SendForm", undefined, isHtml5, true);
	INIWEBEX.sign({		
		signType : "P7",
		targetType : "data",
		data : data,
		isHtml5 : isHtml5,
		isCmp : true,
		processCallback : "SendForm"
	});
}

function SendForm(result){
	if (result) {
		var frm = document.getElementById("readForm");
		emulAcceptCharset(document.readForm);
		frm.menuNum.value = "402";
		frm.submit();
	} else {
		return false;
	}
}
</script>
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->
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
			<form id="readForm" name="readForm" action="./renew_result.jsp" method="POST" accept-charset="EUC-KR" >
				<input type="hidden" id="menuNum" name="menuNum"/>
				<input type="hidden" id="reqcode" name="reqcode" value="28"/>
				<input type="hidden" name="PKCS7SignedData">
				<div class="ini-demo-contents">
					<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
					<h2 class="ini-demo-title">공인인증서 갱신</h2>
					<div>
						<fieldset class="ini-demo-form">
							<legend>공인인증 신규 발급 입력</legend>
							<table class="table">
								<caption>공인인증서 갱신을 위한 입력 항목, 입력 내용을 나타낸 표</caption>
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
									<td>주민/사업자 번호</td>
										<td>
											<input type="text" class="form-control" id="regno" name="regno" />
											<p class="exp text-left">"_" 없이 숫자만 기입하십시오.</p>
										</td>
									</tr>
									<tr>
										<td>사용자 ID</td>
										<td>
											<input type="text" title="" class="form-control" id="userid" name="userid" />
										</td>
									</tr>
									<tr>
										<td>이름/법인명</td>
										<td>
											<input type="text" class="form-control" id="detailname" name="detailname" value="홍길동(HONG)" />
											<p class="exp text-left">예)홍길동(HONG)</p>
										</td>
									</tr>
									<tr>
										<td>전자우편(e-mail)</td>
										<td>
											<input type="text" title="" class="form-control" id="usermail" name="usermail" value="gildong.hong@initech.com"/>
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
						</fieldset>
					</div>
					<div class="ini-demo-btns">
						<button type="button" class="btn btn-info btn-lg" onclick="javascript:CheckSendForm(true); return false;">갱신</button>
						<button type="button" class="btn btn-primary btn-lg hidden-xs" onclick="javascript:CheckSendForm(); return false;">INISAFE CROSS WEB EX 갱신</button>
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