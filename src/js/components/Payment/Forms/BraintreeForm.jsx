import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import classSet from 'classnames'
import config from '../../../../../config'
import moment from 'moment'
import { getI18n } from '../../../../../config/i18n'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import window from 'global/window'

class BraintreeForm extends React.Component {

  constructor (props) {
    super(props)
  }

  static propTypes = {
    selected: React.PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  componentWillReceiveProps ({isScriptLoaded, isScriptLoadSucceed}) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (!isScriptLoadSucceed) {
        this.setState({
          hasLib: isScriptLoadSucceed
        })
      }
    }
  }

  async submit (billingInfo, currentPlan) {

    return await new Promise(
      (resolve, reject) => {
        //Detect si le payment via la lib braintree est dispo
        const braintreeLib = window['braintree']
        let error = {
          message: '',
          fields: []
        }
        if (braintreeLib) {
          braintreeLib.setup(config.braintree.key, 'paypal', {
            onReady: (integration) => {
              integration.paypal.initAuthFlow()
            },
            onError: (err) => {
              return reject(err)
            },
            onPaymentMethodReceived: (payload)=> {
              console.log(payload)
              return resolve({
                billingProviderName: 'braintree',
                subOpts: {
                  customerBankAccountToken: payload.nonce
                }
              })
              // retrieve nonce from payload.nonce
            },
            paypal: {
              planId: billingInfo.internalPlanUuid,
              singleUse: false,
              amount: parseFloat(currentPlan.get('amount').replace(/,/, '.')),
              currency: currentPlan.get('currency'),
              locale: `${moment.locale()}_${moment.locale().toUpperCase()}`,
              headless: true,
              onAuthorizationDismissed: () => {
                error.message = getI18n().payment.errors.cancelled
                return reject(error)
              },
            }
          })
        }
      }
    )
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'paypal', bubbles: true}))
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
        {this.renderPromoCode()}
        <h5 className="col-md-12">
          {getI18n().payment.paypal.paypalText.replace('{submitBtn}', getI18n().planCodes.action)}
        </h5>
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
            <label className="form-label">{getI18n().payment.paypal.label}</label>
            <img src="/images/payment/paypal.png"/>
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

export default BraintreeForm
