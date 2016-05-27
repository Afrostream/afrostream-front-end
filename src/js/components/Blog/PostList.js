import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as BlogActionCreators from '../../actions/blog'
import * as EventActionCreators from '../../actions/event'
import config from '../../../../config/'
if (process.env.BROWSER) {
  require('./Blog.less')
}
@prepareRoute(async function ({ store }) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BlogActionCreators.fetchAll())
  ])
})
@connect(({ Blog }) => ({Blog}))
export default class PostList extends Component {

  render() {
    const {
      props: {
        Blog,children
        }
      } = this

    if (children) {
      return children
    }


    let posts = Blog.get('posts')
    if (!posts) {
      return (<div />)
    }
    return (
      <div className="row-fluid">
        <div className="blog">
          <h1>Black is the new gold</h1>
          {posts
            .map(post => {

              const baseUrl = 'data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
              let imageStyles = baseUrl
              let thumb = post.get('poster')
              if (thumb) {
                let imgix = thumb.get('imgix')
                if (imgix) {
                  imageStyles = `${imgix}?crop=faces&fit=min&w=250&h=120&q=${config.images.quality}&fm=${config.images.type}`
                }
              }

              return (
                <article key={post.get('_id')}>
                  <section>
                    <div className="media">
                      <div className="media-left">
                        <Link to={`/blog/${post.get('_id')}/${post.get('slug')}`}>
                          <img className="media-object" src={imageStyles} alt={post.get('title')}/>
                        </Link>
                      </div>
                      <div className="media-body">
                        <Link to={`/blog/${post.get('_id')}/${post.get('slug')}`}>
                          <h4 className="media-heading media-heading-top">{post.get('title')}</h4>
                          {post.get('description')}
                        </Link>
                      </div>
                    </div>
                  </section>
                </article>
              )
            }).toJS()
          }
        </div>
      </div>
    )
  }
}
