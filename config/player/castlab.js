export default {
  "customData": {
    "userId": "sample-user-id",
    "sessionId": "sample-session-id",
    "merchant": "sample-merchant"
  },
  "sendCustomData": true,
  "widevineHeader": {
    "provider": "castlabs",
    "contentId": "fkj3ljaSdfalkr3j",
    "trackType": "",
    "policy": ""
  },
  "assetId": "",
  "variantId": "",
  "debug": true,
  "ABRParameters": {
    "qualitySwitchThreshold": 2000,
    "bandwidthSafetyFactor": 1.75,
    "minBufferLength": 15,
    "maxBufferLength": 20,
    "liveDelay": 2,
    "disableBufferOccupancyRule": false
  },
  "authenticationToken": null,
  "widevineLicenseServerURL": "https://lic.staging.drmtoday.com/license-proxy-widevine/cenc/",
  "accessLicenseServerURL": "https://lic.staging.drmtoday.com/flashaccess/LicenseTrigger/v1",
  "playReadyLicenseServerURL": "https://lic.staging.drmtoday.com/license-proxy-headerauth/drmtoday/RightsManager.asmx",
  "silverlightFile": "./lib/castlab/3.1.2/dashcs/dashcs.xap",
  "flashFile": './lib/castlab/3.1.2/dashas/dashas.swf',
  "techs": ['dashjs', 'dashas', 'dashcs']
};
