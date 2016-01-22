import ActionTypes from '../consts/ActionTypes';

export function fetchMovies(value) {
  return (dispatch, getState) => {
    const token = getState().OAuth.get('token');
    const refreshToken = getState().OAuth.get('refreshToken');
    return async api => ({
      type: ActionTypes.Search.fetchMovies,
      res: await api(`/api/movies/search/`, 'POST', {query: value}, token, refreshToken)
    });
  };
}
