import ActionTypes from '../consts/ActionTypes';

export function userActive(active) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.userActive,
      active: active
    };
  };
}
