import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory, useQueries } from 'history'
import { useRouterHistory, match } from 'react-router'
import request from 'superagent'
import config from '../../config'
import { getI18n } from '../../config/i18n'
import { getPreferredLocales } from './locale'
import createStore from '../../src/js/lib/createStore'
import createAPI from '../../src/js/lib/createAPI'
import { routes as dynamikRoutes, staticRoutes } from  '../../src/js/routes'
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

export default function render (req, res, layout, {payload, isStatic}) {
  const routes = isStatic ? staticRoutes : dynamikRoutes
  const history = useRouterHistory(useQueries(createMemoryHistory))()
  const location = history.createLocation(req.query.location || req.url)
  const {query} = location
  const country = query.country
  const isMobile = query.isMobile
  const subscribed = query.subscribed
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
    ({method, headers = {}, pathname = '', query = {}, body = {}, local = false, locale = 'whatever'}) => {
      var url = `${apiServer.urlPrefix}${pathname}`

      query.from = query.from || heroku.appName
      query.country = query.country || locale || 'whatever'

      console.log('server call query : ', query)

      if (local) {
        url = pathname
      }

      console.log('url : ', url)

      //FIX HW disallow body null and return 502
      if (method === 'GET') {
        return request(method, url)
          .query(query)
          .set(headers)
      }

      return request(method, url)
        .query(query)
        .set(headers)
        .send(body)
    }
  )


  match({
      routes,
      location
    }, async (err, redirectLocation, renderProps) => {
      try {
        if (redirectLocation) {
          res.redirect(301, redirectLocation.pathname + redirectLocation.search)
        } else if (err) {
          throw err
        } else if (renderProps === null || !renderProps) {
          return res.status(404).render('layouts/404')
        } else {
          // *** FAKE USER *** ///
          //if Subscribed params, init state with faked user
          let user = null
          if (subscribed) {
            user = {
              authorized: true,
              planCode: subscribed,
              picture: '/images/default/carre.jpg'
            }
          }

          let geo = {
            countryCode: 'whatever'
          }
          if (country) {
            geo.countryCode = country
          }

          let {params, location, routes, router} = renderProps
          let route = routes && routes[routes.length - 1]

          // Try full locale, fallback to locale without region code, fallback to en
          const routeParamLang = _.find(routes, (route) => route.lang)
          //TODO FIXME render locale server whith preferredLocale
          const language = (routeParamLang && routeParamLang.lang) || (preferredLocale && preferredLocale[0]) || 'FR'
          // Split locales with a region code
          let locale = language.toLowerCase().split(/[_-]+/)[0]
          if (!~['fr', 'en'].indexOf(locale)) {
            locale = 'en'
          }
          const messages = _.flattenJson(getI18n(locale))


          params.lang = locale
          // *** Init Store
          const store = createStore(api, history,
            {
              OAuth: {token: {}},
              Geo: {geo},
              User: {user},
              Event: {isMobile},
              intl: {locale, messages}
            })

          const recursiveFunction = function (collection, result) {
            if (collection && collection.prepareRoute) {
              result.push(collection.prepareRoute)
            }
            if (collection && collection.WrappedComponent) {
              recursiveFunction(collection.WrappedComponent, result);
            }
          };

          const prepareRouteMethods = _.reduce(renderProps.components, (result, component) => {
            recursiveFunction(component, result)
            return result
          }, [])

          console.log('prepareRouteMethods : ', prepareRouteMethods.length)

          for (let prepareRoute of prepareRouteMethods) {
            if (!prepareRoute) {
              continue
            }
            try {
              await prepareRoute({store, params, router, location, route})
            } catch (err) {
              console.error('Prepare route ERROR:', pretty.render(err))
            }
          }

          const body = ReactDOMServer.renderToString(
            <Provider {...{store}}>
              <IntlProvider {...{messages, locale}}>
                <RouterContext {...{...renderProps}} />
              </IntlProvider>
            </Provider>
          )

          const storeState = _.merge({intl: {locale}}, store.getState())
          const initialState = serializeJs(storeState, {isJSON: true})

          console.log('preferredLocale : ', language, preferredLocale, locale)

          const format = req.query.format
          let metadata = Helmet.rewind()

          switch (format) {
            case 'json':

              const componentHtml = ReactDOMServer.renderToString(
                <Provider {...{store}}>
                  <IntlProvider>
                    <RouterContext {...{...renderProps, location}} childRoutes={routes}/>
                  </IntlProvider>
                </Provider>
              )

              return res.jsonp({
                html: componentHtml,
                state: initialState
              })

              break
            default:
              return res.render(layout, {
                ...payload,
                componentHtml,
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
              break
          }
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
