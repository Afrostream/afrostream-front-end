import ActionTypes from '../consts/ActionTypes';
import { pushState } from 'redux-router';

export function signin(form) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.signin,
      res: await api(`/auth/signin`, 'POST', form)
    });
  };
}

export function signup(form) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.signup,
      res: await api(`/auth/signup`, 'POST', form)
    });
  };
}

export function reset(form) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.signup,
      res: await api(`/auth/reset`, 'POST', form)
    });
  };
}

export function facebook() {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.OAuth.facebook,
      res: await api(`/auth/facebook`, 'GET')
    });
  };
}

export function getIdToken() {
  return (dispatch, getState) => {
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
    return {
      type: ActionTypes.OAuth.logOut
    };
  };
}
