import ActionTypes from '../consts/ActionTypes';

export function fetchAll() {
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Blog.fetchAll,
      res: await api(`/posts`)
    });
  };
}

export function fetchPost(postId) {
  console.log('fetchPost ', postId);
  return (dispatch, getState) => {
    return async api => ({
      type: ActionTypes.Blog.fetchPost,
      postId,
      res: await api(`/posts/${postId}`)
    });
  };
}
