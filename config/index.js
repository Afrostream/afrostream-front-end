'use strict';
import _ from 'lodash';
import client from './client';

const config = _.merge(
  {
    metadata: {
      title: 'Afrostream.tv',
      domain: 'https://afrostream.tv',
      metas: [
        {
          name: 'description',
          content: 'AFROSTREAM, LES MEILLEURS FILMS ET SÉRIES AFRO EN ILLIMITÉ'
        },
        {
          name: 'og:site_name',
          content: 'Afrostream'
        },
        {
          name: 'fb:app_id',
          content: '828887693868980'
        },
        {
          name: 'og:image:height',
          content: '630'
        },
        {
          name: 'og:image:width',
          content: '1120'
        },
        {
          name: 'keywords',
          content: 'netflix, afro, cinema, black, series, shows, empire, cookie, webseries, musique, afrostream, viola davis, taraji p henson, blackxploitation, film, nollywood, ghana, france'
        }],
      shareImage: 'https://afrostream.imgix.net/production/poster/2015/12/ba55e2f3825608f0aabe-affichage_320x240_afrostream_wow-imp2.jpg'
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
