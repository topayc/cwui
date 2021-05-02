/*************************************************************************************
 # Copyright(c) Initech
 # 설명 :
 # 이력
  - [2015-10-01] : 최초 구현
*************************************************************************************/
define([
        '../core/forgeCrypto/forge',
        '../main/constants',
        '../conf/defaultConf',
        '../core/transferForm',
        '../conf/certificates',
        '../core/privateStorage',
        '../core/coreFactory',
        '../core/utils',
        '../core/iniException',
        '../conf/msgFactory'
        ], function (forge, constants, defaultConf, transferForm, certificates, privateStorage, coreFactory, utils, iniException, msgFactory) {
	// 구간 암호화 용도 인증서
	var _ENVELOPED_INFO;

	var _EXTERNAL_CERTIFICATES;

	var _ResponseEmpty = function(empty){};

	// CrossDomain 을 통한 sessionStorage 사용은 비동기 처리 이슈로 일단 보류..
	//var _CrossDomainlRepository = crossStorage.Repository();

	/*************************************************************************************
	 # 함수 명 : _UpdateCertificate
	 # 설명 : 갱신을 위한 인증서 세션 저장
	 	키 값에 대해 부분 수정이 안되므로 데이터를 가져온 뒤 다시 객체를 만들어 json형태로 변환하고 기존 데이터 제거 뒤 다시 넣는다.
	*************************************************************************************/
	var _UpdateCertificate = (function(){
		var UPDATE_CERT_INFO = "UPDATE_CERT_INFO";

		var initialize = function(){
			sessionStorage.removeItem(UPDATE_CERT_INFO);
		};

		var setUpdateCertInfo = function (handleInfo, certPri){
			var certInfo = {};
			certInfo.deviceId = handleInfo.serviceInfo.getDeviceId();
			certInfo.deviceSub = handleInfo.serviceInfo.getDeviceSub();
			certInfo.certId = handleInfo.serviceInfo.getParameter("CERT_ID");
			//certInfo.pwd = handleInfo.serviceInfo.getParameter("PWD");
			//certInfo.pin = handleInfo.serviceInfo.getParameter("PIN");
			certInfo.pwd = GINI_ProtectMgr.extract("NONCE");
			certInfo.pin = GINI_ProtectMgr.extract("SECURE");

			if(certPri !== undefined){
				certInfo.certificate = certPri.certificate;
				certInfo.privateKey = certPri.privateKey;
			}

			sessionStorage.removeItem(UPDATE_CERT_INFO);
			sessionStorage.setItem(UPDATE_CERT_INFO, JSON.stringify(certInfo));
			// 초기화
			certInfo = 0x00;
		};

		var getUpdateCertInfo = function (){
			var certInfo = sessionStorage[UPDATE_CERT_INFO];
			if(certInfo!==undefined){
				return JSON.parse(certInfo);
			}
		};

		return{
			initialize : initialize,
			setUpdateCertInfo : setUpdateCertInfo,
			getUpdateCertInfo : getUpdateCertInfo
		};
	}());

	/*************************************************************************************
	 # 함수 명 : _LoginCertificate
	 # 설명 : 로그인 시 선택된 인증서 캐시
	 	키 값에 대해 부분 수정이 안되므로 데이터를 가져온 뒤 다시 객체를 만들어 json형태로 변환하고 기존 데이터 제거 뒤 다시 넣는다.
	*************************************************************************************/
	var _LoginCertificate = (function(){
		function INIgetCookie(cname) {
			var name = cname + "=";
			var decodedCookie = document.cookie;
			var ca = decodedCookie.split(';');
			for(var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') {
					c = c.substring(1);
				}
				if (c.indexOf(name) == 0) {
					return c.substring(name.length, c.length);
				}
			}
			return "";
		}


		var SELECTED_CERT_INFO = "SELECTED_CERT_INFO";
		var PIN_CHECK_SUM = "01";
		var PIN_ENCRYPTING_RANDOM_LENGTH = 16;
		var PIN_CACHE_KEY  = "ep";

		var encryptPin = function(key, pinValue/*, isEncrypted*/) {
			var hashKey = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, key, "UTF-8");
			var rightKey = hashKey.substring(0,16);
			var iv = hashKey.substring(16);
			var pText = PIN_CHECK_SUM +
							 coreFactory.Factory.Util.getBytes(PIN_ENCRYPTING_RANDOM_LENGTH) +
							 pinValue;
			var dataBuffer = coreFactory.Factory.Util.createBuffer(pText)
			var encData = coreFactory.Factory.Cipher.symmetricEncrypt(constants.Cipher.SYMM_AES_CBC, rightKey, iv, dataBuffer);

			// base64-encode again
			var encrypted = encData.getBytes();
			var encrypted64 = coreFactory.Factory.Util.encode64(encrypted);

			return encrypted64;
		};

		var decryptPin = function(key, encryptedText) {
			var hashKey = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, key, "UTF-8");
			var rightKey = hashKey.substring(0,16);
			var iv = hashKey.substring(16);



			var encrypted = coreFactory.Factory.Util.decode64(encryptedText);
			var dataBuffer = coreFactory.Factory.Util.createBuffer(encrypted)

			var encryptedPinText =  coreFactory.Factory.Cipher.symmetricDecrypt(constants.Cipher.SYMM_AES_CBC, rightKey, iv, dataBuffer);

			if (encryptedPinText.data.substring(0,2)  !== PIN_CHECK_SUM) {
				return null;// wrong data
			}else {
				return  encryptedPinText.data.substring(18);
			}
		};

		/**
		 * @desc : 선택된 인증서 저장
		 * @param storageType : 저장매체 유형
		 * @param certId : 선택된 인증서 ID
		 */

		var setSelectedCert = function (deviceId, deviceSub, certId, clientPushId, pinNumber, isEncrypted){
			try{
				var selected = {};
				selected["deviceId"] = deviceId;
				selected["deviceSub"] = deviceSub;
				selected["certId"] = certId;
				if(clientPushId){
					selected["clientPushId"] = clientPushId;
				}
				if (pinNumber) {
					selected["ep"] = {};
					selected["ep"]["epText"] =  encryptPin(certId, pinNumber);
					selected["ep"]["epEnc"] =  isEncrypted
				}
				sessionStorage.removeItem(SELECTED_CERT_INFO);
				sessionStorage.setItem(SELECTED_CERT_INFO, JSON.stringify(selected));

				// CrossDomain 의 sessionStorage 에도 추가 기록하자
				//_CrossDomainlRepository.setSessionItem(SELECTED_CERT_INFO, JSON.stringify(selected));
				// CrossDomain 은 가져올 때 비동기 이슈가 있다  Cookie 도 대체..
				// todo : cookie 도 domain 이 다른 경우 이슈가 있을 수 있으므로 장기적인 방안으로 해결 필요
				var host = window.location.hostname;
				var parts = host.split('.').reverse();

				var domain = host;
				if (parts != null && parts.length > 2) {
					domain = parts[1] + '.' + parts[0];

					if (parts.length  > 3) {
						domain = parts[2] + '.' + domain;
					}
					domain = "." + domain;
				}

				document.cookie = "SELECTED_CERT_INFO" + "=" + JSON.stringify(selected) + ";path=/;domain="+domain;

			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_1005');
			}
		};

		function INIdeleteCookie( cookieName )
		{
			var expireDate = new Date();
			var host = window.location.hostname;
			var parts = host.split('.').reverse();

			var domain = host;
			if (parts != null && parts.length > 2) {
				domain = parts[1] + '.' + parts[0];

				if (parts.length  > 3) {
					domain = parts[2] + '.' + domain;
				}
				domain = "." + domain;
			}

			//어제 날짜를 쿠키 소멸 날짜로 설정한다.
			expireDate.setDate( expireDate.getDate() - 1 );
			document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString() + "; path=/;domain="+domain;
		}

		/**
		 * @desc : 선택된 인증서 정보
		 */
		var getSelectedCert = function(){
			try{
				var selected = sessionStorage[SELECTED_CERT_INFO];
				if(selected!==undefined){
					selected = JSON.parse(selected);
					if (typeof selected['ep'] !== "undefined" && selected['ep'] && typeof selected['ep'] === 'object') {
						selected["ep"]['epText'] = decryptPin(selected['certId'], selected["ep"]['epText']);
					}
					return selected;
				}
				else {
					// local 의 sessionStorage 에 없으면.. crossDomain 에도 시도 한다
					// _CrossDomainlRepository.getSessionItem(SELECTED_CERT_INFO, callback);
					// CrossDomain 에서 가져오는 부분이 비동기 이므로 Cookie 에서 가져오는 방안으로 적용
					// todo : cookie 도 domain 이 다른 경우 이슈가 있을 수 있으므로 장기적인 방안으로 해결 필요
					var cselected = INIgetCookie(SELECTED_CERT_INFO);
					if(cselected != ""){
						return JSON.parse(cselected);
					}
				}
			}catch(e){
				console.log("복화화 오류");
				console.log(e);
				new iniException.Error.newThrow(e, 'ERR_1006');
			}
		};

		/**
		 * @desc : 로그인 인증서 초기화
		 */
		var initialize = function(callback){
			sessionStorage.removeItem(SELECTED_CERT_INFO);
			INIdeleteCookie(SELECTED_CERT_INFO);
			
			if ( 'function' === typeof callback )
				callback();
		};

		return{
			initialize : initialize,
			setSelectedCert : setSelectedCert,
			getSelectedCert : getSelectedCert
		}

	}());

	/*************************************************************************************
	 # 함수 명 : _CertFilter
	 # 설명 : 인증서 필터링
	*************************************************************************************/
	var _CertFilter = (function(){
		/**
		 * @desc : cache된 인증서 필터링
		 * @param attrCerts : 인증서 속성 목록
		 * @return : 필터링된 인증서 속성 정보
		 */
		 	
		 
		function filterCache(attrCerts){
			try{
				utils.Log.debug('Cached Filter');

				var selected = _LoginCertificate.getSelectedCert();

				if(selected !== undefined){
					utils.Log.debug('filter cached CertId : ' + selected.certId);
					utils.Log.debug('filter cached DeviceId : ' + selected.deviceId);
					utils.Log.debug('filter cached DeviceSub : ' + selected.deviceSub);

					var cache = {};
					for(attr in attrCerts){
						if(selected.certId === attr){
							cache[attr] = attrCerts[attr];
							return cache;
						}
					}
				}
				return attrCerts;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2001', attrCerts);
			}
		};

		/*************************************************************************************
		 # 함수 명 : filterExpire
		 # 설명 : 만료된 인증서 필터링 (customerConf.js Certs.FILTER.EXPIRE 값이 true이면 체크함)
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function filterExpire(attrCerts){
			try{
				utils.Log.debug('Expire Filter');
				var cache = {};

				for(attr in attrCerts){
					var expireDt = new Date((attrCerts[attr][constants.Certs.ATTR_EXPIRE]).replace(/-/g, '/'));
					var differ = (expireDt.valueOf()/(24*60*60*1000)) - (new Date().valueOf()/(24*60*60*1000));

					if(differ > 0){
						cache[attr] = attrCerts[attr];
					}
				}

				return cache;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2002', attrCerts);
			}
		};

		/*************************************************************************************
		 # 함수 명 : filterOid
		 # 설명 : OID 필터링 (customerConf.js Certs.FILTER.OID 배열에 등록된 값만 필터링.)
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function filterOid(oidList, attrCerts){
			try{
				utils.Log.debug('OID Filter');

				if(oidList.length>0){
					var cache = {};

					for(attr in attrCerts){
						var oid = attrCerts[attr][constants.Certs.ATTR_OID];

						if(utils.Collection.exist(oidList, oid)){
							cache[attr] = attrCerts[attr];
						}
					}
					return cache;
				}else{
					return attrCerts;
				}
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2003', attrCerts);
			}
		};

		/*************************************************************************************
		 # 함수 명 : filterIssuerO
		 # 설명 : CA 인증서 명칭 필터링 (issuer O값, customerConf.js Certs.FILTER.ISSUER 배열에 등록된 값만 필터링.)
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function filterIssuerO(issuerList, attrCerts){
			try{
				utils.Log.debug('Issuer O Filter');

				if(issuerList.length>0){
					var cache = {};

					for(attr in attrCerts){
						var issuerO = attrCerts[attr][constants.Certs.ATTR_ISSUER];

						if(utils.Collection.exist(issuerList, issuerO)){
							cache[attr] = attrCerts[attr];
						}
					}
					return cache;
				}else{
					return attrCerts;
				}
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2004', attrCerts);
			}
		};


		/*************************************************************************************
		 # 함수 명 : filterIssuerCN
		 # 설명 : CA 인증서 명칭 필터링 (issuer CN값, customerConf.js Certs.FILTER.ISSUER_CN 배열에 등록된 값만 필터링.)
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function filterIssuerCN(issuerList, attrCerts){
			try{
				utils.Log.debug('Issuer CN Filter');

				if(issuerList.length>0){
					var cache = {};

					for(attr in attrCerts){
						var issuerCN = attrCerts[attr][constants.Certs.ATTR_ISSUER_CN];

						if(utils.Collection.exist(issuerList, issuerCN)){
							cache[attr] = attrCerts[attr];
						}
					}
					return cache;
				}else{
					return attrCerts;
				}
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2005', attrCerts);
			}
		};

		/*************************************************************************************
		 # 함수 명 : filterIssuerHash
		 # 설명 : Issuer hash 필터링 (issuer CN값, customerConf.js Certs.FILTER.ISSUER_HASH true일 경우 필터링함.)
		 	Certs.FILTER.ISSUER_HASH 값이 true일때 모드에 따라 필터링 됨, certificates.js내에 있는 인증서 정보가 real인지 test인지에 따라
		 	customerConf.System.OPERATION_MODE[WORK_MODE]의 모드를 보고 세팅됨.
		 	REAL_MODE일 경우 real 인증서만, TEST_MODE일 경우 테스트 인증서만, REAL_TEST_MODE 모드이거나 세팅이 안되었을 경우 모든 인증서를 다 보여준다.
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function filterIssuerHash(attrCerts){
			try{
				utils.Log.debug('Issuer Hash Filter');
				var cache = {};
				// var exist = false;

				var opMode = defaultConf.System.OperationMode;
				if(opMode === constants.System.REAL_MODE || opMode === constants.System.REAL_TEST_MODE){
					var realHash = certificates.getRealCaCertHash;
					if(realHash.length > 0){
						for(attr in attrCerts){
							var hash = attrCerts[attr][constants.Certs.ATTR_ISSUER_HASH];

							if(utils.Collection.exist(realHash, hash)){
								cache[attr]=attrCerts[attr];
								// exist = true;
							}
						}
					}
				}

				if(opMode === constants.System.TEST_MODE || opMode === constants.System.REAL_TEST_MODE){
					var testHash = certificates.getTestCaCertHash;
					if(testHash.length > 0){
						for(attr in attrCerts){
							var hash = attrCerts[attr][constants.Certs.ATTR_ISSUER_HASH];
							if(utils.Collection.exist(testHash, hash)){
									cache[attr]=attrCerts[attr];
									// exist = true;
							}
						}
					}
				}

				// if(exist){
					return cache;
				// }else{
				// 	return attrCerts;
				// }
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2006', attrCerts);
			}
		};

		/*************************************************************************************
		 # 함수 명 : filterSerialNo
		 # 설명 : SerialNo값으로 필터링 (캐시된 인증서만 보일시 사용)
		 # param
		 	attrCerts : 인증서 속성 목록
		 	serialNo : 보여주고자 하는 인증서의 serialNo
		*************************************************************************************/
		function filterSerialNo(attrCerts, serialNo){
			try{
				utils.Log.debug('SerialNo Filter');
				var cache = {};

				for(attr in attrCerts){
					if(attrCerts[attr].SERIAL === serialNo){
						cache[attr] = attrCerts[attr];
					}
				}

				return cache;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2002', attrCerts);
			}
		};

		/*************************************************************************************
		 # 함수 명 : sortCerfiticate
		 # 설명 : 인증서 목록 정렬 (현재 1뎁스 정렬만 사용가능)
		 	customerConf.js의 SORT_OBJECT값 참조
		 # 주의 : _CertFilter 내에 아래 함수를 추가 할 것
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function sortCerfiticate(attrCerts){

		    var sortObj = defaultConf.Certs.SortObject;
		    if(sortObj){
		        var isAsc = (defaultConf.Certs.SortType=="ASC" ? true : false);

		        var sortList = [];
		        // OID_NAME
		        for(attr in attrCerts){
		            sortList.push(attrCerts[attr]);
		        }

		        for(var i=1; i<sortList.length; i++) {
		            for(var j=0; j<sortList.length-i; j++) {
		                if(isAsc){
		                    if( sortList[j][sortObj] > sortList[j+1][sortObj] ) {
		                        var a = sortList[ j ];
		                        var b = sortList[j+1];
		                        sortList[ j ] = b;
		                        sortList[j+1] = a;
		                    }
		                }else{
		                    if( sortList[j][sortObj] < sortList[j+1][sortObj] ) {
		                        var a = sortList[ j ];
		                        var b = sortList[j+1];
		                        sortList[ j ] = b;
		                        sortList[j+1] = a;
		                    }
		                }

		            }
		        }

		        var resultSort = {};
		        for(var i=0; i<sortList.length; i++){
		            var key = sortList[i][constants.Certs.ATTR_ISSUER] + '-' + sortList[i][constants.Certs.ATTR_SERIAL];
		            for(attr in attrCerts){
		                var oldKey = attrCerts[attr][constants.Certs.ATTR_ISSUER] + '-' + attrCerts[attr][constants.Certs.ATTR_SERIAL];
		                if(key == oldKey){
		                    resultSort[attr] = sortList[i];
		                    break;
		                }
		            }
		        }

		        return resultSort;
		    }else{
		        return attrCerts
		    }
		}

		/*************************************************************************************
		 # 함수 명 : sortCerfiticate
		 # 설명 : 인증서 목록 정렬 (현재 1뎁스 정렬만 사용가능)
		 	customerConf.js의 SORT_OBJECT값 참조
		 # 주의 : _CertFilter 내에 아래 함수를 추가 할 것 (위와 동일한 로직??)
		 # param
		 	attrCerts : 인증서 속성 목록
		*************************************************************************************/
		function sortCerfiticate(attrCerts){

			var sortObj = defaultConf.Certs.SortObject;
			if(sortObj){
				var isAsc = (defaultConf.Certs.SortType=="ASC" ? true : false);

				var sortList = [];
				// OID_NAME
				for(attr in attrCerts){
					sortList.push(attrCerts[attr]);
				}

			    for(var i=1; i<sortList.length; i++) {
			    	for(var j=0; j<sortList.length-i; j++) {
			    		if(isAsc){
			    			if( sortList[j][sortObj] > sortList[j+1][sortObj] ) {
				    			var a = sortList[ j ];
				    			var b = sortList[j+1];
				    			sortList[ j ] = b;
				    			sortList[j+1] = a;
				    		}
			    		}else{
			    			if( sortList[j][sortObj] < sortList[j+1][sortObj] ) {
				    			var a = sortList[ j ];
				    			var b = sortList[j+1];
				    			sortList[ j ] = b;
				    			sortList[j+1] = a;
				    		}
			    		}

			    	}
			    }

			    var resultSort = {};
			    for(var i=0; i<sortList.length; i++){
			    	var key = sortList[i][constants.Certs.ATTR_ISSUER] + '-' + sortList[i][constants.Certs.ATTR_SERIAL];
			    	for(attr in attrCerts){
			    		var oldKey = attrCerts[attr][constants.Certs.ATTR_ISSUER] + '-' + attrCerts[attr][constants.Certs.ATTR_SERIAL];
			    		if(key == oldKey){
				    		resultSort[attr] = sortList[i];
				    		break;
			    		}
			    	}
			    }


			    return resultSort;
			}else{
				return attrCerts
			}
		}
			
		/*************************************************************************************
		 # 함수 명 : filterIssuerDN
		 # 설명 : IssuerDN으로 인증서 필터링
		*************************************************************************************/
		function filterIssuerDN(attrCerts) {
			try {
				// ISSUER_DN 정보로 필터링한다.
				var issuerDNList = JSON.parse(sessionStorage.getItem("FILTER_ISSUER_DN"));
				
				if ( null !== issuerDNList && issuerDNList.length > 0 ) {
					
					var cache = {};
					
					for (attr in attrCerts) {	
						var decodeAttr = decodeURIComponent(attr);		
						decodeAttr = decodeAttr.substring(3, decodeAttr.length);
						var certIssuerDN = decodeAttr.split("&")[0];						
						
						for ( var i=0; i < issuerDNList.length; i++ ) {																					
							if ( issuerDNList[i].toUpperCase() === certIssuerDN.toUpperCase() ) {
								cache[attr] = attrCerts[attr];
								break;
							}														
						}					
					}
												
					return cache;		
				} else {
					return attrCerts;		
				}		
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2008', attrCerts);
			}				
		};
		
		/*************************************************************************************
		 # 함수 명 : filterOIDAlias
		 # 설명 : OID(Alias)로 인증서 필터링
		*************************************************************************************/
		function filterOIDAlias(attrCerts) {
			try {
				// OID 정보로 필터링한다.
				var OIDList = JSON.parse(sessionStorage.getItem("FILTER_OID"));
				
				if ( null !== OIDList && OIDList.length > 0 ) {					
					var cache = {};
					
					for (attr in attrCerts) {																
						for ( var i=0; i < OIDList.length; i++ ) {
							if ( OIDList[i] === attrCerts[attr]["OID"] ) {
								cache[attr] = attrCerts[attr];
								break;
							}
						}															
					}
					
					return cache;		
				} else {
					return attrCerts;		
				}		
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2009', attrCerts);
			}				
		};

		/*************************************************************************************
		 # 함수 명 : filterCertificates
		 # 설명 : 인증서 목록 필터링
		*************************************************************************************/
		function filterCertificates(actionType,behaviorType, attrCerts, serialNo){			
			try{
				if((behaviorType === constants.WebForm.ACTION_CERT_UPDATE) && (serialNo !== undefined)){
					attrCerts = filterSerialNo(attrCerts, serialNo);
				} else if(actionType !== constants.WebForm.ACTION_MANAGE) {
					var filterList = defaultConf.Certs.FilterList;

					utils.Log.debug('Filter check list : ', filterList);
					for(filter in filterList){

						if(filter === constants.Certs.FILTER_CACHE && (filterList[filter])){
							if(behaviorType === constants.WebForm.ACTION_SIGN){
								attrCerts = filterCache(attrCerts);

								var attrCertkeys = [];
								for(var attrCertkey in attrCerts) {
									attrCertkeys.push(attrCertkey);
								}
								if( attrCerts!==null && attrCertkeys.length===1)
									break;
							}
						}
						if(filter === constants.Certs.FILTER_EXPIRE && (filterList[filter])){
							attrCerts = filterExpire(attrCerts);
						}
						if(filter === constants.Certs.FILTER_OID && (filterList[filter]!==undefined)){
							attrCerts = filterOid(filterList[filter], attrCerts);
						}
						if(filter === constants.Certs.FILTER_ISSUER && (filterList[filter]!==undefined)){
							attrCerts = filterIssuerO(filterList[filter], attrCerts);
						}
						if(filter === constants.Certs.FILTER_ISSUER_CN && (filterList[filter]!==undefined)){
							attrCerts = filterIssuerCN(filterList[filter], attrCerts);
						}
						if(filter === constants.Certs.FILTER_ISSUER_HASH && (filterList[filter])){
							attrCerts = filterIssuerHash(attrCerts);
						}						
					}
					
					attrCerts = filterIssuerDN(attrCerts);					
					attrCerts = filterOIDAlias(attrCerts);
				}
				return sortCerfiticate(attrCerts);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_2007', attrCerts);
			}
		};

		return{
			filterCertificates : filterCertificates			
		}

	}());

	/*************************************************************************************
	 # 함수 명 : externalDeviceRequest
	 # 설명 : 확장 저장매체 연동
	*************************************************************************************/
	function externalDeviceRequest(message){
		// CrossWeb EX, Daemon 연동
		try{
			/*
			 * 확장매체에 대한 설치 Case
			 * 1. 스크립트가 없는 경우 : 순수 Html5환경
			 * 2. 스크립트가 있으나 설치가 되지 않은 환경
			 */
			if(defaultConf.System.ExternalType == constants.System.EXTERNAL_CROSSWEB_EX){
				/* CrossWeb EX 연동 */
				message["GET_RESULT"] = "FALSE";
				// CWEXRequestCmd(encodeURIComponent(JSON.stringify(message)), "GINI_External_Response_Factory.proc", true);
				INIWEBEX.requestCmd({
                    params : encodeURIComponent(JSON.stringify(message)),
                    processCallback : "GINI_External_Response_Factory.proc"
                });

			}else if(defaultConf.System.ExternalType == constants.System.EXTERNAL_MOASIGN_EX){
				/* MoaSign EX 연동 */
				 // 처리 결과 전달
				message["GET_RESULT"] = "TRUE";
				utils.Transfer.iframeLocalPostSend(message, GINI_External_Response_Factory.proc);
			}
		}catch(e){
			console.log("[ERROR]",e);
		}

	};

	/*************************************************************************************
	 # 함수 명 : getUniqThreadRandom
	 # 설명 : 유니크 랜덤 생성(랜덤값 사용할때나 비동기 처리이 트랜잭션 아이디로 사용될때 생성.)
	*************************************************************************************/
	function getUniqThreadRandom(length){
		var rnd = coreFactory.Factory.Util.getRandomBytesSync(length);
		do{
			var newRnd = coreFactory.Factory.Util.getRandomBytesSync(length);
		}while(rnd==newRnd);
		return coreFactory.Factory.Util.bytesToHex(newRnd);
	};

	/*************************************************************************************
	 # 함수 명 : relayExecutor
	 # 설명 : 저장 매체에 따라 분기 처리를 한다.
	 	Browser의 경우 브라우저 내에서 비지니스 로직을 처리하며 이외의 경우 crosswebex와 통신으로 처리(비동기).
	*************************************************************************************/
	function relayExecutor(handleInfo, relayCallback, browserPerform, externalPerform, isLocalDeal ){

		//GINI_LoadingIndicatorStart();
		// step01. relayCallback cache
		//handleInfo.serviceInfo.setRelayCallback(relayCallback); // 필요 없음

		if((browserPerform != undefined) && (handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER)){
			//GINI_StandbyCallBack.setCallback(handleInfo.getTransactionId(), relayCallback); // 브라우저는 필요 없음
			browserPerform(handleInfo, relayCallback);
		} else {
			var extTranId = getUniqThreadRandom(16);
			// 확장 저장매체의 Callback
			GINI_StandbyCallBack.setCallback(extTranId, relayCallback);
			// 오류시 실행될 콜백세팅
			GINI_StandbyCallBack.setExceptionCallback(extTranId, handleInfo.serviceInfo.getExceptionCallback());

			if(isLocalDeal){
				// 확장 매체 이지만 Local에서 처리가 가능 할 때 (예, 인증서 정보는 Local에 Cache되어 있음)
				externalPerform(handleInfo, relayCallback, _ENVELOPED_INFO);
			}else{
				// crosswebex모듈을 통해 처리할때
				externalDeviceRequest(externalPerform(handleInfo, extTranId, _ENVELOPED_INFO));
			}
		}
	};

	/*************************************************************************************
	 # 함수 명 : virtualKeyValuePin
	 # 설명 : 가상 키패드 처리
	*************************************************************************************/
	function virtualKeyValuePin(handleInfo){
		// 유니키 가상키패드 비밀번호 추출
		function extract(pwdId, nonceType){
			var keyObj = handleInfo.serviceInfo.getParameter(pwdId);
			if(keyObj){
				if(keyObj.GetInputLength){
					var inputLength = keyObj.GetInputLength();
					var inputData = "";
					var idx = 0;
					for (idx=0;idx<inputLength;idx++) {
						inputData += keyObj.GetInputData(idx);
					}
					//alert(pwdId + ":" + inputData);
					//handleInfo.serviceInfo.setParameter(pwdId, inputData);
					GINI_ProtectMgr.keep(nonceType, inputData);
					inputData = 0x00;
				} else {
					return keyObj;
				}
			}
		};
		var pwd;
		var newPwd;
		var newPwdCnf;
		var pin;
		var targetPin;
		try{
			if(handleInfo.serviceInfo.getParameter("ENCRYPTED") == "TRUE"){
				//crosswebex와의 비밀번호 암호화를 할 경우.
				pwd = handleInfo.serviceInfo.getParameter("PWD");
				newPwd = handleInfo.serviceInfo.getParameter("NEW_PWD");
				newPwdCnf = handleInfo.serviceInfo.getParameter("PWD_CNF");

				if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD ){
					pin = handleInfo.serviceInfo.getParameter("PIN");
				}else if(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_SECURITY_TOKEN ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD){
					targetPin = handleInfo.serviceInfo.getParameter("TARGET_PIN");
				}
			}else{
				var keypadList = defaultConf.KeyStrokeSecurity.KeyStrokeSecurityList;
				if(keypadList){
					// 가상키패드 처리일 경우. (추후 라온가상키패드가 추가되면 변경되어야함)
					extract("PWD", "NONCE");
					extract("NEW_PWD", "NEW_NONCE");
					extract("PWD_CNF", "NEW_NONCE_CNF");
					extract("PIN", "SECURE");
					extract("TARGET_PIN", "TARGET_SECURE");

					pwd = GINI_ProtectMgr.extract("NONCE");
					newPwd = GINI_ProtectMgr.extract("NEW_NONCE");
					newPwdCnf = GINI_ProtectMgr.extract("NEW_NONCE_CNF");
					pin = GINI_ProtectMgr.extract("SECURE");
					targetPin = GINI_ProtectMgr.extract("TARGET_SECURE");
				} else {
					// 키인입력일 경우.
					pwd = handleInfo.serviceInfo.getParameter("PWD");
					GINI_ProtectMgr.keep("NONCE", pwd);
					newPwd = handleInfo.serviceInfo.getParameter("NEW_PWD");
					GINI_ProtectMgr.keep("NEW_NONCE", newPwd);
					newPwdCnf = handleInfo.serviceInfo.getParameter("PWD_CNF");
					GINI_ProtectMgr.keep("NEW_NONCE_CNF", newPwdCnf);
					pin = handleInfo.serviceInfo.getParameter("PIN");
					GINI_ProtectMgr.keep("SECURE", pin);
					targetPin = handleInfo.serviceInfo.getParameter("TARGET_PIN");
					GINI_ProtectMgr.keep("TARGET_SECURE", targetPin);
				}
			}

			return true;
		}catch(e){
			handleInfo.serviceInfo.setParameter("PWD", "");
			handleInfo.serviceInfo.setParameter("NEW_PWD", "");
			handleInfo.serviceInfo.setParameter("PWD_CNF", "");
			handleInfo.serviceInfo.setParameter("PIN", "");
			handleInfo.serviceInfo.setParameter("TARGET_PIN", "");

			if(handleInfo.serviceInfo.getExceptionCallback()){
				handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
			}

			// 브라우져 외 저장소에서 발생하는 오류에 대해 alert 처리
			if( handleInfo.serviceInfo.getDeviceId() != constants.Certs.STORAGE_BROWSER
				|| (handleInfo.serviceInfo.getDeviceId() == constants.Certs.STORAGE_BROWSER
						&& constants.WebForm.ACTION_CERT_EXPORT_FILE === handleInfo.serviceInfo.getBehavior())
					){
				INI_ALERT(msgFactory.getMessageFactory().Warn[e.name], 'WARN');
				return false;
			}else{
				throw e;
			}
		}finally{
			// 초기화
			pwd = 0x00;
			newPwd = 0x00;
			newPwdCnf = 0x00;
			pin = 0x00;
			targetPin = 0x00;
		}
	};


	/*************************************************************************************
	 # 함수 명 : virtualKeyValue
	 # 설명 : 가상 키패드 처리
	*************************************************************************************/
	function virtualKeyValue(handleInfo){

		//체크하지 않는 예외 저장매체
		if((handleInfo.serviceInfo.getDeviceId()== constants.Certs.STORAGE_USIM)
				||(handleInfo.serviceInfo.getDeviceSub()== constants.Certs.STORAGE_PHONE_MOBISIGN)
				||(handleInfo.serviceInfo.getDeviceId()== constants.Certs.SMART_CERTIFY)
				){

			return true;
		}
		// 유니키 가상키패드 비밀번호 추출
		function extract(pwdId, nonceType){
			var keyObj = handleInfo.serviceInfo.getParameter(pwdId);
			if(keyObj){
				if(keyObj.GetInputLength){
					var inputLength = keyObj.GetInputLength();
					var inputData = "";
					var idx = 0;
					for (idx=0;idx<inputLength;idx++) {
						inputData += keyObj.GetInputData(idx);
					}
					//alert(pwdId + ":" + inputData);
					//handleInfo.serviceInfo.setParameter(pwdId, inputData);
					GINI_ProtectMgr.keep(nonceType, inputData);
					inputData = 0x00;
				} else {
					return keyObj;
				}
			}
		};
		var pwd;
		var newPwd;
		var newPwdCnf;
		var pin;
		var targetPin;
		try{
			if(handleInfo.serviceInfo.getParameter("ENCRYPTED") == "TRUE"){
				//crosswebex와의 비밀번호 암호화를 할 경우.
				pwd = handleInfo.serviceInfo.getParameter("PWD");
				newPwd = handleInfo.serviceInfo.getParameter("NEW_PWD");
				newPwdCnf = handleInfo.serviceInfo.getParameter("PWD_CNF");

				if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD){
					pin = handleInfo.serviceInfo.getParameter("PIN");
				}else if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_DEVICE ||
						handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SCARD){
					targetPin = handleInfo.serviceInfo.getParameter("TARGET_PIN");
				}
			}else{
				var keypadList = defaultConf.KeyStrokeSecurity.KeyStrokeSecurityList;
				if(keypadList){
					// 가상키패드 처리일 경우. (추후 라온가상키패드가 추가되면 변경되어야함)
					extract("PWD", "NONCE");
					extract("NEW_PWD", "NEW_NONCE");
					extract("PWD_CNF", "NEW_NONCE_CNF");
					extract("PIN", "SECURE");
					extract("TARGET_PIN", "TARGET_SECURE");

					pwd = GINI_ProtectMgr.extract("NONCE");
					newPwd = GINI_ProtectMgr.extract("NEW_NONCE");
					newPwdCnf = GINI_ProtectMgr.extract("NEW_NONCE_CNF");
					pin = GINI_ProtectMgr.extract("SECURE");
					targetPin = GINI_ProtectMgr.extract("TARGET_SECURE");
				} else {
					// 키인입력일 경우.
					pwd = handleInfo.serviceInfo.getParameter("PWD");
					GINI_ProtectMgr.keep("NONCE", pwd);
					newPwd = handleInfo.serviceInfo.getParameter("NEW_PWD");
					GINI_ProtectMgr.keep("NEW_NONCE", newPwd);
					newPwdCnf = handleInfo.serviceInfo.getParameter("PWD_CNF");
					GINI_ProtectMgr.keep("NEW_NONCE_CNF", newPwdCnf);
					pin = handleInfo.serviceInfo.getParameter("PIN");
					GINI_ProtectMgr.keep("SECURE", pin);
					targetPin = handleInfo.serviceInfo.getParameter("TARGET_PIN");
					GINI_ProtectMgr.keep("TARGET_SECURE", targetPin);
				}
			}

			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN
					&& (!handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") && handleInfo.serviceInfo.getBehavior() != constants.WebForm.ACTION_CERT_COPY)){
				if(!pin || pin === ""){
            		handleInfo.serviceInfo.setParameter("PIN", "");
            		new iniException.Warn.newThrow(null, 'WARN_1030');
            	}
			}

			if(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_SECURITY_TOKEN
					&& handleInfo.serviceInfo.getBehavior() === constants.WebForm.ACTION_CERT_COPY){
            	if(!targetPin || targetPin === ""){
            		handleInfo.serviceInfo.setParameter("TARGET_PIN", "");
            		new iniException.Warn.newThrow(null, 'WARN_1030');
            	}
			}

			if( (!pwd || pwd === "")
					&& ((handleInfo.serviceInfo.getBehavior()!== constants.WebForm.ACTION_CERT_REMOVE)
							&& (handleInfo.serviceInfo.getBehavior()!== constants.WebForm.ACTION_CERT_ISSUE)
							&& (handleInfo.serviceInfo.getBehavior()!== constants.WebForm.ACTION_CERT_REISSUE)
							&& (handleInfo.serviceInfo.getBehavior()!== constants.WebForm.ACTION_CERT_UPDATE)
							&& (handleInfo.serviceInfo.getBehavior()!== constants.WebForm.ACTION_CERT_REVOKE)
							&& (handleInfo.serviceInfo.getBehavior()!== constants.WebForm.ACTION_CERT_CMP)
							)){
				new iniException.Warn.newThrow(null, 'WARN_1012');
			}

			// CMP
			if((handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CERT_ISSUE
				||handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CERT_REISSUE
				||handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CERT_UPDATE)
				&& (handleInfo.serviceInfo.getDeviceId() !== constants.Certs.STORAGE_SECURITY_TOKEN)){
				// 2가지 확인
				if(!pwd || !newPwdCnf || pwd == "" || newPwdCnf == ""){
					new iniException.Warn.newThrow(null, 'WARN_1058');
				}

				//비밀번호가 암호화가 되어 있으면 비교체크는 무시한다.
				if(handleInfo.serviceInfo.getParameter("ENCRYPTED") !== "TRUE"){
					//&&(handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CHANGE_PWD)){
					if(pwd != newPwdCnf){
						new iniException.Warn.newThrow(null, 'WARN_1018');
					}else{
						Certs.checkComplexPassword(pwd);
					}
				}
			}else if(handleInfo.serviceInfo.getBehavior() == constants.WebForm.ACTION_CHANGE_PWD){
				// CHANGE
				if(!pwd || !newPwd || !newPwdCnf || pwd == "" || newPwd == "" || newPwdCnf == ""){
					new iniException.Warn.newThrow(null, 'WARN_1016');
				}

				if(handleInfo.serviceInfo.getParameter("ENCRYPTED") !== "TRUE"){
					if(newPwd != newPwdCnf){
						new iniException.Warn.newThrow(null, 'WARN_1017');
					}else{
						Certs.checkComplexPassword(newPwd);
					}
				}
			}
			return true;
		}catch(e){
			handleInfo.serviceInfo.setParameter("PWD", "");
			handleInfo.serviceInfo.setParameter("NEW_PWD", "");
			handleInfo.serviceInfo.setParameter("PWD_CNF", "");
			handleInfo.serviceInfo.setParameter("PIN", "");
			handleInfo.serviceInfo.setParameter("TARGET_PIN", "");

			if(handleInfo.serviceInfo.getExceptionCallback()){
				handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
			}

			// 브라우져 외 저장소에서 발생하는 오류에 대해 alert 처리
			if( handleInfo.serviceInfo.getDeviceId() != constants.Certs.STORAGE_BROWSER
				|| (handleInfo.serviceInfo.getDeviceId() == constants.Certs.STORAGE_BROWSER
						&& constants.WebForm.ACTION_CERT_EXPORT_FILE === handleInfo.serviceInfo.getBehavior())
					){
				INI_ALERT(msgFactory.getMessageFactory().Warn[e.name], 'WARN');
				return false;
			}else{
				throw e;
			}
		}finally{
			// 초기화
			pwd = 0x00;
			newPwd = 0x00;
			newPwdCnf = 0x00;
			pin = 0x00;
			targetPin = 0x00;
		}
	};

	/*************************************************************************************
	 # 함수 명 : Signature
	 # 설명 : 전자서명
	*************************************************************************************/
	var Signature = (function(){

		/*************************************************************************************
		 # 함수 명 : rebuildSignOption
		 # 설명 : 옵션 재 설정.
		*************************************************************************************/
		function rebuildSignOption(actionType, optionInfo){
			try{
				// charset
				if(!optionInfo.getParameter("CONTENT_ENCODE")){
					optionInfo.setParameter("CONTENT_ENCODE", defaultConf.Signature.UrlEncodeCharSet);
				}

				// 해시 알고리즘
//				if(utils.String.isNull(signOption.HASH_ALG)){
//					if( constants.WebForm.ACTION_LOGIN === actionType){
//						signOption.HASH_ALG = defaultConf.Login.SignatureHash;
//					}else{
//						signOption.HASH_ALG = defaultConf.Signature.SignatureHash;
//					}
//				}

				// 서명 알고리즘
				if(utils.String.isNull(optionInfo.getParameter("RSA_PSS_SIGN"))){
					optionInfo.setParameter("RSA_PSS_SIGN", (defaultConf.Signature.SignatureAlg === constants.Cipher.SIGN_PSS ? true : false));
				}

				// 금결원 포맷
				if(utils.String.isNull(optionInfo.getParameter("YESSIGN_TYPE"))){
					optionInfo.setParameter("YESSIGN_TYPE", defaultConf.Signature.KftcSignFormat);
				}

				// Random 포함
				if(utils.String.isNull(optionInfo.getParameter("IN_VID"))){
					optionInfo.setParameter("IN_VID", defaultConf.Signature.IncludeRandomSignFormat);
				}

				// Content 제거
				if(utils.String.isNull(optionInfo.getParameter("REMOVE_CONTENT"))){
					optionInfo.setParameter("REMOVE_CONTENT", defaultConf.Signature.RemoveContentSignFormat);
				}

				// PDF전자서명 여부
				if(utils.String.isNull(optionInfo.getParameter("PDF_SIGN_TYPE"))){
					optionInfo.setParameter("PDF_SIGN_TYPE", "FALSE");
				}

			}catch(e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : selectedSignature
		 # 설명 : 전자서명
		*************************************************************************************/
		var selectedSignature = function(handleInfo){
			//옵션 재설정
			rebuildSignOption(handleInfo.serviceInfo.getAction(), handleInfo.optionInfo);
			//가상키패드 처리
			if (!virtualKeyValue(handleInfo)) return;

            var commonProcess = function(param, certPri) {
                function finalExcute(updateCertPri){
					if(updateCertPri){
						_UpdateCertificate.initialize();
						_UpdateCertificate.setUpdateCertInfo(handleInfo, updateCertPri);
					}
					handleInfo.serviceInfo.getCallback()();
					//20170115
					//GINI_LoadingIndicatorStop();
				};

				function finalExcuteCert(updateCert){
					if(updateCert){
						_UpdateCertificate.initialize();
						_UpdateCertificate.setUpdateCertInfo(handleInfo, updateCert);
					}
					handleInfo.serviceInfo.getCallback()();
					//20170115
					//GINI_LoadingIndicatorStop();
				};
				if( constants.WebForm.ACTION_LOGIN === handleInfo.serviceInfo.getBehavior()
						|| (handleInfo.serviceInfo.getBehavior() === "SAVE" && handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_LOGIN)
						){
					// 로그인일경우
					// 이전 Cache를 삭제 후 선택된 인증서를 Cache 한다.
					_LoginCertificate.initialize();

					 if (handleInfo.serviceInfo.getDeviceId() == constants.Certs.STORAGE_SCARD || handleInfo.serviceInfo.getDeviceId() == constants.Certs.STORAGE_SECURITY_DEVICE ){
						 _LoginCertificate.setSelectedCert(
								handleInfo.serviceInfo.getDeviceId(),
								handleInfo.serviceInfo.getDeviceSub(),
								handleInfo.serviceInfo.getParameter("CERT_ID"),
								null,
								handleInfo.serviceInfo.getParameter("ENCRYPTED") == "TRUE" ?
										handleInfo.serviceInfo.getParameter("PIN") : GINI_ProtectMgr.extract("SECURE"),
								handleInfo.serviceInfo.getParameter("ENCRYPTED")
								);
					 }else {
						 _LoginCertificate.setSelectedCert(handleInfo.serviceInfo.getDeviceId(),
									handleInfo.serviceInfo.getDeviceSub(),
									handleInfo.serviceInfo.getParameter("CERT_ID")
								);
					 }
					finalExcute();
				}else if( constants.WebForm.ACTION_CERT_CMP === handleInfo.serviceInfo.getBehavior()){
					//CMP 의 경우
					/* 주의 : 인증서 갱신 시 인증서/개인키 정보가 필요 함으로 반듯이 인증서를 포함 한다.*/
					if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
						var updateCertPri = {};
						updateCertPri.certificate = certPri.certificate;
						updateCertPri.privateKey = certPri.privateKey;

						finalExcute(updateCertPri);
					}else if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
						// 확장 매체의 경우 인증서&개인키를 다시 가져 온다.
						try {
							var resultData = transferForm.IniResponse.getResSignature(param);
							var selected = {};
							selected.certificate = resultData.VID_CERTIFICATE;

							finalExcuteCert(selected);
						}catch(e){
							if(handleInfo.serviceInfo.getExceptionCallback()){
								handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
							}
							INI_HANDLE.handleMessage(e);
						}
					}else{
						// 확장 매체의 경우 인증서&개인키를 다시 가져 온다.
						// 개인키 & 인증서를 가져온다.(이유는 ? )
						// 브라우저, crosswebex 분기 처리
						relayExecutor(handleInfo,
							function relayCallback(param){
								try {
									var resultData = transferForm.IniResponse.getResLoadCertificate(param);
									var selected = {};
									selected.privateKey = resultData.PRIVATE_KEY;
									selected.certificate = resultData.CERT;
									selected.kmPrivateKey = resultData.KM_PRIVATE_KEY;
									selected.kmCertificate = resultData.KM_CERT;

									finalExcute(selected);
								}catch(e){
									if(handleInfo.serviceInfo.getExceptionCallback()){
										handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
									}
									INI_HANDLE.handleMessage(e);
								}
							},
							undefined,
							transferForm.IniRequest.getReqLoadCertificate	//crosswebex 처리
						);
					}
				}else{
					finalExcute();
				}
            };
			var digitalsignCallback = function(param, certPri){
				var temp = {};

				if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
					if(handleInfo.optionInfo.getParameter("YESSIGN_TYPE") && handleInfo.optionInfo.getParameter("YESSIGN_TYPE")=== "TRUE"){
						temp = transferForm.IniResponse.getResSignature(param, _ENVELOPED_INFO);
					} else {
						temp = param;
					}
				}else{
					temp = transferForm.IniResponse.getResSignature(param, _ENVELOPED_INFO);
				}
				//다건?
				for(key in temp){
					// base64 인코딩의 \r\n을 없앤다.
					var emp = (temp[key].replace(/\r+/g, ""));
					/** 인증서는 pem형식으로 서버에 전달해야 함. **/
					//emp = emp.replace("-----BEGIN CERTIFICATE-----", "");
					//emp = emp.replace("-----END CERTIFICATE-----", "");
					/** PKCS#7은 DER포맷으로 서버에 전달해야 함. **/
					emp = emp.replace("-----BEGIN PKCS7-----", "");
					emp = emp.replace("-----END PKCS7-----", "");

					// 결과 저장
					handleInfo.responseInfo.setParameter(key, emp);
				}

				commonProcess(param, certPri);
			};

            // 다건서명 처리
            var allSignature = "";

            var eachDigitalSignCallback = function(param, certPri){
				GINI_LoadingIndicatorStart('Progressing');
				
                var temp = {};

				if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
					if(handleInfo.optionInfo.getParameter("YESSIGN_TYPE") && handleInfo.optionInfo.getParameter("YESSIGN_TYPE")=== "TRUE"){
						temp = transferForm.IniResponse.getResSignature(param, _ENVELOPED_INFO);
					} else {
						temp = param;
					}
				}else{
					temp = transferForm.IniResponse.getResSignature(param, _ENVELOPED_INFO);
				}

				for(key in temp){
					// base64 인코딩의 \r\n을 없앤다.
					var emp = (temp[key].replace(/\r+/g, ""));
					/** 인증서는 pem형식으로 서버에 전달해야 함. **/
					//emp = emp.replace("-----BEGIN CERTIFICATE-----", "");
					//emp = emp.replace("-----END CERTIFICATE-----", "");
					/** PKCS#7은 DER포맷으로 서버에 전달해야 함. **/
					emp = emp.replace("-----BEGIN PKCS7-----", "");
					emp = emp.replace("-----END PKCS7-----", "");

                    if ( "SIGNATURE" === key ) {

                        if ( "" !== allSignature ) {
                            allSignature += defaultConf.Signature.MultiDelimiter;
                        }
                        allSignature += emp;
                    }                         // 결과 저장
                    handleInfo.responseInfo.setParameter(key, emp);
				}
            };

            var finalDigitalSignCallback = function(param, certPri) {
                eachDigitalSignCallback(param, certPri);

                if ( handleInfo.requestInfo.getParameter("MULTI_INDEX") == arrOrgData.length ) {
                    handleInfo.responseInfo.setParameter("SIGNATURE", allSignature);
					GINI_LoadingIndicatorStop();
                    commonProcess(param, certPri);
                }
            };

            var browserProc = undefined;
			var relayCallback;

            var orgData = handleInfo.requestInfo.getParameter("ORG_DATA");
            var arrOrgData = orgData.split(defaultConf.Signature.MultiDelimiter);
            arrOrgData.push(orgData);    // 맨 뒤에 원문

            if ( arrOrgData.length > 2 ) {
                handleInfo.requestInfo.setParameter("MULTI_SIGN", "TRUE");
                handleInfo.requestInfo.setParameter("MULTI_INDEX", 0);
                handleInfo.requestInfo.setParameter("MULTI_ORG_DATA", arrOrgData); //필요한가??

                for ( var i=0; i<arrOrgData.length; i++ ) {

                    var signCallback = eachDigitalSignCallback;
                    if ( i == arrOrgData.length-1 ) {
                        signCallback = finalDigitalSignCallback;
                    }

                    if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER && handleInfo.optionInfo.getParameter("YESSIGN_TYPE") && handleInfo.optionInfo.getParameter("YESSIGN_TYPE")=== "TRUE"){
        				//YessSign처리 (무조건 crosswebex에서 처리하도록 변경)
        				browserProc = privateStorage.getYesssignCertificate;
        				relayCallback = function(certificate, privateKey){
        					handleInfo.serviceInfo.setParameter("CERTIFICATE", certificate);
        					handleInfo.serviceInfo.setParameter("PRIVATE_KEY", privateKey);

        					// 브라우저, crosswebex 분기 처리
        					relayExecutor(handleInfo,
        							signCallback,
        							undefined,	//브라우저 처리가 없음.
        							transferForm.IniRequest.getReqSignature	//crosswebex를 통해 서명함(인증서 정보를 넘겨줌)
        					);
        				}
        			} else {
        				browserProc = privateStorage.selectedSignature;
        				relayCallback = signCallback;
        			}

        			// 브라우저, crosswebex 분기 처리
        			relayExecutor(handleInfo,
        					relayCallback,
        					browserProc,
        					transferForm.IniRequest.getReqSignature
        			);
                }

            } else {
                if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER && handleInfo.optionInfo.getParameter("YESSIGN_TYPE") && handleInfo.optionInfo.getParameter("YESSIGN_TYPE")=== "TRUE"){
    				//YessSign처리 (무조건 crosswebex에서 처리하도록 변경)
    				browserProc = privateStorage.getYesssignCertificate;
    				relayCallback = function(certificate, privateKey){
    					handleInfo.serviceInfo.setParameter("CERTIFICATE", certificate);
    					handleInfo.serviceInfo.setParameter("PRIVATE_KEY", privateKey);
    					// 브라우저, crosswebex 분기 처리
    					relayExecutor(handleInfo,
    							digitalsignCallback,
    							undefined,	//브라우저 처리가 없음.
    							transferForm.IniRequest.getReqSignature	//crosswebex를 통해 서명함(인증서 정보를 넘겨줌)
    						);
    				}
    			} else {
    				browserProc = privateStorage.selectedSignature;
    				relayCallback = digitalsignCallback;
    			}
    			// 브라우저, crosswebex 분기 처리
    			relayExecutor(handleInfo,
    					relayCallback,
    					browserProc,
    					transferForm.IniRequest.getReqSignature
    			);
            }



		};

		return{
			selectedSignature : selectedSignature
		};
	}());

	/*************************************************************************************
	 # 함수 명 : Certs
	 # 설명 : 인증서
	*************************************************************************************/
	var Certs = (function(){

		/*************************************************************************************
		 # 함수 명 : checkComplexPassword
		 # 설명 : 패스워드 복잡도 처리.
		*************************************************************************************/
		function checkComplexPassword(pwd){
			try{
				var hanExp = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
				var specExp = /[\ \{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
				var charExp = /[a-z]/;
				var charUpExp = /[A-Z]/;
				var numExp = /[0-9]/;

				if(utils.String.isNull(pwd)){
					new iniException.Warn.newThrow(null, 'WARN_1003');
				}else if(hanExp.test(pwd)){
					new iniException.Warn.newThrow(null, 'WARN_1004');
				}

				//인증서 비밀번호의 조합을 특정 조합만 한정하여 허용하고 싶은 경우에 설정.
				//A,N,S : 3개의 고정 값을 조합하여 설정, 연속 적용 시에 구분자는 콤마(,)를 사용합니다.
				//A : 영문자 , N : 숫자 , S : 특수문자 , AN : 영문자/숫자 , AS : 영문자/특수문자 NS : 숫자/특수문자 ANS : 영문자/숫자/특수문자
				var typeCnt = 3;
				var limitTypeArr = defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_MIN_CHAR_TYPE].split(",");
				for (var index = 0; index < limitTypeArr.length; index++) {
					var limitTypeCheck = true;
					var limitType = limitTypeArr[index];
					if(limitType.indexOf("A") > -1){
						if(!specExp.test(pwd)){
							limitTypeCheck = false;
							continue;
						};
					}
					if(limitType.indexOf("N") > -1){
						if(!charExp.test(pwd)&&!charUpExp.test(pwd)){
							limitTypeCheck = false;
							continue;
						};
					}
					if(limitType.indexOf("S") > -1){
						if(!numExp.test(pwd)){
							limitTypeCheck = false;
							continue;
						};
					}
				}
				if(!limitTypeCheck){
					new iniException.Warn.newThrow(null, 'WARN_1005', typeCnt, typeCnt);
				}

				var dupCnt = 1;
				var serCnt = 1;
				var invCnt = 1;
				var now = 0;
				var old = 0;

				var pwdArray = pwd.split('');
				var sz = pwdArray.length;
				//최소 글자수 처리
				var limitMin = defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_MIN_LENGTH];
				if(sz < limitMin){
					new iniException.Warn.newThrow(null, 'WARN_1006', sz, limitMin);
				}
				//최대 글자수 처리
				var limitMax = defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_MAX_LENGTH];
				if(limitMax < sz){
					new iniException.Warn.newThrow(null, 'WARN_1007', sz, limitMax);
				}

				for(var i=0; i<sz; i++){
					now = pwdArray[i].charCodeAt(0);
					if(now != old){
						if(now - old == 1){
							serCnt = serCnt + 1;
						}else if(now - old == -1){
							invCnt = invCnt + 1;
						}else{
							serCnt = 1;
							invCnt = 1;
						}
						dupCnt = 1;
						old = now;
					}else{
						dupCnt = dupCnt + 1;
					}

					if(dupCnt>2){ // 중복 문자 3자 이상
						break;
					}
					if(serCnt>2){ // 연속문자 3자리 이상
						break;
					}
					if(invCnt>2){ // 역순문자 3자리 이상
						break;
					}
				}


				if(defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_DENY_SAME_CHAR3]){
					if(dupCnt>2){ // 중복 문자 3자 이상
						new iniException.Warn.newThrow(null, 'WARN_1008', dupCnt);
					}
				}
				if(defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_DENY_SERIAL_CHAR3]){
					if(serCnt>2 || invCnt>2){ // 연속문자 3자리 이상
						new iniException.Warn.newThrow(null, 'WARN_1009');
					}
				}

			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_6003');
			}finally{
				pwd = 0x00;
			}
		};

		/*************************************************************************************
		 # 함수 명 : getCertAttributeList
		 # 설명 : 인증서 목록 출력
		*************************************************************************************/
		var getCertAttributeList = function(handleInfo) {			
			//virtualKeyValue(handleInfo);
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,

				function relayCallback(param){					
					var certAttrs = {};
					if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){

						// param이 null pass
						// 영문 처리 certAttrs - 인증서가 없으면 영문 처리도 Pass
						if(Object.keys(param)[0] != undefined){
							if(constants.System.LANGUAGE_ENG === defaultConf.System.Language){
								//  javascript Object order 아님 오브젝트 키로 order  잡아야함
								param[Object.keys(param)[0]].OID_NAME = forge.pki.oids["ENG_"+param[Object.keys(param)[0]].OID];
							}else{
							//  javascript Object order 아님 오브젝트 키로 order  잡아야함
								param[Object.keys(param)[0]].OID_NAME = forge.pki.oids[param[Object.keys(param)[0]].OID];
							}
						}

						certAttrs = param;
					}else{
						var certListData = transferForm.IniResponse.getResCertificateList(param);
						// 인증서 속성정보
						certAttrs = certListData['certAttrs'];
						// 다른 매체에 인증서는 별도로 Cache 한다.
						_EXTERNAL_CERTIFICATES = certListData['certPem'];
					}
					//var filterAttr = _CertFilter.filterCertificates(handleInfo.serviceInfo.getAction(), certAttrs, handleInfo.serialNo);

					//필터링 및 정렬
					var filterAttr = _CertFilter.filterCertificates(handleInfo.serviceInfo.getAction(),handleInfo.serviceInfo.getBehavior(), certAttrs, handleInfo.serialNo);

					handleInfo.serviceInfo.getCallback()(filterAttr, handleInfo);		// Final callback
					//GINI_LoadingIndicatorStop();
				},

				privateStorage.getCertAttributeList,		//브라우저 처리시 실행될 메소드
				transferForm.IniRequest.getReqCertificateList	//crosswebex 처리
			);
		};

		/*************************************************************************************
		 # 함수 명 : getCertificateInfo
		 # 설명 : 인증서 상세 정보
		*************************************************************************************/
		var getCertificateInfo = function(handleInfo, isCMP){

			//virtualKeyValue(handleInfo);

			if(isCMP){
				//CMP의 경우 브라우저만 해당.(CMP는 모든 처리를 브라우저에서 미리 한뒤에 저장및 삭제만 crosswebex를 통한다)
				privateStorage.getCertificateInfo(
					handleInfo,
					function relayCallback(param){
						handleInfo.serviceInfo.getCallback()(param);
						//GINI_LoadingIndicatorStop();
					}
				);
			} else {

				/*************************************************************************************
				 # 함수 명 : getCachedExternalCertificate
				 # 설명 : Cache된 확장 매체 인증서 정보 제공
				*************************************************************************************/
				var getCachedExternalCertificate = function(handleInfo, relayCallback){
					var detail;
					var extCachedCert;
					if(_EXTERNAL_CERTIFICATES){
						extCachedCert = _EXTERNAL_CERTIFICATES[handleInfo.serviceInfo.getParameter('CERT_ID')];
					}else{
						/* 주의 : 인증서 폐기 시 인증서 삭제에 대한 상세보기는 CMP 정보에서 제공 한다.*/
						var selected = _UpdateCertificate.getUpdateCertInfo();
						extCachedCert = selected.certificate;
					}

					if(handleInfo.optionInfo.getParameter("CERT_VIEW_TYPE") == constants.Certs.CERTIFICATE_DETAIL_ATTR){
						detail = coreFactory.Factory.Certs.certificateDetail(extCachedCert);
					}else{
						detail = coreFactory.Factory.Certs.parseCertAttributes(extCachedCert);
					}

					relayCallback(detail);
				};


				// 브라우저, crosswebex 분기 처리
				relayExecutor(handleInfo,
					function relayCallback(param){
						handleInfo.serviceInfo.getCallback()(param
											,handleInfo.serviceInfo.getParameter("INI_Modal_Id")
											,handleInfo.serviceInfo.getParameter("INI_Is_DetailView"));
						//GINI_LoadingIndicatorStop();
					},
					privateStorage.getCertificateInfo,	//브라우저 처리시 실행될 메소드
					getCachedExternalCertificate,		//crosswebex 처리
					true
				);
			}
		};

		/*************************************************************************************
		 # 함수 명 : getSelectedCertInfo
		 # 설명 : 로그인 인증서 정보 가져오기
		*************************************************************************************/
		var getSelectedCertInfo = function(){
			return _LoginCertificate.getSelectedCert();
		};

		/*************************************************************************************
		 # 함수 명 : setSelectedCertInfo
		 # 설명 : 로그인 인증서 정보 세팅하기.
		*************************************************************************************/
		var setSelectedCertInfo = function(deviceId, deviceSub, certId, certAttr, clientPushId){
			return _LoginCertificate.setSelectedCert(deviceId, deviceSub, certId, certAttr, clientPushId);
		};

		/*************************************************************************************
		 # 함수 명 : getSelectedReNewCertInfo
		 # 설명 : 인증서 캐쉬정보 업데이트 하기.
		*************************************************************************************/
		var getSelectedReNewCertInfo = function(){
			return _UpdateCertificate.getUpdateCertInfo();
		};
		
		/*************************************************************************************
		 # 함수 명 : initCertInfo
		 # 설명 : 인증서 캐쉬정보 초기화 하기.
		*************************************************************************************/
		var initCertInfo = function(callback) {
			return _LoginCertificate.initialize(callback);
		};
		
		/*************************************************************************************
		 # 함수 명 : setIssuerDNFilterInfo
		 # 설명 : 인증서 필터링(IssuerDN) 정보 세팅하기.
		*************************************************************************************/
		var setIssuerDNFilterInfo = function(strIssuerDN, callback) {
			var arrIssuerDN = strIssuerDN.split("|");
			var issuerDNList = [];
			
			for ( i=0; i < arrIssuerDN.length; i++ ) {
				var issuerDN = arrIssuerDN[i].substring(9, arrIssuerDN[i].length);				
				issuerDNList.push(issuerDN);
			}	
			
			sessionStorage.setItem("FILTER_ISSUER_DN", JSON.stringify(issuerDNList));
			
			if ( 'function' === typeof callback )
				callback();
		};
		
		/*************************************************************************************
		 # 함수 명 : setOIDAliasFilterInfo
		 # 설명 : 인증서 필터링(OID) 정보 세팅하기.
		*************************************************************************************/
		var setOIDAliasFilterInfo = function(strOIDAlias, callback) {
			// 여기서 alias에 매핑된 원래의 값으로 바꿔준다.								
			var OIDAliasList = strOIDAlias.split("|");			
			
			var OIDList = [];
			
			for ( var i=0; i < OIDAliasList.length; i++ ) {
				var OID = defaultConf.Certs.OID_Alias[OIDAliasList[i]];
				
				if ( 'undefined' !== typeof OID && '' !== OID ) {
					OIDList.push(OID);
				}
			}
			
			sessionStorage.setItem("FILTER_OID", JSON.stringify(OIDList));
			
			if ( 'function' === typeof callback )
				callback();
		};
				
		return{
			getSelectedCertInfo : getSelectedCertInfo,
			setSelectedCertInfo : setSelectedCertInfo,
			getSelectedReNewCertInfo : getSelectedReNewCertInfo,
			getCertAttributeList : getCertAttributeList,
			getCertificateInfo : getCertificateInfo,
			checkComplexPassword : checkComplexPassword,
			initCertInfo : initCertInfo,
			setIssuerDNFilterInfo : setIssuerDNFilterInfo,
			setOIDAliasFilterInfo : setOIDAliasFilterInfo
		};
	}());

	/*************************************************************************************
	 # 함수 명 : Configure
	*************************************************************************************/
	var Configure = (function(){

		//crosswebex properties 세팅. 사용X
		var setProperties = function(handleInfo){
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,
				function relayCallback(param){

					//GINI_LoadingIndicatorStop();
				},
				undefined,
				transferForm.IniRequest.getReqSetProperty	//crosswebex 처리
			);
		};

		// crosswebex에서 구간암호화 키 가져오기
		var getE2EPublicKey = function(handleInfo){
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,
				function relayCallback(param){
					// 공개키
					var cert = transferForm.IniResponse.getResPublicKey(param);

					handleInfo.serviceInfo.getCallback()(cert);

					//GINI_LoadingIndicatorStop();
				},
				undefined,
				transferForm.IniRequest.getReqPublicKeyE2E	//crosswebex 처리
			);
		}
		//버전체크
		var getExteralVersion = function(handleInfo){
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,

				function relayCallback(param, selectedBrowser){
					var major = "NOT_INSTALL";

					if(selectedBrowser){
						handleInfo.serviceInfo.getCallback()(major, selectedBrowser);
					}else{
						var jsonObj = transferForm.IniResponse.getResVersion(param);
						for(var key in jsonObj){
							var verInfo = jsonObj[key];
							var type = verInfo["TYPE"];
							if("1" === type){
								major = decodeURIComponent(verInfo["VERSION"]);
								break;
							}
						}

						if("NOT_INSTALL"!=major){
							handleInfo.serviceInfo.getCallback()(major);		// Final callback

							// 설치된 경우 구간 암호화를 위한 공개키를 요청 한다.
							if(defaultConf.System.EncryptedPacketMode
									&& !_ENVELOPED_INFO
									&& GINI_supportEncryptHtml5() //CrossWebEX클라이언트 구간암호화 지원 여부
									){
								// 브라우저, crosswebex 분기 처리
								relayExecutor(handleInfo,

									function relayCallback(param){
										_ENVELOPED_INFO = {};

										_ENVELOPED_INFO.publicKey = transferForm.IniResponse.getResPublicKey(param);
										_ENVELOPED_INFO.sessionSeed = getUniqThreadRandom(32);
									},

									undefined,
									transferForm.IniRequest.getReqPublicKey	//crosswebex 처리
								);
							}
						}
					}
				},

				undefined,
				transferForm.IniRequest.getReqVersion	//crosswebex 처리
			);

		};

		// crosswebex 디바이스 리스트 가져오기
		var getDeviceList = function(handleInfo){
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,

				function relayCallback(param){
					var storageSubList = transferForm.IniResponse.getResDeviceList(param);
					//Mobisign 감추기.
					for(storage in storageSubList){
						var attrList = storageSubList[storage];
						var devicSubId = decodeURIComponent(attrList.DEVICE_SUB);
						if(devicSubId === constants.Certs.STORAGE_PHONE_MOBISIGN){
							if(!(handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_LOGIN
									|| handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_SIGN)){
								storageSubList.splice(storage, 1);
							}
						}
					}
					handleInfo.serviceInfo.getCallback()(storageSubList, handleInfo.serviceInfo.getParameter("TargetParentNode"));
					//GINI_LoadingIndicatorStop();
				},
				undefined,
				transferForm.IniRequest.getReqDeviceList	//crosswebex 처리
			);
		};

		// crosswebex PC정보 요청하기. PC정보 추출의 경우 오래 걸리므로 미리 요청을 한 뒤 나중에 getPCInfo를 통해 가져온다.
		var gatterPCInfo = function(handleInfo){
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,
				function relayCallback(param){
					handleInfo.serviceInfo.getCallback()(param);
					//GINI_LoadingIndicatorStop();
				},
				undefined,
				transferForm.IniRequest.getReqGatterPCInfo	//crosswebex 처리
			);
		}

		// crosswebex 요청한 PC정보 가져오기. PC정보 추출의 경우 오래 걸리므로 미리 요청을 한 뒤 나중에 getPCInfo를 통해 가져온다.
		var getPCInfo = function(handleInfo){
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,
				function relayCallback(param){
					handleInfo.serviceInfo.getCallback()(param);
					//GINI_LoadingIndicatorStop();
				},
				undefined,
				transferForm.IniRequest.getReqGetPCInfo	//crosswebex 처리
			);
		}

		return {
			getExteralVersion : getExteralVersion,
			getDeviceList : getDeviceList,
			setProperties : setProperties,
			gatterPCInfo : gatterPCInfo,
			getPCInfo : getPCInfo,
			getE2EPublicKey : getE2EPublicKey
		};
	}());

	/*************************************************************************************
	 # 함수 명 : Manager
	 # 설명 : 인증서 관리.
	*************************************************************************************/
	var Manager = (function(){

		/*************************************************************************************
		 # 함수 명 : savePrivateCertificate
		 # 설명 : 인증서, 개인키 저장
		*************************************************************************************/
		var savePrivateCertificate = function(handleInfo, removeCallback) {
			// 키패드 처리
			if (!virtualKeyValue(handleInfo)) return;
			try {
				// 브라우저, crosswebex 분기 처리
				relayExecutor(handleInfo,

					function relayCallback(param){

						if(removeCallback){
							removeCallback();
						}

						handleInfo.serviceInfo.getCallback()(handleInfo);
						// 1. PC
						//	checkbox 체크 (USE_SESSION == false): 로컬스토리지에 저장
						//	checkbox 언체크 (USE_SESSION == true): 세션스토리지에 저장 뒤 로그인실행
						//	체크버튼이 없다면?? : 스토리지에 저장만.
						// 2. MOBILE
						//	로컬스토리지 저장과 동시에 로그인 실행.
						if(	handleInfo.optionInfo.getParameter("USE_SESSION") == false && !INI_getPlatformInfo().Mobile){

							// 초기화
							GINI_ProtectMgr.destroy();
						}
					},
					privateStorage.savePrivateCertificate,			//브라우저 처리시 실행될 메소드
					transferForm.IniRequest.getReqSaveCertificate	//crosswebex 처리
				);
			}catch(e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				throw e;
			}
		};


		/*************************************************************************************
		 # 함수 명 : saveAnotherCertificate
		 # 설명 : 인증서, 개인키 추가 저장
		 # 정범교
		*************************************************************************************/
		var saveAnotherCertificate = function(handleInfo, removeCallback) {
			// 키패드 처리
			virtualKeyValue(handleInfo);
			try {

				//첫번째 발급시 보안토큰 인 경우 처리
				if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
					saveAnotherChangePassword(handleInfo, "SECURE", "NONCE");
				}

				//추가 발급시 보안토큰인 경우 처리
				if(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_SECURITY_TOKEN){
					saveAnotherChangePassword(handleInfo, "NONCE", "SECURE");
					handleInfo.serviceInfo.setParameter("PWD", "");
					handleInfo.serviceInfo.setParameter("PWD_CNF", "");
				}



 				handleInfo.serviceInfo.setEventDeviceId(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID"));
 				handleInfo.serviceInfo.setDeviceSub(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_SUB_ID"));


				// 브라우저, crosswebex 분기 처리
				relayExecutor(handleInfo,

					function relayCallback(param){

						if(removeCallback){
							removeCallback();
						}

						handleInfo.serviceInfo.getCallback()(handleInfo);
						// 1. PC
						//	checkbox 체크 (USE_SESSION == false): 로컬스토리지에 저장
						//	checkbox 언체크 (USE_SESSION == true): 세션스토리지에 저장 뒤 로그인실행
						//	체크버튼이 없다면?? : 스토리지에 저장만.
						// 2. MOBILE
						//	로컬스토리지 저장과 동시에 로그인 실행.
						if(	handleInfo.optionInfo.getParameter("USE_SESSION") == false && !INI_getPlatformInfo().Mobile){

							// 초기화
							GINI_ProtectMgr.destroy();
						}
					},
					privateStorage.savePrivateCertificate,			//브라우저 처리시 실행될 메소드
					transferForm.IniRequest.getReqSaveCertificate	//crosswebex 처리
				);
			}catch(e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				throw e;
			}
		};

		/*************************************************************************************
		 # 함수 명 : saveAnotherChangePassword
		 # 설명 : 인증서 개인키 변경
		 # 정범교
		*************************************************************************************/
		var saveAnotherChangePassword = function(handleInfo, oldtype, newtype) {

			try {
					var change = coreFactory.Factory.Certs.anotherChangePassword(handleInfo, oldtype, newtype);
					handleInfo.serviceInfo.setParameter("PRIVATE_KEY", change.privateKey);
					handleInfo.serviceInfo.setParameter("CERTIFICATE", change.certificate);
					handleInfo.optionInfo.setParameter("USE_SESSION", false);

			}catch(e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				throw e;
			}
		};



		/*************************************************************************************
		 # 함수 명 : saveP12Certificate
		 # 설명 :
		*************************************************************************************/
		var saveP12Certificate = (function(handleInfo){
			// 키패드 처리
			if (!virtualKeyValue(handleInfo)) return;

			try {
				var encP12Cert = handleInfo.serviceInfo.getParameter("ENC_P12_CERT");
				// P12포맷 저장
				utils.Log.debug('PKCS#12 : ' + encP12Cert);
				//var priCert = coreFactory.Factory.PriKey.extractP12PriCert(encP12Cert, handleInfo.serviceInfo.getParameter("PWD"));
				var priCert = coreFactory.Factory.PriKey.extractP12PriCert(encP12Cert, "NONCE");
				utils.Log.debug('Private key : ' + priCert.privateKey);
				utils.Log.debug('Certificate : ' + priCert.certificate);

				handleInfo.serviceInfo.setParameter("PRIVATE_KEY", priCert.privateKey);
				handleInfo.serviceInfo.setParameter("CERTIFICATE", priCert.certificate);

				Manager.savePrivateCertificate(handleInfo);
			}catch(e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				throw e;
			}
		});

		/*************************************************************************************
		 # 함수 명 : saveCertPriV11
		 # 설명 :
		*************************************************************************************/
		var saveCertPriV11 = (function(handleInfo){
			try {
				// 키패드 처리
				virtualKeyValue(handleInfo);
				privateStorage.savePrivateCertificate(handleInfo, handleInfo.serviceInfo.getCallback(), "NONCE");
			}catch(e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				throw e;
			}
		});

		/*************************************************************************************
		 # 함수 명 : removeCertificate
		 # 설명 : 인증서 삭제
		*************************************************************************************/
		var removeCertificate = function(handleInfo){
			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
				// 키패드 처리
				virtualKeyValue(handleInfo);
			}
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,

				function relayCallback(param){
					//__LastHandleInfo.callback(param);
					if(handleInfo.serviceInfo.getCallback()){
						handleInfo.serviceInfo.getCallback()(param);
					}
				},

				privateStorage.removeCertificate,		//브라우저 처리시 실행될 메소드
				transferForm.IniRequest.getReqDeleteCertificate	//crosswebex 처리
			);
		};

		/*************************************************************************************
		 # 함수 명 : changePassword
		 # 설명 : 비밀번호 변경
		*************************************************************************************/
		var changePassword = function(handleInfo){

			try{
				// 키패드 처리
				if(virtualKeyValue(handleInfo)){

					//@lss e2e 복잡도 체크때문에 막아둠
					// 비밀번호 복잡도 체크(비밀번호 새로 입력이나 변경시에만 ex>인증서 발급, 재발급, 갱신, 비밀번호 변경 )
	//				Certs.checkComplexPassword(handleInfo.serviceInfo.getParameter("NEW_PWD"));
					// 브라우저, crosswebex 분기 처리
					relayExecutor(handleInfo,

						function relayCallback(param){
							//__LastHandleInfo.callback(param);
							handleInfo.serviceInfo.getCallback()(param);
							// 초기화
							GINI_ProtectMgr.destroy();
						},
						privateStorage.changePassword,		//브라우저 처리시 실행될 메소드
						transferForm.IniRequest.getReqChangeCertificate	//crosswebex 처리

					);
				}
			} catch (e){
				if(handleInfo.serviceInfo.getExceptionCallback()){
					handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
				}
				throw e;
			}
		};

		/*************************************************************************************
		 # 함수 명 : exportCertPriP12File
		 # 설명 : p12파일 내보내기.
		*************************************************************************************/
		var exportCertPriP12File = function(handleInfo){
			// 키패드 처리
			if (!virtualKeyValue(handleInfo)) return;;
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,

				function relayCallback(param){
					try {
						if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
							handleInfo.serviceInfo.setParameter("CERTIFICATE", param.certificate);
							handleInfo.serviceInfo.setParameter("KM_CERTIFICATE", param.kmCertificate);
							handleInfo.serviceInfo.setParameter("PRIVATE_KEY", param.privateKey);
							handleInfo.serviceInfo.setParameter("KM_PRIVATE_KEY", param.kmPrivateKey);

							var extTranId = getUniqThreadRandom(16);
							externalDeviceRequest(
									transferForm.IniRequest.getReqExportCertificate(handleInfo, extTranId, _ENVELOPED_INFO)
									);
						} else {
						}
						handleInfo.serviceInfo.getCallback()(param);
						// 초기화
						GINI_ProtectMgr.destroy();
					}catch(e){
						if(handleInfo.serviceInfo.getExceptionCallback()){
							handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
						}
						INI_HANDLE.handleMessage(e);
					}
				},
				privateStorage.exportCertPriP12File,		//브라우저 처리시 실행될 메소드
				transferForm.IniRequest.getReqExportCertificate	//crosswebex 처리
			);

		};

		/*************************************************************************************
		 # 함수 명 : exportCertPriP12
		 # 설명 : p12내보내기.
		*************************************************************************************/
		var exportCertPriP12 = function(handleInfo){
			// 키패드 처리
			virtualKeyValue(handleInfo);
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,

				function relayCallback(param){
					try {
						if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
							exportCertFile(param);
						} else {
							var resultData = transferForm.IniResponse.getResLoadCertificate(param);
							var selected = {};
							selected.privateKey = resultData.PRIVATE_KEY;
							selected.certificate = resultData.CERT;
							selected.kmPrivateKey = resultData.KM_PRIVATE_KEY;
							selected.kmCertificate = resultData.KM_CERT;

							//var p12b64 = coreFactory.Factory.PriKey.rebuildCertPriP12(selected, handleInfo.serviceInfo.getParameter("PWD"));
							var p12b64 = coreFactory.Factory.PriKey.rebuildCertPriP12(selected, "NONCE");
							// P12포맷 인증서 정보
							var cert = coreFactory.Factory.PriKey.extractP12Cert(p12b64);
							cert = coreFactory.Factory.Certs.parseCertAttributes(cert);

							var pkcs12 = {};
							pkcs12.fileName = cert.SUBJECT;
							pkcs12.p12b64 = p12b64;

							exportCertFile(pkcs12);
						}
						handleInfo.serviceInfo.getCallback()(param);
						// 초기화
						GINI_ProtectMgr.destroy();
					}catch(e){
						INI_HANDLE.handleMessage(e);
					}
				},
				privateStorage.exportCertPriP12,		//브라우저 처리시 실행될 메소드
				transferForm.IniRequest.getReqLoadCertificate	//crosswebex 처리
			);

			function exportCertFile(param){
				var p12 = document.createElement('a');
				p12.download = param.fileName + '.p12';
				p12.setAttribute("download", param.fileName + '.p12');
				p12.setAttribute('href', 'data:application/x-pkcs12;base64,' + param.p12b64);
				p12.style.display = 'none';
				p12.appendChild(document.createTextNode('Download'));
				document.body.appendChild(p12);
				p12.click();
			}
		};

		/*************************************************************************************
		 # 함수 명 : issueCertificate
		 # 설명 : 인증서 발급.(CMP 통신뒤 저장만 하므로 입력 키값만 체크)
		*************************************************************************************/
		var issueCertificate = function(handleInfo, pinOnly){
			// 키패드 처리
			if (pinOnly) {
				return virtualKeyValuePin(handleInfo);
			}else {
				return virtualKeyValue(handleInfo);
			}

		};

		/*************************************************************************************
		 # 함수 명 : reIssueCertificate
		 # 설명 : 인증서 재발급.(CMP 통신뒤 저장만 하므로 입력 키값만 체크)
		*************************************************************************************/
		var reIssueCertificate = function(handleInfo){
			// 키패드 처리
			return virtualKeyValue(handleInfo);
		};

		/*************************************************************************************
		 # 함수 명 : updateCertificate
		 # 설명 : 인증서 갱신
		*************************************************************************************/
		var updateCertificate = function(handleInfo){
			if(handleInfo.serviceInfo.getEventDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
				// 키패드 처리
				virtualKeyValue(handleInfo);
				// 브라우저, crosswebex 분기 처리
				relayExecutor(
						handleInfo,
						function relayCallback(param){
							handleInfo.serviceInfo.getCallback()(param);
						},
						undefined,
						transferForm.IniRequest.getReqUpdateCertificate	//crosswebex 처리
					);
			} else {
				// 키패드 처리
				return virtualKeyValue(handleInfo);
			}
		};

		/*************************************************************************************
		 # 함수 명 : revokeCertificate
		 # 설명 : 인증서 폐기 처리
		*************************************************************************************/
		var revokeCertificate = function(handleInfo){
			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
				// 토큰일 경우 PIN번호를 입력.
				virtualKeyValue(handleInfo);
			}
			// 브라우저, crosswebex 분기 처리
			relayExecutor(
				handleInfo,
				function relayCallback(param){
					handleInfo.serviceInfo.getCallback()(param);
				},
				privateStorage.revokeCertificate,		//브라우저 처리시 실행될 메소드
				transferForm.IniRequest.getReqRevokeCertificate //crosswebex 처리
			);
		}

		/*************************************************************************************
		 # 함수 명 : copyCertificate
		 # 설명 : 인증서 복사.
		*************************************************************************************/
		var copyCertificate = function(handleInfo){
			// 키패드 처리
			if (!virtualKeyValue(handleInfo)) return;

			var transFormAction;
			// crosswebex 분기처리
			if(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_BROWSER){
				// 복사가 되어질 곳이 브라우저면 crosswebex에서 인증서 정보 추출 뒤 저장
				transFormAction = transferForm.IniRequest.getReqLoadCertificate;
			} else {
				// 복사가 crosswebex내에서 이루어질 경우 copy 명령을 내림.
				transFormAction = transferForm.IniRequest.getReqCopyCertificate;
			}
			// 브라우저, crosswebex 분기 처리
			relayExecutor(
				handleInfo,
				function relayCallback(param){
					try {
						if(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID") === constants.Certs.STORAGE_BROWSER){
							// 복사가 되어질 곳이 브라우저 이므로 webStorage에 저장함.
							var temp = transferForm.IniResponse.getResLoadCertificate(param);
							var saveHandleInfo = require("../common/handleManager").newHandleInfo();
							saveHandleInfo.serviceInfo.setEventDeviceId(constants.Certs.STORAGE_BROWSER);
							saveHandleInfo.serviceInfo.setParameter("PWD", handleInfo.serviceInfo.getParameter("PWD"));
							saveHandleInfo.serviceInfo.setParameter("CERTIFICATE", temp.CERT);
							saveHandleInfo.serviceInfo.setParameter("PRIVATE_KEY", temp.PRIVATE_KEY);
							saveHandleInfo.serviceInfo.setParameter("KM_CERTIFICATE", temp.KM_CERT);
							saveHandleInfo.serviceInfo.setParameter("KM_PRIVATE_KEY", temp.KM_PRIVATE_KEY);

							saveHandleInfo.optionInfo.setParameter("USE_SESSION", false);

							privateStorage.savePrivateCertificate(saveHandleInfo, handleInfo.serviceInfo.getCallback(), "NONCE");
						} else {
							// 저장완료처리.
							handleInfo.serviceInfo.getCallback()();
						}
					}catch(e){
						if(handleInfo.serviceInfo.getExceptionCallback()){
							handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
						}
						INI_HANDLE.handleMessage(e);
					} finally {
						// 초기화
						GINI_ProtectMgr.destroy();
					}
				},
				privateStorage.copyCertificateInfo,	//브라우저 처리시 실행될 메소드
				transFormAction //crosswebex 처리
			);
		}

		/*************************************************************************************
		 # 함수 명 : makeExportData
		 # 설명 : 내보내기 데이터 생성.(p12형태)
		*************************************************************************************/
		var makeExportData = function(handleInfo){
			// 키패드 처리
			if (!virtualKeyValue(handleInfo)) return;
			// 브라우저, crosswebex 분기 처리
			relayExecutor(handleInfo,
				function relayCallback(param){
					// 콜백 세팅.
					try {
						if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
							//브라우저의 경우 스크립트를 통해 만들어진 p12파일을 세팅
							handleInfo.serviceInfo.getCallback()(param["p12b64"]);
						}else{
							// crosswebex를 통해 만들어진 p12파일을 세팅.
							var resultData = transferForm.IniResponse.getResLoadCertificate(param);
							var selected = {};
							selected.privateKey = resultData.PRIVATE_KEY;
							selected.certificate = resultData.CERT;
							selected.kmPrivateKey = resultData.KM_PRIVATE_KEY;
							selected.kmCertificate = resultData.KM_CERT;

							//var p12b64 = coreFactory.Factory.PriKey.rebuildCertPriP12(selected, handleInfo.serviceInfo.getParameter("PWD"));
							var p12b64 = coreFactory.Factory.PriKey.rebuildCertPriP12(selected, "NONCE");
							handleInfo.serviceInfo.getCallback()(p12b64);
						}
					} catch(e){
						if(handleInfo.serviceInfo.getExceptionCallback()){
							handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
						}
						INI_HANDLE.handleMessage(e);
					} finally {
						//20170115
							//GINI_LoadingIndicatorStop();
					}
				},
				privateStorage.exportCertPriP12,				//브라우저 처리시 실행될 메소드
				transferForm.IniRequest.getReqLoadCertificate	//crosswebex 처리
			);
		};

		return {
			changePassword : changePassword,
			removeCertificate : removeCertificate,
			savePrivateCertificate : savePrivateCertificate,
			saveAnotherCertificate : saveAnotherCertificate, //정범교
			saveP12Certificate : saveP12Certificate,
			saveCertPriV11 : saveCertPriV11,
			exportCertPriP12 : exportCertPriP12,
			exportCertPriP12File : exportCertPriP12File,
			issueCertificate : issueCertificate,
			reIssueCertificate : reIssueCertificate,
			updateCertificate : updateCertificate,
			revokeCertificate : revokeCertificate,
			copyCertificate : copyCertificate,
			makeExportData : makeExportData
		};
	}());

	return{
		Signature : Signature,
		Certs : Certs,
		Manager : Manager,
		Configure : Configure
	};

});
