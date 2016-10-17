import { getData, fwd } from '../../api/api-front'
import config from '../../../../config'
const {apiClient} =config

export function signin (req, res) {
  res.noCache()
  getData(req, '/auth/bouygues/signin', {followRedirect: false}).nodeify(fwd(res))
}

export function signup (req, res) {
  res.noCache()
  getData(req, '/auth/bouygues/signup', {followRedirect: false}).nodeify(fwd(res))
}

export function link (req, res) {
  res.noCache()
  let token = req.query.access_token
  delete req.query.access_token
  getData(req, '/auth/bouygues/link', {
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
    const bouyguesCompleteFlow = await getData(req, '/auth/bouygues/unlink', {
      followRedirect: false,
      headers: {
        'Access-Token': token
      }
    })
    var bouyguesResponse = bouyguesCompleteFlow[0]
      , bouyguesBody = bouyguesCompleteFlow[1]

    const layout = 'layouts/oauth-strategy-unlink'
    res.status(bouyguesResponse.statusCode).render(layout, bouyguesBody)
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
    const bouyguesCompleteFlow = await getData(req, '/auth/bouygues/callback', {followRedirect: false})
    const bouyguesResponse = bouyguesCompleteFlow[0]
    const bouyguesBody = bouyguesCompleteFlow[1]
    const signupClientType = bouyguesBody.signupClientType || ''
    delete bouyguesBody.signupClientType

    const layout = 'layouts/oauth-success'
    if (bouyguesResponse.statusCode !== 200) {
      bouyguesBody.error = bouyguesResponse.statusMessage
    }
    res.status(200).render(layout, {
      statusCode: bouyguesResponse.statusCode,
      statusMessage: bouyguesResponse.statusMessage,
      tokenData: bouyguesBody,
      storageId: apiClient.token,
      signupClientType: signupClientType
    })
  }
  catch (err) {
    console.error(err)
    res.status(500).send('')
  }
}
