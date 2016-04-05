import ActionTypes from '../consts/ActionTypes';
import * as UserActionCreators from './user';
import * as ModalActionCreators from './modal';
import { pushState } from 'redux-router';
import { apiClient } from '../../../config';
import { getToken } from '../lib/storage';

export function signin (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.signin,
      res: await api(`/auth/signin`, 'POST', form)
    });
  };
}

export function gift (form) {
  return signup(form);
}

export function signup (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.signup,
      res: await api(`/auth/signup`, 'POST', form)
    });
  };
}

export function reset (form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.reset,
      res: await api(`/auth/reset`, 'POST', form)
    });
  };
}
/**
 * Get token from localStorage and set in store
 * @returns {Promise}
 */
export function getIdToken () {
  return (dispatch, getState, actionDispatcher) => {
    return {
      type: ActionTypes.OAuth.getIdToken
    };
  };
}
/**
 * Get token from facebook oauth
 * @param isSynchro
 * @returns {Function}
 */
export function facebook (path = 'signin') {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));

    const token = getState().OAuth.get('token');
    //Si il y a un user et qu'on veut desynchro le social account, on passe le token en parametre
    if (token) {
      path = `${path}?access_token=${token.get('accessToken')}`;
    }

    let url = `/auth/facebook/${path}`,
      width = 400,
      height = 650,
      top = (window.outerHeight - height) / 2,
      left = (window.outerWidth - width) / 2;

    return async () => {
      return await new Promise((resolve, reject) => {
        let oauthPopup = window.open(url, 'facebook_oauth', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        oauthPopup.onbeforeunload = function () {
          try {
            const tokenData = getToken();
            if (tokenData && tokenData.token) {
              return resolve({
                type: ActionTypes.OAuth.facebook
              });
            } else {
              return reject('err');
            }
          } catch (err) {
            return reject(err);
          }
        }
      });
    };
  };
}

/**
 * Logout user
 * @returns {Function}
 */
export function logOut () {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher({
      type: ActionTypes.User.logOut
    });
    return {
      type: ActionTypes.OAuth.logOut
    };
  };
}
