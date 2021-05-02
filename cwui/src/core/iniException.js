/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
define([
		'../main/constants',
		'../conf/msgFactory',
		'../core/utils'
        ], function (constants, msgFactory, utils) {
	
	var Error = (function() {
		
		var newThrow = function(ex, code, parameter, replaceChar){
			
			if(ex !==null && ex.type !== undefined){
				throw ex;
			}else{
				if(ex !==null){
					utils.Log.error(code, ex);
				}
				throw {
					type : constants.System.EXCEPTION_ERROR,
					name : code,
					message : msgFactory.getMessageFactory().Error[code].replace(constants.System.REPLACE_CHAR ,replaceChar),
					extra : (ex===null ? '' : ex.message),
					param : parameter
				}
			}
		};
		
		return{
			newThrow : newThrow
		};
	}());
	
	var Warn = (function() {
		
		var newThrow = function(ex, code, parameter, replaceChar){
			if(ex !==null && ex.type !== undefined){
				throw ex;
			}else{
				if(ex !==null){
					utils.Log.warn(code, ex);
				}
				var msg = msgFactory.getMessageFactory().Warn[code];
				if(msgFactory.getMessageFactory().Warn[code]){
					msg = msgFactory.getMessageFactory().Warn[code].replace(constants.System.REPLACE_CHAR ,replaceChar);
				} else {
					msg = msgFactory.getMessageFactory().Warn['WARN_1000'];
				}
				throw {
					type : constants.System.EXCEPTION_WARN,
					name : code,
					message : msg,
					extra : (ex===null ? '' : ex.message),
					param : parameter
				}
			}
		};
		
		return{
			newThrow : newThrow
		};	
	}());
	
	var Info = (function() {
		
		var newThrow = function(ex, code, parameter, replaceChar){
			if(ex !==null && ex.type !== undefined){
				throw ex;
			}else{
				throw {
					type : constants.System.EXCEPTION_INFO,
					name : code,
					message : msgFactory.getMessageFactory().Info[code].replace(constants.System.REPLACE_CHAR ,replaceChar),
					param : parameter
				}
			}	
		};
		
		return{
			newThrow : newThrow
		};
	}());
	
	return{
		Error : Error,
		Warn : Warn,
		Info : Info
	}
});