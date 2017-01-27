import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'variations': []
})

export default createReducer(initialState, {

  [ActionTypes.GA.variations](state, {res}) {
    if (!res) {
      return state
    }

    const data = res.body

    return state.merge({
      ['variations']: data
    })
  }
})
