if ( typeof _EXUtil !== 'object' ) var _EXUtil = new Object();
(function() {
	'use strict';
	//if(!window.console) console={log:function(msg){}};
	
	_EXUtil = {
		loadTotalCnt : 0,
		loadCnt : 0,
		fileArr : [],
		successCallback : function() {},
		failCallback : function() {},
		failFileNames : '',
		filename : '',
		loadJsDefaultFail : function( fileName ) {
			alert('file load fail\n' + fileName);
		},
		postData : null,
		
		loader : function( fileArr, successCallback, failCallback, postData ) {
			if(!fileArr) {
				alert('require file array');
				return;
			}
			if(!successCallback || typeof successCallback != 'function') {
				alert('successCallback is not a function');
				return;
			}
			if(!failCallback)
				failCallback = _EXUtil.loadJsDefaultFail;
			_EXUtil.loadJsFiles(fileArr, successCallback, failCallback, postData);
		},
		loadJsFiles : function( fileArr, successCallback, failCallback, postData ) {
			this.loadTotalCnt = 0;
			if ( fileArr instanceof Array ) {
				this.loadTotalCnt = fileArr.length;
			} else {
				fileArr = [ fileArr ];
				this.loadTotalCnt = 1;
			}
			this.fileArr = fileArr;
			this.loadCnt = 0;
			this.successCallback = successCallback;
			this.failCallback = failCallback;
			if(postData)	this.postData = postData;
			this.loadJs(fileArr[0]);
		},
		loadJs : function( filename ) {
			_EXUtil.filename = filename;

			var head = document.getElementsByTagName('head')[0];
			var srcObj = document.createElement('script');
			srcObj.type = 'text/javascript';
			if (srcObj.addEventListener){
				srcObj.addEventListener('load', function(){_EXUtil.jsLoadEventDetach(srcObj);_EXUtil.loadSuccess();}, false );
				srcObj.addEventListener('error', function(){_EXUtil.jsLoadEventDetach(srcObj);_EXUtil.loadFail();}, false );
			} else {
				srcObj.attachEvent( 'onreadystatechange', function(){
					if(srcObj.readyState == 'complete' || srcObj.readyState == 'loaded'){
						_EXUtil.jsLoadEventDetach(srcObj);
						_EXUtil.loadSuccess();
					}}, false );
			}
			
			try{
				//console.log('====== append src [' + filename + ']');
				srcObj.src = filename;
			} catch(e){
				// only IE, https over http js file load..
				alert(filename + ' 파일 로딩이 실패하였습니다.(http접속)');
				return;
			}
			head.appendChild(srcObj);
		},
		loadSuccess : function() {
			_EXUtil.loadCnt++;
			//console.log('====== success load [' + _EXUtil.filename + ']');
			_EXUtil.filename = '';
			
			if ( _EXUtil.loadCnt < _EXUtil.loadTotalCnt )
				_EXUtil.loadJs(_EXUtil.fileArr[_EXUtil.loadCnt]);
			else {
				if(_EXUtil.postData){
					setTimeout(function(){
						_EXUtil.successCallback(_EXUtil.postData);
					});
				} else {
					setTimeout(_EXUtil.successCallback());
				}
			}
		},
		loadFail : function() {
			_EXUtil.loadCnt++;
			_EXUtil.failFileNames += '[' + _EXUtil.filename + ']';
			//console.log('====== fail load [' + _EXUtil.filename + ']');
			_EXUtil.filename = '';
			
			setTimeout(function(){_EXUtil.failCallback(_EXUtil.failFileNames);});
		},
		jsLoadEventDetach : function ( obj ) {
			if ( obj.addEventListener ) {
				//console.log('====== jsLoadEventDetach removeEventListener');
				obj.removeEventListener( "load", _EXUtil.loadSuccess, false );
				obj.removeEventListener( "error", _EXUtil.loadFail, false );
			} else {
				//console.log('====== jsLoadEventDetach detachEvent');
				obj.detachEvent( "onreadystatechange", _EXUtil.loadSuccess);
			}
		}
	}
}());
