import ActionTypes from '../consts/ActionTypes';
import { pushState } from 'redux-router';

export function getVideo(videoId) {
  return (dispatch, getState, actionDispatcher) => {

    if (!videoId) {
      console.log('no video id passed in action', videoId);
      return {
        type: ActionTypes.Video.getVideo,
        videoId
      };
    }

    let readyVideo = getState().Video.get(`videos/${videoId}`);
    if (readyVideo) {
      console.log('video already present in data store', videoId);
      return {
        type: ActionTypes.Video.getVideo,
        videoId,
        res: {
          body: readyVideo.toJS()
        }
      };
    }

    return async api => ({
      type: ActionTypes.Video.getVideo,
      videoId,
      res: await api(`/videos/${videoId}`)
    });
  };
}
