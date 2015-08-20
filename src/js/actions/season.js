import ActionTypes from '../consts/ActionTypes';

export function toggleSeason(index) {
  return (dispatch, getState) => {
    return {
      type: ActionTypes.Season.toggleSeason,
      seasonId: index
    };
  };
}

export function getSeason(seasonId) {
  return async api => ({
    type: ActionTypes.Season.getSeason,
    seasonId,
    res: await api(`/seasons/${seasonId}`, {
      sort: 'updated',
      direction: 'asc'
    })
  });
}
