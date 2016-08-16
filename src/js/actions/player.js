import ActionTypes from '../consts/ActionTypes'

export function getConfig () {
  return (dispatch, getState) => {

    return async api => {
      try {
        const playerConfigApi = await api({path: `/api/player/config`})
        return async api => ({
          type: ActionTypes.Player.getConfig,
          res: playerConfigApi,
          passToken: true
        })

      } catch (e) {
        console.log(e, 'error loading player api config')
        return {
          type: ActionTypes.Player.getConfig,
          res: {body: {}}
        }
      }
    }
  }
}
