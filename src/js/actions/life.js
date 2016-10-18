import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchThemes (themeId) {
  return (dispatch, getState) => {

    const fetchThemeId = themeId || ''
    return async api => ({
      type: ActionTypes.Life.fetchThemes,
      res: await api({
        path: `/api/life/themes/${fetchThemeId}`,
        themeId
      })
    })
  }
}

export function fetchPins ({startIndex = 0, stopIndex = 3}) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchPins,
      res: await api({
        path: `/api/life/pins`
      })
    })
  }
}

export function fetchPin (pinId) {
  return (dispatch, getState) => {
    let readyPin = getState().Blog.get(`life/pins/${pinId}`)
    if (readyPin) {
      console.log('Life pin already present in data store')
      return {
        type: ActionTypes.Life.fetchPin,
        pinId,
        res: {
          body: readyPin.toJS()
        }
      }
    }
    console.log('fetchPin ', pinId)
    return async api => ({
      type: ActionTypes.Life.fetchPin,
      pinId,
      res: await api({path: `/api/life/pins/${pinId}`, params: {filterCountry: false}}).catch(notFoundPost)
    })
  }
}
