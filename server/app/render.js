import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory, useQueries } from 'history'
import { useRouterHistory, match } from 'react-router'
import request from 'superagent'
import config from '../../config'
import qs from 'qs'
import { getI18n } from '../../config/i18n'
import { getPreferredLocales } from './locale'
import createStore from '../../src/js/lib/createStore'
import createAPI from '../../src/js/lib/createAPI'
import routes from '../../src/js/routes'
import { RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { IntlProvider } from 'react-intl-redux'
import PrettyError from 'pretty-error'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import Helmet from 'react-helmet'
import _ from 'lodash'
import serializeJs from 'serialize-javascript'

const pretty = new PrettyError()
const {apps, apiServer, heroku} = config

export default function render (req, res, layout, {payload}) {
  const {path} = req
  const history = useRouterHistory(useQueries(createMemoryHistory))()
  const location = history.createLocation(req.url)
  const preferredLocale = getPreferredLocales(req)
  const api = createAPI(
    /**
     * Server's createRequest() method
     * You can modify headers, pathname, query, body to make different request
     * from client's createRequest() method
     *
     * Example:
     * You API server is `http://api.example.com` and it require accessToken
     * on query, then you can assign accessToken (get from req) to query object
     * before calling API
     */
    ({method, headers = {}, pathname = '', query = {}, body = {}, local = false, locale = '--'}) => {
      var url = `${apiServer.urlPrefix}${pathname}`

      query.from = query.from || heroku.appName

      if (local) {
        url = pathname
      }

      console.log('url : ', url)

      //FIX HW disallow body null and return 502
      if (method === 'GET') {
        return request(method, url)
          .query(qs.stringify(query))
          .set(headers)
      }

      return request(method, url)
        .query(qs.stringify(query))
        .set(headers)
        .send(body)
    }
  )

  const store = createStore(api, history)

  match({
      routes,
      location
    }, async (err, redirectLocation, renderProps) => {
      try {
        if (redirectLocation) {
          res.redirect(301, redirectLocation.pathname + redirectLocation.search)
        } else if (err) {
          throw err
        } else if (renderProps === null) {
          return res.status(404)
            .send('Not found')
        } else {
          const state = store.getState()
          let {params, location, routes} = renderProps
          let route = routes && routes[routes.length - 1]
          const {intl} = state
          // Try full locale, fallback to locale without region code, fallback to en
          const routeParamLang = _.find(routes, (route) => route.lang)
          //TODO FIXME render locale server whith preferredLocale
          //const language = (routeParamLang && routeParamLang.lang) || (preferredLocale && preferredLocale[0]) || intl.defaultLocale
          const language = (routeParamLang && routeParamLang.lang) || intl.defaultLocale
          // Split locales with a region code
          const locale = language.toLowerCase().split(/[_-]+/)[0]
          const messages = _.flattenJson(getI18n(locale))

          params.lang = locale

          const prepareRouteMethods = _.map(renderProps.components, (component) => {
            return component && (component.WrappedComponent && component.WrappedComponent.prepareRoute) || component.prepareRoute
          })

          for (let prepareRoute of prepareRouteMethods) {
            if (!prepareRoute) {
              continue
            }
            try {
              await prepareRoute({store, params, location, route})
            } catch (err) {
              console.error('Prepare route ERROR:', pretty.render(err))
            }
          }

          const body = ReactDOMServer.renderToStaticMarkup(
            <Provider {...{store}}>
              <IntlProvider key="intl" {...{messages, locale}}>
                <RouterContext {...{...renderProps}} />
              </IntlProvider>
            </Provider>
          )

          const storeState = _.merge({intl: {locale}}, store.getState())
          const initialState = serializeJs(storeState, {isJSON: true})

          //console.log('initialState', initialState)
          //console.log('preferredLocale : ', language, preferredLocale, locale)

          let metadata = Helmet.rewind()

          return res.render(layout, {
            ...payload,
            title: metadata.title,
            meta: metadata.meta,
            name: 'Afrostream',
            link: metadata.link,
            iosAppId: apps.iosAppId,
            androidAppId: apps.androidAppId,
            body,
            share: {
              twitterUrl: 'http://twitter.com/share?url=http://bit.ly/AFROSTREAMTV&text='
            },
            initialState
          })
        }
      } catch (err) {
        Helmet.rewind()
        if (err.redirect) {
          res.redirect(err.redirect)
          return
        }
        console.error('ROUTER ERROR:', pretty.render(err))
        res.status(404).send('')
      }
    }
  )
}
