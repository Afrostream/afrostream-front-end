'use strict';
import _ from 'lodash';
import client from './client';

const config = _.merge(
  {
    /**
     * Front-End Server
     */
    server: {
      host: '0.0.0.0',
      ip: process.env.IP ||
      undefined,
      port: process.env.PORT ||
      3000
    },

    /**
     * API Server
     */
    apiServer: {
      urlPrefix: process.env.API_END_POINT || 'http://localhost:3002/api'
    },

    /**
     * WebpackDevServer
     */
    webpackDevServer: {
      host: '0.0.0.0',
      port: 8081
    },

    /**
     * browserSync
     */
    browserSyncServer: {
      host: '0.0.0.0',
      port: 8082
    }
  }, client);

export default config;
