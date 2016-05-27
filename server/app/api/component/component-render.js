import React from 'react'
import ReactDOMServer from 'react-dom/server'
import PrettyError from 'pretty-error'
import qs from 'qs'
import _ from 'lodash'
import request from 'superagent'
import config from '../../../../config'
import { match, RouterContext } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import { ReduxRouter } from 'redux-router'
import { staticRoutes as routes } from '../../../../src/js/routes'
import createStore from '../../../../src/js/lib/createStore'
import createAPI from '../../../../src/js/lib/createAPI'

const pretty = new PrettyError()
const {apiServer} = config

export default function RenderStatic (req, res, layout, {payload}) {
  const {path} = req
  const history = createMemoryHistory(path)
  const location = history.createLocation(path)

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
    ({method, headers = {}, pathname = '', query = {}, body = {}}) => {
      var url = `${apiServer.urlPrefix}${pathname}`
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

        params = params || {}
        params.lang = routes && routes.length > 2 && routes[2].path

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

        const componentHtml = ReactDOMServer.renderToStaticMarkup(
          <Provider {...{store}}>
            <ReduxRouter {...{...renderProps, location}} >
              {routes}
            </ReduxRouter>
          </Provider>
        )

        const initialState = store.getState()

        return res.render(layout, {
          ...payload,
          componentHtml,
          initialState
        })
      }
    } catch (err) {
      if (err.redirect) {
        res.redirect(err.redirect)
        return
      }
      console.error('ROUTER ERROR:', pretty.render(err))
      res.status(404).send('')
    }
  })

  //
  //if (serverSideRender === undefined) serverSideRender = false
  //if (componentProps === undefined || componentProps === null) componentProps = {}
  //
  //const regexCleanupPattern = /([^a-zA-Z])/g
  //const reactCompNameOnBrowser = componentAlias.replace(regexCleanupPattern, '_')
  //const randomId = Math.random().toString(36).substring(7)
  //
  //// script for client side
  //const startup_code = '<script>var React = require("react")var ' +
  //  reactCompNameOnBrowser + '=React.render(React.createFactory(require("' +
  //  componentAlias +
  //  '"))(' + JSON.stringify(componentProps) + '), ' +
  //  'document.getElementById("' + randomId + '"))' +
  //  '</script>'
  //// html for client side
  //let componentHtml = '<div id="' + randomId + '"></div>'
  //
  //if (serverSideRender === true) {
  //  // handle file extension
  //  const extension = (this.REACT_FILES_EXTENSION !== null) ? this.REACT_FILES_EXTENSION : 'js'
  //  const compPath = path.resolve(this.PATH_TO_REACT_FILES, componentAlias + '.' + extension)
  //
  //  // remove cache from required files if env is not production
  //  if (this.NODE_ENV !== 'production') {
  //    console.log('Rendered ReactJS component: ' + componentAlias)
  //    this._refreshRequireFunctionCache()
  //  }
  //
  //  const component = require(compPath)
  //  console.log(component)
  //  componentProps.params = {lang: 'fr'}
  //  const componentMounted = React.createElement(component, componentProps)
  //  console.log(componentMounted)
  //  const htmlC = ReactDOMServer.renderToString(<Footer {...componentProps}/>)
  //  console.log(htmlC)
  //  // html for client side
  //  componentHtml = '<div id="' + randomId + '">' + htmlC + '</div>'
  //}

  //const returnObj = {
  //  html: componentHtml,
  //  script: startup_code
  //}
  //return returnObj
}
