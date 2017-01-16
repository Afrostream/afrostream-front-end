import config from '../../../config'
const env = process.env.NODE_ENV || 'development'

export function forceSSL () {
  return function (req, res, next) {
    const proto = req.get('x-forwarded-proto')
    const cdnHostname = req.get('x-afsm-forwarded-host')

    if (env !== 'production' && !cdnHostname.match(/^(staging)\./i)) {    // force ssl on staging
      return next()
    }

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
      cdnHostname.match(/^(www|beta)\./i)) {    // no redirect if already redirected
      // skipping redirect
      return next()
    }
    // redirect on www.afrostream.tv
    return res.redirect(301, proto + '://' + config.subdomain + '.' + config.domain.host + req.originalUrl)
  }
}
