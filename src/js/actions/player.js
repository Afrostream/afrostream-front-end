import ActionTypes from '../consts/ActionTypes';

export function getConfig(videoId) {
  return async api => ({
    type: ActionTypes.Player.getVideo,
    videoId,
    res: await api(`/videos/${videoId}`)
  });
}
