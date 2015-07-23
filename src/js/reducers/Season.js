import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  season: 0
});

export default createReducer(initialState, {

  [ActionTypes.Season.toggleSlide](state, { season }) {
    return state.merge({
      ['season']: season
    });
  }
});
