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
  }
};
