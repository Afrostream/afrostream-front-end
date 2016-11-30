import httpProxy from 'http-proxy'
const proxy = httpProxy.createProxyServer({
  changeOrigin: true
})

exports.proxy = function (req, res) {
  proxy.web(req, res, {
    target: req.query.url
  })
}
