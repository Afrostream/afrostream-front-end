/**
 * React FBEvents Module
 */
let eventsList = []
/**
 * Utilities
 */
export function initialize (fbTrackingID) {
  if (!fbTrackingID) {
    console.warn('fbTrackingID is required in initialize()')
    return
  }

  (function (f, b, e, v, n, t, s) {
    if (f.fbq)return
    n = f.fbq = function () {
      n.callMethod ?
        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq)f._fbq = n
    n.push = n
    n.loaded = !0
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = !0
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window,
    document, 'script', 'https://connect.facebook.net/en_US/fbevents.js', 'fbevents')

  fbq('init', fbTrackingID)
}

export function toCamelCase (string) {
  return string[1].toUpperCase()
}

/**
 * pageview:
 * Basic GA pageview tracking
 * @param  {String} path - the current page page e.g. '/about'
 */
export function track (path) {
  if (!path) {
    console.warn('path is required in .pageview()')
    return
  }

  var regex = /(_|-|\/)([a-z])/g

  const evt = path.replace(regex, toCamelCase)

  if (typeof fbq === 'function' && evt.length && !~eventsList.indexOf(evt)) {
    eventsList.push(evt)
    debugger
    fbq('track', '"' + evt + '"')
  }
}
