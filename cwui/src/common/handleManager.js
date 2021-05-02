/**
 * @desc : 사용자의 서비스 단위 핸들 정보를 관리 한다.
 */
define([
  '../core/forgeCrypto/forge'
], function(forge) {
	/* 핸들 저장 객체 */
	var _handleMap = {};
	
	/**
	 * @desc : 핸들 정보
	 */
	function HandleInfo(transactionId){
		/* 트랜젝션 ID*/
		var _transactionId = transactionId;
		/* 요청 정보 */
		var _requestInfo;
		/* 서비스 정보 */
		var _serviceInfo;
		/* 서비스에서 사용되는 옵션 정보*/
		var _optionInfo;
		/* 응답 결과 정보 */
		var _responseInfo;
		/* 상태 정보 */
		var _stateInfo;
		
		(function(){
			/**
			 * @desc : 공통 파라메터 관리 객체
			 */
			function Operation(){
				this._param = {};
			};
			
			/**
			 * @desc : 파마메터 메모리 초기화
			 */
			Operation.prototype.initialize = function(){
				for(key in this._param){
					this._param[key] = undefined;
				}
			};
			/**
			 * @desc : 파마메터 객체 초기화
			 */
			Operation.prototype.clear = function(){
				this._param = {};
			};
			/**
			 * @desc : 파라메터 저장
			 * @param key : 파라메터 저장 키
			 * @param value : 파라메터 값
			 */
			Operation.prototype.setParameter = function(key, value){
				this._param[key] = value;
			};
			/**
			 * @desc : 파라메터 값 제공
			 * @param key : 파라메터 조회 키
			 * @returns : 파라메터 값
			 */
			Operation.prototype.getParameter = function(key){
				if(key){
					//return (this._param[key] ? this._param[key] : "");
					// undefined 전달 하도록 함
					return this._param[key];
				}else{
					return this._param;
				}
			};
			
			/*요청 정보 객체 생성 */
			_requestInfo = new Operation();
			/**
			 * @desc ; 요청 정보 메모리 초기화
			 */
			_requestInfo.init = function(){
				_requestInfo.initialize();
				this._callback = undefined;
				this._subCallback = undefined;
				this._isSub = false;
			};
			/**
			 * @desc : 요청 정보 객체 초기화
			 */
			_requestInfo.cls = function(){
				_requestInfo.clear();
				this._callback = undefined;
				this._subCallback = undefined;
				this._isSub = false;
			};
			/**
			 * @desc : 요청 정보에 수행 되어야 하는 콜백 보관 
			 */
			_requestInfo.setCallback = function(callback){
				this._callback = callback;
			};
			_requestInfo.setSubCallback = function(callback){
				this._subCallback = callback;
			};
			/**
			 * @desc : 요청 정보 콜백 제공
			 */
			_requestInfo.getCallback = function(){
				return this._callback;
			};
			_requestInfo.getSubCallback = function(){
				return this._subCallback;
			};
			
			/**
			 * @desc : callback 수행 우선순위 정의
			 */
			_requestInfo.setSelectedSubCallback = function(){
				this._isSub = true;
			};
			_requestInfo.getSelectedSubCallback = function(){
				return this._isSub;
			};
			
			
			/* 서비스 정보 객체 생성  */
			_serviceInfo = new Operation();
			/**
			 * @desc : 서비스 정보 메모리 초기화
			 */
			_serviceInfo.init = function(){
				_serviceInfo.initialize();
				this._callback = null;
				this._exceptionCallback = null;
				//this._relayCallback = null;
				this._deviceId = null;
				this._eventDeviceId = null;
				this._deviceSub = null;
			};
			/**
			 * @desc : 서비스 정보 객체 초기화
			 */
			_serviceInfo.clear = function(dataClear){
				if(dataClear){
					_serviceInfo.clear();					
				}

				this._callback = undefined;
				this._exceptionCallback = undefined;
				//this._relayCallback = undefined;
				this._deviceId = undefined;
				this._eventDeviceId = undefined;
				this._deviceSub = undefined;
			};
			/**
			 * @desc : 서비스 페이지 Action 보관
			 */
			_serviceInfo.setAction = function(action){
				this._action = action;
			};
			/**
			 * @desc : 서비스 페이지 Action 제공
			 */
			_serviceInfo.getAction = function(){
				return this._action;
			};
			/**
			 * @desc : 서비스 행위의 상태 보관 (ex> 인증서 갱신을 위한 로그인 : Action(로그인) Behavior(발급)
			 */
			_serviceInfo.setBehavior = function(behavior){
				this._behavior = behavior;
			};
			/**
			 * @desc : 서비스 행위 상태 제공
			 */
			_serviceInfo.getBehavior = function(){
				return this._behavior;
			};
			/**
			 * @desc : 선택된 저장 매체 정보 보관
			 */
			_serviceInfo.setEventDeviceId = function(deviceId){
				switch(deviceId){
				// deviceSub를 선택해야 하는 매체는 하위 매체를 선택해야만 한다.
				case  "LOCAL_DISK":
				case  "REMOVABLE_DISK":
				case  "CLOUD":
				case  "BAROSIGN":
				case  "SECURITY_DEVICE":
				case  "HSM":
				case  "SECURITY_TOKEN":
				case  "MOBILE":
				case  "SMART_CARD":
				case  "SMART_CERTIFY":
					break;
				default:
					this._deviceId = deviceId;
				};
				
				this._eventDeviceId = deviceId;
			};
			/**
			 * @desc : 임시로 선택된 저장 매체 정보 제공
			 */
			_serviceInfo.getEventDeviceId = function(){
				return this._eventDeviceId;
			};
			
			/**
			 * @desc : 선택된 저장 매체 정보 제공
			 */
			_serviceInfo.setDeviceId = function(deviceId){
					this._deviceId = deviceId;
			};
			
			_serviceInfo.getDeviceId = function(){
				return (this._deviceId ? this._deviceId : "");
			};
			
			
			/**
			 * @desc : 선택된 저장 매체 하위 정보 보관
			 */
			_serviceInfo.setDeviceSub = function(deviceSub){
				this._deviceSub = deviceSub;
				// 하위 매체 선택 시 _eventDeviceId 값을 _deviceId에 할당 한다.
				this._deviceId = this._eventDeviceId;
			};
			_serviceInfo.getDeviceSub = function(){
				return (this._deviceSub ? this._deviceSub : "");
			};
			/**
			 * @desc : html5 서비스에서 발생하는 콜백 보관 
			 */
			_serviceInfo.setCallback = function(callback){
				this._callback = callback;
			};
			/**
			 * @desc : html5 서비스에 사용하는 콜백 제공
			 */
			_serviceInfo.getCallback = function(){
				return this._callback;
			};
			
			/**
			 * @desc : html5 서비스에서 오류 발생시 후처리 함수 보관 
			 */
			_serviceInfo.setExceptionCallback  = function(_exceptionCallback){
				this._exceptionCallback = _exceptionCallback;
			};
			/**
			 * @desc : html5 서비스에서 오류 발생시 후처리 함수 제공
			 */
			_serviceInfo.getExceptionCallback = function(){
				return this._exceptionCallback;
			};
			
			/*	사용 안함 ( tranID 값으로 콜백 저장 할 수 있음)
			_serviceInfo.setRelayCallback = function(callback){
				this._relayCallback = callback;
			};
			_serviceInfo.getRelayCallback = function(){
				return this._relayCallback;
			};
			*/
			
			/* 서비스에서 사용되는 옵션 정보 객체 생성 */
			_optionInfo = new Operation();
			
			/* 결과 응답 정보 객체 생성 */
			_responseInfo = new Operation();
			
			/* 결과 상태정보 객체 생성 */
			_stateInfo = (function(){
				var _code;	// 코드 정보
				var _msg;	// 메시지
				var _err;	// 에러 객체
				
				var initialize = function(){
					_code = undefined;
					_msg = undefined;
					_err = undefined;
				};
				var setResult = function(code, msg, err){
					_code = code;
					_msg = msg;
					_err = err;
				};
				var getResultCode = function(){
					return _code;
				};
				var getResultMsg = function(){
					return _msg;
				};
				var getError = function(){
					return _err;
				};
				
				return {
					initialize : initialize,
					setResult : setResult,
					getResultCode : getResultCode,
					getResultMsg : getResultMsg,
					getError : getError
				};
			}());
				
		}());
		
		/**
		 * @desc : 트랜젝션ID 제공
		 */
		var getTransactionId = function(){
			return _transactionId;
		};
		/**
		 * @desc : 객체 초기화
		 */
		var clear = function(dataClear){
			_serviceInfo.clear(dataClear);
			//_optionInfo.clear();
			_stateInfo.initialize();
		};
		
		/**
		 * @desc : 메모리 초기화
		 */
		var initialize = function(){
			_requestInfo.init();
			_serviceInfo.init();
			_optionInfo.initialize();
			_responseInfo.initialize();
			_stateInfo.initialize();
		}
		
		return{
			getTransactionId : getTransactionId,
			initialize : initialize,
			clear : clear,
			requestInfo : _requestInfo,
			optionInfo : _optionInfo,
			serviceInfo : _serviceInfo,
			responseInfo : _responseInfo,
			stateInfo : _stateInfo
		};
	};
	
	/**
	 * @desc : 새로은 핸들 객체 제공
	 */
	var txInc = 0;
	var newHandleInfo = function(){
		++txInc;
		// Step_01. transactionId 생성
		var txId;
		try{
			txId = forge.random.getBytesSync(64);
			for(var i=0; i<1000; i++){
				var txId2 = forge.random.getBytesSync(64);
				if(txId!=txId2){
					txId = txId2 + (txInc);
					break;
				}
			}
		}catch(e){
			txId = Math.random();
		}
		
		// Step_02. handle객체 생성
		var handleInfo = new HandleInfo(txId);
		
		// Step_03. trasactionId 단위 핸들 관리
		_handleMap[txId] = handleInfo;
		
		return handleInfo;
	};
	
	/**
	 * @desc : transaction ID에 해당하는 핸들 제공
	 */
	var getHandleInfo = function(txId){
		return _handleMap[txId];
	};
		
	return{
		newHandleInfo : newHandleInfo,
		getHandleInfo : getHandleInfo
	};
});