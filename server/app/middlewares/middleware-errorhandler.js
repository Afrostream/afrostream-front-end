export default function (options) {
  return function errorHandler(err, req, res, next) {
    res.status(500)
    res.render('layouts/error', {error: err})
  }
}
