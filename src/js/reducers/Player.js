import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.Player.getConfig](state, {res}) {
    const data = res.body
    return state.merge({
      [`/player/config`]: data
    })
  },

  [ActionTypes.Player.loadPlayer](state, {data}) {
    return state.merge({
      [`/player/data`]: data
    })
  },

  [ActionTypes.Player.setPlayer](state, {player}) {
    return state.merge({
      [`player`]: player
    })
  },

  [ActionTypes.Player.setFullScreen](state, {fullscreen}) {
    return state.merge({
      [`/player/fullscreen`]: fullscreen
    })
  },

  [ActionTypes.Player.killPlayer](state) {
    return state.merge({
      [`/player/data`]: null,
      [`/player/fullscreen`]: null,
      [`player`]: null
    })
  }

})
