import ActionTypes from '../consts/ActionTypes'
import * as UserActionCreators from './user'
import { push } from 'redux-router'
import { getToken } from '../lib/storage'
import config from '../../../config'
const {apiClient} = config

export function signin (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))
    return async api => ({
      type: ActionTypes.OAuth.signin,
      res: await api({path: `/auth/signin`, method: 'POST', params: form})
    })
  }
}

export function gift (form) {
  return signup(form)
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
      res: await api({path: `/auth/reset`, method: 'POST', params: form})
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
        window.loginCallBack = beforeUnload
        //oauthPopup.onbeforeunload = beforeUnload
        intervalCheck = setInterval(function () {
          try {
            //if (!oauthPopup || !oauthPopup.onbeforeunload) {
            if (!oauthPopup) {
              beforeUnload()
            }
          } catch (e) {
            console.log('onbeforeunlod error ', e)
          }
        }, 1000)
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
    return {
      type: ActionTypes.OAuth.logOut
    }
  }
}
