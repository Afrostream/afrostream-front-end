import ActionTypes from '../consts/ActionTypes'
import * as ModalActionCreators from './modal'
import * as UserActionCreators from './user'

export function open ({target, closable = true, donePath = null, data = null, cb = null, className = ''}) {
  return (dispatch, getState, actionDispatcher) => {
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

export function close () {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(UserActionCreators.pendingUser(false))
    return {
      type: ActionTypes.Modal.close,
      target: null
    }
  }
}
