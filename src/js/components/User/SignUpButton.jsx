import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as ModalActionCreators from '../../actions/modal'
import { withRouter } from 'react-router'
import { I18n } from '../Utils'
import {
  injectIntl,
  FormattedHTMLMessage,
} from 'react-intl'

if (process.env.BROWSER) {
  require('./SignUpButton.less')
}

@connect(({User}) => ({User}))
class SignUpButton extends I18n {

  render () {
    return (<button className={`${this.props.className} subscribe-button`}
                    type="button"
                    title={this.getTitle(this.props.title, this.props.values)}
                    onClick={::this.showLock}>
      <FormattedHTMLMessage id={this.props.label}/>
    </button>)
  }

  showLock () {
    const {
      props: {
        User,
        dispatch,
        router
      }
    } = this

    const user = User.get('user')
    if (user) {
      return router.push(this.props.to)
    }

    dispatch(ModalActionCreators.open({
      target: this.props.target,
      donePath: this.props.to,
      cb: this.props.cb
    }))
  }

}

SignUpButton.propTypes = {
  target: React.PropTypes.string,
  label: React.PropTypes.string,
  title: React.PropTypes.string,
  values: React.PropTypes.obj,
  className: React.PropTypes.string,
  to: React.PropTypes.string,
  cb: React.PropTypes.func
}

SignUpButton.defaultProps = {
  target: 'showSignup',
  label: '',
  title: '',
  values: {},
  className: '',
  to: '/',
  cb: null
}

SignUpButton.propTypes = {
  history: React.PropTypes.object
}

export default withRouter(injectIntl(SignUpButton))
