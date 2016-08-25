import config from '../../../config'

export default forceSSL = function () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
      return next()
    }
    res.redirect('https://' + config.domain.host + req.url)
  }
}
export default forceWWW = function () {
  return function (req, res, next) {
    const env = process.env.NODE_ENV || 'development'
    if (env === 'development') {
      return next()
    }
    if (req.host.indexOf('www.') !== 0) {
      return res.redirect(301, req.protocol + '://www.' + config.domain.host + req.url)
    }
    next()
  }
}
