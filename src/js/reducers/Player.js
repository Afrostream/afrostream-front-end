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
  }

})
