/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * 국문 메시지 정보
 */
define([
        '../../conf/defaultConf'
        ], function (defaultConf) {

	/**
	 * @desc : 웹폼에 사용되는 문구
	 */
	var WebForm = (function() {
		
		var TITLE = (function(){
			var CUSTOMER_TITLE = (function(){
				return defaultConf.WebForm.CustomerTitleEng || 'INITECH';
			});
			var LOGIN_TITLE = (function(){
				return defaultConf.WebForm.LoginTitleEng || 'Login';
			}); 
			var SIGN_TITLE = (function(){
				return defaultConf.WebForm.SignTitleEng || 'Digital Sign';
			}); 
			var CERT_MANAGE_TITLE = (function(){
				return defaultConf.WebForm.CertManageTitleEng || 'Certificate management';
			}); 
			var CERT_ISSUE_TITLE = (function(){
				return defaultConf.WebForm.CertIssueTitleEng || 'Certificate issuance';
			}); 
			var CERT_REISSUE_TITLE = (function(){
				return defaultConf.WebForm.CertReissueTitleEng || 'Certificate reissuance';
			}); 
			var CERT_UPDATE_TITLE = (function(){
				return defaultConf.WebForm.CertUpdateTitleEng || 'Certificate renewal';
			});
			var CERT_REVOKE_TITLE = (function(){
				return defaultConf.WebForm.CertRevokeTitleEng || 'Certificate revocation';
			});
			var CERT_IMPORT_TITLE = (function(){
				return defaultConf.WebForm.CertImportTitleEng || 'Certificate importation';
			});
			var CERT_EXPORT_TITLE = (function(){
				return defaultConf.WebForm.CertExportTitleEng || 'Certificate exportation';
			});
			var M_CERT_IMPORT_TITLE = (function(){
				return defaultConf.WebForm.MCertImportTitleEng || 'Importing a certificate from smart phone';
			});
			var M_CERT_EXPORT_TITLE = (function(){
				return defaultConf.WebForm.MCertExportTitleEng || 'Exporting a certificate to smart phone';
			});
			
			return {
				CUSTOMER_TITLE : CUSTOMER_TITLE,
				LOGIN_TITLE : LOGIN_TITLE,
				SIGN_TITLE : SIGN_TITLE,
				CERT_MANAGE_TITLE : CERT_MANAGE_TITLE,
				CERT_ISSUE_TITLE : CERT_ISSUE_TITLE,
				CERT_REISSUE_TITLE : CERT_REISSUE_TITLE,
				CERT_UPDATE_TITLE : CERT_UPDATE_TITLE,
				CERT_REVOKE_TITLE : CERT_REVOKE_TITLE,
				CERT_IMPORT_TITLE : CERT_IMPORT_TITLE,
				CERT_EXPORT_TITLE : CERT_EXPORT_TITLE
			}
		});
		
		var TEXT = (function(){
			var COMMON = (function(){
				return {
					//common content
					'W_T_001' : 'Select a storage device.',
					'W_T_002' : 'Select a certificate.',
					'W_T_003' : 'Certificate password is case sensitive.',
					'W_T_004' : 'Enter certificate password.',
					'W_T_004_1' : 'You can enter the certificate password only with virtual keyboard because the security program is not installed.', //'W_T_004_1' : 'The security program is not installed, so Only Enter the certificate password with the keyboard security program.',
					'W_T_005' : 'Certificate Info',
					'W_T_006' : 'Confirm certificate password.', 
					'W_T_007' : 'No certificate exists on the selected device.',
					'W_T_008' : 'There is no certificate list.',
					'W_T_009' : 'Enter certificate pin number.',
					'W_T_010' : 'Smart authentication is in progress.',
					'W_T_011' : 'Check certificate pin number.',
					'W_T_012' : 'Select a certificate and enter password.',
					'W_T_013' : 'Select a location to save the certificate.',
					'W_T_014' : 'Select a menu.',
					'W_T_015' : 'Certificate pin number is case sensitive.',
					'W_T_016' : 'Certificate Detail Info',
					'W_T_017' : 'Certificate Info',
					'W_T_018' : "Selected",
					'W_T_019'	: 'Processing now',
					'W_T_020'	: 'Please wait a moment.',
					'W_T_021'	: 'Electronic signature will be done using the selected certificate.',
					'W_T_022'	: 'Click the storage device if certificates do not appear.',
					'W_T_023' : 'To save the certificate on the browser Click the',
					'W_T_024' : 'Find a certificate',
					'W_T_025' : 'to continue.',
					'W_T_026' : '※To enter using the keyboard <a href="javascript:top.shbComm.goPage(\'252800000000\');">Keyboard security program Install</a>.',
					'W_T_027' : 'The selected certificate will expire at ',
					'W_T_028' : ' 23:59:59. <br>Please renew the certificate from the bank that issued it.',
					'W_T_029' : 'Save smart phone certificate (UBIKey)',
					'W_T_030' : 'Save smart phone certificate (KFTC)',
					'W_T_031' : 'The hard disk certificcate is available after selecting hard disk .',
					'W_T_032' : '( Please, install Certificate program.)',
				}
			});
			
			var SIGN = (function(){
				return {
					'W_T_S_001' : 'Electronic signature is required on the following terms. If you agree with the term, enter certificate password and press OK.',
					'W_T_S_002' : 'Please read the barcode using ‘BaroSign’ App!',
//					'W_T_S_002' : 'e항목',
//					'W_T_S_003' : 'e서명내용'
				}
			});
			
			var CERT_MANAGE = (function(){
				return {
					// 상단 tab 
					'W_T_C_M_001' : 'User certificate',
					// 관리 창 버튼
					'W_T_C_M_005' : 'Certificate copy',
					'W_T_C_M_006' : 'Certificate delete',
					'W_T_C_M_007' : 'Certificate find',
					'W_T_C_M_008' : 'Certificate view',
					'W_T_C_M_009' : 'Change certificate password',
					'W_T_C_M_010' : 'Certificate exportation',
					'W_T_C_M_011' : 'If there is no certificate to be used,<br><b><em>login by finding a certificate.</em></b>',
					'W_T_C_M_012' : 'The certificate was issued successfully.',
					'W_T_C_M_013' : 'Delete',
					'W_T_C_M_014' : '<b>Would you like to <br>delete the certificate?</b>',
					//정범교
					'W_T_C_M_015' : '<b>It is safer to save certificates <br>on removable storage devices.<br>Would you like to additinally issue the certificate?</b>',
					'W_T_C_M_016' : '<b>It is safer to save certificates <br>on hard disk .<br>Would you like to additinally issue the certificate?</b>'
				}
			});
			
			var CERT_REMOVE = (function(){
				return {
					//sub title
					'W_T_C_R_001' : 'Certificate delete',
					//cert remove content
					'W_T_C_R_002' : 'Are you sure you want to delete the certificate?'
				}
			});
			
			var CERT_DETAIL = (function(){
				return {
					//sub title
					'W_T_C_D_001' : 'Certificate view',
					//nomal content
					'W_T_C_D_002' : 'Issued to',
					'W_T_C_D_003' : 'Issuer',
					'W_T_C_D_004' : 'Type',
					'W_T_C_D_005' : 'Expiration period',
					'W_T_C_D_006' : 'PC Time',
					
					//detail content
					'W_T_C_D_021' : 'Version',
					'W_T_C_D_022' : 'Serial number',
					'W_T_C_D_023' : 'Signature algorithm',
					'W_T_C_D_024' : 'Signature hash algorithm',
					'W_T_C_D_025' : 'Issuer',
					'W_T_C_D_026' : 'Vaild form',
					'W_T_C_D_027' : 'Vaild to',
					'W_T_C_D_028' : 'Subject',
					'W_T_C_D_029' : 'Authority Key Identifier',
					'W_T_C_D_030' : 'Subject key Identifier',
					'W_T_C_D_031' : 'Key Usage',
					'W_T_C_D_032' : 'Certificate Policies',
					'W_T_C_D_033' : 'Subject alternative name',
					'W_T_C_D_034' : 'CRL Distribution Points',
					'W_T_C_D_035' : 'Authority Information Point',
					'W_T_C_D_036' : 'Expiration period',
					
					// 사설인증서 종류
					'W_T_C_D_040' : 'Private'
				}
			});
			
			var CERT_SEARCH = (function(){
				return {
					'W_T_C_S_001' : 'Program importation',
					'M_W_T_C_S_001' : 'Device importation',
					'W_T_C_S_002' : 'Direct importation',
					'W_T_C_S_001_2' : 'What are direct importation and program importation?',
					'M_W_T_C_S_001_2' : 'What are direct importation and device importation?',
					'W_T_C_S_003' : 'Download the provided program and enter authentication code into the program to find certificates easily.',
					'W_T_C_S_004' : 'If you have path of P12 certificate file or folder, you can find and load the certificate.',
					'W_T_C_S_005' : 'Add certificate and private key file pair or P12 file and enter password of the certificate.',
					'W_T_C_S_006' : 'Install the program and enter authentication code.',
					'W_T_C_S_007' : 'Certificate (der) and private key file pair or *.p12, *.pfx files',
					'W_T_C_S_008' : 'Download the program first and enter program authenticaion code.',
					'W_T_C_S_008_1' :	'1.Importing from Shinhan S Bank<br>&nbsp;- Shinhan S Bank Digital Certificate Center > Smartphone > PC<br>&nbsp;- Enter 8 digits of authentication number created by Shinhan S Bank',
					'W_T_C_S_008_2' :	'2.Importing from Hard Drive<br>&nbsp;- Download program and click “Run”<br>&nbsp;- Enter 8 digits of authentication number created by Program',
					'W_T_C_S_009' : 'Authentication code',
					'W_T_C_S_010' : 'The certificate will be saved on the selected device.',
					'W_T_C_S_011' : 'Certificate find',
					'W_T_C_S_012' : 'First 4 digits of authentication code',
					'W_T_C_S_013' : 'Last 4 digits of authentication code',
					'W_T_C_S_014' : 'Use the provided program to find certificates easily. Certificate file of P12 format or folder containing certificate file can be found.',
					'M_W_T_C_S_014' : 'Certificate can be imported easily using a program on another device. Certificate file in P12 format can be found by designating a folder.',
					'W_T_C_S_015' : 'Enter authentication code displayed on the program screen and touch Next button.',
					'W_T_C_S_016' : 'Select a certificate.',
					'W_T_C_S_017' : '<i class="num">1</i>Connect to Shinhan Bank website on PC and open  <em>‘Copy Certificate to a Smart Phone → Export Certificate to a Device’</em> menu on the main screen.',
					'W_T_C_S_018' : '<i class="num">2</i>Enter password for the certificate to be copied onto PC, <em>enter the 8-digit authentication code</em> above, and press Next button.',
					'W_T_C_S_019' : '<i class="num">3</i>After copying the certificate from smart phone to PC, <em>check the completion message on smart phone and PC</em>.',
					
					'W_T_C_S_020' : '<i class="num">1</i>Click Find button, select a <em>‘P12 file’</em> and press Next button.',					
					'W_T_C_S_021' : '<i class="num">2</i>Enter <em>password of the certificate</em> found.',
					'W_T_C_S_022' : '<p>Find a P12 file and touch Next button.</p>',
					
					'W_T_C_S_023' : '<i class="num">1</i>Connect to Shinhan Bank website on PC and open <em>‘Copy Certificate to a Smart Phone → Import Certificate from a Device’</em> menu on the main screen.',
					'W_T_C_S_024' : '<i class="num">2</i>Enter password of the certificate to be copied from smart phone,  <em>nter the 8-digit authentication code</em> on the PC screen, and press OK button.',
					'W_T_C_S_025' : '<i class="num">3</i>After copying the certificate from PC to smart phone, <em>check the completion message on smart phone and PC</em>.',
					
					'M_W_T_C_S_017' : '<i class="num">1</i>Connect to Shinhan Bank website on PC and open <em>‘Copy Certificate to a Smart Phone → Export Certificate to a Device’</em> menu on the main screen.',
					'M_W_T_C_S_018' : '<i class="num">2</i>Enter password for the certificate to be copied onto PC, <em>enter the 8-digit authentication code</em> above, and press Next button.',
					'M_W_T_C_S_019' : '<i class="num">3</i>After copying the certificate from smart phone to PC, <em>check the completion message on smart phone and PC</em>.',
					
					'M_W_T_C_S_020' : '<i class="num">1</i>Click Find button, select a <em>‘P12 file’</em> and press Next button.',
					'M_W_T_C_S_021' : '<i class="num">2</i>Enter <em>password of the certificate</em> found.',
					'M_W_T_C_S_022' : '<p>Find a P12 file and touch Next button.</p>',
					
					'M_W_T_C_S_023' : '<i class="num">1</i>Connect to Shinhan Bank website on PC and open <em>‘Copy Certificate to a Smart Phone → Import Certificate from a Device’</em> menu on the main screen.',
					'M_W_T_C_S_024' : '<i class="num">2</i>Enter password of the certificate to be copied from smart phone, <em>enter the 8-digit authentication code</em> on the PC screen, and press OK button.',
					'M_W_T_C_S_025' : '<i class="num">3</i>After copying the certificate from PC to smart phone, <em>check the completion message on smart phone and PC</em>.',
					'M_W_T_C_S_026' : 'Device importation LInk.',
					'M_W_T_C_S_027' : 'Direct importation Link.',
				}
			});
			
			var CERT_EXPORT = (function(){
				return {
					//sub title
					'W_T_C_E_001' : 'Certificate exportation',
					//cert export content
					'W_T_C_E_002' : 'Would you like to export the certificate?'
				}
			});
			
			var CERT_COPY = (function(){
				return {
					//sub title
					'W_T_C_C_001' : 'Certificate Copying',
					//cert export content
					'W_T_C_C_002' : 'Would you like to copy the certificate?',
					'W_T_C_C_003' : 'Selection of storage device'
				}
			});
			
			var CERT_CHANGE_PW = (function(){
				return {
					'W_T_C_CP_001' : 'Change certificate password',
					'W_T_C_CP_002' : 'Enter certificate password',
					'W_T_C_CP_003' : 'New password',
					'W_T_C_CP_004' : 'Confirm new password',
					'W_T_C_CP_005' : 'Certificate password must be at least 10 digits long and include one English alphabet, number and special character.',
					'W_T_C_CP_006' : 'Change password',
					'W_T_C_CP_007' : 'Password has been changed.',
					'W_T_C_CP_008' : 'Confirm certificate password',
				}
			});
			
			var CERT_CMP = (function(){
				return {
					'W_T_C_CMP_001' : 'Certificate issuance',
					'W_T_C_CMP_002' : 'Certificate reissuance',
					'W_T_C_CMP_003' : 'Select a storage device and enter password.',
					'W_T_C_CMP_003_1' : 'Enter password.',
					'W_T_C_CMP_004' : 'It is safer to save certificates on removable storage devices such as security token and USB memory.',
					'W_T_C_CMP_005' : 'Would you like to issue the certificate?',
					'W_T_C_CMP_006' : 'Would you like to reissue the certificate?',
					'W_T_C_CMP_007' : 'Certificate renewal',
					'W_T_C_CMP_008' : 'Enter new certificate password to renew the certificate.',
					'W_T_C_CMP_009' : '',
					'W_T_C_CMP_010' : 'Would you like to renew the certificate?',
					'W_T_C_CMP_011' : 'Certificate revoke',
					'W_T_C_CMP_012' : 'Select a location and enter password.', 
					'W_T_C_CMP_013' : 'Enter certificate password',
					'W_T_C_CMP_014' : 'Enter password.',
				}
			});
			
			// 인증서 중계 가져오기/내보내기
			var CERT_IMPORT_EXPORT = (function(){
				return {
					"C_I_E_001" : "Certificate importation",
					"C_I_E_002" : "Certificate exportation",
					"C_I_E_003" : "After running certificate exportation, enter the 8-digit authentication code displayed on the screen.",
					"C_I_E_004" : "Enter the 8-digit authentication code displayed below into the device to import the certificate.",
					"C_I_E_005" : "Authentication code",
					"C_I_E_006" : "Refresh",
					"C_I_E_007" : "After running certificate importation, enter the 8-digit authentication code displayed on the screen.",
					"C_I_E_008" : "Enter the 8-digit authentication code displayed below into the device to export the certificate.",
					"C_I_E_009" : "Time remaining",
					"C_I_E_010" : "After running certificate importation, enter the 8-digit authentication code displayed on the screen.",
					"C_I_E_011" : "Close the window after completion of certificate import.",
					"C_I_E_012" : "<br>The certificate can be easily copied <br>by entering authentication code <br>displayed on the smart phone into the selected device.",
				}
			});
			
			return {
				COMMON : COMMON,
				SIGN : SIGN,
				CERT_MANAGE : CERT_MANAGE,
				CERT_DETAIL : CERT_DETAIL,
				CERT_REMOVE : CERT_REMOVE,
				CERT_SEARCH : CERT_SEARCH,
				CERT_EXPORT : CERT_EXPORT,
				CERT_COPY : CERT_COPY,
				CERT_CHANGE_PW : CERT_CHANGE_PW,
				CERT_CMP : CERT_CMP,
				CERT_IMPORT_EXPORT : CERT_IMPORT_EXPORT
			}
		});
		
		var BUTTON = (function(){
			return {
				// 공통
				'W_B_001' : 'Confirm',
				'W_B_002' : 'Cancel',
				'W_B_003' : 'Prev',
				'W_B_004' : 'Yes',
				'W_B_005' : 'No',
				'W_B_006' : 'Certificate view',
				'W_B_007' : 'Certificate importation',
				'W_B_008' : 'Certificate delete',
				'W_B_009' : 'Easy find',
				'W_B_010' : 'Find',
				'W_B_011' : 'Open Explorer',
				'W_B_012' : 'Program download',
				'W_B_013' : 'Issuance',
				'W_B_014' : 'Reissuance',
				'W_B_015' : 'Renewal',
				'W_B_016' : 'Revoke',
				'W_B_017' : 'Close',
				'W_B_018' : 'Find',
				'W_B_019' : 'Add',
				'W_B_020' : 'Next',
				'W_B_021' : 'FAQ',
				'W_B_022' : 'Certificate management',
				'W_B_023' : 'Window close'				
			}
		});
		
		/**
		 * @desc : Image Alt message
		 */
		var ALT = (function(){
			return {
				// 공통
				'W_ALT_001' : 'Close window',
				'W_ALT_002' : 'Click tab.',
				'W_ALT_003' : 'Shinhan bank',
			}
		});
		
		var CAPTION = (function(){
			return {
				// 공통
				'W_CAPTION_001' : 'Table that includes type, user, expiration period and issuer of certificates',
			}
		});
		
		/**
		 * @desc : Input PlaceHolder
		 */
		var PLACEHOLDER = (function(){
			return {
				// placeholder
				'W_PHR_001' : 'Select a certificate',
				'W_PHR_002' : 'Select a private key',
			}
		});
		
		/**
		 * @desc : web accessibility definition ( 웹 접근성 )
		 */
		var WEB_ACT_TITLE = (function(){
			return {
				
				'WEB_ACT_TITLE_001' : 'Click to close the window.',
				'WEB_ACT_TITLE_002' : 'Click to change tab.',
			}
		});	
		var CERT_ATTR_FIELD = (function(){
			return {
				'SUBJECT' : 'USER',
				'EXPIRE_STATUS' : '',
//				'EXPIRE_STATUS' : 'e상태',
				'EXPIRE_DATE' : 'Expiration period',
				'ISSUER' : 'Issuer',
				'OID_NAME' : 'TYPE'
			}
		});
		var CERT_ATTR_WIDTH = (function(){
			return {
				'SUBJECT' : '40%',
				'EXPIRE_STATUS' : '',
//				'EXPIRE_STATUS' : '상태',
				'EXPIRE_DATE' : '20%',
				'ISSUER' : '20%',
				'OID_NAME' : '20%'
			}
		});
		
		var CERT_EXPIRE_DESC = (function(){
			return {
				'VALID' : 'Normal',
				'IMMINENT' : 'Imminent',
				'INVALID' : 'Expiration'
			}
		});
		
		var CERT_ATTR_ISSUER = (function(){
			return {
				'Yessign' : 'Yessign',
				'SignGate' : 'Signgate',
				'SignKorea' : 'SignKorea',
				'CrossCert' : 'CrossCert',
				'TradeSign' : 'TradeSign',
				'NCA' : 'NCA',
				'UNKNOWN' : 'Private certification'
			}
		});
		
		return {
			TITLE : TITLE,
			TEXT : TEXT,
			BUTTON : BUTTON,
			ALT : ALT,
			CAPTION : CAPTION,
			PLACEHOLDER : PLACEHOLDER,
			WEB_ACT_TITLE : WEB_ACT_TITLE,
			CERT_ATTR_FIELD : CERT_ATTR_FIELD,
			CERT_ATTR_WIDTH : CERT_ATTR_WIDTH,
			CERT_ATTR_ISSUER : CERT_ATTR_ISSUER,
			CERT_EXPIRE_DESC : CERT_EXPIRE_DESC
		}
	});
	
	/**
	 * @desc : 오류코드 및 내용
	 */
	var Error = {
		/* 시스템 오류  ERR_1001 ~ ERR_1999 */
		'ERR_1000' : 'An unknown error has occurred.',
		'ERR_1001' : 'Current browser does not support cross domain repository.',
		'ERR_1002' : 'An error has occurred while saving repository.',
		'ERR_1003' : 'An error has occurred while deleting repository.',
		'ERR_1004' : 'An error has occurred while reading repository.',
		'ERR_1005' : 'An error has occurred while saving repository certificate ID.',
		'ERR_1006' : 'An error has occurred while reading repository certificate ID.',
		'ERR_1007' : 'An error has occurred while loading CA certificate.',
		'ERR_1008' : 'An error has occurred during communication with the server.',
		
		'ERR_1009' : 'This device ID is not supported or incorrect.',
		'ERR_1010' : 'The devie does not exist.',
		'ERR_1011' : 'Sub ID of the device has not been set.',
		'ERR_1012' : 'Pin number has not been set.',
		'ERR_1013' : 'Incorrect pin number',
		
		'ERR_1014' : 'The device is locked.',
		'ERR_1015' : 'The device is not ready.',
		'ERR_1016' : 'Loading of the certificate from the device failed.',
		'ERR_1017' : 'Certificate ID has not been set.',
		
		'ERR_1018' : 'Original text has not been set.',
		'ERR_1019' : 'Incorrect signature type',
		'ERR_1021' : 'Incorrect signature hash algorithm',
		'ERR_1022' : 'Password has not been set.',
		'ERR_1023' : 'Incorrect signature padding mode',
		'ERR_1024' : 'Incorrect server time',
		'ERR_1025' : 'Incorrect KFTC type',
		'ERR_1026' : 'Incorrect VID addition',
		'ERR_1027' : 'Additional information key has not been set.',
		'ERR_1028' : 'Additional information value has not been set.',
		'ERR_1029' : 'There is no certificate.',
		'ERR_1030' : 'Incorrect certificate ID',
		
		'ERR_1031' : 'Server time analysis failed.',
		'ERR_1032' : 'KFTC type conversion failed.',
		'ERR_1033' : 'Policy has not been set.',
		'ERR_1034' : 'Secure Nonce is not supported.',
		'ERR_1035' : 'Electronic signature was cancelled.',
		'ERR_1036' : 'Filter setting failed.',
		'ERR_1037' : 'VID random acquisition failed.',
		'ERR_1038' : 'An error has occurred during electronic signature.',
		'ERR_1039' : 'Invalid PDF signature type.',
		
		/* 설정 오류  ERR_2001 ~ ERR_2999 */
		'ERR_2001' : 'An error has occurred during certificate cache filter.',
		'ERR_2002' : 'An error has occurred while filtering certificate expiration period.',
		'ERR_2003' : 'An error has occurred during certificate OID filter.',
		'ERR_2004' : 'An error has occurred during certificate issuer O filter.',
		'ERR_2005' : 'An error has occurred during certificate issuer CN filter.',
		'ERR_2006' : 'An error has occurred during certificate issuer hash filter.',
		'ERR_2007' : 'An error has occurred during certificate filter.',
		'ERR_2008' : 'An error has occurred while checking expiration of the certificate.',
		
		
		/* PKI 오류  ERR_3001 ~ ERR_3999 */
		'ERR_3001' : 'An error has occurred while extracting certificate properties.',
		'ERR_3002' : 'An error has occurred while extracting detailed certificate information.',
		'ERR_3003' : 'An error has occurred during certificate conversion. Check whether the certificate is pem type.',
		'ERR_3004' : 'An error has occurred while changing password of the certificate.',
		'ERR_3005' : 'An error has occurred during PKCS#1 signature.',
		'ERR_3006' : 'An error has occurred during PKCS#7 electronic signature.',
		'ERR_3007' : 'An error has occurred while reading repository certificate private key.',
		'ERR_3008' : 'An error has occurred while reading repository certificate private key.',
		'ERR_3009' : 'An error has occurred while saving repository certificate private key.',
		'ERR_3010' : 'An error has occurred while saving private key of local repository certificate.',
		'ERR_3011' : 'An error has occurred while deleting private key of local repository certificate.',
		'ERR_3012' : 'An error has occurred while reading private key of local repository certificate.',
		'ERR_3013' : 'An error has occurred while reading private key of local repository certificate.',
		'ERR_3014' : 'An error has occurred while creating encryption key for private key.',
		
		
		/* Cipher 오류 ERR_4001 ~ ERR_4999 */
		'ERR_4001' : 'An error has occurred during encryption of symmetric key.',
		'ERR_4002' : 'An error has occurred during decryption of symmetric key.',
		'ERR_4003' : 'An error has occurred during encryption of asymmetric key.',
		'ERR_4004' : 'An error has occurred during decryption of asymmetric key.',
		'ERR_4005' : 'An error has occurred during creation of digest object.',
		'ERR_4006' : 'An error has occurred during creation of digest.',
		'ERR_4007' : 'An error has occurred during creation of HMac.',
		
		
		/* 인코딩 변환 오류 ERR_5001 ~ ERR_5999 */
		'ERR_5001' : 'An error has occurred during base64 encode.',
		'ERR_5002' : 'An error has occurred during base64 decode.',
		'ERR_5003' : 'An error has occurred during base64 encode.',
		'ERR_5004' : 'An error has occurred during base64 decode.',
		'ERR_5005' : 'An error has occurred duriong conversion of byte to hex.',
		'ERR_5006' : 'An error has occurred during conversion of hex to byte.',
		'ERR_5007' : 'An error has occurred during byte conversion.',
		'ERR_5008' : 'An error has occurred during random generation.',
		'ERR_5009' : 'An error has occurred during random generation.',
		'ERR_5010' : 'An error has occurred during date conversion.',
		'ERR_5011' : 'An error has occurred during date conversion.',
		'ERR_5012' : 'An error has occurred during iterator conversion.',
		'ERR_5013' : 'An error has occurred during ‘Array merge’.',
		'ERR_5014' : 'Date conversion format is incorrect.',
		'ERR_5015' : 'An error has occurred during conversion of date type.',
		
		/* UI화면 오류 ERR_6001 ~ ERR_6999 */
		'ERR_6001' : 'An error has occurred while displaying list of certificates.',
		'ERR_6002' : 'An error has occurred while displaying list of certificates.',
		'ERR_6003' : 'An error has occurred while changing password of the certificate.',
		'ERR_6004' : 'An error has occurred while copying the certificate.',
		'ERR_6005' : 'An error has occurred while deleting the certificate.',
		'ERR_6006' : 'An error has occurred while viewing details of certificate.',
		'ERR_6007' : 'An error has occurred while checking complexity of private key password.',
		
			
		/* 자사 제품 오류 ERR_7001 ~ ERR_8999 */
		'ERR_7001' : 'An error has occurred during certificate issuance.',
		'ERR_7002' : 'An error has occurred during certificate renewal.',
		'ERR_7003' : 'An error has occurred during certificate reissuance.',
		'ERR_7004' : 'There is no revoked certificate.',
		'ERR_7005' : 'An error has occurred during certificate revocation.',
		'ERR_7006' : 'Certificate exportation was cancelled.',
		'ERR_7007' : 'An error has occurred during certificate exportation.',
		'ERR_7008' : 'An error has occurred while saving the certificate.',
		'ERR_7009' : 'An error has occurred while reading the certificate.',
		'ERR_7010' : 'An error has ocurrred during public key request.',
		'ERR_7011' : 'An error has occurred during master key exchange.',
		'ERR_7012' : 'An error has occurred during collection of PC information.',
		'ERR_7013' : 'An error has occurred while finding the certificate.',
		'ERR_7014' : 'An error has occurred during enter password.',
		
		// javaScript CMP 오류
		'ERR_7101' : 'An error has occurred during certificate issuance.([REPLACE_CHAR])',
		'ERR_7102' : 'An error has occurred during certificate renewal.([REPLACE_CHAR])',
		'ERR_7103' : 'An error has occurred during certificate reissuance.([REPLACE_CHAR])',		
		'ERR_7105' : 'An error has occurred during certificate revocation.([REPLACE_CHAR])',
		
		/* 알수없는 오류 */
		'ERR_8888' : 'An unknown exception has occurred. Please retry.'
		/* 3rd 타사제품 오류  ERR_9001 ~ ERR_9999*/
		
	};
	
	/**
	 * @desc : 주의 매시지 문구
	 */
	var Warn = {
		'WARN_1000' : 'e',
		'WARN_1001' : 'Password is incorrect. Check and enter correct password.',
//		'WARN_1002' : 'P12 password is incorrect.',
		'WARN_1003' : 'Private key password has not been entered.',
		'WARN_1004' : 'Private key password can only contain English alphabets, numbers and special characters.',
		'WARN_1005' : 'Private key password must be at least 3 digits long and include one alphabet, number and special character.',
		'WARN_1006' : 'Private key password must be at least 10 digits long.',
		'WARN_1007' : 'Private key password cannot be more than 30 digits long.',
		'WARN_1008' : 'Private key password cannot repeat the same character three times or more.',
		'WARN_1009' : 'Private key password may not contain three or more ascending or descending characters.',
		'WARN_1010' : 'Password is incorrect. Check and enter correct password.',
		'WARN_1011' : 'This file format is not supported.',
		'WARN_1012' : 'Certificate password has not been entered. Check and enter password of the certificate.',
		'WARN_1013' : 'This OS is not supported.',
		'WARN_1014' : 'Authentication code has expired. \nPlease refresh authentication code.',
		'WARN_1015' : 'Select a certificate.',
		'WARN_1016' : 'Current certificate password and new certificate password have not been entered. Check and enter certificate password.',
		'WARN_1017' : 'Password of the certificate to be changed does not agree.',
		'WARN_1018' : 'Passwords do not agree.',
		'WARN_1019' : 'Select a storage device.',
		
		'WARN_1020' : 'Certificate file has not been selected.',
		'WARN_1021' : 'Private key file has not been selected.',
		'WARN_1022' : 'Two files are required for Der type, including private key and certificate.',
		'WARN_1023' : 'File list does not exist.',
		
		'WARN_1024' : 'This function is not supported on Internet Explorer 9.x or lower.',
		'WARN_1025' : 'This function is not supported on Internet Explorer.',
		'WARN_1026' : 'You cannot select the same storage device.',
		'WARN_1027' : 'The device is not ready.',
		'WARN_1028' : 'Enter authentication code.',
		'WARN_1029' : 'Certificates saved on a security token cannot be copied.',
		'WARN_1030' : 'Pin number has not been entered.',
		'WARN_1031' : 'New password cannot be identical to current certificate password.',
		'WARN_1032' : 'Pin number of security token has not been entered. Check and enter pin number.',
		'WARN_1033' : 'We are currently preparing for FAQ.',
		
		
		'WARN_1040' : 'Deletion of certificate was cancelled.',
		'WARN_1041' : 'Changing of certificate password was cancelled.',
		'WARN_1042' : 'Copying of certificate was cancelled.',
		'WARN_1043' : 'Certificate issuance was cancelled.',
		'WARN_1044' : 'Certificate renewal was cancelled.',
		'WARN_1045' : 'Certificate reissuance was cancelled.',
		'WARN_1046' : 'Certificate revocation was cancelled.',
		'WARN_1047' : 'Saving of certificate was cancelled.',
		'WARN_1048' : 'Certificate importation was cancelled.',
		
		'WARN_1049' : 'You must enter at least ',
		'WARN_1050' : ' digits.',
		'WARN_1051' : 'This is not a PKCS#12 certificate file.',
		'WARN_1052' : 'Select certificate and private key files.',
		'WARN_1053' : 'Select a P12 file.',
		'WARN_1054' : 'Select a certificate file to be found.',
		'WARN_1055' : 'An error has occurred while checking password policy.',
		'WARN_1056' : 'Certificate password cannot use special characters ().',
		'WARN_1058' : 'New certificate password has not been entered. Check and enter password of the certificate.',
		'WARN_1057' : 'Certificate password must be between 10 and 30 digits long.',
		'WARN_1059' : 'This is not a private key file.',		
		'WARN_1060' : 'This is not a Der certificate file.',		
		'WARN_1061' : 'There is no Certificate.'	
	};
	
	/**
	 * @desc : 안내 메시지 문구
	 */
	var Info = {
		'INFO_1001' : 'Saving of certificate is complete.',
		'INFO_1002' : 'Saving of the certificate is complete.',
		'INFO_1003' : 'Certificate exportation is complete.',
		'INFO_1004' : 'Certificate importation is complete.',
		'INFO_1005' : 'Deletion of certificate is complete.',
		'INFO_1006' : 'Certificate importation succeeded',
		'INFO_1007' : 'The certificate was loaded. This certificate is encrypted and cannot be previewed. Please enter password for the certificate to complete.',
		'INFO_1008' : 'A P12 certificate ([REPLACE_CHAR]) was found. This certificate is encrypted and cannot be previewed. Please enter password for the certificate.',
		'INFO_1009' : 'Security programs must be installed to use the service. \nMove to the installation page and install the programs.',
		'INFO_1010' : 'Password has been changed.',
		'INFO_1011' : 'Copying of certificate is complete.',
		'INFO_1012' : 'Would you like to install the security token?',
		'INFO_1012_1' : 'The device is not installed. Do you want to install?',
		'INFO_1013' : 'The virtual keypad is not installed or set up.',
	};
	
	return{
		WebForm : WebForm,
		Error : Error,
		Warn : Warn,
		Info : Info
	};
	
});