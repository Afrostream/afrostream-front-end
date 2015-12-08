import ActionTypes from '../consts/ActionTypes';

export function getConfig() {
  return (dispatch, getState) => {
    let readyConfig = getState().Player.get(`/player/config`);
    if (readyConfig) {
      console.log('config already present in data store');
      return {
        type: ActionTypes.Player.getConfig,
        res: {body: readyConfig}
      };
    }

    return async api => ({
      type: ActionTypes.Player.getConfig,
      res: await api(`/player/config`)
    });
  };
}
