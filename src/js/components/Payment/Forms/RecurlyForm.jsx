import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import CountrySelect from './../CountrySelect'
import classSet from 'classnames'
import config from '../../../../../config'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import window from 'global/window'
import CouponForm from './CouponForm'
import TextField from 'material-ui/TextField'
import Payment from 'payment'
//const J = Payment.J
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
    const {
      props:{provider}
    }=this

    const {cardNumber, expiration, cvc, couponCode, country} = this.refs
    const {month, year} = Payment.fns.cardExpiryVal(expiration.getValue())

    const excludedCards = ['visaelectron', 'maestro']

    //J.toggleClass(document.querySelectorAll('input'), 'error')
    //J.toggleClass(cardNumber, 'error', !Payment.fns.validateCardNumber(J.val(cardNumber)))
    //J.toggleClass(expiration, 'error', !Payment.fns.validateCardExpiry(Payment.cardExpiryVal(expiration)))

    //Excluded cart type message
    if (~excludedCards.indexOf(Payment.fns.cardType(cardNumber))) {
      throw new Error(this.getTitle('payment.errors.exludedCard'))
    }
    let recurlyInfo = {
      'plan-code': billingInfo.internalPlanUuid,
      'first_name': billingInfo.firstName,
      'last_name': billingInfo.lastName,
      'email': billingInfo.email,
      // required attributes
      'number': cardNumber.getValue(),

      'month': month,
      'year': parseInt(year.toString().slice(-2)),

      'cvv': cvc.getValue(),
      // optional attributes
      'unit-amount-in-cents': currentPlan.get('amountInCents'),
      'coupon_code': (couponCode && couponCode.getValue() || ''),
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
            billingProviderName: provider,
            subOpts: {
              customerBankAccountToken: token.id,
              couponCode: (couponCode && couponCode.getValue() || '')
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

    const promoCode = this.props.noPromoCode ? '' : this.renderPromoCode()

    return (
      <div className="row no-padding">
        <div className="col-md-12">
          <div className="row no-padding">
            <div className="col-md-6">
              <TextField
                floatingLabelFixed={true}
                fullWidth={true}
                type="text"
                className="card-number"
                ref="cardNumber"
                name="number"
                id="number"
                autoComplete="cc-number"
                floatingLabelText={this.getTitle('payment.creditCard.number')}
                hintText={this.getTitle('payment.creditCard.placeHolder')} required/>
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
                type="text"
                ref="expiration"
                maxLength="9"
                name="expiration" id="expiration"
                autoComplete="cc-exp"
                floatingLabelText={this.getTitle('payment.creditCard.exp')}
                hintText={this.getTitle('payment.creditCard.expPlaceHolder')} required/>
            </div>
            <div className="col-md-6">
              <TextField
                fullWidth={true}
                floatingLabelFixed={true}
                type="text"
                ref="cvc"
                name="cvv" id="cvv"
                autoComplete="off"
                floatingLabelText={this.getTitle('payment.creditCard.cvv')}
                hintText={this.getTitle('payment.creditCard.cvcPlaceHolder')} required/>
            </div>
          </div>
        </div>
        {promoCode}
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
            <label className="form-label">{this.getTitle('payment.creditCard.label')}</label>
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
