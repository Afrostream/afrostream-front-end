import _ from 'lodash'
import { getToken, storeToken } from '../../../../src/js/lib/storage'
import { getCountry } from '../../../../src/js/lib/geo'

exports.index = async function (req, res) {
  const layout = 'layouts/geo'
  let initialState = {
    country: '--'
  }

  res.noCache()
  res.header('Content-type', `text/javascript`)
  getCountry().then((country) => {
    res.render(layout, {initialState: _.merge(initialState, {country})})
  }).catch((err) => {
    console.log('Get Geo error', err)
    res.render(layout, {initialState})
  })
}
