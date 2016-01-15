import ActionTypes from '../consts/ActionTypes';
import * as UserActionCreators from './user';
import * as ModalActionCreators from './modal';
import { pushState } from 'redux-router';
import { apiClient } from '../../../config';

export function signin(form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.signin,
      res: await api(`/auth/signin`, 'POST', form)
    });
  };
}

export function signup(form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.signup,
      res: await api(`/auth/signup`, 'POST', form)
    });
  };
}

export function reset(form) {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.signup,
      res: await api(`/auth/reset`, 'POST', form)
    });
  };
}

export function authState(event) {
  if (event.origin == `${apiClient.urlPrefix}`) {
    actionDispatcher(UserActionCreators.pendingUser(false));
    let state;
    let token;
    switch (state) {
      case 'success':
        return {
          type: ActionTypes.OAuth.facebook,
          token
        };
        break;
      case 'failure':
        return {
          type: ActionTypes.OAuth.facebook,
          token
        };
        break;
    }
  }
}

/**
 * Get token from facebook oauth
 * @returns {Promise}
 */
export function facebook() {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return new Promise(
      (resolve, reject) => {

        let url = `/auth/facebook`,
          width = 400,
          height = 650,
          top = (window.outerHeight - height) / 2,
          left = (window.outerWidth - width) / 2;

        let oauthPopup = window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);
        oauthPopup.onbeforeunload = function () {
          actionDispatcher(ModalActionCreators.close());
          actionDispatcher(getIdToken());
        }.bind(this);
      }
    );
  };
}

export function getIdToken() {
  return (dispatch, getState, actionDispatcher) => {
    return {
      type: ActionTypes.OAuth.getIdToken
    };
  };
}

/**
 * Logout user
 * @returns {Function}
 */
export function logOut() {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(pushState(null, '/'));
    actionDispatcher({
      type: ActionTypes.User.logOut
    });
    return {
      type: ActionTypes.OAuth.logOut
    };
  };
}
