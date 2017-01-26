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
          const {intl:{defaultLocale}, Geo} = state
          const geo = Geo.get('geo')
          console.log('locale', defaultLocale)
          if (defaultLocale) {
            data = _.merge({options: {language: defaultLocale.toUpperCase()}}, data)
          }
          if (geo) {
            const countryCode = geo.get('countryCode')
            if (countryCode) {
              data = _.merge({options: {country: countryCode}}, data)
            }
          }
          return api(data)
        }, getState, dispatch))
      }

      return next(action)
    }
}
