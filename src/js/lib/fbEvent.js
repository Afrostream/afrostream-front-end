/**
 * React FBEvents Module
 */

/**
 * Utilities
 */
export default {
  initialize: (fbTrackingID, options) => {
    if (!fbTrackingID) {
      console.warn('fbTrackingID is required in initialize()');
      return;
    }

    if (options) {
      if (options.debug && options.debug === true) {
        _debug = true;
      }
    }

    (!function (f, b, e, v, n, t, s) {
      if (f.fbq)return;
      n = f.fbq = function () {
        n.callMethod ?
          n.callMethod.apply(n, arguments) : n.queue.push(arguments)
      };
      if (!f._fbq)f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s)
    })(window,
      document, 'script', 'https://connect.facebook.net/en_US/fbevents.js', 'fbevents');

    fbq('init', fbTrackingID);
  },

  /**
   * pageview:
   * Basic GA pageview tracking
   * @param  {String} path - the current page page e.g. '/about'
   */
  track: function (path) {
    if (!path) {
      console.warn('path is required in .pageview()');
      return;
    }

    path = trim(path);
    if (path === '') {
      console.warn('path cannot be an empty string in .pageview()');
      return;
    }

    if (typeof fbq === 'function') {
      fbq('track', path);

      if (_debug) {
        console.log('called fbq(\'send\', \'pageview\', path);');
        console.log('with path: ' + path);
      }
    }
  }
};
