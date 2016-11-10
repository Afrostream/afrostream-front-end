import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import CountrySelect from './../CountrySelect'
import classSet from 'classnames'
import config from '../../../../../config'
import { getI18n } from '../../../../../config/i18n'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import window from 'global/window'
import CouponForm from './CouponForm'
import TextField from 'material-ui/TextField'
import Payment from 'payment'

class RecurlyForm extends CouponForm {

  constructor (props, context) {
    super(props, context)
  }

  static propTypes = {
    selected: React.PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  formatCard () {
    const {cardNumber, expiration, cvc} = this.refs
    if (!this.props.selected) {
      return
    }
    if (cardNumber) {
      Payment.formatCardNumber(ReactDOM.findDOMNode(cardNumber).querySelector('input'))
    }
    if (expiration) {
      Payment.formatCardExpiry(ReactDOM.findDOMNode(expiration).querySelector('input'))
    }
    if (cvc) {
      Payment.formatCardCVC(ReactDOM.findDOMNode(cvc).querySelector('input'))
    }
  }

  initLib () {
    //Detect si le payment via la lib recurly est dispo
    let recurlyLib = window['recurly']
    if (recurlyLib && !recurlyLib.configured) {
      recurlyLib.configure(config.recurly.key)
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
    const {cardNumber, expiration, cvc, couponCode, country} = this.refs
    const {month, year} = Payment.fns.cardExpiryVal(expiration.getValue())

    const excludedCards = ['visaelectron', 'maestro']

    //Excluded cart type message
    if (~excludedCards.indexOf(Payment.fns.cardType(cardNumber))) {
      throw new Error(getI18n().payment.errors.exludedCard)
    }

    let recurlyInfo = {
      'plan-code': billingInfo.internalPlanUuid,
      'first_name': billingInfo.firstName,
      'last_name': billingInfo.lastName,
      'email': billingInfo.email,
      // required attributes
      'number': cardNumber.getValue(),

      'month': month,
      'year': year,

      'cvv': cvc.getValue(),
      // optional attributes
      'unit-amount-in-cents': currentPlan.get('amountInCents'),
      'coupon_code': couponCode.getValue(),
      'country': country.getValue()
    }

    return await new Promise(
      (resolve, reject) => {
        let recurlyLib = window['recurly']

        recurlyLib.token(recurlyInfo, (err, token)=> {
          // send any errors to the error function below
          if (err) {
            return reject(err)
          }
          return resolve({
            billingProviderName: 'recurly',
            subOpts: {
              customerBankAccountToken: token.id,
              couponCode: couponCode.value
            }
          })
        })
      })
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'recurly', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return

    return (
      <div className="row no-padding">
        <div className="col-md-12">
          <div className="row no-padding">
            <div className="col-md-6">
              <TextField
                floatingLabelFixed={true}
                fullWidth={true}
                type="tel"
                className="card-number"
                ref="cardNumber"
                name="number"
                id="number"
                autoComplete="cc-number"
                floatingLabelText={getI18n().payment.creditCard.number}
                hintText={getI18n().payment.creditCard.placeHolder} required/>
            </div>
            <CountrySelect ref="country"/>
          </div>
        </div>
        <div className="col-md-12">
          <div className="row no-padding">
            <div className="col-md-6">
              <TextField
                floatingLabelFixed={true}
                fullWidth={true}
                ref="expiration"
                name="expiration" id="expiration"
                autoComplete="cc-exp"
                floatingLabelText={getI18n().payment.creditCard.exp}
                hintText={getI18n().payment.creditCard.expPlaceHolder} required/>
            </div>
            <div className="col-md-6">
              <TextField
                fullWidth={true}
                floatingLabelFixed={true}
                type="tel"
                ref="cvc"
                autoComplete="cc-csc"
                name="cvv" id="cvv"
                floatingLabelText={getI18n().payment.creditCard.cvv}
                hintText={getI18n().payment.creditCard.cvcPlaceHolder} required/>
            </div>
          </div>
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

export default RecurlyForm
