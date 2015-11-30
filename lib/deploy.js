'use strict';
import config  from '../config';
import fastly from 'fastly';
import child_process from 'child_process';
const env = process.env.NODE_ENV || 'development';
// Since postinstall will also run when you run npm install
// locally we make sure it only runs in production
if (~'production,staging'.indexOf(env)) {
  let fastLySdk = fastly(config.fastly.key);
  // We basically just create a child process that will run
  // the production bundle command
  child_process.exec('./node_modules/.bin/babel-node ./node_modules/webpack/bin/webpack.js --verbose --colors --display-error-details --config webpack/prod.config.js', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    //on production we decache all fasly routes
    if (env === 'production') {
      fastLySdk.purgeAll(config.fastly.serviceId, function (err, obj) {
        if (err) return console.dir(err);   // Oh no!
        console.dir(obj);                   // Response body from the fastly API
      });
    }
  });
}
