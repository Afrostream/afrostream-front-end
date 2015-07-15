import ActionTypes from '../consts/ActionTypes';

export function toggleNext() {
  return (dispatch, getState) => {
    const current = getState().Movies.get(`page`);
    const total = getState().Movies.get(`total`);
    let next = current + 1;
    if (next > total) {
      next = 0;
    }
    return {
      type: ActionTypes.Movies.toggleNext,
      page: next
    };
  };
}

export function togglePrev() {
  return (dispatch, getState) => {
    const current = getState().Movies.get(`page`);
    const total = getState().Movies.get(`total`);
    let prev = current - 1;
    if (prev < 0) {
      prev = total;
    }
    return {
      type: ActionTypes.Movies.togglePrev,
      page: prev
    };
  };
}