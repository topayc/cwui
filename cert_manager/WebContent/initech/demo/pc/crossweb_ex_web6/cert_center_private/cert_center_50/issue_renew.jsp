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
</head>
<body bgcolor="#f3f4f5">
<div id=test_bed>

	<table border="0" width="800px">
		<tr><td align="right">
			<span id="menu_situation">PC Demo > INISAFE MoaSign S > ������������ ���� > ���������� ���� ����</span>
		</td></tr>
	</table>
	
	<jsp:include page="./test_menu.html" />
	
	<h1>����</h1>
	<div class="desc" style="width:800px;">
		<h3>INISAFE MoaSign �������� �׽�Ʈ�� �� �� �ֽ��ϴ�.</h3>
		<h3>�����ּ� : <%= request.getRequestURL() %></h3>
	</div>
	<br>
	
	<h1>MoaSign �������� ���� ����</h1>
	
	<div class="content" style="width:800px;">
		<form action="update.jsp" method="post" id="issueForm" name="issueForm" OnSubmit="return true;">
		<input type="hidden" id="isReissue" name="isReissue" value="on"/>
		<table class="basic_table" style="width:100%;">
		    <colgroup>
		        <col width="20%" />
		        <col width="40%" />
		        <col width="40%" />
		    </colgroup>
		    <tr>
	            <th>�׸�</th>
	            <th>����</th>
	            <th>���</th>
	        </tr>
	        <tr>
	            <td align="center"><b>�߱ޱ��(CA)</b></td>
	            <td>
	        		<select name="select_ca" id="select_ca" style="width:95%; height: 27px;"> 
						<option value="01">(01) ����������(KFTC)</option>
						<option value="03">(03) ��������(CrossCert)</option>
						<option value="04">(04) �ڽ���(SignKorea)</option>					
						<option value="05">(05) ��������(SignGate)</option>					
					</select>
				</td>
	            <td></td>
	        </tr>
	        <tr>
	            <td align="center"><b>�ֹ�/����ڹ�ȣ</b></td>
	            <td>
	        		<input type="text" name="regno" id="regno" style="width:95%" value="">
				</td>
	            <td></td>
	        </tr>
	        <tr>
	            <td align="center"><b>����ھ��̵�</b></td>
	            <td>
	        		<input type="text" name="userid" id="userid" value="" style="width:95%">
				</td>
	            <td>"-" ���� ���ڸ� �����Ͻʽÿ�.</td>
	        </tr>
		</table>
		<br/>
		<table border=0 width="100%">
			<tr>
				<td align="right">
					<input type="submit" class="button blue medium" value="������ ���� ��û" />
				</td>
			</tr>
		</table>
	</form>
	</div>
</div>
</body>
</html>