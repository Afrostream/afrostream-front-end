import ActionTypes from '../consts/ActionTypes';

export function open(target) {
  return {
    type: ActionTypes.Modal.open,
    target
  };
}

export function close() {
  return {
    type: ActionTypes.Modal.close,
    target: null
  };
}
