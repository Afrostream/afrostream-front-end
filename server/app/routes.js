const app = require('./app.js');

let reactRenderer;

if (process.env.NODE_ENV === 'development') {
  reactRenderer = require('../reactRenderer');
} else {
  reactRenderer = rootRequire('dist/reactRenderer');
}

app.get('/*', reactRenderer('layouts/main', {}));
