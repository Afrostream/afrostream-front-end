const setup = app => {
  handlebars.registerHelper('json-stringify', ::JSON.stringify)
  handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context)
  })
  handlebars.registerHelper('config', function (context) {
    return _.get(config, context)
  })
  handlebars.registerHelper('_', function () {
    var options = [].pop.call(arguments)
    var func = [].shift.call(arguments)
    return _[func].apply(_, arguments)
  })
  handlebars.registerHelper('inlineScript', function (p) {
    if (Boolean(~'production|staging'.indexOf(process.env.NODE_ENV))) {
      return `<script>${p}</script>`
    }
    return `<script src="${p}"></script>`
  })

  app.engine('hbs', expressHandlebars({
    extname: '.hbs',
    partialsDir: [
      'views/partials/'
    ]
  }))
  app.set('view engine', 'hbs')
}

export default setup
