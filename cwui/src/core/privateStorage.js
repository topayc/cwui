/*************************************************************************************
 # Copyright(c) Initech
 # 설명 :
 # 이력
  - [2015-10-01] : 최초 구현
*************************************************************************************/
/**
 * 인증서 및 개인키 저장
 */
define([
        '../core/coreFactory',
        '../conf/defaultConf',
        '../main/constants',
        '../conf/msgFactory',
        '../core/utils',
        '../conf/certificates',
        '../common/cross_domain/crossStorage',
        '../core/iniException'
        ], function (coreFactory, defaultConf, constants, msgFactory, utils, certificates, crossStorage, iniException) {


	var _CrossDomainlRepository = crossStorage.Repository();

	var _LocalRepository = (function(){

		var write = function(isSession, certPri){
			if(isSession){
				sessionStorage.setItem(constants.System.INI_PRIVATE_STORAGE, JSON.stringify(certPri));
			}else{
				localStorage.setItem(constants.System.INI_PRIVATE_STORAGE, JSON.stringify(certPri));
			}
		};

		function remove(isSession){
			if(isSession){
				sessionStorage.removeItem(constants.System.INI_PRIVATE_STORAGE);
			}else{
				localStorage.removeItem(constants.System.INI_PRIVATE_STORAGE);
			}
		}

		var readStorage = function (isSession){
			var storageVal = null;

			if(isSession){
				storageVal = sessionStorage.getItem(constants.System.INI_PRIVATE_STORAGE);
			}else{
				storageVal = localStorage.getItem(constants.System.INI_PRIVATE_STORAGE);
			}

			if(storageVal!==null){
				storageVal = JSON.parse(storageVal);
			}

			return storageVal;
		};

		var writeStorage = function(certPriAttr, isSession){
			try{
				var certId = (certPriAttr.INHERENT_A[constants.Certs.ATTR_ISSUER] + '-' + certPriAttr.INHERENT_A[constants.Certs.ATTR_SERIAL]).replace(/ /gi, "_");

				var storageVal = readStorage(isSession);

				if(storageVal==null){
					var newPriCert = {};
					newPriCert[certId] = certPriAttr;

					write(isSession, newPriCert);
				}else{

					var savedPriCert = {};
       				var isOverWrite = false;
					// 중복 제거 :
					for(certKey in storageVal){
						var saved = storageVal[certKey];

						if(certPriAttr.INHERENT_A.SUBJECT_CN === saved.INHERENT_A.SUBJECT_CN){
							// 날짜 비교 하여 덮어 쓰기
							try{
								var oldDt = utils.Convert.stringToDate(saved.INHERENT_A.BEFORE_DT);
								var nowDt = utils.Convert.stringToDate(certPriAttr.INHERENT_A.BEFORE_DT);
								if(nowDt >= oldDt){
									savedPriCert[certId] = certPriAttr;
									isOverWrite = true;
								}else{
									savedPriCert[certKey] = saved;
								}
							}catch(ex){
								savedPriCert[certId] = certPriAttr;
								isOverWrite = true;
							}

						}else{
							savedPriCert[certKey] = saved;
						}
					}

					if(!isOverWrite){
						savedPriCert[certId] = certPriAttr;
					}

       				remove(isSession);
       				write(isSession, savedPriCert);
				}
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3010');
			}
		};

		var removeStorage = function(certId, isSession){
			try{
				utils.Log.debug('remove certificate id : ' + certId);

				var storageVal = readStorage(isSession);

				if(storageVal!==null){
					delete storageVal[certId];

					remove(isSession);
					write(isSession, storageVal);
				}
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3011');
			}
		};

		return{
			readStorage : readStorage,
			writeStorage : writeStorage,
			removeStorage : removeStorage
		};
	}());


	/**
	 * @desc 저장소 삭제 후 쓰기
	 */
	function writeRepository(priCert, isSession){

		try{
			//var certId = priCert.INHERENT_A[constants.Certs.ATTR_ISSUER] + '-' + priCert.INHERENT_A[constants.Certs.ATTR_SERIAL];

			// 세션일 경우 세션에만 저장한다.
			if(isSession){
				_LocalRepository.writeStorage(priCert, isSession);
			} else {
				// 세션이 아닐경우 Local 및 CrossDomain 모두 저장한다.
				_LocalRepository.writeStorage(priCert, isSession);
				_CrossDomainlRepository.setItem(priCert);
			}

		}catch(e){
			new iniException.Error.newThrow(e, 'ERR_1002');
		}
	};

	function readRepository(handleInfo, callback){
		// local storage
		var sessionAttrs = _LocalRepository.readStorage(true);
		var localAttrs = _LocalRepository.readStorage(false);
		var mergeAtrrs = utils.Collection.uniMerge(localAttrs, sessionAttrs);

		var param = {};
		param.CROSS_LOCAL = mergeAtrrs;
		// Cross Domain 전달 시 TransactionId 전달
		param.transactionId = handleInfo.getTransactionId();
		// cross domain storage 병합
		_CrossDomainlRepository.getItem(param, callback);
	};

	//!TO-DO : relayCallback 에 handleInfo 전달
	/**
	 * @desc : 최종 수행
	 */
	// completeCallback -> storageCallback으로 변경 할 것
	function completeExecutor(handleInfo, relayCallback, completeCallback){
		if(completeCallback){
			readRepository(handleInfo, completeCallback);
		}else{
			if(relayCallback){
				relayCallback(handleInfo);
			}
		}
	};

	function decryptedCertPri(encPriCert, pwd, completeInnerCallback){
		try{
			var priKey = coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_P);
			var kmPriKey;
			if(encPriCert.INHERENT_KP){
				kmPriKey = coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_KP); // KM개인키
			}

			var salt =  coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_S);

			var decSalt = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(salt), pwd);
			decSalt = decSalt.getBytes();

			var derived = encPriCert.INHERENT_D;

			function derivedKeyCallback(derivedPwd){
				var selected = {};
				try {
					var derived;
					if(derivedPwd !== pwd){
						// 서버 유도키
						derivedPwd = (derivedPwd.replace(/\r/g, "")).replace(/\n/g, "");
						derived = derivedPwd.substring(derivedPwd.length-8, derivedPwd.length);
						pwd = derivedPwd.substring(0, derivedPwd.length-8);
					}
					utils.Log.debug('- derived : ' + derived);
					utils.Log.debug('- pwd : ' + pwd);

					var decPri = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(priKey), pwd, decSalt) + '';
					var decKmPri = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(kmPriKey), pwd, decSalt) + '';

					var decCert = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(
							coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_C)), encPriCert.INHERENT_S) + '';
					var decKmCert;
					if(encPriCert.INHERENT_KC){
						decKmCert = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(
							coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_KC)), encPriCert.INHERENT_S) + ''; // KM인증서
					}
					selected.privateKey = decPri;
					selected.certificate = decCert;
					selected.kmPrivateKey = decKmPri;
					selected.kmCertificate = decKmCert;

				} catch (e){
					new iniException.Warn.newThrow(e, 'WARN_1010');
				}

				completeInnerCallback(selected);
			};

			if(derived !== '00000000'){
				createDerivedKey(derived, pwd, decSalt, derivedKeyCallback);
			}else{
				derivedKeyCallback(pwd);
			}

		}catch(e){
			throw e;
//			INI_HANDLE.handleMessage(e);
		}
	};

	var getCertAttributeList = function(handleInfo, relayCallback){

		completeExecutor (
				handleInfo,
				relayCallback,

				function completeCallback(param, value){
					var certAttr = {};
					var mergeAtrrs;
					if(param){
						mergeAtrrs = utils.Collection.uniMerge(value, param.CROSS_LOCAL);
					}else{
						mergeAtrrs = value;
					}
					for(attr in mergeAtrrs){
						var cerPri = mergeAtrrs[attr];
						certAttr[attr] = cerPri.INHERENT_A;
					}

					//var handleInfo = require("../common/handleManager").getHandleInfo(param.transactionId);
					/*  */
					//handleInfo.serviceInfo.getRelayCallback()(certAttr);
					relayCallback(certAttr);
				}
		);

	};


	var selectedSignature = function(handleInfo, relayCallback){

		completeExecutor (
				handleInfo,
				relayCallback,

				function completeCallback(param, value){
					try{
						//var handleInfo = require("../common/handleManager").getHandleInfo(param.transactionId);
						var encPriCert;
						if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
							encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
						} else {
							encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
						}

						function completeInnerCallback(selected){
							try{
								var vidAttr = {};

                                var orgData = handleInfo.requestInfo.getParameter("ORG_DATA");

                                if ( handleInfo.requestInfo.getParameter("MULTI_SIGN") == "TRUE" ) {
                                    var multiSignIndex = handleInfo.requestInfo.getParameter("MULTI_INDEX");
                                    var arrOrgData= handleInfo.requestInfo.getParameter("MULTI_ORG_DATA");
                                    orgData = arrOrgData[multiSignIndex];
                                    multiSignIndex++;
                                    handleInfo.requestInfo.setParameter("MULTI_INDEX", multiSignIndex);
                                }

								if(constants.Signature.SIGN_PKCS7 === handleInfo.optionInfo.getParameter("SIGN_KIND")){
									var signedData = coreFactory.Factory.Signature.pkcs7Sign(selected,
																//handleInfo.serviceInfo.getParameter("PWD"),
																"NONCE",
																orgData, //handleInfo.requestInfo.getParameter("ORG_DATA"),
																//getServerDateTime(),
																handleInfo.optionInfo.getParameter("SERVER_TIME"),
																vidAttr,
																handleInfo.optionInfo
																);
									// PKCS#7 데이터 생성 이후 전체 원문을 PKCS#1서명 하는 경우
//									var dataSignatureCallback = handleInfo.optionInfo.getParameter("PKCS7DATA_TO_PKCS1");
//									if(dataSignatureCallback){
//
//										var orgData = dataSignatureCallback(vidAttr);
//
//										vidAttr["PKCS7DATA_FROM_PKCS1"] = coreFactory.Factory.Signature.pkcs1Sign(selected,
//												handleInfo.serviceInfo.getParameter("PWD"),
//												orgData, // 본문 페이지의 input 속성을 PKCS1서명 한다.
//												null,
//												handleInfo.optionInfo.getParameter("P1_CHAR_SET"),
//												handleInfo.optionInfo.getParameter("HASH_ALG"));
//									}
								}else{
									coreFactory.Factory.Signature.pkcs1Sign(selected,
																//handleInfo.serviceInfo.getParameter("PWD"),
																"NONCE",
																orgData, //handleInfo.requestInfo.getParameter("ORG_DATA"),
																vidAttr,
																handleInfo.optionInfo.getParameter("P1_CHAR_SET"),
																handleInfo.optionInfo.getParameter("HASH_ALG"));
								}

								//추가 PKCS#1서명
								if(handleInfo.requestInfo.getParameter("ADD_PKCS1")){
									vidAttr[constants.Login.PKCS1_SIGNATURE] = coreFactory.Factory.Signature.pkcs1Sign(selected,
																			handleInfo.serviceInfo.getParameter("PWD"),
																			handleInfo.requestInfo.getParameter("ADD_PKCS1"),
																			null,
																			handleInfo.optionInfo.getParameter("P1_CHAR_SET"),
																			handleInfo.optionInfo.getParameter("HASH_ALG"));
								}
                                orgData = "";								
								relayCallback(vidAttr, selected);
							}catch(e){
								INI_HANDLE.handleMessage(e);
							}
						};

						//decryptedCertPri(encPriCert, handleInfo.serviceInfo.getParameter("PWD"), completeInnerCallback);
						decryptedCertPri(encPriCert, GINI_ProtectMgr.extract("NONCE"), completeInnerCallback);
					}catch(e){
						if(handleInfo.serviceInfo.getExceptionCallback()){
							handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
						}
						INI_HANDLE.handleMessage(e);
					}
				}
		);

	};

	function createDerivedKey(drivedRndHex, pwd, rnd, derivedKeyCallback){
		try{
			var derivedUrl = defaultConf.System.UrlAddress[constants.System.URL_DERIVED_KEY];
			if(derivedUrl){
				var hashedPwd = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, pwd);
				var hashedRnd = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA512, rnd);

				var bufPwdRnd = coreFactory.Factory.Util.createBuffer();
				bufPwdRnd.putBytes(hashedPwd);
				bufPwdRnd.putBytes(hashedRnd);

				var hashed = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, bufPwdRnd.getBytes());
				utils.Log.debug('- drivedRndHex[' + drivedRndHex.length + '] : ' + drivedRndHex);
				utils.Log.debug('- hashed[' + hashed.length + '] : ' + coreFactory.Factory.Util.bytesToHex(hashed));

				var hexPost = drivedRndHex + coreFactory.Factory.Util.bytesToHex(hashed);
				var postData = 'random=' + hexPost;
				utils.Log.debug('request post hex : ' + postData);
				utils.Log.debug('derivedUrl : ' + derivedUrl);

				// callback에 유도된 pwd를 넘겨 준다.
				derivedKeyCallback((utils.Transfer.xmlHttpRequest(derivedUrl, postData)).toString());
//				utils.Transfer.jsonTextRequest(derivedUrl, postData, derivedKeyCallback);
			}
		}catch(e){
			new iniException.Error.newThrow(e, 'ERR_3014');
		}
	};

	var getCertificateInfo = function(handleInfo, relayCallback){

		completeExecutor (
				handleInfo,
				relayCallback,

				function completeCallback(param, value){

					var certId = handleInfo.serviceInfo.getParameter("CERT_ID");
					var encPriCert;
					var decCert;

					if(certId){
						if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
							encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
						} else {
							encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
						}
						decCert = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(coreFactory.Factory.Util.createBuffer(
								coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_C))), encPriCert.INHERENT_S);
					}else{
						/* 주의 : 인증서 폐기 시 인증서 삭제에 대한 상세보기는 SerialNo만 제공 한다.*/
						var caName = handleInfo.requestInfo.getParameter("CA_NAME").toUpperCase();

						if(handleInfo.requestInfo.getParameter("CERTIFICATE")){
							decCert = handleInfo.requestInfo.getParameter("CERTIFICATE");
						} else {
							var certSerial = handleInfo.requestInfo.getParameter("CERT_SERIAL").toUpperCase();
							for(key in value){
								handleInfo.serviceInfo.setParameter("CERT_ID", key);
								var certInfo = value[key];
								if((certInfo.INHERENT_A.ISSUER.toUpperCase() == caName) && (certInfo.INHERENT_A.SERIAL.toUpperCase() == certSerial)){
									encPriCert = certInfo;
									break;
								}
							}
							decCert = coreFactory.integrityDecrypt(coreFactory.Factory.Util.createBuffer(coreFactory.Factory.Util.createBuffer(
									coreFactory.Factory.Util.hexToBytes(encPriCert.INHERENT_C))), encPriCert.INHERENT_S);
						}
					}

					var detail;
					if(handleInfo.optionInfo.getParameter("CERT_VIEW_TYPE") == constants.Certs.CERTIFICATE_DETAIL_ATTR){
						detail = coreFactory.Factory.Certs.certificateDetail(decCert);
					} else {
						detail = coreFactory.Factory.Certs.parseCertAttributes(decCert);
					}
					relayCallback(detail);
				}
		);
	};

	var getYesssignCertificate = function(handleInfo, relayCallback){
		/**/
		completeExecutor (
			handleInfo,
			relayCallback,

			function completeCallback(param, value){
				try {
					var encPriCert;
					if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
						encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
					} else {
						encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
					}

					function completeInnerCallback(selected){
						var certificate, privateKey;
						certificate = selected.certificate;
						privateKey = coreFactory.Factory.Util.privateKeyPemTagRemove(selected.privateKey).replace(/\r/g, "").replace(/\n/g, "").trim();
						relayCallback(certificate, privateKey);
					};
					decryptedCertPri(encPriCert, GINI_ProtectMgr.extract("NONCE"), completeInnerCallback);
				}catch(e){
					if(handleInfo.serviceInfo.getExceptionCallback()){
						handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
					}
					INI_HANDLE.handleMessage(e);
				}
			}
		);
	};



	/**
	 * @desc : 인증서 및 개인키 저장
	 * @param priKey : 개인키
	 * @param cert : 인증서
	 * @param pwd : 사용자 비밀번호
	 */
	var savePrivateCertificate = function(handleInfo, relayCallback, nonceType) {

		try{
			if(!nonceType){ //인증서 가져오기 시 nonceType없다. 비번만 필요 함으로 NONCE로 처리 한다.
				nonceType = "NONCE";
			}

			var priKey = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
			priKey = coreFactory.Factory.Util.privateKeyPemTagAdd(priKey);

			//coreFactory.Factory.PriKey.extractRsaPrivateKey(priKey, handleInfo.serviceInfo.getParameter("PWD"));
			//coreFactory.Factory.PriKey.extractRsaPrivateKey(priKey, GINI_ProtectMgr.extract(nonceType));
			coreFactory.Factory.PriKey.extractRsaPrivateKey(priKey, nonceType);

			var cert = handleInfo.serviceInfo.getParameter("CERTIFICATE");
			cert = coreFactory.Factory.Util.certPemTagAdd(cert);

			handleInfo.serviceInfo.setParameter("CERTIFICATE", cert);
			handleInfo.serviceInfo.setParameter("PRIVATE_KEY", priKey);

			var encPwd = GINI_ProtectMgr.extract(nonceType);

			var rnd = coreFactory.Factory.Util.getRandomBytesSync(128);

			var drivedRnd = new Uint8Array([0x00, 0x00, 0x00, 0x00]);


			function derivedKeyCallback(derivedPwd){
				var derived = '00000000';
				derivedPwd = (derivedPwd.replace(/\r/g, "")).replace(/\n/g, "");
				//if(derivedPwd !== handleInfo.serviceInfo.getParameter("PWD")){
				if(derivedPwd !== GINI_ProtectMgr.extract(nonceType)){
					// 서버 유도키
					derived = derivedPwd.substring(derivedPwd.length-8, derivedPwd.length);
					encPwd = derivedPwd.substring(0, derivedPwd.length-8);
				}
				utils.Log.debug('- derived : ' + derived);
				utils.Log.debug('- pwd : ' + encPwd);

				// 인증서 속성 정보
				var certAttr = coreFactory.Factory.Certs.parseCertAttributes(handleInfo.serviceInfo.getParameter("CERTIFICATE"));

				var encPri = coreFactory.integrityEncrypt(coreFactory.Factory.Util.createBuffer(handleInfo.serviceInfo.getParameter("PRIVATE_KEY")), encPwd, rnd);
				var encKmPri;
				if(handleInfo.serviceInfo.getParameter("KM_PRIVATE_KEY")){
					encKmPri = coreFactory.integrityEncrypt(coreFactory.Factory.Util.createBuffer(handleInfo.serviceInfo.getParameter("KM_PRIVATE_KEY")), encPwd, rnd);
					encKmPri = coreFactory.Factory.Util.bytesToHex(encKmPri);
				}

				//rnd = coreFactory.integrityEncrypt(coreFactory.Factory.Util.createBuffer(rnd), handleInfo.serviceInfo.getParameter("PWD"));
				rnd = coreFactory.integrityEncrypt(coreFactory.Factory.Util.createBuffer(rnd), GINI_ProtectMgr.extract(nonceType));

				var rndHex = coreFactory.Factory.Util.bytesToHex(rnd);

				var encCert = coreFactory.integrityEncrypt(coreFactory.Factory.Util.createBuffer(handleInfo.serviceInfo.getParameter("CERTIFICATE")), rndHex);
				var encKmCert;
				if(handleInfo.serviceInfo.getParameter("KM_CERTIFICATE")){
					encKmCert = coreFactory.integrityEncrypt(coreFactory.Factory.Util.createBuffer(handleInfo.serviceInfo.getParameter("KM_CERTIFICATE")), rndHex);
					encKmCert = coreFactory.Factory.Util.bytesToHex(encKmCert);
				}

				encPri = coreFactory.Factory.Util.bytesToHex(encPri);
				encCert = coreFactory.Factory.Util.bytesToHex(encCert);

				var priCert = {
					IS_SESSION : handleInfo.optionInfo.getParameter("USE_SESSION"),
					INHERENT_D : derived, 		// 유도키 ID
					INHERENT_S : rndHex,		// 암호화된 random
					INHERENT_P : encPri,		// 암호화된 개인키
					INHERENT_C : encCert,		// 암호화된 인증서
					INHERENT_KP : encKmPri,		// 암호화된 KM 개인키
					INHERENT_KC : encKmCert,	// 암호화된 KM 인증서
					INHERENT_A : certAttr		// 인증서 속성
				};
				var makeCertId = certAttr[constants.Certs.ATTR_ISSUER] + '-' + certAttr[constants.Certs.ATTR_SERIAL];
				makeCertId = makeCertId.replace(/ /gi, "_");
				handleInfo.serviceInfo.setParameter("CERT_ID", makeCertId);
				writeRepository(priCert, handleInfo.optionInfo.getParameter("USE_SESSION"));

				/**/
				completeExecutor (
						handleInfo,
						relayCallback
				);
			};

			//createDerivedKey(coreFactory.Factory.Util.bytesToHex(drivedRnd), handleInfo.serviceInfo.getParameter("PWD"), rnd, derivedKeyCallback);
			createDerivedKey(coreFactory.Factory.Util.bytesToHex(drivedRnd), GINI_ProtectMgr.extract(nonceType), rnd, derivedKeyCallback);

		}catch(e){
			new iniException.Error.newThrow(e, 'ERR_3009');
		}
	};

	var exportCertPriP12File = function(handleInfo, relayCallback){
		/**/
		completeExecutor (
			handleInfo,
			relayCallback,

			function completeCallback(param, value){
				try {
					var encPriCert;
					if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
						encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
					} else {
						encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
					}

					function completeInnerCallback(selected){
						relayCallback(selected);
					};
					//decryptedCertPri(encPriCert, handleInfo.serviceInfo.getParameter("PWD"), completeInnerCallback);
					decryptedCertPri(encPriCert, GINI_ProtectMgr.extract("NONCE"), completeInnerCallback);

				}catch(e){
					if(handleInfo.serviceInfo.getExceptionCallback()){
						handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
					}
					INI_HANDLE.handleMessage(e);
				}
			}
		);
	};

	var exportCertPriP12 = function(handleInfo, relayCallback){
		/**/
		completeExecutor (
			handleInfo,
			relayCallback,

			function completeCallback(param, value){
				try {
					var encPriCert;
					if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
						encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
					} else {
						encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
					}

					function completeInnerCallback(selected){
						//var p12b64 = coreFactory.Factory.PriKey.rebuildCertPriP12(selected, handleInfo.serviceInfo.getParameter("PWD"));
						var p12b64 = coreFactory.Factory.PriKey.rebuildCertPriP12(selected, "NONCE");

						var certArrt = encPriCert.INHERENT_A;
						var fileName = certArrt[constants.Certs.ATTR_SUBJECT];

						var pkcs12 = {};
						pkcs12.fileName = fileName;
						pkcs12.p12b64 = p12b64;

						relayCallback(pkcs12);
					};
					//decryptedCertPri(encPriCert, handleInfo.serviceInfo.getParameter("PWD"), completeInnerCallback);
					decryptedCertPri(encPriCert, GINI_ProtectMgr.extract("NONCE"), completeInnerCallback);

				}catch(e){
					if(handleInfo.serviceInfo.getExceptionCallback()){
						handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
					}
					INI_HANDLE.handleMessage(e);
				}
			}
		);
	};

	var removeCertificate = function(handleInfo, relayCallback){
		_CrossDomainlRepository.removeItem(handleInfo.serviceInfo.getParameter("CERT_ID"));
		_LocalRepository.removeStorage(handleInfo.serviceInfo.getParameter("CERT_ID"), false);
		_LocalRepository.removeStorage(handleInfo.serviceInfo.getParameter("CERT_ID"), true);

		/**/
		completeExecutor (
				handleInfo,
				relayCallback
		);
	};

	var changePassword = function(handleInfo, relayCallback){
		/**/
		try {
			completeExecutor (
				handleInfo,
				relayCallback,

				function completeCallback(param, value){
					try{
						var encPriCert;
						if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
							encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
						} else {
							encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
						}

						function completeInnerCallback(selected){
							var change = coreFactory.Factory.Certs.changePassword(selected,
									"NONCE",
									"NEW_NONCE");
									//handleInfo.serviceInfo.getParameter("PWD"),
									//handleInfo.serviceInfo.getParameter("NEW_PWD"));

							handleInfo.serviceInfo.setParameter("PRIVATE_KEY", change.privateKey);
							handleInfo.serviceInfo.setParameter("CERTIFICATE", change.certificate);
							handleInfo.serviceInfo.setParameter("PWD", handleInfo.serviceInfo.getParameter("NEW_PWD"));
							handleInfo.optionInfo.setParameter("USE_SESSION", false);

							savePrivateCertificate(handleInfo, relayCallback, "NEW_NONCE");
						}

						//decryptedCertPri(encPriCert, handleInfo.serviceInfo.getParameter("PWD"), completeInnerCallback);
						decryptedCertPri(encPriCert, GINI_ProtectMgr.extract("NONCE"), completeInnerCallback);

					}catch(e){
						if(handleInfo.serviceInfo.getExceptionCallback()){
							handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
						}
						INI_HANDLE.handleMessage(e);
					}
				}
			);
		}catch(e){
			new iniException.Error.newThrow(e, 'ERR_6003');
		}

	};

	var copyCertificateInfo = function(handleInfo, relayCallback){
		try {
			completeExecutor (
				handleInfo,
				relayCallback,

				function completeCallback(param, value){
					try{
						var encPriCert;
						if(value && value[handleInfo.serviceInfo.getParameter("CERT_ID")]){
							encPriCert = value[handleInfo.serviceInfo.getParameter("CERT_ID")];
						} else {
							encPriCert = param.CROSS_LOCAL[handleInfo.serviceInfo.getParameter("CERT_ID")];
						}

						function completeInnerCallback(selected){

							var privateKey = selected.privateKey;
							privateKey = privateKey.substring(privateKey.indexOf(""), privateKey.indexOf(""));

							handleInfo.serviceInfo.setParameter("CERTIFICATE", selected.certificate);
							handleInfo.serviceInfo.setParameter("PRIVATE_KEY", selected.privateKey);
							handleInfo.optionInfo.setParameter("USE_SESSION", false);

							relayCallback(selected);
						}

						//decryptedCertPri(encPriCert, handleInfo.serviceInfo.getParameter("PWD"), completeInnerCallback);
						decryptedCertPri(encPriCert, GINI_ProtectMgr.extract("NONCE"), completeInnerCallback);
					}catch(e){
						if(handleInfo.serviceInfo.getExceptionCallback()){
							handleInfo.serviceInfo.getExceptionCallback()(handleInfo);
						}
						INI_HANDLE.handleMessage(e);
					}
				}
			);
		}catch(e){
			new iniException.Error.newThrow(e, 'ERR_6004');
		}

	};

	var issueCertificate = function(handleInfo, relayCallback){
		var rnd = coreFactory.Factory.Util.encode64(coreFactory.Factory.Util.getRandomBytesSync(32));

		var postdata = "CA_NAME=" + handleInfo.requestInfo.getParameter("CA_NAME");
		postdata = postdata + "&CA_IP=" + handleInfo.requestInfo.getParameter("CA_IP");
		postdata = postdata + "&CA_PORT=" + handleInfo.requestInfo.getParameter("CA_PORT");
		postdata = postdata + "&REF_VALUE=" + handleInfo.requestInfo.getParameter("REF_VALUE");
		postdata = postdata + "&AUTH_CODE=" + handleInfo.requestInfo.getParameter("AUTH_CODE");
		postdata = postdata + "&RND=" + encodeURIComponent(rnd);

		var url = defaultConf.System.UrlAddress['CERT_CMP_ISSUE'];
		var priCert = utils.Transfer.xmlHttpRequest(url, postdata);
		//priCert = priCert.trim().replace(/\r/g, "").replace(/\n/g, "");
		priCert = priCert.toString().trim();
		priCert = priCert.split("||");

		var issue = {};
		issue.privateKey = priCert[0];
		issue.certificate = priCert[1];

		/* 주의 : 개인키는 RND값으로 암호화 됨으로 사용자 비번으로 변경이 필요 하다.*/
		var change = coreFactory.Factory.Certs.changePassword(issue, rnd, handleInfo.serviceInfo.getParameter("PWD"));

		var jsonObj = {};
		jsonObj["PARAMS"] = {"PRIVATE_KEY" : change.privateKey, "CERT" : change.certificate};

		relayCallback(jsonObj);
	};
	var reIssueCertificate = function(handleInfo, relayCallback){
		var rnd = coreFactory.Factory.Util.encode64(coreFactory.Factory.Util.getRandomBytesSync(32));

		var postdata = "CA_NAME=" + handleInfo.requestInfo.getParameter("CA_NAME");
		postdata = postdata + "&CA_IP=" + handleInfo.requestInfo.getParameter("CA_IP");
		postdata = postdata + "&CA_PORT=" + handleInfo.requestInfo.getParameter("CA_PORT");
		postdata = postdata + "&REF_VALUE=" + handleInfo.requestInfo.getParameter("REF_VALUE");
		postdata = postdata + "&AUTH_CODE=" + handleInfo.requestInfo.getParameter("AUTH_CODE");
		postdata = postdata + "&RND=" + encodeURIComponent(rnd);

		var url = defaultConf.System.UrlAddress['CERT_CMP_REISSUE'];
		var priCert = utils.Transfer.xmlHttpRequest(url, postdata);
		//priCert = priCert.trim().replace(/\r/g, "").replace(/\n/g, "");
		priCert = priCert.trim();
		priCert = priCert.split("||");

		var reIssue = {};
		reIssue.privateKey = priCert[0];
		reIssue.certificate = priCert[1];

		/* 주의 : 개인키는 RND값으로 암호화 됨으로 사용자 비번으로 변경이 필요 하다.*/
		var change = coreFactory.Factory.Certs.changePassword(reIssue, rnd, handleInfo.serviceInfo.getParameter("PWD"));

		var jsonObj = {};
		jsonObj["PARAMS"] = {"PRIVATE_KEY" : change.privateKey, "CERT" : change.certificate};

		relayCallback(jsonObj);
	};
	var updateCertificate = function(handleInfo, relayCallback){
		var rnd = coreFactory.Factory.Util.encode64(coreFactory.Factory.Util.getRandomBytesSync(32));

		var oldPriCert = {};
		oldPriCert.privateKey = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
		oldPriCert.certificate = handleInfo.serviceInfo.getParameter("CERTIFICATE");

		/* 주의 : 개인키는 RND으로 변경*/
		var change = coreFactory.Factory.Certs.changePassword(oldPriCert, handleInfo.serviceInfo.getParameter("PWD"), rnd);

		var postdata = "CA_NAME=" + handleInfo.requestInfo.getParameter("CA_NAME");
		postdata = postdata + "&CA_IP=" + handleInfo.requestInfo.getParameter("CA_IP");
		postdata = postdata + "&CA_PORT=" + handleInfo.requestInfo.getParameter("CA_PORT");
		postdata = postdata + "&USER_PRI=" + encodeURIComponent(
											coreFactory.Factory.Util.privateKeyPemTagRemove(change.privateKey)
											.replace(/\r/g, "").replace(/\n/g, "")
											.trim()
											);
		postdata = postdata + "&USER_CERT=" + encodeURIComponent(
											coreFactory.Factory.Util.certPemTagRemove(change.certificate)
											.replace(/\r/g, "").replace(/\n/g, "")
											.trim()
											);
		postdata = postdata + "&RND=" + encodeURIComponent(rnd);

		var url = defaultConf.System.UrlAddress['CERT_CMP_UPDATE'];
		var priCert = utils.Transfer.xmlHttpRequest(url, postdata);
		//priCert = priCert.trim().replace(/\r/g, "").replace(/\n/g, "");
		priCert = priCert.trim();
		priCert = priCert.split("||");

		var update = {};
		update.privateKey = priCert[0];
		update.certificate = priCert[1];

		/* 주의 : 개인키는 RND값으로 암호화 됨으로 사용자 비번으로 변경이 필요 하다.*/
		var change = coreFactory.Factory.Certs.changePassword(update, rnd, handleInfo.serviceInfo.getParameter("NEW_PWD"));

		var jsonObj = {};
		jsonObj["PARAMS"] = {"PRIVATE_KEY" : change.privateKey, "CERT" : change.certificate};

		relayCallback(jsonObj);
	};
	var revokeCertificate = function(handleInfo, relayCallback){
		var postdata = "";

		var url = defaultConf.System.UrlAddress['CERT_CMP_REVOKE'];
		var priCert = utils.Transfer.xmlHttpRequest(url, postdata);
	};

	return{
		getCertificateInfo : getCertificateInfo,
		getCertAttributeList : getCertAttributeList,
		selectedSignature : selectedSignature,
		savePrivateCertificate : savePrivateCertificate,
		exportCertPriP12 : exportCertPriP12,
		exportCertPriP12File : exportCertPriP12File,
		removeCertificate : removeCertificate,
		changePassword : changePassword,
		copyCertificateInfo : copyCertificateInfo,
		issueCertificate : issueCertificate,
		reIssueCertificate : reIssueCertificate,
		updateCertificate : updateCertificate,
		revokeCertificate : revokeCertificate,
		getYesssignCertificate : getYesssignCertificate
	}
});
