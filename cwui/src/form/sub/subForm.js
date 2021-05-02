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
	
		var subFormPath = GINI_HTML5_BASE_PATH + "/res/form/pc/sub/{formType}";
	
		function getForm(formName, handleInfo){
			// formName에 따른 url을 가져온다.
			var contentUrl = getContentUrl(formName);
			// Form의 모드를 체크(dialog, layer)
			var subFormOpenMode = defaultConf.System.FormTypeSub;
			// Form모드에 따라 Dialog/Layer 형태를 가져옴.
			if(subFormOpenMode === constants.System.FORM_OPEN_MODE_DIALOG){
				contentUrl = subFormPath.replace("{formType}","dialog") + contentUrl;
				return getDialogSubForm(contentUrl, handleInfo);
			} else if(subFormOpenMode === constants.System.FORM_OPEN_MODE_LAYER){
				contentUrl = subFormPath.replace("{formType}","layer") + contentUrl;
				return getLayerSubForm(contentUrl, handleInfo);
			} else {
				
			}
		}
		
		function getContentUrl(formName){
			var contentUrl;
			switch(formName){
			case  constants.WebForm.FormId.SubForm.CertChangePasswordForm:
				contentUrl = "/cert_change_password.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertCopyForm:
				contentUrl = "/cert_copy.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertAnotherIssueForm: //정범교
				contentUrl = "/cert_another_issue.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertRemoveForm:
				contentUrl = "/cert_remove.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSearchEasyForm:
				contentUrl = "/cert_search_easy.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSearchManualForm:
				contentUrl = "/cert_search_manual.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSearchForm:
				contentUrl = "/cert_search.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertDetailForm:
				contentUrl = "/cert_detail_view.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertSaveDetailForm:
				contentUrl = "/cert_save_detail_view.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertExportForm:
				contentUrl = "/cert_export.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertImportV11Form:
				contentUrl = "/import_export/cert_import_v11.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertExportV11Form:
				contentUrl = "/import_export/cert_export_v11.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertImportV12Form:
				contentUrl = "/import_export/cert_import_v12.html";
				break;
			case  constants.WebForm.FormId.SubForm.CertExportV12Form:
				contentUrl = "/import_export/cert_export_v12.html";
				break;
			default : 
				contentUrl = undefined;
			}
			
			return contentUrl;
		}
		
		var getLayerSubForm = function(contentUrl, handleInfo) {
			
			$.ajax({
		        'url': contentUrl,
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
		        	$("#INI_certificate_area").hide();
		        	$("#INI_change_area").html('');
		        	$("#INI_change_area").removeData("GINI_handleInfo");
		        	$("#INI_change_area").data("GINI_handleInfo", handleInfo);
		        	$("#INI_change_area").append(data);
		        	$("#INI_change_area").show();
		        	keyStrokeSecurityFactory.close(handleInfo);
		        },
		        'complete':function(){
//[신한]		        	
//		        	if($(window).height() < 768){								
//						$("#INI_mainModalDialog").position({my:"center bottom",at:"center bottom",of:window});
//					}else{
//						$("#INI_mainModalDialog").position({my:"center middle",at:"center middle",of:window});
//					}

		        	/*// When the window height is smaller then height of CRET dialog PopUp
		        	var modalObj				= $("#INI_mainModalDialog").offset();	        	
		        	var modalHeight			= $("#INI_mainModalDialog").height();		        	
		        	var bottomYposition	= modalObj.top +modalHeight;
		        	var windowHeight		= $(window).height();
		        	
		        	if( modalHeight < windowHeight ){	        		
		        		
		        		if( windowHeight < bottomYposition ){
		        			
		        			$("#INI_mainModalDialog").position({my:"center bottom",at:"center bottom",of:window});
		        		}
		        	}else{		        		
		        		// openSubCertRemoveForm 이면 화면 그리기 후에 작아지므로 분기 처리        		
		        		if( handleInfo.serviceInfo.getBehavior() != constants.WebForm.ACTION_CERT_REMOVE ){	        		
		        			
		        			$("#INI_mainModalDialog").position({my:"center bottom",at:"center bottom",of:window});
		        		}
		        	}*/
		        }
			});
		};
		
		
		var getDialogSubForm = function(contentUrl, handleInfo) {
			
			$.ajax({
		        'url': contentUrl,
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
		        	$("#INI_subModalDialog").removeData("GINI_handleInfo");
		        	$("<div id='INI_subModalDialog'>" + data + "</div>").data("GINI_handleInfo", handleInfo).dialog({
		            	"modal": true,
		                "width": 'auto',
		                "height": 'auto',
		                "resizable":false,
		                "closeOnEscape": false,
		                "stack": false,
		                "show" :{
		                	effect:"puff",
		                    duration:400,
		                    complete:function() {
		                    }
		                },
		                "position": {
		                	my: "center",
		                	at: "center",
		                	of: window,
		                	collision: "none"
		                },
		                "create": function(event, ui){
		                    $(event.target).parent().css('position', 'fixed');
		                },
		                "open": function(event, ui){
		                	$(".ui-dialog-titlebar").hide();
		                	setSecondDialogStyle( "INI_subModalDialog" );
		                	keyStrokeSecurityFactory.close(handleInfo);
		                },
		                "close": function (e, ui) {
		                	$("#INI_subModalDialog").removeData("GINI_handleInfo");
		                	$("#INI_subModalDialog").dialog('close');
		                	keyStrokeSecurityFactory.close(handleInfo);
		                	$(this).remove();
	                	}
		            });
		        }
		    });
		};
		
		// second dialog css style
		function setSecondDialogStyle( targetId ){
            $( "#" + targetId ).parent().css({"overflow":"hidden","padding":"0px","border":"0px","background":"transparent"});
            $( "#" + targetId ).css({	"width":"100%",
            							"overflow":"hidden",
        								"padding":"0px",
        								"border":"1px solid #5072bc", 
        								"border-radius":"5px"});
		};
		
	return{
		getForm : getForm
	};
	
});