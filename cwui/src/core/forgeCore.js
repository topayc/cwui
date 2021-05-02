/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * forge crypto and pki
 */

define([
        '../core/forgeCrypto/forge',
        '../main/constants',
        '../core/utils',
        '../core/iniException',
        '../conf/defaultConf',
        '../core/unihan'
        ], function (forge, constants, utils, iniException, defaultConf, unihan) {
	
	var KeyPair = (function() {
		
		var oldDate = new Date();
		var state = forge.pki.rsa.createKeyPairGenerationState(2048);
		var step = function() {
			// step key-generation, run algorithm for 100 ms, repeat
			if(!forge.pki.rsa.stepKeyPairGenerationState(state, 100)) {
				setTimeout(step, 1);
		    } else {
//		    	var nowDate = new Date();
//		    	alert("generation success : " + (nowDate.getTime() - oldDate.getTime()));
		    }
		};
		// TODO: turn on progress indicator here
		setTimeout(step, 0);
		
		var genernaeKeyPair = function(){
			
			var keyPair = {};
			
			if((state.keys) && (state.keys.privateKey) && (state.keys.publicKey)){
				keyPair["PRIVATE_KEY"] = state.keys.privateKey;
				keyPair["PUBLIC_KEY"] = state.keys.publicKey;
			}else{
				try{
					var url = defaultConf.System.UrlAddress[constants.System.URL_KEY_PAIR];
					
					var remotePair = utils.Transfer.xmlHttpRequest(url,'');
					remotePair = decodeURIComponent(remotePair);
					remotePair = remotePair.split('|');
					
					keyPair["PRIVATE_KEY"] = forge.pki.privateKeyFromAsn1(forge.asn1.fromDer(Util.decode64(remotePair[0])));
					keyPair["PUBLIC_KEY"] = forge.pki.publicKeyFromAsn1(forge.asn1.fromDer(Util.decode64(remotePair[1])));
				}catch(e){
					var localPair = forge.pki.rsa.generateKeyPair(2048);
					
					keyPair["PRIVATE_KEY"] = localPair.privateKey;
					keyPair["PUBLIC_KEY"] = localPair.publicKey;
				}	
			}
			
			return keyPair;
		};
		
		//genernaeKeyPair();
		return {
			genernaeKeyPair : genernaeKeyPair
		}
	}());	
	
	var PriKey = (function() {
		/**
		 * @desc : 개인키 추출
		 * @param pkcs8Pem : pkcs8포맷 개인키
		 * @param pwd : 개인키 비밀번호
		 * @return : 개인키
		 */
		var extractRsaPrivateKey = function(pkcs8Pem, nonceType){
			try{
				pkcs8Pem = Util.privateKeyPemTagAdd(pkcs8Pem);
				var p8Der = forge.pki.encryptedPrivateKeyFromPem(pkcs8Pem);
				var decprivateKeyInfo = forge.pki.decryptPrivateKeyInfo( p8Der, GINI_ProtectMgr.extract(nonceType));
				var privateKey = forge.pki.privateKeyFromAsn1(decprivateKeyInfo);
				
				return privateKey;
				
				//OpenSSL 개인키 복호화
//				var encPrivateKey = Util.privateKeyPemTagRemove(pkcs8Pem);
//				encPrivateKey = Util.base64decode(encPrivateKey);
//				encPrivateKey = forge.pki.decryptRsaPrivateKey(new forge.util.ByteStringBuffer(encPrivateKey), GINI_ProtectMgr.extract(nonceType));
//				return encPrivateKey;
			}catch(e){
				//alert("input password : " + pwd);
				new iniException.Warn.newThrow(e, 'WARN_1001');
			}
		};
		
		var extractP12Cert = function(pkcs12Pem){
			try{
				// decode p12 from base64
				var p12Der = forge.util.binary.base64.decode(pkcs12Pem);
				var bsbuf =  new forge.util.ByteStringBuffer(p12Der);
				var p12Asn1 =  forge.asn1.fromDer(bsbuf);
				
				var p12 = forge.pkcs12.certFromP12Asn1(p12Asn1); 
				var certBags = p12.getBags({bagType: forge.pki.oids.certBag});
				var certB = certBags[forge.pki.oids.certBag][0];
				var certPem = forge.pki.certificateToPem(certB.cert);
				return certPem;
			}catch(e){
				new iniException.Warn.newThrow(e, 'WARN_1001');
			}
		};
		
		var extractP12PriCert = function(pkcs12Pem, pwdType){
			try{
				// decode p12 from base64                                   
				var p12Der = forge.util.binary.base64.decode(pkcs12Pem);    
				var bsbuf =  new forge.util.ByteStringBuffer(p12Der);
				              
				// get p12 as ASN.1 object                                  
				var p12Asn1 =  forge.asn1.fromDer(bsbuf);                   
				                                                            
				// decrypt p12 using the password 'password'
				var p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, GINI_ProtectMgr.extract(pwdType)); 

				// get bags by type
				var certBags = p12.getBags({bagType: forge.pki.oids.certBag});
				// bags are key'd by bagType and each bagType key's value
				// is an array of matches (in this case, certificate objects)
				var certB = certBags[forge.pki.oids.certBag][0];
				if(!certB.cert){
					certB = certBags[forge.pki.oids.certBag][1];
				}
				
				// get key bags
				var priBags = p12.getBags({bagType: forge.pki.oids.pkcs8ShroudedKeyBag});
				// get key
				var bag = priBags[forge.pki.oids.pkcs8ShroudedKeyBag][0];
				if(!bag){
					priBags = p12.getBags({bagType: forge.pki.oids.keyBag});
					bag = priBags[forge.pki.oids.keyBag][0];
				}
				var priKey;
				if(!bag.key){
					bag = priBags[forge.pki.oids.keyBag][1];
					priKey = bag.key;
				} else {
					priKey = bag.key;
				}
				var certPem = forge.pki.certificateToPem(certB.cert);
				var priPem = forge.pki.encryptRsaPrivateKey(priKey, GINI_ProtectMgr.extract(pwdType), 
						{legacy: false, algorithm:'seed'});
				return{
					privateKey : priPem,
					certificate : certPem
				};
				
			}catch(e){
				//alert("input password : " + pwd);
				new iniException.Warn.newThrow(e, 'WARN_1001');
			}
		};
		
		var rebuildCertPriP12 = function(selected, nonceType){
			
//			var priKey = PriKey.extractRsaPrivateKey(selected.privateKey, pwd);
			//var priKey = PriKey.extractRsaPrivateKey(selected.privateKey, GINI_ProtectMgr.extract(pwdType));
			var priKey = PriKey.extractRsaPrivateKey(selected.privateKey, nonceType);
			
			// KM인증서 처리  누락
			var p12Asn1 = forge.pkcs12.toPkcs12Asn1(
					priKey,
					selected.certificate, 
					GINI_ProtectMgr.extract(nonceType),
					{algorithm: '3des'}
			  );

			// base64-encode p12
			var p12Der = forge.asn1.toDer(p12Asn1).getBytes();
			var p12b64 = forge.util.encode64(p12Der);
			
			return p12b64;
		};
		
		var publicKeyFromPem = function(pubPem){
			var publicKey = forge.pki.publicKeyFromPem(pubPem);
			
			return publicKey;
		}
		
		var publicKeyToPem = function(publicKey){
			var publicKeyPem = forge.pki.publicKeyToPem(publicKey);
			return publicKeyPem;
		}
		
		var publicKeyToRSAPublicKeyPem = function(publicKey){
			var publicKeyPem = forge.pki.publicKeyToRSAPublicKeyPem(publicKey);
			return publicKeyPem;
		}
		
		var privateKeyToPem = function(privateKey, maxline){
			//pki.privateKeyToPem = function(key, maxline) {
			var privateKeyPem = forge.pki.privateKeyToPem(privateKey, maxline);
			return privateKeyPem;
		}
		
		return{
			extractRsaPrivateKey : extractRsaPrivateKey,
			extractP12Cert : extractP12Cert,
			extractP12PriCert : extractP12PriCert,
			rebuildCertPriP12 : rebuildCertPriP12,
			publicKeyFromPem : publicKeyFromPem,
			publicKeyToPem : publicKeyToPem,
			publicKeyToRSAPublicKeyPem : publicKeyToRSAPublicKeyPem,
			privateKeyToPem : privateKeyToPem
		}
	}());	
	/**
	 * @desc : 인증서 관리
	 */
	var Certs = (function() {
		
		/**
		 * @desc : 인증서 속성 파싱
		 * @param pemCert : pem형식의 인증서
		 * @return : 인증서 속성 항목
		 */
		var parseCertAttributes = function(pemCert){
			try{
				pemCert = Util.certPemTagAdd(pemCert);
				var certInfo = forge.pki.certificateFromPem(pemCert);
				
				var serial = certInfo.serialNumber;
				var subjectCn = forge.util.decodeUtf8(certInfo.subject.getField('CN').value);
				var idx = subjectCn.indexOf(")");
				var subject = (idx>0 ? subjectCn.substring(0, idx+1) : subjectCn);
				var simpleSubject = subject;
				var bankCode = (idx>0 && subjectCn.length >= idx+4 ? subjectCn.substring(idx+3,idx+5) : '');
				if(typeof forge.pki.bankCD == 'undefined'){
					bankCode = '';
				}
				
				var issuerO =  certInfo.issuer.getField('O').value;
				var issuerCn =  certInfo.issuer.getField('CN').value;
				var expireDt =  certInfo.validity.notAfter;
				var exten = certInfo.getExtension("certificatePolicies")
				
				var signAlgName = forge.pki.oids[certInfo.signatureOid];
				var hashAlg = signAlgName.substring(0, signAlgName.indexOf('With'));
				
				var simpleIssuer = '';
				simpleIssuer = certInfo.issuer.getField('O').value;

				//handling  OID_NAME type of language
				/*
				var OIDName;
				if(constants.System.LANGUAGE_ENG === defaultConf.System.Language){
					OIDName = forge.pki.oids["ENG_"+exten.oid];
				}else{
					OIDName = forge.pki.oids[exten.oid];
				}
				*/
				var OIDName;
				if(constants.System.LANGUAGE_ENG === defaultConf.System.Language){
					OIDName = forge.pki.oids["ENG_"+exten.oid]+ ((bankCode != '')? " - "+forge.pki.bankCD["ENG_"+bankCode] : '');
				}else{
					OIDName = forge.pki.oids[exten.oid]+((bankCode != '')? " - "+forge.pki.bankCD[bankCode] : '');
				}

				var certAttr = {};// 필터링 관련 속성 및 Display속성을 모두 제공 한다.
				certAttr['SERIAL'] = serial;
				certAttr['SUBJECT'] = subject;
				certAttr['SUBJECT_CN'] = subjectCn;
				certAttr['ISSUER'] = issuerO;
				certAttr['ISSUER_CN'] = issuerCn;
				certAttr['EXPIRE'] = utils.String.dateTimeToString(expireDt);
				certAttr['EXPIRE_DATE'] = utils.String.dateToString(expireDt);
				certAttr['EXPIRE_STATUS'] = constants.Certs.CERT_EXPIRE_STATUS_VALID;
				certAttr['OID'] = exten.oid;
				certAttr['OID_NAME'] = OIDName;
				certAttr['ISSUER_HASH'] = certInfo.issuer.hash;
				certAttr['BEFORE_DT'] = utils.String.dateTimeToString(certInfo.validity.notBefore);
				certAttr['AFTER_DT'] = utils.String.dateTimeToString(certInfo.validity.notAfter);
				certAttr['HASH_ALG'] = hashAlg;
				certAttr['SIMPLE_ISSUER'] = simpleIssuer;
				certAttr['SIMPLE_SUBJECT'] = simpleSubject;
				certAttr['SIMPLE_OIDNAME'] = OIDName; //forge.pki.oids[exten.oid];
				
				return certAttr;

			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3001');
			}
		};
		
		var certificateDetail = function(pemCert){
			try{
				pemCert = Util.certPemTagAdd(pemCert);
				var certInfo = forge.pki.certificateFromPem(pemCert);
				
				var version = certInfo.version;
				var serial = certInfo.serialNumber;
				var signAlgName = forge.pki.oids[certInfo.signatureOid];
				var signatureAlg = signAlgName.substring(0, signAlgName.indexOf('Encryption')).replace('With', '');
				var hashAlg = signAlgName.substring(0, signAlgName.indexOf('With'));
				/*
				var issuer = '';

				issuer = issuer + 'CN = ' + certInfo.issuer.getField('CN').value + ', ';
				issuer = issuer + 'OU = ' + certInfo.issuer.getField('OU').value + ', ';
				issuer = issuer + 'O = ' + certInfo.issuer.getField('O').value + ', ';
				issuer = issuer + 'C = ' + certInfo.issuer.getField('C').value;
				*/
				var issuer = forge.pki.objToDN(certInfo.issuer);
				var simpleIssuer = '';
				simpleIssuer = certInfo.issuer.getField('O').value;
				
				var notBefore = certInfo.validity.notBefore;
				var notAfter = certInfo.validity.notAfter;
/*
				var subject = '';

				subject = subject + 'CN = ' + forge.util.decodeUtf8(certInfo.subject.getField('CN').value) + ', ';
				subject = subject + 'OU = ' + certInfo.subject.getField('OU').value + ', ';
				subject = subject + 'O = ' + certInfo.subject.getField('O').value + ', ';
				subject = subject + 'C = ' + certInfo.subject.getField('C').value;
*/
				var subject = forge.pki.objToDN(certInfo.subject);
				var subjectCn = forge.util.decodeUtf8(certInfo.subject.getField('CN').value);
				var idx = subjectCn.indexOf(")");
				var simpleSubject = (idx>0 ? subjectCn.substring(0, idx+1) : subjectCn);
				var bankCode = (idx>0 && subjectCn.length >= idx+4 ? subjectCn.substring(idx+3,idx+5) : '');
				if(typeof forge.pki.bankCD == 'undefined'){
					bankCode = '';
				}

				var expireDt =  certInfo.validity.notAfter;
				var exten = certInfo.getExtension("certificatePolicies");

				// resolve extension for print
				var ext = forge.pki.ResolveExtension(certInfo);
				//handling  OID_NAME type of language
				var OIDName;
				if(constants.System.LANGUAGE_ENG === defaultConf.System.Language){
					OIDName = forge.pki.oids["ENG_"+exten.oid]+ ((bankCode != '')? " - "+forge.pki.bankCD["ENG_"+bankCode] : '');
				}else{
					OIDName = forge.pki.oids[exten.oid]+((bankCode != '')? " - "+forge.pki.bankCD[bankCode] : '');
				}			
				var certAttr = {};
				certAttr['VERSION'] = version;
				certAttr['SERIAL'] = serial;
				certAttr['SIGNATURE_ALG'] = signatureAlg;
				certAttr['HASH_ALG'] = hashAlg;
				certAttr['ISSUER'] = issuer;
				certAttr['BEFORE_DT'] = utils.String.dateToString(notBefore);
				certAttr['AFTER_DT'] = utils.String.dateToString(notAfter);
				certAttr['SUBJECT'] = subject;
				certAttr['AUTH_KEY_ID'] = ext.authKeyId;
				certAttr['SUBJECT_KEY_ID'] = ext.subjectKeyId;
				certAttr['KEY_USEAGE'] = ext.keyUse;
				certAttr['CERT_POLICY'] = ext.certPolicy;
				certAttr['SUBJECT_ALT_NAME'] = ext.subjectAltName;
				certAttr['CRL_DISTRIBUTION'] = ext.crlDistribution;
				certAttr['AUTH_INFO_ACCESS'] = ext.authInfoAccess;
				certAttr['EXPIRE'] = utils.String.dateTimeToString(expireDt);
				certAttr['EXPIRE_DATE'] = utils.String.dateToString(expireDt);
				certAttr['EXPIRE_STATUS'] = constants.Certs.CERT_EXPIRE_STATUS_VALID;
				certAttr['SIMPLE_SUBJECT'] =  simpleSubject;
				certAttr['SIMPLE_ISSUER'] = simpleIssuer;
				certAttr['SIMPLE_OIDNAME'] = OIDName; //forge.pki.oids[exten.oid];
				
				return certAttr;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3002');
			}
		};
		
		var certificateFromPem = function(pemCert){
			try{
				pemCert = Util.certPemTagAdd(pemCert);
				return forge.pki.certificateFromPem(pemCert);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3003');
			}
		};
		
		var changePassword = function(selected, oldType, newType){
			try{
				//var priKey = PriKey.extractRsaPrivateKey(selected.privateKey.data, oldPwd);
				var priKey = PriKey.extractRsaPrivateKey(selected.privateKey, oldType);
				
				var priPem = forge.pki.encryptRsaPrivateKey(priKey, GINI_ProtectMgr.extract(newType),
						{legacy: false, algorithm:'seed'});
				
				var changed = {
					privateKey : priPem,
					certificate : selected.certificate
				};
				
				return changed;
			}catch(e){
				//alert("change password : " + oldPwd + " / " + newPwd);
				new iniException.Error.newThrow(e, 'ERR_3004');
			}
		};
		
		//정범교 개인키 변경
		var anotherChangePassword = function(handleInfo, oldType, newType){
			try{
				var priKey = PriKey.extractRsaPrivateKey(handleInfo.serviceInfo.getParameter("PRIVATE_KEY"), oldType);
				
				var priPem = forge.pki.encryptRsaPrivateKey(priKey, GINI_ProtectMgr.extract(newType),
						{legacy: false, algorithm:'seed'});
				
				var changed = {
					privateKey : priPem,
					certificate : handleInfo.serviceInfo.getParameter("CERTIFICATE")
				};
				
				return changed;
			}catch(e){
				//alert("change password : " + oldPwd + " / " + newPwd);
				new iniException.Error.newThrow(e, 'ERR_3004');
			}
		};
		//-----------------------------
		
		var issueCertificate = function(handleInfo, callback){
			
			var cmpGate = defaultConf.System.UrlAddress['CERT_CMP_GATE1'];
			var cmpGate2 = defaultConf.System.UrlAddress['CERT_CMP_GATE2'];
			
			var requestOpt = {};
			requestOpt.reqCMD = "issue";
			requestOpt.cmp_gw_url = cmpGate;
			requestOpt.cmp_gw_url2 = cmpGate2;	
			requestOpt.caname = handleInfo.requestInfo.getParameter("CA_NAME");
			requestOpt.caip = handleInfo.requestInfo.getParameter("CA_IP");
			requestOpt.caport = handleInfo.requestInfo.getParameter("CA_PORT");
			requestOpt.refCode = handleInfo.requestInfo.getParameter("REF_VALUE");
			requestOpt.authKey = handleInfo.requestInfo.getParameter("AUTH_CODE");
			
			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
//				requestOpt.passKey = handleInfo.serviceInfo.getParameter("PIN");
//				requestOpt.passNewKey = handleInfo.serviceInfo.getParameter("PIN");
				requestOpt.passKey = GINI_ProtectMgr.extract("SECURE");
				requestOpt.passNewKey = GINI_ProtectMgr.extract("SECURE");
			} else {
//				requestOpt.passKey = handleInfo.serviceInfo.getParameter("PWD");
//				requestOpt.passNewKey = handleInfo.serviceInfo.getParameter("PWD");
				requestOpt.passKey = GINI_ProtectMgr.extract("NONCE");
				requestOpt.passNewKey = GINI_ProtectMgr.extract("NONCE");
			}
			
		    forge.cmp.requestCert(requestOpt, callback);
		    // 초기화
		    requestOpt = 0x00;
		};
		
		var reIssueCertificate = function(handleInfo, callback){
			var cmpGate = defaultConf.System.UrlAddress['CERT_CMP_GATE1'];
			var cmpGate2 = defaultConf.System.UrlAddress['CERT_CMP_GATE2'];
			
			var requestOpt = {};
			requestOpt.reqCMD = "reissue";
			requestOpt.cmp_gw_url = cmpGate;
			requestOpt.cmp_gw_url2 = cmpGate2;	
			requestOpt.caname = handleInfo.requestInfo.getParameter("CA_NAME");
			requestOpt.caip = handleInfo.requestInfo.getParameter("CA_IP");
			requestOpt.caport = handleInfo.requestInfo.getParameter("CA_PORT");
			requestOpt.refCode = handleInfo.requestInfo.getParameter("REF_VALUE");
			requestOpt.authKey = handleInfo.requestInfo.getParameter("AUTH_CODE");
			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
//				requestOpt.passKey = handleInfo.serviceInfo.getParameter("PIN");
//				requestOpt.passNewKey = handleInfo.serviceInfo.getParameter("PIN");
				requestOpt.passKey = GINI_ProtectMgr.extract("SECURE");
				requestOpt.passNewKey = GINI_ProtectMgr.extract("SECURE");
			} else {
//				requestOpt.passKey = handleInfo.serviceInfo.getParameter("PWD");
//				requestOpt.passNewKey = handleInfo.serviceInfo.getParameter("PWD");
				requestOpt.passKey = GINI_ProtectMgr.extract("NONCE");
				requestOpt.passNewKey = GINI_ProtectMgr.extract("NONCE");
			}
			
		    forge.cmp.requestCert(requestOpt, callback);
		    //초기화
		    requestOpt = 0x00;
		};
		
		var updateCertificate = function(handleInfo, change, callback){
			var cmpGate = defaultConf.System.UrlAddress['CERT_CMP_GATE1'];
			var cmpGate2 = defaultConf.System.UrlAddress['CERT_CMP_GATE2'];
			
			var requestOpt = {};
			requestOpt.reqCMD = "renew";
			requestOpt.cmp_gw_url = cmpGate;
			requestOpt.cmp_gw_url2 = cmpGate2;	
			requestOpt.caname = handleInfo.requestInfo.getParameter("CA_NAME");
			requestOpt.caip = handleInfo.requestInfo.getParameter("CA_IP");
			requestOpt.caport = handleInfo.requestInfo.getParameter("CA_PORT");
			requestOpt.signCertPem = change.certificate;
			requestOpt.signPriPem = change.privateKey;
			if(handleInfo.serviceInfo.getDeviceId() === constants.Certs.STORAGE_SECURITY_TOKEN){
				//requestOpt.passKey = change.pwd;
				//requestOpt.passNewKey = handleInfo.serviceInfo.getParameter("PIN");
				requestOpt.passKey = change.pwd;
				requestOpt.passNewKey = GINI_ProtectMgr.extract("SECURE");
				
			} else {
//				requestOpt.passKey = change.pwd;
//				requestOpt.passNewKey = handleInfo.serviceInfo.getParameter("PWD");
				requestOpt.passKey = change.pwd;
				requestOpt.passNewKey = GINI_ProtectMgr.extract("NONCE");
			}
		    var update = forge.cmp.requestCert(requestOpt, callback);
		    
		    return update;
		};
		
		return{
			parseCertAttributes : parseCertAttributes,
			certificateFromPem : certificateFromPem,
			changePassword : changePassword,
			anotherChangePassword : anotherChangePassword,
			certificateDetail : certificateDetail,
			issueCertificate : issueCertificate,
			reIssueCertificate : reIssueCertificate,
			updateCertificate : updateCertificate
			//revokeCertificate : revokeCertificate
		};
	}());
	
	/**
	 * @desc : 전자서명
	 */
	var Signature = (function() {
		
		/**
		 * @desc : pkcs1서명
		 * @param actionType : Action유형
		 * @param selectedObj : 선택된 인증서 객체
		 * @param storageType : 저장소 유형
		 * @param certId : 선택된 인증서 ID
		 * @param pwd : 개인키 비밀번호
		 * @param planText : 서명 대상
		 * @return @param vidAttr : 본인 확인 속성 ([0]Vid Random, [1]인증서)
		 * @return : Signature
		 */
		var pkcs1Sign = function(selected, nonceType, planText, vidAttr, charSet, hashAlg){
			try{
				
				var privateKey = PriKey.extractRsaPrivateKey(selected.privateKey, nonceType);
			
				// hashAlg가 정의되지 않은 경우 인증서의 서명 알고리즘을 사용 한다.
				if(!hashAlg){
					var certAttr = Certs.parseCertAttributes(selected.certificate);
					hashAlg = certAttr["HASH_ALG"];
				}
				
				var hashObj = Cipher.doDigestObj(hashAlg, planText, charSet);
				
				var sign = forge.util.encode64(privateKey.sign(hashObj));
				
				if(!utils.String.isNull(vidAttr)){
					vidAttr[constants.Login.SIGNATURE] = sign;
					// VID Random
					vidAttr[constants.Login.VID_RANDOM] = forge.util.bytesToHex(privateKey.vidRandom);
					// Certificate
					vidAttr[constants.Login.VID_CERTIFICATE] = selected.certificate;
				}
				return sign;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3005');
			}
		};
		
	
		/**
		 * @desc : pkcs7서명
		 * @param actionType : Action유형
		 * @param selectedObj : 선택된 인증서 객체
		 * @param storageType : 저장소 유형
		 * @param certId : 선택된 인증서 ID
		 * @param pwd : 개인키 비밀번호
		 * @param planText : 서명 대상
		 * @return @param vidAttr : 본인 확인 속성 ([0]Vid Random)
		 * @return : Signature
		 */
//		var pkcs7Sign = function(selected, pwd, planText, signDt, hashAlg, charSet, vidAttr){
		var pkcs7Sign = function(selected, nonceType, planText, signDt, vidAttr, optionInfo ){
			try{
				if(!optionInfo.getParameter("HASH_ALG") ){
					var certAttr = Certs.parseCertAttributes(selected.certificate);
					
					optionInfo.setParameter("HASH_ALG", certAttr["HASH_ALG"]);
				}
				var signatureHash;
				if(optionInfo.getParameter("HASH_ALG") === constants.Cipher.HASH_SHA1){
					signatureHash = forge.pki.oids.sha1;
				}else if(optionInfo.getParameter("HASH_ALG") === constants.Cipher.HASH_SHA512){
					signatureHash = forge.pki.oids.sha512;
				}else{
					signatureHash = forge.pki.oids.sha256;
				}
				
				var CONTENT_ENCODE = optionInfo.getParameter("CONTENT_ENCODE");
					
				//var privateKey = PriKey.extractRsaPrivateKey(selected.privateKey.data, pwd);
				var privateKey = PriKey.extractRsaPrivateKey(selected.privateKey, nonceType);
				
				// 서명 알고리즘
				var signAlg = forge.pki.oids.rsaEncryption;
				if(optionInfo.getParameter("RSA_PSS_SIGN")){
					signAlg = forge.pki.oids['RSASSA-PSS'];
				}
				
				// Random 추가 여부
				var unauth = [];
				if(optionInfo.getParameter("IN_VID")=="TRUE"){
					unauth = [ { type : forge.pki.oids['initech-encrypted-random'] }]
				}
				
				var p7 = forge.pkcs7.createSignedData();
				
				function encodingPlanText(textData){
					
					if(CONTENT_ENCODE.ORIGIRAL_URL_ENCODE){
						textData = decodeURIComponent(textData);
					}
					
					if(
							((CONTENT_ENCODE.ORIGIRAL_CHAR_SET === constants.System.CHARACTER_UTF8)
									|| CONTENT_ENCODE.ORIGIRAL_CHAR_SET === "UTF-8"
									)
						&& ((CONTENT_ENCODE.SIGN_CHAR_SET === constants.System.CHARACTER_EUC_KR)
								|| CONTENT_ENCODE.SIGN_CHAR_SET === "EUC-KR"
								)
						){
						// EUC-KR은 무조건 URL 인코딩이 되어야 함.(UTF8 변화는 문제가 있음)
						return unihan.convertUtf8ToEucKr(textData, false);
					}else{
						if(CONTENT_ENCODE.SIGN_URL_ENCODE){
							return encodeURIComponent(textData);
						}else{
							return textData;							
						}
					}
				};
				
				var signTextData = "";
				//planText = decodeURI(planText);
				
				if(planText.indexOf("&") > -1){
					var parse = planText.split("&");
					var len = parse.length;
					for(var i=0; i<len; i++){
						var dataVal;
						if(parse[i].indexOf("=") > -1){
							var temp = parse[i].split("=");
							dataVal = encodingPlanText(temp[0]) + "=" + encodingPlanText(temp[1]);
						}else{
							dataVal = encodingPlanText(parse[i]);
						}
						
						if( i == 0 ){
							signTextData = dataVal;
						}else{
							signTextData = signTextData + "&" + dataVal;
						}
					}
				}else{
					signTextData = encodingPlanText(planText);
				}
				
				// 전자서명 대상 원문
				p7.content = signTextData;
				
				p7.addCertificate(Certs.certificateFromPem(selected.certificate));
				p7.addSigner(
					{
						key : privateKey,
						certificate : selected.certificate,
						digestAlgorithm : signatureHash,
						authenticatedAttributes : [ 
							{
								type : forge.pki.oids.contentType,
								value : forge.pki.oids.data
							},
							{
								type : forge.pki.oids.signingTime,
								value : signDt
							},
							{
								type : forge.pki.oids.messageDigest,
								// 원문 해쉬 여부
								value : optionInfo.getParameter("CONTENT_HASH")
							}
						],
						
						/* RSASSA-PSS 추가. 없을 시 default PKCS1.5 */
						signatureAlgorithm : signAlg,
						
						/* VID Random 추가. 없을 시 VID Random 안들어감 */
						unauthenticatedAttributes : unauth
					}
				);
				p7.sign();
				
				// 서명 포맷에서 원문 제거
				if(optionInfo.getParameter("REMOVE_CONTENT")=="TRUE"){
					p7.isRemoveContentInfo = true;
				}
				
				// 인증서 제거
				if(optionInfo.getParameter("REMOVE_CERTIFICATE")=="TRUE"){
					p7.isRemoveCertificate = true;
				}				
				
				// 금결원 포멧
				if(optionInfo.getParameter("YESSIGN_TYPE")=="TRUE"){
					p7.isRemoveContext = true;
				}
				
				var pem = forge.pkcs7.messageToPem(p7);
				
				if(!utils.String.isNull(vidAttr)){
					vidAttr[constants.Login.SIGNATURE] = pem;
					// VID Random
					vidAttr[constants.Login.VID_RANDOM] = forge.util.bytesToHex(privateKey.vidRandom);
					// VID Certificate
					vidAttr[constants.Login.VID_CERTIFICATE] = selected.certificate;
				}
				
				return pem;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_3006');
			}
		};

		var Util = (function() {
			var messageFromPem = function(pem) {
				var message = forge.pkcs7.messageFromPem(pem);

				return message;
			}

			var messageToPem = function(message) {
				var pem = forge.pkcs7.messageToPem(message);

				return pem;
			}

			return{
				messageToPem : messageToPem,
				messageFromPem : messageFromPem
			}
		}());

		return{
			pkcs1Sign : pkcs1Sign,
			pkcs7Sign : pkcs7Sign,
			Util: Util
		}
	}());
	
	/**
	 * @desc : 암호화
	 */
	var Cipher = (function() {
		/**
		 * @desc : 대칭키 방식 암호화
		 * @param alg : 대칭키 알고리즘
		 * @param key : 비밀키
		 * @param iv : iv
		 * @param planText : 원문
		 * @return : 암호화 값
		 */
		var symmetricEncrypt = function(alg, key, iv, planText){
			try{
				var cipher = forge.cipher.createCipher(alg, key);
				
				cipher.start({iv: iv});
				cipher.update(planText);
				cipher.finish();

				cipher.destory();
				
				return cipher.output;
				
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4001');
			}
		};
		
		/**
		 * @desc : 대칭키 방식 복호화
		 * @param alg : 대칭키 알고리즘
		 * @param key : 비밀키
		 * @param iv : iv
		 * @param encrypted : 암호화문
		 * @return : 복호화 값
		 */
		var symmetricDecrypt = function(alg, key, iv, encrypted){
			try{
				var decipher = forge.cipher.createDecipher(alg, key);
				
				decipher.start({iv: iv});
				decipher.update(encrypted);
				decipher.finish();
	
				return decipher.output;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4002');
			}
		};
		
		
		var asymmetricCertEncrypt = function(certPem, asymAlg, hashalg, indata){
			var certificate = forge.pki.certificateFromPem(certPem);
			var publicKey = certificate.publicKey;
			
			return asymmetricEncrypt(publicKey, asymAlg, hashalg, indata);
		};
		
		var asymmetricPubKeyEncrypt = function(pubPem, asymAlg, hashalg, indata){
			
			var publicKey = forge.pki.publicKeyFromPem(pubPem);
			
			return asymmetricEncrypt(publicKey, asymAlg, hashalg, indata);
		};
		/**
		 * @desc : 비대칭키 방식 암호화
		 */
		function asymmetricEncrypt(publicKey, asymAlg, hashalg, indata){
			try{
				var hash;
				hashalg = hashalg.toLowerCase();
				if(hashalg == constants.Cipher.HASH_SHA1){
					hash = forge.md.sha1.create();
				}else if(hashalg == constants.Cipher.HASH_SHA256){
					hash = forge.md.sha256.create();
				}else if(hashalg == constants.Cipher.HASH_SHA384){
					hash = forge.md.sha384.create();
				}else if(hashalg == constants.Cipher.HASH_SHA512){
					hash = forge.md.sha512.create();
				}else if(hashalg == constants.Cipher.HASH_MD5){
					hash = forge.md.md5.create();
				}else{
					hash = forge.md.sha256.create();
				}
				
				if("RSA15" == asymAlg){
					asymAlg = "RSAES-PKCS1-V1_5";
				}else{
					asymAlg = "RSA-OAEP";					
				}
				
				var encrypted = publicKey.encrypt(indata, asymAlg, {
					md: hash,
					mgf1: {
						md: hash
					}
				});
	
				return encrypted;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4003');
			}
		};
		
		/**
		 * @desc : 비대칭키 방식 복호화
		 */
		var asymmetricDecrypt = function(b64priv, asymAlg, hashalg, ctdata, pwd){
			try{
				var hash;
				hashalg = hashalg.toLowerCase();
				if(hashalg == constants.Cipher.HASH_SHA1){
					hash = forge.md.sha1.create();
				}else if(hashalg == constants.Cipher.HASH_SHA256){
					hash = forge.md.sha256.create();
				}else if(hashalg == constants.Cipher.HASH_SHA384){
					hash = forge.md.sha384.create();
				}else if(hashalg == constants.Cipher.HASH_SHA512){
					hash = forge.md.sha512.create();
				}else if(hashalg == constants.Cipher.HASH_MD5){
					hash = forge.md.md5.create();
				}else{
					hash = forge.md.sha256.create();
				}
				
				// decode p8 from base64
				var p8Der = forge.util.binary.base64.decode(b64priv);
				var p8buf = new forge.util.ByteStringBuffer(p8Der);
	
				// get p8 as ASN.1 object
				var p8Asn1 =  forge.asn1.fromDer(p8buf);
	
				// decrypts an ASN.1 EncryptedPrivateKeyInfo
				var decprivateKeyInfo = forge.pki.decryptPrivateKeyInfo( p8Asn1, pwd);
				var pkey = forge.pki.privateKeyFromAsn1(decprivateKeyInfo);
	
				if("RSA15" == asymAlg){
					asymAlg = "RSAES-PKCS1-V1_5";
				}else{
					asymAlg = "RSA-OAEP";					
				}
				
				var decrypted = pkey.decrypt(ctdata, asymAlg, {md: hash,
					mgf1: {
						md: hash
					}
				});
	
				return decrypted;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4004');
			}
		};
		
		/**
		 * @desc : HASH Object
		 * @param alg : 알고리즘 명칭
		 * @param message : 메시지
		 * @return : digest값
		 */
		var doDigestObj = function(alg, message, charSet){
			try{
				var hash;
				alg = alg.toLowerCase();
				if(alg == constants.Cipher.HASH_SHA1){
					hash = forge.md.sha1.create();
				}else if(alg == constants.Cipher.HASH_SHA256){
					hash = forge.md.sha256.create();
				}else if(alg == constants.Cipher.HASH_SHA384){
					hash = forge.md.sha384.create();
				}else if(alg == constants.Cipher.HASH_SHA512){
					hash = forge.md.sha512.create();
				}else if(alg == constants.Cipher.HASH_MD5){
					hash = forge.md.md5.create();
				}else{
					hash = forge.md.sha256.create();
				}
				
				if(utils.String.isNull(charSet)){
					hash.update(message);	
				}else{
					hash.update(message, charSet);
				}
				
				return hash;
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4005');
			}
		};
		
		/**
		 * @desc : HASH
		 * @param alg : 알고리즘 명칭
		 * @param message : 메시지
		 * @return : digest값
		 */
		var doDigest = function(alg, message, charSet){
			try{
				var hash = doDigestObj(alg, message, charSet);
				
				return hash.digest().getBytes();
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4006');
			}
		};
		
		/**
		 * @desc : HMAC
		 * @param alg : 알고리즘
		 * @param key : HMAC 키
		 * @param message : 메시지
		 * @return : digest값
		 */
		var doMac = function(alg, key, message){
			try{
				var hmac;
				alg = alg.toLowerCase();
				if(alg == constants.Cipher.HASH_SHA1){
					hmac = forge.md.sha1.create();
				}else if(alg == constants.Cipher.HASH_SHA256){
					hmac = forge.md.sha256.create();
				}else if(alg == constants.Cipher.HASH_MD5){
					hmac = forge.md.md5.create();
				}else{
					alg = constants.Cipher.HASH_SHA256;
					hmac = forge.md.sha256.create();
				}
				
				hmac.start(alg, key);
				hmac.update(message);
				
				return hmac.digest().getBytes();
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_4007');
			}
		};
		
		return{
			symmetricEncrypt : symmetricEncrypt,
			symmetricDecrypt : symmetricDecrypt,
//			privateKeySign : privateKeySign,
//			asymmetricEncrypt : asymmetricEncrypt,
			asymmetricCertEncrypt : asymmetricCertEncrypt,
			asymmetricPubKeyEncrypt : asymmetricPubKeyEncrypt,
			asymmetricDecrypt : asymmetricDecrypt,
			doDigest : doDigest,
			doDigestObj : doDigestObj,
			doMac : doMac
		};
	}());

	var Util = (function() {

		var base64encode = function (indata) {
			try{
				return forge.util.binary.base64.encode(indata);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5001');
			}
		};

		var base64decode = function (data) {
			try{
				return forge.util.binary.base64.decode(data);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5002');
			}
		};

		var encode64 = function (data, lines) {
			try{
				return forge.util.encode64(data, lines);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5003');
			}
		};

		var decode64 = function (data) {
			try{
				return forge.util.decode64(data);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5004');
			}
		};

		var bytesToHex = function (bin){
			try{
				return forge.util.bytesToHex(bin);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5005');
			}
		};

		var hexToBytes = function (hex) {
			try{
				return forge.util.hexToBytes(hex);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5006');
			}
		};

		var createBuffer = function (data, encoding){
			try{
				return forge.util.createBuffer(data, encoding);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5007');
			}
		};
		
		var dataDestory = function(){
			forge.util.ByteStringBuffer.prototype.destory();
		};
		
		
		var getBytes = function (len){
			try{
				return forge.random.getBytes(len);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5008');
			}
		};
		
		var getRandomBytesSync = function (len){
			try{
				return forge.random.getBytesSync(len);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5009');
			}
		};

		var pemToDer = function (pem){
			return forge.pki.pemToDer(pem);
		};

		// 인증서 pem 태그 붙이기
		var certPemTagAdd = function (pemCert){
			if(pemCert.toString().indexOf('-----BEGIN CERTIFICATE-----')<0){ // pem형식으로 Tag추가
				pemCert = '-----BEGIN CERTIFICATE-----\r\n' + pemCert + '\r\n-----END CERTIFICATE-----';
			}
			return pemCert;
		};
		// 인증서 pem 태그 제거
		var certPemTagRemove = function (pemCert){
			return pemCert.toString().replace('-----BEGIN CERTIFICATE-----', '')
			.replace("-----END CERTIFICATE-----","");
		};
		// 개인키 pem 태그 붙이기
		var privateKeyPemTagAdd = function (pemPrivateKey){
			if(pemPrivateKey.toString().indexOf('-----BEGIN ENCRYPTED PRIVATE KEY-----')<0){ // pem형식으로 Tag추가
				pemPrivateKey = '-----BEGIN ENCRYPTED PRIVATE KEY-----\r\n' + pemPrivateKey + '\r\n-----END ENCRYPTED PRIVATE KEY-----';
			}
			return pemPrivateKey;
		};
		// 개인키 pem 태그 삭제
		var privateKeyPemTagRemove = function (pemPrivateKey){
			return pemPrivateKey.toString().replace('-----BEGIN ENCRYPTED PRIVATE KEY-----', '')
			.replace("-----END ENCRYPTED PRIVATE KEY-----","");
		};
		
		var rsaPublicKeyPemTagRemove = function (pemRsaPublicKey){
			return pemRsaPublicKey.toString().replace('-----BEGIN RSA PUBLIC KEY-----', '')
			.replace("-----END RSA PUBLIC KEY-----","");
		};
		
		var encodeUtf8 = function(bytes){
			try{
				return forge.util.encodeUtf8(bytes);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5003');
			}
		};

		var decodeUtf8 = function(bytes){
			try{
				return forge.util.decodeUtf8(bytes);
			}catch(e){
				new iniException.Error.newThrow(e, 'ERR_5003');
			}
		};
		
		var arrayIndexOf = function(item , taget){
			return forge.util.arrayIndexOf(item , taget);
		};

		return {
			base64encode: base64encode,
			base64decode: base64decode,
			encode64: encode64,
			decode64: decode64,
			getBytes: getBytes,
			bytesToHex: bytesToHex,
			hexToBytes: hexToBytes,
			createBuffer: createBuffer,
			getRandomBytesSync : getRandomBytesSync,
			pemToDer: pemToDer,
			certPemTagAdd : certPemTagAdd,
			certPemTagRemove : certPemTagRemove,
			privateKeyPemTagAdd : privateKeyPemTagAdd,
			privateKeyPemTagRemove : privateKeyPemTagRemove,
			rsaPublicKeyPemTagRemove : rsaPublicKeyPemTagRemove,
			encodeUtf8 : encodeUtf8,
			decodeUtf8 : decodeUtf8,
			arrayIndexOf : arrayIndexOf,
			dataDestory : dataDestory
		};
	}());
	
	return{
		PriKey : PriKey,
		Certs : Certs,
		Signature : Signature,
		Cipher : Cipher,
		Util : Util,
		KeyPair : KeyPair
	};
	
});
