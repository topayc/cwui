<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="java.io.*,java.util.*,java.text.*,java.lang.*,java.net.*" %>
<%
	InetAddress inet = InetAddress.getLocalHost();
	String _HostName_ = inet.getHostName();
	String _HostAddr_ = inet.getHostAddress();
	String _RemoteAddr_ = request.getRemoteAddr();
	long _TotalMemory_ = Runtime.getRuntime().totalMemory()/ 1000 ;
	long _FreeMemory_ = Runtime.getRuntime().freeMemory()/ 1000;
	DateFormat myDate = new SimpleDateFormat("yyyy-MM-dd hh:mm ss");
	Date currentTime = new Date();				// 현재 시간
	String _CurrentTime_ =  myDate.format(currentTime);
%>
<%
	StringBuffer sb_provider = new StringBuffer();
	StringBuffer sb_crypto = new StringBuffer();
	StringBuffer sb_pkg = new StringBuffer();
	StringBuffer sb_plus = new StringBuffer();
	StringBuffer sb_cs = new StringBuffer();
	StringBuffer sb_ocsp = new StringBuffer();
	StringBuffer sb_common = new StringBuffer();

%>
<%
	StringBuffer sb_path = new StringBuffer();

	String classpath = System.getProperty("java.class.path");

/*	{

		int j = 115;
		int ii = 0;
		for (ii=0; ii<classpath.length()-j; ii=ii+j) {
			sb_path.append(classpath.substring(ii, j+ii) + "<br>");
		}
		sb_path.append(classpath.substring(ii, classpath.length()));
	}
*/
	StringTokenizer st = new StringTokenizer(classpath, ";");
	out.println("<br>");
	while(st.hasMoreTokens()) {
		String key = st.nextToken();
		sb_path.append("<img src='bullet.gif' border='0'>");
		if (    (key.indexOf("INIC") >-1) || (key.indexOf("jCert") >-1) || (key.indexOf("INIT") >-1)
			 || (key.indexOf("INIS") >-1)  || (key.indexOf("Plugin") >-1) || (key.indexOf("jOCS") >-1)
			 || (key.indexOf("jVID") >-1)  || (key.indexOf("jCERT") >-1) || (key.indexOf("jCRL") >-1)
			 || (key.indexOf("KFTC") >-1)  || (key.indexOf("Xenon") >-1) || (key.indexOf("Sign") >-1)
			 || (key.indexOf("IniD") >-1)  || (key.indexOf("PKCS") >-1) || (key.indexOf("jSVS") >-1)
			 || (key.indexOf("CSP") >-1)  || (key.indexOf("Double") >-1) || (key.indexOf("INIL") >-1)
			 || (key.indexOf("CA") >-1)  || (key.indexOf("RA") >-1) || (key.indexOf("Artemis") >-1)

		
			)
			sb_path.append("<b>" + key + "</b><br>");
		else
			sb_path.append(key + "<br>");
	}

%>
<%
{
	java.security.Provider [] provider = java.security.Security.getProviders();
	for (int i=0;i<provider.length;i++) {
		sb_provider.append("<img src='bullet.gif' border='0'>");
		sb_provider.append("<b>");
//		sb_provider.append((i+1)+ "[" + provider[i].getName() + "]");
		sb_provider.append((i+1)+ "[" + provider[i].toString() + "]");
		sb_provider.append("</b></font> : ");
		sb_provider.append(provider[i].getInfo());
//		sb_provider.append("key = " + provider[i].keySet());
//		sb_provider.append(" = " + provider[i].values());
//		java.security.Security.removeProvider(provider[i].getName());
		sb_provider.append("<br></font>\n");

	}
}
%>
<%
{
	String[] pkgName =	{	"Cipher(<a href='./Provider.txt'>README</a>)",
							"PBEKeySpec",
							"sun jce",
							"sunrsasign",
							"forge",
							"jce",
							"cryptix-jce12-provider",
							"Base64Util"

						};
	String[] clasName = {	"/javax/crypto/Cipher.class",
							"/javax/crypto/spec/PBEKeySpec.class",
							"/sun/security/provider/Sun.class",
							"/com/sun/rsajca/Provider.class",
							"/au/com/forge/provider/ForgeProvider.class",
							"/au/net/aba/crypto/provider/ABAProvider.class",
							"/cryptix/jce12/provider/Cryptix.class",
							"/com/initech/util/Base64Util.class"
						};

	for (int i=0; i<clasName.length; i++) {
		java.net.URL clasUrl = this.getClass().getResource(clasName[i]);
		sb_crypto.append("<img src='bullet.gif' border='0'>");
		if (clasUrl != null) {
			sb_crypto.append("");
			sb_crypto.append("<b>" + pkgName[i] + "</b>(" + clasName[i] + ")</font>\n");

			sb_crypto.append("<br>&nbsp;&nbsp;&nbsp;");
			sb_crypto.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
			sb_crypto.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
			sb_crypto.append("<font size='2' color='navy'>");
			sb_crypto.append(clasUrl.getFile());
			sb_crypto.append("</font>");

/*			if (clasName[i].equals("/com/initech/provider/crypto/InitechProvider.class")) {
				sb_crypto.append("<br>&nbsp;&nbsp;&nbsp;");
				sb_crypto.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
				sb_crypto.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
				sb_crypto.append("<font size='2' color='navy'>");
				sb_crypto.append("version : <b>" + com.initech.provider.crypto.InitechProvider.getKryptonVersion() + "</b>");
				sb_crypto.append("</font>");
			}
*/		} else {
			sb_crypto.append("");
			sb_crypto.append(pkgName[i] + "(" + clasName[i] + ") not found");
			sb_crypto.append("</font>");
		}
		sb_crypto.append("<br>");
	}
}
%>

<%
{
	String[] pkgName =	{	"INICrypto(<a href='./CryptoVersion.jsp'>Version</a>)",

							"CertPathValidator",
							"INITools",
							"INICommon",

							"jPKCS7",
							"Xenon",
						};
	String[] clasName = {	"/com/initech/provider/crypto/InitechProvider.class",

							"/com/initech/cpv/CertPathValidator.class",
							"/com/initech/misc/PropertyUtil.class",
							"/com/initech/common/logger/IniLogger.class",

							"/com/initech/pkcs/pkcs7/InitechPKCS7Provider.class",
							"/com/initech/pkcs/pkcs12/InitechPKCS12Provider.class",
						};

	for (int i=0; i<clasName.length; i++) {
		java.net.URL clasUrl = this.getClass().getResource(clasName[i]);
		sb_common.append("<img src='bullet.gif' border='0'>");
		if (clasUrl != null) {
			sb_common.append("");
			sb_common.append("<b>" + pkgName[i] + "</b>(" + clasName[i] + ")</font>\n");

			sb_common.append("<br>&nbsp;&nbsp;&nbsp;");
			sb_common.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
			sb_common.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
			sb_common.append("<font size='2' color='navy'>");
			sb_common.append(clasUrl.getFile());
			sb_common.append("</font>");

		} else {
			sb_common.append("");
			sb_common.append(pkgName[i] + "(" + clasName[i] + ") not found");
			sb_common.append("</font>");
		}
		sb_common.append("<br>");
	}
}
%>


<%
{
	String[] pkgName =	{	"INISAFE_Web",

							"INISAFE_Mail",

							"jCRL",
							"INISAFE_File",

						};
	String[] clasName = {	"/com/initech/iniplugin/IniPlugin.class",

							"/com/initech/inimas/INICipher.class,",
	
							"/com/initech/iniplugin/crl/CheckCRL.class", 
							"/com/initech/iniplugin/file/IniFileUpload.class",

						};

	for (int i=0; i<clasName.length; i++) {
		java.net.URL clasUrl = this.getClass().getResource(clasName[i]);
		sb_pkg.append("<img src='bullet.gif' border='0'>");
		if (clasUrl != null) {
			sb_pkg.append("");
			sb_pkg.append("<b>" + pkgName[i] + "</b>(" + clasName[i] + ")</font>\n");

			sb_pkg.append("<br>&nbsp;&nbsp;&nbsp;");
			sb_pkg.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
			sb_pkg.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
			sb_pkg.append("<font size='2' color='navy'>");
			sb_pkg.append(clasUrl.getFile());
			sb_pkg.append("</font>");

		} else {
			sb_pkg.append("");
			sb_pkg.append(pkgName[i] + "(" + clasName[i] + ") not found");
			sb_pkg.append("</font>");
		}
		sb_pkg.append("<br>");
	}
}
%>


<%
{
	String[] pkgName =	{	"jCERTOID_v1",
							"jVID_v1",
							"OCSPCD(jPKI.jar)",
							"KFTCVerifier",
							"CertVerifier_IVS_v1.0.1(GPKI)",
							

							"jOCSPGD_v1",
							"IniCA",
		
							"IniOPPRA",
							"IniRA",
							"IniRA2",

						};
	String[] clasName = {	"/com/initech/iniplugin/oid/CertOIDUtil.class",
							"/com/initech/iniplugin/vid/VID.class",
							"/com/initech/pkix/ocsp/OCSPManager.class",

							"/com/initech/svs/SVSManager.class",
							"/com/initech/gpki/ivs/IVSManager.class",

							"/com/initech/ocspgd/OCSPGD.class",
							"/com/initech/IniCA.class",

							"/com/initech/oppra/IniOPPRA.class",
							"/com/initech/IniRA/IniLDAPutil.class",
							"/com/initech/IniRA2/IniLDAPutil.class",

						};


	for (int i=0; i<clasName.length; i++) {
		java.net.URL clasUrl = this.getClass().getResource(clasName[i]);
		sb_ocsp.append("<img src='bullet.gif' border='0'>");
		if (clasUrl != null) {
			sb_ocsp.append("");
			sb_ocsp.append("<b>" + pkgName[i] + "</b>(" + clasName[i] + ")</font>\n");

			sb_ocsp.append("<br>&nbsp;&nbsp;&nbsp;");
			sb_ocsp.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
			sb_ocsp.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
			sb_ocsp.append("<font size='2' color='navy'>");
			sb_ocsp.append(clasUrl.getFile());
			sb_ocsp.append("</font>");

		} else {
			sb_ocsp.append("");
			sb_ocsp.append(pkgName[i] + "(" + clasName[i] + ") not found");
			sb_ocsp.append("</font>");
		}
		sb_ocsp.append("<br>");
	}
}
%>

<%
{
	String[] pkgName =	{	"IniDLX",
							"INIPlugin4Java.jar(Applet Client SDK)",

							"DoubleEncrypt"
						};
	String[] clasName = {	"/com/initech/IniDLX/IniDLX.class",
							"/com/initech/plugin/protocol/IniPluginProtocol.class",

							"/com/initech/doublencrypt/DoubleEncrypt.class"
						};


	for (int i=0; i<clasName.length; i++) {
		java.net.URL clasUrl = this.getClass().getResource(clasName[i]);
		sb_cs.append("<img src='bullet.gif' border='0'>");
		if (clasUrl != null) {
			sb_cs.append("");
			sb_cs.append("<b>" + pkgName[i] + "</b>(" + clasName[i] + ")</font>\n");

			sb_cs.append("<br>&nbsp;&nbsp;&nbsp;");
			sb_cs.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
			sb_cs.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
			sb_cs.append("<font size='2' color='navy'>");
			sb_cs.append(clasUrl.getFile());
			sb_cs.append("</font>");

		} else {
			sb_cs.append("");
			sb_cs.append(pkgName[i] + "(" + clasName[i] + ") not found");
			sb_cs.append("</font>");
		}
		sb_cs.append("<br>");
	}
}
%>


<%
{
	String[] pkgName =	{	
							"INILog4J.jar",
							"log4j-1.2.8.jar",
						};
	String[] clasName = {	

							"/com/initech/common/logger/LogManager.class",
							"/org/apache/log4j/Logger.class",

						};


	for (int i=0; i<clasName.length; i++) {
		java.net.URL clasUrl = this.getClass().getResource(clasName[i]);
		sb_plus.append("<img src='bullet.gif' border='0'>");
		if (clasUrl != null) {
			sb_plus.append("");
			sb_plus.append("<b>" + pkgName[i] + "</b>(" + clasName[i] + ")</font>\n");

			sb_plus.append("<br>&nbsp;&nbsp;&nbsp;");
			sb_plus.append("<font face='돋움' color='#2F83C3'><span style='font-size:8pt;'>");
			sb_plus.append("<img src='rp_bullet.gif' width='7' height='7' border='0'> </span></font>");
			sb_plus.append("<font size='2' color='navy'>");
			sb_plus.append(clasUrl.getFile());
			sb_plus.append("</font>");

		} else {
			sb_plus.append("");
			sb_plus.append(pkgName[i] + "(" + clasName[i] + ") not found");
			sb_plus.append("</font>");
		}
		sb_plus.append("<br>");
	}
}
%>


<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=euc-kr">
	<style type="text/css">
	body {
		font-family : 굴림;
		font-size : 9pt;
		font-color:gray;
	}
	td { font-family : 굴림; font-size : 9pt; color:#000000;}
	</style>
</head>

<body>

<table border='0' cellpadding='2' cellspacing='0' width='749'>
    <tr>
		<td colspan='2'><p align='left'><a href="javascript:location.reload();"><%=CROSSWEBEX_UTIL.loadStringTable().TEXT.C_T_016%></a></p></td><!--새로고침-->
	</tr>
    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>Server Info</b></p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
			<table cellpadding='0' cellspacing='0'>
				<td width=350>
					<img src='bullet.gif' border='0'>HostName : <b><%=_HostName_%></b><br>
					<img src='bullet.gif' border='0'>HostAddress : <b><%=_HostAddr_%></b><br>
					<img src='bullet.gif' border='0'>RemoteAddr : <b><%=_RemoteAddr_%></b>
				</td>
				<td>
					<img src='bullet.gif' border='0'>currentDate : <b><%=_CurrentTime_%></b><br>
					<img src='bullet.gif' border='0'>totalMemory : <b><%=_TotalMemory_%> Kbytes</b><br>
					<img src='bullet.gif' border='0'>freeMemory : <b><%=_FreeMemory_%> Kbytes</b>
				</td>
			</table>
		</td>
	</tr>
    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>Provider Check</b>(com.initech.provider.crypto.InitechProvider)</p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
<%=sb_provider.toString()%>
		</td>
    </tr>

    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>JAVA Default JCE & ETC  Package Search</b></p></td>
	</tr>
    <tr>
		<td bgcolor='#F5F6F4'>
<%=sb_crypto.toString()%>
        </td>
    </tr>

    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>INITECH JCE & Common Package  Search</b></p></td>
	</tr>
    <tr>
		<td bgcolor='#F5F6F4'>
<%=sb_common.toString()%>
        </td>
    </tr>


    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>INITECH Product Package Search</b></p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
<%=sb_pkg.toString()%>
        </td>
    </tr>

    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>INITECH OCSP/CERT Package Search</b></p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
<%=sb_ocsp.toString()%>
        </td>
    </tr>



    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>INITECH C/S Package Search</b></p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
<%=sb_cs.toString()%>
        </td>
    </tr>


    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>INITECH ETC Package Search</b></p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
<%=sb_plus.toString()%>
        </td>
    </tr>

    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>java.class.path</b></p></td>
	</tr>
    <tr>
        <td bgcolor='#F5F6F4'>
<%=sb_path.toString()%>
		</font></td>
    </tr>


    <tr>
		<td colspan='2' bgcolor='silver'><p align='center'><b>Server Environment</b></p></td>
	</tr>
    <tr>
		<td bgcolor='#F5F6F4'><table>

<%
	Enumeration e = System.getProperties().propertyNames();
	while(e.hasMoreElements())
	{
		String key = (String)e.nextElement();
		String tmp = System.getProperty(key);
		String value = "";
		int j = 77;
		int ii = 0;
		for (ii=0; ii<tmp.length()-j; ii=ii+j) {
			value += tmp.substring(ii, j+ii) + "<br>";
		}
		value += tmp.substring(ii, tmp.length());
		if (key.equals("java.class.path")) continue;

%>
    <tr>
		<td bgcolor='#F5F6F4'><img src='bullet.gif' border='0'><%=key%></td>
        <td bgcolor='#F5F6F4'><%=value%>
		</font></td>
    </tr>
<%
	}
%>
	</table></td>



	</tr>

</table>

<br>
<br>

</body>
</html>