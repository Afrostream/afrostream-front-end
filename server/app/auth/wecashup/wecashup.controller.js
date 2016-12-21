import { getData, fwd } from '../../api/api-front'

export async function callback (req, res) {
  res.noCache()
  getData(req, '/auth/wecashup/callback', {
    followRedirect: false,
    method: 'POST',
    headers: {'content-type': 'application/json'}
  }).nodeify(fwd(res))

}

export async function finalCallback (req, res) {
  res.noCache()
  const layout = 'layouts/final-callback-iframe'

  console.log('body', res.body, req.body)
  res.status(res.statusCode).render(layout, {})
}
