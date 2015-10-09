'use strict';
import _ from 'lodash';
import client from './client';

// env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const env = process.env.NODE_ENV;

// chargement de la conf de staging (lorsque l'on est en local)
if (process.env.NODE_ENV === 'staging') {
  const herokuConfig = require('../app.json');
  _.merge(process.env, herokuConfig.env);
}

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
