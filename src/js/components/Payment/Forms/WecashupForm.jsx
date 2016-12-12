import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import classSet from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import CouponForm from './CouponForm'

class WecashupForm extends CouponForm {

  constructor (props, context) {
    super(props, context)
    this.state = {
      hasLib: true
    }
  }

  static propTypes = {
    selected: React.PropTypes.bool
  }

  static defaultProps = {
    selected: false
  }

  async submit (billingInfo, currentPlan) {
    const {
      props:{provider}
    }=this

    return await new Promise(
      (resolve) => {
        return resolve({
          internalPlanUuid: billingInfo.internalPlanUuid,
          currency: currentPlan.get('currency'),
          amount: currentPlan.get('amount'),
          billingProviderName: provider
        })
      }
    )
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'netsize', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return
    return (

      <div className="row" ref="netsizeForm">
        {this.renderPromoCode()}
        <h5 className="col-md-12">
          {this.getTitle('payment.mobile.text', {submitBtn: this.getTitle('planCodes.actionMobile')}) }
        </h5>
        <script async src="https://www.wecashup.cloud/temp/2-form/js/MobileMoney.js" class="wecashup_button"
                data-receiver-uid="YOUR_merchant_uid"
                data-receiver-public-key="YOUR_MERCHANT_PUBLIC_KEY"
                data-transaction-receiver-total-amount="TOTAL_AMOUNT_OF_THE_TRANSACTION"
                data-transaction-receiver-currency="CURRENCY_OF_THE_MERCHANT"
                data-name="NAME_OF_YOUR_APPLICATION"
                data-transaction-receiver-reference="MERCHANT_TRANSACTION_REFERENCE"
                data-transaction-sender-reference="CUSTOMER_TRANSACTION_REFERENCE"
                data-style="1"
                data-image="https://www.wecashup.cloud/temp/2-form/img/home.png"
                data-cash="true"
                data-telecom="true"
                data-m-wallet="false"
                data-split="false">
        </script>
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
            <label className="form-label">{this.getTitle('payment.mobile.label')}</label>
            <i className="zmdi zmdi-hc-2x zmdi-smartphone-android"/>
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

export default WecashupForm
