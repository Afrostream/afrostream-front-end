import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'posts': null
})

export default createReducer(initialState, {
  [ActionTypes.Blog.fetchAll](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`posts`]: data
    })
  },
  [ActionTypes.Blog.fetchPost](state, {res, postId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`posts/${postId}`]: data
    })
  }
})
