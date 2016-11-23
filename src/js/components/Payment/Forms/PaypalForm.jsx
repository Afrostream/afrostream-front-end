import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import classSet from 'classnames'
import RecurlyForm from './RecurlyForm'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import window from 'global/window'

class PaypalForm extends RecurlyForm {

  constructor (props, context) {
    super(props, context)
  }

  async submit (billingInfo, currentPlan) {
    const {
      props:{provider}
    }=this

    const {couponCode} = this.refs

    const self = this
    let recurlyInfo = {
      'description': self.props.planLabel,
      'coupon_code': couponCode.getValue()
    }

    return await new Promise(
      (resolve, reject) => {
        let recurlyLib = window['recurly']
        recurlyLib.paypal(recurlyInfo, (err, token)=> {
          // send any errors to the error function below
          if (err) {
            return reject(err)
          }
          return resolve(_.merge({
            'recurly-token': token.id,
            //NEW BILLING API
            billingProviderName: provider,
            subOpts: {
              customerBankAccountToken: token.id,
              couponCode: couponCode.getValue()
            }
          }, recurlyInfo))
        })
      }
    )
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'paypal', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return
    return (

      <div className="row">
        {this.renderPromoCode()}
        <h5 className="col-md-12">
          {this.getTitle('payment.paypal.paypalText', {submitBtn: this.getTitle('planCodes.action')})}
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
            <label className="form-label">{this.getTitle('payment.paypal.label')}</label>
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

export default PaypalForm
