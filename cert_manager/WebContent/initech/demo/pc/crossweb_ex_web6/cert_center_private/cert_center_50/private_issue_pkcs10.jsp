<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../css/jquery.mobile-1.1.0-rc.1.min.css" />
<script src="../js/jquery-1.7.1.min.js"></script>
<script src="../js/jquery.mobile-1.1.0-rc.1.min.js"></script>

<script>
	function generateValue() {
		var result = "7";
		for(var i=0 ; i<12 ; i++) {
			result += Math.floor(Math.random() * 10); 
		}

		document.getElementById("user_id").value = "T"+result;
	}


</script>
</head>

<body onLoad="generateValue();">
<div data-role="page" id="issue_page">
		<div data-theme="a" data-role="header">
			<a href="../login.html" data-role="button" data-icon="home" data-iconpos="notext" rel="external"></a>
			<h3>
				PKCS#10 발급(v50)
			</h3>
		</div>
		<div data-role="content">
			<form action="issue_pkcs10.jsp" method="post" name="issueForm" id="issueForm" data-ajax="false">
			사용자ID<input type="text" name="user_id" id="user_id" value="">
			<input type="hidden" id="entity_type" name="entity_type" value="USER">
			<input type="hidden" id="profile" name="profile" value="Identification">
			<input type="hidden" id="group" name="group" value="Default Group">

			<input type="hidden" id="refNum" name="refNum">
			<input type="hidden" id="authCode" name="authCode">
			<input type="hidden" id="userDN" name="userDN">

			<!-- input type="submit" value="인증서 등록 요청" / -->
			<button id="registBtn" name="registBtn">인증서 등록 요청</button>
		</form>
		</div>
	</div>
</body>
</html>