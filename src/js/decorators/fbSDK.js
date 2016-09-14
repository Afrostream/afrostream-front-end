import React, { PropTypes } from 'react'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import ActionTypes from '../consts/ActionTypes'
import window from 'global/window'
import config from '../../../config'

const {facebook} = config

export default function fbSDK () {

  return FBComponent =>

    class FBDecorator extends React.Component {

      static contextTypes = {
        store: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
      }

      render () {
        return (
          <FBComponent {...this.props} />
        )
      }

      getLoginStatus () {
        const {
          context: {store}
        } = this
        window.FB.getLoginStatus((response) => {
          store.dispatch({
            type: ActionTypes.Facebook.initialized,
            res: response
          })
        })
      }

      componentDidMount () {
        window.fbAsyncInit = ()=> {
          FB.init({
            appId: facebook.appId,
            xfbml: true,
            version: facebook.sdkVersion
          })

          // after initialization, get the login status
          this.getLoginStatus()
        },

          (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0]
            if (d.getElementById(id)) {
              return
            }
            js = d.createElement(s)
            js.id = id
            js.src = '//connect.facebook.net/fr_FR/sdk.js'
            fjs.parentNode.insertBefore(js, fjs)
          }(document, 'script', 'facebook-jssdk'))
      }

    }
}
