import React from 'react'
import { connect } from 'react-redux'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import { Link } from 'react-router'
import config from '../../../../config'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

const {featuresFlip} = config

if (process.env.BROWSER) {
  require('./SideBar.less')
}
@connect(({User, Event, Facebook}) => ({User, Event, Facebook}))
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

  renderFriends () {

    const {
      props: {
        Facebook
      }
    } = this

    const friendList = Facebook.get('friendList')
    if (!friendList) {
      return
    }

    return <div className="friends-list">
      <h5>Mes amis sur Afrostream</h5>
      { friendList.map((friend)=> {
        let picture
        let id
        let name
        if (friend.get('facebook')) {
          let fbData = friend.get('facebook')
          picture = `//graph.facebook.com/${fbData.get('id')}/picture`
          name = friend.get('nickname') || fbData.get('nickname')
          id = fbData.get('id')
        } else {
          picture = `/avatar/${friend.get('nickname')}`
          name = friend.get('nickname')
          id = friend.get('_id')
        }

        return <img src={picture}
                    key={`fb-friend-${id}`}
                    alt="50x50"
                    id="userButtonImg"
                    className="icon-user"/>
      }).toJS()}</div>
  }

  render () {
    const {
      props: {
        User,
        Event
      }
    } = this


    const user = User.get('user')
    const toggled = Event.get('sideBarToggled')
    return (
      <Drawer open={toggled}>
        <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
        <Link to="/compte"><MenuItem>Mon compte</MenuItem></Link>
        {this.getUserConnectedButtons(user, 'favorites')}
        {this.getUserConnectedButtons(user, 'sponsorship')}
        <a href="#" onClick={::this.logout}><MenuItem>Se deconnecter</MenuItem></a>
        {this.renderFriends()}
      </Drawer>
    )
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
      case 'favorites':
        el = (<Link to="/favoris"><MenuItem>Mes favoris</MenuItem></Link>)
        break
      case 'sponsorship':
        el = featuresFlip.sponsorship && canSponsorshipSubscription && (
            <Link to="/parrainage" className="sidebar-nav_yellow"><MenuItem>Parrainer</MenuItem></Link>)
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
