import React from'react';
import ReactDOM from'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll'
import Router from './components/Router';
import {  match } from 'react-router';
import { Provider } from 'react-redux';
import createStore from './lib/createStore';
import request from 'superagent';
//import superAgentMock from '../../config/mock/superagent-mock';
import qs from 'qs';
import createAPI from './lib/createAPI';
import { apiClient, heroku } from '../../config';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import _ from 'lodash';
//superAgentMock(request);
if (canUseDOM) {
  require('jquery');
  require('bootstrap');
  require('jquery.payment');
}

const history = useScroll(createHistory)();
const api = createAPI(
  /**
   * Client's createRequest() method
   */
  ({ method, headers = {}, pathname = '', query = {}, body = {} }) => {
    pathname = pathname.replace(new RegExp(`^${apiClient.urlPrefix}`), '');
    var url = `${apiClient.urlPrefix}${pathname}`;
    query.from = query.from || heroku.appName;

    const storageId = apiClient.token;
    const storageRefreshId = apiClient.tokenRefresh;

    let token = localStorage.getItem(storageId);
    let refreshToken = localStorage.getItem(storageRefreshId);

    if (token) {
      headers = _.merge(headers, {
        'Access-Token': token
      });
    }

    return request(method, url)
      .query(qs.stringify(query))
      .set(headers)
      .send(body);
  }
);

/* global __INITIAL_STATE__:true */
const store = createStore(api, history, __INITIAL_STATE__);

ReactDOM.render(
  <Provider {...{store}}>
    <Router />
  </Provider>,
  document.getElementById('main')
);
