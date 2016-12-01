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
    return _.map(links, (link, key) => <Link to={link.target} key={`payment-error-${key}`}>{link.label} {link.image ?
      <img src={link.image} width="60" className="img-responsive"/> : ''}</Link>)
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
        <p className="error">
          {this.renderLinks()}
          <Link to={this.props.link}>
            {this.getTitle(this.props.linkMessage)}
          </Link>
        </p>
      </div>
    )
  }

}

PaymentError.propTypes = {
  title: React.PropTypes.string,
  message: React.PropTypes.string,
  link: React.PropTypes.string,
  linkMessage: React.PropTypes.string,
  links: React.PropTypes.array,
  intl: intlShape.isRequired
}

PaymentError.defaultProps = {
  title: '',
  message: '',
  link: '/',
  linkMessage: '',
  links: []
}

export default injectIntl(PaymentError)
