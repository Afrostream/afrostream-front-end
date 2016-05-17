import ActionTypes from '../consts/ActionTypes';

export function getConfig() {
  return (dispatch, getState) => {

    return async api => {
      try {
        const playerConfigApi = await api(`/api/player/config`);
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
