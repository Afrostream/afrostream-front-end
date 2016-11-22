import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import * as middleWare from '../middleware'
import * as reducers from '../reducers'
import { push } from 'redux-router'
import { intlReducer } from 'react-intl-redux'
import _ from 'lodash'

export default function (api, history, initialState) {

  const createStoreWithMiddleware = compose(
    applyMiddleware(
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
    intl: intlReducer
  })

  const mergedState = _.merge({
    intl: {
      defaultLocale: 'en',
      locale: 'fr'
    }
  }, initialState)

  return createStoreWithMiddleware(reducer, mergedState)
}
