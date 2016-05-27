import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'
import * as UserActionCreators from '../../actions/user'
import * as IntercomActionCreators from '../../actions/intercom'
import { getI18n } from '../../../../config/i18n'
import { Link } from 'react-router'
import _ from 'lodash'

@connect(({User}) => ({User}))
class PaymentError extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    message: React.PropTypes.string,
    link: React.PropTypes.string,
    linkMessage: React.PropTypes.string,
    links: React.PropTypes.array
  }

  static defaultProps = {
    title: '',
    message: '',
    link: '/',
    linkMessage: '',
    links: []
  }

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
    return _.map(links, (link) => <Link to={link.target}>{link.label} {link.image ?
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
        <h3>{this.props.title}</h3>
        <h4>{this.props.message}</h4>
        <p className="error">
          {this.renderLinks()}
          <a href={this.props.link}>{this.props.linkMessage}</a>
        </p>
      </div>
    )
  }

}

export default PaymentError
