/*
	CrossWebEX Javascript Library
	iniLINE Co.,Ltd.
	1.0.0.6278
*/
function jsloader(url, callback, charset, attribute){
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = "text/javascript";

    if(!charset){
        script.charset="utf-8";
    };

    var loaded = false;
    script.onreadystatechange = function(){
        if( this.readyState == 'loaded' || this.readyState == 'complete' ){
            if( loaded ){
                return;
            };
            loaded = true;
			if(callback){
	            callback();
			};
        };
    };
    script.onload = function(){
		if(callback){
	    	callback();
		};
    };
    script.src = url;

	if(attribute && (attribute.length > 0)){
		for(var aint = 0; aint < attribute.length; aint ++){
			script.setAttribute(attribute[aint].key, attribute[aint].value);
		}
	}
    head.appendChild(script);
};

function cssloader(url, callback, charset){
    var head = document.getElementsByTagName('head')[0];
    var css = document.createElement('link');
	css.rel = "stylesheet";
	css.type = "text/css";
    if(!charset){
        css.charset="utf-8";
    };
	css.href = url;
	
	var loaded = false;
    css.onreadystatechange = function(){
        if( this.readyState == 'loaded' || this.readyState == 'complete' ){
            if( loaded ){
                return;
            };
            loaded = true;
			if(callback){
	            callback();
			};
        };
    };
    css.onload = function(){
		if(callback){
	    	callback();
		};
    };
    head.appendChild(css);
};

var INI_html5BasePath = '';
var crosswebexBaseDir = INI_html5BasePath + "/initech/extension";

//cwInit onload
var cwOnload = true;

//var callback1 = function(){jsloader(crosswebexBaseDir + "/cw_sfilter_adt.js",callback2,"utf-8")};
//var callback2 = function(){jsloader(crosswebexBaseDir + "/common/js/exproto.js",callback3,"utf-8")};
//var callback3 = function(){jsloader(crosswebexBaseDir + "/common/exinstall.js",callback4,"utf-8")};
//var callback4 = function(){jsloader(crosswebexBaseDir + "/common/exinterface.js",callback5,"utf-8")};
//var callback5 = function(){jsloader(crosswebexBaseDir + "/crosswebexInit.js",function(){return false;},"utf-8")};
//
//// Html5 연동 Adptor
//jsloader(INI_html5BasePath + "/res/script/adaptor/cw_sfilter_neo_adt.js",callback1,"utf-8");
var importURL = "http://demo.initech.com:8111/CertRelay/servlet/GetCertificateV12";
var exportURL = "http://demo.initech.com:8111/CertRelay/servlet/GetCertificateV12";

var TimeURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/Time.jsp";
var RandomURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/Random.jsp";
var E2ERandomURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + "/common/tools/E2E_Random.jsp";
var LogoURL = window.location.protocol + "//" + window.location.host + crosswebexBaseDir + '/img/plugin.initech.com.gif';

document.write("<script type='text/javascript' src='/res/script/adaptor/cw_sfilter_neo_adt.js'></script>");
document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/cw_sfilter_adt.js'></script>");
document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/common/js/exproto.js'></script>");
document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/common/exinstall.js'></script>");
document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/common/exinterface.js'></script>");
document.write("<script type='text/javascript' src='" + crosswebexBaseDir + "/crosswebexInit.js'></script>");


var SFRequestCMDcallback;
var SFinitializeFlag = false;
var E2ESFinitializeFlag = false;

function E2ESFinitializeCallback(check){
	currStatus = check;
    if (currStatus.status) {
        touchenexInfo.tkInstalled = currStatus.status;
        TOUCHENEX_LOADING("TK_LoadingCallback");
        E2ESFinitializeFlag = true;
    } else {
        TK_notInstall(currStatus);
    }
	
	try{
		if(SFRequestCMDcallback){
			SFRequestCMDcallback();		
		}
	} catch (e){}
};

function SFinitializeCallback(check){	
	if(check.status){
		CROSSWEBEX_LOADING("cwLoadingCallback");
		SFinitializeFlag = true;
		
		if(CROSSWEBEX_UTIL.isWin()){
			TOUCHENEX_CHECK.check([touchenexInfo], "E2ESFinitializeCallback");
		}else{
			try{
				if(SFRequestCMDcallback){
					SFRequestCMDcallback();		
				}
			} catch (e){}
		}
	}else{
		try{
			if(SFRequestCMDcallback){
				SFRequestCMDcallback();		
			}
		} catch (e){}
	}
};

function getSFinitializeFlag(){
	return SFinitializeFlag;
};

function SFinitialize(callback){
	SFRequestCMDcallback = callback;
	CROSSWEBEX_CHECK.check([crosswebexInfo], "SFinitializeCallback");
};

/**
 * 로그인
 * @param url
 * @param postData
 * @param form
 * @param overlap
 * @param callback
 */
function SFLoginProcessWithForm(url, postData, form, overlap, callback, isHtml5, isCmp) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFLoginProcessWithForm(url, postData, form, overlap, callback, isCmp);		
	}else{
		CrossWebExSFilter.SFLoginProcessWithForm(url, postData, form, overlap, callback);		
	}
};

function SFLoginProcessWithFormInstalled(url, postData, form, overlap, callback, isHtml5, isCmp) {
	if(isHtml5 || !Html5Adaptor.isIstalledExteral()){ //설치가 되지 않은 경우
		Html5Adaptor.SFLoginProcessWithForm(url, postData, form, overlap, callback, isCmp);		
	}else{
		CrossWebExSFilter.SFLoginProcessWithForm(url, postData, form, overlap, callback);		
	}
};

function SFLoginProcess(url, postData, overlap, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFLoginProcess(url, postData, overlap, callback);
	}else{
		CrossWebExSFilter.SFLoginProcess(url, postData, overlap, callback);		
	}
};

/**
 * 전자서명
 * @param url
 * @param signData
 * @param postData
 * @param form
 * @param overlap
 * @param callback
 */
function SFSignProcessWithForm(url, signData, postData, form, overlap, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFSignProcessWithForm(url, signData, postData, form, overlap, callback);
	}else{
		CrossWebExSFilter.SFSignProcessWithForm(url, signData, postData, form, overlap, callback);
	}
};

/**
 * 인증서 관리
 */
function SFCertManagerProcessWithForm(isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertManagerProcessWithForm();
	}else{
		CrossWebExSFilter.SFCertManagerProcessWithForm();
	}
};

/**
 * 인증서 가져오기/내보내기
 */
function SFCertImportV11WithForm(isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertImportV11WithForm();
	}else{
		alert('준비중입니다.');
//		CrossWebExSFilter.SFCertCopyProcessWithForm(isHtml5);
	}
};
function SFCertExportV11WithForm(isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertExportV11WithForm();
	}else{
		alert('준비중입니다.');
	}
};
function SFCertImportV12WithForm(isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertImportV12WithForm();
	}else{
		CrossWebExSFilter.SFCertImportV12ProcessWithForm();
	}
};
function SFCertExportV12WithForm(isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertExportV12WithForm();
	}else{
		CrossWebExSFilter.SFCertExportV12ProcessWithForm();
	}
};

/**
 * 공인인증서 발급
 * @param url
 * @param postData
 * @param overlap
 * @param callback
 */
function SFCertIssueProcess(url, postData, overlap, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertIssueProcess(url, postData, overlap, callback);
	}else{
		CrossWebExSFilter.SFCertIssueProcess(url, postData, overlap, callback);
	}
};

/**
 * 공인인증서 재발급
 * @param url
 * @param postData
 * @param overlap
 * @param callback
 */
function SFCertReplaceProcess(url, postData, overlap, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertReplaceProcess(url, postData, overlap, callback);
	}else{
		CrossWebExSFilter.SFCertReplaceProcess(url, postData, overlap, callback);
	}
};

/**
 * 공인인증서 갱신
 * @param url
 * @param postData
 * @param overlap
 * @param callback
 */
function SFCertUpdateProcess(url, postData, overlap, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertUpdateProcess(url, postData, overlap, callback);
	}else{
		CrossWebExSFilter.SFCertUpdateProcess(url, postData, overlap, callback);
	}
};

/**
 * 공인인증서 갱신
 * @param url
 * @param postData
 * @param overlap
 * @param callback
 */
function SFCertRevokeProcess(url, postData, overlap, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFCertRevokeProcess(url, postData, overlap, callback);
	}else{
		CrossWebExSFilter.SFCertRevokeProcess(url, postData, overlap, callback);
	}
};

/**
 * PC정보 수집
 * @param form
 * @param callback
 */
function SFGetPCInfoWithForm(form, callback, isHtml5){
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFGetPCInfoWithForm(form, callback);
	}else{
		CrossWebExSFilter.SFGetPCInfoWithForm(form, callback);
	}
};

/**
 * NIC정보 수집
 * @param url
 * @param callback
 */
function SFGetNICInfo(url, callback, isHtml5) {
	if(isHtml5 || Html5Adaptor.isHtml5Service()){
		Html5Adaptor.SFGetNICInfo(url, callback);
	}else{
		CrossWebExSFilter.SFGetNICInfo(url, callback);
	}
};