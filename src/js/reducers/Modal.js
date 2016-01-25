import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  target: null,
  closable: true,
  donePath: null
});

export default createReducer(initialState, {

  [ActionTypes.Modal.open](state, {target,closable,donePath}) {
    return state.merge({
      target: target,
      closable: closable,
      donePath: donePath
    });
  },

  [ActionTypes.Modal.close](state, {target}) {
    return state.merge({
      target: target,
      closable: true
    });
  }

});
