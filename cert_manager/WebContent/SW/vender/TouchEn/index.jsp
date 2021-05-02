<!DOCTYPE HTML>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<script type="text/javascript" src="/lib/jquery/jquery-1.11.3.min.js"></script>
<script type="text/javascript">
var TNK_SR = '';

function GetEncDataInitech() {
    var pubkey = "-----BEGIN CERTIFICATE-----MIIDSzCCAjOgAwIBAgIJAOYjCX4wgWIVMA0GCSqGSIb3DQEBCwUAMGcxCzAJBgNVBAYTAktSMR0wGwYDVQQKExRSYW9uU2VjdXJlIENvLiwgTHRkLjEaMBgGA1UECxMRUXVhbGl0eSBBc3N1cmFuY2UxHTAbBgNVBAMTFFJhb25TZWN1cmUgQ28uLCBMdGQuMB4XDTEzMTIzMDAxNTAxMloXDTIzMTIyODAxNTAxMlowRzELMAkGA1UEBhMCS1IxGzAZBgNVBAoTElJhb25TZWN1cmUgQ28uLEx0ZDEbMBkGA1UEAxMSUmFvblNlY3VyZSBDby4sTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsXWsBJXwRwoTwGbSwYZbyGWJsdNg8JM6lZ15hVMzRrz7epFAHqX0xcigLcLUTNoLmnegcn1Kvq96zxMyn8A7YJt1bjx2lHOwF5BC+yDVSeylKcsa4HUQ7gUUswzR7K+Ck3tUFklNp+CnsT/uq5s8lixWddepvhmqRCuBhSRoNDpw/KY8x5ZK8VByoRI8mIouwTTaMTT8BD0XV55YN6JR2QkE9doANlinByG2SLcI8zQFw5D2J+gnX006gNYmjqk4FXBQZNMsGP5o2CdOuor39j17jkhdzi6iJ0W87/7LbWaVh462ULuCN/iT5kbLSToeL4lAiUdhJKVTpK5n4AooLwIDAQABoxowGDAJBgNVHRMEAjAAMAsGA1UdDwQEAwIF4DANBgkqhkiG9w0BAQsFAAOCAQEAlh7htO04E4as1OiLRVBpwnBEFgYtDNq9dyb8KbBI/fqa3ny6xf8Fg+RIgHjP1d//hAe/9tXNDapJ9tC//5ikpCNTTsE4fVGLb0nfimSA4ZrqXL8p2METZ36oymxoxl1vL30FmmOst0TfgcF5YM9C+4wNsXq8qj+JtRejrImEjA7oW6pJOcnWutjrXlFKEDYHYymWfOiZqHQtWBwCv8P8PjD8jRJxPpKLpfsQU6MatAHXNsuYc0orUsG6wUxjwTTorBlSnjBnXeFsUK5UXaWK81tnN57dw2pT8OZoZw2JwCxCED6o+U8uqgZfioK4DTByHxdkssoOhjyot+0hYEGa9A==-----END CERTIFICATE-----";
    var frmName = "frm";
    var eleName = "certpwd";
    TK_GetEncInitech(frmName, eleName, pubkey, initechCallback);
}

function initechCallback(result) {
  alert(result);
}

</script>
<script type="text/javascript" src="/vender/TouchEn/nxKey/js/TouchEnNx.js"></script>

</head>

<body>
<form id="frm" name="frm" method="post" action="result.jsp">
	인증서암호 :<input type="password" title="password" id="certpwd" name="certpwd" data-enc="on" />
	<input type="button" value="암호화 확인" onclick="GetEncDataInitech();" ></input>	
</form>
</body>
</html>
