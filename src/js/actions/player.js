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

    return async api => {
      try {
        const playerConfigApi = await api(`/player/config`);
        return async api => ({
          type: ActionTypes.Player.getConfig,
          res: playerConfigApi
        });

      } catch (e) {
        console.log(e, 'error loading player api config');
        return {
          type: ActionTypes.Player.getConfig,
          res: {body: {}}
        };
      }
    }
  };
}
