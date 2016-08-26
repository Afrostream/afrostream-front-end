import config from '../../../config'
const env = process.env.NODE_ENV || 'development'

export function forceSSL () {
  return function (req, res, next) {
    if (env === 'development') {
      return next()
    }
    const proto = req.get('x-forwarded-proto')

    if (!proto || proto === 'https') {
      return next()
    }
    res.redirect(301, 'https://' + config.domain.host + req.originalUrl)
  }
}
export function forceWWW () {
  return function (req, res, next) {
    if (env === 'development') {
      return next()
    }
    const proto = req.get('x-forwarded-proto') || req.protocol

    if (req.host.indexOf('www.') !== 0) {
      return res.redirect(301, proto + 'www.' + config.domain.host + req.originalUrl)
    }
    next()
  }
}
