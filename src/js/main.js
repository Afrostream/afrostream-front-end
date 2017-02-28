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
const {intl:{locale}} = state
moment.locale(locale)

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
