/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2016-05-12] : 최초 구현 
*************************************************************************************/
/**
 * @desc : ErrorFactory
 */
define([
        '../main/constants',
        '../main/system',
        '../conf/defaultConf',
        '../conf/msgFactory',
        '../conf/errorCodeFactory'
        ], function (constants, system, defaultConf, msgFactory, errorCodeFactory) {
	
	var proc = function(responseData, handleInfo){
		//GINI_LoadingIndicatorStop()
		if(responseData){
			// step1. URL decoding
			responseData = decodeURIComponent(responseData);
			// step2. "+" 값이 있을 경우 JSON.parse 오류가 발생 한다.
			responseData = responseData.replace(/\+/g, " ");
			// step3. JSON 객체로 변환
			responseData = JSON.parse(responseData);
			if(responseData.EXTERNAL && responseData.EXTERNAL === "NOT_SUPPORT"){
				//GINI_LoadingIndicatorStop();
				INI_HANDLE.infoMessage('This service is not supported.');
			}else if(responseData.EXTERNAL && responseData.EXTERNAL === "NOT_INSTALL"){
				// 설치가 되지 않을 경우 Browser 선택되도록 처리
				if(responseData.COMMAND === "GET_VERSION"){
					GINI_StandbyCallBack.getCallback(responseData.TRANS_SEQ)(responseData, true);
				}
				
				// CrosWebEX 설치 페이지 호출
				GINI_3rd_Party_Control.extensionPKI.showInstallPage();
			} else {
				var resultCode = decodeURIComponent(responseData.PARAMS.STATE);
				
				if(responseData.COMMAND === "GET_PC_INFO"){
					GINI_StandbyCallBack.getCallback(responseData.TRANS_SEQ)(responseData);
				} else {
					if(resultCode === "SUCCEEDED"){
						if(responseData.COMMAND === "EXPORT_FILE_CERT"){
							//INI_HANDLE.infoMessage(msgFactory.getMessageFactory().Info.INFO_1003 );	//인증서 내보내기를 완료 하였습니다.
							var finalCallback = GINI_StandbyCallBack.getCallback(responseData.TRANS_SEQ);
							if(finalCallback){
								finalCallback(responseData);								
							}
						}else{
							// transaction ID에 해당하는 콜백을 수행 한다.
							GINI_StandbyCallBack.getCallback(responseData.TRANS_SEQ)(responseData);							
						}
					} else {
						//TO-DO : 오류코드 분기처리 필요.
						procException(responseData);
					}
				}
			}
		}
		
		//GINI_LoadingIndicatorStop();
	}
	
	function procException(param){
		switch (param.PARAMS.CODE){
			case "0507" :
			case "0508" :
				// 인증서 리스트 없음.(간편찾기 직접찾기 창으로 띄워줌)
				GINI_StandbyCallBack.getCallback(param.TRANS_SEQ)(param);
				break;
			case "1912" :
				break;
			default : 
				errorCodeFactory.proc(param);
				if(GINI_StandbyCallBack.getExceptionCallback(param.TRANS_SEQ)){
//					console.log("[GINI_StandbyCallBack]",GINI_StandbyCallBack.getExceptionCallback(param.TRANS_SEQ));
					GINI_StandbyCallBack.getExceptionCallback(param.TRANS_SEQ)(param);
				}
		}
	}
	
	return {
		proc : proc
	}
});