import { getData, fwd } from '../../api/api-front'
import config from '../../../../config'
const {apiClient} =config

export function signin (req, res) {
  res.noCache()
  getData(req, '/auth/facebook/signin', {followRedirect: false}).nodeify(fwd(res))
}

export function signup (req, res) {
  res.noCache()
  getData(req, '/auth/facebook/signup', {followRedirect: false}).nodeify(fwd(res))
}

export function link (req, res) {
  res.noCache()
  let token = req.query.access_token
  delete req.query.access_token
  getData(req, '/auth/facebook/link', {
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
    const facebookCompleteFlow = await getData(req, '/auth/facebook/unlink', {
      followRedirect: false,
      headers: {
        'Access-Token': token
      }
    })
    var fbResponse = facebookCompleteFlow[0]
      , fbBody = facebookCompleteFlow[1]

    const layout = 'layouts/oauth-strategy-unlink'
    res.status(fbResponse.statusCode).render(layout, fbBody)
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
    const facebookCompleteFlow = await getData(req, '/auth/facebook/callback', {followRedirect: false})
    var fbResponse = facebookCompleteFlow[0]
      , fbBody = facebookCompleteFlow[1]

    const layout = 'layouts/oauth-success'
    if (fbResponse.statusCode !== 200) {
      fbBody.error = fbResponse.statusMessage
    }
    res.status(fbResponse.statusCode).render(layout, {
      statusCode: fbResponse.statusCode,
      statusMessage: fbResponse.statusMessage,
      tokenData: fbBody,
      storageId: apiClient.token
    })
  }
  catch (err) {
    console.error(err)
    res.status(500).send('')
  }
}
