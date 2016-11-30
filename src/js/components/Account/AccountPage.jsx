import React from 'react'
import { prepareRoute } from '../../decorators'
import * as BillingActionCreators from '../../actions/billing'
import { connect } from 'react-redux'
import AccountSubscriptions from './AccountSubscriptions'
import AccountSocial from './AccountSocial'
import AccountProfil from './AccountProfil'
import {
  FormattedMessage,
  intlShape,
  injectIntl
} from 'react-intl'

if (process.env.BROWSER) {
  require('./AccountPage.less')
}

@prepareRoute(async function ({store}) {
  return await Promise.all([
    store.dispatch(BillingActionCreators.getSubscriptions())
  ])
})
@connect(({User}) => ({User}))
class AccountPage extends React.Component {

  state = {cardNumber: null}

  constructor (props, context) {
    super(props, context)
  }

  renderChilds () {
    const {
      props: {
        User, children
      }
    } = this

    const user = User.get('user')
    if (!user) {
      return 'no user found'
    }

    if (children) {
      return children
    }

    return (
      <div>
        <FormattedMessage tagName="h1"
                          id={ 'account.header' }/>
        <AccountProfil profile="profile" {...this.props}/>
        <AccountProfil profile="social" {...this.props}/>
        <AccountSocial />
        <AccountProfil profile="player" {...this.props}/>
        <AccountSubscriptions {...this.props}/>
      </div>
    )
  }

  render () {
    return (
      <div className="row-fluid brand-bg">
        <div className="container brand-bg account-page">
          {this.renderChilds()}
        </div>
      </div>)
  }
}

AccountPage.propTypes = {
  intl: intlShape.isRequired
}

export default injectIntl(AccountPage)
