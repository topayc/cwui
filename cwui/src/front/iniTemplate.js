define([
	'../main/constants',
	'../conf/msgFactory',
  '../iniForm'
	], function(constants, msgFactory, iniForm){
	"use strict";

	var template,
	 	exported = {}; 
	
	/** 
	 * @description iniTemplate 초기화  
	 */ 
	function initialize(){
		template = iniForm;
	}
	
	/** 
	 * @description 템플릿 반환
	 * @param {string} 템플릿 이름
	 * @param {string} 템플릿 생성 옵션  
	 */ 
	function getTemplate(templateName, options){
		return !templateName ? template['iniForm']: getDefinedTemplate(templateName, options);
	}
	
	/** 
	 * @description 템플릿 반환
	 * @param {string} 템플릿 이름
	 * @param {string} 템플릿 생성 옵션  
	 */ 
	function getDefinedTemplate(templateName, options){
		var definedTemplate  = template[templateName];
		return definedTemplate; 
	}
	
	exported['initialize'] =  initialize;
	exported['getTemplate'] =  getTemplate;
	return exported;
});