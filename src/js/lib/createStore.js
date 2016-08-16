import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import { reduxReactRouter, routerStateReducer } from 'redux-router'
import * as middleWare from '../middleware'
import * as reducers from '../reducers'
import { push } from 'redux-router'

export default function (api, history, initialState) {

  const createStoreWithMiddleware = compose(
    applyMiddleware(
      middleWare.promise.bind(null, api),
      middleWare.raven,
      middleWare.logger
    ),
    reduxReactRouter({
      history
    })
  )(createStore)

  const reducer = combineReducers(reducers)

  return createStoreWithMiddleware(reducer, initialState)
}
