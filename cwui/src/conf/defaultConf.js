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
	'../core/utils',
	'../main/constants'
], function (utils, constants) {
	var customerConf = {};

	$.ajax({
		dataType: "json",
		url: GINI_HTML5_CONFIG_PATH,
		async: false, 
		success: function(response) {
			customerConf = response;

		  utils.Log.setLogLevel(customerConf.System.LogLevel || constants.System.LOG_LEVEL_ERROR);
		},
		error: function(request, status, error) {
		  utils.Log.error(error.message, error);
		}
	});

  /**
   * @desc : 초기화
   */
  (function initialize() {
    var host = location.hostname;
    
    if(host == customerConf.LOCAL_HOST){
      customerConf.System.OperationMode = constants.System.TEST_MODE;
      customerConf.System.UrlAddress = customerConf.System.UrlAddress_LOCAL;
      customerConf.System.CrossDomainStorageURL = customerConf.System.UrlAddress_LOCAL.CrossDomainStorageURL;
      customerConf.CAInfo = customerConf.CAInfo_DEV;
    }else if(host == customerConf.DEV_HOST){
      customerConf.System.OperationMode = constants.System.REAL_TEST_MODE;
      customerConf.System.UrlAddress = customerConf.System.UrlAddress_DEV;
      customerConf.System.CrossDomainStorageURL = customerConf.System.UrlAddress_DEV.CrossDomainStorageURL;
      customerConf.CAInfo = customerConf.CAInfo_DEV;
    }else if(host == customerConf.TEST_HOST){
      customerConf.System.OperationMode = constants.System.TEST_MODE;
      customerConf.System.UrlAddress = customerConf.System.UrlAddress_TEST;
      customerConf.System.CrossDomainStorageURL = customerConf.System.UrlAddress_TEST.CrossDomainStorageURL;
      customerConf.CAInfo = customerConf.CAInfo_DEV;
    }else{
      customerConf.System.OperationMode = constants.System.REAL_MODE;
      customerConf.System.UrlAddress = customerConf.System.UrlAddress_REAL;
      customerConf.System.CrossDomainStorageURL = customerConf.System.UrlAddress_REAL.CrossDomainStorageURL;
      customerConf.CAInfo = customerConf.CAInfo_REAL;
    }
  }());
 
	/**
	 * @desc : 시스템 설정 정보 
	 */
	var System = {
		// 시스템 언어 
		Language : constants.System.LANGUAGE_KOR,
		// 인증서 내보내기/가져오기 제한시간
		CertImportExportLimitTime : 100 - 1,
		// Core유형
		Core : constants.System.CRYPTO_TYPE_FORGE,
		// Log Level
		LogLevel : constants.System.LOG_LEVEL_ERROR,
		// 운영 모드 (test/real)
		OperationMode : constants.System.REAL_MODE,
		// 서버 URL 주소
		UrlAddress : {},
		// Cross domain storage 주소
		CrossDomainStorageURL : {},
		// Form Type
		FormTypeMain : constants.System.FORM_OPEN_MODE_DIALOG,
		FormTypeSub : constants.System.FORM_OPEN_MODE_LAYER,
		ExternalType : "",
		UseIniPluginData : false,
		PCInfo : [],
		EncryptedPacketMode : true
	};
	
	/** 
	 * @desc : 웹폼 설정 정보 
	 */
	var WebForm = (function() {
		/* 저장소 유형 및 표기 순서 */ 
		var STORAGE_POSITION = customerConf.WebForm.STORAGE_POSITION || [
			constants.Certs.STORAGE_BROWSER,
			constants.Certs.STORAGE_HDD,
			constants.Certs.STORAGE_USB,
			// constants.Certs.STORAGE_HSM,
			// constants.Certs.STORAGE_SCARD,
			// constants.Certs.STORAGE_PHONE,
			// constants.Certs.STORAGE_CLOUD,
			constants.Certs.STORAGE_SECURITY_DEVICE,
			constants.Certs.STORAGE_EXTEND
		];
		
		var STORAGE_EXT_POSITION = customerConf.WebForm.STORAGE_EXT_POSITION || [
			constants.Certs.STORAGE_USB,
			constants.Certs.STORAGE_SECURITY_DEVICE,
			constants.Certs.STORAGE_BAROSIGN
		];
		
		var STORAGE_TARGET_POSITION = customerConf.WebForm.STORAGE_TARGET_POSITION || [
			constants.Certs.STORAGE_BROWSER,
			constants.Certs.STORAGE_HDD,
			constants.Certs.STORAGE_USB,
			constants.Certs.STORAGE_SECURITY_TOKEN
		];
		
		//추가저장 작업자 : 정범교 작업일 : 20170403
		var ANOTHER_STORAGE_EXT_POSITION = customerConf.WebForm.ANOTHER_STORAGE_EXT_POSITION || [
			constants.Certs.STORAGE_USB,
			constants.Certs.STORAGE_SECURITY_DEVICE,
			constants.Certs.STORAGE_BAROSIGN
		];
		//--------------------------------------------
		
		//추가저장 작업자 : 정범교 작업일 : 20170403
		var ANOTHER_STORAGE_TARGET_POSITION = customerConf.WebForm.ANOTHER_STORAGE_TARGET_POSITION || [
			constants.Certs.STORAGE_BROWSER,
			constants.Certs.STORAGE_HDD,
			constants.Certs.STORAGE_USB,
			constants.Certs.STORAGE_SECURITY_TOKEN,
			// constants.Certs.STORAGE_PHONE
		];
		//--------------------------------------------
		
		/* 각 저장소 속성 */
		var STORAGE_ATTRIBUTES = {
			'BROWSER' : {
				STORAGE_ID : constants.Certs.STORAGE_BROWSER,
				DISABLE : true,
				CLASS_ID : 'browser',
				DESC_TEXT : {
					kor : '브라우저',
					eng : 'BROWSER'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'NONE',
				ALLOW_ACTION : ["ALL"],
				OS : ["ALL"]
			},
			'HARD_DISK' : {
				STORAGE_ID : constants.Certs.STORAGE_HDD,
				DISABLE : true,
				CLASS_ID : 'harddisk',
				DESC_TEXT : {
					kor : '하드디스크',
					eng : 'HardDisk'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'NONE',
				ALLOW_ACTION : ["ALL"],
				OS : ["ALL"]
			},
			'REMOVABLE_DISK' : {
				STORAGE_ID : constants.Certs.STORAGE_USB,
				DISABLE : true,
				CLASS_ID : 'removable',
				DESC_TEXT : {
					kor : '이동식디스크',
					eng : 'RemovableDisk'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'CS',
				ALLOW_ACTION : ["ALL"],
				OS : ["ALL"]
			},
			'SECURITY_TOKEN' : {
				STORAGE_ID : constants.Certs.STORAGE_SECURITY_TOKEN,
				DISABLE : true,
				CLASS_ID : 'token',
				DESC_TEXT : {
					kor : '보안토큰',
					eng : 'SecurityToken'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'CS',
				OS : ["WIN"],
				ALLOW_ACTION : [
					constants.WebForm.ACTION_LOGIN,
					constants.WebForm.ACTION_SIGN,
					constants.WebForm.ACTION_MANAGE,
					constants.WebForm.ACTION_CERT_SAVE,
					constants.WebForm.ACTION_CERT_ISSUE,
					constants.WebForm.ACTION_CERT_REISSUE,
					constants.WebForm.ACTION_CERT_UPDATE,
					constants.WebForm.ACTION_CERT_REVOKE,
					constants.WebForm.ACTION_CERT_CMP
				]
			},
			'SMART_CARD' : {
				STORAGE_ID : constants.Certs.STORAGE_SCARD,
				DISABLE : false,
				CLASS_ID : 'smart_card',
				DESC_TEXT : {
					kor : '스마트카드',
					eng : 'SmartCard'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'NONE',
				ALLOW_ACTION : ["ALL"],
				OS : ["ALL"]
			},
			'MOBILE' : {
				STORAGE_ID : constants.Certs.STORAGE_PHONE,
				DISABLE : true,
				CLASS_ID : 'cellphone',
				DESC_TEXT : {
					kor : '휴대폰',
					eng : 'CellPhone'
				},
				BOTTOM_BUTTON_ACTION : true,
				//임시(모비싸인 추가시 CS로 변경)
				SUB_TYPE : 'CS',
				ALLOW_ACTION : [
					constants.WebForm.ACTION_LOGIN,
					constants.WebForm.ACTION_SIGN
				],
				OS : ["WIN"]
			},
			'LOCAL_DISK' : {
				STORAGE_ID : constants.Certs.STORAGE_LOCAL,
				DISABLE : true,
				CLASS_ID : 'local_disk',
				DESC_TEXT : {
					kor : '로컬디스크',
					eng : 'LocalDisk'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'CS',
				ALLOW_ACTION : ["ALL"],
				OS : ["ALL"]
			},
			'EXTEND' : {
				STORAGE_ID : constants.Certs.STORAGE_EXTEND,
				DISABLE : true,
				CLASS_ID : 'extension',
				DESC_TEXT : {
					kor : '더보기',
					eng : 'Extend'
				},
				BOTTOM_BUTTON_ACTION : false,
				SUB_TYPE : 'POPUP',
				ALLOW_ACTION : ["ALL"],
				OS : ["ALL"]
			},
			'SECURITY_DEVICE' : {
				STORAGE_ID : constants.Certs.STORAGE_SECURITY_DEVICE,
				DISABLE : false,
				CLASS_ID : 'security_disk',
				DESC_TEXT : {
					kor : '표준보안매체',
					eng : 'SecurityDisk'
				},
				BOTTOM_BUTTON_ACTION : true,
				SUB_TYPE : 'NONE',
				OS : ["ALL"],
				ALLOW_ACTION : ["ALL"]
			},
			'CLOUD' : {
				STORAGE_ID : constants.Certs.STORAGE_CLOUD,
				DISABLE : false,
				CLASS_ID : 'cloud',
				DESC_TEXT : {
					kor : '클라우드',
					eng : 'Cloud'
				},
				BOTTOM_BUTTON_ACTION : false,
				SUB_TYPE : 'NONE',
				OS : ["ALL"],
				ALLOW_ACTION : [
					constants.WebForm.ACTION_LOGIN,
					constants.WebForm.ACTION_SIGN
				]
			},
			'BAROSIGN' : {
				STORAGE_ID : constants.Certs.STORAGE_BAROSIGN,
				DISABLE : true,
				CLASS_ID : 'qr_code',
				DESC_TEXT : {
					kor : '바로사인',
					eng : 'BaroSign'
				},
				BOTTOM_BUTTON_ACTION : false,
				SUB_TYPE : 'NONE',
				OS : ["ALL"],
				ALLOW_ACTION : [
					constants.WebForm.ACTION_LOGIN
					// constants.WebForm.ACTION_SIGN
				]
			},
			'USIM' : {
				STORAGE_ID : constants.Certs.STORAGE_USIM,
				DISABLE : false,
				CLASS_ID : 'smart_certify',
				DESC_TEXT : {
					kor : '스마트인증',
					eng : 'USIM'
				},
				BOTTOM_BUTTON_ACTION : false,
				SUB_TYPE : 'NONE',
				OS : ["WIN"],
				ALLOW_ACTION : [
					constants.WebForm.ACTION_LOGIN,
					constants.WebForm.ACTION_SIGN
				]
			}
		};

		var isDisplayHSMwithUSIM = function() {
			var isDisplayResult = false;
			// 보안토큰 리스트 설정
			// 0 or null: 디폴트
			// 1 : 목록에 표시함   
			// 2 : 목록에 표시하지 않음
			var displayHSMwithUSIM = customerConf.WebForm.DisplayHSMwithUSIM || 0;
			switch (displayHSMwithUSIM) {
				case 0:
					isDisplayResult = STORAGE_POSITION.includes(constants.Certs.STORAGE_USIM) || STORAGE_EXT_POSITION.includes(constants.Certs.STORAGE_USIM) ? false : true;
					break;
				case 1:
					isDisplayResult = true;
					break;
				case 2:
					isDisplayResult = false;
					break;
				default:
					break;
				}
			
			return isDisplayResult;
		}
		
		/**
		 * @desc : 각 저장소의 속성 정보를 제공
		 * @param storageType : 저장소 유형
		 * @return : 각 저장소에 대한 속성 정보
		 */
		function getStorageAttribute(storageType){
			var attrs = {};
			var custAttrs = customerConf.WebForm.STORAGE_ATTRIBUTES[storageType];
			if (!custAttrs || utils.String.isNull(custAttrs)) {
				// default
				attrs = STORAGE_ATTRIBUTES[storageType];
			} else {
				// merge처리
				defAttrs = STORAGE_ATTRIBUTES[storageType];
				attrs = utils.Collection.merge(defAttrs, custAttrs);
			}
			
			return attrs;
		}
		
		/**
		 * @desc : 인증서 버튼 관련 정보를 제공 
		 */
		var getButton = function(){
			var buttonAttrs = {};
			var storageList = this.storageList;
			
			utils.Log.debug('Storage List', storageList);
			
			for (var idx in storageList) {
				buttonAttrs[storageList[idx]] = getStorageAttribute(storageList[idx]);
			}
			
			utils.Log.debug('Storage Button Attributes : ', null, buttonAttrs);
			
			return buttonAttrs;
		}
		
		return {
			ColorPackCss : constants.WebForm.COLOR_PACK_ORANGE.CSS_PATH + constants.WebForm.COLOR_PACK_ORANGE.CSS_FILE,
			AnotherSave : false,
			ColorPackImagePath : constants.WebForm.COLOR_PACK_ORANGE.IMAGE_PATH,
			InnerColorCss : constants.WebForm.COLOR_PACK_INNER.CSS_PATH + constants.WebForm.COLOR_PACK_INNER.CSS_FILE,
			PasswordLimit : {
				'MIN_LENGTH' : 10,
				'MAX_LENGTH' : 30,
				'DENY_SAME_CHAR3' : true,
				'DENY_SERIAL_CHAR3' : true,
				'DENY_SAME_CHAR_LENGTH' : 3,
				'DENY_SERIAL_CHAR_LENGTH' : 3,
				'MIN_CHAR_TYPE' : "ANS"
			},
			getStorageButton : getButton.bind({storageList : STORAGE_POSITION}),
			getStorageExtButton : getButton.bind({storageList : STORAGE_EXT_POSITION}),
			getTargetStorageButton : getButton.bind({storageList : STORAGE_TARGET_POSITION}),
			getAnotherStorageExtButton : getButton.bind({storageList : ANOTHER_STORAGE_EXT_POSITION}),
			getAnotherTargetStorageButton : getButton.bind({storageList : ANOTHER_STORAGE_TARGET_POSITION}),
			Logo : constants.WebForm.LOGO,
			SubLogo : constants.WebForm.SUB_LOGO,
			isDisplayHSMwithUSIM : isDisplayHSMwithUSIM,
			getStorageAttribute : getStorageAttribute
		};
	}());
	
	/** 
	 * @desc : 인증서 설정 정보 
	 */
	var Certs = {
		// 인증서 속성 위치 정보 제공 
		CertAttrPosition : [
			constants.Certs.ATTR_SUBJECT,
			constants.Certs.ATTR_ISSUER,				
			constants.Certs.ATTR_OID_NAME,
			constants.Certs.ATTR_EXPIRE_DATE
		],

		// 저장소 유형 및 표기ID 위치 정범교SORT
		CertAttrPositionId : ['gubun','user','use_dt','make'],

		// 인증서 핊터링 목록
		FilterList : {
			// 로그인 인증서 Cache
			'CACHE' : true,
			// 만료 인증서 
			'EXPIRE' : true,
			// Issuer의 Hash값과 Subject의 Hash값을 비교
			'ISSUER_HASH' : true,
			// oid
			'OID' : [],
			// Issuer O값
			'ISSUER' : [],
			// Issuer CN값
			'ISSUER_CN' : []
		},

		USIMFilterList : {
			'USIM_FILTER_OID' : '1.2.410.200005.1.1.1|1.2.410.200005.1.1.2',
			'USIM_FILTER_ISSUERDN' : 'yessignCA-Test Class 3',
			// 'USIM_FILTER_SUBJECTDN' : '', 
			// 'USIM_FILTER_SERIAL' : '', 
			'USIM_FILTER_CA' : 'yessignCA Class 1|yesignCA class 2',
			// 만료된 인증서 표시여부 “0” – 만료된 인증서 표시 “1” – 만료된 인증서 표시 안함.
			'USIM_FILTER_EXPIRED' : '1', 
		},

		// 인증서 만료전 알림 기준 일자
		CertExpireNoticeDate : 30,

		// 외부 확장 저장 매체 제공 방식
		ExternalSupportType : constants.Certs.EXTERNAL_SUPPORT_DEAMON,

		// 정렬 ASC, DESC
		SortType : constants.Certs.SORT_TYPE_ASC,

		SortObject : constants.Certs.ATTR_SUBJECT,
		
		// OID-alias 		
		OID_Alias : {}
	};
	
	/**
	 * @desc : 로그인
	 */
	var Login = {
		// 로그인 전자서명 유형 제공
		LoginType : constants.Login.SIGN_PKCS1,
		// 로그인 서명 시 사용된는 Hash알고리즘
		SignatureHash : constants.Cipher.HASH_SHA1
	};
	
	/**
	 * @desc : 전자서명
	 */
	var Signature = {
		// 잔자서명 문자셋
		UrlEncodeCharSet : {
			// 원문 문자셋
			ORIGIRAL_CHAR_SET : constants.System.CHARACTER_UTF8,
			// 원문 URL 적용 여부
			ORIGIRAL_URL_ENCODE : true,
			// 서명시 URL 적용 여부
			SIGN_URL_ENCODE : true,
			// 서명시 문자셋
			SIGN_CHAR_SET : constants.System.CHARACTER_UTF8
		},
		
		// 전자서명 원문 포맷 타입
		PlanTextViewType : constants.Signature.SIGN_VIEW_NONE,
		
		// 전자서명 알고리즘 
		SignatureAlg : constants.Cipher.SIGN_RSA,
		
		// 전자서명 시 사용된는 Hash알고리즘
		SignatureHash : constants.Cipher.HASH_SHA256,
		
		// key, value 구분자
		KeyValueDelimiter : constants.Signature.DELIMITER_EQUAL,
		
		// 필드 구분자
		FieldDelimiter : constants.Signature.DELIMITER_AMP,
		
		MultiDelimiter : constants.Signature.DELIMITER_ENTER,
		
		// form에서 전자서명 대상을 필터링 정보를 제공 한다.
		FormElementFilter : null,
		
		// base64 decoding 후 전자서명
		Base64DecodeAfterSign : "FALSE",
		
		DecorationTag : null,
		
		// 금결원 포맷 전자서명 PKCS#7
		KftcSignFormat : "FALSE",
		
		// Random 포함 전자 서명 PKCS#7
		IncludeRandomSignFormat : "FALSE",
		
		// 원문 제거 전자서명 PKCS#7
		RemoveContentSignFormat : "FALSE",
		
		StorageHide : false // 사용 안함???
	};
	
	/**
	 * @desc : 유틸
	 */
	var Utils = {
		dateFormat : undefined,
		dateTimeFormat : undefined
	};
	
	var CAInfo = (function() {
		var getCAInfo = function(caCode) {
			/** 20170113 수정 */
			var caInfo = {};
			switch (caCode){
				case "01" :
				case "YESSIGN" :
					caInfo = customerConf.CAInfo['YessignCA'];
					break;
				case "03" :
				case "CROSSCERT" :
					caInfo = customerConf.CAInfo['CrossCertCA'];
					break;
				case "04" :
				case "SIGNKOREA" :
					caInfo = customerConf.CAInfo['SignKoreaCA'];
					break;
				case "05" :
				case "SIGNGATE" :
					caInfo = customerConf.CAInfo['SignGateCA'];
					break;
				default : 
					caInfo = customerConf.CAInfo['InitechCA'];
			}
			return caInfo;
		};
		
		return {
			getCAInfo : getCAInfo
		}
		
	}());
	
	var Front = {
	    inputLayout : {
	      targetContainer : {
	        NONCE : ".certifacte_input_nonce",  
	        NEW_NONCE : ".certifacte_input_new_nonce",
	        NEW_NONCE_CNF : ".certifacte_input_new_nonce_cnf",
	        SECURE : ".certifacte_input_secure", 
	        TARGET_SECURE : ".certifacte_input_target_secure" 
	      }
	    }
	}
	
	var defaultConf = {
		System : System,
		WebForm : WebForm,
		Certs : Certs,
		Login : Login,
		Signature : Signature,
		Utils : Utils,
		CAInfo : CAInfo,
		KeyStrokeSecurity : {},
		Front : Front
	};

	(function configMerge(obj, target, path) {
	  path = (path || "defaultConf") + ".";
	  
		for (var key in obj) {
			if (typeof obj[key] === "object") {
				if (Array.isArray(obj[key]) || !hasChildObject(obj[key])) {
					target[key] = obj[key];
					
					utils.Log.debug(path + key + "=" + JSON.stringify(obj[key]));
				} else {
					if (target[key]) {
						configMerge(obj[key], target[key], path + key);
					} else {
						target[key] = obj[key];

            utils.Log.debug(path + key + "=" + JSON.stringify(obj[key]));
					}
				}
			} else {
				target[key] = obj[key];

        utils.Log.debug(path + key + "=" + JSON.stringify(obj[key]));
			}
		}
	})(customerConf, defaultConf);

	function hasChildObject(obj) {
		for (var key in obj) {
			if (!Array.isArray(obj[key]) && typeof obj[key] === "object") return true;
		}

		return false;
	}

	return defaultConf;
});
