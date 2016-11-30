import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  sideBarToggled: false
})

export default createReducer(initialState, {

  [ActionTypes.Event.createIntercom](state, {intercom, appId, type}) {
    return state.merge({
      [`intercom/${appId}/${type}`]: intercom
    })
  },
  [ActionTypes.Event.removeIntercom](state, {intercom, appId, type}) {
    return state.merge({
      [`intercom/${appId}/${type}`]: intercom
    })
  }
})
