import ActionTypes from '../consts/ActionTypes'

export function userActive (active) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.userActive,
      active
    }
  }
}
export function showError (error) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.showError,
      error
    }
  }
}

export function showChat (show) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.showChat,
      show
    }
  }
}

export function toggleSideBar (toggled) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Event.toggleSideBar,
      toggled
    }
  }
}

export function snackMessage (data) {
  return {
    type: ActionTypes.Event.snackMessage,
    data
  }
}
