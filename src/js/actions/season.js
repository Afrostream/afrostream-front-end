import ActionTypes from '../consts/ActionTypes'
import { notFound } from './notFoundAction'

export function toggleSeason (index) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Season.toggleSeason,
      seasonId: index
    }
  }
}

export function getSeason (seasonId) {
  return (dispatch, getState) => {
    if (!seasonId) {
      console.log('no season id passed in action', seasonId)
      return {
        type: ActionTypes.Season.getSeason,
        seasonId: seasonId
      }
    }
    let readySeason = getState().Season.get(`/seasons/${seasonId}`)
    if (readySeason) {
      console.log('season already present in data store', seasonId)
      return {
        type: ActionTypes.Season.getSeason,
        seasonId: seasonId,
        res: {
          body: readySeason.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Season.getSeason,
      seasonId,
      res: await api({path: `/api/seasons/${seasonId}`}).catch(notFound)
    })
  }
}
