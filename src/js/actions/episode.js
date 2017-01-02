import ActionTypes from '../consts/ActionTypes'

export function getEpisode (episodeId) {
  return (dispatch, getState) => {
    if (!episodeId) {
      console.log('no episode id passed in action', episodeId)
      return {
        type: ActionTypes.Episode.getEpisode,
        episodeId: episodeId
      }
    }
    return async api => ({
      type: ActionTypes.Episode.getEpisode,
      episodeId,
      res: await api({path: `/api/episodes/${episodeId}`})
    })
  }
}
