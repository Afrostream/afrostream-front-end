import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import config from '../../../../../config'
import window from 'global/window'
import RecurlyForm from './RecurlyForm'
import Payment from 'payment'

class StripeForm extends RecurlyForm {

  constructor (props, context) {
    super(props, context)
  }

  initLib () {
    //Detect si le payment via la lib stripe est dispo
    let stripeLib = window['Stripe']
    if (stripeLib) {
      stripeLib.setPublishableKey(config.stripe.key)
    }
  }

  async submit (billingInfo, currentPlan) {
    const {
      props:{provider}
    }=this
    const {cardNumber, expiration, cvc, couponCode, country} = this.refs
    const {month, year} = Payment.fns.cardExpiryVal(expiration.getValue())

    const excludedCards = ['visaelectron', 'maestro']

    //Excluded cart type message
    if (~excludedCards.indexOf(Payment.fns.cardType(cardNumber))) {
      throw new Error(this.getTitle('payment.errors.exludedCard'))
    }

    let stripeInfo = {
      'number': cardNumber.getValue(),
      'exp_month': month,
      'exp_year': parseInt(year.toString().slice(-2)),
      'cvc': cvc.getValue(),
      // optional attributes
      'address_country': country.getValue(),
      'name': `${billingInfo.firstName} ${billingInfo.lastName}`
    }

    return await new Promise(
      (resolve, reject) => {
        let stripeLib = window['Stripe']

        stripeLib.createToken(stripeInfo, (status, response) => {
          // send any errors to the error function below
          if (response.error) {
            return reject(response.error)
          }
          return resolve({
            billingProviderName: provider,
            subOpts: {
              customerBankAccountToken: response.id,
              couponCode: couponCode.getValue()
            }
          })
        })
      })
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'stripe', bubbles: true}))
    }
  }

}

export default StripeForm
