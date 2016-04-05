import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';
import { storeToken,getToken } from '../lib/storage';
import config from '../../../config/client';

const initialState = Immutable.fromJS({
  pending: false,
  token: null
});

export default createReducer(initialState, {

  [ActionTypes.OAuth.getIdToken](state) {

    let tokenData = getToken();

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


  [ActionTypes.OAuth.facebook](state, {}) {
    const tokenData = getToken();
    console.log('ActionTypes.OAuth.facebook', tokenData);
    return state.merge({
      ['token']: tokenData
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
