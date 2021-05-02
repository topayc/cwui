/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 스크립트 Global 함수 js 
 # 이력 
  - [2016-12-21] : 최초 구현 
*************************************************************************************/
var GINI_HTML5_CONFIG_PATH = INI_html5BasePath+"/conf/customerConf.json?bust=" + new Date().getTime();
var GINI_HTML5_BASE_PATH = INI_html5BasePath;
var GINI_HTML5_SCRIPT_BASE_PATH = INI_html5BasePath;

/*try {
	if(INI_html5BasePath){
		GINI_HTML5_BASE_PATH = INI_html5BasePath;
		GINI_HTML5_SCRIPT_BASE_PATH = INI_html5BasePath + "/src";
	} else {
		GINI_HTML5_SCRIPT_BASE_PATH = GINI_HTML5_BASE_PATH + "/src";
	}
} catch (e){
	GINI_HTML5_SCRIPT_BASE_PATH = GINI_HTML5_BASE_PATH + "/src";
}*/

var J ='';		// initech jquery 지시자
var GINI_selectedCertificateRow = 1;
var GINI_External_Response_Factory;
var GINI_certificateListSortStatus = [];

// String trim 함수정의(ie8)
(function() {
	if(typeof String.prototype.trim !== 'function') {
	    String.prototype.trim = function() {
	        return this.replace(/^\s+|\s+$/g, ''); 
	    };
	}
}());

// Array indexOf 함수정의(ie8)
/*
function arrayIndexOf(item , taget){ 
	var result = -1;
	for (var key in item) {
		if(item[key] === taget){
			result = key;
			break;
		}
	}
	return result; 
};
*/

/* GINI_OPTION Parameter 항목
 * 1. 전자서명
 *  - HASH_ALG : 해시 알고리즘
 *  - SIGN_KIND : PKCS7, PKCS1
 *  - SERVER_TIME : yyyymmddhhMMss
 *  - SERVER_TIMEURL : 서버url주소
 *  - YESSIGN_TYPE : true(금결원포맷), false
 *  - IN_VID : true(unauthenticatedAttributes에 VIDRandom포함), false
 *  - SECURE_NONCE : SFilter프로토콜 인증
 *  - UNAUTH_ATTR : 추가정보
 *  - USIM_FILTER_INFO : 스마트인증 필터 정보
 *  - CHAR_SET : 문자
 *  - RSA_PSS_SIGN : true(RSA PSS서명), false
 *  - REMOVE_CONTENT : true(원문제거), false
 *  - REMOVE_CERTIFICATE : true(인증서제거), false
 * 2. 인증서
 *  - CERT_VIEW_TYPE : 
 *  - USE_SESSION : true(세션스토리지 사용), false
 */
var getDialogSubForm = function(contentUrl, handleInfo) {
	
	($ || jQuery).ajax({
        'url': contentUrl,
        tryCount :0
		,retryLimit :1
 		,'error': function(xhr, status, error){
 			this.tryCount++;
			if(this.tryCount <= this.retryLimit){
				($ || jQuery).ajax(this);
				return;
			}
			console.log(
					"code:"		+xhr.status+"\n"+
					"message:"	+xhr.responseText+"\n"+
					"status:"	+status+"\n"+
					"error:"	+error);
			return;	
 		},
        'success': function success(data, textStatus, xhr) {
        	($ || jQuery)("#INI_subModalDialog").removeData("GINI_handleInfo");
        	($ || jQuery)("<div id='INI_subModalDialog'>" + data + "</div>").data("GINI_handleInfo", handleInfo).dialog({
            	"modal": true,
                "width": '318px',
                "height": 'auto',
                "resizable":false,
                "closeOnEscape": false,
                "stack": false,
                "show" :{
                	effect:"puff",
                    duration:400,
                    complete:function() {
                    }
                },
                "position": {
                	my: "center",
                	at: "center",
                	of: window,
                	collision: "none"
                },
                "create": function(event, ui){
                    ($ || jQuery)(event.target).parent().css('position', 'fixed');
                },
                "open": function(event, ui){
                	($ || jQuery)(".ui-dialog-titlebar").hide();
                	setSecondDialogStyle( "INI_subModalDialog" );
                },
                "close": function (e, ui) {
                	($ || jQuery)("#INI_subModalDialog").dialog('close');
                	($ || jQuery)("#INI_subModalDialog").removeData("GINI_handleInfo");
                	($ || jQuery)(this).remove();
            	}
            });
        }
    });
};


var GINI_IndicatorWatcher = (function(){
	var indicatorIsRun = false;
	var indicatorWaitTime = 0;
	
	var initializeIndicator = function(){
		indicatorWaitTime = 0;
		try{
			if(indicatorIsRun){
				indicatorIsRun = false;
				GINI_LoadingIndicatorStop();	
			}
		}catch(e){}
		
	};
	
	var monitoringIndicator = function(watching){
		
		function watchIndicator(){
			indicatorWaitTime++;
			if(indicatorIsRun && (indicatorWaitTime>watching)){
				//var ok = confirm("["+indicatorIsRun+"]인증서 발급이 지연되고 있습니다. 계속 기다리시겠습니까?");
				var ok = false;
				if (ok == true) {
					indicatorWaitTime = 0;
					setTimeout(watchIndicator, 100);
				} else {
					initializeIndicator();
					//alert("인증서 발급이 취소 되었습니다. 다시 시도하여 주세요.");
				 }
			}else if(indicatorIsRun){
				setTimeout(watchIndicator, 100);
			}else {
				initializeIndicator();
			}
//			console.log('##[WatchDog]indicator wait('+indicatorIsRun+') : ' + indicatorWaitTime);
		};
		
		if(!indicatorIsRun){
			indicatorIsRun = true;
			setTimeout(watchIndicator, 100);
		}
	};
	
	var isRunning = function(){
		return indicatorIsRun;
	};
	
	return {
		monitoringIndicator : monitoringIndicator,
		initializeIndicator : initializeIndicator,
		isRunning : isRunning
	}
}());

function GINI_LoadingIndicatorStart(text, watching){
	if( text == undefined || text == "" ) 
	text = 'Loading...';
	
	// native javascript
	var mm = null;
	
	if( document.getElementById("resultLoading") != null ){
		mm = document.getElementById("resultLoading").getAttribute('id');
	}
	
	if( mm == undefined || mm != 'resultLoading'){
		
		/* 메세지 처리 공통 처리 */
		
		var subText = "Please wait...";	// 잠시만 기다려주시기 바랍니다

		var html = "";
		html += '<div id="resultLoading" style="display:none">';
		html += 	'<div class="ini_cert_loading"><img alt="Loading..." src="' + GINI_HTML5_BASE_PATH + '/res/img/color_identity_blue/img_loading.gif">';
		html += 	'<p><b><em style="color:rgba(43, 64, 170, 1); font-weight:bold; font-size:16px;">'+text+'</em></b></p>'
		html += 	'<p><b><em style="font-size:11px;">'+subText+'</em></b></p> </div>'
		html += 	'<div class="ini_bg"></div>';
		html +=	 '</div>';

		var divNode = document.createElement("div");
		divNode.innerHTML = html;
		
		try{
			document.body.appendChild(divNode);
		}catch(e){
		}
	}
		
	var m1 = document.getElementById("resultLoading"), c1 = m1.style;
	c1.width = "50%";
	c1.height = "50%";
	c1.position = "fixed";
	c1.zIndex = '10000000';
	c1.margin = 'auto';
	c1.top = '0';
	c1.left = '0';
	c1.right = '0';
	c1.bottom = '0';
	
//	var m2 = m1.querySelectorAll(".ini_bg"); c2 = m2[0].style;
//	c2.width = "100%";
//	c2.height = "100%";
//	c2.position = "absolute";
//	c2.background = '#000000';
//	c2.top = '0px';
//	c2.opacity = '0.7';

	var m3 = document.querySelectorAll("#resultLoading>div");
	var c3 = m3[0].style;
	
	c3.width = "238px";
	c3.height = "97px";
	c3.textAlign = 'center'; 
	c3.position = "fixed";
	c3.top = '0';
	
	c3.left = '0';
	c3.right = '0';
	c3.bottom = '0';
	c3.margin = 'auto';
	c3.zIndex = '10000001';

	c3.fontSize = '15px';
	c3.fontFamily  = '맑은 고딕';
	c3.lineHeight = '25px';
	c3.backgroundColor = '#fff';
	c3.opacity = '0.9';
	
	c3.border	='1px solid';
	c3.borderColor='rgba(35, 132, 217, 1)';
		
    m1.style.display = 'block';
    document.body.style.cursor = "wait";
    
    if(watching && !GINI_IndicatorWatcher.isRunning()){
    	setTimeout(
    			function (){
    				GINI_IndicatorWatcher.monitoringIndicator(watching)
    			}
    	, 10);	
    }
}

function GINI_LoadingIndicatorStop(){
		GINI_IndicatorWatcher.initializeIndicator();
	
	($ || jQuery)('#resultLoading .bg').height('100%');
	//($ || jQuery)('#resultLoading').fadeOut(300);
	($ || jQuery)('#resultLoading').hide();
    ($ || jQuery)('body').css('cursor', 'default');
}
/*
 * DESC	:	메세지 출력 공통 msg_type 별 디자인이 변경됨.
 * TYPE		:	CERT		- 인증서 발급 완료 시.
 * 					NOIT		- 공지시 사용.
 * 					CONF	- 확인 처리시.
 * 					ERROR	- 에러 발생시.
 * DATE		: 2016.12.07
 */
function INI_ALERT(output_msg, msg_type, INI_popupHandleInfo){
  return cwui.INI_ALERT(output_msg, msg_type, INI_popupHandleInfo);
}

// 삭제
function _INI_ALERT(output_msg, msg_type, INI_popupHandleInfo){
	if(INI_popupHandleInfo){
		INI_CONFIRM(output_msg, msg_type, INI_popupHandleInfo);
	} else {
		INI_CONFIRM(output_msg, msg_type, undefined);
	}
}


function INI_DOWNLOAD_CONFIRM(output_msg, downloadUrl){
	
	var INI_popupHandleInfo = [];
	INI_popupHandleInfo["OK"] = 
		function(){
			window.open(downloadUrl, "", "width=560, height=510")
		}
	
	INI_popupHandleInfo["CANCEL"] = undefined;
	INI_CONFIRM(output_msg, "confirm", INI_popupHandleInfo);
}

function INI_CONFIRM(output_msg, msg_type, INI_popupHandleInfo){
  return cwui.INI_CONFIRM(output_msg, msg_type, INI_popupHandleInfo);
}

// 삭제
function _INI_CONFIRM(output_msg, msg_type, INI_popupHandleInfo){
	if(($ || jQuery)("#INI_message_modal").dialog('isOpen') === true){
		return ;
	}
	
	// 메세지 디자인 HTML
	var contentUrl = GINI_HTML5_BASE_PATH + "/res/form/pc/common/message/pop_message.html";
	if(msg_type === "confirm"){
		contentUrl = GINI_HTML5_BASE_PATH + "/res/form/pc/common/message/pop_confirm_message.html";
		msg_type = "CONF"; //정범교
	}
	($ || jQuery).ajax({
			'url'			: contentUrl,
			'data'		: { msgType:msg_type},
			'global'		: false,
			'success'	: function success(data, textStatus, xhr) {
				if(($ || jQuery)("#INI_message_modal").dialog('isOpen') === true){
					return ;
				}
									($ || jQuery)("<div id='INI_message_modal' style='min-height=178px !important;'>" + data + "</div>").data("INI_popupHandleInfo", INI_popupHandleInfo).dialog({
											"modal"				:	true,
											"width"					:	'381px',
											"height"					:	'auto',
											"resizable"				:	false,
											"draggable"			:	false,
											"closeOnEscape"	:	false,
											"stack"					:	false,
											"show"					:	{
																				effect		:	"puff",
																				duration	:	400,
																				complete	:	function() {
																									}
																			},
											"position"				: {	
																				my		: "center",
																				at			: "center",
																				collision	: "none"
																				//of: "#INI_mainModalDialog",
																			},
											"open"					:	function(event, ui){
						                	
																				var iconNm="warn";
															                	switch( msg_type ){
															                	
																                	case "CERT"	:	iconNm="cert";																                	
																                							//인증서가 성공적으로 발급되었습니다.
																                							output_msg = _ini.msgFactory.getMessageFactory().WebForm().TEXT().CERT_MANAGE().W_T_C_M_012; 
																                							break;
																                	case "NOIT"	:	iconNm = "notice";	break;
																                	case "CONF"	:	iconNm = "confirm";	break;
																                	default			:	iconNm = "warn";
															                	}
															                	// 상황별 아이콘 호출
															                	($ || jQuery)(".icon").addClass( iconNm );										                	
															                	// 닫기 버튼 이미지 호출
															                	($ || jQuery)('#close_a').attr('src',GINI_HTML5_BASE_PATH + '/res/img/btn/btn_layer_close_large.png');
															                	// 메세지 출력
															                	($ || jQuery)('#msg_area').html(output_msg);
															                	
															                	($ || jQuery)(".ui-dialog-titlebar"			).hide();
															                	($ || jQuery)(".ui-dialog"						).css('overflow','visible');
															                	($ || jQuery)("#INI_message_modal"	).css('overflow', 'visible');             	
															                	//  TODO 왜 있어야 하는지?
															                	//20170115
															                	GINI_LoadingIndicatorStop();
															                },
											"close"					:	function (e, ui) {
																				($ || jQuery)(this).removeData("INI_popupHandleInfo");
																				($ || jQuery)(this).remove();
																			}
						            });	//($ || jQuery)("<div id='INI_message_modal'>" + data + "</div>").dialog({
			},		//'success'	: function success(data, textStatus, xhr) {
			tryCount :0
			,retryLimit :1
     		,'error': function(xhr, status, error){
     			this.tryCount++;
				if(this.tryCount <= this.retryLimit){
					($ || jQuery).ajax(this);
					return;
				}
				console.log(
						"code:"		+xhr.status+"\n"+
						"message:"	+xhr.responseText+"\n"+
						"status:"	+status+"\n"+
						"error:"	+error);
				INI_HANDLE.infoMessage("ERROR : " + xhr);
				($ || jQuery)(this).remove();
				return;	
     		}
	});	//($ || jQuery).ajax({
}	//function INI_ALERT(output_msg, msg_type){

var INI_CUSTOM_BANNER_HANDLE = (function(){
	
	var customBannerUrl = "";
	var bannerUseYN = true;
	// 배너 url
	var getCustomBannerUrl = function(){
		return customBannerUrl;
	};
	var setCustomBannerUrl = function(_customBannerUrl){
		customBannerUrl = _customBannerUrl;
	};
	
	// 배너 사용여부
	var getBannerUseYN = function(){
		return bannerUseYN;
	};
	var setBannerUseYN = function(_bannerUseYN){
		bannerUseYN = _bannerUseYN;
	};
	
	return {
		setCustomBannerUrl : setCustomBannerUrl,
		getCustomBannerUrl : getCustomBannerUrl,
		setBannerUseYN : setBannerUseYN,
		getBannerUseYN : getBannerUseYN
	}
}());

// 기본적인 언어셋팅
var INI_LANGUAGE_HANDLE = (function(){

//	var language = "eng";
	var language = "kor";
	
	var setSystemLanguage = function(_language){
		language = _language;
		cwui.defaultConf.System.Language = _language;
	};
	
	var getSystemLanguage = function(){
		return language;
	};
	
	return {
		setSystemLanguage : setSystemLanguage,
		getSystemLanguage : getSystemLanguage,
	}
}());

var INI_HANDLE = (function() {

	/**
	 * @desc : Exception 처리
	 */
	function handleMessage(ex, message){
		
		var console = window.console || {log:function(){}}; 
		
		GINI_LoadingIndicatorStop();
		if(message!==undefined){
			INI_ALERT(message);
		} else {
			if(ex){
				
				switch(ex.type){
				case 'error' :
					break;
				case 'warn' :
					
					break;
				case 'info' :
					
					break;
				}
				if(ex.stack){
					console.log("[ERROR]",ex.stack);
				}else if(ex.stacktrace){
					console.log("[ERROR]",ex.stacktrace);
				}
				if(ex.message){
					console.log("[ERROR]",ex.message);
					INI_ALERT(ex.message);
				}
			}
		}
	}
	
	/**
	 * @desc : 비동기 알림 메시지
	 */
	var infoMessage = function(message){
		var ex = {};
		ex['type'] = 'info';
		handleMessage(ex, message);
	};

	/**
	 * @desc : 비동기 알림 메시지
	 */
	var warnMessage = function(message){
		var ex = {};
		ex['type'] = 'warn';
		handleMessage(ex, message);
	};
	
	/**
	 * @desc : 비동기 오류 처리
	 */
	var errorMessage = function(ex, msg, detail){
		if(detail !== undefined){
			msg = msg + '\n' + detail;
		}
		handleMessage(ex, msg);
	};
	
	return {
		infoMessage : infoMessage,
		warnMessage : warnMessage,
		errorMessage : errorMessage,
		handleMessage : handleMessage
	};
}());

var GINI_ProtectMgr = (function() {
	var _secureNumnce;
	var _targetSecure;
	var _inputNonce;
	var _newNonce;
	var _newNonceCfm;
	
	var destroy = function(type){
		if("NONCE" == type){
			_inputNonce = 0x00;
		}else if("NEW_NONCE" == type){
			_newNonce = 0x00;
		}else if("NEW_NONCE_CNF" == type){
			_newNonceCfm = 0x00;		
		}else if("SECURE" == type){
			_secureNumnce = 0x00;
		}else if("TARGET_SECURE" == type){
			_targetSecure = 0x00;
		}else{
			//_secureNumnce = 0x00;
			_targetSecure = 0x00;
			_inputNonce = 0x00;
			_newNonce = 0x00;
			_newNonceCfm = 0x00;
		}
	};
	
	function dummy(){
		var len = Math.floor((Math.random() * 100) + 1);
		var rnd = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);

		return rnd.substr(0, 3) + (len +'') + rnd.substr(3, 6) + rnd.substr(6, 9) + Math.floor((Math.random() * 99) );
	};
	
	var clean = function(type){
		if("NONCE" == type){
			_inputNonce = undefined;
		}else if("NEW_NONCE" == type){
			_newNonce = undefined;
		}else if("NEW_NONCE_CNF" == type){
			_newNonceCfm = undefined;			
		}else if("SECURE" == type){
			_secureNumnce = undefined;	
		}else if("TARGET_SECURE" == type){
			_targetSecure = undefined;	
		}
	};
	
	var keep = function(type, nonce){
		if("NONCE" == type){
			_inputNonce = nonce;
		}else if("NEW_NONCE" == type){
			_newNonce = nonce;
		}else if("NEW_NONCE_CNF" == type){
			_newNonceCfm = nonce;			
		}else if("SECURE" == type){
			_secureNumnce = nonce;	
		}else if("TARGET_SECURE" == type){
			_targetSecure = nonce;	
		}
		return dummy();
	};
	
	var extract = function(type){
		if("NONCE" == type){
			return _inputNonce;
		}else if("NEW_NONCE" == type){
			return _newNonce;
		}else if("NEW_NONCE_CNF" == type){
			return _newNonceCfm;
		}else if("SECURE" == type){
			return _secureNumnce;
		}else if("TARGET_SECURE" == type){
			return _targetSecure;	
		}
	};
	
	return {
		destroy : destroy,
		clean : clean,
		extract : extract,
		keep : keep
	}
}());

//#############################################################################################################
/**
 * @desc : 제품 연동을 위한 콜백 처리 함수
 */
var GINI_StandbyCallBack = (function(){
	/* 콜백 저장 객체*/
	var _callback = {};
	var _exceptionCallback = {};
	
	/**
	 * @desc : transaction단위 콜백 보관
	 */
	var setCallback = function(transactionId, callback){
		_callback[transactionId] = callback;
	};
	
	/**
	 * @desc : 콜백 제공
	 */
	var getCallback = function(transactionId){
		return _callback[transactionId];
	};
	
	/**
	 * @desc : transaction단위 후처리 함수 보관
	 */
	var setExceptionCallback = function(transactionId, exceptionCallback){
		_exceptionCallback[transactionId] = exceptionCallback;
	};
	
	/**
	 * @desc : 후처리 함수 제공
	 */
	var getExceptionCallback = function(transactionId){
		return _exceptionCallback[transactionId];
	};
	
	return{
		setCallback : setCallback,
		getCallback : getCallback,
		setExceptionCallback : setExceptionCallback,
		getExceptionCallback : getExceptionCallback
	};
}());

/**
 * 키보드 보안 초기화
 */
var GINI_KeyboardEX_Initialize = function(callback){
/*
	try{
		if(!getKBinitializeFlag()){
			KBinitialize(callback);
		}else{
			callback(true);
		}
	}catch(e){
		console.log("[ERROR]",e);
	}
*/
};

//스크롤
var INI_mScroll;

function INI_msLoad () {
	INI_mScroll = new IScroll('#m_ini_cert_wrap', {
		scrollbars: true,
		mouseWheel: true,
		interactiveScrollbars: true,
		shrinkScrollbars: 'scale',
		fadeScrollbars: true
	});
}

function INI_maxLengthCheck(object){
	if(object.value.length > object.maxLength){
		object.value = object.value.slice(0, object.maxLength);
	}
}

function INI_onlyNumber(event){
	event = event || window.event;
	var keyID = (event.witch) ? event.witch : event.keyCode;
if((keyID >= 48 && keyID <= 57) || 
		(keyID >= 96 && keyID <= 105) || 
		keyID == 8 || 
		keyID == 9 || 
		keyID == 46 || 
		keyID == 37 || 
		keyID == 39 || 
		keyID == 13){
		return;
	} 
	else {
		return false;
	}
}

function INI_removeChar(event){
	event = event || window.event;
	var keyID = (event.witch) ? event.witch : event.keyCode;
	if(keyID == 8 || 
		keyID == 9 || 
		keyID == 46 || 
		keyID == 37 || 
		keyID == 39){
		return;
	} 
	else {
		event.target.value = event.target.value.replace(/[^0-9]/g,"");
	}
}

var INI_SESSION_STORAGE_HANDLER = (function(){
	var sessionInfo;
	function getSessionStorageInfo(){
		if(sessionStorage && sessionStorage.SELECTED_CERT_INFO){
			sessionInfo = JSON.parse(sessionStorage.SELECTED_CERT_INFO);
		}
		return sessionInfo;
	}
	
	var getLoginDevice = function(){
		if(!getSessionStorageInfo()){
			return;
		}
		return sessionInfo.deviceId;
	};
	
	var getLoginCertId = function(){
		if(!getSessionStorageInfo()){
			return;
		}
		return sessionInfo.certId;
	};
	
	return {
		getLoginDevice : getLoginDevice,
		getLoginCertId : getLoginCertId,
	}
}());

//전자서명 창 컨트롤
var INI_PLAINTEXT_VIEW_HANDLER = (function(){
	
//	안보임 :: NONE
//	그리드 타입 :: GRID
//	텍스트 타입 :: TEXT
	var plaintextViewType = undefined;
	
	var setPlaintextViewType = function(_plaintextViewType){
		plaintextViewType = _plaintextViewType;
	};
	
	var getPlaintextViewType = function(){
		return plaintextViewType;
	};
	
	return {
		setPlaintextViewType : setPlaintextViewType,
		getPlaintextViewType : getPlaintextViewType,
	}
}());

var isInputPWEmpty = function( val){
	if(val =="" || val == null || val ==undefined){
		return true;
	}else{
		return false;
	}
};
/*function INI_getPlatformInfo() {
    var platformInfo = {
        Windows:false, Linux:false, Ubuntu:false, Fedora:false, Mac:false, iOS:false, Android:false,
        Mobile:false, x64:false,
        type: "unknown", name: "unknown"
    };
    platformInfo.name = navigator.platform;
    if (navigator.appVersion.match("WOW64")) platformInfo.name = "WOW64";

    if (platformInfo.name.match(/Win32/i) || platformInfo.name.match(/WOW64/i)) {
        platformInfo.Windows = true;
        platformInfo.type = "Windows";
        if (navigator.appVersion.match(/Win64/i)) {
            platformInfo.name = "Win64";
            platformInfo.x64 = true;
            platformInfo.type = "Windows64";
        }
    } else if (platformInfo.name.match("Win64")) {
        platformInfo.Windows = true;
        platformInfo.x64 = true;
        platformInfo.type = "Windows64";
    } else if (platformInfo.name.match("Linux armv")) {
        platformInfo.Mobile = true;
        platformInfo.Android = true;
        platformInfo.type = "Android";
    } else if (platformInfo.name.match(/Linux/i)) {
        platformInfo.Linux = true;
        platformInfo.type = "Linux";
        if (platformInfo.name.match(/x86_64/i)) {
            platformInfo.x64 = true;
            platformInfo.type = "Linux64";
        } else if (navigator.userAgent.match(/x86_64/i)) { //Opera
            platformInfo.x64 = true;
            platformInfo.type = "Linux64";
        }
        if (navigator.userAgent.match(/Fedora/i)) {
            platformInfo.Fedora = true;
            platformInfo.type = "Fedora";
            if (platformInfo.x64) platformInfo.type = "Fedora64";
        } else if (navigator.userAgent.match(/Ubuntu/i)) {
            platformInfo.Ubuntu = true;
            platformInfo.type = "Ubuntu";
            if (platformInfo.x64) platformInfo.type = "Ubuntu64";
        } else if (navigator.userAgent.match(/Android/i)) { //modify 20150903: Samsung Galaxy Edge
            platformInfo.Linux = false;
            platformInfo.Mobile = true;
            platformInfo.Android = true;
            platformInfo.type = "Android";
        }
    } else if (platformInfo.name.match(/MacIntel/i)) {
        platformInfo.Mac = true;
        platformInfo.type = "Mac";
    } else if (platformInfo.name == "iPad"
            || platformInfo.name == "iPhone"
            || platformInfo.name == "iPod"
            || platformInfo.name == "iOS") {
        platformInfo.Mobile = true;
        platformInfo.iOS = true;
        platformInfo.type = "iOS";
    }

    if( (navigator.userAgent.match(/iPhone/i))  ||
        (navigator.userAgent.match(/iPod/i))    ||
        (navigator.userAgent.match(/iPad/i))    ||
        (navigator.userAgent.match(/Android/i))) {
        platformInfo.Mobile = true;
    }
    if( (navigator.userAgent.match(/Windows Phone/i)) ||
        (navigator.userAgent.match(/Windows CE/i))    ||
        (navigator.userAgent.match(/Symbian/i))       ||
        (navigator.userAgent.match(/BlackBerry/i))) {
        platformInfo.Mobile = true;
    }

    //modify/remove system type
    if (navigator.userAgent.match("Android") && navigator.userAgent.match("Opera Mini")) {
        platformInfo.Mobile = true;
        platformInfo.Android = true;
        platformInfo.type = "Android";
    }
    return platformInfo;
}*/
function showCertImminentDay( certObj , certImmiText,  preText , sufixText ){
	// 기존 툴팁 선제거
	($ || jQuery)(".data_finish_message").remove();

	//인증서 임박 tooltip 표출
	var certStatusText	= certObj.find(".ico").text();	
	var expiredDay		= certObj.find("td:eq(2)").text();
	var arrEx				= expiredDay.split("-");
	var nowDate			= new Date();
	var expiredDate		= new Date(arrEx[0],arrEx[1]-1,arrEx[2]);
	var gap					= expiredDate.getTime() - nowDate.getTime();
	var imminentDay		= Math.floor( gap / ( 1000 * 60 * 60*24) );
	
	if( certStatusText === certImmiText ){
		/*
		인증서 리스트 테이블 헤더를 고정시킴으로서 기존 아래의 소스는 툴팁 표시에 문제가 있어 일단 주석 처리하고. 새로운 소스로 수정함
		var certImminentHtml = "<div style ='z-index : 9999; postion:absolute' class='data_finish_message' id='data_finish_message' >"
											+ preText + expiredDay 
											+ sufixText											
											+" <i class='arr add_rotate'></i>"
											+"</div>";
		var tdObj =certObj.find("td:eq(1)");
		tdObj.append(certImminentHtml );
		try{
			($ || jQuery)("#data_finish_message").position({my:"center top",at:"center bottom",of:tdObj});
		}catch(e){}
		*/
		
		var certImminentHtml = "<div style ='z-index : 9999; position:fixed' class='data_finish_message' id='data_finish_message' >"
			+ preText + expiredDay 
			+ sufixText											
			+" <i class='arr add_rotate'></i>"
			+"</div>";
		var tdObj =certObj.find("td:eq(1)");
		tdObj.append(certImminentHtml );
		var xpos = tdObj.offset().left;
		var ypos = tdObj.offset().top;
		var height = tdObj.height();
		var width = tdObj.width();
		//($ || jQuery)("body").append(certImminentHtml);
		
		try{
		($ || jQuery)("#data_finish_message").show();
		($ || jQuery)("#data_finish_message").offset({left : xpos    , top : ypos + height});
		}catch(e){}
			}
}
function hideCertImminentDay(){
	
	($ || jQuery)(".data_finish_message").remove();
}

//----------------------------------------정범교SORT---------------------------------------
var INI_sort_dvs = "";
var INI_sort_state = "";
function certGridSolt(value, headerArr){
	
	//정렬상태 치환 및 아이콘 변경
	if(INI_sort_dvs == value){
		if(INI_sort_state == "desc" || INI_sort_state == ""){
			INI_sort_state = "asc";
			($ || jQuery)("#INI_sort_span_" + value).html('<img width="8" src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/btn_grid_sort_up.png" >');
		}else{
			INI_sort_state = "desc";
			($ || jQuery)("#INI_sort_span_" + value).html('<img width="8" src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/btn_grid_sort_down.png" >');
		}
	}else{
		if(INI_sort_dvs != ""){
			($ || jQuery)("#INI_sort_span_" + INI_sort_dvs).html('<img width="8" src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/btn_grid_sort_cancel.png" >');
		}
		($ || jQuery)("#INI_sort_span_" + value).html('<img width="8" src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/btn_grid_sort_up.png" >');
		INI_sort_dvs = value;
		INI_sort_state = "asc";
	}
	
	var headerList = []; 
	var tempArr = headerArr.split(','); //설정된 테이블 헤더값 순서
	for(var k in tempArr)
	{
		headerList.push(tempArr[k]);
	}
	
	var sortList = []; //정렬할 대상 리스트
	
	($ || jQuery)("#INI_certList tbody tr").each(function(index) { 
		($ || jQuery)(this).removeClass("active");//전체 포커스 삭제
		var eachTrRow = ($ || jQuery)("#INI_certList tbody>tr").get(index);
		var eachTrId = eachTrRow.id;
		var eachTrRowHtml = eachTrRow.outerHTML;
		var sortTrTdText = "";
		
		if(value == "gubun"){
			sortTrTdText = ($ || jQuery)(this).find("td:eq("+headerList.indexOf(value)+")").find("span:eq(1)").text();
		}else{
			sortTrTdText = ($ || jQuery)(this).find("td:eq("+headerList.indexOf(value)+")").find("a").text();
		}
		
		//id당 정렬할 대상을 리스트에 넣음
		var sObj = {};
		sObj["id"] = eachTrId;
		sObj["value"] = sortTrTdText;
		sObj["html"] = eachTrRowHtml;
		sortList.push(sObj);
		
	});
	
	if(INI_sort_state == "asc"){ // 오름차순
		sortList.sort(function(a, b) { 
		    return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
		});
	}else{ // 내림차순
		sortList.sort(function(a, b) { 
		    return a.value > b.value ? -1 : a.value < b.value ? 1 : 0;
		});
	}
		
	var html = ""; 
	for(var i in sortList)
	{
		html += sortList[i].html;
	}
	($ || jQuery)("#INI_certList tbody").html(html);
	($ || jQuery)('#INI_certList tbody').find("tr:eq(0)").addClass("active");//첫번째줄 포커스
}
//-------------------------------------------------------------------------------