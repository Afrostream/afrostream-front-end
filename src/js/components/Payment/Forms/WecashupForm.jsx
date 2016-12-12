import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import Immutable from'immutable'
import classSet from 'classnames'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import CouponForm from './CouponForm'
import config from '../../../../../config'
import { addRemoveEvent } from '../../../lib/utils'
import { startLoadingScripts } from '../../../lib/script-loader'
const {
  wecashupApi
} = config

class WecashupForm extends CouponForm {

  constructor (props, context) {
    super(props, context)
    this.state = {
      hasLib: false
    }
  }

  componentDidMount () {
    super.componentDidMount()

    const {props:{plan}} =this

    if (this.state.isScriptLoadSucceed || this.state.isScriptPending) {
      return
    }

    this.setState({
      isScriptPending: true
    })

    startLoadingScripts([_.merge(wecashupApi, {
      attributes: {
        'data-transaction-receiver-total-amount': (plan.get('amountInCents') / 100).toFixed(2),
        'data-transaction-receiver-currency': plan.get('currency'),
        'data-transaction-sender-reference': plan.get('internalPlanUuid')
      }
    })], err => {
      this.setState({
        isScriptPending: false,
        isScriptLoaded: true,
        hasLib: true,
        isScriptLoadSucceed: !err
      })

      const paymentMethod = document.querySelectorAll(`.${wecashupApi.attributes.class}`)
      if (paymentMethod && paymentMethod.length > 1) {
        const buttonEl = paymentMethod[1]
        buttonEl.classList.add('pull-right')
        debugger
        addRemoveEvent('click', buttonEl, true, ::this.onClickHandler)
      }
    })
  }

  onClickHandler (e) {
    debugger
    e.stopImmediatePropagation()
    e.preventDefault()
    let event = new CustomEvent('submit', {})
    e.target.dispatchEvent(event)

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
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'wecatchup', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return
    return (

      <div className="row">
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

WecashupForm.propTypes = {
  plan: PropTypes.instanceOf(Immutable.Map),
  planCode: React.PropTypes.string,
  planLabel: React.PropTypes.string
}

export default WecashupForm
