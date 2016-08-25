const forceSSL = function () {
  return function (req, res, next) {
    if (!req.secure) {
      return res.redirect('https://' + req.headers.host + req.url)
    }
    next()
  }
}

export default forceSSL
