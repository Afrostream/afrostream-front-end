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
  return (dispatch, getState, actionDispatcher) => {
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
export function provider ({strategy = 'facebook', path = 'signin'}) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true))

    const token = getState().OAuth.get('token')
    let url = `/auth/${strategy}/${path}`
    //Si il y a un user et qu'on veut desynchro le strategy account, on passe le token en parametre
    if (token) {
      url = `${url}?access_token=${token.get('accessToken')}`
    }

    let width = 400,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2

    return async () => {
      return await new Promise((resolve, reject) => {
        let oauthPopup = window.open(url, 'strategy_oauth', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left)
        let intervalCheck = 0
        let beforeUnload = () => {
          oauthPopup = null
          if (intervalCheck) {
            clearInterval(intervalCheck)
          }
          try {
            const tokenData = getToken()
            if (tokenData && tokenData.error) {
              let message = ''
              switch (path) {
                case 'signin':
                  message = 'Error: No user found, please associate your profile with strategy after being connected'
                  break
                case 'link':
                  message = 'Error: Your profile is already linked to another user'
                  break
                default:
                  message = tokenData.error
                  break
              }
              return reject({message: message})
            }
            return resolve({
              type: ActionTypes.OAuth.strategy
            })
          } catch (err) {
            return reject(err)
          }

        }
        oauthPopup.onbeforeunload = beforeUnload
        intervalCheck = setInterval(function () {
          if (!oauthPopup.onbeforeunload) {
            beforeUnload()
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
