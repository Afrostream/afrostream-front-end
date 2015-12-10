import _ from 'lodash';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import * as middleWare from '../middleware';
import * as reducers from '../reducers';

function promiseMiddleware(api, { getState ,dispatch}) {
  return next =>
    function _r(action) {
      if (action && _.isFunction(action.then)) {
        return action.then(_r);
      }

      if (_.isFunction(action)) {
        return _r(action(api, getState, dispatch));
      }

      return next(action);
    };
}

export default function (api, initialState) {
  const createStoreWithMiddleware = applyMiddleware(promiseMiddleware.bind(null,
    api), middleWare.raven, middleWare.logger)(createStore);
  const reducer = combineReducers(reducers);

  return createStoreWithMiddleware(reducer, initialState);
}
