import React, { PropTypes, Component } from 'react'
import ReactDOM from'react-dom'
import { prepareRoute } from '../../decorators'
import { connect } from 'react-redux'
import * as PlayerActionCreators from '../../actions/player'
import * as LifeActionCreators from '../../actions/life'
import * as EventActionCreators from '../../actions/event'
import * as ModalActionCreators from '../../actions/modal'
import window from 'global/window'
import config from '../../../../config/'
import classSet from 'classnames'
import LifePost from './LifePost'
import moment from 'moment'
import LifeNavigation from '../Life/LifeNavigation'
import Immutable from 'immutable'
import ReactList from 'react-list'
import { withRouter } from 'react-router'
import { isElementInViewPort } from '../../lib/utils'

const {images} =config

if (process.env.BROWSER) {
  require('./LifeList.less')
}
@prepareRoute(async function ({store, params:{themeId}}) {
  return await Promise.all([
    store.dispatch(EventActionCreators.pinHeader(true)),
    store.dispatch(LifeActionCreators.fetchThemes(themeId))
  ])
})
@connect(({Life, User}) => ({Life, User}))
class LifeList extends Component {

  constructor (props) {
    super(props)
  }

  componentDidMount () {
    //window.addEventListener('scroll', this.onScroll.bind(this))
  }

  componentWillUnmount () {
    //window.removeEventListener('scroll', this.onScroll.bind(this))
  }

  onScroll () {
    if (!this.didScroll) {
      this.didScroll = true
      setTimeout(()=> {
        this._scrollPage()
      }, 60)
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
        dispatch
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

  getPins () {
    const {
      props: {
        Life,
        themeId,
        pins
      }
    } = this

    const lifeTheme = Life.get(`life/themes/${themeId}`)

    return pins || (lifeTheme && lifeTheme.get('pins'))
  }

  renderInfiniteItem (index, key) {
    const pinsList = this.getPins()
    const data = pinsList.get(index)
    return this.renderItem({data, index, key})

  }

  renderItem ({data, key, index, style}) {
    const {
      props: {
        highlightFirst
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


    const elSize = highlightFirst ? sizes[Math.min(index, 1)] : sizes[1]
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
      'first': highlightFirst && !index,
      'premium': isPremium
    }

    const cardTypeIcon = {
      'card-bubble': true,
      'card-bubble-type': true
    }

    brickStyle[type] = true
    cardTypeIcon[type] = true

    return (
      <article className={classSet(brickStyle)} {...{key}}>
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
              {!index && <div className="card-bubbles">
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

  render () {
    const {
      props: {
        virtual,
        themeId
      }
    } = this
    const pinsList = this.getPins()
    if (!pinsList) {
      return
    }

    const classList = {
      'life-list': true,
      'flat': !virtual,
      'virtual': virtual
    }

    return (<div className={classSet(classList)}>
      {!virtual && pinsList.map((data, index) =>this.renderItem({
        data,
        index,
        key: `life-list-theme-${themeId}-${index}`
      })).toJS()}
      {virtual && <ReactList
        ref="react-pins-list"
        itemRenderer={::this.renderInfiniteItem}
        length={pinsList.size}
        type={'uniform'}
      />}
    </div>)
  }
}

LifeList.propTypes = {
  highlightFirst: PropTypes.bool,
  virtual: PropTypes.bool,
  pins: PropTypes.instanceOf(Immutable.List),
  themeId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}


LifeList.defaultProps = {
  highlightFirst: true,
  virtual: true,
  pins: null,
  themeId: ''
}


export default withRouter(LifeList)
