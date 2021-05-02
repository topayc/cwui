$j(document).ready(function(){
	$j(window).on("orientationchange", function(){
		
		$j(".scrollableNav").css("height",($j(document).height()-10)+"px");

	});
	/* 2017_03_23 max-height 에서 변경 height */	
	$j(".ini-demo-contents").css("max-height",($j(document).height())+"px");
	/* 2017_03_23 주석처리 */	
	/*$(".ini-demo-contents").css("overflow-y","auto");*/
	$j('.btn-menu').on('click', function(){
		$j(this).hide();		
		$j(".scrollableNav").addClass("scrollable-nav");		
		$j(".scrollableNav").css("max-height",($j(document).height()-10)+"px");
		
		$j('.ini-demo-gnb').show();
		$j('.btn-demo-menu-close').show();
	});
	$j('.btn-demo-menu-close').on('click', function(){
		$j(this).hide();
		$j(".scrollableNav").removeClass("scrollable-nav");
		$j(".ini-demo-gnb-wrapper").css("height","auto");
		$j('.ini-demo-gnb').hide();
		$j('.btn-menu').show();
	});
})