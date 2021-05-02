<%@page import="javax.servlet.jsp.tagext.TryCatchFinally"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.text.SimpleDateFormat"%>
<%@ page import="java.util.Locale"%>
<%@ page import="java.util.Arrays"%>
<%@ page import="java.util.Date"%>
<%@ page import="java.util.Random"%>
<%@ page import="java.math.BigInteger"%>
<%@ page import="java.security.SecureRandom"%>

<%@ page import="com.initech.core.util.Base64Util"%>
<%@ page import="com.initech.core.crypto.INISecureRandom"%>
<%@ page import="com.initech.core.crypto.INIMessageDigest"%>
<%@ page import="com.initech.core.crypto.INIMAC"%>
<%@ page import="com.initech.core.wrapper.util.Hex"%>


<%!
	public static byte[] createDerivedHash(String hashAlg, byte[] hashVal, int loop, int derivedInt) throws Exception{
		String salt = "com.initech.hash" + derivedInt;
		
		INIMessageDigest digest = new INIMessageDigest();
		for(int i=0; i<loop; i++){
			hashVal = digest.doDigest(hashVal, hashAlg);
		}
		
		INIMAC mac = new INIMAC();
		byte[] macSalt = mac.doMac(salt.getBytes(), "HMACwith" + hashAlg, hashVal);
		byte[] merge = new byte[hashVal.length + macSalt.length];
		
		System.arraycopy(macSalt, 0, merge, 0, macSalt.length);
		System.arraycopy(hashVal, 0, merge, macSalt.length, hashVal.length);
		
		return digest.doDigest(merge, hashAlg);
	}
	
	public static byte[] createDerivedHMac(String hashAlg, byte[] macVal, int loop, int derivedInt) throws Exception{
		String salt = "com.initech.hmac" + derivedInt;
		
		INIMessageDigest digest = new INIMessageDigest();
		byte[] hmacKey = digest.doDigest(macVal, hashAlg);
		
		INIMAC mac = new INIMAC();
		for(int i=0; i<loop; i++){
			macVal = mac.doMac(macVal, "HMACwith" + hashAlg, hmacKey);
		}
		
		byte[] hashSalt = digest.doDigest(salt.getBytes(), hashAlg);
		byte[] merge = new byte[macVal.length + hashSalt.length];
		
		System.arraycopy(hashSalt, 0, merge, 0, hashSalt.length);
		System.arraycopy(macVal, 0, merge, hashSalt.length, macVal.length);
		
		return mac.doMac(merge, "HMACwith" + hashAlg, hmacKey);
	}
	
	public static byte[] createDerivedMix(byte[] hash, int loop, int derivedInt) throws Exception{
		String salt = "com.initech.html" + derivedInt;
		
		byte[] key = createDerivedHash("SHA256", hash, loop, derivedInt);
		return createDerivedHMac("SHA512", key, loop, derivedInt);
	}
	
	public static String createDerivedKey(byte[] derived, byte[] hashVal) throws Exception{
		
		byte[] create = {0, 0, 0, 0};
		byte[] responseRnd = null;	// Response Random key
		int derivedInt = 0;
		int div = 0;
		boolean loop = true;;
		INISecureRandom inisr = new INISecureRandom();
		do{
			byte[] createKey = inisr.doSecureRandom(4);
			byte[] derivedRnd = null;
			if(Arrays.equals(derived, create)){
				derivedRnd = createKey;
				responseRnd = derivedRnd;
			}else{
				derivedRnd = derived;
				responseRnd = createKey; // dummy
				loop = false;
			}
		
			derivedInt = new BigInteger(derivedRnd).intValue();
			System.out.println("derived Server Random : " + derivedInt);
			System.out.println("derived Server Random hex : " + Hex.dumpHex(derivedRnd));
			
			div = derivedInt % 255;
			switch(div){
			// derived key 생성 중단 할 경우 case 지정
			//case 0 :
			//	loop = true;
			//	break;
			default :
				loop = false;
			}
		}while(loop);
		
		int type = derivedInt % 3;
		
		byte[] key = null;
		switch((type<0 ? type*-1 : type)){
		case 0 :
			key = createDerivedHash("SHA512", hashVal, 7, derivedInt);
			break;
		case 1 :
			key = createDerivedHMac("SHA256", hashVal, 5, derivedInt);
			break;
		case 2 :
			key = createDerivedMix(hashVal, 3, derivedInt);
			break;
		}
		
		byte[] merge = new byte[key.length + responseRnd.length];
		System.arraycopy(key, 0, merge, 0, key.length);
		System.arraycopy(responseRnd, 0, merge, key.length, responseRnd.length);
		
		return Hex.dumpHex(merge);
	}
	
%><%
	String hexPost = request.getParameter("random").trim();
	System.out.println("request param : " + hexPost);
	
	byte[] derivedHash = Hex.parseHexaString(hexPost);
	System.out.println("request param length : " + derivedHash.length);
	System.out.println("request param hex : " + Hex.dumpHex(derivedHash));
	
	byte[] derived = new byte[4];
	System.arraycopy(derivedHash, 0, derived, 0, 4);
	System.out.println("derived hex : " + Hex.dumpHex(derived));
	
	byte[] hash = new byte[32];
	System.arraycopy(derivedHash, 4, hash, 0, 32);
	System.out.println("hash hex : " + Hex.dumpHex(hash));
	
	
	String resMsg = createDerivedKey(derived, hash);
	
	System.out.println("Final Derived Key : " + resMsg);
	
	out.print(resMsg);
%>
