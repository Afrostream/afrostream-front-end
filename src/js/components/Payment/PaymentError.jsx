import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as UserActionCreators from '../../actions/user'
import * as IntercomActionCreators from '../../actions/intercom'
import { Link } from 'react-router'
import _ from 'lodash'

import {
  intlShape,
  injectIntl,
  FormattedMessage
} from 'react-intl'

@connect(({User}) => ({User}))
class PaymentError extends React.Component {

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
        <FormattedMessage tagName="h3" id={this.props.title}/>
        <FormattedMessage tagName="h4" id={this.props.message}/>
        <p className="error">
          {this.renderLinks()}
          <a href={this.props.link}>
            <FormattedMessage id={this.props.linkMessage}/>
          </a>
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
