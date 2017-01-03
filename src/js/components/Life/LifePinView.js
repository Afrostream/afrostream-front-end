import React, { Component, PropTypes } from 'react'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import config from '../../../../config'
import moment from 'moment'
import classSet from 'classnames'
import _ from 'lodash'
import ClickablePin from './ClickablePin'
import { extractImg, addRemoveEvent } from '../../lib/utils'
import * as FacebookActionCreators from '../../actions/facebook'
import * as LifeActionCreators from '../../actions/life'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import Spinner from '../Spinner/Spinner'
import LifeSpot from './LifeSpot'
import Immutable from 'immutable'
import AvatarCard from '../User/AvatarCard'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import document from 'global/document'
import ReactImgix from '../Image/ReactImgix'
import shallowEqual from 'react-pure-render/shallowEqual'
import scriptLoader from '../../lib/script-loader'
import { StickyContainer, Sticky } from 'react-sticky'

const {addThisApi, addThis, bitly} = config

if (process.env.BROWSER) {
  require('./LifePinView.less')
}

@prepareRoute(async function ({store, params:{pinId}}) {
  if (pinId) {
    return await Promise.all([
      store.dispatch(LifeActionCreators.fetchPin(pinId)),
      store.dispatch(FacebookActionCreators.readNews({}))
    ])
  }
})
@connect(({Life, User}) => ({Life, User}))
class LifePinView extends ClickablePin {

  constructor (props, context) {
    super(props, context)
  }

  addEvent (add = true) {
    const players = document.querySelectorAll('.ta-insert-video,.life-pin .article-content .col-left p img')
    if (players) {
      _.forEach(players, (element) => {
        addRemoveEvent('click', element, add, ::this.elementClickHandler)
      })
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!shallowEqual(nextProps.params.pinId, this.props.params.pinId)) {
      this.addEvent()
    }
  }

  componentWillUnmount () {
    this.addEvent(false)
  }

  componentDidUpdate () {
    this.addEvent()
  }

  componentDidMount () {
    this.addEvent()
  }

  elementClickHandler (e) {
    const {
      props: {
        dispatch
      }
    } = this
    e.preventDefault()

    const target = e.currentTarget || e.target

    const targetUrl = target.getAttribute('ta-insert-video')
    const targetType = target.getAttribute('ta-insert-type')

    if (targetType) {
      dispatch(PlayerActionCreators.loadPlayer({
        data: Immutable.fromJS({
          target,
          videoId: targetUrl,
          autoplay: true,
          sources: [{
            src: targetUrl,
            type: `video/${targetType}`
          }]
        })
      }))
    }
    else {
      dispatch(ModalActionCreators.open({
        className: 'large',
        target: 'image', data: Immutable.fromJS({
          src: e.target.src
        })
      }))
    }
  }

  renderBubbles (data) {
    const {
      props:{
        Life,
        User
      }
    } = this

    const type = data.get('type')
    const pinnedUser = data.get('user')

    const pinId = data.get('_id')
    const nbLikes = data.get('likes')
    const currentUser = User.get('user')
    const lifeUserId = currentUser && currentUser.get('_id')
    const likedPins = lifeUserId && Life.get(`life/users/${lifeUserId}/pins/likes`)
    const likedPin = likedPins && likedPins.find((pin) => pin.get('pinId') === pinId)
    const liked = likedPin && likedPin.get('liked')

    const likeTypeIcon = {
      'card-bubble': true,
      'card-bubble-type': true,
      'like': true,
      'liked': liked,
      'disabled': !currentUser
    }
    return (<div className="card-bubbles">
      <div className={classSet(likeTypeIcon)} onClick={(e) => ::this.likePin(e, !liked)}>
        <div className="heart heart-animation-1"/>
        <div className="heart heart-animation-2"/>
        {nbLikes > 0 && <div className="like-badge-number">{nbLikes}</div>}
      </div>
    </div>)
  }

  render () {
    const {
      props: {
        Life,
        params:{
          pinId
        }
      }
    } = this

    const data = Life.get(`life/pins/${pinId}`)
    if (!data) {
      return (<Spinner />)
    }
    const pinThemesList = data.get('themes')
    const allThemesList = Life.get(`life/themes/`)

    const spots = pinThemesList && pinThemesList.flatMap((theme) => {
        const themeId = theme.get('_id')
        const themesSpots = allThemesList && allThemesList.find((theme) => {
            return theme.get('_id') === themeId
          })//Life.get(`life/themes/${themeId}`)
        if (themesSpots) {
          return themesSpots.get('spots')
        }
      })

    const pinnedDate = moment(data.get('date'))
    const pinnedUser = data.get('user')
    let imageUrl = extractImg({data, key: 'image', width: 1280, height: 720, fit: 'min'})

    return (
      <article className="brand-bg life-pin">
        <div ref="pinHeader" className="pin-header">
          <div className="pin-header-background">
            <ReactImgix className="pin-header-background_image" src={imageUrl} bg={true}/>
            <div className="pin-header-background_mask"/>

            <div className="bkdate">
              <div className="day">{pinnedDate.format('DD')}</div>
              <div className="month">{pinnedDate.format('MMM')}</div>
            </div>
          </div>
          <div className="pin-header-content">
            <h1> {data.get('title')}</h1>
            {this.renderBubbles(data)}
          </div>
        </div>
        <StickyContainer className="container-fluid no-padding brand-bg article-content" style={{margin: 0}}>
          <div className="row no-padding">
            <div className="col-md-9 col-xs-9 no-padding col-left">
              <div className="addthis_toolbox addthis_inline_share_toolbox_apql"/>
              <section dangerouslySetInnerHTML={{__html: data.get('body')}}/>
              <div className="addthis_toolbox addthis_relatedposts_inline_zl50"/>
            </div>
            <div className="col-md-3 col-xs-3 no-padding col-right">
              {pinnedUser && <AvatarCard user={pinnedUser}/>}
              <Sticky bottomOffset={150}>
                <div className="addthis_inline_share_toolbox_ubvc"/>
                <div className="spot-lists">
                  {spots && spots.map((data, key) => <LifeSpot {...{
                    data,
                    key
                  }} {...this.props} />).toJS()}
                </div>
              </Sticky>
            </div>
          </div>
        </StickyContainer>
      </article>
    )
  }
}

export default  scriptLoader(
  [addThisApi]
)(LifePinView)
