import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.SW.setPushNotifications](state, {value}) {
    return state.merge({
      ['webPushNotifications']: value
    })
  }

})
