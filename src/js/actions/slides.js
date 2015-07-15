import ActionTypes from '../consts/ActionTypes';

export function getTopByCategory(category) {
  /**
   * Asynchronous call API and return an action payload which will be
   * pass to reducer method as 2nd parameter.
   * @return {object}
   * type: action type
   * category: category
   * res: response from api
   *
   * See more at: ../reducers/Slides.js
   */

  return async api => ({
    type: ActionTypes.Slides.getTopByCategory,
    category,
    page: 0,
    res: await api(`/category/${category}/top`, {
      sort: 'updated',
      direction: 'desc'
    })
  });
}

export function toggleNext() {
  return (dispatch, getState) => {
    const current = getState().Slides.get(`page`);
    const total = getState().Slides.get(`total`);
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
    const current = getState().Slides.get(`page`);
    const total = getState().Slides.get(`total`);
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
    //const category = getState().Slides.get(`current`);
    //const data = getState().Slides.get(`category/${category}`);
    //const mapIndex = data.map(function (slide) {
    //  return (
    //    slide.id
    //  );
    //});
    //
    //const current = index.toString().indexOf('mapIndex');
    return {
      type: ActionTypes.Slides.toggleSlide,
      page: index
    };
  };
}
