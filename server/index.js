import cluster from 'express-cluster'
import memwatch from 'memwatch'

let clusterConf = {count: process.env.WEB_CONCURRENCY || 1, verbose: true}

cluster(function (worker) {
  console.log('worker ' + worker.id + ' is up')
  let hd;
  memwatch.setup();

  memwatch.on('leak', (info)=> {
    console.error('Memory leak detected: ', info)
    if (!hd) {
      hd = new memwatch.HeapDiff()
    } else {
      let diff = hd.end()
      console.error(util.inspect(diff, true, null))
      hd = null
    }
  });
  return require('./app')
}, clusterConf)
