import React from 'react';
import History from 'react-router/lib/BrowserHistory';
import Router from './components/Router';
import { Provider } from 'redux/react';
import createRedux from './lib/createRedux';
import request from 'superagent';
import superAgentMock from '../../config/mock/superagent-mock';
import qs from 'qs';
import createAPI from './lib/createAPI';
import { apiClient } from '../../config';

const env = process.env.NODE_ENV || 'development';
if (env === 'development') {
  superAgentMock(request);
}

const history = new History;
const api = createAPI(
  /**
   * Client's createRequest() method
   */
  ({ method, headers = {}, pathname = '', query = {}, body = {} }) => {
    pathname = pathname.replace(new RegExp(`^${apiClient.urlPrefix}`), '');
    var url = `${apiClient.urlPrefix}${pathname}`;

    return request(method, url)
      .query(qs.stringify(query))
      .set(headers)
      .send(body);
  }
);

/* global __INITIAL_STATE__:true */
const redux = createRedux(api, __INITIAL_STATE__);

React.render(
  <Provider redux={redux}>
    {() => <Router {...{history}} />}
  </Provider>,
  document.getElementById('main')
);
