import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.Video.getVideo](state, { videoId, res }) {
    if (!res) {
      return state
    }
    const data = res.body
    console.log(`player : video ${videoId} received in store`)
    return state.merge({
      [`videos/${videoId}`]: data
    })
  }

})
