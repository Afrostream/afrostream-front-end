import express from 'express'
import RenderStatic from '../../render'

const router = express.Router()

router.get('/*', function (req, res) {
  res.cache()
  // Render
  const layout = 'layouts/component-static'
  const payload = {
    initialState: {},
    componentHtml: ''
  }
  const isStatic = true

  RenderStatic(req, res, layout, {
    payload,
    isStatic
  })
})

module.exports = router
