var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var browserType = 'chrome'; // chrome, ie
var driver, driverSub;
var browser, browserSub;

var dns = "http://localhost:5000";
var certPassword = "1q2w3e4r5t^";
var timeoutSeconds = 10 * 1000;
var sleepSeconds = 2 * 1000;

var API = function(driver) {
  return {
    _waitCompId : function(id) {
      return driver.wait(until.elementLocated(By.id(id)), timeoutSeconds);
    },

    _waitCompXpath : function(xpath) {
      return driver.wait(until.elementLocated(By.xpath(xpath)), timeoutSeconds);
    },
    
    _btnClick : function(id) {
      this._waitCompId(id).then(function(el) {
        el.click();
        driver.sleep(sleepSeconds);
      });
    },
    
    _storageClickByClass : function(clsNm) {
      this._waitCompXpath("//div[@id='INI_target_storage_list']//span[contains(@class, '" + clsNm + "')]").then(function(el) {
        el.click();
        driver.sleep(sleepSeconds);
      });
    },
    
    _sendKey : function(id, val) {
      var inVal = false;
    
      this._waitCompId(id).then(function(el) {
        el.sendKeys(val);
        driver.sleep(sleepSeconds);
    
        /*
        driver.wait(function() {
          driver.executeScript("return document.querySelector('#" + id + "').value").then(function(ret) {
            console.log("입력 : " + ret);
    
            inVal = ret;
          });
    
          return inVal == val;
        }, timeoutSeconds);
        */
      });
    },
    
    _onSelectCert : function(thenFunc) {
      var caller = this._onSelectCert.caller;
      
      return this._waitCompXpath("//tr[contains(@class, 'active')]").then(thenFunc).catch(function(e) {
        console.log(e);
        console.log("인증서 없음 - " + caller.name);
      });
    },
    
    _checkURL : function(url, errMsg) {
      driver.wait(until.urlContains(url), timeoutSeconds).then(function() {
        console.log(url);
        driver.sleep(sleepSeconds);
      }).catch(function() {
        console.log(errMsg);
      });
    },
    
    _checkMsgDialog : function(cmpMsg, errMsg) {
      driver.wait(until.elementLocated(By.id("msg_area")), timeoutSeconds).then(function(el) {
        driver.executeScript("return document.querySelector('#msg_area').innerText").then(function(ret) {
          if (ret == cmpMsg) {
            console.log(ret);
            driver.sleep(sleepSeconds);
          } else {
            console.log(errMsg);
          }
        });
      });
    }
  }
};

try {
  driver = new webdriver.Builder().forBrowser(browserType).build();
  browser = API(driver);
} catch(e) {
  // 시스템 환경변수 추가 : PATH=/cwui/seleniumAutomation/driver
  console.log(e.message);
  
  return;
}

function login() {
  driver.get(dns + '/initech/demo/pc/crossweb_ex_web6/login/login_form_test.jsp');
  driver.executeScript("login();").then(function() {
    console.log("공인인증서 로그인");
  });

  browser._onSelectCert(function() {
    browser._sendKey("ini_cert_pwd", certPassword);
    browser._btnClick("INI_certSubmit");
    browser._checkURL("login_result.jsp", "로그인 실패");
  
    sign();
  });
}

function sign() {
  driver.get(dns + '/initech/demo/pc/crossweb_ex_web6/sign/sign_form_test.jsp');
  driver.executeScript("signView();").then(function() {
    console.log("전자서명");
  });

  browser._onSelectCert(function() {
    browser._sendKey("ini_cert_pwd", certPassword);
    browser._btnClick("INI_certSubmit");
    browser._checkURL("sign_result.jsp", "서명 실패");
  
    managerCopy();
  });
}

function managerCopy() {
  driver.get(dns + '/initech/demo/pc/crossweb_ex_web6/manager/manager_test.jsp');
  driver.executeScript("OpenCertManagerForm(true);").then(function() {
    console.log("인증서 복사");
  });

  browser._onSelectCert(function() {
    browser._btnClick("INI_mgr_cert_copy_btn");
    browser._storageClickByClass("browser");
    browser._sendKey("ini_cert_pwd", certPassword);
    browser._btnClick("INI_certSubmit");
    
    browser._checkMsgDialog("인증서 복사를 완료 하였습니다.", "인증서 복사 실패");
  
    managerDelete();
  })
}

function managerDelete() {
  driver.get(dns + '/initech/demo/pc/crossweb_ex_web6/manager/manager_test.jsp');
  driver.executeScript("OpenCertManagerForm(true);").then(function() {
    console.log("인증서 삭제");
  });

  browser._onSelectCert(function() {
    browser._btnClick("BROWSER");
    browser._onSelectCert();
    browser._btnClick("INI_mgr_remove_btn");
    browser._btnClick("INI_certSubmit");
    
    browser._checkMsgDialog("인증서 삭제를 완료 하였습니다.", "인증서 삭제 실패");
    
    managerPasswordChange();
  });
}

function managerPasswordChange() {
  driver.get(dns + '/initech/demo/pc/crossweb_ex_web6/manager/manager_test.jsp');
  driver.executeScript("OpenCertManagerForm(true);").then(function() {
    console.log("인증서 암호변경");
  });

  browser._onSelectCert(function() {
    browser._btnClick("INI_mgr_password_change_btn");
    browser._sendKey("ini_cert_pwd", certPassword);
    browser._sendKey("ini_cert_new_pwd", certPassword);
    browser._sendKey("ini_cert_new_pwd_cnf", certPassword);
    browser._btnClick("INI_certSubmit");
    
    browser._checkMsgDialog("비밀번호 변경이 완료되었습니다.", "비밀번호 변경 실패");
    
    copyToMobile();
  });
}

function copyToMobile() {
  driver.get(dns + "/initech/demo/pc/crossweb_ex_web6/cert_import_export/cert_import_export_test.jsp");
  driver.executeScript("document.querySelector(\"input[name='isHtml5']\").checked = true;");
  driver.executeScript("RunCertExportV12(true);").then(function() {
    console.log("인증서 내보내기(PC to Mobile)");
  });

  browser._onSelectCert(function() {
    browser._sendKey("ini_cert_pwd", certPassword);
    browser._btnClick("INI_certSubmit");

    browser._waitCompId("certificate_export_area").then(function() {
      driver.executeScript("var arrComp = document.querySelectorAll(\"input[name='INI_authNum']\"); return [arrComp[0].value, arrComp[1].value]").then(function(ret) {
        copyFromPC(ret);
      });
    });
    
    browser._checkMsgDialog("인증서 내보내기를 완료 하였습니다.", "인증서 내보내기 실패");
  });
}

function copyFromPC(arrAuthNum) {
  driverSub = new webdriver.Builder().forBrowser(browserType).build();
  browserSub = API(driverSub);
  
  driverSub.get(dns + "/initech/demo/pc/crossweb_ex_web6/cert_import_export/cert_import_export_test.jsp");
  driverSub.executeScript("document.querySelector(\"input[name='isHtml5']\").checked = true;");
  driverSub.executeScript("RunCertImportV12(true);").then(function() {
    console.log("인증서 가져오기(PC to Mobile)");
  });

  browserSub._waitCompId("certificate_import_area").then(function() {
    driverSub.executeScript("var arrComp = document.querySelectorAll(\"input[name='INI_authNum']\"); arrComp[0].value = '" + arrAuthNum[0] + "'; arrComp[1].value = '" + arrAuthNum[1] + "';").then(function(ret) {
      driverSub.sleep(sleepSeconds);
      
      browserSub._btnClick("INI_certSubmit");
      browserSub._sendKey("ini_cert_pwd", certPassword);
      browserSub._btnClick("INI_certSubmit");

      browserSub._checkMsgDialog("인증서 가져오기를 완료 하였습니다.", "인증서 가져오기 실패");
      
      driverSub.quit();
    });
  });
}

for (var i=0; i<5; i++) {
  login();
}

// copyToMobile();

driver.quit();