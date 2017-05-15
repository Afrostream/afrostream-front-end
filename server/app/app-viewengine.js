import _ from 'lodash'

import handlebars from 'handlebars'
import expressHandlebars from 'express-handlebars'

import config from '../../config'

export const setup = app => {
  handlebars.registerHelper('json-stringify', ::JSON.stringify)
  handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context)
  })
  handlebars.registerHelper('config', function (context) {
    return _.get(config, context)
  })
  handlebars.registerHelper('_', function () {
    [].pop.call(arguments)
    var func = [].shift.call(arguments)
    return _[func].apply(_, arguments)
  })
  handlebars.registerHelper('inlineScript', function (p) {
    return `<script>${p}</script>`
  })

  app.engine('hbs', expressHandlebars({
    extname: '.hbs',
    partialsDir: [
      'views/partials/'
    ]
  }))
  app.set('view engine', 'hbs')
}
