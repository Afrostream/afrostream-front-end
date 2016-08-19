import config from '../../../config'
import request from 'superagent'
const {apiClient: {protocol, authority}} = config

export async function isAuthorized () {
  return await new Promise((resolve, reject) => {
    const url = protocol + '://' + authority + '/auth/geo'

    request
      .get(url)
      .type('json')
      .end((err, response) => {
        if (err) {
          return reject(err)
        }
        if (response && response.body &&
          response.body.authorized === false) {
          return resolve(false)
        }
        // undefined, error, or true => true.
        resolve(true)
      })
  })
}

export async function getCountry () {
  return await new Promise((resolve, reject) => {
    const url = protocol + '://' + authority + '/auth/geo'

    request
      .get(url)
      .type('json')
      .end((err, response) => {
        if (err) {
          return reject(err)
        }
        if (response && response.body &&
          response.body.countryCode) {
          return resolve(response.body.countryCode)
        }
        // undefined, error, or true => true.
        resolve('FR')
      })
  })
}
