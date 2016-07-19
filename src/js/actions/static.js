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
    let readyStatic = getState().Static.get(route)
    if (readyStatic) {
      console.log(`static ${route} already present in data store`)
      return {
        type: ActionTypes.Static.getComponentRoute,
        route,
        res: {
          body: readyStatic.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Static.getComponentRoute,
      route,
      res: await api({local: true, path: route}).catch(notFound)
    })
  }
}
