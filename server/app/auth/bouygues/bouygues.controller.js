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
  getData(req, '/auth/bouygues/link', {
    followRedirect: false,
    header: {
      'Access-Token': req.query.access_token
    }
  }).nodeify(fwd(res))
}

export async function unlink (req, res) {
  res.noCache()
  try {
    const bouyguesCompleteFlow = await getData(req, '/auth/bouygues/unlink', {
      followRedirect: false,
      header: {
        'Access-Token': req.query.access_token
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
    var bouyguesResponse = bouyguesCompleteFlow[0]
      , bouyguesBody = bouyguesCompleteFlow[1]

    const layout = 'layouts/oauth-success'
    if (bouyguesResponse.statusCode !== 200) {
      bouyguesBody.error = bouyguesResponse.statusMessage
    }
    res.status(bouyguesResponse.statusCode).render(layout, {
      statusCode: bouyguesResponse.statusCode,
      statusMessage: bouyguesResponse.statusMessage,
      tokenData: bouyguesBody,
      storageId: apiClient.token
    })
  }
  catch (err) {
    console.error(err)
    res.status(500).send('')
  }
}
