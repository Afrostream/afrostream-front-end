import cluster from 'express-cluster'
import runApp from './app'

const clusterConf = {count: process.env.WEB_CONCURRENCY || 1, verbose: true}

cluster((worker)=> {
  console.log('worker ' + worker.id + ' is up')
  return runApp()
}, clusterConf)
