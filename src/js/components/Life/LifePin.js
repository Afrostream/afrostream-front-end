import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { extractImg } from '../../lib/utils'
import { Link } from '../Utils'
import ClickablePin from './ClickablePin'
import classSet from 'classnames'
import ReactImgix from '../Image/ReactImgix'
import Immutable from 'immutable'
import _ from 'lodash'
import PinButton from './PinButton'
import ReactTooltip from 'react-tooltip'
import {
  injectIntl
} from 'react-intl'

@connect(({Life, User, Event}) => ({Life, User, Event}))
class LifePin extends ClickablePin {

  constructor (props, context) {
    super(props, context)
  }

  renderBubbles (isCurrentUser) {
    const {
      props:{
        data,
        Life,
        User
      }
    } = this

    const type = data.get('type')
    const pinnedUser = data.get('user')
    const pinnedUserId = pinnedUser && pinnedUser.get('_id')
    const nickName = pinnedUser && pinnedUser.get('nickname') && `@${pinnedUser.get('nickname')}` || ''
    const cardTypeIcon = {
      'card-bubble': true,
      'card-bubble-type': true
    }

    const pinId = data.get('_id')
    const nbLikes = data.get('likes')
    const currentUser = User.get('user')
    const lifeUserId = currentUser && currentUser.get('_id')


    const likedPins = lifeUserId && Life.get(`life/users/${lifeUserId}/likes`)
    const likedPin = likedPins && likedPins.find((pin) => pin.get('pinId') === pinId)
    const liked = likedPin && likedPin.get('liked')

    const followedUsers = lifeUserId && Life.get(`life/users/${lifeUserId}/followedUsers`)
    const followedUser = followedUsers && followedUsers.find((follow) => follow.get('followUserId') == pinnedUserId)
    const followed = followedUser && followedUser.get('follow')

    const likeTypeIcon = _.merge({
      'like': true,
      'liked': liked
    }, cardTypeIcon)

    const userTypeIcon = _.merge({
      'user': true,
      'followed': followed
    }, cardTypeIcon)

    cardTypeIcon[type] = true

    const titleLabel = this.getTitle(`life.users.show`, {nickName})


    return (<div className="card-bubbles">
      {pinnedUser && <div className={classSet(userTypeIcon)}
                          data-tip={titleLabel}
                          data-place={'top'}
                          data-for={`user-tip`} onClick={(e) => ::this.showUser(e)}>
        <img src={pinnedUser.get('picture')}
             alt="user-button"
             className="icon-user"/>
        <ReactTooltip id={`user-tip`} type="dark"
                      effect="solid"/>
      </div>}
      <div className={classSet(cardTypeIcon)}/>
      <div className={classSet(likeTypeIcon)} onClick={(e) => ::this.likePin(e, !liked)}>
        <div className="heart heart-animation-1"/>
        <div className="heart heart-animation-2"/>
        {nbLikes > 0 && <div className="like-badge-number">{nbLikes}</div>}
      </div>
    </div>)
  }

  render () {

    const {
      props:{
        Event,
        index,
        data,
        over,
        imageWidth,
        imageHeight,
        User
      }
    }= this

    const currentUser = User && User.get('user')
    const currentUserId = currentUser && currentUser.get('_id')

    const type = data && data.get('type')
    const pinnedDate = moment(data && data.get('date'))
    const pinnedUser = data && data.get('user')
    const pinnedUserId = pinnedUser && pinnedUser.get('_id')
    const description = data && data.get('description')
    const themes = data && data.get('themes')
    const pinRole = data && data.get('role')
    const isPremium = pinRole === 'premium' || pinRole === 'vip'
    const isFull = true
    const isMobile = Event && Event.get('isMobile')
    const isCurrentUser = pinnedUserId === currentUserId

    let imageUrl = extractImg({
      data,
      key: 'image',
      width: imageWidth,
      height: imageHeight,
      isMobile,
      crop: isFull && index ? 'entropy' : 'faces',
      fit: 'min'
    })

    const brickStyle = {
      'brick': true,
      'full': isFull,
      'premium': isPremium
    }

    brickStyle[type] = true

    return (<Link to={this.getUrl(data)} className={classSet(brickStyle)} onClick={
      (e) => ::this.clickHandlerPin(e, data)
    }>
      <div className="brick-content">
        <div className="brick-background">
          <ReactImgix className="brick-background_image" src={imageUrl} bg={true} blur={false}/>
          <div className="brick-background_mask"/>
          {isPremium && (<div className="premium-flag">
            <div className="premium-flag__header-label"> Accès {pinRole}</div>
          </div>)}
        </div>
        <div className="card-body">
          <div className="card-meta">
            {themes && themes.map((theme, a) => <div key={`data-card-theme-${a}`}
                                                     className="card-theme">{theme && theme.get('label')}</div>)}
          </div>
          <div className="card-info">
            <div target="_self">{data && data.get('title')}</div>
          </div>
          {this.renderBubbles(isCurrentUser)}
        </div>
        {description && over && <div className="card-sub-info">
          {this.renderBubbles(isCurrentUser)}
          <div className="card-description">
            {description}
          </div>

        </div>}
        {isCurrentUser && <PinButton buttonClass="fa fa-trash"
                                     label="life.sticky.remove"
                                     target="life-remove"
                                     {...this.props}
                                     onClick={::this.removePin}/>}
      </div>
      <div className="card-date"><span className="date">
        {
          `${pinnedDate.format('L')}`
        }</span>
        {pinnedUser &&
        <span className="date-nickname">{pinnedUser && pinnedUser.get('nickname')}</span>
        }
      </div>
    </Link>)
  }
}

LifePin.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
  index: PropTypes.number,
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  over: PropTypes.bool,
  showBubble: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}


LifePin.defaultProps = {
  index: 0,
  imageWidth: 1080,
  imageHeight: 500,
  over: true,
  showBubble: true
}

export default injectIntl(LifePin)
