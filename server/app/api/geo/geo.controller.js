import { getToken, storeToken } from '../../../../src/js/lib/storage'
import { getCountry } from '../../../../src/js/lib/geo'

exports.index = async function (req, res) {
  res.noCache()
  res.header('Content-type', `text/javascript`)
  getCountry().then((country) => {
    res.status(200).json({
      country
    })
  }).catch((err) => {
    console.log('Get Geo error', err)
    res.status(500)
  })
}
