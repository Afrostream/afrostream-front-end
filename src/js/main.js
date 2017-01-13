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
import _ from 'lodash'
import config from '../../config'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { getCountry } from './lib/geo'
import * as UserActionCreators from './actions/user'
import document from 'global/document'

import { deserialize } from './lib/utils'
import { getI18n } from '../../config/i18n'

require('./lib/polyfills/localStoragePolyfill')
require('./lib/polyfills/customEventPolyfill')
require('./lib/polyfills/requestAnimationFramePolyfill')
require('./lib/polyfills/mobile')


const {apiClient, heroku} = config

const history = browserHistory
/* global __GEO_STATE__:true */
/* global __USER_STATE__:true */
/* global __INITIAL_STATE__:true */
const state = typeof __INITIAL_STATE__ === 'string' && deserialize(__INITIAL_STATE__) || __INITIAL_STATE__
const {intl:{defaultLocale, locale}} = state
// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = locale || (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage || defaultLocale
// Split locales with a region code
const clientLocale = language.toLowerCase().split(/[_-]+/)[0]
// Try full locale, fallback to locale without region code, fallback to en
const messages = _.flattenJson(getI18n(clientLocale))

//Set locale date //TODO une fois le site multilingue formater au pays courant
moment.locale(clientLocale)

function initSite () {
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
      local = false,
      locale = '--'
    }) => {
      pathname = pathname.replace(new RegExp(`^${apiClient.urlPrefix}`), '')
      let url = `${apiClient.urlPrefix}${pathname}`
      query.from = query.from || heroku.appName
      query.country = query.country || '--'
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
      <IntlProvider key="intl" {...{locale: clientLocale, messages, locale}}>
        <Router />
      </IntlProvider>
    </Provider>,
    document.getElementById('main')
  )

  store.dispatch(UserActionCreators.getProfile())
}

initSite()
