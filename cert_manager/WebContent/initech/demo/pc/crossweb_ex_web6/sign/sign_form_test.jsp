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

function movePage(){
	var frm = document.readForm;
	
	for(var i=0; i <= frm.signType.length-1; i++){
		if(frm.signType[i].checked)	{
			if (frm.signType[i].value == "pdf"){
				location.replace("pdf_sign_form_test.jsp?menuNum=205");
				break;
			}else if (frm.signType[i].value == "yessignP7"){
				location.replace("yessign_form_test.jsp?menuNum=202");
				break;
			}
		}
	}
}

function sign(){
 	
	
    var signStr="";
	var frm = document.readForm;
	var isHtml5 = frm.isHtml5.checked;
	var iniCache = frm.iniCache.checked
	var filterCert = frm.filterCert.checked;
	var isVid = frm.isVID.checked;
	var viewType;
	var signType;
	var targetType="data";
	
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
		
	signStr = encodeURIComponent("출금계좌번호1") + "=" + encodeURIComponent(frm.withdraw_account_number.value); 
	signStr += "&" + encodeURIComponent("이체금액1") + "=" + encodeURIComponent(frm.withdraw_account_amount.value);
	signStr += "&" + encodeURIComponent("내통장표시내용1") + "=" + encodeURIComponent(frm.withdraw_account_info.value);
	signStr += "&" + encodeURIComponent("입금은행1") + "=" + encodeURIComponent(frm.deposit_account_bank.value); 
	signStr += "&" + encodeURIComponent("입금계좌번호1") + "=" + encodeURIComponent(frm.deposit_account_number.value);
	signStr += "&" + encodeURIComponent("받는통장표시내용1") + "=" + encodeURIComponent(frm.deposit_account_info.value);
	
	INIWEBEX.sign({
		signType		: signType,		// 전자서명 유형 "P7" : PKCS7 전자서명 / "yessignP7" : 금결원 전자서명 / "pdf" : PDF전자서명 
		targetType		: targetType,	// "data" or "form"
		data			: signStr,
		form			: targetType === 'form' ? frm : '',
		processCallback	: targetType === 'form' ? "Formcallback" : 'SendForm',	// 콜백함수
		isHtml5			: isHtml5,
		iniCache		: iniCache,		// 캐시된 인증서 삭제 여부 (true : 삭제-초기화 / false : 삭제안함-캐시된 인증서 사용)
		viewType		: viewType,		// 원문 영역 view 스타일 ("NONE" : 안보임 / "GRID" : name-value / "TEXT" : text)
		vid				: isVid			// true : 본인 확인 실행 / false : 미진행
	});

}

function SendForm(result, postData){
	if (result) {
		document.readForm.PKCS7SignedData.value = result;
		document.readForm.menuNum.value = "201";
		document.readForm.action="./sign_result.jsp";
		document.readForm.submit();
	} else {
		if (INI_ALERT)
			INI_ALERT("전자서명에 실패하였습니다.");
		else
	 		alert("전자서명에 실패하였습니다.");
	}
}

function Formcallback(result, postData){
	if (result) {
		alert("form sign data:"+document.readForm.PKCS7SignedData.value);
		alert("form sign result2:"+result);
		document.readForm.PKCS7SignedData.value = result;
		document.readForm.menuNum.value = "201";
		document.readForm.action="./sign_result.jsp";
		document.readForm.submit();
	} else {
		if (INI_ALERT)
			INI_ALERT("전자서명에 실패하였습니다.");
		else
	 		alert("전자서명에 실패하였습니다.");
	}
}

function add_item(){
	// pre_set 에 있는 내용을 읽어와서 처리..
	var frm = document.readForm;
	var isVid = frm.isVID.checked;
	var input = "<input type='text' name='juminNO' tk_security='true'>";
	
	if(isVid){
		var addedDiv = document.createElement("div");
		addedDiv.id = "jumin";
		addedDiv.innerHTML = input;
		document.getElementById("addedFormDiv").appendChild(addedDiv);
	}else{
		var obj = document.getElementById("jumin");
		var div = document.getElementById("addedFormDiv");
		div.removeChild(obj);
		
	}
}	
	
function setVidVal(){
	var frm = document.readForm;
	var isVid = frm.isVID.checked;
	if(isVid) {
		frm.chkvid.value = "1";
	} else {		
		frm.chkvid.value = "";
	}
	return;
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
						<input type="hidden" id="chkvid" name="chkvid"/>
						<fieldset class="ini-demo-form">
							<legend>이체 정보 입력</legend>
							<h3 class="ini-demo-subtitle">출금정보 <span class="ini-step"><span class="on">1<span class="sr-only">단계 선택됨</span></span><span>2<span class="sr-only">단계</span></span></span></h3>
							<div class="dl-table">
							    <dl>
									<dt class="col-sm-3 col-xs-3"><label for="input1">주민번호</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" name="juminNO" id="juminNO" class="form-control"></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input1">출금계좌번호</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" id="withdraw_account_number" class="form-control" value="123-45-67890"></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input2">계좌비밀번호</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="password" id="withdraw_account_passwd" class="form-control" value="**********"></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input2">이체금액</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" id="withdraw_account_amount" class="form-control" value="10,000,000"></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input3">내 통장 표시내용</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" id="withdraw_account_info" class="form-control" value="내 통장 출금"></dd>
								</dl>
							</div>
							<br>
							<br>
							<h3 class="ini-demo-subtitle">입금정보</h3>
							<div class="dl-table">
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input5">입금은행</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" id="deposit_account_bank" class="form-control" value="신한은행"></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input6">입금계좌번호</label></dt>
									<dd class="col-sm-9 col-xs-9"><input type="text" id="deposit_account_number" class="form-control" value="098-76-54321"></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input7">받는(입금)통장 표시 내용</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<input type="text" id="deposit_account_info" class="form-control" value="입금통장">
										<p class="exp">※ 미 입력 시 ? 출금계좌의 예금주명(내이름)이 기본 표기됩니다. (단, 기본 표기를 무기명으로 지정시에는 무기명으로 표기 됩니다.)</p>
									</dd>
								</dl>
							</div>
							<br><br>
							<h3 class="ini-demo-subtitle">Option 설정</h3>
							<div class="dl-table">
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input8">HTML5 사용</label></dt>
									<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isHtml5"  checked/> (※ 체크 시 HTML5 UI 사용)</label></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input9">VID검증</label></dt>
									<dd class="col-sm-9 col-xs-9"><label><input type="checkbox" name="isVID" onClick="setVidVal();"/> (※ 체크 시 VID검증 사용)</label></dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input12">InitCache 사용</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label><input type="checkbox" name="iniCache"  /> (※ 체크 시 InitCache() 사용)</label>
									</dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input11">FilterCert 사용</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label><input type="checkbox" name="filterCert"  /> (※ 체크 시 FilterCert() 사용)</label>
									</dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input13">원문 영영 Style</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label>NONE <input type="radio" name="viewType" value="NONE" /></label>&nbsp; 
										<label>GRID <input type="radio" name="viewType"  value="GRID" checked="checked" /></label>&nbsp; 
										<label>TEXT <input type="radio" name="viewType"  value="TEXT" /></label>
									</dd>
								</dl>
								<dl>
									<dt class="col-sm-3 col-xs-3"><label for="input14">전자 서명 Type</label></dt>
									<dd class="col-sm-9 col-xs-9">
										<label>PKCS7 <input type="radio" name="signType" value="P7"  checked="checked"/></label>&nbsp; 
										<label>PDF <input type="radio" name="signType"  value="pdf" onClick="movePage();"/></label>&nbsp; 
										<label>금결원 <input type="radio" name="signType"  value="yessignP7" onClick="movePage();"/></label>
									</dd>
								</dl>								
							</div>
						</fieldset>
					</form>
				</div>
													
				<div class="ini-demo-btns">
					<span class="col-sm-6 col-xs-12">
						<button type="button" class="btn btn-info btn-lg" onClick="sign();">이체</button>
					</span>
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