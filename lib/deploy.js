'use strict';
// Since postinstall will also run when you run npm install
// locally we make sure it only runs in production
console.log('postinstall', ~'production,staging'.indexOf(process.env.NODE_ENV))
if (~'production,staging'.indexOf(process.env.NODE_ENV)) {

  // We basically just create a child process that will run
  // the production bundle command
  var child_process = require('child_process');
  return child_process.exec('./node_modules/.bin/babel-node ./node_modules/webpack/bin/webpack.js --verbose --colors --display-error-details --config webpack/prod.config.js', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}
