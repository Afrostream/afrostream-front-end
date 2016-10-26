import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchThemes (fetchThemeId) {
  return (dispatch, getState) => {
    const themeId = fetchThemeId || ''
    let readyThemes = getState().Life.get(`life/themes/${themeId || ''}`)
    if (readyThemes) {
      console.log('Life themes already present in data store')
      return {
        type: ActionTypes.Life.fetchThemes,
        themeId,
        res: {
          body: readyThemes.toJS()
        }
      }
    }
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
    let readyPins = getState().Life.get(`life/pins`)
    if (readyPins) {
      console.log('Life pins already present in data store')
      return {
        type: ActionTypes.Life.fetchPins,
        res: {
          body: readyPins.toJS()
        }
      }
    }
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

export function fetchSpots ({limit = 20, startIndex = 0, stopIndex = 3}) {
  return (dispatch, getState) => {
    let readySpots = getState().Life.get(`life/spots`)
    if (readySpots) {
      console.log('Life spots already present in data store')
      return {
        type: ActionTypes.Life.fetchSpots,
        res: {
          body: readySpots.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Life.fetchSpots,
      res: await api({
        path: `/api/life/spots`,
        params: {
          limit
        }
      })
    })
  }
}

export function fetchPin (pinId) {
  return (dispatch, getState) => {
    let readyPin = getState().Life.get(`life/pins/${pinId}`)
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
