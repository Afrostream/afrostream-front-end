import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import config from '../../../../config'
import * as FacebookActionCreators from '../../actions/facebook'
import * as LifeActionCreators from '../../actions/life'
import * as PlayerActionCreators from '../../actions/player'
import * as ModalActionCreators from '../../actions/modal'
import { slugify, extractImg } from '../../lib/utils'
import Immutable from 'immutable'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

if (canUseDOM) {
  var ReactGA = require('react-ga')
}

class ClickablePin extends Component {

  constructor (props, context) {
    super(props, context)
  }

  likePin (e, liked) {
    const {
      props: {
        dispatch,
        data,
        User,
        Life,
        params:{
          pinId
        }
      }
    } = this

    const pin = data || Life.get(`life/pins/${pinId}`)

    const currentUser = User.get('user')

    if (currentUser) {

      if (e) {
        e.preventDefault()
        e.target.classList.toggle('liked')
      }

      //like facebook
      dispatch(FacebookActionCreators.like({}))

      return dispatch(LifeActionCreators.likePin({
        liked,
        data: pin
      }))
    } else {
      e.preventDefault()
      this.modalLogin()
    }
  }

  removePin (e) {
    const {
      props: {dispatch, data}
    } = this
    if (e) {
      e.preventDefault()
    }

    return dispatch(ModalActionCreators.open({
      target: 'life-remove',
      data
    }))
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

  getUrl (data) {
    const pinUrl = `/life/pin/${data.get('_id')}/${slugify(data.get('title'))}`
    return data.get('originalUrl') || pinUrl || '/life' || '#'
  }

  modalLogin () {
    const {
      props: {
        dispatch
      }
    } = this
    return dispatch(ModalActionCreators.open({
      target: `life-user`,
      closable: true,
      className: 'large'
    }))
  }

  clickHandlerPin (e, data) {
    const {
      props: {
        dispatch
      }
    } = this
    const pinRole = data.get('role') || config.userRoles[1]
    const acl = this.validRole(pinRole)
    const pinUrl = this.getUrl(data)

    if (!acl) {
      e.preventDefault()
      const modalRole = this.targetRole()
      return dispatch(ModalActionCreators.open({
        target: `life-${modalRole}`,
        pinUrl,
        closable: true,
        className: 'large'
      }))
    }

    //if article /zap and go to article page
    if (data.get('type') === 'article') {
      return
    }

    const target = e.currentTarget || e.target

    const type = data.get('type')

    switch (type) {
      case 'video':
        e.preventDefault()
        //dispatch(PlayerActionCreators.killPlayer())
        dispatch(PlayerActionCreators.loadPlayer({
          data: Immutable.fromJS({
            type,
            duration: NaN,
            autoplay: true,
            target: target,
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
        //dispatch(PlayerActionCreators.killPlayer())
        dispatch(PlayerActionCreators.loadPlayer({
          data: Immutable.fromJS({
            type,
            duration: NaN,
            autoplay: true,
            target: target,
            sources: [{
              src: data.get('originalUrl'),
              type: `audio/${data.get('providerName')}`
            }]
          })
        }))
        break

      case 'image':
        e.preventDefault()
        dispatch(ModalActionCreators.open({
          className: 'large',
          target: 'image', data: Immutable.fromJS({
            src: extractImg({data, key: 'image', width: 900})
          })
        }))
        break
      default:
        break
    }
    //call ga click
    ReactGA.modalview(pinUrl)
  }

  render () {
    return (<div />)
  }
}

ClickablePin.propTypes = {
  data: PropTypes.instanceOf(Immutable.Map),
}


ClickablePin.defaultProps = {}

export default ClickablePin
