import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.OAuth.signin](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`user`]: data
    });
  },

  [ActionTypes.OAuth.signup](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`user`]: data
    });
  },

  [ActionTypes.OAuth.reset](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`user`]: data
    });
  },

  [ActionTypes.OAuth.facebook](state, {  res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`user`]: data
    });
  }

});
