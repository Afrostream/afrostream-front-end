import config from '../../config'

const allowOrigin = function (options) {
  return function (req, res, next) {
    res.header('Access-Control-Allow-Origin', config.apiClient.urlPrefix)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
    next()
  }
}

export default allowOrigin
