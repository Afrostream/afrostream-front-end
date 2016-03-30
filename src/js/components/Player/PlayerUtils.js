/**
 * Sequelize initialization module
 */
import MobileDetect from 'mobile-detect';

export function detectUA() {
  const userAgent = (window.navigator && navigator.userAgent) || '';
  const detect = function (pattern) {
    return function () {
      return (pattern).test(userAgent);
    };
  };

  return {
    getMobile: function () {
      return new MobileDetect(userAgent);
    },
    getBrowser: function () {
      var data = {};
      var browser = '';
      var version = '';
      var os = '';
      var osVersion = '';
      var parseUserAgent, prepareData, renameOsx, cutSafariVersion;

      parseUserAgent = function () {
        var userAgent = navigator.userAgent.toLowerCase(),
          browserParts = /(ie|firefox|chrome|safari|opera)(?:.*version)?(?:[ \/])?([\w.]+)/.exec(userAgent),
          osParts = /(mac|win|linux|freebsd|mobile|iphone|ipod|ipad|android|blackberry|j2me|webtv)/.exec(userAgent);

        if (!!userAgent.match(/trident\/7\./)) {
          browser = 'ie';
          version = 11;
        } else if (browserParts && browserParts.length > 2) {
          browser = browserParts[1];
          version = browserParts[2];
        }

        if (osParts && osParts.length > 1) {
          os = osParts[1];
        }

        osVersion = navigator.oscpu || navigator.appName;
      };

      prepareData = function () {
        data.browser = browser;
        data.version = parseInt(version, 10) || '';
        data.os = os;
        data.osVersion = osVersion;
      };

      renameOsx = function () {
        if (os === 'mac') {
          os = 'osx';
        }
      };

      cutSafariVersion = function () {
        if (os === 'safari') {
          version = version.substring(0, 1);
        }
      };

      parseUserAgent();

      // exception rules
      renameOsx();
      cutSafariVersion();

      prepareData();

      return data;
    },
    isChrome: function () {
      return detect(/webkit\W.*(chrome|chromium)\W/i)() && !detect(/Edge/)()
    },
    isFirefox: detect(/mozilla.*\Wfirefox\W/i),
    isIE: function () {
      return /(MSIE|Trident\/|Edge\/)/i.test(navigator.userAgent);
    },
    isEdge: function () {
      return /(Edge\/)/i.test(navigator.userAgent);
    },
    isSafari: function () {
      return navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && !/iPad|iPhone|iPod|CriOS/.test(navigator.platform);
    },
    isWindows: function () {
      return navigator.appVersion.indexOf('Win') != -1;
    }
  };
};
