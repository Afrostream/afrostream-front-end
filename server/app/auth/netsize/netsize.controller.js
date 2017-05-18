export async function callback (req, res) {
  const layout = 'layouts/oauth-netsize-success'

  res.noCache()
  res.status(res.statusCode).render(layout, {})
}
