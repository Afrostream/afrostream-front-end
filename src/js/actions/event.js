import ActionTypes from '../consts/ActionTypes';

export function userActive(active) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.userActive,
      active: active
    };
  };
}
export function pinHeader(pin) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.pinHeader,
      pin: pin
    };
  };
}
export function toggleSideBar() {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.toggleSideBar
    };
  };
}
