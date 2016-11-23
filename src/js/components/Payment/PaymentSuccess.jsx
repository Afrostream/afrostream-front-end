import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import * as UserActionCreators from '../../actions/user'
import { Link } from '../Utils'

@connect(({User}) => ({User}))
class PaymentSuccess extends React.Component {

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
      <div className="payment-wrapper">
        <div className="payment-success">
          <h3>{'Votre abonnement a bien été enregistré'}</h3>

          <h3>merci pour votre inscription</h3>

          <p className="success">
            <Link className="success-button"
                  to="/">Commencez la visite sur le site
            </Link>
          </p>
        </div>
      </div>
    )
  }

}

export default PaymentSuccess
