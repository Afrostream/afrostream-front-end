import ActionTypes from '../consts/ActionTypes';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

export function getVideo(videoId, history) {
  return (dispatch, getState) => {

    if (!videoId) {
      console.log('no video id passed in action', videoId);
      return {
        type: ActionTypes.Video.getVideo,
        videoId
      };
    }

    const user = getState().User.get('user');
    if (user && location) {
      let planCode = user.get('planCode');
      if (!planCode) {
        history.pushState(null,'/select-plan');
        return {
          type: ActionTypes.Video.getVideo,
          videoId
        };
      }
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
