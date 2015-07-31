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
    urlPrefix: process.env.API_CLIENT_END_POINT || process.env.API_END_POINT || '//api.afrostream.tv'
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
      connections: ['Username-Password-Authentication', 'facebook'],
      socialBigButtons: true,
      disableSignupAction: false,
      loginAfterSignup: true,
      rememberLastLogin: true,
      integratedWindowsLogin: true,
      defaultADUsernameFromEmailPrefix: true,
      responseType: 'token',
      popup: true,
      authParams: {
        scope: 'openid offline_access'
      }
    }
  }
};
