/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : NeoWeb 내부에서 오픈되는 Form
 # 이력 
  - [2016-02-23] : 최초 구현 
*************************************************************************************/

/**
 * @desc : Web UI
 */
define([
		'../main/constants',
		'../conf/defaultConf',
		'../conf/msgFactory',
		'../core/iniException'
		], function (constants, defaultConf, msgFactory, iniException) {
	
		// 로딩메시지 보이기
		var showLoading = function(){
			var strHtml, strCss;
			strCss	= "position:fixed; top:50%; left:50%; width:200px; height:100px; margin-top:-50px; margin-left:-100px; text-align:center;";
			strHtml = "";
			strHtml = strHtml + "<div name='ajaxLoading' style='" + strCss + "z-index:99999'>";
			strHtml = strHtml + 	"<div style='margin:20px 0 15px 0;'>";
			strHtml = strHtml + 		"<img src='" + GINI_HTML5_BASE_PATH + "/res/img/pop/loading.gif'>";
			strHtml = strHtml + 	"</div>";
			strHtml = strHtml + "</div>";

			$("body").append(strHtml);
		};

		// 로딩메시지 숨기기
		var  hideLoading = function(){
			$("div[name='ajaxLoading']").remove();
		};
		
		var closeModal = function(){
			$(".ui-dialog-titlebar-close").trigger('click');
		};

		var checkExpireDuration = function(attr) {
			try{
				var during = defaultConf.Certs.CertExpireNoticeDate;
				var expireDt = new Date((attr[constants.Certs.ATTR_EXPIRE]).replace(/-/g, '/'));
				var differ = (expireDt.valueOf()/(24*60*60*1000)) - (new Date().valueOf()/(24*60*60*1000));
				
				if(differ < 0){
					// 만료 
					return constants.Certs.CERT_EXPIRE_STATUS_INVALID;
				}else if(differ - during < 0){
					// 만료 임박
					return constants.Certs.CERT_EXPIRE_STATUS_IMMINENT;
				}else {
					// 유효
					return constants.Certs.CERT_EXPIRE_STATUS_VALID;
				}
			}catch(e){
//				new iniException.Error.newThrow(e, 'ERR_2008', attr);
			}
		}
		
		// 인증서 발급자 치환
		var getIssuerName = function(issuerName) {
			
			if(issuerName === undefined){
				return ;
			}
			
			var retName = "";
			var certIssuerObj = msgFactory.getMessageFactory().WebForm().CERT_ATTR_ISSUER();
			switch(issuerName.toUpperCase()){
			case  constants.Certs.ISSUER_YESSIGN:
				retName = certIssuerObj.Yessign;
				break;
			case constants.Certs.ISSUER_SIGNGATE: 
				retName = certIssuerObj.SignGate;
				break;
			case constants.Certs.ISSUER_SIGNKOREA: 
				retName = certIssuerObj.SignKorea;
				break;
			case constants.Certs.ISSUER_CROSSCERT: 
				retName = certIssuerObj.CrossCert;
				break;
			case constants.Certs.ISSUER_TRADESIGN: 
				retName = certIssuerObj.TradeSign;
				break;
			case constants.Certs.ISSUER_NCA: 
				retName = certIssuerObj.NCA;
				break;
			default:
				retName = certIssuerObj.UNKNOWN;
				break;
			}
			return retName;
		}
		
		//colorPack 세팅
		var getColorPackCss = function(){
   		 	var colorPackCss = document.createElement("link");
   		    colorPackCss.rel = "stylesheet";
   		    colorPackCss.type = "text/css";
   		    colorPackCss.href = defaultConf.WebForm.ColorPackCss;
   		    document.getElementsByTagName("head")[0].appendChild(colorPackCss)
		};
		
		var getColorPackImagePath = function(){
			return defaultConf.WebForm.ColorPackImagePath;
		};
		
		//colorPack 세팅
		var getMobileColorPackCss = function(){
			var colorPackCss = document.createElement("link");
			colorPackCss.rel = "stylesheet";
			colorPackCss.type = "text/css";
			colorPackCss.href = GINI_HTML5_BASE_PATH + "/res/style/mobile/m_certificate.css";
			document.getElementsByTagName("head")[0].appendChild(colorPackCss)
		};
		
		// inner colorPack 세팅
		var getInnerColorPackCss = function(){
			var colorPackCss = document.createElement("link");
			colorPackCss.rel = "stylesheet";
			colorPackCss.type = "text/css";
			colorPackCss.href = defaultConf.WebForm.InnerColorCss;
			document.getElementsByTagName("head")[0].appendChild(colorPackCss)
		}
		
	return{
		showLoading : showLoading,
		hideLoading : hideLoading,
		closeModal : closeModal,
		checkExpireDuration : checkExpireDuration,
		getIssuerName : getIssuerName,
		getColorPackCss : getColorPackCss,
		getColorPackImagePath : getColorPackImagePath,
		getMobileColorPackCss : getMobileColorPackCss, 
		getInnerColorPackCss : getInnerColorPackCss
	};
	
});