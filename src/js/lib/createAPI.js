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
  return tokenData && new Date(tokenData.expiresAt).getTime() > Date.now()
}

async function setTokenInHeader (headers) {
  let tokenData = await fetchToken()
  if (tokenData && isTokenValid(tokenData)) {
    headers = _.merge(headers, {
      'Access-Token': tokenData.access_token
    })
  }
  return headers
}

export async function fetchToken (refresh = false) {
  let tokenData = getToken()

  //if (isTokenValid(tokenData)) {
  //  return tokenData
  //}

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
  try {
    let tokenData = await fetchToken()
    if (tokenData && isTokenValid(tokenData)) {
      data.headers = _.merge(data.headers || {}, {
        'Access-Token': tokenData.access_token
      })
    }
  }
  catch (err) {
    console.log('set AccessToken in header fail', err)
  }

  return createRequest(data).then((err, res)=> {
    if (err) {
      return reject(err)
    }
    return resolve(res)
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
  return async function api ({path, method = 'GET', params = {}, legacy = false, showLoader = true, local = false, passToken:false}) {
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
        try {
          headers = await setTokenInHeader(headers)
        }
        catch (err) {
          console.log('set AccessToken in header fail', err)
        }
      }
    }

    let promised = await new Promise((resolve, reject) => {

      const data = {method, headers, pathname, query, body, legacy, local}

      console.log('call before token error, buffer stack : ', promiseStack.length)

      createRequest(data)
        .end((err, res) => {
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
                  console.log('set token imppossible', err)
                  return reject(err)
                })
              }
              //return reject(err)
            }
            return reject(err)
          }
          return resolve(res)
        })
    })

    return promised
  }
}
