'use strict';

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
      dict: 'fr',
      connections: ['Username-Password-Authentication', 'facebook'],
      socialBigButtons: true,
      disableSignupAction: true,
      rememberLastLogin: false,
      disableResetAction: false,
      authParams: {
        scope: 'openid offline_access'
      }
    },
    signUp: {
      dict: 'fr',
      connections: ['Username-Password-Authentication', 'facebook'],
      socialBigButtons: true,
      authParams: {
        scope: 'openid offline_access'
      }
    }
  }
};
