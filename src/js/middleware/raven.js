import Raven from 'raven-js'
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import config from '../../../config'
export default function ({ getState }) {
  /*
   Function that generates a crash reporter for Sentry.

   dsn - private Sentry DSN.
   cfg - object to configure Raven.
   */
  if (!canUseDOM) {
    return next => action => {
      return next(action)
    }
  }

  if (!Raven.isSetup()) {
    let dns = config.sentry.dns
    if (!dns) {
      // Skip this middleware if there is no DSN.
      console.error('[redux-raven-middleware] Sentry DSN required.')
      return store => next => action => {
        next(action)
      }
    }
    Raven.config(dns, config.sentry.config).install()
  }

  return (next) => (action) => {
    try {
      return next(action)
    } catch (err) {
      console.error('[redux-raven-middleware] Reporting error to Sentry:',
        err)
      // Send the report.
      Raven.captureException(err, {
        extra: {
          action: action,
          state: getState()
        }
      })
    }
  }
}
