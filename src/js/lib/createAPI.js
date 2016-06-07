import Promise from 'bluebird'
import _ from 'lodash'
import qs from 'qs'
import URL from 'url'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../config'
import request from 'superagent'
import NProgress from 'nprogress'
import { storeToken } from '../lib/storage'

const {apiClient} = config

NProgress.configure({showSpinner: false})

const isTokenValid = function (tokenData) {
  return tokenData && new Date(tokenData.expiresAt).getTime() > Date.now()
}

async function getToken (tokenData) {
  if (isTokenValid(tokenData)) {
    return tokenData
  }
  if (!tokenData || !tokenData.refreshToken) {
    return tokenData
  }
  return tokenData

  let url = `${apiClient.urlPrefix}/auth/refresh`
  let body = {
    grant_type: 'refresh_token',
    refresh_token: tokenData.refreshToken
  }


  return await new Promise((resolve, reject) => {
    request('POST', url)
    //.timeout(1000)
      .send(body)
      .end((err, res) => {

        if (err) {
          return reject(err)
        }

        let storedData = storeToken(res.body)
        return resolve(storedData)
      })
  })
}
/**
 * return api function base on createRequest function
 * Usage:
 *   api('/users')
 *   api('/users/me')
 *   ...
 *
 * createRequest() may different from client and server sides
 * You can see createRequest() at:
 * Client: ../main.js
 * Server: /servr/index.js
 */
export default function createAPI (createRequest) {
  return async function api ({path, method = 'GET', params = {}, legacy = false, showLoader = true, local = false}) {
    let {pathname, query: queryStr} = URL.parse(path)
    let query, headers = {}, body

    if (_.isObject(method)) {
      params = method
      method = 'GET'
    }

    query = qs.parse(queryStr)

    if (method === 'GET') {
      if (params && _.isObject(params)) {
        _.assign(query, params)
      }

    } else {
      body = params
    }

    if (canUseDOM) {
      if (showLoader) {
        NProgress.start()
      }
      try {
        const storageId = apiClient.token
        let storedData = localStorage.getItem(storageId)
        let tokenDataStore = JSON.parse(storedData)
        let tokenData = await getToken(tokenDataStore)
        if (tokenData) {
          headers = _.merge(headers, {
            'Access-Token': tokenData.accessToken
          })
        }
      }
      catch (err) {
        console.log('set AccessToken in header fail', err)
      }
    }

    return await new Promise((resolve, reject) => {
      createRequest({method, headers, pathname, query, body, legacy, local})
        .end((err, res) => {
          if (showLoader) {
            NProgress.done()
          }
          if (err) {
            console.log(err)
            return reject(err)
          }
          return resolve(res)
        })
    })
  }
}
