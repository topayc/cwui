Map = function(){
	this.map = new Object();
};
Map.prototype = {
	put : function(key, value){
		this.map[key] = value;
	},
	get : function(key){
		return this.map[key];
	},
	containsKey : function(key){
		return key in this.map;
	},
	containsValue : function(value){
		for(var prop in this.map){
			if(this.map[prop] == value) return true;
		}
		return false;
	},
	isEmpty : function(key){
		return (this.size() == 0);
	},
	clear : function(){
		for(var prop in this.map){
			delete this.map[prop];
		}
	},
	remove : function(key){
		delete this.map[key];
	},
	keys : function(){
		var keys = new Array();
		for(var prop in this.map){
			keys.push(prop);
		}
		return keys;
	},
	values : function(){
		var values = new Array();
		for(var prop in this.map){
			values.push(this.map[prop]);
		}
		return values;
	},
	size : function(){
		var count = 0;
		for (var prop in this.map) {
			count++;
		}
		return count;
	}
};

define([
	'../../main/constants',
	'../../main/system',
	'../../core/middleChannel',
	'../../common/qr/qrcode'
] , function(constants, system, middleChannel, qrcode){
	
	var install_guide = constants.BaroSign.BaroSign_install_guide;
	var request_id;
	var clientPushId;
	
	function result(data){
		if (data == null) {
			return null;
		}
		var returnDataArr = data.split('&');
		var resultInfo = returnDataArr[0];
		var resultBodyData = returnDataArr[1];

		if(resultInfo.split('=')[1] == 'success'){
			if (resultBodyData != null) {
				return decodeURIComponent(resultBodyData);
			} else {
				return "success";
			}
		} else {
			alert(decodeURIComponent(resultBodyData.split('=')[1]));
			return null;
		}
	}
	
	function requstWorkResultBaro(html5Action) {

		if (request_id == null || request_id == "" || request_id == undefined) {
			alert('request_id error');
			return;
		}

		$.ajax({
			type: "post",
			url: constants.BaroSign.BaroSign_Server,
			dataType: "TEXT",
			data: {"action": "requestResult", "rid": request_id},			
			success: function (data, status, xhr) {
				data = result(data);
				if (data != null) {
					if (data == "success") {
						return;
					} else {
						if (barosignSecuredataProcBaro(data)) {
							if(html5Action ===  constants.WebForm.ACTION_LOGIN){
								//로그인인 경우 해당 정보를 캐쉬함.
								middleChannel.Certs.setSelectedCertInfo(
										constants.Certs.STORAGE_BAROSIGN,
										"",
										"",
										clientPushId
								);
							}
							//부모페이지의 barosign callback을 실행.
							window.barosignCallback();
						} else {
							setTimeout(function () {
								requstWorkResultBaro(html5Action);
							}, 2000);
						}
					}
				} else {
					console.log('fail');

				}
			}
			,tryCount :0
			,retryLimit :1
     		,error: function(xhr, status, error){
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

	function barosignSecuredataProcBaro(data){
		var returnValues = data.split("&");
		for( i = 0 ; i < returnValues.length ; i++ ) {
			var key = returnValues[i].split('=')[0].trim();
			if (key == "ret") {
				var retcode = returnValues[i].split('=')[1];
				if(retcode != null && retcode != "" && retcode == "1" ){
				} else if(retcode == "2") {
					console.log('2');
					return false;
				} else if(retcode == "3") {
					console.log('3');
					return true;
				} else {
					console.log(retcode);
					return false;
				}
			} else if (key == "retdata"){
				$("#barosign_securedata", window.document).val(returnValues[i].split('=')[1]);
			} else if (key == "clientPushId"){
				clientPushId = returnValues[i].split('=')[1];
			} else {
				console.log(key);
				return false;
			}
		}
		return true;
	};

	var makeBaroSignQRData = function(requestData, html5Action) {
		
		$.ajax({
			type: "post",
			url: constants.BaroSign.BaroSign_Server,
			dataType: "TEXT",
			data: requestData,
			success: function (data, status, xhr) {
				if (data != null) {
					var resultData = result(data);

					var map = new Map();
					var resultBodyDatas = resultData.split('&');
					for (var i = 0; i < resultBodyDatas.length; i++) {
						var key = resultBodyDatas[i].split('=')[0];
						var value = resultBodyDatas[i].substring(resultBodyDatas[i].indexOf('=') + 1, resultBodyDatas[i].length);
						value = value.replace(/\n/g, "");
						map.put(key, value);
						console.log(key + " : " + value);
					}

					var barosignMapData = install_guide + map.get('qrData').trim();
					
					var webType = "pc";
					var mobileKeyWords = new Array('iPhone', 'iPod', 'iPad',  'BlackBerry', 'Android', 'Windows CE', 'LG', 'MOT', 'SAMSUNG', 'SonyEricsson');
					for (var i = 0; i < mobileKeyWords.length; i++){
					    if (nAgt.match(mobileKeyWords[i]) != null){
					        webType = "mobile";
					        break;
					    }
					}					

					if(webType === "mobile"){								
						showQRBarcode("qrcode", barosignMapData);
						callBaroSignApp(barosignMapData);
					} else {
						if(html5Action ===  constants.WebForm.ACTION_LOGIN){
							// 로그인인 경우만 qr데이터 생성.
							showQRBarcode("qrcode", barosignMapData);
						} else if (html5Action ===  constants.WebForm.ACTION_SIGN){
							// push 메세지 전송 및 팝업창 띄움.
							var selected = middleChannel.Certs.getSelectedCertInfo();
							if(selected && selected.clientPushId){
								pushSendQrdata(barosignMapData, selected.clientPushId);
							}
							showQRBarcode("qrcode", barosignMapData);
						}
					}
					request_id = map.get('rid');

					setTimeout(function () {
						requstWorkResultBaro(html5Action);
					}, 3000);
					
				} else {
					console.log('fail');
					//alert('fail');
				}
			},
			tryCount :0
			,retryLimit :1
     		,error: function(xhr, status, error){
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

	var showQRBarcode = function(displayId, qrData){
		
		var contentUrl = GINI_HTML5_BASE_PATH + "/res/form/pc/common/message/barosign_qr.html";
		$.ajax({
			'url': contentUrl,
			'global': false,
			'success': function success(data, textStatus, xhr) {
				$("<div id='INI_barosign_qr_modal'>" + data + "</div>").dialog({
					"modal": true,
					"width": '300px',
					"height": '300px',
					"resizable":false,
					"draggable":true,
					"closeOnEscape": false, //esc버튼 이벤트 막기
					"stack": false,
					"show" :{
						effect:"puff",
						duration:400, 
						complete:function() {
						}
					},
					"position": {
						my: "top",
						at: "#INI_mainModalDialog",
						collision: "none"
					},
					"open": function(event, ui){
						$(".ui-dialog-titlebar").hide();
						$(".ui-dialog").css('overflow','visible');
						$("#INI_barosign_qr_modal").css('overflow', 'visible');

						//$('#msg_area').text(output_msg);
					},
					"close": function (e, ui) {
						$(this).remove();
					}
				});

				new QRCode(
					document.getElementById(displayId)
					, {
						width: 170,
						height: 170,
						colorDark: "#000000",
						colorLight: "#ffffff",
						correctLevel: QRCode.CorrectLevel.L
				}).makeCode(qrData);
				
			}
			,tryCount :0
			,retryLimit :1
     		,error: function(xhr, status, error){
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
				INI_HANDLE.infoMessage("ERROR : " + xhr);
				$(this).remove();
				return;	
     		}
		});
	};
	
	var kitkatVersion = 4.4;
	var callBaroSignApp = function(data){
		var version = system.Android.getAndroidVersion();		
		var agent = window.navigator.userAgent.toLowerCase();		
		
		//baroign_protocol
		var barosign_url = data.trim();		

		// 킷캣 버전부터 기본 브라우저의 엔진이 크롬으로 바뀌면서 호출 문제가 발생하여 intent 방식으로 교체
		// 단, 파이어폭스 오페라의 경우 intent 방식이 동작하지 않으므로 예외처리함.
		if ( version >= kitkatVersion && agent.indexOf("firefox") == -1 && agent.indexOf("opera") == -1 && agent.indexOf("opr") == -1 ){
			window.location.href = "intent://"+ barosign_url +"/#Intent;scheme=barosign;package=com.initech.barosign.client;end";
		} else if ( agent.indexOf("chrome") != -1  || agent.indexOf("firefox") != -1  ) {	
			var barosign_win = window.open(barosign_url);
			// Byungkyu.lim 20130304 close() 사용 시 G2 Kitkat에서 모아사인이 호출되지 않는 문제가 발생하며,
			// close() 미사용 시 크롬 브라우저에서 빈 팝업이 생성된 후 닫히지 않는 문제발생
			// 하여 close() 호출 전 슬립 카운터를 주어 G2 KitKat에서 close() 사용시 문제가 발생하는 현상 및 크롬 브라우저 문제 해결
			sleep(1000);
			if(barosign_win != null)
				barosign_win.close();
		} 	
	};
	
	var pushSendQrdata = function(qrData, pushId) {
		$.ajax({
			type: "post",
			url: GINI_HTML5_BASE_PATH + "/initech/barosign/barosign_push_service.jsp",
			dataType: "TEXT",
			data: {"clientPushId": pushId, "qrData": qrData},
			success: function (data, status, xhr) {
				console.log('push send success');
			}
			,tryCount :0
			,retryLimit :1
     		,error: function(xhr, status, error){
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
	
	return {
		makeBaroSignQRData : makeBaroSignQRData,
		showQRBarcode : showQRBarcode,
		callBaroSignApp : callBaroSignApp,
		pushSendQrdata : pushSendQrdata
	}
});
