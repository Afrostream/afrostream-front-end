import Q from 'q'
import _ from 'lodash'
import config from '../../../config'
import anr from 'afrostream-node-request'
const {apiServer} = config
const request = anr.create({baseUrl:apiServer.urlPrefix});

/**
 * call request on external api
 * @param req
 * @param path
 */
export async function getExternal (req, requestOptions) {
  return await request(
    _.merge({
        method: 'POST'
      },
      requestOptions || {}
    )
  )
}

/**
 * @param req
 * @param path
 */
export function getData (req, path, requestOptions) {
  return request(
    _.merge(
      {
        qs: req.query || {},
        body: req.body,
        uri: path,
        context: { req: req }
      },
      requestOptions || {}
    )
  )
}

/**
 * call the front-api & return the json body
 * @param req             express request object
 * @param path            front-api path
 * @param requestOptions  request options
 * @return promise<json>
 */
export async function getBodyWithoutAuth (...args) {
  const [, body] = await getData.apply(null, args)
  return body
}

export function proxy (req, res, queryOptions) {
   request(
    _.merge(
      {
        method: req.method,
        context: { req: req },
        qs: req.query,
        body: req.body,
        uri: req.originalUrl,
        followRedirect: false,
        filter: null
      },
      queryOptions
    )
  ).nodeify(fwd(res))
}

/*
 * forward backend result to the frontend.
 *
 * ex: backend.getData(req, '/api/categorys/4242').nodeify(backend.fwd(res))
 */
export function fwd (res) {
  return function (err, data) {
    if (err) {
      res.status(500).json({error: err.message || 'unknown error' })
    } else {
      var backendResponse = data[0]
        , backendBody = data[1]

      // fwd des headers du backend vers le front
      Object.keys(backendResponse && backendResponse.headers || {}).forEach(function (k) {      // fwd des headers du backend vers le front
        res.set(k, backendResponse.headers[k])
      })

      res.status(backendResponse.statusCode || 500).send(backendBody)
    }
  }
}
