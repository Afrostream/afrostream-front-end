import ActionTypes from '../consts/ActionTypes';

export function fetchAll() {
  return (dispatch, getState) => {
    let readyPosts = getState().Blog.get(`posts`);
    if (readyPosts) {
      console.log('blog posts already present in data store');
      return {
        type: ActionTypes.Blog.fetchAll,
        res: {
          body: readyPosts.toJS()
        }
      };
    }
    return async api => ({
      type: ActionTypes.Blog.fetchAll,
      res: await api(`/posts`)
    });
  };
}

export function fetchPost(postId) {
  return (dispatch, getState) => {
    let readyPost = getState().Blog.get(`/posts/${postId}`);
    if (readyPost) {
      console.log('blog post already present in data store');
      return {
        type: ActionTypes.Blog.fetchPost,
        postId,
        res: {
          body: readyPost.toJS()
        }
      };
    }
    console.log('fetchPost ', postId);
    return async api => ({
      type: ActionTypes.Blog.fetchPost,
      postId,
      res: await api(`/posts/${postId}`)
    });
  };
}
