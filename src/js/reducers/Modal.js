import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({target:null});

export default createReducer(initialState, {
  [ActionTypes.Modal.target](state, res) {
    return state.merge({ target: res.target });
  }
});
