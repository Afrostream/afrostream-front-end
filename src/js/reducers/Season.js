import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  selected: 0
});

export default createReducer(initialState, {

  [ActionTypes.Season.toggleSeason](state, { seasonId }) {
    return state.merge({
      ['selected']: seasonId
    });
  }
});
