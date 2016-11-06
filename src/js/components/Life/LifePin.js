import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import { slugify, extractImg } from '../../lib/utils'
import { Link } from '../Utils'
import ClickablePin from './ClickablePin'
import classSet from 'classnames'
import ReactImgix from '../Image/ReactImgix'
import Immutable from 'immutable'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (canUseDOM) {
  var ReactGA = require('react-ga')
}

@connect(({Life, User}) => ({Life, User}))
class LifePin extends ClickablePin {

  constructor (props, context) {
    super(props, context)
  }

  render () {

    const {
      props:{
        data,
        showBubble,
        imageWidth,
        imageHeight
      }
    } = this

    const type = data.get('type')

    let imageUrl = extractImg({data, key: 'image', width: imageWidth, height: imageHeight, fit: 'min'})

    const pinnedDate = moment(data.get('date'))
    const pinnedUser = data.get('user')
    const description = data.get('description')
    const themes = data.get('themes')
    const pinRole = data.get('role')
    const isPremium = pinRole === 'premium' || pinRole === 'vip'

    const brickStyle = {
      'brick': true,
      'full': !(description && description.length),
      'premium': isPremium
    }

    const cardTypeIcon = {
      'card-bubble': true,
      'card-bubble-type': true
    }

    brickStyle[type] = true
    cardTypeIcon[type] = true

    return (<article className={classSet(brickStyle)}>
      <Link to={data.get('originalUrl')} onClick={
        (e) =>::this.clickHandlerPin(e, data)
      }>
        <div className="brick-content">
          <div className="brick-background">
            <ReactImgix className="brick-background_image" src={imageUrl} bg={true}/>
            <div className="brick-background_mask"/>
            {isPremium && (<div className="premium-flag">
              <div className="premium-flag__header-label"> Accès {pinRole}</div>
            </div>)}

            <div className="bkdate">
              <div className="day">{pinnedDate.format('DD')}</div>
              <div className="month">{pinnedDate.format('MMM')}</div>
            </div>

          </div>
          <div className="card-body">
            {!showBubble && <div className="card-bubbles">
              {pinnedUser && <div className="card-bubble card-bubble-user">
                <img src={pinnedUser.get('picture')}
                     alt="user-button"
                     className="icon-user"/>
              </div>}
              <div className={classSet(cardTypeIcon)}/>
            </div>}
            <div className="card-meta">
              {themes && themes.map((theme, a)=><div key={`data-card-theme-${a}`}
                                                     className="card-theme">{theme.get('label')}</div>)}
            </div>
            <div className="card-info">
              <div target="_self">{data.get('title')}</div>
            </div>
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
          </div>
        </div>
      </Link>
    </article>)
  }
}

LifePin.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
  imageHeight: PropTypes.number,
  imageWidth: PropTypes.number,
  showBubble: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}


LifePin.defaultProps = {
  imageWidth: 1080,
  imageHeight: 500,
  showBubble: true
}

export default LifePin
