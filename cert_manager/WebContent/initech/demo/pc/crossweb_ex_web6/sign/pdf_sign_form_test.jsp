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
<!-- <script type="text/javascript" src="../../../demo/common/script/html5.js"></script> -->
<!--[if lt IE 9]>
	<script src="../../../common/script/html5.js"></script>
<![endif]-->
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
function movePage(){
	var frm = document.readForm;
	
	for(var i=0; i <= frm.signType.length-1; i++){
		if(frm.signType[i].checked)	{
			if (frm.signType[i].value == "P7"){
				location.replace("sign_form_test.jsp?menuNum=201");
				break;
			}else if (frm.signType[i].value == "yessignP7"){
				location.replace("yessign_form_test.jsp?menuNum=201");
				break;
			}
		}
	}
}

function sign(){
 	var urlEnc = true;
    var signStr="";
	var frm = document.readForm;
	signStr = document.getElementById("pdfHashData").value;
	
	var isHtml5 = frm.isHtml5.checked;
	var iniCache = frm.iniCache.checked
	var filterCert = frm.filterCert.checked; //String이 들어가야 한다.
	var isVid = frm.isVID.checked;
	var viewType;
	var signType;
	var targetType;
	
	if(isVid){
		if(frm.juminNO.value == ""){
			alert("주민번호를 입력하세요.");
			frm.juminNO.focus();
			return false;
		}
	}
	
	for(var i=0; i <= frm.viewType.length-1; i++){
		if(frm.viewType[i].checked){
			viewType = frm.viewType[i].value;
			break;
		}
	}
	
	for(var i=0; i <= frm.signType.length-1; i++){
		if(frm.signType[i].checked){
			signType = frm.signType[i].value;
			break;
		}
	}
	
	for(var i=0; i <= frm.targetType.length-1; i++){
		if(frm.targetType[i].checked){
			targetType = frm.targetType[i].value;
			break;
		}
	}
	
	
	INIWEBEX.sign({
		signType		: signType,			// 전자서명 유형 "P7" : PKCS7 전자서명 / "yessignP7" : 금결원 전자서명 / "pdf" : PDF전자서명 / onlyCert로그인 없이 인증서 제출
		targetType		: targetType,		// "data" or "form"
		targetFormName	: targetType == 'form' ? "readForm" : undefined,
		targetFieldCss	: targetType == 'form' ? "form-control" : undefined,
		data			: targetType == 'form' ? undefined : signStr,
		form			: targetType == 'form' ? frm : undefined,
		processCallback	: targetType == 'form' ? "FormCallback" : 'SendForm',	// 콜백함수
		isHtml5			: isHtml5,
		iniCache		: iniCache,		// 필수 전자서명에서는 false를 줘야 함
		viewType		: viewType,		// 원문 영역 view 스타일 ("NONE" : 안보임 / "GRID" : name-value / "TEXT" : text)
		vid				: isVid,		// true : 본인 확인 실행 / false : 미진행
		filterCert		: filterCert		  	// SubjectDN + Serial Number 
	});
	
	//PKCS7SignedDataWithMD(signStr, "SendForm", signStr, isHtml5);
// 	PKCS7SignedDataWithMD(signStr, "SendForm", signStr, isHtml5);
}

function SendForm(result, postData){
	if (result) {
		document.readForm.PKCS7SignedData.value = result;
		document.readForm.menuNum.value = "205";
		document.readForm.pdfHash.value = document.getElementById("pdfHashData").value;
		document.readForm.action="./pdf_sign_result.jsp";
		document.readForm.submit();
	} else {
		if (INI_ALERT)
			INI_ALERT("전자서명에 실패하였습니다.");
		else
	 		alert("전자서명에 실패하였습니다.");
	}
}

function FormCallback(result, postData){
	if (result) {
		document.readForm.PKCS7SignedData.value = result;
		document.readForm.menuNum.value = "205";
		document.readForm.pdfHash.value = document.getElementById("pdfHashData").value;
		document.readForm.action="./pdf_sign_result.jsp";
		document.readForm.submit();
	} else {
		if (INI_ALERT)
			INI_ALERT("전자서명에 실패하였습니다.");
		else
	 		alert("전자서명에 실패하였습니다.");
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
				<p class="ini-demo-logo"><img src="../../../common/images/img_customer_logo.png" alt="고객사 로고"></p>
				<div class="ini-demo-transfer">
					<h2 class="ini-demo-title">당행&middot;타행이체</h2>
					<form id="readForm" name="readForm" method="post" onSubmit="return false;">
						<input type="hidden" name="PKCS7SignedData" />
						<input type="hidden" id="menuNum" name="menuNum"/>
						<input type="hidden" id="pdfHash" name="pdfHash"/>
						<fieldset class="ini-demo-form">
							<legend>PDF 정보 입력</legend>
							<div class="dl-table">
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input1">PDF HASH값 입력</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" name="pdfHashData" id="pdfHashData" class="form-control" value="50UJg2COhJF/Nr2bmNWUBVnXVyj2hitXl2DEr/nETgQ="></dd>
								</dl>
							    <dl>
									<dt class="col-sm-3 col-xs-3"><label for="input2">주민번호</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" name="juminNO" id="juminNO" class="form-control"></dd>
								</dl>
							</div>
							<br>
							<br>
							<h3 class="ini-demo-subtitle">Option 설정</h3>
							<div class="dl-table">
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input3">HTML5 사용</label></dt>
									<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5" checked /> (※ 체크 시 HTML5 UI 사용)</label></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input4">VID검증</label></dt>
									<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isVID"/> (※ 체크 시 VID검증 사용)</label></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input5">InitCache 사용</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label><input type="checkbox" name="iniCache"  /> (※ 체크 시 InitCache() 사용)</label>
									</dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input6">FilterCert 사용</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label><input type="checkbox" name="filterCert"  /> (※ 체크 시 FilterCert() 사용)</label>
									</dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input7">원문 영영 Style</label></dt>
									<dd class="col-sm-9 col-xs-9">NONE <label><input type="radio" name="viewType" value="NONE" /></label>
																			&nbsp; <label>GRID <input type="radio" name="viewType"  value="GRID" checked="checked" /></label>
																			&nbsp; <label>TEXT <input type="radio" name="viewType"  value="TEXT" /></label></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input8">전자 서명 Type</label></dt>
									<dd class="col-sm-9 col-xs-9"><span><label>PKCS7 <input type="radio" name="signType" value="P7" onClick="movePage();"/></label>
																	&nbsp; <label>PDF <input type="radio" name="signType"  value="pdf"  checked="checked"/></label>
																	&nbsp; <label>금결원 <input type="radio" name="signType"  value="yessignP7" onClick="movePage();"/></label></span></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input9">데이터 형식</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label>Data <input type="radio" name="targetType"  value="data" checked="checked" /></label>
												&nbsp; <label>form <input type="radio" name="targetType"  value="form"/></label>
									</dd>
								</dl>
							</div>
						</fieldset>
						<!--div float: left;>html5 사용 여부 : &nbsp; <input type="checkbox" name="isHtml5"  /></div>
						<div float: left;>vid 사용 여부 : &nbsp; <input type="checkbox" name="vid"  /></div>
						<div float: left;>FilterCert 사용 여부 : &nbsp; <input type="checkbox" name="filterCert"  /></div>
						<div float: left;>InitCache 사용 여부 : &nbsp; <input type="checkbox" name="iniCache"  /></div>
						<div float: left;>원문영역 설정 : &nbsp; NONE <label><input type="radio" name="viewType" value="NONE" /></label>
																			&nbsp; <label>GRID <input type="radio" name="viewType"  value="GRID" checked="checked" /></label>
																			&nbsp; <label>TEXT <input type="radio" name="viewType"  value="TEXT" /></label></div>
						<div float: left;>서명 타입 : &nbsp; <label>PKCS7 <input type="radio" name="signType" value="P7"  onClick="movePage();"/></label>
																	&nbsp; <label>PDF <input type="radio" name="signType"  checked="checked" value="pdf"/></label>
																	&nbsp; <label>금결원 <input type="radio" name="signType"  value="yessignP7" onClick="movePage();"/></label></div>
						<div float: left;>데이터 형식 : &nbsp; <label>Data <input type="radio" name="targetType"  value="data" checked="checked" /></label>
														&nbsp; <label>form <input type="radio" name="targetType"  value="form" "/></label></div-->
					</form>
				</div>
				
				<div class="ini-demo-btns">
					<span class="col-sm-6 col-xs-12">
						<button type="button" class="btn btn-info btn-lg" onClick="sign();">이체</button>
					</span>
					<!--span class="col-sm-6 col-xs-12">
						<button type="button" class="btn btn-primary btn-lg hidden-xs" onClick="sign_data(undefined, false);">INISAFE CROSS WEB EX 이체(data)</button>
					</span-->
				</div>
			</div>
			<!-- contents end -->
		</section>
		<!-- contents wrapper end -->
	</main>
	<!-- main end -->
	
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