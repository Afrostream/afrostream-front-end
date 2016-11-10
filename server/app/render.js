import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createMemoryHistory, useQueries } from 'history'
import { useRouterHistory, match } from 'react-router'
import request from 'superagent'
import config from '../../config'
import qs from 'qs'
import createStore from '../../src/js/lib/createStore'
import createAPI from '../../src/js/lib/createAPI'
import routes from '../../src/js/routes'
import { RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import PrettyError from 'pretty-error'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import Helmet from 'react-helmet'
import _ from 'lodash'
const pretty = new PrettyError()
const {apps, apiServer} = config

export default function render (req, res, layout, {payload}) {
  const {path} = req
  const history = useRouterHistory(useQueries(createMemoryHistory))();
  const location = history.createLocation(req.url)

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
    ({method, headers = {}, pathname = '', query = {}, body = {}, local = false}) => {
      var url = `${apiServer.urlPrefix}${pathname}`
      if (local) {
        url = pathname
      }

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

          let {params, location, routes} = renderProps
          let route = routes && routes[routes.length - 1]
          const langs = ['fr', 'en']
          params.lang = langs[routes && routes.length > 2 && routes[2].path] || langs[0]

          const prepareRouteMethods = _.map(renderProps.components, component =>
          component && component.prepareRoute)

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
              <RouterContext {...{...renderProps}} />
            </Provider>
          )

          const initialState = store.getState()
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
