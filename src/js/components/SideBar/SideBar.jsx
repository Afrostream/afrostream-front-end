import React from 'react'
import { connect } from 'react-redux'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import * as FBActionCreators from '../../actions/facebook'
import { Link } from 'react-router'
import config from '../../../../config'

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
        Event,
        User,
        Facebook,
        dispatch
      }
    } = this

    const user = User.get('user')
    const friendList = Facebook.get('friendList')
    const toggled = Event.get('sideBarToggled')
    let userBtn = (e.target.id == 'userButton' || e.target.id == 'userButtonImg')
    if (toggled && !userBtn) {
      this.close()
    }

    if (!toggled && !friendList && user) {
      dispatch(FBActionCreators.getFriendList())
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
        User
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
          {this.renderFriends()}
        </ul>

      </div>
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
        el = ( <li><Link to="/favoris">Mes favoris</Link></li>)
        break
      case 'sponsorship':
        el = featuresFlip.sponsorship && canSponsorshipSubscription && (
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
