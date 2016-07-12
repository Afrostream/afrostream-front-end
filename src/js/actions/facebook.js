import ActionTypes from '../consts/ActionTypes'
/**
 * Get list friendlist
 * @returns {Function}
 */
export function getFriendList () {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (auth && auth.status === 'connected') {
      /* make the API call */
      return async api => {
        return {
          type: ActionTypes.Facebook.getFriendList,
          res: await window.FB.api(
            '/{friend-list-id}',
            (response) => {
              if (response && !response.error) {
                return response
              }
            }
          )
        }
      }
    }
  }
}

export function getInvitableFriends () {
  return (dispatch, getState) => {
    const auth = getState().Facebook.get('auth')
    if (auth && auth.status === 'connected') {
      /* make the API call */
      return async api => {
        return {
          type: ActionTypes.Facebook.getInvitableFriends,
          res: await window.FB.api(
            '/{user-id}/invitable_friends',
            (response) => {
              if (response && !response.error) {
                return response
              }
            }
          )
        }
      }
    }
  }
}
