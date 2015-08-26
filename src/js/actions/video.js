import ActionTypes from '../consts/ActionTypes';

export function getVideo(videoId) {
  return async api => ({
    type: ActionTypes.Video.getVideo,
    videoId,
    res: await api(`/videos/${videoId}`)
  });
}
