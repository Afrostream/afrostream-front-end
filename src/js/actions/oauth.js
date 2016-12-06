import ActionTypes from '../consts/ActionTypes'
import * as UserActionCreators from './user'
import { push } from 'redux-router'
import { getToken, storeToken } from '../lib/storage'
import config from '../../../config/'
import window from 'global/window'
import _ from 'lodash'

export function signin (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.signin,
      statsd: {
        method: 'increment',
        key: 'oauth.signin',
        value: 1
      },
      res: await api({path: `/auth/signin`, method: 'POST', params: form})
    })
  }
}

export function signup (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.signup,
      statsd: {
        method: 'increment',
        key: 'oauth.signup',
        value: 1
      },
      res: await api({path: `/auth/signup`, method: 'POST', params: form})
    })
  }
}

export function reset (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.reset,
      statsd: {
        method: 'increment',
        key: 'oauth.reset',
        value: 1
      },
      res: await api({
        path: `/auth/reset`,
        method: 'POST',
        params: form,
        passToken: true
      })
    })
  }
}

export function refresh () {
  return (dispatch, getState, actionDispatcher) => {

    let tokenData = getToken()

    return async api => ({
      type: ActionTypes.OAuth.refresh,
      res: await api({
        path: `/auth/refresh`,
        method: 'POST',
        params: {
          grant_type: 'refresh_token',
          refresh_token: tokenData.refresh_token
        }
      })
    })
  }
}
/**
 * Get token from localStorage and set in store
 * @returns {Promise}
 */
export function getIdToken () {
  return () => {
    return {
      type: ActionTypes.OAuth.getIdToken
    }
  }
}
/**
 * Get token from provider oauth
 * @param isSynchro
 * @returns {Function}
 */
export function strategy ({strategy = 'facebook', path = 'signup'}) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))

    const token = getState().OAuth.get('token')
    let url = `/auth/${strategy}/${path}`
    //Si il y a un user et qu'on veut desynchro le strategy account, on passe le token en parametre
    if (token) {
      url = `${url}?access_token=${token.get('access_token')}`
    }

    let width = 600,
      height = 450,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2

    return async () => {
      return await new Promise((resolve, reject) => {
        let oauthPopup = window.open(url, 'strategy_oauth', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left)
        let intervalCheck = 0

        let beforeUnload = () => {
          window.loginCallBack = null
          if (!oauthPopup) {
            return
          }
          oauthPopup = null
          if (intervalCheck) {
            clearTimeout(intervalCheck)
          }
          try {
            const tokenData = getToken()
            if (!tokenData || tokenData.error) {
              let error = tokenData ? tokenData : {message: 'Error: strategy error'}
              return reject(error)
            }
            return resolve({
              type: ActionTypes.OAuth.strategy
            })
          } catch (err) {
            return reject(err)
          }

        }
        //window.loginCallBack = beforeUnload
        let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
        let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
        oauthPopup.onbeforeunload = (e) => {
          intervalCheck = setTimeout(() => {
            beforeUnload(null)
          }, 1000)
        }
        window[eventMethod](messageEvent, (event) => {
          console.log('received response:  ', event.data, event.origin, config.domain.host)
          if (!~event.origin.indexOf(config.domain.host)) return
          storeToken(event.data)
          beforeUnload()
        }, false)
        //intervalCheck = setInterval(function () {
        //  try {
        //    //if (!oauthPopup || !oauthPopup.onbeforeunload) {
        //    if (!oauthPopup) {
        //      beforeUnload()
        //    }
        //  } catch (e) {
        //    console.log('onbeforeunlod error ', e)
        //  }
        //}, 1000)
      })
    }
  }
}

export function netsizeCheck ({internalPlan = {}}) {
  return (dispatch, getState, actionDispatcher) => {
    //return async api => ({
    //  type: ActionTypes.OAuth.netsizeCheck,
    //  res: await api({path: `/auth/netsize/check`, method: 'GET', passToken: true, local: true})
    //})
    return actionDispatcher(netsizeSubscribe({path: 'check', internalPlan}))
  }
}

const encodeUrlCallbackNetsize = function (token, path, callback) {
  return encodeURIComponent(`https://${config.domain.host}/auth/netsize/${path}?access_token=${token}${callback ? '&returnUrl=' + callback : ''}`)
}


export function netsizeSubscribe ({strategy = 'netsize', path = 'subscribe', internalPlan = {}}) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))

    const token = getState().OAuth.get('token')
    let url = `https://${config.domain.host}/auth/${strategy}/${path}`

    //Si il y a un user et qu'on veut desynchro le strategy account, on passe le token en parametre
    if (token) {
      const accessToken = token.get('access_token')
      const finalCB = encodeUrlCallbackNetsize(accessToken, 'final-callback')
      url = `${url}?access_token=${accessToken}`

      if (path === 'check') {
        url = `${url}&returnUrl=${encodeUrlCallbackNetsize(accessToken, 'subscribe', finalCB)}`
      } else {
        url = `${url}&returnUrl=${finalCB}`
      }
    }

    let width = 600,
      height = 450,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2

    return async () => {
      return await new Promise((resolve, reject) => {
        let oauthPopup = window.open(url, 'strategy_oauth', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left)
        let intervalCheck = 0

        let beforeUnload = (data, plan) => {
          window.loginCallBack = null
          if (!oauthPopup) {
            return
          }
          oauthPopup = null
          if (intervalCheck) {
            clearTimeout(intervalCheck)
          }
          try {
            if (!data || (data && data.error)) {
              //Format resut
              let error = _.merge({
                error: 0,
                message: 'Error: netsize error',
                netsizeErrorCode: 0,
                netsizeStatusCode: 0
              }, data || {})

              return reject({
                response: {
                  body: {
                    error: error.error,
                    message: error.message || error.error,
                    code: error.netsizeErrorCode || error.netsizeStatusCode,
                  }
                }
              })
            }
            //Format resut
            return resolve({
              type: ActionTypes.OAuth.netsizeSubscribe,
              res: {
                body: {
                  subStatus: data.netsizeStatusCode,
                  transactionId: data.netsizeTransactionId,
                  internalPlan: plan
                }
              }
            })
          } catch (error) {
            //Format resut
            return reject({
              response: {
                body: {
                  error
                }
              }
            })
          }

        }
        let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
        let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
        try {
          oauthPopup.onbeforeunload = (e) => {
            intervalCheck = setTimeout(() => {
              beforeUnload(null, internalPlan)
            }, 1000)
          }
          window[eventMethod](messageEvent, (event) => {
            console.log('received response:  ', event.data, event.origin, config.domain.host)
            if (!~event.origin.indexOf(config.domain.host)) return
            beforeUnload(event.data && event.data.data, internalPlan)
          }, false)
        } catch (error) {
          //Format resut
          return reject({
            response: {
              body: {
                error,
                code: 30
              }
            }
          })
        }
      })
    }
  }
}


/**
 * Logout user
 * @returns {Function}
 */
export function logOut () {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher({
      type: ActionTypes.User.logOut
    })
    actionDispatcher(push('/'))
    return {
      type: ActionTypes.OAuth.logOut,
      statsd: {
        method: 'increment',
        key: 'oauth.logout',
        value: 1
      }
    }
  }
}
