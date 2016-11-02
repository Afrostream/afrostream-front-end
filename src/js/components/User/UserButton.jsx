import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import SearchInput from './../Search/SearchBox'
import FavoritesButton from './../Favorites/FavoritesButton'
import BrowseButton from './../Browse/BrowseButton'
import { getI18n } from '../../../../config/i18n'
import { Link } from 'react-router'

if (process.env.BROWSER) {
  require('./UserButton.less')
}

@connect(({User, OAuth, Event}) => ({User, OAuth, Event}))
class UserButton extends React.Component {

  logOut () {
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
        OAuth
      }
    } = this

    const token = OAuth.get('token')
    const user = User.get('user')

    if (token) {
      if (user) {
        return (
          <ul className="nav">
            <li>
              <Link to="compte" role="button" onClick={::this.toggleSideBar} id="userButton"
                    className="btn-user">
                <img src={user.get('picture')}
                     alt="user-button"
                     id="userButtonImg"
                     className="icon-user"/>
              </Link>
            </li>
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
      <ul className="nav">
        <li className="hidden-xs">
          <button role="button" className="btn-signup pull-right" {...inputSignupAction}>
            <span>{getI18n(params.lang).signup.title}</span>
          </button>
        </li>
        <li>
          <button role="button" className="btn-signin pull-right"  {...inputSigninAction}>
            <span>{getI18n(params.lang).signin.title}</span>
          </button>
        </li>
      </ul>)
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

    dispatch(EventActionCreators.toggleSideBar(false))
  }

}

export default UserButton
