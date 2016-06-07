import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./SignUpButton.less')
}

@connect(({User}) => ({User}))
class SignUpButton extends React.Component {

  render () {
    return (<button className={this.props.className} type=" button" onClick={::this.showLock}
                    dangerouslySetInnerHTML={{__html:  this.props.label}}/>)
  }

  showLock () {
    const {
      props: {
        User,
        history,
        dispatch,
        router
      }
    } = this

    const user = User.get('user')
    if (user) {
      return router.push(this.props.to)
    }

    dispatch(ModalActionCreators.open({target: 'showSignup', donePath: this.props.to}))
  }

}

SignUpButton.propTypes = {
  label: React.PropTypes.string,
  className: React.PropTypes.string,
  to: React.PropTypes.string
}

SignUpButton.defaultProps = {
  label: '',
  className: 'subscribe-button',
  to: '/'
}

SignUpButton.propTypes = {
  history: React.PropTypes.object
}

export default withRouter(SignUpButton)
