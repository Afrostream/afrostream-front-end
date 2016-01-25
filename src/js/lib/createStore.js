import _ from 'lodash';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import { reduxReactRouter , routerStateReducer} from 'redux-router';
import * as middleWare from '../middleware';
import * as reducers from '../reducers';
import * as ModalActionCreators from '../actions/modal';

function promiseMiddleware(api, {getState, dispatch}) {
  return next =>
    function _r(action) {
      if (action && _.isFunction(action.then)) {
        return action.then(_r).catch(function (err) {
          if (err.response && err.response.text === 'Unauthorized')
            dispatch(ModalActionCreators.open('showRelog'));
        });
      }

      if (_.isFunction(action)) {
        return _r(action(api, getState, dispatch));
      }

      return next(action);
    };
}

export default function (api, history, initialState) {

  const createStoreWithMiddleware = compose(
    applyMiddleware(
      promiseMiddleware.bind(null, api),
      middleWare.raven,
      middleWare.logger
    ),
    reduxReactRouter({
      history
    })
  )(createStore);

  const reducer = combineReducers(reducers);

  return createStoreWithMiddleware(reducer, initialState);
}
