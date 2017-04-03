import Immutable from 'immutable'
import ActionTypes from '../consts/ActionTypes'
import createReducer from '../lib/createReducer'
import _ from 'lodash'

const initialState = Immutable.fromJS({
  'categoryId': 1
})

const MIN_SPOTS = 2

/**
 * Used in _.reduce to fill the arrays of blocs
 */
const accumulateInBloc = function (finalResult = [], bloc) {
  // By default, 1 page = 1 bloc
  let maxBloc = 1// bloc.adSpot ? 1 : 2
  if (_.last(finalResult).length && _.last(finalResult)[0].adSpot) {
    maxBloc = 1
  }

  if (_.last(finalResult).length === maxBloc) {
    finalResult.push([])
  }
  _.last(finalResult).push(bloc)

  return finalResult
}

const mergeSpots = function (spots, dataList) {
  //Concat adspots and categrorie movies remove duplicates
  dataList = dataList || []
  spots = spots || []
  let filteredList = []

  if (spots.length < MIN_SPOTS && dataList.length < (MIN_SPOTS * 2)) {
    spots = _.take(dataList, MIN_SPOTS)
  }

  spots = _.map(spots, (spot) => {
    spot.adSpot = true
    return spot
  })

  filteredList = _.concat(filteredList, spots)
  filteredList = _.concat(filteredList, dataList)

  const uniqSpots = _.uniqBy(filteredList, '_id')
  const blocSpots = uniqSpots// _(uniqSpots).reduce(accumulateInBloc, [[]])

  return blocSpots
}

export default createReducer(initialState, {

  [ActionTypes.Category.getAllSpots](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    let categoryId = state.get('categoryId')
    const categoryBase = _.find(data, (category) => {
      return category._id == categoryId
    })

    if (categoryBase) {
      categoryId = categoryBase['_id']
    }

    return state.merge({
      ['categoryId']: categoryId,
      [`categorys/spots__res`]: res,
      [`categorys/spots`]: data
    })
  },

  [ActionTypes.Category.getSpots](state, {categoryId, res}) {
    if (!res) {
      return state
    }
    const data = res.body

    return state.merge({
      ['categoryId']: categoryId,
      [`categorys/${categoryId}/spots__res`]: res,
      [`categorys/${categoryId}/spots`]: data
    })
  },

  [ActionTypes.Category.getCarrousel](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body

    return state.merge({
      [`categorys/carrousel`]: data
    })
  },

  [ActionTypes.Category.getCategory](state, {categoryId, status, res}) {
    if (!res) {
      return state
    }
    const data = res.body

    data.mergeSpotsWithMovies = mergeSpots(data.adSpots, data.movies)

    return state.merge({
      [`categorys/${categoryId}__res`]: res,
      [`categorys/${categoryId}`]: data
    })
  },

  [ActionTypes.Category.getMenu](state, {res}) {
    if (!res) {
      return state
    }
    if (!res.body) {
      return state
    }
    const data = res.body
    return state.merge({
      ['menu']: data
    })
  },

  [ActionTypes.Category.getMeaList](state, {res}) {
    if (!res) {
      return state
    }
    const data = res.body
    return state.merge({
      ['meaList']: data
    })
  }
})
