export default function () {
  return function errorHandler(err, req, res) {
    res.status(500)
    res.render('layouts/error', {error: err})
  }
}
