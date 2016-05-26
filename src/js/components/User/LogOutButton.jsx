import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as UserActionCreators from '../../actions/user'

if (process.env.BROWSER) {
  require('./LogOutButton.less')
}

@connect(({User}) => ({User}))
class LogOutButton extends React.Component {

  logOut () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(UserActionCreators.logOut())
  }

  render () {
    return (<button
      className="logout-button"
      onClick={::this.logOut}>se déconnecter
    </button>)
  }
}

export default LogOutButton
