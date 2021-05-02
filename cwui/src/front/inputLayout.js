define([
	'../main/constants',
	'../conf/msgFactory',
  '../conf/defaultConf',
  '../keyStrokeSecurity/inikeyStrokeSecurityFactory'
	], function(constants, msgFactroy, defaultConf, keyStrokeSecurityFactory){
	"use strict";
	var keyOptions;
	var inputFields = [];
	var _handleInfo = {};
	var container;
	var keyLayout;
	/** 
	 * @description 초기화 함수
	 */  
	
	function initialize(handleInfo, con) { // options){
	  _handleInfo = handleInfo;
	  container = con;
		keyOptions = {
			container : ".certifacte_input_area",
			targetContainer: defaultConf.Front.inputLayout.targetContainer /*{
				NONCE : ".certifacte_input_nonce",  
				NEW_NONCE : ".certifacte_input_new_nonce",
				NEW_NONCE_CNF : ".certifacte_input_new_nonce_cnf",
				SECURE : ".certifacte_input_secure", 
				TARGET_SECURE : ".certifacte_input_target_secure" 
			}*/
		};
		
		// if (typeof options != 'undefined' &&  !options) $.extend(keyOptions, options);
	}
	
	function getKeyInputLayout(){
		return keyLayout;
	}
	/** 
	 * @description 사용자가 선택한 액션에 따라 키입력 요소 숨김 및 표시 
	 */  
	function showKeyInputLayout(targets){ /* showKeyInputLayout - keyType, cbfCallbakc*/
		resetInput();
		container.find('.certifacte_input_area').show();
		container.find('.certifacte_input').hide();
		keyLayout = targets;
		if (typeof targets == 'undefined' || !targets) {
			targets = keyOptions.targetContainer;
			for (var i = 0; i < targets.length; i++){
				var targetElementId = keyOptions.targetContainer[targets[i]];
				container.find(targetElementId).hide();
			}
		}
		else {
			for (var i = 0; i < targets.length; i++){
				var targetElementId = keyOptions.targetContainer[targets[i]];
				var cbfCallback = Array.isArray(targets[i]) ? targets[i][1] : undefined;
				var inpKeyboard = container.find(targetElementId + ' input[type=password]');
				var inpKeypad = inpKeyboard.next('.keyboard');
				
				inputFields.push(targets[i]);
				container.find(targetElementId).show();
	      
				(function (cbfCallback) {
				  // 콜백 함수가 없는경우 기본처리
			          if (!cbfCallback) {
			              if (i+1 < targets.length) {
			              // 순서대로 다음 컴포넌트에 focus 넘겨줌
			    				  cbfCallback = (function(cmp) {
			    				    return function() {
			    				      cmp.focus().click();
			    				    }
			    				  })(container.find(keyOptions.targetContainer[targets[i+1]] + ' input[type=password]'));
			            } else {
			              // 마지막 입력 컴포넌트라면 submit 버튼 클릭
			              cbfCallback = function() {
			            	  setTimeout(function(){
			            		  $("#INI_certSubmit").click();
			            	  },20);
			              }
			            }
			          }
							  
			  	      inpKeyboard.unbind(".keyStrokeSecurity").on("click.keyStrokeSecurity", function() {
			  	        _handleInfo.serviceInfo.setParameter("pwdId", this.id);
			  	        
			  	        keyStrokeSecurityFactory.click(_handleInfo, "KEYBOARD");
			  	        $(this).unbind("keydown").on("keydown.keyStrokeSecurity", function(e) {
			  	          if (e.keyCode == 13) cbfCallback();
			  	        });
			  	      });
			  	      
			  	      if (i == 0) {
			  	        (function(inpKeyboard) {
			  	          setTimeout(function() { // timeout 으로 처리하지 않으면 동작 안함, 비밀번호 변경에서 현상 확인
			    	          inpKeyboard.blur().focus().click();
			    	        })
			  	        })(inpKeyboard);
			  	      }
			  
			  	      inpKeypad.unbind(".keyStrokeSecurity").on("click.keyStrokeSecurity", function() {
			  	        _handleInfo.serviceInfo.setParameter("pwdId", $(this).prev().attr("id"));
			  	        
			  	        keyStrokeSecurityFactory.click(_handleInfo, "KEYPAD");
				          keyStrokeSecurityFactory.setEnterCallback(cbfCallback);
			  	      });
				})(cbfCallback);
			}
		}
	}
	
	/** 
	 * @description 인증서 암호 , 인증서 핀번호 등의 사용자 입력값 반환 , 및 세팅
	 */  
	function getKeyValues(obj){ /*getKeyValues*/
		var inputValues= {};
		for (var i = 0; i < inputFields.length; i++){
			var fieldKey = inputFields[i];
			var fieldValue = $(keyOptions.targetContainer[fieldKey] + ' input[type=password]').val();
			inputValues[fieldKey] = fieldValue;
		}
		
		if (typeof obj !== 'undefined' &&  obj) {
			for (var key in inputValues){
				if (inputValues.hasOwnProperty(key)) {
					obj[key] = inputValues[key];
				}
			}
		}
		else {
			return inputValues;
		}
	}

  function _getKeyValue(obj){ /*getKeyValues*/
    return new RSVP.Promise(function(resolve) {
      var inputValues = {};
      var _async = RSVP.Promise.resolve();
      
      for (var i = 0; i < inputFields.length; i++) {
        var fieldKey = inputFields[i];
        var fieldObj = container.find(keyOptions.targetContainer[fieldKey] + ' input[type=password]');
  
        inputValues[fieldKey] = fieldObj.val();
        
        _async = _async.then(function() {
          var nonceType = this.nonceType;
          var pwdEle = this.pwdEle;
          
          return new RSVP.Promise(function(resolve) {
            _handleInfo.serviceInfo.setParameter("pwdId", pwdEle.attr("id"));
            
            keyStrokeSecurityFactory.getKeyPadValue(_handleInfo, fieldKey).then(function(pwd) {
              if (pwd) {
                pwdEle.val(pwd);
                inputValues[nonceType] = pwd;
              }
              
              resolve();
            }).catch(function(reason) {
              resolve();
            });
          });
        }.bind({nonceType : fieldKey, pwdEle : fieldObj}));
      }
      
      _async.then(function() {
        resolve(inputValues);
      })
    });
  }
	
	/** 
	 * @description 입력값 검증
	 */  
	function checkKeyValue(){
		if (typeof inputs === 'undefined' ||  inputs.length< 1) {
			INI_HANDLE.warnMessage("Wrong function call : no data array");
			return;
		}
	}
	
	function resetInput(){
		inputFields.length = 0;
		GINI_ProtectMgr.destroy();
		/*
		var targetContainer = keyOptions.targetContainer;
		for (var key in targetContainer){
			if (targetContainer.hasOwnProperty(key)){
				$(targetContainer[key] + ' input[type=password]').val('');
			}
		}
		*/
	}
	
	var exported = {};
	exported['initialize'] =  initialize;
	exported['showKeyInputLayout'] =  showKeyInputLayout;
	exported['getKeyInputLayout'] =  getKeyInputLayout;
	exported['getKeyValues'] =  getKeyValues;
	exported['_getKeyValue'] =  _getKeyValue;
	exported['checkKeyValue'] =  checkKeyValue;
	exported['resetInput'] =  resetInput;
	
	return exported;
});