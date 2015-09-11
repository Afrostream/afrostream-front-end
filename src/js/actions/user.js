import ActionTypes from '../consts/ActionTypes';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../config/client';
import _ from 'lodash';

if (canUseDOM) {
  var Auth0Lock = require('auth0-lock');
}

export function secureRoute() {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().User.get('token');
    const tokenId = config.auth0.token;
    let location = `/?&${tokenId}=${token}`;
    if (canUseDOM) {
      return window.location = location;
    }

    return {
      type: ActionTypes.User.secureRoute
    };
  };
}

export function subscribe(data) {

  return (dispatch, getState) => {

    const user = getState().User.get('user');
    const token = getState().User.get('token');
    let afroToken = getState().User.get('afroToken') || user.get('afro_token');
    return async api => ({
      type: ActionTypes.User.subscribe,
      res: await api(`/subscriptions/`, 'POST', data, token, afroToken)
    });
  };
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

export function logOut() {
  return (dispatch, getState) => {
    const storageId = config.auth0.token;
    const storageRefreshId = config.auth0.tokenRefresh;
    const storageAfroId = config.apiClient.token;
    localStorage.removeItem(storageId);
    localStorage.removeItem(storageRefreshId);
    localStorage.removeItem(storageAfroId);
    return {
      type: ActionTypes.User.logOut
    };
  };
}

const getQueryString = function (field, url) {
  if (canUseDOM) {
    let href = url ? url : window.location.href;
    let reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i');
    let string = reg.exec(href);
    return string ? string[1] : null;
  }
  return null;
};

const storeToken = function (id_token, refresh_token, afro_token) {
  const storageId = config.auth0.token;
  const storageRefreshId = config.auth0.tokenRefresh;
  const storageAfroId = config.apiClient.token;
  if (id_token) {
    localStorage.setItem(storageId, id_token);
  }
  if (refresh_token) {
    localStorage.setItem(storageRefreshId, refresh_token);
  }
  if (storageAfroId) {
    localStorage.setItem(storageAfroId, afro_token);
  }
};

const refreshToken = function (getState) {
  return new Promise(
    (resolve, reject) => {
      const lock = getState().User.get('lock');
      const storageRefreshId = config.auth0.tokenRefresh;
      const idToken = localStorage.getItem(storageRefreshId);
      const refreshToken = getState().User.get('refreshToken') || idToken;
      if (!refreshToken) {
        return reject('no trefresh token');
      }
      lock.getClient().refreshToken(refreshToken, function (err, delegationResult) {
        if (err) {
          console.log('*** Error loading the refresh token ***', err);
          localStorage.removeItem(storageRefreshId);
          return reject(err);
        }

        lock.getProfile(delegationResult.id_token, function (err, profile) {
          if (err) {
            console.log('*** Error loading the refresh token ***', err);
            localStorage.removeItem(storageRefreshId);
          }
          // Get here the new JWT via delegationResult.id_token
          // store token
          profile = profile || {};
          storeToken(delegationResult.id_token, null, profile[config.apiClient.token]);
          console.log('*** Refreshed token ***', profile);
          return resolve({
            type: ActionTypes.User.getProfile,
            user: profile
          });
        });
      });
    }
  );
};

export function getProfile() {

  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    const token = getState().User.get('token');

    return async auth0 =>(
      await new Promise(
        (resolve, reject) => {
          lock.getProfile(token, function (err, profile) {
            if (err) {
              console.log('*** Error loading the profile - most likely the token has expired ***', err);
              return refreshToken(getState)
                .then(function (data) {
                  console.log('getProfile return data', data);
                  return resolve(data);
                })
                .catch(function (tokenErr) {
                  return reject(tokenErr);
                });
            }
            profile = profile || {};
            return resolve({
              type: ActionTypes.User.getProfile,
              user: profile
            });
          });
        }
      )
    );
  };
}

export function showLock(container = null) {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    let lockOptions = _.cloneDeep(config.auth0.signIn);

    if (container) {
      _.merge(lockOptions, {
        popup: false,
        closable: false,
        container: container
      });
    }

    return async auth0 =>(
      await new Promise(
        (resolve, reject) => {
          lock.show(
            lockOptions
            , function (err, profile, id_token, access_token, state, refresh_token) {
              if (err) {
                console.log('*** Error loading the profile - most likely the token has expired ***', err);
                //localStorage.removeItem(storageId);
                //return reject(err);
                //try to refresh token session
                return refreshToken(getState, function (tokenErr, data) {
                  if (tokenErr) {
                    return reject(tokenErr);
                  }
                  return resolve(data);
                });
              }
              // store token
              profile = profile || {};
              var tokenAfro = profile.hasOwnProperty(config.apiClient.token) ? profile[config.apiClient.token] : null;
              storeToken(id_token, refresh_token, tokenAfro);
              // store refresh_token
              return resolve({
                type: ActionTypes.User.showLock,
                user: profile,
                token: id_token,
                refreshToken: refresh_token,
                afroToken: profile[config.apiClient.token]
              });
            }
          );
        }
      ));
  };
}

export function showSignupLock() {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    return async auth0 =>(
      await new Promise(
        (resolve, reject) => {
          lock.showSignup(
            config.auth0.signUp
            , function (err, profile, id_token, access_token, state, refresh_token) {
              if (err) {
                console.log('*** Error loading the profile - most likely the token has expired ***', err);
                //localStorage.removeItem(storageId);
                //return reject(err);
                //try to refresh token session
                return refreshToken(getState, function (tokenErr, data) {
                  if (tokenErr) {
                    return reject(tokenErr);
                  }
                  return resolve(data);
                });
              }
              // store token
              profile = profile || {};
              var tokenAfro = profile.hasOwnProperty(config.apiClient.token) ? profile[config.apiClient.token] : null;
              storeToken(id_token, refresh_token, tokenAfro);
              // store refresh_token
              return resolve({
                type: ActionTypes.User.showLock,
                user: profile,
                token: id_token,
                refreshToken: refresh_token,
                afroToken: profile[config.apiClient.token]
              });
            }
          );
        }
      ));
  };
}

export function showReset(container = null) {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    let lockOptions = _.cloneDeep(config.auth0.signIn);

    if (container) {
      _.merge(lockOptions, {
        popup: false,
        closable: false,
        container: container
      });
    }

    return async auth0 =>(
      await new Promise(
        (resolve, reject) => {
          lock.showReset(
            lockOptions
            , function (err, profile, id_token, access_token, state, refresh_token) {
              if (err) {
                console.log('*** Error loading the profile - most likely the token has expired ***', err);
                //localStorage.removeItem(storageId);
                //return reject(err);
                //try to refresh token session
                return refreshToken(getState, function (tokenErr, data) {
                  if (tokenErr) {
                    return reject(tokenErr);
                  }
                  return resolve(data);
                });
              }
              // store token
              profile = profile || {};
              var tokenAfro = profile.hasOwnProperty(config.apiClient.token) ? profile[config.apiClient.token] : null;
              storeToken(id_token, refresh_token, tokenAfro);
              // store refresh_token
              return resolve({
                type: ActionTypes.User.showLock,
                user: profile,
                token: id_token,
                refreshToken: refresh_token,
                afroToken: profile[config.apiClient.token]
              });
            }
          );
        }
      ));
  };
}

export function showSigninLock() {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    return async auth0 =>(
      await new Promise(
        (resolve, reject) => {
          lock.show(
            //FIXME: trouve pourquoi ça marche pas avec config.auth0.signIn
            config.auth0.signIn
            /*{
             dict: 'fr',
             connections: ['Username-Password-Authentication'],
             socialBigButtons: true,
             disableSignupAction: true,
             rememberLastLogin: false,
             disableResetAction: false,
             authParams: {
             scope: 'openid offline_access'
             }
             }*/
            , function (err, profile, id_token, access_token, state, refresh_token) {
              if (err) {
                console.log('*** Error loading the profile - most likely the token has expired ***', err);
                //localStorage.removeItem(storageId);
                //return reject(err);
                //try to refresh token session
                return refreshToken(getState, function (tokenErr, data) {
                  if (tokenErr) {
                    return reject(tokenErr);
                  }
                  return resolve(data);
                });
              }
              // store token
              profile = profile || {};
              var tokenAfro = profile.hasOwnProperty(config.apiClient.token) ? profile[config.apiClient.token] : null;
              storeToken(id_token, refresh_token, tokenAfro);
              // store refresh_token
              return resolve({
                type: ActionTypes.User.showLock,
                user: profile,
                token: id_token,
                refreshToken: refresh_token,
                afroToken: profile[config.apiClient.token]
              });
            }
          );
        }
      ));
  };
}


export function getIdToken() {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    const storageId = config.auth0.token;
    let idToken = localStorage.getItem(storageId) || getQueryString(storageId);
    const refreshToken = getState().User.get('refreshToken');

    return async auth0 =>({
      type: ActionTypes.User.getIdToken,
      token: await new Promise((resolve, reject) => {
        const authHash = lock.parseHash(window.location.hash);
        if (!idToken && authHash) {
          if (authHash.id_token) {
            idToken = authHash.id_token;
            storeToken(authHash.id_token);
            return resolve(idToken);
          }
          if (authHash.error) {
            console.log('Error signing in', authHash);
            return reject(authHash.error);
          }
        }
        else {
          return resolve(idToken);
        }
      })
    });

  };
}
