export default function () {
  return function errorHandler(err, req, res, next) {
    res.status(500)
    res.render('layouts/error', {error: err})
    next // prevent es-lint error.
  }
}
