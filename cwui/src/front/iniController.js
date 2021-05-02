/* 매체 리스트 클릭시 무조건 매체 리스트 로딩 및 초기화하기 때문에 
 * 인증서 직접 가져오기등에서  저장할 매체를 선택해야 하는 버젼
 * */ 
define([
	'../main/constants',
	'../core/utils',
	'../front/iniAction',
	'../front/iniTemplate',
	'../front/iniCertManager',
	'../front/inputLayout',
	'../front/messageBundles',
	'../front/messageDialog', 
	'../front/preProcessor',
	'../front/postProcessor',
	'../conf/msgFactory',
	'../conf/defaultConf',
	'../keyStrokeSecurity/inikeyStrokeSecurityFactory',
	'../main/system',
	 '../core/iniException'
	], function(constants, utils, iniAction, iniTemplate, iniCertManager,  inputLayout, messageBundles, messageDialog, preProcessor,postProcessor, msgFactory, defaultConf, keyStrokeSecurityFactory, system,iniException) {
	"use strict";
	var _handleInfo, 
		_pin, 
		_targetPin, 
		_pwd, 
		_newPwd, 
		_newPwdCnf, 
		_oldPwd, 
		_orgAction,
		_orgBehavior,
		_encP12Cert, 
		_INI_authNum, 
		isControllerInit  = false, 
		_limitTime,
		_cancelHandler  =  defaultCancelHandler,
		_confirmHandler = null,

		_controllerConstants  = {
			FILE_SELECT_STATUS : { SUCCEED : "FILE_SELECT_SUCCEED", ERROR : "FILE_SELECT_ERROR"},
			FILE_SELECT_TYPE: { DRAG_SELECT : "DRAG_SELECT", OPEN_SELECT : "OPEN_SELECT"},
		},
		_elems  =  {
			$DLG_CONTAINER : $("<div id = 'INI_mainModalDialog' class = 'certificate_modal'></div>"),
			$SUB_DLG_CONTAINER : $("<div id = 'INI_drawDialog' class = 'certificate_modal'></div>"),
			INI_AREA : ".INI_area",
			INI_CHANGE_AREA : ".INI_change_area",
			CERTIFICATE_VIEW_AREA : ".certificate_view_area",
	   	},
		_CERT_SETTINGS = { 
			/* 각 인증서 액션별 element*/ 
			VIEW_LAYOUT : {
				LOGIN : ['#media_select_area', '#INI_certificate_area', '.certifacte_input_area', '#confirm_btn_area'],
				CMP : ['#media_select_area', '.certifacte_input_area', '#confirm_btn_area'],
				ISSUE : ['#media_select_area', '.certifacte_input_area', '#confirm_btn_area'],
				SIGN : ['#certificate_signature_area', '#media_select_area', '#INI_certificate_area', '.certifacte_input_area', '#confirm_btn_area'],
				MANAGE : ['#media_select_area', '#INI_certificate_area', '#certificate_manage'],
				EXPORT :  ['#media_select_area', '#INI_certificate_area', '.certifacte_input_area', '#confirm_btn_area'],
				IMPORT :  ['#certificate_import_area']
			}
		};
	
	var exported = {};
	if (typeof Object.defineProperty !== "undefined" && Object.defineProperty) {
		var moduleProperties = [
			{ proNm : "handleInfo", proOpts : { enumerable : false, configurable : false, get: function(){ return _handleInfo}, set: function(value){_handleInfo = value}}},
			{ proNm : "pin", 	proOpts : { enumerable : false, configurable : false, get: function(){ return _pin}, set: function(value){_pin = value}}},
			{ proNm : "targetPin", proOpts : { enumerable : false, configurable : false, get: function(){ return _targetPin}, set: function(value){_targetPin = value}}},
			{ proNm : "pwd", proOpts : { enumerable : false, configurable : false, get: function(){ return _pwd}, set: function(value){_pwd = value}}},
			{ proNm : "newPwd", proOpts : { enumerable : false, configurable : false, get: function(){ return _newPwd}, set: function(value){_newPwd = value}}},
			{ proNm : "newPwdCnf", proOpts : { enumerable : false, configurable : false, get: function(){ return _newPwdCnf}, set: function(value){_newPwdCnf = value}}},
			{ proNm : "INI_authNum", proOpts : { enumerable : false, configurable : false, get: function(){ return _INI_authNum}, set: function(value){_INI_authNum = value}}},
			{ proNm : "encP12Cert", proOpts : { enumerable : false, configurable : false, get: function(){ return _encP12Cert}, set: function(value){_encP12Cert = value}}}
		];
		
		for (var i = 0; i < moduleProperties.length; i++){
			Object.defineProperty(exported,moduleProperties[i].proNm, moduleProperties[i].proOpts );
		}
	} 
	
	/* Exported function */
	
	/** 
	 * @description 인증서 창 생성(외부 호출 가능) 
	 * @param {objectr} HandleInfo.  
	 * @param {string} 생성할 폼 타입 (MODAL || null)
	 */ 
	function openMainWnd(handleInfo,viewType){
		if (typeof handleInfo === "undefined" || !handleInfo) {
			INI_HANDLE.warnMessage("Invalid HandleInfo");
			return;
		}
		try {
			initializeController(handleInfo, viewType);
		}catch(e){
			exlog("iniController [exception] error", e);
			exalert("iniController ", "iniController. initailize Error");	
		}
	}
	
	/* Exported function end*/ 
	
	
	/** 
	 * @description 인증서 창 닫기  - Exported Module Function
	 */ 
	function closeWindow(){
		$(".ui-dialog-titlebar-close").trigger('click');
		$(window).unbind("resize", setDialogPosition);
		$(window).unbind("scroll",  setDialogPosition);
	}
	
	/** 
	 * @description 인증서 서브 모달 창 닫기 (타켓 저장 매체 다이얼로그 등) 
	 */ 
	function closeSubWindow(){
		if ($('#INI_drawDialog').length > 0 || $('#INI_drawDialog').dialog('isOpen')){
			$('#INI_drawDialog').dialog('close');
		}
	}
	
	/** 
	 * @description iniController 초기화 
	  * @param {objectr} HandleInfo.  
	  * @param {string} 생성할 폼 타입 (MODAL || null)
	 */ 
	function initializeController(handleInfo, viewType){
		try {
			_elems.$DLG_CONTAINER = $("<div id = 'INI_mainModalDialog' class = 'certificate_modal'></div>");
			_elems.$SUB_DLG_CONTAINER = $("<div id = 'INI_drawDialog' class = 'certificate_modal'></div>"),
			_handleInfo = handleInfo;
			_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
			initializeDependency();  
			_elems.$DLG_CONTAINER.html(getTemplate(null));
			initializeCertData();   
			initializeActionConstants();
			initializeViewLayout();    		
			initializeEventHandler();
			checkKeySecurity();
			createWindow();
			isControllerInit = true;
		}catch(e){
			console.error(">>> Exception Occured in initializing Controller \n", e);
		}
	}

	/** 
	 * @description 의존 스크립트 초기화
	 */ 
	function initializeDependency(){
		messageBundles.initialize(_elems.$DLG_CONTAINER,_elems.$SUB_DLG_CONTAINER);
		messageDialog.initialize();
		iniCertManager.initialize();
		iniAction.initialize();
		iniTemplate.initialize();
		inputLayout.initialize(_handleInfo,_elems.$DLG_CONTAINER);  
	}

	function initializeProcessData(){
		var action = _handleInfo.serviceInfo.getAction();
	    var behavior = _handleInfo.serviceInfo.getBehavior();
		var taskNm = _handleInfo.requestInfo.getParameter("taskNm");
		var logoType = "SUB";
		
		/* 인증서 리스트 생성 콜백 설정*/
		_handleInfo.serviceInfo.setParameter("DRAW_CERT_LIST_CALLBACK", callbackDrawCertList);
		
		switch(action){
		case constants.WebForm.ACTION_SIGN: 
			logoType = "MAIN";
			var selected = iniCertManager.getSelectedCertInfo();
			iniCertManager.drawStorageList(_handleInfo, selected);

			if (selected) {
				_handleInfo.serviceInfo.setEventDeviceId(selected.deviceId);
				_handleInfo.serviceInfo.setDeviceSub(selected.deviceSub);
				_handleInfo.serviceInfo.setParameter("CERT_ID", selected.certId);
				/*캐시된 내용에 따른 버튼 처리*/ 
				$("#INI_CERT_SEARCH").addClass('disabled');
				$("#INI_CERT_REMOVE").addClass('disabled');
				$("#INI_CERT_SEARCH").parent().children("i").css("cursor","default");
				$("#INI_CERT_REMOVE").parent().children("i").css("cursor","default");
			}
			iniCertManager.drawSignForm(_handleInfo);
			
			if(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_USIM){
				$('.media_select ul.media_list li.list_data').removeClass('list_select');
    	        $("#EXTEND" ).parent('li').addClass('list_select');
    	        
				iniCertManager.drawCertList({}, _handleInfo.serviceInfo.getDeviceId());
	        	_handleInfo.serviceInfo.setCallback(postConfirmHandler);
	        	_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
	        	iniAction.signature(_handleInfo);
	    		
			}else if(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_PHONE && 
					_handleInfo.serviceInfo.getDeviceSub() === constants.Certs.STORAGE_PHONE_MOBISIGN ){
				$('.media_select ul.media_list li.list_data').removeClass('list_select');
    	        $("#EXTEND" ).parent('li').addClass('list_select');
    	        
				initechApp.WebForm.drawCertList({}, _handleInfo.serviceInfo.getDeviceId());
	        	_handleInfo.serviceInfo.setParameter("USIM_FILTER_OID", defaultConf.Certs.getUSIMFilterList().USIM_FILTER_OID);
	        	_handleInfo.serviceInfo.setParameter("USIM_FILTER_ISSUERDN", defaultConf.Certs.getUSIMFilterList().USIM_FILTER_ISSUERDN);
	        	_handleInfo.serviceInfo.setParameter("USIM_FILTER_CA", defaultConf.Certs.getUSIMFilterList().USIM_FILTER_CA);
	        	_handleInfo.serviceInfo.setParameter("USIM_FILTER_EXPIRED", defaultConf.Certs.getUSIMFilterList().USIM_FILTER_EXPIRED);
	        	
	        	_handleInfo.serviceInfo.setCallback(postConfirmHandler);
	        	_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
	        	iniAction.signature(_handleInfo);
	    		
			}else if(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_PHONE && 
					_handleInfo.serviceInfo.getDeviceSub() === constants.Certs.STORAGE_PHONE_INFOVINE ){
				_handleInfo.optionInfo.setParameter("CERT_CACHE","TRUE");
				iniCertManager.storageClick(_handleInfo);
			} else {
				if (_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE || 
					_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD ) {
					if (selected) {
						iniCertManager.setPinFromStorage(_handleInfo);
					}
				}
				iniCertManager.storageClick(_handleInfo);
			}
			break;
		
		/* 기기간 복사에서 가져오기 일때는 인증서 리스트와 스토리지 리스트를 생성하지 않음 */ 
		case constants.WebForm.ACTION_CERT_IMPORT:
			var openCallback = function(){
				iniCertManager.drawLogo(logoType);
				$('input[name="INI_authNum"]').eq(0).focus();
			};
			replaceView( 
				"cert_import_v12_form", openCallback, 'LAYER' );
			return;
		
		case constants.WebForm.ACTION_CERT_CMP:
			if (behavior === constants.WebForm.ACTION_CERT_REVOKE) {
				var openCallback = function(){
					iniCertManager.drawLogo(logoType);
					_handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_NORMAL_ATTR);
					iniCertManager.getCertAttributeInfo(_handleInfo);
				};
				replaceView( "cert_remove", openCallback, "LAYER");
				return;
			}else {
				iniCertManager.drawStorageList(_handleInfo);
				iniCertManager.setFocusStorage(_handleInfo);
			}
			break;
			
		default : 
			iniCertManager.drawStorageList(_handleInfo);
			iniCertManager.storageClick(_handleInfo);
		}
		iniCertManager.drawLogo(logoType);
		iniCertManager.setFocusStorage(_handleInfo);
	}

	var browserPlatform, 
	downloadUrl,
	downloadFileName;
	
	/** 
	 * @description 데이타 초기화 
	 */ 
	function initializeCertData(){
		
		var deviceId;
		if(GINI_3rd_Party_Control.extensionPKI.getInstalled()){
			deviceId = constants.Certs.STORAGE_HDD;
		}else{
			deviceId = constants.Certs.STORAGE_BROWSER;
		}
		
		_handleInfo.serviceInfo.setEventDeviceId(deviceId);
		_handleInfo.serviceInfo.setDeviceSub(undefined);
		
		browserPlatform = system.Browser.getPlatform; 
		downloadUrl = defaultConf.Download.IMPORT_CERT_DOWNLOAD.URL;
		downloadFileName = "";
		
		if (browserPlatform.toLowerCase().indexOf('win') != -1) {
			downloadFileName = defaultConf.Download.IMPORT_CERT_DOWNLOAD.FILE_NAME_WINDOW;
		} else if(browserPlatform.toLowerCase().indexOf('mac') != -1){
			downloadFileName = defaultConf.Download.IMPORT_CERT_DOWNLOAD.FILE_NAME_MAC;
		} else if(browserPlatform.toLowerCase().indexOf('linux') != -1){
			if(system.Browser.is32bitsArchitecture()){
				downloadFileName = defaultConf.Download.IMPORT_CERT_DOWNLOAD.FILE_NAME_LINUX_32;
			} else {
				downloadFileName = defaultConf.Download.IMPORT_CERT_DOWNLOAD.FILE_NAME_LINUX_64;
			}
		} else {
			INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1013);
			return ;
		}
		
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();
		
		if (action === constants.WebForm.ACTION_CERT_CMP && behavior === constants.WebForm.ACTION_CERT_UPDATE) {
			var selected = iniCertManager.getSelectedReNewCertInfo();
			if(selected){
				_handleInfo.serviceInfo.setEventDeviceId(selected.deviceId);
				_handleInfo.serviceInfo.setDeviceSub(selected.deviceSub);
				
				if( selected.deviceId === constants.Certs.STORAGE_SECURITY_TOKEN ){
	            	_handleInfo.serviceInfo.setParameter("CERT_ID", selected.certId);
				}
			}
		}
	}
	
	/** 
	 * @description 인증서 리스트 창의 테이블 헤더 고정
	 */ 
	function fixedCertListHeader(){
		if (_elems.$DLG_CONTAINER.find('.table_wrap').height() <   100) {
			_elems.$DLG_CONTAINER.find('#INI_certList').fixedThead({ row: 1, height: '83' });
		}else {
			_elems.$DLG_CONTAINER.find('#INI_certList').fixedThead({ row: 1, height: '136' });
		}
		
		_elems.$DLG_CONTAINER.find('#INI_certList').parent().css({'overflow-y' : 'auto'});
		_elems.$DLG_CONTAINER.find('#INI_certList').parent().css({'overflow-x' : 'hidden'});
	}
	
	/** 
	 * @description 인증서 창의 뷰 초기화 및 초기화 데이타 준비
	 */ 
	function initializeViewLayout(){
		var action = _handleInfo.serviceInfo.getAction();
	    var behavior = _handleInfo.serviceInfo.getBehavior();
		var taskNm = _handleInfo.requestInfo.getParameter("taskNm");
		
		var viewSettingArr = _CERT_SETTINGS.VIEW_LAYOUT[action];
		
		switch(action){
		case constants.WebForm.ACTION_SIGN: 
			_elems.$DLG_CONTAINER.find(".INI_text_cert_manager").hide(); 
			_elems.$DLG_CONTAINER.find(".INI_CERT_SEARCH").hide(); 
			_elems.$DLG_CONTAINER.find(".INI_CERT_DETAIL").show(); 
			_elems.$DLG_CONTAINER.find("#initech_certificate_wrap .certificate_list_area .table_wrap").height(83); 
			break;
			
		case constants.WebForm.ACTION_CERT_EXPORT: 
			_elems.$DLG_CONTAINER.find(".INI_text_cert_manager").hide(); 
			_elems.$DLG_CONTAINER.find(".INI_CERT_SEARCH").show(); 
			_elems.$DLG_CONTAINER.find(".INI_CERT_DETAIL").show(); 
			
			break;
			
		case constants.WebForm.ACTION_CERT_CMP: 
			/* 인증서 폐기 후 삭제, 이 경우 action은 CMP , behavior 은 REVOKE  뷰를 변경함 */
			if (behavior === constants.WebForm.ACTION_CERT_REVOKE) {
				viewSettingArr =  ['#INI_change_area', '#confirm_btn_area'];
			}
			if (behavior === constants.WebForm.ACTION_CERT_UPDATE) {
				viewSettingArr = ['#media_select_area', '.certifacte_input_area', '#confirm_btn_area'];
			}
			break;
			
		
		case constants.WebForm.ACTION_MANAGE: 
			_elems.$DLG_CONTAINER.find("#INI_certificate_area .manage").hide();
			if (typeof taskNm !== "undefined" &&  taskNm)  {
				//console.log("manage task  :  "   + taskNm);
			}
			break;
		case constants.WebForm.ACTION_CERT_ISSUE: 
			if (constants.WebForm.ACTION_CERT_ISSUE == behavior){
				$('#INI_certificate_area').hide();
			}
			break;
		case constants.WebForm.ACTION_CERT_IMPORT: break;
		case constants.WebForm.ACTION_LOGIN: break;
		case constants.WebForm.ACTION_CERT_ISSUE: break;
		case constants.WebForm.ACTION_CERT_REISSUE: break;
		case constants.WebForm.ACTION_CERT_UPDATE: break;
		}
		
		_elems.$DLG_CONTAINER.find(_elems.INI_AREA).hide();
		for (var i = 0; i < viewSettingArr.length ; i++){
			_elems.$DLG_CONTAINER.find(viewSettingArr[i]).show();
		}
	}
	
	function initializeActionConstants(){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior= _handleInfo.serviceInfo.getBehavior();
		
		if ( action == constants.WebForm.ACTION_CERT_EXPORT ||
				action == constants.WebForm.ACTION_CERT_IMPORT || 
				action  == constants.WebForm.ACTION_MANAGE) {
			_handleInfo.serviceInfo.setBehavior(_handleInfo.serviceInfo.getAction());
		}
		
		_orgAction = _handleInfo.serviceInfo.getAction();
		_orgBehavior= _handleInfo.serviceInfo.getBehavior();
	}
	
	/** 
	 * @description 인증서 창의 캡션 및 본문 텍스트 설정
	 */ 
	function initializeViewLayoutText(viewName){
		messageBundles.loadResource();
		messageBundles.setViewText(_handleInfo,viewName);
	}
	
	function checkKeySecurity(){
		var isSecInstalled = false;
		if(INI_getPlatformInfo().Windows){
			if( typeof(useTouchEnnxKey) != 'undefined'){
				if(!useTouchEnnxKey){
					_elems.$DLG_CONTAINER.find('.certificate_text_message').show();
					isSecInstalled = false;
	    		}else {
	    			_elems.$DLG_CONTAINER.find('.certificate_text_message').hide();
	    			isSecInstalled = true;
	    		}
			}else{
				_elems.$DLG_CONTAINER.find('.certificate_text_message').show();
				isSecInstalled = true;
			}
 		}
		return isSecInstalled;
	}
	
	/** 
	 * @description 제출창 종류별 버튼 레이아웃 구성
	 */ 
	function initializeButtonLayout(deviceId){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();

		if (action === constants.WebForm.ACTION_CERT_IMPORT){
			setCertButtonLayout(['ok','cancel']);
		} else if (action === constants.WebForm.ACTION_MANAGE){
			if (constants.Certs.STORAGE_SCARD == deviceId || 
					constants.Certs.STORAGE_SECURITY_DEVICE === deviceId || 
					constants.Certs.STORAGE_SECURITY_TOKEN == deviceId){
				setCertButtonLayout(['ok','cancel']);
			}else {
				setCertButtonLayout(['cancel']);
			}
		}else {
			setCertButtonLayout(['ok','cancel']);
		}
	}
	
	/** 
	 * @description 인증서 창의 이벤트 리스너 초기화 
	 */ 
	function initializeEventHandler(){
		attachFormCloseEvent();
		attachStorageSelectEvent();
		attachSubStorageSelectEvent();
		attachExtensionStorageSelectEvent();
		attachExtensionStorageCloseEvent();
		attachCertManagerEvent();
		attachCerListRowEvent();
		attachCertListMousehoverEvent();
		attachEventForCertSearch();
		attachEvnetForCertCopy();
		attachActionButtonEvent();
		attchExtEventHandler();	
	}
	
	function initializeKeyStrokeModule(){
		clearNonce();
		clearInput();
		keyStrokeSecurityFactory.initialize(_handleInfo);
	}
	/** 
	 * @description 입력박스 초기화
	 */  
	function initializeKeyStrokeLayout(deviceId){
		clearNonce();
		
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();

		var inputKeys = [];
		
		switch(action){
		case constants.WebForm.ACTION_SIGN: 
			if (isSecureMedia(deviceId)) {
				inputKeys.push(['SECURE'])
			}else {
				inputKeys.push(['NONCE']);
			}
			inputLayout.showKeyInputLayout(inputKeys);
			break; 
			
		case constants.WebForm.ACTION_LOGIN: 
			if (isSecureMedia(deviceId)) {
				inputKeys.push(['SECURE'])
			}else {
				inputKeys.push(['NONCE']);
			}
			inputLayout.showKeyInputLayout(inputKeys);
			break;
		
		case constants.WebForm.ACTION_CERT_EXPORT: 
			if (isSecureMedia(deviceId)) {
				inputKeys.push('SECURE')
			}else {
				inputKeys.push('NONCE');
			}
			inputLayout.showKeyInputLayout(inputKeys);
			break;
			
		case constants.WebForm.ACTION_CERT_IMPORT: 
			if (deviceId) {
				inputKeys.push('NONCE');
				if (isSecureMedia(deviceId) ) {
					inputKeys.push('SECURE')
				}
			}else {
				inputKeys.push(null);
			}
			inputLayout.showKeyInputLayout(inputKeys);
			break;
			
		case constants.WebForm.ACTION_CERT_UPDATE: 
		case constants.WebForm.ACTION_CERT_CMP: 
			if ( constants.WebForm.ACTION_CERT_UPDATE === behavior){
				inputKeys.push('NONCE');
				inputKeys.push('NEW_NONCE_CNF');
				if (isSecureMedia(deviceId) )  {
					inputKeys.push('SECURE')
				}
			} 
			/*인증서 폐기의 경우, input box disable*/
			else if (behavior != constants.WebForm.ACTION_CERT_REVOKE){
				inputKeys.push('NONCE');
				inputKeys.push('NEW_NONCE_CNF');
				if (isSecureMedia(deviceId))  {
					inputKeys.push('SECURE')
				}
			} 
			inputLayout.showKeyInputLayout(inputKeys);
			break;
			
		case constants.WebForm.ACTION_MANAGE:
			if (isSecureMedia(deviceId) ) {
				inputKeys.push('SECURE')
			}else {
				inputKeys.push(null)
			}
			inputLayout.showKeyInputLayout(inputKeys);
			break;
		case constants.WebForm.ACTION_CERT_ISSUE: 
			if (constants.WebForm.ACTION_CERT_ISSUE == behavior){
				if (isSecureMedia(deviceId) ) {
					inputKeys.push('NONCE')
					inputKeys.push('NEW_NONCE_CNF')
					inputKeys.push('SECURE')
				}else {
					inputKeys.push('NONCE')
					inputKeys.push('NEW_NONCE_CNF')
				}
				inputLayout.showKeyInputLayout(inputKeys);
			}
			break; 
		case constants.WebForm.ACTION_CERT_REISSUE: break;
		}
	}
	
	function isSecureMedia(deviceId){
		var rev = false;
		if (constants.Certs.STORAGE_SECURITY_TOKEN === deviceId || 
				 constants.Certs.STORAGE_SECURITY_DEVICE === deviceId ||
				 constants.Certs.STORAGE_SCARD === deviceId )  {
			rev = true;
		}
		return rev;
	}
	/** 
	 * @description 실제적인 인증서 창 생성 함수 
	 */ 
	function createWindow(){
		var viewType = viewType ? viewType : "MODAL";
		var orignCss = {overflow : $("html").css("overflow")};
		var certDlgOpts = {	
			autoOpen : false,
			modal : viewType === "MODAL" ? true : false,
			width : 'auto',
			resizable : false,
			draggable : false,
			closeOnEscape : false, 
			stack : false,
			
			create : function(){
				_elems.$DLG_CONTAINER.dialog().parents('.ui-dialog').find(".ui-dialog-titlebar").hide();
				//$(".ui-dialog-titlebar").hide();
				$("html").css({overflow: 'hidden'});
			},
			
			open : function(){
				onFormLoad();
				$("html").css({overflow: 'hidden'});
				$(this).parent().promise().done(function(){});
			},

			beforeClose : function(){
				$("html").css({overflow: ''});
			},
			
			close : function(){
				GINI_LoadingIndicatorStop();
				$("html").css(orignCss);
				onFormDestroy();
				$(this).dialog('close');
            	$(this).remove();
			}
		};
		_elems.$DLG_CONTAINER.dialog(certDlgOpts);
		_elems.$DLG_CONTAINER.parent().draggable({ handle: ".title_area" });
		_elems.$DLG_CONTAINER.dialog("open");
	}
	
	function setElementEnable(id, prop, css) {
		//$(id)[prop](css);
	}
	/** 
	 * @description 인증서 창의 화면 배치 위치 및 사이즈 조절 
	 */  
	function setDialogPosition(){
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		var elemtWidth = 	$("#INI_mainModalDialog").width();
		var elemHeight =  	$("#INI_mainModalDialog").height();

		var left = (windowWidth  - elemtWidth ) / 2;
		var top;
		
		if (windowHeight <= elemHeight) {
			top = windowHeight + $(window).scrollTop()   - elemHeight;
			$("#INI_mainModalDialog").position({my:'center bottom',at:'center bottom',of:window});
		}else {
			left = (windowWidth  - elemtWidth ) / 2;
			top = (windowHeight  / 2) + $(window).scrollTop()  -  elemHeight / 2;
			$("#INI_mainModalDialog").position({my:'center center',at:'center center',of:window});
		}
		if ($("#INI_drawDialog").length> 0 ) {
			$("#INI_drawDialog").dialog({position : {my:"center top",at:"center top+" + ($(window).scrollTop() + 70) , of:'#INI_mainModalDialog'}});
		}
	}

	
	/** 
	 * @description 선택된 액션에 따라 메인인증서 창의 뷰 생성 
	 * @param {object} _callback 뷰 교체후 초기화 및 후처리를 위한 콜백
	 * @param {object} viewType 
	 */ 
	function replaceView(viewName, openCallback, viewType) {
		var view  = iniTemplate.getTemplate(viewName);
		viewType =  viewType ? viewType : 'LAYER' ;
		
		if (viewType == "LAYER") {
    		$("#INI_certificate_area").hide();
        	$("#INI_change_area").empty();
        	$("#INI_change_area").append($(view));
        	$("#INI_change_area").show();
        	initializeViewLayoutText(viewName);
        	if (_handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_CERT_IMPORT) {
    			_cancelHandler = defaultCancelHandler;
    		}else {
    			_cancelHandler = previousCancelHandler;
    		}
        	if (openCallback) openCallback(_handleInfo);
        	
        	/* 레이어 삽입시  윈도우 위치 중앙 정렬
        	setTimeout(function(){
        		setDialogPosition();
        	}, 10)
        	 */
    	}
		 
		if (viewType =="MODAL") {
		    var certDlgOpts = {	
	    		"autoOpen":false,
		        "modal": true,
		        "width": '490px',
		        "height": 'auto',
		        "resizable":false,
		        "closeOnEscape": false, 
		        "stack": false,
		        "create": function(event, ui){
		            $(event.target).parent().css('position', 'fixed');
		            _elems.$SUB_DLG_CONTAINER.dialog().parents('.ui-dialog').find(".ui-dialog-titlebar").remove();
		        },
		        'modalCloseFn' : function modalFunc1(){
		        	var action = _handleInfo.serviceInfo.getAction();
		        	var behavior = _handleInfo.serviceInfo.getBehavior();
		        	/* 인증서 생성 후 다른 매체 저장을 위해 타켓 매체 모달의 닫기 버튼*/ 
		        	if (action === constants.WebForm.ACTION_CERT_ISSUE || behavior === constants.WebForm.ACTION_CERT_SAVE){
		        		defaultCancelHandler();
		        	}else {
		        		closeSubWindow();
		        	}
		        },
		        'modalTargetFn' : function modalFunc2(){onTargetStorageSelected(this,e);},
		        'modalSubTargetFn' : function modalFunc3(){onTargetSubStorageSelected(this,e);},

		        "open": function(event, ui){
		        	try {
		        		_elems.$SUB_DLG_CONTAINER.find('#INI_target_storage_title').bind('click', $(this).dialog('option','modalCloseFn'));
			        	_elems.$SUB_DLG_CONTAINER.find('.media_select_area .save_media_list>li>a').bind('click', $(this).dialog('option','modalTargetFn'));
			        	_elems.$SUB_DLG_CONTAINER.find('.media_select_area .save_media_list .save_drive_select ul li a').bind('click', $(this).dialog('option','modalSubTargetFn'));
			        	if (openCallback) openCallback(_handleInfo);
			        	initializeViewLayoutText(viewName);

			        	_elems.$SUB_DLG_CONTAINER.find(".ui-dialog-titlebar").hide();
			        	$(this).find(".ui-dialog").css('overflow','visible');
			        
			        	/* 상위 부모 모달(인증서 창) 의 중앙에 생성*/
			        	$("#INI_drawDialog").dialog({position : {my:"center top",at:"center top+" + ($(window).scrollTop() + 70) , of:'#INI_mainModalDialog'}});
		        	}catch(e){}
		        },
		        "close": function (e, ui) {
		        	if ($('#INI_drawDialog').length > 0) {
		        		$('#INI_drawDialog').dialog('destroy')
		        		$('#INI_drawDialog').remove();
		        		_elems.$SUB_DLG_CONTAINER.find('#INI_target_storage_title').unbind('click');
			        	_elems.$SUB_DLG_CONTAINER.find('.media_select_area .save_media_list>li>a').unbind('click');
			        	_elems.$SUB_DLG_CONTAINER.find('.media_select_area .save_media_list .save_drive_select ul li a').unbind('click');
		        	}
	            },
	        	beforeClose : function(){
					$("html").css({overflow: ''});
				},
    		};
    		
    		_elems.$SUB_DLG_CONTAINER.html(view);
    		_elems.$SUB_DLG_CONTAINER.dialog(certDlgOpts).dialog("open");
    	}
	}
	
	
	/** 
	 * @description 키보드 입력 모듈 초기화 
	 * @param {string} 생성 및 추가할 폼 템플릿 이름 .  
	 */ 
	function getTemplate(form){
		return iniTemplate.getTemplate(form);
	}

	/** 
	 * @description 현재 윈도우 크기와 인증서 폼크기를 조절하여 적절한 사이즈를 생성
	 */ 
	function getComputeWndPosAndSize(){
		var windowWidth = $(window).width();
		var widnowHeight = $(window).height();
	}

	/** 
	 * @description iniController reset
	 */ 
	function resetController(){
		if (exported) {
			if (typeof Object.defineProperty !== "undefined" && Object.defineProperty) {
				for (var i = 0; i < moduleProperties.length; i++){
					exported[moduleProperties[i].proNm] = null;
				}
			}else {
				_handleInfo = null;
				_pin = null;
				_targetPin = null; 
				_pwd = null;
				_newPwd = null;
				_newPwdCnf = null;
				_oldPwd = null;
				_encP12Cert = null;
				_INI_authNum= null; 
			}
		}
	}
	
	/** 
	 * 
	 * @description 액션에 따라 확인, 취소 버튼의 활성 /바활성화
	 */  
	function setCertButtonLayout(buttons){
		_elems.$DLG_CONTAINER.find("#confirm_btn_area button").hide();  
		if (buttons['length']){
			for ( var i = 0; i < buttons.length ; i++){
				var value = buttons[i];
				if (value.toLowerCase() == "ok") {
					_elems.$DLG_CONTAINER.find("button#INI_certSubmit").show();
				}else if (value.toLowerCase() == "cancel") {
					_elems.$DLG_CONTAINER.find("button#INI_certClose").show();
				}else {
					/* console.error("wrong button parameter")*/
				}
			} 
		}
	}

	/** 
	 * @description 인증서 리스트 로딩전 인증서 리스트 테이블 초기화
	 */  
	
	function initCertListText(content){
		var content = content || "<tr><td colspan ='4' style='text-align:center;background-color:#e5ecff;'>"
			+"<span class='no_data active' style='font-weight:bold;text-align:center;color:#1b066f;'>"
			+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_022
			+"</span>"
			+"</td></tr>";
		$("#" + constants.WebForm.CERT_TABLE + " tbody").html(content);
	
	}
	
	function setStorageCheck(elem, checked) {
		if (typeof checked !== 'undefined' && checked == true) {
			var chk = $('<span class="check">'+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_018+'</span>');
	    	$(elem).append(chk);
		}
	}

	/*******************************************************************************************
	 * Attach Event Function
	*******************************************************************************************/

	/** 
	 * @description 인증서 창 닫기 이벤트 핸들러 설정  
	 */ 
	function attachFormCloseEvent(){
		_elems.$DLG_CONTAINER.find('#INI_windowClose').click(function(){
			closeWindow();
		}); 
	}
	
	/** 
	 * @description 일반 저장 매체 이벤트 핸들러 설정
	 * (Browser. Hard disk, movable disk, phone, more)
	 */ 
	function attachStorageSelectEvent(){
		_elems.$DLG_CONTAINER.on('click', '.media_select_area .media_list>li>a', function(e){
			onStorageSelected(this,e);
		});
		
		_elems.$SUB_DLG_CONTAINER.on('click', '.media_select_area .save_media_list>li>a ', function(e){
			onTargetStorageSelected(this,e);
		});
	}
	
	/** 
	 * @description 일반 저장 매체의 하위 매체 이벤트 설정
	 */ 
	
	function attachSubStorageSelectEvent(){
		_elems.$DLG_CONTAINER.on('click', '.media_select_area .media_select .drive_select ul li a', function(e){
			onSubStorageSelected(this,e);
		});
		
		_elems.$SUB_DLG_CONTAINER.on('click', '.media_select_area .save_media_list .save_drive_select ul li a', function(e){
			onTargetSubStorageSelected(this,e);
		});
	}
	
	/** 
	 * @description 확장 매체 이벤트 핸들러 설정 
	 */ 
	function attachExtensionStorageSelectEvent(){
		_elems.$DLG_CONTAINER.on('click', '.media_select_area .media_select #INI_storage_ext_list ul li a', function(){
			onExtensionStorageSelected(this);
		});
	}
	
	/** 
	 * @description 인증서 Manager 이벤트 핸들러 설정
	 */ 
	function attachCertManagerEvent(){
		_elems.$DLG_CONTAINER.on('click', '.INI_text_cert_manager, .INI_img_cert_manager', function(e){
			onManagerClicked(this,e);
		});
	}

	/** 
	 * @description 확장 매체 닫기 핸들러 설정
	 */ 
	function attachExtensionStorageCloseEvent(){
		_elems.$DLG_CONTAINER.on('click', '.INI_cert_manager', function(){
		});
	}
	
	/** 
	 * @description 인증서 row 선택 이벤트 핸들러 설정
	 */ 
	function attachCerListRowEvent(){
		_elems.$DLG_CONTAINER.on('click', '#INI_certificate_area #INI_certList tr', function(e){
			onCertListRowSeleleted(this,e);
		});
	}

	/** 
	 * @description 인증서 row 마우스 오버 이벤트 
	 */ 
	function attachCertListMousehoverEvent(){
		_elems.$DLG_CONTAINER.on('mouseover','#INI_certificate_area #INI_certList tr', function (e) {
			var thisObj = $(e.currentTarget);
			showCertImminentDay( 
				thisObj , 
				msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().IMMINENT , 
				msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_027 ,
				msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_028 );
		});
		_elems.$DLG_CONTAINER.on('mouseout','#INI_certificate_area #INI_certList tr', function (e) {
			hideCertImminentDay();
		});
	}
	
	/** 
	 * @description 인증서 가져오기를 위한 이벤트 
	 */
	function attachEventForCertSearch(){
		/*탐색기 열기 버튼 이벤트*/ 
		_elems.$DLG_CONTAINER.on('click', '#INI_certFileFind', function(e){
			if ($('#INI_findfiles').length > 0) $('#INI_findfiles').click();
		});
		
		/* 간편 찾기 이벤트 핸들러*/
		_elems.$DLG_CONTAINER.on('click', '#INI_easy_search_area, #INI_easy_search_btn button', function(e){
			e.stopPropagation();
			certImportSearch(e);
		});
		
		/* 직접 찾기 이벤트 핸들러*/
		_elems.$DLG_CONTAINER.on('click', '#INI_easy_search_manual_area, #INI_manual_search_btn button', function(e){
			e.stopPropagation();
			certManualSearch(e);
		});
	}
	
	/** 
	 * @description 인증서 복사를 위한 이벤트 
	 */
	function attachEvnetForCertCopy(){}

	/** 
	 * @description 기타 부가적인 추가 이벤트 설정
	 */
	function attchExtEventHandler(){
		 /* 인증서 내보내기 입력 박스 엔터 이벤트 , 현재는 주석 처리함 
		 _elems.$DLG_CONTAINER.on('keyup', '#INI_change_area input[name="INI_authNum"]', function(e){
			 if( e.keyCode == 13 ) {
				 var inx = $('#INI_change_area input[name="INI_authNum"]').index(this);
				 if (inx == 0) $('#INI_change_area input[name="INI_authNum"]').eq(inx+1).focus();
				 if (inx == 1) {
					 $('#INI_certSubmit').trigger('click');
				 }
			 }
		 });
		 */
		/* 
		 * 일반 저장 매체의 서브리스트 닫기(x버튼) 핸들러 
		 * 핸들러 동작을 위해서 webForm.js 에서 추가된 버튼의 리턴값을 true로 변경해주어야 함 
		 * webForm에서 동적 추가된 핸들러가 서브리스트를 닫는 등의 1차 동작을 수행하며, 
		 * 이 핸들러에서는 닫은 후의 초기화 작업을 진행 
		 * */
		$(document).on('click','div.drive_select .drive_select_close_btn', function(){
			onSubListLayerClosed();
		});
		
		/* 위의 핸들러와 동일*/
		$(document).on('click','div#INI_storage_ext_list .close_btn', function(){
			onExtSubListLayerClosed();
		});
		
		/* 인증서 스크롤시 인증서 툴팁 제거 */
		_elems.$DLG_CONTAINER.on('mousewheel DOMMouseScroll', '#INI_certificate_area #INI_certList', function(e){
			hideCertImminentDay();			
		});

		/* FAQ 바로 가기 */
		_elems.$DLG_CONTAINER.on('click', "#INI_cert_faq_btn", function(e){
			hideCertImminentDay();			
		});
		
		/* 인증서 간편 찾기에서 프로그램 다운이벤트 */
		_elems.$DLG_CONTAINER.on('mousedown', "#INI_utilDownload", function(e){
			var INI_downloadLink_iframe = document.createElement("iframe");
        	INI_downloadLink_iframe.setAttribute("name", "INI_utilDownload_link");
        	INI_downloadLink_iframe.setAttribute("id", "INI_utilDownload_link");
        	INI_downloadLink_iframe.setAttribute("title", "INI_utilDownload_link");
        	INI_downloadLink_iframe.setAttribute("style", "display: none;");

        	var html5Language = INI_LANGUAGE_HANDLE.getSystemLanguage();
        	
        	document.body.appendChild(INI_downloadLink_iframe);
	        //console.log("downloadUrl : " + downloadUrl);	
	        //console.log("html5Language : " + html5Language);	
	        //console.log("downloadFileName : " + downloadFileName);	
        	document.getElementById("INI_utilDownload_link").src = downloadUrl + html5Language + "/" + downloadFileName;
		});
		
		/* 인증서 내보내기 인증번호 갱신 이벤트*/
		_elems.$DLG_CONTAINER.on('click', '#INI_cert_authnum_refresh', function(e){
			_handleInfo.serviceInfo.setParameter("AUTH_NUM", _INI_authNum);
			_handleInfo.serviceInfo.setParameter("CERT_STATUS", "CANCEL");
			_handleInfo.serviceInfo.setCallback(
				function(){
					iniAction.resetTimer();
					getAuthNum();
				});
			iniAction.setStatus(_handleInfo);
		});
	}
	
	function getAuthNum(){
		var timer = iniAction.startTimer(_limitTime, $('#INI_timer'));
		if(timer){
			iniAction.exportCertV12(
				_handleInfo, 
				function(authNum){
					_INI_authNum = authNum;
					$('input[name="INI_authNum"]').eq(0).val(authNum.substring(0,4));
					$('input[name="INI_authNum"]').eq(1).val(authNum.substring(4,8));
					$('input[name="INI_authNum"]').prop('readonly',true);
					$("#INI_cert_import_userPw").prop('disabled',true);
					longPollRequest();
				}
			);
		}
		
	}
	
	function longPollRequest(){
		iniAction.getCertStatus(
			_INI_authNum, 
			function(result){
				if(result[1] === "SEND"){
					/*이동중*/
					iniAction.setLongPollTimer(longPollRequest);
				} else if(result[1] === "CANCEL"){
					INI_HANDLE.infoMessage(result[2]);
					iniAction.resetTimer();
				} else if(result[1] === "COMPLETE"){
					iniAction.resetTimer();
					var INI_popupHandleInfo = [];
					INI_popupHandleInfo["OK"] = 
						function(){
							closeWindow();
						};
					INI_ALERT(msgFactory.getMessageFactory().Info.INFO_1003, "popup", INI_popupHandleInfo);
				} else {
					iniAction.setLongPollTimer(longPollRequest);
				}
			},
			function(){
				iniAction.resetTimer();
			}
		);
	} 
	
	/** 
	 * @description 확인 취소 버튼 핸들러 
	 */
	function attachActionButtonEvent(){
		_elems.$DLG_CONTAINER.on('click', '#INI_certSubmit', function(e){
			return onConfirmBtnClicked(e);
		});
		
		_elems.$DLG_CONTAINER.on('click', '#INI_certClose', function(e){
			return onCancelBtnClicked(e);
		});
	}

	/*******************************************************************************************
	 * callback 함수 
	*******************************************************************************************/
	
	/** 
	 * @description 인증서 관리의 인증서 import 후 콜백 - 가져온 인증서 정보를 보여줌
	 */
	function callbackCertImport(encCert){
		_handleInfo.serviceInfo.setParameter("SAVE_TYPE", 'p12');
		_handleInfo.serviceInfo.setParameter("ENC_P12_CERT", encCert);
		
		replaceView( 
			"cert_save_detail_view", 
			function(){ 
				_orgAction= _handleInfo.serviceInfo.getAction();
				_orgBehavior = _handleInfo.serviceInfo.getBehavior();
				
				_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_SAVE);
				_handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_DETAIL_ATTR);
				iniCertManager.getSaveCertDetailInfo(_handleInfo);
				var inputKeys = ["NONCE"];
				if ( _handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD ) {
					inputKeys.push('SECURE');
				}
				inputLayout.showKeyInputLayout(inputKeys);
			}, 
		   'LAYER'
		);
	}
	
	/** 
	 * @description 기기간 인증서 복사 인증서 내보내기 콜백
	 */
	function callbackCertExport12(p12b64){
		_handleInfo.serviceInfo.setParameter("p12", p12b64);
		//_handleInfo.serviceInfo.setBehavior('CERT_EXPORT_SAVE');
		replaceView(
    		"cert_export_v12",
    		function(){
    			_limitTime = defaultConf.System.CertImportExportLimitTime,
    			getAuthNum();
    			inputLayout.showKeyInputLayout(null);
    			setCertButtonLayout(['cancel']);
    		},
    		"LAYER"
    	);
	}
	
	/** 
	 * @description 인증서 업데이트 콜백
	 */
	
	function callbakcUpdateCertificateCB(data){
		_handleInfo.stateInfo.setResult("CERT_UPDATE");
		closeWindow();
	}
	/** 
	 * @description 기기간 인증서 복사에서 가져온 후 콜백 - 가져온 인증서를 보여줌
	 */
	function callbackCertImportV12(encCert){
		_handleInfo.serviceInfo.setParameter("SAVE_TYPE", 'p12');
		_handleInfo.serviceInfo.setParameter("ENC_P12_CERT", encCert);
		_handleInfo.serviceInfo.setBehavior("CERT_IMPORT_SAVE")
		
		replaceView( 
			"cert_save_detail_view", 
			function(){ 
				$('#media_select_area').show(); 
				$('.certifacte_input_area').show(); 
				$('#confirm_btn_area').show();
					
				iniCertManager.drawStorageList(_handleInfo); 
				iniCertManager.setFocusStorage(_handleInfo);
					
				_orgAction= _handleInfo.serviceInfo.getAction();
				_orgBehavior = _handleInfo.serviceInfo.getBehavior();
					
				_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_SAVE);
				_handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_DETAIL_ATTR);
				iniCertManager.getSaveCertDetailInfo(_handleInfo);
					
				var inputKeys = ["NONCE"];
				if ( _handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD ) {
					inputKeys.push('SECURE');
				}
				inputLayout.showKeyInputLayout(inputKeys);
			}, 
		    'LAYER'
		);
	}
	
	/** 
	 * @description 기기간 복사에서 인증서 저장 콜백 1
	 */
	function callbackImportSave(data){
		/* 저장 완료 파라미터 전송*/
		//_handleInfo.serviceInfo.setParameter("AUTH_NUM", INI_authNum);
		if(_handleInfo.serviceInfo.getParameter("AUTH_NUM")){
			// 저장 완료 파라미터 전송
			_handleInfo.serviceInfo.setParameter("CERT_STATUS", "COMPLETE");
			_handleInfo.serviceInfo.setCallback(callbackImportSaveFinished);
			iniAction.certImportExportSetCertStatus(_handleInfo);
		}else {
			alert("인증번호가 없습니다");
			//var INI_popupHandleInfo = [];
			//INI_popupHandleInfo["OK"] = 
				//function(){ closeWindow(); };
			//INI_ALERT(msgFactory.getMessageFactory().Info.INFO_1004, "popup", INI_popupHandleInfo);
		}
	}
	
	/** 
	 * @description 기기간 복사에서 인증서 저장 콜백 2
	 */
	function callbackImportSaveFinished(result){
		_encP12Cert = undefined;
		_INI_authNum = undefined;
		
		var INI_popupHandleInfo = [];
		INI_popupHandleInfo["OK"] = 
			function(){
				closeWindow();
			};
		INI_ALERT(msgFactory.getMessageFactory().Info.INFO_1004, "popup", INI_popupHandleInfo);
	}
	
	/** 
	 * @description 저장 후 콜백 
	 */
	function callbackCertSave(_handleInfo){
		function doLoginCB(){
			_handleInfo.serviceInfo.setParameter("SAVE_TYPE", undefined);
			_handleInfo.stateInfo.setResult("CONFIRM");
			closeWindow();
		}
		
		function doSignatureCB(){
			_handleInfo.serviceInfo.setParameter("SAVE_TYPE", undefined);
			_handleInfo.stateInfo.setResult("CONFIRM");				
			closeWindow();
		}	
		
		if(_handleInfo.serviceInfo.getParameter("AUTH_NUM")){
			// 저장 완료 파라미터 전송
			_handleInfo.serviceInfo.setParameter("CERT_STATUS", "COMPLETE");
			_handleInfo.serviceInfo.setCallback(undefined);
			iniAction.certImportExportSetCertStatus(_handleInfo);
		}
		
		if(_handleInfo.optionInfo.getParameter("USE_SESSION")){
			if(_handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_LOGIN){
				_handleInfo.serviceInfo.setParameter("PIN", _handleInfo.serviceInfo.getParameter("PWD"));
   				_handleInfo.serviceInfo.setParameter("PWD", _handleInfo.serviceInfo.getParameter("PWD"));
   				_handleInfo.serviceInfo.setCallback(doLoginCB);
   				iniAction.login(_handleInfo);
			} else if(_handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_SIGN){
				_handleInfo.serviceInfo.setParameter("PIN", _handleInfo.serviceInfo.getParameter("PWD"));
				_handleInfo.serviceInfo.setParameter("PWD", _handleInfo.serviceInfo.getParameter("PWD"));
				_handleInfo.serviceInfo.setCallback(doSignatureCB);
				iniAction.signature(_handleInfo);
			}
		} else {
			_handleInfo.serviceInfo.setBehavior(_orgAction);
			if (_orgBehavior ) {
				_handleInfo.serviceInfo.setBehavior(_orgBehavior);
			}

			_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
			_handleInfo.serviceInfo.setParameter("SAVE_TYPE", undefined);						
			_handleInfo.serviceInfo.setParameter("AUTH_NUM", undefined);
			_handleInfo.serviceInfo.setParameter("FILE_NAME", undefined);
			_handleInfo.serviceInfo.setParameter("PIN", undefined);
			_handleInfo.serviceInfo.setParameter("PWD", undefined);
			
			_cancelHandler = defaultCancelHandler;
			_handleInfo.requestInfo.setParameter("taskNm", null);
			if (_handleInfo.serviceInfo.getAction()  == constants.WebForm.ACTION_LOGIN) {
				_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_LOGIN);
			}
			initializeViewLayout();
			iniCertManager.setFocusStorage(_handleInfo); 
			iniCertManager.storageClick(_handleInfo);
		}
	}
	
	/** 
	 * @description 인증서 신규 발급 후 copy callback  
	 */
	function callbackIssueCertificateCB(data){
		_handleInfo.stateInfo.setResult("CONFIRM");
		if(defaultConf.WebForm.AnotherSave && 
				(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_HDD || 
						_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_USB)){
			var INI_popupHandleInfo = [];
			INI_popupHandleInfo["OK"] = 
				function(){
					_handleInfo.serviceInfo.setCallback(
						function(){
							defaultCancelHandler();
						}
					);
					
					/* 발급 저장 매체가 USB 인 경우, 확인 버튼 시 질문 창 없이 바로 HDD 에 저장 */
					if (_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_USB) {
						_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_ID", _handleInfo.serviceInfo.getDeviceId());
						_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_SUB", _handleInfo.serviceInfo.getDeviceSub());
						
			    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_ID", constants.Certs.STORAGE_HDD);
			    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_SUB_ID", "" );
			    		
			    		INI_popupHandleInfo["OK"] = function (){ 
			    			closeWindow() 
			    		};
			    		
			    		_handleInfo.serviceInfo.setCallback(function(){
			    			INI_CONFIRM(msgFactory.getMessageFactory().Info.INFO_1001, "info", INI_popupHandleInfo);
			    		});
		    			
			    		_handleInfo.serviceInfo.setExceptionCallback( function(){});
		    			iniAction.saveAnotherCertificate(_handleInfo);
			    		
					}
					/* 현재 발급 저장 매체가 HDD 인 경우,  추가 저장을 위한 매체 리스트 모달 생성*/
					else if (_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_HDD){
						/* 저장 매체 모달 창 생성 */ 
						replaceView(
							'destination_storage_select_another', 
							function(){
								_handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_NORMAL_ATTR);
								_orgAction= _handleInfo.serviceInfo.getAction();
								_orgBehavior = _handleInfo.serviceInfo.getBehavior();
								
								_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_SAVE);
								iniCertManager.drawAnotherTargetStorageList(_handleInfo)
							}, 
							'MODAL'
						);
					}
				};
			
			INI_popupHandleInfo["CANCEL"] = 
				function(){
					defaultCancelHandler();
				};
			var confirmMsg = _handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_HDD  ? 
					msgFactory.getMessageFactory().WebForm().TEXT().CERT_MANAGE().W_T_C_M_015 :
					msgFactory.getMessageFactory().WebForm().TEXT().CERT_MANAGE().W_T_C_M_016 
			INI_CONFIRM(confirmMsg, "confirm", INI_popupHandleInfo);
		}else{
			closeWindow();
		}
	}
	
	/** 
	 * @description 인증서 copy callback  
	 */
	function callbackCertRemove(param){
		GINI_LoadingIndicatorStop();
		_cancelHandler = defaultCancelHandler;
		_handleInfo.requestInfo.setParameter("taskNm", null);
		if(constants.WebForm.ACTION_CERT_REVOKE == _handleInfo.serviceInfo.getBehavior()){
			/* 	인증서 폐기 후 삭제 -->  창 닫음*/
		   _handleInfo.stateInfo.setResult("CONFIRM");
		   closeWindow(); 
		}else{
			var popupHandler = {};
			popupHandler['OK'] = function(){
				_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
				/* remove 후 원래의 action 과 behavior 로 복구*/
				_handleInfo.serviceInfo.setAction(_orgAction);
				_handleInfo.serviceInfo.setBehavior(_orgBehavior);
				
				initializeViewLayout();
				iniCertManager.setFocusStorage(_handleInfo);
				iniCertManager.storageClick(_handleInfo);
			}
			messageDialog.INI_ALERT(msgFactory.getMessageFactory().Info.INFO_1005,"info",popupHandler );
		}
	}
	
	/** 
	 * @description 인증서 리스트 생성 후 호출되는 callbakc
	 */
	function callbackDrawCertList(){
		 var action = _handleInfo.serviceInfo.getAction();
	        if (action  === constants.WebForm.ACTION_MANAGE ) {
	        	$('#certificate_manage').show();
	        	inputLayout.showKeyInputLayout([]);
	        }else {
	        	inputLayout.showKeyInputLayout(['NONCE']);
	        }
	        return;
	}
	
	/** 
	 * @description 인증서 copy callback  
	 */
	function callbackCertCopy(){
		GINI_LoadingIndicatorStop();
		_handleInfo.requestInfo.setParameter("taskNm", null);
		_cancelHandler = defaultCancelHandler;
		if(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
			_handleInfo.serviceInfo.setEventDeviceId(_handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID"));
			_handleInfo.serviceInfo.setDeviceSub(_handleInfo.serviceInfo.getParameter("TARGET_DEVICE_SUB_ID"));
			_handleInfo.serviceInfo.setParameter(_handleInfo.serviceInfo.getParameter("TARGET_PIN"));
			
			_handleInfo.serviceInfo.setExceptionCallback( function(){
				_clearNonceIO;
				_clearInputIO;
			});
			
			iniAction.copyCertificate(_handleInfo);
		} else {
			var popupHandler = {};
			popupHandler['OK'] = function(){
				_handleInfo.serviceInfo.setEventDeviceId(_handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID"));
				_handleInfo.serviceInfo.setDeviceSub(_handleInfo.serviceInfo.getParameter("TARGET_DEVICE_SUB_ID"));
				_handleInfo.serviceInfo.setParameter(_handleInfo.serviceInfo.getParameter("TARGET_PIN"));
				
				_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
				initializeViewLayout();
				iniCertManager.setFocusStorage(_handleInfo);
				iniCertManager.storageClick(_handleInfo);
			}
			messageDialog.INI_ALERT(msgFactory.getMessageFactory().Info.INFO_1011,"info",popupHandler );
		}
	}
	
	/** 
	 * @description 사용자 입력 정보를 초기화 
	 */
	function clearNonce(){
		GINI_ProtectMgr.destroy();
		_handleInfo.serviceInfo.setParameter("PWD", "");
		_handleInfo.serviceInfo.setParameter("NEW_PWD", "");
		_handleInfo.serviceInfo.setParameter("PWD_CNF", "");
		_handleInfo.serviceInfo.setParameter("PIN", "");
		_handleInfo.serviceInfo.setParameter("TARGET_PIN", "");
	}
	
	/** 
	 * @description 사용자 입력 dom 초기화 
	 */
	function clearInput(){
		_elems.$DLG_CONTAINER.find('#ini_cert_pwd').val('');
		_elems.$DLG_CONTAINER.find('#ini_cert_new_pwd').val('');
		_elems.$DLG_CONTAINER.find('#ini_cert_new_pwd_cnf').val('');
		_elems.$DLG_CONTAINER.find('#ini_cert_pin').val('');
		_elems.$DLG_CONTAINER.find('#ini_cert_target_pin').val('');
	}
	
	/** 
	 * @description 사용자 입력 정보의 유효성 검사 
	 */
	function validateSubmit(){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();

		var pwd = GINI_ProtectMgr.extract("NONCE");
		var newPwd = GINI_ProtectMgr.extract("NEW_NONCE");
		var newPwdCnf = GINI_ProtectMgr.extract("NEW_NONCE_CNF");
		var pin = GINI_ProtectMgr.extract("SECURE");
		var targetPin = GINI_ProtectMgr.extract("TARGET_SECURE");
		var sourcePin = GINI_ProtectMgr.extract("SOURCE_SECURE");
	
		var result = true;
		var message = null;
		
		try {
			/* 수행 명령이 핀번호가 필요한 저장 매체의 GET_LIST 명령일 경우 true return(인증서 존재 여부 체크 필요없음 */
			if (typeof _confirmHandler !== 'undefined' && _confirmHandler && _confirmHandler  === "GET_CERT_LIST") return true;
			
			/* 검증 1 : 선택된 인증서 존재 여부 */
			if (!(action == constants.WebForm.ACTION_CERT_CMP &&  behavior == constants.WebForm.ACTION_CERT_ISSUE)
					&& !(action == constants.WebForm.ACTION_LOGIN &&  behavior == constants.WebForm.ACTION_CERT_SAVE)
					&& !(action == constants.WebForm.ACTION_LOGIN &&  behavior == constants.WebForm.ACTION_CERT_IMPORT)
					&& !(action == constants.WebForm.ACTION_MANAGE &&  behavior == constants.WebForm.ACTION_CERT_SAVE)
					&& !(action == constants.WebForm.ACTION_CERT_EXPORT &&  behavior == constants.WebForm.ACTION_CERT_SAVE)
					&& !(action == constants.WebForm.ACTION_CERT_CMP &&  behavior == constants.WebForm.ACTION_CERT_UPDATE)
					&& !(action == constants.WebForm.ACTION_CERT_ISSUE &&  behavior == constants.WebForm.ACTION_CERT_ISSUE)
					&& !(action == constants.WebForm.ACTION_CERT_IMPORT && 
							(behavior == constants.WebForm.ACTION_CERT_SAVE ||  behavior == constants.WebForm.ACTION_CERT_IMPORT || behavior == 'CERT_IMPORT_SAVE'))) {
				var ret = hasSelectedCertificate(true);
				if (!ret.selectStatus) {
					new iniException.Warn.newThrow(null, ret.msgCode);
				}
			}
			
			return true;
			/* 검증 2 : 선택된 인증서 존재 여부 - 각 액션에 따른 입력값 유무 여부 */
			/* 검증 3 : 각 입력값의 오류 여부는 크로스웹과 연동을 통해 판단*/
		}catch(e) {
			clearNonce();
			clearInput();
			messageDialog.INI_ALERT(msgFactory.getMessageFactory().Warn[e.name], 'WARN');
			return false;
		}
	}
	
	/** 
	 * @description 사용자 입력 정보를 세팅 
	 * @param {object} 사용자 입력한 내용의 객체 
	 */
	function setKeepNonce(inputValues){
		clearNonce();
		clearInput();
		
		if (inputValues) {
			for (var key in inputValues){
				if (inputValues.hasOwnProperty(key)){
					if (key == "NONCE") _handleInfo.serviceInfo.setParameter("PWD", inputValues[key].trim());
					if (key == "NEW_NONCE") _handleInfo.serviceInfo.setParameter("NEW_PWD", inputValues[key].trim());
					if (key == "NEW_NONCE_CNF") _handleInfo.serviceInfo.setParameter("PWD_CNF", inputValues[key].trim());
					if (key == "SECURE") _handleInfo.serviceInfo.setParameter("PIN", inputValues[key].trim());
					if (key == "TARGET_SECURE") _handleInfo.serviceInfo.setParameter("TARGET_PIN", inputValues[key].trim());
					if (key == "SOURCE_SECURE") _handleInfo.serviceInfo.setParameter("SOURCE_PIN", inputValues[key].trim());
					GINI_ProtectMgr.keep(key, inputValues[key]);
				}
			}
		}
	}

	/*******************************************************************************************
	 * Event Handler function
	*******************************************************************************************/
	
	/** 
	 * @description 확인 버튼 처리 핸들러 
	 * @description 현재 액션에 따라 연동 작업 처리 
	 * @param {object} 이벤트 발생 DOM Element. Object 
	 */
	function onConfirmBtnClicked(e){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();
		var taskName = _handleInfo.requestInfo.getParameter("taskNm");
		
		/* 
		 * Comfirm action intercerptter  차후 pre, post inteceptor 모듈로 분리 
		 * 수행하려는 task 가 있는 경우 , 기본 액션 보다 먼저 task 에 해당하는 액션을 수행 
		 */
		
		if ( action == constants.WebForm.ACTION_MANAGE && behavior ==constants.WebForm.ACTION_CERT_IMPORT ) {
			var INI_authNum = $('input[name="INI_authNum"]').eq(0).val() + $('input[name="INI_authNum"]').eq(1).val();
    		if((INI_authNum === undefined) || (INI_authNum === null) || (INI_authNum === '')){
				INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1028);
				$('input[name="INI_authNum"]').eq(0).focus();
			 	return;
			}
			
    		_handleInfo.serviceInfo.setParameter("AUTH_NUM", INI_authNum);
    		iniAction.importCertV12(_handleInfo, callbackCertImport);
    		return;
		}
		
		_handleInfo.serviceInfo.setParameter("ENCRYPTED","FALSE"); 					
		
		inputLayout._getKeyValue().then(function(inputValues) {
			_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
			setKeepNonce(inputValues);  
			
			if (!validateSubmit()) return;
			
			if (typeof _confirmHandler !== 'undefined' && _confirmHandler) {
		      if (_confirmHandler  === "GET_CERT_LIST") {
		        _handleInfo.serviceInfo.setParameter("PIN",inputValues['SECURE']);
		        iniCertManager.storageClick(_handleInfo)
		        return;
		      }
		    }
			
			_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
		    switch(action){
		    case constants.WebForm.ACTION_LOGIN: 
				if (taskName) {
					processCertManager();
					return;
				}
		    	_handleInfo.serviceInfo.setCallback(function(){
			        _handleInfo.stateInfo.setResult("CONFIRM");
			        closeWindow(); 
		    	});
		      iniAction.login(_handleInfo);
		      break;
	
		    case constants.WebForm.ACTION_SIGN: 
		      _handleInfo.serviceInfo.setCallback(function(){
		        _handleInfo.stateInfo.setResult("CONFIRM");
		        closeWindow(); 
		      });
		      iniAction.signature(_handleInfo);
		      break; 
		    
		    case constants.WebForm.ACTION_MANAGE: 
		    	processCertManager();
		    	break;;
		    case constants.WebForm.ACTION_CERT_EXPORT: 
		    	/* 기기간 복사 -  인증서 내보내기 */
		    	if (_handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_EXPORT) {
		    		if(_handleInfo.serviceInfo.getParameter("CERT_ID") == undefined){
						INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1015);
					 	return;
					}
		    		_handleInfo.serviceInfo.setCallback(callbackCertExport12);
		    		iniAction.makeExportData(_handleInfo);
		    		/* 인증서 내보내기 의 경우 매체 고정 및 클릭 금지*/
		    		setElementEnable('#media_select_area .media_select #INI_storage_list li', 'addClass', 'data_disabled');
					
		    	} else if (_handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE){
		    		processCertManager();
		    	}
		    	break;
		    
		    /* 기기간 복사 - 인증서 가져오기 */
		    case constants.WebForm.ACTION_CERT_IMPORT: 
		    	/* 기기간 복사 - 가져온 인증서 보여주기 */
		    	if (_handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_IMPORT) {
	    			var INI_authNum = $('input[name="INI_authNum"]').eq(0).val() + $('input[name="INI_authNum"]').eq(1).val();
		    		if((INI_authNum === undefined) || (INI_authNum === null) || (INI_authNum === '')){
						INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1028);
						$('input[name="INI_authNum"]').eq(0).focus();
					 	return;
					}
		    		_handleInfo.serviceInfo.setParameter("AUTH_NUM", INI_authNum);
		    		_handleInfo.serviceInfo.setCallback(callbackCertImportV12);
		    		iniAction.importCertV12(_handleInfo, callbackCertImportV12);
		    		
	    		}
	    		
	    		 /* CERT_IMPORT_SAVE - 가져온 인증서를 저장*/ 
	    		else {
	    			_handleInfo.serviceInfo.setCallback(callbackImportSave);
	    			iniAction.saveLocalPriCert(_handleInfo);
	    		} 
	    		break;
		    
		    case constants.WebForm.ACTION_CERT_UPDATE: 
		      break;
		    
		    case constants.WebForm.ACTION_CERT_CMP: 
		    	if (behavior == constants.WebForm.ACTION_CERT_REVOKE) {
		    		_handleInfo.serviceInfo.setCallback(function(){
		    			_handleInfo.stateInfo.setResult("CONFIRM");
		    			closeWindow();
		    		});
		    		
		    		if(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
						iniAction.removeCertificate(_handleInfo);
					} else {
						iniAction.revokeCertificate(_handleInfo);
					}
		    	} else if  (_handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CERT_ISSUE){
		    		_handleInfo.serviceInfo.setCallback(callbackIssueCertificateCB);
		    		iniAction.issueCertificate(_handleInfo);
		    	}else if (_handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CERT_UPDATE){
		    		/* 초기 인증서 갱신 후 핀 번호등의 오류로 존재하는 갱신된 인증서를 저장만 하는 경우 */
		    		_handleInfo.serviceInfo.setCallback(callbakcUpdateCertificateCB);
		    		if (_handleInfo.serviceInfo.getParameter('PRIVATE_KEY') && _handleInfo.serviceInfo.getParameter('CERTIFICATE')){
		    			iniAction.savePrivateCertificate(_handleInfo, true);
		    		}
		    		/* 초기 인증서 갱신 작업, 갱신 및 저장 작업 진행  */
		    		else {
			    		iniAction.updateCertificate(_handleInfo);
					}
		    	}
		    	break;
		    
		    /* 발급된 인증서를 저장*/
		    case constants.WebForm.ACTION_CERT_ISSUE: 
		    	if (behavior == constants.WebForm.ACTION_CERT_ISSUE) {
					if (_handleInfo.serviceInfo.getParameter('PRIVATE_KEY') && _handleInfo.serviceInfo.getParameter('CERTIFICATE')){
						_handleInfo.serviceInfo.setCallback(callbackIssueCertificateCB);
						iniAction.savePrivateCertificate(_handleInfo)
					}else {
						messageDialog.INI_ALERT(msgFactory.getMessageFactory().Warn["WARN_1061"]);
					}
		    	}
		    	break;
		    case constants.WebForm.ACTION_CERT_REISSUE: break;
		    }
		} );
	}
	
	/** 
	 * @description 인증서 매니저 태스크별 프로세스 함수 
	 */
	function processCertManager(){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();
		var taskNm  = _handleInfo.requestInfo.getParameter("taskNm");
		taskNm = behavior ? behavior : taskNm ;
	   
		switch(taskNm){
	      	case constants.WebForm.ACTION_CERT_COPY:
	      		_handleInfo.serviceInfo.setCallback(callbackCertCopy);
	      		iniAction.copyCertificate(_handleInfo);
	    		break;
	    		
	    	case constants.WebForm.ACTION_CERT_REMOVE:
	    		_handleInfo.serviceInfo.setCallback( callbackCertRemove);
	    		iniAction.removeCertificate(_handleInfo);
	    		break;
	    		
	    	case constants.WebForm.ACTION_CERT_SAVE:
	    		_handleInfo.serviceInfo.setCallback(callbackCertSave);
	    		if(_handleInfo.serviceInfo.getParameter("SAVE_TYPE") === 'import'){
					var priCert = _handleInfo.serviceInfo.getParameter("AUTH_NUM_CONFIRM");
					_handleInfo.serviceInfo.setParameter("PRIVATE_KEY", priCert[0]);
					_handleInfo.serviceInfo.setParameter("CERTIFICATE", priCert[1]);
					iniAction.saveCertPriV11(_handleInfo);
				} else {
					iniAction.saveLocalPriCert(_handleInfo);
				}
	    		break;
	    		
	    	case constants.WebForm.ACTION_CERT_EXPORT_FILE:
	    		_handleInfo.serviceInfo.setCallback(function(){
	    			var popupHandler = {};
					popupHandler['OK'] = function(){
						_handleInfo.requestInfo.setParameter("taskNm", null);
						_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
						previousCancelHandler();
						_cancelHandler  =  defaultCancelHandler;
					}
	    			messageDialog.INI_ALERT(msgFactory.getMessageFactory().Info.INFO_1003,"info",popupHandler );
	    		});
	    		iniAction.exportCertPriP12File(_handleInfo);
	    		break;
	
	    	case constants.WebForm.ACTION_CHANGE_PWD:
	    		_handleInfo.serviceInfo.setCallback(function(){
	    			_handleInfo.requestInfo.setParameter("taskNm", null);
	    			INI_HANDLE.infoMessage(msgFactory.getMessageFactory().WebForm().TEXT().CERT_CHANGE_PW().W_T_C_CP_007);
	    			_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
	    			_handleInfo.serviceInfo.setBehavior(_handleInfo.serviceInfo.getAction());
	    			_cancelHandler = defaultCancelHandler;
	    			initializeViewLayout();
	    			iniCertManager.setFocusStorage(_handleInfo);
	    			iniCertManager.storageClick(_handleInfo);
	    		});
	    		iniAction.changePassword(_handleInfo);
	    		break;
	
	    	case constants.WebForm.ACTION_CERT_IMPORT:
	    		var INI_authNum = $('input[name="INI_authNum"]').eq(0).val() + $('input[name="INI_authNum"]').eq(1).val();
	    		if((INI_authNum === undefined) || (INI_authNum === null) || (INI_authNum === '')){
					INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1028);
					$('input[name="INI_authNum"]').eq(0).focus();
				 	return;
				}
	    		_handleInfo.serviceInfo.setParameter("AUTH_NUM", INI_authNum);
	    		_handleInfo.serviceInfo.setCallback(function(){
	    			_cancelHandler = defaultCancelHandler;
	    			_handleInfo.requestInfo.setParameter("taskNm", null);
	    			callbackCertImport();
	    		});
	    		iniAction.importCertV12(_handleInfo, callbackCertImport);
	    		return;
	    	}
	}
	
	/** 	
	 * @description 취소 버튼 처리 핸들러 
	 * @description 현재 액션에 따라 취소 처리 (창 닫기 or 뷰 초기화)
	 * @param {object} 이벤트 발생 DOM Element. Object 
	 */
	function onCancelBtnClicked(e){
		_cancelHandler();
		if (_cancelHandler == initializeViewLayout){
			_cancelHandler = closeWindow;
		}
	}
	
	/** 
	 * @description 폼 생성 핸들러 
	 */ 
	function onFormLoad(){ 
		initializeProcessData();
		initializeViewLayoutText(); 	
		initializeButtonLayout();
		initializeKeyStrokeModule();
		initializeKeyStrokeLayout();
		
		$(window).bind('resize', setDialogPosition);
		$(window).bind('scroll', setDialogPosition);
		setDialogPosition();
	}
	
	/** 
	 * @description 폼 소멸 핸들러 
	 */ 
	function onFormDestroy(){
		function addDataSignatureCallback(){
			var pkcs1Info = _handleInfo.responseInfo.getParameter();
			var vidAttr = {};
			vidAttr.SIGNATURE = pkcs7Info.SIGNATURE;			// PKCS#7
			vidAttr.PKCS7DATA_FROM_PKCS1 = pkcs1Info.SIGNATURE;
			vidAttr.VID_CERTIFICATE = pkcs7Info.VID_CERTIFICATE;
			vidAttr.VID_RANDOM = pkcs7Info.VID_RANDOM;
			_handleInfo.requestInfo.getCallback()(true, vidAttr);
		};
		
		if( _handleInfo.stateInfo.getResultCode() === "CERT_UPDATE" ){
			_handleInfo.requestInfo.getCallback()(true, _handleInfo.serviceInfo);
		}else if( _handleInfo.stateInfo.getResultCode() === "CONFIRM" ){
			/*전자서명 이면서 전자서명 옵션에 PKCS7DATA_TO_PKCS1 존재하는 경우 : PKCS1서명 수행*/
			var dataSignatureCallback = _handleInfo.optionInfo.getParameter("PKCS7DATA_TO_PKCS1");
			if(dataSignatureCallback){
				_handleInfo.optionInfo.setParameter("SIGN_KIND", "PKCS1");
				var pkcs7Info = _handleInfo.responseInfo.getParameter();
				var orgData = dataSignatureCallback(pkcs7Info);
				_handleInfo.requestInfo.setParameter("ORG_DATA", orgData);
				_handleInfo.serviceInfo.setCallback(addDataSignatureCallback);
				middleChannel.Signature.selectedSignature(handleInfo);
			}else{
				_handleInfo.requestInfo.getCallback()(true, _handleInfo.responseInfo.getParameter());	
			}
		}else{
			var subCallback = _handleInfo.requestInfo.getSubCallback();
			if(_handleInfo.requestInfo.getSelectedSubCallback() && subCallback){
				if(_handleInfo.requestInfo.getCallback()){
					/* 
					 * 원래의 소스는 로그인 창에서 바로 인증서 관리 창을 띄울때도 최종 콜백을 호출했으나 , 수정 되는 현재 소스에는 주석 처리함
					 * 주석처리 하지 않을 경우, jsp 의  최종 콜백이 호출되며, 실패로 처리되어  로그인 실패등의 얼럿 창이 뜨게 되며, 그 위에 인증서 관리
					 * 창이 생성됨
					 **/
					//_handleInfo.requestInfo.getCallback()(false);
				}
				setTimeout(function(){
					var certManageHandle = require("../common/handleManager").newHandleInfo();
					certManageHandle.requestInfo.setParameter("taskNm", null);
					certManageHandle.serviceInfo.setAction(constants.WebForm.ACTION_MANAGE);
					openMainWnd(certManageHandle);
				}, 50);
				return;
			}else {
				if(_handleInfo.requestInfo.getCallback()){
    				_handleInfo.requestInfo.getCallback()(false);
    			}
				
				try{
					Html5Adaptor.initializeEventCheck();	
				}catch(e){ }
			}
		}
		
		if(!defaultConf.System.useIniPluginData){
			GINI_ProtectMgr.destroy();
		}
		
    	if(_handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_SIGN){
    		INI_PLAINTEXT_VIEW_HANDLER.setPlaintextViewType(undefined);
    	}
    	sessionStorage.removeItem("FILTER_ISSUER_DN");
		sessionStorage.removeItem("FILTER_OID");
		resetController();
	}
	
	/** 
	 * @description 서브 다이알로그 생성 핸들러 
	 */ 
	function onSubFormLoad(){
		
	}
	
	/** 
	 * @description 서브 다이알로그 소멸 핸들러 
	 */ 
	function onSubFormDestroy(){
		
	}
	
	/** 
	 * @description 확장매체의 서브리스트 레이어 close  핸들러
	 * webForm.js에서 닫기 등의 1차 작업 진행 
	 * 이후 초기화 작업이 필요할 경우 사용 
	 */ 
	function 	onExtSubListLayerClosed(){
		
	}
	
	/** 
	 * @description 일반 매체의 서브리스트 레이어 close  핸들러
	 * webForm.js에서 닫기 등의 1차 작업 진행 
	 * 이후 초기화 작업이 필요할 경우 사용 
	 */ 
	function 	onSubListLayerClosed(){
		
	}
	
	/** 
	 * @description 저장 매체 클릭시(더보기 버튼포함) 전처리 이벤트 핸들러 
	 * @param {object} 이벤트 발생 DOM Element. Object  
	 */ 
	function onStorageSelected(selectedMedia, event){
		function callback(version){
			if(version === true || "NOT_INSTALL" !== version){
	            if( subMedia.length > 0){
	            	$('.extension_layer').hide();

	            	/*
	            	 * 모바일 선택시 바로 INFORVINE 실행 
	            	 * 
	            	 * 선택 매체가 모바일(휴대폰) 인 경우 해당 서브 매체 리스트를 그리지 않고
	            	 * 바로 유비키 인포바인 실행하려면 아래 주석을 해제.
	            	 * 
	            	if (constants.Certs.STORAGE_PHONE === selectedNodeId) {
	            		$('.drive_select').hide();
	            		selectedMediaLi.addClass('list_select');
	            		procStorageClick(constants.Certs.STORAGE_PHONE, constants.Certs.STORAGE_PHONE_INFOVINE);
	            		return;
	            	}
	            	*/
	            	
	            	$('.drive_select').not(subMedia.show()).hide();
	            	selectedMediaLi.removeClass('list_select').addClass('open');
	            	iniCertManager.appendSubMediaList(_handleInfo, selectedNodeId, '#' + parentNodeId);
	                if(sc == false){
	                	subMedia.find('ul').mCustomScrollbar();
	                    sc = true;
	                }
	            }else if(selectedMediaLi.hasClass('media_extension')){
	            	selectedMediaLi.removeClass('list_select').addClass('open');
	            	iniCertManager.appendSubExtensionMediaList(_handleInfo)
	            	$('.extension_layer').show();
	            	selectedMediaLi.siblings('li').find('.drive_select').hide();
	            }else{
	            	selectedMediaLi.addClass('list_select');
	            	$('.drive_select').hide();
	                $('.extension_layer').hide();
	                procStorageClick(selectedNodeId,undefined);
	            }
    		}else{
    			INI_HANDLE.infoMessage(msgFactory.getMessageFactory().Info.INFO_1009);
    		}
    	};
    	/*선택된 인증서 제거 */
    	clearSelectedCertificate(); 
    	initCertListText();
    	var selectedMediaLi = $(selectedMedia).parent('li');
    	if (selectedMediaLi.hasClass('data_disabled')) return;
    	
    	setStorageCheck(selectedMedia, true);
    	var subMedia  = $('.drive_select', selectedMediaLi);
    	$('.media_list>li').not(selectedMediaLi).removeClass('open list_select').find('.check').remove();
    	
    	var parentNodeId, selectedNodeId, sc = false;
    	parentNodeId = selectedNodeId = selectedMediaLi.find('span').attr('id');  
    	
    	if(parentNodeId != constants.Certs.STORAGE_BROWSER){
    		iniCertManager.installed(callback);		
    	} else {
    		selectedMediaLi.addClass('list_select');
            $('.drive_select').hide();	
            $('.extension_layer').hide();
            procStorageClick(selectedNodeId,undefined);
    	}
        return false;
	}
	
	/** 
	 * @description 저장 매체의 하위 매체 이벤트 핸들러
	 * @param {object} 이벤트 발생 DOM Element. Object  
	 */ 
	function onSubStorageSelected(selectedMedia){
		var $selectedMedia = $(selectedMedia);
		var selectedMediaId = $selectedMedia.parent('li').attr("id");
		var parentMediaId = $selectedMedia.closest('.list_data').find('a > span').attr('id');
		$selectedMedia.closest('.list_data').removeClass('open').addClass('list_select');
		$selectedMedia.closest('.drive_select').hide();
		procStorageClick(parentMediaId,selectedMediaId );
		return false;
	}
	
	/** 
	 * @description 타켓 저장 매체 선택 핸들러
	 */ 
	function onTargetStorageSelected(targetMedia, event){
		var targetMediaLi = $(targetMedia).parent('li');
		var otherMediaLid =  $('.save_media_list>li').not(targetMediaLi);
		var targetMediaSub =  $('.save_drive_select', targetMediaLi);
		var targetParentNodeId , targetMediaId, sc = false;

		otherMediaLid.removeClass('media_open media_selected').find('.check').remove();
		setStorageCheck(targetMedia, true);
		targetParentNodeId = targetMediaId =  $(targetMedia).parent().closest('li').find('span').attr('id');
		 
		if (targetMediaSub.length > 0) {
			iniCertManager.appendSubMediaList(_handleInfo, targetMediaId, '#INI_target_storage_list #' + targetParentNodeId , 'INI_POPUP');
			targetMediaLi.removeClass('media_selected').addClass('media_open');
			$('.save_drive_select').not(targetMediaSub.show()).hide();
			if(sc == false){
				targetMediaSub.find('ul').mCustomScrollbar();
	            sc = true;
	        }
	        $('.save_extension_layer').hide();
		}else {
        	if(targetMediaLi.closest('li').hasClass('save_media_extension')){
        		targetMediaLi.removeClass('media_open media_selected').find('span.check').remove();
        		targetMediaLi.removeClass('media_selected').addClass('media_open');
        		iniCertManager.appendSubExtensionMediaList(_handleInfo)
                $('.save_drive_select').show();
                if(sc == false){
                	targetMediaSub.find('ul').mCustomScrollbar();
                    sc = true;
                }
                $('.save_extension_layer').hide();
            }else{
            	if (iniCertManager.isValidTargetMedia(_handleInfo, targetMediaId, undefined)){
            		/*
            		인증서 생성 후 타켓 매체 선택 후 즉시 추가 저장 
            		*/
            		var action = _handleInfo.serviceInfo.getAction();
            		var behavior = _handleInfo.serviceInfo.getBehavior();
            		if ( action ===  constants.WebForm.ACTION_CERT_ISSUE && behavior == constants.WebForm.ACTION_CERT_SAVE) {
                		/* 타켓 저장 매체가 빈번호가 필요한 저장 매체라면, 핀번호 입력 박스를 보여주고 return */
                		if(targetParentNodeId == constants.Certs.STORAGE_SECURITY_TOKEN || targetParentNodeId == constants.Certs.STORAGE_SECURITY_DEVICE){
        	    			closeSubWindow();
        	    			iniCertManger.setFocusStorage(_handleInfo, true);
        	    			inputLayout.showKeyInputLayout(['SECURE']);
        	    			_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_SAVE);
        	    		}else{
        	    			/* 타켓 저장 매체가 빈번호가 필요하지 않는 저장 매체라면 바로 저장 후 종료*/
        	    			_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_ID", _handleInfo.serviceInfo.getDeviceId());
        					_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_SUB", _handleInfo.serviceInfo.getDeviceSub());
        		    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_ID", targetParentNodeId);
        		    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_SUB_ID", targetMediaId );

        		    		_handleInfo.serviceInfo.setCallback(function(){closeWindow()});
        	    			_handleInfo.serviceInfo.setExceptionCallback( function(){} );
        	    			iniAction.saveAnotherCertificate(_handleInfo);
        	    		}
                	}
            		/*
            		타켓 매체로 복사를 위한 인증서 정보 보기 창 생성  
            		*/
            		else {
	            		closeSubWindow();
	            		_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_ID", _handleInfo.serviceInfo.getDeviceId());
						_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_SUB", _handleInfo.serviceInfo.getDeviceSub());
			    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_ID", targetParentNodeId);
			    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_SUB_ID", targetMediaId);
			    		
			    		replaceView( 
			    			"cert_copy", 
			    			function(){ 
			    				targetMediaLi.addClass('media_selected');
			                	$('.save_drive_select').hide();
			                	$('.save_extension_layer').hide();	
			            		$('.certificate_manage').hide();
			        			$("#certifacte_input_area").show();
			                	_handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_NORMAL_ATTR);
			        			iniCertManager.getCertAttributeInfo(_handleInfo);
			        			setCertButtonLayout(['ok','cancel']);
			        			selectTargetStorage(targetParentNodeId, targetMediaId);
			            	}, 
			            	'LAYER'
			            );
                	}
            	}else {
            		targetMediaLi.removeClass('media_open media_selected').find('span.check').remove();
            	}
            }
		}
	}
	
	/** 
	 * @description 타겟 저장 매체의 서브 매체 클릭 핸들러 
	 * @param {object} 이벤트 발생 DOM Element. Object  
	 */ 
	function onTargetSubStorageSelected(media, event){
		var media = $(media);
		var targetMediaLi = $(media).parent('li');
		var parentMedia = media.parent('li').closest('.save_media');
    	var parentStorageId = parentMedia.children('a:first-child').find('span').attr('id');
    	var selectedMediaId = media.parent().closest('li').attr('id');
    	
    	if (iniCertManager.isValidTargetMedia(_handleInfo, parentStorageId, selectedMediaId)){
    		/* 
    		 * 액션이 cmp 이고 behavior 가 ACTION_CERT_SAVE  인 경우 인증서 발급후 다른 매체에 저장 하는 경우
    		 * 별도의 창 없이 바로 저장시키고 창 종료  
    		 */
        	var action = _handleInfo.serviceInfo.getAction();
        	var behavior = _handleInfo.serviceInfo.getBehavior();
    		
        	if ( action ===  constants.WebForm.ACTION_CERT_ISSUE && behavior == constants.WebForm.ACTION_CERT_SAVE) {
        		/* 타켓 저장 매체가 빈번호가 필요한 저장 매체라면, 핀번호 입력 박스를 보여주고 return */
        		if(parentStorageId == constants.Certs.STORAGE_SECURITY_TOKEN || parentStorageId == constants.Certs.STORAGE_SECURITY_DEVICE){
	    			closeSubWindow();
	    			iniCertManger.setFocusStorage(_handleInfo, true);
	    			inputLayout.showKeyInputLayout(['SECURE']);
	    			_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_SAVE);
	    		}else{
	    			/* 타켓 저장 매체가 빈번호가 필요하지 않는 저장 매체라면 바로 저장 후 종료*/
	    			_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_ID", _handleInfo.serviceInfo.getDeviceId());
					_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_SUB", _handleInfo.serviceInfo.getDeviceSub());
		    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_ID", parentStorageId);
		    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_SUB_ID", selectedMediaId );

		    		_handleInfo.serviceInfo.setCallback(function(){closeWindow()});
	    			_handleInfo.serviceInfo.setExceptionCallback( function(){} );
	    			iniAction.saveAnotherCertificate(_handleInfo);
	    		}
        	}
        	
        	/* 이외의 경우 copy 에 해당, Manager 액션, CERT_COPY 에 해당, 해당 인증서의 내용과 입풋 박스를 보여주는 레이어 삽입 */
        	else {
	    		closeSubWindow();
	    		_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_ID", _handleInfo.serviceInfo.getDeviceId());
				_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_SUB", _handleInfo.serviceInfo.getDeviceSub());
	    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_ID", parentStorageId);
	    		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_SUB_ID", selectedMediaId);
	    		replaceView( 
	    			"cert_copy", 
	    			function(){ 
	    				targetMediaLi.addClass('media_selected');
	                	$('.save_drive_select').hide();
	                	$('.save_extension_layer').hide();	
	            		$('.certificate_manage').hide();
	        			$("#certifacte_input_area").show();
	                	_handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_NORMAL_ATTR);
	        			iniCertManager.getCertAttributeInfo(_handleInfo);
	        			selectTargetStorage(parentStorageId, selectedMediaId);
	        			
	            	}, 
	            	'LAYER'
	            );
        	}
    	}else {
    		targetMediaLi.removeClass('media_open media_selected').find('span.check').remove();
    	}
    	return false;
	}
	
	
	/** 
	 * @description 확장 매체 선택 이벤트 핸들러
	 * @param {object} 이벤트 발생 DOM Element. Object  
	 */ 
	function onExtensionStorageSelected(selectedExtMedia){
		clearSelectedCertificate();
		
		var selectedExtMedia = $(selectedExtMedia);
		var selectedExtMediaId = selectedExtMedia.find('span').attr('id');
		var parentExtMediaId =  selectedExtMedia.parent().closest('li').find('span').attr('id');
		var extSubMedia  = selectedExtMedia.siblings('.drive_select');
	    var dsc = false;
	    setStorageCheck(selectedExtMedia, true);
	    selectedExtMedia.parent().siblings('.list_data').find('.check').remove().end().removeClass('list_select');
	    selectedExtMedia.parent().addClass('list_select');
	    
	    if(extSubMedia.length >0){
	    	 iniCertManager.appendSubMediaList(_handleInfo, selectedExtMediaId, "#" + parentExtMediaId);
		     if(dsc == false){
		    	//extSubMedia.find('ul').mCustomScrollbar({ mouseWheel:true ,mouseWheelPixcels: 50 });
		        dsc = true;
		     }
		     extSubMedia.show();
	     }else if(selectedExtMedia.parent().attr("id")){
	    	 selectedExtMediaId	= selectedExtMedia.parent().attr("id");
	    	 parentExtMediaId	= selectedExtMedia.parent().parent().parent().closest('li').find('span').attr('id');
		     $('.media_extension').removeClass('open').addClass('list_select');
		     $(".extension_layer").hide();
		     $('.drive_select').hide();
		     procStorageClick(parentExtMediaId,selectedExtMediaId);
	    }else{
	    	 selectedExtMediaId	= selectedExtMedia.children().attr("id");
	    	 parentExtMediaId	= selectedExtMedia.parent().closest('li').find('span').attr('id');
		     $('.media_extension').removeClass('open').addClass('list_select');
		     $(".extension_layer").hide();
		     $('.drive_select').hide();
		    procStorageClick(parentExtMediaId,selectedExtMediaId);
	    }
	    return false;
	}
	
	/** 
	 * @description 저장 매체 클릭 후 처리 핸들러1 
	 * @param {object} HandleInfo
	 */ 
	function procStorageClick(pId, sId){
		if(constants.Certs.STORAGE_USIM == pId){
			iniCertManager.drawCertList({}, pId);
        	_handleInfo.serviceInfo.setEventDeviceId(pId);
        	_handleInfo.serviceInfo.setDeviceSub(pId);
        	_handleInfo.serviceInfo.setCallback(postConfirmHandler);
        	_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
        	
        	if(constants.WebForm.ACTION_LOGIN === _handleInfo.serviceInfo.getBehavior()){
        		iniAction.login(_handleInfo);	    	        	
        	} else {
        		iniAction.signature(_handleInfo);
        	}	
        } else if(constants.Certs.STORAGE_PHONE == pId && constants.Certs.STORAGE_PHONE_MOBISIGN == sId ){
        	iniCertManager.drawCertList({}, pId);
        	_handleInfo.serviceInfo.setEventDeviceId(pId);
        	_handleInfo.serviceInfo.setDeviceSub(sId);
        	_handleInfo.serviceInfo.setCallback(postConfirmHandler);
        	_handleInfo.serviceInfo.setExceptionCallback(defaultExceptionHandler);
        	
        	if(constants.WebForm.ACTION_LOGIN === _handleInfo.serviceInfo.getBehavior()){
        		iniAction.login(_handleInfo);	    	        	
        	} else {
        		iniAction.signature(_handleInfo);
        	}	            	
        } else {	            	
        	selectStorage(pId, sId);
        }
	}

	/** 
	 * @description 저장 매체 클릭 후 처리 핸들러, 
	 * 해당 매체의 인증서 리스트 생성 및 입력 박스 설정
	 * @param {string} pId parent media Id
	 * @param {string} sId target media Id
	 */
	function selectStorage(pId, sId) {
		resetHandleInfo();
		_handleInfo.clear();
		clearSelectedCertificate();
		
		_handleInfo.serviceInfo.setDeviceId(pId);
		_handleInfo.serviceInfo.setEventDeviceId(pId);
		_handleInfo.serviceInfo.setDeviceSub(sId);
		
		if (_handleInfo.serviceInfo.getAction() == constants.WebForm.ACTION_CERT_IMPORT ){
			$("#INI_change_area").hide();
			if($('#INI_certificate_area').is(':visible') == false ){
				$('#INI_certificate_area').show();
			}
		}
		_cancelHandler  =  defaultCancelHandler;
		_confirmHandler = null;
		
		var selectedStorage = $(".media_select").attr("selectedStorage");
		if (!selectedStorage  || selectedStorage  == 'N'){
			initializeViewLayout(pId, sId);
			initializeButtonLayout(pId, sId); 
			initializeKeyStrokeModule();
			initializeKeyStrokeLayout(pId, sId)
			selectStorageProcess(pId, sId);
		}
	} 
	
	function selectStorageProcess(pId, sId){
		_handleInfo.serviceInfo.setBehavior(_orgAction);
		if (_orgBehavior ) 
			_handleInfo.serviceInfo.setBehavior(_orgBehavior);
		_orgAction = _handleInfo.serviceInfo.getAction();
		_orgBehavior = _handleInfo.serviceInfo.getBehavior();
		
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();
		_handleInfo.serviceInfo.setParameter("taskNm" , null);
		
		switch(action){
		case constants.WebForm.ACTION_SIGN: 
			setConfirmHandler(pId); 
			break;

		case constants.WebForm.ACTION_MANAGE: 
			$('#certificate_manage').show();
			if (isSecureMedia(pId)) {
				$('#certificate_manage').hide();
			}
			setConfirmHandler(pId); 
			break;
		case constants.WebForm.ACTION_CERT_EXPORT: 
			setConfirmHandler(pId); 
			break;
		case constants.WebForm.ACTION_CERT_IMPORT: 
			$('#INI_change_area').show();
			$('#media_select_area').show();
			return;
		
		case constants.WebForm.ACTION_CERT_CMP: 
			if (constants.WebForm.ACTION_CERT_ISSUE == behavior || 
					constants.WebForm.ACTION_CERT_UPDATE == behavior){
				$('#INI_certificate_area').hide();
			}
			return;
			
		case constants.WebForm.ACTION_CERT_ISSUE: 
			if (constants.WebForm.ACTION_CERT_ISSUE == behavior){
				$('#INI_certificate_area').hide();
			}
			return;
		default: 
			setConfirmHandler(pId); 
		}
		
		if (getConfirmHandler() !="GET_CERT_LIST") {
		  	iniCertManager.storageClick(_handleInfo);
		}
	}
	
	/** 
	 * @description submit 버튼 핸들러 설정, 
	 * @param {string} sId target media Id
	 */
	function setConfirmHandler(pId){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();
		
		if (action != constants.WebForm.ACTION_CERT_IMPORT && 
				action !=constants.WebForm.ACTION_CERT_CMP ){
			if (isSecureMedia(pId)) {
				_confirmHandler = "GET_CERT_LIST";
			}
		}
	}
	
	/** 
	 * @description submit 버튼 핸들러 반환
	 */
	function getConfirmHandler(){
		return _confirmHandler;
	}
	
	/** 
	 * @description 타겟 저장 매체를 선택 후 키보드 입력 세팅
	 * @param {object} 부모 매체 ID 
	 * @param {object} 선택 매체 ID
	 */ 
	function selectTargetStorage(parentMediaId, selectedMediaId){
		var taskName = _handleInfo.requestInfo.getParameter("taskNm");
		if (typeof taskName !== 'undefined' || !taskName){
			if (taskName === 'CERT_COPY'){
				_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_COPY);
				var inputKeys = ['NONCE'];
				if(_handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_SECURITY_DEVICE || 
						_handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_SCARD){
					inputKeys.push('TARGET_SECURE')
				}
				setCertButtonLayout(['ok','cancel']);
				inputLayout.showKeyInputLayout(inputKeys);
			}
		}
	}
	

	/** 
	 * @description 명령의 가능 여부 판단
	 * @param {strring} 명령
	 * @param {boolean} 에러시 얼럿창을 보여줄 지 여부, 및 반환값 결정
	 */ 
	function isAllowedAction(action, hideAlert){
		var ret = {selectStatus : true };
		if (action === constants.WebForm.ACTION_CERT_COPY ) {
			if( _handleInfo.serviceInfo.getEventDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN ){
				ret['selectStatus'] = false;
				ret['msgType'] = "Warn";
				ret['msgCode'] = "WARN_1029";
				ret['msg'] =msgFactory.getMessageFactory().Warn.WARN_1029;
			}
		}
		
		if (ret['selectStatus'] == false){
			if (typeof hideAlert === "undefined" || !hideAlert) {
				messageDialog.INI_ALERT(msgFactory.getMessageFactory().Warn[ret['msgCode']]);
			}
		}
		
		return ret;
	}
	
	function clearSelectedCertificate(){
		_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
	}
	
	/** 
	 * @description 선택된 인증서 여부 존재 여부 
	 * @param {boolean} 에러시 얼럿창을 보여줄 지 여부, 및 반환값 결정
	 */ 
	function hasSelectedCertificate(hideAlert){
		var ret = {selectStatus : true };
		if(!_handleInfo.serviceInfo.getParameter("CERT_ID")){
			ret['selectStatus'] = false;
			ret['msgType'] = "Warn";
			ret['msgCode'] = "WARN_1015";
			ret['msg'] =msgFactory.getMessageFactory().Warn.WARN_1015;
		}else {
			ret['selectStatus'] = true;
		}
		
		if (ret['selectStatus'] == false){
			if (typeof hideAlert === "undefined" || !hideAlert) {
				messageDialog.INI_ALERT(msgFactory.getMessageFactory().Warn[ret['msgCode']]);
			}
		}
		return ret;
	} 
	
	/** 
	 * @description 매니저 버튼 이벤트 핸들러
	 * @param {object} event source (manage button)
	 * @param {object} event 
	 */ 
	function onManagerClicked(manager,e){
		/* 메뉴 선택 상수
			CERT_COPY
			CERT_REMOVE
			CERT_SEARCH
			CERT_DETAIL
			CERT_PWD_CHANGE
			CERT_EXPORT
		 */
		var task = $(manager).data('task'),
			view = "",
			openCallback= null,
			viewType ="LAYER";
		_handleInfo.requestInfo.setParameter("taskNm",task);
		if (!task) {
			messageDialog.INI_ALERT("인증서 세부 관리 작업이 지정되지 않았습니다");
			return;
		}
		
		/* 이전 Action , Behavior 저장*/
		_orgAction = _handleInfo.serviceInfo.getAction();
		_orgBehavior = _handleInfo.serviceInfo.getBehavior();
		var isSelectedCertRet;
		switch(task){
		/* 인증서 복사의 경우 복사할 저장 매체 다이얼로그 리스트를 생성*/ 
		case "CERT_COPY":
			/* 검증 순서 주의 : 인증서 존재 여부 -> 허용 액션*/
			isSelectedCertRet = hasSelectedCertificate();
			if (isSelectedCertRet.selectStatus) {
				if (!isAllowedAction(constants.WebForm.ACTION_CERT_COPY).selectStatus) {
					return;
				}
			}else {
				return;
			}
			
			view ="destination_storage_select";
			viewType = "MODAL";
			openCallback = function (handleInfo){
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_COPY);
				iniCertManager.drawTargetStorageList()
			};
			break;
		
		case "CERT_REMOVE":
			isSelectedCertRet = hasSelectedCertificate();
			if (!isSelectedCertRet.selectStatus) return;
			view = 'cert_remove';
			openCallback = function(handleInfo){
				handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_NORMAL_ATTR);
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_REMOVE);
				
				$(document).one('keypress', function(e){
					if( e.keyCode == 13 )
					      $('#INI_certSubmit').trigger('click');
				});
				iniCertManager.getCertAttributeInfo(handleInfo);
				setCertButtonLayout(['ok','cancel']);
			};
			$('.certificate_manage').hide();
			$("#certifacte_input_area").hide();
			break;

		case "CERT_SEARCH":
			var  currentTarget = $(e.currentTarget);
			if($(currentTarget).hasClass( 'disabled')) return false;
    		if(_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
    			certEasySearch();
    		} else {
    			certManualSearch();
    		}
    		$('#certifacte_input_area').hide();
    		$('.certificate_manage').hide();
			return; 
		
		case "CERT_DETAIL":
			isSelectedCertRet = hasSelectedCertificate();
			if (!isSelectedCertRet.selectStatus) return;
			view = 'cert_detail_view';
			openCallback = function(handleInfo){
				handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_DETAIL_ATTR);
				iniCertManager.getCertAttributeInfo(handleInfo);
				setCertButtonLayout(['cancel']);
			};
			
			$("#certifacte_input_area").hide();
			$('.certificate_manage').hide();
			setCertButtonLayout(['cancel']);
			break;
			
		case "CERT_PWD_CHANGE": 
			isSelectedCertRet = hasSelectedCertificate();
			if (!isSelectedCertRet.selectStatus) return;
			view = 'cert_change_password';
			$('.certificate_manage').hide();
			$('.certifacte_input_area').show();
			openCallback = function(handleInfo){
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CHANGE_PWD);
				inputLayout.showKeyInputLayout(['NONCE', 'NEW_NONCE', 'NEW_NONCE_CNF']);
				setCertButtonLayout(['ok', 'cancel']);
			}
			break;
			
		case "CERT_EXPORT":
			isSelectedCertRet = hasSelectedCertificate();
			if (!isSelectedCertRet.selectStatus) return;
			view = 'cert_export'; 
			inputLayout.showKeyInputLayout(['NONCE']);
			openCallback = function(handleInfo){
				handleInfo.optionInfo.setParameter("CERT_VIEW_TYPE", constants.Certs.CERTIFICATE_NORMAL_ATTR);
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_EXPORT_FILE);
				iniCertManager.getCertAttributeInfo(handleInfo);
				setCertButtonLayout(['ok','cancel']);
			};
			$('.certificate_manage').hide();

			break;
			
		case "CERT_MANAGER":
			$('.certificate_manage').hide();
			_handleInfo.requestInfo.setSelectedSubCallback();
			$(".ui-dialog-titlebar-close").trigger('click');
			return;
		}
		replaceView(view, openCallback, viewType);
	}
	
	/** 
	 * @description 인증서 가져오기에서 파일이 선택되거나, 드래그로 파일을 선택했을 경우 호출되는 핸들러 
	 */
	function certImportSearch(){
		var viewType ="LAYER";
		var view = 'cert_search_easy';
		var openCallback = function(handler){
			setCertButtonLayout(['ok','cancel']);
			_handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_IMPORT);
		}
		replaceView(view, openCallback, viewType);
	}
	
	/** 
	 * @description 인증서 직접 찾기 창 오픈
	 */ 
	function certManualSearch(){
		var viewType ="LAYER";
		var view = 'cert_search_manual';
		setCertButtonLayout(['cancel']);	
		var openCallback = function(handleInfo){
			handleInfo.serviceInfo.setParameter("onImportCertFileSelected", onImportCertFileSelected);
			iniAction.initializeSave2(handleInfo);
		}
		replaceView(view, openCallback, viewType);
	}
	
	/** 
	 * @description 인증서 간편 찾기 창 오픈
	 */ 
	function certEasySearch(){
		var viewType ="LAYER";
		var view = 'cert_search';
		setCertButtonLayout(['cancel']);	
		var openCallback = function (handleInfo) {}
		replaceView(view, openCallback, viewType);
	} 
	
	/** 
	 * @description 파일 관련 element 및 변수 초기화 
	 * @param {object} HandleInfo
	 * @param {object} 성공 여부 
	 * @param {object} 파일 선택 방식 "DRAG_SELECT : 드래그 선택, FILE_SELECT : 파일 열기 창에서 선택 "
	 */
	function resetImportFileSelectStatus(handleInfo, succeed, fileSelectType){
		if (navigator.userAgent.toLowerCase().indexOf("msie") != -1) {
		       $("#INI_findfiles").replaceWith( $("#INI_findfiles").clone(true) );  
		} else {
			$("#INI_findfiles").val("");
		}
	}
	
	/** 
	 * @description 임포트할 인증서 파일 선택 이벤트 핸들러
	 * @param {object} HandleInfo
	 * @param {object} 성공 여부 
	 * @param {object} 파일 선택 방식 "DRAG_SELECT : 드래그 선택, FILE_SELECT : 파일 열기 창에서 선택 "
	 */ 
	function onImportCertFileSelected(handleInfo, succeed, fileSelectType){
		resetImportFileSelectStatus(handleInfo, succeed, fileSelectType);
		if (_controllerConstants.FILE_SELECT_STATUS.ERROR === succeed) return;
		messageDialog.close();
		var orgBehavior = handleInfo.serviceInfo.getBehavior();
		var orgDeviceId = handleInfo.serviceInfo.getDeviceId();
		var orgDeviceSubId = handleInfo.serviceInfo.getDeviceSub();

		replaceView( 
			"cert_save_detail_view", 
			function(){ 
				_orgAction= _handleInfo.serviceInfo.getAction();
				_orgBehavior = _handleInfo.serviceInfo.getBehavior();
				
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_SAVE);
				iniCertManager.getSaveCertDetailInfo(handleInfo);
				setCertButtonLayout(['ok', 'cancel']);	
				if ( _handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						_handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD ) {
					
					/* 핀 정보가 필요한 저장매체의 GET_CERT_LIST 초기화*/
					if (typeof _confirmHandler != "undefined" && _confirmHandler && _confirmHandler =="GET_CERT_LIST") {
						_confirmHandler = null;
					}
					inputLayout.showKeyInputLayout(['NONCE', 'SECURE']);
				}else {
					inputLayout.showKeyInputLayout(['NONCE']);
				}
			}, 
		   'LAYER'
		);
	}
	
	/** 
	 * @description 인증서 row 선택 핸들러  
	 * @param {object} HandleInfo
	 */ 
	function onCertListRowSeleleted(selectedRow, e){
		GINI_selectedCertificateRow = $('tr', $(selectedRow).closest("table")).index(selectedRow);
		var thisObj = $(e.currentTarget);
		thisObj.addClass('active');
		var id = thisObj.closest("tr").attr("id");
		if(thisObj.find(":eq(0)").is("td")){
		    if(typeof id == 'undefined' || id == undefined || !id){
		    	_handleInfo.serviceInfo.setParameter("CERT_ID", null);
				return;
		    } else {
		    	_handleInfo.serviceInfo.setParameter("CERT_ID", id);
		    }  
		    $('.certificate_list_area table tr').not($(selectedRow).addClass('active')).removeClass('active');
		    $(this).parents('.table_wrap').addClass('cert_selected');
		}	
	}
	
	/** 
	 * @description 기본 익셉션 핸들러 
	 */ 
	function defaultExceptionHandler(ex){
		console.error("익셉션 발생");
		console.error(ex)
		initializeKeyStrokeModule();
		clearNonce();
		clearInput();
		if (ex['COMMAND'] && ex['COMMAND'] == "GET_CERT_LIST" ){
			if (isSecureMedia(_handleInfo.serviceInfo.getDeviceId())){
				_handleInfo.serviceInfo.setParameter("PIN", "");
				inputLayout.showKeyInputLayout(['SECURE']);
			}
			
			if (constants.WebForm.ACTION_MANAGE == _handleInfo.serviceInfo.getAction()){
				$('#certificate_manage').hide()
			}
		}
	}
	
	/** 
	 * @description 제출창 처리 성공시 후처리 핸들러 
	 */ 
	function postConfirmHandler(){
		_handleInfo.stateInfo.setResult("CONFIRM");
		defaultCancelHandler();
	}
	
	/** 
	 * @description 기본 취소 버튼 default Handler 
	 */ 
	function defaultCancelHandler(){
		closeSubWindow();
		closeWindow();
	}
	
	/** 
	 * @description HanldeInfo 초기화 
	 */ 
	function resetHandleInfo(){
		//_handleInfo.serviceInfo.setAction(_orgAction);
		//_handleInfo.serviceInfo.setBehavior(_orgBehavior);
		_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_ID", null); 
		_handleInfo.serviceInfo.setParameter("SOURCE_DEVICE_SUB", null);
		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_ID",null);
		_handleInfo.serviceInfo.setParameter("TARGET_DEVICE_SUB_ID", null);
		_handleInfo.requestInfo.setParameter("taskNm", null);
		_handleInfo.serviceInfo.setParameter("CERT_ID", undefined);
		_handleInfo.serviceInfo.setEventDeviceId(_handleInfo.serviceInfo.getDeviceId())
	}
	
	/** 
	 * @description 레이어 및 특정 작업 취소 버튼 previousCancelHandler
	 */ 
	function previousCancelHandler(){
		resetHandleInfo();
		initializeActionConstants();
		initializeViewLayout();
		initializeButtonLayout();
		//initializeKeyStrokeModule();
		initializeKeyStrokeLayout(_handleInfo.serviceInfo.getDeviceId());
		setElementEnable('#media_select_area .media_select #INI_storage_list li', 'removeClass', 'data_disabled');

		var selected = null;
		if (_handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_SIGN){
			selected = iniCertManager.getSelectedCertInfo();
		}
		iniCertManager.drawStorageList(_handleInfo, selected);
		iniCertManager.setFocusStorage(_handleInfo);

		var deviceId = _handleInfo.serviceInfo.getDeviceId();
		var pin; 
		if (isSecureMedia(deviceId)) {
			pin = _handleInfo.serviceInfo.getParameter("PIN");
			if (pin) {
				iniCertManager.storageClick(_handleInfo);
			}
		}else {
			iniCertManager.storageClick(_handleInfo);
		}
		/* 윈도우 위치 재 조정 
		setDialogPosition();
		*/
		_cancelHandler = defaultCancelHandler;
	}
	
	exported['openMainWnd'] = openMainWnd;
	return exported; 
});