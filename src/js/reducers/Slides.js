import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({});

export default createReducer(initialState, {
  /**
   * Because github use header for pagination, so we should receive res from
   * api call and store res to store's state also.
   *
   * See action at ../actions/slides.js
   */

    [ActionTypes.Slides.getTopByCategory](state, { category, page, res }) {
    const slides = res.body;
    return state.merge({
      [`total`]: slides.length - 1,
      [`page`]: page,
      [`current`]: category,
      [`category/${category}__res`]: res,
      [`category/${category}`]: slides
    });
  },

  [ActionTypes.Slides.toggleNext](state, { page }) {
    return state.merge({
      [`page`]: page
    });
  },

  [ActionTypes.Slides.togglePrev](state, { page }) {
    return state.merge({
      [`page`]: page
    });
  }
});
