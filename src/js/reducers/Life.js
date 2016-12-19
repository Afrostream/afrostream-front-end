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

  [ActionTypes.Life.fetchPins](state, {res, themeId, lifeUserId}) {
    if (!res) {
      return state
    }
    const pins = res.body

    const savePath = (lifeUserId && 'user/' + lifeUserId) || themeId
    let savedPins = state.get(`life/pins/${savePath}`)
    let mappedUserPins = _.unionBy(savedPins && savedPins.toJS() || [], pins, '_id')

    return state.merge({
      [`life/pins/${savePath}`]: mappedUserPins
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
    const users = res.body

    let savedUsers = state.get(`life/users/${lifeUserId}`)
    let mappedUsers = _.unionBy(savedUsers && savedUsers.toJS() || [], users, '_id')

    return state.merge({
      [`life/users/${lifeUserId}`]: mappedUsers
    })
  },

  [ActionTypes.Life.spotClick](state, {spotId}) {
    return state
  }
})
