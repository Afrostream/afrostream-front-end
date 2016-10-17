import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import { Link } from 'react-router'
import config from '../../../../config'
import BrowseMenu from './../Browse/BrowseMenu'
import SearchInput from './../Search/SearchBox'
import window from 'global/window'

const {featuresFlip} = config

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
    this.setState({
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

    let planCode
    let canSponsorshipSubscription = false
    if (user) {
      planCode = user.get('planCode')
      const subscriptionsStatus = user.get('subscriptionsStatus')
      if (subscriptionsStatus) {
        const subscriptions = subscriptionsStatus.get('subscriptions')
        canSponsorshipSubscription = Boolean(subscriptions && subscriptions.filter((a) => a.get('isActive') === 'yes' && a.get('inTrial') === 'no').size)
      }
    }

    if (!planCode) {
      return ''
    }
    let el
    switch (type) {
      case 'favoris':
        el = (<li><Link to="/favoris"><i className="zmdi zmdi-favorite"/>Mes Favoris</Link></li>)
        break
      case 'last':
        el = (<li><Link to="/last"><i className="zmdi zmdi-movie"/>Derniers ajouts</Link></li>)
        break
      case 'community':
        el = (<li><Link to="/favoris"><i className="zmdi zmdi-favorite"/>Mes Favoris</Link></li>)
        break
      case 'sponsorship':
        el = featuresFlip.sponsorship && canSponsorshipSubscription && (
            <li><Link to="/parrainage"><i className="zmdi zmdi-ticket-star"/>Parrainer</Link></li>)
        break
      case 'browse':
        el = <BrowseMenu/>
        break
      case 'search':
        el = <SearchInput defaultOpen={true}/>
        break
      case 'compte':
        el = (<li><Link to="/compte"><img src={user.get('picture')}
                                          alt="50x50"
                                          id="userButtonImg"
                                          className="icon-user"/> Mon profil</Link></li>)
        break
      case 'logout':
        el = (<ul className="sidebar-nav">
          <li role="separator" className="divider"></li>
          <li><Link to="/" onClick={::this.logout}><i className="zmdi zmdi-lock-toggled"/>Se deconnecter</Link></li>
          <li role="separator" className="divider"></li>
        </ul>)
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

    const useTouch = this.state.dragSupported;
    const rootProps = {}
    let dragHandle = null
    const user = User.get('user')
    const isTouching = this.isTouching()

    const overlayStyle = {}

    const sidebarStyle = {}

    const dragHandleStyle = {
      zIndex: 1,
      position: 'fixed',
      top: 0,
      bottom: 0,
      right: 0,
      marginRight: -this.props.touchHandleWidth,
      width: this.props.touchHandleWidth
    }

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
      <div className="sidebar-wrapper" style={sidebarStyle}  {...rootProps}>
        <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
        <ul className="sidebar-nav">
          {this.getUserConnectedButtons(user, 'compte')}
          <li><Link to="/"><i className="zmdi zmdi-tv-play"/>{user ? 'Streaming' : 'Accueil'}</Link></li>
          <li><Link to="/life"><i className="zmdi zmdi-accounts"/>Actualité</Link></li>
          <li><Link to="/life"><i className="zmdi zmdi-accounts"/>Communauté</Link></li>
          <li><Link to="/life/experience"><i className="zmdi zmdi-gamepad"/>Expérience</Link></li>
          {this.getUserConnectedButtons(user, 'favoris')}
          {this.getUserConnectedButtons(user, 'last')}
          {this.getUserConnectedButtons(user, 'sponsorship')}
        </ul>
        {this.getUserConnectedButtons(user, 'logout')}
        {dragHandle}
        {overlay}
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
      this.props.onSetOpen(false)
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
  touchHandleWidth: 10,
  dragToggleDistance: 50,
  styles: {}
}


export default withRouter(SideBar)
