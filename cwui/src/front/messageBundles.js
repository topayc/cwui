define([
	'../main/constants',
	'../conf/msgFactory',
	], function(constants, msgFactory){
	"use strict";
	 var CERT_VIEW_CAPTION, VIEW_MESSAGE;
	 var mainModalContainer;
	 var subModalContainer;
	var commonMsgs, 
		manageMsgs,
		certSearchMsgs, 
		buttonMsgs,
		signMsgs,
		cmpMsgs,
		warnMsgs,
		webFormMsgs,
		importExportMsgs,
		certChangePwMsgs,
		certCopyMsgs,
		certDetaiMsgs,
		certRemoveMsgs,
		certExportMsgs;
	/** 
	 * @description 초기화 메서드 
	 */ 
	function initialize(con1, con2){
		mainModalContainer = con1;
		subModalContainer = con2;
	}
	/** 
	 * @description 현재 설정된 언어에 뷰 텍스트 및 메시지 설정
	 */ 
	function loadResource(){
		commonMsgs = msgFactory.getMessageFactory().WebForm().TEXT().COMMON();
		manageMsgs = msgFactory.getMessageFactory().WebForm().TEXT().CERT_MANAGE();
		certSearchMsgs = msgFactory.getMessageFactory().WebForm().TEXT().CERT_SEARCH();
		buttonMsgs = msgFactory.getMessageFactory().WebForm().BUTTON();
		signMsgs = msgFactory.getMessageFactory().WebForm().TEXT().SIGN();
		cmpMsgs = msgFactory.getMessageFactory().WebForm().TEXT().CERT_CMP();
		warnMsgs = msgFactory.getMessageFactory().Warn;
		webFormMsgs	= msgFactory.getMessageFactory().WebForm();
		importExportMsgs = msgFactory.getMessageFactory().WebForm().TEXT().CERT_IMPORT_EXPORT();
		certChangePwMsgs = msgFactory.getMessageFactory().WebForm().TEXT().CERT_CHANGE_PW();
		certCopyMsgs = msgFactory.getMessageFactory().WebForm().TEXT().CERT_COPY();
		certDetaiMsgs= msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL();
		certRemoveMsgs= msgFactory.getMessageFactory().WebForm().TEXT().CERT_REMOVE();
		certExportMsgs= msgFactory.getMessageFactory().WebForm().TEXT().CERT_EXPORT();
		
		CERT_VIEW_CAPTION = {
			    'LOGIN' : { 
			    	'CAPTION' :  webFormMsgs.TITLE().LOGIN_TITLE,
			    	'MORE_CAPTIONS' : false
			    },
			    'MANAGE' : {
			    	'CAPTION' :  webFormMsgs.TITLE().CERT_MANAGE_TITLE,
			    	'MORE_CAPTIONS' : false
			    },
			    'EXPORT' : { 
			    	'CAPTION' :  webFormMsgs.TITLE().CERT_EXPORT_TITLE,
			    	'MORE_CAPTIONS' : false
			    },
			    'IMPORT' : { 
			    	'CAPTION' :  webFormMsgs.TITLE().CERT_IMPORT_TITLE,
			    	'MORE_CAPTIONS' : false
			    },
			    'SIGN' : { 
			    	'CAPTION' :  webFormMsgs.TITLE().SIGN_TITLE,
			    	'MORE_CAPTION' : false
			    },
			    'CMP' : { 
			    	'CAPTION' :  null,
			    	'MORE_CAPTIONS' : true,
			    	'CAPTIONS' : {
			    		'ISSUE' : webFormMsgs.TITLE().CERT_ISSUE_TITLE,
			    		'REVOKE' : webFormMsgs.TITLE().CERT_REVOKE_TITLE,
			    		'UPDATE' : webFormMsgs.TITLE().CERT_UPDATE_TITLE
			    	}
			    }
			};
		
		VIEW_MESSAGE =  {
				/* 인증서 창의 일반 텍스트 */
			INIFORM : [
			     /* 인증서 매체 리스트 라벨 */ 
				 { selector :  '#INI_storage_select_title', property : 'text', value : commonMsgs.W_T_001},  
					 
				 /* 전자 서명 안내 문구*/
				 { selector :  '#INI_signature_text', property : 'text', value : signMsgs.W_T_S_001},  
			
				 /* 인증서 선택 라벨*/
				 { selector :  '#INI_certificate_section_title', property : 'text', value : commonMsgs.W_T_002},  
			
				 /* 인증서 암호 입력 라벨*/
				 { selector :  '#ini_cert_pwd_label', property : 'text', value : certChangePwMsgs.W_T_C_CP_002},  
				 { selector :  '#ini_cert_new_pwd_label', property : 'text', value : commonMsgs.W_T_004},  
				 { selector :  '#ini_cert_new_pwd_cnf_label', property : 'text', value : commonMsgs.W_T_006},  
				 { selector :  '#ini_cert_pin_label', property : 'text', value : commonMsgs.W_T_009},  
				 { selector :  '#ini_cert_target_pin_label', property : 'text', value : commonMsgs.W_T_009},  
					 
				 /* 인증서 관리 텍스트 버튼 라벨*/
				 { selector :  '#INI_certificate_manager_selected_msg', property : 'text', value : commonMsgs.W_T_014},  
				 { selector :  '#INI_cert_search_title', property : 'text', value : manageMsgs.W_T_C_M_005},  
				 { selector :  '#INI_cert_remove_title', property : 'text', value : manageMsgs.W_T_C_M_006},  
				 { selector :  '#INI_cert_search_title', property : 'text', value : manageMsgs.W_T_C_M_007},  
				 { selector :  '#INI_cert_detail_info_title', property : 'text', value : manageMsgs.W_T_C_M_008},  
				 { selector :  '#INI_cert_password_change_title', property : 'text', value : manageMsgs.W_T_C_M_008},  
				 { selector :  '#INI_cert_export_title', property : 'text', value : manageMsgs.W_T_C_M_009},
				 { selector :  '#INI_cert_mgr_title', property : 'text', value : buttonMsgs.W_B_022},
			
				 /* 인증서 관리 이미지 버튼 라벨*/
				 { selector :  '#INI_mgr_cert_copy_btn', property : 'text', value : manageMsgs.W_T_C_M_005},  
				 { selector :  '#INI_mgr_remove_btn', property : 'text', value :  manageMsgs.W_T_C_M_006},  
				 { selector :  '#INI_mgr_search_btn', property : 'text', value :  manageMsgs.W_T_C_M_007},  
				 { selector :  '#INI_mgr_detail_info_btn', property : 'text', value :  manageMsgs.W_T_C_M_008},  
				 { selector :  '#INI_mgr_password_change_btn', property : 'text', value :  manageMsgs.W_T_C_M_009},  
				 { selector :  '#INI_mgr_export_btn', property : 'text', value :  manageMsgs.W_T_C_M_010},
			
				 /* 인증서 입력 박스 placehoder*/
				 { selector :  "#ini_cert_pwd", property : 'attr', value : {'placeholder' : commonMsgs.W_T_003}},
				 { selector :  "#ini_cert_new_pwd", property : 'attr', value : {'placeholder' : commonMsgs.W_T_003}},
				 { selector :  "#ini_cert_new_pwd_cnf", property : 'attr', value : {'placeholder' : commonMsgs.W_T_003}},
				 { selector :  "#ini_cert_pin", property : 'attr', value : {'placeholder' : commonMsgs.W_T_015}},
				 { selector :  "#ini_cert_target_pin", property : 'attr', value : {'placeholder' : commonMsgs.W_T_015}},
			
				 /* 하단 확인 및 닫기 버튼 라벨*/
				 { selector :  '#INI_certSubmit', property : 'text', value : buttonMsgs.W_B_001},  
				 { selector :  '#INI_certClose', property : 'text', value : buttonMsgs.W_B_002},  
			
				 /* 키보드 보안 설치 안내 문구*/
				 { selector :  '.certificate_text_message', property : 'html', value : commonMsgs.W_T_026},
					 
				 /* 인증서 닫기 버튼 이미지 */
				 { selector :  '#INI_windowClose', property : 'html', value : '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn/btn_close_w.png"/>'}
			],
				
			CERT_ANOTHER_ISSUE : [], 
			CERT_CHANGE_PASSWORD : [], /* empty html*/ 
			CERT_COPY : [
			     { selector :  '#INI_cert_second_modal_title', property : 'html', value : certCopyMsgs.W_T_C_C_001},
			     { selector :  '#INI_cert_second_modal_sub_title', property : 'html', value : '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/certificate2.png" alt="" />'  +commonMsgs.W_T_005}
			],
			CERT_DETAIL_VIEW : [
				 { selector :  '#INI_cert_second_modal_title', property : 'html', value : certSearchMsgs.W_T_C_S_011},
				 { selector :  '#INI_cert_second_modal_sub_title', property : 'html', value :  '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/certificate2.png" alt="" />'  + commonMsgs.W_T_005}
			],
				
			CERT_EXPORT : [
			     { selector :  '#INI_cert_second_modal_title', property : 'text', value :  certExportMsgs.W_T_C_E_001},
			     { selector :  '#INI_cert_second_modal_sub_title', property : 'html', value :  '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/certificate2.png" alt="" />'  + commonMsgs.W_T_005},
			     { selector :  '#INI_cert_export_text', property : 'text', value :  certExportMsgs.W_T_C_E_002}
			],
			
			CERT_EXPORT_V12 : [
			     { selector :  '#INI_cert_export_third_title', property : 'text', value :  importExportMsgs.C_I_E_002},
			     { selector :  '#INI_cert_export_help', property : 'html', value :  importExportMsgs.C_I_E_004},
			     { selector :  '#INI_cert_import_number_text', property : 'text', value :  importExportMsgs.C_I_E_005},
			     { selector :  '#INI_cert_import_export_spendtime_text', property : 'text', value :  importExportMsgs.C_I_E_009},
			     { selector :  '#INI_refresh_txt', property : 'text', value :  importExportMsgs.C_I_E_006},
			],
			
			CERT_IMPORT_V12_FORM : [
			     { selector :  '#INI_cert_import_third_title', property : 'html', value :  importExportMsgs.C_I_E_001},
			     { selector :  '#INI_cert_import_help', property : 'html', value :  importExportMsgs.C_I_E_003},
			     { selector :  '#INI_cert_import_number_text', property : 'html', value :  importExportMsgs.C_I_E_005},
			     { selector :  'input[name=INI_authNum]:nth-child(1)', property : 'attr', value :  {'title' : certSearchMsgs.W_T_C_S_012}},
				 { selector :  'input[name=INI_authNum]:nth-child(2)', property : 'attr', value :  {'title' : certSearchMsgs.W_T_C_S_013}}
			],
			
			CERT_IMPORT_V12 : [
			     { selector :  '#INI_cert_export_third_title', property : 'text', value :  importExportMsgs.C_I_E_002},
			     { selector :  '#INI_cert_export_help', property : 'html', value :  importExportMsgs.C_I_E_004},
			     { selector :  '#INI_cert_import_number_text', property : 'text', value :  importExportMsgs.C_I_E_005},
			     { selector :  '#INI_cert_import_export_spendtime_text', property : 'text', value :  importExportMsgs.C_I_E_009},
			     { selector :  '#INI_refresh_txt', property : 'text', value :  importExportMsgs.C_I_E_006}
			
			],
			
			CERT_SEARCH_MANUAL: [
			     { selector :  '#INI_cert_search_manual_third_title', property : 'text', value :  certSearchMsgs.W_T_C_S_002},
			     { selector :  '#INI_cert_search_manual_drop_help', property : 'html', value :  certSearchMsgs.W_T_C_S_005},
			     { selector :  '#INI_cert_search_manual_dropzone_text', property : 'html', value :  certSearchMsgs.W_T_C_S_007},
			     { selector :  '#INI_certFileFind_text', property : 'text', value :  buttonMsgs.W_B_011}
			],
						
			CERT_REMOVE : [
			     { selector :  '#INI_cert_search_manual_third_title', property : 'html', value :  certRemoveMsgs.W_T_C_R_001},
			     { selector :  '#INI_cert_second_modal_sub_title', property : 'html', value :  commonMsgs.W_T_005},
			     { selector :  '#INI_cert_modal_message', property : 'html', value :  '<b>' + certRemoveMsgs.W_T_C_R_002 + '</b>'}
			],
			CERT_SAVE_DETAIL_VIEW : [
			     { selector :  '#INI_cert_second_modal_title', property : 'html', value :  certSearchMsgs.W_T_C_S_011}	,
			     { selector :  '#INI_cert_second_modal_sub_title', property : 'html', value : commonMsgs.W_T_005 }
			],
			CERT_SEARCH_EASY : [
			    { selector :  '#INI_cert_search_easy_third_title', property : 'html', value :  certSearchMsgs.W_T_C_S_001}	,
			    { selector :  '#INI_cert_search_easy_program_help_1', property : 'html', value :  certSearchMsgs.W_T_C_S_008_1},
			    { selector :  '#INI_cert_search_easy_program_help_2', property : 'html', value :  certSearchMsgs.W_T_C_S_008_2},
			    { selector :  '#INI_utilDownload', property : 'html', value :  buttonMsgs.W_B_012},
			    { selector :  '#INI_cert_import_number_text', property : 'html', value :  certSearchMsgs.W_T_C_S_009},
			    { selector :  '#INI_cert_number_text', property : 'html', value :  certSearchMsgs.W_T_C_S_009},
			    { selector :  'input[name=INI_authNum]:nth-child(1)', property : 'attr', value :  {'title' : certSearchMsgs.W_T_C_S_012}},
			    { selector :  'input[name=INI_authNum]:nth-child(2)', property : 'attr', value :  {'title' : certSearchMsgs.W_T_C_S_013}}
			],
			CERT_SEARCH : [
			    { selector :  '#INI_cert_search_title', property : 'text', value :  certSearchMsgs.W_T_C_S_011},
			    { selector :  '#INI_cert_search_easy_sub_title', property : 'text', value :  certSearchMsgs.W_T_C_S_001},
			    { selector :  '#INI_cert_search_easy_help', property : 'html', value :  certSearchMsgs.W_T_C_S_003},
			    { selector :  '#INI_cert_search_manual_sub_title', property : 'text', value :  certSearchMsgs.W_T_C_S_002},
			    { selector :  '#INI_cert_search_manual_help', property : 'html', value :  certSearchMsgs.W_T_C_S_004},
			    { selector :  '#INI_manual_search_go ', property : 'attr', value :  {'title' : certSearchMsgs.M_W_T_C_S_027}}
			],
			DESTINATION_STORAGE_SELECT : [
			    { selector :  '.INI_target_storage_title', property : 'html', value : commonMsgs.W_T_013},
			    { selector :  '#INI_storage_select_close', property : 'html', value : '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn//btn_layer_close_large.png"/>'}
			],
			
			DESTINATION_STORAGE_SELECT_ANOTHER : [
			    { selector :  '.INI_target_storage_title', property : 'html', value : commonMsgs.W_T_013},
			    { selector :  '#INI_storage_select_close', property : 'html', value : '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn//btn_layer_close_large.png"/>'}
			],
		};
	}
	
	/** 
	 * @description 지정한 뷰의 텍스트 설정
	 * @param {object} HandleInfo
	 * @param {string} viewName
	 */
	
	function setViewText(_handleInfo, viewName){
		if (typeof viewName === 'undefined'  || !viewName  || viewName === 'INIFORM') {
			viewName = "INIFORM";
			setViewCaption(_handleInfo, viewName);
		}
		setViewContentMessage(_handleInfo, viewName);
	}
	
	/** 
	 * @description 인증창의 바디 본문 텍스트 설정
	 * @param {string} viewName
	 */ 
	function setViewContentMessage(_handleInfo, viewName){
		var container = mainModalContainer; 
		
		var action = _handleInfo.serviceInfo.getAction();
		var behavoir = _handleInfo.serviceInfo.getBehavior();
		
		if (viewName.toUpperCase()  == 'CERT_CHANGE_PASSWORD' ) {
			mainModalContainer.find('#ini_cert_new_pwd_label').text(certChangePwMsgs.W_T_C_CP_003);
			mainModalContainer.find('#ini_cert_new_pwd_cnf_label').text(certChangePwMsgs.W_T_C_CP_004);
		 }
	    
		if (viewName.toUpperCase() == 'DESTINATION_STORAGE_SELECT' 
			|| viewName.toUpperCase() == 'DESTINATION_STORAGE_SELECT_ANOTHER'){
			container = subModalContainer;
		}
		
		var messages = VIEW_MESSAGE[viewName.toUpperCase()];
		if (messages) {
			for (var i =0 ; i < messages.length; i++){
				container.find(messages[i].selector) [messages[i].property] (messages[i].value);
			}
		}
	}
	
	/** 
	 * @description 인증창의 캡션 설정
	 * @param {object} HandleInfo
	 */ 
	
	function setViewCaption(_handleInfo){
		mainModalContainer.find('#INI_cert_modal_title').html(getViewCaption(_handleInfo));
	}

	/** 
	 * @description 인증창의 캡션 문자열 반환
	 * @param {object} HandleInfo
	 */ 
	function getViewCaption(_handleInfo){
		var action = _handleInfo.serviceInfo.getAction();
		var behavior = _handleInfo.serviceInfo.getBehavior();
		var caption = CERT_VIEW_CAPTION[action.toUpperCase()];
		
		if (typeof caption !== "undeifned" && caption) {
			if (caption.MORE_CAPTIONS == true) {
				return caption.CAPTIONS[behavior.toUpperCase()];
			}else {
				return caption.CAPTION;
			}
		}else {
			
		}
	}
	
	
	var exported = {};
	exported['initialize'] = initialize;
	exported['loadResource'] = loadResource;
	exported['setViewText'] = setViewText;
	exported['setViewCaption'] = setViewCaption;
	exported['getViewCaption'] = getViewCaption;
	return exported;
});