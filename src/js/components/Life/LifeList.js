import React, { PropTypes, Component } from 'react'
import ReactDOM from'react-dom'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as PlayerActionCreators from '../../actions/player'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'

import config from '../../../../config/'
import classSet from 'classnames'
import LifePost from './LifePost'
import moment from 'moment'
import LifeNavigation from '../Life/LifeNavigation'
import Immutable from 'immutable'
import { withRouter } from 'react-router'

const {images} =config

if (process.env.BROWSER) {
  require('./LifeList.less')
}
@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(LifeActionCreators.fetchThemes()),
    store.dispatch(LifeActionCreators.fetchPins({startIndex: 0, stopIndex: 3}))
  ])
})
@connect(({Life, User}) => ({Life, User}))
class LifeList extends Component {

  constructor (props, context) {
    super(props, context)
  }

  isRowLoaded ({index}) {
    const {
      props: {
        Life
      }
    } = this

    const dataList = Life.get('life/pins')
    const sortedList = dataList.sort((a, b) => new Date(a.get('date')).getTime() < new Date(b.get('date')).getTime())
    return !!sortedList.get(index)
  }

  loadMoreRows ({startIndex, stopIndex}) {
    const {
      props: {
        dispatch
      }
    } = this

    return dispatch(LifeActionCreators.fetchPins({startIndex, stopIndex}))
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
        dispatch
      }
    } = this
    const pinRole = data.get('role')
    const acl = this.validRole(pinRole)

    if (!acl) {
      e.preventDefault()
      const modalRole = this.targetRole()
      return dispatch(ModalActionCreators.open({target: `life-${modalRole}`, donePath: '/life'}))
    }

    switch (data.get('type')) {
      case 'video':
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

    }
  }

  //renderItem (index, key) {
  renderItem ({key, index, style}) {
    const {
      props: {
        Life
      }
    } = this

    let sizes = [
      {
        width: 900,
        height: 300
      },
      {
        width: 350,
        height: 300
      }
    ]

    const dataList = Life.get('life/pins')
    const sortedList = dataList.sort((a, b) => new Date(a.get('date')).getTime() < new Date(b.get('date')).getTime())

    const data = sortedList.get(index)
    const elSize = sizes[Math.min(index, 1)]
    const type = data.get('type')
    const baseUrl = 'data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    const thumb = data.get('image')
    let imageUrl = data.get('imageUrl') || baseUrl
    if (thumb) {
      const path = thumb.get('path')
      if (path) {
        imageUrl = `${images.urlPrefix}${path}?&crop=face&fit=clip&w=${elSize.width}&q=${config.images.quality}&fm=${config.images.type}`
      }
    }

    const imageStyles = {backgroundImage: `url(${imageUrl})`}

    const pinnedDate = moment(data.get('date')).format('L')
    const pinnedUser = data.get('user')
    const themes = data.get('themes')
    const pinRole = data.get('role')
    const isPremium = pinRole === 'premium' || pinRole === 'vip'

    const brickStyle = {
      'brick': true,
      'masonry-brick': true,
      'first': !index,
      'premium': isPremium
    }

    const cardTypeIcon = {
      'card-bubble': true,
      'card-bubble-type': true
    }

    brickStyle[type] = true
    cardTypeIcon[type] = true

    return (
      <article className={classSet(brickStyle)} key={`data-brick-${index}`}>
        <a href={data.get('originalUrl')} target="_blank" onClick={
          (e) =>::this.clickHandler(e, data)
        }>
          <div className="brick-content">
            <div className="brick-background">
              <div className="brick-background_image" style={imageStyles}/>
              <div className="brick-background_mask"/>
              {isPremium && (<div className="premium-flag">
                <div className="premium-flag__header-label"> Accès {pinRole}</div>
              </div>)}
            </div>
            <div className="card-body">
              <div className="card-bubbles">
                {pinnedUser && <div className="card-bubble card-bubble-user">
                  <img src={pinnedUser.get('picture')}
                       alt="user-button"
                       className="icon-user"/>
                </div>}
                <div className={classSet(cardTypeIcon)}/>
              </div>
              <div className="card-meta">
                {themes.map((theme, a)=><div key={`data-card-theme-${a}`}
                                             className="card-theme">{theme.get('label')}</div>)}
              </div>
              <div className="card-info">
                <div target="_self">{data.get('title')}</div>
              </div>
              <div className="card-description">
                {data.get('description')}
              </div>
              <div className="card-date">
                {`${pinnedDate}`}
                {pinnedUser && ` - ${pinnedUser.get('nickname')}`}
              </div>
            </div>
          </div>
        </a>
      </article>
    )
  }

  renderContent (dataList, resourceCount) {
    if (!dataList.size) {
      return
    }
    return [
      <div key="masonry-pin-list" className="masonry-list">
        {
          dataList.map((el, index) => {
              return this.renderItem({index})
            }
          ).toJS()
        }
      </div>,
      <LifePost key="life-post-sticky"/>]
  }

  render () {
    const {
      props: {
        router,
        Life, children
      }
    } = this

    const isOnLife = router.isActive('life')

    if (children) {
      return children
    }

    let dataList = Life.get('life/pins')
    let resourceCount = Life.get('life/pins/resourceCount')

    return (
      <div className="row-fluid life-list brand-grey">
        <LifeNavigation />
        <div className="container-fluid container-no-padding brand-grey">
          {dataList && this.renderContent(dataList, resourceCount)}
        </div>
      </div>
    )
  }
}

export default withRouter(LifeList)
