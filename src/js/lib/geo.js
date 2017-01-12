import config from '../../../config'
import { storeGeo } from '../lib/storage'
import Q from 'q'
import request from 'superagent'
const {apiClient: {protocol, authority}} = config

export async function getGeo ({query = {}}) {
  const url = protocol + '://' + authority + '/auth/geo'
  return Q(request
    .get(url)
    .query({query})
    .type('json')
    .then((response) => {
      return response.body
    }))
}

export async function isAuthorized () {
  return await new Promise((resolve, reject) => {
    getGeo()
      .then((geo) => {
        if (geo &&
          geo.authorized === false) {
          storeGeo(geo)
          return resolve(false)
        }
        return resolve(true)
      })
      .catch((err) => {
        return reject(err)
      })
  })
}

export async function getCountry () {
  return await new Promise((resolve, reject) => {
    getGeo()
      .then((geo) => {
        if (geo && geo.countryCode) {
          storeGeo(geo)
          return resolve(geo.countryCode)
        }
        return resolve('FR')
      })
      .catch((err) => {
        return reject(err)
      })
  })
}
