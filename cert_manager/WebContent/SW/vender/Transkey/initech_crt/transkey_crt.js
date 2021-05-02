//170321_initech_transkey
/*
 * Transkey
 * (C) 2013. RAONSECURE,Inc. All rights reserved.
 * Version 4.6.7
 * 2016-05-30
 */


//config
var transkey_url='/SW/vender/Transkey';var transkey_surl ='/transkeyServlet';var tk_useButton=true;var tk_useTranskey=false;
var transkey_isMultiCursor=false;var transkey_isDraggable=true;var tk_blankEvent="onmouseover";
var useCheckTranskey=false;var transkey_encDelimiter = ',';	var keyboardLayouts = ["qwerty", "number"];
var transkey_delimiter='$';
//config


//document.write('<script type="text/javascript" src="'+transkey_url+'/rsa_oaep_files/sha1.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/rsa_oaep_files/aes-enc.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/rsa_oaep_files/hmac-sha1.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/rsa_oaep_files/js_hmac-sha1.js"></script>');

document.write('<script type="text/javascript" src="'+transkey_url+'/rsa_oaep_files/rsa_oaep-min.js"></script>');

//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/base64.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/ec.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/jsbn.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/jsbn2.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/prng4.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/rng.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/rsa.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/rsa2.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/sec.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/sha1.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/asn1hex-1.1.js"></script>');
//
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/sha256.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/sha512.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/md5.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/ripemd160.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/rsapem.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/rsasign.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/sha1_oaep.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/x509.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/core-min.js"></script>');

document.write('<script type="text/javascript" src="'+transkey_url+'/jsbn/jsbn-min.js"></script>');
document.write('<script type="text/javascript" src="'+transkey_url+'/TranskeyLibPack_op.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/BigInt.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/Barrett.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/genkey.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/RSA.js"></script>');
//document.write('<script type="text/javascript" src="'+transkey_url+'/seed.js"></script>');

document.write('<script type="text/javascript" src="'+transkey_surl+'?op=getToken&'+new Date().getTime()+'"></script>');

var transkey=[];

var tk=null;

var tk_btn_arr=[];

function initTranskey(){
	setMaxDigits(131);	
	if(tk==null){
		transkey.objs= new Array();
		tk = new Transkey();
		tk.generateSessionKey(transkey_surl);
		
		if(useCheckTranskey){
			if (document.addEventListener) {
			    document.addEventListener("mousedown", checkTransKey, false);
			} else if (document.attachEvent) {
			    document.attachEvent("onmousedown", checkTransKey);
			}
		}
		

	}

	var inputs = document.getElementsByTagName("input");
	for(var i = 0; i < inputs.length; i++){
		var input = inputs.item(i);
		if(input.getAttribute("data-tk-kbdType")!=null&&transkey[input.id]==null)
			tk.setKeyboard(inputs.item(i), transkey_isMultiCursor, tk_useButton, tk_useTranskey);
	}

}



if (typeof XMLHttpRequest == "undefined") {
	XMLHttpRequest = function() {
    	try { 
    		return new ActiveXObject("Msxml2.XMLHTTP.6.0"); 
		} catch(e) {
		};
		
    	try { 
    		return new ActiveXObject("Msxml2.XMLHTTP.3.0"); 
		} catch(e) {
		};
		
    	try { 
    		return new ActiveXObject("Msxml2.XMLHTTP"); 
		} catch(e) {
		};
		
    	try { 
    		return new ActiveXObject("Microsoft.XMLHTTP"); 
		}  catch(e) {
		};
 
    	throw new Error("This browser does not support XMLHttpRequest or XMLHTTP.");
	};
};


function TranskeyObj(inputObj, div, keyType, keyboardType, isMultiC, useT){
	this.isMultiCursor = isMultiC;
	this.isMultiMode=false;
	this.allocate=false;
	this.id=inputObj.id;
	this.keyboardType=keyboardType;
	this.width=0;
	this.div=div;
	this.lowerDiv=div.children[this.id+"_layoutLower"];
	this.upperDiv=div.children[this.id+"_layoutUpper"];
	this.singleDiv=div.children[this.id+"_layoutSingle"];
	this.fakeMouseDiv=div.children[this.id+"_fakeMouseDiv"];
	this.osMouseDiv=div.children[this.id+"_osMouseDiv"];
	this.blankDiv=div.children[this.id+"_blankDiv"];
	this.blankOverDiv=div.children[this.id+"_blankOverDiv"];
	this.multiMouseTypeDiv=div.children[this.id+"_multiMouseTypeDiv"];
	this.singleMouseTypeDiv=div.children[this.id+"_singleMouseTypeDiv"];
	this.dragDiv=div.children[this.id+"_dragDiv"];
	this.keyTypeIndex=""; // "l ","u ",""
	this.keyType=keyType;
	this.cap=false;
	this.useTranskey=useT;
	this.useButton=false;
	this.button=null;
	this.inputObj=inputObj;
	this.hidden=document.getElementById("transkey_"+inputObj.id);
	this.hmac=document.getElementById("transkey_HM_"+inputObj.id);
	this.ExE2E=document.getElementById("transkey_ExE2E_"+inputObj.id);
	this.checkValue=document.getElementById("Tk_"+inputObj.id+"_checkbox");
	this.fieldType=inputObj.type;
	this.isCrt=false;
	this.keyboard = inputObj.getAttribute("data-tk-keyboard");
	if(this.keyboard==null)
		this.keyboard = this.keyboardType;
	
	var self = this;
	this.alloctionCallback = function(){
		if (this.readyState == 4 && this.status == 200) {
			self.allocate=true;
			self.setUrl();
		}
	};
	
	this.allocation = function(){
		var request = new XMLHttpRequest();
		request.open("POST", transkey_surl, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.onreadystatechange = this.alloctionCallback;
		
		try {
			request.send(getUrlPost("allocation", this, ""));
		} catch(e) {
			alert("TransKey error: Cannot load TransKey. Network is not available.");
			return false;
		}

	};
	

	
	this.setUrl = function(){
		if(this.keyboardType=="number"){
			var url = getUrl("getKey", this, "single");			
			this.singleDiv.style.backgroundImage="url('"+url+"')";
			//this.singleDiv.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+url+"', sizingMethod='scale')";
		}else{
			var url = getUrl("getKey", this, "lower");			
			this.lowerDiv.style.backgroundImage="url('"+url+"')";		 
			url = getUrl("getKey", this, "upper");			
			this.upperDiv.style.backgroundImage="url('"+url+"')";
		}
	};
	
	this.setCursorStyle = function(style){
		if(style=="none"){
			if(tk.isMSIE)
				style="url('" + transkey_url + "/images/invisible.cur'),auto";
			else if(tk.isSafari)
				style="url('" + transkey_url + "/images/invisible.gif'),auto";
		}
		this.div.style.cursor=style;
		this[this.keyType+"Div"].style.cursor=style;
		this.fakeMouseDiv.style.cursor=style;
		this.osMouseDiv.style.cursor=style;
		this.blankDiv.style.cursor=style;
		this.blankOverDiv.style.cursor=style;
	};
	
	this.setExE2E = function(ExE2E){
		this.ExE2E.value=ExE2E;
	};
	
	function getUrl(op, o, keyType){
		return transkey_surl+"?op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
		+o.fieldType+"&inputName="+o.inputObj.name+"&transkeyUuid="+tk.transkeyUuid+"&TK_requestToken="+TK_requestToken+"&isCrt="+o.isCrt+"&"+new GenKey().tk_getrnd_int();
	}
	
	function getUrlPost(op, o, keyType){
		return "op="+op+"&name="+o.id+"&keyType="+keyType+"&keyboardType="+o.keyboard+"&fieldType="
		+o.fieldType+"&inputName="+o.inputObj.name+"&transkeyUuid="+tk.transkeyUuid+"&TK_requestToken="+TK_requestToken+"&isCrt="+o.isCrt+"&"+new GenKey().tk_getrnd_int();
	}

	this.setKeyType(keyType);


}

TranskeyObj.prototype.setButton = function(useB){

	
	this.useButton=useB;

	if(useB){
		if(document.getElementById(this.id+"_tk_btn")==null)
			return false;
		var html='<label for="Tk_'+this.id+'_checkbox" class="transkey_label">'+
		'<input type="checkbox" id="Tk_'+this.id+'_checkbox" name="Tk_'+this.id+'_checkbox" class="transkey_checkbox"/>';
		html+=document.getElementById(this.id+"_tk_btn").innerHTML;
		html+='</label>';
		document.getElementById(this.id+"_tk_btn").innerHTML=html;
		this.button = document.getElementById("Tk_"+this.id+"_checkbox");
		tk_btn_arr[this.button.id]=this.id;
		if(tk_useTranskey){
			this.button.checked=true;
		}else{
			this.button.checked=false;
		}
		 var obj = this.inputObj.form;
		 if(obj==null)
			 obj = inputObj.parentNode;
		 if(obj==null)
			 obj = document.body;
		var checkValue = document.createElement("input");
		checkValue.setAttribute("type", "hidden");
		checkValue.setAttribute("id", "Tk_"+this.id+"_checkbox");
		checkValue.setAttribute("name", "Tk_"+this.id+"_checkbox");
		checkValue.setAttribute("value", this.useTranskey?"transkey":"e2e");
		obj.appendChild(checkValue);
		this.checkValue = checkValue;
		
		if(this.button.addEventListener ){
			this.button.addEventListener("click", tk.buttonListener, false);
		}else{
			this.button.attachEvent("onclick", tk.buttonListener);
		}
	}
};

TranskeyObj.prototype.setButton2 = function(useB){
	this.useButton=useB;
	

	if(useB){
		var inputObj = document.getElementById(this.id);
		var kbdType = inputObj.getAttribute("data-tk-kbdType");
		//if(kbdType!="qwerty_crt" && kbdType!="number_crt")
			//return false;
		/*150114
		var divObj = inputObj.parentNode;
		var btn = document.createElement("span");
		btn.id = inputObj.id+"_button";
		var onClick = "tk.buttonListener2(this)";
		btn.innerHTML = "<img alt='' style='vertical-align:middle; cursor:pointer;' id='"
			+inputObj.id+"_toggle' name='"
			+inputObj.id+"_toggle' onclick='"
			+onClick+"' src='"
			+transkey_url+"/images/off.png' border='0'>";
		divObj.insertBefore(btn, inputObj.nextSibling);
		this.button = document.getElementById(inputObj.id+"_toggle");
		//tk_btn_arr_crt[this.button.id]=this.id;
		*/
		
		//tk_btn_arr[this.button.id]=this.id;
		tk_btn_arr[this.id+"_tk_btn"]=this.id;	//150114

	}
};

TranskeyObj.prototype.setKeyType = function(keyT){
	this.keyType = keyT;
	if(keyT=="single"){
		this.keyTypeIndex = "";
	}else{
		this.keyTypeIndex = keyT.charAt(0)+" ";
		
		if(keyT=="upper")
			this.cap=true;

	}


};


TranskeyObj.prototype.setQwertyKey = function(key){
	this.lowerDiv.style.display="none";			
	this.upperDiv.style.display="none";
	this[key+"Div"].style.display="block";
};

TranskeyObj.prototype.setDrag = function(boolean){
	if(boolean){
		this.dragDiv.style.display="inline";
	}else{
		this.dragDiv.style.display="none";
	}
};

TranskeyObj.prototype.clear = function(){
	
	this.inputObj.value = "";		
	 
	this.hidden.value = "";
	
	this.hmac.value = "";
};

TranskeyObj.prototype.getCipherData = function(xecureRandomData, crtType){
	var v = tk.inputFillEncData(this.inputObj);
	var aCipher = null;
	var aCipherArray = null;
	var aInputValue = null;
	var aInputHMValue = null;
	var encXecureRanData = null;
	var aRequest = null;

	aInputValue = v.hidden;
	
	if (aInputValue == null || aInputValue == "") {
		aCipher = "";
		return aCipher;
	}
	
	aInputHMValue = v.hmac;	
	
	var PKey = tk.getPKey();

	encXecureRanData = tk.phpbb_encrypt2048(xecureRandomData, PKey.k, PKey.e, PKey.n);
	
	var rsaPubKey="";
	
//	if(crtType=="yettie"){	//170321_crt_basicOption
	if(crtType=="initech"){
		rsaPubKey = tk.getCertPublicKey();
	}
	
	var sPort = location.port;
	if(sPort.length<=0)
		sPort = '80';

	aRequest = new XMLHttpRequest();
	aRequest.open("POST", transkey_surl, false);
	aRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	aRequest.setRequestHeader("Cache-Control", "no-cache");
	aRequest.send("op=getPlainText&name=" + this.id + "&value=" + aInputValue + "&hmac=" 
			+ aInputHMValue + "&crtType=" + crtType + "&encXecureRanData=" + encXecureRanData	//170321_crt_basicOption 
			//+ aInputHMValue + "&crtType=" + "yettie" + "&encXecureRanData=" + encXecureRanData 
			+ "&transkeyUuid=" + tk.transkeyUuid + "&sPort=" + sPort+"&pubKey="+rsaPubKey+"&TK_requestToken="+TK_requestToken);

	if (aRequest.readyState != 4 || aRequest.status != 200) {
		aCipher = "";
		return aCipher;
	}
	
	aCipher = aRequest.responseText.replace(/\n/gi, '');
	//if(crtType=="yettie"){	//170321_crt_basicOption
	if(crtType=="initech"){
		return aRequest.responseText;
	}
	aCipherArray = aCipher.split(',');

	aCipher = "";
	for ( var i = 0; i < aCipherArray.length - 1; i++) {
		if (aCipherArray[i].length == 1) {
			aCipher += '0';
		}

		aCipher += aCipherArray[i];
	}

	return aCipher;
};

TranskeyObj.prototype.done = function(){
	
};


function Transkey(){
	this.offsetX=0;
	this.offsetY=0;
	this.startX=0;
	this.startY=0;
	this.dragStart=false;
	var sessionKey = [, , , , , , , , , , , , , , , ];
	var genKey = new GenKey();
	var useCert = "true";	
	//var cert_pub = "-----BEGIN CERTIFICATE-----MIIDdTCCAl2gAwIBAgIJAOYjCX4wgWKVMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTE0MTIxNTAwMjY1MloXDTQ0MTIwNzAwMjY1MlowcTELMAkGA1UEBhMCS1IxMDAuBgNVBAoUJ01FUklUWiBGaXJlICYgTWFyaW5lIEluc3VyYW5jZSBDby4sIEx0ZDEwMC4GA1UEAxQnTUVSSVRaIEZpcmUgJiBNYXJpbmUgSW5zdXJhbmNlIENvLiwgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzHx7ixCFe7T8rA2L7CjFkNCqjskn01fRB95HAhYH15Y+9AXw9zR1P0+ghZdamEtlmNZyiiwdzmmvfa7yOAO8LdqxOlpOXeCbiWR4qTDJYhX2hlNIneYHFtJVnwNhRUxW2uVu6rsolNpfExJZPQfSSVtn9v1H8HMRDamHzHoGushbrgqDI5e3CL/peDsJi1JtgX2zB3390zWCr3SFtC/DWSxrBL82pAJoFWzJn2YqGx4vu21nF4XOEJlbvCM+gqd27MnGzIP+Q0cVLufziCYzBRqKD4TROACXaq9Mx91CLBBp6O/x7niN72GOVbrFpvSxKprjNpU598HLZQT1uLsVUwIDAQABoxowGDAJBgNVHRMEAjAAMAsGA1UdDwQEAwIF4DANBgkqhkiG9w0BAQsFAAOCAQEAf38jeel+xJ12D/g5cNitZiwVCTC2y+YdzQSqr1GyZi7fiqlk6U6F6phuiA2myaPUSE4kyWCo1B+DdMnsRWiLfuCXopMgfsVl7+CU+WPERUUEJU/yC1lTdD89WK+dpTaI9iX325WHOriEzX+3DF9Gj0U+FoiwhIJLJ6MYYToFGwIlaVmMh9N7+tQpXYjonO1zIBCxun6MMd63tAQFa3vteS2YkNF8eN8wi+hT0dT5WS6TpK1rcsBiGRDEi4EcMrquKpJtNCsbrukPhZ2tbtEmuXVwqYiL7h7ar2Liet6G51G78O0TiDicAChpVrFWCmgaYIbOfMVbQHPPbzUx5Qt5iw==-----END CERTIFICATE-----";
	var cert_pub = "-----BEGIN CERTIFICATE-----MIIDWzCCAkOgAwIBAgIJAO4t+//wr+RCMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTE3MDIxMzA2MjQ0N1oXDTQ3MDIwNjA2MjQ0N1owVzELMAkGA1UEBhMCS1IxIzAhBgNVBAoMGkRPTkdCVSBJTlNVUkFOQ0UgQ08uLCBMVEQuMSMwIQYDVQQDDBpET05HQlUgSU5TVVJBTkNFIENPLiwgTFRELjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMi77Kfwk1edZLpzALDgwM33C29kKwPPULo7hqDkLtt3Ad7d/Jgmj+UgpAhH+D6gyBk9K1nXZMElsQKQopJzstPIXuSKKfcyVsMZCjRWJhsfvtFN7lCpxUoHshFujoHE2xFXIFAO2vm/FyWoCh+NOJOvxs7NR+bUiy99pYpZ+rEAOIbbI4sxxmvYtbwTo5Uk0++9iS044NqEKCN6kEPOGRyxvF3vWaMPhAl/8FGvkwNUgewvPhUuGRb4JUviXnK5IP4y8QNKTNnlS90OIYdpEv405y5N7e17biNAcC1IXoQT/RAjfud7rjw/Wq9yp2XhVFPvZ73KpbXXgPWmbf44uw0CAwEAAaMaMBgwCQYDVR0TBAIwADALBgNVHQ8EBAMCBeAwDQYJKoZIhvcNAQELBQADggEBAAnPbKJARyaTWfRCHyedBV9a3R/z8TCcesSD0OFY3WFt82tG5sp0LwamVsHdy1SBD+nIA94ZLo+nnatMZ4b5DPqk/8C0HWwZmwvQ0paTu+WNNVxXrfVTPAGMH7jApcwqLaKdUddSx+Nz9ErpBgVL78SNO/a8i6qJ1+a4OHhWcrXKcDsL/cXlsrSGQHBBuev4X1T46mDLN3BU176x1z6LfGjb47IH6GfIEsXKDZNlZYLMB40Qy6vzXcjWClOuCsFIesA3muaL5KheyVmiYei03TTsLyLl8e44gTZw6Qgm1t7Tg7mXAfd0uSaVrYvysfxUt+6wzbdErn/V5i0aZjBt9oc=-----END CERTIFICATE-----";
	var cert_ca = "-----BEGIN CERTIFICATE-----MIIEHjCCAwagAwIBAgIJALcMNEp1tPYgMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTEzMDIwNzA5MDYyNVoXDTQzMDEzMTA5MDYyNVowZzELMAkGA1UEBhMCS1IxHTAbBgNVBAoTFFJhb25TZWN1cmUgQ28uLCBMdGQuMRowGAYDVQQLExFRdWFsaXR5IEFzc3VyYW5jZTEdMBsGA1UEAxMUUmFvblNlY3VyZSBDby4sIEx0ZC4wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCqB0MsUuAi7pWVmRWaCS7kAactycMghmOM7RiMbmXyHmatXJbrtOlNrGH8Xl4fdkCJjyUE2829zQy+lTJ2O3Uo3Nn7zK3+3Um9nDQXN2tapambthOXs0aHjnRCtuLMOSPlAx06o0yHP1nOGaV7hfY9PyJjIVh9Lk/oFp5A+wsi0wiQ+INMDrm/6xZrooEY7/TLMnE4v+nr+cpIf3hSrvI1gGTykFtGCy2Le1huqaTKkE9K0CF/Sd8Kvebj6R+MhlieDXiMZXZD++pRmd4cAmGAmnGn4YdJMyh16TCccPjT60KkMv84uNVjXBvnar8ZlzRQSgIhwp1KkRiMErMbVWCnAgMBAAGjgcwwgckwHQYDVR0OBBYEFPzIDKwqK4PCklaP6Mq4YXdq8McyMIGZBgNVHSMEgZEwgY6AFPzIDKwqK4PCklaP6Mq4YXdq8McyoWukaTBnMQswCQYDVQQGEwJLUjEdMBsGA1UEChMUUmFvblNlY3VyZSBDby4sIEx0ZC4xGjAYBgNVBAsTEVF1YWxpdHkgQXNzdXJhbmNlMR0wGwYDVQQDExRSYW9uU2VjdXJlIENvLiwgTHRkLoIJALcMNEp1tPYgMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBAHBRlEB4nu/gHwVFRzqbFOloR7aB0xIaMDykMWtovXHUQcTmmGyYQn0bMWaGVCD7SgRh1FisfciJzLP7f8OI5f7rA2tiBZD1PBtLMU7MytGIYlV/gcfWPbnqBVsKDm15AEUqH7ZahOm7np4d5Fr87r1bj2baXQPKSNd9yjh89fl6LthWLEQRYKKwhPYAA/QkeB2RE9MftmuOXJ6MnYyyx5xEZK2ofqwrRBvDmV/PjwdCSxhloiJVFHrp8lKPCsZywJ3v9IPpudjgBQ7SWqhDcPNo2diGB2dQ252g36K1H7u3aT9Xha33MFQXTTEDzVDhaXzaGk7X6T9v25dsOyOaLAo=-----END CERTIFICATE-----";
	rng = new SecureRandom();
	var mKey = new Array();
	for(var i=0; keyboardLayouts.length>i; i++){
		mKey[keyboardLayouts[i]] = null;
	}
	this.now = null;
	this.isPause = false;
	this.transkeyUuid;
	this.isMobile=false;
	this.isMSIE=false;
	this.isOpera=false;
	this.isSafari=false;
	this.isMSIE6=false;
	this.crtPublicKey="";
	var genSessionKey = "";
	var userAgent = navigator.userAgent;
	if(userAgent.indexOf('Macintosh') > 0||userAgent.indexOf('Linux') > 0||userAgent.indexOf('Windows') > 0)
		this.isMobile = false;
	else
		this.isMobile = true;
	if (userAgent.indexOf("iPad") > 0 ||userAgent.indexOf("iPhone") > 0 || userAgent.indexOf("Android") > 0)
		this.isMobile = true;
	if (navigator.appName == 'Opera')
		this.isOpera = true;
	if (userAgent.indexOf("MSIE") > 0)
		this.isMSIE = true;
	if (userAgent.indexOf("Safari") > 0)
		this.isSafari=true;
	if(userAgent.indexOf("Chrome") > 0 )
		this.isSafari=false;
	if(userAgent.indexOf("MSIE 6")>0)
		this.isMSIE6=true;
	
	this.getPKey = function(){
		var pKey = _x509_getPublicKeyHexArrayFromCertPEM(cert_pub);
		var PKey = new Array();

		PKey["n"] = pKey[0];
		PKey["k"] = 256; // length of n in bytes
		PKey["e"] = pKey[1];
		
		return PKey;
	};
	
	this.getCertPublicKey = function(){	
		return encodeURIComponent(this.crtPublicKey);
	};

	this.generateSessionKey = function(url) {
		
		if(genSessionKey.length>0)
			return;
		
		if( verifyCA() == false ){
			alert("CA 검증이 실패 하였습니다. 프로그램이 정상작동 하지 않을 수 있습니다.");
			return false;
		}
		
		var PKey = this.getPKey();
		
		this.transkeyUuid = genKey.tk_sh1prng();
		
		
		genSessionKey = genKey.GenerateKey(128);

		
		for(var i=0; i<16; i++)	{
			sessionKey[i] = Number("0x0" + genSessionKey.charAt(i));
		}

		var encSessionKey = this.phpbb_encrypt2048(genSessionKey, PKey.k, PKey.e, PKey.n);
			
		var operation = "setSessionKey";
		var request = new XMLHttpRequest();
		request.open("POST", url, false);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		
		request.onreadystatechange = function(){
			if (request.readyState == 4 && request.status == 200) {
				if (request.responseXML) {
					var result = request.responseXML.firstChild;
					var res = null;
					var returns = "return [";
					for(var i=0; keyboardLayouts.length>i; i++){
						if(i==keyboardLayouts.length-1){
							returns += keyboardLayouts[i]+",";
						}else{
							returns += keyboardLayouts[i]+",";
						}	
					}
					returns += "]";
					for ( var i = 0; i < result.childNodes.length; i++) {
						var node = result.childNodes[i];
						if (node.tagName == "script") {
							for ( var j = 0; j < node.childNodes.length; j++) {
								if(node.childNodes[j].nodeValue.length>10)
									res = ( new Function( Key+node.childNodes[j].nodeValue.replace("//", "") +returns ) )();
							}
						}
					}
					for(var i=0; keyboardLayouts.length>i; i++){
						mKey[keyboardLayouts[i]] = res[i];
					}
				}
			}
		};
		
		try {
			request.send("op=" + operation + "&key=" + encSessionKey + "&transkeyUuid=" + this.transkeyUuid+ "&useCert=" + useCert+ "&mode=common"+"&TK_requestToken="+TK_requestToken);
		} catch(e) {
			alert("TransKey error: Cannot load TransKey. Network is not available.");
			return false;
		}
		

	};
	
	this.inputFillEncData = function(input){
		var tkObj = transkey[input.id];
		var hidden = tkObj.hidden.value;
		var hmac = "";

		var maxSize = input.value.length+genKey.tk_getrnd_int()%10;			
		
		var geo = "d 0 0";
		
		for(var j=input.value.length; j<maxSize; j++)
		{	
			var encrypted = SeedEnc(geo);
			hidden += transkey_delimiter + encrypted;
		}
		
		hmac = CryptoJS.HmacSHA256(hidden, genSessionKey);
		
		var value = new Array();
		value["hidden"]=hidden;
		value["hmac"]=hmac;
		
		return value;
		
	};
	
	this.fillEncData = function()
	{
		for(var i=0;transkey.objs.length>i;i++){
			var tko = transkey[transkey.objs[i]];
			var hidden = tko.hidden;
			var HM = tko.hmac;
			var input = tko.inputObj;
			if(HM.value.length==0){
				var maxSize = input.value.length+genKey.tk_getrnd_int()%10;			
				
				var geo = "d 0 0";
				

				for(var j=input.value.length; j<maxSize; j++)
				{	
					var encrypted = SeedEnc(geo);
					hidden.value += transkey_delimiter + encrypted;
				}		

				HM.value = CryptoJS.HmacSHA256(hidden.value, genSessionKey);
			}
			
		}
		

	};
	
	this.getEncData = function(x, y){	
		var geo = this.now.keyTypeIndex + x + " " + y;
		return SeedEnc(geo);
	};

	/*170518_crt_issue
	 this.setPosition = function(){
		 var div = this.now.div;	 
		 var inputObj = this.now.inputObj;
		 var xy = inputObj.getAttribute("data-tk-kbdxy");
		 if(xy == undefined){
			 var point = getOffsetPoint(inputObj);
			 div.style.top = point.y+inputObj.offsetHeight+"px";
			 div.style.left = point.x+"px";
		 }else{
			 var point = new Array();
			 point = xy.split(" ");
			 div.style.top = point[1]+"px";
			 div.style.left = point[0]+"px";
		 }
	 };
	 */
	 
	 this.setPosition = function(){
		 var div = this.now.div;	 
		 var inputObj = this.now.inputObj;
		 var xy = inputObj.getAttribute("data-tk-kbdxy");
		 var xy2 = inputObj.getAttribute("data-tk-kbdxy2");
		 if(typeof xy == "string"){
			 var point = new Array(); 
			 point = xy.split(" ");
			 div.style.top = point[1]+"px";
			 div.style.left = point[0]+"px";
		 }else if(typeof xy2 =="string"){
		 	 var point = getOffsetPoint(inputObj, this.now.table);
		 	 var tmp = xy2.split(" ");
		 	 point.y = parseInt(point.y)+parseInt(tmp[1]);
		 	 point.x = parseInt(point.x)+parseInt(tmp[0]);
			 div.style.top = point.y + inputObj.offsetHeight+"px";
			 div.style.left = point.x+"px";
		 	}else{
		 		var point = getOffsetPoint(inputObj, this.now.table);
			 div.style.top = point.y+inputObj.offsetHeight+"px";
			 div.style.left = point.x+"px";
		 }
	 };
	
	 this.setHiddenField = function(inputObj, ExE2E){
		 var obj = inputObj.form;
		 if(obj==null)
			 obj = inputObj.parentNode;
		 if(obj==null)
			 obj = document.body;
		 try{
			if(obj.children.transkeyUuid==null){
				var uuid = document.createElement("input");
				uuid.setAttribute("type", "hidden");
				uuid.setAttribute("id", "transkeyUuid");
				uuid.setAttribute("name", "transkeyUuid");
				uuid.value=this.transkeyUuid;
				obj.appendChild(uuid);
			}
			var hidden = document.createElement("input");
			hidden.setAttribute("type", "hidden");
			hidden.setAttribute("id", "transkey_"+inputObj.id);
			hidden.setAttribute("name", "transkey_"+inputObj.id);
			hidden.setAttribute("value", "");
			var hmac = document.createElement("input");
			hmac.setAttribute("type", "hidden");
			hmac.setAttribute("id", "transkey_HM_"+inputObj.id);
			hmac.setAttribute("name", "transkey_HM_"+inputObj.id);
			hmac.setAttribute("value", "");

			obj.appendChild(hidden);
			obj.appendChild(hmac);
			if(ExE2E!=null){
				var e2e = document.createElement("input");
				e2e.setAttribute("type", "hidden");
				e2e.setAttribute("id", "transkey_ExE2E_"+inputObj.id);
				e2e.setAttribute("name", "transkey_ExE2E_"+inputObj.id);
				e2e.setAttribute("value", ExE2E);
				obj.appendChild(e2e);
			}

		 }catch(e){
			 alert("[transkey error] setHiddenField : "+ e);
		 }
	};
	
	this.getText = function(encrypted){
		var request = new XMLHttpRequest();
		request.open("POST", transkey_surl, false);
		request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
		request.setRequestHeader("Cache-Control", "no-cache");
		request.send("op=letter&transkeyUuid="+this.transkeyUuid+"&name="+this.now.id+"&value=" +encrypted+"&TK_requestToken="+TK_requestToken);
		if (request.readyState == 4 && request.status == 200) {
			tk.now.inputObj.value = tk.now.inputObj.value + request.responseText;
			}
	};
	
	
    function getRandomValue(range) {

       var ramdomNum = new GenKey().tk_getrnd_int() % range;

        return ramdomNum;



    }
	
	this.setQwertyLayout = function(id, div, isMultiCursor, _cssName){
		div.innerHTML = qwertyLayout(id, isMultiCursor, _cssName);
	};
	
	this.setNumberLayout = function(id, div, isMultiCursor, _cssName){
		div.innerHTML = numberLayout(id, isMultiCursor, _cssName);
	};
	
	this.getKey = function(x, y, type) {
		var keys = mKey[type];
		for ( var i = 0; i < keys.length; i++) {
			if (keys[i].contains(x, y)) {
				return keys[i];
			}
		}
		return null;
	};
	
	this.getKeyByIndex = function(index, type){
		return keys = mKey[type][index];		
	};
	
	function createTranskeyMap(id, keyboardType){
		
		var keyboard = document.getElementById(id).getAttribute("data-tk-keyboard");
		if(keyboard==null){
			keyboard = keyboardType;
		}
		
		var keyArray = mKey[keyboard];
		var map = document.createElement('map');
		map.setAttribute("name", "tk_map_"+id);
		map.setAttribute("id", "tk_map_"+id);
		
		var map = '<map class="transkey_map" name="tk_map_'+id+'" id="tk_map_'+id+'">';
		for(var i=0; keyArray.length>i; i++){
			var key = keyArray[i];
			var coords = "";
			for(var k=0; key.npoints>k; k++){
				coords += key.xpoints[k]+","+key.ypoints[k]+",";
			}
			coords = coords.substring(0, coords.length - 1);
			map += '<area class="transkey_area" shape="poly" alt="" coords="'+coords+'" onmousedown="tk.start(event, '+i+');">';
		}
		
		map += '</map>';
		
		return map;
	}
	
	function offsetPoint() {
		this.x = 0;
		this.y = 0;
	}

	function getOffsetPoint(Element) {

        var point = new offsetPoint();

        point.x = 0;
        point.y = 0;

        while (Element) {
            point.x += Element.offsetLeft;
            point.y += Element.offsetTop;

            Element = Element.offsetParent;

            if(Element==null)
            	break;
        }

        return point;
	}

	
	function SeedEnc(geo) {	
		var iv = [0x4d, 0x6f, 0x62, 0x69, 0x6c, 0x65, 0x54, 0x72, 0x61, 0x6e, 0x73, 0x4b, 0x65, 0x79, 0x31, 0x30];	// "MobileTransKey10"	  
		var inData = new Array(16);
		var outData = new Array(16);
		var roundKey = new Array(32);
	  
		for(var i=0; i<geo.length; i++)
		{			
			if(geo.charAt(i) == "l" || geo.charAt(i) == "u" || geo.charAt(i) == "d")
			{
				inData[i] = Number(geo.charCodeAt(i));
				continue;
			}
			else if(geo.charAt(i) == " ")
			{ 
				inData[i] = Number(geo.charCodeAt(i));
				continue;
			}
			inData[i] = Number(geo.charAt(i).toString(16));
		}
		inData[geo.length] = 32;		//" "
		inData[geo.length + 1] = 101;	//e
		
		var rndInt = genKey.tk_getrnd_int();
		inData[geo.length + 2] = rndInt % 100;
		 
		Seed.SeedSetKey(roundKey, sessionKey);
		Seed.SeedEncryptCbc(roundKey, iv, inData, 16, outData);
		
		var encodedData = new Array(16);
		var encodedDataString = "";
		for(var i=0; i<16; i++)
		{
			if(transkey_encDelimiter == null)
				encodedData[i] = Number(outData[i]).toString(16);
			else
				encodedDataString += Number(outData[i]).toString(16)+transkey_encDelimiter;
		}
			
		
		if(transkey_encDelimiter == null)
			return encodedData;
		else
			return encodedDataString.substring(0, encodedDataString.length-1);
	}
	
	function Key() {
		this.name = "";
		this.npoints = 0;
		this.xpoints = new Array();
		this.ypoints = new Array();
		this.addPoint = function(x, y) {
			this.npoints++;
			this.xpoints.push(x);
			this.ypoints.push(y);
		};

		this.contains = function(x, y) {
			var hits = 0;
			var lastx = this.xpoints[this.npoints - 1];
			var lasty = this.ypoints[this.npoints - 1];
			var curx = 0;
			var cury = 0;
			for ( var i = 0; i < this.npoints; lastx = curx, lasty = cury, i++) {
				curx = this.xpoints[i];
				cury = this.ypoints[i];
				if (cury == lasty) {
					continue;
				}
				var leftx = 0;
				if (curx < lastx) {
					if (x >= lastx) {
						continue;
					}
					leftx = curx;
				} else {
					if (x >= curx) {
						continue;
					}
					leftx = lastx;
				}

				var test1 = 0;
				var test2 = 0;
				if (cury < lasty) {
					if (y < cury || y >= lasty) {
						continue;
					}
					if (x < leftx) {
						hits++;
						continue;
					}
					test1 = x - curx;
					test2 = y - cury;
				} else {
					if (y < lasty || y >= cury) {
						continue;
					}
					if (x < leftx) {
						hits++;
						continue;
					}
					test1 = x - lastx;
					test2 = y - lasty;
				}
				if (test1 < (test2 / (lasty - cury) * (lastx - curx))) {
					hits++;
				}
			}
			return ((hits & 1) != 0);
		};
	}

	function qwertyLayout(id, isMultiCursor, _cssName){
		var useMap='';
		var events='onmousedown="tk.start(event);" onmousemove="tk.showCursor(event,false);" onmouseout="tk.hideCursor(event);" onmouseover="tk.visibleCursor();"';
		if(tk.isMobile){
			useMap='usemap="#tk_map_'+id+'"';
			events='';
		}
		var backPNG = '<img alt="" src="'+transkey_url+'/images/back.png" oncontextmenu="return false;" style="width:100%;height:100%;"/>';
		if(tk.isMSIE6)
			backPNG = '';
		var layout = '<div id="'+id+'_dragDiv" class="transkey_'+_cssName+'qwertyDragDiv" onmousedown="tk.dragstart(event, this);" onmouseup="tk.dragend(event);">'+backPNG+'</div>'+
		'<div id="'+id+'_layoutLower" class="transkey_'+_cssName+'lower" '+events+'>';
		if(!tk.isMSIE6)
			layout +='<img alt="" src="'+transkey_url+'/images/back.png" id="'+id+'_imgTwinLower" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" style="width:100%;height:100%;" '+useMap+'/>';
		if(tk.isMobile)
			layout += createTranskeyMap(id, "qwerty");
		layout += '<iframe id="'+id+'_block" frameborder="10" style="z-index:-1; position:absolute; visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%; "></iframe>'+
		'</div>'+
		'<div id="'+id+'_layoutUpper" class="transkey_'+_cssName+'upper" '+events+'>';
		if(!tk.isMSIE6)
			layout += '<img alt="" src="'+transkey_url+'/images/back.png" id="'+id+'_imgTwinUpper" style="width:100%;height:100%;" '+useMap+'/>';
		if(tk.isMobile)
			layout += createTranskeyMap(id, "qwerty");
		layout += '<iframe id="'+id+'_block" frameborder="10" style="z-index:-1; position:absolute; visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%; "></iframe>'+
		'</div>';
		if(isMultiCursor){
			layout = layout +'<div id="'+id+'_fakeMouseDiv" style="position: absolute; left: 0px; top: 0px; visibility: hidden;display: none;z-index:1010;">'+
			'<img alt="" src="'+transkey_url+'/images/fake.gif" id="fakeMouseImg">'+
			'</div>'+
			'<div id="'+id+'_osMouseDiv" style="position: absolute; left: 0px; top: 0px; visibility: hidden;display: none;z-index:1010; " onmousedown="tk.start(event,-1,true);">'+
			'<img alt="" src="'+transkey_url+'/images/fake.gif" id="osMouseImg" onmousemove="tk.showCursor(event,true);">'+
			'</div>'+
			'<div id="'+id+'_blankDiv" class="transkey_'+_cssName+'qwertyBlank">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'blank.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="blankImg">'+
			'</div>'+
			'<div id="'+id+'_blankOverDiv" class="transkey_'+_cssName+'qwertyBlankOver" '+tk_blankEvent+'="tk.pauseKeyboard(false);">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'blank_over.gif" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="blankOverImg">'+
			'</div>'+
			'<div id="'+id+'_multiMouseTypeDiv" class="transkey_'+_cssName+'qwertyMultiMouseType" onmousedown="tk.setMultiCursor(true);">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'multi.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="multiMouseTypeImg">'+
			'</div>'+
			'<div id="'+id+'_singleMouseTypeDiv" class="transkey_'+_cssName+'qwertySingleMouseType" onmousedown="tk.setMultiCursor(false);">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'single.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="slngleMouseTypeImg">'+
			'</div>';
		}
		
		return layout;
	}
	function numberLayout(id, isMultiCursor, _cssName){
		var useMap='';
		var events='onmousedown="tk.start(event);" onmousemove="tk.showCursor(event,false);" onmouseout="tk.hideCursor(event);" onmouseover="tk.visibleCursor();"';
		if(tk.isMobile){
			useMap='usemap="#tk_map_'+id+'"';
			events = '';
		}	
		var backPNG = '<img alt="" src="'+transkey_url+'/images/back.png" oncontextmenu="return false;" style="width:100%;height:100%;"/>';
		if(tk.isMSIE6)
			backPNG = '';
		var layout = '<div id="'+id+'_dragDiv" class="transkey_'+_cssName+'numberDragDiv" onmousedown="tk.dragstart(event, this);" onmouseup="tk.dragend(event);">'+backPNG+'</div>'+
		'<div id="'+id+'_layoutSingle" class="transkey_'+_cssName+'single" '+events+'>';
		if(!tk.isMSIE6)
			layout += '<img alt="" src="'+transkey_url+'/images/back.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="imgSingle" style="width:100%;height:100%;" '+useMap+'/>';
		if(tk.isMobile)
			layout += createTranskeyMap(id, "number");
		layout += '<iframe id="'+id+'_block" frameborder="10" style="z-index:-1; position:absolute; visibility: hidden; left: 0px; top: 0px; width: 100%; height: 100%; "></iframe>'+
		'</div>';
		if(isMultiCursor){
			layout = layout +'<div id="'+id+'_fakeMouseDiv" class="transkey_fakeMouse">'+
			'<img alt="" src="'+transkey_url+'/images/fake.gif" id="fakeMouseImg">'+
			'</div>'+
			'<div id="'+id+'_osMouseDiv" class="transkey_osMouse" onmousedown="tk.start(event,-1,true);">'+
			'<img alt="" src="'+transkey_url+'/images/fake.gif" id="osMouseImg" onmousemove="tk.showCursor(event,true);">'+
			'</div>'+
			'<div id="'+id+'_blankDiv" class="transkey_'+_cssName+'numberBlank">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'blank.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="blankImg">'+
			'</div>'+
			'<div id="'+id+'_blankOverDiv" class="transkey_'+_cssName+'numberBlankOver" '+tk_blankEvent+'="tk.pauseKeyboard(false);">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'blank_over.gif" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="blankOverImg" >'+
			'</div>'+
			'<div id="'+id+'_multiMouseTypeDiv" class="transkey_'+_cssName+'numberMultiMouseType" onmousedown="tk.setMultiCursor(true);">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'multi_s.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="multiMouseTypeImg" >'+
			'</div>'+
			'<div id="'+id+'_singleMouseTypeDiv" class="transkey_'+_cssName+'numberSingleMouseType" onmousedown="tk.setMultiCursor(false);">'+
			'<img alt="" src="'+transkey_url+'/images/'+_cssName+'single_s.png" oncontextmenu="return false;" ondragstart="return false;" onselectstart="return false;" id="slngleMouseTypeImg" >'+
			'</div>';
		}
		return layout;
	}
	
	function pack(source)
	{
	   var temp = "";
	   for (var i = 0; i < source.length; i+=2)
	   {
	      temp+= String.fromCharCode(parseInt(source.substring(i, i + 2), 16));
	   }
	   return temp;
	}

	function char2hex(source)
	{
	   var hex = "";
	   for (var i = 0; i < source.length; i+=1)
	   {
	      temp = source[i].toString(16);
	      switch (temp.length)
	      {
	         case 1:
	            temp = "0" + temp;
	            break;
	         case 0:
	           temp = "00";
	      }
	      hex+= temp;
	   }
	   return hex;
	}

	function xor(a, b)
	{
	   var length = Math.min(a.length, b.length);
	   var temp = "";
	   for (var i = 0; i < length; i++)
	   {
	      temp+= String.fromCharCode(a.charCodeAt(i) ^ b.charCodeAt(i));
	   }
	   length = Math.max(a.length, b.length) - length;
	   for (var i = 0; i < length; i++)
	   {
	      temp+= "\x00";
	   }
	   return temp;
	}

	function mgf1(mgfSeed, maskLen)
	{
	   var t = "";
	   var hLen = 20;
	   var count = Math.ceil(maskLen / hLen);
	   for (var i = 0; i < count; i++)
	   {
	      var c = String.fromCharCode((i >> 24) & 0xFF, (i >> 16) & 0xFF, (i >> 8) & 0xFF, i & 0xFF);
	      t+= pack(sha1Hash(mgfSeed + c));
	   }

	   return t.substring(0, maskLen);
	}

	function rsaes_oaep_encrypt(m, n, k, e)
	{
	   var hLen = 20;


	   var mLen = m.length;
	   if (mLen > k - 2 * hLen - 2)
	   {
	   	alert("too long");
	   }

	   var lHash = "\xda\x39\xa3\xee\x5e\x6b\x4b\x0d\x32\x55\xbf\xef\x95\x60\x18\x90\xaf\xd8\x07\x09"; // pack(sha1Hash(""))

	   var ps = "";
	   var temp = k - mLen - 2 * hLen - 2;
	   for (var i = 0; i < temp; i++)
	   {
	      ps+= "\x00";
	   }

	   var db = lHash + ps + "\x01" + m;
	   var seed = "";
	   for (var i = 0; i < hLen + 4; i+=4)
	   {
	      temp = new Array(4);
	      rng.nextBytes(temp);
	      seed+= String.fromCharCode(temp[0], temp[1], temp[2], temp[3]);
	   }
	   seed = seed.substring(4 - seed.length % 4);
	   var dbMask = mgf1(seed, k - hLen - 1);
	   var maskedDB = xor(db, dbMask);
	   var seedMask = mgf1(maskedDB, hLen);
	   var maskedSeed = xor(seed, seedMask);
	   var em = "\x00" + maskedSeed + maskedDB;

	   m = new Array();
	   for (i = 0; i < em.length; i++)
	   {
	      m[i] = em.charCodeAt(i);
	   }
	   m = new BigInteger(m, 256);
	   c = m.modPow(e, n);
	   c = c.toString(16);
	   if (c.length & 1)
	   {
	      c = "0" + c;
	   }

	   return c;
	}

	function pkcs7pad(plaintext)
	{
	   var pad = 16 - (plaintext.length & 15);
	   for (var i = 0; i < pad; i++)
	   {
	      plaintext+= String.fromCharCode(pad);
	   }
	   return plaintext;
	}

	function aes_encrypt(plaintext, key, iv)
	{
	   var ciphertext = new Array();
	   plaintext = pkcs7pad(plaintext);
	   key = new keyExpansion(key);
	   for (var i = 0; i < plaintext.length; i+=16)
	   {
	      var block = new Array(16);
	      for (var j = 0; j < 16; j++)
	      {
	         block[j] = plaintext.charCodeAt(i + j) ^ iv[j];
	      }
	      block = AESencrypt(block, key);
	      for (var j = 0; j < 16; j++)
	      {
	         iv[j] = block[j];
	      }
	      ciphertext = ciphertext.concat(block);
	   }
	   return ciphertext;
	}

	function phpbb_encrypt1024(plaintext)
	{
	   var temp = new Array(32);
	   rng.nextBytes(temp);
	   var iv = temp.slice(0, 16);
	   var key = "";
	   for (var i = 16; i < 32; i++) // eg. temp.slice(16, 32)
	   {
	      key+= String.fromCharCode(temp[i]);
	   }

	   var n = new BigInteger("00a52ebc98a9583a90b14d34c009d436996b590561224dd1f41bd262f17dbb70f0fe9d289e60a3c31f1f70a193ad93f0a77e9a491e91de9f9a7f1197d1ffadf6814b3e46d77903a8f687849662528cdc3ea5c7c8f3bdf8fb8d118f01441ce317bb969d8d35119d2d28c8c07cbcfb28919387bd8ee67174fb1c0b2d6b87dfa73f35", 16);
	   var k = 128; // length of n in bytes
	   var e = new BigInteger("010001", 16);

	   frm1.key1.value = rsaes_oaep_encrypt(plaintext, n, k, e);
	   frm1.iv1.value = char2hex(iv);
	   frm1.data1.value = char2hex(aes_encrypt(plaintext, key, iv));
	}


	this.phpbb_encrypt2048 = function(plaintext, k, e, n)
	{
	   var temp = new Array(32);
	   rng.nextBytes(temp);
	   var key = "";
	   for (var i = 16; i < 32; i++) // eg. temp.slice(16, 32)
	   {
	      key+= String.fromCharCode(temp[i]);
	   }

	   var _e = new BigInteger(e, 16);
	   var _n = new BigInteger(n, 16);
	   
	   var _rsaoen = "";
	   
	   while(_rsaoen.length<512){
			_rsaoen = rsaes_oaep_encrypt(plaintext, _n, k, _e);
			if(_rsaoen.length>511)
				break;
	   }
	   
	   return _rsaoen;
	};
	//=======================================================//

	function makeHexToArrayByte(hexString)
	{
		var len = hexString.length/2;
		var result = Array(len);
		for (var i = 0; i < len; i++)
		result[i] = parseInt(hexString.substring(2*i, 2*i+2),16);
		return result;
	}

	function getTodayDate(){
		 var _date  = new Date();
		 var _year  = "" + _date.getFullYear();
		 var _month = "" + (_date.getMonth() + 1);
		 var _day   = "" + _date.getDate();

		 if( _month.length == 1 ) _month = "0" + _month;
		 if( ( _day.length ) == 1 ) _day = "0" + _day;

		 var tmp = "" + _year.substring(2, 4) + _month + _day;
		 return tmp;
	}
	
	function verifyCA() 
	{
		var x509_pub = new X509();
		x509_pub.readCertPEM(cert_pub);
	  	
//		var NotBefore = x509_pub.getNotBefore();
//		var NotAfter = x509_pub.getNotAfter();
		var Signature = x509_pub.getSignature();
		var CertInfo = x509_pub.getCertInfo();
		var abCertInfo = CryptoJS.enc.Hex.parse(CertInfo);
		var abHash =  CryptoJS.SHA256(abCertInfo).toString();
		
//		var todayDate = getTodayDate();		
//		if(todayDate < NotBefore.substring(0, 6) || todayDate >= NotAfter.substring(0, 6)) {
//			alert("인증서 유효기간이 만료되었습니다.");
//			return false;
//		}
			
		var x509_ca = new X509();
		x509_ca.readCertPEM(cert_ca);

		var isValid = x509_ca.subjectPublicKeyRSA.verifyString(abHash, Signature);
		if (isValid) {
			return true;
		} else {
			return false;
		}
	}
}





Transkey.prototype.setKeyboard = function(inputObj, isMultiCursor, useButton, useTranskey){
	var div = document.createElement("div");
	div.setAttribute("id", inputObj.id+"_layout");
	var _cssName = inputObj.getAttribute("data-tk-cssName");
	div.className="transkey_divLayout";
	if(_cssName!=null){
		div.className="transkey_"+_cssName+"_divLayout";
		_cssName = _cssName+"_";
	}else if(_cssName==null){
		_cssName = "";
	}
	var keyboardType = inputObj.getAttribute("data-tk-kbdType");
	var _isCrt = inputObj.getAttribute("data-tk-isCrt");
	var ExE2E = inputObj.getAttribute("data-tk-ExE2E");
	var keyType;
	var isMultiC = isMultiCursor;
	var useB = useButton;
	var useT = useTranskey;
	if(this.isMobile||this.isOpera)
		isMultiC = false;
	

	if(keyboardType=="qwerty"){
		this.setQwertyLayout(inputObj.id, div, isMultiC, _cssName);
		keyType="lower";
	}
	else{
		this.setNumberLayout(inputObj.id, div, isMultiC, _cssName);
		keyType="single";
	}
	
	this.setHiddenField(inputObj, ExE2E);
	
	transkey[inputObj.id] = new TranskeyObj(inputObj, div, keyType, keyboardType, isMultiC, useT);
	
	//transkey[inputObj.id].setButton(useB);	//170323_checkBox to button
	transkey[inputObj.id].setButton2(useB);
	
	if(_isCrt=="true")
		transkey[inputObj.id].isCrt = true;
	
	transkey.objs.push(inputObj.id);
	
	document.body.appendChild(div);
	
	
};

Transkey.prototype.onKeyboard = function(inputObj){

	 if(this.now!=null)
		 this.close();
	 
	 this.now = transkey[inputObj.id];
	 
	 if(!this.now.allocate)
		 this.now.allocation();
		 
	 if(this.now!=null&&this.now.useTranskey){
		 this.now.clear();
		 var div = this.now.div;	 
		 inputObj.disabled=true;
		 inputObj.blur();
		 this.now.setDrag(transkey_isDraggable);
		 
		 if(this.now.keyboardType=="qwerty"){
			 tk.now.setKeyType("lower");
			 this.now.setQwertyKey("lower");
			 tk.now.cap = false;
		 }
			
		 
		 this.setPosition();
		
		 div.style.display="block";
	 }else{
		 this.close();
	 }
	 
 };

//170323_checkBox to button
Transkey.prototype.onKeyboard2 = function(inputObj){

	 
	 if(this.useTranskey==false)
		 return;


	 this.now = transkey[inputObj.id];

	 if(!this.now.allocate)
		 this.now.allocation();

	 this.now.clear();

	 if(this.now!=null&&this.now.useTranskey){
		 var div = this.now.div;	 
		 inputObj.disabled=true;
		 this.now.setDrag(transkey_isDraggable);

		 if(this.now.keyboardType=="qwerty"){
			 tk.now.setKeyType("lower");
			 this.now.setQwertyKey("lower");
			 tk.now.cap = false;
		 }


		 this.setPosition();

		 div.style.display="block";
	 }else{
//		 transkey[inputObj.id].useTranskey=false;
//		 transkey[inputObj.id].inputObj.readOnly=false;
//		 transkey[inputObj.id].checkValue.value="e2e";	//170412
	 }

 };

 
Transkey.prototype.start = function(event, index, osDiv){
	if(tk.isPause)
		return;
	
	var isOsDiv = false;
	if(osDiv!=null)
		isOsDiv = osDiv;
	
	var x = 0;
	var y = 0;
	var key = null;
	if(tk.now.isMultiMode&&isOsDiv){
		x = Number(tk.now.osMouseDiv.style.left.replace("px",""));
		y = Number(tk.now.osMouseDiv.style.top.replace("px",""));
		if (event.offsetX != null || event.offsetY != null) {
			x = x + 1;
			y = y + 1;
		} else if (event.layerX != null || event.layerY != null) {
			x = x - 2;
			y = y - 2;
		}
		x = parseInt(x);
		y = parseInt(y);
	}else{
		if(this.isMobile){
			key = this.getKeyByIndex(index, this.now.keyboard);
			x = key.xpoints[0];
			y = key.ypoints[0];
		}else{
			if (event.offsetX != null || event.offsetY != null) {
				x = event.offsetX + 1;
				y = event.offsetY + 1;
			} else if (event.layerX != null || event.layerY != null) {
				x = event.layerX - 2;
				y = event.layerY - 2;
			}
			x = parseInt(x);
			y = parseInt(y);

			
		}
	}
		
	
	
	key = this.getKey(x, y, this.now.keyboard);

	if (key != null) {
		
		if(key.name==""){
			if(tk.now.isMultiMode){
				tk.pauseKeyboard(true);
			}
			var encrypted = tk.getEncData(x, y);
			if(tk.now.fieldType=="text")
				tk.getText(encrypted);
			else
				tk.now.inputObj.value = tk.now.inputObj.value + "*";
			tk.now.hidden.value += transkey_delimiter + encrypted;
			if(tk.now.inputObj.maxLength>0){
				if (tk.now.inputObj.value.length >= tk.now.inputObj.maxLength) {
					this.close();
					return;
				}
			}

		}else if (key.name == "backspace") {
			this.del();
		} else if (key.name == "clear") {
			this.clear();
		} else if (key.name == "caps") {
			this.cap();
		} else if (key.name == "close") {
			this.close();
		} else if (key.name == "enter") {
			this.done();
		} else if (key.name == "crtenter") {
			this.crtenter();
		}

	}
		

};

Transkey.prototype.showCursor = function(event, isCursor){
	if(tk.now==null)
		return;
	if(tk.now.isMultiMode){
		var x = 0;
		var y = 0;
		
		if (event.offsetX != null || event.offsetY != null) {
			x = event.offsetX;
			y = event.offsetY;
		} else if (event.layerX != null || event.layerY != null) {
			x = event.layerX;
			y = event.layerY;
		}
		var xCenterPoint = parseInt(tk.now.width/2);
		if(isCursor){
			tk.now.fakeMouseDiv.style.visibility = "visible";
			tk.now.osMouseDiv.style.visibility = "visible";
			
			tk.now.osMouseDiv.style.left = x + 1 +parseInt(tk.now.osMouseDiv.style.left)+ 'px';
			tk.now.osMouseDiv.style.top = y +parseInt(tk.now.osMouseDiv.style.top)+ 'px';
			tk.now.fakeMouseDiv.style.left = xCenterPoint + (xCenterPoint - (parseInt(tk.now.osMouseDiv.style.left)+x)) + 'px';
			tk.now.fakeMouseDiv.style.top = y + parseInt(tk.now.fakeMouseDiv.style.top)+ 'px';
			

			
		}else{
			
//			console.log("x:"+x+", y:"+y);

			
			tk.now.fakeMouseDiv.style.left = xCenterPoint + (xCenterPoint - x) + 'px';
			tk.now.fakeMouseDiv.style.top = y + 'px';
			
			tk.now.osMouseDiv.style.left = x + 1 + 'px';
			tk.now.osMouseDiv.style.top = y + 'px';
		}
		
		
		
	}

};

Transkey.prototype.hideCursor = function(event){
	if(tk.now==null)
		return;
	if(tk.now.isMultiMode){
		tk.now.fakeMouseDiv.style.visibility = "hidden";
		tk.now.osMouseDiv.style.visibility = "hidden";
	}
};

Transkey.prototype.visibleCursor = function(){
	if(tk.now==null)
		return;
	if(tk.now.isMultiMode){
		tk.now.fakeMouseDiv.style.visibility = "visible";
		tk.now.osMouseDiv.style.visibility = "visible";
	}
};

Transkey.prototype.setMultiCursor = function(boolean){
	if(tk.now==null||!tk.now.isMultiCursor)
		return;
	tk.now.isMultiMode=boolean;
	if(boolean){
		tk.now.multiMouseTypeDiv.style.display="none";
		tk.now.singleMouseTypeDiv.style.display="inline";
		tk.now.fakeMouseDiv.style.display="inline";
		tk.now.osMouseDiv.style.display="inline";
		tk.now.fakeMouseDiv.style.visibility = "hidden";
		tk.now.osMouseDiv.style.visibility = "hidden";
		tk.now.setCursorStyle("none");
		tk.now.width=tk.now[tk.now.keyType+"Div"].clientWidth;
		if(transkey_isDraggable)
			tk.now.setDrag(false);
	}else{
		tk.now.multiMouseTypeDiv.style.display="inline";
		tk.now.singleMouseTypeDiv.style.display="none";
		tk.now.fakeMouseDiv.style.display="none";
		tk.now.osMouseDiv.style.display="none";
		tk.now.setCursorStyle("default");
		if(transkey_isDraggable)
			tk.now.setDrag(true);
	}
};

Transkey.prototype.pauseKeyboard = function(boolean){
	tk.isPause = boolean;
	var div = tk.now[tk.now.keyType+"Div"];
	if(boolean){
		if (div.filters) {
			div.style.filter = "alpha(opacity:50)";
		}else{
			div.style.opacity = 0.5;
		}
		tk.now.blankDiv.style.display="none";
		tk.now.blankOverDiv.style.display="inline";
	}else{
		if (div.filters) {
			div.style.filter = "alpha(opacity:100)";
		}else{
			div.style.opacity = 1.0;
		}
		tk.now.blankDiv.style.display="inline";
		tk.now.blankOverDiv.style.display="none";
	}

	
};

Transkey.prototype.del = function(e, ele){
	
		tk.now.inputObj.value = tk.now.inputObj.value.substring(0, tk.now.inputObj.value.length - 1);
		 
		var pos = tk.now.hidden.value.lastIndexOf(transkey_delimiter);
		tk.now.hidden.value = tk.now.hidden.value.substring(0, pos);
};

Transkey.prototype.clear = function(){
	tk.now.clear();
};

Transkey.prototype.cap = function(){
	if(tk.now.cap){
		tk.now.setKeyType("lower");
		tk.now.cap = false;
	}else{
		tk.now.setKeyType("upper");
		tk.now.cap = true;
	}					
		
	tk.now.setQwertyKey(tk.now.keyType);
};
	
Transkey.prototype.close = function(){
	 tk.now.inputObj.disabled=false;
	 if(tk.now.keyboardType=="qwerty")
	  tk.now.setKeyType("lower");
	 if(!tk.isMobile&&tk.now.isMultiMode)
	  tk.pauseKeyboard(false);
	 tk.setMultiCursor(false);
	 tk.now.div.style.display="none";
	 tk.now=null;
	 
	 isClick = false;	//170323_checkBox to button
	};

Transkey.prototype.done = function(){
	tk.now.done();
	tk.close();
};
	
Transkey.prototype.alert = function(cmd){

};


Transkey.prototype.buttonListener = function(e){
	var obj;
	if (e.type == "text" || e.type == "password") {
		obj = event;
	} else {
		e = e ? e : window.event;
		obj = e.target ? e.target : e.srcElement;
	}
	var id = tk_btn_arr[obj.id];
	
	var v = obj.checked;
	if(v){
		transkey[id].useTranskey=true;
		transkey[id].inputObj.readOnly=true;
		tk.onKeyboard(transkey[id].inputObj);
		transkey[id].checkValue.value="transkey";
	}else{
		transkey[id].clear();
		transkey[id].useTranskey=false;
		transkey[id].inputObj.readOnly=false;
		if(tk.now!=null)
			tk.close();
		transkey[id].checkValue.value="e2e";
	}
	
};

//170323_checkBox to button
var isClick = false;

Transkey.prototype.buttonListener2 = function(e){
	
	var obj;
	if (e.type == "text" || e.type == "password") {
		obj = event;
	} else {
		e = e ? e : window.event;	
		obj = e.target ? e.target : e.srcElement;
	}
	var id = tk_btn_arr[e.id];
	
	//var isChecked = e.src.substring(e.src.length - 'off.png'.length) == 'off.png'; 
	//e.src = isChecked ? transkey_url+'/images/on.png' : transkey_url+'/images/off.png';
	
	
	
	if(!isClick){
		
		transkey[id].useTranskey=true;
		//transkey[id].inputObj.readOnly=true;
		transkey[id].clear();
		tk.onKeyboard2(transkey[id].inputObj);
		//transkey[id].checkValue.value="transkey";
		isClick = true;
		
	}else{
		
		transkey[id].clear();
		transkey[id].useTranskey=false;
		//transkey[id].inputObj.readOnly=false;
		//transkey[id].inputObj.readOnly=true;	//170502
		if(tk.now!=null)
			tk.close();
		
		isClick = false;
		//transkey[id].checkValue.value="e2e";
	}
	
	
};

Transkey.prototype.dragstart = function(event){
var div = tk.now.div;
tk.offsetX=Number(div.style.left.replace("px",""));
tk.offsetY=Number(div.style.top.replace("px",""));
tk.dragStart=true;

tk.startX=event.clientX;
tk.startY=event.clientY;

document.onmousemove=tk.dragmove;
document.body.focus();
document.onselectstart = function () { return false; };
div.ondragstart = function() { return false; };
return false;
};

Transkey.prototype.dragmove = function(event){
	if(tk.dragStart){
		if (event == null)
			event = window.event;

		var moveX = event.clientX-tk.startX;
		var moveY = event.clientY-tk.startY;
		var div = tk.now.div;
		div.style.left=tk.offsetX+moveX+"px";
		div.style.top=tk.offsetY+moveY+"px";
		
	}
};

Transkey.prototype.dragend = function(event){
	var div = tk.now.div;
	tk.dragStart=false;
	tk.startX=0;
	tk.startY=0;
	document.onmousemove = null;
    document.onselectstart = null;
    div.ondragstart = null;
	
};

function generateSessionKeyForCRT(){
	initTranskey();
}

function TransKey(name, x, y, url, keyboardType, maxSize, fieldType){
	var inputObj = document.getElementById(name).getElementsByTagName("input")[0];	
	if(keyboardType=="qwerty_crt")
		keyboardType = "qwerty";
	else if(keyboardType=="number_crt")
		keyboardType = "number";
	
	if(inputObj.id==null||inputObj.id=="")
		inputObj.id =  name+"_input";
	
	inputObj.setAttribute("data-tk-kbdType", keyboardType);
	tk.setKeyboard(inputObj, transkey_isMultiCursor, false, true);
	this.name = inputObj.id;
	
	if(transkey[this.name]!=null){
		transkey[this.name].isCrt = true;
		transkey[this.name].fieldType = "password";
	}
	
	if (inputObj.addEventListener) {
		inputObj.addEventListener("click", function(e){
			var obj;
			if (e.type == "text" || e.type == "password") {
				obj = event;
			} else {
				e = e ? e : window.event;
				obj = e.target ? e.target : e.srcElement;
			}
			tk.onKeyboard(obj);}, false);
	} else if (inputObj.attachEvent) {
		inputObj.attachEvent("onclick", function(e){
			var obj;
			if (e.type == "text" || e.type == "password") {
				obj = event;
			} else {
				e = e ? e : window.event;
				obj = e.target ? e.target : e.srcElement;
			}
			tk.onKeyboard(obj);});
	}
	this.clear = function(){
		transkey[this.name].clear();
	};
	this.close = function(){
		tk.close();
	};
	this.getHiddenData = function(){
		return transkey[this.name].hidden.value;
	};
	
	this.getCipherData = function(xecureRandomData, crtType){
		if(crtType==null)
			crtType = "xecure";
		return transkey[this.name].getCipherData(xecureRandomData, crtType);
	};
	
	transkey[this.name].crtObj = this;
	
	transkey[this.name].done = function(){
		if(typeof tk.now.crtObj.onCompleteInput  != "undefined"){
			if(tk.now.keyboardType == "qwerty"){
				if (tk.now.crtObj.onCompleteInput () == false)
				{
					return false;
					}
			}else if(tk.now.keyboardType == "number"){
				if (tk.now.crtObj.onCompleteClose () == false)
				{
					return false;
					}
			} 
		}//170518_crt_issue
		else if(typeof onCrtEnter == "function"){
			onCrtEnter();
		}

	};
	
	
}
function tk_contains(parent, child, deep)

{
    if (parent == child)
          return true;

    var items = parent.children;
    var count = items.length;

    for ( var i = 0; i < count; i++) {
          if (items[i] == child)
                 return true;
          if (deep == true && tk_contains(items[i], child, deep))
                 return true;
    }
    return false;
}
function checkTransKey(nsEvent) {

    var inputObj;

    if (nsEvent.type == "text" || nsEvent.type == "password") {
          inputObj = event;
    } else {
          nsEvent = nsEvent ? nsEvent : window.event;
          inputObj = nsEvent.target ? nsEvent.target : nsEvent.srcElement;
    }
    
    if(tk.now!=null){
        var transkeyDiv = tk.now.div;

        if (tk_contains(transkeyDiv, inputObj, true) == false) {
    		tk.close();	
        }
    }
}