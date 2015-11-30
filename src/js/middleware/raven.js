import raven from 'raven'

export default function (dsn, cfg = {}) {
  let client = null;
  /*
   Function that generates a crash reporter for Sentry.

   dsn - private Sentry DSN.
   cfg - object to configure Raven.
   */
  if (!client) {
    if (!dsn) {
      // Skip this middleware if there is no DSN.
      console.error('[redux-raven-middleware] Sentry DSN required.');
      return store => next => action => {
        next(action);
      };
    }
    client = new raven.Client(dsn);
  }

  return store => next => action => {
    try {
      return next(action);
    } catch (err) {
      console.error('[redux-raven-middleware] Reporting error to Sentry:',
        err);

      client.captureException(err, {
        extra: {
          action: action,
          state: store.getState()
        }
      });
    }
  }
}
