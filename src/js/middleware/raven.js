import raven from 'raven'
import config from '../../../config'

const Raven = new raven.Client(process.env.NODE_ENV === 'production' && config.sentry.dns)
Raven.patchGlobal()

export default function ({getState}) {

  return (next) => (action) => {
    try {
      return next(action)
    } catch (err) {
      console.error('[redux-raven-middleware] Reporting error to Sentry:',
        err)
      // Send the report.
      Raven.captureException(err, {
        extra: {
          action: action
        }
      })
    }
  }
}
