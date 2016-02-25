import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import {dict,payment} from '../../../../config';
import { Link } from 'react-router';

import {RecurlyForm,GocardlessForm} from './Forms';

if (process.env.BROWSER) {
  require('./PaymentMethod.less');
}

const Methods = {
  GOCARDLESS: 'gocardless',
  CARD: 'card'
};

class PaymentMethod extends React.Component {

  constructor(props) {
    super(props);
    this.state = {method: props.isGift ? Methods.CARD : payment.default};
  }

  static propTypes = {
    isGift: React.PropTypes.bool
  };

  static defaultProps = {
    isGift: false
  };

  static methods = Methods;

  hasLib() {
    switch (this.state.method) {
      case  Methods.GOCARDLESS:
        return this.refs.gocardless.hasLib();
        break;
      case  Methods.CARD:
        return this.refs.card.hasLib();
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
    }
  }

  switchMethod() {
    if (this.props.isGift) {
      return;
    }
    let newMethod = this.state.method === Methods.GOCARDLESS ? Methods.CARD : Methods.GOCARDLESS;
    this.setState({
      method: newMethod
    });
  }

  render() {

    return (
      <div className="panel-group">
        {!this.props.isGift ? <GocardlessForm ref="gocardless"
                                              selected={this.state.method === Methods.GOCARDLESS}/> : ''}
        <RecurlyForm ref="card"
                     selected={this.state.method === Methods.CARD}/>
      </div>
    );
  }
}

export default PaymentMethod;
