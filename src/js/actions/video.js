import ActionTypes from '../consts/ActionTypes';
import {canUseDOM} from 'react/lib/ExecutionEnvironment';

export function getVideo(videoId, router) {
  return (dispatch, getState) => {
    const user = getState().User.get('user');
    if (user) {
      let planCode = user.get('planCode');
      if (!planCode) {
        router.transitionTo('/select-plan');
        return {
          type: ActionTypes.Video.getVideo,
          res: {body: null}
        };
      }
    }

    if (!videoId) {
      console.log('no video id passed in action', videoId);
      return {
        type: ActionTypes.Video.getVideo,
        videoId,
        res: {body: null}
      };
    }

    let readyVideo = getState().Video.get(`/videos/${videoId}`);
    if (readyVideo) {
      console.log('video already present in data store', videoId);
      return {
        type: ActionTypes.Video.getVideo,
        videoId,
        res: {body: readyVideo}
      };
    }

    return async api => ({
      type: ActionTypes.Video.getVideo,
      videoId,
      res: await api(`/videos/${videoId}`)
    });
  };
}
