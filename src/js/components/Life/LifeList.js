import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as BlogActionCreators from '../../actions/blog'
import * as ModalActionCreators from '../../actions/modal'
import * as EventActionCreators from '../../actions/event'
import config from '../../../../config/'
import MasonryInfiniteScroller from 'react-masonry-infinite'
import Masonry from 'react-masonry-component'
import classSet from 'classnames'
import Player from '../Player/Player'
import _ from 'lodash'
import Immutable from 'immutable'

const {images} =config
const masonryOptions = {
  percentPosition: true,
  //fitWidth: true,
  //stamp: '.first',
  transitionDuration: '0.2s',
  gutter: 0
}

const sourcePlayer = {
  'src': 'https://www.youtube.com/watch?v=xyRXwzKy_rk',
  'type': 'video/youtube'
}


if (process.env.BROWSER) {
  require('./LifeList.less')
}
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(BlogActionCreators.fetchAll())
  ])
})
@connect(({Blog}) => ({Blog}))
export default class LifeList extends Component {

  constructor (props, context) {
    super(props, context)
    this._columnYMap = []
  }

  loadVideo () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({
      target: 'player', data: Immutable.fromJS(sourcePlayer)
    }))
  }

  getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  renderItem ({index}) {
    const {
      props: {
        Blog
      }
    } = this

    let sizes = [
      {
        type: 'video',
      },
      {
        type: 'medium',
      },
      {
        type: 'medium',
      },
      {
        type: 'medium',
      },
      {
        type: 'square',
      },
    ]

    const dataList = Blog.get('posts')
    const sortedList = dataList.sort((a, b) => new Date(a.get('date')).getTime() < new Date(b.get('date')).getTime())

    const data = sortedList.get(index)
    const elSize = index && _.sample(sizes) || {type: 'first'}
    const baseUrl = 'data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    let imageURL = baseUrl
    const thumb = data.get('poster')
    if (thumb) {
      const path = thumb.get('path')
      if (path) {
        imageURL = `${images.urlPrefix}${path}?&w=500&q=${config.images.quality}&fm=${config.images.type}`
      }
    }

    let imageStyles = {backgroundImage: `url(${imageURL})`}

    const brickStyle = {
      'brick': true,
      'masonry-brick': true,
      'premium': Math.random() >= 0.5
    }

    brickStyle[elSize.type] = true

    return (
      <article className={classSet(brickStyle)} key={`data-brick-${index}`} style={elSize} onClick={
        ::this.loadVideo
      }>
        <div className="brick-content">
          <div className="brick-background" style={imageStyles}>
            <div className="brick-background_mask"/>
            <div className="btn-play"/>
            {brickStyle.premium && (<div className="premium-flag"><i className="zmdi zmdi-star"></i></div>)}
          </div>
          <div className="card-body">
            <div className="card-meta">
              <time>il y a 1 semaine</time>
            </div>
            <h2>
              <a href="https://www.warnerbros.fr/articles/dc-comics-jimmy-olsen-supergirl"
                 target="_self">{data.get('title')}</a>
            </h2>
            <a className="raised-btn" href="https://www.warnerbros.fr/articles/dc-comics-jimmy-olsen-supergirl"
               target="_self">
              Lire la suite
            </a>
          </div>
        </div>
      </article>
    )
  }


  render () {
    const {
      props: {
        Blog, children
      }
    } = this

    if (children) {
      return children
    }


    let dataList = Blog.get('posts')
    if (!dataList) {
      return (<div />)
    }

    return (
      //<AutoSizer disableHeight>
      //  {({width}) => (
      //    <Collection
      //      cellCount={dataList.size}
      //      cellRenderer={::this.renderItem}
      //      cellSizeAndPositionGetter={::this._cellSizeAndPositionGetter}
      //      height={300}
      //      width={width}
      //    />
      //  )}
      //</AutoSizer>
      <div className="row-fluid life-list brand-bg">
        {/*<div className="container brand-bg ">*/}
        {/*<MasonryInfiniteScroller className="masonry-list">*/}
        {/*{*/}
        {/*dataList.map((el, index) =>*/}
        {/*this.renderItem({index})*/}
        {/*).toJS()*/}
        {/*}*/}
        {/*</MasonryInfiniteScroller>*/}
        {/*</div>*/}
        <div className="container container-wall brand-bg ">
          {this.renderItem({index: 0})}
          <Masonry className="masonry-list" options={masonryOptions}>
            {
              dataList.map((el, index) => {
                  return index && this.renderItem({index}) || null
                }
              ).toJS()
            }
          </Masonry>
          <Player src={sourcePlayer} options={{autoplay: false}}/>
        </div>
      </div>
    )
  }
}
