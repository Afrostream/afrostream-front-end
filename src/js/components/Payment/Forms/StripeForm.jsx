import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import CountrySelect from './../CountrySelect'
import classSet from 'classnames'
import config from '../../../../../config'
import { getI18n } from '../../../../../config/i18n'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import window from 'global/window'

class StripeForm extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    selected: React.PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  formatCard () {
    $('.stripe-cc-number').payment('formatCardNumber')
    $('.stripe-cc-exp').payment('formatCardExpiry')
    $('.stripe-cc-cvc').payment('formatCardCVC')
  }

  initLib () {
    //Detect si le payment via la lib stripe est dispo
    let stripeLib = window['Stripe']
    if (stripeLib) {
      stripeLib.setPublishableKey(config.stripe.key)
    }
  }

  componentDidUpdate () {
    this.formatCard()
    this.initLib()
  }

  componentDidMount () {
    this.formatCard()
    this.initLib()
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (!isScriptLoadSucceed) {
        this.setState({
          hasLib: isScriptLoadSucceed
        })
      } else {
        this.formatCard()
        this.initLib()
      }
    }
  }

  async submit (billingInfo, currentPlan) {
    const self = this
    const cardNumber = $('.stripe-cc-number').val()
    const excludedCards = ['visaelectron', 'maestro']

    //Excluded cart type message
    if (~excludedCards.indexOf($.payment.cardType(cardNumber))) {
      //$('#errors').text('Ce type ne carte n‘est pas pris en charge actuellement')
      $('.stripe-cc-number').addClass('has-error')
      throw new Error(getI18n().payment.errors.exludedCard)
    }
    let stripeInfo = {
      'number': self.refs.cardNumber.value,
      'exp_month': $('.stripe-cc-exp').payment('cardExpiryVal').month,
      'exp_year': $('.stripe-cc-exp').payment('cardExpiryVal').year,
      'cvc': self.refs.cvc.value,
      // optional attributes
      'address_country': self.refs.country.value(),
      'name': `${billingInfo.firstName} ${billingInfo.lastName}`
    }

    return await new Promise(
      (resolve, reject) => {
        let stripeLib = window['Stripe']

        stripeLib.createToken(stripeInfo, (status, response)=> {
          // send any errors to the error function below
          if (response.error) {
            return reject(response.error)
          }
          return resolve({
            billingProviderName: 'stripe',
            subOpts: {
              customerBankAccountToken: response.id,
              couponCode: self.refs.couponCode.value
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

  renderPromoCode () {
    return (
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="coupon_code">{getI18n().payment.promo.label}</label>
        <input
          type="text"
          className="form-control coupon-code"
          data-billing="coupon_code"
          name="coupon_code"
          id="coupon_code"
          ref="couponCode"
          placeholder={getI18n().payment.promo.placeHolder}
        />
      </div>
    )
  }

  getForm () {
    if (!this.props.selected) return

    return (
      <div className="row" ref="goCardlessForm">
        <div className="form-group col-md-6">
          <label className="form-label" htmlFor="number">{getI18n().payment.creditCard.number}</label>
          <input
            type="tel"
            className="form-control stripe-cc-number card-number"
            ref="cardNumber"
            data-billing="number"
            name="number"
            id="number"
            autoComplete="cc-number"
            placeholder={getI18n().payment.creditCard.placeHolder} required/>
        </div>
        <CountrySelect ref="country"/>
        <div className="form-group col-md-4">
          <label className="form-label" htmlFor="month">{getI18n().payment.creditCard.exp}</label>
          <input type="tel" className="form-control stripe-cc-exp" data-billing="month"
                 name="month" id="month"
                 autoComplete="cc-exp"
                 placeholder={getI18n().payment.creditCard.expPlaceHolder} required/>
        </div>
        <div className="form-group col-md-4">
          <label className="form-label" htmlFor="cvv">{getI18n().payment.creditCard.cvv}</label>
          <input type="tel" className="form-control stripe-cc-cvc" data-billing="cvv"
                 ref="cvc"
                 name="cvv" id="cvv" autoComplete="off"
                 placeholder={getI18n().payment.creditCard.cvcPlaceHolder} required/>
        </div>

        {this.renderPromoCode()}

      </div>
    )
  }

  render () {

    let classHeader = {
      'accordion-toggle': true,
      'collapsed': !this.props.selected
    }

    let classPanel = {
      'panel': true,
      'collapsed': !this.props.selected
    }

    return (
      <div className={classSet(classPanel)}>
        <div className="payment-method-details">
          <div className={classSet(classHeader)} onClick={::this.onHeaderClick}>
            <label className="form-label">{getI18n().payment.creditCard.label}</label>
            <img src="/images/payment/bank-cards.png"/>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionName="accordion" className="panel-collapse collapse in"
                                 transitionEnter={true} transitionLeave={false}
                                 transitionEnterTimeout={300}
                                 transitionLeaveTimeout={300} component="div">
          {this.getForm()}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default StripeForm
