var pendingXDR = [];

function addXDR(xdr) {
	if (pendingXDR.indexOf) {
		pendingXDR.push(xdr);
	}
}

function removeXDR(xdr) {
	if (pendingXDR.indexOf) {
		var index = pendingXDR.indexOf(xdr);
		if (index >= 0) {
			pendingXDR.splice(index, 1);
		}
	}
}

CROSSWEBEX_UTIL.typeDaemon = function () {
	return true;
};

var CROSSWEBEX_WORKER = {
	works: [],
	work: null,

	AddWork: function (work) {
		CROSSWEBEX_WORKER.works.push(work);

		function runWorkerAsyc () {
			setTimeout(function () {
				if (CROSSWEBEX_WORKER.work) {
					if (!CROSSWEBEX_WORKER.work.isWorkCompleted) {
						runWorkerAsyc();
						return;
					}
				}

				if (!CROSSWEBEX_WORKER.works.length) {
					return;
				}

				CROSSWEBEX_WORKER.work = CROSSWEBEX_WORKER.works.shift();
				CROSSWEBEX_WORKER.work.isWorkCompleted = false;
				CROSSWEBEX_WORKER.work();
			}, 0);
		}

		runWorkerAsyc();
	}
};

var CROSSWEBEX_DAEMON = {
	thisObj: null,
	request: "",
	callback: "",
	moduleCheck: function (currPluginCnt) {
		exlog("_DAEMON.moduleCheck", currPluginCnt);

		if (crosswebexInfo.exEdgeInfo.isUseWebSocket == false) {
			if (!CROSSWEBEX_CONST.id) {
				CROSSWEBEX_CONST.id = CROSSWEBEX_UTIL.createId();
			}
		}
		// generate tab id
		if (!CROSSWEBEX_CONST.extabid) {
			CROSSWEBEX_CONST.extabid = CROSSWEBEX_UTIL.createId();
		}

		// CrossWeb EX 는 Plugin 이 하나이므로 주석처리
		//CROSSWEBEX_CHECK.chkCurrPluginCnt = currPluginCnt;

		if (currPluginCnt >= CROSSWEBEX_CONST.pluginCount) {
			var chk = true;
			for (var i = 0; i < CROSSWEBEX_CONST.pluginCount; i++) {
				var currInstalled = true;
				var currStatus = CROSSWEBEX_CHECK.chkInfoStatus.info[i];
				if (!currStatus.daemon) {
					chk = false;
					currInstalled = false;
				}
				if (!currStatus.client) {
					chk = false;
					currInstalled = false;
				}
				currStatus.isInstalled = currInstalled;
			}
			CROSSWEBEX_CHECK.chkInfoStatus.status = chk;
			exlog("_DAEMON.moduleCheck.chkInfoStatus", CROSSWEBEX_CHECK.chkInfoStatus);
			eval(CROSSWEBEX_CHECK.chkCallback)(CROSSWEBEX_CHECK.chkInfoStatus);
			return;
		}

		var pluginInfo = CROSSWEBEX_CONST.pluginInfo[currPluginCnt];

		var checkCallback = "CROSSWEBEX_CHECK.daemonVersionCheck";
		var request = {};

		if (crosswebexInfo.exEdgeInfo.isUseWebSocket) {
			request.tabid = CROSSWEBEX_CONST.extabid;
			request.init = "get_versions";

			request.m = pluginInfo.exModuleName;
			request.origin = location.origin;
			request.lic = pluginInfo.lic;
			request.callback = "";
		} else {
			request.id = CROSSWEBEX_CONST.id;
			request.tabid = CROSSWEBEX_CONST.extabid;
			request.cmd = "native";
			request.origin = location.origin;
			request.callback = "";
			request.exfunc = {};
			request.exfunc.fname = "GetVersion";
			request.exfunc.args = "";

			request.init = "get_versions";
			request.m = pluginInfo.exModuleName;
			request.lic = pluginInfo.lic;
		}

		try {
			if (sessionStorage.getItem("crosswebex_wsport")) {
				exlog("_DAEMON.moduleCheck.portCheck.getSession.crosswebex_wsport", sessionStorage.getItem("crosswebex_wsport"));
				var localHost = crosswebexInfo.exEdgeInfo.localhost;
				CROSSWEBEX_UTIL.sendWS(localHost, request, checkCallback);
			} else {
				var wsPortError = 0;
				var wsPortMax = pluginInfo.exEdgeInfo.portChkCnt;
				var wsPortCurr = pluginInfo.exEdgeInfo.edgeStartPort;
				var wsPortLast = pluginInfo.exEdgeInfo.edgeStartPort + pluginInfo.exEdgeInfo.portChkCnt - 1;
				var wsPortSucceed = false;

				// Web Socket 사용
				if (crosswebexInfo.exEdgeInfo.isUseWebSocket) {
					// 포트 체크
					function wsPortCheckStart() {

						// 연속적으로 포트 체크를 할 경우 포트 체크가 제대로 되지 않아 100ms 간격으로 포트 체크를 하도록 수정
						setTimeout(function () {

							var ws = new WebSocket(pluginInfo.exEdgeInfo.localhost + ":" + wsPortCurr + "/");
							ws.port = wsPortCurr;
							ws.isReadyState = false;

							exlog("wsPortCheckStart :: URL", ws.url);

							// 오픈 이벤트
							ws.onopen = function () {
								exlog("wsPortCheckStart :: onopen", this.url);
								this.send({});
							};

							// 메시지 이벤트
							ws.onmessage = function (event) {
								exlog("wsPortCheckStart :: onmessage", this.url);
								ws.isReadyState = true;
								this.close();
								if (!wsPortSucceed) {
									wsPortSucceed = true;
									sessionStorage.setItem('crosswebex_wsport', this.port);
									exlog("wsPortCheckStart :: onmessage :: crosswebex_wsport", sessionStorage.getItem("crosswebex_wsport"));
									CROSSWEBEX_UTIL.sendWS(pluginInfo.exEdgeInfo.localhost, request, checkCallback);
								}
							};

							// 에러 이벤트
							ws.onerror = function () {
								exlog("wsPortCheckStart :: onerror", this.url);
								wsPortError++;
								if (wsPortError == wsPortMax) {
									exlog("wsPortCheckStart :: onerror", "Failed to check port");
									CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
								}
							};

							// 클로즈 이벤트
							ws.onclose = function () {
								exlog("wsPortCheckStart :: onclose", this.url);
								if (!ws.isReadyState) {
									wsPortError++;
									if (wsPortError == wsPortMax) {
										exlog("wsPortCheckStart :: onclose", "Failed to check port");
										CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
									}
								}
							};

							// 다음 포트 체크
							wsPortCurr++;

							// 체크할 포트가 남아 있는 경우
							if (wsPortCurr <= wsPortLast) {
								// 성공한 경우 더 이상 포트 체크를 하지 않음
								if (!wsPortSucceed) {
									// 포트 체크
									wsPortCheckStart();
								}
							}

						}, 100);
					}

					// 포트 체크
					exlog("wsPortCheckStart");
					wsPortCheckStart();

					// HTTPS 사용
				} else {

					function dmPortCheckStart(dmPort) {

						// 연속적으로 포트 체크를 할 경우 포트 체크가 제대로 되지 않아 100ms 간격으로 포트 체크를 하도록 수정
						setTimeout(function () {

							if (sessionStorage.getItem("crosswebex_wsport")) {
								return;
							}

							var url = pluginInfo.exEdgeInfo.localhost + ":" + dmPort + "/?dmPortScan";
							var xmlHttp = null;
							var useXDomain = false;

							if (window.XDomainRequest) {
								useXDomain = true;
								xmlHttp = new XDomainRequest();
							} else if (window.XMLHttpRequest) {
								xmlHttp = new XMLHttpRequest();
							} else if (window.ActiveXObject) {
								try {
									xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");//IE 상위 버젼 
								} catch (e1) {
									try {
										xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE 하위 버젼 
									} catch (e2) {
										xmlHttp = null;
									}
								}
							}

							if (xmlHttp) {
								if (useXDomain) {
									xmlHttp.onload = function () {
										exlog("dmPortCheckStart :: onopen", url);
										removeXDR(xmlHttp);
										wsPortSucceed = true;
										sessionStorage.setItem('crosswebex_wsport', dmPort);
										CROSSWEBEX_UTIL.sendWS(pluginInfo.exEdgeInfo.localhost, request, checkCallback);
									};

									xmlHttp.onerror = function () {
										exlog("dmPortCheckStart :: onerror :: " + wsPortError, url);
										removeXDR(xmlHttp);
										wsPortError++;
										if (wsPortError == wsPortMax) {
											exlog("dmPortCheckStart :: onerror", "Failed to check port");
											CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
										}
									};

								} else {
									xmlHttp.onreadystatechange = function () {
										if (xmlHttp.readyState == 4 /* READYSTATE_COMPLETE */) {
											exlog("dmPortCheckStart xmlHttp.readyState: " + xmlHttp.readyState + ", xmlHttp.status: " + xmlHttp.status + ", port: " + dmPort);
											if (xmlHttp.status == 200 && !wsPortSucceed) {
												exlog("dmPortCheckStart", JSON.stringify(xmlHttp.responseText));
												wsPortSucceed = true;
												sessionStorage.setItem('crosswebex_wsport', dmPort);
												CROSSWEBEX_UTIL.sendWS(pluginInfo.exEdgeInfo.localhost, request, checkCallback);
											} else {
												exlog("dmPortCheckStart :: onerror :: " + wsPortError, url);
												wsPortError++;
												if (wsPortError == wsPortMax) {
													exlog("dmPortCheckStart :: onerror", "Failed to check port");
													CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
												}
											}
										}
									};
								}

								xmlHttp.open("GET", url);
								xmlHttp.send();

								if (useXDomain) {
									addXDR(xmlHttp);
								}

							} else {
								exlog("_DAEMON.dmPortCheckStart", "XMLHTTP not supported.");
							}

							// 다음 포트 체크
							wsPortCurr++;

							// 체크할 포트가 남아 있는 경우
							if (wsPortCurr <= wsPortLast) {
								// 성공한 경우 더 이상 포트 체크를 하지 않음
								if (!wsPortSucceed) {
									// 포트 체크
									dmPortCheckStart(wsPortCurr);
								}
							}

						}, 100);
					}

					// 포트 체크
					exlog("dmPortCheckStart");
					dmPortCheckStart(wsPortCurr);
				}
			}

		} catch (e) {
			exlog("_DAEMON.moduleCheck.portCheck", e);
			CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
		}
	},

	daemonVersionCheck: function (updateInfo) {

		var pluginInfo = CROSSWEBEX_CONST.pluginInfo[CROSSWEBEX_CHECK.chkCurrPluginCnt];

		if (updateInfo) {
			exlog("_DAEMON.daemonVersionCheck.updateInfo", updateInfo);
			if (updateInfo == "-1") {
				CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
				return;
			}

			exlog("_DAEMON.daemonVersionCheck", "daemon version check");
			// CrossWeb EX Daemon 버전 체크
			var exDaemonSvrVer = pluginInfo.exEdgeInfo.daemonVer;
			if (CROSSWEBEX_UTIL.diffVersion(updateInfo.daemon, exDaemonSvrVer)) {
				CROSSWEBEX_CHECK.setDaemonStatus(updateInfo.daemon, true, false);
				exlog("_DAEMON.daemonVersionCheck", "EX version check");
				var exEXSvrVer = pluginInfo.exProtocolInfo.exWinProtocolVer;
				// CrossWeb EX Extension 은 항상 설치로 설정
				CROSSWEBEX_CHECK.setStatus("EX", updateInfo.ex, true, false);

				// CrossWeb EX Client 버전 취득
				var currModuleInfoArr = updateInfo.m;
				var currModuleVer;
				for (var i = 0; i < currModuleInfoArr.length; i++) {
					var cm = currModuleInfoArr[i];
					if (cm.name == pluginInfo.exModuleName) {
						currModuleVer = cm.version;
						break;
					}
				}

				if (pluginInfo.exModuleName == updateInfo.m.name)
					currModuleVer = updateInfo.m.version;

				exlog("_DAEMON.EXVersionCheck", "Client version check");
				var exModuleSvrVer;
				if (CROSSWEBEX_UTIL.isWin()) {
					exModuleSvrVer = pluginInfo.moduleInfo.exWinVer;
				} else if (CROSSWEBEX_UTIL.isMac()) {
					exModuleSvrVer = pluginInfo.moduleInfo.exMacVer;
				} else if (CROSSWEBEX_UTIL.isLinux()) {
					exModuleSvrVer = pluginInfo.moduleInfo.exLinuxVer;
				}
				// CrossWeb EX Client 버전 체크
				if (CROSSWEBEX_UTIL.diffVersion(currModuleVer, exModuleSvrVer)) {
					CROSSWEBEX_CHECK.setStatus("client", currModuleVer, true, true);
				} else {
					CROSSWEBEX_CHECK.setStatus("client", currModuleVer, false, true);
				}
			} else {
				CROSSWEBEX_CHECK.setDaemonStatus(updateInfo.daemon, false, true);
			}
		} else {
			exlog("_DAEMON.daemonVersionCheck", pluginInfo.exPluginName + " updateInfo Error");
			CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
		}
	},

	sendWS: function (host, request, callback) {
		try {
			CROSSWEBEX_WORKER.AddWork(function () {
				// Web Socket 사용
				if (crosswebexInfo.exEdgeInfo.isUseWebSocket) {
					exlog("_DAEMON.sendWS", "isUseWebSocket is true");
					var url = host + ":" + sessionStorage.getItem("crosswebex_wsport") + "/crosswebex/Call";
					var crosswebexWS = new WebSocket(url);
					crosswebexWS.callback = callback;
					crosswebexWS.request = request;
					crosswebexWS.onopen = function () {
						exlog("_DAEMON.sendWS.onopen", this.request);
						this.send(JSON.stringify(this.request));
					};
					crosswebexWS.onmessage = function (event) {
						exlog("_DAEMON.sendWS.onmessage", this.request);
						var response = event.data;
						try {
							response = JSON.parse(response);
						} catch (e) {
							response = response;
						}
						exlog("_DAEMON.sendWS.callback", this.callback);
						exlog("_DAEMON.sendWS.response", response);

						if (typeof response.response != "undefined" &&
							response.response.id == "setcallback") {
							eval(response.response.callback)(response.response.reply);
						} else {
							if (this.callback) {
								var sendWSCallbackFn = CROSSWEBEX_DAEMON.executeFunctionByName(this.callback);
								sendWSCallbackFn.apply(CROSSWEBEX_DAEMON.thisObj, [response]);
							}
						}
						this.close();
					};
					crosswebexWS.onclose = function () {
						exlog("_DAEMON.sendWS.onclose", "onclose");
						CROSSWEBEX_WORKER.work.isWorkCompleted = true;
					};

					// HTTPS 사용
				} else {

					var port = sessionStorage.getItem("crosswebex_wsport");
					var url = host + ":" + port;
					var xmlHttp = null;
					var useXDomain = false;

					if (window.XDomainRequest) {
						useXDomain = true;
						xmlHttp = new XDomainRequest();
					} else if (window.XMLHttpRequest) {
						xmlHttp = new XMLHttpRequest();
					} else if (window.ActiveXObject) {
						try {
							xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");//IE 상위 버젼 
						} catch (e1) {
							try {
								xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE 하위 버젼 
							} catch (e2) {
								xmlHttp = null;
							}
						}
					}

					if (xmlHttp) {
						if (useXDomain) {
							xmlHttp.onload = function () {
								removeXDR(xmlHttp);
								exlog("_DAEMON.sendWS.onload", JSON.stringify(xmlHttp.responseText));
								var response = JSON.parse(xmlHttp.responseText);
								if (response.response.status == "TRUE") {
									if (typeof response != "undefined" && response.response.id == "setcallback") {
										eval(response.callback)(response.response.reply.reply);
									} else {
										if (callback) {
											var sendWSCallbackFn = CROSSWEBEX_DAEMON.executeFunctionByName(callback);
											sendWSCallbackFn.apply(CROSSWEBEX_DAEMON.thisObj, [response]);
										}
									}
								}
								CROSSWEBEX_WORKER.work.isWorkCompleted = true;
							};

							xmlHttp.onerror = function () {
								removeXDR(xmlHttp);
								exlog("_DAEMON.sendWS.onerror", "Can not connected to local DAEMON Server!");
								sessionStorage.removeItem("crosswebex_wsport");
								if (typeof CROSSWEBEX != "undefined")
									eval(CROSSWEBEX.exDefaultCallbackName)({ "NAME": CROSSWEBEX.exPluginName, "ERR": "BLOCK:CLIENT" });
								else
									CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
								CROSSWEBEX_WORKER.work.isWorkCompleted = true;
							};

						} else {
							xmlHttp.onreadystatechange = function () {
								if (xmlHttp.readyState == 4) {
									exlog("_DAEMON.sendWS.onreadystatechange :: xmlHttp.readyState: " + xmlHttp.readyState + ", xmlHttp.status: " + xmlHttp.status + ", port: " + port);
									if (xmlHttp.status == 200) {
										exlog("_DAEMON.sendWS.onreadystatechange", JSON.stringify(xmlHttp.responseText));
										var response = JSON.parse(xmlHttp.responseText);
										if (response.response.status == "TRUE") {
											if (typeof response != "undefined" && response.response.id == "setcallback") {
												eval(response.callback)(response.response.reply.reply);
											} else {
												if (callback) {
													var sendWSCallbackFn = CROSSWEBEX_DAEMON.executeFunctionByName(callback);
													sendWSCallbackFn.apply(CROSSWEBEX_DAEMON.thisObj, [response]);
												}
											}
										}
									} else {
										exlog("_DAEMON.sendWS.onreadystatechange", "Can not connected to local DAEMON Server!");
										sessionStorage.removeItem("crosswebex_wsport");
										if (typeof CROSSWEBEX != "undefined")
											eval(CROSSWEBEX.exDefaultCallbackName)({ "NAME": CROSSWEBEX.exPluginName, "ERR": "BLOCK:CLIENT" });
										else
											CROSSWEBEX_CHECK.setDaemonStatus("", false, true);
									}
									CROSSWEBEX_WORKER.work.isWorkCompleted = true;
								}
							};
						}

						xmlHttp.open("POST", url);

						if (useXDomain) {
							xmlHttp.send("request=" + encodeURIComponent(JSON.stringify(request)));
							addXDR(xmlHttp);
						} else {
							xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
							xmlHttp.send("request=" + encodeURIComponent(JSON.stringify(request)));
						}

					} else {
						exlog("_DAEMON.sendWS", "XMLHTTP not supported.");
					}
				}
			});

		} catch (e) {
			exlog("_DAEMON.sendWS", "sendWS Daemon not load");
		}
	},

	setDaemonStatus: function (localVer, status, isNext) {
		// Extension 과 CrossEX 는 모두 설치 상태로 설정
		CROSSWEBEX_CHECK.chkInfoStatus.info[CROSSWEBEX_CHECK.chkCurrPluginCnt].extension = true;
		CROSSWEBEX_CHECK.chkInfoStatus.info[CROSSWEBEX_CHECK.chkCurrPluginCnt].EX = true;
		CROSSWEBEX_CHECK.chkInfoStatus.info[CROSSWEBEX_CHECK.chkCurrPluginCnt].daemonVer = localVer;
		CROSSWEBEX_CHECK.chkInfoStatus.info[CROSSWEBEX_CHECK.chkCurrPluginCnt].daemon = status;

		if (isNext) {
			CROSSWEBEX_CHECK.moduleCheck(CROSSWEBEX_CHECK.chkCurrPluginCnt + 1);
		}
	},

	executeFunctionByName: function (functionName) {
		var args = Array.prototype.slice.call(arguments, 2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		var funcArr;
		for (var i = 0; i < namespaces.length; i++) {
			if (i == 0) {
				funcArr = window[namespaces[i]];
				this.thisObj = funcArr;
			} else {
				funcArr = funcArr[namespaces[i]];
			}
		}
		return funcArr[func];
	}
};


/* 
 * CrossEX Construct
 * CROSSWEBEX_EX
 */
var CROSSWEBEX_EX = function (property) {

	this.isInstalled = property.isInstalled;
	this.exPluginName = property.exPluginName;
	this.exModuleName = property.exModuleName ? property.exModuleName : property.exProtocolName;
	this.exProtocolName = property.exProtocolName;
	this.exExtHeader = property.exExtHeader;
	this.exNPPluginId = property.exNPPluginId;
	this.exErrFunc = property.exErrFunc;
	this.lic = property.lic;
	this.host = property.exEdgeInfo.localhost;
	this.exDefaultCallbackName = property.exPluginName + ".exDefaultDaemonCallback";

	dummyDomain = property.dummyDomain ? property.dummyDomain : location.host;
	hostid = property.hostid ? property.hostid : location.host;

	this.initEXInfoArr = [];
	this.exInterfaceArr = [];
	this.exEcho = false;
	this.setEcho = function (status) {
		this.exEcho = status;
	};
	this.alertInfo = { "BLOCK": false, "EX": false, "CLIENT": false, "INTERNAL": false };

	// default callback
	this.exDefaultDaemonCallback = function (response) {
		exlog("exDefaultCallback", response);
		if (response) {
			var resPluginObj;
			if (response.NAME) {
				resPluginObj = eval(response.NAME);
			}

			if (response.ERR == "BLOCK") {
				if (!resPluginObj.alertInfo.BLOCK) {
					resPluginObj.alertInfo.BLOCK = true;
					if ("undefined" !== typeof INI_ALERT) {
						INI_ALERT(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_023, "WARN"); // " 라이센스를 확인하세요."
					} else {
						exalert(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_023); // " 라이센스를 확인하세요."
					}
					try {
						if (resPluginObj.exErrFunc) {
							eval(resPluginObj.exErrFunc)(response);
						}
					} catch (e) { }
				}
			} else if (response.ERR == "BLOCK:EX") {
				if (!resPluginObj.alertInfo.EX) {
					resPluginObj.alertInfo.EX = true;
					if ("undefined" !== typeof INI_ALERT) {
						INI_ALERT(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_024, "WARN"); // " 프로그램이 정상적으로 설치되지 않았습니다.\n재설치 후 진행하여주십시오."
					} else {
						exalert(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_024); // " 프로그램이 정상적으로 설치되지 않았습니다.\n재설치 후 진행하여주십시오."
					}
					try {
						if (resPluginObj.exErrFunc) {
							eval(resPluginObj.exErrFunc)(response);
						}
					} catch (e) { }
				}
			} else if (response.ERR == "BLOCK:CLIENT") {
				if (!resPluginObj.alertInfo.CLIENT) {
					resPluginObj.alertInfo.CLIENT = true;
					if ("undefined" !== typeof INI_ALERT) {
						INI_ALERT(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_024, "WARN"); // " 프로그램이 정상적으로 설치되지 않았습니다.\n재설치 후 진행하여주십시오."
					} else {
						exalert(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_024); // " 프로그램이 정상적으로 설치되지 않았습니다.\n재설치 후 진행하여주십시오."
					}
					try {
						if (resPluginObj.exErrFunc) {
							eval(resPluginObj.exErrFunc)(response);
						}
					} catch (e) { }
				}
			} else if (response.ERR == "BLOCK:INTERNAL") {
				if (!resPluginObj.alertInfo.INTERNAL) {
					resPluginObj.alertInfo.INTERNAL = true;
					if ("undefined" !== typeof INI_ALERT) {
						INI_ALERT(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_025, "WARN"); // " 프로그램이 중단되었습니다.\n페이지를 새로고침하세요."
					} else {
						exalert(response.NAME + CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_025); // " 프로그램이 중단되었습니다.\n페이지를 새로고침하세요."
					}
					try {
						if (resPluginObj.exErrFunc) {
							eval(resPluginObj.exErrFunc)(response);
						}
					} catch (e) { }
				}
			} else {
				exalert(CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_026, response); // "실행중 오류가 발생하였습니다.(EX)"
			}
		} else {
			exalert(CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_026, "InvokeCallback not response"); // "실행중 오류가 발생하였습니다.(EX)"
		}
	};

	/*
	 * Invoke
	 */
	this.Invoke = function (fname, args, exCallback, pageCallback) {

		var id = CROSSWEBEX_UTIL.createId();
		var obj = {};
		obj.id = id;
		obj.EXCallback = exCallback ? exCallback : null;
		obj.pageCallback = pageCallback ? pageCallback : null;
		obj.pluginName = this.exPluginName;
		this.exInterfaceArr.push(obj);

		var cmd = "native";
		this.InvokeDaemon(id, cmd, fname, args, exCallback);
	};

	/*
	 * SetPushCallback
	 */
	this.SetPushCallback = function (fname, args) {

		var id = CROSSWEBEX_UTIL.createId();
		var obj = {};
		obj.id = id;
		this.exInterfaceArr.push(obj);
		exlog(this.exPluginName + ".SetPushCallback.info", obj);

		var cmd = "setcallback";
		this.InvokeDaemon(id, cmd, fname, args);
	};

	this.InvokeDaemon = function (id, cmd, fname, args, callback) {

		var request = {};
		request.id = id;
		request.tabid = CROSSWEBEX_CONST.extabid;
		request.module = this.exModuleName;
		request.cmd = cmd;
		request.origin = location.origin != undefined ? location.origin : location.host;
		request.exfunc = {};
		request.exfunc.fname = fname;
		request.exfunc.args = args;
		request.callback = callback;
		if (this.exEcho) request.echo = true;

		try {
			exlog(this.exPluginName + ".InvokeDaemon.request", request);
			CROSSWEBEX_UTIL.sendWS(this.host, request, "CROSSWEBEX.InvokeCallback");
		} catch (e) {
			exalert(CROSSWEBEX_UTIL.loadStringTable().WARN.C_W_029); // "파라미터 생성중 오류가 발생하였습니다."
			exalert(e);
		}
	};

	this.InvokeCallback = function (response) {
		if (response) {
			try {
				exlog(this.exPluginName + ".InvokeCallback.response", response);
				if (typeof response == "object") {
					var strSerial = JSON.stringify(response);
				} else if (typeof response == "string") {
					response = JSON.parse(response);
				}
				response = response.response;

				var status = response.status;

				// success
				if (status == "TRUE") {
					var id = response.id;
					var funcInfo = {};
					for (var i = 0; i < this.exInterfaceArr.length; i++) {
						if (this.exInterfaceArr[i]) {
							var arrObj = this.exInterfaceArr[i];
							if (arrObj.id == id) {
								funcInfo = arrObj;
								this.exInterfaceArr.splice(i, 1);
								break;
							}
						}
					}

					var callback = funcInfo.EXCallback;
					var reply = response.reply.reply;
					var param = {};

					// run callback
					if (callback) {
						if (reply instanceof Array) {
							param.callback = funcInfo.pageCallback;
							var replyArr;
							replyArr = "[";
							for (var i in reply) {
								var str = reply[i];
								str = str.replace(/\\r/g, "\r");
								str = str.replace(/\\n/g, "\n");
								replyArr += "'" + str + "',";
							}
							replyArr += "]";
							param.reply = replyArr;

						} else if (typeof reply == 'string') {
							param.callback = funcInfo.pageCallback;
							param.reply = reply.replace(/\\r/g, "\r").replace(/\\n/g, "\n");

						} else if (typeof reply == 'object') {
							reply.callback = funcInfo.pageCallback;
							if (reply.status == "_CROSSWEBEX_BLOCK_") {
								var err = reply.err;
								eval(this.exDefaultCallbackName)({ "NAME": this.exPluginName, "ERR": err });
							} else {
								param = reply;
							}
						}

						if (!CROSSWEBEX_UTIL.typePlugin())
							eval(callback)(param);
						else
							setTimeout(function () { eval(callback)(param) }, 5);
					}
				} else if (status == "BLOCK") {
					exlog(this.exPluginName + ".InvokeCallback.response", response);
					exlog(this.exPluginName + ".InvokeCallback", "license not valid");
					eval(this.exDefaultCallbackName)({ "NAME": this.exPluginName, "ERR": "BLOCK" });
				} else if (status == "BLOCK:EX") {
					exlog(this.exPluginName + ".InvokeCallback.response", response);
					exlog(this.exPluginName + ".InvokeCallback", "CrossEX sig check fail");
					eval(this.exDefaultCallbackName)({ "NAME": this.exPluginName, "ERR": "BLOCK:EX" });
				} else if (status == "BLOCK:CLIENT") {
					exlog(this.exPluginName + ".InvokeCallback.response", response);
					exlog(this.exPluginName + ".InvokeCallback", "Client sig check fail");
					eval(this.exDefaultCallbackName)({ "NAME": this.exPluginName, "ERR": "BLOCK:CLIENT" });
				} else if (status == "BLOCK:INTERNAL") {
					exlog(this.exPluginName + ".InvokeCallback.response", response);
					exlog(this.exPluginName + ".InvokeCallback", "CrossEXClient fail");
					eval(this.exDefaultCallbackName)({ "NAME": this.exPluginName, "ERR": "BLOCK:INTERNAL" });
				} else {
					exlog(this.exPluginName + ".InvokeCallback.response", response);
					exlog(this.exPluginName + ".InvokeCallback", "native response status not TRUE");
					eval(this.exDefaultCallbackName)(response);
				}
			} catch (e) {
				exlog(this.exPluginName + ".InvokeCallback [exception]", e);
				exlog(this.exPluginName + ".InvokeCallback [exception]", "native response process exception");
				eval(this.exDefaultCallbackName)(response);
			}
		} else {
			exlog(this.exPluginName + ".InvokeCallback", "native call not response");
			eval(this.exDefaultCallbackName)();
		}
	};
};

// Static variable function set..
CROSSWEBEX_CHECK.moduleCheck = CROSSWEBEX_DAEMON.moduleCheck;
CROSSWEBEX_CHECK.daemonVersionCheck = CROSSWEBEX_DAEMON.daemonVersionCheck;
CROSSWEBEX_CHECK.setDaemonStatus = CROSSWEBEX_DAEMON.setDaemonStatus;
CROSSWEBEX_UTIL.sendWS = CROSSWEBEX_DAEMON.sendWS;
CROSSWEBEX_UTIL.executeFunctionByName = CROSSWEBEX_DAEMON.executeFunctionByName;
