import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchAll () {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Press.fetchAll,
      res: await api({path: `/api/press`})
    })
  }
}
