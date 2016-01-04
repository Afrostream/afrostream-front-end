'use strict';

import React from 'react';
import { Router as ReactRouter } from 'react-router';
import Location from 'react-router/lib/Location';
import History from 'react-router/lib/MemoryHistory';
import request from 'superagent';
import superAgentMock from '../config/mock/superagent-mock';
import qs from 'qs';
import createStore from '../src/js/lib/createStore';
import createAPI from '../src/js/lib/createAPI';
import routes from '../src/js/routes';
import { apiServer } from '../config';
import Router from '../src/js/components/Router';
import { Provider } from 'react-redux';
import PrettyError from 'pretty-error';
import {canUseDOM} from 'react/lib/ExecutionEnvironment'
import Helmet from 'react-helmet';
const pretty = new PrettyError();
superAgentMock(request);

export default function render(req, res, layout, { payload }) {
  const { path, query } = req;
  const location = new Location(path, query);
  const history = new History(path);

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
      console.log(url)
      return request(method, url)
        .query(qs.stringify(query))
        .set(headers)
        .send(body);
    }
  );

  const store = createStore(api);

  ReactRouter.run(routes, location, async (err, routerState) => {
    try {
      if (err) {
        throw err;
      }
      const { params, location } = routerState;
      const prepareRouteMethods = routerState.components.map(component =>
        component.prepareRoute);

      for (let prepareRoute of prepareRouteMethods) {
        if (!prepareRoute) {
          continue;
        }

        await prepareRoute({store, params, location});
      }

      const body = React.renderToStaticMarkup(
        <Provider {...{store}}>
          {() => <Router {...{...routerState, location, history}} />}
        </Provider>
      );

      const initialState = store.getState();
      let metadata = Helmet.rewind();

      res.render(layout, {
        ...payload,
        title: metadata.title,
        meta: metadata.meta,
        name: 'Afrostream',
        link: metadata.link,
        body,
        share: {
          twitterUrl: 'http://twitter.com/share?url=http://bit.ly/AFROSTREAMTV&text='
        }
        ,
        initialState
      })
      ;

    } catch (err) {
      Helmet.rewind();
      if (err.redirect) {
        res.redirect(err.redirect);
        return;
      }
      console.error('ROUTER ERROR:', pretty.render(err));
      res.status(404).send('');
    }
  });
}
