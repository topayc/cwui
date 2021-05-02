﻿var debugLog = false;
// 신한은행 모듈배포시 주석 제거
/*
var GINI_DYNAMIC_LOAD = (function(){
	var completed = false;

	var INI_CSSLoad = (function(){

		var loadCSS = function(){
			// 가상키패드 CSS
			cssloader(INI_html5BasePath + "/initech/unikey/keypad/uniwebkey/css/uniwebkey_w2ui.css", loadMCertificate, "utf-8");
		};

		var loadCSSJqueryui = function(){
			cssloader(INI_html5BasePath + "/res/style/jqueryui/jquery-ui.css", loadCSS0, "utf-8");
		};
		var loadCSS0 = function(){
			cssloader(INI_html5BasePath + "/res/style/jqueryui/jquery-ui.theme.css", loadCSS1, "utf-8");
		};
		var loadCSS1 = function(){
			cssloader(INI_html5BasePath + "/res/style/initechBlueCommon.css", loadInitechBlueCommon, "utf-8");
		};
		var loadInitechBlueCommon = function(){cssloader(INI_html5BasePath + "/res/style/initechBlueCommon.css", loadMCertificate, "utf-8");};
		var loadMCertificate = function(){
			if(INI_getPlatformInfo().Mobile){
				if(INI_getPlatformInfo().iOS){
					cssloader(INI_html5BasePath + "/res/style/mobile/m_certificate_ios.css", loadMColorBlue, "utf-8");
				} else {
					cssloader(INI_html5BasePath + "/res/style/mobile/m_certificate.css", loadMColorBlue, "utf-8");
				}
			} else {
					loadMColorBlue();
			}

		};
		var loadMColorBlue = function(){cssloader(INI_html5BasePath + "/res/style/mobile/m_color_blue.css", undefined, "utf-8");};


//		var loadCSS2 = function(){
//			cssloader(INI_html5BasePath + "/res/style/certificate.css", loadCSS3, "utf-8");
//		};
//		var loadCSS3 = function(){
//			cssloader(INI_html5BasePath + "/res/style/color_identity_blue.css", loadCSS4, "utf-8");
//		};
//		var loadCSS4 = function(){
//			cssloader(INI_html5BasePath + "/res/style/mCustomScrollbar.css", undefined, "utf-8");
//		};
		return {
			loadCSS : loadCSS
		}
	})();

	var INI_ScriptLoad = (function(){

		var loadScript = function(){
			uniwebkeySpLoad();
		};
		var uniwebkeySpLoad = function(){
			jsloader(INI_html5BasePath + "/initech/unikey/keypad/uniwebkey/js/uniwebkey_sp_20161214.min.js", uniwebkeyDebugLoad);
		}
		var uniwebkeyDebugLoad = function(){
			jsloader(INI_html5BasePath + "/initech/unikey/keypad/uniwebkey/js/uniwebkey_can_debug_20160812.min.js", iniGlobal);
		}
		var iniGlobal = function(){
			jsloader(INI_html5BasePath + "/res/script/main/initechGlobal.js", html5MainJS);
		}
		var html5MainJS = function(){
			jsloader(INI_html5BasePath + "/res/script/common/require.js",
					thirdPartyProductInit,
					"utf-8",
					[{"key":"data-main", "value": INI_html5BasePath + "/cw/initechMain=v1.0.0"}]
			);
		}
		var thirdPartyProductInit = function(){
			jsloader(INI_html5BasePath + "/res/script/thirdParty/3rd_interface.js");
		};

		return {
			loadScript : loadScript
		}
	})();

	var moduleLoad = function(){
		INI_CSSLoad.loadCSS();
//		INI_ScriptLoad.loadScript();
	};

	var changeCompleted = function(){
		completed = true;
	};

	var isCompleted = function(){
		return completed;
	}

	return {
		moduleLoad : moduleLoad,
		changeCompleted : changeCompleted,
		isCompleted : isCompleted
	}
})();

GINI_DYNAMIC_LOAD.moduleLoad();
*/

var Html5Adaptor = (function(){
	var eventWatchDog;
	var countWatchDog = 0;
	var eventCheck = false;
	var initializeEventCheck = function(){
		countWatchDog = 0;
		eventCheck = false;
	};

	var monitoringEvent = function(){

		function initEvent(){
			countWatchDog++;
			if(countWatchDog==10){
				initializeEventCheck();
				clearInterval(eventWatchDog);
			}
//			console.log('[WatchDog]event initialize : ' + countWatchDog);
		};

		if(eventCheck){
			eventWatchDog = setInterval(initEvent, 100);
		}
	};

	function performExcute(excuteFunc){
		if(!eventCheck){
			eventCheck = true;
			// 일정 시간 이 후 초기화를 시킨다.
			setTimeout(monitoringEvent, 1000);

			if(GINI_DYNAMIC_LOAD.isCompleted()){
				excuteFunc();
			}else{
				var intervalId;
				var cnt = 0;
				var step = function() {
					// step key-generation, run algorithm for 100 ms, repeat
					if(!GINI_DYNAMIC_LOAD.isCompleted()) {
						if(cnt == 100){
							if(intervalId){
								clearInterval(intervalId);
								excuteFunc();
							}
//							console.log("--- script loading : time out");
						}
//						console.log("-- script loading : " + cnt);
				    } else {
				    	if(intervalId){
				    		clearInterval(intervalId);
				    	}
//				    	console.log("--- load success : " + GINI_DYNAMIC_LOAD.isCompleted());
				    	excuteFunc();
				    }
					cnt += 1;
				};
				intervalId = setInterval(step, 100);
			}
		}
	};

	var web6Adaptor = (function () {
		var params = {};
		var adCallback;
		var executorPolicy;

		function perfomCertPolicy(policyName){
			executorPolicy(policyName);
		}

		var setParam = function(key, value){
			params[key] = value;
		};

		var getParam = function(key){
			return params[key];
		};

		var setCallback = function(callback){
			adCallback = callback;
		};

		var getCallback = function(){
			return adCallback;
		};

		var setExecutorPolicy = function(executor){
			executorPolicy = executor;
		};

		var clear = function(){
			params = {};
			adCallback = undefined;
			executorPolicy = undefined;
		};
		return {
			clear : clear,
			setParam : setParam,
			getParam : getParam,
			setCallback : setCallback,
			getCallback : getCallback,
			setExecutorPolicy : setExecutorPolicy,
			perfomCertPolicy : perfomCertPolicy
		};
	}());

	var TemporaryInfo = (function () {
		var preserve = {};

		var clear = function(){
			preserve = {};
		};

		var setPreserve = function(key, val){
			preserve[key] = val;
		};

		var getPreserve = function(key){
			return preserve[key];
		};

		return {
			clear : clear,
			setPreserve : setPreserve,
			getPreserve : getPreserve
		};
	}());


	/************************************************************
	 * @brief
	 * @param[in]	data
	 * @param[in]	callback
	 * @param[in]	postdata
	 ************************************************************/
	var PKCS7SignedData = function(data, callback, postdata) {

//		signInfo.type = "value";
//		signInfo.data = data;
//		if (callback) {
//			signInfo.callback = callback;
//		} else {
//			exalert("PKCS7SignedData", "callback function not defined");
//			return;
//		}
//		if (postdata) {
//			signInfo.postdata = postdata;
//		} else {
//			signInfo.postdata = "";
//		}
//
//		crosswebInterface.PKCS7SignData(hashalg, data, turl, false, "CrossWebExWeb6.post_PKCS7SignedData", true);
	};


	/************************************************************
	 * @brief
	 * @param[in]	form
	 * @param[in]	callback
	 * @param[in]	postdata
	 ************************************************************/
	var EncFormVerify = function(form, callback, postdata) {

//		cwui.inipluginAdt.encInfo.vf = 11;//VerifyFlag;
//		encInfo.type = "form1";
//		encInfo.form = form;
//		encInfo.postdata = postdata;
//		if (callback) {
//			encInfo.callback = callback;
//		} else {
//			alert("EncFormVerify : callback function not defined");
//			return;
//		}
//		var elementStr = GatherValue(form, 0, true);
//		crosswebInterface.MakeINIpluginData(encInfo.vf, cipher, elementStr, rurl, "CrossWebExWeb6.post_MakeINIpluginData");
	};

	/************************************************************
	 * @brief
	 * @param[in]	readForm
	 * @param[in]	sendForm
	 * @param[in]	callback
	 * @param[in]	postdata
	 ************************************************************/
	var EncFormVerify2 = function (readForm, sendForm, callback, postData) {
		var excuteForm = function(){
			web6Adaptor.clear();

			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}

			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 EncFormVerify2 Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
					eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
				}else{
						cwui.inipluginAdt.makeIniPluginData(
				    			RandomURL, 							//고정
				    			cwui.inipluginAdt.encInfo.plantext,		//원문								// 원문
				    			cwui.inipluginAdt.encInfo.vf,			// 버전
				    			vidAttr.VID_CERTIFICATE, 			// 인증서
				    			vidAttr.SIGNATURE, 					// 원문에 대한 PKCS1
				    			vidAttr.VID_RANDOM,					// VID Random
				    			"post_MakeINIpluginData"
				    	);
				}
				eventCheck = false;
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6 EncFormVerify2 Sign policy : " + policy);

						cwui.inipluginAdt.encInfo.vf = 11;//VerifyFlag;
						cwui.inipluginAdt.encInfo.type = "form2";
						cwui.inipluginAdt.encInfo.readForm = readForm;
						cwui.inipluginAdt.encInfo.sendForm = sendForm;
						cwui.inipluginAdt.encInfo.postdata = postData;
						cwui.inipluginAdt.encInfo.callback = callback;

					    var elementStr = cwui.inipluginAdt.GatherValue(readForm, 0, false);

					    cwui.inipluginAdt.encInfo.plantext = elementStr;

						var selected = cwui.Certs.getSelectedCertInfo();
						// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
						// barosign으로 전자서명을 진행한다.
						if(selected && selected.deviceId === 'BAROSIGN'){
							try{
								cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, elementStr);
							}catch(e){
								INI_HANDLE.handleMessage(e);
							}
						} else {
							var option = {};
							option["SIGN_KIND"] = "PKCS1";
							option["SIGN_PADDING"] = "PKCS1_15";
							// 금결원 포맷 함수는 EUC-KR로 서명 해야 함.
							option["CONTENT_ENCODE"] = {
									"ORIGIRAL_CHAR_SET" : "UTF-8",
									"ORIGIRAL_URL_ENCODE" : false,
									"SIGN_URL_ENCODE" : false,
									"SIGN_CHAR_SET" : "UTF-8"
									};

							option["PROPERTY_LIST"] =
								[
									{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
									{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
									{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

									{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
									{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
									{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
									{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

									{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
									{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
									{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
								 ];

							var behavior =  "SIGN";

							if(readForm.PKCS7SignedData){
								cwui.IniSafeNeo.openCachedLogin(web6Mapping, elementStr, option);
							}
							else{
								cwui.IniSafeNeo.openMainLoginForm(web6Mapping, elementStr, option);
							}


						}
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("EncFormVerify2");
		};

		performExcute(excuteForm);
	};


	var NoCertVerify2 = function( readForm, sendForm, callback, postData ){

		var excuteForm = function(){
		    	cwui.inipluginAdt.encInfo.vf = 11;//VerifyFlag;
		    	cwui.inipluginAdt.encInfo.type = "form2";
		    	cwui.inipluginAdt.encInfo.readForm = readForm;
		    	cwui.inipluginAdt.encInfo.sendForm = sendForm;
		    	cwui.inipluginAdt.encInfo.postdata = postData;

			    if(callback) {
			    	cwui.inipluginAdt.encInfo.callback = callback;
			    } else {
			    	cwalert("NoCertVerify2", "callback function not defined");
					return;
			    }

			    var elementStr = cwui.inipluginAdt.GatherValue(readForm, 0, false);

		    	cwui.inipluginAdt.makeIniPluginData(
		    			rurl,
		    			elementStr,										// 원문
		    			cwui.inipluginAdt.encInfo.vf, 									// 버전
		    			TemporaryInfo.getPreserve("VID_CERTIFICATE"), 	// 인증서
		    			TemporaryInfo.getPreserve("PKCS1SIGNATURE"), 	// 원문에 대한 PKCS1
		    			TemporaryInfo.getPreserve("VID_RANDOM"),		// VID Random
		    			"post_MakeINIpluginData"
		    	);
		    	eventCheck = false;
		};

	    performExcute(excuteForm);
	};

	var EncForm2 = function(readForm, sendForm, callback, postData){
		var excuteForm = function(){
				cwui.inipluginAdt.encInfo.vf = EncFlag;
				cwui.inipluginAdt.encInfo.type = "form2";
				cwui.inipluginAdt.encInfo.readForm = readForm;
				cwui.inipluginAdt.encInfo.sendForm = sendForm;
				cwui.inipluginAdt.encInfo.postdata = postData;
				if(callback) {
					cwui.inipluginAdt.encInfo.callback = callback;
				} else {
					cwalert("EncForm2", "callback function not defined");
					return;
				}

				var elementStr = cwui.inipluginAdt.GatherValue(readForm, 0, false);




	    		cwui.inipluginAdt.makeIniPluginData(
		    			rurl,
		    			elementStr,
		    			CrossWebExWeb6.encInfo.vf,
		    			"",//TemporaryInfo.getPreserve("VID_CERTIFICATE"),
		    			"",//TemporaryInfo.getPreserve("PKCS1SIGNATURE"),
		    			"",//TemporaryInfo.getPreserve("VID_RANDOM"),
		    			"CrossWebExWeb6.post_MakeINIpluginData"
		    	);
	    		eventCheck = false;
		};

		performExcute(excuteForm);
	};

	function removePkcs7Tag(pkcs7){
		pkcs7 = pkcs7.replace("-----BEGIN PKCS7-----", "");
		pkcs7 = pkcs7.replace("-----END PKCS7-----", "");
		pkcs7 = pkcs7.replace("\n", "");

		return pkcs7.trim();
	}

	/**
	 * data : 원문
	 * postdata : 업무에 넘기는 데이터
	 */
	var PKCS7SignVIDFormLogin = function(form, orgData, callback, postData, isCmp){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			if(form){
				web6Adaptor.setParam("FORM", form);
			}

			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				//[참고]기존 callback소스 : RunCertPolicyResult(URL, postData, result)
				if(debugLog) console.log("-Web6 Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{

					//TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);
					TemporaryInfo.setPreserve("VID_CERTIFICATE", vidAttr.VID_CERTIFICATE);
					TemporaryInfo.setPreserve("VID_RANDOM", vidAttr.VID_RANDOM);

	//				var readForm = web6Adaptor.getParam("FORM");
	//				if(readForm){
	//					readForm.PKCS7SignedData.value = removePkcs7Tag(vidAttr.SIGNATURE);
	//				}

					result = true;
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					function dataSignatureCallback(vidAttr){
						//Step01. PKCS7 필트 저장
						var readForm = web6Adaptor.getParam("FORM");
						if(readForm){
							readForm.PKCS7SignedData.value = removePkcs7Tag(vidAttr.SIGNATURE);
						}

						// Step02. form input data 전체를 서명 하기 위해 리턴
						return CrossWebExWeb6.GatherValue(readForm, 0, false);
					};

					if(debugLog) console.log("#WEB6 policy : " + policy);

						var option = {};
						option["SIGN_KIND"] = "PKCS7";
						option["IN_VID"] = "TRUE";
						option["PKCS7DATA_TO_PKCS1"] = dataSignatureCallback;
						option["PROPERTY_LIST"] =
							[
								{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
								{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
								{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
								{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
								{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
								{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://www./popup/pop_install.html$width^300$height^400"},
								{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
								{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

								{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
								{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
								{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
								{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

								{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
								{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
								{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
	    					];

						var behavior =  "LOGIN";
						if(isCmp){
							behavior = "CMP";
						}

						cwui.IniSafeNeo.openMainLoginForm(web6Mapping, orgData, option, behavior);
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_LOGIN");
		};
		performExcute(excuteForm);
	};

	var PKCS7SignedLogin = function (data, callback, postData, isCmp){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요

			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{

					TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);
					TemporaryInfo.setPreserve("VID_CERTIFICATE", vidAttr.VID_CERTIFICATE);
					TemporaryInfo.setPreserve("VID_RANDOM", vidAttr.VID_RANDOM);

					result = removePkcs7Tag(vidAttr.SIGNATURE);;
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6 policy : " + policy);

						var selected = cwui.Certs.getSelectedCertInfo();
						// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
						// barosign으로 전자서명을 진행한다.
						if(selected && selected.deviceId === 'BAROSIGN'){
							try{
								cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
							}catch(e){
								INI_HANDLE.handleMessage(e);
							}
						} else {
							var option = {};
							option["SIGN_KIND"] = "PKCS7";
							option["IN_VID"] = "TRUE";
							option["PROPERTY_LIST"] =
								[
									{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
									{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
									{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

									{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
									{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
									{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
									{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

									{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
									{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
									{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
								 ];

							var behavior =  "LOGIN";
							if(isCmp){
								behavior = "CMP";
							}

							cwui.IniSafeNeo.openMainLoginForm(web6Mapping, data, option, behavior);
						}
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};

	// 금결원 포맷
	var PKCS7YesSignData = function (signData, callback, postData){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요

			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 YesSign Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{
					TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					//TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);

					result = removePkcs7Tag(vidAttr.SIGNATURE);;
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6 YesSign Sign policy : " + policy);

						var selected = cwui.Certs.getSelectedCertInfo();
						// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
						// barosign으로 전자서명을 진행한다.
						if(selected && selected.deviceId === 'BAROSIGN'){
							try{
								cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
							}catch(e){
								INI_HANDLE.handleMessage(e);
							}
						} else {
							var option = {};
							option["SIGN_KIND"] = "PKCS7";
							option["YESSIGN_TYPE"] = "TRUE";
							option["SIGN_CHAR_SET"] = "TRUE";

							// 금결원 포맷 함수는 EUC-KR로 서명 해야 함.
							option["CONTENT_ENCODE"] = {
									"ORIGIRAL_CHAR_SET" : "UTF-8",
									"ORIGIRAL_URL_ENCODE" : false,
									"SIGN_URL_ENCODE" : false,
									"SIGN_CHAR_SET" : "EUC-KR",
									};

							option["PROPERTY_LIST"] =
								[
									{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
									{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
									{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

									{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
									{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
									{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
									{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

									{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
									{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
									{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
								 ];

							var behavior =  "SIGN";

							cwui.IniSafeNeo.openMainSignForm(web6Mapping, signData, option);
						}
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};
	
	// 금결원 포맷
	var PKCS7YesSignDataMulti = function (form, signData, callback, postData){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요

			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 YesSign Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{
					TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					//TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);

					var allSignature = vidAttr.SIGNATURE;
					console.log("web6Mapping, allSignature : " + allSignature);
					var arrSignature = allSignature.split(cwui.defaultConf.Signature.MultiDelimiter);

					for ( var i=0; i<arrSignature.length; i++ ) {
						var fieldName = "PKCS7SignedData";

						if ( arrSignature.length-1 != i ) {
							fieldName += i;
						}
						form.elements[fieldName].value = removePkcs7Tag(arrSignature[i]);
					}
					result = true;
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6 YesSign Sign policy : " + policy);

						var selected = cwui.Certs.getSelectedCertInfo();
						// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
						// barosign으로 전자서명을 진행한다.
						if(selected && selected.deviceId === 'BAROSIGN'){
							try{
								cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
							}catch(e){
								INI_HANDLE.handleMessage(e);
							}
						} else {
							var option = {};
							option["SIGN_KIND"] = "PKCS7";
							option["YESSIGN_TYPE"] = "TRUE";
							option["SIGN_CHAR_SET"] = "TRUE";

							// 금결원 포맷 함수는 EUC-KR로 서명 해야 함.
							option["CONTENT_ENCODE"] = {
									"ORIGIRAL_CHAR_SET" : "UTF-8",
									"ORIGIRAL_URL_ENCODE" : false,
									"SIGN_URL_ENCODE" : false,
									"SIGN_CHAR_SET" : "EUC-KR",
									};

							option["PROPERTY_LIST"] =
								[
									{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
									{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
									{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

									{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
									{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
									{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
									{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

									{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
									{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
									{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
								 ];

							var behavior =  "SIGN";

							cwui.IniSafeNeo.openMainSignForm(web6Mapping, signData, option);
						}
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};

	// PDF 원본없는 전자서명
	var PKCS7PDFSignData = function (signData, callback, postData){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요

			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 YesSign Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{

					TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					//TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);

					result = removePkcs7Tag(vidAttr.SIGNATURE);;
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
					function (policy){
						if(debugLog) console.log("#WEB6 YesSign Sign policy : " + policy);

							var selected = cwui.Certs.getSelectedCertInfo();
							// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
							// barosign으로 전자서명을 진행한다.
							if(selected && selected.deviceId === 'BAROSIGN'){
								try{
									cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
								}catch(e){
									INI_HANDLE.handleMessage(e);
								}
							} else {

								var option = {};
								option["SIGN_KIND"] = "PKCS7";		//서명종류
								option["REMOVE_CONTENT"] = "TRUE";	//원문제거
								option["CONTENT_HASH"] = "FALSE";	//원문 해쉬 여부
								option["SIGN_CHAR_SET"] = "TRUE";
								option["PDF_SIGN_TYPE"] = "TRUE";

								option["CONTENT_ENCODE"] = {
										"ORIGIRAL_CHAR_SET" : "UTF-8",
										"ORIGIRAL_URL_ENCODE" : false,
										"SIGN_URL_ENCODE" : false,
										"SIGN_CHAR_SET" : "EUC-KR",
										};

								option["PROPERTY_LIST"] =
									[
									 {"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
	                                 {"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
										{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
										{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
	                                 {"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
										{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
										{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
	                                 {"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

	                                 {"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
	                                 {"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
	                                 {"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
	                                 {"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

	                                 {"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
	                                 {"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
	                                 {"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
									 ];

								var behavior =  "SIGN";

								cwui.IniSafeNeo.openMainSignForm(web6Mapping, signData, option);
							}
					}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};

	var PKCS7SignedDataForm = function (form, signData, callback, postData, isInnerView){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			if(form){
				web6Adaptor.setParam("FORM", form);
			}

			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				//[참고]기존 callback소스 : RunCertPolicyResult(URL, postData, result)
				if(debugLog) console.log("-Web6 Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{

					TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);
					TemporaryInfo.setPreserve("VID_CERTIFICATE", vidAttr.VID_CERTIFICATE);
					TemporaryInfo.setPreserve("VID_RANDOM", vidAttr.VID_RANDOM);

					var readForm = web6Adaptor.getParam("FORM");
					if(readForm){
						readForm.PKCS7SignedData.value = removePkcs7Tag(vidAttr.SIGNATURE);
					}

					//result = true;
					result = removePkcs7Tag(vidAttr.SIGNATURE)
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					function dataSignatureCallback(vidAttr){
						//Step01. PKCS7 필트 저장
						var readForm = web6Adaptor.getParam("FORM");
						if(readForm){
							readForm.PKCS7SignedData.value = removePkcs7Tag(vidAttr.SIGNATURE);
						}

						// Step02. form input data 전체를 서명 하기 위해 리턴
						return CrossWebExWeb6.GatherValue(readForm, 0, false);
					};

					if(debugLog) console.log("#WEB6 policy : " + policy);

						var selected = cwui.Certs.getSelectedCertInfo();
						// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
						// barosign으로 전자서명을 진행한다.
						if(selected && selected.deviceId === 'BAROSIGN'){
							try{
								cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
							}catch(e){
								INI_HANDLE.handleMessage(e);
							}
						} else {
							var option = {};
							option["SIGN_KIND"] = "PKCS7";
							option["IN_VID"] = "TRUE";
							// 전자서명 데이터에 대한 PKCS1서명이 필요 함.
							//option["PKCS7DATA_TO_PKCS1"] = dataSignatureCallback;
							option["PROPERTY_LIST"] =
								[
									{"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
									{"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
									{"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

									{"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
									{"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
									{"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
									{"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

									{"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
									{"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
									{"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
								 ];

							if(isInnerView){
								cwui.IniSafeNeo.openInnerSignForm(web6Mapping, signData, option);
							} else{
								cwui.IniSafeNeo.openMainSignForm(web6Mapping, signData, option);
							}
						}
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};

	var PKCS7SignedDataSign = function (signData, callback, postData, isInnerView){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{
					//TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);
					TemporaryInfo.setPreserve("VID_CERTIFICATE", vidAttr.VID_CERTIFICATE);
					TemporaryInfo.setPreserve("VID_RANDOM", vidAttr.VID_RANDOM);

					result = removePkcs7Tag(vidAttr.SIGNATURE);
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
					function (policy){
						if(debugLog) console.log("#WEB6 policy : " + policy);

							var selected = cwui.Certs.getSelectedCertInfo();
							// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
							// barosign으로 전자서명을 진행한다.
							if(selected && selected.deviceId === 'BAROSIGN'){
								try{
									cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
								}catch(e){
									INI_HANDLE.handleMessage(e);
								}
							} else {
								var option = {};
								option["SIGN_KIND"] = "PKCS7";
								option["IN_VID"] = "TRUE";
	//							option["PKCS7DATA_TO_PKCS1"] = dataSignatureCallback;
								option["PROPERTY_LIST"] =
									[
									 {"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
	                                 {"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
	                                 {"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
	                                 {"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

	                                 {"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
	                                 {"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
	                                 {"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
	                                 {"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

	                                 {"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
	                                 {"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
	                                 {"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
									 ];

								if(isInnerView){
									cwui.IniSafeNeo.openInnerSignForm(web6Mapping, signData, option);
								} else{
									cwui.IniSafeNeo.openMainSignForm(web6Mapping, signData, option);
								}
							}
					}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};

	var PKCS7SignedDataSignMulti = function (form, signData, callback, postData, isInnerView){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			if(postData){
				web6Adaptor.setParam("POST_DATA", postData);
			}
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, vidAttr){
				if(debugLog) console.log("-Web6 Sign Result");
				if(debugLog) console.log(result);

				if(!result){
					result = false;
				}else{
					//TemporaryInfo.setPreserve("PKCS7", removePkcs7Tag(vidAttr.SIGNATURE));
					TemporaryInfo.setPreserve("PKCS1SIGNATURE", vidAttr.PKCS7DATA_FROM_PKCS1);
					TemporaryInfo.setPreserve("VID_CERTIFICATE", vidAttr.VID_CERTIFICATE);
					TemporaryInfo.setPreserve("VID_RANDOM", vidAttr.VID_RANDOM);

					var allSignature = vidAttr.SIGNATURE;
					var arrSignature = allSignature.split(cwui.defaultConf.Signature.MultiDelimiter);

					for ( var i=0; i<arrSignature.length; i++ ) {
						var fieldName = "PKCS7SignedData";

						if ( arrSignature.length-1 != i ) {
							fieldName += i;
						}
						form.elements[fieldName].value = removePkcs7Tag(arrSignature[i]);
					}
					result = true;
					//result = removePkcs7Tag(vidAttr.SIGNATURE);
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, web6Adaptor.getParam("POST_DATA"), true);
			};

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
					function (policy){
						if(debugLog) console.log("#WEB6 policy : " + policy);

							var selected = cwui.Certs.getSelectedCertInfo();
							// 로그인을 barosign으로 한 경우 html5창 및 qr없이 push를 이용하여
							// barosign으로 전자서명을 진행한다.
							if(selected && selected.deviceId === 'BAROSIGN'){
								try{
									cwui.StorageManage.getBaroSignPolicy(cwui.constants.WebForm.ACTION_SIGN, signData);
								}catch(e){
									INI_HANDLE.handleMessage(e);
								}
							} else {
								var option = {};
								option["SIGN_KIND"] = "PKCS7";
								option["IN_VID"] = "TRUE";
	//							option["PKCS7DATA_TO_PKCS1"] = dataSignatureCallback;
								option["PROPERTY_LIST"] =
									[
									 {"PROPERTY_KEY":"UseCertMode", "PROPERTY_VALUE":"1"},
	                                 {"PROPERTY_KEY":"USIMServiceCertViewToPhone", "PROPERTY_VALUE":"1"},
									{"PROPERTY_KEY":"USIMServiceDriverList", "PROPERTY_VALUE":"USIM_0002|USIM_0001"},
									{"PROPERTY_KEY":"USIMServiceDownloadURL", "PROPERTY_VALUE":"driver^USIM_0002$url^http://download.smartcert.kr$width^520$height^650|driver^USIM_0001$url^http://www.usimcert.com/popup/pop_install.html$width^530$height^430"},
	                                 {"PROPERTY_KEY":"USIMServiceSiteCode", "PROPERTY_VALUE":"307020002"},
									{"PROPERTY_KEY":"USIMServiceUnsupportedMsgURL", "PROPERTY_VALUE":"url^http://popup/pop_install.html$width^300$height^400"},
									{"PROPERTY_KEY":"USIMServiceServerInfo", "PROPERTY_VALUE":"driver^USIM_0002$addr^service.smartcert.kr$port^443"},
	                                 {"PROPERTY_KEY":"USIMSiteDomainURL", "PROPERTY_VALUE":"www.shinhan.com"},

	                                 {"PROPERTY_KEY":"certmanui_mobiVer", "PROPERTY_VALUE":"5.0.2.14"},
	                                 {"PROPERTY_KEY":"certmanui_mobiURL", "PROPERTY_VALUE":"http://www.mobisign.kr/mobisigndll.htm"},
	                                 {"PROPERTY_KEY":"certmanui_mobiClientCode", "PROPERTY_VALUE":"0100001"},
	                                 {"PROPERTY_KEY":"certmanui_mobiOIDFilter", "PROPERTY_VALUE":"2;yessignCA;1.2.410.200005.1.1.4;yessignCA;1.2.410.200005.1.1.2;"},

	                                 {"PROPERTY_KEY":"certmanui_phone", "PROPERTY_VALUE":"SHINHAN|" + window.location.protocol + "//" + window.location.host + "/sw/infovine/DownloadList&INITECH|KINGS_INFOVINE"},
	                                 {"PROPERTY_KEY":"certmanui_phoneURL", "PROPERTY_VALUE":window.location.protocol + "//" + window.location.host + "/sw/infovine/download.html"},
	                                 {"PROPERTY_KEY":"certmanui_phoneVer", "PROPERTY_VALUE":"1,4,0,7"},
									 ];

								if(isInnerView){
									cwui.IniSafeNeo.openInnerSignForm(web6Mapping, signData, option);
								} else{
									cwui.IniSafeNeo.openMainSignForm(web6Mapping, signData, option);
								}
							}
					}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_SIGN");
		};
		performExcute(excuteForm);
	};

	var CertManagerWithForm = function (taskNm){
		var excuteForm = function(){
				cwui.IniSafeNeo.openMainCertManageForm(taskNm);
			eventCheck = false;
		};
		performExcute(excuteForm);
	};

	var CertImportV12WithForm = function() {
		var excuteForm = function(){
				cwui.IniSafeNeo.openCertImportV12Form();
			eventCheck = false;
		};
		performExcute(excuteForm);
	};

	var CertExportV12WithForm = function() {
		var excuteForm = function(){
				cwui.IniSafeNeo.openCertExportV12Form();
			eventCheck = false;
		};
		performExcute(excuteForm);
	};

	var CertImportV11WithForm = function() {
		var excuteForm = function(){
				cwui.IniSafeNeo.openCertImportV11Form();
			eventCheck = false;
		};
		performExcute(excuteForm);
	};

	var CertExportV11WithForm = function() {
		var excuteForm = function(){
				cwui.IniSafeNeo.openCertExportV11Form();
			eventCheck = false;
		};
		performExcute(excuteForm);
	};

	function IssueCertificate(caName, szRef, szCode, callback){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, param){
				if(debugLog) console.log("-WEB6_ISSUE Result");
				if(debugLog) console.log(result);
				//[참고] 기존 callback소스 : CertProcessResult(URL, postData, result)
				if(result || (result.STATE && result.STATE == "SUCCEEDED")){
					result = "true";
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, true);
			}

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6_ISSUE policy : " + policy);
					/*var caIp;
					var caPort;
					if(caName == YessignPackage) {
						caIp = YessignCAIP;
						caPort = YessignCMPPort;
					} else if (caName == CrossCertPackage) {
						caIp = CrossCertCAIP;
						caPort = CrossCertCMPPort;
					} else if (caName == SignKoreaPackage) {
						caIp = SignKoreaCAIP;
						caPort = SignKoreaCMPPort;
					} else if (caName == SignGatePackage) {
						caIp = SignGateCAIP;
						caPort = SignGateCMPPort;
					} else {
						if(INI_ALERT){
							INI_ALERT("정의되지 않은 CA기관입니다.", "NOIT");
						}else{
							alert("정의되지 않은 CA기관입니다.");
						}

						if(callback) eval(callback)(false);
						return;
					}*/


						var issureInfo = {};
						issureInfo.CA_NAME = caName;
						issureInfo.REF_VALUE = szRef;
						issureInfo.AUTH_CODE = szCode;

						cwui.IniSafeNeo.openMainCertIssueForm(issureInfo, web6Mapping);
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_ISSUE");
		};
		performExcute(excuteForm);
	};

	function ReIssueCertificate(caName, szRef, szCode, callback){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, param){
				if(debugLog) console.log("-WEB6_REISSUE Result");
				if(debugLog) console.log(result);
				//[참고] 기존 callback소스 : CertProcessResult(URL, postData, result)
				if(result || (result.STATE && result.STATE == "SUCCEEDED")){
					result = "true";
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, true);
			}

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6_REISSUE policy : " + policy);
					/*var caIp;
					var caPort;
					if(caName == YessignPackage) {
						caIp = YessignCAIP;
						caPort = YessignCMPPort;
					} else if (caName == CrossCertPackage) {
						caIp = CrossCertCAIP;
						caPort = CrossCertCMPPort;
					} else if (caName == SignKoreaPackage) {
						caIp = SignKoreaCAIP;
						caPort = SignKoreaCMPPort;
					} else if (caName == SignGatePackage) {
						caIp = SignGateCAIP;
						caPort = SignGateCMPPort;
					} else {
						if(INI_ALERT){
							INI_ALERT("정의되지 않은 CA기관입니다.", "NOIT");
						}else{
							alert("정의되지 않은 CA기관입니다.");
						}

						if(callback) eval(callback)(false);
						return;
					}*/


						var issureInfo = {};
						issureInfo.CA_NAME = caName;
						issureInfo.REF_VALUE = szRef;
						issureInfo.AUTH_CODE = szCode;

						cwui.IniSafeNeo.openMainCertIssueForm(issureInfo, web6Mapping);
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_REISSUE");
		};
		performExcute(excuteForm);
	};



	function UpdateCertificate( caName, callback ){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, param){
				if(debugLog) console.log("-WEB6_RENEW Result");
				if(debugLog) console.log(result);
				//[참고] 기존 callback소스 : CertProcessResult(URL, postData, result)
				if(result || (result.STATE && result.STATE == "SUCCEEDED")){
					result = "true";
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, true);
			}

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6_RENEW policy : " + policy);
					/*var caIp;
					var caPort;
					if(caName == YessignPackage) {
						caIp = YessignCAIP;
						caPort = YessignCMPPort;
					} else if (caName == CrossCertPackage) {
						caIp = CrossCertCAIP;
						caPort = CrossCertCMPPort;
					} else if (caName == SignKoreaPackage) {
						caIp = SignKoreaCAIP;
						caPort = SignKoreaCMPPort;
					} else if (caName == SignGatePackage) {
						caIp = SignGateCAIP;
						caPort = SignGateCMPPort;
					} else {
						if(INI_ALERT){
							INI_ALERT("정의되지 않은 CA기관입니다.", "NOIT");
						}else{
							alert("정의되지 않은 CA기관입니다.");
						}

						if(callback) eval(callback)(false);
						return;
					}*/


					var caInfo = cwui.defaultConf.CAInfo.getCAInfo(caName);
					var reNewInfo = {};
					reNewInfo.CA_NAME = caName;
					reNewInfo.CA_IP = caInfo.IP;
					reNewInfo.CA_PORT = caInfo.PORT;
					cwui.IniSafeNeo.openMainCertUpdateForm(reNewInfo, web6Mapping);
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_RENEW");
		};
		performExcute(excuteForm);
	};


	function RevokeCertificate(caName, serial, callback){
		var excuteForm = function(){
			web6Adaptor.clear(); // 필요 한지 테스트 필요
			// Step01 : 파라메터 세팅
			web6Adaptor.setCallback(callback);

			// Step02 : Html5 결과에 대한 SFilter 맵핑 함수 정의
			function web6Mapping(result, param){
				if(debugLog) console.log("-WEB6_REVOKE Result");
				if(debugLog) console.log(result);
				//[참고] 기존 callback소스 : CertProcessResult(URL, postData, result)
				if(result || (result.STATE && result.STATE == "SUCCEEDED")){
					result = "true";
				}
				eventCheck = false;
				eval(web6Adaptor.getCallback())(result, true);
			}

			// Step03 : 정책에 의해 수행되는 함수 정의
			web6Adaptor.setExecutorPolicy(
				function (policy){
					if(debugLog) console.log("#WEB6_REVOKE policy : " + policy);

						var revokeInfo = {};
						revokeInfo.CA_NAME = caName;
						revokeInfo.CERT_SERIAL = serial;

						cwui.IniSafeNeo.openMainCertRevokeForm(revokeInfo, web6Mapping);
				}
			);

			// Step04 : URL 정책 세팅
			web6Adaptor.perfomCertPolicy("WEB6_REVOKE");
		};
		performExcute(excuteForm);

	};

	function InitCache(callback) {
		return cwui.Certs.initCertInfo(callback);
	};
	
	function Filter_IssuerDN(issuerDN, callback) {
		return cwui.Certs.setIssuerDNFilterInfo(issuerDN, callback);
	};
	
	function Filter_OIDAlias(OIDAlias, callback) {
		return cwui.Certs.setOIDAliasFilterInfo(OIDAlias, callback);
	};

	var isHtml5Service = function(){
		// 클라이언트 설치 여부에 따라 HTML5 사용 여부
		return false;
	};
	var isIstalledExteral = function(){
		// 클라이언트 설치 여부에 따라 HTML5 사용 여부
		return SFinitializeFlag;
	};

	/**
	 * E2E 제공 함수
	 */
	var getE2EProviderFunction = function(){
		var E2E;

		try{
			E2E = TK_GetEncInitech
		}catch(e){ }

		return E2E;
	};

	/**
	 * 가상키패드 제공 함수
	 */
	var getVirtualKeyPadProviderFunction = function(){
		return ;
	};

	return {
		PKCS7SignVIDFormLogin : PKCS7SignVIDFormLogin,
		PKCS7SignedDataForm : PKCS7SignedDataForm,
		PKCS7SignedDataSign : PKCS7SignedDataSign,
		PKCS7SignedDataSignMulti : PKCS7SignedDataSignMulti,
		PKCS7SignedLogin : PKCS7SignedLogin,
		PKCS7YesSignData : PKCS7YesSignData,
		PKCS7YesSignDataMulti : PKCS7YesSignDataMulti,
		PKCS7PDFSignData : PKCS7PDFSignData,
		NoCertVerify2 : NoCertVerify2,

		PKCS7SignedData : PKCS7SignedData,
		EncFormVerify : EncFormVerify,
		EncFormVerify2 : EncFormVerify2,

		EncForm2 : EncForm2,
		CertManagerWithForm : CertManagerWithForm,
		CertImportV12WithForm : CertImportV12WithForm,
		CertExportV12WithForm : CertExportV12WithForm,
		CertImportV11WithForm : CertImportV11WithForm,
		CertExportV11WithForm : CertExportV11WithForm,
		IssueCertificate : IssueCertificate,
		ReIssueCertificate : ReIssueCertificate,
		UpdateCertificate : UpdateCertificate,
		RevokeCertificate : RevokeCertificate,

		InitCache : InitCache,
		Filter_IssuerDN : Filter_IssuerDN,
		Filter_OIDAlias : Filter_OIDAlias,

		isHtml5Service : isHtml5Service,
		isIstalledExteral : isIstalledExteral,
		getE2EProviderFunction : getE2EProviderFunction,
		initializeEventCheck : initializeEventCheck
	};
}());
