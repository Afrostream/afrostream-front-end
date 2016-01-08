import ActionTypes from '../consts/ActionTypes';

export function open(target) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Modal.open,
      target
    };
  };
}

export function close() {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Modal.close,
      target: null
    };
  };
}
