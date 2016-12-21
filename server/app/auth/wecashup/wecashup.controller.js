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

  const {cookies:{wecashup = null}} = res

  res.status(res.statusCode || 200).render(layout, {
    statusMessage: (res.statusMessage || {subStatus: cookies.wecashup, transactionId: cookies.wecashup})
  })
}
