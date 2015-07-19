'use strict';
import _ from 'lodash';
import client from './client';

const config = _.merge(
  {
    /**
     * Front-End Server
     */
    server: {
      host: 'localhost',
      ip: process.env.IP ||
      undefined,
      port: process.env.PORT ||
      3000
    },

    /**
     * API Server
     */
    apiServer: {
      urlPrefix: process.env.API_END_POINT || '//api.afrostream.tv'
    },

    /**
     * WebpackDevServer
     */
    webpackDevServer: {
      host: 'localhost',
      port: 8081
    },

    /**
     * browserSync
     */
    browserSyncServer: {
      host: 'localhost',
      port: 8082
    }
  }, client);

export default config;