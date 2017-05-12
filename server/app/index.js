import http from 'http'
import config from '../../config'
import app from './app'

global.navigator = global.navigator || {}
global.navigator.userAgent = global.navigator.userAgent || 'all'

const server = http.createServer(app)

/*
// FIXME: enable https in dev env.
import https from 'https'
import pem from 'pem'

if (process.env.NODE_ENV === 'development' && process.env.USER === 'marc') {
  pem.createCertificate({days: 1, selfSigned: true}, (err, {serviceKey, certificate}) => {
    https.createServer({key: serviceKey, cert: certificate}, app).listen(443)
  })
}
*/

server.listen(config.server.port, () => {
  const {address: host, port} = server.address()

  console.log(`Front-End server is running at ${host}:${port}`) // eslint-disable-line no-console
})
