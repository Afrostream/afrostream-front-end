//import { firebase } from 'firebase'
import ActionTypes from '../consts/ActionTypes'
import * as EventActionCreators from './event'
import config from '../../../config'

//firebase.initializeApp(google.firebase)
//
//const {apiClient, heroku, google} = config
//const messaging = firebase.messaging()

export function setPushNotifications (value) {
  return (dispatch, getState, actionDispatcher) => {
    let swReg
    return async () => {
      return await navigator.serviceWorker.register('sw.js')
        .then(() => {
          return navigator.serviceWorker.ready
        })
        .then((registration) => {
          swReg = registration
          return swReg.pushManager.getSubscription()
        })
        .then((subscription) => {
          if (subscription) {
            return subscription
          }
          return swReg.pushManager.subscribe({userVisibleOnly: true})
        })
        .then((subscription) => {
          if (subscription) {
            console.log('Subscription Notification', subscription.toJSON())
          }
          return {
            type: ActionTypes.SW.setPushNotifications,
            value: value && subscription && subscription.toJSON() || null
          }
        }).catch((err) => {
          console.log(err)
          actionDispatcher(EventActionCreators.showError(err))
        })
      //return await messaging.requestPermission()
      //  .then(() => {
      //    return messaging.getToken()
      //  })
      //  .then((subscription) => {
      //    console.log('Subscription Notification', subscription)
      //    if (subscription) {
      //      console.log('Subscription endpoint', subscription.endpoint)
      //    }
      //    return {
      //      type: ActionTypes.SW.setPushNotifications,
      //      value: value && subscription && subscription.toJSON() || null
      //    }
      //  }).catch((err) => {
      //    console.log(err)
      //    actionDispatcher(EventActionCreators.showError(err))
      //  })
    }
  }
}
