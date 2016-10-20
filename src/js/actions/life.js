import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchThemes (fetchThemeId) {
  return (dispatch, getState) => {

    const themeId = fetchThemeId || ''
    return async api => ({
      type: ActionTypes.Life.fetchThemes,
      themeId,
      res: await api({
        path: `/api/life/themes/${themeId}`,
        showSpinner: true
      })
    })
  }
}

export function fetchPins ({limit = 20, startIndex = 0, stopIndex = 3}) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchPins,
      res: await api({
        path: `/api/life/pins`,
        params: {
          limit
        }
      })
    })
  }
}

export function fetchPin (pinId) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchPin,
      pinId,
      res: await api({path: `/api/life/pins/${pinId}`, params: {filterCountry: false}}).catch(notFoundPost)
    })
  }
}
