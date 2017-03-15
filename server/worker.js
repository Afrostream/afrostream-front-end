// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// global
global.__basedir = __dirname;
global.rootRequire = name => require(global.__basedir + '../' + (name[0] === '/' ? name.substr(1) : name));

process.on('uncaughtException', err => {
  console.error('[ERROR]: uncaught error: ' + err.message  + ' stack = ', err.stack);
});

require('./app/index.js');
