import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  page: 0
})

export default createReducer(initialState, {

  [ActionTypes.Slides.toggleNext](state, {page}) {
    return state.merge({
      ['page']: page
    })
  },

  [ActionTypes.Slides.togglePrev](state, {page}) {
    return state.merge({
      ['page']: page
    })
  },

  [ActionTypes.Slides.toggleSlide](state, {page}) {
    return state.merge({
      ['page']: page
    })
  }
})
