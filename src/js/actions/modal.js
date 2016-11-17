import ActionTypes from '../consts/ActionTypes'
import * as ModalActionCreators from './modal'
import * as UserActionCreators from './user'
import { isAuthorized } from '../lib/geo'

export function open ({target, closable = true, donePath = null, data = null, cb = null, className = ''}) {
  return (dispatch, getState, actionDispatcher) => {

    return async () => {
      actionDispatcher(UserActionCreators.pendingUser(true))
      let authorized = true
      if (target === 'showSignup') {
        try {
          authorized = await isAuthorized()
        } catch (err) {
          console.error('showSingupLock error requesting /auth/geo ', err)
        }
      }

      if (!authorized) {
        return actionDispatcher(ModalActionCreators.open({target: 'geoWall'}))
      }


      return {
        type: ActionTypes.Modal.open,
        target,
        donePath,
        data,
        closable,
        cb,
        className
      }
    }
  }
}

export function close () {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(false))
    return {
      type: ActionTypes.Modal.close,
      target: null
    }
  }
}
