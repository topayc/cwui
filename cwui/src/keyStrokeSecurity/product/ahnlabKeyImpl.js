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
	/* 키입력 보안 모듈 초기화 */
	var initialize = function(handleInfo) {
	  var arrTarget = defaultConf.Front.inputLayout.targetContainer;
	  
	  for (var key in arrTarget) {
	    $(arrTarget[key]).find("input[type='password']").attr("e2e_type", defaultConf.KeyStrokeSecurity.AhnlabE2EType);
	  }
	  
	  $ASTX2.init(
	      function onSuccess() {
	        // installed
	        $ASTX2.initNonE2E();
	      },
	      function onFailure() {
	        var errno = $ASTX2.getLastError();

	        if(errno == $ASTX2_CONST.ERROR_NOTINST){
	          // not installed (goto install page)
	        }else{
	          // error handling
	        }
	      }
    );
	}
	
	/* 키입력 보안 모듈 실행/보여주기 */
	var run = function(handleInfo){
	  handleInfo.serviceInfo.getParameter("previousSubmit")(document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")).value);
	  
		console.log("ahnlab run");
	}
	
	/* 키입력 보안 모듈 클리어 */
	var clear = function(handleInfo){
	  $ASTX2.clearE2EText(document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")));
	  
	  document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")).value = "";
	}
	
	/* 키입력 보안 모듈 후처리 */
	var afterProc = function(handleInfo){
	}
	
	var click = function(handleInfo){
	  clear(handleInfo);
	}
	
	var close = function(handleInfo){
	}
	
	var getKeyPadValue = function(handleInfo, nonceType){
	  return new RSVP.Promise(function(resolve, reject) {
	    $ASTX2.getE2EText(document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")), function onReceive(value, errno) {
	      GINI_ProtectMgr.keep(nonceType, value);
	      
	      resolve(value);
	    });
	    
	    document.getElementById(handleInfo.serviceInfo.getParameter("pwdId")).value = "";
	  });
	}
	
	var keypadWork = {};
	
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