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

  [ActionTypes.Facebook.getFriendList](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`friendList`]: res.data
    })
  },

  [ActionTypes.Facebook.getInvitableFriends](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`invitableFriends`]: res
    })
  }
})
