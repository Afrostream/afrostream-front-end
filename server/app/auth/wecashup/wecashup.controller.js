import config from '../../../../config'

export async function callback (req, res) {
  res.noCache()
  const layout = 'layouts/final-callback-iframe'

  console.log('body', res.body, req.body)
  res.status(res.statusCode).render(layout, {})
}
