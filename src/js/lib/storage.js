'use strict';
import {apiClient} from '../../../config/client';

export function storeToken(oauthData) {
  const storageId = apiClient.token;
  if (oauthData.accessToken) {
    oauthData.expiresAt = new Date(Date.now() + 1000 * oauthData.expiresIn).toISOString();
    localStorage.setItem(storageId, JSON.stringify(oauthData));
  }
  return oauthData;
};
