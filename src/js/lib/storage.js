import config from '../../../config/client'
const {apiClient} =config

export function storeToken (oauthData) {
  const storageId = apiClient.token
  if (oauthData.accessToken) {
    oauthData.expiresAt = new Date(Date.now() + 1000 * oauthData.expiresIn).toISOString()
    localStorage.setItem(storageId, JSON.stringify(oauthData))
  }
  return oauthData
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
