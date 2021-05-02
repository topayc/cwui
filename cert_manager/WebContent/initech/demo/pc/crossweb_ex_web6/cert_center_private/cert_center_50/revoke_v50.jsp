<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../css/jquery.mobile-1.1.0-rc.1.min.css" />
<script src="../js/jquery-1.7.1.min.js"></script>
<script src="../js/jquery.mobile-1.1.0-rc.1.min.js"></script>

<script>

$(function() {
	$("#revokeBtn").click(function(){
		$.getJSON("http://demo.initech.com:7080/initech/certcenter/revoke_async.jsp?jsoncallback=?", 
		{
			user_id: document.getElementById("user_id").value			
		},
		function(data) {
			var result = data.result;

			if( result == "1" ) {
				alert('usercert: ' + data.userCert);
				document.getElementById("usercert").value = data.userCert;
				document.issueForm.submit();
			} else {
				alert("유효한 인증서가 없습니다.");
			}
		});
		}
	);
});

</script>
</head>

<body>
<div data-role="page" id="issue_page">
		<div data-theme="a" data-role="header">
			<a href="../login.html" data-role="button" data-icon="home" data-iconpos="notext" rel="external"></a>
			<h3>
				인증서 폐기(v50)
			</h3>
		</div>
		<div data-role="content">
			<form action="revoke_v50.jsp" method="post" name="issueForm" id="issueForm" data-ajax="false" onSubmit="return false;">
			사용자ID<input type="text" name="user_id" id="user_id" value="">
			
			<input type="hidden" id="usercert" name="usercert">

			<!--
			<input type="submit" value="인증서 폐기 요청"/>
			-->
			<button type="button" id="revokeBtn" name="revokeBtn">인증서 폐기 요청</button>
		</form>
		</div>
	</div>
</body>
</html>