import { getData, fwd } from '../../api/api-front'
import config from '../../../../config'
const {apiClient} =config

export function signin (req, res) {
  res.noCache()
  getData(req, '/auth/orange/signin', {followRedirect: false}).nodeify(fwd(res))
}

export function signup (req, res) {
  res.noCache()
  getData(req, '/auth/orange/signup', {followRedirect: false}).nodeify(fwd(res))
}

export function link (req, res) {
  res.noCache()
  let token = req.query.access_token
  delete req.query.access_token
  getData(req, '/auth/orange/link', {
    followRedirect: false,
    headers: {
      'Access-Token': token
    }
  }).nodeify(fwd(res))
}

export async function unlink (req, res) {
  res.noCache()
  try {
    let token = req.query.access_token
    delete req.query.access_token
    const orangeCompleteFlow = await getData(req, '/auth/orange/unlink', {
      followRedirect: false,
      headers: {
        'Access-Token': token
      }
    })
    var orangeResponse = orangeCompleteFlow[0]
      , orangeBody = orangeCompleteFlow[1]

    const layout = 'layouts/oauth-strategy-unlink'
    res.status(orangeResponse.statusCode).render(layout, orangeBody)
  }
  catch (err) {
    console.error(err)
    res.status(500).send('')
  }
}

export function failure (req, res) {
  res.noCache()
  res.json({type: 'failure'})
}

export async function callback (req, res) {
  res.noCache()
  try {
    const orangeCompleteFlow = await getData(req, '/auth/orange/callback', {followRedirect: false, method: 'POST'})
    const orangeResponse = orangeCompleteFlow[0]
    const orangeBody = orangeCompleteFlow[1] || {}
    const signupClientType = orangeBody.signupClientType || ''
    delete orangeBody.signupClientType

    const layout = 'layouts/oauth-success'
    if (orangeResponse.statusCode !== 200) {
      orangeBody.error = orangeResponse.statusMessage
    }
    res.status(orangeResponse.statusCode).render(layout, {
      statusCode: orangeResponse.statusCode,
      statusMessage: orangeResponse.statusMessage,
      tokenData: orangeBody,
      storageId: apiClient.token,
      signupClientType: signupClientType
    })
  }
  catch (err) {
    console.error(err)
    res.status(500).send('')
  }
}
