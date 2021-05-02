/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * @desc : 인증서 가져오기/내보내기
 */
define([
        '../../conf/defaultConf',
        '../../core/utils',
        '../../main/constants',
        '../../core/coreFactory',
        '../../core/privateStorage'
        ], function (defaultConf, utils, constants, coreFactory, privateStorage) {
	
	/**
	 * @desc : 인증서 가져오기
	 */
	var importCertPriV11 = function(certPri, authNum){

		certPri = certPri.split('$')[1];
		// 입력받은 authNum 값으로 iv와 key 를 생성한다. 
		var iv = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA1, authNum);
		var key = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA1, iv);
		
		key = coreFactory.Factory.Util.createBuffer(key);
		iv = coreFactory.Factory.Util.createBuffer(iv);
		
		key = key.data.slice(0,16);
		iv = iv.data.slice(0,16);
		
		utils.Log.debug('key : ' + coreFactory.Factory.Util.bytesToHex(key));
		utils.Log.debug('iv : ' + coreFactory.Factory.Util.bytesToHex(iv));
		
		certPri = decodeURIComponent(certPri);
		certPri = coreFactory.Factory.Util.decode64(certPri);
		
		var decrypted = coreFactory.Factory.Cipher.symmetricDecrypt(constants.Cipher.SYMM_SEED_CBC, key, iv, coreFactory.Factory.Util.createBuffer(certPri));
		return decrypted.data.split('||');
	};
	
	/**
	 * @desc : 인증서 인증번호 가져오기 
	 */
	var getImportAuthNum = function(callback){
		
		var ver = 'SVer=1.1';
		var action = 'Action=REQ_AUTHCODE';
		var size = 'Size=8';
		var postdata = ver + "&" + action + "&" + size;
		utils.Log.debug('postdata : ' + postdata);

		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_IMPORT_V11];
		utils.Log.debug('Authnum url : '+ url );
		
		var authNum = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		authNum = authNum.split('$');
		authNum = authNum[1];
		callback(authNum);	
	}
	
	/**
	 * @desc : 인증서 가져오기 v11 
	 */
	var importCertV11 = function(handleInfo, callback){
		
		var ver = 'SVer=1.1';
		var action = 'Action=IMPORT';
		var authNum = 'AuthNum=' + handleInfo.serviceInfo.getParameter("AUTH_NUM");
//		var size = 'Size=8';
		var postdata = ver + "&" + action + "&" + authNum;
		utils.Log.debug('postdata : ' + postdata);

		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_IMPORT_V11];
		
		var authNum = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		callback(authNum);
	}
	
	/**
	 * @desc : 인증서 내보내기 v11 
	 */
	var exportCertV11 = function(handleInfo, callback){
		var authNum = handleInfo.serviceInfo.getParameter("AUTH_NUM");
		// 가. 대칭키를 위한 대칭키(KEY)와 IV를 생성
		//	     대칭키는 인증번호를 SHA1으로 두번 해쉬한 값 : KEY = SHA1(SHA1(인증번호))
		//	  IV는 인증번호를 SHA1 으로 해쉬한 값 : IV = SHA1(인증번호)
		var iv = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA1, authNum);
		var key = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA1, iv);
		
		key = coreFactory.Factory.Util.createBuffer(key);
		iv = coreFactory.Factory.Util.createBuffer(iv);
		
		key = key.data.slice(0,16);
		iv = iv.data.slice(0,16);
		
		//var certP12 = coreFactory.Factory.PriKey.extractP12PriCert(handleInfo.serviceInfo.getParameter("p12"), handleInfo.serviceInfo.getParameter("PWD"));
		var certP12 = coreFactory.Factory.PriKey.extractP12PriCert(handleInfo.serviceInfo.getParameter("p12"), "NONCE");
		var certPem = certP12.certificate;
		
		// 다. 개인키는 PKCS #8 포맷 DER의 개인키를 base64 Encoding 한다.
		var privateKeyBase64 = coreFactory.Factory.Util.privateKeyPemTagRemove(certP12.privateKey);
		
		// 라. 인증서와 개인키를 대칭키 암호화 한다.(알고리즘 : SEED-CBC)
		// 	  Encrypt(개인키|| 인증서) <= KEY, IV를 이용하여 대칭키 암호화
		// 	     암호화된결과 값을 아래 문서에서는 암호화된 인증서및개인키로 명명한다.
		var certPri = privateKeyBase64.trim() + "||" + certPem.trim();
		var encCertPri = coreFactory.Factory.Cipher.symmetricEncrypt(constants.Cipher.SYMM_SEED_CBC, key, iv, coreFactory.Factory.Util.createBuffer(certPri));
		encCertPri = coreFactory.Factory.Util.encode64(encCertPri.getBytes());
		
		
		var ver = 'SVer=1.1';
		var action = 'Action=EXPORT';
		var size = 'Size=8';
		var authNum = 'AuthNum=' + handleInfo.serviceInfo.getParameter("AUTH_NUM");
		var encCertPri = "EncCert=" + encodeURIComponent(encCertPri);
		var postdata = ver + "&" + action + "&" + encCertPri + "&" + authNum + "&" + size;
		utils.Log.debug('postdata : ' + postdata);
		
		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_EXPORT_V11];
		
		var resultData = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		callback(resultData);
	}
	
	/**
	 * @desc : 인증서 가져오기 v12 
	 */
	var importCertV12 = function(handleInfo, callback){
		var ver = 'SVer=1.2';
		var action = 'Action=IMPORT';
		var authNum = 'AuthNum=' + handleInfo.serviceInfo.getParameter("AUTH_NUM");
		var postdata = ver + "&" + action + "&" + authNum;
		utils.Log.debug('postdata : ' + postdata);
		
		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_IMPORT];
		
		var result = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		result = result.split('$');
		if(result[0] === "OK"){
			callback(result[1]);
		} else {
			INI_HANDLE.infoMessage(result[2]);
		}
	}
	
	/**
	 * @desc : 인증서 내보내기 v12 
	 */
	var exportCertV12 = function(handleInfo, callback){
		
		var ver = 'SVer=1.2';
		var action = 'Action=EXPORT';
		var size = 'Size=8';
		// pwd는 모니터링을 위한 pwd임으로 의미없는 값이다.
		var pwd = "Pwd=" + handleInfo.serviceInfo.getParameter("PWD");
		var p12Cert = "EncCert=" + encodeURIComponent(handleInfo.serviceInfo.getParameter("p12"));
		
		var postdata = ver + "&" + action + "&" + pwd + "&" + p12Cert + "&" + size;
		utils.Log.debug('postdata : ' + postdata);
		
		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_EXPORT];
		
		var result = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		result = result.split('$');
		if(result[0] === "OK"){
			callback(result[1]);
		} else {
			INI_HANDLE.infoMessage(result[2]);
		}
	}
	
	/**
	 * @desc : 인증서 상태 요청
	 */
	var getCertStatus = function(authNum, callback, reset){
		
		var ver = 'SVer=1.2';
		var action = 'Action=GET_STATUS';
		var authNum = 'AuthNum=' + authNum;
//		var size = 'Size=8';
		var postdata = ver + "&" + action + "&" + authNum;
		utils.Log.debug('postdata : ' + postdata);

		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_IMPORT];
		
		var result = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		result = result.split('$');
		if(result[0] === "OK"){
			callback(result);
		} else {
			INI_HANDLE.infoMessage(result[2]);
			reset();
		}
	}
	
	/**
	 * @desc : 인증서 상태 등록 
	 * STATUS_RECEIVE = "RECEIVE";
	 * STATUS_SEND = "SEND";
	 * STATUS_COMPLETE="COMPLETE";
	 * STATUS_CANCEL="CANCEL";
	 */
	var setCertStatus = function(handleInfo){
		
		var ver = 'SVer=1.2';
		var action = 'Action=SET_STATUS';
		var authNum = 'AuthNum=' + handleInfo.serviceInfo.getParameter("AUTH_NUM");
		var certStatus = 'Status=' + handleInfo.serviceInfo.getParameter("CERT_STATUS");
		var postdata = ver + "&" + action + "&" + authNum + "&" + certStatus;
		
		utils.Log.debug('postdata : ' + postdata);
		
		var url = defaultConf.System.UrlAddress[constants.System.URL_CERT_RELAY_IMPORT];
		
		var result = (utils.Transfer.xmlHttpRequest(url, postdata)).trim();
		result = result.split('$');
		if(result[0] === "OK"){
			if(handleInfo.serviceInfo.getCallback()){
				handleInfo.serviceInfo.getCallback()(result);
			}
		} else {
			INI_HANDLE.infoMessage(result[2]);
		}
	}

	return{
		importCertPriV11 : importCertPriV11,
		getImportAuthNum : getImportAuthNum,
		importCertV11 : importCertV11,
		exportCertV11 : exportCertV11,
		importCertV12 : importCertV12,
		exportCertV12 : exportCertV12,
		getCertStatus : getCertStatus,
		setCertStatus : setCertStatus
	}
});
