import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchAll () {
  return (dispatch, getState) => {
    let readyPress = getState().Press.get(`press`)
    if (readyPress) {
      console.log('jobs posts already present in data store')
      return {
        type: ActionTypes.Press.readyPress,
        res: {
          body: readyPress.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Press.fetchAll,
      res: await api({path: `/api/press`})
    })
  }
}
