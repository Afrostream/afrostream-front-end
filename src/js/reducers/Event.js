import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  isMobile: false,
  userActive: true,
  sideBarToggled: false
})

export default createReducer(initialState, {

  [ActionTypes.Event.userActive](state, {active}) {
    return state.merge({
      ['userActive']: active
    })
  },
  [ActionTypes.Event.toggleSideBar](state, {toggled}) {
    toggled = toggled || state.get('sideBarToggled')
    return state.merge({
      ['sideBarToggled']: !toggled
    })
  },
  [ActionTypes.Event.snackMessage](state, {data}) {
    return state.merge({
      ['snackMessage']: data
    })
  }
})
