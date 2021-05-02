/*
	CrossWebEX Javascript Library
	iniLINE Co.,Ltd.
	1.0.0.6278
*/


//////////////////////////////
// common vaiable
//////////////////////////////

//cwInit 구동시 NIC인포 추출여부
var cwInitGetPCInfo = true;
var cwPCInfoParam = "";

// certmgmt variable
var TimeURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/Time.jsp";
var LogoURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + '/img/plugin.initech.com.gif';

var defaultSignEncoding = "euc-kr";
var cw_sfwithform = false;
var cw_pn = null;
var cw_overlap = null;

//-------------------------------------------
//인증서 발급/갱신/폐기 관련 CA 정보(2048용 테스트)
//-------------------------------------------
var YessignCAIP = "203.233.91.231";
//금결원 테스트 CA 서버
var CrossCertCAIP = "211.180.234.201";
//전자인증 테스트 CA 서버 ( 201 서버가 안될 경우, 205 서버로 접속 211.180.234.205 )
var SignKoreaCAIP = "211.175.81.101";
//코스콤 테스트 CA 서버
var SignGateCAIP = "114.108.187.156";
//정보인증 테스트 CA 서버 ( 156 서버가 안될 경우, 61.72.247.156로 변경 )
//-------------------------------------------

//-------------------------------------------
//인증서 발급/갱신/폐기 관련 CA 정보(리얼)
//-------------------------------------------
//var YessignCAIP = "203.233.91.71";		//금결원 리얼 CA 서버
//var CrossCertCAIP = "211.192.169.90";		//전자인증 리얼 CA 서버
//var SignKoreaCAIP = "210.207.195.100";	//코스콤 리얼 CA 서버
//var SignGateCAIP = "211.35.96.43";		//정보인증 리얼 CA 서버
//-------------------------------------------

var InitechPackage = "INITECH";
var YessignPackage = "YESSIGN";
var CrossCertPackage = "CROSSCERT";
var SignKoreaPackage = "SIGNKOREA";
var SignGatePackage = "SIGNGATE";

var YessignCMPPort = "4512";
var CrossCertCMPPort = "4512";
var SignKoreaCMPPort = "4099";
var SignGateCMPPort = "4502";

//demo.iniline.co.kr / 2012-05-02~2022-05-02
var SCert = "-----BEGIN CERTIFICATE-----\n";
SCert += "MIIDzDCCArSgAwIBAgIDAgxLMA0GCSqGSIb3DQEBCwUAMFMxCzAJBgNVBAYTAktS\n";
SCert += "MRAwDgYDVQQKEwdJTklURUNIMREwDwYDVQQLEwhQbHVnaW5DQTEfMB0GA1UEAxMW\n";
SCert += "SU5JVEVDSCBQbHVnaW4gUm9vdCBDQTAeFw0xMjA1MDIwMjQwNDdaFw0yMjA1MDIw\n";
SCert += "MjQwNDZaMD4xCzAJBgNVBAYTAktSMRIwEAYDVQQKEwlJTklURUNIQ0ExGzAZBgNV\n";
SCert += "BAMTEmRlbW8uaW5pbGluZS5jby5rcjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC\n";
SCert += "AQoCggEBAKmD5N+VmmzZpJ/2DgU+DZ91d5xv+ooZi5Fua9GLubJEL0Ybn9yVf6l3\n";
SCert += "EppHeJ+urBTzNXiifR4V56anaRrd/PeGvFar+NZL1TEpsQl4BOAgDLeXAVZiDBo/\n";
SCert += "h83dJDwq7pfPxlCU9w6jIFzoWiiB51KNqCsVDX6CRWfRVazG+LIcFgiN8pyUnxDa\n";
SCert += "XjTxygy9e3AVO7sH3vx0k8A1tK+mRPHfjiz4bNTlLKJD606WXSSy5ztnhM3P6wFM\n";
SCert += "S7A7kW0NCVrSueCUdggTI5w5HM0DVgXnC8zUd3XB/0dK0S9J7JJ4cawE5PsmElNR\n";
SCert += "hRJ5IYpVpsc+YBsbL+Qlv/NRRKtFrvECAwEAAaOBvTCBujAfBgNVHSMEGDAWgBR1\n";
SCert += "kfKc6tS556OlX3eE26EaDRiLpTAdBgNVHQ4EFgQUSLn2Fx+UtOeXPPUIHs/tbCcc\n";
SCert += "Qf8wDgYDVR0PAQH/BAQDAgH+MAwGA1UdEwEB/wQCMAAwGAYDVR0RBBEwD4YNMTEy\n";
SCert += "LjIxNi45OC42ODBABgNVHR8EOTA3MDWgM6Axhi9odHRwOi8vMTE4LjIxOS41NS4x\n";
SCert += "Mzk6NDgyMDAvQ1JML0lOSVRFQ0hDQTEzLmNybDANBgkqhkiG9w0BAQsFAAOCAQEA\n";
SCert += "MPKrYOGm8t9McVRGWdiNRUNIEErMqYAVPMpgox+Ic+ownnhdaHWlFkyQlyRbPBV/\n";
SCert += "tv8Edvakmf71nszEgD2jGYprnwCo6ZPvGS+ozNkokon9JDDw9WBfJqMUpqqh8HC/\n";
SCert += "U0wdpMq3Fd5LQnwDWGXlD/sV5ri4ZAvZQEFlD/rEqYBBiFK5iuoP1Om7AASPlwaN\n";
SCert += "xazr0B7iznJ6llkTmMzTzh/XQ6CERvHoEeY1wi2eeY9I8LMZhYcywopYrrZL21io\n";
SCert += "noZ0jvkbu5uEeCYhJ30nlolrK2gpo/vrWpaFua7rgpNKEu+hFwSNeqfGLylj4bg5\n";
SCert += "tEzdI16l93WiaUDFjSvttg==\n";
SCert += "-----END CERTIFICATE-----\n";

var certProcInfo = {};
var cwNICInfo = {};
var cwPCInfoChkCnt = 0;
var cwPCInfo = {};
var coreProcTmp = {};
var decodeParamInfo = {};
var tmpArrState = 0;

function initSFGetNICInfo() {
	if (!ModuleInstallCheck()) return;
	cwNICInfo.url = "/shttp/handshake/req_nicinfo";
	getCertPolicy("GET_NIC_INFO", "", "core_SFGetNICInfo");
};

function getCertPolicy(pn, url, callback){
	var policy_url = location.protocol + "//" + location.host + INI_html5BasePath + "/shttp/handshake";
	if (pn == "GET_PC_INFO")
		policy_url = policy_url + "/req_nonce";
	else if (pn == "GET_NIC_INFO")
		policy_url = policy_url + "/req_nicinfo";
	else
		policy_url = policy_url + "/cert/req_policy?CertURL=" + url;
	
	var xml;
	if (window.XMLHttpRequest) {
		xml = new XMLHttpRequest();
	} else {
		xml = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xml.onreadystatechange = function() {
		if (xml.readyState == 4) {
			if (xml.status == 200) {
				exlog("getCertPolicy.response", callback + "::" + xml.responseText);
				eval(callback)(xml.responseText);
			} else {
				exlog("getCertPolicy.response fail", callback);
				eval(callback)("");
			}
		}
	};
	xml.open("post", policy_url, true);
	xml.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
	exlog("getCertPolicy.sendurl", policy_url);
	xml.send();
};

function initSFGetPCInfo(result) {
	if (!ModuleInstallCheck()) return;
	if(cwPCInfoChkCnt < 5){
		if(!get_shttp_filter(cwPCInfoParam, 'Encrypted_Client_NIC_Info')){
			cwPCInfoChkCnt++;
			cwPCInfo.callback = "initSFGetPCInfo";
			setTimeout(function(){getCertPolicy("GET_PC_INFO", "", "core_SFGetPCInfo");},500);
		} else {
			exlog("### NICInfo", get_shttp_filter(cwPCInfoParam, 'Encrypted_Client_NIC_Info'));
			//alert(get_shttp_filter(cwPCInfoParam, 'Encrypted_Client_NIC_Info'));
			// nhbank only..
			// getPcInfo();
			return;
		}
	} else {
		// nhbank only..
		// getPcInfo();
		return;
	}
};

function get_shttp_filter(data, token) {
	var array = data.split("&");

	for (var j = 0; j < array.length; j++) {
		var array1 = array[j].split("=");
		if (array1[0] == token) {
			return array1[1];
		}
	}
	return "";
};

function core_SFGetNICInfo(policy) {
	var paramArr = ["GET_NIC_INFO", cwNICInfo.url, policy, "", "", ""];
	exlog("core_SFGetNICInfo", paramArr);
	crosswebInterface.SF_CertProcess(paramArr, "core_SFGetNICInfo_cb");
};

function core_SFGetPCInfo( policy ){
	var paramArr = ["GET_PC_INFO", navigator.userAgent, policy, "", "", ""];
	exlog("core_SFGetPCInfo", paramArr);
	crosswebInterface.SF_CertProcess(paramArr, "core_SFGetPCInfo_cb");
};

function core_SFGetNICInfo_cb(result) {
	var returnInfo = cwNICInfo;
	cwNICInfo = {};
	
	if(returnInfo.callback){
		eval(returnInfo.callback)(result);
	}
};

function core_SFGetPCInfo_cb(result) {
	cwPCInfoParam = result;
	try {
		var returnInfo = cwPCInfo;
		cwPCInfo = {};
		
		if(returnInfo.form) {
			SFCertFormProcess(returnInfo.form, result, result, returnInfo.callback);
		} else {
			if(returnInfo.callback){
				eval(returnInfo.callback)(result, returnInfo.postdata);
			}
		}
	} catch (e) {
		exlog("core_SFGetPCInfo_cb [exception]", e);
	}
};

function core_SFCertProcess_pre( policy ){
	if(policy){
		var paramArr = [coreProcTmp.pn, coreProcTmp.url, policy, coreProcTmp.signData, "", coreProcTmp.overlap];
		exlog("core_SFCertProcess_pre", paramArr);
		coreProcTmp = {};
		crosswebInterface.SF_CertProcess(paramArr, "core_SFCertProecess_cb");
	} else {
		exlog("core_SFCertProcess_pre [exception]", "policy is null");
		exalert("core_SFCertProcess_pre", CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_002); // "정책을 가져오지 못했습니다."
	}
};

function core_SFCertProecess_cb(result) {
	exlog("core_SFCertProecess_cb.result", result);
	if (certProcInfo.callback) {
		try {
			if (certProcInfo.pn == "LOGIN" || certProcInfo.pn == "SIGN") {
				if (!certProcInfo.withform || result == "FALSE" || result == "CANCEL") {
					eval(certProcInfo.callback)(certProcInfo.url, certProcInfo.postData, result);
				} else {
					SFCertFormProcess(certProcInfo.withform, result, certProcInfo, "core_SFCertProecess_cb2");
				}
			} else {
				eval(certProcInfo.callback)(certProcInfo.url, certProcInfo.postData, result);
			}
		} catch (e) {
			exlog("core_SFCertProecess_cb [exception]", e);
			exalert("core_SFCertProecess_cb [exception]", e);
		}
	}
	certProcInfo = {};
};

function core_SFCertProcess(pn, url, signData, postData, withform, overlap) {
	if (!ModuleInstallCheck()) return;
	coreProcTmp.pn = pn;
	coreProcTmp.url = url;
	coreProcTmp.signData = signData;
	coreProcTmp.overlap = overlap;
	
	getCertPolicy(pn, url, "core_SFCertProcess_pre");
};

function core_SFCertProecess_cb2(certProcInfo) {
	eval(certProcInfo.callback)(certProcInfo.url, certProcInfo.postData, "TRUE");
};

function SFCertFormProcess(formname, ret, info, callback) {
	try {
		var withform;
		if(typeof formname == "string"){
			withform = document.getElementById(formname);
			if (!withform)
				withform = document.getElementsByName(formname);
		} else {
			withform = formname;
		}

		var SF_RETURN_CERT_INFO = get_shttp_filter(ret, "_shttp_client_certificate_");
		var SF_RETURN_AUTH_INFO = get_shttp_filter(ret, "_shttp_client_auth_info_");
		var SF_RETURN_VID_RANDOM = get_shttp_filter(ret, "_shttp_client_vid_random_");
		var SF_RETURN_SIGN_INFO = get_shttp_filter(ret, "_shttp_client_signature_");
		var SF_RETURN_SIGN_PLAINTEXT = get_shttp_filter(ret, "_shttp_client_plaintext_");

		var SF_RETURN_PCINFO_IPADDR = get_shttp_filter(ret, "Encrypted_Client_IP_Address_Info");
		var SF_RETURN_PCINFO_MACADDR = get_shttp_filter(ret, "Encrypted_Client_MAC_Address_Info");
		var SF_RETURN_PCINFO_GATEWAY = get_shttp_filter(ret, "Encrypted_Client_Gateway_Address_Info");
		var SF_RETURN_PCINFO_OS = get_shttp_filter(ret, "Encrypted_OS_Info");
		var SF_RETURN_PCINFO_BROWSER = get_shttp_filter(ret, "Encrypted_Browser_Info");
		var SF_RETURN_PCINFO_NIC = get_shttp_filter(ret, "Encrypted_Client_NIC_Info");

		var paramArr = [];
		if (withform._shttp_client_certificate_ && SF_RETURN_CERT_INFO)
			paramArr.push({
				"name" : "_shttp_client_certificate_",
				"value" : SF_RETURN_CERT_INFO
			});

		if (withform._shttp_client_auth_info_ && SF_RETURN_AUTH_INFO)
			paramArr.push({
				"name" : "_shttp_client_auth_info_",
				"value" : SF_RETURN_AUTH_INFO
			});

		if (withform._shttp_client_vid_random_ && SF_RETURN_VID_RANDOM)
			paramArr.push({
				"name" : "_shttp_client_vid_random_",
				"value" : SF_RETURN_VID_RANDOM
			});

		if (withform._shttp_client_signature_ && SF_RETURN_SIGN_INFO)
			paramArr.push({
				"name" : "_shttp_client_signature_",
				"value" : SF_RETURN_SIGN_INFO
			});

		if (withform._shttp_client_plaintext_ && SF_RETURN_SIGN_PLAINTEXT)
			paramArr.push({
				"name" : "_shttp_client_plaintext_",
				"value" : SF_RETURN_SIGN_PLAINTEXT
			});

		if (withform.Encrypted_Client_IP_Address_Info && SF_RETURN_PCINFO_IPADDR)
			paramArr.push({
				"name" : "Encrypted_Client_IP_Address_Info",
				"value" : SF_RETURN_PCINFO_IPADDR
			});

		if (withform.Encrypted_Client_MAC_Address_Info && SF_RETURN_PCINFO_MACADDR)
			paramArr.push({
				"name" : "Encrypted_Client_MAC_Address_Info",
				"value" : SF_RETURN_PCINFO_MACADDR
			});

		if (withform.Encrypted_Client_Gateway_Address_Info && SF_RETURN_PCINFO_GATEWAY)
			paramArr.push({
				"name" : "Encrypted_Client_Gateway_Address_Info",
				"value" : SF_RETURN_PCINFO_GATEWAY
			});

		if (withform.Encrypted_OS_Info && SF_RETURN_PCINFO_OS)
			paramArr.push({
				"name" : "Encrypted_OS_Info",
				"value" : SF_RETURN_PCINFO_OS
			});

		if (withform.Encrypted_Browser_Info && SF_RETURN_PCINFO_BROWSER)
			paramArr.push({
				"name" : "Encrypted_Browser_Info",
				"value" : SF_RETURN_PCINFO_BROWSER
			});

		if (withform.Encrypted_Client_NIC_Info && SF_RETURN_PCINFO_NIC)
			paramArr.push({
				"name" : "Encrypted_Client_NIC_Info",
				"value" : SF_RETURN_PCINFO_NIC
			});

		if (withform.SMARTCertificationSelected && ret.indexOf("SMARTCertificationSelected") > -1)
			withform.SMARTCertificationSelected.value = "TRUE";

		decodeParamInfo.form = withform;
		decodeParamInfo.paramArr = paramArr;
		decodeParamInfo.info = info;
		decodeParamInfo.callback = callback;

		exlog("SFCertFormProcess.withform", withform);
		exlog("SFCertFormProcess.paramArr", paramArr);

		var cnt = paramArr.length;
		for (var i = 0; i < cnt; i++) {
			URLDecode(paramArr[i].value, "decodeParamSet");
		}
	} catch(e) {
		exlog("SFCertFormProcess [exception]", e);
		alert(e);
	}
};

function decodeParamSet(str) {

	var name = decodeParamInfo.paramArr[tmpArrState].name;
	eval("decodeParamInfo.form." + name).value = str;
	//decodeParamInfo.paramArr.splice(0,1);

	if (tmpArrState == decodeParamInfo.paramArr.length - 1) {
		if(decodeParamInfo.callback)
			eval(decodeParamInfo.callback)(decodeParamInfo.info);
		decodeParamInfo = {};
		tmpArrState = 0;
	} else {
		tmpArrState++;
	}
};

function SFSignEncoding(encode) {
	
	if (!ModuleInstallCheck())
		return false;

	if (encode == "utf-8") {
		SetProperty("codepage", "CP_UTF8");
		// Window Client Encoding/Decoding (949, CP_UTF8) default (949)
		SetProperty("ServerEncoding", "utf-8");
		// CrossWeb Client Encoding/Decoding (euc-kr, utf-8) default (utf-8)
	} else {
		SetProperty("codepage", "949");
		// Window Client Encoding/Decoding (949, CP_UTF8) default (949)
		SetProperty("ServerEncoding", "euc-kr");
		// CrossWeb Client Encoding/Decoding (euc-kr, utf-8) default (utf-8)
	}
};



//#####################################################################################################################




var CrossWebExSFilter = (function(){
	//////////////////////////////
	// util function
	//////////////////////////////
	
	/////////////////////////// LOGIN/SIGN /////////////////////////////////////////
	
	function SFCertProcess(pn, url, signData, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = pn;
		certProcInfo.url = url;
		certProcInfo.postData = postData;
		certProcInfo.overlap = overlap;
		if(callback) {
			certProcInfo.callback = callback;
		} else {
			exalert("SFCertProcess", "callback function not defined");
			return;
		}
		SFSignEncoding(defaultSignEncoding);
		core_SFCertProcess(certProcInfo.pn, certProcInfo.url, signData, certProcInfo.postData, null, certProcInfo.overlap);
	};
	
	function SFCertProcessWithForm(pn, url, signData, postData, form, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = pn;
		certProcInfo.url = url;
		certProcInfo.postData = postData;
		certProcInfo.withform = form;
		certProcInfo.overlap = overlap;
		if(callback) {
			certProcInfo.callback = callback;
		} else {
			exalert("SFCertProcessWithForm", "callback function not defined");
			return;
		}
		SFSignEncoding(defaultSignEncoding);
		core_SFCertProcess(certProcInfo.pn, certProcInfo.url, signData, certProcInfo.postData, certProcInfo.form, certProcInfo.overlap);
	};
	
	function SFLoginProcess(url, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "LOGIN";
		certProcInfo.url = url;
		certProcInfo.postData = postData;
		certProcInfo.withform = "";
		certProcInfo.overlap = overlap;
		if(callback) {
			certProcInfo.callback = callback;
		} else {
			exalert("SFLoginProcess", "callback function not defined");
			return;
		}
		core_SFCertProcess("LOGIN", url, "", postData, null, overlap);
	};
	
	function SFSignProcess(url, signData, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "SIGN";
		certProcInfo.url = url;
		certProcInfo.postData = postData;
		certProcInfo.withform = "";
		certProcInfo.overlap = overlap;
		if(callback) {
			certProcInfo.callback = callback;
		} else {
			exalert("SFSignProcess", "callback function not defined");
			return;
		}
		core_SFCertProcess("SIGN", certProcInfo.url, signData, certProcInfo.postData, null, certProcInfo.overlap);
	};
	
	function SFLoginProcessWithForm(url, postData, form, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "LOGIN";
		certProcInfo.url = url;
		certProcInfo.postData = postData;
		certProcInfo.withform = form;
		certProcInfo.overlap = overlap;
		if(callback) {
			certProcInfo.callback = callback;
		} else {
			exalert("SFLoginProcessWithForm", "callback function not defined");
			return;
		}
		exlog("SFLoginProcessWithForm", certProcInfo.withform);
		//core_SFCertProcess(pn, url, signData, postData, withform, overlap, callback);
		core_SFCertProcess("LOGIN", url, "", postData, form, overlap);
	};
	
	function SFSignProcessWithForm(url, signData, postData, form, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "SIGN";
		certProcInfo.url = url;
		certProcInfo.postData = postData;
		certProcInfo.withform = form;
		certProcInfo.overlap = overlap;
		if(callback) {
			certProcInfo.callback = callback;
		} else {
			exalert("SFSignProcessWithForm", "callback function not defined");
			return;
		}
		core_SFCertProcess("SIGN", certProcInfo.url, signData, certProcInfo.postData, certProcInfo.withform, certProcInfo.overlap);
	};
	
	function SFCertManagerProcessWithForm(url, callback) {
		if (!ModuleInstallCheck()) return;
		ManageCert();
	};
	
	function SFCertIssueProcess(url, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "CERT_ISSUE";
		certProcInfo.url = url;
		certProcInfo.overlap = overlap;
		certProcInfo.callback = callback;
	
		//core_SFCertProcess(pn, url, signData, postData, withform, overlap, callback);
		core_SFCertProcess("CERT_ISSUE", url, "", "", null, overlap);
	};
	
	function SFCertReplaceProcess(url, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "CERT_REPLACE";
		certProcInfo.url = url;
		certProcInfo.overlap = overlap;
		certProcInfo.callback = callback;
	
		//core_SFCertProcess(pn, url, signData, postData, withform, overlap, callback);
		core_SFCertProcess("CERT_REPLACE", url, "", "", null, overlap);
	};
	
	function SFCertUpdateProcess(url, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "CERT_UPDATE";
		certProcInfo.url = url;
		certProcInfo.overlap = overlap;
		certProcInfo.callback = callback;
	
		//core_SFCertProcess(pn, url, signData, postData, withform, overlap, callback);
		core_SFCertProcess("CERT_UPDATE", url, "", "", null, overlap);
	};
	
	function SFCertRevokeProcess(url, postData, overlap, callback) {
	
		if (!ModuleInstallCheck()) return;
		certProcInfo.pn = "CERT_REVOKE";
		certProcInfo.url = url;
		certProcInfo.overlap = overlap;
		certProcInfo.callback = callback;
	
		//core_SFCertProcess(pn, url, signData, postData, withform, overlap, callback);
		core_SFCertProcess("CERT_REVOKE", url, "", "", null, overlap);
	};
	

	

	///////////////////////////////// Import Export /////////////////////////////////////
	function SFCertImportV12ProcessWithForm() {
		
		if (!ModuleInstallCheck()) return;
		ICCSetOption("MakePluginData", "FALSE");
		ICCSetOption("TimeURL", TimeURL);

		/**
		 * 인증서 이동 프로토콜 버전 설정
		 */
		ICCSetOption("SetProtocolVersion", "1.2");

		/**
		 * 인증번호 자리 입력수. 스마트폰에서 설정한 자릿수와 일치하여야 한다.
		 */
		ICCSetOption("SetAuthenticationNumber", "8");

		/**
		 * 내보내기할 인증서의 비밀번호를 재설정할것인지의 여부.(기본값:"TRUE")
		 * (즉 스마트폰에 저장될 인증서 암호결정)
		 * "FALSE"로 지정하면 재설정하지 않고 바로 전송되며 지정하지 않을 시
		 * 사용자에게 재설정 여부를 알린다.
		 */
		ICCSetOption("SetUseCertPwd", "FALSE");
		
		ICCRecvCert(importURL);
	};
	
	function SFCertExportV12ProcessWithForm() {
		
		if (!ModuleInstallCheck()) return;
		ICCSetOption("SetLogoPath", LogoURL);
		ICCSetOption("MakePluginData","FALSE");
		ICCSetOption("TimeURL", TimeURL);
		ICCSetOption("SetLanguage", "KOR");
		ICCSetOption("DisableExpiredCert", "TRUE");//인증서 선택창에 폐기목록 표시여부
		
		/**
		 * GPKI 인증서 출력 여부
		 */
		ICCSetOption("Setproperty","certmanui_gpki&all");
		
		/**
		 * 인증서 이동 프로토콜 버전 설정
		 */
		ICCSetOption("SetProtocolVersion", "1.2");

		/**
		 * 인증번호 자리 입력수. 스마트폰에서 설정한 자릿수와 일치하여야 한다.
		 */
		ICCSetOption("SetAuthenticationNumber", "8");

		/**
		 * 내보내기할 인증서의 비밀번호를 재설정할것인지의 여부.(기본값:"TRUE")
		 * (즉 스마트폰에 저장될 인증서 암호결정)
		 * "FALSE"로 지정하면 재설정하지 않고 바로 전송되며 지정하지 않을 시
		 * 사용자에게 재설정 여부를 알린다.
		 */
		ICCSetOption("SetUseCertPwd", "FALSE");

		/**
		 * 인증서 내보내기 처리 시작
		 */
		ICCSendCert(exportURL);
	};

	

	
	
	///////////////////////////////// PC INFO /////////////////////////////////////
	
	
	
	function SFGetPCInfo(callback, postdata) {
		
		if(cwInitGetPCInfo && cwPCInfoParam){
			return cwPCInfoParam;
		} else {
			if (!ModuleInstallCheck()) return;
			if(callback) {
				cwPCInfo.callback = callback;
			} else {
				exalert("SFGetPCInfo", "callback function not defined");
				return;
			}
			cwPCInfo.postdata = postdata;
			//core_SFGetPCInfo();
			getCertPolicy("GET_PC_INFO", "", "core_SFGetPCInfo");
		}
	};
	
	function SFGetPCInfoWithForm(form, callback) {
		
		if(cwInitGetPCInfo && cwPCInfoParam && !form) {
			return cwPCInfoParam;
		} else {
			if (!ModuleInstallCheck()) return;
			cwPCInfo.form = form;
			cwPCInfo.callback = callback;
			getCertPolicy("GET_PC_INFO", "", "core_SFGetPCInfo");
		}
	};
	
	

	
	
	////////////////////////////// NIC INFO ////////////////////////////////////////
	
	function SFGetNICInfo(url, callback) {
		//if (!ModuleInstallCheck()) return;
		if(!cwInitGetPCInfo){
			cwNICInfo.url = url;
			cwNICInfo.callback = callback;
			//getCertPolicy("GET_NIC_INFO", "", "core_SFGetNICInfo");
			ModuleInstallWait("getCertPolicy", ["GET_NIC_INFO", "", "core_SFGetNICInfo"]);
		} else {
			if(callback) {
				eval(callback)("TRUE");
			} else {
				return true;
			}
		}
	};
	
	
	////////////////////////////// INIT GET NIC/PC INFO ////////////////////////////////////////
	

	
	return {
		SFLoginProcessWithForm : SFLoginProcessWithForm,
		SFLoginProcess : SFLoginProcess,
		SFSignProcessWithForm : SFSignProcessWithForm,
		SFCertManagerProcessWithForm : SFCertManagerProcessWithForm,
		SFCertIssueProcess : SFCertIssueProcess,
		SFCertReplaceProcess : SFCertReplaceProcess,
		SFCertUpdateProcess : SFCertUpdateProcess,
		SFCertRevokeProcess : SFCertRevokeProcess,
		SFCertImportV12ProcessWithForm : SFCertImportV12ProcessWithForm,
		SFCertExportV12ProcessWithForm : SFCertExportV12ProcessWithForm,
		SFGetPCInfoWithForm : SFGetPCInfoWithForm,
		SFGetNICInfo : SFGetNICInfo,
		SFinitialize : SFinitialize
	};
	
}());