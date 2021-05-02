/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : NeoWeb 외부에서 오픈되는 메인 Form
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
		'../../core/iniException',
		'../../core/middleChannel',
		'../../keyStrokeSecurity/inikeyStrokeSecurityFactory'
		], function (constants, defaultConf, msgFactory, commonForm, iniException, middleChannel, keyStrokeSecurityFactory) {
	
		var mainFormPath = GINI_HTML5_BASE_PATH + "/res/form/phone/main";
	
		function getForm(formName, handleInfo){
			// formName에 따른 url을 가져온다.
			var contentUrl = getContentUrl(formName);
			if(contentUrl){
				return getMainForm(mainFormPath + contentUrl, handleInfo);
			} else {
				//alert('준비중입니다.');
				GINI_LoadingIndicatorStop();
				return "";
			}
			
		}
		
		function getContentUrl(formName){
			var contentUrl;
			switch(formName){
			case  constants.WebForm.FormId.MainForm.LoginForm:
				contentUrl = "/login/m_login_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.SignForm:
				contentUrl = "/sign/m_sign_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertImportV11Form:
				contentUrl = "/import_export/m_cert_import_v11_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertExportV11Form:
				contentUrl = "/import_export/m_cert_export_v11_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertImportV12Form:
				contentUrl = "/import_export/m_cert_import_v12_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertExportV12Form:
				contentUrl = "/import_export/m_cert_export_v12_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertManageForm:
				contentUrl = "/manage/m_manage_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertIssueForm:
				contentUrl = "/cmp/m_cert_issue_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertReIssueForm:
				contentUrl = "/cmp/m_cert_reissue_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertUpdateForm:
				contentUrl = "/cmp/m_cert_update_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertRevokeForm:
				contentUrl = "/cmp/m_cert_revoke_submit.html";
				break;
			default : 
				contentUrl = undefined;
			}
			
			return contentUrl;
		}
		
		function isPortrait(){
			var dheight = 0;
			if(INI_getPlatformInfo().iOS){
				if (window.matchMedia("(orientation: landscape)").matches) {
					//가로
					dheight = screen.width;
				} else{
					//세로
					dheight = screen.height;
				}
			}else{
				dheight = screen.height;
			}
			return dheight;
		}
		
		var getMainForm = function(contentUrl, handleInfo) {
			$.ajax({
				'url': contentUrl,
				'global' : false,
				'cache': false,
				tryCount :0
				,retryLimit :1
	     		,'error': function(xhr, status, error){
	     			this.tryCount++;
					if(this.tryCount <= this.retryLimit){
						$.ajax(this);
						return;
					}
					console.log(
							"code:"		+xhr.status+"\n"+
							"message:"	+xhr.responseText+"\n"+
							"status:"	+status+"\n"+
							"error:"	+error);
					return;	
	     		},
				'success': function success(data, textStatus, xhr) {
					
					var modalheight = isPortrait();
					
					$("#INI_mainModalDialog").removeData("GINI_handleInfo");
					$("<div class='certificate_modal' id='INI_mainModalDialog'>" + data + "</div>")
					.data("GINI_handleInfo", handleInfo).dialog({
						
						"modal": true,
						'width': '100%',
						'height' :'100%',
						'backgroundColor':'#fff',
						'top' : '0px',
						'left' : '0px',
						"resizable":false,
						"draggable":false,
						"closeOnEscape": false, //esc버튼 이벤트 막기
						"stack": false,
//						"overlay": { backgroundColor: "#FFF", opacity: 0.7 },
						"create" : function(event){
						},
						"open" : function(event, ui){
							$(".ui-dialog-titlebar").hide();
							$(".ui-dialog" ).css({"top":"0px","left":"0px"});
							$(".ui-dialog" ).css({"position":"fixed"});
							//$(".ui-dialog").css("overflow-y","auto");
							$(".ui-dialog").css("background-color","#FFFFF");
							var documentHeight = $(document).height();
//						    var dHeight = documentHeight * 0.9;
					    	$("#INI_mainModalDialog").dialog("option", "height", modalheight);
					    	keyStrokeSecurityFactory.close(handleInfo);
					    	
				        	document.body.style.overflowX = 'hidden';
					    	GINI_LoadingIndicatorStop();
				        	GINI_ProtectMgr.destroy();
				        	
					    	//닫기 이벤트 처리
					    	$(".prev").click(function(){
					    		$("#INI_mainModalDialog").dialog('close');
					    	});
					    	window.addEventListener("orientationchange", function() {
								if(INI_getPlatformInfo().iOS){
									if (window.matchMedia("(orientation: landscape)").matches) {
										var dheight = screen.width;
									
				                    	$('#INI_mainModalDialog').css("height",dheight);
									} else{
										var dheight = screen.height;
										
										$('#INI_mainModalDialog').css("height",dheight);
									}
								} else{ //안드로이드
										var dheight = screen.height;
										$('#INI_mainModalDialog').css("height",dheight);
								}
			            	},false);
						},
						"close": function (e, ui) {
							$("#INI_mainModalDialog").removeData("GINI_handleInfo");
							keyStrokeSecurityFactory.close(handleInfo);
							try{
								GINI_ProtectMgr.destroy();
								
					        	document.body.style.overflowX = 'auto';
								var parentReload = false;
								if( handleInfo.stateInfo.getResultCode() === "CERT_UPDATE" ){
									// 인증서 갱신
									handleInfo.requestInfo.getCallback()(true, handleInfo.serviceInfo);
								}else if( handleInfo.stateInfo.getResultCode() === "CONFIRM" ){
									
									// 전자서명 이면서 전자서명 옵션에 PKCS7DATA_TO_PKCS1 존재하는 경우 : PKCS1서명 수행
									var dataSignatureCallback = handleInfo.optionInfo.getParameter("PKCS7DATA_TO_PKCS1");
									if(dataSignatureCallback){
										handleInfo.optionInfo.setParameter("SIGN_KIND", "PKCS1");
										
										var pkcs7Info = handleInfo.responseInfo.getParameter();
										
										
										var orgData = dataSignatureCallback(pkcs7Info);
										
										handleInfo.requestInfo.setParameter("ORG_DATA", orgData);
										
										function addDataSignatureCallback(){
											var pkcs1Info = handleInfo.responseInfo.getParameter();
											
											var vidAttr = {};
											vidAttr.SIGNATURE = pkcs7Info.SIGNATURE;			// PKCS#7
											vidAttr.PKCS7DATA_FROM_PKCS1 = pkcs1Info.SIGNATURE;
											vidAttr.VID_CERTIFICATE = pkcs7Info.VID_CERTIFICATE;
											vidAttr.VID_RANDOM = pkcs7Info.VID_RANDOM;
											
											// 최종 인터페이스 콜백 수행
											handleInfo.requestInfo.getCallback()(true, vidAttr);
										};
										
										handleInfo.serviceInfo.setCallback(addDataSignatureCallback);
										
										middleChannel.Signature.selectedSignature(handleInfo);
									}else{
										// 최종 인터페이스 콜백 수행
										handleInfo.requestInfo.getCallback()(true, handleInfo.responseInfo.getParameter());	
									}
		                		}else{
									if(handleInfo.requestInfo.getCallback()){
										handleInfo.requestInfo.getCallback()(false);
									}
//									parentReload = true;
								}
								$("#INI_mainModalDialog").dialog('close');
								$(this).remove();
								GINI_LoadingIndicatorStop();
								if(parentReload){
									window.top.location.reload();
								}
								
								//TODO 이벤트 제거
								$("#INI_mainModalDialog").off();
								
							} catch(e){
								
							} finally{
								$(this).remove();
								GINI_LoadingIndicatorStop();
								GINI_3rd_Party_Control.initializeMobile();
							}
						}
					})
				}
			});
		}
		
	return{
		getForm : getForm
	};
	
});