import ActionTypes from '../consts/ActionTypes'
import { notFoundPost } from './notFoundAction'

export function fetchPins () {
  return (dispatch, getState) => {
    let readyPins = getState().Life.get(`pins`)
    if (readyPins) {
      console.log('Life pins already present in data store')
      return {
        type: ActionTypes.Life.fetchPins,
        res: {
          body: readyPins.toJS()
        }
      }
    }
    return async api => ({
      type: ActionTypes.Life.fetchPins,
      res: await api({path: `/api/life/pins`})
    })
  }
}

export function fetchPost (postId) {
  return (dispatch, getState) => {
    let readyPost = getState().Blog.get(`/posts/${postId}`)
    if (readyPost) {
      console.log('blog post already present in data store')
      return {
        type: ActionTypes.Blog.fetchPost,
        postId,
        res: {
          body: readyPost.toJS()
        }
      }
    }
    console.log('fetchPost ', postId)
    return async api => ({
      type: ActionTypes.Blog.fetchPost,
      postId,
      res: await api({path: `/api/posts/${postId}`}).catch(notFoundPost)
    })
  }
}
