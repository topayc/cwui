/**
 * Cross domain storage.
 * Based on: http://www.nczonline.net/blog/2010/09/07/learning-from-xauth-cross-domain-localstorage/
 * @param opts JSON object with the attribute names:
 *      - origin Iframe URL
 *      - path Path to iframe html file in origin
 */
define([
        '../../core/utils',
        '../../conf/defaultConf',
        '../../core/iniException'
        ], function (utils, defaultConf, iniException) {
	
	var isConnect = false;
	var urlInfo = defaultConf.System.CrossDomainStorageURL;
	
	var checkConnection = function(){
		
		utils.Transfer.checkJsonpConnection(
			urlInfo.dns + urlInfo.check, 
			'',
			function(){
				isConnect = true;
			}
		);
	};
	
	var Repository = function(){
	
	    var origin = urlInfo.dns || '',
	        path = urlInfo.path || '',
	        cdstorage = {},
	        _iframe = null,
	        _iframeReady = false,
	        _origin = origin,
	        _path = path,
	        _queue = [],
	        _requests = {},
	        _id = 0;
	
	    var supported = (function(){
	    	var support = false;
	        try{
	        	support = window.postMessage && window.JSON && 'localStorage' in window && window['localStorage'] !== null;
	        	if(!support){
	        		throw "Not support cross domain repository";
	        	}
	        	
	        	if (!window.jQuery) {
	        		throw "Not support jQuery";
	        	}
	        }catch(e){
	        	new iniException.Error.newThrow(e, 'ERR_1001');
	        }
	        return support;
	    })();
	
	    
	    
	    //private methods
	    var _sendRequest = function(data){
			if (_iframe) {
	        	if(_iframe.contentWindow != null){
	        		_requests[data.request.id] = data;
	        	    _iframe.contentWindow.postMessage(JSON.stringify(data.request), _origin);
				} else {
			    	_iframeReady = false;
			        _initIFrame();
					_queue.push(data);
				}
			}
		};
	
	    var _iframeLoaded = function(){
	        _iframeReady = true;
	        if (_queue.length) {
	            for (var i=0, len=_queue.length; i < len; i++){
	                _sendRequest(_queue[i]);
	            }
	            _queue = [];
	        }
	    };
	
	    var _handleMessage = function(event){
	    	
	        if (event.origin === _origin && event.data) {
	        	var data ;
	        	if(event.data.constructor === "string".constructor){
	        		data = JSON.parse(event.data);
	        	}else{
	        		data = event.data;
	        	}
	            
	            
	            if (typeof _requests[data.id] != 'undefined') {
	            	
	                if (typeof _requests[data.id].deferred !== 'undefined') {
	                    _requests[data.id].deferred.resolve(data.value);
	                }
	                
	                if (typeof _requests[data.id].callback === 'function') {
	                	
	                	utils.Log.debug('[101]Cross Domain callback data');
	                	//utils.Log.debug(data.key);
	                	utils.Log.debug(data.param);
	                	utils.Log.debug(data.value);
	                	utils.Log.debug('[101]------------------------------------------------');
	                	var saveObj = data.value;
	                	
//	                	if(saveObj!==undefined){
//	                		saveObj = JSON.parse(saveObj);
//	    				}
	                	
	                    _requests[data.id].callback(data.param, saveObj);
	                }
	                delete _requests[data.id];
	            }
	        }
	    };
	
	    //Public methods
	    cdstorage.getItem = function(param, callback){
	    	
	        if (supported && isConnect) {
	        	
	            var request = {
	                    id: ++_id,
	                    type: 'get',
	                    //key: key,
	                    param : param
	                },
	                data = {
	                    request: request,
	                    callback: callback
	                };
	            if (window.jQuery) {
	                data.deferred = jQuery.Deferred();
	            }
	
	            if (_iframeReady) {
	                _sendRequest(data);
	            } else {
	                _queue.push(data);
	            }
	
	            if (window.jQuery) {
	                return data.deferred.promise();
	            }
	        }else{
	        	callback(undefined, param.CROSS_LOCAL);
	        }
	    };
	
		var _initIFrame = function() {
        	document.body.appendChild(_iframe);

        	if (window.addEventListener) {
            	_iframe.addEventListener("load", function(){ _iframeLoaded(); }, false);
	            window.addEventListener("message", function(event){ _handleMessage(event) }, false);
    	    } else if (_iframe.attachEvent) {
        	    _iframe.attachEvent("onload", function(){ _iframeLoaded(); }, false);
            	window.attachEvent("onmessage", function(event){ _handleMessage(event) });
	        }
	        utils.Log.debug('Cross Domain : ' + _origin + _path);
    	    _iframe.src = _origin + _path;
		};

	    cdstorage.setItem = function(value){
	    	
	    	 if (supported && isConnect) {
	            var request = {
	                    id: ++_id,
	                    type: 'set',
	                    //key: key,
	                    value: value
	                },
	                data = {
	                    request: request
	                };
	            if (window.jQuery) {
	                data.deferred = jQuery.Deferred();
	            }
	
	            if (_iframeReady) {
	                _sendRequest(data);
	            } else {
	                _queue.push(data);
	            }
	
	            if (window.jQuery) {
	                return data.deferred.promise();
	            }
	        }
	    };
	    
//	    cdstorage.clearSetItem = function(key, value){
//	    cdstorage.clearSetItem = function(value){
//	    	 if (supported && isConnect) {
//	            var request = {
//	                    id: ++_id,
//	                    type: 'clearset',
//	                    //key: key,
//	                    value: value
//	                },
//	                data = {
//	                    request: request
//	                };
//	            if (window.jQuery) {
//	                data.deferred = jQuery.Deferred();
//	            }
//	            if (_iframeReady) {
//	                _sendRequest(data);
//	            } else {
//	                _queue.push(data);
//	            }
//	
//	            if (window.jQuery) {
//	                return data.deferred.promise();
//	            }
//	        }
//	    };
	
	    cdstorage.removeItem = function(certId){

	    	if (supported && isConnect) {
	            var request = {
	                    id: ++_id,
	                    type: 'unset',
	                    certId: certId
	                },
	                data = {
	                    request: request
	                };
	            if (window.jQuery) {
	                data.deferred = jQuery.Deferred();
	            }
	
	            if (_iframeReady) {
	                _sendRequest(data);
	            } else {
	                _queue.push(data);
	            }
	
	            if (window.jQuery) {
	                return data.deferred.promise();
	            }
	        }
	    };
	    
	    cdstorage.clearItem = function(){

	    	if (supported && isConnect) {
	            var request = {
	                    id: ++_id,
	                    type: 'clear'
	                },
	                data = {
	                    request: request
	                };
	            if (window.jQuery) {
	                data.deferred = jQuery.Deferred();
	            }
	
	            if (_iframeReady) {
	                _sendRequest(data);
	            } else {
	                _queue.push(data);
	            }
	
	            if (window.jQuery) {
	                return data.deferred.promise();
	            }
	        }
	    };
	    
	    cdstorage.refresh = function(refresh, param){
	    	
	        if (refresh) {
	            var request = {
	                    id: ++_id,
	                    type: 'refresh',
	                    param : param
	                },
	                data = {
	                    request: request
	                };
	            if (window.jQuery) {
	                data.deferred = jQuery.Deferred();
	            }
	
	            if (_iframeReady) {
	                _sendRequest(data);
	            } else {
	                _queue.push(data);
	            }
	
	            if (window.jQuery) {
	                return data.deferred.promise();
	            }
	        }
	    };

  		/*
  		// CrossDomain 의 sessionStorage 를 사용하기 위한 api
  		// middleChannel 에서 사용할 예정이었으나, 비동기 이슈로 사용 안됨. 추후 사용 될 여지가 있으므로 주석처리만 해둠
  		cdstorage.getSessionItem = function(key, callback){
  
  			if (supported && isConnect) {
  
  				var request = {
  						id: ++_id,
  						type: 'getSession',
  						key : key
  					},
  					data = {
  						request: request,
  						callback: callback
  					};
  				if (window.jQuery) {
  					data.deferred = jQuery.Deferred();
  				}
  
  				if (_iframeReady) {
  					_sendRequest(data);
  				} else {
  					_queue.push(data);
  				}
  
  				if (window.jQuery) {
  					return data.deferred.promise();
  				}
  			}else{
  				callback(undefined, param.CROSS_LOCAL);
  			}
  		};
  
  		cdstorage.setSessionItem = function(key,value){
  
  			if (supported && isConnect) {
  				var request = {
  						id: ++_id,
  						type: 'setSession',
  						key: key,
  						value: value
  					},
  					data = {
  						request: request
  					};
  				if (window.jQuery) {
  					data.deferred = jQuery.Deferred();
  				}
  
  				if (_iframeReady) {
  					_sendRequest(data);
  				} else {
  					_queue.push(data);
  				}
  
  				if (window.jQuery) {
  					return data.deferred.promise();
  				}
  			}
  		};
  		*/
  	  
	    $(document).ready(function() {
  	    //Initialize
  	    if (!_iframe && supported){
  	    	
  	        _iframe = document.createElement("iframe");
  	        _iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
  	        _iframe.title = "Cross Domain Process";
  	        document.body.appendChild(_iframe);
  	
  	        if (window.addEventListener) {
  	            _iframe.addEventListener("load", function(){ _iframeLoaded(); }, false);
  	            window.addEventListener("message", function(event){ _handleMessage(event) }, false);
  	        } else if (_iframe.attachEvent) {
  	            _iframe.attachEvent("onload", function(){ _iframeLoaded(); }, false);
  	            window.attachEvent("onmessage", function(event){ _handleMessage(event) });
  	        }
  	        
  	        utils.Log.debug('Cross Domain : ' + _origin + _path);
  	        
  	        _iframe.src = _origin + _path;
  	    } else {
      			_iframe = undefined;
      			_iframe = document.createElement("iframe");
  	        _iframe.style.cssText = "position:absolute;width:1px;height:1px;left:-9999px;";
  	        _iframe.title = "Cross Domain Process";
  	        _initIFrame();
  	    }
	    });
	
	    return cdstorage;
	};
	
	return{
		Repository : Repository,
		checkConnection : checkConnection
	};
});