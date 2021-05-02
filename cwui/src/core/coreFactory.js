/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * @desc : Core Factory
 */
define([
        '../core/iniCore',
        '../core/forgeCore',
        '../conf/defaultConf',
        '../main/constants',
        '../core/utils'
        ], function (iniCore, forgeCore, defaultConf, constants, utils) {
	
	var Factory;
	
	if(constants.System.CRYPTO_TYPE_INITECH === defaultConf.System.Core){
		Factory = iniCore;
	}else{
		Factory = forgeCore;
	}

	/**
	 * @desc : 암호화
	 * @param key : byte[] key
	 * @param iv : byte[] : iv
	 * @param planText : byte[] 평문 
	 * @result : byte[]암호문
	 */
	function encrypt(key, iv, planText){
		
		return Factory.Cipher.symmetricEncrypt(constants.Cipher.SYMM_AES_CBC, key, iv, planText);
	};
	
	/**
	 * @desc : 복호화
	 * @param key : byte[] key
	 * @param iv : byte[] : iv
	 * @param encrypted : byte[] 암호문; 
	 * @result : byte[]복호문
	 */
	function decrypt(key, iv, encrypted){
		
		return Factory.Cipher.symmetricDecrypt(constants.Cipher.SYMM_AES_CBC, key, iv, encrypted);
	};
	
	/**
	 * @attention : 절대 소스 변경이 되어서는 안됨
	 * @desc : 소스 정보를 바탕으로 암호화
	 * @param planText : byte[] 평문
	 * @param pwd : byte[]비밀번호
	 * @param rnd : byte[]salt용도
	 * @result : byte[] 암호문 
	 */
	var integrityEncrypt = function(planText, pwd, rnd){
		
		var material = Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, integrityEncrypt)
					+ Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, integrityDecrypt);

		if(!utils.String.isNull(pwd)){
			material = material + Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, pwd); 
		}
		
		for(var i=0; i<7; i++){

			if(!utils.String.isNull(rnd)){
				material = material + Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, rnd); 
			}
			material = Factory.Cipher.doDigest(constants.Cipher.HASH_SHA512, material);
		}
		
		var key = material.slice(0,32);
		var iv = material.slice(32,64);
		
		return encrypt(key, iv, planText);
	};
	
	/**
	 * @attention : 절대 소스 변경이 되어서는 안됨
	 * @desc : 소스 정보를 바탕으로 복호화
	 * @param encrypted : byte[] 암호문
	 * @param pwd : byte[]비밀번호
	 * @param rnd : byte[]salt용도
	 * @result : byte[] 복호문 
	 */
	var integrityDecrypt = function(encrypted, pwd, rnd){
		
		var material = Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, integrityEncrypt)
					+ Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, integrityDecrypt);
					+ Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, pwd);
					
		if(!utils.String.isNull(pwd)){
			material = material + Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, pwd); 
		}
					
		for(var i=0; i<7; i++){

			if(!utils.String.isNull(rnd)){
				material = material + Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, rnd); 
			}
			material = Factory.Cipher.doDigest(constants.Cipher.HASH_SHA512, material);
		}
		
		var key = material.slice(0,32);
		var iv = material.slice(32,64);
		
		return decrypt(key, iv, encrypted);
	};
	
	return{
		Factory : Factory,
		integrityEncrypt : integrityEncrypt,
		integrityDecrypt : integrityDecrypt
	}
});
