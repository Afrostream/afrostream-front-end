import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.Episode.getEpisode](state, {episodeId, res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`episodes/${episodeId}`]: data
    })
  }

})
