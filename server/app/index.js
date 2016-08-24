import http from 'http'
import https from 'https'
import pem from 'pem'
import config from '../../config'
import app from './app'

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
