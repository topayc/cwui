/*******************************************************************************
 * # Copyright(c) Initech # 설명 : # 이력 - [2015-10-01] : 최초 구현
 ******************************************************************************/
/**
 * 시스템 정보
 */
define([
        '../main/constants'
        ], function (constants) {
	
	var Browser = (function() {
		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browserName = navigator.appName;
		var fullVersion = '' + parseFloat(navigator.appVersion);
		var majorVersion = parseInt(navigator.appVersion, 10);
		var nameOffset, verOffset, ix;
		var getPlatform = navigator.platform; 

		if ((verOffset = nAgt.indexOf("OPR/")) != -1) {
			// In Opera 15+, the true version is after "OPR/"
			browserName = constants.Browser.OPERA; //"Opera";
			fullVersion = nAgt.substring(verOffset + 4);
		} else if ((verOffset = nAgt.indexOf("Opera")) != -1) {
			// In older Opera, the true version is after "Opera" or after "Version"
			browserName = constants.Browser.OPERA; //"Opera";
			fullVersion = nAgt.substring(verOffset + 6);
			if ((verOffset = nAgt.indexOf("Version")) != -1)
				fullVersion = nAgt.substring(verOffset + 8);
		} else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
			// In MSIE, the true version is after "MSIE" in userAgent
			browserName = constants.Browser.EXPLORER; //"Microsoft Internet Explorer 10이하";
			fullVersion = nAgt.substring(verOffset + 5);
		} else if ((verOffset = nAgt.indexOf("Trident")) != -1) {
			// In MSIE, the true version is after "Trident" in userAgent
			browserName = constants.Browser.EXPLORER; //"Microsoft Internet Explorer 11";
			fullVersion = "11";
		} else if ((verOffset = nAgt.indexOf("Edge")) != -1) {
			// In MSIE, the true version is after "edge" in userAgent
			browserName = constants.Browser.EXPLORER; //"Microsoft Internet Explorer 12";
			fullVersion = "12";
		} else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
			// In Chrome, the true version is after "Chrome"
			browserName = constants.Browser.CHROME; //"Chrome";
			fullVersion = nAgt.substring(verOffset + 7);
		} else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
			// In Safari, the true version is after "Safari" or after "Version"
			browserName = constants.Browser.SAFARI; //"Safari";
			fullVersion = nAgt.substring(verOffset + 7);
			if ((verOffset = nAgt.indexOf("Version")) != -1)
				fullVersion = nAgt.substring(verOffset + 8);
		} else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
			// In Firefox, the true version is after "Firefox"
			browserName = constants.Browser.FIREFOX; //"Firefox";
			fullVersion = nAgt.substring(verOffset + 8);
		} else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
			// In most other browsers, "name/version" is at the end of userAgent
			browserName = nAgt.substring(nameOffset, verOffset);
			fullVersion = nAgt.substring(verOffset + 1);
			if (browserName.toLowerCase() == browserName.toUpperCase()) {
				browserName = navigator.appName;
			}
		}
		
		// trim the fullVersion string at semicolon/space if present
		if ((ix = fullVersion.indexOf(";")) != -1)
			fullVersion = fullVersion.substring(0, ix);
		if ((ix = fullVersion.indexOf(" ")) != -1)
			fullVersion = fullVersion.substring(0, ix);

		majorVersion = parseInt('' + fullVersion, 10);
		if (isNaN(majorVersion)) {
			fullVersion = '' + parseFloat(navigator.appVersion);
			majorVersion = parseInt(navigator.appVersion, 10);
		}

		var console = window.console || {log:function(){}};
		
		var scriptEnabled = function(){
			return navigator.javaEnabled();
		}
		
		var getBrowserName = function(){
			return browserName;
		}
		
		var getMajorVersion = function(){
			return majorVersion;
		}
		
		var getOSInfo = function(){
			return osInfo;
		}
		// 모바일web인지 pc web인지 체크.
		var getWebType = function(){
			var webType = "pc";
			var mobileKeyWords = new Array('iPhone', 'iPod', 'iPad',  'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
			for (var i = 0; i < mobileKeyWords.length; i++){
			    if (nAgt.match(mobileKeyWords[i]) != null){
			        webType = "mobile";
			        break;
			    }
			}
//	        webType = "mobile";
			return webType;
		}
		
		function get_bits_system_architecture(){
		    var _to_check = [] ;
		    if ( window.navigator.cpuClass ) _to_check.push( ( window.navigator.cpuClass + "" ).toLowerCase() ) ;
		    if ( window.navigator.platform ) _to_check.push( ( window.navigator.platform + "" ).toLowerCase() ) ;
		    if ( navigator.userAgent ) _to_check.push( ( navigator.userAgent + "" ).toLowerCase() ) ;

		    var _64bits_signatures = [ "x86_64", "x86-64", "Win64", "x64;", "amd64", "AMD64", "WOW64", "x64_64", "ia64", "sparc64", "ppc64", "IRIX64" ] ;
		    var _bits = 32, _i, _c ;
		    outer_loop:
		    for( var _c = 0 ; _c < _to_check.length ; _c++ )
		    {
		        for( _i = 0 ; _i < _64bits_signatures.length ; _i++ )
		        {
		            if ( _to_check[_c].indexOf( _64bits_signatures[_i].toLowerCase() ) != -1 )
		            {
		               _bits = 64 ;
		               break outer_loop;
		            }
		        }
		    }
		    return _bits ; 
		}
		
		function is32bitsArchitecture() { return get_bits_system_architecture() == 32 ? true : false ; }
		function is64bitsArchitecture() { return get_bits_system_architecture() == 64 ? true : false ; }
	
		return {
			scriptEnabled : scriptEnabled,
			getBrowserName : getBrowserName,
			getMajorVersion : getMajorVersion,
			getPlatform : getPlatform,
			getWebType : getWebType,
			is32bitsArchitecture : is32bitsArchitecture,
			is64bitsArchitecture : is64bitsArchitecture
		};
	}());
	
	var Android = (function() {
		function getAndroidVersion() {
			var agent = window.navigator.userAgent.toLowerCase();
			var version = 0.0;
			try {
				var temp = agent.match(/android [\d+\.]{3,5}/)[0].replace('android ', '');
				version = parseFloat(temp);
			} catch (e) {
				version = 0.0
			}
			return version;
		}
		return {
			getAndroidVersion : getAndroidVersion
		}
	}());
	
	return {
		Browser : Browser,
		Android : Android
	}
});