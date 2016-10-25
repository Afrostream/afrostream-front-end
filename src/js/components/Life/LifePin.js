import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import moment from 'moment'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import { slugify, extractImg } from '../../lib/utils'
import { Link } from '../Utils'
import classSet from 'classnames'
import Immutable from 'immutable'

const {images} =config

@connect(({Life, User}) => ({Life, User}))
class LifePin extends Component {

  constructor (props) {
    super(props)
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  userRole () {

    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')
    let currentRole = 0
    let planCode = null
    let internalPlanOpts = null
    if (user) {
      currentRole += 1
      planCode = user.get('planCode')
      const subscriptionsStatus = user.get('subscriptionsStatus')
      if (subscriptionsStatus) {
        const subscriptions = subscriptionsStatus.get('subscriptions')
        const currentSubscription = subscriptions && subscriptions.first((a) => a.get('isActive') === 'yes' && a.get('inTrial') === 'no')
        if (currentSubscription) {
          currentRole += 1
          const isVIP = currentSubscription.get('internalPlan').get('internalPlanOpts').get('internalVip')
          if (isVIP) {
            currentRole += 1
          }
        }
      }
    }

    return currentRole
  }

  /**
   * get nex role have acl
   */
  targetRole () {
    const userRole = this.userRole()
    return config.userRoles[userRole + 1]
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  validRole (roleRequired) {
    const userRole = this.userRole()
    return config.userRoles.indexOf(config.userRoles[userRole]) >= config.userRoles.indexOf(roleRequired)
  }

  clickHandler (e, data) {
    const {
      props: {
        dispatch,
        history
      }
    } = this
    const pinRole = data.get('role')
    const acl = this.validRole(pinRole)
    const pinUrl = `/life/pin/${data.get('_id')}/${slugify(data.get('title'))}`

    if (!acl) {
      e.preventDefault()
      const modalRole = this.targetRole()
      return dispatch(ModalActionCreators.open({target: `life-${modalRole}`, donePath: '/life', closable: true}))
    }


    if (data.get('body')) {
      e.preventDefault()
      return history.push(pinUrl)
    }

    switch (data.get('type')) {
      case 'video':
      case 'audio':
      case 'rich':
        e.preventDefault()
        dispatch(PlayerActionCreators.killPlayer())
        dispatch(PlayerActionCreators.loadPlayer({
          data: Immutable.fromJS({
            target: e.currentTarget || e.target,
            height: 150,
            controls: false,
            sources: [{
              src: data.get('originalUrl'),
              type: `video/${data.get('providerName')}`
            }]
          })
        }))
        break

      case 'article':
        e.preventDefault()
        history.push(pinUrl)
        break

      case 'image':
        e.preventDefault()
        dispatch(ModalActionCreators.open({
          target: 'image', data: Immutable.fromJS({
            src: extractImg({data, key: 'image'})
          })
        }))
        break
    }
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  userRole () {

    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')
    let currentRole = 0
    let planCode = null
    let internalPlanOpts = null
    if (user) {
      currentRole += 1
      planCode = user.get('planCode')
      const subscriptionsStatus = user.get('subscriptionsStatus')
      if (subscriptionsStatus) {
        const subscriptions = subscriptionsStatus.get('subscriptions')
        const currentSubscription = subscriptions && subscriptions.first((a) => a.get('isActive') === 'yes' && a.get('inTrial') === 'no')
        if (currentSubscription) {
          currentRole += 1
          const isVIP = currentSubscription.get('internalPlan').get('internalPlanOpts').get('internalVip')
          if (isVIP) {
            currentRole += 1
          }
        }
      }
    }

    return currentRole
  }

  /**
   * get nex role have acl
   */
  targetRole () {
    const userRole = this.userRole()
    return config.userRoles[userRole + 1]
  }

  /**
   * Checks if the user role meets the minimum requirements of the route
   */
  validRole (roleRequired) {
    const userRole = this.userRole()
    return config.userRoles.indexOf(config.userRoles[userRole]) >= config.userRoles.indexOf(roleRequired)
  }

  clickHandler (e, data) {
    const {
      props: {
        dispatch,
        history
      }
    } = this
    const pinRole = data.get('role')
    const acl = this.validRole(pinRole)

    if (!acl) {
      e.preventDefault()
      const modalRole = this.targetRole()
      return dispatch(ModalActionCreators.open({target: `life-${modalRole}`, donePath: '/life', closable: true}))
    }

    switch (data.get('type')) {
      case 'video':
        e.preventDefault()
        dispatch(PlayerActionCreators.killPlayer())
        dispatch(PlayerActionCreators.loadPlayer({
          data: Immutable.fromJS({
            className: data.get('type'),
            autoplay: true,
            target: e.currentTarget || e.target,
            height: 150,
            sources: [{
              src: data.get('originalUrl'),
              type: `video/${data.get('providerName')}`
            }]
          })
        }))
        break
      case 'audio':
      case 'rich':
        e.preventDefault()
        dispatch(PlayerActionCreators.killPlayer())
        dispatch(PlayerActionCreators.loadPlayer({
          data: Immutable.fromJS({
            className: data.get('type'),
            autoplay: true,
            target: e.currentTarget || e.target,
            height: 150,
            sources: [{
              src: data.get('originalUrl'),
              type: `audio/${data.get('providerName')}`
            }]
          })
        }))
        break

      case 'article':
        e.preventDefault()
        history.push(`/life/pin/${data.get('_id')}/${slugify(data.get('title'))}`)
        break
    }
  }

  render () {

    const {
      props:{
        data,
        showBubble,
        imageWidth
      }
    } = this

    const type = data.get('type')
    const baseUrl = 'data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    const thumb = data.get('image')
    let imageUrl = data.get('imageUrl') || baseUrl
    if (thumb) {
      const path = thumb.get('path')
      if (path) {
        imageUrl =
          `${images.urlPrefix}${path}?&crop=face&fit=clip&w=${imageWidth}&q=${config.images.quality}&fm=${config.images.type}`

      }
    }

    const imageStyles = {
      backgroundImage: `url(${imageUrl})`
    }

    const pinnedDate = moment(data.get('date'))
    const pinnedUser = data.get('user')
    const themes = data.get('themes')
    const pinRole = data.get('role')
    const isPremium = pinRole === 'premium' || pinRole === 'vip'

    const brickStyle = {
      'brick': true,
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
        (e) =>::this.clickHandler(e, data)
      }>
        <div className="brick-content">
          <div className="brick-background">
            <div className="brick-background_image" style={imageStyles}/>
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
              {themes && themes.map((theme, a)=><div key={
                `data-card-theme-${a}`
              }
                                                     className="card-theme">{theme.get('label')}</div>)}
            </div>
            <div className="card-info">
              <div target="_self">{data.get('title')}</div>
            </div>
            <div className="card-description">
              {data.get('description')}
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
  imageWidth: PropTypes.number,
  showBubble: PropTypes.bool,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
}


LifePin.defaultProps = {
  imageWidth: 1080,
  showBubble: true
}

export default LifePin
