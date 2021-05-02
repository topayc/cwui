/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : UI화면 인터페이스 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * @desc : UI Interface
 */
define([
  '../adaptor/inipluginAdt',
	'../main/constants',
	'../conf/defaultConf',
	'../conf/msgFactory',
	'../core/coreFactory',
	'../keyStrokeSecurity/inikeyStrokeSecurityFactory',
	'../core/middleChannel',
	'../core/utils',
	'../main/webForm',
	'../core/trans/certRelay',
	'../core/barosign/barosignCore',
	'../main/system',
	'../core/iniException',
	'../common/cross_domain/crossStorage',
	'../core/externalResponseFactory',
  '../common/handleManager',
  '../front/messageDialog',
], function (inipluginAdt, constants, defaultConf, msgFactory, coreFactory, keyStrokeSecurityFactory, middleChannel, utils, webForm, certRelay, barosignCore, system, iniException, crossStorage, externalResponseFactory, handleManager,messageDialog) {
  require("../jquery/jquery-ui.min");
  require("../jquery/colResizable-1.6");
  require("../jquery/jquery.mousewheel");
  require("../jquery/jquery.tablesorter.min");
  require("../jquery/fixedThead");
  require("../jquery/jquery.mCustomScrollbar");
  
  //이 콜백 함수는 위에 명시된 모든 디펜던시들이 다 로드된 뒤에 호출된다initechApp
  //주의해야할 것은, 디펜던시 로드 완료 시점이 페이지가 완전히 로드되기 전 일 수도 있다는 사실이다.
  //이 콜백함수는 생략할 수 있다.
  try {
    // 모든 페이지가 완전히 로드된 뒤에 실행
    // Cross Domain 연결 여부를 확인 한다.
    window["GINI_External_Response_Factory"] = externalResponseFactory;
    crossStorage.checkConnection();
    GINI_LoadingIndicatorStop();
  } catch(e) {
    console.log(e);
  } finally {
    try {
      GINI_DYNAMIC_LOAD.changeCompleted();
    } catch(e){
      console.log(e);
    }
  }
  
	/*************************************************************************************
	 # 함수 명 : IniSafeNeo
	 # 설명 : 외부연동 관련 함수. 
	 # 이력 
	*************************************************************************************/
	var IniSafeNeo = (function () {

		/*************************************************************************************
		 # 함수 명 : openMainLoginForm
		 # 설명 : 로그인 창 오픈. 
		 # params  : 
		 	callback : close 뒤 실행되는 callback 함수
		 	planText : 원문
		 	option : 로그인 옵션(cw_web6_neo_adt.js 에서 설정한 로그인창 옵션)
		 	behavior : 행위 
		*************************************************************************************/
		var openMainLoginForm = function (callback, planText, options, behavior) {
			try {
				// HandleInfo 생성.
				var loginHandle = require("../common/handleManager").newHandleInfo();
				loginHandle.requestInfo.setParameter("ORG_DATA", planText);
				loginHandle.requestInfo.setCallback(callback);
				// 관리창을 사용하는 경우 Close 후 관리창을 뛰워 준다.
				loginHandle.requestInfo.setSubCallback(openMainCertManageForm);
				// 옵션 세팅
				for (opt in options) {
					loginHandle.optionInfo.setParameter(opt, options[opt]);
				}
				// Action에 따른 행위 세팅
				if (behavior) {
					loginHandle.serviceInfo.setBehavior(behavior);
				} else {
					loginHandle.serviceInfo.setBehavior(constants.WebForm.ACTION_LOGIN);
				}
				// Action정의 : 로그인
				loginHandle.serviceInfo.setAction(constants.WebForm.ACTION_LOGIN);
				// 로그인 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.LoginForm, loginHandle);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		var openCachedLogin = function (callback, planText, options, behavior) {
			try {
				// HandleInfo 생성.
				var loginHandle = require("../common/handleManager").newHandleInfo();
				loginHandle.requestInfo.setParameter("ORG_DATA", planText);
				loginHandle.requestInfo.setCallback(callback);

				// Action에 따른 행위 세팅
				if (behavior) {
					loginHandle.serviceInfo.setBehavior(behavior);
				} else {
					loginHandle.serviceInfo.setBehavior(constants.WebForm.ACTION_LOGIN);
				}
				// Action정의 : 로그인
				loginHandle.serviceInfo.setAction(constants.WebForm.ACTION_LOGIN);
				// 로그인 창 오픈

				function _callback() {
					callback(true, loginHandle.responseInfo.getParameter());
				};

				var selected = Certs.getSelectedCertInfo();
				loginHandle.serviceInfo.setDeviceId(selected["deviceId"]);
				loginHandle.serviceInfo.setEventDeviceId(selected["deviceId"]);
				loginHandle.serviceInfo.setDeviceSub(selected["deviceSub"]);
				loginHandle.serviceInfo.setParameter("DEVICE_ID", selected["certId"]);
				loginHandle.serviceInfo.setParameter("CERT_ID", selected["certId"]);
				loginHandle.serviceInfo.setParameter("ENCRYPTED", "FALSE");

				loginHandle.serviceInfo.setParameter("PWD", GINI_ProtectMgr.extract("NONCE"));
				loginHandle.serviceInfo.setParameter("NEW_PWD", GINI_ProtectMgr.extract("NEW_NONCE"));
				loginHandle.serviceInfo.setParameter("PWD_CNF", GINI_ProtectMgr.extract("NEW_NONCE_CNF"));
				loginHandle.serviceInfo.setParameter("PIN", GINI_ProtectMgr.extract("SECURE"));
				loginHandle.serviceInfo.setParameter("TARGET_PIN", GINI_ProtectMgr.extract("TARGET_SECURE"));

				loginHandle.serviceInfo.setCallback(_callback);

				Login.doLogin(loginHandle);

			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};


		/*************************************************************************************
		 # 함수 명 : openMainSignForm
		 # 설명 : 전자서명 창 오픈
		 # params  : 
		 	callback : close 뒤 실행되는 callback 함수
		 	planText : 원문
		 	option : 로그인 옵션(cw_web6_neo_adt.js 에서 설정한 로그인창 옵션)
		 	addition : ?? (사용X)
		*************************************************************************************/
		var openMainSignForm = function (callback, planText, options, addition) {
			try {
				// HandleInfo 생성
				var signHandle = require("../common/handleManager").newHandleInfo();
				signHandle.requestInfo.setParameter("ORG_DATA", planText);
				signHandle.requestInfo.setCallback(callback);
				// 관리창을 사용하는 경우 Close 후 관리창을 뛰워 준다.
				signHandle.requestInfo.setSubCallback(openMainCertManageForm);

				if (addition && addition.ADD_PKCS1) {
					signHandle.requestInfo.setParameter("ADD_PKCS1", addition.ADD_PKCS1);
				}

				for (opt in options) {
					signHandle.optionInfo.setParameter(opt, options[opt]);
				}

				// Action정의 : 전자서명
				signHandle.serviceInfo.setAction(constants.WebForm.ACTION_SIGN);
				signHandle.serviceInfo.setBehavior(constants.WebForm.ACTION_SIGN);
				// 전자서명 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.SignForm, signHandle);

			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openInnerSignForm
		 # 설명 : INNER 전자서명 창 오픈
		 # params  : 
		 	callback : close 뒤 실행되는 callback 함수
		 	planText : 원문
		 	option : 로그인 옵션(cw_web6_neo_adt.js 에서 설정한 로그인창 옵션)
		 	addition : ?? (사용X)
		*************************************************************************************/
		var openInnerSignForm = function (callback, planText, options, addition) {
			try {
				// HandleInfo 생성.
				var signHandle = require("../common/handleManager").newHandleInfo();
				signHandle.requestInfo.setParameter("ORG_DATA", planText);
				signHandle.requestInfo.setCallback(callback);

				if (addition && addition.ADD_PKCS1) {
					signHandle.requestInfo.setParameter("ADD_PKCS1", addition.ADD_PKCS1);
				}

				for (opt in options) {
					signHandle.optionInfo.setParameter(opt, options[opt]);
				}

				// Action정의 : 전자서명
				signHandle.serviceInfo.setAction(constants.WebForm.ACTION_SIGN);
				signHandle.serviceInfo.setBehavior(constants.WebForm.ACTION_SIGN);
				// 전자서명 창 오픈
				webForm.InnerForm(constants.WebForm.FormId.InnerForm.SignForm, signHandle);

			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : openMainCertManageForm
		 # 설명 : 인증서 관리 폼 로드
		 # params 
		 	taskNm : CERT_COPY(복사), CERT_REMOVE(삭제), CERT_SEARCH(찾기), CERT_PWD_CHANGE(암호변경), CERT_EXPORT(인증서 내보내기), CERT_DETAIL(인증서상세보기)
		 	         다이얼로그 오픈시 누를 메뉴에 따라 사각형의 박스가 그려짐.
		*************************************************************************************/
		var openMainCertManageForm = function (taskNm) {
			try {
				// HandleInfo 생성.
				var certManageHandle = require("../common/handleManager").newHandleInfo();
				certManageHandle.requestInfo.setParameter("taskNm", taskNm);
				// Action정의 : 인증서 관리 
				certManageHandle.serviceInfo.setAction(constants.WebForm.ACTION_MANAGE);
				// 창 오픈.
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertManageForm, certManageHandle);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : openCertImportV11Form
		 # 설명 : 인증서 가져오기 v1.1 
		*************************************************************************************/
		var openCertImportV11Form = function () {
			try {
				// HandleInfo 생성.
				var certImportExportHandle = require("../common/handleManager").newHandleInfo();

				// Action정의 : 인증서 가져오기
				certImportExportHandle.serviceInfo.setAction(constants.WebForm.ACTION_CERT_IMPORT);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertImportV11Form, certImportExportHandle);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : openCertExportV11Form
		 # 설명 : 인증서 내보내기 v1.1 
		*************************************************************************************/
		var openCertExportV11Form = function () {
			try {
				// HandleInfo 생성.
				var certImportExportHandle = require("../common/handleManager").newHandleInfo();

				// Action정의 : 내보내기
				certImportExportHandle.serviceInfo.setAction(constants.WebForm.ACTION_CERT_EXPORT);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertExportV11Form, certImportExportHandle);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : openCertImportV12Form
		 # 설명 : 인증서 가져오기 v1.2
		*************************************************************************************/
		var openCertImportV12Form = function () {
			try {
				// HandleInfo 생성.
				var certImportExportHandle = require("../common/handleManager").newHandleInfo();

				// Action정의 : 가져오기
				certImportExportHandle.serviceInfo.setAction(constants.WebForm.ACTION_CERT_IMPORT);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertImportV12Form, certImportExportHandle);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : openCertExportV12Form
		 # 설명 : 인증서 내보내기 v1.2
		*************************************************************************************/
		var openCertExportV12Form = function () {
			try {
				// HandleInfo 생성.
				var certImportExportHandle = require("../common/handleManager").newHandleInfo();

				// Action정의 : 내보내기
				certImportExportHandle.serviceInfo.setAction(constants.WebForm.ACTION_CERT_EXPORT);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertExportV12Form, certImportExportHandle);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : openMainCertIssueForm
		 # 설명 : 인증서 발급 창 오픈
		 # params
		 	issureInfo : 발급 옵션
						issureInfo.CA_NAME : ca 이름
						issureInfo.CA_IP : ca IP
						issureInfo.CA_PORT : ca PORT;
						issureInfo.REF_VALUE : 참가번호
						issureInfo.AUTH_CODE : 인가코드
		 	callback : 발급 뒤 실행될 callback 함수
		 	options : 발급 옵션
		*************************************************************************************/
		var openMainCertIssueForm = function (issureInfo, callback, options) {
			try {
        var caInfo = defaultConf.CAInfo.getCAInfo(issureInfo.CA_NAME);
			  issureInfo.CA_IP = caInfo.IP;
			  issureInfo.CA_PORT = caInfo.PORT;
			  
				// HandleInfo 생성.
				var handleInfo = require("../common/handleManager").newHandleInfo();
        
				// 옵션 세팅
				for (key in issureInfo) {
					handleInfo.requestInfo.setParameter(key, issureInfo[key]);
				}
				for (opt in options) {
					loginHandle.optionInfo.setParameter(opt, options[opt]);
				}
				handleInfo.requestInfo.setCallback(callback);

				// Action정의 : 인증서발급
				handleInfo.serviceInfo.setAction(constants.WebForm.ACTION_CERT_CMP);
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_ISSUE);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertIssueForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openMainCertReIssueForm
		 # 설명 : 인증서 재발급 창 오픈
		 # params
		 	reIssureInfo : 발급 옵션
						reIssureInfo.CA_NAME : ca 이름
						reIssureInfo.CA_IP : ca IP
						reIssureInfo.CA_PORT : ca PORT;
						reIssureInfo.REF_VALUE : 참가번호
						reIssureInfo.AUTH_CODE : 인가코드
		 	callback : 발급 뒤 실행될 callback 함수
		*************************************************************************************/
		var openMainCertReIssueForm = function (reIssureInfo, callback) {
			try {
				// HandleInfo 생성.
				var handleInfo = require("../common/handleManager").newHandleInfo();

				for (key in reIssureInfo) {
					handleInfo.requestInfo.setParameter(key, reIssureInfo[key]);
				}
				handleInfo.requestInfo.setCallback(callback);

				// Action정의 : 인증서 재발급
				handleInfo.serviceInfo.setAction(constants.WebForm.ACTION_CERT_CMP);
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_REISSUE);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertReIssueForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openMainCertUpdateForm
		 # 설명 : 인증서 갱신 창 오픈
		 # params
		 	reNewInfo : 발급 옵션
						reNewInfo.CA_NAME : ca 이름
						reNewInfo.CA_IP : ca IP
						reNewInfo.CA_PORT : ca PORT;
		 	callback : 발급 뒤 실행될 callback 함수
		*************************************************************************************/
		var openMainCertUpdateForm = function (reNewInfo, callback) {
			try {
        //var caInfo = defaultConf.CAInfo.getCAInfo(reNewInfo.CA_NAME);
        //issureInfo.CA_IP = caInfo.IP;
        //issureInfo.CA_PORT = caInfo.PORT; 
        
				// HandleInfo 생성.
				var handleInfo = require("../common/handleManager").newHandleInfo();

				for (key in reNewInfo) {
					handleInfo.requestInfo.setParameter(key, reNewInfo[key]);
				}
				handleInfo.requestInfo.setCallback(callback);

				// Action정의 : 인증서 갱신
				handleInfo.serviceInfo.setAction(constants.WebForm.ACTION_CERT_CMP);
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_UPDATE);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertUpdateForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openMainCertRevokeForm
		 # 설명 : 인증서 폐기 창 오픈
		 # params
		 	revokeInfo : 발급 옵션
		 				revokeInfo.CA_NAME : ca 이름
						revokeInfo.CERT_SERIAL : 폐기할 인증서 시리얼 번호
		 	callback : 발급 뒤 실행될 callback 함수
		*************************************************************************************/
		var openMainCertRevokeForm = function (revokeInfo, callback) {
			try {
				// HandleInfo 생성.
				var handleInfo = require("../common/handleManager").newHandleInfo();

				for (key in revokeInfo) {
					handleInfo.requestInfo.setParameter(key, revokeInfo[key]);
				}
				handleInfo.requestInfo.setCallback(callback);

				// Action정의 : 인증서 폐기
				handleInfo.serviceInfo.setAction(constants.WebForm.ACTION_CERT_CMP);
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CERT_REVOKE);
				// 창 오픈
				webForm.MainForm(constants.WebForm.FormId.MainForm.CertRevokeForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : PCInfo
		 # 설명 : PC 정보 수집
		*************************************************************************************/
		var PCInfo = (function () {
			// PC 정보 추출 여부 set,get
			var pcInfoCheck = false;
			var setPcInfoCheck = function (_pcInfoCheck) {
				pcInfoCheck = _pcInfoCheck;
			}
			var getPcInfoCheck = function () {
				return pcInfoCheck;
			}

			// SecureNonce set,get
			var secureNonce;
			var setPCInfoSecureNonce = function (_secureNonce) {
				secureNonce = _secureNonce;
				pcInfoCheck = false;
			}
			var getPCInfoSecureNonce = function () {
				return secureNonce;
			}

			// PCInfo 결과 set,get
			var pcInfoData;
			var setPCInfoData = function (_pcInfoData) {
				pcInfoData = _pcInfoData;
			}
			var getPCInfoData = function () {
				return pcInfoData;
			}

			function getPCInfoCallback(data) {
				if (data.PARAMS.CODE === "2004") {
					getPCInfo(getPCInfoCallback);
				} else {
					setPCInfoData(data);
				}
			};

			// PC정보 추출 요청
			var gatterPCInfo = function () {
				try {
					// 이미 추출 명령을 내렸으면 다시 추출하지 않는다.
					if (!getPcInfoCheck()) {
						var pcInfoHandle = require("../common/handleManager").newHandleInfo();
						pcInfoHandle.serviceInfo.setParameter("SITE_NAME", defaultConf.System.PCInfo["SITE_NAME"]);
						pcInfoHandle.serviceInfo.setParameter("PC_INFO_USE", defaultConf.System.PCInfo["PC_INFO_USE"]);
						pcInfoHandle.serviceInfo.setParameter("SERVER_IP", defaultConf.System.PCInfo["SERVER_IP"]);
						pcInfoHandle.serviceInfo.setParameter("SERVER_PORT", defaultConf.System.PCInfo["SERVER_PORT"]);
						pcInfoHandle.serviceInfo.setParameter("RETRY_CNT", defaultConf.System.PCInfo["RETRY_CNT"]);
						pcInfoHandle.serviceInfo.setParameter("REPLACE", defaultConf.System.PCInfo["REPLACE"]);
						pcInfoHandle.serviceInfo.setParameter("FDS_USE", defaultConf.System.PCInfo["FDS_USE"]);

						function callback() {
							setPcInfoCheck(true);
							getPCInfo(getPCInfoCallback);
						}
						pcInfoHandle.serviceInfo.setCallback(callback);
						middleChannel.Configure.gatterPCInfo(pcInfoHandle);
					}
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			}

			// PC정보 조회.
			var getPCInfo = function (callback) {
				try {
					if (pcInfoCheck === false) {
						gatterPCInfo();
					} else {
						var pcInfoHandle = require("../common/handleManager").newHandleInfo();
						pcInfoHandle.serviceInfo.setParameter("SECURE_NONCE", getPCInfoSecureNonce());
						pcInfoHandle.serviceInfo.setParameter("USER_AGENT", navigator.userAgent);
						pcInfoHandle.serviceInfo.setCallback(callback);
						middleChannel.Configure.getPCInfo(pcInfoHandle);
					}
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			}

			return {
				setPcInfoCheck: setPcInfoCheck,
				getPcInfoCheck: getPcInfoCheck,
				setPCInfoSecureNonce: setPCInfoSecureNonce,
				getPCInfoSecureNonce: getPCInfoSecureNonce,
				gatterPCInfo: gatterPCInfo,
				getPCInfoData: getPCInfoData,
				setPCInfoData: setPCInfoData
			};
		}());

		/**
		 * CrossWeb EX 속성 설정 : 주의> 확장매체에만 해당, 설치된 경우만 수행 
		 */
		var setProperties = function (propVal) {
			var handleInfo = require("../common/handleManager").newHandleInfo();
			handleInfo.optionInfo.setParameter("PROPERTIES", propVal);

			middleChannel.Configure.setProperties(handleInfo);
		};

		return {
			openMainLoginForm: openMainLoginForm,
			openMainSignForm: openMainSignForm,
			openInnerSignForm: openInnerSignForm,
			openMainCertManageForm: openMainCertManageForm,
			openCertImportV11Form: openCertImportV11Form,
			openCertExportV11Form: openCertExportV11Form,
			openCertImportV12Form: openCertImportV12Form,
			openCertExportV12Form: openCertExportV12Form,
			openMainCertIssueForm: openMainCertIssueForm,
			openMainCertReIssueForm: openMainCertReIssueForm,
			openMainCertUpdateForm: openMainCertUpdateForm,
			openMainCertRevokeForm: openMainCertRevokeForm,
			openCachedLogin: openCachedLogin,
			PCInfo: PCInfo,
			setProperties: setProperties
		};

	}());

	/*************************************************************************************
	 # 함수 명 : SubForm
	 # 설명 : NeoWeb 내부 화면 레이어
	*************************************************************************************/
	var SubForm = (function () {

		/*************************************************************************************
		 # 함수 명 : openForm
		 # 설명 : subForm 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		 	popupForm : popupForm id
		 	layerForm : layerForm id
		*************************************************************************************/
		var openForm = function (handleInfo, popupForm, layerForm) {
			//layer Form open(default) || popup Form open
			layerForm(handleInfo);
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertChangePasswordForm
		 # 설명 : 비밀번호 변경 창 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertChangePasswordForm = function (handleInfo) {
			try {
				//action 세팅
				handleInfo.serviceInfo.setBehavior(constants.WebForm.ACTION_CHANGE_PWD);
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertChangePasswordForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertCopyForm
		 # 설명 : 복사 서브폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertCopyForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertCopyForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openAnotherIssueForm
		 # 설명 : 복사 서브폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		 # 정범교
		*************************************************************************************/
		var openAnotherIssueForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertAnotherIssueForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertRemoveForm
		 # 설명 : 삭제 서브폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertRemoveForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertRemoveForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertSearchEasyForm
		 # 설명 : 간편찾기 서브 폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertSearchEasyForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertSearchEasyForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertSearchManualForm
		 # 설명 : 직접찾기 서브 폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertSearchManualForm = function (handleInfo) {
			try {
				// IE에서 9이하 지원 안됨.
				if ((system.Browser.getBrowserName() !== constants.Browser.EXPLORER) ||
					((system.Browser.getBrowserName() === constants.Browser.EXPLORER) && (system.Browser.getMajorVersion() > "9"))) {
					//창오픈
					webForm.SubForm(constants.WebForm.FormId.SubForm.CertSearchManualForm, handleInfo);
				} else {
					INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1024);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertSearchForm
		 # 설명 : 찾기 서브 폼 오픈(브라우저의 경우만 (간편/직접 2가지 선택 화면)
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertSearchForm = function (handleInfo) {
			try {
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertSearchForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertDetailForm
		 # 설명 : 상세보기 서브폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertDetailForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertDetailForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertSaveDetailForm
		 # 설명 : 인증서 저장하기 서브폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertSaveDetailForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertSaveDetailForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertExportForm
		 # 설명 : 인증서 파일 내보내기 서브폼 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertExportForm = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertExportForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertImportV11
		 # 설명 : 가져오기 1.1 subform 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertImportV11 = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertImportV11Form, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertExportV11
		 # 설명 : 내보내기 1.1 subform 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertExportV11 = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertExportV11Form, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertImportV12
		 # 설명 : 가져오기 1.2 subform 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertImportV12 = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertImportV12Form, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : openSubCertExportV12
		 # 설명 : 내보내기 1.2 subform 오픈
		 # params
		 	handleInfo : html5내에서 사용되는 data를 가진 구조체
		*************************************************************************************/
		var openSubCertExportV12 = function (handleInfo) {
			try {
				//창오픈
				webForm.SubForm(constants.WebForm.FormId.SubForm.CertExportV12Form, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		return {
			openForm: openForm,
			openSubCertChangePasswordForm: openSubCertChangePasswordForm,
			openSubCertCopyForm: openSubCertCopyForm,
			openAnotherIssueForm: openAnotherIssueForm, //정범교
			openSubCertRemoveForm: openSubCertRemoveForm,
			openSubCertSearchEasyForm: openSubCertSearchEasyForm,
			openSubCertSearchManualForm: openSubCertSearchManualForm,
			openSubCertSearchEasyForm: openSubCertSearchEasyForm,
			openSubCertSearchForm: openSubCertSearchForm,
			openSubCertDetailForm: openSubCertDetailForm,
			openSubCertSaveDetailForm: openSubCertSaveDetailForm,
			openSubCertExportForm: openSubCertExportForm,
			openSubCertImportV11: openSubCertImportV11,
			openSubCertExportV11: openSubCertExportV11,
			openSubCertImportV12: openSubCertImportV12,
			openSubCertExportV12: openSubCertExportV12
		}
	}());

	/*************************************************************************************
	 # 함수 명 : WebForm
	 # 설명 : 웹 화면 그리는 함수 모음
	*************************************************************************************/
	var WebForm = (function () {

		/*************************************************************************************
		 # 함수 명 : drawSignForm
		 # 설명 : 전자서명 폼 그리기
		 # params 
		 	orgText: 서명 데이터 원문
		*************************************************************************************/
		var drawSignForm = function (orgText) {
			try {
				// 폼그리기
				webForm.DrawForm.drawSignForm(orgText);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : dialogdrawStorageList 
		 # 설명 : 스토리지 목록 그리기
		 # params 
		 	view_id : 그려질 div id
		 	action : 현재 action(action & behavior에 On/Off 여부가 판단됨)
		 	isFilterCache: 필터링 값이 있는 경우 스토리지 리스트를 보여주지 않는다.
		*************************************************************************************/
		var dialogdrawStorageList = function (view_id, action, isFilterCache) {
			return webForm.DrawForm.drawStorageList(defaultConf.WebForm.getStorageButton(), view_id, action, isFilterCache);
			// 스토리지 목록 숨기기 체크
			/*
			if( defaultConf.Signature.StorageHide && action === constants.WebForm.ACTION_SIGN ){
				$("#INI_storage_select_title").remove();				
				$("#INI_certificate_section_title").html( msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_021 );
			}else{
				try{
					// 스토리지 목록 그리기
					return webForm.DrawForm.drawStorageList(defaultConf.WebForm.getStorageButton(), view_id, action, isFilterCache);
				}catch(e){
					INI_HANDLE.handleMessage(e);
				}
			}
			*/
		}

		/*************************************************************************************
		 # 함수 명 : drawStorageExtList
		 # 설명 : 스토리지 확장매체 목록 그리기
		 # params 
		 	view_id : 그려질 div id
		 	action : 현재 action(action & behavior에 On/Off 여부가 판단됨)
		*************************************************************************************/
		var drawStorageExtList = function (view_id, action) {
			try {
				// 스토리지 확장매체 목록 그리기
				return webForm.DrawForm.drawStorageExtList(defaultConf.WebForm.getStorageExtButton(), view_id, action);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : drawTargetStorageList
		 # 설명 : 스토리지 복사 목록 그리기
		 # params 
		 	view_id : 그려질 div id
		 	action : 현재 action(action & behavior에 On/Off 여부가 판단됨)
		*************************************************************************************/
		var drawTargetStorageList = function (view_id, action, isFilterCache) {
			try {
				// 복사 스토리지 그리기
				return webForm.DrawForm.drawTargetStorageList(defaultConf.WebForm.getTargetStorageButton(), view_id, action, isFilterCache);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}


		// 스토리지 추가저장 확장매체 목록 그리기 작업자 : 정범교 작업일 : 20170403
		var drawAnotherStorageExtList = function (view_id, action) {
			try {
				return webForm.DrawForm.drawStorageExtList(defaultConf.WebForm.getAnotherStorageExtButton(), view_id, action);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}


		// 스토리지 추가저장 목록 그리기 작업자 : 정범교 작업일 : 20170403
		var drawAnotherTargetStorageList = function (view_id, action, isFilterCache, disableDevice) {
			try {
				return webForm.DrawForm.drawTargetStorageList(defaultConf.WebForm.getAnotherTargetStorageButton(), view_id, action, isFilterCache, disableDevice);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : drawLogo
		 # 설명 : 로고 그리기
		 # params 
		 	logoUrl : 로고 이미지 주소
		*************************************************************************************/
		var drawLogo = function (logoUrl) {
			try {
				return webForm.DrawForm.drawLogo(logoUrl === "MAIN" ? defaultConf.WebForm.Logo : defaultConf.WebForm.SubLogo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : drawCertList
		 # 설명 : 인증서 리스트 그리기
		 # params 
		 	certAtts : 인증서 속성정보 리스트
		 	deviceId : 스토리지 아이디
		*************************************************************************************/
		var drawCertList = function (certAtts, deviceId) {
			try {
				return webForm.DrawForm.drawCertList(certAtts, deviceId);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : drawCertDetail
		 # 설명 : 인증서 상세정보 그리기(리스트목록)
		 # params 
		 	certAttr : 인증서 속성정보
		*************************************************************************************/
		var drawCertDetail = function (certAttr) {
			try {
				// 인증서 상세정보 그리기
				return webForm.DrawForm.drawCertDetail(certAttr);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : drawCertAttrDetail
		 # 설명 : 인증서 상세정보 그리기(속성정보)
		 # params 
		 	certAttr : 인증서 속성정보 
		*************************************************************************************/
		var drawCertAttrDetail = function (certAttr) {
			try {
				return webForm.DrawForm.drawCertAttrDetail(certAttr);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : drawStorageSubList
		 # 설명 : 저장매체 서브리스트 그리기
		*************************************************************************************/
		var drawStorageSubList = function (handleInfo) {
			try {
				// 저장매체 서브 타입 가져오기
				// drawType이 INI_POPUP이면 복사 창 보여줌.
				var drawType = handleInfo.serviceInfo.getParameter("DrawType");
				if (drawType != undefined && drawType == "INI_POPUP") {
					handleInfo.serviceInfo.setCallback(webForm.DrawForm.drawStorageTargetSubList);
				} else {
					handleInfo.serviceInfo.setCallback(webForm.DrawForm.drawStorageSubList);
				}
				// 디바이스 서브 목록 가져오기 및 그리기
				middleChannel.Configure.getDeviceList(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : closeModal
		 # 설명 : 모달창 닫기
		*************************************************************************************/
		var closeModal = function () {
			return webForm.CommonForm().closeModal();
		};

		/*************************************************************************************
		 # 함수 명 : openStorageList
		 # 설명 : 저장매체 선택
		*************************************************************************************/
		var openStorageList = function (handleInfo) {
			try {
				function callback() {
					webForm.DrawForm.openStorageList(handleInfo);
					return false;
				};
				// crosswebex 인스톨 체크
				Version.installed(callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		// 저장매체 선택(추가저장) 작업자 : 정범교 작업일 : 20170403
		var openAnotherStorageList = function (handleInfo) {
			try {
				function callback() {
					webForm.DrawForm.openAnotherStorageList(handleInfo);
					return false;
				};
				Version.installed(callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};
		//---------------------------------------------------------

		/*************************************************************************************
		 # 함수 명 : getColorPackCss
		 # (사용암함) 설명 : 컬러팩 가져오기 
		*************************************************************************************/
		var getColorPackCss = function () {
			try {
				//컬러팩은 처음부터 하나의 CSS로 변경뒤 나가도록 함.
				if (!INI_getPlatformInfo().Mobile) {
					//          webForm.CommonForm().getColorPackCss();
				} else {
					//          webForm.CommonForm().getMobileColorPackCss();
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : getInnerColorCss
		 # (사용암함) 설명 : Inner 컬러팩 가져오기 
		*************************************************************************************/
		var getInnerColorCss = function () {
			try {
				//        webForm.CommonForm().getInnerColorPackCss();
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : getColorPackImagePath
		 # (사용암함) 설명 : 컬러팩 이미지 주소 가져오기 
		*************************************************************************************/
		var getColorPackImagePath = function () {
			try {
				return webForm.CommonForm().getColorPackImagePath();
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : drawCustomBanner
		 # 설명 : 고객가 배너 설정.
		 # params 
		  view_id : 배너가 그려질 div id
		*************************************************************************************/
		var drawCustomBanner = function (view_id) {
			if (!INI_CUSTOM_BANNER_HANDLE.getCustomBannerUrl() || INI_CUSTOM_BANNER_HANDLE.getBannerUseYN() == false) {
				return false;
			} else {
				//banner 그림
				return webForm.DrawForm.drawCustomBanner(view_id, INI_CUSTOM_BANNER_HANDLE.getCustomBannerUrl());
			}
		};

		return {
			drawSignForm: drawSignForm,
			dialogdrawStorageList: dialogdrawStorageList,
			drawTargetStorageList: drawTargetStorageList,
			drawAnotherTargetStorageList: drawAnotherTargetStorageList,//정범교
			drawStorageExtList: drawStorageExtList,
			drawAnotherStorageExtList: drawAnotherStorageExtList,//정범교
			drawLogo: drawLogo,
			drawCertList: drawCertList,
			drawCertDetail: drawCertDetail,
			drawCertAttrDetail: drawCertAttrDetail,
			drawStorageSubList: drawStorageSubList,
			closeModal: closeModal,
			openStorageList: openStorageList,
			openAnotherStorageList: openAnotherStorageList, //정범교
			getColorPackCss: getColorPackCss,
			getInnerColorCss: getInnerColorCss,
			getColorPackImagePath: getColorPackImagePath,
			drawCustomBanner: drawCustomBanner
		}
	}());

	/*************************************************************************************
	 # 함수 명 : InnerWebForm
	 # (구현X)설명 : Inner폼
	*************************************************************************************/
	var InnerWebForm = (function () {

		var dialogdrawStorageList = function (view_id, action, isFilterCache) {
			try {
				return webForm.InnerDrawForm.drawStorageList(defaultConf.WebForm.getStorageButton(), view_id, action, isFilterCache);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		// 인증서 리스트 그리기
		var drawCertList = function (certList, deviceId) {
			try {
				return webForm.InnerDrawForm.drawCertList(certList, deviceId);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		// inner sub form 
		var openForm = function (handleInfo, popupForm, layerForm) {
			popupForm(handleInfo);
		};

		var openSubCertDetailForm = function (handleInfo) {
			try {
				webForm.SubInnerForm(constants.WebForm.FormId.SubForm.CertDetailForm, handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};


		// 인증서 상세정보 그리기
		var drawCertDetail = function (certAttr) {
			try {
				return webForm.InnerDrawForm.drawCertDetail(certAttr);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		return {
			dialogdrawStorageList: dialogdrawStorageList,
			drawCertList: drawCertList,
			openForm: openForm,
			openSubCertDetailForm: openSubCertDetailForm,
			drawCertDetail: drawCertDetail
		}
	}());

	/*************************************************************************************
	 # 함수 명 : MobileForm
	 # 설명 : 모바일 화면폼 모음
	*************************************************************************************/
	var MobileForm = (function () {

		/*************************************************************************************
		 # 함수 명 : MobileSubForm
		 # 설명 : 모바일 서브폼 그리기
		*************************************************************************************/
		var MobileSubForm = function (formName, handleInfo, dialogId) {
			try {
				webForm.MobileSubForm(formName, handleInfo, dialogId);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : MobileDrawForm
		 # 설명 : 모바일 동적 폼 그리기
		*************************************************************************************/
		var MobileDrawForm = webForm.MobileDrawForm;

		return {
			MobileSubForm: MobileSubForm,
			MobileDrawForm: MobileDrawForm
		}
	}());


	/*************************************************************************************
	 # 함수 명 : Certs
	 # 설명 : 인증서 정보 함수 모음
	*************************************************************************************/
	var Certs = (function () {

		/*************************************************************************************
		 # 함수 명 : clearPassword
		 # 설명 : 패스워드 클리어
		*************************************************************************************/
		function clearPassword(frmname) {
			try {
				var _frmname = "keypadFrm";
				if (frmname) {
					_frmname = frmname;
				}
				var frm = document.getElementsByName(_frmname)[0];
				if (frm) {
					var elelength = frm.elements.length;
					for (var j = 0; j < elelength; j++) {
						if (frm.elements[j].tagName == "INPUT" && (frm.elements[j].type == "password")) {
							frm.elements[j].value = "";
						}
					}
				}
			} catch (e) {
			} finally {
				GINI_ProtectMgr.destroy();
			}

		}

		/*************************************************************************************
		 # 함수 명 : getCertAttributeList
		 # 설명 : 인증서 속성 목록을 제공
		*************************************************************************************/
		var getCertAttributeList = function (handleInfo) {
			try {
				clearPassword();
				middleChannel.Certs.getCertAttributeList(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : getCertAttributeInfo
		 # 설명 : 인증서 속성정보 가져오기
		 # params 
		   	handleInfo : html5 data 구조체
		   	isCMP : cmp여부
		*************************************************************************************/
		var getCertAttributeInfo = function (handleInfo, isCMP) {
			try {
				clearPassword();
				middleChannel.Certs.getCertificateInfo(handleInfo, isCMP);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : getSelectedCertInfo
		 # 설명 : 로그인 한(캐시된) 인증서 정보 가져오기
		*************************************************************************************/
		var getSelectedCertInfo = function () {
			try {
				//clearPassword();
				return middleChannel.Certs.getSelectedCertInfo();
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : setSelectedCertInfo
		 # 설명 : 로그인 인증서 정보 캐쉬하기(BaroSign)
		 # params 
		   	handleInfo : html5 data 구조체
		   	clientPushId : 로그인한 단말의 pushId
		*************************************************************************************/
		var setSelectedCertInfo = function (handleInfo, clientPushId) {
			try {
				return middleChannel.Certs.setSelectedCertInfo(
					handleInfo.serviceInfo.getDeviceId(),
					handleInfo.serviceInfo.getDeviceSub(),
					handleInfo.serviceInfo.getParameter("CERT_ID"),
					clientPushId
				);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : getSelectedReNewCertInfo
		 # 설명 : 로그인 한(캐시된) 인증서 정보 가져오기(CMP)
		*************************************************************************************/
		var getSelectedReNewCertInfo = function () {
			try {
				clearPassword();
				return middleChannel.Certs.getSelectedReNewCertInfo();
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};
		
		/*************************************************************************************
		 # 함수 명 : initCertInfo
		 # 설명 : 로그인 한(캐시된) 인증서 정보 초기화
		*************************************************************************************/
		var initCertInfo = function(callback) {
			try {				
				return middleChannel.Certs.initCertInfo(callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
				
		};
		
		/*************************************************************************************
		 # 함수 명 : setIssuerDNFilterInfo
		 # 설명 : issuerDN 필터링 정보 설정
		*************************************************************************************/
		var setIssuerDNFilterInfo = function(issuerDN, callback) {
			try {				
				return middleChannel.Certs.setIssuerDNFilterInfo(issuerDN,callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
				
		};
		
		/*************************************************************************************
		 # 함수 명 : setOIDAliasFilterInfo
		 # 설명 : OID(Alias) 필터링 정보 설정
		*************************************************************************************/
		var setOIDAliasFilterInfo = function(OIDAlias, callback) {
			try {				
				return middleChannel.Certs.setOIDAliasFilterInfo(OIDAlias,callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
				
		};

		return {
			getCertAttributeList: getCertAttributeList,
			getCertAttributeInfo: getCertAttributeInfo,
			getSelectedCertInfo: getSelectedCertInfo,
			setSelectedCertInfo: setSelectedCertInfo,
			getSelectedReNewCertInfo: getSelectedReNewCertInfo,
			initCertInfo: initCertInfo,
			setIssuerDNFilterInfo: setIssuerDNFilterInfo,
			setOIDAliasFilterInfo: setOIDAliasFilterInfo
		};
	}());

	/*************************************************************************************
	 # 함수 명 : getServerTime
	 # 설명 : 서버 타임 가져오기
	*************************************************************************************/
	function getServerTime(url) {
		var tryCnt = 0;
		function requestServerTime() {
			var syncTime = utils.Transfer.xmlHttpRequest(url, '');

			utils.Log.debug('[' + tryCnt + ']Server Time : ' + syncTime);

			if (tryCnt < 5) {
				if (!syncTime || syncTime.trim().length < 5) {
					tryCnt++;
					return requestServerTime();
				} else {
					return syncTime;
				}
			} else {
				utils.Log.debug('[' + tryCnt + ']Server Time Fail : ' + syncTime);
				return new Date().getTime() / 1000;
			}
		}

		return requestServerTime();
	};

	/*************************************************************************************
	 # 함수 명 : Login
	 # 설명 : 로그인 관련 함수 모음
	*************************************************************************************/
	var Login = (function () {

		/*************************************************************************************
		 # 함수 명 : doLogin
		 # 설명 : 로그인
		*************************************************************************************/
		var doLogin = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart('Progressing');
				// 서명 타입 세팅. (p1, p7)
				var signKind = constants.Signature.SIGN_PKCS1;
				if (constants.Signature.SIGN_PKCS7 === defaultConf.Login.LoginType) {
					signKind = constants.Signature.SIGN_PKCS7;
				}

				if (!handleInfo.optionInfo.getParameter("SIGN_KIND")) {
					handleInfo.optionInfo.setParameter("SIGN_KIND", signKind);
				}

				handleInfo.optionInfo.setParameter("SHOW_PLAIN_TEXT", "FALSE");

				// 로그인 유형이 PKCS#7 일 경우 : 서버 시간을 가져온다.
				if (handleInfo.optionInfo.getParameter("SIGN_KIND") == constants.Signature.SIGN_PKCS7) {
					if (!handleInfo.optionInfo.getParameter("SERVER_TIME")) {
						var url = defaultConf.System.UrlAddress[constants.System.URL_SYNCHRONISE_TIME];
						if (url) {
							//var syncTime = utils.Transfer.xmlHttpRequest(url, '');
							var syncTime = getServerTime(url);

							//utils.Log.debug('Server Time : ' + syncTime);

							//var signDt = utils.Convert.stringToDate(syncTime);
							if (handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER) {
								// 금결원 포맷일 경우 
								if (handleInfo.optionInfo.getParameter("YESSIGN_TYPE") && handleInfo.optionInfo.getParameter("YESSIGN_TYPE") === "TRUE") {
									handleInfo.optionInfo.setParameter("SERVER_TIME", syncTime);
								} else {
									var signDt = new Date(parseInt(syncTime + '000'));
									handleInfo.optionInfo.setParameter("SERVER_TIME", signDt);
								}
							} else {
								handleInfo.optionInfo.setParameter("SERVER_TIME", syncTime);
							}
						} else {
							handleInfo.optionInfo.setParameter("SERVER_TIME", utils.String.dateTimeToString(new Date()));
						}
					}
				}

				// 업무에서 넘겨주는 원문이 없는경우 시간을 원문으로 넣는다.
				if (utils.String.isNull(handleInfo.requestInfo.getParameter("ORG_DATA"))) {
					// 01. Server인증
					var url = defaultConf.System.UrlAddress[constants.System.URL_SYNCHRONISE];
					utils.Log.debug('synchronise url : ' + url);

					if (url) {
						//var syncTime = utils.Transfer.xmlHttpRequest(url, '');
						var syncTime = getServerTime(url);

						if (handleInfo.serviceInfo.getDeviceId() !== constants.Certs.STORAGE_BROWSER) {
							handleInfo.serviceInfo.setParameter("PC_INFO", IniSafeNeo.PCInfo.getPCInfoData());
						}
						handleInfo.requestInfo.setParameter("ORG_DATA", syncTime);

					} else {
						handleInfo.requestInfo.setParameter("ORG_DATA", utils.String.dateTimeToString(new Date()));
					}
					// 전자서명
					middleChannel.Signature.selectedSignature(handleInfo);
				} else {
					utils.Log.debug('synchronise message : ' + handleInfo.requestInfo.getParameter("ORG_DATA"));
					if (handleInfo.serviceInfo.getDeviceId() !== constants.Certs.STORAGE_BROWSER) {
						handleInfo.serviceInfo.setParameter("PC_INFO", IniSafeNeo.PCInfo.getPCInfoData());
					}
					// 전자서명
					middleChannel.Signature.selectedSignature(handleInfo);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		return {
			doLogin: doLogin
		};
	}());

	/*************************************************************************************
	 # 함수 명 : Signature
	 # 설명 : 전자서명 관련 함수 모음.
	*************************************************************************************/
	var Signature = (function () {

		/*************************************************************************************
		 # 함수 명 : doSign
		 # 설명 : PKCS#7서명
		*************************************************************************************/
		var doSign = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart('Progressing');
				handleInfo.optionInfo.setParameter("SIGN_KIND", constants.Signature.SIGN_PKCS7)

				handleInfo.optionInfo.setParameter("SHOW_PLAIN_TEXT", "TRUE");
				// 서버시간이 없는 경우 서버에서 시간을 가져와 세팅
				if (!handleInfo.optionInfo.getParameter("SERVER_TIME")) {
					var url = defaultConf.System.UrlAddress[constants.System.URL_SYNCHRONISE_TIME];
					if (url) {
						//var syncTime = utils.Transfer.xmlHttpRequest(url, '');
						var syncTime = getServerTime(url);

						if (handleInfo.serviceInfo.getDeviceId() !== constants.Certs.STORAGE_BROWSER) {
							handleInfo.serviceInfo.setParameter("PC_INFO", IniSafeNeo.PCInfo.getPCInfoData());
						}
						//utils.Log.debug('Server Time : ' + syncTime);
						//var signDt = utils.Convert.stringToDate(syncTime);
						if (handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_BROWSER) {
							if (handleInfo.optionInfo.getParameter("YESSIGN_TYPE") && handleInfo.optionInfo.getParameter("YESSIGN_TYPE") === "TRUE") {
								handleInfo.optionInfo.setParameter("SERVER_TIME", syncTime);
							} else {
								var signDt = new Date(parseInt(syncTime + '000'));
								handleInfo.optionInfo.setParameter("SERVER_TIME", signDt);
							}
						} else {
							handleInfo.optionInfo.setParameter("SERVER_TIME", syncTime);
						}
					} else {
						handleInfo.optionInfo.setParameter("SERVER_TIME", utils.String.dateTimeToString(new Date()));
					}
					// 전자서명
					middleChannel.Signature.selectedSignature(handleInfo);
				} else {
					if (handleInfo.serviceInfo.getDeviceId() !== constants.Certs.STORAGE_BROWSER) {
						handleInfo.serviceInfo.setParameter("PC_INFO", IniSafeNeo.PCInfo.getPCInfoData());
					}
					// 전자서명
					middleChannel.Signature.selectedSignature(handleInfo);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		return {
			doSign: doSign
		};

	}());

	/*************************************************************************************
	 # 함수 명 : CertManager
	 # 설명 : 인증서 관리 함수 모음
	*************************************************************************************/
	var CertManager = (function () {

		/*************************************************************************************
		 # 함수 명 : importCertPriV11
		 # 설명 : 인증서 간편찾기 v1.1
		*************************************************************************************/
		var importCertPriV11 = function (handleInfo) {
			try {
				var authNumConfirm = certRelay.importCertPriV11(
					handleInfo.serviceInfo.getParameter("IMPORT_CERT_DATA"),
					handleInfo.serviceInfo.getParameter("AUTH_NUM")
				);
				handleInfo.serviceInfo.getCallback()(authNumConfirm, handleInfo.serviceInfo.getParameter("AUTH_NUM"));
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : getImportAuthNum
		 # 설명 : 인증서 간편찾기 인증번호 가져오기
		*************************************************************************************/
		var getImportAuthNum = function (callback) {
			try {
				certRelay.getImportAuthNum(callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};
		
		/*************************************************************************************
		 # 함수 명 : savePrivateCertificate
		 # 설명 : 발급된 인증서를 저장
		*************************************************************************************/
		function savePrivateCertificate(handleInfo, afterRemove){
			GINI_LoadingIndicatorStart('Progressing');
			
			function removeCallback() {
				var removeHandleInfo = require("../common/handleManager").newHandleInfo();
				// 순서주의 step01
				removeHandleInfo.serviceInfo.setDeviceSub(certInfo.deviceSub);
				// 순서주의 step02
				removeHandleInfo.serviceInfo.setDeviceId(certInfo.deviceId);
				removeHandleInfo.serviceInfo.setParameter("CERT_ID", certInfo.certId);
				removeHandleInfo.serviceInfo.setParameter("PWD", certInfo.pwd);
				removeHandleInfo.serviceInfo.setParameter("PIN", certInfo.pin);
				removeCertificate(removeHandleInfo);
			}
			if (afterRemove) {
				if (constants.Certs.STORAGE_BROWSER === handleInfo.serviceInfo.getDeviceId()) {
					middleChannel.Manager.savePrivateCertificate(handleInfo, removeCallback);
				} else {
					middleChannel.Manager.savePrivateCertificate(handleInfo, handleInfo.serviceInfo.getCallback());
				}
			} else {
				middleChannel.Manager.savePrivateCertificate(handleInfo);
			}
		}
		
		/*************************************************************************************
		 # 함수 명 : saveCertPriV11
		 # 설명 : 인증서 간편찾기 인증서 저장.
		*************************************************************************************/
		var saveCertPriV11 = function (handleInfo) {
			try {
				middleChannel.Manager.saveCertPriV11(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : saveAnotherCertificate
		 # 설명 : 인증서 추가 저장
		 # 정범교
		*************************************************************************************/
		var saveAnotherCertificate = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart('Progressing', 100);
				middleChannel.Manager.saveAnotherCertificate(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}

		};

		/*************************************************************************************
		 # 함수 명 : changePassword
		 # 설명 : 인증서 비밀번호 변경
		*************************************************************************************/
		var changePassword = function (handleInfo) {
			try {
				middleChannel.Manager.changePassword(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}

		};

		/*************************************************************************************
		 # 함수 명 : copyCertificate
		 # 설명 : 인증서 복사
		*************************************************************************************/
		var copyCertificate = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart('Progressing', 400);
				middleChannel.Manager.copyCertificate(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : certImportExport
		 # 설명 : 인증서 인증서 가져오기/내보내기
		*************************************************************************************/
		var certImportExport = (function () {

			/*************************************************************************************
			 # 함수 명 : makeExportData
			 # 설명 : 내보낼 데이터 생성 (p12)
			*************************************************************************************/
			var makeExportData = function (_handleInfo) {
				try {
					middleChannel.Manager.makeExportData(_handleInfo);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			/*************************************************************************************
			 # 함수 명 : importCertV11
			 # 설명 : 인증서 가져오기 v1.1
			*************************************************************************************/
			var importCertV11 = function (handleInfo, callback) {
				try {
					certRelay.importCertV11(handleInfo, callback);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			/*************************************************************************************
			 # 함수 명 : exportCertV11
			 # 설명 : 인증서 내보내기 v1.1
			*************************************************************************************/
			var exportCertV11 = function (handleInfo, callback) {
				try {
					certRelay.exportCertV11(handleInfo, callback);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			/*************************************************************************************
			 # 함수 명 : importCertV12
			 # 설명 : 인증서 가져오기 v1.2
			*************************************************************************************/
			var importCertV12 = function (handleInfo, callback) {
				try {
					INI_priCertP12 = null;
					certRelay.importCertV12(handleInfo, callback);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			/*************************************************************************************
			 # 함수 명 : exportCertV12
			 # 설명 : 인증서 내보내기 v1.2
			*************************************************************************************/
			var exportCertV12 = function (handleInfo, callback) {
				try {
					certRelay.exportCertV12(handleInfo, callback);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			/*************************************************************************************
			 # 함수 명 : setCertStatus
			 # 설명 : 인증서 상태 저장(인증서 가져오기가 완료되면 상태값을 complete으로 변경)
			*************************************************************************************/
			var setCertStatus = function (_handleInfo) {
				try {
					certRelay.setCertStatus(_handleInfo);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			/*************************************************************************************
			 # 함수 명 : getCertStatus
			 # 설명 : 인증서 상태 조회 v1.2(인증서를 가지고 갔는지 체크함. poling 방식으로 체크.)
			*************************************************************************************/
			var getCertStatus = function (authNum, callBack, reset) {
				try {
					certRelay.getCertStatus(authNum, callBack, reset);
				} catch (e) {
					INI_HANDLE.handleMessage(e);
				}
			};

			return {
				makeExportData: makeExportData,
				importCertV11: importCertV11,
				exportCertV11: exportCertV11,
				importCertV12: importCertV12,
				exportCertV12: exportCertV12,
				setCertStatus: setCertStatus,
				getCertStatus: getCertStatus
			};
		}());

		/*************************************************************************************
		 # 함수 명 : removeCertificate
		 # 설명 : 인증서 삭제
		*************************************************************************************/
		var removeCertificate = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart('Progressing', 100);
				middleChannel.Manager.removeCertificate(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : exportCertPriP12
		 # (사용X)설명 : 인증서 파일 내보내기(Browser) (추후 broswer 지원에 IE10이상으로 변경되었기 때문에 이것을 사용해도 무방함)
		*************************************************************************************/
		var exportCertPriP12 = function (handleInfo) {
			try {
				function callback() {
					middleChannel.Manager.exportCertPriP12(handleInfo);
				};
				//설치체크.
				Version.installed(callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : exportCertPriP12File
		 # 설명 : 인증서 파일 내보내기(무조건 Crosswebex를 통해 내보내므로 설치가 되어야 가능하다)
		*************************************************************************************/
		var exportCertPriP12File = function (handleInfo) {
			try {
				function callback() {
					middleChannel.Manager.exportCertPriP12File(handleInfo);
				};

				//설치체크.
				Version.installed(callback);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};


		/*************************************************************************************
		 # 설명 : 직접 가져오기 함수 관련.
		*************************************************************************************/
		var INI_privteKey;			// 개인키 파일 (인증서 폴더 내 .key파일)
		var INI_certificate;		// 인증서파일 (인증서 폴더 내 .der파일)
		var INI_priCertP12;			// p12 파일 (.p12 파일)
		var INI_save_callback;		// 콜백 
		
		/* 임시 핸들인포 변수 주가 - 안영철*/ 
		var INI_handleInfo;		 // 임시 handleInfo 

		function errorHandler(evt) {
			switch (evt.target.error.code) {
				case evt.target.error.NOT_FOUND_ERR:
					INI_HANDLE.warnMessage('File Not Found!');
					break;
				case evt.target.error.NOT_READABLE_ERR:
					INI_HANDLE.warnMessage('File is not readable');
					break;
				case evt.target.error.ABORT_ERR:
					break; // noop
				default:
					INI_HANDLE.warnMessage('An error occurred reading this file.');
			};
		};

		/*************************************************************************************
		 # 함수 명 : savePriCert
		 # 설명 : 파일 찾기를 통한 인증서 저장.
		*************************************************************************************/
		function savePriCert(fileList) {
			try {
				var fileNameList = new Array();
				for (var i = 0, file; file = fileList[i]; i++) {
					var fileName = file.name.substr(file.name.lastIndexOf(".") + 1, file.name.length).toLowerCase();
					if (fileName.match(/der.*/)) {
						// 확장자가 .der인 인증서 파일
						var readerCert = new FileReader();
						readerCert.onerror = errorHandler;

						readerCert.onload = function (e) {
							INI_certificate = readerCert.result;
						}
						//readerCert.readAsBinaryString(file);
						readerCert.readAsArrayBuffer(file);
					} else if (fileName.match(/key.*/)) {
						// 확장자가 .key 개인키 파일
						var readerPri = new FileReader();
						readerPri.onerror = errorHandler;

						readerPri.onload = function (e) {
							INI_privteKey = readerPri.result;
						}
						//readerPri.readAsBinaryString(file);
						readerPri.readAsArrayBuffer(file);
					} else if (fileName.match(/pfx.*/) || fileName.match(/p12.*/)) {
						//확장자가 .p12/.pfx pkcs#12 파일
						var readerPfx = new FileReader();
						readerPfx.onerror = errorHandler;

						readerPfx.onload = function (e) {
							INI_priCertP12 = readerPfx.result;
						}
						//readerPfx.readAsBinaryString(file);
						readerPfx.readAsArrayBuffer(file);
					} else {
						new iniException.Warn.newThrow(null, 'WARN_1011');
					}
					fileNameList.push(file.name)
				}
				return fileNameList;
			} catch (e) {
				if (e) {
					throw e;
				} else {
					new iniException.Warn.newThrow(null, 'ERR_7013');
				}
			}
		};

		/*************************************************************************************
		 # 함수 명 : handleFileSelect
		 # 설명 : 이벤트 핸들러를 통해 파일리스트를 가져온다.
		*************************************************************************************/
		function handleFileSelect(evt) {
			try {
				if (evt.target.files.length >  0 ) {
					var fileNameList = savePriCert(evt.target.files);
					searchCert(fileNameList);
				}
			} catch (e) {
				INI_handleInfo.serviceInfo.getParameter('onImportCertFileSelected')(INI_handleInfo, "FILE_SELECT_ERROR");
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : searchCert
		 # 설명 : 파일 찾기를 통한 인증서 저장.
		*************************************************************************************/
		function searchCert(fileNameList) {
			try {
				if (fileNameList.length > 0) {
					//var searchHandleInfo = $("#INI_change_area").data("GINI_handleInfo");
					/* 임시 handler 추가 - 안영철*/
					var searchHandleInfo = INI_handleInfo;
					searchHandleInfo.serviceInfo.setParameter("SAVE_SUBMIT", "N");

					var derFile = "";
					var priKeyFile = "";

					for (fileIndex in fileNameList) {
						var fileName = fileNameList[fileIndex];
						var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1, fileName.length).toLowerCase();
						if (fileNameExt.match(/pfx.*/) || fileNameExt.match(/p12.*/)) {
							// p12일 경우
							// 인증서 상세화면으로 변경 해 주되 암호를 입력해야 하므로 파일 정보만 표출.
							searchHandleInfo.serviceInfo.setParameter("SAVE_TYPE", "p12");
							searchHandleInfo.serviceInfo.setParameter("SAVE_SUBMIT", "Y");
							searchHandleInfo.serviceInfo.setParameter("FILE_NAME", fileName);
							break;
						} else {
							// der, key 일 경우
							// 1. 2개의 파일이 모두 들어왔는지 체크.
							//  - 모두 들어왔을 경우 2번으로, 둘중 한개만 들어왔을 경우. 이름만 표출 해주고 다음 파일이 들어올 경우를 기다린다.
							// 2. 2개의 파일이 모두 들어왔을 경우 각각 인증서 및 개인키가 맞는 쌍인지 체크.
							// 3. 2번 통과 후 인증서 상세화면으로 변경함.
							searchHandleInfo.serviceInfo.setParameter("SAVE_TYPE", "der");

							if (fileNameExt.match(/der.*/)) {
								derFile = fileName;
							} else if (fileNameExt.match(/key.*/)) {
								priKeyFile = fileName;
							}

							if ((derFile !== undefined) && (derFile !== "") && (priKeyFile !== undefined) && (priKeyFile !== "")) {
								searchHandleInfo.serviceInfo.setParameter("SAVE_SUBMIT", "Y");
								searchHandleInfo.serviceInfo.setParameter("FILE_NAME", derFile);
								break;
							}
						}
					}

					if (searchHandleInfo.serviceInfo.getParameter("SAVE_SUBMIT") === "Y") {
						/*최종 콜백은 컨트롤러에서 지정한 콜백을 호출하도록 수정 - 안영철*/
						searchHandleInfo.serviceInfo.getParameter('onImportCertFileSelected')(searchHandleInfo);
						//SubForm.openSubCertSaveDetailForm(searchHandleInfo);
					} else {
						if ((searchHandleInfo.serviceInfo.getParameter("SAVE_TYPE") === 'der') && ((derFile === undefined) || (derFile === "") || (priKeyFile === undefined) || (priKeyFile === ""))) {
							INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1022);
						}
					}
				} else {
					INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1023);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
			finally {
				//clearSaveParam();
			}
		};

		/*************************************************************************************
		 # 함수 명 : handleDragOver
		 # 설명 : 드래그앤드롭 이벤트 핸들러
		*************************************************************************************/
		function handleDragOver(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy';
		};

		/*************************************************************************************
		 # 함수 명 : handleDrop
		 # 설명 : 드래그앤드롭 이벤트 핸들러
		*************************************************************************************/
		function handleDrop(evt) {
			try {
				evt.stopPropagation();
				evt.preventDefault();
				if (evt.dataTransfer.files.length > 0) {
					var fileNameList = savePriCert(evt.dataTransfer.files);
					INI_save_callback(fileNameList);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}

		};

		/*************************************************************************************
		 # 함수 명 : initializePriCertDragAndDrop
		 # 설명 : 드래그앤드롭 초기화
		*************************************************************************************/
		function initializePriCertDragAndDrop(zoneId, callback) {
			INI_save_callback = callback;
			if (window.addEventListener) {
				document.getElementById(zoneId).addEventListener('dragover', handleDragOver, false);
				document.getElementById(zoneId).addEventListener('drop', handleDrop, false);
			} else if (window.attachEvent) {
				document.getElementById(zoneId).attachEvent('dragover', handleDragOver);
				document.getElementById(zoneId).attachEvent('drop', handleDrop);
			}
		};

		/*************************************************************************************
		 # 함수 명 : initializePriCertFileSearch
		 # 설명 : 파일찾기 이벤트 초기화
		*************************************************************************************/
		function initializePriCertFileSearch(searchId, callback) {
			INI_save_callback = callback;

			if (window.addEventListener) {
				document.getElementById(searchId).addEventListener('change', handleFileSelect, false);
			} else if (window.attachEvent) {
				document.getElementById(searchId).attachEvent('change', handleFileSelect);
			}
		};

		/*************************************************************************************
		 # 함수 명 : initializeSave
		 # 설명 : 직접찾기 이벤트 초기화
		*************************************************************************************/
		var initializeSave = function (dragDropId, searchFileId, callback) {
			clearSaveParam();

			if (dragDropId) {
				initializePriCertDragAndDrop(dragDropId, callback);
			};
			if (searchFileId) {
				initializePriCertFileSearch(searchFileId, callback);
			};
		};
		
		/*************************************************************************************
		 # 함수 명 : initializeSave2
		 # 설명 : initializeSave와 같은 처리를 하는 함수지만, 페이지 단일화로 인한 구조 변경으로 새 함수 추가 
		*************************************************************************************/
		var initializeSave2 = function (handleInfo, dragDropId, searchFileId, callback) {
			clearSaveParam();
			INI_handleInfo = handleInfo;
			if (dragDropId) {
				initializePriCertDragAndDrop(dragDropId, callback);
			};
			if (searchFileId) {
				initializePriCertFileSearch(searchFileId, callback);
			};
		};

		/*************************************************************************************
		 # 함수 명 : initializeSave
		 # 설명 : 인증서 찾기 파라미터 초기화
		*************************************************************************************/
		function clearSaveParam() {
			INI_privteKey = null;
			INI_certificate = null;
			INI_priCertP12 = null;
			INI_save_callback = null;
			//INI_handleInfo = null; 
		}

		/*************************************************************************************
		 # 함수 명 : saveLocalPriCert
		 # 설명 : 인증서 직접/간편 저장.
		*************************************************************************************/
		var saveLocalPriCert = function (handleInfo) {
			try {
				if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === "p12") {
					//p12인증서 저장
					if (!utils.String.isNull(INI_priCertP12)) {
						var hexP12 = coreFactory.Factory.Util.bytesToHex(INI_priCertP12);
						hexP12 = coreFactory.Factory.Util.hexToBytes(hexP12) + '';
						handleInfo.serviceInfo.setParameter("ENC_P12_CERT", coreFactory.Factory.Util.encode64(hexP12));
					}
					clearSaveParam();

					//base64로 인코딩된 p12파일을 저장함.
					middleChannel.Manager.saveP12Certificate(handleInfo);
				} else if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === "import") {
					//간편찾기 인증서 저장 (중계서버를 통해 가져온 인증서를 저장한다.)
					var prikey = handleInfo.serviceInfo.getParameter("AUTH_NUM_CONFIRM")[0];
					handleInfo.serviceInfo.setParameter("PRIVATE_KEY", prikey);

					var certInfo = handleInfo.serviceInfo.getParameter("AUTH_NUM_CONFIRM")[1];
					handleInfo.serviceInfo.setParameter("CERTIFICATE", certInfo);
					clearSaveParam();
					// 인증서 저장
					middleChannel.Manager.savePrivateCertificate(handleInfo);
				} else {
					// 개인키, 인증서 저장
					if (utils.String.isNull(INI_privteKey) || utils.String.isNull(INI_certificate)) {
						// 이미 세팅된 인증서 정보가 있을 경우 handleInfo에서 데이터를 뽑아 저장한다.
						// der,key로 한쌍이 존재해야 저장이 가능하므로 둘중하나라도 없으면 오류 메세지 리턴.
						if (handleInfo.serviceInfo.getParameter("PRIVATE_KEY") && handleInfo.serviceInfo.getParameter("CERTIFICATE")) {
							clearSaveParam();
							// 인증서 저장
							middleChannel.Manager.savePrivateCertificate(handleInfo);
						} else {
							INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1022);
							return;
						}
					} else {
						// 미리 세팅된 인증서 정보가 없고 새로 가져온것을 경우 저장.
						// der, key파일을 저장 할 수 있는 형태로 변환
						var hexPri = coreFactory.Factory.Util.bytesToHex(INI_privteKey);
						hexPri = coreFactory.Factory.Util.hexToBytes(hexPri) + '';

						var hexCert = coreFactory.Factory.Util.bytesToHex(INI_certificate);
						hexCert = coreFactory.Factory.Util.hexToBytes(hexCert) + '';

						var prikey = coreFactory.Factory.Util.encode64(hexPri, 64);
						handleInfo.serviceInfo.setParameter("PRIVATE_KEY", prikey);
						var certInfo = coreFactory.Factory.Util.encode64(hexCert, 64);
						handleInfo.serviceInfo.setParameter("CERTIFICATE", certInfo);
						clearSaveParam();
						// 인증서 저장
						middleChannel.Manager.savePrivateCertificate(handleInfo);
					}
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : saveMobilePriCert
		 # 설명 : 모바일 인증서 저장.(현재 간편찾기 저장만 사용하고 있으나 실제로는 아래 모두 가능함)
		*************************************************************************************/
		var saveMobilePriCert = function (handleInfo) {
			try {
				if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === "p12") {
					//p12인증서 저장
					if (handleInfo.serviceInfo.getParameter("P12_CERT")) {
						var hexP12 = coreFactory.Factory.Util.bytesToHex(handleInfo.serviceInfo.getParameter("P12_CERT"));
						hexP12 = coreFactory.Factory.Util.hexToBytes(hexP12) + '';
						handleInfo.serviceInfo.setParameter("ENC_P12_CERT", coreFactory.Factory.Util.encode64(hexP12));
					}

					middleChannel.Manager.saveP12Certificate(handleInfo);
				} else if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === "import") {
					//인증서 간편찾기 저장
					var prikey = handleInfo.serviceInfo.getParameter("AUTH_NUM_CONFIRM")[0];
					handleInfo.serviceInfo.setParameter("PRIVATE_KEY", prikey);

					var certInfo = handleInfo.serviceInfo.getParameter("AUTH_NUM_CONFIRM")[1];
					handleInfo.serviceInfo.setParameter("CERTIFICATE", certInfo);
					middleChannel.Manager.savePrivateCertificate(handleInfo);
				} else {
					//인증서 der, key저장
					var hexPri = coreFactory.Factory.Util.bytesToHex(handleInfo.serviceInfo.getParameter("DER_PRIVATEKEY"));
					hexPri = coreFactory.Factory.Util.hexToBytes(hexPri) + '';

					var hexCert = coreFactory.Factory.Util.bytesToHex(handleInfo.serviceInfo.getParameter("DER_CERT"));
					hexCert = coreFactory.Factory.Util.hexToBytes(hexCert) + '';

					var prikey = coreFactory.Factory.Util.encode64(hexPri, 64);
					handleInfo.serviceInfo.setParameter("PRIVATE_KEY", prikey);
					var certInfo = coreFactory.Factory.Util.encode64(hexCert, 64);
					handleInfo.serviceInfo.setParameter("CERTIFICATE", certInfo);

					middleChannel.Manager.savePrivateCertificate(handleInfo);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : issueCertificate
		 # 설명 : 인증서 발급
		*************************************************************************************/
		var issueCertificate = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart("Progressing", 100);

				function callback(issued) {
					if (issued.status == 0) {
						handleInfo.serviceInfo.setParameter("PRIVATE_KEY", issued.signPriPem + '');
						handleInfo.serviceInfo.setParameter("CERTIFICATE", issued.signCertPem + '');
						// Action정의 : 인증서 발급
						handleInfo.serviceInfo.setAction(constants.WebForm.ACTION_CERT_ISSUE);
						// 저장
						middleChannel.Manager.savePrivateCertificate(handleInfo);
					} else {
						//alert("["+issued.status+"]" + issued.statusString );
						var statusString = utils.String.EUCKRtoUTF8(issued.statusString, false);
						var resultMSG = msgFactory.getMessageFactory().Error["ERR_7101"].replace(constants.System.REPLACE_CHAR, statusString);
						INI_ALERT(resultMSG, 'ERROR');
					}
				};

				var result = middleChannel.Manager.issueCertificate(handleInfo);
				if (!result) return;
				
				// 인증서 발급
				if (result) {
					coreFactory.Factory.Certs.issueCertificate(handleInfo, callback);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : reIssueCertificate
		 # 설명 : 인증서 재발급
		*************************************************************************************/
		var reIssueCertificate = function (handleInfo) {
			try {

				GINI_LoadingIndicatorStart();

				function callback(reIssued) {
					if (reIssued.status == 0) {
						handleInfo.serviceInfo.setParameter("PRIVATE_KEY", reIssued.signPriPem + '');
						handleInfo.serviceInfo.setParameter("CERTIFICATE", reIssued.signCertPem + '');
						// Action정의 : 인증서 발급
						handleInfo.serviceInfo.setAction(constants.WebForm.ACTION_CERT_REISSUE);

						// 저장
						middleChannel.Manager.savePrivateCertificate(handleInfo);
					} else {
						//alert("["+reIssued.status+"]" + reIssued.statusString );
						var statusString = utils.String.EUCKRtoUTF8(reIssued.statusString, false);
						var resultMSG = msgFactory.getMessageFactory().Error["ERR_7103"].replace(constants.System.REPLACE_CHAR, statusString);
						INI_ALERT(resultMSG, 'ERROR');
					}
				};

				var result = middleChannel.Manager.reIssueCertificate(handleInfo);
				if (result) {
					coreFactory.Factory.Certs.reIssueCertificate(handleInfo, callback);
				}

			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : updateCertificate
		 # 설명 : 인증서 갱신
		*************************************************************************************/
		var updateCertificate = function (handleInfo) {
			try {

				GINI_LoadingIndicatorStart();

				var result = middleChannel.Manager.updateCertificate(handleInfo);
				if (result && handleInfo.serviceInfo.getEventDeviceId() !== constants.Certs.STORAGE_SECURITY_TOKEN) {
					var certInfo = middleChannel.Certs.getSelectedReNewCertInfo();

					function callback(update) {
						if (update.status == 0) {
							handleInfo.serviceInfo.setParameter("PRIVATE_KEY", update.signPriPem + '');
							handleInfo.serviceInfo.setParameter("CERTIFICATE", update.signCertPem + '');

							/**
							 * 인증서 갱신 후 이전 인증서 삭제
							 */
							function removeCallback() {

								var removeHandleInfo = require("../common/handleManager").newHandleInfo();
								// 순서주의 step01
								removeHandleInfo.serviceInfo.setDeviceSub(certInfo.deviceSub);
								// 순서주의 step02
								removeHandleInfo.serviceInfo.setDeviceId(certInfo.deviceId);
								removeHandleInfo.serviceInfo.setParameter("CERT_ID", certInfo.certId);
								removeHandleInfo.serviceInfo.setParameter("PWD", certInfo.pwd);
								removeHandleInfo.serviceInfo.setParameter("PIN", certInfo.pin);

								removeCertificate(removeHandleInfo);
							}
							if (constants.Certs.STORAGE_BROWSER === handleInfo.serviceInfo.getDeviceId()) {
								middleChannel.Manager.savePrivateCertificate(handleInfo, removeCallback);
							} else {
								middleChannel.Manager.savePrivateCertificate(handleInfo, handleInfo.serviceInfo.getCallback());
							}
						} else {
							//alert("["+update.status+"]" + update.statusString );
							var statusString = utils.String.EUCKRtoUTF8(update.statusString, false);
							var resultMSG = msgFactory.getMessageFactory().Error["ERR_7102"].replace(constants.System.REPLACE_CHAR, statusString);
							INI_ALERT(resultMSG, 'ERROR');
						}
					};

					coreFactory.Factory.Certs.updateCertificate(handleInfo, certInfo, callback);
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		};

		/*************************************************************************************
		 # 함수 명 : revokeCertificate
		 # 설명 : 인증서 폐기
		*************************************************************************************/
		var revokeCertificate = function (handleInfo) {
			try {
				GINI_LoadingIndicatorStart("Progressing", 100);
				middleChannel.Manager.revokeCertificate(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : getSaveCertDetailInfo
		 # 설명 : 저장할 인증서의 상세정보를 보여줌.
		*************************************************************************************/
		var getSaveCertDetailInfo = function (handleInfo) {
			try {
				var cert;
				if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === 'der') {
					var hexCert;
					if (!utils.String.isNull(INI_certificate)) {
						hexCert = coreFactory.Factory.Util.bytesToHex(INI_certificate);
					} else {
						hexCert = coreFactory.Factory.Util.bytesToHex(handleInfo.serviceInfo.getParameter("DER_CERT"));
					}
					hexCert = coreFactory.Factory.Util.hexToBytes(hexCert) + '';
					var base64Cert = coreFactory.Factory.Util.encode64(hexCert, 64);
					cert = coreFactory.Factory.Util.certPemTagAdd(base64Cert);
				} else if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === 'import') {
					// import
					cert = handleInfo.serviceInfo.getParameter("AUTH_NUM_CONFIRM")[1];
				} else if (handleInfo.serviceInfo.getParameter("SAVE_TYPE") === 'p12') {
					try {
						var encP12Cert;
						if (!utils.String.isNull(INI_priCertP12)) {
							var hexP12 = coreFactory.Factory.Util.bytesToHex(INI_priCertP12);
							hexP12 = coreFactory.Factory.Util.hexToBytes(hexP12) + '';
							encP12Cert = coreFactory.Factory.Util.encode64(hexP12);
						} else if (handleInfo.serviceInfo.getParameter("P12_CERT")) {
							var hexP12 = coreFactory.Factory.Util.bytesToHex(handleInfo.serviceInfo.getParameter("P12_CERT"));
							hexP12 = coreFactory.Factory.Util.hexToBytes(hexP12) + '';
							encP12Cert = coreFactory.Factory.Util.encode64(hexP12);
						} else {
							encP12Cert = handleInfo.serviceInfo.getParameter("ENC_P12_CERT");
						}
						// P12포맷 인증서 정보
						cert = coreFactory.Factory.PriKey.extractP12Cert(encP12Cert);
					} catch (e) {
						if (handleInfo.serviceInfo.getParameter("FILE_NAME")) {
							webForm.DrawForm.drawCertDetailFileName(
								msgFactory.getMessageFactory().Info["INFO_1008"].replace(constants.System.REPLACE_CHAR, handleInfo.serviceInfo.getParameter("FILE_NAME")));
						} else {
							webForm.DrawForm.drawCertDetailFileName(msgFactory.getMessageFactory().Info.INFO_1007);
						}
					}
				} else {
					//한글???
					INI_HANDLE.infoMessage("지원하지 않은 인증서 타입입니다.");
					return;
				}
				if (cert) {
					handleInfo.serviceInfo.getCallback()(coreFactory.Factory.Certs.parseCertAttributes(cert));
				}
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}

		/*************************************************************************************
		 # 함수 명 : importTimer
		 # 설명 : 인증서 간편찾기 타이머
		*************************************************************************************/
		var importTimer = (function () {
			var displayTimer;
			var startTimer = function (duration, display) {
				var timer = duration, minutes, seconds;
				resetTimer();
				timerView(timer, minutes, seconds, display);
				displayTimer = setInterval(function () {
					timerView(timer, minutes, seconds, display);
					if (--timer < 0) {
						timer = duration;
						INI_HANDLE.warnMessage(msgFactory.getMessageFactory().Warn.WARN_1014);
						resetTimer();
					}
				}, 1000);
				return timer;
			}

			function timerView(timer, minutes, seconds, display) {
				minutes = parseInt(timer / 60, 10)
				seconds = parseInt(timer % 60, 10);

				minutes = minutes < 10 ? "0" + minutes : minutes;
				seconds = seconds < 10 ? "0" + seconds : seconds;

				display.text(minutes + ":" + seconds);
			}

			var longPollTimer;
			var setLongPollTimer = function (timer) {
				longPollTimer = timer;
			};

			var getLongPollTimer = function () {
				return longPollTimer;
			};

			var resetTimer = function () {
				$('#INI_timer').text("00:00");
				clearInterval(displayTimer);
				clearTimeout(longPollTimer);
			}

			return {
				startTimer: startTimer,
				resetTimer: resetTimer,
				setLongPollTimer: setLongPollTimer,
				getLongPollTimer: getLongPollTimer
			}
		}());


		return {
			importCertPriV11: importCertPriV11,
			saveCertPriV11: saveCertPriV11,
			getImportAuthNum: getImportAuthNum,
			saveAnotherCertificate: saveAnotherCertificate, //정범교
			changePassword: changePassword,
			searchCert: searchCert,
			copyCertificate: copyCertificate,
			certImportExport: certImportExport,
			savePrivateCertificate : savePrivateCertificate,
			issueCertificate: issueCertificate,
			updateCertificate: updateCertificate,
			reIssueCertificate: reIssueCertificate,
			revokeCertificate: revokeCertificate,
			initializeSave: initializeSave,
			/* 페이지 단일화로 추가된 된 함수 - 안영철*/
			initializeSave2: initializeSave2,
			saveLocalPriCert: saveLocalPriCert,
			saveMobilePriCert: saveMobilePriCert,
			removeCertificate: removeCertificate,
			exportCertPriP12: exportCertPriP12,
			exportCertPriP12File: exportCertPriP12File,
			getSaveCertDetailInfo: getSaveCertDetailInfo,
			importTimer: importTimer
		}
	}());


	/*************************************************************************************
	 # 함수 명 : KeyStrokeSecurity
	 # 설명 : 키입력 보안 설정 (keypad, e2e)
	*************************************************************************************/
	var KeyStrokeSecurity = (function () {

		// 사용여부 체크




		// 조건 입력
		//1. 디바이스 정보 (브라우저 및 action)

		//2. 브라우저 및 OS





		// 사용여부

		// 조건

		// 종류

	}());

	var KeyPad = (function () {
		var INI_bKeyPadLock = false;
		var INI_keypadName = "";
		var initializeKeyPad = function (handleInfo, isVirtualKeypad) {
			// 키패드가 열려있다면 다시 열지 않는다.
			if (INI_bKeyPadLock && isVirtualKeypad == true) return;

			if (isVirtualKeypad || INI_getPlatformInfo().Mobile) {
				// 가상키패드 버튼을 클릭하거나 모바일은 무조건 가상키패드
				var keypadList = defaultConf.KeyStrokeSecurity.KeyStrokeSecurityList;
				if (!keypadList) {
					if (!INI_getPlatformInfo().Mobile) {
						INI_ALERT(msgFactory.getMessageFactory().Info["INFO_1013"], 'INFO');
					}
				} else {
					INI_bKeyPadLock = true;
					INI_keypadName = constants.KeyStrokeSecurity.KEYPAD_NAME.UNIWEB_KEY;
					keyStrokeSecurityFactory.initialize(constants.KeyStrokeSecurity.KEYPAD_NAME.UNIWEB_KEY, handleInfo);
				}
			} else {
				var keypadList = defaultConf.KeyStrokeSecurity.KeyStrokeSecurityList;
				var keypadName = "default";
				INI_bKeyPadLock = false;

				if (!keypadList) {
					keyStrokeSecurityFactory.initialize(keypadName, handleInfo);
				} else {
					var deviceId = handleInfo.serviceInfo.getDeviceId();
					var behavior = handleInfo.serviceInfo.getBehavior();

					for (var ii = 0; keypadList.length > ii; ii++) {
						// 키패드 사용여부 체크
						if (keypadList[ii].USE === "Y") {
							// 픞팻폼 체크
							if (keypadList[ii].OS[0] !== "ALL" && (utils.Collection.arrayIndexOf(keypadList[ii].OS, system.Browser.getPlatform) === -1)) {
								continue;
							}
							// 브라우저 체크
							if (keypadList[ii].BROWSER[0] !== "ALL" && (utils.Collection.arrayIndexOf(keypadList[ii].BROWSER, system.Browser.getBrowserName) === -1)) {
								continue;
							}
							// 스토리지 체크
							if (keypadList[ii].DEVICE[0] !== "ALL" && (utils.Collection.arrayIndexOf(keypadList[ii].DEVICE, deviceId) === -1)) {
								continue;
							}
							// 액션/행위 체크
							if (keypadList[ii].ACTION[0] !== "ALL" && (utils.Collection.arrayIndexOf(keypadList[ii].ACTION, behavior) === -1)) {
								continue;
							}
							keypadName = keypadList[ii].KEYPAD_NAME;
							try {
								// E2E의 경우 설치 여부 체크
								if ((keypadName == constants.KeyStrokeSecurity.KEYPAD_NAME.TOUCHEN_KEY) && ((!useTouchEnnxKey) || (useTouchEnnxKey == false))) {
									continue;
								}
							} catch (e) {
								continue;
							}
							break;
						}
					}
					// 만족하는 조건이 없을 경우 리턴.
					//					console.log("$$$ keypadName keyStrokeSecurityFactory", keypadName + ":" + deviceId + ":" + behavior);
					INI_keypadName = keypadName;
					// 조건에 맞는 키패드 초기화
					keyStrokeSecurityFactory.initialize(keypadName, handleInfo);
				}
			}
		}

		var getKeypadName = function () {
			return INI_keypadName;
		}
		var run = function (handleInfo) {
			keyStrokeSecurityFactory.run(handleInfo);
		}

		var click = function (handleInfo, keyType) {
			keyStrokeSecurityFactory.click(handleInfo, keyType);
		}

		var close = function (handleInfo) {
			keyStrokeSecurityFactory.close(handleInfo);
		}

		var clear = function (handleInfo) {
			keyStrokeSecurityFactory.clear(handleInfo);
		}

		var getKeyPadValue = function (handleInfo, callback, nonceType) {
			keyStrokeSecurityFactory.getKeyPadValue(handleInfo, callback, nonceType);
		};
		var setEnterCallback = function (callback) {
			keyStrokeSecurityFactory.setEnterCallback(callback);
		}

		return {
			initializeKeyPad: initializeKeyPad,
			getKeypadName: getKeypadName,
			run: run,
			click: click,
			close: close,
			clear: clear,
			getKeyPadValue: getKeyPadValue,
			setEnterCallback: setEnterCallback
		};
	}());


	/*************************************************************************************
	 # 함수 명 : StorageManage
	 # 설명 : 저장매체 관련 함수 모음
	*************************************************************************************/
	var StorageManage = (function () {

		/*************************************************************************************
		 # 함수 명 : storageClick
		 # 설명 : 저장매체 클릭 함수.
		*************************************************************************************/
		var storageClick = function (handleInfo) {
			GINI_LoadingIndicatorStart('Progressing', 50);
			var deviceId = handleInfo.serviceInfo.getDeviceId();
			if (constants.Certs.STORAGE_SCARD === deviceId || constants.Certs.STORAGE_SECURITY_DEVICE === deviceId) {
				//가상 키패드 처리
				middleChannel.Manager.issueCertificate(handleInfo, true);
			}
			_storageClick(handleInfo, undefined);
		}

		/*************************************************************************************
		 # 함수 명 : storageClickInner
		 # (사용X) 설명 : 저장매체 클릭 함수.(Inner 용)
		*************************************************************************************/
		var storageClickInner = function (handleInfo) {
			GINI_LoadingIndicatorStart('Progressing', 50);
			_storageClick(handleInfo, true);
		}

		/*************************************************************************************
		 # 함수 명 : _storageClick
		 # 설명 : 저장매체 클릭 함수(내부).
		 # params 
		 	handleInfo : html5 파라미터 데이터 구조체
		 	isInner : Inner 여부
		*************************************************************************************/
		function _storageClick(handleInfo, isInner) {

			function callback(version, selectedBrowser) {

				if (selectedBrowser) {
					version = true;
					handleInfo.serviceInfo.setEventDeviceId(constants.Certs.STORAGE_BROWSER);
				}

				if (version === true || "NOT_INSTALL" !== version) {

					if (handleInfo.serviceInfo.getEventDeviceId() !== constants.Certs.USIM) {

						if (!isInner) {
							handleInfo.serviceInfo.setCallback(WebForm.drawCertList);
						} else {
							handleInfo.serviceInfo.setCallback(InnerWebForm.drawCertList);
						}
						Certs.getCertAttributeList(handleInfo);
					} else {
						//  USIM  의 경우
						GINI_LoadingIndicatorStop();
					}

					if (handleInfo.serviceInfo.getEventDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN) {
						$("#INI_cert_passwd_label").text(msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_009);
					} else {
						// 가상키보드 미설치시 문구 변경.
						if (typeof (useTouchEnnxKey) != 'undefined') {

							if (useTouchEnnxKey) {
								$("#INI_cert_passwd_label").text(msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_004);
							} else {
								$("#INI_cert_passwd_label").text(msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_004_1);
							}
						} else {

							$("#INI_cert_passwd_label").text(msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_004_1);
						}

					}
				} else {
					INI_HANDLE.infoMessage(msgFactory.getMessageFactory().Info.INFO_1009);
				}

				//
				var bottomButtonAction = defaultConf.WebForm.getStorageAttribute(handleInfo.serviceInfo.getDeviceId()).BOTTOM_BUTTON_ACTION;
				if (!bottomButtonAction) {
					// 인증서 보기/찾기/삭제 이벤트를 막는다.
					$("#INI_cert_detail_info_btn").attr("disabled", true);
					$("#INI_cert_search_btn").attr("disabled", true);
					$("#INI_cert_remove_btn").attr("disabled", true);
				} else {
					$("#INI_cert_detail_info_btn").removeAttr("disabled");
					$("#INI_cert_search_btn").removeAttr("disabled");
					$("#INI_cert_remove_btn").removeAttr("disabled");
				}
			};

			//			GINI_LoadingIndicatorStart();

			// 브라우저가 아닐 경우 설치체크.
			if (handleInfo.serviceInfo.getEventDeviceId() !== constants.Certs.STORAGE_BROWSER) {
				// 설치 체크
				Version.installed(callback);
			} else {
				// 브라우저 일 경우
				Version.getExteralVersion(callback, true);
			}

		};
		/*************************************************************************************
		 # 함수 명 : setFocusStorage
		 # 설명 : 저장매체 포커스 주기.
		*************************************************************************************/
		var setFocusStorage = function (deviceId, isInstallCheck) {

			function callback(version, selectedBrowser) {

				if (selectedBrowser) {
					version = true;
					deviceId = constants.Certs.STORAGE_BROWSER;
				}

				if (version === true || "NOT_INSTALL" !== version) {
					$("#INI_storage_list .drive_select").hide();
					$("#INI_storage_list .extension_layer").hide();
					$('.media_select ul.media_list li.list_data').removeClass('list_select').find('.check').remove();
					if (defaultConf.WebForm.getStorageExtButton()[deviceId]) {
						$("#INI_storage_list #EXTEND").closest('li').addClass('list_select');
						$("#INI_storage_list #EXTEND").parent('a').append('<span class="check">' + msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_018 + '</span>');
					} else {
						$("#INI_storage_list #" + deviceId).closest('li').addClass('list_select');
						$("#INI_storage_list #" + deviceId).parent('a').append('<span class="check">' + msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_018 + '</span>');
					}
				} else {
					INI_HANDLE.infoMessage(msgFactory.getMessageFactory().Info.INFO_1009);
				}
			};

			if (deviceId !== constants.Certs.STORAGE_BROWSER) {
				if (isInstallCheck) {
					// 설치 체크
					Version.installed(callback);
				} else {
					callback(true);
				}
			} else {
				Version.getExteralVersion(callback, true);
			}

		};

		/*************************************************************************************
		 # 함수 명 : getBaroSignPolicy
		 # 설명 : 바로싸인 정책 설정.
		*************************************************************************************/
		var getBaroSignPolicy = function (action, signature_plain_text) {
			var barosignData = null;
			if (action === constants.WebForm.ACTION_LOGIN) {
				barosignData = { "action": "registAction", "policy_name": "loginPolicy" };
			} else if (action === constants.WebForm.ACTION_SIGN) {
				var frm = document.getElementById("readForm");
				var d = new Date();
				var today = d.getFullYear() + "." + ("00" + (d.getMonth() + 1)).slice(-2) + "." + ("00" + d.getDate()).slice(-2);
				var time = ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2);
				barosignData = { "action": "registAction", "policy_name": "signPolicy", "today": today, "time": time, "signature_plain_text": encodeURIComponent(signature_plain_text) };
			}
			barosignCore.makeBaroSignQRData(barosignData, action);
		};

		return {
			storageClick: storageClick,
			storageClickInner: storageClickInner,
			setFocusStorage: setFocusStorage,
			getBaroSignPolicy: getBaroSignPolicy
		};

	}());

	/*************************************************************************************
	 # 함수 명 : Version
	 # 설명 : 버전 관련 함수 모음
	*************************************************************************************/
	var Version = (function () {

		var version = "NOT_INSTALL";

		/*************************************************************************************
		 # 함수 명 : checkExteralVersion
		 # 설명 : crosswebex 버전 체크
		 # params 
		 	callback : 버전 체크 후 실행될 callback 함수.
		*************************************************************************************/
		function checkExteralVersion(callback) {

			/*************************************************************************************
			 # 함수 명 : getExteralVersionCallback
			 # 설명 : crosswebex 버전 체크 후 콜백
			 # params 
			 	params : crosswebex에서 받은 버전정보.
			 	selectedBrowser : 브라우저 선택여부
			*************************************************************************************/
			function getExteralVersionCallback(params, selectedBrowser) {
				version = params;


				if (selectedBrowser) {
					// Browser선택
					$("#INI_storage_list #BROWSER").closest('li').addClass('list_select');
					$("#INI_storage_list #BROWSER").parent('a').append('<span class="check">' + msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_018 + '</span>');
					$("#INI_storage_list #BROWSER").focus().click();
				} else {
					if (version === true || "NOT_INSTALL" !== version) {
						// 설치가 된 경우 PC 정보 추출 이 필요하면 호출
						var collectPcInfo = defaultConf.System.PCInfo["SITE_NAME"];
						if (collectPcInfo) {
							IniSafeNeo.PCInfo.gatterPCInfo();
						}
					}
					// 버전체크 이후 행할 콜백 함수 호출.
					if (callback) {
						callback(params);
					}
				}
			};

			try {
				var handleInfo = require("../common/handleManager").newHandleInfo();
				handleInfo.serviceInfo.setCallback(getExteralVersionCallback);

				middleChannel.Configure.getExteralVersion(handleInfo);
			} catch (e) {
				INI_HANDLE.handleMessage(e);
			}
		}; //checkExteralVersion();

		/*************************************************************************************
		 # 함수 명 : getExteralVersion
		 # 설명 : crosswebex 버전 체크
		*************************************************************************************/
		var getExteralVersion = function (callback, isBrowser) {

			if (version || isBrowser) {
				callback(isBrowser);
			} else {
				checkExteralVersion(callback);
			}
		};

		/*************************************************************************************
		 # 함수 명 : installed
		 # 설명 : crosswebex 인스톨 체크
		*************************************************************************************/
		var installed = function (callback) {
			checkExteralVersion(callback);
		};

		return {
			getExteralVersion: getExteralVersion,
			installed: installed
		};
	}());

	return {
	  $ : $,
	  constants: constants,
	  inipluginAdt: inipluginAdt,
	  msgFactory: msgFactory,
	  
		// NeoWeb 화면 구성 함수.
		IniSafeNeo: IniSafeNeo,	// 외부 연동 화면 관련 함수.
		SubForm: SubForm,			// 내부 연동 화면 관련 함수.
		WebForm: WebForm,			// 동적 화면 관련 함수.
		MobileForm: MobileForm,	// 모바일 화면 관련 함수.
		InnerWebForm: InnerWebForm, // inner html 동적 화면 관련 함수.
		// 인증서 관련 함수
		Certs: Certs,
		// 로그인 관련 함수
		Login: Login,
		// 전자서명 관련 함수
		Signature: Signature,
		// 인증서 관리 관련 함수
		CertManager: CertManager,
		// 저장매체 관련 함수.
		StorageManage: StorageManage,
		// 버전
		Version: Version,
		KeyPad: KeyPad,
		INI_CONFIRM : messageDialog.INI_CONFIRM,
		INI_ALERT : messageDialog.INI_ALERT,
		defaultConf : defaultConf
	};
});

