import ActionTypes from '../consts/ActionTypes'
/**
 * Get list friendlist
 * @returns {Function}
 */
export function getFriendList () {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (auth && auth.get('status') === 'connected') {
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
                type: ActionTypes.Facebook.getFriendList,
                res: response
              })
            }
          )
        })
      }
    }
  }
}

export function getInvitableFriends () {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (auth && auth.get('status') === 'connected') {
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
}
