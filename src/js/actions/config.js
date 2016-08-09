import ActionTypes from '../consts/ActionTypes'

export function getConfig (path) {
  return (dispatch, getState) => {

    return async api => {
      try {
        const configApi = await api({path: `/api/configs/${path}`})
        return async api => ({
          type: ActionTypes.Config.getConfig,
          path,
          res: configApi
        })

      } catch (e) {
        console.log(e, `error loading ${path} api config`)
        return {
          type: ActionTypes.Config.getConfig,
          path,
          res: {body: {}}
        }
      }
    }
  }
}
