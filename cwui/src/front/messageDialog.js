define([
	'../main/constants',
	'../conf/msgFactory',
	'../iniForm',
	], function(constants, msgFactory, iniForm){
	"use strict";
	var messageModal;
	var count = 0;
	function initialize(){}
	
	function INI_ALERT (outputMsg, msgType, popupHandler){
		if(popupHandler){
			INI_CONFIRM(outputMsg, msgType, popupHandler);
		} else {
			INI_CONFIRM(outputMsg, msgType, undefined);
		}
	}
	
	function INI_CONFIRM(outputMsg, msgType, popupHandler){
		if ($("#INI_message_modal").length > 0) {
			$("#INI_message_modal").remove();
			$("#INI_message_modal").dialog('destroy')
		}
		
		messageModal= $("<div id='INI_message_modal' style='min-height=178px !important;'>");
		
		var contentHTML; 
		if(msgType === "confirm"){
			contentHTML = 'pop_confirm_message';
			msgType = "CONF"; 
		}else {
			contentHTML = 'pop_message';
		}
		
		var view =  iniForm[contentHTML];
		var dlgOpts = {
			modal	:true,
			width:	'381px',
			height	:'auto',
			resizable:false,
			draggable:false,
			closeOnEscape:false,
			stack:	false, 
			tryCount :0,
			retryLimit :1,
			show : { effect:"puff", duration:400, complete:function() {}},
			position: { my: "center", at: "center", collision:"none" },
			open : function(event, ui){ 
				var iconNm="warn";
				switch( msgType ){
	            	case "CERT"	:	
	            		iconNm="cert"; 
	            		output_msg = msgFactory.WebForm().TEXT().CERT_MANAGE().W_T_C_M_012; 
	            		break;
	            	case "NOIT": iconNm = "notice"; break;
	            	case "CONF"	: iconNm = "confirm"; break;
	            	default: iconNm = "warn"; 
            	}
				
				$(".icon").addClass( iconNm );										                	
            	$('#close_a').attr('src',GINI_HTML5_BASE_PATH + '/res/img/btn/btn_layer_close_large.png');
            	$('#msg_area').html(outputMsg);
            	$(".ui-dialog-titlebar").hide();
            	$(".ui-dialog"	).css('overflow','visible');
            	$("#INI_message_modal").css('overflow', 'visible');             	

            	GINI_LoadingIndicatorStop();
				setViewMessage();
				setEventHandler(popupHandler,msgType);
				// initechApp.WebForm.getColorPackCss();
			},
			close : function(event, ui){
				if ($("#INI_message_modal").length > 0) {
					$(this).remove();
					$("#INI_message_modal").dialog('destroy')
				}
			}
		};
		messageModal.html(view);
		messageModal.dialog(dlgOpts);
		messageModal.dialog("open");
	}
	
	function setViewMessage(){
		/* 
		 * 얼럿 메시지창 엔터키 close 금지 , 가능하게 하려면 아래 blur 구분 주석 처리 혹은 제거 
		*/
		if ($("#btnConfirm").length > 0) {
			$("#btnConfirm").text(msgFactory.getMessageFactory().WebForm().BUTTON().W_B_001);
			$("#btnConfirm").blur();
		}
		
		if ($("#btnConfirmOK").length > 0) {
			$("#btnConfirmOK").text(msgFactory.getMessageFactory().WebForm().BUTTON().W_B_001); 
			$("#btnConfirmOK").blur();
			
		}

		if ($("#btnConfirmCancel").length > 0) {
			$("#btnConfirmCancel").text(msgFactory.getMessageFactory().WebForm().BUTTON().W_B_002);
			$("#btnConfirmCancel").blur();
		}
	}
	
	function setEventHandler(popupHandler,msgType){
		if (messageModal.find("#btnConfirm").length > 0) {
			messageModal.find("#btnConfirm").one('click', function(){
				if(popupHandler && popupHandler["OK"]) popupHandler['OK']();
				 closePopupMessage();
			});
		}
		
		if (messageModal.find("#btnConfirmOK").length > 0) {
			messageModal.find("#btnConfirmOK").one('click', function(){
				if(popupHandler && popupHandler["OK"]) popupHandler['OK']();
				 closePopupMessage();
			});
		}
		
		if (messageModal.find("#btnConfirmCancel").length > 0) {
			messageModal.find("#btnConfirmCancel").one('click', function(){
				if(popupHandler && popupHandler["CANCEL"]) popupHandler["CANCEL"]();
				 closePopupMessage();
			});
		}
		
		if (messageModal.find(".layer_close").length > 0) {
			messageModal.find(".layer_close").one('click', function(){
				closePopupMessage();
			});
		}
	}
	
	function closePopupMessage(){
		if ($('#INI_message_modal').length > 0 || $('#INI_message_modal').dialog('isOpen')){
			$('#INI_message_modal').dialog('close');
			//messageModal.dialog('close');
		}
		/*
		if ($('.certificate_password input[type="password"]').length > 0) {
			$('.certificate_password input[type="password"]').filter(':visible').eq(0).focus();
		}
		*/
	}
	
	function close(){
		closePopupMessage();
	}
	
	function getParamFromURL( varNM ){
		var results = new RegExp('[\?&]' + varNM + '=([^&#]*)').exec(window.location.href);
		if( results == null ){
			return null;
		}else{
			return results[1] || 0;
		}
	}    	
	
	var exported = {};
	exported['initialize'] = initialize;
	exported['INI_ALERT'] = INI_ALERT;
	exported['INI_CONFIRM'] = INI_CONFIRM;
	exported['close'] = close;
	return exported;
});