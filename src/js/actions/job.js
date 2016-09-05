import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchAll () {
  return (dispatch, getState) => {
    let readyJobs = getState().Job.get(`jobs`)
    if (readyJobs) {
      console.log('jobs posts already present in data store')
      return {
        type: ActionTypes.Job.fetchAll,
        res: {
          body: readyJobs.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Job.fetchAll,
      res: await api({path: `/api/works`})
    })
  }
}

export function fetchJob (jobId) {
  return (dispatch, getState) => {
    let readyJob = getState().Job.get(`/jobs/${jobId}`)
    if (readyJob) {
      console.log('job post already present in data store')
      return {
        type: ActionTypes.Job.fetchJob,
        jobId,
        res: {
          body: readyJob.toJS()
        }
      }
    }
    console.log('fetchJob ', jobId)
    return async api => ({
      type: ActionTypes.Job.fetchJob,
      jobId,
      res: await api({path: `/api/works/${jobId}`}).catch(notFoundPost)
    })
  }
}
