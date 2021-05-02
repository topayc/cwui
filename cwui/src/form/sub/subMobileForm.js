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
		'../../core/iniException',
		'../../keyStrokeSecurity/inikeyStrokeSecurityFactory'
		], function (constants, defaultConf, msgFactory, commonForm, iniException, keyStrokeSecurityFactory) {
	
		var subFormPath = GINI_HTML5_BASE_PATH + "/res/form/phone/sub";
	
		function getForm(formName, handleInfo, dialogId){
			// formName에 따른 url을 가져온다.
			var contentUrl = getContentUrl(formName);
			return getSubForm(subFormPath + contentUrl, handleInfo, dialogId);
		}
		
		function getContentUrl(formName){
			var contentUrl;
			switch(formName){
			case  constants.WebForm.FormId.SubForm.CertChangePasswordForm:
				contentUrl = "/m_cert_change_password.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertCopyForm:
//				contentUrl = "/m_cert_copy.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertManageForm:
				contentUrl = "/m_cert_manage_view.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSearchEasyForm:
				contentUrl = "/search/m_cert_search_easy.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSearchManualForm:
				contentUrl = "/search/m_cert_search_manual.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSearchForm:
				contentUrl = "/search/m_cert_search.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertDetailForm:
				contentUrl = "/m_cert_detail_view.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSaveDetailForm:
				contentUrl = "/m_cert_save_detail_view.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertDetailViewForm:
				contentUrl = "/m_cert_manage_detail_view.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertExportForm:
//				contentUrl = "/m_cert_export.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertImportV11Form:
				contentUrl = "/import_export/m_cert_import_v11.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertExportV11Form:
				contentUrl = "/import_export/m_cert_export_v11.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertImportV12Form:
				contentUrl = "/import_export/m_cert_import_v12.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertExportV12Form:
				contentUrl = "/import_export/m_cert_export_v12.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertIssueForm:
				contentUrl = "/cmp/m_cert_issue.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertReIssueForm:
				contentUrl = "/cmp/m_cert_issue.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertUpdateForm:
				contentUrl = "/cmp/m_cert_issue.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertRevokeForm:
				contentUrl = "/cmp/m_cert_revoke.html";
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
		
		var getSubForm = function(contentUrl, handleInfo, dialogId) {
			
			var modalId = "INI_subModalDialog";
			var modal3thId = "INI_ModalDialog_03";
			var modal4thId = "INI_ModalDialog_04";
			if(dialogId != undefined){
				modalId = dialogId;
			}
			
			$.ajax({
		        'url': contentUrl,
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
		        	var submodalheight = isPortrait();
		        	$("#"+modalId).removeData("GINI_handleInfo");
		        	$("<div id='" + modalId + "'>" + data + "</div>")
		        		.data("GINI_handleInfo", handleInfo).dialog({
		        		"autoOpen":false,
		            	"modal": true,
		                "width": '100%',
		                "height": submodalheight,
		                "resizable":false,
		                "closeOnEscape": false, 
		                "top" :'0px',
		                "stack": false,
		                "create": function(event, ui){
		                    $(event.target).parent().css('position', 'fixed');
		                },
		                "open": function(event, ui){
		                	$(".ui-dialog-titlebar").hide();
		                	setSecondDialogStyle( modalId );
		                	keyStrokeSecurityFactory.close(handleInfo);
		                	
		                	window.addEventListener("orientationchange", function() {
								if(INI_getPlatformInfo().iOS){
									if (window.matchMedia("(orientation: landscape)").matches) {
										var dheight = screen.width;
									
				                    	$('#INI_subModalDialog').css("height",dheight);
				                    	if($(document).find('#'+modal3thId)){
				                    		
				                    		$('#'+modal3thId).css("height",dheight);
				                    	}
				                    	if($(document).find('#'+modal4thId)){
				                    		
				                    		$('#'+modal4thId).css("height",dheight);
				                    	}
									} else{
										var dheight = screen.height;
										
										$('#INI_subModalDialog').css("height",dheight);
										if($(document).find('#'+modal3thId)){
				                    		
				                    		$('#'+modal3thId).css("height",dheight);
				                    	}
				                    	if($(document).find('#'+modal4thId)){
				                    		
				                    		$('#'+modal4thId).css("height",dheight);
				                    	}
									}
								} else{ //안드로이드
										var dheight = screen.height;
										$('#INI_subModalDialog').css("height",dheight);
										if($(document).find('#'+modal3thId)){
				                    		
				                    		$('#'+modal3thId).css("height",dheight);
				                    	}
				                    	if($(document).find('#'+modal4thId)){
				                    		
				                    		$('#'+modal4thId).css("height",dheight);
				                    	}
								}
			            	},false);
		                },
		                "close": function (e, ui) {
		                	 $(e.target).dialog("destroy");
		                	 $("#"+modalId).removeData("GINI_handleInfo");
		                	 keyStrokeSecurityFactory.close(handleInfo);
		            	} 
		            });
		        	$("#" + modalId).dialog('open');
		        }
		    });
			
		};
		
		// second dialog css style
		function setSecondDialogStyle( targetId ){
			var submodalheight = isPortrait();
			/*$("#" + targetId).parent().css({
									"padding" :"0px",
									"border" :"0px",
									"height":submodalheight,
    								"top":"0px",
									"background" : "#fff"
								});*/
            $( "#" + targetId ).css({	"width":"100%",
        								"padding":"0px",
        								"height":submodalheight
        								});
            
		};
		
	return{
		getForm : getForm
	};
	
});