'use strict'

export function numberWithCommas (x) {
  return x.toLocaleString()
}

export function formatPrice (price, currency, coma = false) {


  const currencySymbols = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫' // Vietnamese Dong
  }

  let formatPrice = price / 100

  if (coma) {
    formatPrice = numberWithCommas(formatPrice)
  }

  return `${formatPrice}${currencySymbols[currency]}`
}

export function isBoolean (val) {
  if (val == null)
    return false

  if (typeof val === 'boolean') {
    if (val === true)
      return true

    return false
  }

  if (typeof val === 'string') {
    if (val === '')
      return false

    val = val.replace(/^\s+|\s+$/g, '').toLowerCase()
    if (val === 'true' || val === 'yes')
      return true

    val = val.replace(/,/g, '.').replace(/^\s*\-\s*/g, '-')
  }

  if (!isNaN(val))
    return (parseFloat(val) !== 0)

  return false
}
export const isDefined = val => val != null
export const isFunction = val => typeof val === 'function'
export const noop = _ => {
}

export const newScript = (src) => (cb) => {
  const script = document.createElement('script')
  script.src = src
  script.addEventListener('load', () => cb(null, src))
  script.addEventListener('error', () => cb(true, src))
  document.body.appendChild(script)
  return script
}

const keyIterator = (cols) => {
  const keys = Object.keys(cols)
  let i = -1
  return {
    next () {
      i++ // inc
      if (i >= keys.length) return null
      else return keys[i]
    }
  }
}

// tasks should be a collection of thunk
export const parallel = (...tasks) => (each) => (cb) => {
  let hasError = false
  let successed = 0
  const ret = []
  tasks = tasks.filter(isFunction)

  if (tasks.length <= 0) cb(null)
  else {
    tasks.forEach((task, i) => {
      const thunk = task
      thunk((err, ...args) => {
        if (err) hasError = true
        else {
          // collect result
          if (args.length <= 1) args = args[0]

          ret[i] = args
          successed++
        }

        if (isFunction(each)) each.call(null, err, args, i)

        if (hasError) cb(true)
        else if (tasks.length === successed) {
          cb(null, ret)
        }
      })
    })
  }
}

// tasks should be a collection of thunk
export const series = (...tasks) => (each) => (cb) => {
  tasks = tasks.filter(val => val != null)
  const nextKey = keyIterator(tasks)
  const nextThunk = () => {
    const key = nextKey.next()
    let thunk = tasks[key]
    if (Array.isArray(thunk)) thunk = parallel.apply(null, thunk).call(null, each)
    return [+key, thunk] // convert `key` to number
  }
  let key, thunk
  let next = nextThunk()
  key = next[0]
  thunk = next[1]
  if (thunk == null) return cb(null)

  const ret = []
  const iterator = () => {
    thunk((err, ...args) => {
      if (args.length <= 1) args = args[0]
      if (isFunction(each)) each.call(null, err, args, key)

      if (err) cb(err)
      else {
        // collect result
        ret.push(args)

        next = nextThunk()
        key = next[0]
        thunk = next[1]
        if (thunk == null) return cb(null, ret) // finished
        else iterator()
      }
    })
  }
  iterator()
}
