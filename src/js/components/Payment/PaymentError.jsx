import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as UserActionCreators from '../../actions/user'
import * as IntercomActionCreators from '../../actions/intercom'
import { Link, I18n } from '../Utils'
import _ from 'lodash'

import {
  intlShape,
  injectIntl
} from 'react-intl'

@connect(({User}) => ({User}))
class PaymentError extends I18n {

  componentWillUnmount () {
    const {
      props: {
        dispatch
      }
    } = this
    dispatch(IntercomActionCreators.removeIntercom())
  }

  renderLinks () {
    const {
      props: {
        links
      }
    } = this
    return <div dangerouslySetInnerHTML={{__html: this.getTitle(links)}}/>
  }

  logOut () {
    const {
      props: {
        dispatch
      }
    } = this

    dispatch(UserActionCreators.logOut())
  }

  render () {

    return (
      <div className="payment-error">
        <h3> {this.getTitle(this.props.title)}</h3>
        <h4>{this.getTitle(this.props.message)}</h4>
        <div className="error">
          {this.renderLinks()}
          <Link to={this.props.link}>
            {this.getTitle(this.props.linkMessage)}
          </Link>
        </div>
      </div>
    )
  }

}

PaymentError.propTypes = {
  title: React.PropTypes.string,
  message: React.PropTypes.string,
  link: React.PropTypes.string,
  linkMessage: React.PropTypes.string,
  links: React.PropTypes.string,
  intl: intlShape.isRequired
}

PaymentError.defaultProps = {
  title: '',
  message: '',
  link: '/',
  linkMessage: '',
  links: ''
}

export default injectIntl(PaymentError)
