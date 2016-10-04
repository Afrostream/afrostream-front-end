import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { prepareRoute } from '../../decorators'
import * as BlogActionCreators from '../../actions/blog'
import config from '../../../../config'
import MarkdownIt from 'markdown-it'
const md = MarkdownIt({
  html: true,        // Enable HTML tags in source
  xhtmlOut: true,        // Use '/' to close single tags (<br />).
  // This is only for full CommonMark compatibility.
  breaks: true,        // Convert '\n' in paragraphs into <br>
  langPrefix: 'language-',  // CSS language prefix for fenced blocks. Can be
                            // useful for external highlighters.
  linkify: true        // Autoconvert URL-like text to links
})

@connect(({Blog}) => ({Blog}))
export default class LifeView extends Component {

  render () {
    const {
      props: {
        Blog, postId
      }
    } = this

    const post = Blog.get(`posts/${this.props.params.postId}`)
    if (!post) {
      console.log('no post')
      return (<div />)
    }
    console.log('post founded')

    let poster = post.get('poster')
    let posterImg = poster ? poster.get('path') : ''
    let imageStyles = posterImg ? {backgroundImage: `url(${config.images.urlPrefix}${posterImg}?crop=faces&fit=min&w=1280&h=720&q=70)`} : {}
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
    )
  }
}
