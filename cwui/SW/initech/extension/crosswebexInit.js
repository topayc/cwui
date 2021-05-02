//////////////////////////////
// common vaiable
//////////////////////////////

var CW_STATUS_NOT_CHECKED = 0;		// 체크 안됨
var CW_STATUS_NOT_INSTALLED = 1;	// 설치 안됨
var CW_STATUS_INSTALLED = 2;		// 설치 됨
var CW_STATUS_NOT_INITIALIZED = 3;	// 초기화 안됨
var CW_STATUS_INITIALIZED = 4;		// 초기화 됨

var crosswebexInstallPath = crosswebexBaseDir + "/install/install.html";
var InstallModuleURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/dll/INIS60.vcs";
var InstallModuleURL64 = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/dll_64/INIS60.vcs";
var cwInitStatus = CW_STATUS_NOT_CHECKED;

/************************************************************
 * @brief		모듈 설치 체크 대기
 * @param[in]	callback		모듈 설치 체크 대기 콜백 함수
 ************************************************************/
function cwModuleInstallWait(callback) {
	exlog("cwModuleInstallWait", "start");

	// 체크 대기
	if (cwInitStatus < CW_STATUS_NOT_INSTALLED) {
		exlog("ModuleInstallWait", "waiting for checking installation");
		setTimeout(function () {
			cwModuleInstallWait(callback);
		}, 1000);

	// 설치 안됨
	} else if (cwInitStatus == CW_STATUS_NOT_INSTALLED) {
		exlog("cwModuleInstallWait", "not installed");
		cwShowInstallPage();

	// 초기화 대기
	} else if (cwInitStatus < CW_STATUS_NOT_INITIALIZED) {
		exlog("ModuleInstallWait", "waiting for checking initialization");
		setTimeout(function () {
			cwModuleInstallWait(callback);
		}, 1000);

	// 초기화 안됨
	} else if (cwInitStatus == CW_STATUS_NOT_INITIALIZED) {
		exlog("cwModuleInstallWait", "not initialized");
		cwShowInstallPage();

	// 초기화 됨
	} else {
		exlog("cwModuleInstallWait", "call callback");
		eval(callback)(cwInitStatus == CW_STATUS_INITIALIZED);
	}

	exlog("cwModuleInstallWait", "end");
}

/************************************************************
 * @brief		모듈 설치 체크 대기 (팝업 없음)
 * @param[in]	callback		모듈 설치 체크 대기 콜백 함수
 ************************************************************/
function cwModuleInstallWaitWithNoPopup(callback) {
	exlog("cwModuleInstallWaitWithNoPopup", "start");

	// 체크 대기
	if (cwInitStatus < CW_STATUS_NOT_INSTALLED) {
		exlog("cwModuleInstallWaitWithNoPopup", "waiting for checking installation");
		setTimeout(function () {
			cwModuleInstallWaitWithNoPopup(callback);
		}, 1000);

	// 설치 안됨
	} else if (cwInitStatus == CW_STATUS_NOT_INSTALLED) {
		exlog("cwModuleInstallWaitWithNoPopup", "not installed");
		eval(callback)(cwInitStatus == CW_STATUS_INSTALLED);

	// 초기화 대기
	} else if (cwInitStatus < CW_STATUS_NOT_INITIALIZED) {
		exlog("cwModuleInstallWaitWithNoPopup", "waiting for checking initialization");
		setTimeout(function () {
			cwModuleInstallWaitWithNoPopup(callback);
		}, 1000);

	// 초기화 완료
	} else {
		exlog("cwModuleInstallWaitWithNoPopup", "call callback");
		eval(callback)(cwInitStatus == CW_STATUS_INITIALIZED);
	}

	exlog("cwModuleInstallWaitWithNoPopup", "end");
}

/************************************************************
 * @brief		모듈 설치 상태 취득
 * @retval		CW_STATUS_NOT_CHECKED		체크 안됨
 * @retval		CW_STATUS_NOT_INSTALLED		설치 안됨
 * @retval		CW_STATUS_INSTALLED			설치 됨
 * @retval		CW_STATUS_NOT_INITIALIZED	초기화 안됨
 * @retval		CW_STATUS_INITIALIZED		초기화 됨
 ************************************************************/
function cwGetModuleInstallStatus() {
	return cwInitStatus;
}

var openedWindow = null;

/************************************************************
 * @brief		설치 페이지 표시
 ************************************************************/
function cwShowInstallPage() {
	exlog("cwShowInstallPage", "start");

	// 오픈하지 않은 경우
	if (openedWindow == null || openedWindow.closed) {
		var width=600;
		var height=400
		openedWindow = window.open(crosswebexInstallPath, "_blank", "toolbar=no, scrollbars=no, resizable=no,"+'top='+(screen.availHeight - height)/2 +', left='+(screen.availWidth - width)/2+',width='+width+',height='+height);

	// 오픈한 경우
	} else {
		openedWindow.focus();
	}

	exlog("cwShowInstallPage", "end");
}

/************************************************************
 * @brief		설치 확인
 ************************************************************/
function ModuleInstallCheck() {
	return cwInitStatus == CW_STATUS_INITIALIZED;
}

/************************************************************
 * @brief		초기화 비활성화
 ************************************************************/
function cwOnloadDisable() {
	// 없음
	// by j.k.h
	// 결과는 유사하나 cwOnloadDisable 과 초기화 중복 방지의 동작은 다른 동작이므로 경고를 추가함
	exlog("cwOnloadDisable", "cwOnloadDisable is dummy function. it have no effect at all.");
}

// 초기화 진행 중 플래그
var cwInitializationInProgress = false;

/************************************************************
 * @brief		초기화
 ************************************************************/
function cwInit(callback) {
	exlog("cwInit", "start");

	try {
		// 초기화 대기
		if (callback) {
			// 초기화는 본 스크립트 마지막에서 진행 중이므로
			// 초기화 완료 이벤트를 받아야 하는 업무에서 callback 을 지정해 주었을 경우에는
			// 초기화 완료 대기 후 해당 callback 을 호출하여 준다.
			cwModuleInstallWait(callback);

		// 초기화
		} else {
			// 초기화는 본 스크립트 마지막에서 진행 중이므로
			// 초기화 완료 이벤트를 받아야 하는 업무에서 callback 을 지정해 주지 않았을 경우에는
			// 초기화를 무시하도록 한다.

			// 초기화 진행 중인 경우 초기화 수행하지 않음
			if (cwInitializationInProgress) {
				exlog("cwInit in progress", "end");
				return;
			}

			// 초기화 진행 중으로 설정
			cwInitializationInProgress = true;

			// 설치 체크
			if (CROSSWEBEX_UTIL.getBrowserInfo().bit == "64") {
				crosswebexInfo.exModuleName = "crosswebex64";
			}
			CROSSWEBEX_CHECK.check([crosswebexInfo], "cwCheckCallback");
		}
	} catch (e) {
		exlog("cwInit [exception] pageCallback load error", e);
		exalert("cwInit", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001);	// "콜백 함수 동작 중 오류가 발생하였습니다."
	}

	exlog("cwInit", "end");
}

/************************************************************
 * @brief		에러 발생시 초기화
 ************************************************************/
function cwInitOnError(result) {
	exlog("cwInitOnError", "start");

	try {
		// [설치 안됨] 으로 설정
		cwInitStatus = CW_STATUS_NOT_INSTALLED;

		// 설치 페이지 표시
		cwShowInstallPage();

	} catch (e) {
		exlog("cwInitOnError [exception] pageCallback load error", e);
		exalert("cwInitOnError", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001);	// "콜백 함수 동작 중 오류가 발생하였습니다."
	}

	exlog("cwInitOnError", "end");
}

// 에러 핸들러 설정
crosswebInterface.exCommonError = cwInitOnError;

/************************************************************
 * @brief		모듈 설치 체크 콜백 함수
 * @param[in]	check			모듈 설치 체크 결과
 ************************************************************/
function cwCheckCallback(check) {
	exlog("cwCheckCallback", "start");
	try {
		// 초기화 성공
		if (check.status) {
			CROSSWEBEX_LOADING("cwLoadingCallback");

		// 초기화 실패
		} else {
			// [설치 안됨] 으로 설정
			cwInitStatus = CW_STATUS_NOT_INSTALLED;
		}
	} catch (e) {
		exlog("cwCheckCallback [exception] pageCallback load error", e);
		exalert("cwCheckCallback", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001);		// "콜백 함수 동작 중 오류가 발생하였습니다."
	}
	exlog("cwCheckCallback", "end");
}

/************************************************************
 * @brief		로딩 콜백 함수
 * @param[in]	result			로딩 결과
 ************************************************************/
function cwLoadingCallback(result) {
	exlog("cwLoadingCallback", "start");
	try {
		// 초기화 성공
		if (result) {
			// 데몬 방식
			if (CROSSWEBEX_UTIL.typeDaemon()) {
				CrossWebExWeb6.InstallModule(InstallModuleURL, "cwInstallModuleCallback");
			// 확장 방식
			} else {
				if (CROSSWEBEX_UTIL.getBrowserBit() == "64") {
					CrossWebExWeb6.InstallModule(InstallModuleURL64, "cwInstallModuleCallback");
				} else {
					CrossWebExWeb6.InstallModule(InstallModuleURL, "cwInstallModuleCallback");
				}
			}

		// 초기화 실패
		} else {
			// [초기화 완료 - 미설치] 로 설정
			cwInitStatus = CW_STATUS_NOT_INSTALLED;
		}
	} catch (e) {
		exlog("cwLoadingCallback [exception] pageCallback load error", e);
		exalert("cwLoadingCallback", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001); // "콜백 함수 동작 중 오류가 발생하였습니다."
	}
	exlog("cwLoadingCallback", "end");
}

/************************************************************
 * @brief		초기화 및 모듈 설치 콜백 함수
 * @param[in]	result			초기화 및 모듈 설치 결과
 ************************************************************/
function cwInstallModuleCallback(result) {
	exlog("cwInstallModuleCallback", "start");

	try {
		// 초기화 성공
		if (result && result == "1") {

			// [설치 됨] 으로 설정
			cwInitStatus = CW_STATUS_INSTALLED;

			// 확장 방식
			if (!CROSSWEBEX_UTIL.typeDaemon()) {
				// 정책 설정 - 64bit 라이선스 설정
				if (CROSSWEBEX_UTIL.getBrowserBit() == "64") {
					CrossWebExWeb6.SetProperty("DomainLicence", crosswebexInfo.lic_64bit);
				}
			}

			// 정책 설정 - 인증서 유효기간 범위오차 default (0, 0)
			CrossWebExWeb6.SetVerifyNegoTime(3600, 3600);
			// 정책 설정 - 인증서 선택창의 이미지 변경
			CrossWebExWeb6.SetLogoPath(LogoURL);
			// 정책 설정 - 로그인창에서 페기/만료된인증서 표시여부 default (false)
			CrossWebExWeb6.DisableInvalidCert(true);
			// 정책 설정 - 금결원 형식
			CrossWebExWeb6.setSharedAttribute("BTInitP7Msg", "0");
			// 정책 설정 - 인증서 캐쉬 사용
			CrossWebExWeb6.ExtendMethod("InitCache", "on");
			// 정책 설정 - CA 인증서 로드 (CA 인증서 필터링)
			CrossWebExWeb6.LoadCACert(CACert);

			// 정책 설정 - urlencode를 euc-kr로 변경
			CrossWebExWeb6.SetProperty("URLEncodeConv", "NO");
			// 정책 설정 - 공인인증서 고도화 여부 default (0)
			CrossWebExWeb6.SetProperty("UseCertMode", 1);
			// 정책 설정 - 인증서 제출한 스토리지를 서버로 전달 default (FALSE)
			CrossWebExWeb6.SetProperty("GetExhibitionCertStoreInfo", "TRUE");
			//====================================================================================================
			// GPKI 사용하는 업무에서 정책설정
			//====================================================================================================
			//	// 정책 설정 - GPKI 인증서 사용여부
			//	CrossWebExWeb6.SetProperty("certmanui_gpki", "all");
			//====================================================================================================
			// 정책 설정 - 보안토큰 활성화
			CrossWebExWeb6.SetProperty("certmanui_hsm", "yes");
			
			/*// 정책 설정 - USIM 활성화
			CrossWebExWeb6.SetProperty("certmanui_usim", "yes");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMServiceCertViewToPhone", "1");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMServiceDriverList", "USIM_0001|USIM_0002");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMServiceDownloadURL", "driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430|driver^USIM_0002$url^http://download.smartcert.co.kr$width^520$height^650");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMServiceSiteCode", "000000000");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMServiceUnsupportedMsgURL", "url^http://www.usimcert.com/popup/pop_install.html$width^300$height^400");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMServiceServerInfo", "driver^USIM_0002$addr^58.229.178.42$port^25190");
			// 정책 설정 - USIM - 
			CrossWebExWeb6.SetProperty("USIMSiteDomainURL", "www.shinhan.com");
			// 정책 설정 - Infovine - 모듈 버전
			CrossWebExWeb6.SetProperty("certmanui_phoneVer", "1,4,0,7");
			// 정책 설정 - Infovine - 정책 설정
			CrossWebExWeb6.SetProperty("certmanui_phone", "SHINHAN|https://bank.shinhan.com/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE");
			// 정책 설정 - Infovine - 다운로드 URL
			CrossWebExWeb6.SetProperty("certmanui_phoneURL", "https://bank.shinhan.com/sw/infovine/download.html");
			// 정책 설정 - MobiSign - 모듈 버전
			CrossWebExWeb6.SetProperty("certmanui_mobiVer", "5.0.2.14");
			// 정책 설정 - MobiSign - 모듈 다운로드 URL
			CrossWebExWeb6.SetProperty("certmanui_mobiURL", "http://www.mobisign.kr/mobisigndll.htm");
			// 정책 설정 - MobiSign - 기관별 식별 7자리 코드
			CrossWebExWeb6.SetProperty("certmanui_mobiClientCode", "0100001");
			// 정책 설정 - MobiSign - 사용 가능한 OID 리스트
			CrossWebExWeb6.SetProperty("certmanui_mobiOIDFilter", "2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;");
			// 정책 설정 - 휴대폰 서비스 활성화
			CrossWebExWeb6.SetProperty("certmanui_phoneServiceList", "infovine|mobisign");
			*/
			// 정책 설정 - 비밀변호 체계 강화 설정
			CrossWebExWeb6.SetProperty("YessignCertPasswordPolicy", "1");
			// 정책 설정 - 인증서나 제출창을 맨 위로 띄우는 함수
			CrossWebExWeb6.SetProperty("certmanui_topmost", "yes");
			// 정책 설정 - 인증서창 언어설정 (KOR, ENG)
			CrossWebExWeb6.SetProperty("certmanui_language", "OFF");
			// 정책 설정 - 전자서명 내역 표시여부 (list, text, no)
			CrossWebExWeb6.SetProperty("certmanui_SelectCertUIMode", "list");
			//====================================================================================================
			// 인증서 OID 필터링
			//====================================================================================================
			// 금융결제원　　　　	a1:범용(개인),   a2:범용(기업),  a3:공인인증서,  a4:은행/보험(개인), a5:은행/보험(기업), a6:신용카드용,  a7:전자세금계산서
			// 한국무역정보통신　	b1:범용(개인),   b2:범용(법인),  b3:일반인증서,  b4:은행/보험용,     b5:신용카드용
			// 한국증권전산　　　	c1:범용(개인),   c2:범용(법인),  c3:일반인증서,  c4:신용카드용
			// 한국정보인증　　　	d1:1등급(개인),  d2:1등급(법인), d3:일반인증서,  d4:은행/보험용,     d5:신용카드용
			// 한국전자인증　　　	e1:범용(개인),   e2:범용(법인),  e3:일반인증서,  e4:은행/보험용,     e5:신용카드용
			// 한국전산원　　　　	f1:기관,         f2:법인,        f3:개인,       f4:일반인증서
			//====================================================================================================
			// 정책 설정 - 인증서 OID 필터링 값 설정 (개인/법인인증서)
			//CrossWebExWeb6.SetProperty("certmanui_oid", "a1|a2|a4|a5|b1|b2|b4|c1|c2|d1|d2|d4|e1|e2|e4|f2|f3|p1");
			//====================================================================================================
			// GPKI 사용하는 업무에서 정책설정
			//====================================================================================================
			//	// 정책 설정 - 인증서 OID 필터링 값 설정 (개인/법인인증서)
			//	CrossWebExWeb6.SetProperty("certmanui_oid", "a1|a2|a4|a5|b1|b2|b4|c1|c2|d1|d2|d4|e1|e2|e4|f2|f3|f4|p1");
			//====================================================================================================
			// 정책 설정 - 1024 bit 인증서 보안경고창 출력여부
			CrossWebExWeb6.SetProperty("OldCertNotSafeMsg", "1");
			// 정책 설정 - 보이스피싱 경고문구 표시
			CrossWebExWeb6.SetProperty("certmanui_showalertbanner", "yes");
			// 정책 설정 - 보이스피싱 경고문구 URL
			CrossWebExWeb6.SetProperty("certmanui_alertbannerurl", TrustBannerURL);
			// 정책 설정 - 서버 인증서 로드
			CrossWebExWeb6.LoadCert(SCert, "cwInitLoadCertCallback");

		// 초기화 실패
		} else {
			// [설치 안됨] 으로 설정
			cwInitStatus = CW_STATUS_NOT_INSTALLED;
		}

	} catch (e) {
		exlog("cwClientInit6Callback [exception] pageCallback load error", e);
		exalert("cwClientInit6Callback", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001); // "콜백 함수 동작 중 오류가 발생하였습니다."
	}
	exlog("cwInstallModuleCallback", "end");
}

/************************************************************
 * @brief		정책 설정 및 서버 인증서 로드 콜백 함수
 * @param[in]	result			정책 설정 및 서버 인증서 로드 결과
 ************************************************************/
function cwInitLoadCertCallback(result) {
	exlog("cwInitLoadCertCallback", "start");
	try {
		// 초기화 성공
		if (result && "TRUE" == result) {

			// 암호화 블록이 있는 경우
			if (CrossWebExWeb6.getSpanEncElement()) {
				// 암호화 블록 복호화 수행
				CrossWebExWeb6.IdecryptBlock();

			// 암호화 블록이 없는 경우
			} else {
				// [초기화 됨] 으로 설정
				cwInitStatus = CW_STATUS_INITIALIZED;
			}

		// 초기화 실패
		} else {
			// [초기화 안됨] 으로 설정
			cwInitStatus = CW_STATUS_NOT_INITIALIZED;
		}
	} catch (e) {
		exlog("cwInitLoadCertCallback [exception] pageCallback load error", e);
		exalert("cwInitLoadCertCallback", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001); // "콜백 함수 동작 중 오류가 발생하였습니다."
	}
	exlog("cwInitLoadCertCallback", "end");
}

/************************************************************
 * @brief		블록 복호화 콜백 함수
 * @param[in]	result			블록 복호화 결과
 ************************************************************/
function cwInitDecryptBlockCallback(result) {
	exlog("cwInitDecryptBlockCallback", "start");
	try {
		// 초기화 성공
		if (result && "TRUE" == result) {
			// [초기화 됨] 으로 설정
			cwInitStatus = CW_STATUS_INITIALIZED;

		// 초기화 실패
		} else {
			// [초기화 안됨] 으로 설정
			cwInitStatus = CW_STATUS_NOT_INITIALIZED;
		}
	} catch (e) {
		exlog("cwInitDecryptBlockCallback [exception] pageCallback load error", e);
		exalert("cwInitDecryptBlockCallback", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_001); // "콜백 함수 동작 중 오류가 발생하였습니다."
	}
	exlog("cwInitDecryptBlockCallback", "end");
}

/************************************************************
 * @brief		초기화 수행
 ************************************************************/
setTimeout(cwInit, 100);
