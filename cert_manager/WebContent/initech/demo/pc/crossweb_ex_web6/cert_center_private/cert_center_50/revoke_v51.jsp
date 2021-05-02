<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1" />
<link rel="stylesheet" href="../css/jquery.mobile-1.1.0-rc.1.min.css" />
<script src="../js/jquery-1.7.1.min.js"></script>
<script src="../js/jquery.mobile-1.1.0-rc.1.min.js"></script>
<script src="../moasign.js"></script>
<script>
	function login(form) {
		moa_login("revokeLogin", form, login_callback);
		return false;
	}

	function login_callback(retcode) {		
        if(retcode != null && retcode != "" && retcode == "1" ){
            document.issueForm.submit();
        } else if(retcode == "2") {
            alert('에러');
        } else if(retcode == "3") {
            alert('취소');
        } else {
            alert('알 수 없는 오류가 발생했습니다.');
        }
	}
</script>
</head>

<body>
<div data-role="page" id="issue_page">
		<div data-theme="a" data-role="header">
			<a href="../login.html" data-role="button" data-icon="home" data-iconpos="notext" rel="external"></a>
			<h3>
				인증서 폐기(v51)
			</h3>
		</div>
		<div data-role="content">
			'제출' 버튼을 클릭하여 폐기할 인증서를 제출하십시오.
			<form action="revoke_v51.jsp" method="post" name="issueForm" id="issueForm" data-ajax="false" onSubmit="return login(document.issueForm);">
			
				<input type="hidden" id="moa_securedata" name="moa_securedata" />

			<input type="submit" value="인증서 제출" /> 
		</form>
		</div>
	</div>
</body>
</html>