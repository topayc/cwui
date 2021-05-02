/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : NeoWeb 외부에서 오픈되는 메인 SubInner Form
 # 이력 
  - [2016-07-22] : 최초 구현 
*************************************************************************************/

/**
 * @desc : Web UI
 */
//document.write('<script type="text/javascript" src="/res/script/common/jqueryui/jquery-ui.js"></script>');

define([
		'../../main/constants',
		'../../conf/defaultConf',
		'../../conf/msgFactory',
		'../../form/commonForm',
		'../../core/iniException',
		'../../core/middleChannel',
		'../../keyStrokeSecurity/inikeyStrokeSecurityFactory'
		], function (constants, defaultConf, msgFactory, commonForm, iniException, middleChannel, keyStrokeSecurityFactory) {
		
		var mainFormPath = GINI_HTML5_BASE_PATH + "/res/form/pc/inner/{formType}";
	
		function getForm(formName, handleInfo) {
			// formName에 따른 url을 가져온다.
			var contentUrl = getContentUrl(formName);
			// Form의 모드를 체크(dialog, layer)
			var innerSubFormOpenMode = defaultConf.System.FormTypeMain;
			// Form모드에 따라 Dialog/Layer 형태를 가져옴.
			if(innerSubFormOpenMode === constants.System.FORM_OPEN_MODE_DIALOG){
				contentUrl = mainFormPath.replace("{formType}","dialog") + contentUrl;
				return openInnerSubForm(contentUrl, handleInfo);
			} else {
				
			}
		}
		
		function getContentUrl(formName){
			var contentUrl;
			switch(formName){
			case  constants.WebForm.FormId.SubForm.CertDetailForm:
				contentUrl = "/cert_detail_view.html";
				break;
			default : 
				contentUrl = undefined;
			}
			
			return contentUrl;
		}
		
		var openInnerSubForm = function(contentUrl, handleInfo) {
			
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
					$("#INI_mainModalDialog").removeData("GINI_handleInfo");
					$("<div class='certificate_modal' id='INI_mainModalDialog'>" + data + "</div>").data("GINI_handleInfo", handleInfo).dialog({
						"modal": true,
						"width": 'auto',
						"height":'100%',
						"resizable":false,
						"draggable":false,
						"closeOnEscape": false, //esc버튼 이벤트 막기
						"stack": false,
						"open" : function(event, ui){
							$(".ui-dialog-titlebar").hide();
						},
						"close": function (e, ui) {
							$("#INI_mainModalDialog").removeData("GINI_handleInfo");
                		 	$("#INI_mainModalDialog").dialog('close');
		                	$(this).remove();
		                	GINI_LoadingIndicatorStop();	// loading bar 
						}
					})
					.parent().draggable({ handle: ".title_area" });
				},
			});
			
//			$.ajax({
//		        'url': contentUrl,
//					'success': function success(data, textStatus, xhr) {
//						$("<div class='certificate_modal' id='INI_mainModalDialog'>" + data + "</div>").data("GINI_handleInfo", handleInfo).dialog({
//							"modal": true,
//							"width": 'auto',
//							"height":'100%',
//							"resizable":false,
//							"draggable":false,
//							"closeOnEscape": false, //esc버튼 이벤트 막기
//							"stack": false,
//							"open" : function(event, ui){
//								aler(1);
//							},
//							"close": function (e, ui) {
//								alert(2);
//							}
//						})
//					},
//		    });
		};
		
		
	return{
		getForm : getForm
	};
	
});