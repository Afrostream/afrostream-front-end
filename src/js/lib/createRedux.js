import _ from 'lodash';
import { createDispatcher, createRedux, composeStores } from 'redux';
import * as reducers from '../reducers';
import { loggerMiddleware } from '../middleware';

function promiseMiddleware(api, getState) {
  return next =>
    function _r(action) {
      if (action && _.isFunction(action.then)) {
        return action.then(_r);
      }

      if (_.isFunction(action)) {
        return _r(action(api, getState));
      }

      return next(action);
    };
}

export default function (api, intialState) {
  const dispatcher = createDispatcher(
    composeStores(reducers),
      getState => [promiseMiddleware(api, getState), loggerMiddleware]
  );
  const redux = createRedux(dispatcher, intialState);

  return redux;
}
