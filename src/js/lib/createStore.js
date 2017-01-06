import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import * as middleWare from '../middleware'
import * as reducers from '../reducers'
import { push } from 'redux-router'
import { intlReducer } from 'react-intl-redux'
import _ from 'lodash'
import { addLocaleData } from 'react-intl'
import window from 'global/window'

import frLocaleData from 'react-intl/locale-data/fr'
import enLocaleData from 'react-intl/locale-data/en'


const localesData = [
  ...frLocaleData,
  ...enLocaleData,
]

const countryReducer = function (state = '--', action) {

  if (action.type !== '@@country/UPDATE') {
    return state
  }

  return state.merge(state, action.payload)
}

const staticReducer = function (state = {}, action) {

  if (action.type !== '@@static/UPDATE') {
    return state
  }

  return state.merge(state, action.payload)
}

addLocaleData(localesData)
export default function (api, history, initialState) {

  const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose
  const createStoreWithMiddleware = composeEnhancers(
    applyMiddleware(
      //middleWare.statsd.bind(null),
      middleWare.promise.bind(null, api),
      middleWare.raven,
      middleWare.tracker,
      middleWare.logger
    ),
    reduxReactRouter({
      history
    })
  )(createStore)

  const reducer = combineReducers({
    ...reducers,
    intl: intlReducer,
    country: countryReducer,
    ...staticReducer
  })

  const mergedState = _.merge({
    intl: {
      defaultLocale: 'fr',
      locales: localesData
    }
  }, initialState)

  return createStoreWithMiddleware(reducer, mergedState)
}
