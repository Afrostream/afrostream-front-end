import ActionTypes from '../consts/ActionTypes'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../config'
import _ from 'lodash'
import window from 'global/window'

export function createIntercom (settings = {'feature_type': null}) {
  const appId = config.intercom.appID
  const type = settings['feature_type']
  return (dispatch, getState) => {
    if (!document) {
      return {
        type: ActionTypes.Intercom.createIntercom,
        intercom: null
      }
    }
    let ic = getState().Intercom.get(`intercom/${appId}/${type}`)
    if (ic) {
      ic('show')
      return {
        type: ActionTypes.Intercom.createIntercom,
        intercom: ic,
        appId,
        type
      }
    }
    return async intercom =>(
      await new Promise(
        (resolve, reject) => {

          window.intercomSettings = _.merge({
            app_id: appId
          }, settings)

          var script = document.createElement('script')
          script.type = 'text/javascript'
          script.async = true
          script.src = config.intercom.url + appId
          // Attach the script tag to the document head
          var s = document.getElementsByTagName('script')[0]
          s.parentNode.insertBefore(script, s)

          script.onload = function () {
            var w = window
            var ic = w.Intercom
            if (typeof ic === 'function') {
              ic('reattach_activator')
              ic('update', {
                app_id: appId
              })
            }

            return resolve({
              type: ActionTypes.Intercom.createIntercom,
              intercom: ic,
              appId,
              type
            })
          }
          script.onerror = function () {
            return reject({
              type: ActionTypes.Intercom.createIntercom,
              intercom: {},
              appId,
              type
            })
          }
          // (old) MSIE browsers may call 'onreadystatechange' instead of 'onload'
          script.onreadystatechange = function () {
            if (this.readyState == 'loaded') {
              // wait for other events, then call onload if default onload hadn't been called
              window.setTimeout(function () {
                if (loadedScripts[scriptURL] !== true) script.onload()
              }, 0)
            }
          }
        }
      )
    )
  }
}
export function removeIntercom () {
  return (dispatch, getState) => {
    if (!document) {
      return {
        type: ActionTypes.Intercom.removeIntercom,
        intercom: null
      }
    }


    var w = window
    var ic = w.Intercom
    if (ic) {
      ic('shutdown')
      ic('hide')
    }

    return {
      type: ActionTypes.Intercom.removeIntercom,
      intercom: ic
    }
  }
}
