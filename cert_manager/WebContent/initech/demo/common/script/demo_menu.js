jQuery(function($){
	$('.snb li').click(function(ev) {			
			$('.snb li.on').removeClass('on');
			ev.preventDefault();
			$(this).addClass('on');
			location.href = $(this).attr('name');
		});
	});
	
	function clearMenu() {		
		$('.snb li.on').removeClass('on');
	}
	
	function selectMenu(idx) {
		$('.snb li.on').removeClass('on');
		$('li:eq(' + idx +')').addClass('on'); 
	}
	
    // html dom 이 다 로딩된 후 실행된다.
    jQuery(document).ready(function(){
        jQuery(".menu>a").click(function(){
//             jQuery(this).next("ul").toggleClass("hide");
        	var submenu = jQuery(this).next("ul");
        	 
            if( submenu.is(":visible") ){
                submenu.slideUp();
            }else{
                submenu.slideDown();
            }
        });
    });
