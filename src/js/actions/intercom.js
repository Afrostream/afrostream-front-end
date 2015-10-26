import ActionTypes from '../consts/ActionTypes';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';
import config from '../../../config/client';

export function createIntercom() {
  return (dispatch, getState) => {
    if (!document) {
      return {
        type: ActionTypes.Intercom.createIntercom,
        intercom: null
      };
    }
    return async intercom =>(
      await new Promise(
        (resolve, reject) => {

          window.intercomSettings = {
            app_id: config.intercom.appID
          };

          var script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = config.intercom.url + config.intercom.appID;
          // Attach the script tag to the document head
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(script, s);

          script.onload = function () {
            var w = window;
            var ic = w.Intercom;
            if (typeof ic === 'function') {
              console.log(config.intercom.appID);
              ic('reattach_activator');
              ic('update', {
                app_id: config.intercom.appID
              });
            }

            return resolve({
              type: ActionTypes.Intercom.createIntercom,
              intercom: ic
            });
          };
          script.onerror = function (event) {
            return reject({
              type: ActionTypes.Intercom.createIntercom,
              intercom: {}
            });
          };
          // (old) MSIE browsers may call 'onreadystatechange' instead of 'onload'
          script.onreadystatechange = function () {
            if (this.readyState == 'loaded') {
              // wait for other events, then call onload if default onload hadn't been called
              window.setTimeout(function () {
                if (loadedScripts[scriptURL] !== true) script.onload();
              }, 0);
            }
          };
        }
      )
    );
  }
}
export function removeIntercom() {
  return (dispatch, getState) => {
    if (!document) {
      return {
        type: ActionTypes.Intercom.removeIntercom,
        intercom: null
      };
    }


    var w = window;
    var ic = w.Intercom;
    ic('shutdown');
    ic = null;
    document.getElementById('intercom-container').style.display = 'none';



    return {
      type: ActionTypes.Intercom.removeIntercom,
      intercom: ic
    };
  };
}
