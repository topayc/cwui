<%@ page import="com.raonsecure.touchenkey.*"%>
<%@ page contentType="text/html; charset=euc-kr" %>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
</head>
<script type="text/javascript" src="/Transkey/rsa_oaep_files/rsa_oaep-min.js"></script>
<script type="text/javascript" src="/Transkey/jsbn/jsbn-min.js"></script>
<script type="text/javascript" src="/Transkey/TranskeyLibPack_op.js"></script>
<script type="text/javascript" src="./transkey_crt.js"></script>
<link rel="stylesheet" type="text/css" href="/Transkey/transkey.css" />

<!-- 2017.05.11 Transkey 스크립트 호출 끝 -->
<body style="overflow-x:hidden; overflow-y:hidden; border:0;" scroll="no">
	<form action="" id="form" name="form" method="post">
		<table border="0">
			<tr>
				<td>
					<img src="./inputkey.jpg"> 
				</td>
				<td>
				<div id="transkey1" name="transkey1">
						<input type="password" id="password_crt"  name="password_crt" security="off" style="width: 396px;" readOnly autocomplete="off" data-tk-kbdxy2="-181 0"></input>
				</div>
				</td>
			</tr>
		</table>
	</form>
	<span id="setkey"></span><br>
	<span id="result"></span>
	<script>
	var transkey2;
	/*if(navigator.userAgent.match("Linux")) {
		document.getElementById("password_crt").setAttribute("data-tk-kbdxy",'-183 0');
	}
	
	if(navigator.userAgent.match("Opera")) {
		document.getElementById("password_crt").setAttribute("data-tk-kbdxy","-183 0");
	}*/
	
		function InitechCrtTransKey(){
            tk_useTranskey = true;
            use_onlyTransKey = true;
			initTranskey();
			transkey2 = new TransKey ('transkey1', 0, 0, transkey_surl, 'qwerty_crt', '50', 'password');
            transkey2.useTransKey = true;
		}
		
		function onCrtEnter(){
			var encRandomData = new GenKey().GenerateKey(128);
			var chiperData = transkey2.getCipherData(encRandomData,"crt");
			callInitechCrt(encRandomData,chiperData);
		}
		
		function callInitechCrt(encRandomData,chiperData){
            /*var sPort = location.port;
            if(sPort.length<=0){
		        sPort = '80';
		    }*/
			var sPort=<%= request.getServerPort() %>
		  location.href = "transkey://"+location.hostname+":"+sPort+"/?rand="+encRandomData+"&result="+chiperData+"&domainport=www.initech.com:1234";
		}
		
		function onfocusInput(){
			InitechCrtTransKey();
			tk.onKeyboard(document.getElementById('password_crt'));
		}

		if(window.attachEvent)
			window.attachEvent("onload",function(){onfocusInput()});
		else
			window.addEventListener("load",function(){onfocusInput();},false);
	</script>
  </body>
</html>