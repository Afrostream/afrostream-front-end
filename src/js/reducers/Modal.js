import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({target: null});

export default createReducer(initialState, {

  [ActionTypes.Modal.open](state, {target}) {
    return state.merge({
      target: target
    });
  },

  [ActionTypes.Modal.close](state, {target}) {
    return state.merge({
      target: target
    });
  }

});
