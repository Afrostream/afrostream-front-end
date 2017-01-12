//
(function () {
  if (typeof window.CustomEvent === 'function') return false

  function CustomEvent (event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined}
    var evt = document.createEvent('CustomEvent')
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail)
    return evt
  }

  CustomEvent.prototype = window.Event.prototype

  window.CustomEvent = CustomEvent
})()

//
if (typeof window.localStorage == 'undefined' || typeof window.sessionStorage == 'undefined') (function () {

  var Storage = function (type) {
    function createCookie (name, value, days) {
      var date, expires

      if (days) {
        date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = '; expires=' + date.toGMTString()
      } else {
        expires = ''
      }
      document.cookie = name + '=' + value + expires + '; path=/'
    }

    function readCookie (name) {
      var nameEQ = name + '=',
        ca = document.cookie.split(';'),
        i, c

      for (i = 0; i < ca.length; i++) {
        c = ca[i]
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length)
        }

        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length).replace(/'/g, '"')
        }
      }
      return null
    }

    function setData (data) {
      data = JSON.stringify(data).replace(/"/g, "'")
      if (type == 'session') {
        window.name = data
      } else {
        createCookie('localStorage', data, 365)
      }
    }

    function clearData () {
      if (type == 'session') {
        window.name = ''
      } else {
        createCookie('localStorage', '', 365)
      }
    }

    function getData () {
      var data = type == 'session' ? window.name : readCookie('localStorage')
      return data ? JSON.parse(data) : {}
    }


    // initialise if there's already data
    var data = getData()

    return {
      length: 0,
      clear: function () {
        data = {}
        this.length = 0
        clearData()
      },
      getItem: function (key) {
        return data[key] === undefined ? null : data[key]
      },
      key: function (i) {
        // not perfect, but works
        var ctr = 0
        for (var k in data) {
          if (ctr == i) return k
          else ctr++
        }
        return null
      },
      removeItem: function (key) {
        delete data[key]
        this.length--
        setData(data)
      },
      setItem: function (key, value) {
        data[key] = value + '' // forces the value to a string
        this.length++
        setData(data)
      }
    }
  }

  if (typeof window.localStorage == 'undefined') window.localStorage = new Storage('local')
  if (typeof window.sessionStorage == 'undefined') window.sessionStorage = new Storage('session')

})()

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function () {
  var lastTime = 0
  var vendors = ['ms', 'moz', 'webkit', 'o']
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame']
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame']
      || window[vendors[x] + 'CancelRequestAnimationFrame']
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function (callback, element) {
      var currTime = new Date().getTime()
      var timeToCall = Math.max(0, 16 - (currTime - lastTime))
      var id = window.setTimeout(function () {
          callback(currTime + timeToCall)
        },
        timeToCall)
      lastTime = currTime + timeToCall
      return id
    }

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function (id) {
      clearTimeout(id)
    }
}())
