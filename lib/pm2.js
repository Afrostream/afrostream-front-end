import pm2 from 'pm2';
import cpm2_conf from '../pm2_config.json';
import _ from 'lodash';
import child_process from 'child_process';
const env = process.env.NODE_ENV || 'development';
if (~'development,staging'.indexOf(env)) {
  //En staging on utilise pas pm2 car sa surchage les stats
  child_process.exec('npm run express', function (error, stdout, stderr) {
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}
else {
  const MACHINE_NAME = process.env.WEB_MACHINE_NAME || 'hk1';
  const PRIVATE_KEY = process.env.KEY_METRICS_PRIVATE_KEY || 'wm1olb4gsq7x4cg';   // Keymetrics Private key
  const PUBLIC_KEY = process.env.KEY_METRICS_PUBLIC_KEY || '0twyoz0qubrrhoe';   // Keymetrics Public  key

  const instances = process.env.WEB_CONCURRENCY || -1; // Set by Heroku or -1 to scale to max cpu core -1
  const maxMemory = process.env.WEB_MEMORY || 512;

  const app_conf = _.merge(cpm2_conf, {
    instances: instances,
    max_memory_restart: maxMemory + 'M',   // Auto restart if process taking more than XXmo
    post_update: ['npm install']       // Commands to execute once we do a pull from Keymetrics
  });

  pm2.connect(function () {
    pm2.start(app_conf, function (err) {
      if (err) return console.error('Error while launching applications', err.stack || err);
      console.log('PM2 and application has been succesfully started');
      pm2.interact(PRIVATE_KEY, PUBLIC_KEY, MACHINE_NAME, function () {
      });
    });
  });
}
