import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.OAuth.login](state, { res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`login`]: data
    });
  },

  [ActionTypes.OAuth.facebook](state, {  res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`login`]: data
    });
  }

});
