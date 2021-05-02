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
		'../../keyStrokeSecurity/inikeyStrokeSecurityFactory',
		'../../front/iniController',
		], function (constants, defaultConf, msgFactory, commonForm, iniException, middleChannel, keyStrokeSecurityFactory, iniController ) {
	
		var mainFormPath = GINI_HTML5_BASE_PATH + "/res/form/pc/main/{formType}";
	
		function getForm(formName, handleInfo){
			return getDialogMainForm('', handleInfo); 
			
			/*
			// formName에 따른 url을 가져온다.
			var contentUrl = getContentUrl(formName);
			// Form의 모드를 체크(dialog, layer)
			var mainFormOpenMode = defaultConf.System.FormTypeMain;
			// Form모드에 따라 Dialog/Layer 형태를 가져옴.
			if(mainFormOpenMode === constants.System.FORM_OPEN_MODE_DIALOG){
				contentUrl = mainFormPath.replace("{formType}","dialog") + contentUrl;
				return getDialogMainForm(contentUrl, handleInfo);
			} else if(mainFormOpenMode === constants.System.FORM_OPEN_MODE_LAYER){
				contentUrl = mainFormPath.replace("{formType}","layer") + contentUrl;
				return getLayerMainForm(contentUrl, handleInfo);
			} else {
				
			}
			*/
		}
		
		function getContentUrl(formName){
			var contentUrl;
			switch(formName){
			case  constants.WebForm.FormId.MainForm.LoginForm:
				contentUrl = "/login/login_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.SignForm:
				contentUrl = "/sign/sign_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertImportV11Form:
				contentUrl = "/import_export/cert_import_v11_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertExportV11Form:
				contentUrl = "/import_export/cert_export_v11_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertImportV12Form:
				contentUrl = "/import_export/cert_import_v12_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertExportV12Form:
				contentUrl = "/import_export/cert_export_v12_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertManageForm:
				contentUrl = "/manage/cert_manage_submit.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertIssueForm:
				contentUrl = "/cmp/cert_issue.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertReIssueForm:
				contentUrl = "/cmp/cert_reissue.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertUpdateForm:
				contentUrl = "/cmp/cert_update.html";
				break;
			case  constants.WebForm.FormId.MainForm.CertRevokeForm:
				contentUrl = "/cmp/cert_revoke.html";
				break;
			default : 
				contentUrl = undefined;
			}
			
			return contentUrl;
		}
		
		var getLayerMainForm = function(contentUrl, handleInfo) {
			
//			$.ajax({
//		        'url': contentUrl,
//		        'beforeSend' : function(){
//		        	commonForm.showLoading();
//				},
//				'complete' : function(){
//					commonForm.hideLoading();
//				},
//		        'success': function success(data, textStatus, xhr) {
//		        	$("#INI_certificate_area").hide();
//		        	$("#INI_change_area").html('');
//		        	$("#INI_change_area").data("GINI_handleInfo", handleInfo);
//		        	$("#INI_change_area").append(data);
//		        	$("#INI_change_area").show();
//		        },
//			});
		};
		
		
		var getDialogMainForm = function(contentUrl, handleInfo) {
			/* 
			 * 안영철
			 * 폼 생성 및 초기화 컨트롤러 호출
			 * */
			iniController.openMainWnd(handleInfo);
			/*
			$.ajax({
				'url': contentUrl,
				'type':'GET',
				tryCount :0,
				retryLimit :1,
				'cache': false,				
				'success': function success(data, textStatus, xhr) {
					$("#INI_mainModalDialog").removeData("GINI_handleInfo");
					
					var setDiagPosition = function() {					
						if($(window).height() < 768){															
							$("#INI_mainModalDialog").position({my:"top",at:"top",of:window});
						}else{
							$("#INI_mainModalDialog").position({my:"top",at:"top+10",of:window});
						}
					};
					
					$(window).resize(setDiagPosition);
					
					$("<div class='certificate_modal' id='INI_mainModalDialog'>" + data + "</div>")
						.data("GINI_handleInfo", handleInfo).dialog({
						"autoOpen":false,
						"modal": true,
						"width": 'auto',
						//"height":'100%',
						//"position":{my:"center middle",at:"center middle",of:window},
						"resizable":false,
						"draggable":false,
						"closeOnEscape": false, //esc버튼 이벤트 막기
						"stack": false,
						"create": function(event , ui){

							$("html").css({overflow: 'hidden'});
						},
						"open" : function(event, ui){
							
							if($(window).height() < 720){
								
								$("#INI_mainModalDialog").position({my:"top",at:"top",of:"body"});
								// $("#INI_mainModalDialog").closest("div[role='dialog']").css("top","30px");
							}else{
								//[신한]
								//$("#INI_mainModalDialog").position({my:"center middle",at:"center middle",of:"body"});
								//[동부]
								$("#INI_mainModalDialog").position({my:"top",at:"top+10",of:"body"});
								// $("#INI_mainModalDialog").closest("div[role='dialog']").css("top","250px");
								//"position":{my:"center middle",at:"center middle",of:window},
							}
							
							$(".ui-dialog-titlebar").hide();
							$(this).parent().promise().done(function () {
							});
							keyStrokeSecurityFactory.close(handleInfo);
							
							var Jthis = $(this);
							var Jthiswidth = Jthis.width();
							var Jthisheight = Jthis.height();
							var documentHeight = $('#initech_certificate_wrap').height();
							if(documentHeight){
								Jthisheight = documentHeight;
							}						
							
							if(!defaultConf.System.UseIniPluginData){
								// IniPluginData 사용인 경우는 마지막 callback에서 초기화 한다.
								GINI_ProtectMgr.destroy();	
							}							

						//	if(documentHeight)
								//$("#INI_mainModalDialog").closest("div[role='dialog']").css({'top':JtopP, 'left':JleftP});

							//$("#INI_mainModalDialog").position({my:"center middle",at:"center middle",of:window});
							setDiagPosition();
						},		
						"beforeClose": function(event , ui){
									$("html").css({overflow: ''});
						},						
						"close": function (e, ui) {
							//close 원래 위치로 메인 페이지 스크롤 이동 20170322 처리
							//window.scrollTo($(window).scrollLeft(),$(window).scrollTop());
							
							$("#INI_mainModalDialog").removeData("GINI_handleInfo");
							keyStrokeSecurityFactory.close(handleInfo);
							
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
	                			var subCallback = handleInfo.requestInfo.getSubCallback();
	                			if(handleInfo.requestInfo.getSelectedSubCallback() && subCallback){
	                				if(handleInfo.requestInfo.getCallback()){
		                				handleInfo.requestInfo.getCallback()(false);
		                			}
	                				subCallback();	
	                			}else{
	                				if(handleInfo.requestInfo.getCallback()){
		                				handleInfo.requestInfo.getCallback()(false);
		                			}
	                				
	                				try{
	                					Html5Adaptor.initializeEventCheck();	
	                				}catch(e){
	                				}
	                			}
	                		}
							if(!defaultConf.System.UseIniPluginData){
								// IniPluginData 사용인 경우는 마지막 callback에서 초기화 한다.
								GINI_ProtectMgr.destroy();
							}
							
                		 	$("#INI_mainModalDialog").dialog('close');
		                	$(this).remove();
		                	//전자서명 
		                	if(handleInfo.serviceInfo.getAction() === constants.WebForm.ACTION_SIGN){
		                		INI_PLAINTEXT_VIEW_HANDLER.setPlaintextViewType(undefined);
		                	}
		                	//GINI_LoadingIndicatorStop();	// loading bar 
						}
					})
					.parent().draggable({ handle: ".title_area" });
					$("#INI_mainModalDialog").dialog('open');
				},
				'error' : function(xhr, status, error){					
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
				}
			});
			*/
		}
		
	return{
		getForm : getForm
	};
	
});
