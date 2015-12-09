import ActionTypes from '../consts/ActionTypes';
import * as ModalActionCreators from './modal';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../config/client';
import _ from 'lodash';
import {isAuthorized} from '../lib/geo';

if (canUseDOM) {
  var Auth0Lock = require('auth0-lock');
}

/**
 * Merge profile return by auth0 whith afrostream api user data
 * @param profile
 * @param data
 * @returns {Function}
 */
const logoutUser = function () {
  const storageId = config.auth0.token;
  const storageRefreshId = config.auth0.tokenRefresh;
  const storageAfroId = config.apiClient.token;
  const storageAfroRefreshId = config.apiClient.tokenRefresh;
  localStorage.removeItem(storageId);
  localStorage.removeItem(storageRefreshId);
  localStorage.removeItem(storageAfroId);
  localStorage.removeItem(storageAfroRefreshId);
  if (canUseDOM) {
    if (!~window.location.pathname !== '/') {
      window.location = '/';
    }
  }
};

const mergeProfile = function (profile, data) {
  let tokenAfro = profile.hasOwnProperty(config.apiClient.token) ? profile[config.apiClient.token] : null;
  let afroRefreshToken = profile.hasOwnProperty(config.apiClient.tokenRefresh) ? profile[config.apiClient.tokenRefresh] : null;
  return async api => {
    try {
      const userSubscriptions = await api(`/subscriptions/status`, 'GET', {}, null, tokenAfro, afroRefreshToken);
      //FIXMEget user infos from afrostream api when get recurly api data has merge into user
      const userInfos = await api(`/users/me`, 'GET', {}, null, tokenAfro, afroRefreshToken);
      const userMerged = _.merge(profile, userSubscriptions.body || {}, userInfos.body || {});

      userMerged.user_id = userMerged._id || userMerged.user_id;

      //if (!userMerged.hasOwnProperty('planCode') || !userMerged.planCode) {
      //  if (canUseDOM) {
      //    if (!~window.location.pathname.indexOf('/select-plan')) {
      //      window.location = '/select-plan';
      //    }
      //  }
      //}
      return _.merge(data, {
        user: userMerged
      });

    } catch (e) {
      console.log(e, 'remove user data');
      logoutUser();
      return data;
    }
  }

};

/**
 * Subscribe to afrostream plan
 * @param data
 * @returns {Function}
 */
export function subscribe(data, gift = false) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().User.get('token');
    let afroToken = user.get(config.apiClient.token);
    let afroRefreshToken = user.get(config.apiClient.tokenRefresh);
    return async api => ({
      type: ActionTypes.User.subscribe,
      res: await api(`/subscriptions/${gift ? 'gift' : '' }`, 'POST', data, token, afroToken, afroRefreshToken),
      gift
    });
  };
}

export function cancelSubscription() {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    const token = getState().User.get('token');
    let afroToken = user.get(config.apiClient.token);
    let afroRefreshToken = user.get(config.apiClient.tokenRefresh);
    return async api => ({
      type: ActionTypes.User.cancelSubscription,
      res: await api(`/subscriptions/cancel`, 'GET', {}, token, afroToken, afroRefreshToken)
    });
  };
}

/**
 * First call for creating lock widget component
 * @returns {Function}
 */
export function createLock() {
  return (dispatch, getState) => {
    const options = config.auth0.assetsUrl ? {assetsUrl: config.auth0.assetsUrl} : {};
    const lock = new Auth0Lock(config.auth0.clientId, config.auth0.domain, options);
    return {
      type: ActionTypes.User.createLock,
      lock: lock
    };
  };
}

/**
 * Logout user
 * @returns {Function}
 */
export function logOut() {
  return (dispatch, getState) => {
    logoutUser();
    return {
      type: ActionTypes.User.logOut
    };
  };
}

const storeToken = function (id_token, refresh_token, afro_token, afro_refresh_token) {
  const storageId = config.auth0.token;
  const storageRefreshId = config.auth0.tokenRefresh;
  const storageAfroId = config.apiClient.token;
  const storageAfroRefreshId = config.apiClient.tokenRefresh;
  if (id_token) {
    localStorage.setItem(storageId, id_token);
  }
  if (refresh_token) {
    localStorage.setItem(storageRefreshId, refresh_token);
  }
  if (storageAfroId) {
    localStorage.setItem(storageAfroId, afro_token);
  }
  if (storageAfroRefreshId) {
    localStorage.setItem(storageAfroRefreshId, afro_refresh_token);
  }
};

/**
 * Get profile from refresh token
 * @param getState
 * @returns {Promise}
 */
const refreshToken = function (getState) {
  return new Promise(
    (resolve, reject) => {
      const lock = getState().User.get('lock');
      const storageRefreshId = config.auth0.tokenRefresh;
      const idToken = localStorage.getItem(storageRefreshId);
      const refreshToken = getState().User.get('refreshToken') || idToken;
      if (!refreshToken || !lock) {
        return reject('no trefresh token');
      }
      lock.getClient().refreshToken(refreshToken, function (err) {
        if (err) {
          console.log('*** Error loading the refresh token ***', err);
          localStorage.removeItem(storageRefreshId);
          return reject(err);
        }
        return resolve(getProfile());
      });
    }
  );
};

/**
 * Get profile from auth0/afrostream
 * @returns {Function}
 */
export function getProfile() {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    const token = getState().User.get('token');
    const user = getState().User.get('user');
    return async auth0 =>(
      await new Promise(
        (resolve, reject) => {
          //If user alwready in app
          if (user) {
            resolve({
              type: ActionTypes.User.getProfile,
              user: user
            });
          }
          if (!lock) {
            return resolve({
              type: ActionTypes.User.getProfile,
              user: null
            });
          }
          //else get auth0 user and merge it
          lock.getProfile(token, function (err, profile) {
            profile = profile || {};

            if (err) {
              console.log('*** Error loading the profile - most likely the token has expired ***', err);
              return refreshToken(getState)
                .then(function (data) {
                  console.log('getProfile return data', data);
                  return resolve(mergeProfile(data, {
                    type: ActionTypes.User.getProfile,
                    user: null
                  }));
                })
                .catch(function (tokenErr) {
                  return reject(tokenErr);
                });
            }
            profile
            return resolve(mergeProfile(profile, {
              type: ActionTypes.User.getProfile,
              user: null
            }));
          });
        }
      )
    );

  };
}

export function showGiftLock() {
  return this.showLock('showSignup', null, config.auth0.gift);
}

/**
 * Show auth 0 lock and return tokens
 * @param type
 * @param container
 * @returns {Function}
 */
export function showLock(type = 'show', container = null, options = {}) {
  return (dispatch, getState) => {
    const lock = getState().User.get('lock');
    let lockOptions = _.cloneDeep(config.auth0.signIn);

    if (container) {
      lockOptions = _.merge(lockOptions, {
        popup: false,
        closable: false,
        container: container
      });
    }
    if (options) {
      lockOptions = _.merge(lockOptions, options);
    }
    return async auth0 => (
      await new Promise(
        (resolve, reject) => {
          lock[type](lockOptions, function (err, profile, access_token, id_token, state, refresh_token) {
            if (err) {
              reject(err);
            }
            // store token
            profile = profile || {};
            var tokenAfro = profile.hasOwnProperty(config.apiClient.token) ? profile[config.apiClient.token] : null;
            var tokenRefreshAfro = profile.hasOwnProperty(config.apiClient.tokenRefresh) ? profile[config.apiClient.tokenRefresh] : null;
            storeToken(access_token, refresh_token, tokenAfro, tokenRefreshAfro);
            // store refresh_token
            resolve({
              type: ActionTypes.User.showLock,
              token: access_token,
              refreshToken: refresh_token
            });
          });
        })
    )
  };
}

export function getIdToken() {
  return (dispatch, getState) => {
    const storageId = config.auth0.token;
    let idToken = localStorage.getItem(storageId);
    return {
      type: ActionTypes.User.getIdToken,
      token: idToken
    };
  };
}
