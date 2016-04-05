'use strict';
import _ from 'lodash';
import client from './client';

const config = _.merge(
  {
    metadata: {
      domain: 'https://afrostream.tv',
      title: 'Afrostream.tv',
      description: 'AFROSTREAM, LES MEILLEURS FILMS ET SÉRIES AFRO EN ILLIMITÉ',
      shareImage: 'https://afrostream.imgix.net/production/poster/2016/03/b8a6db25a04982c88a2b-438302.jpg',
      metas: [
        {
          property: 'fb:app_id',
          content: '828887693868980'
        },
        {
          name: 'twitter:card',
          content: 'summary'
        },
        {
          name: 'twitter:creator',
          content: '@afrostream'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          property: 'og:site_name',
          content: 'Afrostream'
        },
        {
          property: 'og:image:height',
          content: '630'
        },
        {
          property: 'og:image:width',
          content: '1120'
        },
        {
          name: 'keywords',
          content: 'netflix, afro, cinema, black, series, shows, empire, cookie, webseries, musique, afrostream, viola davis, taraji p henson, blackxploitation, film, nollywood, ghana, france'
        }]
    },
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
      urlPrefix: process.env.API_END_POINT || 'http://localhost:3002'
    },

    /**
     * WebpackDevServer
     */
    webpackDevServer: {
      host: '192.168.1.90',
      port: 8081
    },

    /**
     * browserSync
     */
    browserSyncServer: {
      host: '192.168.1.90',
      port: 8082
    }
  }, client);

export default config;
