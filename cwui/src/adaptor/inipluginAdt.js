/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
define([
    '../main/constants',
    '../conf/msgFactory',
    '../core/coreFactory',
    '../core/utils',
    '../conf/certificates',
    '../core/unihan'
     ], function (constants, msgFactory, coreFactory, utils, certificates,unihan) {

	var encInfo = {};
	
    function constructIniPluginData(vf, vd, sk, cc, sg, alg, dt, er, ts, kecc, iver){
    	var iniPluginData = "";
    	/* vf(10=암호화, 11=전자서명+암호화, 21=상호인증)*/
    	iniPluginData += "vf=" + encodeURIComponent(vf);	// 필수
		/* vd : 클라이언트 개인키로 서명한 서버시간(사용 안함) */
		if (vf == 1) {
			iniPluginData += "&vd=" + encodeURIComponent(vd);
		}
		/* sk */
		iniPluginData += "&sk=" + encodeURIComponent(sk);	// 필수
		/* cc : 사용자 인증서 */
		if(cc){
			iniPluginData += "&cc=" + encodeURIComponent(cc);
		}
		/* sg : PKCS#1서명 */
		if(sg){
			iniPluginData += "&sg=" + encodeURIComponent(sg);
		}
		/* 
		   alg : 구간 암호화 및 서명 알고리즘(sym=구간암호알고리즘, kx=키교환알고리짐, kxh=키교환 해시알고리즘, sg=서명알고리즘, sgh=서명해시알고리즘) 
		 	-vf:10,vf:11=sym:SEED-CBC;kx:RSA15;kxh:SHA1;sg:RSA15;sgh:SHA1
			-vf:21=sym:SEED-CBC;kx:RSA15;kxh:SHA1;sg:PSS;sgh:SHA1;
		*/
		iniPluginData += "&alg=" + encodeURIComponent(coreFactory.Factory.Util.encode64(alg));	// 필수
		/* dt : 세션키로 암호화된 데이터 */
		iniPluginData += "&dt=" + encodeURIComponent(dt);	// 필수
		
		/* er : 본인확인 Random */
		if(er){
			iniPluginData += "&er=" + encodeURIComponent(er);
		}
		
		if(vf == 10 || vf == 11 || vf == 21){
		    /* ts : dt의 __INIts__를 제거한 값 */
			if(ts){
				iniPluginData += "&ts=" + encodeURIComponent(ts);
			}
			/* kecc : KM Cert(vf=21만 사용*)*/
			if(kecc){
				iniPluginData += "&kecc=" + encodeURIComponent(kecc);
			}
			/* iver : 프로토콜 버전*/
			iniPluginData += "&iver=" + encodeURIComponent(iver);
		}
		
		return iniPluginData;
    };
    
    function encryptAsymmetric(cert, AsymAlg, hash, seed){
    	var encSeed = coreFactory.Factory.Cipher.asymmetricCertEncrypt(cert, AsymAlg, hash, seed);
        return coreFactory.Factory.Util.encode64(encSeed);
    };
    
    function encryptSymmetric(symAlg, key, iv, orgData){
    	 var dataBuf = coreFactory.Factory.Util.createBuffer(orgData);
         var encData = coreFactory.Factory.Cipher.symmetricEncrypt(symAlg, key, iv, dataBuf);
         
         return coreFactory.Factory.Util.encode64(encData.data);
    };
    
    function makeSymmetricKeyIv(sk, symm){
    	var hashd = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, sk, null);
    	symm.key = hashd.substr(0,16);
    	symm.iv = hashd.substr(16, 16);
    };

    var makeIniPluginData = function(rndUrl, orgData, vf, cc, sg, vidR, callback){
    	
    	var vd = "";	// 클라이언트 개인키로 서명한 서버시간(사용 안함)
    	var sk;			// 유도키
        var dt;			// 암호화된 데이터
        var er;			// VID Random
        var ts;			// 암호화된 Random or Time
        var kecc = "";	// KM Cert
        var iver=100;	// 버전
        
    	// Step01. 유도키 생성
    	//var seed = coreFactory.Factory.Util.getBytes(64);
        var seed = "1234567890123456789012345678901234567890123456789012345678901234";
    	
    	var alg = {
    			"sym":"SEED-CBC",
    			"kx":"RSA15",
    			"kxh":"SHA1",
    			"sg":"RSA15",
    			"sgh":"SHA256"
    		};
    	
    	if(vf==21){
    		alg = {
        			"sym":"SEED-CBC",
        			"kx":"RSA15",
        			"kxh":"SHA1",
        			"sg":"PSS",
        			"sgh":"SHA256"
        		};
    	}
    	
    	// Step02. 암호화 키 생성
    	var symm = {
    			"key" : "1234567890123456",
    			"iv" : "0000000000000000",
    	};
    	
    	makeSymmetricKeyIv(seed, symm);
    	
    	if(vf == 10 ||vf == 11 || vf == 21){
    		
    		// Step03. ts생성
            var msg = '';
            var b64Ts = utils.Transfer.xmlHttpRequest(rndUrl, msg).trim();
            utils.Log.debug('ts or random : ' + b64Ts);
            
            var b64decTs = coreFactory.Factory.Util.decode64(b64Ts);
            ts = encryptSymmetric(alg.sym, symm.key, symm.iv, b64decTs)

            if(vf == 11 && !orgData){
            	orgData = b64decTs;
            }
            
            if(vf == 10 || vf == 11){
            	// Step04. sk생성
        		sk = encryptAsymmetric(certificates.SCert, alg.kx, alg.kxh, seed);
        		
        		// Step05. dt생성
        		var dummy = coreFactory.Factory.Util.getBytes(16);
        		dt = encryptSymmetric(alg.sym, symm.key, symm.iv, dummy + orgData);
        	}
            
            if(vf == 11 || vf == 21){
            	var tVidR ;
            	if(vidR.length >= 40){            		
            		tVidR = coreFactory.Factory.Util.hexToBytes(vidR);
            	}else{
            		tVidR = coreFactory.Factory.Util.decode64(vidR);
            	}
            	
                //var hexVidR = coreFactory.Factory.Util.hexToBytes(vidR);
                er = encryptSymmetric(alg.sym, symm.key, symm.iv, tVidR);
            }
    	}else{
    		utils.Log.error('not support vf=' + vf);
    	}
    	
    	var strAlg = "";
    	for(nm in alg){
    		strAlg += nm + ":" + alg[nm] + ";";
    	}
    	strAlg = strAlg.substring(0, strAlg.length-1);
    	
    	var iniPluginData = constructIniPluginData(vf, vd, sk, cc, sg, strAlg, dt, er, ts, kecc, iver);
    	
    	// IniPluginData생성 후 비밀번호 초기화
    	GINI_ProtectMgr.destroy();
    	
    	eval(callback)(iniPluginData);
    };

	/************************************************************
	 * @brief		
	 * @param[in]	INIdata			
	 ************************************************************/
	function post_MakeINIpluginData(INIdata) {
		try {
			var returnInfo = encInfo;
			encInfo = {};

			if (returnInfo.type == "origin") {
				eval(returnInfo.callback)(INIdata, returnInfo.postdata);
			} else if (returnInfo.type == "form1") {
				if (returnInfo.form.INIpluginData) {
					if (INIdata && INIdata != "CANCEL" && INIdata != "FALSE") {
						returnInfo.form.INIpluginData.value = INIdata;
						eval(returnInfo.callback)(true, returnInfo.postdata);
					} else {
						eval(returnInfo.callback)(false, returnInfo.postdata);
					}
				} else {
					if (INI_ALERT) {
						INI_ALERT("INIpluginData param not found", "ERROR");
					} else {
						alert("INIpluginData param not found");
					}

					eval(returnInfo.callback)(false, returnInfo.postdata);
				}
			} else if (returnInfo.type == "form2") {
				if (returnInfo.sendForm.INIpluginData) {
					if (INIdata && INIdata != "CANCEL" && INIdata != "FALSE") {
						returnInfo.sendForm.INIpluginData.value = INIdata;
						eval(returnInfo.callback)(true, returnInfo.postdata);
					} else {
						eval(returnInfo.callback)(false, returnInfo.postdata);
					}
				} else {
					if (INI_ALERT) {
						INI_ALERT("INIpluginData param not found", "ERROR");
					} else {
						alert("INIpluginData param not found");
					}

					eval(returnInfo.callback)(false, returnInfo.postdata);
				}
			} else if (returnInfo.type == "link") {
				var encINIData = encodeURIComponent(INIdata);
				var queryString = "INIpluginData=" + encINIData;

				url = returnInfo.url;
				target = returnInfo.target;
				style = returnInfo.style;

				if (url.indexOf('?', 0) < 0) url += "?";
				if ((url.charAt(url.length - 1) != '?') && (url.charAt(url.length - 1) != '&')) url += "&";
				url += queryString;
				exlog("EncLink_cb", url);
				var openWin = window.open(url, target, style);
			} else if (returnInfo.type == "location") {
				var encINIData = encodeURIComponent(INIdata);
				url = returnInfo.url + encINIData;
				eval(returnInfo.callback)(url, returnInfo.postdata);
			} else if (returnInfo.type == "params") {
				eval(returnInfo.callback)(INIdata, returnInfo.postdata);
			}
		} catch (e) {
			exlog("post_MakeINIpluginData [exception]", e);
		}
		encInfo = {};
	};

	/************************************************************
	 * @brief		
	 * @param[in]	form
	 * @param[in]	start
	 * @param[in]	bErase
	 ************************************************************/
	function GatherValue(form, start, bErase) {

		var strResult = "";
		var len = form.elements.length;
		for (i = start; i < len; i++) {
			try {
				var element = form.elements[i];
				var name, value;

				if (!element.name && !element.id) continue;
				if (element.name == "INIpluginData") continue;
				if (element.name == "filedata") continue;
				if ((element.type == "button") || (element.type == "reset") || (element.type == "submit")) continue;
				if (((element.type == "radio") || (element.type == "checkbox")) && (element.checked != true)) continue;
				if (element.name.indexOf('file_', 0) >= 0) continue;
				if (element.name.indexOf('_shttp_client_', 0) >= 0) continue;
				if (element.name.indexOf('Encrypted_', 0) >= 0) continue;
				if (element.type == "select-one") {
					var sel = element.selectedIndex;
					if (sel < 0) continue;
					value = element.options[sel].value;
					if (bErase) element.selectedIndex = -1;
				} else {
					value = element.value;
					if (bErase) element.value = "";
				}
				if ((element.type == "checkbox") && (bErase)) element.checked = false;

				name = element.name ? element.name : element.id;
				if (name) {
					if (strResult != "") strResult += "&";
					strResult += encodeURIComponent(name);//unihan.convertUtf8ToEucKr(name,false);
					strResult += "=";					
					strResult += encodeURIComponent(value);//unihan.convertUtf8ToEucKr(value, false);
				}
			} catch (e) {
			}
		}
		return strResult;
	};
	
	return{
    	makeIniPluginData : makeIniPluginData,
    	encInfo : encInfo,
    	GatherValue : GatherValue,
    	post_MakeINIpluginData : post_MakeINIpluginData
	};

});
