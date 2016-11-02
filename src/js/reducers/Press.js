import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'press': null
})

export default createReducer(initialState, {
  [ActionTypes.Press.fetchAll](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`press`]: data
    })
  }
})
