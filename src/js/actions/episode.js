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
    let readyEpisode = getState().Episode.get(`/episodes/${episodeId}`)
    if (readyEpisode) {
      console.log('episode already present in data store', episodeId)
      return {
        type: ActionTypes.Episode.getEpisode,
        episodeId: episodeId,
        res: {
          body: readyEpisode.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Episode.getEpisode,
      episodeId,
      res: await api(`/api/episodes/${episodeId}`)
    })
  }
}
