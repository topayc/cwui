/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * @desc : Message Factory
 */
define([
        '../conf/message/messageEng',
        '../conf/message/messageKor',
        '../conf/defaultConf',
        '../main/constants'
        ], function (messageEng, messageKor, defaultConf, constants) {
	
	var Factory;
	
	function getMessageFactory(){
		if(constants.System.LANGUAGE_ENG === defaultConf.System.Language){
			return messageEng;
		}else{
			return messageKor;
		}
	};
	
	return{
		getMessageFactory : getMessageFactory
	}
});
