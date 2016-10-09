import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchPins () {
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
      res: await api({path: `/api/life/pins`, params: {filterCountry: false}})
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
