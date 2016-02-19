import ActionTypes from '../consts/ActionTypes';
import { pushState } from 'redux-router';
import * as RecoActionCreators from './reco';

export function getVideo(videoId) {
  return (dispatch, getState, actionDispatcher) => {

    console.log('player : getVideo', videoId);
    if (!videoId) {
      console.log('no video id passed in action', videoId);
      return {
        type: ActionTypes.Video.getVideo,
        videoId
      };
    }

    //let readyVideo = getState().Video.get(`videos/${videoId}`);
    //if (readyVideo) {
    //  console.log('video already present in data store', videoId);
    //  return {
    //    type: ActionTypes.Video.getVideo,
    //    videoId,
    //    res: {
    //      body: readyVideo.toJS()
    //    }
    //  };
    //}

    return async api => {
      let videoUserData = await actionDispatcher(RecoActionCreators.getVideoTracking(videoId));
      let videoData = await api(`/api/videos/${videoId}`);
      return async api => ({
        type: ActionTypes.Video.getVideo,
        videoId,
        res: videoData
      });
    }
  };
}
