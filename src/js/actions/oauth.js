import ActionTypes from '../consts/ActionTypes';
import * as UserActionCreators from './user';
import { pushState } from 'redux-router';

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

export function facebook() {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
    return async api => ({
      type: ActionTypes.OAuth.facebook,
      res: await api(`/auth/facebook`, 'GET')
    });
  };
}

export function getIdToken() {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(true));
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
