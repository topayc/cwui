/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
/**
 * @desc : Message Factory
 */
define([
        '../main/constants',
        '../conf/defaultConf',
        '../conf/msgFactory',
        '../main/system'
        ], function (constants, defaultConf, msgFactory, system) {
	
	var proc = function(param){
		var resultMSG = errorCodeMapping(param.PARAMS.CODE);
		if(msgFactory.getMessageFactory().Error[resultMSG]){
			resultMSG = msgFactory.getMessageFactory().Error[resultMSG];
		} else if(msgFactory.getMessageFactory().Warn[resultMSG]){
			resultMSG = msgFactory.getMessageFactory().Warn[resultMSG];
		} else {
			resultMSG = "An unknown error has occurred.";
		}
		INI_HANDLE.warnMessage(resultMSG);
	}
	
	function errorCodeMapping(code){
		var html5ErrorCode = "ERR_1000";
		switch (code){
			// 기타
			case "0001" :
				// Failed to parse JSON string(JSON 문자열 변환에 실패했습니다)
			case "0002" :
				// Unsupported protocol version (지원하지 않는 버전입니다)
			case "0003" :
				// Unsupported command (지원하지 않는 명령입니다)
				break;
				
			// 버전 취득
			case "0101" :
				// The file does not exist (파일이 존재하지 않습니다)
				break;
				
			// 속성 설정
			case "0201" :
				// The property list is not set(속성 리스트가 설정되지 않았습니다)
			case "0202" :
				// The property key is not set(속성 키가 설정되지 않았습니다)
			case "0203" :
				// The property value is not set(속성 값이 설정되지 않았습니다)
			case "0204" :
				// Failed to set property(속성 설정에 실패했습니다)
				break;
				
			// 결과취득
			case "0301" :
				// 결과 없음
				break;
				
			// 인증서 장치 리스트 취득
			case "0401" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0402" :
				// No devices were found(장치가 없습니다)
				html5ErrorCode = "ERR_1010";
				break;
			
			// 인증서 리스트 취득
			case "0501" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0502" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "0503" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "0504" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "0505" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "0506" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
//			case "0507" :
//				// Failed to get certificate from device(장치에서 인증서를 가져오는데 실패했습니다)
//				html5ErrorCode = "ERR_1016";
//				break;
//			case "0508" :
//				// No certificates were found(인증서가 없습니다)
//				html5ErrorCode = "00";
//				GINI_StandbyCallBack.getCallback(param.TRANS_SEQ)(param);
//				break;
				
			// 전자서명
			case "0601" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0602" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "0603" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "0604" :
				// The certificate ID is not set(인증서 ID 가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "0605" :
				// The original data is not set(원문이 설정되지 않았습니다)
				html5ErrorCode = "ERR_1018";
				break;
			case "0608" :
				// Invalid password(비밀번호가 틀렸습니다.)
				html5ErrorCode = "WARN_1001";
				break;
			case "0615" :
				// No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "0616" :
				// Invalid device ID(잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0617" :
				// Invalid sub-device ID(잘못된 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0618" :
				// Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "0619" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "0620" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "0621" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "0626" :
				// The digital sign has been canceled(전자서명이 취소 되었습니다)
				html5ErrorCode = "ERR_1035";
				break;
			case "0627" :
				// Failed to set filter(필터 설정에 실패했습니다)
				html5ErrorCode = "ERR_1036";
				break;
			case "0628" :
				// Failed to get VID random(VID random 취득에 실패했습니다)
				html5ErrorCode = "ERR_1037";
				break;
			case "0622" :
				// Failed to parse server time(서버시간 분석에 실패했습니다)
			case "0623" :
				// Failed to convert to KFTC format(금결원 형식 변환에 실패했습니다)
			case "0624" :
				// The policy is not set(정책이 설정되지 않았습니다)
			case "0625" :
				// The secure nonce does not supported(Secure Nonce 는 지원되지 않습니다)
			case "0699" :
				// Failed to digital sign(전자서명에 실패했습니다)
			case "0606" :
				// Invalid signature kind(잘못된 서명 구분 입니다)
			case "0607" :
				// Invalid signature hash algorithm(잘못된 서명 해쉬 알고리즘 입니다)
			case "0609" :
				// Invalid signature padding mode(잘못된 서명 패딩 모드 입니다)
			case "0610" :
				// Invalid server time(잘못된 서버 시간 입니다)
			case "0611" :
				// Invalid yessign type(잘못된 금결원 형식 입니다)
			case "0612" :
				// Invalid VID including(잘못된 VID 추가 입니다)
			case "0613" :
				// The unauthenticated attribute key is not set(추가 정보 키가 설정되지 않았습니다)
			case "0614" :
			case "0633" :
			case "0634" :
			case "0635" :
			case "0636" :
				// The unauthenticated attribute value is not set(추가 정보 값이 설정되지 않았습니다)
				html5ErrorCode = "ERR_1038";
				break;
			case "0637" :
				// Invalid PDF signature type(잘못된 PDF 서명 형식입니다.)
				html5ErrorCode = "ERR_1039";
				break;
			// 삭제
			case "0701" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0702" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "0703" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "0704" :
				// The certificate ID is not set(인증서 ID 가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "0705" :
				// No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "0706" :
				// Invalid device ID(잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0707" :
				// Invalid sub-device ID(잘못된 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0708" :
				//Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "0709" :
				//Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "0710" :
				//The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "0711" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "0799" :
				//Failed to delete certificate(인증서 삭제에 실패했습니다)
				html5ErrorCode = "ERR_6005";
				break;
			
			// 암호변경
			case "0801" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0802" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "0803" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "0804" :
				// The certificate ID is not set(인증서 ID 가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "0807" :
				// No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "0808" :
				// Invalid device ID(잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0809" :
				// Invalid sub-device ID(잘못된 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0810" :
				// Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "0811" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "0812" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "0813" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "0805" :
				// 0805 Invalid previous password(이전 비밀번호가 틀렸습니다.)
				html5ErrorCode = "WARN_1001";
				break;
			case "0806" :
				// The new password is not set(새로운 비밀번호가 설정되지 않았습니다)
			case "0814" :
				// Failed to delete certificate(인증서 삭제에 실패했습니다)
			case "0815" :
				// Failed to save certificate(인증서 저장에 실패했습니다)
			case "0899" :
				// Failed to change password(암호변경에 실패했습니다)
				html5ErrorCode = "ERR_6003";
				break;
			
			// 인증서 복사
			case "0901" :
				// Unsupported source device ID or Invalid source device ID(지원하지 않는 원본 장치 ID 이거나 잘못된 원본 장치 ID 입니다)
			case "0902" :
				//Unsupported target device ID or Invalid target device ID(지원하지 않는 대상 장치 ID 이거나 잘못된 대상 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0903" :
				// The source sub-device ID is not set(원본 장치 하위 ID가 설정되지 않았습니다)
			case "0904" :
				//The target sub-device ID is not set(대상 장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "0905" :
				//The source pin number is not set(원본 핀 번호가 설정되지 않았습니다)
			case "0906" :
				//The target pin number is not set(대상 핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "0907" :
				//The certificate ID is not set(인증서 ID 가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "0909" :
				//No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "0910" :
				//Invalid source device ID(잘못된 원본 장치 ID 입니다)
			case "0911" :
				//Invalid source sub-device ID(잘못된 원본 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "0912" :
				//Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "0918" :
				//Invalid target pin number(잘못된 대상 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "0919" :
				//The target device is locked(대상 장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "0920" :
				//The target device is not ready(대상 장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "0908" :
				//Invalid password(비밀번호가 틀렸습니다.)
			case "0914" :
				//The private key is not set(개인키가 설정되지 않았습니다)
				html5ErrorCode = "WARN_1001";
				break;
			case "0913" :
				//The certificate is not set(인증서가 설정되지 않았습니다)
			case "0915" :
				//Failed to load certificate(인증서 읽기에 실패했습니다)
			case "0916" :
				//Failed to load private key(개인키 읽기에 실패했습니다)
			case "0917" :
				//Failed to load certificate from source device(원본 장치의 인증서 읽기에 실패했습니다)
			case "0921" :
				//Not enough memory to save certificate(인증서를 저장하기 위한 메모리가 부족합니다)
			case "0922" :
				//Failed to save certificate to target device(대상 장치의 인증서 저장에 실패했습니다)
			case "0923" :
				//Failed to load KM certificate(KM 인증서 읽기에 실패했습니다)
			case "0924" :
				//Failed to load KM private key(KM 개인키 읽기에 실패했습니다)
				html5ErrorCode = "ERR_6004";	//복사 실패.
				break;
				
				
			// 인증서 발급
			case "1001" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1002" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1003" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "1004" :
				// The password is not set(비밀번호가 설정되지 않았습니다)
			case "1005" :
				// Unsupported CA name or Invalid CA name(지원하지 않는 CA 이름 이거나 잘못된 CA 이름 입니다)
			case "1006" :
				// The CA IP is not set(CA IP 가 설정되지 않았습니다)
			case "1007" :
				// The CA port is not set(CA PORT 가 설정되지 않았습니다)
			case "1008" :
				// The reference value is not set(참조번호가 설정되지 않았습니다)
			case "1009" :
				// The authorized code is not set(인가코드가 설정되지 않았습니다)
			case "1010" :
				// Invalid pin number(잘못된 핀 번호 입니다)
			case "1011" :
				// The device is locked(장치가 잠겨 있습니다)
			case "1012" :
				// The device is not ready(장치가 준비되지 않았습니다)
			case "1013" :
				// Failed to issue certificate(인증서 발급에 실패했습니다)
				html5ErrorCode = "ERR_7001";
				break;
			
			// 인증서 갱신
			case "1101" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1102" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1103" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "1113" :
				// No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "1114" :
				// Invalid device ID(잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1115" :
				// Invalid sub-device ID(잘못된 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1116" :
				// Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "1117" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "1118" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "1119" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "1104" :
				// Invalid password(이전 비밀번호가 틀렸습니다.)
				html5ErrorCode = "WARN_1001";
				break;
			case "1105" :
				// The new password is not set(신규 비밀번호가 설정되지 않았습니다)
			case "1106" :
				// Unsupported CA name or Invalid CA name(지원하지 않는 CA 이름 이거나 잘못된 CA 이름 입니다)
			case "1107" :
				// The CA IP is not set(CA IP 가 설정되지 않았습니다)
			case "1108" :
				// The CA port is not set(CA PORT 가 설정되지 않았습니다)
			case "1109" :
				// The certificate is not set(인증서가 설정되지 않았습니다)
			case "1110" :
				// The private key is not set(개인키가 설정되지 않았습니다)
			case "1111" :
				// Failed to load certificate(인증서 읽기에 실패했습니다)
			case "1112" :
				// Failed to load private key(개인키 읽기에 실패했습니다)
			case "1120" :
				// Failed to delete certificate(인증서 삭제에 실패했습니다)
			case "1121" :
				// Failed to save certificate(인증서 저장에 실패했습니다)
			case "1122" :
			case "1123" :
				// Failed to load KM certificate(KM 인증서 읽기에 실패했습니다)
			case "1124" :
				// Failed to load KM private key(KM 개인키 읽기에 실패했습니다)
			case "1199" :
				// Failed to update certificate(인증서 갱신에 실패했습니다)
				html5ErrorCode = "ERR_7002";
				break;
				
			// 인증서 재발급
			case "1201" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1202" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1203" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "1210" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "1211" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "1212" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
				
			case "1204" :
				// The previous password is not set(이전 비밀번호가 설정되지 않았습니다)
			case "1205" :
				// Unsupported CA name or Invalid CA name(지원하지 않는 CA 이름 이거나 잘못된 CA 이름 입니다)
			case "1206" :
				// The CA IP is not set(CA IP 가 설정되지 않았습니다)
			case "1207" :
				// The CA port is not set(CA PORT 가 설정되지 않았습니다)
			case "1208" :
				// The reference value is not set(참조번호가 설정되지 않았습니다)
			case "1209" :
				// The authorized code is not set(인가코드가 설정되지 않았습니다)
			case "1213" :
				// Failed to reissue certificate(인증서 재발급에 실패했습니다)
				html5ErrorCode = "ERR_7003";
				break;
				
			// 인증서 폐기
			case "1301" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1302" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1303" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "1307" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "1308" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "1309" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "1312" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "1313" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "1314" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "1311" :
				// No certificates were revoked(폐지된 인증서가 없습니다)
				html5ErrorCode = "ERR_7004";
				break;
			case "1304" :
				// Unsupported CA name or Invalid CA name(지원하지 않는 CA 이름 이거나 잘못된 CA 이름 입니다)
			case "1305" :
				//The certificate serial is not set(인증서 SERIAL이 설정되지 않았습니다)
			case "1306" :
				// The issuer DN is not set(발급자 DN이 설정되지 않았습니다)
			case "1310" :
				// Failed to get certificate(인증서를 가져오는데 실패했습니다)
				html5ErrorCode = "ERR_7005";
				break;
			case "1315" :
				// Failed to delete certificate(인증서 삭제에 실패했습니다)
				html5ErrorCode = "ERR_6005";
				break;
				
			// 인증서 내보내기
			case "1401" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1402" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1405" :
				// No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "1406" :
				// Invalid device ID(잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1407" :
				//Invalid sub-device ID(잘못된 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1408" :
				//Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "1409" :
				//Invalid password(비밀번호가 잘못되었습니다)
				html5ErrorCode = "WARN_1001";
				break;
			case "1410" :
				//The certificate export has been canceled(인증서 내보내기가 취소 되었습니다)
				html5ErrorCode = "ERR_7006";
				break;
			case "1403" :
				// The certificate ID is not set(인증서 ID 가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "1404" :
				// Invalid password(비밀번호가 틀렸습니다.)
				html5ErrorCode = "WARN_1001";
				break;
			case "1411" :
				//Failed to export certificate(인증서 내보내기에 실패했습니다)
				html5ErrorCode = "ERR_7007";
				break;
				
			// 인증서 저장
			case "1501" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1502" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1503" :
				// The pin number is not set(핀 번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1012";
				break;
			case "1505" :
				// The certificate is not set(인증서가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "1509" :
				// Invalid pin number(잘못된 핀 번호 입니다)
				html5ErrorCode = "ERR_1013";
				break;
			case "1510" :
				// The device is locked(장치가 잠겨 있습니다)
				html5ErrorCode = "ERR_1014";
				break;
			case "1511" :
				// The device is not ready(장치가 준비되지 않았습니다)
				html5ErrorCode = "ERR_1015";
				break;
			case "1504" :
				// The password is not set(비밀번호가 설정되지 않았습니다)
			case "1506" :
				// The private key is not set(비밀번호가 설정되지 않았습니다)
			case "1507" :
				// Failed to load certificate(인증서 읽기에 실패했습니다)
			case "1508" :
				// Failed to load private key(개인키 읽기에 실패했습니다)
			case "1512" :
				// Not enough memory to save certificate(인증서를 저장하기 위한 메모리가 부족합니다)
			case "1513" :
				// Failed to save certificate(인증서 저장에 실패했습니다)
			case "1514" :
				// Failed to load KM certificate(인증서 읽기에 실패했습니다)
			case "1515" :
				// Failed to load KM private key(개인키 읽기에 실패했습니다)
				html5ErrorCode = "ERR_7008";
				break;
			case "1516" :
				// Invalid password(비밀번호가 틀렸습니다.)
				html5ErrorCode = "WARN_1001";
				break;
				
			// 인증서 읽기
			case "1601" :
				// Unsupported device ID or Invalid device ID(지원하지 않는 장치 ID 이거나 잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1602" :
				// The sub-device ID is not set(장치 하위 ID가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1011";
				break;
			case "1603" :
				// The certificate ID is not set(인증서 ID 가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1017";
				break;
			case "1605" :
				// No certificates were found(인증서가 없습니다)
				html5ErrorCode = "ERR_1029";
				break;
			case "1606" :
				// Invalid device ID(잘못된 장치 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1607" :
				// Invalid sub-device ID(잘못된 장치 하위 ID 입니다)
				html5ErrorCode = "ERR_1009";
				break;
			case "1608" :
				// Invalid certificate ID(잘못된 인증서 ID 입니다)
				html5ErrorCode = "ERR_1030";
				break;
			case "1604" :
				//The password is not set(비밀번호가 설정되지 않았습니다)
				html5ErrorCode = "ERR_1022";
				//html5ErrorCode = "ERR_7009";
				break;
				
			// 공개키 요청
			case "1701" :
				// Failed to generate RSA key(RSA 키 생성에 실패했습니다)
			case "1702" :
				// Failed to convert DER to PEM for public key(공개키를 DER 포맷에서 PEM 포맷으로 변경하는데 실패했습니다)
				html5ErrorCode = "ERR_7010";
				break;
				
			// 마스터키 교환
			case "1801" :
				// The master key is not set(마스터 키가 설정되지 않았습니다)
			case "1802" :
				// There is no private key(개인키가 존재하지 않습니다)
			case "1803" :
				// Failed to decrypt master key(마스터 키 복호화에 실패했습니다)
				html5ErrorCode = "ERR_7011";
				break;
				
			// PC정보 요청
			case "1901" :
				// The site name is not set(사이트 이름이 설정되지 않았습니다)
			case "1902" :
				// The pc info use is not set(PC 정보 수집 항목이 설정되지 않았습니다)
			case "1903" :
				// The server IP is not set(서버 IP 가 설정되지 않았습니다)
			case "1904" :
				// The server port is not set(서버 포트가 설정되지 않았습니다)
			case "1905" :
				// The retry count is not set(재시도 횟수가 설정되지 않았습니다)
			case "1906" :
				// The replacement value is not set(정보 교체 값이 설정되지 않았습니다)
			case "1907" :
				// The FDS use value is not set(FDS 사용 값이 설정되지 않았습니다)
			case "1908" :
				// Unsupported site name(지원하지 않는 사이트 이름 입니다)
			case "1909" :
				// Invalid pc info use value(잘못된 PC 정보 수집 값 입니다)
			case "1910" :
				// Invalid replace value(잘못된 정보 교체 값 입니다)
			case "1911" :
				// Invalid FDS use value(잘못된 FDS 사용 값 입니다)
			case "1912" :
				// The getting of PC information is running(PC 정보 취득이 수행 중 입니다)
			case "1913" :
				// Failed to create thread(Thread 생성에 실패했습니다)
				html5ErrorCode = "ERR_7012";
				break;
				
			// PC정보 취득
			case "2001" :
				// The secure nonce is not set(SECURE NONCE 가 설정되지 않았습니다)
			case "2002" :
				// The user agent is not set(USER AGENT 가 설정되지 않았습니다)
			case "2003" :
				// The getting of PC information is not requested(PC 정보 취득이 요청되지 않았습니다)
			case "2004" :
				// The getting of PC information is running(PC 정보 취득이 수행 중 입니다)
			case "2005" :
				// Failed to get IP address(IP 주소 취득에 실패했습니다)
			case "2006" :
				// Failed to get MAC address(MAC 주소 취득에 실패했습니다)
				html5ErrorCode = "ERR_7012";
				break;
				
			//권한상승취소.
			case "0712" :
				html5ErrorCode = "WARN_1040";
				break;
			case "0816" :
				html5ErrorCode = "WARN_1041";
				break;
			case "0925" :
				html5ErrorCode = "WARN_1042";
				break;
			case "1014" :
				html5ErrorCode = "WARN_1043";
				break;
			case "1125" :
				html5ErrorCode = "WARN_1044";
				break;
			case "1214" :
				html5ErrorCode = "WARN_1045";
				break;
			case "1316" :
				html5ErrorCode = "WARN_1046";
				break;
			case "1517" :
				html5ErrorCode = "WARN_1047";
				break;
			case "1718" :
				html5ErrorCode = "WARN_1048";
				break;
			//비밀번호 관련
			case "0817" :
			case "1015" :
			case "1126" :
			case "1215" :
			case "1518" :
				//Invalid confirm password(잘못된 확인 비밀번호 입니다)
				html5ErrorCode = "WARN_1010";
				break;
			case "0818" :
			case "1016" :
			case "1127" :
			case "1216" :
			case "1519" :
				//Password does not match the confirm password(비밀번호가 확인 비밀번호와 일치하지 않습니다)
				html5ErrorCode = "WARN_1017";
				break;
			case "0819" :
			case "1017" :
			case "1128" :
			case "1217" :
			case "1520" :
				/*The length of certificate password have to be set up from [xxx] to [xxx].
				- Not available to use Ex) "akdb123", "q!235a"
				- Available to use Ex) "akdb7808", "akdb!(#%197", "akdb!891akdo"
				(인증서 암호의 길이는 반드시 [xxx]자리 이상 [xxx]자리 이하로 설정해야 합니다.
				- 잘못된 사용 예) "akdb123", "q!235a"
				- 올바른 사용 예) "akdb7808", "akdb!(#%197", "akdb!891akdo")
				*/
				html5ErrorCode = "WARN_1057";
				break;
			case "0820" :
			case "1018" :
			case "1129" :
			case "1218" :
			case "1521" :
				/*Certificate password have to be consist of 2 or more character types(English, Numbers, Special characters).(Not available '"|\)
				- Not available to use Ex) "akdbkgid", "10866899", "!@##$%^&"
				- Available to use Ex) "akdb7808", "akdb!(#%", "akdb!892"
				(인증서 암호는 영문을 포함한 2개 이상의 문자 타입(영문자, 숫자, 특수문자)으로 구성해야 합니다. (단, ' " | \ 사용불가)
				- 잘못된 사용 예) "akdbkgid", "10866899", "!@##$%^&"
				- 올바른 사용 예) "akdb7808", "akdb!(#%", "akdb!892")
				 */
				html5ErrorCode = "WARN_1005";
				break;
			case "0821" :
			case "1019" :
			case "1130" :
			case "1219" :
			case "1522" :
				/*It is not available to use sequential characters/numbers [xxx] for more digit for certificate password.
				- Not available to use Ex) "akdb4561", "abcf5973", "cde9861"
				- Available to use Ex) "akdb7808", "aaop9541", "cd!9410q"
				(인증서 암호에 연속된 문자/숫자 [xxx]자리 이상 사용할 수 없습니다.
				- 잘못된 사용 예) "akdb4561", "abcf5973", "cde9861"
				- 올바른 사용 예) "akdb7808", "aaop9541", "cd!9410q")
				 */
				html5ErrorCode = "WARN_1009";
				break;
			case "0822" :
			case "1020" :
			case "1131" :
			case "1220" :
			case "1523" :
				/*It is not availalbe to use equal characters/numbers [xxx] or more digit for certificate password.
				- Not available to use Ex) "akdb2221", "abbbf5973", "cde###861"
				- Available to use Ex) "akdb7808", "aaop9541", "cd!9410q"
				(인증서 암호에 동일한 문자/숫자 [xxx]자리 이상 사용할 수 없습니다.
				- 잘못된 사용 예) "akdb2221", "abbbf5973", "cde###861"
				- 올바른 사용 예) "akdb7808", "aaop9541", "cd!9410q")
				*/
				html5ErrorCode = "WARN_1008";
				break;
			case "0823" :
			case "1021" :
			case "1132" :
			case "1221" :
			case "1524" :
				/*Certificate password have to be consist of place in English and Number and Special characters.(Not available '"|\)
				- Not available to use Ex) "akdbk#!zmnd", "1086689915", "akdb5793jz"
				- Available to use Ex) "qw!r780814", "q#e7!ppa18", "qwar&8890p!"
				(인증서 암호는 숫자, 영문, 특수문자를 반드시 포함하여 구성해야 합니다. (단, ' " | \ 사용불가)
				- 잘못된 사용 예) "akdbk#!zmnd", "1086689915", "akdb5793jz"
				- 올바른 사용 예) "qw!r780814", "q#e7!ppa18", "qwar&8890p!")
				*/
				html5ErrorCode = "WARN_1005";
				break;
			case "0824" :
			case "1022" :
			case "1133" :
			case "1222" :
			case "1525" :
				//Certificate password is set up [xxx] or more.(인증서 암호는 [xxx]자리 이상 설정해야 합니다.)
				html5ErrorCode = "WARN_1006";
				break;
			case "0825" :
			case "1023" :
			case "1134" :
			case "1223" :
			case "1526" :
				//Certificate password is set up [xxx] and under.(인증서 암호는 최대 [xxx]자리까지 설정가능 합니다.)
				html5ErrorCode = "WARN_1007";
				break;
			case "0826" :
			case "1024" :
			case "1135" :
			case "1224" :
			case "1527" :
				//Certificate password is combination of [xxx] or more types in English(A~Z, a~z) and Number(0~9), Special Character([xxx])(인증서 암호에는 영문(A~Z,a~z), 숫자(0~9), 특수문자([xxx]) 중에 [xxx]가지 이상을 조합사여 사용하여야 합니다.)
				html5ErrorCode = "WARN_1005";
				break;
			case "0827" :
			case "1025" :
			case "1136" :
			case "1225" :
			case "1528" :
				//It is not available to use sequential numbers(foward and reverse)/characters [xxx] or more digit for certificate password.인증서 암호에는 연속된 숫자(역방향 포함)/문자를 [xxx]자리 이상부터 사용할 수 없습니다.
				html5ErrorCode = "WARN_1008";
				break;
			case "0828" :
			case "1026" :
			case "1137" :
			case "1226" :
			case "1529" :
				//It is not available to use sequential numbers/characters [xxx] or more digit for certificate password.(인증서 암호에는 연속된 숫자/문자를 [xxx]자리 이상부터 사용할 수 없습니다.)
				html5ErrorCode = "WARN_1008";
				break;
			case "0829" :
			case "1027" :
			case "1138" :
			case "1227" :
			case "1530" :
				//It is not available to use equal number and characters [xxx] or more for certificate password.(인증서 암호에는 같은 숫자/문자를 [xxx]자리 이상 연속으로 사용 할 수 없습니다.)
				html5ErrorCode = "WARN_1008";
				break;
			case "0830" :
			case "1028" :
			case "1139" :
			case "1228" :
			case "1531" :
				//Specified special characters([xxx]) is only used for certificate password.(인증서 암호에는 지정된 특수 문자([xxx])만 사용 가능합니다.)
				html5ErrorCode = "WARN_1056";
				break;
			case "0831" :
			case "1029" :
			case "1140" :
			case "1229" :
			case "1532" :
				//Certificate password have to be consist of one place in [xxx].(인증서 암호에는 [xxx]타입이 반드시 조합되어 사용되어야 합니다.)
				html5ErrorCode = "WARN_1005";
				break;
			case "0832" :
			case "1030" :
			case "1141" :
			case "1230" :
			case "1533" :
				//An error occurred while checking password policy requirements(비밀번호 정책 체계 체크 중 오류가 발생했습니다)
				html5ErrorCode = "WARN_1055";
				break;
			default : 
//				var resultMSG = decodeURIComponent(param.PARAMS.MSG);
//				INI_ALERT(resultMSG, 'ERROR');
		}
		return html5ErrorCode;
	};
	
	return{
		proc : proc
	}
});