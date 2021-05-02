define([
	'../main/constants',
	'../conf/msgFactory'
	], function(constants, msgFactroy){
	"use strict";

	var modue = {};
	function postConfirm(_handleInfo){}
	function postCertCopy(_handleInfo){}
	var exported = {};
	exported['postCertCopy'] = postCertCopy;
	return exported;
});