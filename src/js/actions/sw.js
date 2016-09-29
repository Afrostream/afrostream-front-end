import ActionTypes from '../consts/ActionTypes'
import * as EventActionCreators from './event'

export function setPushNotifications (value) {
  return (dispatch, getState, actionDispatcher) => {
    let swReg
    return async () => {
      //console.log('service Worker ready ', navigator.serviceWorker.ready)

      return await navigator.serviceWorker.ready
        .then((reg)=> {
          swReg = reg
          return swReg.pushManager.permissionState({userVisibleOnly: true})
        })
        .then((state)=> {
          if (value && (!state || state === 'prompt')) {
            return swReg.pushManager.subscribe({userVisibleOnly: true})
          } else {
            return swReg.pushManager.getSubscription({userVisibleOnly: true})
          }
        }).then((subscription)=> {
          console.log('Subscription Notification', subscription)
          if (subscription) {
            return async api=> {
              return await
                api({
                  path: `/api/subscriptions`,
                  method: 'post',
                  passToken: true,
                  params: subscription
                }).then((result)=> {
                  return {
                    type: ActionTypes.SW.setPushNotifications,
                    result
                  }
                })
            }
          }
          return {
            type: ActionTypes.SW.setPushNotifications,
            value
          }
        }).catch((err)=> {
          console.log(err)
          actionDispatcher(EventActionCreators.showError(err))
        })
    }
  }
}
