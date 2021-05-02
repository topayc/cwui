<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="../top_path.jsp"%>

<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link href="/demo/common/style/body_style.css" rel="stylesheet" type="text/css"></link>
<link href="/demo/common/style/table_style.css" rel="stylesheet" type="text/css"></link>
<link href="/demo/common/style/text_style.css" rel="stylesheet" type="text/css"></link>
<link href="/demo/common/style/form_style.css" rel="stylesheet" type="text/css"></link>

<script type="text/javascript" src="/demo/common/script/jquery-1.11.1.js"></script>
<script src="/demo/common/script/demo.js"></script>
<script>
jQuery(function($){
	$('.snb li').click(function(ev) {			
			$('.snb li.on').removeClass('on');
			ev.preventDefault();
			$(this).addClass('on');
			location.href = $(this).attr('name');
		});
	});
	
	function clearMenu() {		
		$('.snb li.on').removeClass('on');
	}
	
	function selectMenu(idx) {
		$('.snb li.on').removeClass('on');
		$('li:eq(' + idx +')').addClass('on'); 
	}
</script>
<script>
	function CheckSendForm(readForm) {
		if (readForm.REGNO.value.length <10) {
			alert("정확한 주민등록번호를 입력해 주십시오.");
			readForm.REGNO.focus();
			return false;
		}
	
		if (readForm.USERID.value.length <3) {
			alert("3자리 이상의 사용자 아이디를 입력해 주십시오.");
			readForm.USERID.focus();
			return false;
		}
	
		if (readForm.DETAILNAME.value.length <1) {
			alert("이름(한글,영문) 혹은 법인명을 입력해 주십시오.");
			readForm.DETAILNAME.focus();
			return false;
		}
		
		return true;
	}
	
	function SendForm(){
		
		if(CheckSendForm (document.readForm) ){ 
			emulAcceptCharset(document.readForm);
			document.readForm.menuNum.value = "402";
			document.readForm.submit();
		}
		
		return false;
	}
</script>

</head>

<body bgcolor="#f3f4f5">
<table border="0" width="100%">
<tr>
	<td align="left" valign="top" width="100px">
		<jsp:include page="../menu.jsp" />
	</td>
	<td align="left" width="800px">
	<!------------------------------------------------------------------->
		<div id=test_bed>

			<table border="0" width="800px">
				<tr><td align="right">
					<span id="menu_situation">PC Demo > INISAFE Web6.4 > 공인인증센터 > 재발급</span>
				</td></tr>
			</table>
			
			<jsp:include page="./test_menu.jsp" />
			
			<h1>설명</h1>
			<div class="desc" style="width:800px;">
				<h3>해당 페이지에서 발급하는 인증서는 테스트용 인증서 입니다.</h3>
				<h3>그러므로 테스트 CA에서만 정상처리 됩니다.</h3>
				<h3>리얼 인증서를 제출할 경우 테스트CA에서는 알 수가 없으므로 오류 메세지가 나올 수 있습니다.</h3>
				<h3>데모 페이지는 개발 및 테스트, 데모용으로만 사용하셔야 합니다.</h3>
				<h3>현재주소 : <%=request.getRequestURL()%></h3>
			</div>
			<br>
		
			<form id="readForm" name="readForm" action="./reissue_result.jsp" method="POST" accept-charset="EUC-KR" >
				<input type="hidden" name="reqcode" value="25"/>
			
				<h1>공인인증서 재발급 테스트 예제</h1>
				<div class="content" style="width:800px;">
					<h3>발급 정보 입력</h3>
					<table border=0>
					<tr>
						<td width="20px" rowspan="2"></td>
						<td width="750px">
						<!-- 입력 시작  -->
							<table class="basic_table" style="width:100%;">
				            <colgroup>
				                <col width="20%" />
				                <col width="30%" />
				                <col width="50%" />
				            </colgroup>            
				            <tr>
				                <th>입력 항목</th>
				                <th>입력 내용</th>
				                <th>비고</th>
				            </tr>
				            <tr>
				            	<td align="center"><b>발급기관(CA)</b></td>
				            	<td>
					            	<select NAME = 'CACODE' >
										<option VALUE = '01'>(01) 금융결제원(KFTC)</option>
										<!-- <option VALUE = '03'>(03) 전자인증(CrossCert)</option> -->
										<option VALUE = '04'>(04) 코스콤(SignKorea)</option>
										<!-- <option VALUE = '05'>(05) 정보인증(SignGate)</option> -->
									</select>
				            	</td>
				            	<td></td>
				            </tr>
				            <tr>
				            	<td align="center"><b>인증서 종류(정책)</b></td>
				            	<td>
				            		<select name = 'CERTPOLICY' style="width:95%" >
										<option VALUE = '01'>(01) 범용 개인인증서</option>
										<option VALUE = '02'>(02) 용도제한용 기업인증서</option>
										<option VALUE = '04' selected>(04) 용도제한용 개인인증서</option>
										<option VALUE = '05'>(05) 범용 기업인증서</option>
										<option VALUE = '68'>(68) 전자세금계산용인증서</option>
										<option VALUE = '61'>(61) 용도제한용 기업뱅킹 인증서</option>
									</select>
				            		
				            	</td>
				            	<td></td>
				            </tr>
				            <tr>
				            	<td align="center"><b>주민/사업자 번호</b></td>
				            	<td>
				            		<input type="text" id="REGNO" name="REGNO" value="" style="width:95%"/>
				            	</td>
				            	<td> "-" 없이 숫자만 기입하십시오.</td>
				            </tr>
				            <tr>
				            	<td align="center"><b>사용자 ID</b></td>
				            	<td>
				            		<input type="text" id="USERID" name="USERID" value="T" style="width:95%"/>
				            	</td>
				            	<td></td>
				            </tr>
				            <tr>
				            	<td align="center"><b>이름/법인명</b></td>
				            	<td>
				            		<input type="text" id="DETAILNAME" name="DETAILNAME" value="홍길동(REINI)" style="width:95%"/>
				            	</td>
				            	<td>예> 홍길동(KILDONG.HONG)</td>
				            </tr>
				            <tr>
				            	<td align="center"><b>전자우편(e-mail)</b></td>
				            	<td>
				            		<input type="text" id="usermail" name="usermail" value="hkd@initech.com" style="width:95%"/>
				            	</td>
				            	<td></td>
				            </tr>
				            <tr>
				            	<td rowspan="2" align="center"><b>RA 서버 선택</b></td>
				            	<td colspan="2">
				            		<!--<input type="radio" name="ra_system" value="GATEWAY_RA"> Gateway RA Server(2048)-->
				            		<input type="radio" name="ra_system" value="RA" checked> RA Server (2048)
				            	</td>
				            </tr>
	<!--
				            <tr>
				            	<td colspan="2">※ Gateway RA Server는 금융결제원 중계서버를 거처 인증서를 발급 합니다.</td>
				            </tr>
	-->
							</table>
						<!-- 입력 끝  -->
						</td>
					</tr>
					</table>
					<br>		
					
					<table border=0 width="95%">
					<tr>
						<td align="right">
							<button onClick="SendForm();" class="button blue medium">재발급 정보 입력</button>
						</td>
					</tr>
					</table>
				</div>
			</form>
		
			<div  style="width:800px;" align="right">
				<a href="javaScript:sourceView();"> &lt; .jsp 소스보기 &gt; </a>
			</div>
			
		</div>
	<!------------------------------------------------------------------->
	</td>
</tr>
</table>



</body>
</html>