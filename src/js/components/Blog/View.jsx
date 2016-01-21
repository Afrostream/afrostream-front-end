import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { prepareRoute } from '../../decorators';
import * as BlogActionCreators from '../../actions/blog';
import MarkdownIt from 'markdown-it';
import config from '../../../../config';
const md = MarkdownIt(config.markDown);

@prepareRoute(async function ({ store, params: { postId } }) {
  return await * [
    store.dispatch(BlogActionCreators.fetchPost(postId))
  ];
})
@connect(({ Blog }) => ({Blog}))
export default class View extends Component {

  render() {
    const {
      props: {
        Blog,postId
        }
      } = this;

    const post = Blog.get(`posts/${this.props.params.postId}`);
    if (!post) {
      console.log('no post');
      return (<div />)
    }
    console.log('post founded');

    let poster = post.get('poster');
    let posterImg = poster ? poster.get('imgix') : '';
    let imageStyles = posterImg ? {backgroundImage: `url(${posterImg}?crop=faces&fit=clamp&w=1280&h=720&q=70)`} : {};
    return (
      <div className="row-fluid">
        <div className="blog">
          <article key={post.get('_id')}>
            <header data-stellar-background-ratio='0.5'
                    style={imageStyles}>
              <div className="container">
                <div className="intro-text">
                  <h1> {post.get('title')}</h1>
                </div>
              </div>
            </header>
            <section dangerouslySetInnerHTML={{__html: md.render(post.get('body'))}}/>
          </article>
        </div>
      </div>
    );
  }
}
