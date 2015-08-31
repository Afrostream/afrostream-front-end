'use strict';
import dictFr from '../node_modules/auth0-lock/i18n/fr-FR.json';
import _ from 'lodash';
const customDict = _.merge(dictFr, {
  signin: {
    "title": "S’identifier",
    "action": "Se connecter"
  }
});

export default {
  /**
   * Front-End Server
   */
  apiClient: {
    urlPrefix: process.env.API_CLIENT_END_POINT || process.env.API_END_POINT || 'http://localhost:3002/api',
    token: 'afro_token'
  },
  carousel: {
    interval: 10000
  },
  auth0: {
    clientId: process.env.AUTH0_CLIENT_ID || 'BtSdIqKqfIse0H1dqlpHFJgKIkUG0NpE',
    domain: process.env.AUTH0_DOMAIN || 'afrostream.eu.auth0.com',
    callbackUrl: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
    token: 'afroToken',
    tokenRefresh: 'afroRefreshToken',
    signIn: {
      dict: customDict,
      icon: '',
      theme: 'default',
      signupLink: '/signup',
      resetLink: '/reset-password',
      connections: ['afrostream-front', 'facebook'],
      socialBigButtons: true,
      disableSignupAction: true,
      rememberLastLogin: false,
      disableResetAction: false,
      popup: true,
      sso: false,
      authParams: {
        scope: 'openid offline_access'
      }
    },
    signUp: {
      dict: 'fr',
      connections: ['afrostream-front', 'facebook'],
      socialBigButtons: true,
      popup: true,
      sso: false,
      authParams: {
        scope: 'openid offline_access'
      }
    }
  },
  recurly: {
    key: 'sjc-ZhO4HmKNWszC5LIA8BcsMJ'
  },
  algolia: {
    appId: process.env.ALGOLIA_APP_ID || '3OKNPL7ZVA',
    apiKey: process.env.ALGOLIA_API_KEY || '3e6547172fb6d80b2ae02d6369edfc72'
  },
  player: {
    "autoplay": true,
    "controls": true,
    "width": "100%",
    "height": "100%",
    "sr_options": {
      "ID_CLIENT": process.env.STREAMROOT_CLIENT_ID || 'ry-0gzuhlor',
      "TRACKER_URL": process.env.STREAMROOT_TRACKER_URL || ''
    },
    "techOrder": ["hls", "dash", "streamroot", "srflash", "html5", "flash"]
  }
};
