import cluster from 'express-cluster'
import heapdump from 'heapdump'

let clusterConf = {count: process.env.WEB_CONCURRENCY || 1, verbose: true}

cluster(function (worker) {
  console.log('worker ' + worker.id + ' is up')
  heapdump.writeSnapshot((err, filename) => {
    console.log('dump written to', filename)
  })
  return require('./app')
}, clusterConf)
