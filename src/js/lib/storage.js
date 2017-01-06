import config from '../../../config'
const {apiClient} =config

export function clearToken (oauthData) {
  const storageId = apiClient.token
  return localStorage.removeItem(storageId)
}

export function storeToken (oauthData) {
  const storageId = apiClient.token
  if (oauthData.access_token) {
    oauthData.expiresAt = new Date(Date.now() + 1000 * (oauthData.expiresIn || oauthData.expires_in)).toISOString()
    localStorage.setItem(storageId, JSON.stringify(oauthData))
  }
  return oauthData
}

export function storeGeo (geoData) {
  const storageId = apiClient.geo
  if (geoData) {
    localStorage.setItem(storageId, JSON.stringify(geoData))
  }
  return geoData
}

export function getToken () {
  const storageId = apiClient.token
  let storedData = localStorage.getItem(storageId)
  let tokenData = null
  if (storedData) {
    try {
      tokenData = JSON.parse(storedData)
    } catch (err) {
      console.log('deserialize oauth data error')
    }
  }
  return tokenData
}
