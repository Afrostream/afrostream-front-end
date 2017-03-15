const app = require('./app');

const handlebars = require('handlebars');
const expressHandlebars = require('express-handlebars');

handlebars.registerHelper('json-stringify', JSON.stringify.bind(JSON))
handlebars.registerHelper('json', JSON.stringify.bind(JSON));
handlebars.registerHelper('config', function (context) {
  return _.get(config, context)
});
handlebars.registerHelper('_', function () {
  var options = [].pop.call(arguments)
  var func = [].shift.call(arguments)
  return _[func].apply(_, arguments)
});
handlebars.registerHelper('inlineScript', function (p) {
  if ('production|staging'.indexOf(process.env.NODE_ENV) !== -1) {
    return `<script>${p}</script>`
  }
  return `<script src="${p}"></script>`
});
app.engine('hbs', expressHandlebars({
  extname: '.hbs',
  partialsDir: [
    'views/partials/'
  ]
}));
app.set('view engine', 'hbs')
