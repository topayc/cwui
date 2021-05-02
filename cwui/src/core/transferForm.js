/*************************************************************************************
 # Copyright(c) Initech
 # 설명 :
 # 이력
  - [2015-10-01] : 최초 구현
*************************************************************************************/
define([
        '../main/constants',
        '../conf/defaultConf',
        '../core/coreFactory',
        '../core/utils'
        ], function (constants, defaultConf, coreFactory, utils) {

	var IniRequest = (function() {

		function getPasswordPolicy(type){
			//YessignCertPasswordPolicy
			//[한글] 숫자, 영문, 특수문자를 반드시 모두 포함하여 구성해야 합니다. (단, ' " | \ 사용불가) 자릿수는 10자리 이상 30자리 이하만 사용 연속된 문자/숫자 3자리 이상 사용 불가 동일한 문자/숫자 3자리 이상 사용 불가
			//CertPasswordPolicy
			//type=issue,update,chgpwd&certtype=0&minlength=15&maxlength=20&specialcharlist=%25!&indecreasecount=4&repeatcount=2&musttype=AN
			//고객 사 정책 설정에 따라 유동적으로 변합니다. - 굵게 표시한 부분이 각 정책 값에 따라 유동적으로 표시됩니다. - 각 필드 값이 없는 경우 해당 줄은 문구에서 사라집니다. * 예시) [설정]
			//[표시되는 문구 - 한글] 인증서 암호는 15자리 이상 설정해야 합니다. 인증서 암호는 최대 20자리까지 설정가능 합니다. 인증서 암호에는 지정된 특수 문자(%!)만 사용 가능 합니다. 인증서 암호에는 연속된 숫자/문자를 4자리 이상부터 사용 할 수 없습니다.
			//인증서 암호에는 같은 숫자/문자를 2자리 이상 연속으로 사용 할 수 없습니다. 인증서 암호에는 영문자/숫자타입이 반드시 조합되어 사용되어야 합니다.

			/* 설정 */
			var passwordPolicy = "";
			passwordPolicy += "type=" + type;
			//0 인증서 비밀번호 체계 강화를 적용하고 싶은 인증서 종류 설정 [설정 값]
			//0 ~ 2 : 3개의 값을 사용 0 : 공인, 사설인증서 모두 적용 1 : 공인인증서 만 적용 2 : 사설인증서 만 적용
			passwordPolicy += "&certtype=0";
			//최소 자리수
			passwordPolicy += "&minlength=" + defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_MIN_LENGTH];
			//최대 자리수
			passwordPolicy += "&maxlength=" + defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_MAX_LENGTH];
			//허용문자
			//%60%20~!%40%23%24%25%5E%26*()-%3D_%2B%5B%5D%7B%7D%3B%3A%2C.%2F%3C%3E%3F : 허용하고자 하는
			//특수문자(` ~!@#$%^&*()-=_+[]{};:,./<>?)를 URL인코딩 한 값
			passwordPolicy += "&specialcharlist=%60%20~!%40%23%24%25%5E%26*()-%3D_%2B%5B%5D%7B%7D%3B%3A%2C.%2F%3C%3E%3F";
			//연속되는 문자/숫자 자리수
			passwordPolicy += "&indecreasecount=" + defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_DENY_SERIAL_CHAR_LENGTH];
			//인증서 비밀번호에 동일한 문자/숫자를 몇 개의 자리 수만 허용할지 설정
			passwordPolicy += "&repeatcount=" + defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_DENY_SAME_CHAR_LENGTH];
			//인증서 비밀번호의 조합을 특정 조합만 한정하여 허용하고 싶은 경우에 설정.
			//A,N,S : 3개의 고정 값을 조합하여 설정, 연속 적용 시에 구분자는 콤마(,)를 사용합니다.
			//A : 영문자 , N : 숫자 , S : 특수문자 , AN : 영문자/숫자 , AS : 영문자/특수문자 NS : 숫자/특수문자 ANS : 영문자/숫자/특수문자
			passwordPolicy += "&musttype=" + defaultConf.WebForm.PasswordLimit[constants.WebForm.LIMIT_MIN_CHAR_TYPE];
			//console.log("[PASSWORD Policy::]" + passwordPolicy);
			return encodeURIComponent(passwordPolicy);
		}

		function getSessionID(){
			var SID = "URI_SESSIONID";

			var sessionId = sessionStorage.getItem(SID);
			if(!sessionId){
				sessionId = parseInt(Math.random() * 999999 % 999999);
				sessionStorage.setItem(SID, sessionId);
			}

			return sessionId.toString();
		};

		function constructJson(cmd, param, tranId, encrypted, sessionId, envelopedInfo){
			var msg = {};
			msg["PROTOCOLVER"] = constants.System.PROTOCOl;
			msg["PRODUCTID"] = constants.System.VERSION;
			msg["DOMAIN"] = location.host;
			msg["SESSIONID"] = (sessionId ? sessionId : getSessionID());
			if(envelopedInfo){
				msg["SESSION"] = coreFactory.Factory.Util.encode64(
									coreFactory.Factory.Cipher.asymmetricPubKeyEncrypt(
																		envelopedInfo.publicKey,
																		"RSA15",
																		"SHA256",
																		coreFactory.Factory.Util.hexToBytes(envelopedInfo.sessionSeed)
																		)
																	);
			}

			//E2E 임시
			msg["ENCRYPTED"] = (encrypted=="FALSE" ? "FALSE" : "TRUE");
			msg["COMMAND"] = cmd;
			msg["TRANS_SEQ"] = tranId;


			if(param !== undefined){
				if(envelopedInfo){
					var sessionKey = envelopedInfo.sessionSeed.substring(0, 32);
					var sessionIv = envelopedInfo.sessionSeed.substring(32);

					msg["PARAMS"] = coreFactory.Factory.Util.encode64(
										coreFactory.Factory.Cipher.symmetricEncrypt(constants.Cipher.SYMM_SEED_CBC,
												coreFactory.Factory.Util.hexToBytes(sessionKey),
												coreFactory.Factory.Util.hexToBytes(sessionIv),
												coreFactory.Factory.Util.createBuffer(JSON.stringify(param))
										).data
									);
					coreFactory.Factory.Util.dataDestory();
				}else{
					msg["PARAMS"] = param;
				}
			}
			param = 0x00;
			return msg;
		};


		function separateNonce(handleInfo, pwdType){
			if(handleInfo.serviceInfo.getParameter("ENCRYPTED") == "TRUE"){
				return handleInfo.serviceInfo.getParameter(pwdType);
			}else{
				if("PWD" == pwdType){
					return GINI_ProtectMgr.extract("NONCE");
				}else if("NEW_PWD" == pwdType){
					return GINI_ProtectMgr.extract("NEW_NONCE");
				}else if("PWD_CNF" == pwdType){
					return GINI_ProtectMgr.extract("NEW_NONCE_CNF");
				}else if("PIN" == pwdType){
					return GINI_ProtectMgr.extract("SECURE");
				}else if("TARGET_PIN" == pwdType){
					return GINI_ProtectMgr.extract("TARGET_SECURE");
				}else if("SOURCE_PIN" == pwdType){
					return GINI_ProtectMgr.extract("SOURCE_SECURE");
				}
			}
		};

		/**
		 * @desc : 버전정보 요청 전문
		 */
		var getReqVersion = function(handleInfo, extTranId){
			var cmd = "GET_VERSION";
			var param = {};

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");
			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId);
			param = 0x00;
			return reqMsg;
		};

		/**
		 * @desc : 환경설정 정보 세팅 요청 전문
		 */
		var getReqSetProperty = function(handleInfo, extTranId){
			var cmd = "SET_PROPERTY";

			var prop = handleInfo.optionInfo.getParameter("PROPERTIES");

			var param = [];
			for(var attr in prop){
				var rebuild = {};
				rebuild["PROPERTY_KEY"] = attr;
				rebuild["PROPERTY_VALUE"] = encodeURIComponent(prop[attr]);

				param.push(rebuild);
			}

			var reqMsg = constructJson(cmd, {"PROPERTY_LIST" : param});
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 저장매체 하위 목록 요청 전문
		 * LOCAL_DISK : 하드디스크 + 이동식디스크
		 * REMOVABLE_DISK : 이동식디스크
		 * SECURITY_TOKEN : 보안토큰
		 */
		var getReqDeviceList = function(handleInfo, extTranId){
			var cmd = "GET_DEVICE_LIST";

			var param = {};
			param["DEVICE"] = encodeURIComponent(handleInfo.serviceInfo.getEventDeviceId());
			//param["PROPERTY_LIST"] = handleInfo.optionInfo.getParameter("PROPERTY_LIST");
			param["PROPERTY_LIST"] =
					[
					{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
					{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
					{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
					{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
					{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
					{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http:///popup/pop_install.html$width^300$height^400"},
					{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
					{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

                   	{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
                   	{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
                   	{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
                   	{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

                   	{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
                   	{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
                   	{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},

                   	{"PROPERTY_KEY":"certmanui_language", "PROPERTY_VALUE":""},
					{"PROPERTY_KEY":"YessignCertPasswordPolicy", "PROPERTY_VALUE":"0"},
					{"PROPERTY_KEY":"CertPasswordPolicy", "PROPERTY_VALUE":getPasswordPolicy("issue")},
					];

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg =  constructJson(cmd, param, extTranId, encrypted, sessionId);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 목록 요청 전문
		 */
		var getReqCertificateList = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "GET_CERT_LIST";
			var param = {};
//			param["DEVICE_ID"] = encodeURIComponent(handleInfo.deviceId);
//			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.deviceSub);
//			param["DEVICE_PIN"] = encodeURIComponent(handleInfo.pin);
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			//pin = "11111111";
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			param["PROPERTY_LIST"] = handleInfo.optionInfo.getParameter("PROPERTY_LIST");
			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			return reqMsg;
		};

		/**
		 * @desc : 전자서명 요청 전문
		 */
		var getReqSignature = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "DIGITAL_SIGN";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());

			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			pin = 0x00;

			param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));

			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER
				&& handleInfo.optionInfo.getParameter("YESSIGN_TYPE")
				&& handleInfo.optionInfo.getParameter("YESSIGN_TYPE")=== "TRUE"){
				var cert = handleInfo.serviceInfo.getParameter("CERTIFICATE");
				cert = coreFactory.Factory.Util.certPemTagAdd(cert);
				param["CERT"] = encodeURIComponent(cert);

				var pri = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
				pri = coreFactory.Factory.Util.privateKeyPemTagRemove(pri).trim();
				param["PRIVATE_KEY"] = encodeURIComponent(pri); //pkcs8 (source device 가 브라우저 일경우)
			}else{
				param["CERT"] = '';
				param["PRIVATE_KEY"] = '';
			}

            var orgData = handleInfo.requestInfo.getParameter("ORG_DATA");

            if ( handleInfo.requestInfo.getParameter("MULTI_SIGN") == "TRUE" ) {
                var multiSignIndex = handleInfo.requestInfo.getParameter("MULTI_INDEX");
                var arrOrgData= handleInfo.requestInfo.getParameter("MULTI_ORG_DATA");
                orgData = arrOrgData[multiSignIndex];
                multiSignIndex++;
                handleInfo.requestInfo.setParameter("MULTI_INDEX", multiSignIndex);
            }

			// jQuery를 통해 전달 되면서 자동 URLEncoding됨
			param["ORIGINAL_DATA"] = encodeURIComponent(orgData);

			//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
			param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));

			//PKCS1 / PKCS7
			param["SIGN_KIND"] = encodeURIComponent(handleInfo.optionInfo.getParameter("SIGN_KIND"));
			if(handleInfo.optionInfo.getParameter("HASH_ALG")){
				param["SIGN_HASH"] = encodeURIComponent(handleInfo.optionInfo.getParameter("HASH_ALG").toUpperCase());
			}
			// 옵션
			param["OPTION"] = {};
			param["OPTION"]["SHOW_PLAIN_TEXT"] = encodeURIComponent(handleInfo.optionInfo.getParameter("SHOW_PLAIN_TEXT"));
			if(handleInfo.optionInfo.getParameter("SIGN_KIND") === 'PKCS7'){
				//yyyymmddhhiiss 형식의 서버시간
				param["OPTION"]["SERVER_TIME"] = encodeURIComponent(handleInfo.optionInfo.getParameter("SERVER_TIME"));
				//TRUE / FALSE (※ TRUE일 경우 금결원 Format(Content Type 제외), 대문자만 적용가능)
				param["OPTION"]["YESSIGN_TYPE"] = encodeURIComponent( (handleInfo.optionInfo.getParameter("YESSIGN_TYPE").toString()).toUpperCase() );
				//TRUE / FALSE (※ TRUE 일 경우 VIDRandom 포함, 대문자만 적용가능) (unauthenticatedAttributes)
//				param["OPTION"]["IN_VID"] = encodeURIComponent( "FALSE" );
				param["OPTION"]["IN_VID"] = encodeURIComponent( (handleInfo.optionInfo.getParameter("IN_VID").toString()).toUpperCase() );

				param["ORIGINAL_URL_ENCODING"] = encodeURIComponent(handleInfo.optionInfo.getParameter("CONTENT_ENCODE").ORIGIRAL_URL_ENCODE ? "TRUE" : "FALSE");
				var orgCharSet = handleInfo.optionInfo.getParameter("CONTENT_ENCODE").ORIGIRAL_CHAR_SET;
				param["ORIGINAL_ENCODING"] = encodeURIComponent((orgCharSet=='utf8' ? 'UTF-8' : orgCharSet));
				param["SIGN_URL_ENCODING"] = encodeURIComponent(handleInfo.optionInfo.getParameter("CONTENT_ENCODE").SIGN_URL_ENCODE ? "TRUE" : "FALSE");
				var signCharSet = handleInfo.optionInfo.getParameter("CONTENT_ENCODE").SIGN_CHAR_SET;
				param["SIGN_ENCODING"] = encodeURIComponent((signCharSet=='utf8' ? 'UTF-8' : signCharSet));
				param["OPTION"]["PDF_SIGN_TYPE"] = encodeURIComponent( (handleInfo.optionInfo.getParameter("PDF_SIGN_TYPE").toString()).toUpperCase() );
			}else{
				//yyyymmddhhiiss 형식의 서버시간
				//TRUE / FALSE (※ TRUE일 경우 금결원 Format(Content Type 제외), 대문자만 적용가능)
				param["OPTION"]["YESSIGN_TYPE"] = encodeURIComponent( (handleInfo.optionInfo.getParameter("YESSIGN_TYPE").toString()).toUpperCase() );
				//TRUE / FALSE (※ TRUE 일 경우 VIDRandom 포함, 대문자만 적용가능) (unauthenticatedAttributes)
//				param["OPTION"]["IN_VID"] = encodeURIComponent( "FALSE" );
				param["OPTION"]["IN_VID"] = encodeURIComponent( (handleInfo.optionInfo.getParameter("IN_VID").toString()).toUpperCase() );

				param["ORIGINAL_URL_ENCODING"] = encodeURIComponent(handleInfo.optionInfo.getParameter("CONTENT_ENCODE").ORIGIRAL_URL_ENCODE ? "TRUE" : "FALSE");
				var orgCharSet = handleInfo.optionInfo.getParameter("CONTENT_ENCODE").ORIGIRAL_CHAR_SET;
				param["ORIGINAL_ENCODING"] = encodeURIComponent((orgCharSet=='utf8' ? 'UTF-8' : orgCharSet));
				param["SIGN_URL_ENCODING"] = encodeURIComponent(handleInfo.optionInfo.getParameter("CONTENT_ENCODE").SIGN_URL_ENCODE ? "TRUE" : "FALSE");
				var signCharSet = handleInfo.optionInfo.getParameter("CONTENT_ENCODE").SIGN_CHAR_SET;
				param["SIGN_ENCODING"] = encodeURIComponent((signCharSet=='utf8' ? 'UTF-8' : signCharSet));
			}

			param["PROPERTY_LIST"] = handleInfo.optionInfo.getParameter("PROPERTY_LIST");

			var signPadding = "PKCS1_15";
			if((handleInfo.optionInfo.getParameter("RSA_PSS_SIGN"))){
				signPadding = "PSS";
			}
			param["OPTION"]["SIGN_PADDING"] = encodeURIComponent(signPadding);

			if(handleInfo.requestInfo.getParameter("ADD_PKCS1") !== undefined){
				//※ SFilter Protocol 일 경우 필요
				param["OPTION"]["SECURE_NONCE"] = encodeURIComponent(handleInfo.requestInfo.getParameter("ADD_PKCS1"));
			}

			// UNAUTH_ATTR
			var unauthAttrList = handleInfo.requestInfo.getParameter("UNAUTH_ATTR_LIST");
			if(unauthAttrList !== undefined){
				var unAuth = [];
				for(key in unauthAttrList){
					var unAuthList = unauthAttrList[key];

					var attrList = {};
					attrList["UNAUTH_ATTR_KEY"] = unAuthList["UNAUTH_ATTR_KEY"];
					attrList["UNAUTH_ATTR_VALUE"] = unAuthList["UNAUTH_ATTR_VALUE"];
					unAuth.push(attrList);
				}
				param["UNAUTH_ATTR"] = unAuth;
			}

			//스마트인증의 경우 필터정보를 제공 (장치 ID가 스마트 인증일 경우)
			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_USIM){
				param["USIM_FILTER_INFO"] = {};
				param["USIM_FILTER_INFO"]["USIM_FILTER_OID"] = handleInfo.optionInfo.getParameter("USIM_FILTER_OID");
				//인증서 발급자 값을 이용한 필터링 (예)yessign
				param["USIM_FILTER_INFO"]["USIM_FILTER_ISSUERDN"] = handleInfo.optionInfo.getParameter("USIM_FILTER_ISSUERDN");
				//인증서 주체자 값을 이요한 필터링 (예)홍길동(KILDONG HOM)
				param["USIM_FILTER_INFO"]["USIM_FILTER_SUBJECTDN"] = handleInfo.optionInfo.getParameter("USIM_FILTER_SUBJECTDN");
				//인증서 인련번호를 이용한 필터링(예)14d77532
				param["USIM_FILTER_INFO"]["USIM_FILTER_SERIAL"] = handleInfo.optionInfo.getParameter("USIM_FILTER_SERIAL");
				//CA인증서의 SubjectDN값, 구분자 ‘|’(예)cn=yessignCA,ou=Accr…|cn=yessignCA-Test…|…
				param["USIM_FILTER_INFO"]["USIM_FILTER_CA"] = handleInfo.optionInfo.getParameter("USIM_FILTER_CA");
				//만료된 인증서 표시여부 "0" – 만료된 인증서 표시 "1" – 만료된 인증서 표시 안함.
				param["USIM_FILTER_INFO"]["USIM_FILTER_EXPIRED"] = handleInfo.optionInfo.getParameter("USIM_FILTER_EXPIRED");
			}
			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");


			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;
            orgData = "";

			return reqMsg;
		};

		/**
		 * @desc : 인증서 삭제 요청 전문
		 */
		var getReqDeleteCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "DELETE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 암호 변경 요청 전문
		 */
		var getReqChangeCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "CHANGE_PASSWORD";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			pin = 0x00;
			param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));
//			param["PREV_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
//			param["NEW_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("NEW_PWD"));
//			param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD_CNF"));
			param["PREV_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));
			param["NEW_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "NEW_PWD"));
			param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD_CNF"));

			param["PROPERTY_LIST"] =
							[
//			          			{"PROPERTY_KEY":"certmanui_language", "PROPERTY_VALUE":""},
			        			{"PROPERTY_KEY":"YessignCertPasswordPolicy", "PROPERTY_VALUE":"0"},
			        			{"PROPERTY_KEY":"CertPasswordPolicy", "PROPERTY_VALUE":getPasswordPolicy("chgpwd")},
			        		];

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 복사 요청 전문
		 */
		var getReqCopyCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "COPY_CERT";

			var param = {};
			param["SOURCE_DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SOURCE_DEVICE_ID"));
			param["SOURCE_DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SOURCE_DEVICE_SUB"));
			//param["SOURCE_DEVICE_PIN"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SOURCE_DEVICE_PIN"));
			param["SOURCE_DEVICE_PIN"] =  encodeURIComponent(separateNonce(handleInfo, "PIN"));
			param["TARGET_DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_ID"));
			param["TARGET_DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("TARGET_DEVICE_SUB_ID"));
			//param["TARGET_DEVICE_PIN"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("TARGET_PIN"));
			param["TARGET_DEVICE_PIN"] = encodeURIComponent(separateNonce(handleInfo, "TARGET_PIN"));

			//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
			param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));

			// 복사할 인증서의 DeviceID가 브라우저 일경우
			if(handleInfo.serviceInfo.getParameter("SOURCE_DEVICE_ID") === constants.Certs.STORAGE_BROWSER){
				var cert = handleInfo.serviceInfo.getParameter("CERTIFICATE");
				cert = coreFactory.Factory.Util.certPemTagAdd(cert);
				param["CERT"] = encodeURIComponent(cert);

				var pri = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
				pri = coreFactory.Factory.Util.privateKeyPemTagRemove(pri).trim();
				param["PRIVATE_KEY"] = encodeURIComponent(pri);

				var kmCert = handleInfo.serviceInfo.getParameter("KM_CERTIFICATE");
				if(kmCert){
					kmCert = coreFactory.Factory.Util.certPemTagAdd(kmCert);
					param["KM_CERT"] = encodeURIComponent(kmCert);
				}

				var kmPri = handleInfo.serviceInfo.getParameter("KM_PRIVATE_KEY");
				if(kmPri){
					kmPri = coreFactory.Factory.Util.privateKeyPemTagRemove(kmPri).trim();
					param["KM_PRIVATE_KEY"] = kmPri;
				}
			} else {
				param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));
			}

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 발급 요청 전문
		 */
		var getReqIssueCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "ISSUE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
//			param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
//			param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD_CNF"));
			param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));
			param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD_CNF"));
			param["PROPERTY_LIST"] =
				[
//          			{"PROPERTY_KEY":"certmanui_language", "PROPERTY_VALUE":""},
        			{"PROPERTY_KEY":"YessignCertPasswordPolicy", "PROPERTY_VALUE":"0"},
        			{"PROPERTY_KEY":"CertPasswordPolicy", "PROPERTY_VALUE":getPasswordPolicy("issue")},
        		];

			param["CA_NAME"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_NAME"));
			param["CA_IP"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_IP"));
			param["CA_PORT"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_PORT"));
			param["REF_VALUE"] = encodeURIComponent(handleInfo.requestInfo.getParameter("REF_VALUE"));
			param["AUTH_CODE"] = encodeURIComponent(handleInfo.requestInfo.getParameter("AUTH_CODE"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 재발급 요청 전문
		 */
		var getReqReIssueCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "REISSUE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
//			param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
//			param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD_CNF"));
			param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));
			param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD_CNF"));
			param["PROPERTY_LIST"] =
				[
//          			{"PROPERTY_KEY":"certmanui_language", "PROPERTY_VALUE":""},
        			{"PROPERTY_KEY":"YessignCertPasswordPolicy", "PROPERTY_VALUE":"0"},
        			{"PROPERTY_KEY":"CertPasswordPolicy", "PROPERTY_VALUE":getPasswordPolicy("issue")},
        		];
			param["CA_NAME"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_NAME"));
			param["CA_IP"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_IP"));
			param["CA_PORT"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_PORT"));
			param["REF_VALUE"] = encodeURIComponent(handleInfo.requestInfo.getParameter("REF_VALUE"));
			param["AUTH_CODE"] = encodeURIComponent(handleInfo.requestInfo.getParameter("AUTH_CODE"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 갱신 요청 전문
		 */
		var getReqUpdateCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "UPDATE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));

			param["CA_NAME"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_NAME"));
			param["CA_IP"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_IP"));
			param["CA_PORT"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_PORT"));

//			param["OLD_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
//			param["NEW_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("NEW_PWD"));
//			param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD_CNF"));
			param["OLD_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));
			param["NEW_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "NEW_PWD"));
			param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD_CNF"));
			param["PROPERTY_LIST"] =
				[
//          			{"PROPERTY_KEY":"certmanui_language", "PROPERTY_VALUE":""},
        			{"PROPERTY_KEY":"YessignCertPasswordPolicy", "PROPERTY_VALUE":"0"},
        			{"PROPERTY_KEY":"CertPasswordPolicy", "PROPERTY_VALUE":getPasswordPolicy("update")},
        		];

			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
				var cert = handleInfo.serviceInfo.getParameter("CERTIFICATE");
				cert = coreFactory.Factory.Util.certPemTagAdd(cert);
				param["CERT"] = encodeURIComponent(cert);

				var pri = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
				pri = coreFactory.Factory.Util.privateKeyPemTagRemove(pri).trim();
				param["PRIVATE_KEY"] = encodeURIComponent(pri); //pkcs8 (source device 가 브라우저 일경우)

			} else {
				param["CERT"] = '';
				param["PRIVATE_KEY"] = '';
			}

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 폐기 요청 전문
		 */
		var getReqRevokeCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "REVOKE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			param["CA_NAME"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CA_NAME"));
			param["CERT_SERIAL"] = encodeURIComponent(handleInfo.requestInfo.getParameter("CERT_SERIAL"));
			param["ISSUER_DN"] = encodeURIComponent(handleInfo.requestInfo.getParameter("ISSUER_DN"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 내보내기 P12 요청 전문
		 */
		var getReqExportCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "EXPORT_FILE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				pin = handleInfo.serviceInfo.getParameter("PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));
			//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
			param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));

			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER){
				var cert = handleInfo.serviceInfo.getParameter("CERTIFICATE");
				cert = coreFactory.Factory.Util.certPemTagAdd(cert);
				param["CERT"] = encodeURIComponent(cert);

				var pri = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
				pri = coreFactory.Factory.Util.privateKeyPemTagRemove(pri).trim();
				param["PRIVATE_KEY"] = encodeURIComponent(pri);

				var kmCert = handleInfo.serviceInfo.getParameter("KM_CERTIFICATE");
				if(kmCert){
					kmCert = coreFactory.Factory.Util.certPemTagAdd(kmCert);
					param["KM_CERT"] = encodeURIComponent(kmCert);
				}

				var kmPri = handleInfo.serviceInfo.getParameter("KM_PRIVATE_KEY");
				if(kmPri){
					kmPri = coreFactory.Factory.Util.privateKeyPemTagRemove(kmPri).trim();
					param["KM_PRIVATE_KEY"] = encodeURIComponent(kmPri);
				}
			} else {
				param["CERT"] = '';
				param["PRIVATE_KEY"] = '';
				param["KM_CERT"] = '';
				param["KM_PRIVATE_KEY"] = '';
			}

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 요청 전문
		 */
		var getReqSaveCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "SAVE_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//param["DEVICE_PIN"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PIN"));
				param["DEVICE_PIN"] = encodeURIComponent(separateNonce(handleInfo, "PIN"));
				if(handleInfo.serviceInfo.getParameter("PWD")){
					//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
					param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));
				} else {
					//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PIN"));
					param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PIN"));
				}
				if(handleInfo.serviceInfo.getParameter("PWD_CNF")){
					//param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD_CNF"));
					param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD_CNF"));
				} else {
					//param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PIN"));
					param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PIN"));
				}
			} else {
				//param["DEVICE_PIN"] = encodeURIComponent("");
				//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
				//param["CONFIRM_PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD_CNF"));
				param["DEVICE_PIN"] = encodeURIComponent("");
				param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));
				param["CONFIRM_PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD_CNF"));
			}

			param["PROPERTY_LIST"] =
					[
					{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
					{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
					{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
					{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
					{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
					{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http:///popup/pop_install.html$width^300$height^400"},
					{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
					{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

                   	{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
                   	{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
                   	{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
                   	{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

                   	{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
                   	{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
                   	{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},

                   	{"PROPERTY_KEY":"certmanui_language", "PROPERTY_VALUE":""},
					{"PROPERTY_KEY":"YessignCertPasswordPolicy", "PROPERTY_VALUE":"0"},
					{"PROPERTY_KEY":"CertPasswordPolicy", "PROPERTY_VALUE":getPasswordPolicy("issue")},
					];


			var cert = handleInfo.serviceInfo.getParameter("CERTIFICATE");
			cert = coreFactory.Factory.Util.certPemTagAdd(cert);
			param["CERT"] = encodeURIComponent(cert);

			var pri = handleInfo.serviceInfo.getParameter("PRIVATE_KEY");
			pri = coreFactory.Factory.Util.privateKeyPemTagRemove(pri).trim();
			param["PRIVATE_KEY"] = encodeURIComponent(pri);

			var kmCert = handleInfo.serviceInfo.getParameter("KM_CERTIFICATE");
			if(kmCert){
				kmCert = coreFactory.Factory.Util.certPemTagAdd(kmCert).trim();
				param["KM_CERT"] = kmCert;
			}

			var kmPri = handleInfo.serviceInfo.getParameter("KM_PRIVATE_KEY");
			if(kmPri){
				kmPri = coreFactory.Factory.Util.privateKeyPemTagRemove(kmPri);
				param["KM_PRIVATE_KEY"] = encodeURIComponent(kmPri);
			}

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 인증서 읽기 요청 전문
		 */
		var getReqLoadCertificate = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "LOAD_CERT";

			var param = {};
			param["DEVICE_ID"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceId());
			param["DEVICE_SUB"] = encodeURIComponent(handleInfo.serviceInfo.getDeviceSub());
			var pin = "";
			if(handleInfo.serviceInfo.getParameter("PIN")){
				//pin = handleInfo.serviceInfo.getParameter("PIN");
				pin = separateNonce(handleInfo, "PIN");
			}
			param["DEVICE_PIN"] = encodeURIComponent(pin);
			param["CERT_ID"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("CERT_ID"));
			//param["PASSWORD"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PWD"));
			param["PASSWORD"] = encodeURIComponent(separateNonce(handleInfo, "PWD"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 공개키 요청
		 */
		var getReqPublicKey = function(handleInfo, extTranId){
			var cmd = "GET_PUBLIC_KEY";
			var param = {};

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : e2e 공개키 요청
		 */
		var getReqPublicKeyE2E = function(handleInfo, extTranId){
			var cmd = "GET_PUBLIC_KEY_FOR_KEYBOARD_SECURITY";
			var param = {};

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : 마스터 키 교환
		 * @deprecated : 사용 안함
		 */
		var getReqExchangeMasterKey = function(handleInfo, extTranId){
			var cmd = "EXCHANGE_MASTER_KEY";
			var param = {};
			param["MASTER_KEY"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("MASTER_KEY"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : PC 정보 요청
		 */
		var getReqGatterPCInfo = function(handleInfo, extTranId){
			var cmd = "REQUEST_PC_INFO";
			var param = {};
			// 사용고객 (CITIBANK / HANA / NONGHYUP / SHINHAN)
			param["SITE_NAME"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SITE_NAME"));
			// PC 정보 수집
			// 1: PC 정보 수집 (평문)
			// 2: PC정보 수집 (암호화)
			param["PC_INFO_USE"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("PC_INFO_USE"));
			// 조회서버 주소
			param["SERVER_IP"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SERVER_IP"));
			// 조회서버 포트
			param["SERVER_PORT"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SERVER_PORT"));
			// 추출 실패시 재시도 횟수
			param["RETRY_CNT"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("RETRY_CNT"));
			// 정보 교체
			// 0: 정보 교체 안함
			// 1: 정보 교체 사용
			param["REPLACE"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("REPLACE"));
			// FDS 정보 수집
			// 0: FDS 정보 수집 안함
			// 1: FDS 정보 수집 사용
			param["FDS_USE"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("FDS_USE"));

			var reqMsg = constructJson(cmd, param, extTranId);
			param = 0x00;

			return reqMsg;
		};

		/**
		 * @desc : PC 정보 취득
		 */
		var getReqGetPCInfo = function(handleInfo, extTranId, envelopedInfo){
			var cmd = "GET_PC_INFO";
			var param = {};
			param["SECURE_NONCE"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("SECURE_NONCE"));
			param["USER_AGENT"] = encodeURIComponent(handleInfo.serviceInfo.getParameter("USER_AGENT"));

			var sessionId = handleInfo.requestInfo.getParameter("SESSIONID");
			var encrypted = handleInfo.serviceInfo.getParameter("ENCRYPTED");

			var reqMsg = constructJson(cmd, param, extTranId, encrypted, sessionId, envelopedInfo);
			param = 0x00;

			return reqMsg;
		};

		var getReqResult = function(reqMsg){
			var cmd = "GET_RESULT";

			var msg = {};
			msg["PROTOCOLVER"] = constants.System.PROTOCOl;
			msg["PRODUCTID"] = constants.System.VERSION;
			msg["DOMAIN"] = location.host;
			msg["SESSIONID"] = reqMsg["SESSIONID"];
			msg["ENCRYPTED"] = reqMsg["ENCRYPTED"];
			msg["COMMAND"] = cmd;
			msg["TRANS_SEQ"] = reqMsg["TRANS_SEQ"];;

			return msg;
		};


		return{
			getReqVersion : getReqVersion,
			getReqSetProperty : getReqSetProperty,
			getReqDeviceList : getReqDeviceList,
			getReqCertificateList : getReqCertificateList,
			getReqSignature : getReqSignature,
			getReqDeleteCertificate : getReqDeleteCertificate,
			getReqChangeCertificate : getReqChangeCertificate,
			getReqCopyCertificate : getReqCopyCertificate,
			getReqIssueCertificate : getReqIssueCertificate,
			getReqUpdateCertificate : getReqUpdateCertificate,
			getReqReIssueCertificate : getReqReIssueCertificate,
			getReqRevokeCertificate : getReqRevokeCertificate,
			getReqExportCertificate : getReqExportCertificate,
			getReqSaveCertificate : getReqSaveCertificate,
			getReqLoadCertificate : getReqLoadCertificate,
			getReqExchangeMasterKey : getReqExchangeMasterKey,
			getReqGatterPCInfo : getReqGatterPCInfo,
			getReqGetPCInfo : getReqGetPCInfo,
			getReqPublicKey : getReqPublicKey,
			getReqPublicKeyE2E : getReqPublicKeyE2E,
			getReqResult : getReqResult
		};
	}());


	var IniResponse = (function() {

		function extractParameters(jsonObj, envelopedInfo){
			var params = jsonObj["PARAMS"];

			if(envelopedInfo){
				var sessionData = params["SESSION_DATA"];
				var sessionKey = envelopedInfo.sessionSeed.substring(0, 32);
				var sessionIv = envelopedInfo.sessionSeed.substring(32);
				params = coreFactory.Factory.Cipher.symmetricDecrypt(
										constants.Cipher.SYMM_SEED_CBC,
										coreFactory.Factory.Util.hexToBytes(sessionKey),
										coreFactory.Factory.Util.hexToBytes(sessionIv),
										coreFactory.Factory.Util.createBuffer(
												coreFactory.Factory.Util.decode64(decodeURIComponent(sessionData))
												)
							).data;
				params = JSON.parse(params);
			}

			return params;
		};

		var getResVersion = function(jsonObj){
			var resultData = extractParameters(jsonObj);

			return resultData["VERSION_LIST"];
		};

//		var getResSetProperty = function(jsonObj){
//
//		};

		var getResDeviceList = function(jsonObj){
			var resultData = extractParameters(jsonObj);

			return resultData["DEVICE_LIST"];
		};

		/**
		 * 인증서 리스트 response
		 */
		var getResCertificateList = function(jsonObj){
			var resultData = extractParameters(jsonObj)["CERT_LIST"];
			var certAttrs = {};
			var certPemAttrs = {};
			var certListData = {};

			for(key in resultData){
				try{
					var cert = resultData[key];
					var certId = decodeURIComponent(cert["CERT_ID"]);
					var certPem = decodeURIComponent(cert["CERT"]);
					// 인증서 속성 파싱
					var attrs = coreFactory.Factory.Certs.parseCertAttributes(certPem);
					certAttrs[certId] = attrs;
					// 캐쉬할 인증서 정보
					certPemAttrs[certId] = certPem;
				}catch(e){
					utils.Log.error("not suppot : " + certPem);
				}
			}
			certListData["certAttrs"] = certAttrs;
			certListData["certPem"] = certPemAttrs;

			return certListData;
		};

		var getResSignature = function(jsonObj, envelopedInfo){
			var resultData = extractParameters(jsonObj, envelopedInfo);
			var vidAttr = {};
			// 서명 데이터 추출 공통으로 처리
//			var signature = decodeURIComponent(decodeURIComponent(resultData["SIGN_DATA"]));
//			if(signature.indexOf('-----BEGIN PKCS7-----') < 0){ // pem형식으로 Tag추가
//				signature = "-----BEGIN PKCS7-----" + signature + "-----END PKCS7-----";
//			}
			vidAttr["SIGNATURE"] = decodeURIComponent(resultData["SIGN_DATA"]);
			vidAttr["VID_CERTIFICATE"] = decodeURIComponent(resultData["CERT"]);
			vidAttr["VID_PRIVATE_KEY"] = decodeURIComponent(resultData["PRIVATE_KEY"]);
			// vid 추출
			vidAttr["VID_RANDOM"] = decodeURIComponent(resultData["VID_RANDOM"]);
			if(resultData.OPTION){
				vidAttr["PKCS1_SIGNATURE"] = decodeURIComponent(resultData.OPTION["P1SIGN_SECURE_NONCE"]);
			}

			return vidAttr;
		};

		var getResDeleteCertificate = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			resultData["CERT"] = decodeURIComponent(resultData["CERT"]);
			resultData["PRIVATE_KEY"] = decodeURIComponent(resultData["PRIVATE_KEY"]);
			return resultData;
		};

//		var getResChangeCertificate = function(jsonObj){
//
//		};

		var getResCopyCertificate = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			if(resultData['CERT']){
				resultData['CERT'] = decodeURIComponent(resultData['CERT']);
				resultData['PRIVATE_KEY'] = decodeURIComponent(resultData['PRIVATE_KEY']);
				if(resultData['KM_CERT']){
					resultData['KM_CERT'] = decodeURIComponent(resultData['KM_CERT']);
				}
				if(resultData['KM_PRIVATE_KEY']){
					resultData['KM_PRIVATE_KEY'] = decodeURIComponent(resultData['KM_PRIVATE_KEY']);
				}
			}

			return resultData;
		};

		/*
		 * 인증서 발급 response
		 * 인증서	CERT	PEM 형식의 인증서
		 * 개인키	PRIVATE_KEY	개인키 (PKCS8)
		 */
		var getResIssueCertificate = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			if(resultData['CERT']){
				resultData['CERT'] = decodeURIComponent(resultData['CERT']);
				resultData['PRIVATE_KEY'] = decodeURIComponent(resultData['PRIVATE_KEY']);
				if(resultData['KM_CERT']){
					resultData['KM_CERT'] = decodeURIComponent(resultData['KM_CERT']);
				}
				if(resultData['KM_PRIVATE_KEY']){
					resultData['KM_PRIVATE_KEY'] = decodeURIComponent(resultData['KM_PRIVATE_KEY']);
				}
			}

			//resultData['CERT'] = "MIIFxzCCBK+gAwIBAgIDQClvMA0GCSqGSIb3DQEBCwUAMFcxCzAJBgNVBAYTAmtyMRAwDgYDVQQKDAd5ZXNzaWduMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExHzAdBgNVBAMMFnllc3NpZ25DQS1UZXN0IENsYXNzIDMwHhcNMTYwMTE3MTUwMDAwWhcNMTYwMjE4MTQ1OTU5WjCBhTELMAkGA1UEBhMCa3IxEDAOBgNVBAoMB3llc3NpZ24xFDASBgNVBAsMC3BlcnNvbmFsNElCMRAwDgYDVQQLDAdJTklURUNIMTwwOgYDVQQDDDM1NjEwMjMxOTM5MTYwKEtJTERPTkcuSE9ORykwMDkxMDQzMjAxNjAxMTgxOTEwMDAwMTUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCokELK398ftq3l6FCTejtDnC0k5ISCihaB9XTNor3Qz8QbNdLf5KMGIRGpodp1jXxZLqAW9lR1Da9srikPL962/wVLxPSCdRju6GVTDLZOH/vDMVzNIg0zqgYiTGYkbjzlarm3kXlc511y3iOZru180FsAEnP9pPYpGXfVJkmBVH2bcEvUVRBT1ZlSHHxvMq6gmLDWLVtHrbJhbuZYEB5Mh/SQSa6YWRIWj4Oxf6dUXBQOKWvZahTQM5K2zkbLDVuzWBvgGxTUTcy188fa/zDdYSZKgmuBanFeFOJ1aiLTMHPhat7RbRP2Ow+W+Rf4D1bWORKOJ0oMxn+eF2aKYnD/AgMBAAGjggJrMIICZzCBkwYDVR0jBIGLMIGIgBRw+n2Dw0UfFJrv8Cg+E4xduwULlKFtpGswaTELMAkGA1UEBhMCS1IxDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwxGzAZBgNVBAMMEktpc2EgVGVzdCBSb290Q0EgNoIBCDAdBgNVHQ4EFgQUU7cAp8yplWwOLkzt7e16kawQAr0wDgYDVR0PAQH/BAQDAgbAMH4GA1UdIAEB/wR0MHIwcAYJKoMajJpFAQEEMGMwMAYIKwYBBQUHAgIwJB4ix3QAIMd4yZ3BHLKUACDC3NXYxqkAIMd4yZ3BHMeFssiy5DAvBggrBgEFBQcCARYjaHR0cDovL3Nub29weS55ZXNzaWduLm9yLmtyL2Nwcy5odG0wbAYDVR0RBGUwY6BhBgkqgxqMmkQKAQGgVDBSDA01NjEwMjMxOTM5MTYwMEEwPwYKKoMajJpECgEBATAxMAsGCWCGSAFlAwQCAaAiBCBDPdpLDp87H/Tu3xYBeKNZ2+cw48ydssShTzvy3HQRejB0BgNVHR8EbTBrMGmgZ6BlhmNsZGFwOi8vc25vb3B5Lnllc3NpZ24ub3Iua3I6NjAyMC9vdT1kcDE3cDQsb3U9QWNjcmVkaXRlZENBLG89eWVzc2lnbixjPWtyP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3QwPAYIKwYBBQUHAQEEMDAuMCwGCCsGAQUFBzABhiBodHRwOi8vc25vb3B5Lnllc3NpZ24ub3Iua3I6NDYxMjANBgkqhkiG9w0BAQsFAAOCAQEAW5jVBGHycLCf+3x4kmBubU6gOoQhOZvf8hBOGjYwNGoqA72OrzBn79QIfGB1AYN3Q5O1ntrZp8BI4TNL3Dl5Kn4gNOxwRiNtsO1nJebzq/nS4om5oeU6AfKBCcV/8Csitl1G+nKAYQflMsSxNdJB+nKarGRUtNZvkIiZTnug25wpqL4W3h5IhnimZqAdbiX4NagX2m1t4HyWAIOMhj53w03OKLBL2ekhE0igvHLoupciKKFDro/yGXjLbC3jv6/gfEZpUHXC7tiRH2YeFors4LpYN8ld23lkIO6ehkCui4kXVR5sETsP6uvoVNOMKgu8IVPyIPz3kF0qRkXgU7Q3bg==";
			//resultData['PRIVATE_KEY'] = "MIIFEDAaBggqgxqMmkQBDzAOBAg86PGnw01f+gICCAAEggTwidIj97UZoZJeN6mI2Lsl6kG4O26N0R5PefSUnlDrd7fx+vp9/m16rMTSisQs6YzxEZt5UwO/aJ2mYoms+hongwoqVkMHdVn5LAxN681TGZmrdfVysf3u/DnCwx7ODpviwMW0ufYEJbruiGmqQVx57nQK2t3Dx4/deQh81UygWhF0OeI4dqT/LPdm94xWdEeKyLZFNNzqDWo7xzEQebmwR4S05Xo0RzQFVF3q54gfF/Aq2ixJbnE1YhbNnH6eejPdREb5kDPu1LWxAkmkBS8eAT/uXq1qyv5mcdKDEtLIPvNKujm6OsQz0TmN6IRC/LsOWHpOPKQLha2e2eu3ffqIJ3g/MHXppPjvnZEVQhZt/kjJPil7RSqHzZqBHWrZBqUe9gtxdchvtTaR7nISdw5SAbMICMo6xIahpVWz4elseV3+T6ezKTPvq35WMJffsKhRaXMbhb1gpWOFRsOUqhm9OZw5681lxjbdtU83EzmkGsQ6LEpaBpwC08mXU4fSvmAOoQpDGPZzJ7dC/+WaaLjp8KBn8ByqBkCQy+rtHTK9SkXNRpyMIcBZmNlsm4ZafSkP0OxhIWNxIBqeCReRycg66kilwdbDgcaaVF9Lrrf6eeiTmqerNQlfumNi1u3BQJ+2yOKO43jOJUXg3AEqSMShlEWd7CnxzJ6u82zh7MGCsbM5ZVvLACXs4dRm+3TuaS85xgj9rSoEbNZ65XGqOgrsoaZTSDAmEk59prP283HfgEk5ik/5sHjqeUi776AL5Mlcbc56rS3HEf+SfA2A1VHmsmZPrXh5YdGo7TC62iiFm7T3XdTMaIldvHR/gqBJjwlP5/4dNHT/vbekB1mExns3lHcj4KTOu2nB8BIgq9Ut1LAwZbCQOtnzkgmOiihrM3+cTKGqu4+Sb488CsgnDbdw0jflnNwb7xnaabysicFNrlrNAVCDOcckK68TjNhbyujW7Z9+hqYCiFQIE25xiQfEFtPRDA2lGvZlD20j9ZW72YXdlXIYgpNvR7uoQFFVXRK8f7qJZ4Wz4qwR9/95AKnzNP0z+YEmMM0GELWfneKEJJCsr5YSHOGSFJvW+53ApJiQ7QJPK/NzdFV0LdWrG7aYxAPtnbEyqGl/gK5MjfKeI1kAs57iWREtfccxzYDMj9thw7QFLzf3D0HXxEOSCPht3Ac8nsH0XvT3ebRKv5CLQ/dMfgUh+LVUAhPrmemh6yjLoaxVcJJ+bJSg3HAOH5o8fPgxIT33+1+wdguh4WIBXrok2yfLEGhtTwMk17b9EWPxOXmI7xJ25LqSxG/T/A83deWJgndlFmCKjd3M+5TE0iZsjmqEqtA2VCcwVcH4+9uq+m3dDLKTsWqArqHBFFh8H8hZufdLr7YYdSBLxIGTf+JDaraGFt9hMy3P8QK748gKYV9s2rGy5BtxeyYbCc8uiacU8brj/F9QNg4wRXmK2Y6tv01YC19IIcO1kppDKIckt/3kS3WXbWlX3ht2LWLvF3czjZUTGhvNUf0aNyV4t1oWS260PNdJBlaXdeQrKy0P5zjpV4ePsyoOsQfBokfs1n4sydwQb+kheFTpml3dG+NUsWVJJ81KK//5mffZym0FfnppmzKnuZDNvtG/l79l98bPFM+Fuqv5aEw3M9ITXrUBnd2cS7jckZYvQlGHT7QD8nUXuk1JwHeAsNSQiirT+g==";

			return resultData;
		};

		/*
		 * 인증서 재발급 response
		 * 인증서	CERT	PEM 형식의 인증서
		 * 개인키	PRIVATE_KEY	개인키 (PKCS8)
		 */
		var getResReIssueCertificate = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			if(resultData['CERT']){
				resultData['CERT'] = decodeURIComponent(resultData['CERT']);
				resultData['PRIVATE_KEY'] = decodeURIComponent(resultData['PRIVATE_KEY']);
				if(resultData['KM_CERT']){
					resultData['KM_CERT'] = decodeURIComponent(resultData['KM_CERT']);
				}
				if(resultData['KM_PRIVATE_KEY']){
					resultData['KM_PRIVATE_KEY'] = decodeURIComponent(resultData['KM_PRIVATE_KEY']);
				}
			}

			//resultData['CERT'] = "MIIFxzCCBK+gAwIBAgIDQClvMA0GCSqGSIb3DQEBCwUAMFcxCzAJBgNVBAYTAmtyMRAwDgYDVQQKDAd5ZXNzaWduMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExHzAdBgNVBAMMFnllc3NpZ25DQS1UZXN0IENsYXNzIDMwHhcNMTYwMTE3MTUwMDAwWhcNMTYwMjE4MTQ1OTU5WjCBhTELMAkGA1UEBhMCa3IxEDAOBgNVBAoMB3llc3NpZ24xFDASBgNVBAsMC3BlcnNvbmFsNElCMRAwDgYDVQQLDAdJTklURUNIMTwwOgYDVQQDDDM1NjEwMjMxOTM5MTYwKEtJTERPTkcuSE9ORykwMDkxMDQzMjAxNjAxMTgxOTEwMDAwMTUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCokELK398ftq3l6FCTejtDnC0k5ISCihaB9XTNor3Qz8QbNdLf5KMGIRGpodp1jXxZLqAW9lR1Da9srikPL962/wVLxPSCdRju6GVTDLZOH/vDMVzNIg0zqgYiTGYkbjzlarm3kXlc511y3iOZru180FsAEnP9pPYpGXfVJkmBVH2bcEvUVRBT1ZlSHHxvMq6gmLDWLVtHrbJhbuZYEB5Mh/SQSa6YWRIWj4Oxf6dUXBQOKWvZahTQM5K2zkbLDVuzWBvgGxTUTcy188fa/zDdYSZKgmuBanFeFOJ1aiLTMHPhat7RbRP2Ow+W+Rf4D1bWORKOJ0oMxn+eF2aKYnD/AgMBAAGjggJrMIICZzCBkwYDVR0jBIGLMIGIgBRw+n2Dw0UfFJrv8Cg+E4xduwULlKFtpGswaTELMAkGA1UEBhMCS1IxDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwxGzAZBgNVBAMMEktpc2EgVGVzdCBSb290Q0EgNoIBCDAdBgNVHQ4EFgQUU7cAp8yplWwOLkzt7e16kawQAr0wDgYDVR0PAQH/BAQDAgbAMH4GA1UdIAEB/wR0MHIwcAYJKoMajJpFAQEEMGMwMAYIKwYBBQUHAgIwJB4ix3QAIMd4yZ3BHLKUACDC3NXYxqkAIMd4yZ3BHMeFssiy5DAvBggrBgEFBQcCARYjaHR0cDovL3Nub29weS55ZXNzaWduLm9yLmtyL2Nwcy5odG0wbAYDVR0RBGUwY6BhBgkqgxqMmkQKAQGgVDBSDA01NjEwMjMxOTM5MTYwMEEwPwYKKoMajJpECgEBATAxMAsGCWCGSAFlAwQCAaAiBCBDPdpLDp87H/Tu3xYBeKNZ2+cw48ydssShTzvy3HQRejB0BgNVHR8EbTBrMGmgZ6BlhmNsZGFwOi8vc25vb3B5Lnllc3NpZ24ub3Iua3I6NjAyMC9vdT1kcDE3cDQsb3U9QWNjcmVkaXRlZENBLG89eWVzc2lnbixjPWtyP2NlcnRpZmljYXRlUmV2b2NhdGlvbkxpc3QwPAYIKwYBBQUHAQEEMDAuMCwGCCsGAQUFBzABhiBodHRwOi8vc25vb3B5Lnllc3NpZ24ub3Iua3I6NDYxMjANBgkqhkiG9w0BAQsFAAOCAQEAW5jVBGHycLCf+3x4kmBubU6gOoQhOZvf8hBOGjYwNGoqA72OrzBn79QIfGB1AYN3Q5O1ntrZp8BI4TNL3Dl5Kn4gNOxwRiNtsO1nJebzq/nS4om5oeU6AfKBCcV/8Csitl1G+nKAYQflMsSxNdJB+nKarGRUtNZvkIiZTnug25wpqL4W3h5IhnimZqAdbiX4NagX2m1t4HyWAIOMhj53w03OKLBL2ekhE0igvHLoupciKKFDro/yGXjLbC3jv6/gfEZpUHXC7tiRH2YeFors4LpYN8ld23lkIO6ehkCui4kXVR5sETsP6uvoVNOMKgu8IVPyIPz3kF0qRkXgU7Q3bg==";
			//resultData['PRIVATE_KEY'] = "MIIFEDAaBggqgxqMmkQBDzAOBAg86PGnw01f+gICCAAEggTwidIj97UZoZJeN6mI2Lsl6kG4O26N0R5PefSUnlDrd7fx+vp9/m16rMTSisQs6YzxEZt5UwO/aJ2mYoms+hongwoqVkMHdVn5LAxN681TGZmrdfVysf3u/DnCwx7ODpviwMW0ufYEJbruiGmqQVx57nQK2t3Dx4/deQh81UygWhF0OeI4dqT/LPdm94xWdEeKyLZFNNzqDWo7xzEQebmwR4S05Xo0RzQFVF3q54gfF/Aq2ixJbnE1YhbNnH6eejPdREb5kDPu1LWxAkmkBS8eAT/uXq1qyv5mcdKDEtLIPvNKujm6OsQz0TmN6IRC/LsOWHpOPKQLha2e2eu3ffqIJ3g/MHXppPjvnZEVQhZt/kjJPil7RSqHzZqBHWrZBqUe9gtxdchvtTaR7nISdw5SAbMICMo6xIahpVWz4elseV3+T6ezKTPvq35WMJffsKhRaXMbhb1gpWOFRsOUqhm9OZw5681lxjbdtU83EzmkGsQ6LEpaBpwC08mXU4fSvmAOoQpDGPZzJ7dC/+WaaLjp8KBn8ByqBkCQy+rtHTK9SkXNRpyMIcBZmNlsm4ZafSkP0OxhIWNxIBqeCReRycg66kilwdbDgcaaVF9Lrrf6eeiTmqerNQlfumNi1u3BQJ+2yOKO43jOJUXg3AEqSMShlEWd7CnxzJ6u82zh7MGCsbM5ZVvLACXs4dRm+3TuaS85xgj9rSoEbNZ65XGqOgrsoaZTSDAmEk59prP283HfgEk5ik/5sHjqeUi776AL5Mlcbc56rS3HEf+SfA2A1VHmsmZPrXh5YdGo7TC62iiFm7T3XdTMaIldvHR/gqBJjwlP5/4dNHT/vbekB1mExns3lHcj4KTOu2nB8BIgq9Ut1LAwZbCQOtnzkgmOiihrM3+cTKGqu4+Sb488CsgnDbdw0jflnNwb7xnaabysicFNrlrNAVCDOcckK68TjNhbyujW7Z9+hqYCiFQIE25xiQfEFtPRDA2lGvZlD20j9ZW72YXdlXIYgpNvR7uoQFFVXRK8f7qJZ4Wz4qwR9/95AKnzNP0z+YEmMM0GELWfneKEJJCsr5YSHOGSFJvW+53ApJiQ7QJPK/NzdFV0LdWrG7aYxAPtnbEyqGl/gK5MjfKeI1kAs57iWREtfccxzYDMj9thw7QFLzf3D0HXxEOSCPht3Ac8nsH0XvT3ebRKv5CLQ/dMfgUh+LVUAhPrmemh6yjLoaxVcJJ+bJSg3HAOH5o8fPgxIT33+1+wdguh4WIBXrok2yfLEGhtTwMk17b9EWPxOXmI7xJ25LqSxG/T/A83deWJgndlFmCKjd3M+5TE0iZsjmqEqtA2VCcwVcH4+9uq+m3dDLKTsWqArqHBFFh8H8hZufdLr7YYdSBLxIGTf+JDaraGFt9hMy3P8QK748gKYV9s2rGy5BtxeyYbCc8uiacU8brj/F9QNg4wRXmK2Y6tv01YC19IIcO1kppDKIckt/3kS3WXbWlX3ht2LWLvF3czjZUTGhvNUf0aNyV4t1oWS260PNdJBlaXdeQrKy0P5zjpV4ePsyoOsQfBokfs1n4sydwQb+kheFTpml3dG+NUsWVJJ81KK//5mffZym0FfnppmzKnuZDNvtG/l79l98bPFM+Fuqv5aEw3M9ITXrUBnd2cS7jckZYvQlGHT7QD8nUXuk1JwHeAsNSQiirT+g==";

			return resultData;
		};

		/*
		 * 인증서 갱신 response
		 * 인증서	CERT	PEM 형식의 인증서
		 * 개인키	PRIVATE_KEY	개인키 (PKCS8)
		 */
		var getResUpdateCertificate = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			if(resultData['CERT']){
				resultData['CERT'] = decodeURIComponent(resultData['CERT']);
				resultData['PRIVATE_KEY'] = decodeURIComponent(resultData['PRIVATE_KEY']);
				if(resultData['KM_CERT']){
					resultData['KM_CERT'] = decodeURIComponent(resultData['KM_CERT']);
				}
				if(resultData['KM_PRIVATE_KEY']){
					resultData['KM_PRIVATE_KEY'] = decodeURIComponent(resultData['KM_PRIVATE_KEY']);
				}
			}

			return resultData;
		};

//		var getResExportCertificate = function(jsonObj){
//
//		};

		var getResLoadCertificate = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			if(resultData['PRIVATE_KEY']){
				var priKey = decodeURIComponent(resultData['PRIVATE_KEY']);
				priKey = coreFactory.Factory.Util.privateKeyPemTagAdd(priKey);
				resultData['PRIVATE_KEY'] = priKey;

				var cert = decodeURIComponent(resultData['CERT']);
				cert = coreFactory.Factory.Util.certPemTagAdd(cert);
				resultData['CERT'] = cert;

				if(resultData['KM_PRIVATE_KEY']){
					var kmPriKey = decodeURIComponent(resultData['KM_PRIVATE_KEY']);
					kmPriKey = coreFactory.Factory.Util.privateKeyPemTagAdd(kmPriKey);
					resultData['KM_PRIVATE_KEY'] = kmPriKey;
				}

				if(resultData['KM_CERT']){
					var kmCert = decodeURIComponent(resultData['KM_CERT']);
					kmCert = coreFactory.Factory.Util.certPemTagAdd(kmCert);
					resultData['KM_CERT'] = kmCert;
				}
			}
			return resultData;
		};

		var getResPublicKey = function(jsonObj){
			var resultData = extractParameters(jsonObj);
			var pubKey;

			if(resultData['PUBLIC_KEY']){
				pubKey = decodeURIComponent(resultData['PUBLIC_KEY']);

//				pubKey = pubKey.replace("-----BEGIN PUBLIC KEY-----", "");
//				pubKey = pubKey.replace("-----END PUBLIC KEY-----", "");
//				pubKey = pubKey.replace(/\n/g, "");
//				pubKey = pubKey.replace(/\r/g, "");
				//pubKey = coreFactory.Factory.PriKey.publicKeyFromPem(pubKey);
			}

			//cert = coreFactory.Factory.Util.certPemTagAdd(cert);

			// E2E에 넘길 때 \r\n이 없어야 한다.
//			cert = cert.replace(/\n/g, "");
//			cert = cert.replace(/\r/g, "");

			return pubKey;
		};

//		var getResCertRelayExportCertificate = function(jsonObj){
//
//		};

//		var getResCertRelayImportCertificate = function(jsonObj){
//
//		};

		return{
			getResVersion : getResVersion,
			getResSignature : getResSignature,
			getResCertificateList : getResCertificateList,
			getResDeviceList : getResDeviceList,
			getResIssueCertificate : getResIssueCertificate,
			getResUpdateCertificate : getResUpdateCertificate,
			getResReIssueCertificate : getResReIssueCertificate,
			getResLoadCertificate : getResLoadCertificate,
			getResPublicKey : getResPublicKey
		};

	}());

	return{
		IniRequest : IniRequest,
		IniResponse : IniResponse
	};
});
