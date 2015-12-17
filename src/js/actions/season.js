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
  return (dispatch, getState) => {
    if (!seasonId) {
      console.log('no season id passed in action', seasonId);
      return {
        type: ActionTypes.Season.getSeason,
        seasonId: seasonId
      };
    }
    let readySeason = getState().Season.get(`/seasons/${seasonId}`);
    if (readySeason) {
      console.log('season already present in data store', seasonId);
      return {
        type: ActionTypes.Season.getSeason,
        seasonId: seasonId
      };
    }
    return async api => ({
      type: ActionTypes.Season.getSeason,
      seasonId,
      res: await api(`/seasons/${seasonId}`)
    });
  };
}
