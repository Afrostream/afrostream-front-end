import React, { PropTypes, Component } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as LifeActionCreators from '../../actions/life'
import * as ModalActionCreators from '../../actions/modal'
import * as EventActionCreators from '../../actions/event'
import config from '../../../../config/'
import classSet from 'classnames'
import Player from '../Player/Player'
import _ from 'lodash'
import Immutable from 'immutable'

const {images} =config

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
    store.dispatch(LifeActionCreators.fetchPins())
  ])
})
@connect(({Life}) => ({Life}))
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

  renderItem ({index}) {
    const {
      props: {
        Life
      }
    } = this

    let sizes = [
      {
        type: 'video',
        width: 1080,
        height: 300
      },
      {
        type: 'medium',
        width: 300,
        height: 300
      },
      {
        type: 'medium',
        width: 300,
        height: 300
      },
      {
        type: 'medium',
        width: 300,
        height: 300
      },
      {
        type: 'medium',
        width: 300,
        height: 300
      },
      {
        type: 'medium',
        width: 300,
        height: 300
      },
      {
        type: 'medium',
        width: 300,
        height: 300
      },
    ]

    const dataList = Life.get('life/pins')
    const sortedList = dataList.sort((a, b) => new Date(a.get('date')).getTime() < new Date(b.get('date')).getTime())

    const data = sortedList.get(index)
    const elSize = index && _.sample(sizes) || {type: 'first', width: 900, height: 300}
    const baseUrl = 'data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    const thumb = data.get('image')
    let imageUrl = data.get('imageUrl') || baseUrl;
    if (thumb) {
      const path = thumb.get('path')
      if (path) {
        imageUrl = `${images.urlPrefix}${path}?&facepad=1.5&crop=face&fit=min&w=${elSize.width}&h=${elSize.height}&q=${config.images.quality}&fm=${config.images.type}`
      }
    }

    let imageStyles = {backgroundImage: `url(${imageUrl})`}

    const brickStyle = {
      'brick': true,
      'masonry-brick': true,
      'premium': Math.random() >= 0.5
    }

    brickStyle[elSize.type] = true

    return (
      <article className={classSet(brickStyle)} key={`data-brick-${index}`} onClick={
        ::this.loadVideo
      }>
        <div className="brick-content">
          <div className="brick-background" style={imageStyles}>
            <div className="brick-background_mask"/>
            {brickStyle.premium && (<div className="premium-flag">
              <div className="premium-flag__header-label"> Accès Prémium</div>
            </div>)}
          </div>
          <div className="card-body">
            <div className="card-meta">
            </div>
            <div className="card-info">
              <a href={data.get('providerUrl')}
                 target="_self">{data.get('title')}</a>
            </div>
            <div className="card-description">
              {data.get('description')}
            </div>
          </div>
        </div>
      </article>
    )
  }

  renderContent (dataList) {
    if (!dataList || !dataList.size) {
      return
    }
    return [this.renderItem({index: 0}),
      <div className="masonry-list">
        {
          dataList.map((el, index) => {
              return index && this.renderItem({index}) || null
            }
          ).toJS()
        }
      </div>,
      <div className="life-player">
        <Player src={sourcePlayer} options={{autoplay: false}}/>
      </div>]
  }

  render () {
    const {
      props: {
        Life, children
      }
    } = this

    if (children) {
      return children
    }


    let dataList = Life.get('life/pins')

    return (
      <div className="row-fluid life-list brand-grey">
        <div className="container container-wall brand-grey">
          {dataList && this.renderContent(dataList)}
        </div>
      </div>
    )
  }
}
