import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'
const initialState = Immutable.fromJS({})

export default createReducer(initialState, {

  [ActionTypes.Facebook.initialized](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`auth`]: res
    })
  },

  [ActionTypes.Facebook.getFriends](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`friends`]: res
    })
  },

  [ActionTypes.Facebook.getFriendList](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`friendList`]: res.body
    })
  },

  [ActionTypes.Facebook.getInvitableFriends](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`invitableFriends`]: res
    })
  },

  [ActionTypes.Facebook.watchVideo](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`watchVideo`]: res
    })
  },

  [ActionTypes.Facebook.readNews](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`readNews`]: res
    })
  },

  [ActionTypes.Facebook.like](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`like`]: res
    })
  }
})
