import config from '../../../config'

export default function forceSSL () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
      return next();
    }
    res.redirect('https://' + config.domain.host + req.url)
  }
}
export default function forceWWW () {
  return function (req, res, next) {
    if (req.host.indexOf('www.') !== 0) {
      res.redirect(301, req.protocol + '://www.' + config.domain.host + req.url)
    }
    next()
  }
}
