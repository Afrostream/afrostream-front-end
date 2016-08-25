import _ from 'lodash'
import client from './client'

const config = _.merge(
  {
    metadata: {
      domain: 'https://afrostream.tv',
      title: 'AFROSTREAM | Les meilleurs films et séries afro en illimité',
      description: 'Profitez d\'une sélection des meilleurs films & séries afro à regarder en illimité sur tous vos écrans grâce à Afrostream, la première semaine est offerte.',
      shareImage: 'https://afrostream.imgix.net/production/poster/2016/03/b8a6db25a04982c88a2b-438302.jpg',
      metas: [
        {
          property: 'fb:app_id',
          content: client.facebook.appId
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
    domain: {
      host: 'afrostream.tv'
    },
    /**
     * Front-End Server
     */
    server: {
      host: 'localhost',
      ip: process.env.IP || undefined,
      port: process.env.PORT ||
      process.env.USER === 'marc' && 80 || // (to bind 80: sudo setcap cap_net_bind_service=+ep `which node`)
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
  }, client)

export default config
