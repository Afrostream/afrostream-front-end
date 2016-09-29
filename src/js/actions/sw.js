import ActionTypes from '../consts/ActionTypes'
import * as EventActionCreators from './event'

export function setPushNotifications (value) {
  return (dispatch, getState, actionDispatcher) => {
    let swReg
    return async () => {
      //console.log('service Worker ready ', navigator.serviceWorker.ready)

      return await navigator.serviceWorker.register('sw.js')
      //return await navigator.serviceWorker.ready
        .then((registration)=> {
          swReg = registration
          //return swReg.pushManager.permissionState({userVisibleOnly: true})
          return swReg.pushManager.getSubscription()
        })
        //.then((state)=> {
        //  if (value && (!state || state === 'prompt')) {
        //    return swReg.pushManager.subscribe({userVisibleOnly: true})
        //  } else {
        //    return swReg.pushManager.getSubscription({userVisibleOnly: true})
        //  }
        //})
        .then((subscription)=> {
          if (subscription) {
            return subscription
          }
          return swReg.pushManager.subscribe({userVisibleOnly: true})
        })
        .then((subscription)=> {
          console.log('Subscription Notification', subscription)
          if (subscription) {
            console.log('Subscription endpoint', subscription.endpoint)
            //return async api => {
            //  return await
            //    api({
            //      path: `/api/users`,
            //      method: 'post',
            //      passToken: true,
            //      params: {
            //        endpoint: subscription.endpoint
            //      }
            //    }).then((result)=> {
            //      return {
            //        type: ActionTypes.SW.setPushNotifications,
            //        result
            //      }
            //    })
            //}
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
