import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Asset.getToken](state, { asset, res }) {
    const data = res.body;
    return state.merge({
      [`asset/${asset}`]: data
    });
  }

});
