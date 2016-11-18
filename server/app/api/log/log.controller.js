import { getData } from '../api-front'
const emptyGifBuffer = new Buffer('R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64')
const emptyGifBufferLength = emptyGifBuffer.length
const DEFAULT_MAX_AGE = 86400000
const DEFAULT_HEADERS = {
  'Content-Type': 'image/gif',
  'Content-Length': emptyGifBufferLength,
  'Cache-Control': 'public, max-age=' + (DEFAULT_MAX_AGE / 1000)
}
/**
 * pixel tracking
 */
export function pixel (req, res) {
  getData(req, '/api/logs/pixel', {followRedirect: false})
  res.writeHead(200, DEFAULT_HEADERS)
  res.end(emptyGifBuffer)
}
