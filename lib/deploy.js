'use strict';
import config from '../config';
import child_process from 'child_process';
const env = process.env.NODE_ENV || 'development';
// Since postinstall will also run when you run npm install
// locally we make sure it only runs in production
if (~'production,staging'.indexOf(env)) {
  // We basically just create a child process that will run
  // the production bundle command
  child_process.exec('./node_modules/.bin/babel-node ./node_modules/webpack/bin/webpack.js --verbose --colors --display-error-details --config webpack/prod.config.js', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
    child_process.exec('./node_modules/.bin/sitemap-generator --path=../static ', function (error, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

  });
}
