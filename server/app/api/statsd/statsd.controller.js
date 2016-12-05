import ans from 'afrostream-node-statsd'

ans.init({
  module: 'afrostream-front-end'
})
/**
 * pixel tracking
 */
export function index (req, res) {
  //method :increment, gauge et timing
  const {method = 'increment', key, value} = req.query
  ans.client[method](key, value)
}
