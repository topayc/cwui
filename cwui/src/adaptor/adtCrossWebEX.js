/*************************************************************************************
 # Copyright(c) Initech
 # 설명 : 
 # 이력 
  - [2015-10-01] : 최초 구현 
*************************************************************************************/
define([
    '../main/constants',
    '../conf/customer/customerConf',
    '../main/initechApp',
    '../conf/msgFactory',
    '../core/coreFactory',
    '../core/privateStorage',
    '../core/utils',
    '../main/webForm',
    '../conf/certificates'
     ], function (constants, customerConf, initechApp, msgFactory, coreFactory, privateStorage, utils, webForm, certificates) {

    var INIPLUGINVERSION = "100";

    var web_ctx = {};
    var CRYPTO_IV = "INITECH PLUGIN..";


    var make_sk = function (scert, enc_mode, enc_hash, input) {
        var encdata = coreFactory.Factory.Cipher.asymmetricCertEncrypt(scert, enc_mode, enc_hash, input);
        var sk = coreFactory.Factory.Util.encode64(encdata);

        //var decdata = coreFactory.Factory.Cipher.asymmetricDecrypt(certificate.SPri, enc_mode, enc_hash, encdata);

        //var bytes = coreFactory.Factory.Util.bytesToHex(encdata);

        return sk;
    };
/*
    var make_sg = function (priv, enc_mode, hash, input) {

        var encdata = coreFactory.Factory.Signature.privateKeySign(priv, enc_mode, hash, input);
        var sg = coreFactory.Factory.Util.encode64(encdata);

        return sg;
    }
*/
    var make_alg = function (cipher) {
        var alg = "sym:"+cipher.sym + ";kx:" + cipher.kx + ";kxh:" + cipher.kxh + ";sg:" + cipher.sg + ";sgh:" + cipher.sgh;
        var b64alg = coreFactory.Factory.Util.encode64(alg);
        return b64alg;
    };


    var make_dt = function (symalg, sk, iv, data) {
        var databuffer = coreFactory.Factory.Util.createBuffer(data);
        var encdata = coreFactory.Factory.Cipher.symmetricEncrypt(symalg,sk,iv,databuffer);


        //var decdata = coreFactory.Factory.Cipher.symmetricDecrypt(symalg, sk, iv, encdata);

        var dt = coreFactory.Factory.Util.encode64(encdata.data);

        return dt;
    };

    var make_ts = function (symalg, sk, iv, b64ts) {
        var b64dec_ts = coreFactory.Factory.Util.decode64(b64ts);
        var databuffer = coreFactory.Factory.Util.createBuffer(b64dec_ts);
        var encdata = coreFactory.Factory.Cipher.symmetricEncrypt(symalg,sk,iv,databuffer);
        var ts = coreFactory.Factory.Util.encode64(encdata.data);

        return ts;
    };


    var MakeInipluginData_format = function(vf, vd, sk, cc, sg, alg, dt, er, ts, kecc, iver) {
        var iniplugindata = "";

        // vf
        iniplugindata = "vf=" + encodeURIComponent(vf);

        // vd
        if (vf == 1) {
            iniplugindata += "&vd=" + encodeURIComponent(vd);
        }

        // sk
        iniplugindata += "&sk=" + encodeURIComponent(sk);

        // cc
        iniplugindata += "&cc=" + encodeURIComponent(cc);

        // sg
        iniplugindata += "&sg=" + encodeURIComponent(sg);

        // alg
        iniplugindata += "&alg=" + encodeURIComponent(alg);

        // dt
        iniplugindata += "&dt=" + encodeURIComponent(dt);

        // er
        iniplugindata += "&er=" + encodeURIComponent(er);

        if(vf == 10 || vf == 11 || vf == 21){
            // ts
            iniplugindata += "&ts=" + encodeURIComponent(ts);

            // kecc
            iniplugindata += "&kecc=" + encodeURIComponent(kecc);

            // iver
            iniplugindata += "&iver=" + encodeURIComponent(iver);
        }

        return iniplugindata;
    };

    var Make_ClientSK = function (ms, web_ctx){
        // ms hash
        var hashd = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, ms, null);
        web_ctx.c_sk = hashd.substr(0,16);
        web_ctx.c_iv = hashd.substr(16, 16);

        return;
    };

    var xorBytes = function(s1, n) {
        var s3 = '';
        var b = '';
        var t = '';
        var i = 0;
        var c = 0;
        for(; n > 0; --n, ++i) {
            b = s1.charCodeAt(i) ^ 0xFF;
            if(c >= 10) {
                s3 += t;
                t = '';
                c = 0;
            }
            t += String.fromCharCode(b);
            ++c;
        }
        s3 += t;
        return s3;
    };

    var Make_ServerSK = function (ms, web_ctx){
        /*
        var revs_ms = coreFactory.Factory.Util.createBuffer(64);
        for(var i=0; i < ms.length; i++){
            revs_ms[i] = ms[i] ^ 0xFF;
        }
        */
        revs_ms = xorBytes(ms, ms.length);
        var sk_bytes = coreFactory.Factory.Util.bytesToHex(revs_ms);
        var hashd = coreFactory.Factory.Cipher.doDigest(constants.Cipher.HASH_SHA256, revs_ms, null);
        web_ctx.s_sk = hashd.substr(0,16);
        web_ctx.s_iv = hashd.substr(16, 16);

        return;
    };

    var MakeInipluginData_callback = function(ret, vidAttr) {
        // iniplugin data
        // data : 만약 로그인인 경우 __INIts__=%s

        if(!ret){
            return "";
        }
/*
        vidAttr[constants.Login.SIGNATURE] = sign;
        // VID Random
        vidAttr[constants.Login.VID_RANDOM] = forge.util.bytesToHex(privateKey.vidRandom);
        // Certificate
        vidAttr[constants.Login.VID_CERTIFICATE] = selected.certificate;
*/
        var vd = "";
        var sk = "";
        var cc = "";
        var sg = "";
        var alg = "";
        var dt = "";
        var er = "";
        var ts = "";
        var kecc = "";
        var iver = "";

        var data_buf = "";

        // sk 생성
        {
            dtrandpad  = coreFactory.Factory.Util.getBytes(16);
            //web_ctx.sk = coreFactory.Factory.Util.getBytes(16);
            web_ctx.sk = "1234567890123456123456789012345612345678901234561234567890123456";
            Make_ClientSK(web_ctx.sk, web_ctx);
        }

        // make vd
        if(web_ctx.vf == 1){

        }
        // make ts
        else if(web_ctx.vf == 10 ||web_ctx.vf == 11 || web_ctx.vf == 21){
            var msg = '';
            var b64ts = utils.Transfer.xmlhttpRequest(web_ctx.turl, msg).trim();
            utils.Log.debug('ts or random : ' + b64ts);
            ts = make_ts(web_ctx.cipher.sym, web_ctx.c_sk, web_ctx.c_iv,b64ts)

            if(web_ctx.vf == 11 && web_ctx.data == ""){
                // todo : test 필요...
                data_buf = "__INIts__=" + encodeURI(b64ts);
            }
        }

        if(web_ctx.data != ""){
            data_buf = web_ctx.data;
        }

        // make sk
        if(web_ctx.vf == 0 || web_ctx.vf == 1){
            sk = make_sk(certificates.SCert, web_ctx.cipher.kx, web_ctx.cipher.kxh, web_ctx.sk);
        }
        else if(web_ctx.vf == 10 || web_ctx.vf == 11){
            sk = make_sk(certificates.SCert, web_ctx.cipher.kx, web_ctx.cipher.kxh, web_ctx.sk);
        }
        else {
        	utils.Log.debug('not support vf: ' + web_ctx.vf);
            return "";
        }

        // make cc
        if(web_ctx.vf == 1 || web_ctx.vf == 11 || web_ctx.vf == 21){
            cc = vidAttr[constants.Login.VID_CERTIFICATE];
            if(cc.indexOf("-----BEGIN CERTIFICATE-----\n") < 0)
                cc = cc.replace("-----BEGIN CERTIFICATE-----","-----BEGIN CERTIFICATE-----\n");
            if(cc.indexOf("\n-----END CERTIFICATE-----") < 0)
                cc = cc.replace("-----END CERTIFICATE-----","\n-----END CERTIFICATE-----")
        }

        // make sg
        if(web_ctx.vf == 1 || web_ctx.vf == 11 || web_ctx.vf == 21){
            /*
            sg = make_sg(web_ctx.user_priv, tmp_sg, tmp_sgh, data_buf);
            */
            sg = vidAttr[constants.Login.SIGNATURE];
        }

        // make alg
        if(web_ctx.vf == 0 || web_ctx.vf == 1){
            var alg = "SEED-CBC";
        }
        else if(web_ctx.vf == 10 || web_ctx.vf == 11){
            alg = make_alg(web_ctx.cipher);
        }

        // make dt
        if(web_ctx.vf == 0 || web_ctx.vf == 1){
            dt = make_dt("SEED-CBC", web_ctx.sk, CRYPTO_IV, data_buf);
        }
        else if(web_ctx.vf == 10 || web_ctx.vf == 11){
            dt = make_dt(web_ctx.cipher.sym, web_ctx.c_sk, web_ctx.c_iv, dtrandpad + data_buf);
        }

        // make er
        if(web_ctx.vf == 1 || web_ctx.vf == 11 || web_ctx.vf == 21){
            var vidr = coreFactory.Factory.Util.hexToBytes(vidAttr[constants.Login.VID_RANDOM]);
            er = make_dt(web_ctx.cipher.sym, web_ctx.c_sk, web_ctx.c_iv, vidr);
        }


        var inipluginData = MakeInipluginData_format(web_ctx.vf, vd, sk, cc, sg, alg, dt, er, ts, kecc, INIPLUGINVERSION);

        eval(web_ctx.callback)(inipluginData);

    };


    var MakeINIpluginData = function (vf, cipher, data, rurl, callback) {
        // 제출창 호출
        web_ctx.callback = callback;
        web_ctx.vf = vf;
        web_ctx.data = data;
        web_ctx.turl = rurl;
        web_ctx.cipher = cipher;

//        var data = ICL_ConertUTF8ToEUCKR(data);
        var hex = coreFactory.Factory.Util.bytesToHex(data);
        customerConf.System.SYNCHRONISE = rurl;
        if (vf == 10) {
            MakeInipluginData_callback(true, null);
        }
        else if (vf == 11) {
            initechApp.IniSafeNeo.openMainLoginForm(MakeInipluginData_callback, data);
        }
        else {
        	utils.Log.debug('not support vf: ' + vf);
        }
    };

    var PKCS7Sign_callback = function(ret, vidAttr){
        if(!ret){
            return "";
        }
        /*
         vidAttr[constants.Login.SIGNATURE] = sign;
         // VID Random
         vidAttr[constants.Login.VID_RANDOM] = forge.util.bytesToHex(privateKey.vidRandom);
         // Certificate
         vidAttr[constants.Login.VID_CERTIFICATE] = selected.certificate;
         */

        // pem pkcs7 -> der 로 변환 후 base64 하자

        var dersign = coreFactory.Factory.Util.pemToDer(vidAttr[constants.Login.SIGNATURE]);
        var b64sign = coreFactory.Factory.Util.encode64(dersign.data);

        eval(web_ctx.callback)(b64sign);
    };

    var PKCS7SignData = function (hashalg, data, turl, confirm, callback) {

        web_ctx.callback = callback;
        web_ctx.data = data;
        web_ctx.turl = turl;
        web_ctx.hashalg = hashalg;

        customerConf.System.SYNCHRONISE = turl;
        initechApp.IniSafeNeo.openMainSignForm(PKCS7Sign_callback, data, hashalg.toLowerCase());
    };

    var PKCS7SignDataWithRandom = function(data, turl, confirm, callback) {
        web_ctx.callback = callback;
        web_ctx.data = data;
        web_ctx.turl = turl;
        web_ctx.hashalg = "SHA256";

        customerConf.System.SYNCHRONISE = turl;
        initechApp.IniSafeNeo.openMainSignForm(PKCS7Sign_callback, data, web_ctx.hashalg.toLowerCase());
    };

    var SetProperty = function(name, value, callback) {
        var lowerName = name.toLowerCase();
        var lowerValue = value.toLowerCase();
        var todo_flag = 0;
        // 시리얼 필터
        if(lowerName == "certmanui_serial"){
            todo_flag = 1;
        }
        else if(lowerName == "InitCache"){
            // value : on or off
            todo_flagg = 1;

        }
        // 필터
        /*
         else if(lowerName == "certmanui_oid"){
         customerConf.Certs.
         }
         */
        // 서명원문 charset
        else if(lowerName == "urlencodeconv"){
            if(lowerValue == "euckr"){
                customerConf.Signature.CONTENT_ENCODE.ORIGIRAL_CHAR_SET = constants.System.CHARACTER_EUC_KR;
            }
            else {
                customerConf.Signature.CONTENT_ENCODE.ORIGIRAL_CHAR_SET = constants.System.CHARACTER_UTF8;
            }
        }
        // 제출창 서명원문 형태
        else if(lowerName == "certmanui_serial"){

        }
        // 제출창 서명원문 형태
        else if(lowerName == "certmanui_selectcertuimode"){
            if(lowerValue == "list"){
                customerConf.Signature.PLAINTEXT_VIEW_TYPE = constants.Signature.SIGN_VIEW_GRID;
            }
            else if(lowerValue == "text"){
                customerConf.Signature.PLAINTEXT_VIEW_TYPE = constants.Signature.SIGN_VIEW_TEXT;
            }
            else {
                customerConf.Signature.PLAINTEXT_VIEW_TYPE = constants.Signature.SIGN_VIEW_NONE;
            }
        }
        else if(lowerName == "p7signwithrandom"){
            todo_flag = 1;
            // value : 1: R 포함 or 0 불포함
            // customerConf.Signature.WITH_RANDOM = value;
        }
        // 서명창 타이틀
        else if(lowerName == "certmanui_signaturedialogtitle"){
            var paramArr = [];
            var dataSplitArr = value.split("&");

            if(dataSplitArr.length > 0){
                for(var i = 0; i < dataSplitArr.length; i++){
                    var divideParam = dataSplitArr[i].split("=");
                    if(divideParam.length == 2){
                        customerConf.WebForm.SIGN_TEXT[divideParam[0]] = divideParam[1];
                    }
                    else if(divideParam.length == 1){
                        customerConf.WebForm.SIGN_TEXT['KOR'] = divideParam[0];
                    }
                    else {
                        // error
                    }

                }
            }
        }
        // 제출창 타이틀
        else if(lowerName == "caption"){
            var paramArr = [];
            var dataSplitArr = value.split("&");

            if(dataSplitArr.length > 0){
                for(var i = 0; i < dataSplitArr.length; i++){
                    var divideParam = dataSplitArr[i].split("=");
                    if(divideParam.length == 2){
                        customerConf.WebForm.LOGIN_TEXT[divideParam[0]] = divideParam[1];
                    }
                    else if(divideParam.length == 1){
                        customerConf.WebForm.LOGIN_TEXT['KOR'] = divideParam[0];
                    }
                    else {
                        // error
                    }
                }
            }
        }
        // 시스템 기본 언어
        else if(lowerName == "certmanui_language"){
            customerConf.System.LANGUAGE = lowerValue;
        }
        // 서명원문 구분자
        else if(lowerName == "setsigndivision"){
            customerConf.Signature.FIELD_DELIMITER = value;
        }
        // 서명시 금결원 포멧 사용 여부
        else if(lowerName == "btinitp7msg"){
            // value : 0 : 일반 1: 금결원
            if(value == '1'){
                customerConf.Signature.KFTC_SIGN_FORMAT = true;
            }
            else {
                customerConf.Signature.KFTC_SIGN_FORMAT = false;
            }
        }
        else {
            todo_flag = 1;
        }

        if(todo_flag){
        	utils.Log.debug("- SetProperty ("+name+","+ value + ")");
        }
        else {
        	utils.Log.debug("+ SetProperty ("+name+","+ value + ")");
        }
    };

    var Decrypt = function (cipher, data, callback){
        // 제출창 호출
        web_ctx.callback = callback;
        web_ctx.data = data;
        web_ctx.cipher = cipher;

        Make_ServerSK(web_ctx.sk, web_ctx);

        var bytes = coreFactory.Factory.Util.bytesToHex(web_ctx.s_sk);
        var bytes2 = coreFactory.Factory.Util.bytesToHex(web_ctx.s_iv);
        var b64decdata = coreFactory.Factory.Util.decode64(data);
        var databuffer = coreFactory.Factory.Util.createBuffer(b64decdata);
        var decdata = coreFactory.Factory.Cipher.symmetricDecrypt(cipher.sym, web_ctx.s_sk, web_ctx.s_iv, databuffer);

        var pos = decdata.data.indexOf('&dt=');
        var decmsg = decdata.data.substr(pos + 4);

        if(callback){
            eval(callback)(decmsg);
        }
        else {
            return decmsg;
        }

    };

     return{
          MakeINIpluginData : MakeINIpluginData,
          PKCS7SignData : PKCS7SignData,
          PKCS7SignDataWithRandom : PKCS7SignDataWithRandom,
         SetProperty : SetProperty,
         Decrypt: Decrypt
     };

});
