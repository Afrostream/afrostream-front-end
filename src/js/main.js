import React from'react'
import ReactDOM from'react-dom'
import createHistory from 'history/lib/createBrowserHistory'
import useScroll from 'scroll-behavior/lib/useStandardScroll'
import Router from './components/Router'
import { Provider } from 'react-redux'
import createStore from './lib/createStore'
import createAPI from './lib/createAPI'
import request from 'superagent'
import moment from 'moment'
import qs from 'qs'
import config from '../../config'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { getCountry } from './lib/geo'
import * as UserActionCreators from './actions/user'
import injectTapEventPlugin from 'react-tap-event-plugin'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin()

const {apiClient, heroku} = config

//Set locale date //TODO une fois le site multilingue formater au pays courant
moment.locale('fr')

if (canUseDOM) {
  require('bootstrap')
  require('jquery.payment')
  require('./lib/customEventPolyfill')
  require('./lib/localStoragePolyfill')
}

const history = useScroll(createHistory)()

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
      query.country = query.country || country || '--'
      if (legacy) {
        url = url.replace(apiClient.urlPrefix, `${apiClient.protocol}://${apiClient.authority}`)
      }
      if (local) {
        url = pathname
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
    <Provider {...{store}}>
      <Router />
    </Provider>,
    document.getElementById('main')
  )
}

getCountry().then((country)=> {
  initSite(country)
}).catch((err)=> {
  initSite()
})
