import ActionTypes from '../consts/ActionTypes'


export function fetchAll (value) {
  return (dispatch, getState, actionDispatcher) => {

    actionDispatcher({
      type: ActionTypes.Search.fetching
    })

    return async api => ({
      type: ActionTypes.Search.fetchAll,
      res: await api({
        path: `/api/search/`,
        method: 'POST',
        params: {query: value},
        passToken: true
      })
    })
  }
}

export function fetchMovies (value) {
  return (dispatch, getState, actionDispatcher) => {

    actionDispatcher({
      type: ActionTypes.Search.fetching
    })

    return async api => ({
      type: ActionTypes.Search.fetchMovies,
      res: await api({
        path: `/api/movies/search/`,
        method: 'POST',
        params: {query: value},
        passToken: true
      })
    })
  }
}
