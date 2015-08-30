import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  userActive: true
});

export default createReducer(initialState, {

  [ActionTypes.Event.userActive](state, { active }) {
    return state.merge({
      ['userActive']: active
    });
  }
});
