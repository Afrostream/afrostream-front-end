import React from 'react'
import { prepareRoute } from '../../decorators'
import * as UserActionCreators from '../../actions/user'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import config from '../../../../config'

if (process.env.BROWSER) {
  require('./AccountCreditCard.less')
}

@connect(({User}) => ({User}))
class AccountCreditCard extends React.Component {

  getInitialState () {

    return {
      cardNumber: null
    }
  }

  componentDidMount () {

  }

  render () {
    const {
      props: {
        User
      }
    } = this

    const user = User.get('user')

    if (user) {
      return (
        <div className="row-fluid">
          <div className="container">
            <div className="account-credit-card">
              <h1>Mettre à jour les informations de paiement</h1>
              <div className="account-credit-card-details">
                Cette page n’est pas encore active. Pour changer vos informations de paiement, veuillez contacter notre
                service client a l’adresse suivante:
                <a href="mailto:support@afrostream.tv?Subject=Changer%20mail" target="_top"> support@afrostream.tv</a>
              </div>
            </div>
          </div>
        </div>
      )
    } else {

      return (
        <div className="row-fluid">
          no user found
        </div>
      )
    }
  }
}

export default AccountCreditCard
