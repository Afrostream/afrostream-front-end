import cluster from 'express-cluster'
let clusterConf = {count: process.env.WEB_CONCURRENCY || 1, verbose: true}

cluster(function (worker) {
  console.log('worker ' + worker.id + ' is up')
  return require('./app')
}, clusterConf)
