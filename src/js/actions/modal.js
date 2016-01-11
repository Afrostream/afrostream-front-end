import ActionTypes from '../consts/ActionTypes';

export function pendingUser(pending) {
  return {
    type: ActionTypes.User.pendingUser,
    pending
  }
};

export function open(target) {
  return (dispatch, getState, actionDispatcher) => {
    return {
      type: ActionTypes.Modal.open,
      target
    };
  }
}

export function close() {
  return (dispatch, getState, actionDispatcher) => {
    actionDispatcher(pendingUser(false));
    return {
      type: ActionTypes.Modal.close,
      target: null
    };
  }
}
