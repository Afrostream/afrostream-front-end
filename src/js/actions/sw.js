import ActionTypes from '../consts/ActionTypes'
import * as EventActionCreators from './event'

export function setPushNotifications (value) {
  return (dispatch, getState, actionDispatcher) => {
    let swReg
    return async () => {
      return await navigator.serviceWorker.getRegistration()
        .then((reg)=> {
          swReg = reg
          return swReg.pushManager.permissionState({userVisibleOnly: true})
        })
        .then((state)=> {
          if (value && (!state || state === 'prompt')) {
            debugger
            return swReg.pushManager.subscribe({userVisibleOnly: true})
          } else {
            return swReg.pushManager.getSubscription({userVisibleOnly: true})
          }
        }).then(()=> {
          return {
            type: ActionTypes.SW.setPushNotifications,
            value
          }
        }).catch((err)=> {
          actionDispatcher(EventActionCreators.showError(err))
          console.log(err)
        })
    }
  }
}
