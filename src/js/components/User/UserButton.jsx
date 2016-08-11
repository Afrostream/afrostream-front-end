import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import * as OAuthActionCreators from '../../actions/oauth'
import * as UserActionCreators from '../../actions/user'
import * as EventActionCreators from '../../actions/event'
import { Link } from 'react-router'
import SearchInput from './../Search/SearchBox'
import FavoritesButton from './../Favorites/FavoritesButton'
import BrowseButton from './../Browse/BrowseButton'
import { getI18n } from '../../../../config/i18n'
if (process.env.BROWSER) {
  require('./UserButton.less')
}

@connect(({User, OAuth, Event}) => ({User, OAuth, Event}))
class UserButton extends React.Component {

  //componentDidMount () {
  //  const {
  //    props: {
  //      dispatch
  //    }
  //  } = this
  //
  //  dispatch(UserActionCreators.getProfile())
  //}

  logOut () {
    const {
      props: {
        dispatch
      }
    } = this
    dispatch(OAuthActionCreators.logOut())
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
      case 'search':
        el = (<li className="pull-right">
          <SearchInput/>
        </li>)
        break
      case 'favorites':
        el = (<li className="pull-right">
          <FavoritesButton/>
        </li>)
        break
      case 'browse':
        el = (
          <BrowseButton/>
        )
        break
      default:
        el = ''
        break
    }

    return el
  }

  render () {
    const {
      props: {
        User,
        OAuth
      }
    } = this

    const token = OAuth.get('token')
    const user = User.get('user')

    if (token) {
      if (user) {
        return (
          <ul className="nav navbar-nav navbar-right">
            <li className="pull-right">
              <button role="button" onClick={::this.toggleSideBar} id="userButton"
                      className="btn-xs btn-user">
                <span>Mon profil</span>
                <img src={user.get('picture')}
                     alt="50x50"
                     id="userButtonImg"
                     className="icon-user"/>
              </button>
            </li>
            {this.getUserConnectedButtons(user, 'browse')}
            {this.getUserConnectedButtons(user, 'search')}

          </ul>
        )
      }
      else {
        return this.getLoginState()
      }
    } else {
      return this.getLoginState()
    }
  }

  getLoginState () {

    const {
      props: {
        params
      }
    } = this

    const inputSigninAction = {
      onClick: event => ::this.showLock('showSignin')
    }
    const inputSignupAction = {
      onClick: event => ::this.showLock('showSignup')
    }

    return (
      <div className="nav navbar-nav navbar-right">
        <li className="pull-right hidden-xs">
          <button role="button" className="btn-xs btn-signup pull-right" {...inputSignupAction}>
            <span>{getI18n(params.lang).signup.title}</span>
          </button>
        </li>
        <li className="pull-right">
          <button role="button" className="btn-xs btn-signin pull-right"  {...inputSigninAction}>
            <span>{getI18n(params.lang).signin.title}</span>
          </button>
        </li>
      </div>)
  }

  showLock (target) {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(ModalActionCreators.open({target}))
  }

  toggleSideBar () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(EventActionCreators.toggleSideBar())
  }

}

export default UserButton
