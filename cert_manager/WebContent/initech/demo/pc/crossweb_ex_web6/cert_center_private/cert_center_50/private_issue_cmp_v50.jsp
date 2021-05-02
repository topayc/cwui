<%@ page language="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR">

<link href="/common/style/body_style.css" rel="stylesheet" type="text/css"></link>
<link href="/common/style/table_style.css" rel="stylesheet" type="text/css"></link>
<link href="/common/style/text_style.css" rel="stylesheet" type="text/css"></link>
<link href="/common/style/form_style.css" rel="stylesheet" type="text/css"></link>

<script src="/initech/common/common.js"></script>
<script src="/common/script/jquery-1.11.1.js"></script>
<script src="/common/script/jquery.mobile-1.1.0-rc.1.min.js"></script>
<script language="javascript" src="/demo/pc/moasign/script/moasign.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	generateValue();
});
function generateValue() {
	var result = "7";
	for(var i=0 ; i<12 ; i++) {
		result += Math.floor(Math.random() * 10); 
	}

	document.getElementById("user_id").value = "T"+result;
}
</script>

</head>
<body bgcolor="#f3f4f5">
<div id=test_bed>

	<table border="0" width="800px">
		<tr><td align="right">
			<span id="menu_situation">PC Demo > INISAFE MoaSign S > �缳�������� ���� > �߱�/��߱�(cmp, v5.0)</span>
		</td></tr>
	</table>
	
	<jsp:include page="./test_menu.html" />
	
	<h1>����</h1>
	<div class="desc" style="width:800px;">
		<h3>INISAFE MoaSign �缳�������� �׽�Ʈ�� �� �� �ֽ��ϴ�.</h3>
		<h3>�ش� ���������� �߱��ϴ� �������� �׽�Ʈ�� ������ �Դϴ�.</h3>
		<h3>���� �������� ���� �� �׽�Ʈ, ��������θ� ����ϼž� �մϴ�.</h3>
		<h3>�����ּ� : <%= request.getRequestURL() %></h3>
	</div>
	<br>
	
	<h1>MoaSign �缳�������� �߱�/��߱�(cmp, v5.0) ����</h1>
	
	<form action="issue.jsp" method="post" name="issueForm" id="issueForm">
	<div class="content" style="width:800px;">
		<h3>�߱� ���� �Է�</h3>
		<table border=0>
			<tr>
				<td width="20px" rowspan="2"></td>
				<td width="750px">
				<!-- �Է� ����  -->
					<table class="basic_table" style="width:100%;">
		            <colgroup>
		                <col width="20%" />
		                <col width="30%" />
		                <col width="50%" />
		            </colgroup>            
		            <tr>
		                <th>�Է� �׸�</th>
		                <th>�Է� ����</th>
		                <th>���</th>
		            </tr>
		            <tr>
		            	<td align="center"><b>�����ID</b></td>
		            	<td>
		            		<input type="text"  name="user_id" id="user_id" style="width:95%"/>
		            	</td>
		            	<td></td>
		            </tr>
		            </table>
					<input type="hidden" id="entity_type" name="entity_type" value="USER">
					<input type="hidden" id="profile" name="profile" value="Identification">
					<input type="hidden" id="group" name="group" value="Default Group">
					<input type="hidden" id="refNum" name="refNum">
					<input type="hidden" id="authCode" name="authCode">
				</td>
			</tr>
			<tr>
				<td align="right">
					<input type="submit" onclick="send_form();" class="button blue medium" value="������ ��� ��û"/>
				</td>
			</tr>
		</table>
	</div>
	</form>
	<div style="width:800px;" align="right">
		<a href="javaScript:view_source('<%=request.getRequestURL()%>');"> &lt; .jsp �ҽ����� &gt; </a>
	</div>
</div>
</body>
</html>