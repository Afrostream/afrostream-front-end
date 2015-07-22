import ActionTypes from '../consts/ActionTypes';

export function toggleNext() {
  return (dispatch, getState) => {
    const current = getState().Slides.get('page');
    const total = getState().Category.get('total');
    let next = current + 1;
    if (next > total) {
      next = 0;
    }
    return {
      type: ActionTypes.Slides.toggleNext,
      page: next
    };
  };
}

export function togglePrev() {
  return (dispatch, getState) => {
    const current = getState().Slides.get('page');
    const total = getState().Category.get('total');
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
