import React from'react'
import ReactDOM from 'react-dom'
import Router from './components/Router'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl-redux'
import { browserHistory } from 'react-router'
import createStore from './lib/createStore'
import createAPI from './lib/createAPI'
import request from 'superagent'
import moment from 'moment'
import config from '../../config'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as UserActionCreators from './actions/user'
import document from 'global/document'
import { deserialize } from './lib/utils'

const {apiClient} = config

const history = browserHistory
/* global __INITIAL_STATE__:true */
const state = typeof __INITIAL_STATE__ === 'string' && deserialize(__INITIAL_STATE__) || __INITIAL_STATE__
const {intl: {locale}} = state
moment.locale(locale)

/*
 * hack for mobile app:
 * the mobile app needs to open webview, passing by the token
 * we read the token from the url & save it to the localstorage...
 */
function hackForMobileWebview() {
  try {
    // @see https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    const url = window && window.location && window.location.href || ''
    const r = (new RegExp('[?&]wvmtok(=([^&#]*)|&|#|$)')).exec(url)

    if (r && r[2]) {
      try {
        const oauthData = JSON.parse(decodeURIComponent(r[2].replace(/\+/g, ' ')))

        console.log('hack for mobile web view oauthData='+oauthData)

        // hardcodé...
        if (oauthData) {
          const storageId = 'accessToken' // <=> config.apiClient.token

          if (oauthData.access_token) {
            console.log('[INFO]: hackForMobileWebview using token info ' + JSON.stringify(oauthData))
            oauthData.expiresAt = new Date(Date.now() + 1000 * (oauthData.expiresIn || oauthData.expires_in)).toISOString()
            localStorage.setItem(storageId, JSON.stringify(oauthData))
          } else {
            console.error('[ERROR]: hackForMobileWebview: missing oauthData.access_token')
          }
        }
      } catch (e) {
        console.error('[ERROR]: hackForMobileWebview during storage ', e)
      }
    }
  } catch (e) {
    console.error('[ERROR]: hackForMobileWebview during regex ', e)
  }
}

function initSite () {
  //
  hackForMobileWebview()

  const api = createAPI(
    /**
     * Client's createRequest() method
     */
    ({
       method = 'GET',
       headers = {},
       pathname = '',
       query = {},
       body = {},
       legacy = false,
       local = false
     }) => {
      pathname = pathname.replace(new RegExp(`^${apiClient.urlPrefix}`), '')
      let url = `${apiClient.urlPrefix}${pathname}`

      if (legacy) {
        url = url.replace(apiClient.urlPrefix, `${apiClient.protocol}://${apiClient.authority}`)
      }
      if (local) {
        url = pathname
      }

      //FIX HW disallow body null and return 502
      if (method === 'GET') {
        return request(method, url)
          .query(query)
          .set(headers)
      }

      return request(method, url)
        .query(query)
        .set(headers)
        .send(body)
    }
  )

  /* global __INITIAL_STATE__:true */
  const store = createStore(api, history, state)
  ReactDOM.render(
    <Provider {...{store}} >
      <IntlProvider>
        <Router />
      </IntlProvider>
    </Provider>,
    document.getElementById('main')
  )

  store.dispatch(UserActionCreators.getProfile())
}

initSite()
