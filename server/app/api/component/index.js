import express from 'express'
import path from 'path'
import ReactHandler from './component-render'

ReactHandler.PATH_TO_REACT_FILES = path.resolve(__dirname, '../../../../src/js/')

const router = express.Router()

router.get('/footer', function (req, res, next) {
  const ComponentParsed = ReactHandler.getComponent(
    'components/Footer/Footer',
    {},
    true
  )

  console.log(ComponentParsed)
  res.render('index', {
    componentHtml: ComponentParsed.html,
    componentScript: ComponentParsed.script
  })
})

module.exports = router
