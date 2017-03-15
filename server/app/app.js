const express = require('express');

const config = rootRequire('config');
const routes = require('./routes.js');

const AfrostreamNodeApp = require('afrostream-node-app');

const app = AfrostreamNodeApp.create();

// exporting app asap.
module.exports = app;

// middlewares
const afrostreamMiddlewareError = require('afrostream-node-middleware-error');
const cookieParser = require('cookie-parser');
const userIp = require('afrostream-node-middleware-userip');
const favicon = require('serve-favicon');
const { forceSSL, forceWWW } = require('./middlewares/middleware-redirect');

// configuration of template engine
require('./template-engine.js');

// middlewares
app.use(forceSSL());
app.use(forceWWW());
app.use(cookieParser());
app.use(userIp());

// static routes
app.use(express.static('./static'));
app.use('/static', function (req, res, next) {
  res.isStatic();
  next();
}, express.static(path.resolve(process.cwd(), 'dist')));

// favico
app.use(favicon(path.join(staticPath, 'favicon.ico')))

// dynamic routes
require('./routes.js');
