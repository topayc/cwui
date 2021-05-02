/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2016-07-25] : 최초 구현 
*************************************************************************************/
/**
 * @desc : inikeyStrokeSecurity Factory
 */
define([
        '../main/constants',
        '../conf/defaultConf',
        '../keyStrokeSecurity/product/touchenKeyImpl',
        '../keyStrokeSecurity/product/ahnlabKeyImpl',
        '../keyStrokeSecurity/product/unikeyWebImpl',
        '../keyStrokeSecurity/product/transkeyImpl'
        ], function (constants, defaultConf, touchenKeyImpl, ahnlabKeyImpl, unikeyWebImpl,transkeyImpl) {
	
	var isLoad = false;	
	var keyStrokeList = {};
	var iniKeyStrokeObj;
	
	function getKeyStrokeObjImipleMapping(keypadName){
		switch (keypadName){
      case constants.KeyStrokeSecurity.KEYPAD_NAME.TOUCHEN_KEY:
        return touchenKeyImpl;
			case constants.KeyStrokeSecurity.KEYPAD_NAME.AHNLAB_KEY:
				return ahnlabKeyImpl;
			case constants.KeyStrokeSecurity.KEYPAD_NAME.UNIWEB_KEY:
				return unikeyWebImpl;
			case constants.KeyStrokeSecurity.KEYPAD_NAME.TRANS_KEY:
				return transkeyImpl;
			default : 
				return undefined;
		}
	};
	
	var loadKeysokeModlueList = function (){
		if(!isLoad){
			var list = defaultConf.KeyStrokeSecurity.KeyStrokeSecurityList;			
			if(list){
				for(var i =0; list.length > i; i++){
					if(list[i].USE === "Y" && list[i].TYPE === "KEYBOARD"){
						keyStrokeList["KEYBOARD"] = getKeyStrokeObjImipleMapping(list[i].KEYPAD_NAME);
						//console.log("LOAD KEYBOARD : ", keyStrokeList["KEYBOARD"] );
					}
					else if(list[i].USE === "Y" && list[i].TYPE === "KEYPAD"){
						keyStrokeList["KEYPAD"] = getKeyStrokeObjImipleMapping(list[i].KEYPAD_NAME);
						//console.log("LOAD KEYPAD : ", keyStrokeList["KEYPAD"] );
					}
				}
			}
			isLoad = true;
		}
	}
	
	
	/* 키입력 보안 모듈 초기화 */
	var initialize = function(handleInfo){	
		loadKeysokeModlueList();
		if(keyStrokeList["KEYBOARD"]){
			keyStrokeList["KEYBOARD"].initialize(handleInfo);
			//console.log("KEYBOARD INITIALZED")
		}
		
		if(keyStrokeList["KEYPAD"]){
			keyStrokeList["KEYPAD"].initialize(handleInfo);
			//console.log("KEYPAD INITIALZED")
		}		
	}
	
	var getKeyStroke = function(keyType){
		var obj = keyStrokeList[keyType];
		if(obj == undefined){
			var defaultKeyPad = defaultConf.KeyStrokeSecurity.DefaultKeyStrokeSecurity;
			obj = getKeyStrokeObjImipleMapping(defaultKeyPad);
		}
		
		return obj;
	}
	
	/* input box 클릭이벤트처리 */
	var click = function(handleInfo,keyType){
		var obj = getKeyStroke(keyType); 
		if(obj){
		  obj.target = document.getElementById(handleInfo.serviceInfo.getParameter("pwdId"));
			obj.click(handleInfo); 
			iniKeyStrokeObj = obj;
			
			return true;
		} else {
		  return false;
		}
	}
	
	/* 키입력 보안 모듈 실행/보여주기 */
	var run = function(handleInfo){
		if(iniKeyStrokeObj){
			iniKeyStrokeObj.run(handleInfo);
		} else {
			handleInfo.serviceInfo.getParameter("previousSubmit")(handleInfo.serviceInfo.getParameter("PWD"));
		}
	}
	
	/* 키입력 보안 모듈 클리어 */
	var clear = function(handleInfo){
		if(iniKeyStrokeObj){
			iniKeyStrokeObj.clear(handleInfo);
		} else {
			
		}
	}
	
	/* 키입력 보안 모듈 후처리 */
	var afterProc = function(handleInfo){
		if(iniKeyStrokeObj){
			iniKeyStrokeObj.afterProc(handleInfo);
		} else {
			
		}
	}
	
	var close = function(handleInfo){
		for(var i =0; keyStrokeList.length > i; i++){
			keyStrokeList[i].close(handleInfo);
		}		
	}

	var getKeyPadValue = function(handleInfo, nonceType){
	  if (iniKeyStrokeObj) {
	    return iniKeyStrokeObj.getKeyPadValue(handleInfo, nonceType);
	  } else {
	    return RSVP.Promise.resolve(undefined);
	  }
	}
	var setEnterCallback = function(callback){
		if(iniKeyStrokeObj != undefined && iniKeyStrokeObj.getKeyPadType() == "KEYPAD") {
	    iniKeyStrokeObj.setEnterCallback(callback);
		}
	}
	return {
		initialize : initialize,
		run : run,
		clear : clear,
		afterProc : afterProc,
		click : click,
		close : close,
		setEnterCallback:setEnterCallback,
		getKeyPadValue : getKeyPadValue
	}
});