import { getData, fwd } from '../../api/api-front'

export async function callback (req, res) {
  res.noCache()

  console.log('kookoo : ', req.cookies)

  getData(req, '/auth/wecashup/callback', {
    followRedirect: false,
    method: 'POST',
    headers: {
      'Set-Cookie': req.cookies,
      'Cookie': req.cookies,
      'content-type': 'application/json'
    }
  }).nodeify(fwd(res))

}

export async function finalCallback (req, res) {
  res.noCache()
  const layout = 'layouts/final-callback-iframe'

  const wecashupData = res.cookies && res.cookies.wecashup

  res.status(res.statusCode || 200).render(layout, {
    data: ({
      statusMessage: res.statusMessage,
      statusCode: res.statusCode,
      data: {success: true, subStatus: wecashupData, transactionId: wecashupData}
    })
  })
}
