import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import {dict,payment,featuresFlip} from '../../../../config';
import { Link } from 'react-router';

import {RecurlyForm,GocardlessForm, PaypalForm} from './Forms';

if (process.env.BROWSER) {
  require('./PaymentMethod.less');
}

const Methods = {
  GOCARDLESS: 'gocardless',
  CARD: 'card',
  PAYPAL: 'paypal'
};

class PaymentMethod extends React.Component {

  constructor(props) {
    super(props);
    let canUseMultiple = this.multipleMethods();
    this.state = {method: canUseMultiple ? payment.default : Methods.CARD};
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

  multipleMethods() {
    return !this.props.isGift && (featuresFlip.gocardless || featuresFlip.paypal)
  }

  hasLib() {
    switch (this.state.method) {
      case  Methods.GOCARDLESS:
        return this.refs.gocardless.hasLib();
        break;
      case  Methods.CARD:
        return this.refs.card.hasLib();
        break;
      case  Methods.PAYPAL:
        return this.refs.paypal.hasLib();
        break;
    }
  }

  method() {
    return this.state.method;
  }

  componentDidMount() {
    this.container = ReactDOM.findDOMNode(this);
    this.container.addEventListener('changemethod', this.switchMethod.bind(this));
  }

  async submit(billingInfo, currentPlan) {
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
    }
  }

  switchMethod() {
    let newMethod = Methods.GOCARDLESS;

    if (!this.multipleMethods()) {
      return;
    }

    if (typeof event !== 'undefined' &&
      typeof event.detail !=='undefined' &&
      event.type === 'changemethod') {

      newMethod = event.detail;
    }

    this.setState({
      method: newMethod
    });
  }

  render() {

    return (
      <div className="panel-group">
        {!this.props.isGift && featuresFlip.gocardless ? <GocardlessForm ref="gocardless"
                                                                         selected={this.state.method === Methods.GOCARDLESS}/> : ''}
        <RecurlyForm ref="card"
                     selected={this.state.method === Methods.CARD}/>


        {!this.props.isGift ? <PaypalForm ref="paypal"
                                          selected={this.state.method === Methods.PAYPAL}/> : ''}
      </div>
    );
  }
}

export default PaymentMethod;
