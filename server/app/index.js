import http from 'http'
import https from 'https'
import pem from 'pem'
import config from '../../config'
import app from './app'
//import { merge } from 'lodash'
//import herokuConfig from '../../app.json'
//// chargement de la conf de staging (lorsque l'on est en local)
//if (process.env.LOAD_STAGING) {
//  delete herokuConfig.env.NODE_ENV
//  process.env = merge(process.env, herokuConfig.env)
//  console.log('load staging : ', process.env.API_CLIENT_AUTHORITY)
//}
//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

if (process.env.NODE_ENV === 'development' && process.env.USER === 'marc') {
  pem.createCertificate({days: 1, selfSigned: true}, (err, {serviceKey, certificate}) => {
    https.createServer({key: serviceKey, cert: certificate}, app).listen(443)
  })
}

const server = http.createServer(app)
server.listen(config.server.port, () => {
  const {address: host, port} = server.address()
  console.log(`Front-End server is running at ${host}:${port}`) // eslint-disable-line no-console
})
