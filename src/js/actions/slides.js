import ActionTypes from '../consts/ActionTypes';

export function toggleNext(total) {
  return (dispatch, getState) => {
    const current = getState().Slides.get('page');
    let next = current + 1;
    if (next > total - 1) {
      next = 0;
    }
    return {
      type: ActionTypes.Slides.toggleNext,
      page: next
    };
  };
}

export function togglePrev(total) {
  return (dispatch, getState) => {
    const current = getState().Slides.get('page');
    let prev = current - 1;
    if (prev < 0) {
      prev = total;
    }
    return {
      type: ActionTypes.Slides.togglePrev,
      page: prev
    };
  };
}

export function toggleSlide(index) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Slides.toggleSlide,
      page: index
    };
  };
}
