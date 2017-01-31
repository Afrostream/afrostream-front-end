import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'variations': []
})

export default createReducer(initialState, {

  [ActionTypes.GA.setVariations](state, {variations}) {
    if (!variations) {
      return state
    }

    return state.merge({
      ['variations']: variations
    })
  }
})
