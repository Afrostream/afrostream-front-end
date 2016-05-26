import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'search': null
})

export default createReducer(initialState, {
  [ActionTypes.Search.fetching](state) {
    return state.merge({
      [`fetching`]: true
    })
  },
  [ActionTypes.Search.fetchMovies](state, { res,key }) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`search`]: data,
      [`fetching`]: false
    })
  }
})
