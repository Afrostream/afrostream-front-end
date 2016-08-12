import ActionTypes from '../consts/ActionTypes'
import * as RecoActionCreators from './reco'
import { notFoundVideo } from './notFoundAction'

export function getVideo (videoId) {
  return (dispatch, getState, actionDispatcher) => {
    console.log('player : getVideo', videoId)
    if (!videoId) {
      console.log('no video id passed in action', videoId)
      return {
        type: ActionTypes.Video.getVideo,
        videoId
      }
    }

    return async api => {
      try {
        await actionDispatcher(RecoActionCreators.getVideoTracking(videoId))
      } catch (err) {
        console.log('impossible de touver les information videos utilisateur', videoId)
      }
      let videoData = await api({path: `/api/videos/${videoId}`, secure: true}).catch(notFoundVideo)
      return async api => ({
        type: ActionTypes.Video.getVideo,
        videoId,
        res: videoData
      })
    }
  }
}
