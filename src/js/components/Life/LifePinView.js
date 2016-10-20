import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import moment from 'moment'
import { Link } from '../Utils'
import LifePin from './LifePin'
import { slugify } from '../../lib/utils'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import Immutable from 'immutable'

if (process.env.BROWSER) {
  require('./LifePinView.less')
}

@connect(({Life, User}) => ({Life, User}))
class LifePinView extends LifePin {

  constructor (props, context) {
    super(props, context)
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

    e.preventDefault()
    dispatch(PlayerActionCreators.killPlayer())
    dispatch(PlayerActionCreators.loadPlayer({
      data: Immutable.fromJS({
        target: this.refs.pinHeader || e.currentTarget,
        height: 150,
        controls: false,
        sources: [{
          src: data.get('richMediaUrl'),
          type: `video/${data.get('providerName')}`
        }]
      })
    }))
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

    const pin = Life.get(`life/pins/${pinId}`)
    if (!pin) {
      return (<div />)
    }
    const pinThemesList = pin.get('themes')
    const allThemesList = Life.get(`life/themes/`)
    const spots = pinThemesList && pinThemesList.flatMap((theme)=> {
        const themeId = theme.get('_id')
        const themesSpots = Life.get(`life/themes/`)
        if (themesSpots) {
          return themesSpots.get('spots')
        }
      })

    const pinnedDate = moment(pin.get('date'))

    let image = pin.get('image')
    let bgImg = image ? image.get('path') : ''
    let imageStyles = bgImg ? {backgroundImage: `url(${config.images.urlPrefix}${bgImg}?crop=faces&fit=min&w=1280&h=720&q=70)`} : {}
    return (
      <article className="row no-padding brand-bg life-pin">
        <div ref="pinHeader" className="pin-header">
          <div className="pin-header-background">
            <div className="pin-header-background_image" style={imageStyles}/>
            <div className="pin-header-background_mask"/>

            <div className="bkdate">
              <div className="day">{pinnedDate.format('DD')}</div>
              <div className="month">{pinnedDate.format('MMM')}</div>
            </div>
          </div>
          <div className="pin-header-content">
            <Link to={pin.get('originalUrl')} onClick={
              (e) =>::this.clickHandler(e, pin)
            }>
              <h1> {pin.get('title')}</h1>
            </Link>
          </div>
        </div>
        <div className="container-fluid no-padding brand-bg article-content">
          <div className="row no-padding">
            <div className="col-md-8 no-padding ">
              <section dangerouslySetInnerHTML={{__html: pin.get('body')}}/>
            </div>
            <div className="col-md-4 no-padding">
              {spots && spots.map((spot, key)=> {
                const sourceImg = spot.get('image')
                const bgImg = sourceImg ? sourceImg.get('path') : ''
                const spotImgSrc = `${config.images.urlPrefix}${bgImg}?crop=faces&fit=min&w=1280&h=720&q=70)`
                debugger
                return bgImg && (
                    <a href={spot.get('targetUrl')} target="_blank"
                       key={`life-pin-spot-${spot.get('_id')}-${key}`}>
                      <img className="img-responsive" alt={spot.get('title')}
                           source={spotImgSrc}/>
                    </a>)
              }).toJS()}
            </div>
          </div>
        </div>
      </article>
    )
  }
}

export default LifePinView
