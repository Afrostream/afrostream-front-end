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

    if (req.method !== 'GET' ||                   // no redirect on POST/PUT/DELETE/...
      !cdnHostname ||                           // no redirect when header x-afsm-forwarded-host is missing <=> env=dev|staging
      //req.originalUrl.match(/^\/auth\//i) ||  // no redirect on auth facebook, orange, bouygues
      config.domain.host !== 'afrostream.tv' ||  // no redirect other domain/subdomains
      cdnHostname.match(/^www\./i)) {           // no redirect if already redirected
      // skipping redirect
      return next()
    }
    // redirect on www.afrostream.tv
    return res.redirect(301, proto + '://www.' + config.domain.host + req.originalUrl)
  }
}
