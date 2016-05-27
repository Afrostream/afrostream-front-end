import Promise from 'bluebird'
import _ from 'lodash'
import qs from 'qs'
import xhr from 'xhr'
import config from '../../../config'

const {bitly} =config

export async function shorten (optional) {

  let options = _.merge({
    access_token: bitly.accessToken,
    format: 'json',
    domain: bitly.domain
  }, optional)

  return await new Promise((resolve, reject) => {
    xhr({
      uri: `${bitly.bitUrl.shorten}/?${qs.stringify(options)}`
    }, function (err, resp, body) {
      if (err) {
        return reject(xhr)
      }
      return resolve(JSON.parse(body))
    })
  })
}
