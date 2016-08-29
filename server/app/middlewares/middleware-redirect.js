import config from '../../../config'
const env = process.env.NODE_ENV || 'development'

export function forceSSL () {
  return function (req, res, next) {
    if (env !== 'production') {
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
    if (env !== 'production') {
      return next()
    }
    const proto = req.get('x-forwarded-proto') || req.protocol
    if (host.match(/^www\..*/i)) {
      return next()

    }
    return res.redirect(301, proto + '://www.' + config.domain.host + req.originalUrl)
  }
}
