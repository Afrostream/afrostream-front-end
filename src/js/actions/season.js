import ActionTypes from '../consts/ActionTypes';

export function toggleSeason(index) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Season.toggleSeason,
      season: index
    };
  };
}
