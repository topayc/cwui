/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : WEB UI
 # 이력
  - [2015-10-01] : 최초 구현
*************************************************************************************/
define([
		'../main/constants',
    '../main/system',
		'../conf/defaultConf',
		'../conf/msgFactory',
		'../core/utils',
    '../form/commonForm',
		'../form/main/mainForm',
		'../form/main/mainMobileForm',
		'../form/sub/subForm',
		'../form/sub/subMobileForm',
		'../form/draw/drawMobileForm',
		'../form/main/innerForm',
		'../form/sub/subInnerForm',
		'../core/iniException',
		'../keyStrokeSecurity/inikeyStrokeSecurityFactory'
		], function (constants, system, defaultConf, msgFactory, utils, commonForm, mainForm, mainMobileForm, subForm, subMobileForm, drawMobileForm, innerForm, subInnerForm, iniException, keyStrokeSecurityFactory) {

		/** 공통으로 사용되는 Form */
		var CommonForm = function() {
			return commonForm;
		}

		/** 외부에서 오픈되어지는 Form */
		var MainForm = function(formName, handleInfo) {
			if(INI_getPlatformInfo().Mobile){
				return mainMobileForm.getForm(formName, handleInfo);
			} else {
				return mainForm.getForm(formName, handleInfo);
			}
		};

		/** 외부에서 오픈되어지는 inner Form */
		var InnerForm = function(formName, handleInfo){
			return innerForm.getForm(formName, handleInfo);
		}

		/** innerform 용 subform */
		var SubInnerForm = function(formName, handleInfo){
			return subInnerForm.getForm(formName, handleInfo);
		}

		/** NeoWeb 내부에서 오픈되어지는 Form */
		var SubForm = function(formName, handleInfo) {
			return subForm.getForm(formName, handleInfo);
		};

		/** 동적으로 그리는 Form */
		var DrawForm = (function() {

			/*************************************************************************************
			 # 함수 명 : openStorageList
			 # 설명 : POPUP형태의 스토리지 목록 그리기(복사클릭시 나오는 화면)
			*************************************************************************************/
			var openStorageList = function(handleInfo){
				var contentUrl = GINI_HTML5_BASE_PATH + "/res/form/pc/common/drawform/destination_storage_select.html";
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
			        	$("<div id='INI_drawDialog'>" + data + "</div>").data("GINI_handleInfo", handleInfo).dialog({
			        		"autoOpen":false,
			            	"modal": true,
			                "width": '490px',
			                "height": 'auto',
			                "resizable":false,
			                "closeOnEscape": false, //esc버튼 이벤트 막기
			                "stack": false,
			                "create": function(event, ui){
			                    $(event.target).parent().css('position', 'fixed');
			                },
			                "open": function(event, ui){
			                	$(".ui-dialog-titlebar").hide();
			                	$(".ui-dialog").css('overflow','visible');
//			                	$("#INI_drawDialog").css('overflow', 'visible');
			                	keyStrokeSecurityFactory.close(handleInfo);
			                },
			                "close": function (e, ui) {
			                	$(this).remove();
			                	keyStrokeSecurityFactory.close(handleInfo);
		                	}
			            });
			        	$("#INI_drawDialog").dialog('open');
			        }
			    });

			}

			/*************************************************************************************
			 # 함수 명 : openAnotherStorageList
			 # 설명 : POPUP형태의 스토리지 목록 그리기(복사클릭시 나오는 화면)
			 # 정범교
			*************************************************************************************/
			var openAnotherStorageList = function(handleInfo){
				var contentUrl = GINI_HTML5_BASE_PATH + "/res/form/pc/common/drawform/destination_storage_select_another.html";
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
			        	$("<div id='INI_drawDialog'>" + data + "</div>").data("GINI_handleInfo", handleInfo).dialog({
			        		"autoOpen":false,
			            	"modal": true,
			                "width": '490px',
			                "height": 'auto',
			                "resizable":false,
			                "closeOnEscape": false, //esc버튼 이벤트 막기
			                "stack": false,
			                "create": function(event, ui){
			                    $(event.target).parent().css('position', 'fixed');
			                },
			                "open": function(event, ui){
			                	$(".ui-dialog-titlebar").hide();
			                	$(".ui-dialog").css('overflow','visible');
			                	keyStrokeSecurityFactory.close(handleInfo);
			                },
			                "close": function (e, ui) {
			                	$(this).remove();
			                	keyStrokeSecurityFactory.close(handleInfo);
		                	}
			            });
			        	$("#INI_drawDialog").dialog('open');
			        }
			    });

			}

			/*************************************************************************************
			 # 함수 명 : drawStorageList
			 # 설명 : 스토리지 목록 그리기
			  스토리지의 경우 OS, Action에 따라 보여주는 형식이 다르다.
			 # params
			 	storageList : 그려질 스토로지 목록
			 	view_id : 스토리지목록이 그려질 div id
			 	action : 현재 실행하고 있는 창의 행위
			 	isFilterCache : isFilterCache값이 있다면 해당 스토리지에 체크 표시를 해준다.
			*************************************************************************************/
			var drawStorageList = function(storageList, view_id, action, isFilterCache) {

				var html = '<ul class="media_list">';
				for(storage in storageList){
					var extendCss = " media_extension";
					// conf에서 읽어 들인 내용으로 화면을 세팅함.
					if(storage && storage!='undefined'){
						utils.Log.debug('-Storage Type : ' + storage);

						var attrList = storageList[storage];

						extendCss = attrList.STORAGE_ID == constants.Certs.STORAGE_EXTEND ? extendCss : "";

						// 스토리지 목록 사용가능 여부 판단하여 그리기
						var isDisabled = attrList.DISABLE || isFilterCache ? " data_disabled" : "";
						if(isDisabled == ""){
							// OS체크
							isDisabled = checkOS(storageList[storage].OS);
						}
						if(isDisabled == ""){
							// ACTION 체크
							var allowActions = storageList[storage].ALLOW_ACTION;
							if(allowActions){
								isDisabled = " data_disabled";
								for(var actionCount=0; actionCount < allowActions.length; actionCount++ ){
									if(allowActions[actionCount] === "ALL" || allowActions[actionCount] === action){
										isDisabled = "";
										break;
									}
								}
							}
						}

						if(attrList.DISABLE || isDisabled == " data_disabled"){
							html += '<li class="list_data data_disabled' + extendCss + '">';
							html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '"></span>' + attrList.DESC_TEXT[defaultConf.System.Language];
							html += '</li>';
						}else{
							html += '<li class="list_data' + isDisabled + extendCss + '">';
							html += '<a href="javascript:void(null);">';
							html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '"></span>' + attrList.DESC_TEXT[defaultConf.System.Language];
							html += '</a>';

							if(attrList.SUB_TYPE == "CS"){
								html += '<div class="drive_select" id="' + attrList.CLASS_ID + '-drive" style="display:none;">';
								html += '</div>';
							}

							html += '</li>';
						}
					}
				}

				html += '</ul>';
				$('#' + view_id).html("");
				$('#' + view_id).append(html);
			};

			/*************************************************************************************
			 # 함수 명 : drawTargetStorageList
			 # 설명 : 인증서 복사 > 대상 타겟 선택시 사용
			 # params
			 	storageList : 그려질 스토로지 목록
			 	view_id : 스토리지목록이 그려질 div id
			 	action : 현재 실행하고 있는 창의 행위
			 	isFilterCache : isFilterCache값이 있다면 해당 스토리지에 체크 표시를 해준다.
			 	disableDevice : 인증서 추가저장시 먼저 발급받은 디바이스에 대한 비활성화   작성자 : 정범교
			*************************************************************************************/
			var drawTargetStorageList = function(storageList, view_id, action, isFilterCache, disableDevice) {

				var html = '<ul class="save_media_list">';

				for(storage in storageList){
					var extendCss = " save_media_extension";
					// conf에서 읽어 들인 내용으로 화면을 세팅함.
					if(storage && storage!='undefined'){
						utils.Log.debug('-Storage Type : ' + storage);

						var attrList = storageList[storage];
						extendCss = attrList.STORAGE_ID == constants.Certs.STORAGE_EXTEND ? extendCss : "";

						var isDisabled = checkOS(storageList[storage].OS);
						if(isDisabled == ""){
							isDisabled = checkAllowAction(storageList[storage].ALLOW_ACTION, action);
						}

						//추가 저장시 먼저 발급받은 디바이스에 대한 비활성화 정범교
						if(disableDevice == storage){
							isDisabled = " data_disabled";
						}

						if(attrList.DISABLE || isDisabled == " data_disabled"){
							html += '<li class="save_media data_disabled' + extendCss + '">';
							html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '"></span>' + attrList.DESC_TEXT[defaultConf.System.Language];
							html += '</li>';
						}else{
							html += '<li class="save_media ' + isDisabled + extendCss + '">';
							html += '<a href="javascript:void(null);">';
							html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '"></span>' + attrList.DESC_TEXT[defaultConf.System.Language];
							html += '</a>';

							if(attrList.SUB_TYPE == "CS"){
								html += '<div class="save_drive_select" id="' + attrList.CLASS_ID + '-drive" style="display:none;">';
								html += '</div>';
							}

							html += '</li>';
						}
					}
				}

				html += '</ul>';
				$('#' + view_id).html("");
				$('#' + view_id).append(html);
			};

			/*************************************************************************************
			 # 함수 명 : drawStorageSubList
			 # 설명 : 스토리지에 서브 목록이 있을때 그리기.
			 # params
			 	storageSubList : 그려질 스토로지 서브 목록
			 	targetParentNode : 그려질 스토리지 서브 목록의 부모노드.
			*************************************************************************************/
			var drawStorageSubList = function(storageSubList, targetParentNode){
				var deviceId = "";
				var html = "";
				html += '<ul>';
				html += '<a style="position:absolute; right:-90%" class="drive_select_close_btn close_btn2" id="closeId">';
				html += '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn/btn_layer_close.png" alt="'+msgFactory.getMessageFactory().WebForm().ALT().W_ALT_001+'" /></a>';
				var storageLength = 0;

				for(storage in storageSubList){

					var attrList = storageSubList[storage];
					deviceId =  decodeURIComponent(attrList.DEVICE_ID);
					if(constants.Certs.STORAGE_SECURITY_TOKEN === deviceId){
						//USIM 목록 표시 처리. 옵션에 따라 USIM목록 표시여부 결정.
						if((decodeURIComponent(attrList.DEVICE_SUB)).indexOf("USIM") > -1){
							if(!defaultConf.WebForm.isDisplayHSMwithUSIM()){
								continue;
							}
						}
						//token 설치 여부에 따라 install popup을 띄워 줌.
						if(attrList.DEVICE_INSTALL === "FALSE"){
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list" onclick="javascript:INI_DOWNLOAD_CONFIRM(\''+msgFactory.getMessageFactory().Info["INFO_1012"]+'\', \'' + decodeURIComponent(attrList.DEVICE_DOWNLOAD_URL) + '\')"; return false;">';
						} else {
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
						}
						html += decodeURIComponent(attrList.DEVICE_NAME);
					} else {
						if(constants.Certs.STORAGE_USB === decodeURIComponent(attrList.DEVICE_ID)){
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
							html += decodeURIComponent(attrList.DEVICE_NAME) + "(" + decodeURIComponent(attrList.DEVICE_SUB) + ")";
						} else {
							if(attrList.DEVICE_INSTALL === "FALSE"){
								html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list" onclick="javascript:INI_DOWNLOAD_CONFIRM(\''+msgFactory.getMessageFactory().Info["INFO_1012_1"]+'\', \'' + decodeURIComponent(attrList.DEVICE_DOWNLOAD_URL) + '\')"; return false;">';
							} else {
								html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
							}
							if(attrList.DEVICE_NAME === "INFOVINE"){
								html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_029;//html += "휴대폰 인증서 저장(유비키)";
							} else if(attrList.DEVICE_NAME === "MOBISIGN"){
								html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_030;//html += "휴대폰 인증서 저장(금융결제원)";
							} else {
								html += decodeURIComponent(attrList.DEVICE_NAME);
							}

						}
					}
					html += '</a></li>';

					storageLength++;
				}
				if( storageLength == 0 ){

					html +="<li>"+msgFactory.getMessageFactory().Error["ERR_1010"]+"</li>";
				}
				html += '</ul>';
				html += '<i class="arr"></i>';
				
				// append 할 위치
			    var ds = $(targetParentNode).parents().siblings('div.drive_select');
				ds.html("");
				ds.append(html);
				
				//서브 매체 리스트 닫기
				ds.find('.drive_select_close_btn').on('click', function(){
					ds.parent().removeClass('open').find('.check').remove();;
				    $('.extension_media_list .list_data').removeClass('list_select').find('.check').remove();
				    $('.drive_select').hide();
				    $(".extension_layer").hide();
				    //return false;
				});
			}

			/*************************************************************************************
			 # 함수 명 : drawStorageTargetSubList
			 # 설명 : 복사 스토리지에 서브 목록이 있을때 그리기.
			 # params
			 	storageSubList : 그려질 스토로지 서브 목록
			 	targetParentNode : 그려질 스토리지 서브 목록의 부모노드.
			*************************************************************************************/
			var drawStorageTargetSubList = function(storageSubList, targetParentNode){

				var deviceId = "";
				var storageLength = 0; 
				var html = "";
				html += '<ul>';
				
				for(storage in storageSubList){
					var attrList = storageSubList[storage];
					deviceId =  decodeURIComponent(attrList.DEVICE_ID);
					if(constants.Certs.STORAGE_SECURITY_TOKEN === deviceId){
						//USIM 목록 표시 처리.
						if((decodeURIComponent(attrList.DEVICE_SUB)).indexOf("USIM") > -1){
							if(!defaultConf.WebForm.isDisplayHSMwithUSIM()){
								continue;
							}
						}

						//token 설치 여부에 따라 install popup을 띄워 줌.
						html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
						if(attrList.DEVICE_INSTALL === "FALSE"){
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list" onclick="javascript:INI_DOWNLOAD_CONFIRM(\''+msgFactory.getMessageFactory().Info["INFO_1012"]+'\', \'' + decodeURIComponent(attrList.DEVICE_DOWNLOAD_URL) + '\')" return false;">';
						} else {
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
						}
						html += decodeURIComponent(attrList.DEVICE_NAME);
					} else {
						if(constants.Certs.STORAGE_USB === decodeURIComponent(attrList.DEVICE_ID)){
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
							html += decodeURIComponent(attrList.DEVICE_NAME) + "(" + decodeURIComponent(attrList.DEVICE_SUB) + ")";
						} else {
							if(attrList.DEVICE_INSTALL === "FALSE"){
								html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '" installed=false><a href="javascript:void(null);" name="ini_sub_list" onclick="javascript:INI_DOWNLOAD_CONFIRM(\''+msgFactory.getMessageFactory().Info["INFO_1012_1"]+'\', \'' + decodeURIComponent(attrList.DEVICE_DOWNLOAD_URL) + '\')"; return false;">';
							} else {
								html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '" installed=true><a href="javascript:void(null);" name="ini_sub_list">';
							}
							if(attrList.DEVICE_NAME === "INFOVINE"){
								html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_029;//html += "휴대폰 인증서 저장(유비키)";
							} else if(attrList.DEVICE_NAME === "MOBISIGN"){
								html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_030;//html += "휴대폰 인증서 저장(금융결제원)";
							} else {
								html += decodeURIComponent(attrList.DEVICE_NAME);
							}

						}
					}
					html += '</a></li>';
					storageLength++;
				}
				if( storageLength == 0 ){
			          html +="<li>"+msgFactory.getMessageFactory().Error["ERR_1010"]+"</li>";
			    }
				
				html += '</ul>';
				html += '<i class="arr"></i>';

				// append 할 위치
			    var ds = $(targetParentNode).parents().siblings('div.save_drive_select');	// 인증서 복사시 사용하는 레이어 창
				ds.html("");
				ds.append(html);
			}

			/*************************************************************************************
			 # 함수 명 : drawStorageExtList
			 # 설명 : 확장매체 그리기
		  	 # params
			 	storageExtList : 그려질 확장매체 리스트.
			 	view_id : 확장매체가 그려질 곳의 div id
			 	action : 현재 창에서 하고 있는 행위
			*************************************************************************************/
			var drawStorageExtList = function(storageExtList, view_id, action){

				var html = '<div class="extension_layer" id="extension_layer" style="display:none;">';
					html += '<a href="javascript:void(null);" class="close_btn" id="closeId">';
					html += '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn/btn_layer_close.png" alt="'+msgFactory.getMessageFactory().WebForm().ALT().W_ALT_001+'" /></a>';
					html += '<ul class="extension_media_list">';

				for(storage in storageExtList){
					var isDisabled = storageExtList[storage].DISABLE ? " data_disabled" : "";
					if(isDisabled == ""){
						isDisabled = checkOS(storageExtList[storage].OS);
						if(isDisabled == ""){
							isDisabled = checkAllowAction(storageExtList[storage].ALLOW_ACTION, action);
						}
					}
					var attrList = storageExtList[storage];
					html += '<li class="list_data' +  isDisabled + '">';
					if(!attrList.DISABLE && isDisabled == ""){
						html += '<a href="javascript:void(null);">';
					}
					html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '" ></span>';
					html += attrList.DESC_TEXT[defaultConf.System.Language];
					if(!attrList.DISABLE && isDisabled == ""){
						html += '</a>';
					}

					if(attrList.SUB_TYPE == "CS"){
						html += '<div class="drive_select" id="' + attrList.CLASS_ID + '-drive" style="display:none;">';
						html += '</div>';
					}

					html += '</li>';
				}
				html += '</ul>';
				html += '<i class="arr"></i>';

				$('#' + view_id).html("");
				$('#' + view_id).append(html);

				// 확장매체 닫기
				$('#' + view_id+" .close_btn	").on('click', function () {

				    $('.media_extension').removeClass('open').find('.check').remove();;
				    $('.extension_media_list .list_data').removeClass('list_select').find('.check').remove();
				    $('.drive_select').hide();
				    $(".extension_layer").hide();
				    //return false;
				});
			}

			/*************************************************************************************
			 # 함수 명 : drawTargetStorageExtList
			 # 설명 : 복사 확장매체 그리기
		  	 # params
			 	storageExtList : 그려질 확장매체 리스트.
			 	view_id : 확장매체가 그려질 곳의 div id
			 	action : 현재 창에서 하고 있는 행위
			*************************************************************************************/
			var drawTargetStorageExtList = function(storageExtList, view_id, action){

				var html = '<div class="save_extension_layer" id="extension_layer" style="display:none;">';
					html += '<a href="javascript:void(null);" class="close_btn" id="closeId">';
					html += '<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn/btn_layer_close.png" alt="" /></a>';
					html += '<ul class="extension_save_media_list">';

				for(storage in storageExtList){
					var isDisabled = storageExtList[storage].DISABLE ? " data_disabled" : "";
					if(isDisabled == ""){
						isDisabled = checkOS(storageExtList[storage].OS);
						if(isDisabled == ""){
							isDisabled = checkAllowAction(storageExtList[storage].ALLOW_ACTION, action);
						}
					}

					var attrList = storageExtList[storage];
					html += '<li class="save_media' +  isDisabled + '">';
					if(!attrList.DISABLE && isDisabled == ""){
						html += '<a href="javascript:void(null);">';
					}
					html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '" ></span>';
					html += attrList.DESC_TEXT[defaultConf.System.Language];
					if(!attrList.DISABLE && isDisabled == ""){
						html += '</a>';
					}

					if(attrList.SUB_TYPE == "CS"){
						html += '<div class="save_drive_select" id="' + attrList.CLASS_ID + '-drive" style="display:none;">';
						html += '</div>';
					}

					html += '</li>';
				}
				html += '</ul>';
				html += '<i class="arr"></i>';


				$('#' + view_id).html("");
				$('#' + view_id).append(html);

				// 확장매체 닫기
				$('#' + view_id+" .close_btn").on('click', function () {

				    $('.media_extension').removeClass('open').find('.check').remove();;
				    $('.extension_media_list .list_data').removeClass('list_select').find('.check').remove();
				    $('.drive_select').hide();
				    $(".extension_layer").hide();
				    return false;
				});
			}

			// pc 목록 타이틀 정범교SORT
			function drawCertTitle() {

				var html = "";
				var position = defaultConf.Certs.CertAttrPosition;
				var iter = utils.Collection.iterator(position);

				var idArr = defaultConf.Certs.CertAttrPositionId; //정범교SORT
				var idArrIndex = 0;//정범교SORT

				while(iter.hasNext()){
					var field = iter.next();
					html += '<th width="'+msgFactory.getMessageFactory().WebForm().CERT_ATTR_WIDTH()[field]+'" onclick="certGridSolt(\''+idArr[idArrIndex]+'\',\''+idArr+'\');" id="INI_sort_th_'+idArr[idArrIndex]+'">'
					+ msgFactory.getMessageFactory().WebForm().CERT_ATTR_FIELD()[field]
					+ '<span class="num_num_click" id="INI_sort_span_'+idArr[idArrIndex]+'">' //정범교SORT
					+ '<img width="8" src="' + GINI_HTML5_BASE_PATH + '/res/img/icon/btn_grid_sort_cancel.png" >'//정범교SORT
					+ '</span>'//정범교SORT
					+ '</th>';
					idArrIndex++;//정범교SORT
				}

				return "<thead><tr>" + html + "</tr></thead>";
			}

			/*************************************************************************************
			 # 함수 명 : drawCertInfoList
			 # 설명 : 인증서 상세정보 중 리스트 정보 그리기
			 # params
			 	certAtts : 인증서 속성정보 리스트.
			*************************************************************************************/
			function drawCertInfoList(certAtts){

				var position = defaultConf.Certs.CertAttrPosition;
				var html = "";
				for(cert in certAtts){
					attrList = certAtts[cert];
					html += '<tr id=' + cert + ' class="data">';
					var i=0;
					for (var positionInt = 0; positionInt < position.length; positionInt++){
						if (i == 0) {
							var expireStatus = commonForm.checkExpireDuration(attrList);
							var certExpireCss = constants.Certs.CERT_EXPIRE_CSS_VALID;
							var cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().VALID;
							if (expireStatus === constants.Certs.CERT_EXPIRE_STATUS_INVALID) {
								// 만료
								certExpireCss = constants.Certs.CERT_EXPIRE_CSS_INVALID;
								cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().INVALID;
							} else if(expireStatus === constants.Certs.CERT_EXPIRE_STATUS_IMMINENT){
								// 만료 임박
								certExpireCss = constants.Certs.CERT_EXPIRE_CSS_EXPIRE_STATUS_IMMINENT;
								cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().IMMINENT;
							}
							html += '<td>';
							html += '<span class="ico ' + certExpireCss + '">';
							html += cerExpireCssDesc;
							html += '</span>';
							html += '<span>';
							if(position[i] == "OID_NAME" && !attrList[position[i]]){
								html += msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_040;
							}else{
								html += attrList[position[i]];
							}

							html += '</span>';
							html += '</td>';
						} else {
							// Status값과 처음 속성 값을 제외한 값을 세팅.
							if(position[positionInt] === constants.Certs.ATTR_ISSUER){
								attrList[position[i]] = commonForm.getIssuerName(attrList[position[i]]);
							}
							html += '<td><a href="javascript:void(null);"><span>' + attrList[position[i]] + '</span></a></td>';
						}
						i++;
					}
					html += '</tr>'
				}
				return '<tbody>' +  html + '</tbody>';
			}

			/*************************************************************************************
			 # 함수 명 : drawCertList
			 # 설명 : 인증서 ㄹ스트 그리기.
			 # params
			 	certAtts : 인증서 속성정보 리스트.
			 	deviceId : 인증서 리스트가 존재하는 스토리지 id
			*************************************************************************************/
			var drawCertList = function(certAtts, deviceId) {
				try{
					/* 키패드 초기화 작업 개별 액션에서 수행,으로 변경 주석처리*/
					//	keyStrokeSecurityFactory.close();
					var certAttKeys = [];
					for(var certAttKey in certAtts) {
						certAttKeys.push(certAttKey);
					}

					var html = "";
					// 인증서 목록 타이틀 thead
					html += drawCertTitle();
					//caption 추가
					html += "<caption>"+msgFactory.getMessageFactory().WebForm().CAPTION().W_CAPTION_001+"</caption>";

					// tbody
					if(deviceId === constants.Certs.STORAGE_USIM){
//						html += "<tr class='no_data'>";
//						html += "<td colspan='4' attr='zerolist'>";
//						html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_010;
//						html +="</td>";
						html += "<tr class='no_data'>";
						html += "<td colspan='4' attr='zerolist'>";
						html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_007;
						html +="<br/>";
						html += "<font style='font-weight:normal !important;'>&#40"
											+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_023
									+"</font>";
						html +="<br/>";
						html += "<font style='font-size:12px;color:#FF6600;'>"
										+"<img src='"+GINI_HTML5_BASE_PATH
										+ "/res/img/icon/certificate_find.png' style='height:20px; width:20px;'>"
										+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_024
									+"</font>";
						html += "<font style='font-weight:normal !important;'>"
										+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_025
									+"&#41</font>";
						html +="</td>";
					 } else if(certAttKeys.length === 0){
					 	html += "<tr class='no_data'>";
						html += "<td colspan='4' attr='zerolist' style='line-height: 13px; padding-top: 8px;  background-color: #e5ecff; padding-bottom: 12px;'>";
						html += "<p style='padding-bottom: 3px;'><b>"+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_007+"</b></p>";
						html += "<p style='font-weight:normal !important;padding-bottom: 7px;'>("
											+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_023
									+"</p>";
						html += "<p style='font-size:12px;color:#FF6600;padding-bottom: 5px;'>"
										+"<img src='"+GINI_HTML5_BASE_PATH
										+ "/res/img/icon/certificate_find.png' style='height:20px; width:20px;'>"
										+"<span style='font-weight:normal !important;'>"+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_024
										+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_025
									+")</span>"
									+"</p>";
						html += "<p style='padding-bottom: 3px;'><b>"
										+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_031
									+"</b></p>"
									+"<p style='font-weight:normal !important;'>"
										+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_032
									+"</p>";
						html +="</td>";
					} else {
						// 인증서 리스트 그리기
						html += drawCertInfoList(certAtts);
					}

					$("#INI_change_area").hide();
					$("#" + constants.WebForm.CERT_TABLE).html("");
					$("#" + constants.WebForm.CERT_TABLE).append(html);
					$("#INI_certificate_area").show();

					// GINI_selectedCertificateRow은 index row + 1값
					// 목록 소트를 위해 th 를 thead 로 분류 하면서 tbody 1번째가 인증서로 변경 되면서 +1 을 해 줄 필요가 없어 짐
					var selected = GINI_selectedCertificateRow;
					//var targetTr = $('#INI_certificate_area #INI_certList tbody > tr:nth-child('+ selected +')');
					//$('.certificate_list_area table tr').not($(targetTr).addClass('active')).removeClass('active');
					//targetTr.parents('.table_wrap').addClass('cert_selected');
					
					setTimeout(function() {
						$('#INI_certificate_area #INI_certList tbody > tr:nth-child('+ selected +')').trigger('click');
			
					},10);
				

					//$('#INI_certificate_area #INI_certList tbody > tr:nth-child('+ selected +')').trigger('click')
					//$('.confirm_btn_area').find('fieldset').show();

					// In MSIE, the true version is after "MSIE" in userAgent
					var rv = -1; // Return value assumes failure.
					if (navigator.userAgent.indexOf("MSIE") != -1) {
						var ua = navigator.userAgent;
			        	var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			        	if (re.exec(ua) != null){
			        		rv = parseFloat(RegExp.$1);
			        	}
			        	if(rv !== 8){
			        		$("#INI_certList").colResizable({
								liveDrag:true,
								draggingClass:"dragging",
								headerOnly: true,
								partialRefresh: true
							});
			        	}
			        } else {
			        	$("#INI_certList").colResizable({
							liveDrag:true,
							draggingClass:"dragging",
							headerOnly: true,
							partialRefresh: true
						});
			        }


//					if(GINI_certificateListSortStatus.length <= 0){
//						$("#INI_certList").tablesorter();
//					} else {
//						$("#INI_certList").tablesorter();
//					}

					$("#INI_certList").on("sortEnd", function(event) {
						// prints the current sort order to the console
						GINI_certificateListSortStatus = event.target.config.sortList;
					});
					
				
					// Height 720 이하에서는 비밀번호 포커스 주지 않음.
					//if($(window).height() > 720){
						//$('#INI_userPw').focus();
					//}
					
					/*fixed table header*/
					if ($('.table_wrap').height() <   100) {
						$('#INI_certList').fixedThead({ row: 1, height: '83' });
					}else {
						$('#INI_certList').fixedThead({ row: 1, height: '136' });
					}
					$('#INI_certList').parent().css({'overflow-y' : 'auto'});
					$('#INI_certList').parent().css({'overflow-x' : 'hidden'});
					
					/* 리스트를 생성한 후 사용자 콜백 호출*/
					if (deviceId['serviceInfo'] && deviceId.serviceInfo.getParameter("DRAW_CERT_LIST_CALLBACK")) {
						deviceId.serviceInfo.getParameter("DRAW_CERT_LIST_CALLBACK")();
					}
				}finally{
					/*
					 * 기존 아래의 코드로 인하여, 브라우저폭이 특정 폭에서 강제로 위치가 아래로 조정되며, 추가된 코드가 적용되지 않음
					 * 일단 기존 코드라 주석 처리함  
					if($(window).height() < 768){
						$("#INI_mainModalDialog").position({my:"center bottom",at:"center bottom",of:window});
					}
					*/
					/*else{
						$("#INI_mainModalDialog").position({my:"center middle",at:"center middle",of:window});
					}*/

					GINI_LoadingIndicatorStop();
				}
			}

			/*************************************************************************************
			 # 함수 명 : drawCertDetail
			 # 설명 : 인증서 상세정보 그리기.
			 # params
			 	certAtts : 인증서 속성정보 리스트.
			*************************************************************************************/
			var drawCertDetail = function( certAttr ) {

				var certSummary = "";

				// 발급대상 , 발급자, 구분, 유효기간
				certSummary += '<div class="summary" id="INI_cert_single">';
				certSummary += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_002 + '</dt>';
				certSummary += '<dd><b><em>' + certAttr['SIMPLE_SUBJECT'] + '</em></b></dd></dl>';
				certSummary += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_003 + '</dt>';
				certSummary += '<dd>' + commonForm.getIssuerName(certAttr['SIMPLE_ISSUER']) + '</dd></dl>';
				if(certAttr['SIMPLE_OIDNAME']){
					certSummary += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_004 + '</dt>';
					certSummary += '<dd>' + certAttr['SIMPLE_OIDNAME'] + '</dd></dl>';
				}
				certSummary += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_005 + '</dt>';
				certSummary += '<dd>' + certAttr['BEFORE_DT'] + " ~ "+ certAttr['AFTER_DT'] + '</dd></dl>';
				certSummary += '</div>';

				var html = '';
				html += '<dt class="title">'+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_016+'</dt>';
				html += '<dd  style="height:222px;">';
				html += certSummary;
				html += '<div class="info_more">';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_021 + '</dt><dd>' + certAttr['VERSION'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_022 + '</dt><dd>' + certAttr['SERIAL'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_023 + '</dt><dd>' + certAttr['SIGNATURE_ALG'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_024 + '</dt><dd>' + certAttr['HASH_ALG'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_025 + '</dt><dd>' + certAttr['ISSUER'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_026 + '</dt><dd>' + certAttr['BEFORE_DT'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_027 + '</dt><dd>' + certAttr['AFTER_DT'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_028 + '</dt><dd>' + certAttr['SUBJECT'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_029 + '</dt><dd>' + certAttr['AUTH_KEY_ID'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_030 + '</dt><dd>' + certAttr['SUBJECT_KEY_ID'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_031 + '</dt><dd>' + certAttr['KEY_USEAGE'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_032 + '</dt><dd>' + certAttr['CERT_POLICY'] + '</dd></dl>';
				if(certAttr['SUBJECT_ALT_NAME']){
					html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_033 + '</dt><dd>' + certAttr['SUBJECT_ALT_NAME'] + '</dd></dl>';
				}
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_034 + '</dt><dd>' + certAttr['CRL_DISTRIBUTION'] + '</dd></dl>';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_035 + '</dt><dd>' + certAttr['AUTH_INFO_ACCESS'] + '</dd></dl>';
				html += '</div>';
				html += '</dd>';

				$("#" + constants.WebForm.CERT_DETAIL_TABLE_LIST).html('');
				$("#" + constants.WebForm.CERT_DETAIL_TABLE_LIST).append(html);
			};

			/*************************************************************************************
			 # 함수 명 : drawCertAttrDetail
			 # 설명 : 인증서 상세 속성 정보 그리기.
			 # params
			 	certAtts : 인증서 속성정보 리스트.
			*************************************************************************************/
			var drawCertAttrDetail = function( certAttr ) {

				var html = '';
				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_002 + '</dt>';
				html += '<dd><b><em>' + certAttr['SUBJECT'] + '</em></b></dd></dl>';

				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_003 + '</dt>';
				html += '<dd>' + commonForm.getIssuerName(certAttr['ISSUER']) + '</dd></dl>';

				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_004 + '</dt>';
				if(!certAttr['OID_NAME']){
					html += '<dd>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_040 + '</dd></dl>';
				}else{
					html += '<dd>' + certAttr['OID_NAME'] + '</dd></dl>';
				}

				html += '<dl><dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_005 + '</dt>';
				html += '<dd>' + certAttr['BEFORE_DT'] + " ~ "+ certAttr['AFTER_DT'] + '</dd>';
				html += '</dl>';

				$("#" + constants.WebForm.CERT_SINGLE_TABLE).html('');
				$("#" + constants.WebForm.CERT_SINGLE_TABLE).append(html);
			};

			/*************************************************************************************
			 # 함수 명 : drawCertDetailFileName
			 # 설명 : p12파일의 인증서가 암호화 되어 있을 경우 파일 이름으로 대체한다.
			 # params
			 	fileName : 대체될 p12파일 이름
			*************************************************************************************/
			var drawCertDetailFileName = function(fileName){
				$("#INI_cert_single").hide();
				$("#INI_cert_single_p12").html( "<p>" + fileName + "</p>");
				$("#INI_cert_single_p12").show();
			}

			/*************************************************************************************
			 # 함수 명 : drawLogo
			 # 설명 : 로고 그리기
			 # params
			 	logoUrl : 그려질 로고의 url 정보
			*************************************************************************************/
			var drawLogo = function(logoUrl){

				if(logoUrl!=undefined){
					var html = "";
					html += "<img src='";
					html += GINI_HTML5_BASE_PATH  + logoUrl;
					html += "' />";
					$("#INI_modal_logo").html(html);
				}
			};

			/*************************************************************************************
			 # 함수 명 : decorationTest
			 # 설명 : 전자서명창 원문 그리드 표시시 tag 붙이기.(신한은행 요건.)
			 # params
			 	idxNum : 필드의 위치
			 	isKey : key, value 형태에서 어느것인지
			 	text : tag 안에 들어갈 text
			*************************************************************************************/
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

			/*************************************************************************************
			 # 함수 명 : drawSignForm
			 # 설명 : 전자서명창 원문 그리기
			 # params
			 	orgText : 원문
			*************************************************************************************/
			var drawSignForm = function(orgText){
				var signViewType = "";
				if(INI_PLAINTEXT_VIEW_HANDLER.getPlaintextViewType()){
					signViewType = INI_PLAINTEXT_VIEW_HANDLER.getPlaintextViewType();
				}else{
					signViewType = defaultConf.Signature.PlanTextViewType;
				}

				// Grid
				var drawGrid = function() {
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
							html += '<div style="width:90%; border:1px solid #efebeb; margin-left:20px; margin-top:5px; margin-bottom:5px;"></div>';
						}
					}
	 				$('#INI_sign_plan_table_data').html('');
	 				$('#INI_sign_plan_table_data').append(html);
				};

				// 전자서명 grid style == case3
				if(signViewType == constants.Signature.SIGN_VIEW_TEXT ){
					// 원문그대로 표시
					var html = '';
					html += '<p>';
					html += orgText;
					html += '</p>';
	 				$('#INI_sign_plan_table_data').html('');
	 				$('#INI_sign_plan_table_data').append(html);

				} else if (signViewType == constants.Signature.SIGN_VIEW_GRID) {
					drawGrid();
				} else if (signViewType == constants.Signature.SIGN_VIEW_PAGE) {
					// PAGE형식 표기
					var html = '';
					var multiData = orgText.split(defaultConf.Signature.MultiDelimiter);

					// 다건일 경우 처리
					if ( multiData.length > 1 )
					{
						$('#certificate_signature_area').attr("class", "certificate_signature_area_all");
						$('#INI_sign_plan_table_data').attr("class", "signiture_info_all");
						$('#INI_sign_plan_table_data').css("height", "134px");

						html += '<div class="certificate_signature_area_num" id="certificate_signature_area_num">';
						html +=		'<div class="pagenate">';
						html +=			'<a class="dir prev2nd" id="backward_btn"></a>';
						html +=			'<a class="dir prev1st" id="prev_btn"></a>';
						html +=			'<div class="num_btn_area" id="data_num_btn_area" unselectable="on" onselectstart="return false;" onmousedown="return false;">';

						for(var mul=0; mul<multiData.length; mul++){

							var gridData = multiData[mul].split(defaultConf.Signature.FieldDelimiter);	// 구분자는 설정에서 \n
							var gridLen = gridData.length;
							var contHtml = '';

							contHtml += '<div class="eachData" id="eachData_' + (mul+1) + '"';

							if ( 0 === mul ) {
								contHtml += ' style="display:block"';
							}

							contHtml +='">';

							if ( 0<gridLen ) {
								for ( var index = 0; index < gridLen; index++ ) {

									var gridDataKey = gridData[index].split(defaultConf.Signature.KeyValueDelimiter)[0];
									gridDataKey = decorationTest(index, true, gridDataKey);
									var gridDataValue = gridData[index].split(defaultConf.Signature.KeyValueDelimiter)[1];
									gridDataValue = decorationTest(index, false, gridDataValue);

									contHtml += '<dl>';

									if(gridDataKey == "" && gridDataValue != ""){
										if ( 0 === index ) {
											contHtml += '<dt style="width:90%;">' + gridDataValue + "</dt>";
										} else {
											contHtml += '<dt style="width:100%;">' + gridDataValue + "</dt>";
										}
									}else{
										contHtml += '<dt>' + gridDataKey + "</dt>";

										if ( 0 === index ) {
											contHtml += '<dd style="width:50%;">' + gridDataValue + "</dd>";
										} else {
											contHtml += '<dd>' + gridDataValue + "</dd>";
										}
									}

									if ( 0 === index ) {
										contHtml += '<showPageNum style="width:10%;text-align:right;">' + (mul+1) + ' / ' + multiData.length + '</showPageNum>';
									}

									contHtml += '</dl>';
								}

								contHtml += '<div style="width:90%; border:1px solid #efebeb; margin-left:20px; margin-top:5px; margin-bottom:5px;"></div>';
							}

							contHtml += '</div>';

							$('#INI_sign_plan_table_data').append(contHtml);

							if ( mul < 10 ) {
								html += '<a class="dir num" id="num_btn_' + (mul+1) + '">' + (mul+1) + '</a>';
							} else {
								html += '<a class="dir num" id="num_btn_' + (mul+1) + '" style="display:none">' + (mul+1) + '</a>';
							}
						}

						html +=			'</div>';
						html +=			'<a class="dir next1st" id="next_btn"></a>';
						html +=			'<a class="dir next2nd" id="forward_btn"></a>';
						html +=		'</div>';
						html += '</div>';

						$('#certificate_signature_area').after(html);
						$('.pagenate').attr("maxNum", multiData.length);

						// 숫자버튼 이벤트 처리
						$('.dir.num').click(function(){

							var id=$(this).attr("id");
							var dataDivId = 'eachData_' + id.substring(8,id.length);

							$('.eachData').hide();
							$('#' + dataDivId).show();

							$('.dir.num').removeClass("clicked");
							$("#"+id).addClass("clicked");

							$('.pagenate').attr("currentNum", id.substring(8,id.length));
						});

						// 다음 버튼 이벤트 처리
						$('#next_btn').click(function(){

							var nextNum = parseInt($('.pagenate').attr("currentNum"))+1;

							if ( nextNum > $('.pagenate').attr("maxNum"))
								return;

							if ( false === $('#num_btn_' + nextNum ).is(":visible") ) {
								showNextPageNumList(nextNum);
							} else {
								$('#num_btn_' + nextNum ).click();
							}
						});

						// 이전 버튼 이벤트 처리
						$('#prev_btn').click(function(){

							var prevNum = parseInt($('.pagenate').attr("currentNum"))-1;

							if ( 0 === prevNum )
								return;

							if ( false === $('#num_btn_' + prevNum ).is(":visible") ) {
								showPrevPageNumList(prevNum);
							} else {
								$('#num_btn_' + prevNum ).click();
							}
						});

						// 다음, 이전버튼 더블클릭 방지(더블클릭시 텍스트 선택되는 문제 방지)
						$('#next_btn, #prev_btn').dblclick(function(e){

							e.stopPropagation();
							e.preventDefault();
							return false;
						});

						// 다음 번호 리스트 버튼 이벤트 처리
						$('#forward_btn').click(function(){

							showNextPageNumList();
						});

						// 이전 번호 리스트 버튼 이벤트 처리
						$('#backward_btn').click(function(){

							showPrevPageNumList();
						});

						var showNextPageNumList = function(clickNum) {
							var nextPageStartNum = (parseInt(($('.pagenate').attr("currentNum")-1)/10)+1)*10+1;

							if ( nextPageStartNum > $('.pagenate').attr("maxNum") )
								return;

							$('.dir.num').each(function(index) {
								if (nextPageStartNum <= $(this).text() && $(this).text() < nextPageStartNum+10)
								{
									$(this).show();
								} else {
									$(this).hide();
								}
							});

							if ( 'undefined' !== clickNum && $.isNumeric(clickNum) ) {
								$('#num_btn_' + clickNum).click();
							} else {
								$('#num_btn_' + nextPageStartNum).click();
							}
						};

						var showPrevPageNumList = function(clickNum) {
							var prevPageStartNum = (parseInt(($('.pagenate').attr("currentNum")-1)/10)-1)*10+1;

							if ( 0 > prevPageStartNum )
								return;

							$('.dir.num').each(function(index) {
								if (prevPageStartNum <= $(this).text() && $(this).text() < prevPageStartNum+10)
								{
									$(this).show();
								} else {
									$(this).hide();
								}
							});

							if ( 'undefined' !== clickNum && $.isNumeric(clickNum) ) {
								$('#num_btn_' + clickNum).click();
							} else {
								$('#num_btn_' + prevPageStartNum).click();
							}
						};

						// 초기 선택값
						$('#num_btn_1').click();

					} else {
						drawGrid();
					}
				} else if(signViewType == constants.Signature.SIGN_VIEW_NONE ){
					// NONE
					$('#certificate_signature_area').hide();
				} else {
					// NONE
					$('#certificate_signature_area').hide();
				}
			};

			/*************************************************************************************
			 # 함수 명 : drawCustomBanner
			 # 설명 : 커스텀 배너 그리기
			 # params
			 	view_id : 그려질 배너의 div id
			 	customBannerUrl : 가져올 배녀의 url
			*************************************************************************************/
			var drawCustomBanner = function(view_id, customBannerUrl){
				$.ajax({
			        'url': customBannerUrl,
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
						$("#INI_banner_close").html('<img src="' + GINI_HTML5_BASE_PATH + '/res/img/btn/btn_close_w.png" alt="" />');
						$("#INI_banner_close").show();
			        	$("#"+view_id).html(data);
			        }
				});
			};

			return {
				openStorageList : openStorageList,
				openAnotherStorageList : openAnotherStorageList,
				drawStorageList : drawStorageList,
				drawTargetStorageList : drawTargetStorageList,
				drawStorageSubList : drawStorageSubList,
				drawStorageTargetSubList : drawStorageTargetSubList,
				drawStorageExtList : drawStorageExtList,
				drawTargetStorageExtList : drawTargetStorageExtList,
				drawCertList : drawCertList,
				drawLogo : drawLogo,
				drawCertDetail : drawCertDetail,
				drawCertAttrDetail : drawCertAttrDetail,
				drawCertDetailFileName : drawCertDetailFileName,
				drawSignForm : drawSignForm,
				drawCustomBanner : drawCustomBanner
			};
		}());

		/*************************************************************************************
		 # 함수 명 : MobileSubForm
		 # 설명 : 모바일 서브 폼 그리기
		*************************************************************************************/
		var MobileSubForm = function(formName, handleInfo, dialogId) {
			return subMobileForm.getForm(formName, handleInfo, dialogId);
		}

		/*************************************************************************************
		 # 함수 명 : MobileDrawForm
		 # 설명 : 모바일 동적 폼 그리기
		*************************************************************************************/
		var MobileDrawForm = drawMobileForm;

		/*************************************************************************************
		 # 함수 명 : InnerDrawForm
		 # 설명 : INNER form 그리기(사용X)
		*************************************************************************************/
		var InnerDrawForm = (function() {
			// 매체
			var drawStorageList = function(storageList, view_id, action, isFilterCache) {

				var isSeleted = null;
				var html = '<ul>';
				for(storage in storageList){

					// conf에서 읽어 들인 내용으로 화면을 세팅함.
					if(storage && storage!='undefined'){
						utils.Log.debug('-Storage Type : ' + storage);

						var attrList = storageList[storage];
						var isDisabled = attrList.DISABLE || isFilterCache ? " data_disabled" : "";

						if(isDisabled == ""){
							isDisabled = checkOS(storageExtList[storage].OS);
							if(isDisabled == ""){
								isDisabled = checkAllowAction(storageExtList[storage].ALLOW_ACTION, action);
							}
						}

						html += '<li class="one_depth" id=' + attrList.CLASS_ID + ' ' +  isDisabled + '">';
						if(!attrList.DISABLE && isDisabled == ""){
							html += '<a href="javascript:void(null);">';
						}
						html += '<span class="icon ' + attrList.CLASS_ID + '" id="' + attrList.STORAGE_ID + '" ></span>';
						html += '		<img src="'+GINI_HTML5_BASE_PATH+'/res/img/inner/icon/' + attrList.CLASS_ID + '.png" alt="" />';
						html += attrList.DESC_TEXT[defaultConf.System.Language];
						if(!attrList.DISABLE && isDisabled == ""){
							html += '</a>';
						}
						html += '</li>';

						if(attrList.SUB_TYPE != "NONE"){
							if(attrList.SUB_TYPE == "CS"){
								html += '<div class="disk_drive" id="' + attrList.CLASS_ID + '_drive"></div>';
							}
						}
//						else{
//							html += '	<a href="#' + attrList.CLASS_ID + '"' + ' class="select" id="' + attrList.STORAGE_ID + '">';
//							html += '		<img src="'+GINI_HTML5_BASE_PATH+'/res/img/inner/icon/' + attrList.CLASS_ID + '.png" alt="" />';
//							html += attrList.DESC_TEXT[defaultConf.System.Language];
//							html += '	</a>';
//						}
						html += '</li>';
					}
				}

				html += '</ul>';
				$('#' + view_id).html("");
				$('#' + view_id).append(html);
			};

			var drawStorageSubList = function(storageSubList){
				var deviceId = "";
				var html = "";
				html += '<ul>';

				var storageLength = 0;

				for(storage in storageSubList){
					var attrList = storageSubList[storage];
					deviceId =  decodeURIComponent(attrList.DEVICE_ID);
					if(constants.Certs.STORAGE_SECURITY_TOKEN === deviceId){
						//USIM 목록 표시 처리.
						if((decodeURIComponent(attrList.DEVICE_SUB)).indexOf("USIM") > -1){
							if(!defaultConf.WebForm.isDisplayHSMwithUSIM()){
								continue;
							}
						}

						//token 설치 여부에 따라 install popup을 띄워 줌.
						html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
						if(attrList.DEVICE_INSTALL === "FALSE"){
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list" onclick="javascript:INI_DOWNLOAD_CONFIRM(\''+msgFactory.getMessageFactory().Info["INFO_1012"]+'\', \'' + decodeURIComponent(attrList.DEVICE_DOWNLOAD_URL) + '\')" return false;">';
						} else {
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
						}
						html += decodeURIComponent(attrList.DEVICE_NAME);
					} else {
						if(constants.Certs.STORAGE_USB === decodeURIComponent(attrList.DEVICE_ID)){
							html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
							html += decodeURIComponent(attrList.DEVICE_NAME) + "(" + decodeURIComponent(attrList.DEVICE_SUB) + ")";
						} else {
							if(attrList.DEVICE_INSTALL === "FALSE"){
								html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list" onclick="javascript:INI_DOWNLOAD_CONFIRM(\''+msgFactory.getMessageFactory().Info["INFO_1012_1"]+'\', \'' + decodeURIComponent(attrList.DEVICE_DOWNLOAD_URL) + '\')"; return false;">';
							} else {
								html += '<li id="' + decodeURIComponent(attrList.DEVICE_SUB) + '"><a href="javascript:void(null);" name="ini_sub_list">';
							}
							if(attrList.DEVICE_NAME === "INFOVINE"){
								html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_029;//html += "휴대폰 인증서 저장(유비키)";
							} else if(attrList.DEVICE_NAME === "MOBISIGN"){
								html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_030;//html += "휴대폰 인증서 저장(금융결제원)";
							} else {
								html += decodeURIComponent(attrList.DEVICE_NAME);
							}

						}
					}
					html += '</a></li>';
					storageLength++;
				}
				if( storageLength == 0 ){

					html +="<li>"+msgFactory.getMessageFactory().Error["ERR_1010"]+"</li>";
				}
				html += '</ul>';

				// append 할 위치
				var view_id = $('#' + deviceId ).parent('li').find('div').attr("id");
				$('#' + view_id).html("");
				$('#' + view_id).append(html);
			}

			// 인증서 목록(inner)
			var drawCertList = function(certAtts, deviceId) {
				try{
					keyStrokeSecurityFactory.close();
					var certAttKeys = [];
					for(var certAttKey in certAtts) {
						certAttKeys.push(certAttKey);
					}

					var html = "";
					// 인증서 목록 thead 그리기
					html += '<div class="certificate_data" id="Hard_Disk_Area"><table>';
					html += drawCertTitle();

					if(deviceId === constants.Certs.STORAGE_USIM){
//						html += "<td colspan='4' attr='zerolist'>";
//						html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_010;
//						html +="</td>";
						html += "<td colspan='4' attr='zerolist'>";
						html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_007;
						html +="</td>";
					 } else if(certAttKeys.length === 0){
						html += "<td colspan='4' attr='zerolist'>";
						html += msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_007;
						html +="</td>";
					} else {
						// 인증서 리스트 그리기
						html += drawCertInfoList(certAtts);
					}

					$("#" + constants.WebForm.CERT_TABLE).html("");
					$("#" + constants.WebForm.CERT_TABLE).append(html);
					$("#INI_certificate_area").show();
					$('.confirm_btn_area').find('fieldset').show();

					// In MSIE, the true version is after "MSIE" in userAgent
					var rv = -1; // Return value assumes failure.
					if (navigator.userAgent.indexOf("MSIE") != -1) {
						var ua = navigator.userAgent;
			        	var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			        	if (re.exec(ua) != null){
			        		rv = parseFloat(RegExp.$1);
			        	}
			        	if(rv !== 8){
			        		$("#INI_certList").colResizable({
								liveDrag:true,
								draggingClass:"dragging",
								headerOnly: true,
								partialRefresh: true
							});
			        	}
			        } else {
			        	$("#INI_certList").colResizable({
							liveDrag:true,
							draggingClass:"dragging",
							headerOnly: true,
							partialRefresh: true
						});
			        }


					if(GINI_certificateListSortStatus.length <= 0){
						$("#INI_certList").tablesorter();
					} else {
						$("#INI_certList").tablesorter();
					}

					$("#INI_certList").on("sortEnd", function(event) {
						// prints the current sort order to the console
						GINI_certificateListSortStatus = event.target.config.sortList;
					});

					// GINI_selectedCertificateRow은 index row + 1값
					// 목록 소트를 위해 th 를 thead 로 분류 하면서 tbody 1번째가 인증서로 변경 되면서 +1 을 해 줄 필요가 없어 짐
					var selected = GINI_selectedCertificateRow;

					// 핸들러가 attached 되기 전에 이벤트 트리거가 실행되는 듯 하다. 트릭을 씀.
//					$('#INI_certificate_area #INI_certList tbody > tr:nth-child('+ selected +')').trigger('click');
					setTimeout(function() {
						$('#INI_certificate_area #INI_certList tbody > tr:nth-child('+ selected +')').trigger('click');
					},10);

					$('#INI_userPw').focus();
				}finally{
					GINI_LoadingIndicatorStop();
				}
			}

			// 인증서 리스트 (thead)
			function drawCertTitle() {
				var html = "";
				var position = defaultConf.Certs.CertAttrPosition;
				var iter = utils.Collection.iterator(position);
				while(iter.hasNext()){
					var field = iter.next();
					html += '<th width="'+msgFactory.getMessageFactory().WebForm().CERT_ATTR_WIDTH()[field]+'">'
								+ msgFactory.getMessageFactory().WebForm().CERT_ATTR_FIELD()[field]
								+ '</th>'
				}

				return "<thead><tr>" + html + "</tr></thead>";
			}

			// 인증서 리스트 (tbody)
			function drawCertInfoList(certAtts){

				var position = defaultConf.Certs.CertAttrPosition;
				var html = "<tbody>";
				var trOrder=0;
				for(cert in certAtts){
					attrList = certAtts[cert];
					if(trOrder == 0){
						html += '<tr id=' + cert + ' class="data active">';
					}else{
						html += '<tr id=' + cert + ' class="data">';
					}

					trOrder++;
					var i=0;
					var tdAlignStyle = "center";
					for (var positionInt = 0; positionInt < position.length; positionInt++) {
						html += '<td>';
						if (i == 0) {
							var expireStatus = commonForm.checkExpireDuration(attrList);
							var certExpireCss = constants.Certs.CERT_EXPIRE_CSS_VALID;
							var cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().VALID;
							if (expireStatus === constants.Certs.CERT_EXPIRE_STATUS_INVALID) {
								// 만료
								certExpireCss = constants.Certs.CERT_EXPIRE_CSS_INVALID;
								cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().INVALID;

							} else if(expireStatus === constants.Certs.CERT_EXPIRE_STATUS_IMMINENT){
								// 만료 임박
								certExpireCss = constants.Certs.CERT_EXPIRE_CSS_EXPIRE_STATUS_IMMINENT;
								cerExpireCssDesc = msgFactory.getMessageFactory().WebForm().CERT_EXPIRE_DESC().IMMINENT;

							}
							html += '<span class="ico"' + certExpireCss + '">';
							html  += cerExpireCssDesc;
							html += '</span>';
							html += '<span>';
							html += attrList[position[i]];
							html += '</span>';
						} else {
							// Status값과 처음 속성 값을 제외한 값을 세팅.
							if(position[positionInt] === constants.Certs.ATTR_ISSUER){
								attrList[position[i]] = commonForm.getIssuerName(attrList[position[i]]);
							}
							if("OID_NAME" == position[i] && !attrList[position[i]]){
								html += '<a href="javascript:void(null);">' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_040 + '</a>';
							}else{
								html += '<a href="javascript:void(null);">' + attrList[position[i]] + '</a>';
							}

						}
						i++;
						html =+ '</td>';
					}
					html += '</tr>'
				}
				html += '</tbody>';
				return html;
			}

			var drawCertDetail = function( certAttr ) {

				var html = "";
				html += '<div class="certificat_info">';
				html += '<div class="info_title">';
				html += '<img src="'+GINI_HTML5_BASE_PATH+'/res/img/inner/icon/inner_certificate2.png" alt="">'+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_017;
				html += '</div>';
				html += '<dl>';
				html += '<dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_002 + '</dt>';
				html += '<dd>' + certAttr['SIMPLE_SUBJECT'] + '</dd>';
				html += '</dl>';
				html += '<dl>';
				html += '<dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_003 + '</dt>';
				html += '<dd>' + commonForm.getIssuerName(certAttr['SIMPLE_ISSUER']) + '</dd>';
				html += '</dl>';
				html += '<dl>';
				if(certAttr['SIMPLE_OIDNAME']){
					html += '<dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_004 + '</dt>';
					html += '<dd>' + certAttr['SIMPLE_OIDNAME'] + '</dd>';
				}
				html += '</dl>';
				html += '<dl>';
				html += '<dt>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_005 + '</dt>';
				html += '<dd>' + certAttr['BEFORE_DT'] + " ~ "+ certAttr['AFTER_DT'] + '</dd>';
				html += '</dl>';

				html += '<div class="detail_text_info">';
				html += '<table summary="'+msgFactory.getMessageFactory().WebForm().TEXT().COMMON().W_T_017+'">';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_021 + '</th><td scope="col">' + certAttr['VERSION'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_022 + '</th><td scope="col">' + certAttr['SERIAL'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_023 + '</th><td scope="col">' + certAttr['SIGNATURE_ALG'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_024 + '</th><td scope="col">' + certAttr['HASH_ALG'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_025 + '</th><td scope="col">' + certAttr['ISSUER'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_026 + '</th><td scope="col">' + certAttr['BEFORE_DT'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_027 + '</th><td scope="col">' + certAttr['AFTER_DT'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_028 + '</th><td scope="col">' + certAttr['SUBJECT'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_029 + '</th><td scope="col">' + certAttr['AUTH_KEY_ID'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_030 + '</th><td scope="col">' + certAttr['SUBJECT_KEY_ID'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_031 + '</th><td scope="col">' + certAttr['KEY_USEAGE'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_032 + '</th><td scope="col">' + certAttr['CERT_POLICY'] + '</td></tr>';
				if(certAttr['SUBJECT_ALT_NAME']){
					html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_033 + '</th><td scope="col">' + certAttr['SUBJECT_ALT_NAME'] + '</td></tr>';
				}
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_034 + '</th><td scope="col">' + certAttr['CRL_DISTRIBUTION'] + '</td></tr>';
				html += '<tr><th>' + msgFactory.getMessageFactory().WebForm().TEXT().CERT_DETAIL().W_T_C_D_035 + '</th><td scope="col">' + certAttr['AUTH_INFO_ACCESS'] + '</td></tr>';
				html += '</table>';
				html += '</div>';
				html += '</div>';

				$("#" + constants.WebForm.CERT_DETAIL_TABLE_LIST).html('');
				$("#" + constants.WebForm.CERT_DETAIL_TABLE_LIST).append(html);
			};


			return {
				drawStorageList : drawStorageList,
				drawStorageSubList : drawStorageSubList,
				drawCertList : drawCertList,
				drawCertDetail : drawCertDetail
			};

		}());

		/*************************************************************************************
		 # 함수 명 : checkAllowAction
		 # 설명 : 스토리지 그리기 ACTION 체크( defaultConf.js/customerConf.js의 STORAGE_ATTRIBUTES내 각 스토리지의 ALLOW_ACTION 참조)
		 # params
		 	_allowActions : 혀용되눈 action리스트
		 	action : 현재 행하는 action
		*************************************************************************************/
		var checkAllowAction = function(_allowActions, action){
			var isDisabled = "";
			if(_allowActions){
				isDisabled = " data_disabled";
				for(var actionCount=0; actionCount < _allowActions.length; actionCount++ ){
					if(_allowActions[actionCount] === "ALL" || _allowActions[actionCount] === action){
						isDisabled = "";
						break;
					}
				}
			}
			return isDisabled;
		};

		/*************************************************************************************
		 # 함수 명 : checkOS
		 # 설명 : 스토리지 그리기 OS체크( defaultConf.js/customerConf.js의 STORAGE_ATTRIBUTES내 각 스토리지의 OS 참조)
		 # params
		 	_allowOS : 허용되는 OS 리스트(WIN/MAC/LINUX가 배열로 모두 허용일 경우 ALL)
		*************************************************************************************/
		var checkOS = function(_allowOS){

			var isDisabled = "";
			if(_allowOS){
				isDisabled = " data_disabled";
				for(var osCount=0; osCount < _allowOS.length; osCount++ ){
					if(_allowOS[osCount] === "ALL"){
						//ALL인경우 모두 보여준다.
						isDisabled = "";
					} else {
						//각 세팅 내용에 따라 보여줄지 말지 판단한다.
						switch (_allowOS[osCount]) {
						case "WIN":
							if(INI_getPlatformInfo().Windows){
								isDisabled = "";
								break;
							} else {
								continue;
							}
						case "MAC":
							if(!INI_getPlatformInfo().Mac){
								isDisabled = "";
								break;
							} else {
								continue;
							}
						case "LINUX":
							if(!INI_getPlatformInfo().Linux){
								isDisabled = "";
								break;
							} else {
								continue;
							}
						case "FEDORA":
							if(!INI_getPlatformInfo().Fedora){
								isDisabled = "";
								break;
							} else {
								continue;
							}
						case "UBUNTU":
							if(!INI_getPlatformInfo().Ubuntu){
								isDisabled = "";
								break;
							} else {
								continue;
							}
						};
					};
				};
			};
			return isDisabled;
		};

	return{
		MainForm : MainForm,
		InnerForm : InnerForm,
		SubInnerForm : SubInnerForm,
		SubForm : SubForm,
		DrawForm : DrawForm,
		MobileSubForm : MobileSubForm,
		MobileDrawForm : MobileDrawForm,
		InnerDrawForm : InnerDrawForm,
		CommonForm : CommonForm
	};

});
