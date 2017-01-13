import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import { Link } from '../Utils'
import { slugify } from '../../lib/utils'
import config from '../../../../config'
import BrowseMenu from './../Browse/BrowseMenu'
import SearchInput from './../Search/SearchBox'
import classSet from 'classnames'
import window from 'global/window'
import MobileDetect from 'mobile-detect'
import {
  FormattedMessage,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./SideBar.less')
}
@connect(({User, Event, Facebook}) => ({User, Event, Facebook}))
class SideBar extends React.Component {


  constructor (props) {
    super(props)
    this.state = {
      sidebarWidth: 250,
      // keep track of touching params
      touchIdentifier: null,
      touchStartX: null,
      touchStartY: null,
      touchCurrentX: null,
      touchCurrentY: null,

      // if touch is supported by the browser
      dragSupported: false,
    }

    this.overlayClicked = this.overlayClicked.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchMove = this.onTouchMove.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  componentDidMount () {
    const userAgent = (window.navigator && navigator.userAgent) || ''
    let agent = new MobileDetect(userAgent)
    const isMobile = agent.mobile()
    //this.onSetOpen(!isMobile)
    this.setState({
      isMobile,
      dragSupported: typeof window === 'object' && 'ontouchstart' in window
    })
  }

  onSetOpen (toggled) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.toggleSideBar(!toggled))
  }

  getUserConnectedButtons (user, type) {

    let authorized
    let planCode
    let canSponsorshipSubscription = false
    if (user) {
      authorized = user.get('authorized') && user.get('planCode')
      planCode = user.get('planCode')
      const subscriptionsStatus = user.get('subscriptionsStatus')
      if (subscriptionsStatus) {
        const subscriptions = subscriptionsStatus.get('subscriptions')
        canSponsorshipSubscription = Boolean(subscriptions && subscriptions.filter((a) => a.get('isActive') === 'yes' && a.get('inTrial') === 'no').size)
      }
    }
    if (!user) {
      return
    }

    let el
    switch (type) {
      case 'favoris':
        el = authorized && (
            <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)} to="/favoris"><i
              className="glyphicon glyphicon-plus"/><FormattedMessage id={ 'menu.favoris' }/></Link>
            </li>)
        break
      case 'last':
        el = authorized && (
            <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)} to="/last"><i
              className="zmdi zmdi-movie-alt"/><FormattedMessage id={ 'menu.last' }/></Link></li>)
        break
      case 'sponsorship':
        el = authorized && canSponsorshipSubscription && (
            <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)}
                      to="/parrainage"><i
              className="zmdi zmdi-star"/><FormattedMessage id={ 'menu.sponsorship' }/></Link>
            </li>)
        break
      case 'browse':
        el = authorized && <BrowseMenu/>
        break
      case 'history':
        el = authorized && (
            <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)} to="/history"><i
              className="fa fa-history"/><FormattedMessage id={ 'menu.history' }/></Link></li>)
        break
      case 'search':
        el = authorized && <SearchInput defaultOpen={true}/>
        break
      case 'profile':
        el = (
          <li><Link id="userButtonLink" activeClassName="active" onlyActiveOnIndex
                    onClick={(e) => ::this.onSetOpen(false)}
                    to={`/life/community/${user.get('_id')}/${slugify(user.get('nickname'))}`}><img
            src={user.get('picture')}
            alt="50x50"
            id="userButtonImg"
            className="icon-user"/><FormattedMessage id={ 'menu.profil' }/></Link></li>
        )
        break
      case 'compte':
        el = (
          <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)} to="/compte"><i
            className="fa fa-cog"/><FormattedMessage id={ 'menu.params' }/></Link></li>
        )
        break
      case 'logout':
        el = (
          <ul className="sidebar-nav">
            <li role="separator" className="divider"></li>
            <li><Link to="/" onClick={::this.logout}><i
              className="zmdi zmdi-lock-toggled"/><FormattedMessage id={ 'menu.logout' }/></Link></li>
            <li role="separator" className="divider"></li>
          </ul>
        )
        break
      default:
        el = ''
        break
    }

    return el
  }


  logout (e) {
    e.preventDefault()
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(OAuthActionCreators.logOut())
  }

  render () {
    const {
      props: {
        User,
        toggled
      }
    } = this

    const useTouch = this.state.dragSupported
    const rootProps = {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        //overflow: 'hidden'
      }
    }
    let dragHandle = null
    const user = User.get('user')
    const isTouching = this.isTouching()

    const overlayStyle = {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      visibility: 'hidden',
      transition: 'opacity .3s ease-out'
    }

    const contentStyle = {}

    const sidebarStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      transition: 'transform .3s ease-out',
      WebkitTransition: '-webkit-transform .3s ease-out',
      willChange: 'transform',
      overflowY: 'auto',
    }

    const dragHandleStyle = {
      zIndex: 1,
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      width: this.props.touchHandleWidth
    }

    sidebarStyle.left = 0
    sidebarStyle.transform = 'translateX(-100%)'
    sidebarStyle.WebkitTransform = 'translateX(-100%)'

    if (this.props.toggled) {
      // slide open sidebar
      sidebarStyle.transform = `translateX(0%)`
      sidebarStyle.WebkitTransform = `translateX(0%)`
      // show overlay
      overlayStyle.opacity = 1
      overlayStyle.visibility = 'visible'
    }

    if (isTouching) {
      const percentage = this.touchSidebarWidth() / this.state.sidebarWidth
      // slide toggled to what we dragged
      sidebarStyle.transform = `translateX(-${(1 - percentage) * 100}%)`
      sidebarStyle.WebkitTransform = `translateX(-${(1 - percentage) * 100}%)`
      // fade overlay to match distance of drag
      overlayStyle.opacity = percentage
      overlayStyle.visibility = 'visible'

      sidebarStyle.transition = 'none'
      sidebarStyle.WebkitTransition = 'none'
      overlayStyle.transition = 'none'
      contentStyle.transition = 'none'
    }
    else if (this.props.docked) {
//    show sidebar
      if (this.state.sidebarWidth !== 0) {
        sidebarStyle.transform = `translateX(0%)`
        sidebarStyle.WebkitTransform = `translateX(0%)`
      }
      // make space on the left/right side of the content for the sidebar
      //contentStyle.left = `${this.state.sidebarWidth}px`
    }

    if (useTouch) {
      if (toggled) {
        rootProps.onTouchStart = this.onTouchStart
        rootProps.onTouchMove = this.onTouchMove
        rootProps.onTouchEnd = this.onTouchEnd
        rootProps.onTouchCancel = this.onTouchEnd
        rootProps.onScroll = this.onScroll
      } else {
        dragHandle = (
          <div style={dragHandleStyle}
               onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove}
               onTouchEnd={this.onTouchEnd} onTouchCancel={this.onTouchEnd}/>)
      }
    }

    const overlay = (<div className="sidebar-overlay"
                          style={overlayStyle}
                          role="presentation"
                          tabIndex="0"
                          onClick={this.overlayClicked}/>)


    return (
      <div {...rootProps}>
        <div className="sidebar-wrapper" style={sidebarStyle}>
          <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
          <ul className="sidebar-nav">
            {this.getUserConnectedButtons(user, 'profile')}
            <li><Link activeClassName="active" onClick={(e) => ::this.onSetOpen(false)} to="/"><i
              className="zmdi zmdi-tv-play"/><FormattedMessage
              id={ `menu.streaming` }/>
            </Link></li>
            <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)} to="/life"><i
              className="glyphicon glyphicon-fire"/><FormattedMessage id={ 'menu.life' }/></Link></li>
            <li><Link activeClassName="active" onlyActiveOnIndex onClick={(e) => ::this.onSetOpen(false)}
                      to="/life/community"><i
              className="zmdi zmdi-accounts-list-alt"/><FormattedMessage id={ 'menu.community' }/></Link></li>
            {this.getUserConnectedButtons(user, 'favoris')}
            {this.getUserConnectedButtons(user, 'last')}
            {this.getUserConnectedButtons(user, 'history')}
            {this.getUserConnectedButtons(user, 'sponsorship')}
            {this.getUserConnectedButtons(user, 'compte')}
          </ul>
          {this.getUserConnectedButtons(user, 'logout')}
        </div>
        {overlay}
        <div style={contentStyle} className={classSet({contentdock: true, docked: this.props.docked})}>
          {dragHandle}
          {this.props.children}
        </div>
      </div>
    )
  }

  // calculate the sidebarWidth based on current touch info
  touchSidebarWidth () {
    if (this.props.toggled && this.state.touchStartX < this.state.sidebarWidth) {
      if (this.state.touchCurrentX > this.state.touchStartX) {
        return this.state.sidebarWidth
      }
      return this.state.sidebarWidth - this.state.touchStartX + this.state.touchCurrentX
    }
    return Math.min(this.state.touchCurrentX, this.state.sidebarWidth)
  }


  isTouching () {
    return this.state.touchIdentifier !== null
  }

  overlayClicked () {
    if (this.props.toggled) {
      this.onSetOpen(false)
    }
  }

  onTouchStart (ev) {
    // filter out if a user starts swiping with a second finger
    if (!this.isTouching()) {
      const touch = ev.targetTouches[0]
      this.setState({
        touchIdentifier: touch.identifier,
        touchStartX: touch.clientX,
        touchStartY: touch.clientY,
        touchCurrentX: touch.clientX,
        touchCurrentY: touch.clientY,
      })
    }
  }

  onTouchMove (ev) {
    if (this.isTouching()) {
      for (let ind = 0; ind < ev.targetTouches.length; ind++
      ) {
        // we only care about the finger that we are tracking
        if (ev.targetTouches[ind].identifier === this.state.touchIdentifier) {
          this.setState({
            touchCurrentX: ev.targetTouches[ind].clientX,
            touchCurrentY: ev.targetTouches[ind].clientY,
          })
          break
        }
      }
    }
  }

  onTouchEnd () {
    if (this.isTouching()) {
      // trigger a change to toggled if sidebar has been dragged beyond dragToggleDistance
      const touchWidth = this.touchSidebarWidth()

      if (this.props.toggled && touchWidth < this.state.sidebarWidth - this.props.dragToggleDistance ||
        !this.props.toggled && touchWidth > this.props.dragToggleDistance) {
        this.onSetOpen(!this.props.toggled)
      }

      this.setState({
        touchIdentifier: null,
        touchStartX: null,
        touchStartY: null,
        touchCurrentX: null,
        touchCurrentY: null,
      })
    }
  }
}


SideBar.propTypes = {
  // styles
  styles: React.PropTypes.shape({
    sidebar: React.PropTypes.object,
    dragHandle: React.PropTypes.object,
  }),
  // boolean if sidebar should be docked
  docked: React.PropTypes.bool,
  // boolean if sidebar should slide toggled
  toggled: React.PropTypes.bool,
  // max distance from the edge we can start touching
  touchHandleWidth: React.PropTypes.number,
  // distance we have to drag the sidebar to toggle toggled state
  dragToggleDistance: React.PropTypes.number
}


SideBar.defaultProps = {
  docked: false,
  toggled: false,
  touchHandleWidth: 20,
  dragToggleDistance: 50,
  styles: {}
}


export default withRouter(SideBar)
