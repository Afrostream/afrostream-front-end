import React from'react';
import ReactDOM from'react-dom';
import createHistory from 'history/lib/createBrowserHistory';
import useScroll from 'scroll-behavior/lib/useScrollToTop'
import Router from './components/Router';
import { Provider } from 'react-redux';
import createStore from './lib/createStore';
import request from 'superagent';
import superAgentMock from '../../config/mock/superagent-mock';
import qs from 'qs';
import createAPI from './lib/createAPI';
import { apiClient, heroku } from '../../config';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
superAgentMock(request);

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
