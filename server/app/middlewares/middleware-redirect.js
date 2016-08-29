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
    const proto = req.get('x-forwarded-proto') || req.protocol
    const cdnHostname = req.get('x-afsm-forwarded-host')

    if (!cdnHostname ||                         // no header x-afsm-forwarded-host <=> env=dev|staging
        req.originalUrl.match(/^\/auth\//i) ||  // auth facebook, orange, bouygues
        cdnHostname.match(/^www\./i)) {         // already redirected
      // skipping redirect
      return next()
    }
    // redirect on www.afrostream.tv
    return res.redirect(301, proto + '://www.' + config.domain.host + req.originalUrl)
  }
}
