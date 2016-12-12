import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import Immutable from 'immutable'
import config from '../../../../config'
import {
  RecurlyForm,
  GocardlessForm,
  CashwayForm,
  StripeForm,
  BraintreeForm,
  NetsizeForm,
  WecashupForm
} from './Forms'

const {payment} = config

if (process.env.BROWSER) {
  require('./PaymentMethod.less')
}

const Methods = {
  GOCARDLESS: 'gocardless',
  NETSIZE: 'netsize',
  RECURLY: 'recurly',
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  CASHWAY: 'cashway',
  WECASHUP: 'wecashup'
}

class PaymentMethod extends React.Component {

  constructor (props) {
    super(props)
    let method = payment.default
    this.state = {
      isCash: false,
      method: method
    }
  }

  multipleMethods () {
    const {
      props: {
        plan
      }
    } = this


    let providers = null
    let providerDefault = null

    if (plan) {
      providers = plan.get('providerPlans')
      if (providers && providers.size) {
        providerDefault = providers.sortBy((provider, key) => {
          return config.payment.order.indexOf(key)
        }).first().get('provider').get('providerName')
      }
    }

    return plan && providers && providers.size && providerDefault
  }

  method () {
    return this.state.method
  }

  componentDidMount () {

    this.container = ReactDOM.findDOMNode(this)
    this.container.addEventListener('changemethod', this.switchMethod.bind(this))

    let defaultMethod = this.multipleMethods()
    let method = this.method()
    let isCash = this.props.router.isActive('cash')

    if (defaultMethod) {
      method = defaultMethod
    }

    this.setState({
      method: method,
      isCash: isCash
    })
  }

  async submit (billingInfo, currentPlan) {
    switch (this.state.method) {
      case  Methods.NETSIZE:
        return await this.refs.netsize.submit(billingInfo, currentPlan)
        break
      case  Methods.GOCARDLESS:
        return await this.refs.gocardless.submit(billingInfo)
        break
      case  Methods.STRIPE:
        return await this.refs.stripe.submit(billingInfo, currentPlan)
        break
      case  Methods.RECURLY:
        return await this.refs.recurly.submit(billingInfo, currentPlan)
        break
      case  Methods.PAYPAL:
        return await this.refs.paypal.submit(billingInfo, currentPlan)
        break
      case  Methods.CASHWAY:
        return await this.refs.cashway.submit(billingInfo, currentPlan)
        break
      case  Methods.WECASHUP:
        return await this.refs.wecashup.submit(billingInfo, currentPlan)
        break
    }
  }

  switchMethod (event) {
    if (!this.multipleMethods()) {
      return
    }
    let newMethod = event.detail

    this.setState({
      method: newMethod
    })
  }

  renderMethods () {

    const {
      props: {
        plan
      }
    } = this


    let methods = []

    let allMethods = {
      netsize: (<NetsizeForm key="method-netsize" ref="netsize" provider="netsize" {...this.props}
                             selected={this.state.method === Methods.NETSIZE}/>),
      recurly: (<RecurlyForm key="method-recurly" ref="recurly" provider="recurly" {...this.props}
                             selected={this.state.method === Methods.RECURLY}/>),
      stripe: (<StripeForm key="method-stripe" ref="stripe" provider="stripe" {...this.props}
                           selected={this.state.method === Methods.STRIPE}/>),
      braintree: (<BraintreeForm key="method-paypal" ref="paypal" provider="braintree" {...this.props}
                                 selected={this.state.method === Methods.PAYPAL} planLabel={this.props.planLabel}/>),
      cashway: (<CashwayForm key="method-cashway" ref="cashway" provider="cashway" {...this.props}
                             selected={this.state.method === Methods.CASHWAY}/>),
      gocardless: (<GocardlessForm key="method-gocardless" ref="gocardless" provider="gocardless"
                                   {...this.props}
                                   selected={this.state.method === Methods.GOCARDLESS}/>),
      wecashup: (<WecashupForm key="method-wecashup" ref="wecashup" provider="wecashup"
                               {...this.props}
                               selected={this.state.method === Methods.WECASHUP}/>)
    }

    if (plan) {
      let providers = plan.get('providerPlans')
      providers.sortBy((provider, key) => {
        return config.payment.order.indexOf(key)
      }).map((provider, key) => {
        if (allMethods.hasOwnProperty(key)) {
          methods.push(allMethods[key])
        }
      })
    }
    return methods
  }


  render () {
    return (
      <div className="panel-group">
        {this.renderMethods()}
      </div>
    )
  }
}

PaymentMethod.propTypes = {
  plan: PropTypes.instanceOf(Immutable.Map),
  planCode: React.PropTypes.string,
  planLabel: React.PropTypes.string
}

PaymentMethod.defaultProps = {
  plan: null,
  planCode: null,
  planLabel: null
}

export default PaymentMethod
