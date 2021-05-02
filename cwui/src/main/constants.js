/*******************************************************************************
 * # Copyright(c) Initech # 설명 : # 이력 - [2015-10-01] : 최초 구현
 ******************************************************************************/

define([
        '../core/forgeCrypto/forge'
        ], function () {

	/**
	 * @desc : 시스템에서 사용되는 상수 정보
	 */
	var System = {
		/* 버전 */
		VERSION : '1.0.0',
		/* Protocol 버전 */
		PROTOCOl : '1.0',
		/* 운영 모드 */
		REAL_MODE : 'REAL_MODE',
		TEST_MODE : 'TEST_MODE',
		REAL_TEST_MODE : 'REAL_TEST_MODE',

		/* 시스템 언어 상수 */
		LANGUAGE_ENG : 'eng',
		LANGUAGE_KOR : 'kor',

		/* 로그 레벨 */
		LOG_LEVEL_DEBUG : 5,
		LOG_LEVEL_INFO : 4,
		LOG_LEVEL_WARN : 3,
		LOG_LEVEL_ERROR : 2,
		LOG_LEVEL_FATAL : 1,
		LOG_LEVEL_OFF : 0,

		/* Crypto 유형 */
		CRYPTO_TYPE_INITECH : 'iniCrypto',
		CRYPTO_TYPE_FORGE : 'forge',

		/* 저장소 명칭 */
		INI_PRIVATE_STORAGE : 'INI_PRIVATE_STORAGE',

		// INI_PRIVATE_STORAGE : 'INI_PRIVATE_STORAGE', -->변경 :
		// Certs.CERTIFICATE_NORMAL_ATTR
		// INI_PRIVATE_ATTR_STORAGE : 'INI_PRIVATE_ATTR_STORAGE', -->변경 :
		// Certs.CERTIFICATE_DETAIL_ATTR

		/* URL정보 */
		URL_SYNCHRONISE : 'SYNCHRONISE',
		URL_KEY_PAIR : 'KEY_PAIR',
		URL_SYNCHRONISE_TIME : 'SYNCHRONISE_TIME',
		URL_CERT_RELAY_EXPORT : 'CERT_RELAY_EXPORT',
		URL_CERT_RELAY_IMPORT : 'CERT_RELAY_IMPORT',
		URL_CERT_RELAY_EXPORT_V11 : 'CERT_RELAY_EXPORT_V11',
		URL_CERT_RELAY_IMPORT_V11 : 'CERT_RELAY_IMPORT_V11',
		URL_DERIVED_KEY : 'DERIVED_KEY',

		/* 저장소 유형 */
//		STORAGE_TYPE_CROSS : 'CROSS_DOMAIN', // 모든 도메인에서 사용				(필요 없음)
//		STORAGE_TYPE_LOCAL : 'LOCAL_STORAGE', // 각 도메인 단위로 관리			(필요 없음)
//		STORAGE_TYPE_SESSION : 'SESSION_STORAGE', // 브라우저를 실행하는 동안에만 사용	(필요 없음)
		/* 저장소 읽기 범위 */
//		STORAGE_WEB_ALL : 'WEB_ALL',	(필요 없음)

		EXTERNAL_CROSSWEB_EX : 'CROSSWEB_EX',
		EXTERNAL_MOASIGN_EX : 'MOASIGN_EX',

		/* character 유형 */
		CHARACTER_EUC_KR : 'euc-kr',
		CHARACTER_UTF8 : 'utf8',

		/* Exception유형 */
		EXCEPTION_ERROR : 'error',
		EXCEPTION_WARN : 'warn',
		EXCEPTION_INFO : 'info',

		/* 메시지 문구 변경 상수 */
		REPLACE_CHAR : '[REPLACE_CHAR]',

		/* crossweb Ex server시간 가져오는 url */
//		SERVER_TIME_URL : 'http://demo.initech.com' + GINI_HTML5_BASE_PATH + '/cw/initech/plugin64/tools/Time.jsp',
//		CROSS_DOMAIN_STORAGE : {
//			dns: "https:gate.initech.com",
//			path: GINI_HTML5_BASE_PATH + '/res/crossd_iframe.html',
//			check: GINI_HTML5_BASE_PATH + '/res/crossd_check.html'
//		},
		FORM_OPEN_MODE_DIALOG : "DIALOG",
		FORM_OPEN_MODE_LAYER : "LAYER",

		FORM_TYPE_MAIN : "MAIN",
		FORM_TYPE_SUB : "SUB",
		FORM_TYPE_DRAW : "DRAW",

		/* CMP 유형 */
		// 옵션화 할 지 추후 검토
		CMP_RELAY_TYPE : "CMP_RELAY",
		CMP_CS_TYPE : "CMP_CS",

		/* Extension 암호 모드 */
		ENCRYPTED_TRUE : true,
		ENCRYPTED_FALSE : false
	};

	var KeyStrokeSecurity = {
		/* KEYPAD_NAME */
		KEYPAD_NAME : {
			TOUCHEN_KEY : "TOUCHEN_KEY",
      AHNLAB_KEY : "AHNLAB_KEY",
			UNIWEB_KEY : "UNIWEB_KEY",
			TRANS_KEY : "TRANS_KEY",
		}
	};

	var Browser = {
		EXPLORER : "explorer",
		CHROME : "chrome",
		FIREFOX : "firefox",
		SAFARI : "safari",
		OPERA : "opera",
		NETSCAPE : "netscape",
		MOZILLA : "mozilla"
	};

	/**
	 * @desc : 인증서에서 사용되는 상수 정보
	 */
	var Certs = {
		/* 저장매체 */
		STORAGE_BROWSER : 'BROWSER',
		STORAGE_HDD : 'HARD_DISK',
		STORAGE_USB : 'REMOVABLE_DISK',
		STORAGE_USIM : 'USIM',
		STORAGE_SECURITY_TOKEN : 'SECURITY_TOKEN',
		STORAGE_SCARD : 'SMART_CARD',
		STORAGE_SECURITY_DEVICE : 'SECURITY_DEVICE',
		STORAGE_PHONE : 'MOBILE',
		STORAGE_PHONE_INFOVINE : 'INFOVINE',
		STORAGE_PHONE_MOBISIGN : 'MOBISIGN',
		STORAGE_LOCAL : 'LOCAL_DISK',
		STORAGE_CLOUD : 'CLOUD',
		STORAGE_HSM : 'HSM',
		STORAGE_EXTEND : 'EXTEND',
		STORAGE_BAROSIGN : 'BAROSIGN',
		SMART_CERTIFY : 'SMART_CERTIFY',



		/* 정렬 */
		SORT_TYPE_ASC : "ASC",
		SORT_TYPE_DESC : "DESC",

		/* 인증서 속성 */
		ATTR_SERIAL : 'SERIAL',
		ATTR_SUBJECT : 'SUBJECT',
		ATTR_ISSUER_CN : 'ISSUER_CN',
		ATTR_ISSUER : 'ISSUER',
		ATTR_EXPIRE : 'EXPIRE',
		ATTR_EXPIRE_DATE : 'EXPIRE_DATE',
		ATTR_EXPIRE_STATUS : 'EXPIRE_STATUS',
		ATTR_OID : 'OID',
		ATTR_OID_NAME : 'OID_NAME',
		ATTR_ISSUER_HASH : 'ISSUER_HASH',
		ATTR_BEFORE_DT : 'BEFORE_DT',

		/* 인증서 속성  simple*/
		ATTR_SIMPLE_ISSUER : 'SIMPLE_ISSUER',
		ATTR_SIMPLE_OIDNAME : 'SIMPLE_OIDNAME',
		ATTR_SIMPLE_SUBJECT : 'SIMPLE_SUBJECT',

		/* 인증서 필터 항목 */
		FILTER_CACHE : 'CACHE',
		FILTER_EXPIRE : 'EXPIRE',
		FILTER_OID : 'OID',
		FILTER_ISSUER : 'ISSUER',
		FILTER_SERIAL : 'SERIAL',
		FILTER_ISSUER_CN : 'ISSUER_CN',
		FILTER_ISSUER_HASH : 'ISSUER_HASH',
		FILTER_ISSUER_SERIAL : 'ISSUER_SERIAL',

		/* 인증서 만료 기간 상태 */
		CERT_EXPIRE_STATUS_INVALID : 0,
		CERT_EXPIRE_STATUS_IMMINENT : 1,
		CERT_EXPIRE_STATUS_VALID : 2,

		/* 인증서 만료기간 css class */
		CERT_EXPIRE_CSS_VALID : 'cert1',
		CERT_EXPIRE_CSS_INVALID : 'cert3',
		CERT_EXPIRE_CSS_EXPIRE_STATUS_IMMINENT : 'cert2',

		/* 인증서 만료기간 폰트 css  */
		CERT_EXPIRE_FONT_VALID : '',
		CERT_EXPIRE_FONT_INVALID : 'font-color-em1',
		CERT_EXPIRE_FONT_EXPIRE_STATUS_IMMINENT : 'font-color-em2',


		/* 인증서 만료기간 이미지 innert */
		CERT_EXPIRE_IMAGE_INNER_INVALID : GINI_HTML5_BASE_PATH + '/res/img/inner/icon/certi_end.png',
		CERT_EXPIRE_IMAGE_INNER_EXPIRE_STATUS_IMMINENT : GINI_HTML5_BASE_PATH + '/res/img/inner/icon/certi_delay.png',
		CERT_EXPIRE_IMAGE_INNER_VALID : GINI_HTML5_BASE_PATH + '/res/img/inner/icon/inner_certificate.png',


		/* 인증서 속성 보기 */
		CERTIFICATE_NORMAL_ATTR : 'CERTIFICATE_NORMAL_ATTR',
		CERTIFICATE_DETAIL_ATTR : 'CERTIFICATE_DETAIL_ATTR',

		/* 인증서 발급자 */
		ISSUER_YESSIGN : 'YESSIGN',
		ISSUER_SIGNGATE : 'KICA',
		ISSUER_SIGNKOREA : 'SIGNKOREA',
		ISSUER_CROSSCERT : 'CROSSCERT',
		ISSUER_TRADESIGN : 'TRADESIGN',
		ISSUER_NCA : 'NCA',

		/* PKI CA 유형 */
		NPKI : 'NPKI',
		GPKI : 'GPKI',
		MPKI : 'MPKI',
		EPKI : 'EPKI',
		PPKI : 'PPKI',

		/* 외부 확장 저장매체 지원 방식 */
		EXTERNAL_SUPPORT_CROSSWEB_EX : 'CROSSWEB_EX',
		EXTERNAL_SUPPORT_DEAMON : 'DEAMON'
	};

	/**
	 * @desc : 웹폼에서 사용되는 상수 정보
	 */
	var WebForm = {
		//Color Pack 상수값 정의
		COLOR_PACK_BLUE : {
			CSS_PATH : GINI_HTML5_BASE_PATH + "/res/style/",
			CSS_FILE : "color_identity_blue.css",
			IMAGE_PATH : GINI_HTML5_BASE_PATH + "/res/img/color_identity_blue/",
		},
		COLOR_PACK_ORANGE : {
			CSS_PATH : GINI_HTML5_BASE_PATH + "/res/style/",
			CSS_FILE : "color_identity_blue.css",
			IMAGE_PATH : GINI_HTML5_BASE_PATH + "/res/img/color_identity_blue/"
		},
		COLOR_PACK_SKYBLUE : {
			CSS_PATH : GINI_HTML5_BASE_PATH + "/res/style/",
			CSS_FILE : "color_identity_blue.css",
			IMAGE_PATH : GINI_HTML5_BASE_PATH + "/res/img/color_identity_blue/",
		},

		// inner css  정의
		COLOR_PACK_INNER : {
			CSS_PATH : GINI_HTML5_BASE_PATH + "res/style/inner/",
			CSS_FILE : "inner_certificate.css",
			IMAGE_PATH : GINI_HTML5_BASE_PATH + "/res/img/inner/"
		},

		LOGO : GINI_HTML5_BASE_PATH + '/res/img/banner/test1.jpg',
		SUB_LOGO : GINI_HTML5_BASE_PATH + '/res/img/banner/test1.jpg',
		/* ACTION유형 */
		ACTION_LOGIN : 'LOGIN',				// 로그인
		ACTION_SIGN : 'SIGN',				// 전자서명
		ACTION_MANAGE : 'MANAGE',			// 인증서 관리
		ACTION_CERT_SAVE : 'SAVE',			// 저장
		ACTION_CERT_REMOVE : 'REMOVE',		// 삭제
		ACTION_CERT_ISSUE : 'ISSUE',		// 인증서 발급
		ACTION_CERT_REISSUE : 'REISSUE',	// 인증서 재발급
		ACTION_CERT_UPDATE : 'UPDATE',		// 인증서 갱신
		ACTION_CERT_REVOKE : 'REVOKE',		// 인증서 폐기
		ACTION_CERT_CMP : 'CMP',			// CMP전체

		ACTION_CHANGE_PWD : "CHANGE_PWD",	// 비밀번호 변경

		ACTION_CERT_COPY : 'COPY',
		ACTION_CERT_EXPORT_FILE : 'EXPORT_FILE',
		ACTION_CERT_IMPORT : 'IMPORT',
		ACTION_CERT_EXPORT : 'EXPORT',

		/** 인증서 HTML 구성 DIV 아이디 */
		CERT_TABLE : 'INI_certList',
		CERT_DETAIL_TABLE_LIST : 'INI_cert_detail_list',
		CERT_SINGLE_TABLE : 'INI_cert_single',
		CERT_SUBMIT : 'INI_certSubmit',

		/* 비밀번호 제약 사항 */
		LIMIT_MIN_LENGTH : 'MIN_LENGTH',
		LIMIT_MAX_LENGTH : 'MAX_LENGTH',
		LIMIT_DENY_SAME_CHAR3 : 'DENY_SAME_CHAR3',
		LIMIT_DENY_SERIAL_CHAR3 : 'DENY_SERIAL_CHAR3',
		LIMIT_DENY_SAME_CHAR_LENGTH : 'DENY_SAME_CHAR_LENGTH',
		LIMIT_DENY_SERIAL_CHAR_LENGTH : 'DENY_SERIAL_CHAR_LENGTH',
		LIMIT_MIN_CHAR_TYPE : 'MIN_CHAR_TYPE',

		FormId : {
			MainForm : {
				LoginForm : "LOGIN_FORM",
				SignForm : "SIGN_FORM",
				CertManageForm : "CERT_MANAGE_FORM",

				CertImportV11Form : "CERT_IMPORT_V11_MAIN_FORM",
				CertExportV11Form : "CERT_EXPORT_V11_MAIN_FORM",
				CertImportV12Form : "CERT_IMPORT_V12_MAIN_FORM",
				CertExportV12Form : "CERT_EXPORT_V12_MAIN_FORM",

				CertIssueForm : "CERT_ISSUE_FORM",
				CertReIssueForm : "CERT_REISSUE_FORM",
				CertUpdateForm : "CERT_UPDATE_FORM",
				CertRevokeForm : "CERT_REVOKE_FORM"
			},
			SubForm : {
				CertChangePasswordForm : "CERT_CHANGE_PASSWORD_FORM",
				CertCopyForm : "CERT_COPY_FORM",
				CertRemoveForm : "CERT_REMOVE_FORM",
				CertSearchEasyForm : "CERT_SEARCH_EASY_FORM",
				CertSearchManualForm : "CERT_SEARCH_MANUAL_FORM",
				CertSearchForm : "CERT_SEARCH_FORM",
				CertDetailForm : "CERT_DETAIL_FORM",
				CertDetailViewForm : "CERT_DETAIL_VIEW_FORM",
				CertSaveDetailForm : "CERT_SAVE_DETAIL_FORM",
				CertExportForm : "CERT_EXPORT_FORM",
				CertManageForm : "CERT_MANAGE_FORM",

				CertImportV11Form : "CERT_IMPORT_V11_SUB_FORM",
				CertExportV11Form : "CERT_EXPORT_V11_SUB_FORM",
				CertImportV12Form : "CERT_IMPORT_V12_SUB_FORM",
				CertExportV12Form : "CERT_EXPORT_V12_SUB_FORM",

				CertIssueForm 	: "CERT_ISSUE_SUB_FORM",
				CertAnotherIssueForm : "CERT_ANOTHER_ISSUE_FORM", // 정범교
				CertReIssueForm : "CERT_REISSUE_SUB_FORM",
				CertUpdateForm 	: "CERT_UPDATE_SUB_FORM",
				CertRevokeForm 	: "CERT_REVOKE_SUB_FORM"
			},
			InnerForm : {
				SignForm : "INNER_SIGN_FORM",
			}
		}
	};

	/**
	 * @desc : 로그인
	 */
	var Login = {
		PKCS1_SIGNATURE : 'PKCS1_SIGNATURE',
		SIGNATURE : 'SIGNATURE',	// PKCS1 or PKCS7 서명 결과
		VID_RANDOM : 'VID_RANDOM',
		VID_CERTIFICATE : 'VID_CERTIFICATE'
	};

	/**
	 * @desc : 전자서명
	 */
	var Signature = {
		/* 서명유형 */
		SIGN_PKCS1 : 'PKCS1',
		SIGN_PKCS7 : 'PKCS7',
		/* 원문 표시 유형 */
		SIGN_VIEW_NONE : 'NONE',
		SIGN_VIEW_GRID : 'GRID',
		SIGN_VIEW_TEXT : 'TEXT',
    		SIGN_VIEW_PAGE : 'PAGE',

		/* 구분자 */
		DELIMITER_EQUAL : '=',
		DELIMITER_AMP : '&',
		DELIMITER_ENTER : '\n'		
	};

	/**
	 * @desc : 암호화
	 */
	var Cipher = {
		/* 대칭키 알고리즘 */
		SYMM_SEED_CBC : 'SEED-CBC',
		SYMM_AES_ECB : 'AES-ECB',
		SYMM_AES_CBC : 'AES-CBC',
		SYMM_AES_CFB : 'AES-CFB',
		SYMM_AES_OFB : 'AES-OFB',
		SYMM_AES_CTR : 'AES-CTR',
		SYMM_AES_GCM : 'AES-GCM',
		SYMM_3DES_ECB : '3DES-ECB',
		SYMM_3DES_CBC : '3DES-CBC',
		SYMM_DES_ECB : 'DES-ECB',
		SYMM_DES_CBC : 'DES-CBC',

		/* 비대칭키 알고리즘 */
		ASYMM_RSA : 'RSA',

		/* 해시 알고리즘 */
		HASH_SHA1 : 'sha1',
		HASH_SHA256 : 'sha256',
		HASH_SHA384 : 'sha384',
		HASH_SHA512 : 'sha512',
		HASH_MD5 : 'md5',

		/* 서명 알고리즘 */
		SIGN_PSS : 'RSASSA-PSS',
		SIGN_RSA : 'rsaEncryption'
	};

	var CAInfo = {
		//금결원 리얼 CA 서버
		YessignCA : {
			IP : "203.233.91.71",
			PORT : "4512",
			NAME : "YESSIGN"
		},
		//전자인증 리얼 CA 서버
		CrossCertCA : {
			IP : "211.192.169.90",
			PORT : "4512",
			NAME : "CROSSCERT"
		},
		//코스콤 리얼 CA 서버
		SignKoreaCA : {
			IP : "210.207.195.100",
			PORT : "4099",
			NAME : "SIGNKOREA"
		},
		//정보인증 리얼 CA 서버
		SignGateCA : {
			IP : "211.35.96.43",
			PORT : "4502",
			NAME : "SIGNGATE"
		},
		InitechCA : {
			IP : "118.219.55.139",
			PORT : "28088",
			NAME : "INITECHCA"
		}
	};

	var BaroSign = {
		BaroSign_Server : window.location.protocol + "//" + window.location.host + "/barosign/servlet/BaroSignServer",
		BaroSign_install_guide :  window.location.protocol + "//" + window.location.host + GINI_HTML5_BASE_PATH +  '/cw/initech/barosign/install.html?es='
	};

	return {
		System : System,
		Browser : Browser,
		KeyStrokeSecurity : KeyStrokeSecurity,
		Certs : Certs,
		WebForm : WebForm,
		Login : Login,
		Signature : Signature,
		Cipher : Cipher,
		CAInfo : CAInfo,
		BaroSign : BaroSign
	};
});
