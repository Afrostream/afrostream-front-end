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
