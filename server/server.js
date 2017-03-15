const cluster = require('express-cluster');

const clusterConf = { count: process.env.WEB_CONCURRENCY || 1, verbose: true};

cluster(worker => {
  console.log('worker '+worker.id+' is up');
  return require('./worker.js');
}, clusterConf);
