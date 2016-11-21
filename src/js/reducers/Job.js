import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'jobs': null
})

export default createReducer(initialState, {
  [ActionTypes.Job.fetchAll](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`jobs`]: data
    })
  },
  [ActionTypes.Job.fetchJob](state, {res, jobId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`jobs/${jobId}`]: data
    })
  }
})
