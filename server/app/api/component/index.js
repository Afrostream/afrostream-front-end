import express from 'express'
import path from 'path'
import RenderStatic from './component-render'

const router = express.Router()

router.get('/*', function (req, res) {
  // Render
  const layout = 'layouts/component-static'
  const payload = {
    initialState: {},
    componentHtml: ''
  }

  RenderStatic(req, res, layout, {
    payload
  })
})

module.exports = router
