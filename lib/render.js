'use strict';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {  match } from 'react-router';
import { createLocation, createMemoryHistory } from 'history'
import request from 'superagent';
import {apps} from '../config';
//import superAgentMock from '../config/mock/superagent-mock';
import qs from 'qs';
import createStore from '../src/js/lib/createStore';
import createAPI from '../src/js/lib/createAPI';
import routes from '../src/js/routes';
import { apiServer } from '../config';
import Router from '../src/js/components/Router';
import { Provider } from 'react-redux';
import PrettyError from 'pretty-error';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment'
import Helmet from 'react-helmet';
const pretty = new PrettyError();
//superAgentMock(request);

export default function render(req, res, layout, { payload }) {
  const { path, query } = req;
  const location = createLocation(path, query);
  const history = createMemoryHistory(path);

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
    ({ method, headers = {}, pathname = '', query = {}, body = {} }) => {
      var url = `${apiServer.urlPrefix}${pathname}`;
      return request(method, url)
        .query(qs.stringify(query))
        .set(headers)
        .send(body);
    }
  );

  const store = createStore(api, history);

  match({
      routes,
      location
    }, async (err, redirectLocation, renderProps) => {

      try {
        if (redirectLocation) {
          res.redirect(301, redirectLocation.pathname + redirectLocation.search);
        } else if (err) {
          throw err;
        } else if (renderProps === null) {
          return res.status(404)
            .send('Not found');
        } else {

          const { params, location } = renderProps;
          const prepareRouteMethods = renderProps.components.map(component =>
            component.prepareRoute);

          for (let prepareRoute of prepareRouteMethods) {
            if (!prepareRoute) {
              continue;
            }
            try {
              await prepareRoute({store, params, location});
            } catch (err) {
              console.error('Prepare route ERROR:', pretty.render(err));
            }
          }

          const body = ReactDOMServer.renderToStaticMarkup(
            <Provider {...{store}}>
              <Router {...{...renderProps, location}} />
            </Provider>
          );

          const initialState = store.getState();
          let metadata = Helmet.rewind();

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
          });
        }
      } catch (err) {
        Helmet.rewind();
        if (err.redirect) {
          res.redirect(err.redirect);
          return;
        }
        console.error('ROUTER ERROR:', pretty.render(err));
        res.status(404).send('');
      }
    }
  );
}
