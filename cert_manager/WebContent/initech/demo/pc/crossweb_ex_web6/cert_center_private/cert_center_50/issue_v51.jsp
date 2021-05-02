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

		document.getElementById("regno").value = result;
		document.getElementById("userid").value = "T"+result;
	}

</script>
</head>

<body onLoad="generateValue()">
<div data-role="page" id="issue_page">
		<div data-theme="a" data-role="header">
			<a href="../login.html" data-role="button" data-icon="home" data-iconpos="notext" rel="external"></a>
			<h3>
				인증서 발급(v51)
			</h3>
		</div>
		<div data-role="content">
			<form action="issue_v51.jsp" method="post" name="issueForm" id="issueForm" data-ajax="false">
			주민/사업자번호<input type="text" id="regno" name="regno">
			사용자ID<input type="text" name="userid" id="userid" value="">
			이름/법인명<input type="text" name="detailname" id="detailname" value="홍길동(KILDONG.HONG)">
			전자우편<input type="text" name="usermail" id="usermail" value="hkd@initech.com">

			<input type="submit" value="인증서 등록 요청" />

		</form>
		</div>
	</div>
</body>
</html>