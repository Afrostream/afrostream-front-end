import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {
  [ActionTypes.Static.getStatic](state, {path, res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`static/${path}`]: data
    })
  },

  [ActionTypes.Static.getComponentRoute](state, {route, res}, initialState) {
    if (!res) {
      return state
    }
    const data = res.body

    initialState.merge(data.state)

    return state.merge({
      [route]: data.html
    })
  }
})
