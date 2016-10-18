import _ from 'lodash'
import { mergeFbUserInfo } from '../lib/utils'
import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'life/themes': null,
  'life/pins': null,
  'life/pins/resourceCount': null
})

export default createReducer(initialState, {

  [ActionTypes.Life.fetchThemes](state, {res, themeId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`life/themes/${themeId}`]: data
    })
  },

  [ActionTypes.Life.fetchPins](state, {res}) {
    if (!res) {
      return state
    }
    const pins = res.body
    const resourceCount = res.headers['Resource-Count'] || pins.length

    const mappedUserPins = _.map(pins, (pin)=> {
      pin.user = mergeFbUserInfo(pin.user)
      return pin
    })

    return state.merge({
      [`life/pins/resourceCount`]: resourceCount,
      [`life/pins`]: mappedUserPins
    })
  },

  [ActionTypes.Blog.fetchPin](state, {res, pinId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`life/pins/${pinId}`]: data
    })
  }
})
