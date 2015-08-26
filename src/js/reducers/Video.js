import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {

  [ActionTypes.Video.getVideo](state, { videoId, res }) {
    const data = res.body;
    console.log('getVideo', videoId, data);
    return state.merge({
      [`videos/${videoId}`]: data
    });
  }

});
