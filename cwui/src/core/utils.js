/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/

/**
 * @desc : default 설정 정보
 */
define([
  '../main/constants',
  '../main/system',
	'../core/unihan'
], function (constants, system,unihan) {

	var seq = 0;
	
	var newUtilThrow = function(ex, code, parameter){
		if(ex.type !== undefined){
			throw ex;
		}else{
			throw {
				type : constants.System.EXCEPTION_ERROR,
				name : code,
//				message : msgFactory.getMessageFactory().Error[code],	// TO-DO : 순환 참조 개선
				extra : ex.message,
				param : parameter
			}
		}
	};
	
	var Convert = (function() {
		
		var standardDateFormat = function(strDt, isDateReturn){
			strDt = strDt.trim();
			strDt = strDt.replace(/-/g,'');
			strDt = strDt.replace(/\//g, '');
			strDt = strDt.replace(/\:/g,'');
			var isDateTime = (strDt.length >= 14);
			
			var year, month, day, hour, minute, second;
			
			if(strDt.length < 8){
				Log.error('ERR_5014' + '-' + strDt);
				new newUtilThrow(null, 'ERR_5014', strDt);
			}else {
				year = strDt.substring(0,4);
				month = strDt.substring(4,6);
				day = strDt.substring(6,8);
				if(isDateTime){
					hour = strDt.substring(8,10);
					minute = strDt.substring(10,12);
					second = strDt.substring(12,14);
				}
			}
			
			var cvtFormat;
			var browserName = system.Browser.getBrowserName().toLowerCase();
			switch(browserName){
			
				case constants.Browser.NETSCAPE :
				case constants.Browser.EXPLORER :
//					if(isDateTime){
//						cvtFormat = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second;
//					}else{
//						cvtFormat = year + '-' + month + '-' + day;
//					}
//					break;
				default :
					if(isDateTime){
						if(isDateReturn){
							cvtFormat = new Date(year, (month-1), day, hour, minute, second, 0); // 주의 : - 1month
						}else{
							cvtFormat = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;	
						}
					}else{
						if(isDateReturn){
							cvtFormat = new Date(year, (month-1), day);
						}else{
							cvtFormat = year + '-' + month + '-' + day;							
						}
					}
			}
			
			Log.debug('StandardDateFormat : ' + cvtFormat);
			
			return cvtFormat;
		} 
		
		var stringToDate = function(dateTime){
			try{
				//var strDate = new Date((standardDateFormat(dateTime)).replace(/-/g, '/'));
				
				// new Date(year, month, day, hours, minutes, seconds, milliseconds)
				// var d = new Date(2016, 3, 25, 10, 38, 30, 0); // 주의 : - 1month
				// var d = new Date(2016, 3, 25);
				var strDate = standardDateFormat(dateTime, true);
				Log.debug(strDate);
				
				return strDate;
			}catch(e){
				new newUtilThrow(e, 'ERR_5015', dateTime);
			}
		};
		
		return{
			stringToDate : stringToDate,
			standardDateFormat : standardDateFormat
		};
	}());
	/**
	 * @desc : 스트링 유형 유틸
	 */
	var String = (function() {
		
		/**
		 * @desc : Object가 null인지 확인
		 * @return : null유무
		 */
		var isNull = function(obj) {
			
			if(obj === "undefined"){
				return true;
			}else if(obj === undefined){
				return true;
			}else if(obj === null){
				return true;
			}else if(obj === ""){
				return true;
			}else{
				return false;
			}
		};

		/**
		 * @desc : 날자 형식을 스트링으로 변환
		 * @param date : 날자 변수
		 * @return : 날자 스트링
		 */
		var dateToString = function(date) {
			try{
				var year = date.getFullYear();
				var month = ('0' + (date.getMonth()+1)).slice(-2);
				var day = ('0' + date.getDate()).slice(-2);
	
				var hh = ('0' + (date.getHours())).slice(-2);
				var mm = ('0' + (date.getMinutes())).slice(-2);
				var ss = ('0' + (date.getSeconds())).slice(-2);
	
				return Convert.standardDateFormat(year + month + day);
			}catch(e){
				Log.error('ERR_5010', e, date);
				new newUtilThrow(e, 'ERR_5010', date);
			}
		}
		
		var dateTimeToString = function(date) {
			try{
				var year = date.getFullYear();
				var month = ('0' + (date.getMonth()+1)).slice(-2);
				var day = ('0' + date.getDate()).slice(-2);
	
				var hh = ('0' + (date.getHours())).slice(-2);
				var mm = ('0' + (date.getMinutes())).slice(-2);
				var ss = ('0' + (date.getSeconds())).slice(-2);
	
				// 주의 : Explorer에서 String to Date 형식은 yyyy-mm-ddThh:MM:ss 형식이다.(크럼에서 호환 됨)
				return Convert.standardDateFormat(year + month +day + hh + mm +ss);
			}catch(e){
				Log.error('ERR_5011', e, date);
				new newUtilThrow(e, 'ERR_5011', date);
			}
		}
		
		var replaceTrim = function(text){
			if(!isNull(text)){
				text = text.replace(/^\s+|\s+$/gm,'');
				text = text.replace(/\n/g, '');
				text = text.replace(/\r/g, '');
				return text;
			}
		}

		var UTF8toEUCKR = function(utf8str, isurlencode){
			return unihan.convertUtf8ToEucKr(utf8str, isurlencode);
		};

		var EUCKRtoUTF8 = function(euckrstr, isurlencode){
			return unihan.convertEucKrToUtf8(euckrstr, isurlencode);
		};
		
		return{
			isNull : isNull,
			dateToString : dateToString,
			dateTimeToString : dateTimeToString,
			replaceTrim : replaceTrim,
			UTF8toEUCKR: UTF8toEUCKR,
			EUCKRtoUTF8: EUCKRtoUTF8
		};
	}());
	
	
	/**
	 * @desc : 컬렉션 유형 유틸
	 */
	var Collection = (function() {
		
		/**
		 * @desc : Array의 iterator 제공
		 * @parame iter : 1차원 Array
		 */
		var iterator = function(iter){
			try{
				var index = 0;
				var length = iter.length;
				
				return {
					next : function(){
						var element;
						if(!this.hasNext()){
							return null;
						}
						
						element = iter[index];
						index = index + 1;
						
						return element;
					},
					
					hasNext : function(){
						return index < length;
					}
				}
			}catch(e){
				Log.error('ERR_5012', e);
				new newUtilThrow(e, 'ERR_5012', iter);
			}
		};
		
		/**
		 * @desc : Array의 존재하는지 확인
		 * @param obj : 비교 대상 Array
		 * @param chk : 비교 값
		 * @return : true=존재, false=미존재
		 */
		var exist = function(obj, chk){
			var iter = iterator(obj);
			while(iter.hasNext()){
				if(iter.next() == chk){
					return true;
				}
			}
			return false;
		};
		
		/**
		 * @desc : Array를 교집합 merge 한다.
		 * @param defArray : 원본 Array
		 * @param overArray : 대상 Array(우선 순위를 갖는 Array이다.)
		 * @return : merge된 Array
		 */
		var uniMerge = function(defArray, overArray){
			try{
				
				var overArrayKeys = [];
				for(var overArrayKey in overArray) {
					overArrayKeys.push(overArrayKey);
				}
				
				var defArrayKeys = [];
				for(var defArrayKey in defArray) {
					defArrayKeys.push(defArrayKey);
				}
				
				if( overArray===null || overArrayKeys.length===0){
					return defArray;
				}else if( defArray===null || defArrayKeys.length===0){
					return overArray;
				}
				
				var mrg = {};
				for(var key in defArray){
					var overVal = overArray[key];
					if(String.isNull(overVal)){
						mrg[key] = defArray[key];
					}else{
						mrg[key] = overArray[key];
					}
				}
				
				for(var key in overArray){
					var overVal = defArray[key];
					if(String.isNull(overVal)){
						mrg[key] = overArray[key];
					}else{
						mrg[key] = defArray[key];
					}
				}
				return mrg;
			}catch(e){
				Log.error('ERR_5013', e);
				new newUtilThrow(e, 'ERR_5013');
			}
		};
		
		/**
		 * @desc : Array를 merge 한다.
		 * @param defArray : 원본 Array
		 * @param overArray : 대상 Array(우선 순위를 갖는 Array이다.)
		 * @return : merge된 Array
		 */
		var merge = function(defArray, overArray){
			try{
				var mrg = {};
				for(var key in defArray){
					var overVal = overArray[key];
					if(String.isNull(overVal)){
						mrg[key] = defArray[key];
					}else{
						mrg[key] = overArray[key];
					}
				}
				return mrg;
			}catch(e){
				Log.error('ERR_5013', e);
				new newUtilThrow(e, 'ERR_5013');
			}
		};
		
		function arrayIndexOf(item , taget){ 
			var result = -1;
			for (var key in item) {
				if(item[key] === taget){
					result = key;
					break;
				}
			}
			return result; 
		};
		
		return{
			iterator : iterator,
			merge : merge,
			uniMerge : uniMerge,
			exist : exist,
			arrayIndexOf : arrayIndexOf
		};
		
	}());
	
	/**
	 * @desc : Console 로그
	 */
	var Log = (function() {
		
		var console = window.console || {log:function(){}}; 
		
		var logLevel = constants.System.LOG_LEVEL_ERROR;
		var declared = 'com.initech' + ' ' + constants.System.VERSION;
		
		/**
		 * @desc : 로그 레벨을 정의 
		 */
		var setLogLevel = function(level){
			logLevel = level;
		};
		
		/**
		 * @desc : 로그 출력에 선언 문구 
		 */
		var setDeclared = function(text){
			declared = text + ' ' + constants.System.VERSION;
		};
		
		/**
		 * @desc : 데이터 로그 출력
		 * @param levelState : 출력 로그 레벨
		 * @param message : 출력 메시지
		 * @param oneArray : 1차원 Array
		 * @param twoArray : 2차원 Array
		 */
		function printLog(levelState, message, oneArray, twoArray){
			
			var print = message;
			
			if(!String.isNull(oneArray)){
				for(var one in oneArray){
					print = print + "\n-" + one + " : " + oneArray[one];
				}			
			}
			
			if(!String.isNull(twoArray)){
				for(var one in twoArray){
					subArray = twoArray[one];
					
					print = print + "\n-" + one;
					
					for(var two in subArray){
						print = print + "\n--" + two + " : " + subArray[two];	
					}
				}
			}
			
			console.log('[' + declared + '] <' + levelState + '> ' + printLog.caller.caller.name + "() " + print);
		};
		
		/**
		 * @desc : 오류 로그 출력
		 * @param levelState : 출력 로그 레벨
		 * @param message : 에러 메시지
		 * @param  err : 오류
		 */
		function printErrorLog(levelState, message, err){
			var print = message;
			
			if(err){
				if(err.type){
					print = print + '\n';
					print = print + '- code : ' + (err.name ? err.name : '') + '\n';
					print = print + '- message : ' + (err.message ? err.message : '') + '\n';
					print = print + '- extra : ' + (err.extra ? err.extra : '');
				}
			}
			
			console.log('[' + declared + '] <' + levelState + '> ', print);
		}
		
		/**
		 * @desc : debug 레벨 로그 출력
		 * @param message : debug메시지 문구
		 * @param oneArray : 1차원 Array데이터
		 * @param twoArray : 2차원 Array데이터
		 */
		var debug = function(message, oneArray, twoArray){
			if(constants.System.LOG_LEVEL_DEBUG <= logLevel){
				printLog('DEBUG', message, oneArray, twoArray);
			}
		};
		
		/**
		 * @desc : info 레벨 로그 출력
		 */
		var info = function(message, oneArray, twoArray){
			if(constants.System.LOG_LEVEL_INFO <= logLevel){
				printLog('INFO', message, oneArray, twoArray);
			}
		};
		
		/**
		 * @desc : warn 레벨 로그 출력
		 */
		var warn = function(message, err){
			if(constants.System.LOG_LEVEL_WARN <= logLevel){
				if(err!==undefined && err.stack){
					console.log("[WARN]",err.stack);
				}else if(err!==undefined &&err.stacktrace){
					console.log("[WARN]",err.stacktrace);
				}
				printErrorLog('WARN', message, err);
			}
		};
		
		/**
		 * @desc : error 레벨 로그 출력
		 */
		var error = function(message, err){
			if(constants.System.LOG_LEVEL_ERROR <= logLevel){
				if(err){
					if(err.stack){
						console.log("[ERROR]",err.stack);
					}else if(err.stacktrace){
						console.log("[ERROR]",err.stacktrace);
					}
				}
				printErrorLog('ERROR', message, err);
			}
		};
		
		/**
		 * @desc : fatal 레벨 로그 출력
		 */
		var fatal = function(message, err){
			if(constants.System.LOG_LEVEL_FATAL <= logLevel){
				printErrorLog('FATAL', message, err);
			}
		};
		
		return{
			setLogLevel : setLogLevel,
			debug : debug,
			info : info,
			warn : warn,
			error : error,
			fatal : fatal
		};
	}());
	
	/**
	 * @desc : 통신
	 */
	var Transfer = (function() {
		
		var xmlHttpRequest = function (url, postdata){
			try{	
				// Mozilla/Safari
				var xmlhttp=null;
				if (window.XMLHttpRequest) {
					xmlhttp = new window.XMLHttpRequest();
				}else if (window.ActiveXObject) {
					// IE
				   xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				   if(xmlhttp == null) {
					  xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); 
				   }
				}
			
				xmlhttp.open("POST", url, false);
				xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"); 
				xmlhttp.send(postdata);
			
				if(xmlhttp.status == 200){
					return xmlhttp.responseText.trim();
				}else if(xmlhttp.status == 500){
					return new Error("함수 처리 오류 : " + xmlhttp.responseText);
				}else{
					throw xmlhttp.status;
				}
			}catch(e){
				new newUtilThrow(e, 'ERR_1008', url);
			}
		};
		
		var checkJsonpConnection = function (getUrl, getData, callback){
			$.ajax({
				url : getUrl,
				data : getData,
				timeout : 1000,
				cache : false,
				dataType : "jsonp",
				type : "GET",
				// default : jQuery에서 자동으로 Random하게 생성 된다.
				//jsonpCallback : "initechCallBack"+parseInt(Math.random() * 999999 % 999999),
				success : function(res){
					if(callback){
						// response 파싱이 필요
						callback(decodeURIComponent(JSON.stringify(res)));
					}
				},
				tryCount :0
				,retryLimit :1
	     		,error: function(xhr, status, error){
	     			this.tryCount++;
					if(this.tryCount <= this.retryLimit){
						$.ajax(this);
						return;
					}
					console.log(
							"code:"		+xhr.status+"\n"+
							"message:"	+xhr.responseText+"\n"+
							"status:"	+status+"\n"+
							"error:"	+error);
					if(xhr.status === 200){
						if(callback){
							callback(status);
						}
			    	}
					
					return;	
	     		}
			});
		};
		
		function iframePostExcute(sendUrl){
//			var documentObj = this;
//			documentObj.time = new Date().getTime();
//			
//			var neoFormId = "initech_neo_form_id" + documentObj.time;
//			var neoFormTarget = "initech_neo_form_target" + documentObj.time;
//			
//			documentObj.form = $('<form id="' +neoFormId+'" action="'+sendUrl+'" target="'+neoFormTarget+'" method="post" style="display:none;" accept-charset="UTF-8"></form>');
//			documentObj.addParam = function(name, value) {
//				$('<input type="hidden"/>').attr("name", name).attr("value", value).appendTo(documentObj.form);
//			};
//			
//			var iframeId = "initech_neo_iframe_id" + documentObj.time;
//			var iframeName = "initech_neo_iframe_name" + documentObj.time;
//			documentObj.send = function() {
//		        var iframe = $('<iframe id="'+ iframeId +'" name="'+iframeName+'" style="width:1px;height:1px;display:hidden" data-time="'+documentObj.time+'"></iframe>');
//
//				$('body').append(iframe);
//				$('body').append(documentObj.form);
//				documentObj.form.submit();
//				
//				iframe.load(function() { 	
//					$('#initech_neo_form_id' + $(this).data('time')).remove();
//					$('#' + neoFormId).remove();
//					$('#' + iframeId).remove();
//					$(this).remove();			
//				});
//			};
			var documentObj = this;
			documentObj.time = new Date().getTime();
			documentObj.form = $('<form accept-charset="UTF-8" action="'+sendUrl+'" target="initech_iframe'+documentObj.time+'" method="post" style="display:none; id="initech_form'+documentObj.time+'"></form>');    
			documentObj.addParam = function(name,value)  {
				$('<input type="hidden"/>').attr("name",name).attr("value",value).appendTo(documentObj.form);
			};
			
			documentObj.send = function()  {
		        var iframe = $('<iframe style="width:1px;height:1px;display:hidden" data-time="'+documentObj.time+'" id="initech_iframe'+documentObj.time+'" name="initech_iframe'+documentObj.time+'"></iframe>');
				
				$('body').append(iframe);
				$('body').append(documentObj.form);
				documentObj.form.submit();
				
				iframe.load(function() { 	
					$('#initech_form' + $(this).data('time')).remove();
					$(this).remove();			
				});
			};
			
		};
		
		function getCookie(cname) {
		    var name = cname + "=";
		    var ca = document.cookie.split(';');
		    for(var i = 0; i < ca.length; i++) {
		        var c = ca[i];
		        while (c.charAt(0) == ' ') {
		            c = c.substring(1);
		        }
		        if (c.indexOf(name) == 0) {
		            return c.substring(name.length, c.length);
		        }
		    }
		    return;
		}

		function getRequestResult(reqMsg){
			
			delete reqMsg.PARAMS;
			
			var cmd = "GET_RESULT";
			var msg = {};
			msg["PROTOCOLVER"] = constants.System.PROTOCOl;
			msg["PRODUCTID"] = constants.System.VERSION;
			msg["DOMAIN"] = location.host;
			msg["SESSIONID"] = reqMsg["SESSIONID"];
			msg["ENCRYPTED"] = reqMsg["ENCRYPTED"];
			msg["COMMAND"] = cmd;
			msg["TRANS_SEQ"] = reqMsg["TRANS_SEQ"];
			msg["PARAMS"] = reqMsg;
			
			return msg;
		};
		
		var iframeLocalPostSend = function(sendData, callback, port){
			var sendUrl;
			var intervalRequest;
			
			try{
				
				var jsonpLocalGetRequest = function (getUrl, getData, callback){
					
					try {
						$.ajax({
							url : getUrl,
							data : getData,
							timeout : 5000,
							cache : false,
							dataType : "jsonp",
							type : "GET",
							// default : jQuery에서 자동으로 Random하게 생성 된다.
							//jsonpCallback : "initechCallBack"+parseInt(Math.random() * 999999 % 999999),
							success : function(res){
								if(callback){
									if(res.PARAMS.STATE=="SUCCEEDED"){
										// response 파싱이 필요
										callback(decodeURIComponent(JSON.stringify(res)));
										 
										clearInterval(intervalRequest);
									}
								}
							},
							tryCount :0
							,retryLimit :1
				     		,error: function(xhr, status, error){
				     			this.tryCount++;
								if(this.tryCount <= this.retryLimit){
									$.ajax(this);
									return;
								}
								console.log(
										"code:"		+xhr.status+"\n"+
										"message:"	+xhr.responseText+"\n"+
										"status:"	+status+"\n"+
										"error:"	+error);
								INI_HANDLE.infoMessage(request);
								
								return;	
				     		}
						});
					} catch(e){
						console.log("[ERROR]",e);
					}
				};
				
				// port : 15888 / 16888 / 17888
				if(!port){
					var cookie = getCookie("moaport");
					if(cookie){
						port = cookie;
					}else{
						port = "15888";						
					}
				}else{
					if(port > 17888){
						new newUtilThrow(null, 'ERR_50xx', sendUrl);
					}
				}

				sendUrl = "http://localhost:" + port;
				
				try{
					var sender = new iframePostExcute(sendUrl);
					//var sendData = '{    "PROTOCOLVER": "1.0",    "PRODUCTID": "INISAFE Neo Web",    "SESSIONID": "FE891620D3A4A35E80FBBD176B86116",    "ENCRYPTED": "TRUE",    "DOMAIN": "demo.initech.com",    "COMMAND": "GET_VERSION",    "TRANS_SEQ": "1",    "GET_RESULT": "TRUE"}';
					sender.addParam("html5_data", encodeURIComponent(JSON.stringify(sendData)));
					sender.send();
				}catch(e){
					console.log("[ERROR]",e);
					iframeLocalPostSend(sendData, callback, (port + 1000));
				}
				
				// GET Message
				var resultMsg = getRequestResult(sendData);
				intervalRequest = setInterval(
					function() {
						var message = "html5_data=" + encodeURIComponent(JSON.stringify(resultMsg));
						jsonpLocalGetRequest(sendUrl, message, callback);
					}, 
					50
				);
				
			} catch (e) {
				new newUtilThrow(e, 'ERR_50xx', sendUrl);
			} finally {
				setTimeout(
					function(){
						if(intervalRequest){
							clearInterval(intervalRequest);
						}
					},
					10000
				);
			}
		};
		

		
		return {
			xmlHttpRequest : xmlHttpRequest,
			checkJsonpConnection : checkJsonpConnection,
			iframeLocalPostSend : iframeLocalPostSend
		};
    }());

	
	return{
		String : String,
		Convert : Convert,
		Collection : Collection,
		Log : Log,
		Transfer : Transfer
	};

});
