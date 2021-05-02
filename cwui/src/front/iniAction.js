define([
	'../main/constants',
	'../main/initechApp',
	], function(constants, initechApp){
	"use strict";
	
	var intechApp, exported = {};
	
	function initialize(){
		initechApp = cwui;
	}
	
	/** 
	 * @description 인증서 로그인 
	 * @param {obejct} handleInfo
	 */
	function login(_handleInfo){
		initechApp.Login.doLogin(_handleInfo);
	}
	
	/** 
	 * @description 전자 서명
	 * @param {obejct} handleInfo
	 */
	function signature(_handleInfo){
		initechApp.Signature.doSign(_handleInfo);
	}
	
	/** 
	 * @description 인증서 삭제
	 */  
	function removeCertificate(_handleInfo){
		initechApp.CertManager.removeCertificate(_handleInfo);
	}
	
	function initializeSave2(_handleInfo, dropZoneId, searchFileId, callback){
		dropZoneId = dropZoneId || 'INI_dropZone';
		searchFileId = searchFileId || 'INI_findfiles';
		callback =  callback || initechApp.CertManager.searchCert;
		initechApp.CertManager.initializeSave2(_handleInfo, dropZoneId, searchFileId, callback);
	}
	
	
	function saveLocalPriCert(_handleInfo){
		initechApp.CertManager.saveLocalPriCert(_handleInfo);
	}
	
	function exportCertPriP12File(_handleInfo){
		initechApp.CertManager.exportCertPriP12File(_handleInfo);
	}

	function changePassword(_handleInfo){
		 initechApp.CertManager.changePassword(_handleInfo);
	}
	
	/** 
	 * @description 기기간 복사에서 인증서 가져오기
	 */  
	function importCertV12(_handleInfo, doCallback){
		initechApp.CertManager.certImportExport.importCertV12(_handleInfo, doCallback);
	}
	
	function saveCertPriV11(_handleInfo){
		initechApp.CertManager.saveCertPriV11(_handleInfo);
	}
	
	function certImportExportSetCertStatus(_handleInfo){
		initechApp.CertManager.certImportExport.setCertStatus(_handleInfo);
	}
	
	/** 
	 * @description 인증서 복사
	 */  
	function copyCertificate(_handleInfo){
		initechApp.CertManager.copyCertificate(_handleInfo);
	}
	
	/** 
	 * @description 인증서 내보내기
	 */  
	function makeExportData(_handleInfo){
		initechApp.CertManager.certImportExport.makeExportData(_handleInfo);
	}

	/** 
	 * @description 타이머 리셋
	 */  
	function resetTimer(_handleInfo){
		initechApp.CertManager.importTimer.resetTimer();
	}

	/** 
	 * @description 타이머 시작
	 */  
	function startTimer(duration, display){
		return initechApp.CertManager.importTimer.startTimer(duration, display);
	}

	/** 
	 * @description exportCertV12
	 */  
	function exportCertV12(_handleInfo, callbackFunc){
		initechApp.CertManager.certImportExport.exportCertV12(_handleInfo, callbackFunc);
	}

	/** 
	 * @description getStauts
	 */  
	function getCertStatus(iniAuthNum, callbackFunc, resetFunc){
		initechApp.CertManager.certImportExport.getCertStatus(iniAuthNum, callbackFunc, resetFunc);
	}

	/** 
	 * @description setStatus
	 */  
	function setStatus(_handleInfo){
		nitechApp.CertManager.certImportExport.setCertStatus(_handleInfo);
	}
	

	/** 
	 * @description setLongPollTimer
	 */  
	function setLongPollTimer(func){
		setTimeout(function(){
			func();
		}, 3000)
	}


	/** 
	 * @description 인증서 발급
	 */  
	function issueCertificate(_handleInfo){
		initechApp.CertManager.issueCertificate(_handleInfo);
	}
	
	/** 
	 * @description 인증서 발급 후 콜백에 의해 호출되는 다른 매체 저장 함수 
	 */  
	function saveAnotherCertificate(_handleInfo){
		initechApp.CertManager.saveAnotherCertificate(_handleInfo);
	}
	
	/** 
	 * @description 인증서 폐기 후 삭제
	 */  
	function revokeCertificate(_handleInfo){
		initechApp.CertManager.revokeCertificate(_handleInfo);
	}

	/** 
	 * @description 인증서 폐기 후 삭제
	 */  
	function updateCertificate(_handleInfo){
		initechApp.CertManager.updateCertificate(_handleInfo);
	}

	/** 
	 * @description 발급된 인증서를 저장 
	 */  
	function savePrivateCertificate(_handleInfo){
		initechApp.CertManager.savePrivateCertificate(_handleInfo);
	}
	
	exported['initialize'] = initialize;
	exported['login'] = login;
	exported['signature'] = signature;
	exported['removeCertificate']  = removeCertificate;
	exported['initializeSave2']  = initializeSave2;
	exported['saveLocalPriCert']  = saveLocalPriCert;
	exported['saveCertPriV11']  = saveCertPriV11;
	exported['exportCertPriP12File']  = exportCertPriP12File;
	exported['changePassword']  = changePassword;
	exported['importCertV12']  = importCertV12;
	exported['certImportExportSetCertStatus']  = certImportExportSetCertStatus;
	exported['copyCertificate']  = copyCertificate;
	exported['makeExportData']  = makeExportData;
	exported['exportCertV12']  = exportCertV12;
	exported['resetTimer']  = resetTimer;
	exported['startTimer']  = startTimer;
	exported['getCertStatus']  = getCertStatus;
	exported['setStatus']  = setStatus;
	exported['setLongPollTimer']  = setLongPollTimer;
	exported['issueCertificate'] = issueCertificate;
	exported['saveAnotherCertificate'] = saveAnotherCertificate;
	exported['revokeCertificate'] = revokeCertificate;
	exported['updateCertificate'] = updateCertificate;
	exported['savePrivateCertificate'] = savePrivateCertificate;
	return exported;
});