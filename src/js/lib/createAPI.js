import Promise from 'bluebird'
import _ from 'lodash'
import qs from 'qs'
import URL from 'url'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../config'
import request from 'superagent'
import NProgress from 'nprogress'
import { storeToken, getToken } from '../lib/storage'

const {apiClient} = config

NProgress.configure({showSpinner: false})

const isTokenValid = function (tokenData) {
  //test date - 3hours
  return tokenData && tokenData.access_token && new Date(tokenData.expiresAt).getTime() > (Date.now() + 10800000)
}

async function setTokenInHeader (headers) {
  try {
    let tokenData = await fetchToken()
    if (tokenData && isTokenValid(tokenData)) {
      headers = _.merge(headers || {}, {
        'Access-Token': tokenData.access_token
      })
    }
    return headers
  }
  catch (err) {
    console.log('set AccessToken in header fail', err)
    return headers
  }
}

export async function fetchToken (refresh = false) {
  let tokenData = getToken()

  if (isTokenValid(tokenData)) {
    return tokenData
  }

  if (!refresh) {
    return tokenData
  }

  let url = `${apiClient.urlPrefix}/auth/refresh`
  let body = {
    grant_type: 'refresh_token',
    refresh_token: tokenData.refresh_token
  }

  return await new Promise((resolve, reject) => {
    request('POST', url)
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

let promiseStack = []

async function promiseCalls ({createRequest, data, reject, resolve}) {
  // Promise.map awaits for returned promises as well.
  data.headers = await setTokenInHeader(data.headers)
  console.log('promiseCalls', data)
  return await new Promise((allRes, allRej) => {
    createRequest(data)
      .end((err, res)=> {
        if (err) {
          reject(err)
          return allRej(err)
        }
        resolve(res)
        return allRes(res)
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
  return async function api ({path, method = 'GET', params = {}, legacy = false, showLoader = true, local = false, passToken = false}) {
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
      if (passToken) {
        headers = await setTokenInHeader(headers)
      }
    }

    let promised = await new Promise((resolve, reject) => {

      const data = {method, headers, pathname, query, body, legacy, local}

      const req = createRequest(data)
      req.end((err, res) => {
        if (showLoader) {
          NProgress.done()
        }
        if (err) {
          console.log(err)
          if (err.status === 401 && err.message === 'Unauthorized') {
            //push data in buffer http calls promise
            promiseStack.push({createRequest, data, reject, resolve})

            console.log('token is expired, try to get new one, buffer stack : ', promiseStack.length)
            if (promiseStack.length === 1) {
              //get new token
              return fetchToken(true).then(()=> {
                //try to call all promises
                return Promise.map(promiseStack, promiseCalls).then(()=> {
                  console.log('all http calls done ,buffer stack : ', promiseStack.length)
                  //clear buffer
                  promiseStack = []
                })
              }).catch((err) => {
                console.log('fetch refreshToken error', err)
                return reject(err)
              })
            }
            return reject(err)
          }
          return reject(err)
        }
        return resolve(res)
      })
    })

    return promised
  }
}
