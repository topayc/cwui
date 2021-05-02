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
		'../../main/constants',
		'../../conf/defaultConf',
		'../../conf/msgFactory',
		'../../form/commonForm',
		'../../core/utils',
		'../../core/iniException',
		'../../keyStrokeSecurity/inikeyStrokeSecurityFactory'
		], function (constants, defaultConf, msgFactory, commonForm, utils, iniException, keyStrokeSecurityFactory) {
	
	
		// list(mobile)
		var drawMobileCertList = function(certAtts, handleInfo) {
			try{
				keyStrokeSecurityFactory.close(handleInfo);
				var certAttKeys = [];
				for(var certAttKey in certAtts) {
					certAttKeys.push(certAttKey);
				}
				var html = '';
				// 인증서 목록 타이틀 그리기 
				if(certAttKeys.length === 0){
					html += '<div class="no-cert">';
					html += '<span class="icon cert4">';
					html += '<img src="'+GINI_HTML5_BASE_PATH+'/res/img/mobile/common/dum_cert_icon4.png" alt="">';
					html += '</span>';
					html += '<p>' + msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_008 + '</p>';
					html += '</div>';
				}else {
					// 인증서 리스트 그리기
					html += mobileDrawCertInfoList(certAtts);
				}
				
				$("#INI_M_CERTLIST").html('');
				$("#INI_M_CERTLIST").removeData("GINI_handleInfo");
	        	$("#INI_M_CERTLIST").data("GINI_handleInfo", handleInfo);
	        	
	        	$("#INI_M_CERTLIST").append(html);
			}catch(e){
				INI_HANDLE.handleMessage(e);
			}
		};
		
		var drawMobileCertDetailInfo = function(certAttr, modalId, isDetailView){
			try{
				keyStrokeSecurityFactory.close();
				var divId = "#" + constants.WebForm.CERT_SINGLE_TABLE;
				if(modalId !== undefined){
					divId = modalId + " " + divId;	// #읖 포함한 문자열
				}

				var expireStatus = commonForm.checkExpireDuration(certAttr);
				var certExpireCss = constants.Certs.CERT_EXPIRE_CSS_VALID;
				var fontColor = constants.Certs.CERT_EXPIRE_FONT_VALID;
				var cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().VALID;
				if (expireStatus === constants.Certs.CERT_EXPIRE_STATUS_INVALID) {
					// 만료
					certExpireCss = constants.Certs.CERT_EXPIRE_CSS_INVALID;
					cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().INVALID;
					fontColor = constants.Certs.CERT_EXPIRE_FONT_INVALID;
				} else if(expireStatus === constants.Certs.CERT_EXPIRE_STATUS_IMMINENT){
					// 만료 임박
					certExpireCss = constants.Certs.CERT_EXPIRE_CSS_EXPIRE_STATUS_IMMINENT;
					cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().IMMINENT;
					fontColor = constants.Certs.CERT_EXPIRE_FONT_EXPIRE_STATUS_IMMINENT;
				}
				
				var html = '<div>';
				html += '<div class="table">';
				html += '<span>';
				html += '<span class="icon ' + certExpireCss + '">';
				html += '<img src="'+GINI_HTML5_BASE_PATH+'/res/img/mobile/common/dum_cert_icon.png" alt="' + certExpireCss + '">';
				html += '</span>';
				html += '</span>';
				html += '<dl class="cert-info">';
				html += '<dt><b>' + certAttr['SIMPLE_SUBJECT'] + '</b></dt>';
				html += '<dd class="cert-sum">';
				html += '<dl>';
				html += '<dt>'+msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_003+'</dt>';
				html += '<dd>' + commonForm.getIssuerName(certAttr['SIMPLE_ISSUER']) + '</dd>';
				html += '</dl>';
				html += '<dl>';
				html += '<dt>'+msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_004+'</dt>';
				html += '<dd>' + certAttr['SIMPLE_OIDNAME'] + '</dd>';
				html += '</dl>';
				html += '<dl class="' + fontColor + '">';
				html += '<dt>'+msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_036+'</dt>';
				html += '<dd>' + certAttr['AFTER_DT'] + '</dd>';
				html += '</dl>';
				html += '</div>';
				html += '</div>';
				
				$(divId).html('');
				$(divId).append(html);
				
				if( isDetailView != undefined && isDetailView ){
					var certDetailList = '';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_021 + '</dt><dd>' + certAttr['VERSION'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_022 + '</dt><dd>' + certAttr['SERIAL'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_023 + '</dt><dd>' + certAttr['SIGNATURE_ALG'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_024 + '</dt><dd>' + certAttr['HASH_ALG'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_025 + '</dt><dd>' + certAttr['ISSUER'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_026 + '</dt><dd>' + certAttr['BEFORE_DT'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_027 + '</dt><dd>' + certAttr['AFTER_DT'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_028 + '</dt><dd>' + certAttr['SUBJECT'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_029 + '</dt><dd>' + certAttr['AUTH_KEY_ID'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_030 + '</dt><dd>' + certAttr['SUBJECT_KEY_ID'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_031 + '</dt><dd>' + certAttr['KEY_USEAGE'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_032 + '</dt><dd>' + certAttr['CERT_POLICY'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_033 + '</dt><dd>' + certAttr['SUBJECT_ALT_NAME'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_034 + '</dt><dd>' + certAttr['CRL_DISTRIBUTION'] + '</dd></dl>';
					certDetailList += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_035 + '</dt><dd>' + certAttr['AUTH_INFO_ACCESS'] + '</dd></dl>';

					$("#INI_cert_info_list").html('');
					$("#INI_cert_info_list").html(certDetailList);					
				}
				
			}catch(e){
				INI_HANDLE.handleMessage(e);
			}
		}
		
		// 전자서명 폼 그리기
		var drawMobileSignForm = function(orgText){
			try {
				var signViewType = "";
				if(INI_PLAINTEXT_VIEW_HANDLER.getPlaintextViewType()){
					signViewType = INI_PLAINTEXT_VIEW_HANDLER.getPlaintextViewType()
				}else{
					signViewType = defaultConf.Signature.PlanTextViewType;
				}
				// 전자서명 grid style == case3  
				if(signViewType == constants.Signature.SIGN_VIEW_TEXT ){
					var html = '';
					html += '<p>';
					html += orgText; 
					html += '</p>';
	 				$('#INI_sign_plan_table_data').html('');
	 				$('#INI_sign_plan_table_data').append(html);
				} else if(signViewType == constants.Signature.SIGN_VIEW_NONE ){
					// NONE
					$('#INI_sign_plan_table_data').hide();
				} else {
					// Grid형식 표기
					var html = ''; 
					var multiData = orgText.split(defaultConf.Signature.MultiDelimiter);
					
					for(var mul=0; mul<multiData.length; mul++){
						var gridData = multiData[mul].split(defaultConf.Signature.FieldDelimiter);	// 구분자는 설정에서 \n
						var gridLen = gridData.length;
						
						if(gridLen>0){
							for (var index = 0; index < gridLen; index++) {
								var gridDataKey = gridData[index].split(defaultConf.Signature.KeyValueDelimiter)[0];
								gridDataKey = decorationTest(index, true, gridDataKey);
								var gridDataValue = gridData[index].split(defaultConf.Signature.KeyValueDelimiter)[1];
								gridDataValue = decorationTest(index, false, gridDataValue);
								
								html += '<dl>';
								if(gridDataKey == "" && gridDataValue != ""){
									html += '<dt style="width:100%;">' + gridDataValue + "</dt>";
								}else{
									html += '<dt>' + gridDataKey + "</dt>";
									html += '<dd>' + gridDataValue + "</dd>";	
								}
								html += '</dl>';
							}
							html += '<div style="width:90%; border:1px solid #efebeb; margin-left:20px;"></div>';
						}
					}
					$('#INI_sign_plan_table_data').html('');
	 				$('#INI_sign_plan_table_data').append(html);
				}
			}catch(e){
				INI_HANDLE.handleMessage(e);
			}
		};
		
		function decorationTest(idxNum, isKey, text){
			if(!text){
				return "";
			}
			text = utils.String.replaceTrim(text);
			
			var deco = defaultConf.Signature.DecorationTag;
			if(deco){
				if(utils.Collection.exist(deco.FIELD, idxNum)){
					if(isKey){
						return deco.KEY_TAG.START + text + deco.KEY_TAG.END;
					}else{
						return deco.VALUE_TAG.START + text + deco.VALUE_TAG.END;
					}
				}else{
					return text;
				}
			}else{
				return text;
			}
		};
		
		function mobileDrawCertInfoList(certAtts){
			keyStrokeSecurityFactory.close();
			var html = "";
			for(cert in certAtts){
				certAttr = certAtts[cert];
				html += '<div class="table" onclick="javascript:goDetail(\'' +cert+ '\'); return false;">';
				
				var expireStatus = commonForm.checkExpireDuration(certAttr);
				var certExpireCss = constants.Certs.CERT_EXPIRE_CSS_VALID;
				var fontColor = constants.Certs.CERT_EXPIRE_FONT_VALID;
				var cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().VALID;
				if (expireStatus === constants.Certs.CERT_EXPIRE_STATUS_INVALID) {
					// 만료
					certExpireCss = constants.Certs.CERT_EXPIRE_CSS_INVALID;
					cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().INVALID;
					fontColor = constants.Certs.CERT_EXPIRE_FONT_INVALID;
				} else if(expireStatus === constants.Certs.CERT_EXPIRE_STATUS_IMMINENT){
					// 만료 임박
					certExpireCss = constants.Certs.CERT_EXPIRE_CSS_EXPIRE_STATUS_IMMINENT;
					cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().IMMINENT;
					fontColor = constants.Certs.CERT_EXPIRE_FONT_EXPIRE_STATUS_IMMINENT;
				}
				
				// 인증서 이미지.
				html += '<span>';
				html += '<span class="icon ' + certExpireCss + '">';
				html += '<img src="'+GINI_HTML5_BASE_PATH+'/res/img/mobile/common/dum_cert_icon.png" alt="' + certExpireCss + '">';
				html += '</span>';
				html += '</span>';
				
				// 인증서 사용자명
				html += '<dl class="cert-info">';
				html += '<dt>';
				html += '<b>' + certAttr['SIMPLE_SUBJECT'] + '</b>';
//				html += '<smail><b>' + certAttr['SERIAL'] + '</b></smail>';
				html += '</dt>';
				html += '<dd class="cert-sum">';

				html += '<dl>';
				html += '<dt>'+msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_003+'</dt>';
				html += '<dd>' + commonForm.getIssuerName(certAttr['SIMPLE_ISSUER']) + '</dd>';
				html += '</dl>';
				html += '<dl>';
				html += '<dt>'+msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_004+'</dt>';
				html += '<dd>' + certAttr['SIMPLE_OIDNAME'] + '</dd>';
				html += '</dl>';
				html += '<dl class="' + fontColor + '">';
				html += '<dt>'+msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_036+'</dt>';
				html += '<dd>' + certAttr['AFTER_DT'] + '</dd>';
				html += '</dl>';
				html += '</dd>';
				html += '</dl>';
					
				html += '<a href="javascript:void(null);return false;" id=' + cert + '>';
				html += '<div class="m-ini-cert-next">';
				html += '</div>';
				html +='</a>';
				html += '</div>';
			}
			return html;
		};
		
	return{
		drawMobileCertList : drawMobileCertList,
		drawMobileCertDetailInfo : drawMobileCertDetailInfo,
		drawMobileSignForm : drawMobileSignForm
	};
	
});