import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import * as OAuthActionCreators from '../../actions/oauth'
import * as EventActionCreators from '../../actions/event'
import SearchInput from './../Search/SearchBox'
import FavoritesButton from './../Favorites/FavoritesButton'
import BrowseButton from './../Browse/BrowseButton'
import { Link } from '../Utils'
import {
  FormattedMessage
} from 'react-intl'

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
        return <ul className="nav"/>
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

    return (
      <ul className="nav">
        <li>
          <button role="button" className="btn-signin pull-right"  {...inputSigninAction}>
            <FormattedMessage id="signin.title"/>
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
