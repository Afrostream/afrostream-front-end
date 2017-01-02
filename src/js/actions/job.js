import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchAll () {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Job.fetchAll,
      res: await api({path: `/api/works`})
    })
  }
}

export function fetchJob (jobId) {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Job.fetchJob,
      jobId,
      res: await api({path: `/api/works/${jobId}`}).catch(notFoundPost)
    })
  }
}
