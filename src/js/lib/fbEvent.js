import _ from 'lodash'
/**
 * React FBEvents Module
 */
let eventsList = []
const RE_SEP = /\-|\./
const RE_SEP_AZ = /(\-|\.)[a-zA-Z0-9]/
const RE_SEP_AZ_G = /(\-|\.)[a-zA-Z0-9]/g
const RE_WS = /[\s]+/g
const BLANK = ''
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
    document, 'script', 'https://connect.facebook.net/fr_FR/fbevents.js', 'fbevents')

  fbq('init', fbTrackingID)
}

export function camelize (path) {
  let id = path.split('/').slice(-1)[0]
  let m
  let c
  let i
  if (m = id.match(RE_SEP_AZ_G)) {
    for (i = 0; i < m.length; i++) {
      c = m[i].replace(RE_SEP, BLANK).toUpperCase()
      id = id.replace(RE_SEP_AZ, c)
    }
  }
  return (id.substring(0, id.lastIndexOf('.')) || id).replace(RE_WS, BLANK)
}

/**
 * pageview:
 * Basic FB pageview tracking
 * @param  {String} path - the current page page e.g. '/about'
 */
export function pageview ({path, params ={}}) {
  if (!path) {
    console.warn('path is required in .pageview()')
    return
  }

  const evt = camelize(path)
  if (typeof fbq === 'function' && evt.length && !~eventsList.indexOf(evt)) {
    eventsList.push(evt)
    fbq('track', 'PageView')
  }
}

export function track ({event, params ={}}) {
  if (!event) {
    console.warn('event is required in .track()')
    return
  }

  if (typeof fbq === 'function' && event.length && !~eventsList.indexOf(event)) {
    eventsList.push(event)
    fbq('track', event, params)
  }
}
