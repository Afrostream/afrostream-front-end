import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import config from '../../../config/client';

const initialState = Immutable.fromJS({
  pending: false,
  token: null
});

const storeToken = function (oauthData) {
  const storageId = config.apiClient.token;

  if (oauthData.accessToken) {
    localStorage.setItem(storageId, JSON.stringify(oauthData));
  }
  return oauthData;
};

export default createReducer(initialState, {

  [ActionTypes.OAuth.getIdToken](state) {

    const storageId = config.apiClient.token;

    let storedData = localStorage.getItem(storageId);
    let tokenData = null;
    if (storedData) {
      try {
        tokenData = JSON.parse(storedData);
      } catch (err) {
        console.log('set header accesstoken impossible');
      }
    }

    return state.merge({
      ['token']: tokenData
    });
  },

  [ActionTypes.OAuth.signin](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    storeToken(data);
    return state.merge({
      [`token`]: data
    });
  },

  [ActionTypes.OAuth.signup](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    storeToken(data);

    return state.merge({
      [`token`]: data
    });
  },


  [ActionTypes.OAuth.facebook](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    storeToken(data);

    return state.merge({
      [`token`]: data
    });
  },

  [ActionTypes.OAuth.reset](state) {
    return state.merge({
      ['token']: null
    });
  },

  [ActionTypes.OAuth.logOut](state) {

    const storageId = config.apiClient.token;
    localStorage.removeItem(storageId);

    return state.merge({
      ['token']: null
    });
  }

});
