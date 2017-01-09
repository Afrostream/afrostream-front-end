import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'geo': null
})

export default createReducer(initialState, {

  [ActionTypes.Geo.userActive](state, {res}) {
    if (!res) {
      return state
    }

    const data = res.body

    return state.merge({
      ['geo']: data
    })
  }
})
