import ActionTypes from '../consts/ActionTypes'
import * as UserActionCreators from './user'
import { push } from 'redux-router'
import { getToken, storeToken } from '../lib/storage'
import config from '../../../config/'
import window from 'global/window'

export function signin (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.signin,
      res: await api({path: `/auth/signin`, method: 'POST', params: form})
    })
  }
}

export function signup (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.signup,
      res: await api({path: `/auth/signup`, method: 'POST', params: form})
    })
  }
}

export function reset (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.reset,
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
          oauthPopup = null
          if (intervalCheck) {
            clearInterval(intervalCheck)
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
        //oauthPopup.onbeforeunload = beforeUnload
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

export function netsizeCheck () {
  return (dispatch, getState, actionDispatcher) => {
    return async api => ({
      type: ActionTypes.OAuth.netsizeCheck,
      res: await api({path: `/auth/netsize/check`, method: 'GET', passToken: true, local: true})
    })
  }
}

export function netsizeSubscribe ({strategy = 'netsize', path = 'subscribe', internalPlan :{}}) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))

    const token = getState().OAuth.get('token')
    let url = `/auth/${strategy}/${path}`
    //Si il y a un user et qu'on veut desynchro le strategy account, on passe le token en parametre
    if (token) {
      url = `${url}?access_token=${token.get('access_token')}&returnUrl=/auth/${strategy}/subscribe`
    }

    let width = 600,
      height = 450,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2

    return async () => {
      return await new Promise((resolve, reject) => {
        let oauthPopup = window.open(url, 'strategy_oauth', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left)
        let intervalCheck = 0

        let beforeUnload = (data) => {
          window.loginCallBack = null
          oauthPopup = null
          if (intervalCheck) {
            clearInterval(intervalCheck)
          }
          try {
            if (!data || (data && data.error)) {
              return reject({
                response: {
                  body: {
                    error: data.error,
                    message: data.message,
                    code: data.netsizeErrorCode || data.netsizeStatusCode,
                  }
                }
              })
            }
            return resolve({
              type: ActionTypes.OAuth.netsizeSubscribe,
              res: {
                body: {
                  subStatus: data.netsizeStatusCode,
                  transactionId: data.netsizeTransactionId,
                  internalPlan
                }
              }
            })
          } catch (err) {
            return reject(err)
          }

        }
        let eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent'
        let messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message'
        window[eventMethod](messageEvent, (event) => {
          console.log('received response:  ', event.data, event.origin, config.domain.host)
          if (!~event.origin.indexOf(config.domain.host)) return
          beforeUnload(event.data && event.data.data)
        }, false)
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
      type: ActionTypes.OAuth.logOut
    }
  }
}
