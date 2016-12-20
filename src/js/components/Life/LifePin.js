import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { extractImg } from '../../lib/utils'
import { Link } from '../Utils'
import ClickablePin from './ClickablePin'
import classSet from 'classnames'
import ReactImgix from '../Image/ReactImgix'
import Immutable from 'immutable'
import PinButton from './PinButton'

@connect(({Life, User}) => ({Life, User}))
class LifePin extends ClickablePin {

  constructor (props, context) {
    super(props, context)
  }

  likePin (e, liked) {
    let {
      props:{
        data,
        User
      }
    } = this

    const currentUser = User.get('user')

    if (currentUser) {
      super.likePin(e, liked)
    } else {
      e.preventDefault()
      this.modalLogin()
    }
  }

  renderBubbles () {
    const {
      props:{
        data,
        Life,
        User
      }
    } = this

    const type = data.get('type')
    const pinnedUser = data.get('user')
    const cardTypeIcon = {
      'card-bubble': true,
      'card-bubble-type': true
    }
    cardTypeIcon[type] = true

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
      {pinnedUser && <div className="card-bubble card-bubble-user">
        <img src={pinnedUser.get('picture')}
             alt="user-button"
             className="icon-user"/>
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
        index,
        data,
        isCurrentUser,
        imageWidth,
        imageHeight
      }
    }= this

    const type = data.get('type')
    const pinnedDate = moment(data.get('date'))
    const pinnedUser = data.get('user')
    const description = data.get('description')
    const themes = data.get('themes')
    const pinRole = data.get('role')
    const isPremium = pinRole === 'premium' || pinRole === 'vip'
    const isFull = true

    let imageUrl = extractImg({
      data,
      key: 'image',
      width: imageWidth,
      height: imageHeight,
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
          <ReactImgix className="brick-background_image" src={imageUrl} bg={true}/>
          <div className="brick-background_mask"/>
          {isPremium && (<div className="premium-flag">
            <div className="premium-flag__header-label"> Accès {pinRole}</div>
          </div>)}
        </div>
        <div className="card-body">
          <div className="card-meta">
            {themes && themes.map((theme, a) => <div key={`data-card-theme-${a}`}
                                                     className="card-theme">{theme.get('label')}</div>)}
          </div>
          <div className="card-info">
            <div target="_self">{data.get('title')}</div>
          </div>
          {this.renderBubbles()}
        </div>
        {description && <div className="card-sub-info">
          {this.renderBubbles()}
          <div className="card-description">
            {description}
          </div>
          <div className="card-date">
            {
              `${pinnedDate.format('L')}`
            }
            {pinnedUser &&
            ` - ${pinnedUser.get('nickname')}`
            }
          </div>

        </div>}
        {isCurrentUser && <PinButton buttonClass="fa fa-trash"
                                     label="life.sticky.remove"
                                     target="life-remove"
                                     {...this.props}
                                     onClick={::this.removePin}/>}
      </div>
    </Link>)
  }
}

LifePin.propTypes = {
  isCurrentUser: PropTypes.bool,
  data: PropTypes.instanceOf(Immutable.Map),
  index: PropTypes.number,
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  showBubble: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}


LifePin.defaultProps = {
  isCurrentUser: false,
  index: 0,
  imageWidth: 1080,
  imageHeight: 500,
  showBubble: true
}

export default LifePin
