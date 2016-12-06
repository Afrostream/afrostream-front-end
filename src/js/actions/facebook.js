import ActionTypes from '../consts/ActionTypes'
import _ from 'lodash'
import qs from 'qs'
import window from 'global/window'
/**
 * Get list friendlist
 * @returns {Function}
 */
export function getFriendList () {
  return (dispatch, getState, actionDispatcher) => {
    const auth = getState().Facebook.get('auth')
    if (!auth || auth.get('status') !== 'connected') {
      return {
        type: ActionTypes.Facebook.getFriendList,
        res: []
      }
    }
    if (auth && auth.get('status') === 'connected') {

      /* make the API call */
      return async () => {

        let friendList = getState().Facebook.get('friends')
        if (!friendList) {
          await actionDispatcher(this.getFriends()).then((data) => {
            friendList = data && data.res
          })
        }

        let piskData = _.map(friendList, 'id')

        return async api => ({
          type: ActionTypes.Facebook.getFriendList,
          res: await api({
            path: `/api/users/search`,
            method: 'POST',
            params: {
              facebookIdList: piskData
            },
            passToken: true
          })
        })
      }
    }
  }
}

export function getFriends () {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (!auth || auth.get('status') !== 'connected') {
      return {
        type: ActionTypes.Facebook.getFriends,
        res: []
      }
    }
    /* make the API call */
    return async () => {
      return await new Promise((resolve, reject) => {
        window.FB.api(
          '/me/friends',
          (response) => {
            if (!response || response.error) {
              return reject(response.error)
            }
            return resolve({
              type: ActionTypes.Facebook.getFriends,
              res: response.data
            })
          }
        )
      })
    }
  }
}

export function watchVideo ({
  duration,
  created_time,
}) {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (!auth || auth.get('status') !== 'connected') {
      return {
        type: ActionTypes.Facebook.watchVideo,
        res: []
      }
    }
    /* make the API call */
    return async () => {
      return await new Promise((resolve, reject) => {

        let creationDate = created_time || new Date()
        window.FB.api(
          `/me/video.watches`,
          'POST',
          {
            video: window.location,
            created_time: creationDate.getTime(),
            expires_in: duration
          },
          (response) => {
            if (!response || response.error) {
              return reject(response.error)
            }
            return resolve({
              type: ActionTypes.Facebook.watchVideo,
              res: response.data
            })
          }
        )
      })
    }
  }
}

export function getInvitableFriends () {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (!auth || auth.get('status') !== 'connected') {
      return {
        type: ActionTypes.Facebook.getInvitableFriends,
        res: []
      }
    }
    /* make the API call */
    return async () => {
      return await new Promise((resolve, reject) => {
        window.FB.api(
          '/me/invitable_friends',
          (response) => {
            if (!response || response.error) {
              return reject(response.error)
            }
            return resolve({
              type: ActionTypes.Facebook.getInvitableFriends,
              res: response.data
            })
          }
        )
      })
    }
  }
}
