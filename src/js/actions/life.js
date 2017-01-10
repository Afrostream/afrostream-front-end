import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'
import _ from 'lodash'
import URL from 'url'

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

        const maxLength = 255
        if (proxified.description && proxified.description.length >= maxLength) {
          let shortDescription = proxified.description.substring(0, maxLength - 3) + '...'
          proxified.description = shortDescription
        }

      }).catch((e) => {
        console.log('wrapp error', e)
        return {
          type: ActionTypes.Life.wrappPin,
          original,
          proxified
        }
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
            dispatch(fetchUsers({userId}))
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

export function fetchUserLikes () {
  return (api, getState, dispatch) => {
    const user = getState().User.get('user')
    if (!user) {
      return {
        type: ActionTypes.Life.fetchUserLikes
      }
    }
    const lifeUserId = user && user.get('_id')

    if (!lifeUserId) {
      return {
        type: ActionTypes.Life.fetchUserLikes
      }
    }
    return async () => {
      return {
        type: ActionTypes.Life.fetchUserLikes,
        lifeUserId,
        res: await api({
          path: `/api/life/users/${lifeUserId}/pins`,
          passToken: true,
          params: {
            liked: true
          }
        })
      }
    }
  }
}

export function likePin ({data, liked}) {
  return (api, getState, dispatch) => {

    const user = getState().User.get('user')
    const lifeUserId = user && user.get('_id')
    const pinId = data && data.get('_id')

    return async () => {
      return {
        type: ActionTypes.Life.likePin,
        pinId,
        lifeUserId,
        res: await api({
          path: `/api/life/users/${lifeUserId}/pins/${pinId}`,
          method: 'PUT',
          passToken: true,
          params: {
            liked
          }
        })
      }
    }
  }
}

export function fetchSpots ({themeId, limit = 22, offset = 0}) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchSpots,
      themeId,
      res: await api({
        path: `/api/life/spots`,
        params: {
          limit,
          themeId
        }
      })
    })
  }
}

export function fetchPins ({themeId, limit = 7, offset = 0}) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchPins,
      themeId,
      res: await api({
        path: `/api/life/pins`,
        params: {
          limit,
          offset,
          themeId
        }
      })
    })
  }
}

export function fetchUserPins ({lifeUserId, limit = 50, offset}) {

  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchUserPins,
      lifeUserId,
      res: await api({
        path: `/api/life/pins`,
        params: {
          userId: lifeUserId,
          limit,
          offset
        }
      })
    })
  }
}


export function fetchUsers ({lifeUserId, limit = 50, offset}) {

  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Life.fetchUsers,
      lifeUserId,
      res: await api({
        path: `/api/life/users/${lifeUserId || ''}`,
        params: {
          limit,
          offset
        }
      })
    })
  }
}

export function spotClick (spotId) {
  return async api => ({
    type: ActionTypes.Life.spotClick,
    spotId,
    meta: {
      analytics: {
        type: 'life.spot.click',
        payload: {
          spotId
        }
      }
    }
  })
}

export function fetchPin (pinId) {
  return (dispatch, getState) => {
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
