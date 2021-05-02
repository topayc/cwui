/**
 * Object IDs for ASN.1.
 *
 * @author Dave Longley
 *
 * Copyright (c) 2010-2013 Digital Bazaar, Inc.
 */
// (function() {
/* ########## Begin module implementation ########## */
var forge = require("./forge"); // function initModule(forge) {

forge.pki = forge.pki || {};
var oids = forge.pki.oids = forge.oids = forge.oids || {};

// algorithm OIDs
oids['1.2.840.113549.1.1.1'] = 'rsaEncryption';
oids['rsaEncryption'] = '1.2.840.113549.1.1.1';
// Note: md2 & md4 not implemented
//oids['1.2.840.113549.1.1.2'] = 'md2WithRSAEncryption';
//oids['md2WithRSAEncryption'] = '1.2.840.113549.1.1.2';
//oids['1.2.840.113549.1.1.3'] = 'md4WithRSAEncryption';
//oids['md4WithRSAEncryption'] = '1.2.840.113549.1.1.3';
oids['1.2.840.113549.1.1.4'] = 'md5WithRSAEncryption';
oids['md5WithRSAEncryption'] = '1.2.840.113549.1.1.4';
oids['1.2.840.113549.1.1.5'] = 'sha1WithRSAEncryption';
oids['sha1WithRSAEncryption'] = '1.2.840.113549.1.1.5';
oids['1.2.840.113549.1.1.7'] = 'RSAES-OAEP';
oids['RSAES-OAEP'] = '1.2.840.113549.1.1.7';
oids['1.2.840.113549.1.1.8'] = 'mgf1';
oids['mgf1'] = '1.2.840.113549.1.1.8';
oids['1.2.840.113549.1.1.9'] = 'pSpecified';
oids['pSpecified'] = '1.2.840.113549.1.1.9';
oids['1.2.840.113549.1.1.10'] = 'RSASSA-PSS';
oids['RSASSA-PSS'] = '1.2.840.113549.1.1.10';
oids['1.2.840.113549.1.1.11'] = 'sha256WithRSAEncryption';
oids['sha256WithRSAEncryption'] = '1.2.840.113549.1.1.11';
oids['1.2.840.113549.1.1.12'] = 'sha384WithRSAEncryption';
oids['sha384WithRSAEncryption'] = '1.2.840.113549.1.1.12';
oids['1.2.840.113549.1.1.13'] = 'sha512WithRSAEncryption';
oids['sha512WithRSAEncryption'] = '1.2.840.113549.1.1.13';

oids['1.3.14.3.2.7'] = 'desCBC';
oids['desCBC'] = '1.3.14.3.2.7';

oids['1.3.14.3.2.26'] = 'sha1';
oids['sha1'] = '1.3.14.3.2.26';
oids['2.16.840.1.101.3.4.2.1'] = 'sha256';
oids['sha256'] = '2.16.840.1.101.3.4.2.1';
oids['2.16.840.1.101.3.4.2.2'] = 'sha384';
oids['sha384'] = '2.16.840.1.101.3.4.2.2';
oids['2.16.840.1.101.3.4.2.3'] = 'sha512';
oids['sha512'] = '2.16.840.1.101.3.4.2.3';
oids['1.2.840.113549.2.5'] = 'md5';
oids['md5'] = '1.2.840.113549.2.5';

// pkcs#7 content types
oids['1.2.840.113549.1.7.1'] = 'data';
oids['data'] = '1.2.840.113549.1.7.1';
oids['1.2.840.113549.1.7.2'] = 'signedData';
oids['signedData'] = '1.2.840.113549.1.7.2';
oids['1.2.840.113549.1.7.3'] = 'envelopedData';
oids['envelopedData'] = '1.2.840.113549.1.7.3';
oids['1.2.840.113549.1.7.4'] = 'signedAndEnvelopedData';
oids['signedAndEnvelopedData'] = '1.2.840.113549.1.7.4';
oids['1.2.840.113549.1.7.5'] = 'digestedData';
oids['digestedData'] = '1.2.840.113549.1.7.5';
oids['1.2.840.113549.1.7.6'] = 'encryptedData';
oids['encryptedData'] = '1.2.840.113549.1.7.6';

// pkcs#9 oids
oids['1.2.840.113549.1.9.1'] = 'emailAddress';
oids['emailAddress'] = '1.2.840.113549.1.9.1';
oids['1.2.840.113549.1.9.2'] = 'unstructuredName';
oids['unstructuredName'] = '1.2.840.113549.1.9.2';
oids['1.2.840.113549.1.9.3'] = 'contentType';
oids['contentType'] = '1.2.840.113549.1.9.3';
oids['1.2.840.113549.1.9.4'] = 'messageDigest';
oids['messageDigest'] = '1.2.840.113549.1.9.4';
oids['1.2.840.113549.1.9.5'] = 'signingTime';
oids['signingTime'] = '1.2.840.113549.1.9.5';
oids['1.2.840.113549.1.9.6'] = 'counterSignature';
oids['counterSignature'] = '1.2.840.113549.1.9.6';
oids['1.2.840.113549.1.9.7'] = 'challengePassword';
oids['challengePassword'] = '1.2.840.113549.1.9.7';
oids['1.2.840.113549.1.9.8'] = 'unstructuredAddress';
oids['unstructuredAddress'] = '1.2.840.113549.1.9.8';
oids['1.2.840.113549.1.9.14'] = 'extensionRequest';
oids['extensionRequest'] = '1.2.840.113549.1.9.14';

oids['1.2.840.113549.1.9.20'] = 'friendlyName';
oids['friendlyName'] = '1.2.840.113549.1.9.20';
oids['1.2.840.113549.1.9.21'] = 'localKeyId';
oids['localKeyId'] = '1.2.840.113549.1.9.21';
oids['1.2.840.113549.1.9.22.1'] = 'x509Certificate';
oids['x509Certificate'] = '1.2.840.113549.1.9.22.1';

// pkcs#12 safe bags
oids['1.2.840.113549.1.12.10.1.1'] = 'keyBag';
oids['keyBag'] = '1.2.840.113549.1.12.10.1.1';
oids['1.2.840.113549.1.12.10.1.2'] = 'pkcs8ShroudedKeyBag';
oids['pkcs8ShroudedKeyBag'] = '1.2.840.113549.1.12.10.1.2';
oids['1.2.840.113549.1.12.10.1.3'] = 'certBag';
oids['certBag'] = '1.2.840.113549.1.12.10.1.3';
oids['1.2.840.113549.1.12.10.1.4'] = 'crlBag';
oids['crlBag'] = '1.2.840.113549.1.12.10.1.4';
oids['1.2.840.113549.1.12.10.1.5'] = 'secretBag';
oids['secretBag'] = '1.2.840.113549.1.12.10.1.5';
oids['1.2.840.113549.1.12.10.1.6'] = 'safeContentsBag';
oids['safeContentsBag'] = '1.2.840.113549.1.12.10.1.6';

// password-based-encryption for pkcs#12
oids['1.2.840.113549.1.5.13'] = 'pkcs5PBES2';
oids['pkcs5PBES2'] = '1.2.840.113549.1.5.13';
oids['1.2.840.113549.1.5.12'] = 'pkcs5PBKDF2';
oids['pkcs5PBKDF2'] = '1.2.840.113549.1.5.12';

oids['1.2.840.113549.1.12.1.1'] = 'pbeWithSHAAnd128BitRC4';
oids['pbeWithSHAAnd128BitRC4'] = '1.2.840.113549.1.12.1.1';
oids['1.2.840.113549.1.12.1.2'] = 'pbeWithSHAAnd40BitRC4';
oids['pbeWithSHAAnd40BitRC4'] = '1.2.840.113549.1.12.1.2';
oids['1.2.840.113549.1.12.1.3'] = 'pbeWithSHAAnd3-KeyTripleDES-CBC';
oids['pbeWithSHAAnd3-KeyTripleDES-CBC'] = '1.2.840.113549.1.12.1.3';
oids['1.2.840.113549.1.12.1.4'] = 'pbeWithSHAAnd2-KeyTripleDES-CBC';
oids['pbeWithSHAAnd2-KeyTripleDES-CBC'] = '1.2.840.113549.1.12.1.4';
oids['1.2.840.113549.1.12.1.5'] = 'pbeWithSHAAnd128BitRC2-CBC';
oids['pbeWithSHAAnd128BitRC2-CBC'] = '1.2.840.113549.1.12.1.5';
oids['1.2.840.113549.1.12.1.6'] = 'pbewithSHAAnd40BitRC2-CBC';
oids['pbewithSHAAnd40BitRC2-CBC'] = '1.2.840.113549.1.12.1.6';

// password-based-encryption for KISA
oids['1.2.410.200004.1.15'] = 'pbeWithSHA1AndSEED-CBC';
oids['pbeWithSHA1AndSEED-CBC'] = '1.2.410.200004.1.15';
oids['1.2.410.200004.1.4'] = 'seed-CBC';
oids['seed-CBC'] = '1.2.410.200004.1.4';
oids['1.2.410.200004.1.4.2'] = 'GPKIpbeWithSHA1AndSEED-CBC';
oids['GPKIpbeWithSHA1AndSEED-CBC'] = '1.2.410.200004.1.4.2';

// initech random encryption
oids['1.3.6.1.4.1.7150.3.1'] = 'initech-encrypted-random';
oids['initech-encrypted-random'] = '1.3.6.1.4.1.7150.3.1';

// symmetric key algorithm oids
oids['1.2.840.113549.3.7'] = 'des-EDE3-CBC';
oids['des-EDE3-CBC'] = '1.2.840.113549.3.7';
oids['2.16.840.1.101.3.4.1.2'] = 'aes128-CBC';
oids['aes128-CBC'] = '2.16.840.1.101.3.4.1.2';
oids['2.16.840.1.101.3.4.1.22'] = 'aes192-CBC';
oids['aes192-CBC'] = '2.16.840.1.101.3.4.1.22';
oids['2.16.840.1.101.3.4.1.42'] = 'aes256-CBC';
oids['aes256-CBC'] = '2.16.840.1.101.3.4.1.42';

// certificate issuer/subject OIDs
oids['2.5.4.3'] = 'commonName';
oids['commonName'] = '2.5.4.3';
oids['2.5.4.5'] = 'serialName';
oids['serialName'] = '2.5.4.5';
oids['2.5.4.6'] = 'countryName';
oids['countryName'] = '2.5.4.6';
oids['2.5.4.7'] = 'localityName';
oids['localityName'] = '2.5.4.7';
oids['2.5.4.8'] = 'stateOrProvinceName';
oids['stateOrProvinceName'] = '2.5.4.8';
oids['2.5.4.10'] = 'organizationName';
oids['organizationName'] = '2.5.4.10';
oids['2.5.4.11'] = 'organizationalUnitName';
oids['organizationalUnitName'] = '2.5.4.11';

// X.509 extension OIDs
oids['2.16.840.1.113730.1.1'] = 'nsCertType';
oids['nsCertType'] = '2.16.840.1.113730.1.1';
oids['2.5.29.1'] = 'authorityKeyIdentifier'; // deprecated, use .35
oids['2.5.29.2'] = 'keyAttributes'; // obsolete use .37 or .15
oids['2.5.29.3'] = 'certificatePolicies'; // deprecated, use .32
oids['2.5.29.4'] = 'keyUsageRestriction'; // obsolete use .37 or .15
oids['2.5.29.5'] = 'policyMapping'; // deprecated use .33
oids['2.5.29.6'] = 'subtreesConstraint'; // obsolete use .30
oids['2.5.29.7'] = 'subjectAltName'; // deprecated use .17
oids['2.5.29.8'] = 'issuerAltName'; // deprecated use .18
oids['2.5.29.9'] = 'subjectDirectoryAttributes';
oids['2.5.29.10'] = 'basicConstraints'; // deprecated use .19
oids['2.5.29.11'] = 'nameConstraints'; // deprecated use .30
oids['2.5.29.12'] = 'policyConstraints'; // deprecated use .36
oids['2.5.29.13'] = 'basicConstraints'; // deprecated use .19
oids['2.5.29.14'] = 'subjectKeyIdentifier';
oids['subjectKeyIdentifier'] = '2.5.29.14';
oids['2.5.29.15'] = 'keyUsage';
oids['keyUsage'] = '2.5.29.15';
oids['2.5.29.16'] = 'privateKeyUsagePeriod';
oids['2.5.29.17'] = 'subjectAltName';
oids['subjectAltName'] = '2.5.29.17';
oids['2.5.29.18'] = 'issuerAltName';
oids['issuerAltName'] = '2.5.29.18';
oids['2.5.29.19'] = 'basicConstraints';
oids['basicConstraints'] = '2.5.29.19';
oids['2.5.29.20'] = 'cRLNumber';
oids['2.5.29.21'] = 'cRLReason';
oids['2.5.29.22'] = 'expirationDate';
oids['2.5.29.23'] = 'instructionCode';
oids['2.5.29.24'] = 'invalidityDate';
oids['2.5.29.25'] = 'cRLDistributionPoints'; // deprecated use .31
oids['2.5.29.26'] = 'issuingDistributionPoint'; // deprecated use .28
oids['2.5.29.27'] = 'deltaCRLIndicator';
oids['2.5.29.28'] = 'issuingDistributionPoint';
oids['2.5.29.29'] = 'certificateIssuer';
oids['2.5.29.30'] = 'nameConstraints';
oids['2.5.29.31'] = 'cRLDistributionPoints';
oids['2.5.29.32'] = 'certificatePolicies';
oids['certificatePolicies'] = '2.5.29.32';
oids['2.5.29.33'] = 'policyMappings';
oids['2.5.29.34'] = 'policyConstraints'; // deprecated use .36
oids['2.5.29.35'] = 'authorityKeyIdentifier';
oids['2.5.29.36'] = 'policyConstraints';
oids['2.5.29.37'] = 'extKeyUsage';
oids['extKeyUsage'] = '2.5.29.37';
oids['2.5.29.46'] = 'freshestCRL';
oids['2.5.29.54'] = 'inhibitAnyPolicy';


// extKeyUsage purposes
oids['1.3.6.1.5.5.7.3.1'] = 'serverAuth';
oids['serverAuth'] = '1.3.6.1.5.5.7.3.1';
oids['1.3.6.1.5.5.7.3.2'] = 'clientAuth';
oids['clientAuth'] = '1.3.6.1.5.5.7.3.2';
oids['1.3.6.1.5.5.7.3.3'] = 'codeSigning';
oids['codeSigning'] = '1.3.6.1.5.5.7.3.3';
oids['1.3.6.1.5.5.7.3.4'] = 'emailProtection';
oids['emailProtection'] = '1.3.6.1.5.5.7.3.4';
oids['1.3.6.1.5.5.7.3.8'] = 'timeStamping';
oids['timeStamping'] = '1.3.6.1.5.5.7.3.8';

// certificatePolicies policyQualifiers 
oids['1.3.6.1.5.5.7.2.1'] = 'cps';
oids['cps'] = '1.3.6.1.5.5.7.2.1';
oids['1.3.6.1.5.5.7.2.2'] = 'unotice';
oids['unotice'] = '1.3.6.1.5.5.7.2.2';

oids['1.3.6.1.5.5.7.1.1'] = 'authorityInfoAccess';
oids['authorityInfoAccess'] = '1.3.6.1.5.5.7.1.1';

// 금융결재원
oids['1.2.410.200005.1.1.1'] = '범용(개인)';
oids['1.2.410.200005.1.1.4'] = '은행/신용카드/보험(개인)';
oids['1.2.410.200005.1.1.5'] = '범용(기업)';
oids['1.2.410.200005.1.1.2'] = '은행/신용카드/보험(법인)';
oids['1.2.410.200005.1.1.6.2'] = '신용카드용';
oids['1.2.410.200005.1.1.6.8'] = '전자세금용';
oids['1.2.410.200005.1.1.6.1'] = '기업뱅킹';

//한국 무역 통신
oids['1.2.410.200012.1.1.1'] = '범용(개인)';
oids['1.2.410.200012.1.1.101'] = '은행/보험용';
oids['1.2.410.200012.1.1.105'] = '신용카드용';
oids['1.2.410.200012.1.1.3'] = '범용(법인)';
oids['1.2.410.200012.5.19.1.1'] = '전자세금용';

//한국 증권 전산
oids['1.2.410.200004.5.1.1.5'] = '범용(개인)';
oids['1.2.410.200004.5.1.1.7'] = '범용(법인)';
oids['1.2.410.200004.5.1.1.9.2'] = '신용카드용';
oids['1.2.410.200004.5.1.1.9'] = '증권/보험(개인)';
oids['1.2.410.200004.1.1.12.902'] = '전자세금용';
oids['1.2.410.200004.5.1.1.9.1'] = '은행/보험용(개인)';
oids['1.2.410.200004.5.1.1.10'] = '증권/보험용(개인)';
oids['1.2.410.200004.5.1.1.10.1'] = '은행/보험용(개인)';
oids['1.2.410.200004.5.1.1.10.2'] = '신용카드용(법인)';

//한국 정보 인증
oids['1.2.410.200004.5.2.1.2'] = '1등급 개인';
oids['1.2.410.200004.5.2.1.1'] = '1등급 법인';
oids['1.2.410.200004.5.2.1.7.1'] = '은행/신용카드용/보험용';
oids['1.2.410.200004.5.2.1.7.3'] = '신용카드용';

//한국 전자 인증
oids['1.2.410.200004.5.4.1.1'] = '범용(개인)';
oids['1.2.410.200004.5.4.1.2'] = '범용(법인)';
oids['1.2.410.200004.5.4.1.101'] = '은행/보험용';
oids['1.2.410.200004.5.4.1.103'] = '신용카드용';
oids['1.2.410.200004.5.4.2.80'] = '전자세금용';

//한국 전산원
oids['1.2.410.200004.5.3.1.1'] = '기관';
oids['1.2.410.200004.5.3.1.2'] = '법인';
oids['1.2.410.200004.5.3.1.9'] = '개인';

//GPKI
oids['1.2.410.100001.2'] = 'GPKI 인증정책';
oids['1.2.410.100001.2.1'] = '기관용';
oids['1.2.410.100001.2.1.1'] = '전자관인';
oids['1.2.410.100001.2.1.2'] = '컴퓨터용';
oids['1.2.410.100001.2.1.3'] = '특수목적용';
oids['1.2.410.100001.2.1.4'] = '공공/민간 전자관인';
oids['1.2.410.100001.2.1.5'] = '공공/민간 컴퓨터용';
oids['1.2.410.100001.2.1.6'] = '공공/민간 특수목적용';
oids['1.2.410.100001.2.2'] = '개인용';
oids['1.2.410.100001.2.2.1'] = '공무원 전자서명';
oids['1.2.410.100001.2.2.2'] = '공공/민간 개인용 전자서명';

// ENGLISH Version
//금융결재원
var preFixEng = "ENG_";
//금융결재원
oids[preFixEng+'1.2.410.200005.1.1.1'] = 'Public(Individual)';
oids[preFixEng+'1.2.410.200005.1.1.4'] = 'Banking/CreditCard(Individual)';
oids[preFixEng+'1.2.410.200005.1.1.5'] = 'Public(Enterprise)';
oids[preFixEng+'1.2.410.200005.1.1.2'] = 'Banking/CreditCard(Corporation)';
oids[preFixEng+'1.2.410.200005.1.1.6.2'] = 'CreditCard';
oids[preFixEng+'1.2.410.200005.1.1.6.8'] = 'E-Tax';
oids[preFixEng+'1.2.410.200005.1.1.6.1'] = 'Banking(Enterprise)';

//한국 무역 통신
oids[preFixEng+'1.2.410.200012.1.1.1'] = 'Public(Individual)';
oids[preFixEng+'1.2.410.200012.1.1.101'] = 'Banking';
oids[preFixEng+'1.2.410.200012.1.1.105'] = 'CreditCard';
oids[preFixEng+'1.2.410.200012.1.1.3'] = 'Public(Corporation)';
oids[preFixEng+'1.2.410.200012.5.19.1.1'] = 'E-Tax';

//한국 증권 전산
oids[preFixEng+'1.2.410.200004.5.1.1.5'] = 'Public(Individual)';
oids[preFixEng+'1.2.410.200004.5.1.1.7'] = 'Public(Corporation)';
oids[preFixEng+'1.2.410.200004.5.1.1.9.2'] = 'CreditCard';
oids[preFixEng+'1.2.410.200004.5.1.1.9'] = 'Securities(Private)';
oids[preFixEng+'1.2.410.200004.1.1.12.902'] = 'E-Tax';
oids[preFixEng+'1.2.410.200004.5.1.1.9.1'] = 'Bank(Private)';
oids[preFixEng+'1.2.410.200004.5.1.1.10'] = 'Securities(Private)';
oids[preFixEng+'1.2.410.200004.5.1.1.10.1'] = 'Bank(Private)';
oids[preFixEng+'1.2.410.200004.5.1.1.10.2'] = 'Credit Cards(Coroporate)';

//한국 정보 인증
oids[preFixEng+'1.2.410.200004.5.2.1.2'] = '1Class(Individual)';
oids[preFixEng+'1.2.410.200004.5.2.1.1'] = '1Class(Corporation)';
oids[preFixEng+'1.2.410.200004.5.2.1.7.1'] = 'Banking/CreditCard';
oids[preFixEng+'1.2.410.200004.5.2.1.7.3'] = 'CreditCard';

//한국 전자 인증
oids[preFixEng+'1.2.410.200004.5.4.1.1'] = 'Public(Individual)';
oids[preFixEng+'1.2.410.200004.5.4.1.2'] = 'Public(Corporation)';
oids[preFixEng+'1.2.410.200004.5.4.1.101'] = 'Banking';
oids[preFixEng+'1.2.410.200004.5.4.1.103'] = 'CreditCard';
oids[preFixEng+'1.2.410.200004.5.4.2.80'] = 'E-Tax';

//한국 전산원
oids[preFixEng+'1.2.410.200004.5.3.1.1'] = 'Agency';
oids[preFixEng+'1.2.410.200004.5.3.1.2'] = 'Corporation';
oids[preFixEng+'1.2.410.200004.5.3.1.9'] = 'Individual';

//GPKI
oids[preFixEng+'1.2.410.100001.2'] = 'GPKI Authentication policy';
oids[preFixEng+'1.2.410.100001.2.1'] = 'Department';
oids[preFixEng+'1.2.410.100001.2.1.1'] = 'Department';
oids[preFixEng+'1.2.410.100001.2.1.2'] = 'Computer';
oids[preFixEng+'1.2.410.100001.2.1.3'] = 'Special';
oids[preFixEng+'1.2.410.100001.2.1.4'] = 'Public Department';
oids[preFixEng+'1.2.410.100001.2.1.5'] = 'Public Computer';
oids[preFixEng+'1.2.410.100001.2.1.6'] = 'Public Special';
oids[preFixEng+'1.2.410.100001.2.2'] = 'Personal';
oids[preFixEng+'1.2.410.100001.2.2.1'] = 'Personal';
oids[preFixEng+'1.2.410.100001.2.2.2'] = 'Public Personal';

// OCSP
oids['1.3.6.1.5.5.7.48.1'] = 'OCSP';
oids['OCSP'] = '1.3.6.1.5.5.7.48.1';

// VID
oids['1.2.410.200004.10.1.1.1'] = 'VID';
oids['VID'] = '1.2.410.200004.10.1.1.1';
	
// KISA
oids['1.2.410.200004.10.1.1'] = 'KISA_ID_DATA';
oids['KISA_ID_DATA'] = '1.2.410.200004.10.1.1';

// VID Random
oids['1.2.410.200004.10.1.1.3'] = 'Random';
oids['Random'] = '1.2.410.200004.10.1.1.3';

// Bank Name
var bankCD=forge.pki.bankCD = forge.bankCD = forge.bankCD || {};
//var bankCD= {};
bankCD['01'] = '한국은행';
bankCD['02'] = '산업은행';
bankCD['03'] = '기업은행';
bankCD['04'] = '국민은행';
bankCD['06'] = '국민은행';
bankCD['19'] = '국민은행';
bankCD['29'] = '국민은행';
bankCD['05'] = '외한은행';
bankCD['07'] = '수협은행';
bankCD['08'] = '수출입은행';

bankCD['10'] = '농협은행';
bankCD['11'] = '농협은행';
bankCD['12'] = '농협은행';
bankCD['13'] = '농협은행';
bankCD['14'] = '농협은행';
bankCD['15'] = '농협은행';
bankCD['16'] = '농협은행';
bankCD['17'] = '농협은행';

bankCD['20'] = '우리은행';
bankCD['22'] = '우리은행';
bankCD['24'] = '우리은행';
bankCD['83'] = '우리은행';
bankCD['84'] = '우리은행';

bankCD['21'] = '신한은행';
bankCD['26'] = '신한은행';
bankCD['28'] = '신한은행';
bankCD['88'] = '신한은행';

bankCD['23'] = 'SC은행';

bankCD['25'] = '하나은행';
bankCD['33'] = '하나은행';
bankCD['81'] = '하나은행';
bankCD['82'] = '하나은행';

bankCD['27'] = '한국씨티';
bankCD['36'] = '한국씨티';
bankCD['53'] = '한국씨티';

bankCD['31'] = '대구은행';
bankCD['32'] = '부산은행';

bankCD['34'] = '광주은행';
bankCD['35'] = '제주은행';
bankCD['37'] = '전북은행';
bankCD['39'] = '경남은행';

bankCD['46'] = '새마을금고';
bankCD['47'] = '새마을금고';
bankCD['85'] = '새마을금고';
bankCD['86'] = '새마을금고';

bankCD['48'] = '신협은행';
bankCD['49'] = '신협은행';

bankCD['50'] = '상호저축은행';
bankCD['51'] = '외국은행';
bankCD['54'] = 'HSBC은행';
bankCD['55'] = '도이치은행';
bankCD['56'] = '에이비엔암로은행';

bankCD['57'] = 'UFJ은행';
bankCD['58'] = '미즈호코퍼레이트은행';
bankCD['59'] = '미쓰비시도쿄UFJ은행';
bankCD['60'] = 'B.O.A';

bankCD['71'] = '우체국';
bankCD['72'] = '우체국';
bankCD['73'] = '우체국';
bankCD['74'] = '우체국';
bankCD['75'] = '우체국';

bankCD['76'] = '신용보증기금';
bankCD['77'] = '기술신용보증기금';
bankCD['95'] = '경찰청';
bankCD['91'] = '이니텍';

bankCD['99'] = '금융결제원';

//영문 은행명 
bankCD[preFixEng+'01'] = 'www.bok.or.kr'; // 영문없음 한국은행
bankCD[preFixEng+'02'] = 'www.kdb.co.kr';
bankCD[preFixEng+'03'] = 'www.kiupbank.co.kr';
bankCD[preFixEng+'04'] = 'www.kbstar.com';
bankCD[preFixEng+'06'] = 'www.kbstar.com';
bankCD[preFixEng+'19'] = 'www.kbstar.com';
bankCD[preFixEng+'29'] = 'www.kbstar.com';
bankCD[preFixEng+'05'] = 'www.keb.co.kr';
bankCD[preFixEng+'07'] = 'www.suhyup.co.kr';
bankCD[preFixEng+'08'] = 'www.koreaexim.go.kr';// 영문없음 수출입은행

bankCD[preFixEng+'10'] = 'www.nonghyup.com';
bankCD[preFixEng+'11'] = 'www.nonghyup.com';
bankCD[preFixEng+'12'] = 'www.nonghyup.com';
bankCD[preFixEng+'13'] = 'www.nonghyup.com';
bankCD[preFixEng+'14'] = 'www.nonghyup.com';
bankCD[preFixEng+'15'] = 'www.nonghyup.com';
bankCD[preFixEng+'16'] = 'www.nonghyup.com';
bankCD[preFixEng+'17'] = 'www.nonghyup.com';

bankCD[preFixEng+'20'] = 'www.wooribank.com';
bankCD[preFixEng+'22'] = 'www.wooribank.com';
bankCD[preFixEng+'24'] = 'www.wooribank.com';
bankCD[preFixEng+'83'] = 'www.wooribank.com';
bankCD[preFixEng+'84'] = 'www.wooribank.com';

bankCD[preFixEng+'21'] = 'www.shinhan.com';
bankCD[preFixEng+'26'] = 'www.shinhan.com';
bankCD[preFixEng+'28'] = 'www.shinhan.com';
bankCD[preFixEng+'88'] = 'www.shinhan.com';

bankCD[preFixEng+'23'] = 'www.scfirstbank.com';

bankCD[preFixEng+'25'] = 'www.hanabank.com';
bankCD[preFixEng+'33'] = 'www.hanabank.com';
bankCD[preFixEng+'81'] = 'www.hanabank.com';
bankCD[preFixEng+'82'] = 'www.hanabank.com';

bankCD[preFixEng+'27'] = 'www.citibank.co.kr';
bankCD[preFixEng+'36'] = 'www.citibank.co.kr';
bankCD[preFixEng+'53'] = 'www.citibank.co.kr';

bankCD[preFixEng+'31'] = 'www.daegubank.co.kr';
bankCD[preFixEng+'32'] = 'www.pusanbank.co.kr';

bankCD[preFixEng+'34'] = 'www.kjbank.com';
bankCD[preFixEng+'35'] = 'www.e-jejubank.com';
bankCD[preFixEng+'37'] = 'www.jbbank.co.kr';
bankCD[preFixEng+'39'] = 'www.kyongnambank.co.kr';

bankCD[preFixEng+'46'] = 'www.kfcc.co.kr'; // 영문 없음 새마을 금고
bankCD[preFixEng+'47'] = 'www.kfcc.co.kr';
bankCD[preFixEng+'85'] = 'www.kfcc.co.kr';
bankCD[preFixEng+'86'] = 'www.kfcc.co.kr';

bankCD[preFixEng+'48'] = 'www.cu.co.kr';
bankCD[preFixEng+'49'] = 'www.cu.co.kr';

bankCD[preFixEng+'50'] = 'www.fsb.or.kr';					// 영문 없음 상호저축은행
bankCD[preFixEng+'51'] = '외국은행';							// 영문 없음 외국 은행 사이트 없음
bankCD[preFixEng+'54'] = 'kr.hsbc.com';
bankCD[preFixEng+'55'] = 'www.db.com';
bankCD[preFixEng+'56'] = 'www.abnamro.com';			// 영문 없음 에이비엔암로은행

bankCD[preFixEng+'57'] = 'www.ufjbank.co.jp';			// www.ufjbank.co.jp -> www.bk.mufg.jp 혹 명칭이 바뀌면서 코드 새로 받지는 않았는지?
bankCD[preFixEng+'58'] = 'www.mizuhobank.co.jp';				// 영문 없음 미즈호코퍼레이트은행
bankCD[preFixEng+'59'] = 'www.bk.mufg.jp';				// 영문 없음 미쓰비시도쿄UFJ은행
bankCD[preFixEng+'60'] = 'www.bankofamerica.com';	// 영문 없음 B.O.A

bankCD[preFixEng+'71'] = 'www.epost.go.kr';				// 영문 없음 새마을 금고
bankCD[preFixEng+'72'] = 'www.epost.go.kr';
bankCD[preFixEng+'73'] = 'www.epost.go.kr';
bankCD[preFixEng+'74'] = 'www.epost.go.kr';
bankCD[preFixEng+'75'] = 'www.epost.go.kr';

bankCD[preFixEng+'76'] = 'www.kodit.co.kr';				// 영문 없음 신용보증기금
bankCD[preFixEng+'77'] = 'www.kibo.or.kr';					// 영문 없음 기술신용보증기금
bankCD[preFixEng+'95'] = 'www.police.go.kr';				// 영문 없음 경찰청
bankCD[preFixEng+'91'] = 'www.initech.com';

bankCD[preFixEng+'99'] = 'www.kftc.or.kr';					// 영문 없음 금융결제원


// } // end module implementation

/* ########## Begin module wrapper ########## 
var name = 'oids';
if(typeof define !== 'function') {
  // NodeJS -> AMD
  if(typeof module === 'object' && module.exports) {
    var nodeJS = true;
    define = function(ids, factory) {
      factory(require, module);
    };
  } else {
    // <script>
    if(typeof forge === 'undefined') {
      forge = {};
    }
    return initModule(forge);
  }
}
// AMD
var deps;
var defineFunc = function(require, module) {
  module.exports = function(forge) {
//    var mods = deps.map(function(dep) {
//      return require(dep);
//    }).concat(initModule);
	  
    var mods = [];
    for(key in deps){
    	mods.push( require(deps[key]) );
    }
    mods = mods.concat(initModule);	  
	  
	  
    // handle circular dependencies
    forge = forge || {};
    forge.defined = forge.defined || {};
    if(forge.defined[name]) {
      return forge[name];
    }
    forge.defined[name] = true;
    for(var i = 0; i < mods.length; ++i) {
      mods[i](forge);
    }
    return forge[name];
  };
};
var tmpDefine = define;
define = function(ids, factory) {
  deps = (typeof ids === 'string') ? factory.slice(2) : ids.slice(2);
  if(nodeJS) {
    delete define;
    return tmpDefine.apply(null, Array.prototype.slice.call(arguments, 0));
  }
  define = tmpDefine;
  return define.apply(null, Array.prototype.slice.call(arguments, 0));
};

define(['require','module'], function() {
  defineFunc.apply(null, Array.prototype.slice.call(arguments, 0));
});*/
// })();
