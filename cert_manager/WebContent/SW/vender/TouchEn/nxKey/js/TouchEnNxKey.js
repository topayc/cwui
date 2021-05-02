if (!window.console)
    console = {
        log: function (msg) {}
    };

var TouchEn_BaseBRW = {
    ua: navigator.userAgent.toLowerCase(),
    ie: navigator.appName == 'Microsoft Internet Explorer',
    ie_: navigator.userAgent.match('MSIE') == 'MSIE',
    ns: navigator.appName == 'Netscape',
    ff: navigator.userAgent.match('Firefox') == 'Firefox',
    sf: navigator.userAgent.match('Safari') == 'Safari',
    op: navigator.userAgent.match('Opera') == 'Opera',
    cr: navigator.userAgent.match('Chrome') == 'Chrome',
    win: navigator.platform.match('Win') == 'Win',
    mac: navigator.userAgent.match('Mac') == 'Mac',
    linux: navigator.userAgent.match('Linux') == 'Linux',
    ie11: navigator.userAgent.match('Trident/7.0') == 'Trident/7.0'
};

var getTouchEnNXEType = {
    MSIEBrowser: (TouchEn_BaseBRW.win && (TouchEn_BaseBRW.ie || TouchEn_BaseBRW.ie11 || TouchEn_BaseBRW.ie_)),
    WebKitBrowser: (TouchEn_BaseBRW.win && ((TouchEn_BaseBRW.ff || TouchEn_BaseBRW.sf || TouchEn_BaseBRW.cr) || TouchEn_BaseBRW.op)),
    OtherOS: (TouchEn_BaseBRW.mac || TouchEn_BaseBRW.linux)
};

function getInternetExplorerVersion() {
    var rv = -1; // Return value assumes failure.
    if (navigator.appName == 'Microsoft Internet Explorer') {
        var ua = navigator.userAgent;
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(ua) != null)
            rv = parseFloat(RegExp.$1);
    }
    return rv;
}

var bInit = 0;
var bAddListner = 0;
var TouchEnNXE_E2EDATA = "";
var TouchEnNXE_SeedKey = "";
var cipherEncText = "";
var bAutoFocus = false;

var BSKeyBeingActive = false;
var cert = "-----BEGIN CERTIFICATE-----MIIDPzCCAiegAwIBAgIJAOYjCX4wgWMlMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTE1MTIyMzA2MDA1OFoXDTI1MTIyMDA2MDA1OFowOzELMAkGA1UEBhMCS1IxEDAOBgNVBAoTB0pULUJhbmsxGjAYBgNVBAMTEXd3dy5qdC1iYW5rLmNvLmtyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAytjmTmZHq8Xhq5DbjOwrJE97UoDX9U/Q4NTTLrFScz1hcbztEOzIB+4qTByohUAwMFMhBFLKPp4u0lkaBXJlHT6Dsx1W8fDoqN4X9ppi3IL7skFCXHQFRF79MPbF3mR66uMWMc041pftaZXbh4pGP1B4unY6MBciEyOtlF9fdsR97sDjcPfGD3G44/xpIGx5emIxFi6GfP2OKh/LaQ6zrpH7hifdk5DGMszeB0ugsSLr0touZ11npu4T+XqH41EIqEKSw+nNpGCEO6YWabvKtdYGR2mNELm9hpQZAtGUQWEzkBlZ55UqSSiqoloUTX36dNKLSB3uAV9aUrmY3cCWCQIDAQABoxowGDAJBgNVHRMEAjAAMAsGA1UdDwQEAwIF4DANBgkqhkiG9w0BAQsFAAOCAQEAMrf6YOvPU6aZSvizBlSCfToras7kUquA0g+sBHan/xrIwd2H+1t7olHbPrvtlGQFMF/2hAyeyYz5TRtY58Ku5yhNcMkwJjmqO4008Bs2LzyllRJlWElfmkBCdkBgUnnEDMG6F+O8MOOXWax+a+LFsvh9DIib++OGyDlGYRvYIz68Ohqwaq9Udp3RkaSM5YvPHEaTI0IYx34dZUqFhVWUHk0BUjcSATijd4/+F0AXDW8niaBavXEm0FU2POcZkv0LmK5Nkpjz/eW33mgcacwS3nkdfskMyKxsFH+9VF5Jb14VRZoj4yDE5ZYt2cinQOW4ddnNCHqf8Omho35FzGaqew==-----END CERTIFICATE-----";
var DomID;
var TouchEnKeyNXE_CurObj;
var loadflag = false;
var fnGetEncXWCallback;

var tekOption = {
    "pki": "TouchEnkeyEx",
    "keyboardonly": "false",
    "defaultenc": "false",
    "verify": "0",
    "defaultpaste": "true",
    "iframename": "",
    "usegetenc": "false",
    "clearbufferonempty": "true",
    "refreshsession": "true",
    "improve": "true",
    "cert": cert,
    "srdk": TNK_SR,
    "bstart": 0,
    "setcallback": "false",
    "usebspress": "false",
    "ignoreprogress": "true",
    "exformname": "",
    "allcrypt": "true"
};
/**
 * 모듈 로딩
 *
 * status 가 true이면 체크를 요청한 모든 모듈이 정상 설치되었음을 의미합니다. 각각의 모듈은 info 배열 내 값을 통하여
 * 확인합니다. 페이지 최초 접속시에는 체크후에 반드시 LOADING을 수행하여 모듈별 EX실행 객체가 정상적으로 생성되도록 합니다.
 * LOADING은 status 값이 true인 경우에만 동작합니다.
 */
function TK_Loading() {
    try {
        if (!loadflag) {
        	TK_processingbar(true);
            TOUCHENEX_CHECK.check([touchenexInfo], "TK_Load");
            loadflag = true;
        }
    } catch (e) {
    	TK_processingbar(false);
    }
}


function TK_Load(check) {
    try {
        exlog("TK_LoadingCallback", check);
        currStatus = check;
        if (currStatus.status) {
            touchenexInfo.tkInstalled = currStatus.status;
            TOUCHENEX_LOADING("TK_LoadingCallback");
        } else {
            TK_notInstall(currStatus);
        }
    } catch (e) {
    	TK_processingbar(false);
    }
}
/**
 * 키보드보안 정상 로딩시 모듈 실행
 */
function TK_LoadingCallback(installed) {
    try {
        if (installed) {
            // 20170811 실행 불필요
            /*
            if (getTouchEnNXEType.WebKitBrowser && bAddListner == 0) {
                TK_AddEventListner();
            }*/
            if (bInit == 0) {
                TK_ApplySecurity();
            }
        }
    } catch (e) {
    	TK_processingbar(false);
    }
}
/**
 * 설치 페이지 이동 함수 설명 : 설치 완료시 메인페이지 이동 함수 호출 TouchEnNxKey_Interface.js 에 페이지 설치를
 * 위해 이동 할 페이지 경로를 설정합니다.
 */
function TK_installPage() {
	TK_processingbar(false);
    alert("고객님의 안전한 결제 위하여 \n보안프로그램 설치가 필요합니다.\n[확인]을 선택하시면 설치페이지로 연결됩니다.\n");
    if (typeof TouchEnKey_installpage == "undefined") {
        location.href = touchenexInfo.tkInstallpage;
    }
}

/**
 * 미 설치 일 떄 동작 함수.
 */
/**
 * 미 설치 일 떄 동작 함수.
 */
function TK_notInstall(currStatus) {
        try {
            if (!currStatus.status) { // 미 설치 일때
                touchenexInfo.tkInstalled = currStatus.status;
                if (typeof TouchEnKey_installpage == "undefined") {
                    TK_installPage();
                } else {
                    if (!currStatus.info[0].isInstalled) {
                        if (!currStatus.info[0].extension) {
                            // EX 미설치 chrome , firefox, opera extension 자동 이동
                            if (TOUCHENEX_UTIL.isChrome() || TOUCHENEX_UTIL.isFirefox() || (TOUCHENEX_UTIL.isOpera())) {
                                // TouchEnKey_extensiondownload();
                                touchenexInfo.exInstalled = false;
                            }
                        } else {
                            touchenexInfo.exInstalled = true;
                        }

                        if (!currStatus.info[0].client || !currStatus.info[0].EX) {
                            // client 파일이 미설치 되 었을 경우
                            touchenexInfo.clInstalled = false;
                        } else {
                            touchenexInfo.clInstalled = true;
                        }
                    } else {
                        // 설치완료
                        if (typeof TouchEnKey_installpage != "undefined") {
                            // 설치페이지이면 메인페이지 이동 로직 추가 또는메인페이지 이동 함수 호출
                        }
                    }
                }
            } else { // 설치완료
                touchenexInfo.tkInstalled = currStatus.status;
                if (typeof TouchEnKey_installpage != "undefined") {
                    // 설치페이지 이면 메인 페이지 이동 로직 추가 또는 메인 페이지 이동 함수 호출
                }
            }
        } catch (e) {}
    }
    /**
     * 정상 설치여부 확인을 위한 샘플 callback 으로 오는 인자값은 {"status":"false",
     * "info":[{"name":exPluginName, "isInstalled":true, "extension":true,
     * "EX":true, "client":true}}]}
     *
     * status 가 true이면 체크를 요청한 모든 모듈이 정상 설치되었음을 의미합니다. 각각의 모듈은 info 배열 내 값을 통하여
     * 확인합니다. 체크후에 반드시 LOADING을 수행하여 모듈별 EX실행 객체가 정상적으로 생성되도록 합니다. LOADING은 status
     * 값이 true인 경우에만 동작합니다.
     */

function TK_isInstallcheck() {
    try {
        TOUCHENEX_CHECK.check([touchenexInfo], 'TK_installCheckCallback');
    } catch (e) {}
}

function TK_installCheckCallback(check) {
    try {
        currStatus = check;
        if (currStatus.status) {
            touchenexInfo.tkInstalled = currStatus.status;
            if (typeof TouchEnKey_installpage != "undefined") {
                // 설치페이지 이면 메인페이지 이동 로직 추가 또는 메인페이지 이동 함수 호출
            }
        } else {
            TK_notInstall(currStatus); // 미설치 일 경우 함수 호출
        }
    } catch (e) {}
}

function TouchEnKey_download() {
    TOUCHENEX_INSTALL.download('nxkey', 'client');
}

function TouchEnKey_extensiondownload() {
    TOUCHENEX_INSTALL.download('nxkey', 'extension');
}

function TK_DoSubmitByGetEnc() {
    if (tekOption.usegetenc != "true") {
        alert("Option usegetenc is not true");
    }
    frm = document.forms[0];
    if (getTouchEnNXEType.MSIEBrowser) {
        makeKeyData(frm);
    } else {
        GetEncData();
    }
}

function TK_makeEncData(frmObj) {
    try {
        cipherEncText = "";
        if (tekOption.usegetenc == "true") {
            alert("Option usegetenc is not false");
        }
        if (tekOption.usegetenc == "true") {
            GetEncData();
        } else {
            var nodeLen = document.all.length;
            var htmlColl = document.all;
            for (var k = 0; k < nodeLen; k++) {
                if (htmlColl[k].id.indexOf('E2E_') != -1) {
                    cipherEncText += htmlColl[k].id
                    cipherEncText += "=";
                    cipherEncText += htmlColl[k].value;
                    cipherEncText += "%TK%";
                }
            }
            document.getElementById("hid_enc_data").value = cipherEncText;
            
            return true;
        }

    } catch (e) {
        return false;
    }
}

function TK_ApplySecurity() {
    if (typeof TouchEnKey_installpage != "undefined")
        return false;
    if (getTouchEnNXEType.WebKitBrowser) {
        var array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        DomID = TouchEnNXE_createHexString(array, 16);
        DomID = DomID.substring(0, 32);
    } else {
        DomID = "iecb" + TOUCHENEX_UTIL.createId();
    }

    TK_SetCallBack();
    try {
        if (window.frameElement)
            tekOption.iframename = window.frameElement.getAttribute("name");
        else
            tekOption.iframename = "";
    } catch (e) {
        tekOption.iframename = "_unknown_";
    }
    tekOption.exformname = touchenexInfo.exFormName;

    tekOption.srdk = TNK_SR;
	tekOption.browserinfo = TOUCHENEX_UTIL.getBrowserInfo().browser;

    var strOption = JSON.stringify(tekOption);
	touchenexInterface.TK_Init([false, DomID, strOption, ""],
        "TK_Init_callback");

	var k=0;
    try {
      var htmlAllColl = document.all;

      for (var j = 0; j < htmlAllColl.length; j++) {
          if (htmlAllColl[j].tagName == "INPUT" &&
              (htmlAllColl[j].type == "text" || htmlAllColl[j].type == "password") && (htmlAllColl[j].getAttribute("data-enc") == "on" || htmlAllColl[j].getAttribute("enc") == "on")) {
              htmlAllColl[j].value = "";
          }
      }
    } catch (e) {
    	TK_processingbar(false);
    }

}

function TK_Init_callback(result) {
	if(result.isvm == "true"){
		//가상화 환경으로 키보드보안 미지원 로직 추가 필요
		// transkey default 사용 하도록 수정
		TK_processingbar(false);
	}
    if (result.result == "true") {
        bInit = 1;
        try {
            makeEncDataId();
            //2015.12.23. 이선호 수정
            if(typeof TK_initSucuess=="function") 
            	TK_initSucuess();
            var eleObj = document.activeElement;	
            //2016.4.5. 전청하 수정.
            if (eleObj != undefined && (eleObj.tagName == "INPUT" || eleObj.tagName == "input"))
            {
            	eleObj.blur();
            	eleObj.focus();
            }
            if(result.tkmainver != undefined && result.tkappiver != undefined && result.tkappmver != undefined){
            	var rtmp = true;
            	rtmp = TOUCHENEX_UTIL.diffVersion(result.tkappiver,nxKey.tkappiver);
            	rtmp = TOUCHENEX_UTIL.diffVersion(result.tkappmver,nxKey.tkappmver);
            	if(!rtmp) TK_FaqMove(1);
            }
        } catch (e) {}
    }
}

function TK_SetCallBack() {
    var topURL;
    try {
        topURL = window.top.location.protocol + "//" + window.top.location.host + window.top.location.pathname;
    } catch (e) {
        topURL = document.referrer;
    }

    var cbdata = [];
    cbdata.push({
        "callbackid": DomID,
        "callback": TOUCHENEX_CONST.frameName + "update_callback",
        "orgurl": location.protocol + "//" + location.host + location.pathname,
        "topurl": topURL
    });
    touchenexInterface.TestEXPush(cbdata);
    tekOption.setcallback ="true";
}

function focusDataClear(inputObj){
	 try{
		if(getTouchEnNXEType.WebKitBrowser){
			TK_Clear(inputObj.id);
			inputObj.selectionStart = 0;
			inputObj.selectionEnd = 0;
			inputObj.focus();
			var range = inputObj.createTextRange();
			range.collapse(false);
			range.select();	 
		}
	}catch(e){}
}

/** 20150904 수정 */
function TK_Start(nsEvent) {
    if (tekOption.SetCallback == "false") {
        TK_SetCallBack();
        tekOption.SetCallback = "true";
    }
    if (!getTouchEnNXEType.WebKitBrowser)
        return;
    var theEvent;
    var inputObj;
    var comm=0;
    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }
    if (bInit == 0) {
        inputObj.blur();
        return;
    }
    try {
    	/*2015.12.23 jch 수정*/
    	 if(inputObj.value.length == 0 && bInit==1){
         	focusDataClear(inputObj);
         }
        var varEnableDummy = "off";
        if(inputObj.type=="text" && inputObj.getAttribute("data-dataType")=="n" && inputObj.getAttribute("data-enc")=="on"&& inputObj.value.indexOf(",") > -1){
        	varEnableDummy = "on"; 
        	 comm = inputObj.value.split(",").length;
             if(comm > 1) comm--;
             else comm = 0;
        }
        
        TouchEnKeyNXE_CurObj = inputObj;
        var bReadOnly = "false";
        if (inputObj.readOnly == true)
            bReadOnly = "true";
        //ID 기반, FormName 이 없으면 ID 기반 방식으로 동작한다. 
        var tekInput = {
            "id": inputObj.id,
            "type": inputObj.type,
            "enc": inputObj.getAttribute("enc"),
            "data-enc": inputObj.getAttribute("data-enc"),
            "maxlength": inputObj.getAttribute("maxlength"),
            "datatype": inputObj.getAttribute("datatype"),
            "data-datatype": inputObj.getAttribute("data-datatype"),
            "mask": inputObj.getAttribute("mask"),
            "data-mask": inputObj.getAttribute("data-mask"),
            "security": inputObj.getAttribute("security"),
            "data-security": inputObj.getAttribute("data-security"),
            "inputlength": inputObj.value.length,
            "inputdom": inputObj.value,
            "readonly": bReadOnly,
            "comm" : comm,
            "enabledummy" : varEnableDummy
        };

        touchenexInterface.TK_Start([false, inputObj.id, DomID, tekInput], "TK_Start_callback");
    } catch (e) {}
}

function TK_Start_callback(result) {
    if (TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" ||
        TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on" ||
        ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") && TouchEnKeyNXE_CurObj.type == "password")) {
        if (TouchEnKeyNXE_CurObj.value.length != 0 && TouchEn_BaseBRW.ff == false) {
            if (TouchEnKeyNXE_CurObj.selectionStart < TouchEnKeyNXE_CurObj.value.length) {
                TouchEnKeyNXE_CurObj.selectionStart = TouchEnKeyNXE_CurObj.value.length;
                TouchEnKeyNXE_CurObj.selectionEnd = TouchEnKeyNXE_CurObj.value.length;
            }

        }
    }
    
    if (result == "StartReadyComplete") {
        tekOption.bstart = 1;
        return;
    }

    if (result == "Start_Failed") {
        tekOption.bstart = 0;
        TK_Clear(TouchEnKeyNXE_CurObj.id);

        var HiddenEnc = "";

        TK_Clear("", TouchEnKeyNXE_CurObj.id);
        HiddenEnc = "E2E_" + TouchEnKeyNXE_CurObj.id;

        if ((TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" || TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on") || (tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true")) {
            document.getElementById(HiddenEnc)[0].value = "";
            TouchEnKeyNXE_CurObj.value = "";
        }

        TouchEnKeyNXE_CurObj.blur();
    }
}

function TK_Stop(nsEvent) {

    if (!getTouchEnNXEType.WebKitBrowser)
        return;

    var theEvent;
    var inputObj;

    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }
    try {
        touchenexInterface.TK_Stop([false, DomID, inputObj.id], "TK_Stop_callback");
        tekOption.bstart = 0;
    } catch (e) {}
}

function TK_Stop_callback(result) {}

function TK_Keyup(nsEvent) {
    var theEvent;
    var inputObj;

    if (!getTouchEnNXEType.WebKitBrowser)
        return;
    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }
    var keycode = typeof nsEvent.which == "number" ? nsEvent.which : nsEvent.keyCode;
    var chCode = keycode.toString();

    if (tekOption.usebspress == undefined || tekOption.usebspress != "true") {
        if (keycode == 8) {
            BSKeyBeingActive = false;
        }
    }
}

function TK_Keypress(nsEvent) {
    var theEvent;
    var inputObj;

    if (!getTouchEnNXEType.WebKitBrowser)
        return;
    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }
    var keycode = typeof nsEvent.which == "number" ? nsEvent.which : nsEvent.keyCode;
    var chCode = keycode.toString();
}

function TK_KeyDown(nsEvent) {

    var theEvent;
    var inputObj;

    if (!getTouchEnNXEType.WebKitBrowser)
        return;

    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    try {
        // Call win32 export functionSS
        var keycode = typeof nsEvent.which == "number" ? nsEvent.which : nsEvent.keyCode;
        var chCode = keycode.toString();
        
        if (keycode == 0xff)
        {
            if (TouchEn_BaseBRW.ff)
                nsEvent.preventDefault();
            else
                nsEvent.returnValue = false;
            
            return false;
        }
        
		var securityOff = false;
		if (inputObj.getAttribute("security") == "on" ||  inputObj.getAttribute("security") == "true" || inputObj.getAttribute("security") == "yes" ||
		inputObj.getAttribute("data-security") == "on" || inputObj.getAttribute("data-security")=="true" || inputObj.getAttribute("data-security") == "yes")
			securityOff == true;

        if (tekOption.bstart != 1 && securityOff == false) {
			   if (TouchEn_BaseBRW.ff)
                nsEvent.preventDefault();
            else
                nsEvent.returnValue = false;

            return;

        }
        
		TouchEnKeyNXE_CurObj.scrollLeft = TouchEnKeyNXE_CurObj.scrollWidth;
        

      
      /*  if (TouchEnKeyNXE_CurObj.size < TouchEnKeyNXE_CurObj.selectionEnd)
             TK_SetScroll(1, 1);
*/

        if (TouchEnKeyNXE_CurObj.getAttribute("security") == "off" || TouchEnKeyNXE_CurObj.getAttribute("data-security") == "off") {
            return;
        }

        // e2e 영역에 대해서 앞뒤위아래 커서 이동 금지, delete 키 금지
        if (TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" ||
            TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                TouchEnKeyNXE_CurObj.type == "password")) { //defaultEnc 가 허용일때 paswword 필드에 대해서는 e2e가 기본설정이므로 허용을 막아야 한다.
            if (keycode == 0x25 || keycode == 0x26 || keycode == 0x27 || keycode == 0x28 ||
                keycode == 0x21 || keycode == 0x22 || keycode == 0x24 || keycode == 86 || keycode == 46) {

                if (TouchEn_BaseBRW.ff)
                    nsEvent.preventDefault();
                else
                    nsEvent.returnValue = false;

                return;
            }
        }

        if (keycode == 86) {

            if ((tekOption.defaultpaste == "false") || (tekOption.defaultpaste == "off") || (tekOption.defaultpaste == "no")) {

                //defaultpaste false 라도 비보안 영역은 붙여 넣기를 허용 
                if (TouchEnKeyNXE_CurObj.getAttribute("data-security") != "off" && TouchEnKeyNXE_CurObj.getAttribute("security") != "off" && keycode == 86) {
                    {
                        if (TouchEn_BaseBRW.ff)
                            nsEvent.preventDefault();
                        else
                            nsEvent.returnValue = false;
                        return;
                    }
                }

            } else {

                // 일반 보안 영역 (E2E 아님)
                // 붙여 넣기 허용 일때, Datytype 이 들어 가 있으면 허용 하지 않는다. 
                // datatype 이 존재 하면 붙여 넣기 금지. 
                if (TouchEnKeyNXE_CurObj.getAttribute("datatype") != null || TouchEnKeyNXE_CurObj.getAttribute("data-datatype") != null) {
                    if (TouchEn_BaseBRW.ff)
                        nsEvent.preventDefault();
                    else
                        nsEvent.returnValue = false;
                    return;
                }

            }
        }

        if (keycode == 8 || keycode == 46) {
            if (TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" ||
                TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on" ||
                ((tekOption.defaultenc == "on" || tekOption.defaultenc == "true" || tekOption.defaultenc == "yes") && TouchEnKeyNXE_CurObj.type == "password")) {

                if (keycode == 8 && (tekOption.usebspress == undefined || tekOption.usebspress != "true")) {
                    if (BSKeyBeingActive == true) {
                        if (TouchEn_BaseBRW.ff)
                            nsEvent.preventDefault();
                        else
                            nsEvent.returnValue = false;
                        return;
                    }
                    BSKeyBeingActive = true;
                }

                // DOM Comma 가 쓰여질 경우, 보안 모듈은 이 Comma 의 존재를 알지 못한다. 				
                // DOM 과 보안 모듈간의 데이터길이 동기화를 위해 모듈에 comma 의 쓰여졌다는걸 알린다.					
                if (TouchEnKeyNXE_CurObj.value[TouchEnKeyNXE_CurObj.value.length - 1] == ",") {
                    TK_Request("comma", "--");
                }

                touchenexInterface.TK_KeyDown([false, chCode], "TK_KeyDown_callback");

                var e2eEle = document.getElementById("E2E_" + inputObj.id);
                if (inputObj && inputObj.id) {
                    if (e2eEle.value.length > 0) {
                        var value = e2eEle.value.substring(0, e2eEle.value.length - 32);
                        document.getElementById("E2E_" + inputObj.id).value = "";
                        document.getElementById("E2E_" + inputObj.id).value = value;
                    }
                }
                
                TouchEnKeyNXE_CurObj.value = TouchEnKeyNXE_CurObj.value.toString().substring(0, TouchEnKeyNXE_CurObj.value.toString().length);

            } else { //E2E 가 아닐때

                var len = TouchEnKeyNXE_CurObj.selectionEnd - TouchEnKeyNXE_CurObj.selectionStart;
                var CaretPos = GetCaretPosition(TouchEnKeyNXE_CurObj);
                var MaxLength = TouchEnKeyNXE_CurObj.getAttribute("maxlength");
                if ((keycode == 8 && len == 0 && CaretPos == 0) || (keycode == 46 && CaretPos == MaxLength)) {
                    if (TouchEn_BaseBRW.ff)
                        nsEvent.preventDefault();
                    else
                        nsEvent.returnValue = false;
                    return;
                }
                if (len > 0) {
                    touchenexInterface.TK_KeyDown([false, chCode, len],
                        "TK_KeyDown_callback");
                } else {
                    touchenexInterface.TK_KeyDown([false, chCode],
                        "TK_KeyDown_callback");
                }
            }
        } else {
            if (tekOption.bstart == 0) {
                if (TouchEn_BaseBRW.ff)
                    nsEvent.preventDefault();
                else
                    nsEvent.returnValue = false;

                return;
            }

            if (keycode == 120)
            {
                var len = TouchEnKeyNXE_CurObj.value.length;
                touchenexInterface.TK_KeyDown([false, "255", len],
                "TK_KeyDown_callback");
            }
        }
    } catch (e) {}
}


function TK_Change(nsEvent) {
}

function TK_Input(nsEvent) {
	if (TouchEnKeyNXE_CurObj == undefined) return;
	
	    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

	if(tekOption.bstart != 1 && TouchEnKeyNXE_CurObj!=undefined)
	{
		TouchEnKeyNXE_CurObj.value ="";
	}
	
	if (TouchEnKeyNXE_CurObj.value.length == 0 && TouchEnKeyNXE_CurObj!=undefined)
		TK_Clear(TouchEnKeyNXE_CurObj.id);
   
}

function TK_KeyDown_callback(result) {}

function TK_Select(nsEvent) {
    var theEvent;
    var inputObj;

    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    if ((inputObj.selectionStart > 0 && inputObj.selectionEnd > 0) || (inputObj.selectionEnd - inputObj.selectionStart > 0)) {
        if (inputObj.getAttribute("enc") == "on" ||
            inputObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                inputObj.type == "password")) {
            if (TouchEn_BaseBRW.ff)
            {
                nsEvent.preventDefault();
            }
            else
            {
                
                if (inputObj.selectionStart < inputObj.value.length) {
                    inputObj.selectionStart = inputObj.value.length;
                    inputObj.selectionEnd = inputObj.value.length;
                }
            }
        }
    }

    return true;
}


function TK_SetScroll(start, end) {

    try {

          if (TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" ||
            TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                (TouchEnKeyNXE_CurObj.type == "password"))) //defaultEnc 媛 ?덉슜?쇰븣 paswword ?꾨뱶????댁꽌??e2e媛 湲곕낯?ㅼ젙?대?濡??덉슜??留됱븘???쒕떎.
        {
                                
                TouchEnKeyNXE_CurObj.selectionStart = start
                TouchEnKeyNXE_CurObj.selectionEnd = end;
                
            
        }


    } catch (e) {}
}



function TK_click(nsEvent) {

    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    try {
        // Call win32 export functionSS
        EncOnFieldDisableEvent(inputObj);

        if (TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" ||
            TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                (TouchEnKeyNXE_CurObj.type == "password"))) //defaultEnc 가 허용일때 paswword 필드에 대해서는 e2e가 기본설정이므로 허용을 막아야 한다.
        {
            if (TouchEnKeyNXE_CurObj.selectionStart < TouchEnKeyNXE_CurObj.value.length) {
                TouchEnKeyNXE_CurObj.selectionStart = TouchEnKeyNXE_CurObj.value.length;
                TouchEnKeyNXE_CurObj.selectionEnd = TouchEnKeyNXE_CurObj.value.length;
            }
        }


    } catch (e) {}
}

function TK_AddEventListner() {
    try {
        var htmlAllColl = document.all;
        for (var j = 0; j < htmlAllColl.length; j++) {
            if (htmlAllColl[j].tagName == "INPUT" && (htmlAllColl[j].type == "text" || htmlAllColl[j].type == "password")) {
                TK_AddEventListner2(htmlAllColl[j]);
            }
        }
        
        bAddListner = true;
    } catch (e) {}
}

function TK_AddEventListner2(eobj) {
    if (!getTouchEnNXEType.WebKitBrowser) return false;
    try {
        if (eobj.addEventListener) {
            eobj.addEventListener("focus", TK_Start, false);
            eobj.addEventListener("blur", TK_Stop, false);
            eobj.addEventListener("keydown", TK_KeyDown, false);
            eobj.addEventListener("keypress", TK_Keypress, false);
            eobj.addEventListener("keyup", TK_Keyup, false);
            eobj.addEventListener("select", TK_Select);
            eobj.addEventListener("click", TK_click);
            eobj.addEventListener("contextmenu", TK_OnContextMenu);
            eobj.addEventListener("paste", TK_OnPaste);
            eobj.addEventListener("change", TK_Change);
            eobj.addEventListener("input", TK_Input);
        } else if (eobj.attachEvent) {
            eobj.attachEvent("onfocus", TK_Start);
            eobj.attachEvent("onblur", TK_Stop);
            eobj.attachEvent("onkeydown", TK_KeyDown);
            eobj.attachEvent("onkeypress", TK_Keypress);
            eobj.attachEvent("onkeyup", TK_Keyup);
            eobj.attachEvent("onselect", TK_Select);
            eobj.attachEvent("onclick", TK_click);
            eobj.attachEvent("oncontextmenu", TK_OnContextMenu);
            eobj.attachEvent("onpaste", TK_OnPaste);
            eobj.attachEvent("onchange", TK_Change);
            eobj.attachEvent("oninput", TK_Input);
        }
        if ((bInit != undefined && bInit != 0) && eobj.value.length==0) {
        	TK_Clear(eobj.id);
        }
        eobj.setAttribute("tk_security", "true");
    } catch (e) {}
}

function DrawHiddenElements() {
    try {
        var e2eEle = document.getElementById("hid_key_data");
        if (e2eEle == null) {
            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.id = "hid_key_data";
            newEle.value = "";
            form.appendChild(newEle);
        }

        e2eEle = document.getElementById("hid_enc_data");
        if (e2eEle == null) {

            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.name = "hid_enc_data";
            newEle.id = "hid_enc_data";
            newEle.value = "";
            form.appendChild(newEle);
        } else {
            e2eEle.id = "hid_enc_data";
        }
    } catch (e) {

    }
}

function DrawHiddenElements(form) {
    try {
        var e2eEle = document.getElementById("hid_key_data");
        if (e2eEle == null) {
            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.name = "hid_key_data";
            newEle.id = "hid_key_data";
            newEle.value = "";
            form.appendChild(newEle);
        } else {
            if (e2eEle.name != undefined) {
                e2eEle.id = "hid_key_data";
            }
        }

        e2eEle = document.getElementById("hid_enc_data");
        if (e2eEle == null) {

            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.name = "hid_enc_data";
            newEle.id = "hid_enc_data";
            newEle.value = "";
            form.appendChild(newEle);
        } else {
            e2eEle.id = "hid_enc_data";
        }
    } catch (e) {

    }
}


function DrawHiddenElementsId() {
    try {
        var e2eEle = document.getElementById("hid_key_data");
        if (e2eEle == null) {
            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.id = "hid_key_data";
            newEle.value = "";
            document.body.appendChild(newEle);
        } else {
            if (e2eEle.id != undefined) {
                e2eEle.id = "hid_key_data";
            }
        }

        e2eEle = document.getElementById("hid_enc_data");
        if (e2eEle == null) {
            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.id = "hid_enc_data";
            newEle.value = "";
            document.body.appendChild(newEle);

        } else {
            if (e2eEle.id != undefined)
                e2eEle.id = "hid_enc_data";
        }
    } catch (e) {

    }
}

function GetEncDataFun(keyData, frm, eleName) {
    touchenexInterface.GetEncData([keyData, frm, eleName],
        "GetEncDataCallback2");
}

function makeKeyData(formObj) {
    var len = formObj.elements.length;

    for (var j = 0; j < len; j++) {
        if (formObj.elements[j].tagName == "INPUT" && (formObj.elements[j].type == "text" || formObj.elements[j].type == "password") && (formObj.elements[j].getAttribute("data-enc") == "on" || formObj.elements[j]
                .getAttribute("enc") == "on") || (tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true")) {
            GetEncDataFun("", formObj.name, formObj.elements[j].name);
        }
    }
    GetEncDataFun(cert, "", "");
}

function makeEncDataEx(formObj) {
    DrawHiddenElementsId();

    var e2eEle = "";
    var j = 0;
    var name = new Array(formObj.elements.length);
    var value = new Array(formObj.elements.length);
    var len = formObj.elements.length;
    var makeEncFiled = false;
    for (var i = 0; i < len; i++) {
        makeEncFiled = false;
        var InputObject = formObj.elements[j];

        if (tekOption.defaultenc != "undefined") {
            if (InputObject.tagName == "INPUT" && (tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true")) {
                if (InputObject.type == "password")
                    makeEncFiled = true;
            }
        }
        if (makeEncFiled == false) {
            if (InputObject.tagName == "INPUT" && (InputObject.type == "text" || InputObject.type == "password") && ((InputObject.getAttribute('data-enc') == "on") || (InputObject.getAttribute('enc') == "on")) || (tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true")) {
                makeEncFiled = true;
            }
        }        
        
        if (makeEncFiled == true) {
        	if (InputObject.tagName == "INPUT" && (InputObject.type == "text" || InputObject.type == "password") && ((InputObject.getAttribute('data-enc') == "on") || (InputObject.getAttribute('enc') == "on")) || ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") && InputObject.type == "password")) {
	            name[j] = "";
	            value[j] = "";
	            name[j] = "E2E_" + InputObject.name;
	
	            e2eEle = document.getElementById(name[j]);
	            if (e2eEle == null) {
	                var newEle = document.createElement("input");
	                newEle.type = "hidden";
	                newEle.name = name[j];
	                newEle.value = "";
	                formObj.appendChild(newEle);
	            }
	            try{
	            	InputObject.setAttribute("autocomplete", "off");
	        	}catch(e){}
        	}
        }
        j++;
    }
}

function makeEncDataId() {
    DrawHiddenElementsId();
    var e2eEle = "";
    var j = 0;
    var makeEncFiled = false;
    var htmlAllColl = document.all;
    var len = htmlAllColl.length;

    for (var i = 0; i < len; i++) {
        if (htmlAllColl[i].tagName != "INPUT") continue;
        if (htmlAllColl[i].type != "text" && htmlAllColl[i].type != "password") continue;

        makeEncFiled = false;
        InputObject = htmlAllColl[i];
        if (tekOption.defaultenc != "undefined") {
            if (InputObject.tagName == "INPUT" && (tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true")) {
                if (InputObject.type == "password")
                    makeEncFiled = true;
            }
        }
        if (makeEncFiled == false) {
            if (InputObject.tagName == "INPUT" && (InputObject.type == "text" || InputObject.type == "password") && ((InputObject.getAttribute('data-enc') == "on") || (InputObject.getAttribute('enc') == "on"))) {
                makeEncFiled = true;
            }
        }

        if (makeEncFiled == true) {
            var E2E_id = "E2E_" + InputObject.id;
            e2eEle = document.getElementById(E2E_id);
            if (e2eEle == null) {
                var newEle = document.createElement("input");
                newEle.type = "hidden";
                newEle.id = E2E_id;
                newEle.value = "";
                document.body.appendChild(newEle);
            } else {
                document.getElementById(E2E_id).value = "";
            }
        }
        j++;
    }
}




function GetEncData() {
    var nodeLen = document.all.length;
    var htmlColl = document.all;

    for (var k = 0; k < nodeLen; k++) {
        var ele = htmlColl[k];
        if (ele.type == "hidden" && (ele.id.indexOf("E2E_") != -1)) {
            if (tekOption.UseGetEnc == "true" && tekOption.clearbufferonempty == "true") {
                var eleRaw = ele.name.substring(ele.id.indexOf("_") + 1);
                if (document.getElementById(eleRaw).value.length == 0) {
                    continue;
                }
            }
            touchenexInterface.GetEncData([false, "", ele.id.substring(4, ele.id.length), DomID], "GetEncDataCallback");
        }
    }
}

function TouchEnKey_UIEevents(frm, ele, event, keycode) {
    var obj;
    var e;

	obj = document.activeElement;
	eventName = event.replace("on", "");
	//triggerEvent(obj, e, keycode);

	var htmlEvents = {
        onkeydown: 1,
        onkeypress: 1,
        onkeyup: 1
    };
    var eventOjb;
	if (document.createEvent) {
        eventOjb = document.createEvent('HTMLEvents');
        eventOjb.initEvent(eventName, true, true);
	}else if (document.createEventObject) {
        eventOjb = document.createEventObject();
        eventOjb.eventType = eventName;
	}


    eventOjb.eventName = eventName;
    eventOjb.keyCode = keycode;
    eventOjb.which = keycode;

    if (obj.dispatchEvent) {
		obj.dispatchEvent(eventOjb);
    } else if (obj.fireEvent && htmlEvents['on' + eventName]) {
        obj.fireEvent('on' + eventOjb.eventType, eventOjb);
    } else if (obj[eventName]) {
        obj[eventName]();
    } else if (obj['on' + eventName]) {
        obj['on' + eventName]();
    }
}

function update_callback(result) {
    if (result.length != undefined) {
        result = JSON.parse(result);
    }

    if (result.ClearCallBack != undefined) {
        tekOption.setcallback = "false";
    }

    if (result.FaqMove != undefined) {
        this.top.location.href = result.FaqMove;
        return;
    }

    if (document.hasFocus() == false) {
        touchenexInterface.TK_RealStop(false, "TK_Stop_callback");
        tekOption.bstart = 0;
        return;
    }

    if (result.GetActiveElement != undefined) {

        var bsecurityOff = false;

        var activeObj = document.activeElement;
        if (activeObj != undefined) {
            // blur 가 발생한 input 객체와, 지금 활성한된 입력필드가 같은지를 비교하여, 틀리면 stop 시키지 않는다.
            // activeObj 가 "" 이면 stop 시킨다. (alert 창이 들때, INPUT 이면서 activeObj 가 "" 로 들어온다//)
            if (activeObj.getAttribute("security") == "off" ||  activeObj.getAttribute("data-security") == "off" ||
                activeObj.getAttribute("tk_security") == null )
                bsecurityOff = true;

            if (bsecurityOff == false && (activeObj.type == "text"  || activeObj.type == "password"))
            {
                return;
            }


            if ((activeObj.type == "text" || activeObj.type == "password") && bsecurityOff == false){
                return;
            } else {
                try {
                    touchenexInterface.TK_RealStop(false, "TK_Stop_callback");
                    tekOption.bstart = 0;
                } catch (e) {}
            }
        }
    }

    if (result.inputClear != undefined) {
        var TK_tmp = document.getElementById(result.inputClear);
        if ((TK_tmp.getAttribute("enc") == "on" || TK_tmp.getAttribute("data-enc") == "on") || ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") && TK_tmp.type == "password")) {
            document.getElementById("hid_enc_data").value = "";
            document.getElementById(result.inputClear).value = "";
            
            return;
        }
        else{
            if ( document.getElementById("hid_enc_data") != undefined) {
                document.getElementById("hid_enc_data").value = "";
                document.getElementById(result.inputClear).value = "";
            }
            
            return;
        }
    }

    if (result.EncData != undefined) {
        if (result.EncData.split('E2E_')[1] != TouchEnKeyNXE_CurObj.id) return;

        if (tekOption.usegetenc == "false") {
            var crypt = document.getElementById("hid_enc_data").value;
            document.getElementById("hid_enc_data").value = "";
            document.getElementById("hid_enc_data").value = crypt + result.value;
        } else {
            var e2eEle = document.getElementById(result.name);
            var nodeLen = document.all.length;
            var htmlColl = document.all;

            for (var k = 0; k < nodeLen; k++) {
                if (result.EncData == htmlColl[k].id) {
                    htmlColl[k].value = result.value;
                    cipherEncText += htmlColl[k].id
                    cipherEncText += "=";
                    cipherEncText += result.value;
                    cipherEncText += "%TK%";
                }
            }
        }
        
        return;
    }

    if (result.addChar != undefined) {
        if (result.addChar.split("_#_")[1] != TouchEnKeyNXE_CurObj.id) return;

        var szCh = result.addChar.split("_#_")[0];
        if ((TouchEnKeyNXE_CurObj.getAttribute("enc") == "on" || TouchEnKeyNXE_CurObj.getAttribute("data-enc") == "on") || (TouchEnKeyNXE_CurObj.type == "password" && (tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true"))) {
            var inputText = TouchEnKeyNXE_CurObj.value;
            TouchEnKeyNXE_CurObj.value = inputText + szCh;
        } else {
            var MaxLength = TouchEnKeyNXE_CurObj.getAttribute("maxlength");
            var valueLength = TouchEnKeyNXE_CurObj.value.length;
            if (MaxLength != undefined && valueLength >= MaxLength) {
                if (TouchEnKeyNXE_CurObj.selectionStart == 0 && TouchEnKeyNXE_CurObj.selectionEnd == valueLength) {} else {
                    return;
                }
            }

            if (TouchEnKeyNXE_CurObj.value.length > 0) {
                var caretPos = GetCaretPosition(TouchEnKeyNXE_CurObj);
                var tmpValue = TouchEnKeyNXE_CurObj.value.toString();
                var tmpValue2="";

                var selectSize = TouchEnKeyNXE_CurObj.selectionEnd - TouchEnKeyNXE_CurObj.selectionStart;
                if (selectSize > 0) {

                    if (TouchEnKeyNXE_CurObj.selectionEnd == TouchEnKeyNXE_CurObj.value.length)
                    {
                        tmpValue = TouchEnKeyNXE_CurObj.value.substring(0, TouchEnKeyNXE_CurObj.selectionStart);
                        TouchEnKeyNXE_CurObj.value = tmpValue+szCh;
						TouchEnKeyNXE_CurObj.selectionEnd =  TouchEnKeyNXE_CurObj.value.length;
						
                    }
                    else
                    {
                        tmpValue = TouchEnKeyNXE_CurObj.value.substring(0, TouchEnKeyNXE_CurObj.selectionStart);
                        tmpValue2 = TouchEnKeyNXE_CurObj.value.substring(TouchEnKeyNXE_CurObj.selectionEnd,  TouchEnKeyNXE_CurObj.value.length);
                        TouchEnKeyNXE_CurObj.value = tmpValue+szCh+tmpValue2;
                        TouchEnKeyNXE_CurObj.selectionStart = tmpValue.length + 1;
                        TouchEnKeyNXE_CurObj.selectionEnd = tmpValue.length + 1;
                    }
                } else {
                    TouchEnKeyNXE_CurObj.value = tmpValue.substring(0, caretPos) + szCh + tmpValue.substring(caretPos);
                    TouchEnKeyNXE_CurObj.selectionStart = caretPos + 1;
                    TouchEnKeyNXE_CurObj.selectionEnd = caretPos + 1;
                }
            } else {
                if (TouchEnKeyNXE_CurObj.end - TouchEnKeyNXE_CurObj.start > 1)
                    TouchEnKeyNXE_CurObj.value = "";

                TouchEnKeyNXE_CurObj.value = szCh;
            }
			 TouchEnKeyNXE_CurObj.selectionStart = TouchEnKeyNXE_CurObj.selectionEnd;
        }

        TouchEnKey_UIEevents(0, TouchEnKeyNXE_CurObj, "keydown", 120);
        TouchEnKey_UIEevents(0, TouchEnKeyNXE_CurObj, "keypress", 120);
        TouchEnKey_UIEevents(0, TouchEnKeyNXE_CurObj, "keyup", 120);
        return;
    }

    if (result.E2E_END != undefined) {
        document.body.hid_key_data.value = TouchEnNXE_SeedKey;
        
        return;
    }


    if (result.SeedKey != undefined) {
        cipherEncText = "";
        TouchEnNXE_SeedKey = result.value;

        DrawHiddenElementsId();
        document.getElementById("hid_key_data").value = TouchEnNXE_SeedKey;
	}
}

function GetEncDataCallback(Result) {

}

function GetEncDataCallback2(result) {
    formObj = document.forms[0];
    var name, value;
    var result = result.reply;
    if (result.keydata == undefined) {
        name = "E2E_" + result.name;
        id = "E2E_" + result.name;
        value = result.value;

        cipherEncText += name;
        cipherEncText += "=";
        cipherEncText += value;
        cipherEncText += "%TK%";
        e2eEle = document.getElementById(name);
        if (e2eEle == null) {
            var newEle = document.createElement("input");
            newEle.type = "hidden";
            newEle.name = name;
            newEle.id = name;
            newEle.value = value;
            formObj.appendChild(newEle);
        } else {
            e2eEle.value = value;
        }
    } else {
        DrawHiddenElements(formObj);

        formObj.hid_key_data.value = result.keydata;
        formObj.hid_enc_data.value = cipherEncText;
        cipherEncText = "";


        document.forms[0].method = "post";
        document.forms[0].action = "./jsp/result.jsp";
        document.forms[0].submit();
    }
}

function TouchEnNXE_createHexString(arr, size) {
    var result = "";
    for (var i = 0; i < size; i++) {
        var str = arr[i].toString(16);

        if (str.length == 1) {
            str = '0' + str;
        }
        result += str;
    }
    return result;
}

function GetCaretPosition(oField) {
    var iCaretPos = 0;
    if (document.selection) {
        oField.focus();
        var oSel = document.selection.createRange();
        oSel.moveStart('character', -oField.value.length);
        iCaretPos = oSel.text.length;
    } else if (oField.selectionStart || oField.selectionStart == '0') {
        iCaretPos = oField.selectionStart;
    }
    return (iCaretPos);
}

function TK_Request(key, value) {

    var strReq;


    if (key != null) {
        var req = {
            "key": key,
            "value": value
        };
        strReq = JSON.stringify(req);
    } else {
        strReq = JSON.stringify(value);

    }

    touchenexInterface.TK_Request([strReq], "TK_Request_Callback");
}


function TK_Request2(key, elename, value) {
    var req = {
        "key": key,
        // "frmname": frmname,
        "elename": elename,
        "DomID": DomID,
        "value": value
    };
    TK_Request(null, req);
}

function TK_RequestEx(key, req) {
    TK_Request(null, req);
}

function TK_Request_Callback(result) {
    if (result.key == undefined)
        // 입력하지 않은경우 반환을 위해 수정
        (fnGetEncXWCallback || fnGetEncYTCallback)("");
    if (result.key == "isVM"){
    }
    else if (result.key == "XW_Crypt") {
        fnGetEncXWCallback(result.value);
    }
    else if (result.key == "YT_Crypt")
    {
    	  fnGetEncYTCallback(result.value);
}
}

function IsDenyPaste(nsEvent) {

    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    try {
        if (inputObj.getAttribute("enc") == "on" ||
            inputObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                (inputObj.type == "password"))) {
            return true;
        }

        // 일반 보안 영역 (E2E 아님)
        // 붙여 넣기 허용 일때, Datytype 이 들어 가 있으면 허용 하지 않는다.
        // datatype 이 존재 하면 붙여 넣기 금지.


        if ((tekOption.defaultpaste == "false") || (tekOption.defaultpaste == "off") || (tekOption.defaultpaste == "no")) {
            //defaultpaste false 라도 비보안 영역은 붙여 넣기를 허용
            if (TouchEnKeyNXE_CurObj.getAttribute("data-security") != "off" && TouchEnKeyNXE_CurObj.getAttribute("security") != "off") {
                return true;
            }

        } else {
            if (TouchEnKeyNXE_CurObj.getAttribute("datatype") != null || TouchEnKeyNXE_CurObj.getAttribute("data-datatype") != null) {
                return true;
            }

        }

    } catch (e) {}

    return false;
}

function TK_OnContextMenu(nsEvent) {
    if (IsDenyPaste(nsEvent) == true) {
        nsEvent.preventDefault();
    }
    return;
}

function TK_OnPaste(nsEvent) {
    if (IsDenyPaste(nsEvent) == true) {
        nsEvent.preventDefault();
    }
    return;
}

function TK_Clear(elename) {
    try {
        if (bInit != undefined && bInit != 0) {
        	if(getTouchEnNXEType.MSIEBrowser){
        		TK_Request2("Clear", elename, "");
        	}else{
        		TK_Request2("ClearDB", elename, "");
        	}
        }
        var inputObj = document.getElementById(elename);
        if ((inputObj.getAttribute("enc") == "on" || inputObj.getAttribute("data-enc") == "on") || inputObj.getAttribute("type") == "password") {
            if (document.getElementsByName("E2E_" + elename)[0] != "null")
                document.getElementsByName("E2E_" + elename)[0].value = "";
        }
    } catch (e) {}
}

/**
 * 웹 브라우저의 DOM을 다시 분석하는 기능으로, 웹페이지 로딩 후
 * 동적필드 생성시 TouchEnKey_ReScan()함수를 사용해야 보안이 동작합니다.
 * ReScan함수 호출 후에는 기존 입력된 값이 삭제됩니다.
 *
 * 사용방법 TK_Rescan() : Dom 전체 scan
 */
function TK_Rescan() {
	if (bInit == undefined && bInit == 0) return;
	if(!useTouchEnnxKey) return;
        try {
            if (getTouchEnNXEType.MSIEBrowser) {
                TK_Request2("Rescan2", "");
            } else if (getTouchEnNXEType.WebKitBrowser) {
                for (var i = 0; i < document.forms.length; i++) {
                    if (document.forms[i].name != undefined && document.forms[i].name != touchenexInfo.exFormName)
                        makeEncDataEx(document.forms[i]);
                }
                TK_AddEventListner();
            }
        } catch (e) {}
    }
    /**
     * TouchEn nxKey 동적 필드 생성시 키보드보안 적용을 위해 Form 단위로 scanning 하는 함수
     *
     * 사용방법 TK_EnqueueList_frm(frmName) : Form 단위 scan
     *
     * Parameter - frmName : form 의 name
     */
function TK_EnqueueList_frm(frmname) {
	if (bInit == undefined && bInit == 0)	return;
	if(!useTouchEnnxKey) return;
    try {
        var frm = document.getElementsByName(frmname)[0];
        var elelength = frm.elements.length;
        for (var j = 0; j < elelength; j++) {
            if (frm.elements[j].tagName == "INPUT" && (frm.elements[j].type == "text" || frm.elements[j].type == "password")) {
                if (getTouchEnNXEType.MSIEBrowser) {
                    TK_Request2("EnqueueList", frmname, frm.elements[j].name, "");
                } else if (getTouchEnNXEType.WebKitBrowser) {
                    if (frm.name != undefined && frm.name != touchenexInfo.exFormName)
                        makeEncDataEx(frm);
                    TK_AddEventListner2(frm.elements[j]);
                    bAddListner = true;
                }
                if (frm.elements[j].getAttribute("enc") == "on" || frm.elements[j].getAttribute("data-enc") == "on") {
                	//frm.elements[j].value = ""; 2015.09.04 주석
                    if (document.getElementsByName("E2E_" + frm.elements[j].name)[0] != undefined) {
                        document.getElementsByName("E2E_" + frm.elements[j].name)[0].value = "";
                    }
                }
            }
        }
    } catch (e) {}
}

/**
 * TouchEn nxKey 동적 필드 생성시 키보드보안 적용을 위해 Form,element 단위로 scanning 하는 함수
 *
 * 사용방법 TK_EnqueueList(frmName ,eleName) Element 단위 scan
 *
 * Parameter - frmName : form 의 name - eleName : input element의 name
 */
function TK_EnqueueList(elename) {
	
	TK_EnqueueList(elename, undefined);

}
 
function TK_EnqueueList(elename, initechCallback) {
	if (bInit == undefined && bInit == 0)	return;
	if(!useTouchEnnxKey) return;
    try {
        var inputObj = document.getElementById(elename);
        if (getTouchEnNXEType.MSIEBrowser) {
            TK_Request2("EnqueueList", elename, "");
        } else if (getTouchEnNXEType.WebKitBrowser) {
          /*
            var frm = document.getElementsByName(frmname)[0];
            if (frm.name != undefined && frm.name != touchenexInfo.exFormName)
                makeEncDataEx(frm);
                */
            TK_AddEventListner2(inputObj);
            bAddListner = true;
        }
        //inputObj.value = ""; 2015.09.04 주석
        if (inputObj.getAttribute("enc") == "on" || inputObj.getAttribute("data-enc") == "on") {
            if (document.getElementsByName("E2E_" + inputObj.name)[0] != undefined) {
                document.getElementsByName("E2E_" + inputObj.name)[0].value = "";
            }
        }
        if(initechCallback){
			initechCallback();
        }
    } catch (e) {}
}

function EncOnFieldDisableEvent(nsEvent) {
    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    if (inputObj.getAttribute("enc") == "on" ||
        inputObj.getAttribute("data-enc") == "on" ||
        ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
            (inputObj.type == "password"))) {

        inputObj.onselectstart = function () {
            return false;
        };
        inputObj.unselectable = "on";
        inputObj.style.MozUserSelect = "none";

        return;
    }
}

function TK_GetEncXW(frmName, eleName, sKey, callback) {
    fnGetEncXWCallback = callback;
    var req = {
        "key": "GetEncData",
        "securekey": sKey,
        "id": eleName,
        "formName": frmName
    };
    TK_RequestEx(null, req);
}

function TK_GetEncInitech(eleName, pubKey, callback)
{
	fnGetEncYTCallback = callback;
	var req = {
		"key": "GetEncDataYT",
		"pubkey": pubKey,
		"id": eleName
	};
  TK_RequestEx(null, req);
 }



 function TK_OnContextMenu(nsEvent) {
    if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    try {
        if (inputObj.getAttribute("enc") == "on" ||
            inputObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                (inputObj.type == "password"))) {
            nsEvent.preventDefault();
            TK_click(nsEvent);
        }
	} catch (e) {}

    return;
}

function TK_OnPaste(nsEvent) {
	if (nsEvent.type == "text" || nsEvent.type == "password") {
        inputObj = nsEvent;
    } else {
        theEvent = nsEvent ? nsEvent : window.event;
        inputObj = theEvent.target ? theEvent.target : theEvent.srcElement;
    }

    try {
        if (inputObj.getAttribute("enc") == "on" ||
            inputObj.getAttribute("data-enc") == "on" ||
            ((tekOption.defaultenc == "on" || tekOption.defaultenc == "yes" || tekOption.defaultenc == "true") &&
                (inputObj.type == "password"))) {
            nsEvent.preventDefault();
			return;
        }

        // 일반 보안 영역 (E2E 아님)
        // 붙여 넣기 허용 일때, Datytype 이 들어 가 있으면 허용 하지 않는다.
        // datatype 이 존재 하면 붙여 넣기 금지.

        if ((tekOption.defaultpaste == "false") || (tekOption.defaultpaste == "off") || (tekOption.defaultpaste == "no")) {
            //defaultpaste false 라도 비보안 영역은 붙여 넣기를 허용
            if (TouchEnKeyNXE_CurObj.getAttribute("security") == "off" || TouchEnKeyNXE_CurObj.getAttribute("data-security") == "off") {
                return;
			} else {
				nsEvent.preventDefault();
			}
        } else {
            if (TouchEnKeyNXE_CurObj.getAttribute("datatype") != null || TouchEnKeyNXE_CurObj.getAttribute("data-datatype") != null) {
				nsEvent.preventDefault();
            }
        }

    } catch (e) {}

    return;
}

function TK_InvalidateSession(srdk) {
    var req = {
        "key": "InvalidateSession",
        "srdk": srdk
    };
    TK_RequestEx(null, req);
}

/** 20150904 변경 */
function TK_EncModify(value,formname, elename) {

    var req = {
        "formname" : formname,
        "name" : elename,
        "key": "EncModify",
        "value": value
    };
    if (bInit != undefined && bInit != 0) {
        TK_RequestEx(null, req);
    }
		if (getTouchEnNXEType.MSIEBrowser) 
			return;	
			
	var e2e_ele = "E2E_" + TouchEnKeyNXE_CurObj.name;
	var frm = TouchEnKeyNXE_CurObj.form;
	
	if (value == "on" || value == "yes" || value == "true")
	{
		if (document.getElementsByName(e2e_ele)[0] == undefined && frm != undefined)
		{
			var newEle = document.createElement("input");
				newEle.type = "hidden";
				newEle.name = e2e_ele;
				newEle.value = "";
				frm.appendChild(newEle);
		}
	}
	else
	{
		if (document.getElementsByName(e2e_ele)[0] != undefined)
		{
			document.getElementsByName(e2e_ele)[0].value = "";
		}
		
	}
}

function TK_processingbar(tmp){
	if(!nxKey.processingbar) return;
	if(tmp){
		if(document.getElementById("tk_overtopDiv")!=null) return true;
		var div = document.createElement("div");
		div.setAttribute("id", "tk_overtopDiv");
		document.body.appendChild(div);
		var processingbar = '<div id="tk_overdiv" style="z-index:999997;position:fixed; width:100%; height:100%; top:0px; left:0px; background-color: #000000; opacity: 0.3; filter: alpha(opacity=30);">';
		processingbar += '<div style="z-index:9999998;position:fixed;top:50%; height:100%;width:100%;">';
		processingbar += '<div style="margin: 0 auto; padding: 5px; width:150px; vertical-align:middle; font-weight:bold; text-align: center; border-radius:5px;">';
		processingbar += '<img src="'+ nxKey.processingbarimg +'" style="vertical-align:middle"/>';
		processingbar += '</div>';
		processingbar += '</div>';
		processingbar += '</div>';
		document.getElementById("tk_overtopDiv").innerHTML = processingbar;
	}else{
		if(document.getElementById("tk_overtopDiv")!=null)
			document.body.removeChild(document.getElementById("tk_overtopDiv"));
	}
}

function TK_FaqMove(faq) {
	 
    if (faq =="1")
    {
    	this.top.location.href = "http://faq.touchen.co.kr/nxKey/page/damage.htm";
    }
    else if (faq == "2") 
    {
    	this.top.location.href = "http://faq.touchen.co.kr/nxKey/page/damage.htm";  
    }
   
    return;
}

function TK_CommonError( response ){ 
    if(response.ERR == "BLOCK"){ 
        TK_FaqMove(2); 
    }
    else if(response.ERR == "BLOCK:EX"){ 
        TK_FaqMove(2); 
    }
    else if(response.ERR == "BLOCK:CLIENT"){ 
        TK_FaqMove(2); 
    }
    else if(response.ERR == "BLOCK:INTERNAL"){ 
        TK_FaqMove(2); 
    }
    return; 
} 