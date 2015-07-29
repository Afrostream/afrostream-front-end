import ActionTypes from '../consts/ActionTypes';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../config/client';

if (canUseDOM) {
  var Auth0Lock = require('auth0-lock');
}

export function createLock() {
  return (dispatch, getState) => {
    const lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain);
    return {
      type: ActionTypes.User.createLock,
      lock: lock
    };
  };
}

export function showLock() {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    console.log(lock);
    lock.show(
      {
        dict: 'fr',
        connections: ['Username-Password-Authentication', 'facebook'],
        socialBigButtons: true,
        disableSignupAction: true
      }
    );
    return {
      type: ActionTypes.User.showLock
    };
  };
}

export function getIdToken() {
  return (dispatch, getState) => {
    console.log('*** here is the local storage ***');
    console.log(localStorage);
    console.log('*** end of local storage ***');

    var idToken = localStorage.getItem('afroToken');
    var authHash = this.lock.parseHash(window.location.hash);
    if (!idToken && authHash) {
      if (authHash.id_token) {
        idToken = authHash.id_token;
        localStorage.setItem('afroToken', authHash.id_token);
      }
      if (authHash.error) {
        console.log('Error signing in', authHash);
      }
    }
    return {
      type: ActionTypes.User.getIdToken,
      username,
      res: idToken
    };
  };
}
