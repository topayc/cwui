/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2017-07-28] : 최초 구현 
*************************************************************************************/
/**
 * @desc : touchenKey Implement
 */
define([
        '../../main/constants',
        '../../conf/defaultConf',
        '../../core/middleChannel',
        '../../core/coreFactory'
        ], function (constants, defaultConf, middleChannel, coreFactory) {
	
	var E2E_KeyPair;
	
	var setE2E_KeyPair = function(keyPair){
		E2E_KeyPair = keyPair;
	};
	
	var getE2E_KeyPair = function(){
		return E2E_KeyPair;
	};
	
	var E2E_PublicKey;
	
	var setE2EPublicKey = function(cert){
		E2E_PublicKey = cert;
	};
	
	var getE2EPublicKey = function(){
		return E2E_PublicKey;
	};
	
	var getAction = function(handleInfo){
		return true;
//    var result = true;  
//
//    switch (handleInfo.serviceInfo.getAction()) {
//	    case constants.WebForm.ACTION_CERT_EXPORT_FILE:
//	    case constants.WebForm.ACTION_CERT_SAVE:
//	    case constants.WebForm.ACTION_CHANGE_PWD:
//	        if(constants.Certs.STORAGE_BROWSER !== handleInfo.serviceInfo.getDeviceId()){
//	            result = false;
//	        }
//	        break;
//	    case constants.WebForm.ACTION_CERT_REMOVE:
//	    case constants.WebForm.ACTION_CERT_ISSUE:
//	    case constants.WebForm.ACTION_CERT_REISSUE:
//	    case constants.WebForm.ACTION_CERT_REVOKE:
//	    case constants.WebForm.ACTION_CERT_UPDATE:
//	    case constants.WebForm.ACTION_CERT_CMP:
//	    case constants.WebForm.ACTION_CERT_COPY:
//	    case constants.WebForm.ACTION_CERT_IMPORT:
//	    case constants.WebForm.ACTION_CERT_EXPORT:
//	    	result = true;
//	    	break;    
//	    case constants.WebForm.ACTION_MANAGE:
//	        if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_COPY
//	                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE
//	                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_REMOVE
//	                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CHANGE_PWD
//	                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_EXPORT_FILE )
//	        {	            	
//	        	result = true;	        
//	        } else {
//	            result = false;
//	        }
//	        break;
//	    case constants.WebForm.ACTION_LOGIN:
//	        if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE 
//	                || constants.Certs.STORAGE_BROWSER === handleInfo.serviceInfo.getDeviceId()){
//	            result = true;
//	        } else if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_CMP){
//	            result = true;
//	        } else if(handleInfo.serviceInfo.getParameter("KEYUSE") === "PIN"){
//	        	result = true;
//	        }
//	        else {
//	            result = false;
//	        }
//	        break;
//	    case constants.WebForm.ACTION_SIGN:
//	        if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE 
//	                || constants.Certs.STORAGE_BROWSER === handleInfo.serviceInfo.getDeviceId()){
//	            result = true;
//	        } else {
//	            result = false;
//	        }
//	        break;
//	    }
//	    return result;
	}
	
	/* 키입력 보안 모듈 초기화 */
	var initialize = function(handleInfo){
		/* 중요 : E2E 대상에 대해서는 비밀번호를 암호화 함*/
		if(getAction(handleInfo)){
			handleInfo.serviceInfo.setParameter("ENCRYPTED", "FALSE");
			if(!getE2E_KeyPair()){
				// 스크립트내에서 키쌍을 생성한다.
				setE2E_KeyPair(coreFactory.Factory.KeyPair.genernaeKeyPair());
			}
		} else {
			// E2E 암호화 공개키를 요청한적이 없다면 요청한다.
			handleInfo.serviceInfo.setParameter("ENCRYPTED", "TRUE");
			if(!getE2EPublicKey()){
				// E2E 암호화 공개키를 가져온다.
				var e2eHandleInfo = require("../../common/handleManager").newHandleInfo();
				e2eHandleInfo.serviceInfo.setCallback(setE2EPublicKey);
				//20160528
				middleChannel.Configure.getE2EPublicKey(e2eHandleInfo);
			}
		}

    var arrTarget = defaultConf.Front.inputLayout.targetContainer;
    var inp;
    
    for (var key in arrTarget) {
      inp = $(arrTarget[key]).find("input[type='password']");

      if(!inp.attr("data-enc")){
        inp.attr("data-enc", "on");
      }
      
      TK_EnqueueList(inp.attr("id"));
    }
	}
	
	/* 키입력 보안 모듈 실행/보여주기 */
	var run = function(handleInfo){		
		var keypadFrmName = handleInfo.serviceInfo.getParameter("KeypadFrmName");
		var pwdId = handleInfo.serviceInfo.getParameter("pwdId");
		
		if(getAction(handleInfo)){
			Html5Adaptor.getE2EProviderFunction()(keypadFrmName, pwdId, E2E_KeyPair.PUBLIC_KEY, handleInfo.serviceInfo.getParameter("previousSubmit"));
		} else {
			Html5Adaptor.getE2EProviderFunction()(keypadFrmName, pwdId, E2E_PublicKey, handleInfo.serviceInfo.getParameter("previousSubmit"));
		}
	}
	
	/* 키입력 보안 모듈 클리어 */
	var clear = function(handleInfo){
    document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")).value = "";
		TK_Clear(handleInfo.serviceInfo.getParameter("pwdId"));
		//TK_Clear(handleInfo.serviceInfo.getParameter("KeypadFrmName"));
	}
	
	/* 키입력 보안 모듈 후처리 */
	var afterProc = function(handleInfo){
	}
	
	var click = function(handleInfo){
		clear(handleInfo);
	}
	
	var close = function(handleInfo){
	}

  var keypadWork = {};
  
	var getKeyPadValue = function(handleInfo, nonceType) {
	  return new RSVP.Promise(function(resolve, reject) {
      keypadWork.callback = function keyPadCallback(value) {
        resolve(value);
      };
      keypadWork.nonceType = nonceType;
  		
  		var pwdId = handleInfo.serviceInfo.getParameter("pwdId");
  		if(getAction(handleInfo)){
  			// 공개키 복호화되어 비번이 노출 된다.
  			var publicKeyPem = coreFactory.Factory.PriKey.publicKeyToRSAPublicKeyPem(E2E_KeyPair.PUBLIC_KEY);
  			TK_GetEncInitech(pwdId, publicKeyPem, getPassword);
  		} else {
  		  TK_GetEncInitech(pwdId, E2E_PublicKey, keypadWork.callback);
  		}
	  });
	}

	var getPassword = function(encResultData){
		try{
			encResultData = coreFactory.Factory.Util.decode64(encResultData);
			var encData;
			var encPwd;
			if(encResultData && (encResultData.length > 256)){
				encData = encResultData.slice(0, 256);
				encPwd = coreFactory.Factory.Util.createBuffer(encResultData.slice(256, encResultData.length));
			} else {
				encData = encResultData.slice(0, 128);
				encPwd = coreFactory.Factory.Util.createBuffer(encResultData.slice(128, encResultData.length));
			}
			var decData = E2E_KeyPair.PRIVATE_KEY.decrypt(encData, "RSA-OAEP");
			var skey = coreFactory.Factory.Util.createBuffer(decData.slice(0, 16));
			var iv = coreFactory.Factory.Util.createBuffer(decData.slice(16, decData.length));
			// TO-DO : 한곳에서 관리 필요
			var pwd = coreFactory.Factory.Cipher.symmetricDecrypt(constants.Cipher.SYMM_SEED_CBC, skey, iv, encPwd).getBytes();
			pwd = pwd.slice(0, pwd.length-1);
			
			//TODO 뒤에 한자리 더미값이 붙어 제거.
			var dummy = GINI_ProtectMgr.keep(keypadWork.nonceType, pwd);

			keypadWork.callback(pwd);
		} catch (e){
			//console.log("[ERROR]",e);
			
      keypadWork.callback("");
		}
	}
	
	function getKeyPadType(){
		return "KEYBOARD";
	}
	return {
		initialize : initialize,
		run : run,
		clear : clear,
		afterProc : afterProc,
		click : click,
		close : close,
		getKeyPadValue : getKeyPadValue,
		getKeyPadType : getKeyPadType
	}
});