import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'
import _ from 'lodash'
import URL from 'url'

export function fetchThemes (fetchThemeId) {
  return (dispatch, getState) => {
    const themeId = fetchThemeId || ''
    let readyThemes = getState().Life.get(`life/themes/${themeId}`)
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

export function wrappPin (scrapUrl) {
  return (dispatch, getState) => {
    return async api => {
      let original = null
      let proxified = null
      await api({
        path: `/api/life/pins/scrap`,
        method: 'POST',
        passToken: true,
        params: {
          scrapUrl
        }
      }).then(({body}) => {
        original = body
        proxified = _.clone(body)

        //find http in all values and proxify it in ssl
        proxified = _.deepMap(proxified, (value) => {
          const url = URL.parse(value || '')
          if (value && url.protocol === 'http:') {
            value = `/proxy?url=${encodeURIComponent(value)}`
          }
          return value
        })
      })

      return {
        type: ActionTypes.Life.wrappPin,
        original,
        proxified
      }
    }
  }
}

export function publishPin (data) {
  return (api, getState, dispatch) => {

    const user = getState().User.get('user')
    const userId = user && user.get('_id')

    return async () => {
      return {
        type: ActionTypes.Life.publishPin,
        res: await api({
          path: `/api/life/pins`,
          method: 'POST',
          params: data,
          passToken: true
        }).then(() => {
          if (userId) {
            dispatch(fetchUsers(userId, {}))
          }
        })
      }
    }
  }
}

export function removePin (pinId) {
  return (api, getState, dispatch) => {

    const user = getState().User.get('user')
    const userId = user && user.get('_id')

    return async () => {
      return {
        type: ActionTypes.Life.removePin,
        res: await api({
          path: `/api/life/pins/${pinId}`,
          method: 'DELETE',
          passToken: true
        }).then(() => {
          if (userId) {
            dispatch(fetchUsers(userId, {}))
          }
        })
      }
    }
  }
}

export function fetchPins ({limit = 22, startIndex = 0, stopIndex = 3}) {
  return (dispatch, getState) => {
    let readyPins = getState().Life.get(`life/pins/`)
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

export function fetchSpots ({limit = 22, startIndex = 0, stopIndex = 3}) {
  return (dispatch, getState) => {
    let readySpots = getState().Life.get(
      `life/spots/`
    )
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

export function fetchUsers (fetchUserId, {limit = 200, startIndex = 0, stopIndex = 3}) {
  const lifeUserId = fetchUserId || ''

  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchUsers,
      lifeUserId,
      res: await api({
        path: `/api/life/users/${lifeUserId || ''}`,
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
        pinId
      }
    }
    console.log('fetchPin ', pinId)
    return async api => ({
      type: ActionTypes.Life.fetchPin,
      pinId,
      res: await api({
        path: `/api/life/pins/${pinId}`

        , params: {filterCountry: false}
      }).catch(notFoundPost)
    })
  }
}
