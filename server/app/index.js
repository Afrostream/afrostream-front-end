import config from '../../config'
import app from './app'
import fastly from 'fastly'
// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(config.server.port, () => {
  const {address: host, port} = server.address()
  console.log(`Front-End server is running at ${host}:${port}`) // eslint-disable-line no-console
  //on production we decache all fasly routes
  if (process.env.NODE_ENV === 'production') {
    let fastLySdk = fastly(config.fastly.key)
    fastLySdk.purgeAll(config.fastly.serviceId, function (err, obj) {
      if (err) return console.dir(err)   // Oh no!
      console.dir(obj)                   // Response body from the fastly API
    })
  }
})
