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
	
	var virtualCloseCallback = "";
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
	    var result = true;  

	    switch (handleInfo.serviceInfo.getAction()) {
		    case constants.WebForm.ACTION_CERT_EXPORT_FILE:
		    case constants.WebForm.ACTION_CERT_SAVE:
		    case constants.WebForm.ACTION_CHANGE_PWD:
		        if(constants.Certs.STORAGE_BROWSER !== handleInfo.serviceInfo.getDeviceId()){
		            result = false;
		        }
		        break;
		    case constants.WebForm.ACTION_CERT_REMOVE:
		    case constants.WebForm.ACTION_CERT_ISSUE:
		    case constants.WebForm.ACTION_CERT_REISSUE:
		    case constants.WebForm.ACTION_CERT_REVOKE:
		    case constants.WebForm.ACTION_CERT_UPDATE:
		    case constants.WebForm.ACTION_CERT_CMP:
		    case constants.WebForm.ACTION_CERT_COPY:
		    case constants.WebForm.ACTION_CERT_IMPORT:
		    case constants.WebForm.ACTION_CERT_EXPORT:
		        break;
		    case constants.WebForm.ACTION_MANAGE:
		        if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_COPY
		                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE
		                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_REMOVE
		                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_MANAGE){
		            result = true;
		        } else if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CHANGE_PWD
		                ||handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_EXPORT_FILE){
		            if(constants.Certs.STORAGE_BROWSER !== handleInfo.serviceInfo.getDeviceId()){
		                //result = false;
		            	result = true;
		            }
		        } else {
		            result = false;
		        }
		        break;
		    case constants.WebForm.ACTION_LOGIN:
//		        if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE 
//		                || constants.Certs.STORAGE_BROWSER === handleInfo.serviceInfo.getDeviceId()){
//		            result = true;
//		        } else if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_CMP){
//		            result = true;
//		        } else {
//		            result = false;
//		        }
		    	result = true;
		        break;
		    case constants.WebForm.ACTION_SIGN:
//		        if(handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_SAVE 
//		                || constants.Certs.STORAGE_BROWSER === handleInfo.serviceInfo.getDeviceId()){
//		            result = true;
//		        } else {
//		            result = false;
//		        }
		    	result = true;
		        break;
		    }
		    return result;
		}
	
	/* 키입력 보안 모듈 초기화 */
	var initialize = function(handleInfo){
		virtualCloseCallback = handleInfo.serviceInfo.getParameter("virtualCloseCallback");
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

      if(!inp.attr("data-tk-isCrt")){
        inp.attr("data-tk-isCrt", "true");
      }
      if(!inp.attr("data-tk-kbdType")){
        inp.attr("data-tk-kbdType", "qwerty");
      }
      if(!inp.attr("data-tk-keyboard")){
        inp.attr("data-tk-keyboard", "qwerty");
      }
      
      inp.removeAttr("disabled");
      
      inp.next(".keyboard").attr("id", inp.attr("id") + "_tk_btn");
      
      transkey[inp.attr("id")] = null;
      inp.val("");
      $("#transkey_" + inp.attr("id")).val("");
    }
    
		initTranskey(function(){});
	}
	
	/* 키입력 보안 모듈 실행/보여주기 */
	var run = function(handleInfo){
		handleInfo.serviceInfo.getParameter("previousSubmit")(document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")).value);
		console.log("raon run");
	}
	
	/* 키입력 보안 모듈 클리어 */
	var clear = function(handleInfo){
	}
	
	/* 키입력 보안 모듈 후처리 */
	var afterProc = function(handleInfo){
	}
	var setEnterCallback = function(callback){
		tk.enterCallback(callback);
	}
	var click = function(handleInfo){		
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
		// var el = $("#" + handleInfo.serviceInfo.getParameter("pwdId")).next()[0];
		// tk.buttonListener2(el);
		
		// 광주은행 수정본
		var el = $("#" + handleInfo.serviceInfo.getParameter("pwdId"))[0];
		tk.onKeyboard(el);
	}
	
	var close = function(handleInfo){
		if(virtualCloseCallback){
			virtualCloseCallback();
		}
	}
	
	var getKeyPadValue = function(handleInfo, nonceType) {
    return new RSVP.Promise(function(resolve, reject) {
  		var pwdId = handleInfo.serviceInfo.getParameter("pwdId");
  		// 공개키 복호화되어 비번이 노출 된다.
  		var publicKeyPem = coreFactory.Factory.PriKey.publicKeyToRSAPublicKeyPem(E2E_KeyPair.PUBLIC_KEY);
  		var rsaPulibcKey = coreFactory.Factory.Util.rsaPublicKeyPemTagRemove(publicKeyPem);
  		tk.crtPublicKey = ((rsaPulibcKey).replace(/\n/gi, "")).replace(/\r/gi, "");
  		var v = transkey[handleInfo.serviceInfo.getParameter("pwdId")].getCipherData(new GenKey().tk_getrnd_int(), 'initech');
  		
  		resolve(getPassword(v));
    });
	}
	
	var keypadWork = {};
	function setKeypadCallback(callback, nonceType){
		keypadWork.callback = callback;
		keypadWork.nonceType = nonceType;
	}
	
	var getPassword = function(encResultData) {
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
			var pwd = coreFactory.Factory.Cipher.symmetricDecrypt(constants.Cipher.SYMM_SEED_CBC, skey, iv, encPwd);
			pwd = pwd.getBytes();
			
			//TODO 뒤에 한자리 더미값이 붙어 제거.
			var dummy = GINI_ProtectMgr.keep(keypadWork.nonceType, (pwd.slice(0, pwd.length-1)));

			return pwd;
		} catch (e){
			console.log("[ERROR]",e);
		}
	}

	function getKeyPadType(){
		return "KEYPAD";
	}
	return {
		initialize : initialize,
		run : run,
		clear : clear,
		afterProc : afterProc,
		setEnterCallback : setEnterCallback,
		click : click,
		close : close,
		getKeyPadValue : getKeyPadValue,
		getKeyPadType:getKeyPadType
	}
});