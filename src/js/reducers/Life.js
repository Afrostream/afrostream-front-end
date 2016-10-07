import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'life/pins': null
})

export default createReducer(initialState, {
  [ActionTypes.Life.fetchPins](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`life/pins`]: data
    })
  },
  [ActionTypes.Blog.fetchPin](state, {res, pinId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`life/pins/${pinId}`]: data
    })
  }
})
