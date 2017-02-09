import ActionTypes from '../consts/ActionTypes'
import * as UserActionCreators from './user'
import { push } from 'redux-router'
import { getToken, storeToken } from '../lib/storage'
import request from 'superagent'
import config from '../../../config/'
import window from 'global/window'
import _ from 'lodash'
import qs from 'qs'

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
      })
    }
  }
}

export function cookieCheck ({modalType = 'popup', strategy = 'netsize', internalPlan = {}}) {
  return (dispatch, getState, actionDispatcher) => {
    return actionDispatcher(mobileSubscribe({strategy, modalType, path: 'check', internalPlan}))
  }
}

const encodeUrlCallback = function ({strategy, token, path, callback, encode = true}) {
  let url = `https://${config.domain.host}/auth/${strategy}/${path}?access_token=${token}${callback ? '&returnUrl=' + callback : ''}`
  if (encode) {
    url = encodeURIComponent(url)
  }
  return url
}


export function mobileSubscribe ({strategy = 'netsize', path = 'subscribe', internalPlan = {}, modalType = 'popup'}) {
  return (dispatch, getState, actionDispatcher) => {
    return async () => {
      actionDispatcher(UserActionCreators.pendingUser(true))

      const token = getState().OAuth.get('token')
      let url = `https://www.${config.domain.host}/auth/${strategy}/${path}`
      //Si il y a un user et qu'on veut desynchro le strategy account, on passe le token en parametre
      if (token) {
        const accessToken = token.get('access_token')
        const finalCB = encodeUrlCallback({
          strategy,
          token: accessToken,
          path: 'final-callback',
          encode: true
        })
        let query = await _.merge({}, internalPlan, {
          'access_token': accessToken,
          'returnUrl': path === 'check' ? encodeUrlCallback({
              strategy,
              token: accessToken,
              path: 'subscribe',
              encode: false,
              callback: finalCB
            }) : finalCB
        })
        //safe ecode url
        url = `${url}?${qs.stringify(query, null, null, {encodeURIComponent: e => e})}`
      }

      let width = 600,
        height = 450,
        top = (window.outerHeight - height) / 2,
        left = (window.outerWidth - width) / 2

      return await new Promise((resolve, reject) => {
        let oauthPopup

        switch (modalType) {
          case 'ajax':
            oauthPopup = request.get(url).then(() => {
              actionDispatcher(UserActionCreators.pendingUser(false))
            }, (error) => {
              return reject({
                response: {
                  body: {
                    error
                  }
                }
              })
            })
            break
          default:
            oauthPopup = window.open(url, 'strategy_oauth', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left)
            break
        }

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
                message: (data && typeof data.error === 'string' && data.error) || 'Error: mobile error',
                netsizeErrorCode: 0,
                netsizeStatusCode: 0
              }, data || {})

              return reject({
                response: {
                  body: {
                    error: error.error,
                    message: error.message || error.error,
                    code: error.netsizeErrorCode || error.netsizeStatusCode || error.code,
                  }
                }
              })
            }
            //Format resut
            return resolve({
              type: ActionTypes.OAuth.mobileSubscribe,
              strategy,
              res: {
                body: {
                  subStatus: data.netsizeStatusCode || data.subStatus,
                  transactionId: data.netsizeTransactionId || data.transactionId,
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
          if (oauthPopup && oauthPopup.onbeforeunload) {
            oauthPopup.onbeforeunload = (e) => {
              intervalCheck = setTimeout(() => {
                beforeUnload(null, internalPlan)
              }, 1000)
            }
          }
          window[eventMethod](messageEvent, (event) => {
            console.log('received response:  ', event.data, event.origin, config.domain.host)
            if (typeof event.data === 'string' || !~event.origin.indexOf(config.domain.host)) return
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
