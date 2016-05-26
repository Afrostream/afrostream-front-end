import ActionTypes from '../consts/ActionTypes'

export function fetchMovies (value) {
  return (dispatch, getState, actionDispatcher) => {

    actionDispatcher({
      type: ActionTypes.Search.fetching
    })

    return async api => ({
      type: ActionTypes.Search.fetchMovies,
      res: await api(`/api/movies/search/`, 'POST', {query: value})
    })
  }
}
