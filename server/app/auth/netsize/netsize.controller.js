import { getData, fwd } from '../../api/api-front'

export function check (req, res) {
  res.noCache()
  getData(req, '/auth/netsize/check', {followRedirect: false}).nodeify(fwd(res))
}

export function subscribe (req, res) {
  res.noCache()
  getData(req, '/auth/netsize/subscribe', {followRedirect: false}).nodeify(fwd(res))
}

export function unsubscribe (req, res) {
  res.noCache()
  getData(req, '/auth/netsize/unsubscribe', {followRedirect: false}).nodeify(fwd(res))
}

export function callback (req, res) {
  res.noCache()
  getData(req, '/auth/netsize/callback', {followRedirect: false}).nodeify(fwd(res))
}
