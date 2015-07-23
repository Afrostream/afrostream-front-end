import ActionTypes from '../consts/ActionTypes';

export function toggleSlide(index) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Season.toggleSeason,
      season: index
    };
  };
}
