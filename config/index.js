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
      cname: process.env.CNAME || 'beta.afrostream.tv',
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
