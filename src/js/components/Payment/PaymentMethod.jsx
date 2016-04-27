import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import { dict, payment, featuresFlip } from '../../../../config';
import { Link } from 'react-router';
import { RecurlyForm, GocardlessForm, PaypalForm, CashwayForm } from './Forms';

if (process.env.BROWSER) {
  require('./PaymentMethod.less');
}

const Methods = {
  GOCARDLESS: 'gocardless',
  CARD: 'card',
  PAYPAL: 'paypal',
  CASHWAY: 'cashway'
};

class PaymentMethod extends React.Component {

  static contextTypes = {
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  constructor (props) {
    super(props);
    let method = payment.default;
    this.state = {
      isCash: false,
      method: method
    };
  }

  static propTypes = {
    isGift: React.PropTypes.bool,
    planCode: React.PropTypes.string,
    planLabel: React.PropTypes.string
  };

  static defaultProps = {
    isGift: false,
    planCode: null,
    planLabel: null
  };

  static methods = Methods;

  multipleMethods () {
    return !this.props.isGift && (featuresFlip.gocardless || featuresFlip.paypal || featuresFlip.cashway)
  }

  hasLib () {
    switch (this.state.method) {
      case  Methods.GOCARDLESS:
        return this.refs.gocardless.hasLib();
        break;
      case  Methods.CARD:
        return this.refs.card.hasLib();
        break;
      case  Methods.PAYPAL:
        return this.refs.paypal.hasLib();

      case  Methods.CASHWAY:
        return this.refs.cashway.hasLib();
        break;
    }
  }

  method () {
    return this.state.method;
  }

  componentDidMount () {

    this.container = ReactDOM.findDOMNode(this);
    this.container.addEventListener('changemethod', this.switchMethod.bind(this));

    let canUseMultiple = this.multipleMethods();
    let method = this.method();
    let isCash = this.context.history.isActive('cash');

    if (!canUseMultiple) {
      method = Methods.CARD;
    }
    if (isCash) {
      method = Methods.CASHWAY;
    }

    this.setState({
      method: method,
      isCash: isCash
    });
  }

  async submit (billingInfo, currentPlan) {
    switch (this.state.method) {
      case  Methods.GOCARDLESS:
        return await this.refs.gocardless.submit(billingInfo);
        break;
      case  Methods.CARD:
        return await this.refs.card.submit(billingInfo, currentPlan);
        break;
      case  Methods.PAYPAL:
        return await this.refs.paypal.submit(billingInfo, currentPlan);
        break;
      case  Methods.CASHWAY:
        return await this.refs.cashway.submit(billingInfo, currentPlan);
        break;
    }
  }

  switchMethod (event) {
    if (!this.multipleMethods()) {
      return;
    }
    let newMethod = event.detail || Methods.GOCARDLESS;

    this.setState({
      method: newMethod
    });
  }

  renderMethods () {


    let recurly = <RecurlyForm key="method-card" ref="card"
                               selected={this.state.method === Methods.CARD}/>;
    let paypal = <PaypalForm key="method-paypal" ref="paypal"
                             selected={this.state.method === Methods.PAYPAL}
                             planLabel={this.props.planLabel}/>;
    let gocardless = <GocardlessForm key="method-gocardless" ref="gocardless"
                                     selected={this.state.method === Methods.GOCARDLESS}/>;

    let cashway = <CashwayForm key="method-cashway" ref="cashway" {...this.props}/>;


    let methods = [];
    switch (true) {
      case this.state.isCash === true:
        methods.push(cashway);
        break;
      default:
        methods.push(recurly);
        if (!this.props.isGift) {
          if (featuresFlip.paypal) {
            methods.push(paypal);
          }
          if (featuresFlip.gocardless) {
            methods.push(gocardless);
          }
        }
        break;
    }

    return methods;
  }


  render () {
    return (
      <div className="panel-group">
        {this.renderMethods()}
      </div>
    );
  }
}

export default PaymentMethod;
