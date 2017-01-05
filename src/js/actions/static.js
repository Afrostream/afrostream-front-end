import ActionTypes from '../consts/ActionTypes'
import { notFound } from './notFoundAction'

export function getStatic (path) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Static.getStatic,
      path,
      res: await api({path: `/api/${path}`}).catch(notFound)
    })
  }
}

export function getComponentRoute (route) {
  return (dispatch, getState) => {
    console.log(`static ${route} getComponentRoute`)
    return async api => ({
      type: ActionTypes.Static.getComponentRoute,
      route,
      res: await api({local: true, path: route, params: {format: 'json'}}).catch(notFound)
    })
  }
}
