/*
 * INITECH INISAFE CrossWeb EX v3.1.8
 * Date : 2017-09-20
*/

var IniSafeCrossWebEx = {};

/************************************************************
 * @brief		JS 로더
 * @retval		url				URL
 * @retval		callback		콜백 함수
 * @retval		charset			문자열 형식
 * @retval		attribute		속성
 ************************************************************/
function jsloader(url, callback, charset, attribute) {
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = "text/javascript";

	if (!charset) {
		script.charset = "utf-8";
	};

	script.src = url;

	if (attribute && (attribute.length > 0)) {
		for (var aint = 0; aint < attribute.length; aint++) {
			script.setAttribute(attribute[aint].key, attribute[aint].value);
		}
	}

	if(callback && typeof(callback)===typeof(Function))
	{
		//Modern browsers (IE9+)
		if(script.addEventListener)
		{
			script.addEventListener('load',callback,false);
		}
		else//(IE8-)
		{
			script.onreadystatechange=function()
			{
				if(script.readyState in {loaded:1,complete:1})
				{
					script.onreadystatechange=null;
					callback();
				}
			};
		}
	}

	head.appendChild(script);
};

/************************************************************
 * @brief		CSS 로더
 * @retval		url				URL
 * @retval		callback		콜백함수
 * @retval		charset			문자열 형식
 ************************************************************/
function cssloader(url, callback, charset) {
	var head = document.getElementsByTagName('head')[0];
	var css = document.createElement('link');
	css.rel = "stylesheet";
	css.type = "text/css";
	if (!charset) {
		css.charset = "utf-8";
	};
	css.href = url;
	head.appendChild(css);
	if (callback) {
		callback();
	}
};

/************************************************************
 * @brief		플랫폼 정보 취득
 * @retval		platformInfo	플랫폼 정보
 ************************************************************/
function INI_getPlatformInfo() {
	var platformInfo = {
		Windows: false, Linux: false, Ubuntu: false, Fedora: false, Mac: false, iOS: false, Android: false,
		Mobile: false, x64: false,
		type: "unknown", name: "unknown"
	};
	platformInfo.name = navigator.platform;
	if (navigator.appVersion.match("WOW64")) platformInfo.name = "WOW64";

	if (platformInfo.name.match(/Win32/i) || platformInfo.name.match(/WOW64/i)) {
		platformInfo.Windows = true;
		platformInfo.type = "Windows";
		if (navigator.appVersion.match(/Win64/i)) {
			platformInfo.name = "Win64";
			platformInfo.x64 = true;
			platformInfo.type = "Windows64";
		}
	} else if (platformInfo.name.match("Win64")) {
		platformInfo.Windows = true;
		platformInfo.x64 = true;
		platformInfo.type = "Windows64";
	} else if (platformInfo.name.match("Linux armv")) {
		platformInfo.Mobile = true;
		platformInfo.Android = true;
		platformInfo.type = "Android";
	} else if (platformInfo.name.match(/Linux/i)) {
		platformInfo.Linux = true;
		platformInfo.type = "Linux";
		if (platformInfo.name.match(/x86_64/i)) {
			platformInfo.x64 = true;
			platformInfo.type = "Linux64";
		} else if (navigator.userAgent.match(/x86_64/i)) { //Opera
			platformInfo.x64 = true;
			platformInfo.type = "Linux64";
		}
		if (navigator.userAgent.match(/Fedora/i)) {
			platformInfo.Fedora = true;
			platformInfo.type = "Fedora";
			if (platformInfo.x64) platformInfo.type = "Fedora64";
		} else if (navigator.userAgent.match(/Ubuntu/i)) {
			platformInfo.Ubuntu = true;
			platformInfo.type = "Ubuntu";
			if (platformInfo.x64) platformInfo.type = "Ubuntu64";
		} else if (navigator.userAgent.match(/Android/i)) { //modify 20150903: Samsung Galaxy Edge
			platformInfo.Linux = false;
			platformInfo.Mobile = true;
			platformInfo.Android = true;
			platformInfo.type = "Android";
		}
	} else if (platformInfo.name.match(/MacIntel/i)) {
		platformInfo.Mac = true;
		platformInfo.type = "Mac";
	} else if (platformInfo.name == "iPad"
		|| platformInfo.name == "iPhone"
		|| platformInfo.name == "iPod"
		|| platformInfo.name == "iOS") {
		platformInfo.Mobile = true;
		platformInfo.iOS = true;
		platformInfo.type = "iOS";
	}

	if ((navigator.userAgent.match(/iPhone/i)) ||
		(navigator.userAgent.match(/iPod/i)) ||
		(navigator.userAgent.match(/iPad/i)) ||
		(navigator.userAgent.match(/Android/i))) {
		platformInfo.Mobile = true;
	}
	if ((navigator.userAgent.match(/Windows Phone/i)) ||
		(navigator.userAgent.match(/Windows CE/i)) ||
		(navigator.userAgent.match(/Symbian/i)) ||
		(navigator.userAgent.match(/BlackBerry/i))) {
		platformInfo.Mobile = true;
	}

	//modify/remove system type
	if (navigator.userAgent.match("Android") && navigator.userAgent.match("Opera Mini")) {
		platformInfo.Mobile = true;
		platformInfo.Android = true;
		platformInfo.type = "Android";
	}
	return platformInfo;
}

/************************************************************
 * @brief		HTML5 지원 여부
 * @retval		true			HTML5 지원
 * @retval		false			HTML5 지원 안함
 ************************************************************/
var GINI_supportHtml5 = function () {

	var agentInfo = navigator.userAgent.toLowerCase();

	if ((navigator.appName == 'Microsoft Internet Explorer') || (agentInfo.indexOf("msie") != -1)) {

		// IE 6
		if (agentInfo.indexOf("msie 6") != -1) {
			// HTML5 지원 안함
			return false;
		// IE 7
		} else if (agentInfo.indexOf("msie 7") != -1) {
			// HTML5 지원 안함
			return false;
		// IE 8
		} else if (agentInfo.indexOf("msie 8") != -1) {
			// HTML5 지원 안함
			return false;
		// IE 9
		} else if (agentInfo.indexOf("msie 9") != -1) {
			// HTML5 지원 안함
			return true;
		}
	}

	return true;
}

/************************************************************
 * @brief		구간 암호화 지원 여부
 * @retval		true			구간 암호화 지원
 * @retval		false			구간 암호화 안함
 ************************************************************/
var GINI_supportEncryptHtml5 = function () {
	return true;
}

//var INI_html5BasePath = '';
//var crosswebexBaseDir = INI_html5BasePath + "/initech/extension";

var INI_html5BasePath = "/SW/initech/webui";
var crosswebexBaseDir = "/SW/initech/extension";
//var TNK_SR = '';

var GINI_DYNAMIC_LOAD = (function () {

	var dummyTime="?dt=" + (new Date()).getTime();
	var loadCSSAndScript = function () {
		// Mobile 로드
		if (INI_getPlatformInfo().Mobile) {
			var loadCSS = function () { cssloader("/SW/vender/unikey/keypad/uniwebkey/css/uniwebkey_w2ui.css", loadCSSJqueryui, "utf-8"); };
			var loadCSSJqueryui = function () { cssloader(INI_html5BasePath + "/res/css/jqueryui/jquery-ui.css", loadCSS0, "utf-8"); };
			var loadCSS0 = function () { cssloader(INI_html5BasePath + "/res/css/jqueryui/jquery-ui.theme.css", loadCSS1, "utf-8"); };
			var loadCSS1 = function () { cssloader(INI_html5BasePath + "/res/css/initechBlueCommon.css", mCertificate, "utf-8"); };

			var mCertificate = function () {
				if (INI_getPlatformInfo().iOS) {
					cssloader(INI_html5BasePath + "/res/css/mobile/m_certificate_ios.css", mColorBlue, "utf-8");
				} else {
					cssloader(INI_html5BasePath + "/res/css/mobile/m_certificate.css", mColorBlue, "utf-8");
				}
			};
			var mColorBlue = function () { cssloader(INI_html5BasePath + "/res/css/mobile/m_color_blue.css", callback1, "utf-8"); };


			//유니키패드 로딩
			//var callback1 = function () { jsloader(INI_html5BasePath + "/initech/webui/res/script/adaptor/cw_web6_neo_adt.js", uniwebkeyLoad1, "utf-8") };
			//라온키패드 로딩
			var callback1 = function () { jsloader(INI_html5BasePath + "/cw_web6_neo_adt.js" + dummyTime, transkeyLoad1, "utf-8") };

			//라온키패드
			var transkeyLoad1 = function () { jsloader("/SW/vender/Transkey/rsa_oaep_files/rsa_oaep-min.js" + dummyTime, transkeyLoad2, "utf-8") };
			var transkeyLoad2 = function () { jsloader("/SW/vender/Transkey/jsbn/jsbn-min.js" + dummyTime, transkeyLoad3, "utf-8") };
			var transkeyLoad3 = function () { jsloader("/SW/vender/Transkey/TranskeyLibPack_op.js" + dummyTime, transkeyLoad4, "utf-8") };
			var transkeyLoad4 = function () { jsloader("/transkeyServlet?op=getToken&"+new Date().getTime(), transkeyLoad5, "utf-8") };
			var transkeyLoad5 = function () { jsloader("/SW/vender/Transkey/transkey.js" + dummyTime,  transkeyLoad6, "utf-8") };
			var transkeyLoad6 = function () { cssloader("/SW/vender/Transkey/transkey.css", iniGlobal, "utf-8") };

			//안랩키패드
			//var ahnlabLoad1 = function () { jsloader("/SW/vender/ahnlab/astx2.min.js" + dummyTime, ahnlabLoad2, "utf-8") };
			//var ahnlabLoad2 = function () { jsloader("/SW/vender/ahnlab/astx2_custom.js" + dummyTime, uniwebkeyLoad1, "utf-8") };

			//유니키패드
			//var uniwebkeyLoad1 = function () { jsloader("/SW/vender/unikey/keypad/uniwebkey/js/uniwebkey_sp_20161214.min.js" + dummyTime, uniwebkeyLoad2, "utf-8") };
			//var uniwebkeyLoad2 = function () { jsloader("/SW/vender/unikey/keypad/uniwebkey/js/uniwebkey_can_debug_20160812.min.js" + dummyTime, uniwebkeyLoad3, "utf-8") };
			//var uniwebkeyLoad3 = function () { cssloader("/SW/vender/unikey/keypad/uniwebkey/css/uniwebkey_w2ui.css", iniGlobal, "utf-8"); };

			var iniGlobal = function () { jsloader(INI_html5BasePath + "/initechGlobal.js" + dummyTime, thirdPartyProductInit, "utf-8") };
			var thirdPartyProductInit = function () { jsloader(INI_html5BasePath + "/3rd_interface.js" + dummyTime, cwuiLoad, "utf-8") };

			($ || jQuery).ajax({
				dataType: "json",
				url: INI_html5BasePath+"/manifest.json?bust=" + new Date().getTime(),
				async: false,
				success: function(response) {
				  window["GINI_MANIFEST"] = response;
				}
			});

			var cwuiLoad = function () { jsloader(GINI_MANIFEST["cwui.js"], undefined, "utf-8") };
			loadCSS();
		// PC 로드
		} else {
			document.write("<script type='text/javascript' src='" + INI_html5BasePath + "/lib/promise/rsvp-latest.min.js" + dummyTime + "'></script>");

			/************************************************************
			 * CrossWeb EX JavaScript 로딩
			 ************************************************************/
			document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/cw_web6_adt.js" + dummyTime + "'></script>");
			document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/common/js/exproto.js" + dummyTime + "'></script>");
			document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/common/exinstall.js" + dummyTime + "'></script>");
			document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/common/exinterface.js" + dummyTime + "'></script>");
			document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/crosswebexInit.js" + dummyTime + "'></script>");


			//var loadCSS = function () { cssloader(INI_html5BasePath + "/vender/unikey/keypad/uniwebkey/css/uniwebkey_w2ui.css", loadCSSJqueryui, "utf-8"); };

			var loadCSSJqueryui = function () { cssloader(INI_html5BasePath + "/res/css/jqueryui/jquery-ui.css", loadCSS0, "utf-8"); };
			var loadCSS0 = function () { cssloader(INI_html5BasePath + "/res/css/jqueryui/jquery-ui.theme.css", loadCSS1, "utf-8"); };
			var loadCSS1 = function () { cssloader(INI_html5BasePath + "/res/css/pc_certificate.css", undefined, "utf-8"); };

			var callback1 = function () { jsloader(INI_html5BasePath + "/cw_web6_neo_adt.js" + dummyTime, transkeyLoad1, "utf-8") };

			/************************************************************
			 * 가상키패드 JavaScript 로딩
			 ************************************************************/
			//라온키패드
			var transkeyLoad1 = function () { jsloader("/SW/vender/Transkey/rsa_oaep_files/rsa_oaep-min.js" + dummyTime, transkeyLoad2, "utf-8") };
			var transkeyLoad2 = function () { jsloader("/SW/vender/Transkey/jsbn/jsbn-min.js" + dummyTime, transkeyLoad3, "utf-8") };
			var transkeyLoad3 = function () { jsloader("/SW/vender/Transkey/TranskeyLibPack_op.js" + dummyTime, transkeyLoad4, "utf-8") };
			var transkeyLoad4 = function () { jsloader("/transkeyServlet?op=getToken&"+new Date().getTime(), transkeyLoad5, "utf-8") };
			var transkeyLoad5 = function () { jsloader("/SW/vender/Transkey/transkey.js" + dummyTime,  transkeyLoad6, "utf-8") };
			var transkeyLoad6 = function () { cssloader("/SW/vender/Transkey/transkey.css", iniGlobal, "utf-8") };

			//안랩키패드
			//var ahnlabLoad1 = function () { jsloader(INI_html5BasePath + "/vender/ahnlab/astx2.min.js" + dummyTime, ahnlabLoad2, "utf-8") };
			//var ahnlabLoad2 = function () { jsloader(INI_html5BasePath + "/vender/ahnlab/astx2_custom.js" + dummyTime, uniwebkeyLoad1, "utf-8") };

			//유니키패드
			//var uniwebkeyLoad1 = function () { jsloader(INI_html5BasePath + "/vender/unikey/keypad/uniwebkey/js/uniwebkey_sp_20161214.min.js" + dummyTime, uniwebkeyLoad2, "utf-8") };
			//var uniwebkeyLoad2 = function () { jsloader(INI_html5BasePath + "/vender/unikey/keypad/uniwebkey/js/uniwebkey_can_debug_20160812.min.js" + dummyTime, uniwebkeyLoad3, "utf-8") };
			//var uniwebkeyLoad3 = function () { cssloader(INI_html5BasePath + "/vender/unikey/keypad/uniwebkey/css/uniwebkey_w2ui.css", iniGlobal, "utf-8"); };

			var iniGlobal = function () { jsloader(INI_html5BasePath + "/initechGlobal.js" + dummyTime, cwuiLoad, "utf-8") };

			($ || jQuery).ajax({
				dataType: "json",
				url: "/dist/manifest.json?bust=" + new Date().getTime(),
				async: false,
				success: function(response) {
				  window["GINI_MANIFEST"] = response;
				}
			});

			var cwuiLoad = function () { jsloader(GINI_MANIFEST["cwui.js"], thirdPartyProductInit, "utf-8") };

			var thirdPartyProductInit = function () { jsloader(INI_html5BasePath + "/3rd_interface.js" + dummyTime, changeThirdPartyCompleted, "utf-8") };

			loadCSSJqueryui();
			callback1();
		}
	}
	var completed = false;	
	var thirdPartyCompleted = false;

	var moduleLoad = function () {
		loadCSSAndScript();
	};

	var changeCompleted = function () {				
		completed = true;
	};

	var isCompleted = function () {
		return completed;
	}
	
	var changeThirdPartyCompleted = function() {				
		thirdPartyCompleted = true;
	}
	
	var isThirdPartyCompleted = function () {
		return thirdPartyCompleted;
	}

	return {
		moduleLoad: moduleLoad,
		changeCompleted: changeCompleted,
		isCompleted: isCompleted,
		isThirdPartyCompleted: isThirdPartyCompleted
	}
})();

GINI_DYNAMIC_LOAD.moduleLoad();

//////////////////////////////
// common vaiable
//////////////////////////////
var importURL = window.location.protocol + "//" + window.location.host +"/CertRelay/servlet/GetCertificateV12";
var exportURL = window.location.protocol + "//" + window.location.host + "/CertRelay/servlet/GetCertificateV12";

var TimeURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/Time.jsp";
var RandomURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/Random.jsp";
var E2ERandomURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/E2E_Random.jsp";
var LogoURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + '/img/logo.demo.initech.com_TRUSTWEX.jpg';
var TrustBannerURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + '/img/voice.demo.initech.com..jpg';
var EncFlag = 10;
var VerifyFlag = 11;
var CrossWebSpanTag = "CrossWeb_Extension";

var cipher = "SEED-CBC";
var hashalg = "sha2";

var turl = TimeURL;
var rurl = RandomURL;

//-------------------------------------------
//인증서 발급/갱신/폐기 관련 CA 정보(2048용 테스트)
//-------------------------------------------
var YessignCAIP = "203.233.91.231";		//금결원 테스트 CA 서버
var CrossCertCAIP = "211.180.234.201";	//전자인증 테스트 CA 서버 ( 201 서버가 안될 경우, 205 서버로 접속 211.180.234.205 )
var SignKoreaCAIP = "211.175.81.101";	//코스콤 테스트 CA 서버
var SignGateCAIP = "114.108.187.156";	//정보인증 테스트 CA 서버 ( 156 서버가 안될 경우, 61.72.247.156로 변경 )
//-------------------------------------------

//-------------------------------------------
//인증서 발급/갱신/폐기 관련 CA 정보(리얼)
//-------------------------------------------
//var YessignCAIP = "203.233.91.71";		//금결원 리얼 CA 서버
//var CrossCertCAIP = "211.192.169.90";		//전자인증 리얼 CA 서버
//var SignKoreaCAIP = "210.207.195.100";	//코스콤 리얼 CA 서버
//var SignGateCAIP = "211.35.96.43";		//정보인증 리얼 CA 서버
//-------------------------------------------

var YessignCMPPort = "4512";
var CrossCertCMPPort = "4512";
var SignKoreaCMPPort = "4099";
var SignGateCMPPort = "4502";

var InitechPackage = "INITECH";
var YessignPackage = "YESSIGN";
var CrossCertPackage = "CROSSCERT";
var SignKoreaPackage = "SIGNKOREA";
var SignGatePackage = "SIGNGATE";

// INITECH CA
var Initech_CAPackage = "INITECH_CA";
var Initech_CAIP = "dev.initech.com";
var Initech_CMPPort = "28088";	// HTTP
//var Initech_CMPPort = "28089";	// TCP
//var Initech_CMPPort = "8200";
var CANAME = "INITECHCA";

var CW_DEV_HOST = location.hostname;
var CW_TEST_HOST = location.hostname;
var CW_REAL_HOST = location.hostname;

// 서버 인증서
var SCert = "-----BEGIN CERTIFICATE-----\nMIIDtjCCAp6gAwIBAgIDAhKKMA0GCSqGSIb3DQEBCwUAMFMxCzAJBgNVBAYTAktS\nMRAwDgYDVQQKEwdJTklURUNIMREwDwYDVQQLEwhQbHVnaW5DQTEfMB0GA1UEAxMW\nSU5JVEVDSCBQbHVnaW4gUm9vdCBDQTAeFw0xNzA4MjEwMTM3MDdaFw0yNzA4MjEw\nMTM3MDZaMEExCzAJBgNVBAYTAktSMRIwEAYDVQQKEwlJTklURUNIQ0ExHjAcBgNV\nBAMTFWRldnBvcnRhbC5rb3NhZi5nby5rcjCCASIwDQYJKoZIhvcNAQEBBQADggEP\nADCCAQoCggEBAJ9RT5HyxHaoe1nM4eKzgSPSgeJwB3zFunt39Fg1CTWUJH5ajmtW\nevPJcBYIMM72LeGpAGdgq4wjFmhw0i34jNVqTzjvujIt2jlCypUizsc9KISNyt01\nEUZiV0DVLYnvRiwuDzAVAJgftadGDyRhWAMRX+eqHgtVsKtdXAqztVU2WJFU5cPY\nApSnnsGepmzX/N3VoHgIXK2WkpqJUSDGMw8hCzBZ/QDEXKJonaFY2ElnAOOyBKDj\n4v6Rr5m6F7eCE5Tiyuez8YdNd0sOmj3JUR3YL3jnGHQjC3D664bqgsczno5WkVym\nyKKk6+CGE7oh8Fai8nlemITA3Go0xBINF80CAwEAAaOBpDCBoTAfBgNVHSMEGDAW\ngBR1kfKc6tS556OlX3eE26EaDRiLpTAdBgNVHQ4EFgQUMDSQ+XrB6sUqim5MDlkM\nlD9ainEwDgYDVR0PAQH/BAQDAgH+MAwGA1UdEwEB/wQCMAAwQQYDVR0fBDowODA2\noDSgMoYwaHR0cDovL2Rldi5pbml0ZWNoLmNvbTo0ODIwMC9DUkwvSU5JVEVDSENB\nMTMuY3JsMA0GCSqGSIb3DQEBCwUAA4IBAQCUBPnkrx/9nHhjRnqOXre62cSppjod\npMrm1+79WCTRb1f4tsUXn2qShyf4xP7if7Uo5/N4ePoK06GYqBaYzdlkJSX3Cqds\n3jFmOf7QskaLeOS21aQpEDekGYSTvXaoCqAngP7Zm+PlnJDZgJRoXj3fxDMeg1XK\nC2NIivuJWtXrMUm7v/l2zNPCwOeZ8HiyeKPzoczI+pXBzMSpcsH9VWd+BHsJ8sje\nME8hiBcdUEKFBfvMhQYj3B2EVj8vPExMvIATX6q6XwYK6VlneCKJ+eFRnlaNV+Da\nNgLBmilteAAliLmonq8loTOWotOeOCx9k3tpfSKNnUqSDmTa28SzrdcM\n-----END CERTIFICATE-----\n";

// Real-CA 인증서 (2048)
var realSignKorea_2048 = "-----BEGIN CERTIFICATE-----\nMIIGDTCCBPWgAwIBAgICEAIwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTAwOTA2\nMDgzNTUxWhcNMjAwOTA2MDgzNTUxWjBQMQswCQYDVQQGEwJLUjESMBAGA1UECgwJ\nU2lnbktvcmVhMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFjAUBgNVBAMMDVNpZ25L\nb3JlYSBDQTIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCPxvWUWarJ\nIEsIcRYOQqfso/15wBqOLQjfBjodSZjERjPYHlGdPP+ThzCvrJx3D9M7ECWMMEJX\nvG/5NpH/2JRbRyUH3uNeocrIT5wgcEbDfpeg0DsHWy1Ln92ZwVjstHetu/9DrIu5\nM3b7fuHYaRhZ1EXMbicxsSCEVILP07rKHlxjZJrxqtBa5sjYJdU5TT3PS+3QdD1e\nK3X1nmwMexm0fb3CpW07bNXkPVSucuoZL+vZSPFszZpDtGnbYMt4HtaOQVQ+99vq\n7M0ZfZ9YoYt4e0AVQI0QaWg5lb+bB0ROh6qRpFAh711q5K0vVlqvq0ikj6eZTBbS\nVGTF9C4PkoTHAgMBAAGjggLbMIIC1zCBjgYDVR0jBIGGMIGDgBTI0I7HSa4fIEKy\nS38TyXdYDKHNwaFopGYwZDELMAkGA1UEBhMCS1IxDTALBgNVBAoMBEtJU0ExLjAs\nBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwxFjAU\nBgNVBAMMDUtJU0EgUm9vdENBIDSCAQEwHQYDVR0OBBYEFCeWlr7zhNxZAWIkI+IY\ne9NBjS1CMA4GA1UdDwEB/wQEAwIBBjCCATEGA1UdIAEB/wSCASUwggEhMIIBHQYE\nVR0gADCCARMwMAYIKwYBBQUHAgEWJGh0dHA6Ly93d3cucm9vdGNhLm9yLmtyL3Jj\nYS9jcHMuaHRtbDCB3gYIKwYBBQUHAgIwgdEegc7HdAAgx3jJncEcspQAIKz1x3jH\neMmdwRzHhbLIsuQAKABUAGgAaQBzACAAYwBlAHIAdABpAGYAaQBjAGEAdABlACAA\naQBzACAAYQBjAGMAcgBlAGQAaQB0AGUAZAAgAHUAbgBkAGUAcgAgAEUAbABlAGMA\ndAByAG8AbgBpAGMAIABTAGkAZwBuAGEAdAB1AHIAZQAgAEEAYwB0ACAAbwBmACAA\ndABoAGUAIABSAGUAcAB1AGIAbABpAGMAIABvAGYAIABLAG8AcgBlAGEAKTAqBgNV\nHREEIzAhoB8GCSqDGoyaRAoBAaASMBAMDijso7wp7L2U7Iqk7L2kMBIGA1UdEwEB\n/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjgYDVR0fBIGGMIGDMIGAoH6g\nfIZ6bGRhcDovL2Rpci5zaWdua29yZWEuY29tOjM4OS9DTj1LSVNBLVJvb3RDQS00\nLE9VPUtvcmVhLUNlcnRpZmljYXRpb24tQXV0aG9yaXR5LUNlbnRyYWwsTz1LSVNB\nLEM9S1I/YXV0aG9yaXR5UmV2b2NhdGlvbkxpc3QwDQYJKoZIhvcNAQELBQADggEB\nAMM91U4LDzBWvL3NzmMalbWhndl3jFR+pUJv28tIdUCLBXgkf6NYkw22IStw2xgp\ndtjz6y23c1iLGUfiEamR88tWKTF9lut32d45HdP83Uhhlvi8UM0HKfHUlerKjWRG\nI6KwL+9n+7MwXXLmqFSa5zuhsgAWnI9Crydo+las3MlS+HrFVQBHhDAyYZHdQ206\nkLw2rQmLZVsqBgvMPquPEiE7uymNrnGeBWO52RUuhjkiGtMmJ0FrJcIew3lhgQES\n7RYhwcpHD7hbzAeD/H48QfCCY+XmwBswI7R9wZJtev54505WlG8cME7agFgDJNjQ\nGG/5s824NwQrnD8P/KqPqn8=\n-----END CERTIFICATE-----\n";
var realYessign_2048 = "-----BEGIN CERTIFICATE-----\nMIIGDjCCBPagAwIBAgICEAMwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTAwOTA2\nMDgzNjI3WhcNMjAwOTA2MDgzNjI3WjBSMQswCQYDVQQGEwJrcjEQMA4GA1UECgwH\neWVzc2lnbjEVMBMGA1UECwwMQWNjcmVkaXRlZENBMRowGAYDVQQDDBF5ZXNzaWdu\nQ0EgQ2xhc3MgMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMIRylMU\nnaWOTdB3uVrlR5++4zJX+6XUqesC4G0ijU9Ux38T3UvexzlHjXevFrdTacujjFP+\nTPtGr2V/UehKlJfb1ozrUZ5oUqsxf0C0+iA0ZnVBT2JG1YvhuAV20p+rcWxMjyvP\nR5VoV7kg6QT3DiW/Ok6V2SpMu63DZ3Dl1h5ONECHtOmMade7T8PH4y2wS+Gu5cVK\nVyRYrPzgU8xmbpfhoV52MR+hCIwuSgj/v0DNF6wSJB8WXQiSX/Sa9YT5fHht8zgq\na4uLqJUxy9Azid4OFKxFWiLKLP1k5GAGjODIWifhNmBfCdRs+6ohcF0D/I5tsC+v\nD9JGGM5c//73gdkCAwEAAaOCAtowggLWMIGOBgNVHSMEgYYwgYOAFMjQjsdJrh8g\nQrJLfxPJd1gMoc3BoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEu\nMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEW\nMBQGA1UEAwwNS0lTQSBSb290Q0EgNIIBATAdBgNVHQ4EFgQUUgQyn4+dIXK6+jOY\nqGF+JzMkjV8wDgYDVR0PAQH/BAQDAgEGMIIBMQYDVR0gAQH/BIIBJTCCASEwggEd\nBgRVHSAAMIIBEzAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3Iv\ncmNhL2Nwcy5odG1sMIHeBggrBgEFBQcCAjCB0R6Bzsd0ACDHeMmdwRyylAAgrPXH\neMd4yZ3BHMeFssiy5AAoAFQAaABpAHMAIABjAGUAcgB0AGkAZgBpAGMAYQB0AGUA\nIABpAHMAIABhAGMAYwByAGUAZABpAHQAZQBkACAAdQBuAGQAZQByACAARQBsAGUA\nYwB0AHIAbwBuAGkAYwAgAFMAaQBnAG4AYQB0AHUAcgBlACAAQQBjAHQAIABvAGYA\nIAB0AGgAZQAgAFIAZQBwAHUAYgBsAGkAYwAgAG8AZgAgAEsAbwByAGUAYQApMCsG\nA1UdEQQkMCKgIAYJKoMajJpECgEBoBMwEQwP6riI7Jy16rKw7KCc7JuQMBIGA1Ud\nEwEB/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjAYDVR0fBIGEMIGBMH+g\nfaB7hnlsZGFwOi8vZHMueWVzc2lnbi5vci5rcjozODkvQ049S0lTQS1Sb290Q0Et\nNCxPVT1Lb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50cmFsLE89S0lT\nQSxDPUtSP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3DQEBCwUAA4IB\nAQBdGlZZIV/ciFPet6HLmBfgI3WdHP9gXfplTsV9HqAIPSGNOSjJrfSIWFP+mjk0\nhVlt1fMF3D+5loekqsskp7U6bmbPt5QCpXdX6TdhyP7hcUGClXS0jcQR1Nli1Bgx\ntKNL3nv3PwW005dAyQVVx3qmtPXR8a9/FzOPoY4Gf6PyWi9yQugfBQkvkTMNa+r3\nbULTj3jk1IaK5rp23EKbhCrLUTJ6BIdjOaS/NY1DDCtU3SVAUlZhi9X0lh3cGchl\nJT5G57OiC1/rjNZcwoQBPLflsqJ8ZtWBmN9VDXNwAHtLl7znKJ286OjT+5AHuifm\nIYtAnDJPs4Oy3F4dQ/4pjgm6\n-----END CERTIFICATE-----\n";
var realCrossCert_2048 = "-----BEGIN CERTIFICATE-----\nMIIGEDCCBPigAwIBAgICEAQwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTAwOTA2\nMDgzNzAwWhcNMjAwOTA2MDgzNzAwWjBPMQswCQYDVQQGEwJLUjESMBAGA1UECgwJ\nQ3Jvc3NDZXJ0MRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFTATBgNVBAMMDENyb3Nz\nQ2VydENBMjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBALDruBWuOVv1\nLj3D1TuGXBFLUpdNi/o4jasLVM8/V4ZDP0lbR6SOJoGOp7muS7XHyiCZSLlNVFZp\nxvXfD83doYhqjB7axwwVShLTp5+RbXjTYxgNqjHOCDh6HF9NvEocYL3YEndO1Mfq\nhhcare4yYZE3CrrCHtlorJRqtvfDiD92jeIPG8SB91fPqOtYljDrqeBT1lD8njcj\naw8u9+l4UXOUmRX+Qfkk6OOzAx6rl956/qCQfia+2O6d8tIRpk0ICz6kuY/XtL09\n9bVFAetReyEPDErs0kcvEbif/yd8MW6k/2ZHWuqhP8a//DZ7w9GD0bGkmlfA5d+r\nTc9VAKM+cnUCAwEAAaOCAt8wggLbMIGOBgNVHSMEgYYwgYOAFMjQjsdJrh8gQrJL\nfxPJd1gMoc3BoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEuMCwG\nA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEWMBQG\nA1UEAwwNS0lTQSBSb290Q0EgNIIBATAdBgNVHQ4EFgQUtnSpm5I8x1GxIqRPvLc8\n/iIz13YwDgYDVR0PAQH/BAQDAgEGMIIBMQYDVR0gAQH/BIIBJTCCASEwggEdBgRV\nHSAAMIIBEzAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3IvcmNh\nL2Nwcy5odG1sMIHeBggrBgEFBQcCAjCB0R6Bzsd0ACDHeMmdwRyylAAgrPXHeMd4\nyZ3BHMeFssiy5AAoAFQAaABpAHMAIABjAGUAcgB0AGkAZgBpAGMAYQB0AGUAIABp\nAHMAIABhAGMAYwByAGUAZABpAHQAZQBkACAAdQBuAGQAZQByACAARQBsAGUAYwB0\nAHIAbwBuAGkAYwAgAFMAaQBnAG4AYQB0AHUAcgBlACAAQQBjAHQAIABvAGYAIAB0\nAGgAZQAgAFIAZQBwAHUAYgBsAGkAYwAgAG8AZgAgAEsAbwByAGUAYQApMC4GA1Ud\nEQQnMCWgIwYJKoMajJpECgEBoBYwFAwS7ZWc6rWt7KCE7J6Q7J247KadMBIGA1Ud\nEwEB/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjgYDVR0fBIGGMIGDMIGA\noH6gfIZ6bGRhcDovL2Rpci5jcm9zc2NlcnQuY29tOjM4OS9DTj1LSVNBLVJvb3RD\nQS00LE9VPUtvcmVhLUNlcnRpZmljYXRpb24tQXV0aG9yaXR5LUNlbnRyYWwsTz1L\nSVNBLEM9S1I/YXV0aG9yaXR5UmV2b2NhdGlvbkxpc3QwDQYJKoZIhvcNAQELBQAD\nggEBAJdrnJLYDElPoEvWNXZX8OYs5b2qA17Nz2RyGfuxz7NZHaQKNcdBGIMWmHvm\nMclpYrCkXjJfqhDKkgdOhyE4CjfYJqjTQxbrbMnTwYcjTRZ+VwwW9auPDImrEOsk\n4wl3hiSfLtHZXEi8YnnoB6TvYI9ZnALJs/SjNFSoQEpvxRA/3Tmx1KeyYcaFcC/W\n+qjmDN+b10SfFEcUeCqcO9dRHjuBpFeTGxtU8qIiWItWFvHVx6un6oTvoqRjJXS7\nY5Hn29F1rnr9HOZO+jho2L9Yf0lnlZIB7OnAgS/hcARSHcCFQWoZI4OTV7fkUFht\nGn0jUlDJ6Kd8Xp5xD08myIgfimY=\n-----END CERTIFICATE-----\n";
var realTradeSign_2048 = "-----BEGIN CERTIFICATE-----\nMIIGFzCCBP+gAwIBAgICEAkwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTAxMDAx\nMDgzODAzWhcNMjAxMDAxMDgzODAzWjBPMQswCQYDVQQGEwJLUjESMBAGA1UECgwJ\nVHJhZGVTaWduMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFTATBgNVBAMMDFRyYWRl\nU2lnbkNBMjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKHCC18Bv3d+\n+/iVp24Sj3CADxtA0pXPXdvvJAuB8IWlbNMj04qOhu8dw2PF7xEThRkpP37FKIlL\nmpuUSSAxPIHsex44ybOXEM69xy1noykUaGQWlC1Ax1T0at+mB9RjyHaWyPppWmQ7\nVC4r8G5mImjltDHAds+IPZU/DKLXkEBDZctjh0Gja0HaNYUu1P+9Pl3ZdEo8Wb0D\n6I5yLbTBwPOGdiY7yGBRb5Ez6XFbZnDtHPMqAcDmk10kabR4gkZQypTlpURnyAag\n303vwuKUKeKb0wvmtEs3Yyb27bd+R7uVD0gOwTIqahapG92YtyzwLEzgaVkOtQpr\nAfPaJ8rqwQcCAwEAAaOCAuYwggLiMIGOBgNVHSMEgYYwgYOAFMjQjsdJrh8gQrJL\nfxPJd1gMoc3BoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEuMCwG\nA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEWMBQG\nA1UEAwwNS0lTQSBSb290Q0EgNIIBATAdBgNVHQ4EFgQUTV1WCgcD34PK89Vtjxn8\nEqyQooowDgYDVR0PAQH/BAQDAgEGMIIBMQYDVR0gAQH/BIIBJTCCASEwggEdBgRV\nHSAAMIIBEzAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3IvcmNh\nL2Nwcy5odG1sMIHeBggrBgEFBQcCAjCB0R6Bzsd0ACDHeMmdwRyylAAgrPXHeMd4\nyZ3BHMeFssiy5AAoAFQAaABpAHMAIABjAGUAcgB0AGkAZgBpAGMAYQB0AGUAIABp\nAHMAIABhAGMAYwByAGUAZABpAHQAZQBkACAAdQBuAGQAZQByACAARQBsAGUAYwB0\nAHIAbwBuAGkAYwAgAFMAaQBnAG4AYQB0AHUAcgBlACAAQQBjAHQAIABvAGYAIAB0\nAGgAZQAgAFIAZQBwAHUAYgBsAGkAYwAgAG8AZgAgAEsAbwByAGUAYQApMDQGA1Ud\nEQQtMCugKQYJKoMajJpECgEBoBwwGgwY7ZWc6rWt66y07Jet7KCV67O07Ya17Iug\nMBIGA1UdEwEB/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjwYDVR0fBIGH\nMIGEMIGBoH+gfYZ7bGRhcDovL2xkYXAudHJhZGVzaWduLm5ldDozODkvQ049S0lT\nQS1Sb290Q0EtNCxPVT1Lb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50\ncmFsLE89S0lTQSxDPUtSP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3\nDQEBCwUAA4IBAQBUWGneikhd1rVgunY7pknvhBiK1wAvZODQRSJBxjY7M+xkmmZT\nKm0n0oDJ1K7PbTcwrmaMzKVcHnOantcBKhyNLfJivQ3+0NTi88OFIjPnFa/otfCE\nKxdNpet5+6huJjDD5FouxsIbeZU6v11vAfzefcHRwcpFhbwJ4PPE4uPcPOlkBvTf\nKzwMXjOca4i3+vvQ6OgcRg8ff27msKDmZNuTqba6sjzWPV6XFT7tVXJHWfQBcMkH\nksEnW/CXppqOsJM/+eMQzVp6xZ5ONtfpo6Godk/Vcr5P10kJyEmrWlh+0XcaVux5\n52PlLvF2Mdo9WydtCzc5GY3npzO9DrAUKMhu\n-----END CERTIFICATE-----\n";
var realSignGate_2048 = "-----BEGIN CERTIFICATE-----\nMIIGCzCCBPOgAwIBAgICEAowDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTAxMDAx\nMDgzODM1WhcNMjAxMDAxMDgzODM1WjBKMQswCQYDVQQGEwJLUjENMAsGA1UECgwE\nS0lDQTEVMBMGA1UECwwMQWNjcmVkaXRlZENBMRUwEwYDVQQDDAxzaWduR0FURSBD\nQTQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDBxoTcxnyAwA63sK0F\ncEv9MhgDOVDvZjSdqJSE/Dc9azjjj/0l1FxXtAlgbr9BWgfATm3Avzqy6XQAKnbB\npa3arD8FcyJt9dfxMnJ109OXrqjATD9mDMsZZMPngR0YN+lvVmUd6zANX6a2oms9\njiUmHkkkuj41xXK0KNCr81tjwiFJK50Z2cr8MQIN44u/0S3Tn1QeecnWaRYBu0ve\nUU1t3mDziR3VU/oq8RJqIu7v2eyGwwIRYujpMYaRlF4ED8DfcPmrtcjJeLs+V7Ni\nh2tp+b3yuSkLz3sSHomK32qFAq/FPG40qY0NjjMb8h6KaopTU2sw54Of/imS4iJX\nebjvAgMBAAGjggLfMIIC2zCBjgYDVR0jBIGGMIGDgBTI0I7HSa4fIEKyS38TyXdY\nDKHNwaFopGYwZDELMAkGA1UEBhMCS1IxDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsM\nJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwxFjAUBgNVBAMM\nDUtJU0EgUm9vdENBIDSCAQEwHQYDVR0OBBYEFK5S/Q4OAfgwhjd+9hjGSSVKYAlw\nMA4GA1UdDwEB/wQEAwIBBjCCATEGA1UdIAEB/wSCASUwggEhMIIBHQYEVR0gADCC\nARMwMAYIKwYBBQUHAgEWJGh0dHA6Ly93d3cucm9vdGNhLm9yLmtyL3JjYS9jcHMu\naHRtbDCB3gYIKwYBBQUHAgIwgdEegc7HdAAgx3jJncEcspQAIKz1x3jHeMmdwRzH\nhbLIsuQAKABUAGgAaQBzACAAYwBlAHIAdABpAGYAaQBjAGEAdABlACAAaQBzACAA\nYQBjAGMAcgBlAGQAaQB0AGUAZAAgAHUAbgBkAGUAcgAgAEUAbABlAGMAdAByAG8A\nbgBpAGMAIABTAGkAZwBuAGEAdAB1AHIAZQAgAEEAYwB0ACAAbwBmACAAdABoAGUA\nIABSAGUAcAB1AGIAbABpAGMAIABvAGYAIABLAG8AcgBlAGEAKTAuBgNVHREEJzAl\noCMGCSqDGoyaRAoBAaAWMBQMEu2VnOq1reygleuztOyduOymnTASBgNVHRMBAf8E\nCDAGAQH/AgEAMA8GA1UdJAEB/wQFMAOAAQAwgY4GA1UdHwSBhjCBgzCBgKB+oHyG\nemxkYXA6Ly9sZGFwLnNpZ25nYXRlLmNvbTozODkvQ049S0lTQS1Sb290Q0EtNCxP\nVT1Lb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50cmFsLE89S0lTQSxD\nPUtSP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3DQEBCwUAA4IBAQB4\n/X/Uo0juPbru2nideeodSHGaZMbsVwE95hoUurA3EXhiF2G/sI3avU965bks5OiG\nXQraUq9+eE87gLxDKTen63Rtg9gvJbP5mHXFxcR9BlII+cgr30wA6H4l85flZFzc\nz+OahncFFrPFo9Rf3RfBGDHGqaa25z0oJWrTCQpjtLHS6QHxXgwTBrxVtq3W34JC\nbXtTRj7mZ/t31cBc4eVL2ft7u7p4lZp6XMfkHHUgLe8ZdSgQVfTVdiYbhfabiYAQ\n828W2jdpQ7iOumcvho/F5RcgVhsSlZKpwSEnP9I4kKIc4rictwRRl7QAMWIgL0Ls\nPebzsP4PpTl+94wuhJ/L\n-----END CERTIFICATE-----\n";
var realYessignClass2_2048 = "-----BEGIN CERTIFICATE-----\nMIIGDjCCBPagAwIBAgICEBwwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTUxMDAy\nMDEzNDA1WhcNMjUxMDAyMDEzNDA1WjBSMQswCQYDVQQGEwJrcjEQMA4GA1UECgwH\neWVzc2lnbjEVMBMGA1UECwwMQWNjcmVkaXRlZENBMRowGAYDVQQDDBF5ZXNzaWdu\nQ0EgQ2xhc3MgMjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKXC/hP9\nvF6PPP10R6jNcjptiIUxBg8uiqIKhLKKrBT4iBIBJA9/emG1hZpvi/CAGyGI18Ri\nZctzU8LFdsEbP+HSuuSXpbIHpUZ4xbm3zipeJx/hzu94KxwePcuQM+/p4UIZY0dK\n4ItV3s2oSsprENVAe6WCRcaeD5+5AvTlRDa6mvZyghJsoj5kPgpigixW9Ci3O4l5\nNyi2BtvlN0alPMeEvv6j32ACSPtXyBGI7PlM3zUoy5jj9HyDW7x2ZEO7b7yB1UZC\nI4UWMtKINm6eu73Imy4eL4fVJqUIkkER2OKPvSjLxeD8y6iFOT6UJsIg4r2By35I\nZmuMIAPG3s03G4ECAwEAAaOCAtowggLWMIGOBgNVHSMEgYYwgYOAFMjQjsdJrh8g\nQrJLfxPJd1gMoc3BoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEu\nMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEW\nMBQGA1UEAwwNS0lTQSBSb290Q0EgNIIBATAdBgNVHQ4EFgQU79xE0saNwA6jOMB8\nk8bDQb9Kj/AwDgYDVR0PAQH/BAQDAgEGMIIBMQYDVR0gAQH/BIIBJTCCASEwggEd\nBgRVHSAAMIIBEzAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3Iv\ncmNhL2Nwcy5odG1sMIHeBggrBgEFBQcCAjCB0R6Bzsd0ACDHeMmdwRyylAAgrPXH\neMd4yZ3BHMeFssiy5AAoAFQAaABpAHMAIABjAGUAcgB0AGkAZgBpAGMAYQB0AGUA\nIABpAHMAIABhAGMAYwByAGUAZABpAHQAZQBkACAAdQBuAGQAZQByACAARQBsAGUA\nYwB0AHIAbwBuAGkAYwAgAFMAaQBnAG4AYQB0AHUAcgBlACAAQQBjAHQAIABvAGYA\nIAB0AGgAZQAgAFIAZQBwAHUAYgBsAGkAYwAgAG8AZgAgAEsAbwByAGUAYQApMCsG\nA1UdEQQkMCKgIAYJKoMajJpECgEBoBMwEQwP6riI7Jy16rKw7KCc7JuQMBIGA1Ud\nEwEB/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjAYDVR0fBIGEMIGBMH+g\nfaB7hnlsZGFwOi8vZHMueWVzc2lnbi5vci5rcjozODkvQ049S0lTQS1Sb290Q0Et\nNCxPVT1Lb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50cmFsLE89S0lT\nQSxDPUtSP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3DQEBCwUAA4IB\nAQAhOe2oq/Uazi/nKMhM3W+H1y3GnVc9n+lfmmTA4PjM6U07h/hvCbFJQiDe6zoM\ne4lVu+YxGWDAEol5ZiSBAaGAjdJFy+uoYHqJP+33+jruj4j4c7/wK7wyAzSfjNwu\nNXThM8Aygkohv784o/2Vq7cxD4ZpVYOznb/0/MmLzl2mDYRsCtHrkADHloD7JGB6\n8/ESX6Y4sfNwsOFZ9saLDclQuEeZJ0pJMzkkGo3r8bGkxHo2VgJsVqBmiLk5RWP6\nsxAY2OVmaSObBYv1IhiovW+A3FSnY5LAvaSKWqKe+pq/3EwqBKvmMIF4/j7P0sA+\nIneqPXtp+T1FxODf4yT5reEu\n-----END CERTIFICATE-----\n";
var realSignKorea_CA3 = "-----BEGIN CERTIFICATE-----\nMIIGDTCCBPWgAwIBAgICECAwDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTYwNTEz\nMDIzMzM1WhcNMjYwNTEzMDIzMzM1WjBQMQswCQYDVQQGEwJLUjESMBAGA1UECgwJ\nU2lnbktvcmVhMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFjAUBgNVBAMMDVNpZ25L\nb3JlYSBDQTMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC8NWUKGJNd\nVCNqvd/QcILyO4isIUPttcnuEGBTgNYb1q66ChssV2rMZrazyT96PZwmMwusp7Np\n+TsmmifDJtRrzS3K2MiPEK7xubND8nlQqL3OC61QglqdPO5JYe75e7aHJGe/ijGz\nlnrTxEx2OpC27gZCHuheei8Hn2eN6HPA7YmmazSe5VEOS8f1jSFQFGKQFaO+28OO\ng4gzuSwE8uZ3UbeV1iWhvPybs52x3PV8/vqHGUKLBAIz8xKvEFsWHhxeh1VcbvDZ\nHVDVi1A0fNry2OMgW7QiCIhfo3i/EHKtUp4SL8NDJ8dfjseqSwNMCKxHXK9Edoq2\npo5v/d0VNDz1AgMBAAGjggLbMIIC1zCBjgYDVR0jBIGGMIGDgBTI0I7HSa4fIEKy\nS38TyXdYDKHNwaFopGYwZDELMAkGA1UEBhMCS1IxDTALBgNVBAoMBEtJU0ExLjAs\nBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwxFjAU\nBgNVBAMMDUtJU0EgUm9vdENBIDSCAQEwHQYDVR0OBBYEFARURbDeEsQnnKBPAmmL\n1VsUFGMHMA4GA1UdDwEB/wQEAwIBBjCCATEGA1UdIAEB/wSCASUwggEhMIIBHQYE\nVR0gADCCARMwMAYIKwYBBQUHAgEWJGh0dHA6Ly93d3cucm9vdGNhLm9yLmtyL3Jj\nYS9jcHMuaHRtbDCB3gYIKwYBBQUHAgIwgdEegc7HdAAgx3jJncEcspQAIKz1x3jH\neMmdwRzHhbLIsuQAKABUAGgAaQBzACAAYwBlAHIAdABpAGYAaQBjAGEAdABlACAA\naQBzACAAYQBjAGMAcgBlAGQAaQB0AGUAZAAgAHUAbgBkAGUAcgAgAEUAbABlAGMA\ndAByAG8AbgBpAGMAIABTAGkAZwBuAGEAdAB1AHIAZQAgAEEAYwB0ACAAbwBmACAA\ndABoAGUAIABSAGUAcAB1AGIAbABpAGMAIABvAGYAIABLAG8AcgBlAGEAKTAqBgNV\nHREEIzAhoB8GCSqDGoyaRAoBAaASMBAMDijso7wp7L2U7Iqk7L2kMBIGA1UdEwEB\n/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjgYDVR0fBIGGMIGDMIGAoH6g\nfIZ6bGRhcDovL2Rpci5zaWdua29yZWEuY29tOjM4OS9DTj1LSVNBLVJvb3RDQS00\nLE9VPUtvcmVhLUNlcnRpZmljYXRpb24tQXV0aG9yaXR5LUNlbnRyYWwsTz1LSVNB\nLEM9S1I/YXV0aG9yaXR5UmV2b2NhdGlvbkxpc3QwDQYJKoZIhvcNAQELBQADggEB\nAEi2H54k3tOF/fXAI0W20SiSOfizAX+t5qvJrV9ob1xDWeaTnLjSpu/IGNwcjWS7\nwseFyo2T95cEGMcmzMlIp/t0HopziXv4WC0mulAdk0yvynBQY9HcO5DzXWp83lYe\nU+CMB3UkBBaOAWU/aXQNxZUwnsn2wYoWq3OE4I6hHB33jSJZTYXTcHt4wkTa+BGO\nCu4cQOa6mtMiG12Zo+J3+360z4laRSmM/nQdVMYFLvdEJ8/3ki1MhEr3efhNE/8X\nwhtboEi7qXUH8MrViR6uUnKcMMySI+26N+Aim/itOqYCvhFmDY7619ttPk6ktefB\niIHMsKEv168n68Bm7l/GGRE=\n-----END CERTIFICATE-----\n";
var realSignGate_CA5 = "-----BEGIN CERTIFICATE-----\nMIIGCzCCBPOgAwIBAgICEB0wDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTUxMjI5\nMDc0NjI1WhcNMjUxMjI5MDc0NjI1WjBKMQswCQYDVQQGEwJLUjENMAsGA1UECgwE\nS0lDQTEVMBMGA1UECwwMQWNjcmVkaXRlZENBMRUwEwYDVQQDDAxzaWduR0FURSBD\nQTUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCpiTEmAeOssny+ettR\nSdHJWXBkRgE+nUOe19z0HUuy1L6G7iUVyMhc7GSqJFkZtcDWqLx3cKkBe5Vd7Xxb\n8fr52tXI+sQBnOQkb+tpfj6RNisbJAkTAGukOTkaiTuhL0s+AhdCNdkknF4i7aa5\n3/NFD1XeOYVjnNwx2yz0gCY7jBb79UE6wB5h9qFyuHleiJCdlkNAeJIhe0cPWuak\ngj5kB1hpb7nW3lpiiSSDA99cG5x2oSlNzMfxX382CjsgvQclUp/Wz7kNl46fgrER\nTOsHN2N5A7nqxx8ipAfYyyy+lCnv9YE7xg13+5uzN0oRJCU1A7obMGRx5WwYeKMx\nXfTbAgMBAAGjggLfMIIC2zCBjgYDVR0jBIGGMIGDgBTI0I7HSa4fIEKyS38TyXdY\nDKHNwaFopGYwZDELMAkGA1UEBhMCS1IxDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsM\nJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwxFjAUBgNVBAMM\nDUtJU0EgUm9vdENBIDSCAQEwHQYDVR0OBBYEFNi+OuxFmcWe45zqgR/SHRKwNj6I\nMA4GA1UdDwEB/wQEAwIBBjCCATEGA1UdIAEB/wSCASUwggEhMIIBHQYEVR0gADCC\nARMwMAYIKwYBBQUHAgEWJGh0dHA6Ly93d3cucm9vdGNhLm9yLmtyL3JjYS9jcHMu\naHRtbDCB3gYIKwYBBQUHAgIwgdEegc7HdAAgx3jJncEcspQAIKz1x3jHeMmdwRzH\nhbLIsuQAKABUAGgAaQBzACAAYwBlAHIAdABpAGYAaQBjAGEAdABlACAAaQBzACAA\nYQBjAGMAcgBlAGQAaQB0AGUAZAAgAHUAbgBkAGUAcgAgAEUAbABlAGMAdAByAG8A\nbgBpAGMAIABTAGkAZwBuAGEAdAB1AHIAZQAgAEEAYwB0ACAAbwBmACAAdABoAGUA\nIABSAGUAcAB1AGIAbABpAGMAIABvAGYAIABLAG8AcgBlAGEAKTAuBgNVHREEJzAl\noCMGCSqDGoyaRAoBAaAWMBQMEu2VnOq1reygleuztOyduOymnTASBgNVHRMBAf8E\nCDAGAQH/AgEAMA8GA1UdJAEB/wQFMAOAAQAwgY4GA1UdHwSBhjCBgzCBgKB+oHyG\nemxkYXA6Ly9sZGFwLnNpZ25nYXRlLmNvbTozODkvQ049S0lTQS1Sb290Q0EtNCxP\nVT1Lb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50cmFsLE89S0lTQSxD\nPUtSP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3DQEBCwUAA4IBAQAj\nR/p1dqrwXm2xAwNUHukCvVKRrkIo0ReXWUXBawmFM7JDVYdiOWho87z427OCToFJ\njDxqw/iLQHMtIjfqpET2hRNIIFRsFKAnJEAhdboEf/zQ/++sAQBv/YRQLL0rxBVn\nq6ZGzCRsgAzLqc8d4wIC9bEQkPMNG5rFE3T36If82BZ7fDYVenvihwoEi/3khfT1\nnX46YnmHMybEx+5bnFsxnQdNiDV3DHuVKLR8DqsXJwMVLWOJcD+7UqRaTYx/dJsT\ng/RUKiIjlSlA6lnsfp+mGhQ5iW+jA96I8dGjlXLhtbFpQyyQ0VxoXRm7eb+MibHY\n761l+/Sg/GsciJBATsBK\n-----END CERTIFICATE-----\n";
var realCrossCertCA3 = "-----BEGIN CERTIFICATE-----\nMIIGEDCCBPigAwIBAgICEB4wDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTYwMTA1\nMDgyMTA1WhcNMjYwMTA1MDgyMTA1WjBPMQswCQYDVQQGEwJLUjESMBAGA1UECgwJ\nQ3Jvc3NDZXJ0MRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFTATBgNVBAMMDENyb3Nz\nQ2VydENBMzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMQh+483jjVm\nmqoGaWKLZyz81MObZq94RIPwq1kEQUu46umnobZaOamnVxB9ggJfJV34ugY95zEI\nqNOcMRGYXSfySd5uDvPVstwOb4vuMQDdrsHtcbRMIESsq6By8jKAvVbYV9T+RFyy\n4TOCiRfzyAIZeZ9kyHLze2Q3bAjeHgPWA/M+F7MAMtKhx8IB4NUa83rJ1mY6t35E\n8L7i7QoCX8/w7hu+W6DU+DbZBUk10kDUZqMP28h9k0brRnmCr8pcleuuOjymwaWu\nBWDhSavWpXwY4vGNHg4HZvdDsEPEXTwveQY3SoceENdJDiSOMzXvebwJlJVWDvFD\nTueYrSkmS9cCAwEAAaOCAt8wggLbMIGOBgNVHSMEgYYwgYOAFMjQjsdJrh8gQrJL\nfxPJd1gMoc3BoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEuMCwG\nA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEWMBQG\nA1UEAwwNS0lTQSBSb290Q0EgNIIBATAdBgNVHQ4EFgQUQ9bzZX9lnc1rwc5zCr8y\nEKBR5xEwDgYDVR0PAQH/BAQDAgEGMIIBMQYDVR0gAQH/BIIBJTCCASEwggEdBgRV\nHSAAMIIBEzAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3IvcmNh\nL2Nwcy5odG1sMIHeBggrBgEFBQcCAjCB0R6Bzsd0ACDHeMmdwRyylAAgrPXHeMd4\nyZ3BHMeFssiy5AAoAFQAaABpAHMAIABjAGUAcgB0AGkAZgBpAGMAYQB0AGUAIABp\nAHMAIABhAGMAYwByAGUAZABpAHQAZQBkACAAdQBuAGQAZQByACAARQBsAGUAYwB0\nAHIAbwBuAGkAYwAgAFMAaQBnAG4AYQB0AHUAcgBlACAAQQBjAHQAIABvAGYAIAB0\nAGgAZQAgAFIAZQBwAHUAYgBsAGkAYwAgAG8AZgAgAEsAbwByAGUAYQApMC4GA1Ud\nEQQnMCWgIwYJKoMajJpECgEBoBYwFAwS7ZWc6rWt7KCE7J6Q7J247KadMBIGA1Ud\nEwEB/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjgYDVR0fBIGGMIGDMIGA\noH6gfIZ6bGRhcDovL2Rpci5jcm9zc2NlcnQuY29tOjM4OS9DTj1LSVNBLVJvb3RD\nQS00LE9VPUtvcmVhLUNlcnRpZmljYXRpb24tQXV0aG9yaXR5LUNlbnRyYWwsTz1L\nSVNBLEM9S1I/YXV0aG9yaXR5UmV2b2NhdGlvbkxpc3QwDQYJKoZIhvcNAQELBQAD\nggEBAFmykQiYoAVr8mceqWYw3sI4wQWCASRqLHnB7QnhhehzzLIK+E3q/7vct6T/\niToq8I5s6R2DqUZB6LuTQY0IJnM/EUBVANuGT044IuhiIs5er14f4YaX58Q96l7j\nbTWyed8OtR1dvS84kPTdSDpDKgrk+IEvS7M2rNXj/Kkb1rSXRgpvxpyEECCevcZO\ngrdNnP96Il/7O/XaBVYQJIRi7k4aY4PoLP+k58xAVu+9zlMwRFRMJ3+w+l1fECzD\nHzIkQGGh4LRdrjrUoYbxMr2USHpaWq/mfzrWymuJrhi/xTxSoWw1cWEcz7i+JnLS\nJaXjggr4rRrzo0ilz2mEDUj6MUc=\n-----END CERTIFICATE-----\n";
var realTradeSignCA3 = "-----BEGIN CERTIFICATE-----\nMIIGFzCCBP+gAwIBAgICEB8wDQYJKoZIhvcNAQELBQAwZDELMAkGA1UEBhMCS1Ix\nDTALBgNVBAoMBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0\naG9yaXR5IENlbnRyYWwxFjAUBgNVBAMMDUtJU0EgUm9vdENBIDQwHhcNMTYwMjI2\nMDIzNTA5WhcNMjYwMjI2MDIzNTA5WjBPMQswCQYDVQQGEwJLUjESMBAGA1UECgwJ\nVHJhZGVTaWduMRUwEwYDVQQLDAxBY2NyZWRpdGVkQ0ExFTATBgNVBAMMDFRyYWRl\nU2lnbkNBMzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANYyWa44JAH1\njOqVF3u4O4khr1K9hfZ7rkqLF6/Efbbhdvbcg3Mr29mz7rWemMhOvdwm3Dh2qVYM\nqD1K3tVaVALA93KbWzi54cDRg5jbbcgQqsg96B2ZqdbxgTdGXhPpPd+A8jJfdBr4\n95UUNUdEoM9lNi2hkFeVWCzC5z36IwOH9/vZOSz/hUkeHjtOeo4V17Iy64zQDy4q\n07kAM2rFzdApX8CnjhJHyK3JF/gQfi+9JYGVqgwVt8Crubeb3DKw3avDnVf3JPKe\nivaRxwftJm3Yr3Skzx8gJmkPdxTjIVbJrVFh1anm8OCJYD6ZPv18HPoxZPvmkfhh\nRh1pumT08LECAwEAAaOCAuYwggLiMIGOBgNVHSMEgYYwgYOAFMjQjsdJrh8gQrJL\nfxPJd1gMoc3BoWikZjBkMQswCQYDVQQGEwJLUjENMAsGA1UECgwES0lTQTEuMCwG\nA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkgQ2VudHJhbDEWMBQG\nA1UEAwwNS0lTQSBSb290Q0EgNIIBATAdBgNVHQ4EFgQUtQcjbFfPPq6OtTKBn5Gn\nINvo6+MwDgYDVR0PAQH/BAQDAgEGMIIBMQYDVR0gAQH/BIIBJTCCASEwggEdBgRV\nHSAAMIIBEzAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3IvcmNh\nL2Nwcy5odG1sMIHeBggrBgEFBQcCAjCB0R6Bzsd0ACDHeMmdwRyylAAgrPXHeMd4\nyZ3BHMeFssiy5AAoAFQAaABpAHMAIABjAGUAcgB0AGkAZgBpAGMAYQB0AGUAIABp\nAHMAIABhAGMAYwByAGUAZABpAHQAZQBkACAAdQBuAGQAZQByACAARQBsAGUAYwB0\nAHIAbwBuAGkAYwAgAFMAaQBnAG4AYQB0AHUAcgBlACAAQQBjAHQAIABvAGYAIAB0\nAGgAZQAgAFIAZQBwAHUAYgBsAGkAYwAgAG8AZgAgAEsAbwByAGUAYQApMDQGA1Ud\nEQQtMCugKQYJKoMajJpECgEBoBwwGgwY7ZWc6rWt66y07Jet7KCV67O07Ya17Iug\nMBIGA1UdEwEB/wQIMAYBAf8CAQAwDwYDVR0kAQH/BAUwA4ABADCBjwYDVR0fBIGH\nMIGEMIGBoH+gfYZ7bGRhcDovL2xkYXAudHJhZGVzaWduLm5ldDozODkvQ049S0lT\nQS1Sb290Q0EtNCxPVT1Lb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50\ncmFsLE89S0lTQSxDPUtSP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3\nDQEBCwUAA4IBAQCfvk0cqm1tyDuCC6Uqc5cFJ14aujinjeButBCiM1oa8A2GwCuK\nk6Mjr1m8V6mcx35ZTKUxpzJSQ+Dx2VzqLCskM5PShJuR1IG5lSobYXKsdjL4a+wy\n2fzQIafkEYg++y1Yte/g5VgXoSZPWL88EVt38NcRgGgRXf/cE/FBmwBpFcwkMe3o\n5AScjS5Lw8Af8ZH/YhOz6oIJzK1B7ph0b7PnNgYVKKdbID+MXMcXSOYg3R4uhrbk\nj1RUY4XxCE6phZN8llIoB//CwbDlZQZlf9K6gvTE+a/w4LofHpz/GbXWSBfiJB3o\ne9/Bx1Y4MA+6uR+KZiWUnDf2yW3W+V2bTEvn\n-----END CERTIFICATE-----\n";

// Test-CA 인증서 (2048)
var testCrossCertCA4  = "-----BEGIN CERTIFICATE-----\nMIIFdzCCBF+gAwIBAgIBAjANBgkqhkiG9w0BAQsFADBpMQswCQYDVQQGEwJLUjEN\nMAsGA1UECgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRo\nb3JpdHkgQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA2MB4XDTE1\nMDQxNzA2MjkxMloXDTI1MDQxNzA2MjkxMlowUzELMAkGA1UEBhMCS1IxEjAQBgNV\nBAoMCUNyb3NzQ2VydDEVMBMGA1UECwwMQWNjcmVkaXRlZENBMRkwFwYDVQQDDBBD\ncm9zc0NlcnRUZXN0Q0E0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA\nnpJMFkQZMbOfCnOOoZiGXwgCeXSnIpIilxjO2Pof43mQQbRXm7aJHMaIy9PackoJ\nC8XewKYmI972sdxw9XEhyNWc56FolTzNxlUhBXt519MPrQFxEqd99+vB5FhCHr0X\nlDzXZ6wlXPF4RfEdazKalVzhTNSB+UkQoXs0OIqYsjoTNhk7ZeND/3b5RFjl2Ueh\nLXhD+6ctfCam8CZrsoLjZ9W5V55GwtzC22Gu8SMRQs2N3vD4UJHyUQXMN/MMyHCQ\nFIqmNeuUUj6ME0JE+yNa8GQd/EZTQZlEa0JmB0MSWsDWcLY2cTSbpzMLqFnfEjo/\nCti1BkZYu6pfvCOSu4E66wIDAQABo4ICPjCCAjowgZMGA1UdIwSBizCBiIAUnAYk\nQIuJw3tP3B93sHc6e+oacqihbaRrMGkxCzAJBgNVBAYTAktSMQ0wCwYDVQQKDARL\nSVNBMS4wLAYDVQQLDCVLb3JlYSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eSBDZW50\ncmFsMRswGQYDVQQDDBJLaXNhIFRlc3QgUm9vdENBIDaCAQEwHQYDVR0OBBYEFKkd\nKPKr/3iAss+M2FC+rM8gbij8MA4GA1UdDwEB/wQEAwIBBjB8BgNVHSABAf8EcjBw\nMG4GBFUdIAAwZjAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3Iv\ncmNhL2Nwcy5odG1sMDIGCCsGAQUFBwICMCYeJMd0ACDHeMmdwRyylAAgwtzV2Map\nACDHeMmdwRzHhbLIsuQALjAzBgNVHREELDAqoCgGCSqDGoyaRAoBAaAbMBkMF+2V\nnOq1reyghOyekOyduOymnSjso7wpMBIGA1UdEwEB/wQIMAYBAf8CAQAwDwYDVR0k\nAQH/BAUwA4ABADCBmgYDVR0fBIGSMIGPMIGMoIGJoIGGhoGDbGRhcDovL3Rlc3Rk\naXIuY3Jvc3NjZXJ0LmNvbTozODkvQ049S2lzYS1UZXN0LVJvb3RDQS02LE9VPUtv\ncmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENlbnRyYWwsTz1LSVNBLEM9S1I/\nYXV0aG9yaXR5UmV2b2NhdGlvbkxpc3QwDQYJKoZIhvcNAQELBQADggEBAE0R+rtm\nqu1VdNavw7AtVYifbmF19DhIeD2bVfPfNpk9u0K5WvInSKK3w3K1LnDVFXYbiljA\npk7h5YDqjqCIFnJzjpghAEEtd0OszTrU12NjbguQc/5aWHDtdWHN/QvsB5P4obi4\nFiZxMlkPhx4v6I72pQ7RNMTZYJ/HR0rKzcMKbhpBQO7Qp4SqRxBwBhZ2eRZdw9+E\nZpg2fdg0JzE3fNKbdBdRdMVKMP/lJkVY8yOlPB6rIX/Hgv9baiw6kYrnBaBA4SSo\nr+4BPRM50+QKoVm2A8mMkET/F+RgeTbSalmCZOjGPHovMSN/YwLWm1Xkm7LIty6f\n6B/6UDaN9qccmMA=\n-----END CERTIFICATE-----\n";
var testSignGateFTCA4 = "-----BEGIN CERTIFICATE-----\nMIIFaTCCBFGgAwIBAgIBMDANBgkqhkiG9w0BAQsFADBpMQswCQYDVQQGEwJLUjEN\nMAsGA1UECgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRo\nb3JpdHkgQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA1MB4XDTEz\nMTIwNjA3MTYxOVoXDTE4MTIwNjA3MTYxOVowTTELMAkGA1UEBhMCS1IxDTALBgNV\nBAoMBEtJQ0ExFTATBgNVBAsMDEFjY3JlZGl0ZWRDQTEYMBYGA1UEAwwPc2lnbkdB\nVEUgRlRDQTA0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmPETn5J8\nNql8/LtsvbEfF0VZyRSrhFLxXMzqvkU/nkitekOu9GHsGJ6NQqywoct6dXIztUjX\nw56sZs2jtKgfohI5Z67NK+i4/ZdZnlDTzmwI2HZnc8rP6KT6qSlvk9QwT5PyhW63\nmYGGczc5q7SL91EdAIwwvyFpvyoGga455VFBLWp/5JFA6MwhbhxK5xqKBLQYyMFz\n1dJ+tfmkRMgCE4ferdkZ9yLnRFccCnRvNQ8GRspeHRqIRH+x00daW/2nWezNtMKW\nIKQKoNS6JS9NRHdP5HwxQ/duHPMMYn4gZ26axxN4fLN0qfjN1/HRGe2rnt4P6KFs\nN/7k3rt1KNkZrwIDAQABo4ICNjCCAjIwgZMGA1UdIwSBizCBiIAUNHiHacP1mzON\naqqqLo4PlL5XkQ6hbaRrMGkxCzAJBgNVBAYTAktSMQ0wCwYDVQQKDARLSVNBMS4w\nLAYDVQQLDCVLb3JlYSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0eSBDZW50cmFsMRsw\nGQYDVQQDDBJLaXNhIFRlc3QgUm9vdENBIDWCAQEwHQYDVR0OBBYEFFhGOKvE6iVQ\n0hj6LtrcnPb1ouvVMA4GA1UdDwEB/wQEAwIBBjB8BgNVHSABAf8EcjBwMG4GBFUd\nIAAwZjAwBggrBgEFBQcCARYkaHR0cDovL3d3dy5yb290Y2Eub3Iua3IvcmNhL2Nw\ncy5odG1sMDIGCCsGAQUFBwICMCYeJMd0ACDHeMmdwRyylAAgwtzV2MapACDHeMmd\nwRzHhbLIsuQALjAuBgNVHREEJzAloCMGCSqDGoyaRAoBAaAWMBQMEu2VnOq1reyg\nleuztOyduOymnTASBgNVHRMBAf8ECDAGAQH/AgEAMA8GA1UdJAEB/wQFMAOAAQAw\ngZcGA1UdHwSBjzCBjDCBiaCBhqCBg4aBgGxkYXA6Ly9jYXRlc3Quc2lnbmdhdGUu\nY29tOjM4OS9jbj1LSVNBIFRlc3RSb290Q0EgNSxvdT1Lb3JlYSBDZXJ0aWZpY2F0\naW9uIEF1dGhvcml0eSBDZW50cmFsLG89S0lTQSxjPUtSP2F1dGhvcml0eVJldm9j\nYXRpb25MaXN0MA0GCSqGSIb3DQEBCwUAA4IBAQCTPuO2qn6XC7buFSvpsUHFPpEV\npUHO7ywXDduqEN1QjUOtUoCwHJwdS96PIVSnhxww9R+jYzgabh3xtFESPD4WTcPx\nFVia+9FU6EPOIGMfKR1OGhkWsho25OTTPfuAwQvFP+7RhL/hNUQMhvZqDOA7V0SA\nd665sA/aQpAl9aOr9xgmHk80O8ea8KVyyZn0vaW27Y+mETouqryjy5+OBakfvxYF\nNQebsh/yDlm96hKokbJFeNrAzPcEZuqbC3TKtnFzQ9Uw/mEJLHgUISil+m+EuW4G\nHgyPhRhPOseJ30EZ48LMo2EhanZubQ0doD1TJi2OxO3QDAn3/lFaPnGJkM9r\n-----END CERTIFICATE-----\n";
var testSignKoreaCA3  = "-----BEGIN CERTIFICATE-----\nMIIFQzCCBCugAwIBAgIBNTANBgkqhkiG9w0BAQsFADBpMQswCQYDVQQGEwJLUjEN\nMAsGA1UECgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRo\nb3JpdHkgQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA1MB4XDTE0\nMTIxOTA2MzczM1oXDTE5MTIxOTA2MzczM1owVTELMAkGA1UEBhMCS1IxEjAQBgNV\nBAoMCVNpZ25Lb3JlYTEVMBMGA1UECwwMQWNjcmVkaXRlZENBMRswGQYDVQQDDBJT\naWduS29yZWEgVGVzdCBDQTMwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB\nAQCUq8MzX2vI86FOek0tfM+SnAMIOgluDRliPWtY2AkLy7gUDyIDq2slIEgByhkH\nzTyzKGyhRw6iXSYuw/TaAiWT1WKs69a8QL+UYXPF0ZoEc5mKhIC5/Cq/LjalCJ34\nGZ2cQRJVsNvhZyirJdwV2FBn/EvaLs9L/6gQdEmj87ynTVPuG4FR3ffWqPQ8OBk8\nJLsYaiWYwLpIz9xewDkssQToNmk47exQD/Uv3/9ceJc0ZE9Jp3ruQREM3bz/RQR8\nBmqd6jZ/7vEiZ255KtGbuRFPI0NvkqABBxYBck3zxuw5HBVJmgUo0Vae9DiWC0L5\nmNxBe2PrKPfxRkrEKWydSG2xAgMBAAGjggIIMIICBDCBkwYDVR0jBIGLMIGIgBQ0\neIdpw/WbM41qqqoujg+UvleRDqFtpGswaTELMAkGA1UEBhMCS1IxDTALBgNVBAoM\nBEtJU0ExLjAsBgNVBAsMJUtvcmVhIENlcnRpZmljYXRpb24gQXV0aG9yaXR5IENl\nbnRyYWwxGzAZBgNVBAMMEktpc2EgVGVzdCBSb290Q0EgNYIBATAdBgNVHQ4EFgQU\nDwQzIZ4ZO9CskEcekRndC+UMZ+UwDgYDVR0PAQH/BAQDAgEGMHwGA1UdIAEB/wRy\nMHAwbgYEVR0gADBmMDAGCCsGAQUFBwIBFiRodHRwOi8vd3d3LnJvb3RjYS5vci5r\nci9yY2EvY3BzLmh0bWwwMgYIKwYBBQUHAgIwJh4kx3QAIMd4yZ3BHLKUACDC3NXY\nxqkAIMd4yZ3BHMeFssiy5AAuMCoGA1UdEQQjMCGgHwYJKoMajJpECgEBoBIwEAwO\nKOyjvCnsvZTsiqTsvaQwEgYDVR0TAQH/BAgwBgEB/wIBADAPBgNVHSQBAf8EBTAD\ngAEAMG4GA1UdHwRnMGUwY6BhoF+GXWxkYXA6Ly8yMTEuMTc1LjgxLjEwMjo2ODkv\nQ049VEVTVC1ST09ULVJTQS1DUkwyLE9VPVJPT1RDQSxPPUtJU0EsQz1LUj9hdXRo\nb3JpdHlSZXZvY2F0aW9uTGlzdDANBgkqhkiG9w0BAQsFAAOCAQEAD65s+J6F/eSE\nSCeBip7Mh9bwnOHNX1c8dIghyc9ncWWOEo4B8TEVUA9fuCZGUiezLNLU55QpaRp0\n6aTMsHMdCkz++8av/SjNDJ6FcbIb3yJLH/bOs5XFrlxZsfkD5q/ugr4Wz13vhyfc\nsLjz5vhdRqGigMrpBRRDHGmBEjXmfHCEvAmuwMQes3CZhHBj2P1VpeJ7J6Ccucs7\naZGMSvRNkWES7TDe/c0hgrRFoU1r1qEpnAz9PgyXR9RNsHn/2xO6XlX1RdmgImlqDxpR0utuAaHt77s98tE6i5DwYCqp35aHtKgehPdIi5V7fj2IKdErhvxf7Paok0AzA/MC3bCdcQ==\n-----END CERTIFICATE-----\n";
var testTradeSign_2048 = "-----BEGIN CERTIFICATE-----\nMIIFeDCCBGCgAwIBAgIBGTANBgkqhkiG9w0BAQsFADBpMQswCQYDVQQGEwJLUjEN\nMAsGA1UECgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRo\nb3JpdHkgQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA1MB4XDTEx\nMDQwODAxMjMwN1oXDTE2MDQwODAxMjMwN1owVzELMAkGA1UEBhMCS1IxEjAQBgNV\nBAoMCVRyYWRlU2lnbjEVMBMGA1UECwwMQWNjcmVkaXRlZENBMR0wGwYDVQQDDBRU\ncmFkZVNpZ25DQTIwMTFUZXN0MjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBAOiizuoxk8dTTGbDd0CYf2Aq1YJmbB5Wg/LEhSBVHHOcB9IMuqCoIKzg+4BP\nQj0W9zEBud4cdvXPdoof3BSqzdSKHkj49H7cWT4SlHM36LdggB9xlwVodDmHrgiL\n9PPGioUjCSSz/Wa7gumYW9NR2CYlnaTjF+d30jESWWII5SB2TIu+rqHy577j9kcv\nFSZ7cNkRSXnotGfuvmKRyZUG7syK1I8zXumgmTHq2wrTKDuxpzTdMpWJdj/g/Wg4\ncqQeGx9rRkOJmEknQl7JTuOgvc3nrErWZEmp122Qrz+HWJq9qO0k3mJ1NpCc/Cxw\noL6Pm2EZKaASgbP2xTfjq//LbdkCAwEAAaOCAjswggI3MIGTBgNVHSMEgYswgYiA\nFDR4h2nD9ZszjWqqqi6OD5S+V5EOoW2kazBpMQswCQYDVQQGEwJLUjENMAsGA1UE\nCgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkg\nQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA1ggEBMB0GA1UdDgQW\nBBQHhJ7STY17e1qOdogFQUMa1wgnTjAOBgNVHQ8BAf8EBAMCAQYwfAYDVR0gAQH/\nBHIwcDBuBgRVHSAAMGYwMAYIKwYBBQUHAgEWJGh0dHA6Ly93d3cucm9vdGNhLm9y\nLmtyL3JjYS9jcHMuaHRtbDAyBggrBgEFBQcCAjAmHiTHdAAgx3jJncEcspQAIMLc\n1djGqQAgx3jJncEcx4WyyLLkAC4wOQYDVR0RBDIwMKAuBgkqgxqMmkQKAQGgITAf\nDB0o7KO8Ke2VnOq1reustOyXreygleuztO2GteyLoDASBgNVHRMBAf8ECDAGAQH/\nAgEAMA8GA1UdJAEB/wQFMAOAAQAwgZEGA1UdHwSBiTCBhjCBg6CBgKB+hnxsZGFw\nOi8vZGV2Y2EudHJhZGVzaWduLm5ldDozODkvQ049S0lTQS1Sb290Q0EtNSxPVT1L\nb3JlYS1DZXJ0aWZpY2F0aW9uLUF1dGhvcml0eS1DZW50cmFsLE89S0lTQSxDPUtS\nP2F1dGhvcml0eVJldm9jYXRpb25MaXN0MA0GCSqGSIb3DQEBCwUAA4IBAQAOx4Ct\nUiwFmZGKpnBrWGIHoDz+TrtiVZ5JZ/5MKh8ElEiQT8huKbyFmztuo4YlBg5QP4j8\nOQkicL0nNVGj7iI88UZR/ek3d9xph+2uyklnemJMxEyPTfvIPnjvrD/ij337f7xc\npAsGEHncdmVW1TkiU0zw9npA090y4JzAixI1U4Mmy8kt/pEercwzYOFYjExXZe4V\nTZfrvBOU5qyEsQcCP4xgyI6YSG5bzflGeUmEza84FcMJCSE4eQqON/bBv9JHFZSP\nhiM5CF6KusrrpEQ6hfrIH7U0EEoL74DyJqveJz3Q+T94nnJm3Z3lrkBaUoa01wXF\nhQ+Az+3nFahWtwFc\n-----END CERTIFICATE-----\n";
var testYessignClass3_2048 = "------BEGIN CERTIFICATE-----\nMIIFSTCCBDGgAwIBAgIBCDANBgkqhkiG9w0BAQsFADBpMQswCQYDVQQGEwJLUjEN\nMAsGA1UECgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRo\nb3JpdHkgQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA2MB4XDTE1\nMTIyMjA1MTMyNFoXDTI1MTIyMjA1MTMyNFowVzELMAkGA1UEBhMCa3IxEDAOBgNV\nBAoMB3llc3NpZ24xFTATBgNVBAsMDEFjY3JlZGl0ZWRDQTEfMB0GA1UEAwwWeWVz\nc2lnbkNBLVRlc3QgQ2xhc3MgMzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC\nggEBAMLQGMF8YsirEXeGkoOh+r/90pmYt0oc4gkgK/5vFyW6f9F0W9evJ9yqzUrE\niZ7gBkENKuv/xoOx70AALT9qYXnaWsIDYbrgfEFC5TyexKR3alWyuUQmsm/QDNgj\nNCMZ/3Xj4qc5DkOp86oj71x9g9sBg8tes4sH77Dm3qGNH0T83FnWjcNb+itqpliQ\n4UCRRp5aniAs1vmwhvxDmAobpnT0jgqnk5jvzo7McwF8BLFNTnhZXrejZx1orIRE\naIxHAAvlft5+1dW+66kkhlMNf3Uu1VLRs/o7s0OK+gIP39n7872Dm2bBm697l3tO\n+mGyMN8ari0aYMGTkfLuIzF/wwECAwEAAaOCAgwwggIIMIGTBgNVHSMEgYswgYiA\nFJwGJECLicN7T9wfd7B3OnvqGnKooW2kazBpMQswCQYDVQQGEwJLUjENMAsGA1UE\nCgwES0lTQTEuMCwGA1UECwwlS29yZWEgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkg\nQ2VudHJhbDEbMBkGA1UEAwwSS2lzYSBUZXN0IFJvb3RDQSA2ggEBMB0GA1UdDgQW\nBBRw+n2Dw0UfFJrv8Cg+E4xduwULlDAOBgNVHQ8BAf8EBAMCAQYwfAYDVR0gAQH/\nBHIwcDBuBgRVHSAAMGYwMAYIKwYBBQUHAgEWJGh0dHA6Ly93d3cucm9vdGNhLm9y\nLmtyL3JjYS9jcHMuaHRtbDAyBggrBgEFBQcCAjAmHiTHdAAgx3jJncEcspQAIMLc\n1djGqQAgx3jJncEcx4WyyLLkAC4wKwYDVR0RBCQwIqAgBgkqgxqMmkQKAQGgEzAR\nDA/quIjsnLXqsrDsoJzsm5AwEgYDVR0TAQH/BAgwBgEB/wIBADAPBgNVHSQBAf8E\nBTADgAEAMHEGA1UdHwRqMGgwZqBkoGKGYGxkYXA6Ly9zbm9vcHkueWVzc2lnbi5v\nci5rcjo2MDIwL2NuPUtJU0EtVEVTVC1BUkw1LG91PVJPT1RDQSxvPUtJU0EsYz1L\nUj9hdXRob3JpdHlSZXZvY2F0aW9uTGlzdDANBgkqhkiG9w0BAQsFAAOCAQEABFwX\nbGsEtqvSIKk+pJEAlW3YhwGdkucnzbTRH/Q4GH/cb8NXYSGN4UuS0aMaYBuxwaTt\n3SOsFmvf3dMO97v61SEUYqayvab8FvKoLrm34LdIjYgqeDxikJD7TzblVnDvlT4P\nVxxUPdoh0zN7YLbgn63m2op5QjM0es9grlF2wP8efAnQuql1sS5sBB+hEwmDhNvl\nfhFFU+9k87yezoomxwjp/4FnpIaoxeOLto3/O2g2uvlrOzr+d7TEv2qbCINNjE35\nwZg+6o2jU+mb+SKFGbIlpvde6bYqkqSm4UiH1oJG3vpiuKMYi3k6LFX9/URfd+k0\nw44fgzf04brWwP49XA==\n-----END CERTIFICATE-----\n";


// Real-CA 인증서 목록 (2048)
var real2048CACert = "";
real2048CACert += realSignKorea_2048;
real2048CACert += realYessign_2048;
real2048CACert += realCrossCert_2048;
real2048CACert += realTradeSign_2048;
real2048CACert += realSignGate_2048;
real2048CACert += realSignKorea_CA3;		//한국증권전산(코스콤)
real2048CACert += realSignGate_CA5;			//한국정보인증
real2048CACert += realCrossCertCA3;			//한국전자인증
real2048CACert += realTradeSignCA3;			//한국무역정보통신
real2048CACert += realYessignClass2_2048;

// Test-CA 인증서 목록 (2048)
var test2048CACert = "";
test2048CACert += testCrossCertCA4;
test2048CACert += testSignGateFTCA4;
test2048CACert += testSignKoreaCA3;
test2048CACert += testTradeSign_2048;
test2048CACert += testYessignClass3_2048;

// FilterCert Real 인증서 IssuerDN
var realIssuerSignKoreaCA2 = "IssuerDN=CN=SignKorea CA2,OU=AccreditedCA,O=SignKorea,C=KR";
var realIssuerYesSignCAClass1 = "IssuerDN=CN=yessignCA Class 1,OU=AccreditedCA,O=yessign,C=kr";
var realIssuerCrossCertCA2 = "IssuerDN=CN=CrossCertCA2,OU=AccreditedCA,O=CrossCert,C=KR";
var realIssuerTradeSignCA2 = "IssuerDN=CN=TradeSignCA2,OU=AccreditedCA,O=TradeSign,C=KR";
var realIssuerSignGATECA4 = "IssuerDN=CN=signGATE CA4,OU=AccreditedCA,O=KICA,C=KR";
var realIssuerYessignCAClass2 = "IssuerDN=CN=yessignCA Class 2,OU=AccreditedCA,O=yessign,C=kr";
var realIssuerSignKoreaCA3 = "IssuerDN=CN=SignKorea CA3,OU=AccreditedCA,O=SignKorea,C=KR";
var realIssuerSignGATECA5 = "IssuerDN=CN=signGATE CA5,OU=AccreditedCA,O=KICA,C=KR";
var realIssuerCrossCertCA3 = "IssuerDN=CN=CrossCertCA3,OU=AccreditedCA,O=CrossCert,C=KR";
var realIssuerTradeSignCA3 = "IssuerDN=CN=TradeSignCA3,OU=AccreditedCA,O=TradeSign,C=KR";


// FilterCert Test 인증서 IssuerDN
var testIssuerCrossCertCA3 = "IssuerDN=CN=CrossCertTestCA3,OU=AccreditedCA,O=CrossCert,C=KR";
var testIssuerSignGateFTCA4 = "IssuerDN=CN=signGATE FTCA04,OU=AccreditedCA,O=KICA,C=KR";
var testIssuerSignKoreaCA3 = "IssuerDN=CN=SignKorea Test CA3,OU=AccreditedCA,O=SignKorea,C=KR";
var testIssuerTradeSign = "IssuerDN=CN=TradeSignCA2011Test2,OU=AccreditedCA,O=TradeSign,C=KR";
var testYessignClass2 = "IssuerDN=CN=yessignCA-Test Class 2,OU=AccreditedCA,O=yessign,C=kr";
var testYessignClass3 = "IssuerDN=CN=yessignCA-Test Class 3,OU=AccreditedCA,O=yessign,C=kr";

var pipe = "|";

var realIssuerDN = "";
realIssuerDN += realIssuerSignKoreaCA2 + pipe;
realIssuerDN += realIssuerYesSignCAClass1 + pipe;
realIssuerDN += realIssuerCrossCertCA2 + pipe;
realIssuerDN += realIssuerTradeSignCA2 + pipe;
realIssuerDN += realIssuerSignGATECA4 + pipe;
realIssuerDN += realIssuerYessignCAClass2 + pipe;
realIssuerDN += realIssuerSignKoreaCA3 + pipe;
realIssuerDN += realIssuerSignGATECA5 + pipe;
realIssuerDN += realIssuerCrossCertCA3 + pipe;
realIssuerDN += realIssuerTradeSignCA3;

var testIssuerDN = "";
testIssuerDN += testIssuerCrossCertCA3 + pipe;
testIssuerDN += testIssuerSignGateFTCA4 + pipe;
testIssuerDN += testIssuerSignKoreaCA3 + pipe;
testIssuerDN += testIssuerTradeSign + pipe;
testIssuerDN += testYessignClass2 + pipe;
testIssuerDN += testYessignClass3;

var realCA = {
		//금결원
		'NPKI' : { realSignKorea : realSignKorea_2048,
				   realYessign:  realYessign_2048,
				   realCrossCert: realCrossCert_2048,
				   realTradeSign: realTradeSign_2048,
				   realSignGate : realSignGate_2048,
				   realSignKorea3 : realSignKorea_CA3,
				   realSignGate5 : realSignGate_CA5,
				   realCrossCert3 : realCrossCertCA3,
				   realTradeSign3 : realTradeSignCA3,
				   realYessignClass2 : realYessignClass2_2048
		},

		//행자부
		'GPKI' : {
		},

		// 국방부
		'MPKI' : {
		},

		// 교육부
		'EPKI' : {
		},
		//
		'PPKI' : {
		}
	};


var testCA = {
		// 금결원
		'NPKI' : { testCrossCert : testCrossCertCA4,
				   testSignGate:  testSignGateFTCA4,
				   testSignKorea: testSignKoreaCA3,
				   testTradeSign: testTradeSign_2048,
				   testYessignClass3 : testYessignClass3_2048

		},
		//행자부
		'GPKI' : {
		},

		// 국방부
		'MPKI' : {
		},

		// 교육부
		'EPKI' : {
		},
		//
		'PPKI' : {
		}
	};


/************************************************************
 * @brief		CA 인증서 목록
 ************************************************************/
var CACert;

// CA 인증서 목록:개발 서버 (Real + Test)
if (window.location.host == CW_DEV_HOST) {
	CACert = real2048CACert + test2048CACert;

	// CA 인증서 목록: 테스트 서버 (Real + Test)
} else if (window.location.host == CW_TEST_HOST) {
	CACert = real2048CACert + test2048CACert;

	// CA 인증서 목록: 운영 서버 (Real)
} else if (window.location.host == CW_REAL_HOST) {
	CACert = real2048CACert;

	// CA 인증서 목록: 기타 (Real + Test)
} else {
	CACert = real2048CACert + test2048CACert;
}

// IssuerDN 필터 목록
var IssuerDNFilter;

// CA 인증서 목록:개발 서버 (Real + Test)
if (window.location.host == CW_DEV_HOST) {
	IssuerDNFilter = realIssuerDN + pipe + testIssuerDN;

	// CA 인증서 목록: 테스트 서버 (Real + Test)
} else if (window.location.host == CW_TEST_HOST) {
	IssuerDNFilter = realIssuerDN + testIssuerDN;

	// CA 인증서 목록: 운영 서버 (Real)
} else if (window.location.host == CW_REAL_HOST) {
	IssuerDNFilter = realIssuerDN;

	// CA 인증서 목록: 기타 (Real + Test)
} else {
	IssuerDNFilter = realIssuerDN + testIssuerDN;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 여기부터 새로 정의한 인터페이스 함수
//
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



IniSafeCrossWebEx = function() {

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		기본옵션을 정의한다.
	*/
	var baseOption = {
		isHtml5		: true,		// 필수
		urlEnc		: true,		// 필수
		certUIMode	: "no",		// "list", "text", "no"
		iniCache	: false,
		viewType	: "GRID",	// "GRID", "TEXT", "PAGE", "NONE"
		filterCertByIssuer : {enable:false}		//true: IssuerDN 필터실행, false : 미실행
	};


	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		초기화
	*/
	(function init() {
		baseOption.isHtml5 = baseOption.isHtml5 && GINI_supportHtml5() ? true : false;
	})();


	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		'name'='value' 형태의 data배열 생성

		@param		option.targetFormName
		@param		option.targetFieldCss
	*/
	function makeData(option) {

		if (typeof option !== "object" || typeof option === "undefined")
			return null;

		if (typeof option.targetFormName === "undefined"  || typeof option.targetFieldCss === "undefined")
		{
			if ( "undefined" === option.data)
				return null;

			return option.data;
		}

		var targetForm = document.getElementsByName(option.targetFormName)[0];

		if (!targetForm) return;

		var targetElems = targetForm.getElementsByClassName(option.targetFieldCss);
		var postDataArr = [];

		for (var i = 0 ; i <= targetElems.length - 1; i++){

			if (targetElems[i].tagName !== "INPUT" && targetElems[i].tagName !== "SELECT") continue;

			if (targetElems[i].tagName === "INPUT" && targetElems[i].type === "file") {
				/*
				 * 파일의 경우 처리 방식이 업무 쪽과 연동되기 때문에  논의 필요
				 * (예) 파일을 읽어들인 후 base64 인코딩한 후, 원문 데이타에 포함
				 */
			} else {
				if (targetElems[i].getAttribute("name")) {
					postDataArr.push(targetElems[i].getAttribute("name") + "=" + targetElems[i].getAttribute("value"));
				}
			}
		}

		if (postDataArr.length > 0) {
			return option.urlEnc ? encodeURIComponent(postDataArr.join('&')) : postDataArr.join('&');
		} else {
			return null;
		}
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		기본옵션값에 추가된 옵션값을 merge한다.

		@param		addOption
	*/
	function mergeOption(addOption) {

		var retOption = clone(baseOption);

		for (prop in addOption)
		{
			if (addOption.hasOwnProperty(prop))
			{
				retOption[prop] = addOption[prop];
			}
		}

		return retOption;
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		설정값에 따른 필요함수 호출

		@param		option.isHtml5
		@param		option.iniCache
		@param		option.filterCertByIssuer
		@param		option.langType
		@param		option.html5Lang
		@param		option.csLang
		@param		option.viewType
		@param		option.plainTextViewType
		@param		option.certUIMode
		@param		option.customBannerURL
		@param		option.useBanner
		@param 		option.readyCallback
	*/
	function setPreEnv(option) {		
		return new RSVP.Promise(function(mainResolve, mainReject) {		
			
			// 모듈로드대기
			var waitModuleLoadPromise = function() {
				return new RSVP.Promise(function(resolve, reject) {		
					
					function waitCWUI() {
						if ( true === GINI_DYNAMIC_LOAD.isCompleted() && true === GINI_DYNAMIC_LOAD.isThirdPartyCompleted() ) {
							if ( 'function' === typeof option.readyCallback )
								option.readyCallback();			
							
							setTimeout(function() {
								resolve();
							}, 500);							
						} else {
							setTimeout(function() {								
								waitCWUI();
							},200);
						}	
					}
					waitCWUI();
				});
			};
	
			// 캐쉬초기화
			var setCachePromise = function() {
				return new RSVP.Promise(function(resolve, reject) {		
					if ( 'undefined' !== typeof option.iniCache && true === option.iniCache ) {
						if ( option.isHtml5 ) {
							Html5Adaptor.InitCache(resolve);								
						} else {
							// 설치 체크 대기
							//var callback = 'undefined' === option.iniCache.callback ? null : option.iniCache.callback;
							cwModuleInstallWait(function () {
								CrossWebExWeb6.InitCache(function(){								
									resolve();
								});
							});
						}	
					} else {
						resolve();
					}
				});
			};		
			
			// IssuerDN 필터 설정
			var setFilterCertByIssuerPromise = function() {
				return new RSVP.Promise(function(resolve, reject) {							
					if ( 'undefined' !== typeof option.filterCertByIssuer &&
						 'undefined' !== typeof option.filterCertByIssuer.enable &&
								true === option.filterCertByIssuer.enable ) {

						var issuerAndSerial = IssuerDNFilter;

						if ( 'undefined' !== typeof option.filterCertByIssuer.list && '' !== option.filterCertByIssuer.list ) {
							issuerAndSerial = option.filterCertByIssuer.list;
						}

						if ( option.isHtml5 ) {
							// 없음
							resolve();
						} else {
							cwModuleInstallWait(function () {
								CrossWebExWeb6.FilterCert('', issuerAndSerial, function(){									
									resolve();
								});
							});
						}
					} else {
						resolve();
					}					
				});
			};
			
			// 언어 치환
			var setLangPromise = function() {
				return new RSVP.Promise(function(resolve, reject) {							
					if ( 'undefined' !== typeof option.langType ) {
						setLang(option.langType, option.isHtml5, function() {							
							resolve();
						});
					} else
						resolve();
				});
			};
			
			// HTML5 언어설정
			var setHtml5LangPromise = function() {
				return new RSVP.Promise(function(resolve, reject) {		
					if ( 'undefined' !== typeof option.html5Lang && true === option.isHtml5 ) {					
						setHtml5Lang(option.html5Lang);
					}
					resolve();
				});
			};
			
			// CS 언어설정
			var setCsLangPromise = function() {
				return new RSVP.Promise(function(resolve, reject) {		
					if ( 'undefined' !== typeof option.csLang && false === option.isHtml5 ) {
						setCsLang(option.csLang, function() {
							resolve();
						});
					} else 
						resolve();
						
				});
			};
			
			// 전자서명 원문영역 view 스타일
			var setSignViewTypePromise = function() {
				return new RSVP.Promise(function(resolve, reject) {					
					
					if ( 'undefined' !== typeof option.viewType )
					{
						var viewType = option.viewType.toUpperCase();

						if ( option.isHtml5 ) {
							option.plainTextViewType = viewType;
						} else {
							//CS UI의 경우 값을 setproperty에 맞게 치환
							if ( "NONE" === viewType ) {
								option.certUIMode = "no";
							} else if ( "GRID" === viewType ||
										"PAGE" === viewType ) {
								option.certUIMode = "list";
							} else {
								option.certUIMode = "text";
							}
						}
					}
							
					// 전자서명 HTML5 뷰 
					if ( 'undefined' !== typeof option.plainTextViewType )
					{
						var plainTextViewType = option.plainTextViewType.toUpperCase();

						if ( "NONE"   === plainTextViewType ||
							 "GRID"   === plainTextViewType ||
							 "PAGE"   === plainTextViewType ||
							 "TEXT"   === plainTextViewType ) {
							INI_PLAINTEXT_VIEW_HANDLER.setPlaintextViewType(plainTextViewType);
						}
					}
					
					// 전자서명 CS 뷰
					if ( 'undefined' !== typeof option.certUIMode )
					{
						var certUIMode = option.certUIMode.toLowerCase();

						if ( ("no"   === certUIMode ||
							  "list" === certUIMode ||
							  "text" === certUIMode) &&
							   false === option.isHtml5 ) {
							setProperty("certmanui_SelectCertUIMode", certUIMode, function(){									
								resolve();
							});
						} else
							resolve();
					} else 
						resolve();
				});
			};
			
			// 순차적으로 실행한다.			
			waitModuleLoadPromise().then(function() {
				return setCachePromise();
			}).then(function() {
				return setFilterCertByIssuerPromise();
			}).then(function() {
				return setLangPromise();
			}).then(function() {
				return setHtml5LangPromise();
			}).then(function() {
				return setCsLangPromise();
			}).then(function() {
				return setSignViewTypePromise();
			}).then(function() {				
				// 배너 URL 설정
				if ( 'undefined' !== typeof option.customBannerURL )
				{
					INI_CUSTOM_BANNER_HANDLE.setCustomBannerUrl(option.customBannerURL);
				}

				// 배너 오픈 유무
				if ( 'undefined' !== typeof option.useBanner )
				{
					if ( true  === option.useBanner ||
						 false === option.useBanner ) {
						INI_CUSTOM_BANNER_HANDLE.setBannerUseYN(option.useBanner);
					}
				}			

				mainResolve();				
			}).catch(console.log.bind(console));					
		});			
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		언어설정관련..(setLang, setHtml5Lang, setCsLang)

		@param		langType
		@param		isHtml5
		@param		callback
	*/
	function setLang(langType, isHtml5, callback) {

		if ( 'undefined' !== typeof langType )
		{
			if ( 'undefined' !== typeof isHtml5 ) {
				if ( isHtml5 ) {					
					setHtml5Lang(langType);
					
					if ( 'function' ===  typeof callback )
						callback();
				}
				else 
					setCsLang(langType, callback);
			} else {
			
				if ( baseOption.isHtml5 ) {
					setHtml5Lang(langType);
					
					if ( 'function' ===  typeof callback )
						callback();
				}
				else
					setCsLang(langType, callback);
			}
		}
	}
	
	function setHtml5Lang(langType) {

		if ( 'undefined' !== typeof langType )
		{
			langType = langType.toLowerCase();		

			if ( "kor" === langType ||
				 "eng" === langType ) {				
				INI_LANGUAGE_HANDLE.setSystemLanguage(langType);
			}
		}
	}

	function setCsLang(langType, callback) {
		
		if ( 'undefined' !== typeof langType )
		{
			langType = langType.toLowerCase();			

			if ( "off" === langType ||
				 "kor" === langType ||
				 "chn" === langType ||
				 "eng" === langType ) {
				setProperty("certmanui_language", langType, callback);
			} 
		}			
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		deep copy

		@param		object
	*/
	function clone(obj) {

		if ( null === obj || 'object' !== typeof obj )
			return obj;

		var cloneObj = obj.constructor();

		for (var prop in obj )
		{
			if (obj.hasOwnProperty(prop))
			{
				cloneObj[prop] = clone(obj[prop]);
			}
		}

		return cloneObj;
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		정책 설정

		@param		name		이름
		@param		value		값
		@param		callback	콜백함수
	*/
	function setProperty(name, value, callback) {

		// 설치 체크 대기
		cwModuleInstallWait(function () {			
			CrossWebExWeb6.SetProperty(name, value, callback);
		});
	}

	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		프로세스 공유 속성 설정

		@param		name		이름
		@param		value		값
		@param		callback	콜백함수
	*/
	function setSharedAttribute(name, value, callback) {
		
		// 설치 체크 대기
		cwModuleInstallWait(function () {
			CrossWebExWeb6.setSharedAttribute(name, value, callback);
		});
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////
	/*
		@private
		@brief		확장 함수

		@param		name		이름
		@param		value		값
		@param		callback	콜백함수
	*/
	function extendMethod(name, value, callback) {

		// 설치 체크 대기
		cwModuleInstallWait(function () {
			CrossWebExWeb6.ExtendMethod(name, value, callback);
		});
	}


	var Func = function() {}

	Func.prototype = {

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		언어설정

			@param		option.langType			["kor","eng", "chn"..]
			@param		option.isHtml5			
			@param		option.processCallback
		*/
		setLanguage : function(option) {

			setLang(langType, isHtml5, processCallback);
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		로그인

			@param		option.loginType			["sign"(전자서명), "enc"(암호화)]

			@param		option.data
						or
			@param		option.targetFormName
			@param		option.targetFieldCss

			@param		option.readForm				loginType : "enc" 일때 필수 입력
			@param		option.sendForm				loginType : "enc" 일때 필수 입력
			@param		option.processCallback		콜백함수
			@param		option.isCmp
			@param		option.isInnerView
			@param		option.vid					loginType : "sign" 일때 필수 입력(true/false)
		*/
		login : function(option) {

			if ( 'undefined' === typeof option.loginType ) {
				return;
			}

			if ( "sign" === option.loginType && 'undefined' === option.vid) {
				return;
			}

			option = mergeOption(option);			
			var data = makeData(option);
									
			var doLogin = function() {				
				if ( "sign" === option.loginType )
				{
					if ( option.isHtml5 ) {
						if ( true === option.vid ) {
							Html5Adaptor.PKCS7SignedLogin(
								data,
								option.processCallback,
								data,
								option.isCmp
							);
						} else {
							Html5Adaptor.PKCS7SignedDataSign(
								data,
								option.processCallback,
								data,
								option.isInnerView
							);
						}
					} else {
						if ( true === option.vid ) {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignVID(
									data,
									option.processCallback,
									data
								);
							});
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignedData(
									data,
									option.processCallback,
									data
								);
							});
						}
					}
				}
				else if ( "enc" === option.loginType )
				{
					if ( option.isHtml5 ) {
						Html5Adaptor.EncFormVerify2(
							option.readForm,
							option.sendForm,
							option.processCallback,
							data
						);
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.EncFormVerify2(
								option.readForm,
								option.sendForm,
								option.processCallback,
								data
							);
						});
					}
				}
			};

			setPreEnv(option).then(function(){
				doLogin();
			}).catch(console.log.bind(console));
			
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		전자서명

			@param		option.signType				["P7", "yessignP7", "noplainP7", "base64decP7", "pdf"]
			@param		option.targetType			["data", "form"]
			@param		option.form					only targetType="form"

			@param		option.data
						or
			@param		option.targetFormName
			@param		option.targetFieldCss

			@param		option.processCallback
			@param		option.isInnerView
			@param		option.vid
			@param		option.isCmp

			// 전자서명+암호화는 API내에서 해결하지 않고, API 조합하여 하도록..
		*/
		sign : function(option) {

			// 필수 option 체크
			if ( 'undefined' === typeof option.signType ||
				 'undefined' === typeof option.targetType ) {
				return;
			}

			option = mergeOption(option);			
			var data = makeData(option);
														
			var initCachePromise = function() {
			
				return new RSVP.Promise(function(resolve, reject) {					
					extendMethod("InitCache", "on", resolve);
				});
			};
			
			var BTInitP7MsgPromise = function() {
			
				return new RSVP.Promise(function(resolve, reject) {					
					var BTInitP7MsgValue = "0";
				
					if ( "yessignP7" === option.signType )
						BTInitP7MsgValue = "1";
								
					setSharedAttribute("BTInitP7Msg", BTInitP7MsgValue, resolve);
				});
			};
			
			var P7SignDataBase64DecPromise = function() {
			
				return new RSVP.Promise(function(resolve, reject) {					
					if ( "noplainP7" === option.signType ) 
						setProperty("P7SignDataNoPlain", "true", resolve);					
					else if ( "base64decP7" === option.signType )
						setProperty("P7SignDataBase64Dec", "true", resolve);	
					else
						resolve();
				});
			};
																																					
			var doSign = function() {
				if ( "data" === option.targetType )
				{					
					if ( ("P7" === option.signType && 'undefined' !== typeof option.vid && false === option.vid) ||
						"noplainP7" === option.signType ||
						"base64decP7" === option.signType )
					{
						if ( option.isHtml5 ) {
							Html5Adaptor.PKCS7SignedDataSign(
								data,
								option.processCallback,
								data,
								option.isInnerView
							);
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignedData(
									data,
									option.processCallback,
									data
								);
							});
						}
					}
					else if ( "P7" === option.signType && 'undefined' !== typeof option.vid && true === option.vid )
					{
						if ( option.isHtml5 ) {
							Html5Adaptor.PKCS7SignedDataSign(
								data,
								option.processCallback,
								data,
								option.isInnerView
							);
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignVID(
									data,
									option.processCallback,
									data
								);
							});
						}
					}
					else if ( "yessignP7" === option.signType )
					{
						if ( option.isHtml5 ) {
							Html5Adaptor.PKCS7YesSignData(
								data,
								option.processCallback,
								data
							);
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignedData(
									data,
									option.processCallback,
									data
								);
							});
						}
					}
					else if ( "pdf" === option.signType )
					{
						if ( option.isHtml5 ) {
							Html5Adaptor.PKCS7PDFSignData(
								data,
								option.processCallback,
								data
							);
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignedDataWithMD(
									data,
									option.processCallback,
									data
								);
							});
						}
					}
				}
				else if ( "form" === option.targetType )
				{
					if ( ("P7" === option.signType && 'undefined' !== typeof option.vid && false === option.vid) ||
						"yessignP7" === option.signType ||
						"noplainP7" === option.signType ||
						"base64decP7" === option.signType )
					{
						if ( option.isHtml5 ) {
							Html5Adaptor.PKCS7SignedDataForm(
								option.form,
								data,
								option.processCallback,
								data,
								option.isInnerView
							);
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignedDataForm(
									option.form,
									data,
									option.processCallback,
									data
								);
							});
						}
					}
					else if ( "P7" === option.signType && 'undefined' !== typeof option.vid && true === option.vid )
					{
						if ( option.isHtml5 ) {
							Html5Adaptor.PKCS7SignVIDFormLogin(
								option.form,
								data,
								option.processCallback,
								data,
								option.isCmp
							);
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignVIDForm(
									option.form,
									data,
									option.processCallback,
									data
								);
							});
						}
					}
					else if ( "pdf" === option.signType )
					{
						if ( option.isHtml5 ) {
							// 없음
						} else {
							// 설치 체크 대기
							cwModuleInstallWait(function () {
								CrossWebExWeb6.PKCS7SignedDataWithMDForm(
									option.form,
									data,
									option.processCallback,
									data
								);
							});
						}
					}
				}
			};
										
			setPreEnv(option).then(function() {
				if ( false === option.isHtml5 ) {
					initCachePromise().then(function() {
						return BTInitP7MsgPromise();
					}).then(function() {
						return P7SignDataBase64DecPromise();
					}).then(function() {
						doSign();
					}).catch(console.log.bind(console));									
				} else {
					doSign();
				}				
			}).catch(console.log.bind(console));				
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		다건 전자서명

			@param		option.signType	
			@param		option.form
			@param		option.dataArr
			@param		option.processCallback
			@param		option.vid
			@param		option.isInnerView
		*/
		multiSign : function(option) {
			
			// 필수 option 체크
			if ( 'undefined' === typeof option.signType ) {
				return;
			}

			option = mergeOption(option);			
									
			var initCachePromise = function() {			
				return new RSVP.Promise(function(resolve, reject) {					
					extendMethod("InitCache", "on", resolve);
				});
			};
			
			var BTInitP7MsgPromise = function() {
			
				return new RSVP.Promise(function(resolve, reject) {					
					var BTInitP7MsgValue = "0";
				
					if ( "yessignP7" === option.signType )
						BTInitP7MsgValue = "1";
								
					setSharedAttribute("BTInitP7Msg", BTInitP7MsgValue, resolve);
				});
			};
			
			var doMultiSign = function() {				
				var MULTI_DELIMITER = cwui.defaultConf.Signature.MultiDelimiter;				

				if ( option.isHtml5 ) {
					// 문자열
					var data = '';

					if ( 'string' !== typeof option.dataArr ) {
						var temp = '';

						for ( var i=0; i<option.dataArr.length; i++ ) {
							if ( '' === temp ) {
								temp = option.dataArr[i];
							} else {
								temp += MULTI_DELIMITER + option.dataArr[i];
							}
						}

						if ( '' !== temp ) {
							data = temp;
						}
					} else {
						data = option.dataArr;
					}
					
					if ( "P7" === option.signType ) {
						Html5Adaptor.PKCS7SignedDataSignMulti(
							option.form,
							data,	// String
							option.processCallback,
							data,
							option.isInnerView
						);						
					} else if ( "yessignP7" === option.signType ) {
						Html5Adaptor.PKCS7YesSignDataMulti(
							option.form,
							data,	// String
							option.processCallback,
							data							
						);
					}
						
				} else {
					// 배열
					var dataArr;

					if ( 'string' === typeof option.dataArr ) {
						dataArr = option.dataArr.split(MULTI_DELIMITER);

					} else {
						dataArr = option.dataArr;
					}

					var viewStr = '';

					for ( var i=0; i<dataArr.length; i++ ) {
						if ( '' !== viewStr ) {
							viewStr += '&';
						}

						viewStr += '#' + parseInt(i+1) + '= &';	// 각 원문을 구분한다.(변경가능)
						viewStr += dataArr[i];
					}

					dataArr.unshift(viewStr);	// 맨 앞에 조립된 원문을 넣어준다.(CS 화면표시용)

					if ( true === option.vid ) {
						cwModuleInstallWait(function () {
							CrossWebExWeb6.PKCS7SignedDataWithVIDMultiFormV2(
								option.form,
								dataArr,	// Array
								option.processCallback
							);
						});
					} else if ( false === option.vid ) {
						cwModuleInstallWait(function () {
							CrossWebExWeb6.PKCS7SignedDataMultiFormV2(
								option.form,
								dataArr,	// Array
								option.processCallback
							);
						});
					}
				}
			};

			setPreEnv(option).then(function() {
				if ( false === option.isHtml5 ) {
					initCachePromise().then(function() {
						return BTInitP7MsgPromise();
					}).then(function() {
						doMultiSign();
					}).catch(console.log.bind(console));									
				} else {
					doMultiSign();
				}				
			}).catch(console.log.bind(console));	
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		암호화

			@param		option.targetType			["data", "form"]
			@param		option.readForm
			@param		option.sendForm
			@param		option.processCallback

			@param		option.targetFormName
			@param		option.targetFieldCss
						or
			@param		option.data
		*/
		enc : function(option) {

			if ( 'undefined' === typeof option.targetType ) {
				return;
			}

			option = mergeOption(option);			
			var data = makeData(option);
						
			var doEnc = function() {
				if ( "data" === option.targetType )
				{
					if ( option.isHtml5 ) {
						// 없음
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.EncParams(
								data,
								option.processCallback,
								data
							);
						});
					}
				}
				else if ( "form" === option.targetType )
				{
					if ( option.isHtml5 ) {
						Html5Adaptor.EncForm2(
							option.readForm,
							option.sendForm,
							option.processCallback,
							data
						);
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.EncForm2(
								option.readForm,
								option.sendForm,
								option.processCallback,
								data
							);
						});
					}
				}
			};
			
			setPreEnv(option).then(function(){
				doEnc();
			}).catch(console.log.bind(console));	
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 발급

			@param		option.caName				발급기관
			@param		option.szRef       			참조코드
			@param		option.szCode        		인가코드
			@param		option.processCallback    	인증서 발급 콜백함수
		*/
		issueCertificate : function(option) {

			option = mergeOption(option);
			
			var doIssueCertificate = function() {
				if ( option.isHtml5 ) {
					Html5Adaptor.IssueCertificate(
						option.caName,
						option.szRef,
						option.szCode,
						option.processCallback
					);
				} else {
					// 설치 체크 대기
					cwModuleInstallWait(function () {
						CrossWebExWeb6.IssueCertificate(
							option.caName,
							option.szRef,
							option.szCode,
							option.processCallback
						);
					});

				}
			};

			setPreEnv(option).then(function(){
				doIssueCertificate();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		이니텍 인증서 발급

			@param		option.szRef       			참조코드
			@param		option.szCode        		인가코드
			@param		option.processCallback    	인증서 발급 콜백함수
		*/
		issueCertificate_INITECH : function(option) {

			option = mergeOption(option);
			
			var doIssueCertificate_INITECH = function() {
				if ( false === option.isHtml5 ) {
					// 설치 체크 대기
					cwModuleInstallWait(function () {
						CrossWebExWeb6.INITECHCA_IssueCertificate(
							option.szRef,
							option.szCode,
							option.processCallback
						);
					});
				}
			};

			setPreEnv(option).then(function(){
				doIssueCertificate_INITECH();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 재발급

			@param		option.caName				발급기관
			@param		option.szRef       			참조코드
			@param		option.szCode        		인가코드
			@param		option.processCallback    	인증서 재발급 콜백함수
		*/
		reissueCertificate : function(option) {

			option = mergeOption(option);
			
			var doReissueCertificate = function() {
				if ( option.isHtml5 ) {
					Html5Adaptor.ReIssueCertificate(
						option.caName,
						option.szRef,
						option.szCode,
						option.processCallback
					);
				} else {
					// 설치 체크 대기
					cwModuleInstallWait(function () {
						CrossWebExWeb6.ReIssueCertificate(
							option.caName,
							option.szRef,
							option.szCode,
							option.processCallback
						);
					});
				}
			};

			setPreEnv(option).then(function(){
				doReissueCertificate();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 갱신

			@param		option.caName				발급기관
			@param		option.processCallback    	인증서 갱신 콜백함수
		*/
		updateCertificate : function(option) {

			option = mergeOption(option);
			
			var doUpdateCertificate = function() {
				if ( option.isHtml5 ) {
					Html5Adaptor.UpdateCertificate(
						option.caName,
						option.processCallback
					);
				} else {
					// 설치 체크 대기
					cwModuleInstallWait(function () {
						CrossWebExWeb6.UpdateCertificate(
							option.caName,
							option.processCallback
						);
					});
				}
			};

			setPreEnv(option).then(function(){
				doUpdateCertificate();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 폐기

			@param		option.caName				발급기관
			@param		option.serial				인증서 시리얼 번호
			@param		option.processCallback    	인증서 폐기 콜백함수
		*/
		revokeCertificate : function(option) {

			option = mergeOption(option);
			
			var doRevokeCertificate = function() {
				if ( option.isHtml5 ) {
					Html5Adaptor.RevokeCertificate(
						option.caName,
						option.serial,
						option.processCallback
					);
				} else {
					// 설치 체크 대기
					cwModuleInstallWait(function () {
						CrossWebExWeb6.RevokeCertificate(
							option.caName,
							option.serial,
							option.processCallback
						);
					});
				}
			};

			setPreEnv(option).then(function(){
				doRevokeCertificate();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 관리

			@param		option.taskNm				(only html5)
			@param		option.processCallback    	인증서 관리 콜백함수(only cs)
		*/
		openCertManager : function(option) {

			option = mergeOption(option);
			
			var doOpenCertManager = function() {
				if ( option.isHtml5 ) {
					Html5Adaptor.CertManagerWithForm(option.taskNm);
				} else {
					// 설치 체크 대기
					cwModuleInstallWait(function () {
						CrossWebExWeb6.ManageCert(option.processCallback);
					});
				}
			};

			setPreEnv(option).then(function(){
				doOpenCertManager();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 가져오기

			@param		option.version				버전
		*/
		importCert : function(option) {

			option = mergeOption(option);

			if ( 'undefined' === option.version )
				return;
			
			var doImportCert = function() {
				if ( "1.1" === option.version ) {

					if ( option.isHtml5 ) {
						Html5Adaptor.CertImportV11WithForm();
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.CertImportV11WithForm();
						});
					}
				} else if ( "1.2" === option.version ) {

					if ( option.isHtml5 ) {
						Html5Adaptor.CertImportV12WithForm();
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.CertImportV12WithForm();
						});
					}
				}
			};

			setPreEnv(option).then(function(){
				doImportCert();
			}).catch(console.log.bind(console));
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		인증서 내보내기

			@param		option.version				버전
		*/
		exportCert : function(option) {

			option = mergeOption(option);
			
			if ( 'undefined' === option.version)
				return;
			
			var doExportCert = function() {
				if ( "1.1" === option.version ) {

					if ( option.isHtml5 ) {
						Html5Adaptor.CertExportV11WithForm();
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.CertExportV11WithForm();
						});
					}
				} else if ( "1.2" === option.version ) {

					if ( option.isHtml5 ) {
						Html5Adaptor.CertExportV12WithForm();
					} else {
						// 설치 체크 대기
						cwModuleInstallWait(function () {
							CrossWebExWeb6.CertExportV12WithForm();
						});
					}
				}
			};

			setPreEnv(option).then(function(){
				doExportCert();
			}).catch(console.log.bind(console));	
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		정책 설정

			@param		option.name					이름
			@param		option.value				값
			@param		option.processCallback		콜백함수
		*/
		setProperty : function(option) {

			option = mergeOption(option);

			if ( false == option.isHtml5 ) {
				setProperty(
					option.name,
					option.value,
					option.processCallback
				);
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		프로세스 공유 속성 설정

			@param		option.name					이름
			@param		option.value				값
			@param		option.processCallback		콜백함수
		*/
		setSharedAttribute : function(option) {

			option = mergeOption(option);

			if ( false == option.isHtml5 ) {
				setSharedAttribute(
					option.name,
					option.value,
					option.processCallback
				);
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		확장 함수

			@param		option.name					이름
			@param		option.value				값
			@param		option.processCallback		콜백함수
		*/
		extendMethod : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {				
				extendMethod(
					option.name,
					option.value,
					option.processCallback
				);
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		파일 선택

			@param		option.filePath				선택 파일 경로
		*/
		selectFile : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {
					CrossWebExWeb6.SelFile(option.filePath);
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		암호화 파일 업로드

			@param		option.url					업로드 URL
			@param		option.form					?
			@param		option.processCallback		콜백함수
		*/
		uploadEncFile : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {
					CrossWebExWeb6.EncFile(
						option.url,
						option.form,
						option.processCallback
					);
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		암호화 파일 다운로드

			@param		option.url					다운로드 URL
			@param		option.args					?
			@param		option.processCallback		콜백함수
		*/
		downloadEncFile : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {
					CrossWebExWeb6.EncDown(
						option.url,
						option.args,
						option.processCallback
					);
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		?

			@param		option.frm					?
			@param		option.processCallback		콜백함수
		*/
		requestCert : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {					
					CrossWebExWeb6.CertRequest(
						option.frm,
						option.processCallback
					);					
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		?

			@param		option.cert					?
			@param		option.processCallback		콜백함수
		*/
		insertUserCert : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {
					CrossWebExWeb6.InsertUserCert(
						option.cert,
						option.processCallback
					);
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		?

			@param		option.cert					?
			@param		option.processCallback		콜백함수
		*/
		deleteUserCert : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {
					CrossWebExWeb6.DeleteUserCert(
						option.cert,
						option.processCallback
					);
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		?

			@param		option.processCallback		콜백함수
		*/
		insertCertToMS : function(option) {

			option = mergeOption(option);

			if ( false === option.isHtml5 ) {
				// 설치 체크 대기
				cwModuleInstallWait(function () {
					CrossWebExWeb6.InsertCerttoMS(
						option.processCallback
					);
				});
			}
		},

		///////////////////////////////////////////////////////////////////////////////////////////////////
		/*
			@public
			@brief		HTML5 인터페이스 호출

			@param		option.params				HTML5 인터페이스 파라미터
			@param		option.processCallback		콜백함수
		*/
		requestCmd : function(option) {

			// CWEXRequestCmd() 으로 아래 위치에서 호출됨.  INIWEBEX.requestCmd() 으로 변경해야 함.
			// --> html5\script\core\middleChannel.js"(669,5):

			// 설치 체크 대기
			cwModuleInstallWait(function () {
				CrossWebExWeb6.CWEXRequestCmd(
					option.params,
					option.processCallback
				);
			});
		}
	};	//Func.prototype close..

	return Func;

}();

var INIWEBEX = new IniSafeCrossWebEx();
