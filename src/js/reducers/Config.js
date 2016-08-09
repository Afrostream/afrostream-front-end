import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.Config.getConfig](state, {res, path}) {
    const config = res.body
    return state.merge({
      [`/config/${path}`]: config && config.data
    })
  }

})
