/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : NeoWeb 외부에서 오픈되는 메인 Inner Form
 # 이력 
  - [2016-07-15] : 최초 구현 
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
	
		var mainFormPath = GINI_HTML5_BASE_PATH + "/res/form/pc/inner/{formType}";
	
		function getForm(formName, handleInfo){
			// formName에 따른 url을 가져온다.
			var contentUrl = getContentUrl(formName);
			// Form의 모드를 체크(dialog, layer)
			var innerFormOpenMode = defaultConf.System.FormTypeMain;
			// Form모드에 따라 Dialog/Layer 형태를 가져옴.
			if(innerFormOpenMode === constants.System.FORM_OPEN_MODE_DIALOG){
				contentUrl = mainFormPath.replace("{formType}","dialog") + contentUrl;
				return getAppendInnerMainForm(contentUrl, handleInfo);
			} else if(innerFormOpenMode === constants.System.FORM_OPEN_MODE_LAYER){
				contentUrl = mainFormPath.replace("{formType}","layer") + contentUrl;
				return getLayerMainForm(contentUrl, handleInfo);
			} else {
				
			}
		}
		
		function getContentUrl(formName){
			var contentUrl;
			switch(formName){
			case  constants.WebForm.FormId.InnerForm.SignForm:
				contentUrl = "/sign/sign_inner_submit.html";
				break;
			default : 
				contentUrl = undefined;
			}
			
			return contentUrl;
		}
		
		var getAppendInnerMainForm = function(contentUrl, handleInfo) {
			
			$.ajax({
		        'url': contentUrl,
				'complete' : function(){
					//20170115
							//GINI_LoadingIndicatorStop();
				},
		        'success': function success(data, textStatus, xhr) {
		        	$("#INI_inner_area").html('');
		        	$("#INI_inner_area").removeData("GINI_handleInfo");
		        	$("#INI_inner_area").data("GINI_handleInfo", handleInfo);
		        	$("#INI_inner_area").append(data);
		        	$("#INI_inner_area").show();
		        	//20170115
							//GINI_LoadingIndicatorStop();
		        },
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
	     		}
			});
		};
		
		
	return{
		getForm : getForm
	};
	
});