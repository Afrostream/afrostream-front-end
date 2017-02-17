import ActionTypes from '../consts/ActionTypes'
import * as EventActionCreator from './event'
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
    const lifeUserId = user && user.get('_id')

    return async () => {
      return {
        type: ActionTypes.Life.publishPin,
        lifeUserId,
        res: await api({
          path: `/api/life/pins`,
          method: 'POST',
          params: data,
          passToken: true
        }).then(() => {
          if (lifeUserId) {
            dispatch(fetchUserPins({lifeUserId, replace: true}))
          }
        })
      }
    }
  }
}

export function removePin (pinId) {
  return (api, getState, dispatch) => {

    const user = getState().User.get('user')
    const lifeUserId = user && user.get('_id')

    return async () => {
      return {
        type: ActionTypes.Life.removePin,
        lifeUserId,
        res: await api({
          path: `/api/life/pins/${pinId}`,
          method: 'DELETE',
          passToken: true
        }).then(() => {
          if (lifeUserId) {
            dispatch(fetchUserPins({lifeUserId, replace: true}))
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

export function fetchUsersFollow () {
  return (api, getState, dispatch) => {
    const user = getState().User.get('user')
    if (!user) {
      return {
        type: ActionTypes.Life.fetchUsersFollow
      }
    }
    const lifeUserId = user && user.get('_id')

    if (!lifeUserId) {
      return {
        type: ActionTypes.Life.fetchUsersFollow
      }
    }
    return async () => {
      return {
        type: ActionTypes.Life.fetchUsersFollow,
        lifeUserId,
        res: await api({
          path: `/api/life/users/${lifeUserId}/follow`,
          passToken: true,
          params: {
            follow: true
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

export function followUser ({data, follow}) {
  return (api, getState, dispatch) => {

    const user = getState().User.get('user')
    const lifeUserId = user && user.get('_id')
    const followUserId = data && data.get('_id')

    return async () => {
      return await api({
        path: `/api/life/users/${lifeUserId}/follow/${followUserId}`,
        method: 'PUT',
        passToken: true,
        params: {
          follow
        }
      }).then((res) => {
        dispatch(fetchUsers({lifeUserId: followUserId}))
        dispatch(EventActionCreator.snackMessage({message: `life.users.${follow ? 'followed' : 'unfollowed'}`}))
        return {
          type: ActionTypes.Life.followUser,
          followUserId,
          lifeUserId,
          res
        }
      })
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
          offset,
          themeId
        }
      })
    })
  }
}

export function fetchPins ({themeId, limit = 7, offset = 0, filterAll = false}) {
  return (dispatch, getState) => {

    let params = {
      limit,
      offset,
      themeId
    }

    if (filterAll === true) {
      params.all = filterAll
    }

    return async api => ({
      type: ActionTypes.Life.fetchPins,
      themeId,
      res: await api({
        path: `/api/life/pins`,
        params
      })
    })
  }
}

export function fetchUserPins ({lifeUserId, limit = 50, offset = 0, replace = false}) {

  return (dispatch, getState) => {
    const user = getState().User.get('user')
    const userId = user && user.get('_id')
    const isCurrentUser = String(userId) === String(lifeUserId)
    return async api => ({
      type: ActionTypes.Life.fetchUserPins,
      lifeUserId,
      replace,
      res: await api({
        path: `/api/life/pins${ isCurrentUser ? '/mine' : ''}`,
        passToken: true,
        params: {
          userId: lifeUserId,
          limit,
          offset
        }
      })
    })
  }
}


export function fetchUsers ({lifeUserId, limit = 50, offset = 0}) {

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
