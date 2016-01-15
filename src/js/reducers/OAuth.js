import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import config from '../../../config/client';

const initialState = Immutable.fromJS({
  pending: false,
  token: null,
  refreshToken: null
});

const storeToken = function (token, refreshToken) {
  const storageId = config.apiClient.token;
  const storageRefreshId = config.apiClient.tokenRefresh;
  if (token) {
    localStorage.setItem(storageId, token);
  }
  if (refresh_token) {
    localStorage.setItem(storageRefreshId, refreshToken);
  }
};

export default createReducer(initialState, {

  [ActionTypes.OAuth.getIdToken](state) {

    const storageId = config.apiClient.token;
    const storageRefreshId = config.apiClient.tokenRefresh;
    let token = localStorage.getItem(storageId);
    let refreshToken = localStorage.getItem(storageRefreshId);

    return state.merge({
      ['token']: token,
      ['refreshToken']: refreshToken
    });
  },

  [ActionTypes.OAuth.signin](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    storeToken(data.accessToken, data.refreshToken);
    return state.merge({
      [`token`]: data.accessToken,
      ['refreshToken']: data.refreshToken
    });
  },

  [ActionTypes.OAuth.signup](state, { res }) {
    debugger;
    if (!res) {
      return state;
    }
    const data = res.body;
    storeToken(data.accessToken, data.refreshToken);

    return state.merge({
      [`token`]: data.accessToken,
      ['refreshToken']: data.refreshToken
    });
  },


  [ActionTypes.OAuth.facebook](state, {  res, token, accessToken}) {
    if (!res) {
      return state;
    }
    storeToken(token, accessToken);

    return state.merge({
      [`token`]: token,
      ['refreshToken']: accessToken
    });
  },

  [ActionTypes.OAuth.reset](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
  },

  [ActionTypes.OAuth.logOut](state, { }) {

    const storageId = config.apiClient.token;
    const storageRefreshId = config.apiClient.tokenRefresh;
    localStorage.removeItem(storageId);
    localStorage.removeItem(storageRefreshId);

    return state.merge({
      ['token']: null,
      ['refreshToken']: null
    });
  }

});
