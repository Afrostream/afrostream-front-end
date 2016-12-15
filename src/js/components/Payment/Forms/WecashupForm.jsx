import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
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

  componentWillReceiveProps (nextProps) {
    super.componentWillReceiveProps(nextProps)
    if (nextProps.selected !== this.props.selected) {
      const wcashupClass = `.${wecashupApi.attributes.class}`
      const wcatchupBtnClass = `${wcashupClass.replace('_', '-')}.valid`
      const submitBtns = document.querySelectorAll(wcashupClass)
      let buttonWCUPEl = document.querySelector(wcatchupBtnClass)
      if (submitBtns && submitBtns.length > 1) {
        const buttonElSubmit = submitBtns[0]
        if (nextProps.selected) {
          buttonElSubmit.classList.add('hidden')
        } else {
          buttonElSubmit.classList.remove('hidden')
        }
      }
      if (buttonWCUPEl) {
        if (nextProps.selected) {
          buttonWCUPEl.classList.remove('hidden')
        } else {
          buttonWCUPEl.classList.add('hidden')
        }
      }

    }
  }


  checkSubmitBtnInterval () {
    try {
      const wcashupClass = `.${wecashupApi.attributes.class}`
      const wcatchupBtnClass = `${wcashupClass.replace('_', '-')}.valid`
      const submitBtns = document.querySelectorAll(wcashupClass)
      if (submitBtns && submitBtns.length > 1) {
        const buttonElSubmit = submitBtns[0]
        let buttonWCUPEl = document.querySelector(wcatchupBtnClass)
        if (!buttonWCUPEl || !buttonWCUPEl.parentNode) {
          return
        }
        console.log('element find', buttonWCUPEl)
        clearInterval(this.wecashupBtnCheckInterval)
        let cloneButtonEl = buttonWCUPEl.cloneNode(true)
        cloneButtonEl.setAttribute('type', 'submit')
        //let cloneButtonEl = buttonWCUPEl
        buttonWCUPEl.parentNode.removeChild(buttonWCUPEl)
        cloneButtonEl = buttonElSubmit.parentNode.insertBefore(cloneButtonEl, buttonElSubmit.nextSibling)
        buttonElSubmit.classList.add('hidden')
        cloneButtonEl.classList.add('pull-right')
        //cloneButtonEl.disabled = true
        addRemoveEvent('click', cloneButtonEl, true, ::this.onClickHandler)
      }
    } catch (err) {
      clearInterval(this.wecashupBtnCheckInterval)
      throw  err
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

      if (err) {
        throw err
      }
      this.wecashupBtnCheckInterval = setInterval(() => {
        this.checkSubmitBtnInterval()
      }, 200)

    })
  }

  onClickHandler (e) {

    const {props :{form}} =this
    const isFormValid = form && form.checkValidity()
    if (!isFormValid) {
      let event = document.createEvent('CustomEvent')
      event.initCustomEvent('submit', true, true, {})
      form.dispatchEvent(event)
      console.log('payment form not valid')
      e.preventDefault()
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

    //todo await postmessage with token infos dispatched from auth/wecashup/callback

    return await new Promise(
      (resolve) => {
        //return resolve({
        //  internalPlanUuid: billingInfo.internalPlanUuid,
        //  currency: currentPlan.get('currency'),
        //  amount: currentPlan.get('amount'),
        //  billingProviderName: provider
        //})
      }
    )
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader && !this.props.selected) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'wecashup', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return
    return (

      <div className="row">
        {this.renderPromoCode()}
        <h5 className="col-md-12">
          {this.getTitle('payment.wecashup.text') }
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
            <label className="form-label">{this.getTitle('payment.wecashup.label')}</label>
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
