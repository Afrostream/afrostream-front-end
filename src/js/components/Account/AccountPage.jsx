import React from 'react'
import { prepareRoute } from '../../decorators'
import * as BillingActionCreators from '../../actions/billing'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getI18n } from '../../../../config/i18n'
import AccountSubscriptions from './AccountSubscriptions'
import AccountSocial from './AccountSocial'
import AccountPassword from './AccountPassword'
import AccountProfil from './AccountProfil'


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
        <h1>{getI18n().account.header}</h1>
        <AccountProfil profile="profile"/>
        <AccountProfil profile="social"/>
        <AccountSocial />
        <AccountProfil profile="player"/>
        <AccountSubscriptions />
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

export default AccountPage
