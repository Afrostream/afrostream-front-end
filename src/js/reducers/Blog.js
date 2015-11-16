import Immutable from 'immutable';
import ActionTypes from '../consts/ActionTypes';
import createReducer from '../lib/createReducer';

const initialState = Immutable.fromJS({
  'posts': []
});

export default createReducer(initialState, {
  [ActionTypes.Blog.fetchAll](state, { res }) {
    const data = res.body;
    console.log('Blog.fetchAll', data);
    return state.merge({
      [`posts`]: data
    });
  },
  [ActionTypes.Blog.fetchPost](state, { res,postId }) {
    const data = res.body;
    console.log('Blog.fetchPost', data);
    return state.merge({
      [`posts/${postId}`]: data
    });
  }
});
