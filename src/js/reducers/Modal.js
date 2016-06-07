import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  target: null,
  closable: true,
  donePath: null,
  cb: null
})

export default createReducer(initialState, {

  [ActionTypes.Modal.open](state, {target, closable, donePath, data, cb}) {
    return state.merge({
      target,
      closable,
      donePath,
      data,
      cb
    })
  },

  [ActionTypes.Modal.close](state, {target}) {
    return state.merge({
      target: target,
      closable: true,
      donePath: null,
      data: null,
      cb: null
    })
  }

})
