import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import { Link } from 'react-router'
import config from '../../../../config'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import BrowseMenu from './../Browse/BrowseMenu'
import Divider from 'material-ui/Divider'
import SearchInput from './../Search/SearchBox'

const {featuresFlip} = config

if (process.env.BROWSER) {
  require('./SideBar.less')
}
@connect(({User, Event, Facebook}) => ({User, Event, Facebook}))
class SideBar extends React.Component {

  componentDidMount () {
    //$(document).on('mouseup', this.toggleSideBar.bind(this))
  }

  componentWillUnMount () {
    //$(document).off('mouseup', this.toggleSideBar.bind(this))
  }

  toggleSideBar (e) {
    const {
      props: {
        Event
      }
    } = this

    const toggled = Event.get('sideBarToggled')
    let userBtn = (e.target.id == 'userButton' || e.target.id == 'userButtonImg' || e.target.nodeName === 'INPUT')
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
        Event,
        router
      }
    } = this


    const user = User.get('user')
    const toggled = user && Event.get('sideBarToggled')
    return (
      <div id="sidebar-wrapper">
        <img src={`/images/logo.png`} alt="afrostream-logo" className="logo"/>
        <ul className="sidebar-nav">
          {this.getUserConnectedButtons(user, 'search')}
          {this.getUserConnectedButtons(user, 'compte')}
          <li><Link to="/"><i className="zmdi zmdi-home"/>Accueil</Link></li>
          <li><Link to="/life"><i className="zmdi zmdi-accounts"/>Communauté</Link></li>
          <li><Link to="/favoris"><i className="zmdi zmdi-favorite"/>Mes Favoris</Link></li>
          <li><Link to="/last"><i className="zmdi zmdi-movie"/>Derniers ajouts</Link></li>
          <li role="separator" className="divider"></li>
          {this.getUserConnectedButtons(user, 'sponsorship')}
        </ul>
        <ul className="sidebar-nav">
          <li role="separator" className="divider"></li>
          <li><Link to="/" onClick={::this.logout}><i className="zmdi zmdi-lock-open"/>Se deconnecter</Link></li>
          <li role="separator" className="divider"></li>
          {/*{this.renderFriends()}*/}
        </ul>
        {this.getUserConnectedButtons(user, 'browse')}
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
        el = (<li><Link to="/favoris">Mes favoris</Link ></li>)
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
export default withRouter(SideBar)
