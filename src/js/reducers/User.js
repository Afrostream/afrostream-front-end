import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  'current': null
});

export default createReducer(initialState, {

  [ActionTypes.User.getIdToken](state, { user, res }) {
    return state.merge({
      ['current']: user,
      ['token']: res
    });
  },

  [ActionTypes.User.createLock](state, { lock }) {
    return state.merge({
      ['lock']: lock
    });
  }
});
