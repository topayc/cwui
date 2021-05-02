<%@ page import="java.io.IOException,com.initech.iniplugin.*" %>
<%
	/*
	************************
	Request object 사용 INIT()
	************************
	*/
	String m_IniErrCode = null;
	String m_IniErrMsg = null;
	
	IniPlugin m_IP = new IniPlugin(request,response,WEB_CONF_PATH);
	
	/*
	************************
	Post Data 확인
	************************
	*/
	String INIdata = request.getParameter("INIpluginData");
	
	if (INIdata == null) 
	{
	              m_IniErrCode = "PLUGIN_000";
	              m_IniErrMsg = "Exception : INIpluginData is null";              
	}
	  else 
	{
	              try {
	                           m_IP.init();
	              } catch(PrivateKeyDecryptException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(CRLFileNotFoundException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(PropertyFileNotFoundException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	              } catch(PrivateKeyFileNotFoundException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	              } catch(CACertFileNotFoundException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	              } catch(INIpluginDataAbnormalFormatException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(LongParseException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(PrivateKeyParseException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(CRLFileParseException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();                           
	              } catch(CACertFileParseException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(ClientCertParseException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(AbnormalPropertyFileException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(PropertyNotFoundException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();                           
	              } catch(VerifyDataDecryptException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(AbnormalVerifyDataException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(ExpiredVerifyDataException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();                           
	              } catch(ClientCertValidityException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();	                           
	              } catch(SignatureVerifyException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(ClientCertRevokedException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(SessionKeyException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(EncryptDataException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(DecryptDataException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(CRLFileIOException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(PropertyFileIOException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(PrivateKeyFileIOException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(CACertFileIOException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(PropertyFileParseException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(VerifyFlagException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(IOException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(SignDataException e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              } catch(Exception e) {
	                           m_IniErrMsg = "Exception : " + e.getMessage();
	                           
	              }
	}
%>
