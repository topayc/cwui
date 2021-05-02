<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<%
	String menuNum = request.getParameter("menuNum");
	if(menuNum == null){
		menuNum = "101";
	}
%>
<!DOCTYPE html>
<html>

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

<script src="/initech/demo/common/script/jquery-3.2.1.min.js"></script>
<script src="/initech/demo/common/script/jquery-migrate-3.0.0.min.js"></script>
<script>
	//idongbu 공통 변수
	var $j	=	jQuery.noConflict();
</script>


<script type="text/javascript">
jQuery(function($){
	
	var selected_menu = '<%=menuNum%>';
	
	switch (selected_menu) {
	case "101":
	case "102":
	case "103":
		$('.ini-demo-gnb li#menu_100').addClass('selected');
		$('.ini-demo-gnb li#menu_100 ul li#' + selected_menu + ' a').addClass('selected');
		break;
	case "201":
	case "202":
	case "203":
	case "204":
	case "205":
		$('.ini-demo-gnb li#menu_200').addClass('selected');
		$('.ini-demo-gnb li#menu_200 ul li#' + selected_menu + ' a').addClass('selected');
		break;
	case "301":
		//인증서 관리
		$('.ini-demo-gnb li#menu_300').addClass('selected');
		$('.ini-demo-gnb li#menu_300 ul li#' + selected_menu + ' a').addClass('selected');
		break;
	case "401":
	case "402":
	case "403":
	case "404":
		//공인인증 센터
		$('.ini-demo-gnb li#menu_400 ul li#' + selected_menu + ' a').addClass('selected');
		$('.ini-demo-gnb li#menu_400').addClass('selected');
		break;
	case "501":
	case "502":
	case "503":
	case "504":
		//사설인증 센터
		$('.ini-demo-gnb li#menu_500 ul li#' + selected_menu + ' a').addClass('selected');
		$('.ini-demo-gnb li#menu_500').addClass('selected');
		break;
	case "601":
		//스마트폰 복사
		$('.ini-demo-gnb li#menu_600 ul li#' + selected_menu + ' a').addClass('selected');
		$('.ini-demo-gnb li#menu_600').addClass('selected');
		break;
	}
});

function emulAcceptCharset(form) {
	if (form.canHaveHTML || navigator.userAgent.match(/(edge)\/?\s*(\.?\d+(\.\d+)*)/i)) { // detect IE or Edge
        document.charset = form.acceptCharset;
    }
    return true;
}

function goPage(menuNum){
	var pageUrl = "";
	if(menuNum){
		switch (menuNum) {
		case "101":
			//로그인
			pageUrl = "../login/login_form_test.jsp";
			break;
		case "102":
			//INNER 로그인
			pageUrl = "../login/inner_login_form_test.jsp";
			break;
		case "103":
			//로그인(iniplugin)
			pageUrl = "../login/iniplugin_login_form_test.jsp";
			break;
		case "201":
			//전자서명
			pageUrl = "../sign/sign_form_test.jsp";
			break;
 		case "202":
 			//전자서명(yessign)
			pageUrl = "../sign/yessign_form_test.jsp";
			break;
 		case "203":
 			//전자서명(iniplugin)
			pageUrl = "../sign/iniplugin_sign_form_test.jsp";
			break;
 		case "204":
 			//다건전자서명(multi)
			pageUrl = "../sign/multi_sign_form_test.jsp";
			break;
		case "205":
			//전자서명(pdf)
			pageUrl = "../sign/pdf_sign_form_test.jsp";
			break;	
		case "301":
			//인증서 관리
			pageUrl = "../manager/manager_test.jsp";
			break;
		case "401":
			//신규발급/재발급
			pageUrl = "../cert_center_public/issue_form_test.jsp";
			break;
		case "402":
			//신규발급/재발급
			pageUrl = "../cert_center_public/reissue_form_test.jsp";
			break;
		case "403":
			//갱신
			pageUrl = "../cert_center_public/renew_test.jsp";
			break;
		case "404":
			//폐기
			pageUrl = "../cert_center_public/revoke_test.jsp";
			break;
		case "501":
			//사설CA 7.0 발급
			pageUrl = "../cert_center_private/issue_form_test.jsp";
			break;
		case "502":
			//사설CA 7.0 재발급
			pageUrl = "../cert_center_private/reissue_form_test.jsp";
			break;
		case "503":
			//사설CA 7.0 갱신
			pageUrl = "../cert_center_private/renew_test.jsp";
			break;
		case "504":
			//사설CA 7.0 폐기
			pageUrl = "../cert_center_private/revoke_test.jsp";
			break;
		case "601":
			//기기간복사
			pageUrl = "../cert_import_export/cert_import_export_test.jsp";
			break;
		default:
			break;
		}
	} else {
		pageUrl = "../login/login_form_test.jsp";
		menuNum = "101";
	}
	document.location.href = pageUrl + "?menuNum=" + menuNum;
	return false;
}
</script>
	<!-- local navigation start -->
	<section class="ini-demo-gnb-wrapper">
		<h2><a href="javascript:void(null);return false;" class="btn-menu visible-xs-block"><span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span> <span>전체메뉴</span></a></h2>
		<nav class="scrollableNav" >
			<ul class="ini-demo-gnb">
				<li id="menu_100">
					<a href="#" onclick="javascript:goPage('101'); return false;">로그인</a>  <!-- 선택된 메뉴 -->
					<ul>
						<li id="101"><a href="#" onclick="javascript:goPage('101'); return false;">공인인증서 로그인</a></li>  <!-- 선택된 메뉴 -->
<!-- 						<li id="102"><a href="#" onclick="javascript:goPage('102'); return false;">INNER 로그인</a></li> -->
						<li id="103"><a href="#" onclick="javascript:goPage('103'); return false;">로그인(iniplugin)</a></li>
					</ul>
				</li>
				<li id="menu_200">
					<a href="#" onclick="javascript:goPage('201'); return false;">전자서명</a>
					<ul>
						<li id="201"><a href="#" onclick="javascript:goPage('201'); return false;">전자서명( pkcs7 )</a></li>
 						<li id="202"><a href="#" onclick="javascript:goPage('202'); return false;">전자서명( yessign )</a></li>
						<li id="205"><a href="#" onclick="javascript:goPage('205'); return false;">전자서명( pdf )</a></li>
 						<li id="203"><a href="#" onclick="javascript:goPage('203'); return false;">전자서명( iniplugin )</a></li>						
 						<li id="204"><a href="#" onclick="javascript:goPage('204'); return false;">다건전자서명</a></li>
					</ul>
				</li>
				<li id="menu_300">
					<a href="#" onclick="javascript:goPage('301'); return false;">공인인증서 관리</a>
					<ul>
						<li id="301"><a href="#" onclick="javascript:goPage('301'); return false;">인증서 관리</a></li>
					</ul>
				</li>
				
				<li id="menu_400">
					<a href="#" onclick="javascript:goPage('401'); return false;">공인인증센터</a>
					<ul>
						<li id="401"><a href="#" onclick="javascript:goPage('401'); return false;">공인인증서 신규발급</a></li>
						<li id="402"><a href="#" onclick="javascript:goPage('402'); return false;">공인인증서 재발급</a></li>
						<li id="403"><a href="#" onclick="javascript:goPage('403'); return false;">공인인증서 갱신</a></li>
						<li id="404"><a href="#" onclick="javascript:goPage('404'); return false;">공인인증서 폐기</a></li>
					</ul>
				</li>
				
				<li id="menu_500">
					<a href="#" onclick="javascript:goPage('501'); return false;">사설인증센터</a>
					<ul>
						<li id="501"><a href="#" onclick="javascript:goPage('501'); return false;">사설인증서 신규발급</a></li>
						<li id="502"><a href="#" onclick="javascript:goPage('502'); return false;">사설인증서 재발급</a></li>
						<li id="503"><a href="#" onclick="javascript:goPage('503'); return false;">사설인증서 갱신</a></li>
						<li id="504"><a href="#" onclick="javascript:goPage('504'); return false;">사설인증서 폐기</a></li>
					</ul>
				</li>
				
				<li id="menu_600">
					<a href="#" onclick="javascript:goPage('601'); return false;" style="font-size:1.2em;">기기간 인증서 복사</a>
					<ul>
						<li id="601"><a href="#" onclick="javascript:goPage('601'); return false;">기기간 인증서 복사</a></li>
					</ul>
				</li>
			</ul>
			<a href="javascript:void(null);return false;" class="btn-demo-menu-close"><img src="../../../common/images/dum_layer_close.png" alt="전체메뉴 닫기"></a>
		</nav>
	</section>
	<!-- local navigation end -->
	
</html>