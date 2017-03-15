// Export the application
const app = rootRequire('server/app/app.js');
const config = rootRequire('config');

app.listen(config.port, config.ip, function () {
  logger.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

module.exports = app;
