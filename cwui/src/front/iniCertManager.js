define([
	'../main/constants',
	'../conf/msgFactory'
	], function(constants,msgFactory){
	"use strict";
	var initechApp,
	exported = {};

	/** 
	 * @description iniCertManger 초기화 함수
	 */  
	function initialize(){
		initechApp = cwui;
	}
	
	function drawStorageList(_handleInfo, isFilterCache){
		var actionBehavior = _handleInfo.serviceInfo.getBehavior() ? 
				_handleInfo.serviceInfo.getBehavior() : _handleInfo.serviceInfo.getAction();
		initechApp.WebForm.dialogdrawStorageList('INI_storage_list', actionBehavior, isFilterCache);
	}
	
	/** 
	 * @description 선택한 저장 매체에 포커스를 준다 
	 * @param {objext} HandleInfo .  
	 */  
	function setFocusStorage(_handleInfo, isTagetDevice){
		var id = typeof isTagetDevice !== 'undefined' && isTagetDevice == true ? _handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") : 
			_handleInfo.serviceInfo.getDeviceId(); 
		initechApp.StorageManage.setFocusStorage(id);
	}
	
	/** 
	 * @description 저장매체의 인증서 리스트를 생성한다  
	 * @param {objext} HandleInfo .  
	 */  
	function storageClick(_handleInfo){
		//_handleInfo.serviceInfo.setParameter('CERT_ID', null);
		//console.log("storageClick");
		initechApp.StorageManage.storageClick(_handleInfo)
	}
	
	/** 
	 * @description 인증서 창의 상단 로고 세팅
	 */  
	function drawLogo(logoType){
		logoType = logoType  ?  logoType : "MAIN";
		initechApp.WebForm.drawLogo(logoType);
	}
	
	/** 
	 * @description 인증서 발급 후 콜백에 의해 호출되는 모달의 저장 매체 그리기 함수 
	 */  
	function drawAnotherTargetStorageList(_handleInfo){
		initechApp.WebForm.drawAnotherTargetStorageList('INI_target_storage_list', constants.WebForm.ACTION_CERT_SAVE, '', _handleInfo.serviceInfo.getDeviceId());
	}
	
	/** 
	 * @description 대상 매체의 저장 매체 리스트 생성
	 */  
	function drawTargetStorageList(){
		initechApp.WebForm.drawTargetStorageList(
				'INI_target_storage_list', 
				constants.WebForm.ACTION_CERT_COPY
		);
	}
	
	/** 
	 * @description 인증서 리스트를 직접 생성
	 * @param {object} 인증서 배열 
	 * @param {object} 디바이스 아이디
	 */  
	function drawCertList(certs, id){
		initechApp.WebForm.drawCertList(certs, id);
	}
	
	/** 
	 * @description 일반 저장 매체에 속한 서브 저장매체 리스트를 생성
	 * @param {objext} HandleInfo .  
	 */  
	function appendSubMediaList(_handleInfo, sId, targetNode, drawType){
		GINI_selectedCertificateRow = 1;
		var preDeviceId = _handleInfo.serviceInfo.getDeviceId();
		/* 
		 * 매체의 서브리스트를 요청하기 위한 subMediaRequestHandleInfo  생성
		 * 이미 존재하는 handleInfo를 사용할 경우, evnetDeviceId 값이 변경되어, 이후 로직에 문제 발생
		*/
		var subMediaRequestHandleInfo = require("../common/handleManager").newHandleInfo();
		subMediaRequestHandleInfo.serviceInfo.setEventDeviceId(sId);
		//subMediaRequestHandleInfo.serviceInfo.setDeviceId(preDeviceId);
		subMediaRequestHandleInfo.serviceInfo.setParameter("TargetParentNode",targetNode);
		subMediaRequestHandleInfo.serviceInfo.setParameter("DrawType", drawType);	
		initechApp.WebForm.drawStorageSubList(subMediaRequestHandleInfo);
		
		/* 
		_handleInfo.serviceInfo.setEventDeviceId(sId);
		_handleInfo.serviceInfo.setDeviceId(preDeviceId);
		_handleInfo.serviceInfo.setParameter("TargetParentNode",targetNode);
		_handleInfo.serviceInfo.setParameter("DrawType", drawType);	
		initechApp.WebForm.drawStorageSubList(_handleInfo);
		 */
	}
	
	/** 
	 * @description 확장 저장 매체에 속한 서브 저장매체 리스트를 생성
	 * @param {objext} handle .  
	 */  
	function appendSubExtensionMediaList(_handleInfo){
		initechApp.WebForm.drawStorageExtList(
				'INI_storage_ext_list', 
				_handleInfo.serviceInfo.getBehavior()
		);
	}
	
	/** 
	 * @description 설치 여부 검사 
	 */ 
	function installed(callback){
		initechApp.Version.installed(callback);			 
	}
	
	/** 
	 * @description 서명 텍스트 폼 생성
	 * @param {object} handle 
	 */  
	function drawSignForm(_handleInfo){
		var orgText = decodeURIComponent(_handleInfo.requestInfo.getParameter("ORG_DATA"));
		initechApp.WebForm.drawSignForm(orgText);
	}
	
	
	/** 
	 * @description 스토리지의 인증서로부터 핀 정보를 가져와 세팅  
	 */ 
	function setPinFromStorage(_handleInfo){
		var cachedCert = initechApp.Certs.getSelectedCertInfo();
		if (!cachedCert) { 
			INI_HANDLE.warnMessage("Invalid Function call :  setPinFromSessionStorage - No Storage Cached Cert");
			return;
		}
		
		_handleInfo.serviceInfo.setParameter("ENCRYPTED", cachedCert.ep.epEnc);
		_handleInfo.serviceInfo.setParameter("PIN", cachedCert.ep.epText);
		if (_handleInfo.serviceInfo.getParameter("ENCRYPTED") === "FALSE"){
			GINI_ProtectMgr.keep("SECURE", cachedCert.ep.epText);
		}
	}
	
	/** 
	 * @description 캐시된 인증서 정보 반환
	 */ 
	
	function getSelectedCertInfo(){
		return  initechApp.Certs.getSelectedCertInfo();
	}
	
	/** 
	 * @description 인증서 정보를 지정한 뷰타입에 따라 생성
	 * @param {objext} handleInfo .  
	 */  
	function getCertAttributeInfo(_handleInfo){
		var viewType = _handleInfo.optionInfo.getParameter("CERT_VIEW_TYPE");
		viewType == typeof viewType !== 'undefined '  &&  viewType  ? 
				viewType : constants.Certs.CERTIFICATE_NORMAL_ATTR; 
		
		if (viewType  == constants.Certs.CERTIFICATE_DETAIL_ATTR) {
			_handleInfo.serviceInfo.setCallback(initechApp.WebForm.drawCertDetail);
		}
		if (viewType  == constants.Certs.CERTIFICATE_NORMAL_ATTR) {
			_handleInfo.serviceInfo.setCallback(initechApp.WebForm.drawCertAttrDetail);
		}
		initechApp.Certs.getCertAttributeInfo(_handleInfo);
	}
	
	
	/** 
	 * @description 대상 미디어의 유효성 판단
	 * @param {string} 대상 미디어 ID .  
	 */  
	function isValidTargetMedia(_handleInfo, targetMedia, isSub){
		var sourceMedia = "";
    	if( isSub != undefined && isSub === true ){
    		sourceMedia = _handleInfo.serviceInfo.getDeviceSub();
    	}else{
    		sourceMedia = _handleInfo.serviceInfo.getDeviceId();
    	}
    		
    	if( sourceMedia == targetMedia ){
    		INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1026);
    		return false;
    	}
    	return true;
	}
	
	/** 
	 * @description 인증서 폐기 후 삭제
	 */  
	function getSelectedReNewCertInfo(_handleInfo){
		return initechApp.Certs.getSelectedReNewCertInfo();
	}
	
	function getSaveCertDetailInfo(_handleInfo){
		_handleInfo.serviceInfo.setCallback(initechApp.WebForm.drawCertAttrDetail);
		setTimeout(function(){
			initechApp.CertManager.getSaveCertDetailInfo(_handleInfo);
		},100)
	}
	
	exported['initialize'] = initialize;
	exported['drawStorageList'] = drawStorageList;
	exported['setFocusStorage']  = setFocusStorage;
	exported['storageClick']  = storageClick;
	exported['drawLogo'] = drawLogo;
	exported['drawAnotherTargetStorageList'] = drawAnotherTargetStorageList;
	exported['drawTargetStorageList']  = drawTargetStorageList;
	exported['drawCertList']  = drawCertList;
	exported['appendSubMediaList']  = appendSubMediaList;
	exported['appendSubExtensionMediaList']  = appendSubExtensionMediaList;
	exported['installed']  = installed;
	exported['drawSignForm']  = drawSignForm;
	exported['setPinFromStorage']  = setPinFromStorage;
	exported['getSelectedCertInfo']  = getSelectedCertInfo;
	exported['getCertAttributeInfo']  = getCertAttributeInfo;
	exported['isValidTargetMedia']  = isValidTargetMedia;
	exported['getSelectedReNewCertInfo'] = getSelectedReNewCertInfo;
	exported['getSaveCertDetailInfo']  = getSaveCertDetailInfo;
	
	return exported;
	
});