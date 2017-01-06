import _ from 'lodash'

export default function (api, {getState, dispatch}) {
  return next =>
    function _r (action) {
      if (action && _.isFunction(action.then)) {
        return action.then(_r)
      }

      if (_.isFunction(action)) {
        return _r(action((data) => {
          const state = getState()
          //Pass locale to all calls
          const {intl:{locale}, country}= state
          if (locale) {
            data = _.merge({params: {language: locale.toUpperCase()}}, data)
          }
          if (country) {
            data = _.merge({params: {country}}, data)
          }
          return api(data)
        }, getState, dispatch))
      }

      return next(action)
    }
}
