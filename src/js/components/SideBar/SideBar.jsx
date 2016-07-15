import React from 'react'
import { connect } from 'react-redux'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import { Link } from 'react-router'
import config from '../../../../config'

const {featuresFlip} = config

if (process.env.BROWSER) {
  require('./SideBar.less')
}

@connect(({User, Event}) => ({User, Event}))
class SideBar extends React.Component {

  componentDidMount () {
    $(document).on('mouseup', this.toggleSideBar.bind(this))
  }

  componentWillUnMount () {
    $(document).off('mouseup', this.toggleSideBar.bind(this))
  }

  toggleSideBar (e) {
    const {
      props: {
        Event
      }
    } = this

    const toggled = Event.get('sideBarToggled')
    let userBtn = (e.target.id == 'userButton' || e.target.id == 'userButtonImg')
    if (toggled && !userBtn) {
      this.close()
    }
  }

  render () {
    const {
      props: {
        User,
      }
    } = this


    const user = User.get('user')

    return (
      <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
          <li><Link to="/compte">Mon compte</Link></li>
          {this.getUserConnectedButtons(user, 'favorites')}
          {this.getUserConnectedButtons(user, 'sponsorship')}
          <li role="separator" className="divider"></li>
          <li><a href="#" onClick={::this.logout}>Se deconnecter</a></li>
        </ul>
      </div>
    )
  }

  getUserConnectedButtons (user, type) {

    let planCode

    if (user) {
      planCode = user.get('planCode')
    }

    if (!planCode) {
      return ''
    }
    let el
    switch (type) {
      case 'favorites':
        el = ( <li><Link to="/favoris">Mes favoris</Link></li>)
        break
      case 'sponsorship':
        el = featuresFlip.sponsorship && (
            <li><Link to="/parrainage" className="sidebar-nav_yellow">Parrainer</Link></li>)
        break
      default:
        el = ''
        break
    }

    return el
  }

  close () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.toggleSideBar())
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
}

export default SideBar
