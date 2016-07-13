import http from 'http'
import https from 'https'
import pem from 'pem'
import config from '../../config'
import app from './app'
import fastly from 'fastly'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'development' && process.env.USER === 'marc') {
  pem.createCertificate({days: 1, selfSigned: true}, (err, {serviceKey, certificate}) => {
    https.createServer({key: serviceKey, cert: certificate}, app).listen(443)
  });
}

const server = http.createServer(app)
server.listen(config.server.port, () => {
  const {address: host, port} = server.address()
  console.log(`Front-End server is running at ${host}:${port}`) // eslint-disable-line no-console
  //on production we decache all fasly routes
  if (process.env.NODE_ENV === 'production') {
    let fastLySdk = fastly(config.fastly.key)
    fastLySdk.purgeAll(config.fastly.serviceId, (err, obj) => {
      if (err) return console.dir(err)   // Oh no!
      console.dir(obj)                   // Response body from the fastly API
    })
  }
})
