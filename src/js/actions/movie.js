import ActionTypes from '../consts/ActionTypes'
import { notFound, notFoundArray } from './notFoundAction'

export function getMovie (movieId) {
  return (dispatch, getState, actionDispatcher) => {
    if (!movieId) {
      console.log('no movie id passed in action', movieId)
      return {
        type: ActionTypes.Movie.getMovie,
        movieId
      }
    }

    return async api => ({
      type: ActionTypes.Movie.getMovie,
      movieId,
      res: await api({path: `/api/movies/${movieId}`}).catch(notFound)
    })
  }
}

export function getLast () {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Movie.getLast,
      res: await api({path: `/api/movies?order=_id&sort=DESC&limit=20`}).catch(notFound)
    })
  }
}

export function getSeason (movieId) {
  return (dispatch, getState, actionDispatcher) => {
    if (!movieId) {
      console.log('no movie id passed in action', movieId)
      return {
        type: ActionTypes.Movie.getSeason,
        movieId
      }
    }

    actionDispatcher({
      type: ActionTypes.Movie.getSeason,
      movieId
    })

    return async api => ({
      type: ActionTypes.Movie.getSeason,
      movieId,
      res: await api({path: `/api/movies/${movieId}/seasons`}).catch(notFoundArray)
    })
  }
}
