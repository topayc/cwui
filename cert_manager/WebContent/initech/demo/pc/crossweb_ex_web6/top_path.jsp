<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<!--script type="text/javascript" src="../../../common/script/jquery-1.11.3.min.js"></script-->
<script src="/initech/demo/common/script/jquery-3.2.1.min.js"></script>
<script src="/initech/demo/common/script/jquery-migrate-3.0.0.min.js"></script>
<script>
	//idongbu 공통 변수
	var $j	=	jQuery.noConflict();
</script>
<script>
var demoRootPath = "";
//jQuery(function($j){
$j('.snb li').click(function(ev) {			
		$j('.snb li.on').removeClass('on');
		ev.preventDefault();
		$j(this).addClass('on');
		location.href = $j(this).attr('name');
	});
//});

function clearMenu() {		
	$j('.snb li.on').removeClass('on');
}

function selectMenu(idx) {
	$j('.snb li.on').removeClass('on');
	$j('li:eq(' + idx +')').addClass('on'); 
}

function emulAcceptCharset(form) {
	if (form.canHaveHTML || navigator.userAgent.match(/(edge)\/?\s*(\.?\d+(\.\d+)*)/i)) { // detect IE or Edge
        document.charset = form.acceptCharset;
    }
    return true;
}
</script>

</head>
<%!
// properties 경로
public final static String SIGN_CONF_PATH = "/home/demoserv/html5_system/crosswebex_8311/properties/INISAFESign.properties";
public final static String OCSP_CONF_PATH = "/home/demoserv/html5_system/crosswebex_8311/properties/INISAFEOCSPCD.properties";
public final static String WEB_CONF_PATH = "/home/demoserv/html5_system/crosswebex_8311/properties/IniPlugin.properties";
public final static String CRL_CONF_PATH = "/home/demoserv/html5_system/crosswebex_8311/properties/CRL.properties";
public final static String OID_CONF_PATH = "/home/demoserv/html5_system/crosswebex_8311/properties/jCERTOID.properties";


// RA 정보
public final static String raUser = "InitechDemo";
public final static String IpAdd = "dev.initech.com";
// public final static String IpAdd = "118.219.55.139";
//	public final static String IpAdd = "125.130.60.20";
public static int raPort = -1;

public final static String RA_CHARTSET = "EUC-KR";

public String caName;
public String cmpCaIp;
public String cmpCaPort;

public String userCode;
public String orgName;

public void initializeRaPort(String caCode){
	if("01".equals(caCode)){
		raPort = 4002;
		caName = "YESSIGN";
		cmpCaIp = "203.233.91.231";
		cmpCaPort = "4512";
	}else if("03".equals(caCode)){
		raPort = 4000;
		caName = "CROSSCERT";
		cmpCaIp = "211.180.234.216";
		cmpCaPort = "4502";
	}else if("04".equals(caCode)){
		raPort = 4004;
		caName = "SIGNKOREA";
		cmpCaIp = "211.175.81.101";
		cmpCaPort = "4099";
	}else if("05".equals(caCode)){
		raPort = 4005;
		caName = "SIGNGATE";
		cmpCaIp = "114.108.187.156";
		cmpCaPort = "4502";	
	}
//		if("01".equals(caCode)){
//			raPort = 4000;
//			caName = "YESSIGN";
//			cmpCaIp = "203.233.91.231";
//			cmpCaPort = "4512";
//		}else if("03".equals(caCode)){
//			raPort = 4000;
//			caName = "CROSSCERT";
//			cmpCaIp = "211.180.234.216";
//			cmpCaPort = "4502";
//		}else if("04".equals(caCode)){
//			raPort = 4200;
//			caName = "SIGNKOREA";
//			cmpCaIp = "211.175.81.101";
//			cmpCaPort = "4099";
//		}else if("05".equals(caCode)){
//			raPort = 4005;
//			caName = "SIGNGATE";
//			cmpCaIp = "114.108.187.156";
//			cmpCaPort = "4502";	
//		}
}

public void initializePolicy(String certPolicy){
	if( "01".equals(certPolicy) ) {	// 범용 개인
		userCode = "1";
		orgName = "";
	} else if( "02".equals(certPolicy) ) { // 용도 제한 기업
		userCode = "2";
		orgName = "TEST_Corp";
	} else if( "04".equals(certPolicy) ) {	// 용도 제한 개인
		userCode = "1";
		orgName = "";
	} else if( "05".equals(certPolicy) ) {	// 범용 기업
		userCode = "2";
		orgName = "TEST_Corp";
	} else if( "68".equals(certPolicy) ) {	// 전자세금계산서
		userCode = "2";
		orgName = "TEST_Corp";
	}
}

%>
</html>