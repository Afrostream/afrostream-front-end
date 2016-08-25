export default function forceSSL () {
  return function (req, res, next) {
    if (req.headers['x-forwarded-proto'] === 'https') {
      return next();
    }
    res.redirect('https://' + req.headers.host + req.url)
  }
}
export default function forceWWW () {
  return function (req, res, next) {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url)
    }
    next()
  }
}
