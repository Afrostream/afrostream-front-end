import React, { PropTypes, Component } from 'react';
import { prepareRoute } from '../../decorators';
import { connect } from 'react-redux';
import * as BlogActionCreators from '../../actions/blog';

@prepareRoute(async function ({ store }) {
  return await * [
    store.dispatch(BlogActionCreators.fetchAll())
  ];
})
@connect(({ Blog }) => ({Blog}))
export default class PostsList extends Component {

  render() {
    const {
      props: {
        Blog
        }
      } = this;

    let posts = Blog.get('posts');
    if (!posts) {
      return (<div />)
    }
    return (
      <div styleName="wrapper">
        {posts
          .filter(item => item.published)
          .map(post => {
            return (
              <div key={post.id}>
                <Link to={`/posts/${post.id}`}>
                  <h2 className="post-header-link">{post.title}</h2>
                </Link>
              </div>
            );
          })}
      </div>
    );
  }
}
