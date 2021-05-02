<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="ko">
<head>
	<script type="text/javascript" src="/initech/demo/common/script/jquery-1.11.3.min.js"></script>
	<script type="text/javascript">
	var TNK_SR = '';
	</script>
	<script type="text/javascript" src="/SW/vender/TouchEn/nxKey/js/TouchEnNx.js?dt=20170523"></script>
	<script type="text/javascript" src="/SW/initech/extension/crosswebex6.js?version=1.2.38"></script>
	<script>
	window.onload = function() {
		if (typeof TouchEnKey_installpage != "string" && useTouchEnnxKey){
			TK_Loading();
		}else{
			/**
			 * 키보드보안 미지원 OS 또는 브라우저입니다. 가상키패드 사용 Default로 변경 필요합니다.
			 * 가상키패드 제품이 없을 경우 안내 페이지로 이동하여 브라우저 업데이트 또는 타 OS사용 권장이 필요합니다.
			**/
		}
		

  		init();
	};
	
	function getValueFunc(handleInfo, keyType) {
	  	return function() {
	  	  	cwui.keyStrokeSecurityFactory.getKeyPadValue(handleInfo, keyType).then(function(pwd) {
	  	  	  alert(pwd);
	  	  	});
		}
	}
	
	function init() {
		var _handleInfo = cwui.newHandleInfo();

 			cwui.keyStrokeSecurityFactory.initialize(_handleInfo);
 		
	 	$("#initech_certificate_wrap").show();
	 	
		$("#INI_userPwNonce").on("click", function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", this.id);
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYBOARD");
          cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NONCE"));
		});

		$("#INI_userPwNewNonce").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", this.id);
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYBOARD");
         	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NEW_NONCE"));
		});

		$("#INI_userPwNewNonceCnf").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", this.id);
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYBOARD");
         	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NEW_NONCE_CNF"));
		});

		$("#INI_userPwSecure").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", this.id);
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYBOARD");
         	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "SECURE"));
		});

		$("#INI_userPwNonce_tk_btn").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", "INI_userPwNonce");
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYPAD");
         	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NONCE"));
		});

		$("#INI_userPwNewNonce_tk_btn").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", "INI_userPwNewNonce");
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYPAD");
     	  	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NEW_NONCE"));
		});

		$("#INI_userPwNewNonceCnf_tk_btn").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", "INI_userPwNewNonceCnf");
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYPAD");
     	  	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NEW_NONCE_CNF"));
		});

		$("#INI_userPwSecure_tk_btn").click(function() {
	      _handleInfo.serviceInfo.setParameter("pwdId", "INI_userPwSecure");
	      cwui.keyStrokeSecurityFactory.click(_handleInfo, "KEYPAD");
         	  cwui.keyStrokeSecurityFactory.setEnterCallback(getValueFunc(_handleInfo, "NONCE"));
		});
	}
	</script>
</head>
	<div id="initech_certificate_wrap" style="display: none; margin: 0 auto">
		<form id="keypadFrm" name="keypadFrm">
			<div class="certifacte_input_nonce">
				<input type="password" title="password" id="INI_userPwNonce" name="INI_userPwNonce" placeholder="인증서 암호는 대소문자를 구분합니다.">
				<span id="INI_userPwNonce_tk_btn">키패드</span>
			</div>
		
			<div class="certifacte_input_new_nonce">
				<input type="password" title="password" id="INI_userPwNewNonce" name="INI_userPwNewNonce" placeholder="인증서 암호는 대소문자를 구분합니다.">
				<span id="INI_userPwNewNonce_tk_btn">키패드</span>
			</div>
		
			<div class="certifacte_input_new_nonce_cnf">
				<input type="password" title="password" id="INI_userPwNewNonceCnf" name="INI_userPwNewNonceCnf" placeholder="인증서 암호는 대소문자를 구분합니다.">
				<span id="INI_userPwNewNonceCnf_tk_btn">키패드</span>
			</div>
		
			<div class="certifacte_input_secure">
				<input type="password" title="password" id="INI_userPwSecure" name="INI_userPwSecure" placeholder="인증서 암호는 대소문자를 구분합니다.">
				<span id="INI_userPwSecure_tk_btn">키패드</span>
			</div>
		</form>
	</div>
<body>
</body>
</html>