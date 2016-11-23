import React from'react'
import ReactDOM from'react-dom'
import { createHistory } from 'history'
import withScroll from 'scroll-behavior'
import Router from './components/Router'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl-redux'

import createStore from './lib/createStore'
import createAPI from './lib/createAPI'
import request from 'superagent'
import moment from 'moment'
import _ from 'lodash'
import qs from 'qs'
import config from '../../config'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { getCountry } from './lib/geo'
import * as UserActionCreators from './actions/user'
import injectTapEventPlugin from 'react-tap-event-plugin'

import { getI18n } from '../../config/i18n'


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const {apiClient, heroku} = config

if (canUseDOM) {
  require('bootstrap')
  require('./lib/customEventPolyfill')
  require('./lib/localStoragePolyfill')
}

const history = withScroll(createHistory())

const {intl:{defaultLocale, locale, locales}} = __INITIAL_STATE__
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

function initSite (country) {
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
      query.from = query.from || heroku.appName
      query.country = query.country || country || locale.toUpperCase() || '--'
      query.language = query.locale || locale.toUpperCase() || '--'
      if (legacy) {
        url = url.replace(apiClient.urlPrefix, `${apiClient.protocol}://${apiClient.authority}`)
      }
      if (local) {
        url = pathname
      }

      //FIX HW disallow body null and return 502
      if (method === 'GET') {
        return request(method, url)
          .query(qs.stringify(query))
          .set(headers)
      }

      return request(method, url)
        .query(qs.stringify(query))
        .set(headers)
        .send(body)
    }
  )
  /* global __INITIAL_STATE__:true */
  const store = createStore(api, history, __INITIAL_STATE__)

  store.dispatch(UserActionCreators.getProfile())

  ReactDOM.render(
    <Provider {...{store}} >
      <IntlProvider key="intl" {...{locale: clientLocale, messages, locale}}>
        <Router />
      </IntlProvider>
    </Provider>,
    document.getElementById('main')
  )
}

getCountry().then((country) => {
  initSite(country)
}).catch((err) => {
  console.log('Get Geo error', err)
  initSite()
})
