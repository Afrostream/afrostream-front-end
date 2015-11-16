import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as BlogActionCreators from '../../actions/blog';

@connect(({ Blog }) => ({
  Blog
}))
export default class PostsView extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    params: PropTypes.object,
    posts: PropTypes.object
  };

  static fillStore(redux, props) {
    const {
      props: {
        dispatch
        }
      } = this;


    dispatch(BlogActionCreators.fetchPost(props.params.id));
  }

  render() {
    const {
      props: {
        dispatch,Blog
        }
      } = this;
    const post = Blog.get(`posts/${this.props.params.id}`);
    if (!post) {
      return (<div />)
    }
    return (
      <div styleName="wrapper">
        <div styleName="title">{title}</div>
        <p>{content}</p>
        <small>written by {userId}</small>
      </div>
    );
  }
}
