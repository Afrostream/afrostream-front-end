import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import classSet from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import CouponForm from './CouponForm'

class NetsizeForm extends CouponForm {

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

      <div className="row-fluid" ref="netsizeForm">
        <div className="col-md-12">
          <img src="/images/payment/netsize-operators.png"/>
        </div>
        {this.renderPromoCode()}
        <h5 className="col-md-12">
          {this.getTitle('payment.mobile.text', {submitBtn: this.getTitle('planCodes.actionMobile')}) }
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

export default NetsizeForm
