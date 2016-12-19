import _ from 'lodash'
import { mergeFbUserInfo } from '../lib/utils'
import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'

const initialState = Immutable.fromJS({
  'life/themes': null,
  'life/pins': null,
  'life/pins/res': []
})

/**
 * Used in _.reduce to fill the arrays of blocs
 */
const accumulateInBloc = function (finalResult = [], bloc, key) {
  // By default, 1 page = 1 bloc
  let maxBloc = key ? 3 : 1

  _.last(finalResult).push(bloc)

  const finalLength = _.last(finalResult).length
  if (finalLength === maxBloc) {
    finalResult.push([])
  }

  return finalResult
}

export default createReducer(initialState, {

  [ActionTypes.Life.wrappPin](state, {original, proxified}) {
    if (!original || !proxified) {
      return state
    }
    return state.merge({
      [`life/wrap/original`]: original,
      [`life/wrap`]: proxified
    })
  },

  [ActionTypes.Life.publishPin](state, {res}) {
    if (!res) {
      return state
    }
    return state.merge({
      [`life/wrap`]: null
    })
  },

  [ActionTypes.Life.removePin](state, {res}) {
    if (!res) {
      return state
    }

    return state.merge({
      [`life/wrap`]: null
    })
  },

  [ActionTypes.Life.fetchThemes](state, {res, themeId}) {
    if (!res) {
      return state
    }
    const data = res.body

    return state.merge({
      [`life/themes/${themeId}`]: data
    })
  },

  [ActionTypes.Life.fetchPins](state, {res, themeId}) {
    if (!res) {
      return state
    }
    const pins = res.body

    const savedPins = state.get(`life/pins/${themeId}`) || Immutable.fromJS([])
    //const mappedUserPins = _(savedPins.toJS().concat(pins)).reduce(accumulateInBloc, [[]])
    const mappedUserPins = _.unionBy(savedPins.toJS(), pins, '_id')
    //const mappedUserPins = savedPins.concat(Immutable.fromJS(pins))

    return state.merge({
      [`life/pins/res`]: pins,
      [`life/pins/${themeId}`]: mappedUserPins
    })
  },

  [ActionTypes.Life.fetchSpots](state, {res, themeId}) {
    if (!res) {
      return state
    }
    const spots = res.body

    return state.merge({
      [`life/spots/${themeId}`]: spots
    })
  },

  [ActionTypes.Life.fetchPin](state, {res, pinId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`life/pins/${pinId}`]: data
    })
  },

  [ActionTypes.Life.fetchUsers](state, {res, lifeUserId}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      [`life/users/${lifeUserId}`]: data
    })
  },

  [ActionTypes.Life.spotClick](state, {spotId}) {
    return state
  }
})
