import _ from 'lodash'
import { getToken, storeToken } from '../../../../src/js/lib/storage'
import config from '../../../../config'
import request from 'superagent'
const {apiClient: {protocol, authority}} = config

exports.index = async function (req, res) {
  const layout = 'layouts/user'
  const url = protocol + '://' + authority + '/api/users/me'
  let initialState = {}

  res.noCache()
  res.header('Content-type', `text/javascript`)

  const tokenData = getToken()

  if (!tokenData || !tokenData.access_token) {
    return res.render(layout, {initialState})
  }

  const query = {
    access_token: tokenData.access_token
  }

  request
    .get(url)
    .query(query)
    .type('json')
    .end((err, response) => {
      if (err) {
        return res.render(layout, {initialState})
      }
      const user = response && response.body
      if (user) {
        res.render(layout, {
          initialState: _.merge(initialState, {
            User: {
              user
            }
          })
        })
      }
      console.log('Get User error', err)
      return res.render(layout, {initialState})
    })
}
