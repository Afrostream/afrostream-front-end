import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Reco.getRecommendations](state, {route, videoId, res }) {
    if (!res) {
      return state;
    }
    const data = res.body;
    return state.merge({
      [`${route}/${videoId}`]: data
    });
  }
});
