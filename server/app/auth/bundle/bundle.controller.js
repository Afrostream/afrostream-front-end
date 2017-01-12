import _ from 'lodash'
import { getGeo } from '../../../../src/js/lib/geo'
import config from '../../../../config'
import request from 'superagent'
import Q from 'q'
const {apiClient: {protocol, authority}} = config

export async function fetchToken (refreshToken) {
  const tokenUrl = `${protocol}://${ authority }/auth/refresh`

  const body = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  }

  return request
    .post(tokenUrl)
    .type('json')
    .send(body)
    .then((resp) => {
      return resp.body
    })
}

export async function getGeoInfo (req, initialState) {
  return getGeo({
    ip: req.userIp
  }).then((geo) => {
    console.log(geo)
    initialState = _.merge(initialState, {Geo: {geo}})
  })
}

export async function getUserInfo (req, initialState) {

  if (!req.query.access_token) {
    throw new Error('no user token infos passed in query')
  }

  if (!req.query.refresh_token) {
    throw new Error('no user refresh token infos passed in query')
  }

  const userUrl = `${protocol}://${ authority }/api/users/me`

  let headers = {
    'Access-Token': req.query.access_token
  }

  const refreshToken = req.query.refresh_token

  return request
    .get(userUrl)
    .set(headers)
    .type('json')
    .then((response) => {
      const user = _.merge({
        authorized: true,
        picture: '/images/default/carre.jpg'
      }, response.body)
      return initialState = _.merge(initialState, {User: {user}})
    })
    .then(
      r => r,
      err => {
        if (err && err.status === 401 && err.response.body.message === 'unauthorized') {
          console.log('error 401, ty to refresh user token')
          return fetchToken(refreshToken)
            .then((token) => {
              console.log('token fetched', token)
              headers.access_token = token.access_token
              initialState.OAuth = _.merge(initialState.OAuth, {token})

              return request
                .get(userUrl)
                .set(headers)
                .type('json')
            })
        }
        throw err
      });
}

exports.index = async function (req, res) {

  let initialState = {
    Geo: {geo: {countryCode: req.query.countryCode || '--'}},
    User: {user: null}
  }

  res.noCache()

  return Q.all([
    getGeoInfo(req, initialState).then(r => r, err => console.log(err)),
    getUserInfo(req, initialState).then(r => r, err => console.log(err))
  ]).then(() => {
      res.status(200).jsonp({initialState})
    },
    error => {
      console.log('Get Bundle error', error)
      res.status(500).jsonp({error, initialState})
    })
}
