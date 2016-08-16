import _ from 'lodash'
import { fetchToken, promiseCalls } from '../lib/createAPI'

export default function (api, {getState, dispatch}) {
  return next =>
    function _r (action) {

      if (action && _.isFunction(action.then)) {
        return action.then(_r)
        //TODO add popup reconnect on action error
          .catch(function (err) {
            if (err.status === 401 && err.message === 'Unauthorized') {
              return fetchToken(true).then(()=> {
                next(action)
              }).catch(()=> {
                if (_.isFunction(action.catch)) {
                  return action.catch(err)
                }
                return next(action)
              })
            }
            if (_.isFunction(action.catch)) {
              return action.catch(err)
            }
            return next(action)
          })
      }

      if (_.isFunction(action)) {
        return _r(action(api, getState, dispatch))
      }

      return next(action)
    }
}
