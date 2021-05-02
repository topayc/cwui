/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2017-07-28] : 최초 구현 
*************************************************************************************/

/**
 * @desc : unikeyWeb Implement
 */
define([
        '../../main/constants',
        '../../conf/defaultConf',
        '../../conf/msgFactory'
        ], function (constants, defaultConf, msgFactory) {
	
	
	/**
	 * 키패드 버튼 클릭 이벤트
	 */
	var _selectedKeyPadId;
	var _pwdId;

	$(document).ready(function(){
		//PC onclick 이벤트
		$(document).on('click', 'area', function(e) {
			var thisObj = $(e.currentTarget);
			var id = thisObj.closest("area").attr("data-key");
			_selectedKeyPadId.clickEventKeypad(id);
			_selectedKeyPadId.submitUse = "N";
		});
		
		// Mobile onmousedown 이벤트
		$(document).on('mousedown', 'span', function(e) {
			var dataKey = $(e.target).attr("data-key");
			if(!dataKey){
				return;
			}
			UniWebKey_ShowClick($(e.target).attr("id"));
			if(dataKey.indexOf("UniWebKey_ButtonClick") > -1){
				var dataKeyArr = dataKey.split(";");
//				var showClickId = dataKeyArr[0];
//				showClickId = showClickId.substring(showClickId.indexOf("uniwebkey_"),showClickId.length -2);
				var buttonClickId = dataKeyArr[1];
				buttonClickId = buttonClickId.substring(buttonClickId.indexOf("(")+2,buttonClickId.length -2);
				//click
				_selectedKeyPadId.clickEventKeypad(buttonClickId);
				_selectedKeyPadId.submitUse = "N";
			} else {
				_selectedKeyPadId.clickEventKeypad(dataKey);
				_selectedKeyPadId.submitUse = "N";
			}
		});
	});
	
	var _keyPadBaseImagePath = GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey/images";
	var _keypad_language;
	var virtualCloseCallback = "";
	
	function getKeypadHeaderText(text, keyPadType){
		var HEAD_HTML_TAG = '';
		//인증서 암호를 입력하세요
		var txt1 = msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_004;
		if(keyPadType === "PC"){
			// PC 키패드
			HEAD_HTML_TAG += '<table style="border: 0px solid red; width:100%; margin: auto;padding:0;padding-left: 10px;padding-right: 10px">';
			HEAD_HTML_TAG += '    <tbody>';
			HEAD_HTML_TAG += '        <tr>';
//			HEAD_HTML_TAG += '            <td valign="middle" style="width:14%" id="INI_multimouse_input">';
//			HEAD_HTML_TAG += '                <img src="'+_keyPadBaseImagePath+'/pc/mouse_button.png" border="0" style="cursor:pointer" onclick="javascript:_selectedKeyPadId.multiMouseEventKeypad(); return false;">';
//			HEAD_HTML_TAG += '            </td>';
			HEAD_HTML_TAG += '            <td style="width:84.2%;text-align:center" id="uniwebkey_move_pos">';
			HEAD_HTML_TAG += '                <input id="uniwebkey_input" type="text" name="" size="30" placeholder="'+txt1+'" readonly="" style="width:50%;font-size:14px; color:#515354;font-weight:bold;height:20px;text-align:center;border:1px solid #84a0d1;)" value="'+text+'">';
			HEAD_HTML_TAG += '            </td>';
			HEAD_HTML_TAG += '            <td valign="top" style="width:1.8%" id="INI_keypad_close" onclick="javascript:_selectedKeyPadId.keyPadCloseEvent(); return false;">';
			HEAD_HTML_TAG += '                <img src="'+_keyPadBaseImagePath+'/pc/keyboard_close_btn.png" border="0" style="cursor:pointer">';
			HEAD_HTML_TAG += '            </td>';
			HEAD_HTML_TAG += '        </tr>';
			HEAD_HTML_TAG += '    </tbody>';
			HEAD_HTML_TAG += '</table>';
		} else if(keyPadType === "PHONE") {
			// 폰 키패드
			HEAD_HTML_TAG += '<div id="header-uniwebkey" style="background-color: white;">';
			HEAD_HTML_TAG += '<table style="border: 0px solid red; width:100%; margin: auto; text-align: center;">';
			HEAD_HTML_TAG += '	<tbody>';
			HEAD_HTML_TAG += '		<tr>';
			HEAD_HTML_TAG += '			<td align="left" width="30%">';
			HEAD_HTML_TAG += '				<img height="40"src="'+_keyPadBaseImagePath+'/phone/close.png" border="0" onclick="javascript:_selectedKeyPadId.keyPadCloseEvent(); return false;" style="cursor:pointer">';
			HEAD_HTML_TAG += '			</td>';
			HEAD_HTML_TAG += '			<td width="40%">';
			HEAD_HTML_TAG += '				<input id="uniwebkey_input" type="text" name="uniwebkey_input" placeholder="'+txt1+'" size="18" value="" readonly="" ';
			HEAD_HTML_TAG += '					style="font-size:10pt; color:#0000ff; font-weight:bold;height:40;padding:5px 0px 0px 5px;text-align: center;" value="'+text+'">';
			HEAD_HTML_TAG += '			</td>';
			HEAD_HTML_TAG += '			<td align="right" width="30%">';
			HEAD_HTML_TAG += '				<img height="40" src="'+_keyPadBaseImagePath+'/phone/done.png" border="0" onclick="javascript:_selectedKeyPadId.keyPadEnterEvent();" style="cursor:pointer">';
			HEAD_HTML_TAG += '			</td>';
			HEAD_HTML_TAG += '		</tr>';
			HEAD_HTML_TAG += '	</tbody>';
			HEAD_HTML_TAG += '</table>';
			HEAD_HTML_TAG += '</div>';
		} else {
			// 태블릿 키패드
			HEAD_HTML_TAG +='<div id="header-uniwebkey" style="background-color: white;">';
			HEAD_HTML_TAG +='<table style="border: 0px solid red; width:98%; margin: auto; text-align: center;">';
			HEAD_HTML_TAG +='	<tbody>';
			HEAD_HTML_TAG +='		<tr>';
			HEAD_HTML_TAG +='			<td align="left" width="30%">';
			HEAD_HTML_TAG +='				<img height="40" src="'+_keyPadBaseImagePath+'/phone/close.png" border="0" onclick="javascript:_selectedKeyPadId.keyPadCloseEvent(); return false;" style="cursor:pointer">';
			HEAD_HTML_TAG +='			</td>';
			HEAD_HTML_TAG +='			<td id="uniwebkey_move_pos" width="40%">';
			HEAD_HTML_TAG +='				<input id="uniwebkey_input" type="text" name="uniwebkey_input" placeholder="'+txt1+'" size="20" value="" readonly="" style="font-size:10pt; color:#0000ff; font-weight:bold;height:40;padding:5px 0px 0px 5px;text-align: center;" value="'+text+'">';
			HEAD_HTML_TAG +='			</td>';
			HEAD_HTML_TAG +='			<td align="right" width="30%">';
			HEAD_HTML_TAG +='				<img height="40" src="'+_keyPadBaseImagePath+'/phone/done.png" border="0" onclick="javascript:_selectedKeyPadId.keyPadEnterEvent();" style="cursor:pointer">';
			HEAD_HTML_TAG +='			</td>';
			HEAD_HTML_TAG +='		</tr>';
			HEAD_HTML_TAG +='	</tbody>';
			HEAD_HTML_TAG +='</table>';
			HEAD_HTML_TAG +='</div>	';
		}
		
		return HEAD_HTML_TAG;
	}
	
	function VitualKeyPad(handleInfo){
	  this.handleInfo = handleInfo;
		this.pwdElement = $("#" + handleInfo.serviceInfo.getParameter("pwdId"))[0];
		this.keyObj = new UniWebKey_Control();
	};
	
	/**
	 * 좌표 값을 측정한다.
	 *
	 * @param obj 측정 요망 객체
	 */
	function getBounds( obj ) { 
		var ret = new Object();
		var rect = obj.getBoundingClientRect(); 
		ret.left = rect.left + (document.documentElement.scrollLeft || document.body.scrollLeft); 
		ret.top = rect.top + (document.documentElement.scrollTop || document.body.scrollTop); 
		ret.width = rect.right - rect.left; 
		ret.height = rect.bottom - rect.top; 
		return ret;
	}
	
	VitualKeyPad.prototype.setType = function(keyPadType){
		this.keyPadType = keyPadType;
	};
	
	VitualKeyPad.prototype.setPosition = function(){
		var windowHeight = window.innerHeight;
		var windowWidth = window.innerWidth;
		this.top;
		this.left;
		this.heigth;
		this.width;
		
		if(this.keyPadType=="PC"){
			var obj = getBounds(_selectedKeyPadId.pwdElement);
			if(obj.top){
				windowHeight = obj.top + obj.height - 87; 
			}
			if(obj.left){
//				this.left = obj.left;
				this.left = obj.left - (300/2);
			} else {
				this.left = (windowWidth-750)/2;	
			}
			if((window.innerHeight - windowHeight - 295) < 0){
				windowHeight = windowHeight + (window.innerHeight - windowHeight - 295);
			}
			this.keyObj.SetPosition(windowHeight, this.left, 750, 295); 	// PC
		} else if (this.keyPadType=="PHONE"){
			this.keyObj.SetPosition(0, 0, windowWidth, windowHeight); 	// phone
		} else if (this.keyPadType=="TABLET"){
			this.keyObj.SetPosition(0, 0, windowWidth, windowHeight); 	// tablet
		}
	};
	
	VitualKeyPad.prototype.setMessageMin = function(){
		var nMin = 8;
		var txt1 = msgFactory.getMessageFactory().Warn.WARN_1049; //최소 
		var txt2 = msgFactory.getMessageFactory().Warn.WARN_1050; //글자 이상 입력해야 합니다.

		var msgMinError = txt1+" " + nMin + txt2;	// ## 이 nMin으로 대치됨
		var titleMsg = msgFactory.getMessageFactory().Error.ERR_7014; // 입력 오류
			
		this.keyObj.SetMessageMin(msgMinError, titleMsg, nMin);
	};
	
	VitualKeyPad.prototype.keyPadClickEvent = function(plus_minus, curCount){
		var v = document.getElementById('uniwebkey_input');
		v.value = "";
		for (var i=0;i<curCount;i++) {
			v.value = v.value + "*";
		}
		
		_selectedKeyPadId.changeText();
	};
	
	VitualKeyPad.prototype.keyPadSubmitEvent = function(curCount){
		clear();
		if((_selectedKeyPadId.submitUse === "Y" || _selectedKeyPadId.keyPadType === "PC") && !_selectedKeyPadId.confirmCallbackRun){
			_selectedKeyPadId.confirmCallbackRun = true;
			// run 실행시 callback중복 실행됨
			// _selectedKeyPadId.confirmCallback(_selectedKeyPadId.keyObj);
			
			setTimeout(function(){
				if (_selectedKeyPadId.enterCallback) _selectedKeyPadId.enterCallback();
			}, 150);	
			
		}
	};
	VitualKeyPad.prototype.setEnterCallback = function(callback){
		this.enterCallback= callback;
	}
	
	VitualKeyPad.prototype.keyPadEnterEvent = function(){
		try{
			_selectedKeyPadId.submitUse = "Y";
			_selectedKeyPadId.keyObj.ButtonClick("enter");
		}catch(e){}
	};
	
	VitualKeyPad.prototype.keyPadCloseEvent = function(){
		try{
			if(this.keyPadType === "PC"){
				this.keyObj.ButtonClick("reset");
			} else {
				this.keyObj.ClearInput();
				this.changeText("");
			}
			clear();
			this.keyObj.Close();
			
			if(virtualCloseCallback){
				virtualCloseCallback();
			}
		}catch(e){
			if(virtualCloseCallback){
				virtualCloseCallback();
			}
		}
	};
	
	VitualKeyPad.prototype.keyPadErrorEvent = function(errString){
		if(INI_ALERT){
			INI_ALERT(errString, 'ERROR');	
		}else{
			alert(errString);
		}
	};
	VitualKeyPad.prototype.keyPadRearrangeEvent = function(){
		_selectedKeyPadId.keyObj.ClearInput();
		_selectedKeyPadId.pwdElement.value = "";
		_selectedKeyPadId.keyObj.SetHeaderDIV(getKeypadHeaderText("", _selectedKeyPadId.keyPadType));
		if(location.hostname === "tstrib3.shinhan.com"){
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_tstrib3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else if(location.hostname === "devrib3.shinhan.com"){
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_devrib3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else if(location.hostname === "bank.shinhan.com") {
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_bank_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else if(location.hostname === "devhpe3.shinhan.com") {
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_devhpe3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else if(location.hostname === "tsthpe3.shinhan.com") {
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_tsthpe3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else if(location.hostname === "www.shinhan.com") {
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_wwwshinhan_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else if(location.hostname === "main.shinhan.com") {
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_main_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		} else {
			_selectedKeyPadId.keyObj.GetKeypad(_selectedKeyPadId.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + _selectedKeyPadId.keyPadType + "&non=");
		}
	};
	VitualKeyPad.prototype.keyboardShowAfter = function(){
//		var input = document.getElementById("uniwebkey_input");
//		input.value = "";
//		input.focus();
		GINI_LoadingIndicatorStop();
	};
	
	VitualKeyPad.prototype.setCallbackFunction = function(){
		this.keyObj.SetCallbackFunction(this.keyPadClickEvent, this.keyPadSubmitEvent, this.keyPadErrorEvent, this.keyPadRearrangeEvent, this.keyboardShowAfter);
	};
	
	VitualKeyPad.prototype.initialize = function(){
		this.keyPadType = "PC";
		if(INI_getPlatformInfo().Mobile){
	        var window_ratio = 0;
	        if (window.innerHeight > window.innerWidth) {
	            window_ratio = (window.innerHeight*100) / window.innerWidth; // % 
	        }
	        if (window_ratio > 135) {
	        	this.keyPadType = "PHONE";
	        	this.keyObj.SetZIndexLock(7003);
	        	this.keyObj.SetZIndexUniWebKey(-1);
	        } else {
	        	this.keyPadType = "TABLET";
	        	this.keyObj.SetZIndexLock(7003);
	        	this.keyObj.SetZIndexUniWebKey(-1);
	        }
		}
		this.keyObj.SetHeaderDIV(getKeypadHeaderText("", this.keyPadType));
		this.keyObj.ShowMouseOver(true); // false
	};
	
	VitualKeyPad.prototype.show = function(){
		if(location.hostname == "tstrib3.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_tstrib3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else if(location.hostname === "devrib3.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_devrib3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else if(location.hostname === "bank.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_bank_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else if(location.hostname === "devhpe3.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_devhpe3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else if(location.hostname === "tsthpe3.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_tsthpe3_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else if(location.hostname === "www.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_wwwshinhan_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else if(location.hostname === "main.shinhan.com"){
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_main_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		} else {
			this.keyObj.GetKeypad(this.keyPadType, GINI_HTML5_BASE_PATH + "/vender/unikey/keypad/uniwebkey_ajax.jsp?keypad_language=" + _keypad_language + "&keypad_type=" + this.keyPadType + "&non=");
		}
	};
	
	VitualKeyPad.prototype.getElement = function(){
		alert(this.pwdElement.name);
	};
	
	VitualKeyPad.prototype.clickEventKeypad = function(keyId){
		try{
			var btnValue = "";
			if( keyId.indexOf("key_") > -1 ){
				btnValue = (keyId.toString()).substring(keyId.indexOf("key_") + 4, keyId.length);
			} else {
				btnValue = keyId.toString();
			}
			this.keyObj.ButtonClick(btnValue);
		}catch(e){}
	};
	
	var cur_multimouse = false;
	VitualKeyPad.prototype.multiMouseEventKeypad = function(){
		cur_multimouse = !cur_multimouse;
		this.keyObj.ShowMultiMouse(cur_multimouse);
	};
	
	VitualKeyPad.prototype.showKeyPad = function(confirmCallback){
		_keypad_language = defaultConf.System.Language;
		this.confirmCallback = confirmCallback;
		this.confirmCallbackRun = false;
		this.initialize();
		this.setMessageMin();
		this.setPosition();
		this.setCallbackFunction();
		this.setLog(false);
		this.show();
	}
	
	VitualKeyPad.prototype.changeText = function(text){
		if(text || text == ""){
			_selectedKeyPadId.pwdElement.value = text;
		}else{
			_selectedKeyPadId.pwdElement.value = document.getElementById('uniwebkey_input').value;
		}
	}
	
	VitualKeyPad.prototype.setLog = function(isConsoleLog){
		this.keyObj.SetD(isConsoleLog); 
	};
		
	var newKeyPad = function(handleInfo){
		return new VitualKeyPad(handleInfo);
	};
	
	var initialize = function(handleInfo){
		
		handleInfo.serviceInfo.setParameter("ENCRYPTED", "FALSE");
		virtualCloseCallback = handleInfo.serviceInfo.getParameter("virtualCloseCallback");

		var keypadFrmName = handleInfo.serviceInfo.getParameter("KeypadFrmName");
		var keypadFrm = document.getElementsByName(keypadFrmName)[0];
		if(!keypadFrm){
			return false;
		}
		var elelength = keypadFrm.elements.length;
//		for (var j = 0; j < elelength; j++) {
//			if (keypadFrm.elements[j].tagName == "INPUT" && (keypadFrm.elements[j].type == "password")) {
//				keypadFrm.elements[j].value = "";
//				if(!keypadFrm.elements[j].getAttribute("readonly")){
//					keypadFrm.elements[j].setAttribute("readonly", "readonly");
//				}
//				if(keypadFrm.elements[j].getAttribute("disabled")){
//					keypadFrm.elements[j].removeAttribute("disabled");
//				}
//			}
//		}
		
		$(window).bind("orientationchange", function(e) { // 가로세로 전환 처리
			var keypadFrmName = handleInfo.serviceInfo.getParameter("KeypadFrmName");
			var keypadFrm = document.getElementsByName(keypadFrmName)[0];
			if(!keypadFrm){
				return false;
			}
			var elelength = keypadFrm.elements.length;
//			for (var j = 0; j < elelength; j++) {
//				if (keypadFrm.elements[j].tagName == "INPUT" && (keypadFrm.elements[j].type == "password")) {
//					keypadFrm.elements[j].value = "";
//					if(!keypadFrm.elements[j].getAttribute("readonly")){
//						keypadFrm.elements[j].setAttribute("readonly", "readonly");
//					}
//					if(keypadFrm.elements[j].getAttribute("disabled")){
//						keypadFrm.elements[j].removeAttribute("disabled");
//					}
//				}
//			}
			if(_selectedKeyPadId.keyPadType === "PC"){
				_selectedKeyPadId.keyObj.ButtonClick("reset");
			} else {
				_selectedKeyPadId.keyObj.ClearInput();
				_selectedKeyPadId.changeText("");
			}
			clear();
			_selectedKeyPadId.keyObj.Close();

			if(virtualCloseCallback){
				virtualCloseCallback();
			}
			$(".w2ui-popup").remove();
        });
	}
	
	var run = function(handleInfo){
	  debugger;
	  
    handleInfo.serviceInfo.getParameter("previousSubmit")(_selectedKeyPadId.keyObj);
    console.log("unikey run");
	}
	
	var clear = function(handleInfo){
		$("#" + _pwdId).attr("disabled", false);
//		alert('clear');
	}
	
	var afterProc = function(handleInfo){
		
		if(INI_ALERT){
			INI_ALERT("afterProc", 'NOIT');	
		}else{
			alert("afterProc");	
		}
	}
	
	var click = function(handleInfo){
		GINI_LoadingIndicatorStart();
		
		//이전 제거
		$(".w2ui-popup").remove();
		$(".password").attr("disabled", false);
		_pwdId = handleInfo.serviceInfo.getParameter("pwdId");
		//멀티 클릭 막기
		//$("#"+_pwdId).attr("disabled", true);
		// run(handleInfo);

    _selectedKeyPadId = newKeyPad(handleInfo);
    _selectedKeyPadId.showKeyPad(handleInfo.serviceInfo.getParameter("previousSubmit"));
    
    window["_selectedKeyPadId"] = _selectedKeyPadId;
	}
	
	var close = function(handleInfo){
		if(_selectedKeyPadId){
			_selectedKeyPadId.keyPadCloseEvent();
		}
	}
	
	var getKeyPadValue = function(handleInfo, nonceType) {
	  handleInfo.serviceInfo.setParameter("PWD", _selectedKeyPadId.keyObj);
	  
	  return new RSVP.Promise(function(resolve) {
  		if(handleInfo.serviceInfo.getParameter("PIN") && nonceType === "SECURE"){
  		  resolve(handleInfo.serviceInfo.getParameter("PIN"));
  		} else if(handleInfo.serviceInfo.getParameter("TARGET_PIN") && nonceType === "TARGET_SECURE"){
  		  resolve(handleInfo.serviceInfo.getParameter("TARGET_PIN"));
  		} else {
  		  resolve(handleInfo.serviceInfo.getParameter("PWD"));
  		}
	  });
	};
	
	var setEnterCallback = function(callback){
		_selectedKeyPadId.setEnterCallback(callback);
	}
	
	var getKeyPadType = function(){
		return "KEYPAD"; 
	}
	return {
		initialize : initialize,
		run : run,
		clear : clear,
		afterProc : afterProc,
		click : click,
		close : close,
		getKeyPadValue : getKeyPadValue,
		setEnterCallback:setEnterCallback,
		getKeyPadType:getKeyPadType
	}
});