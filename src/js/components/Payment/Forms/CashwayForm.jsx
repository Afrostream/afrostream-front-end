import React, { PropTypes } from 'react';
import { dict } from '../../../../../config/client';

class CashwayForm extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      hasLib: true
    };
  }

  hasLib () {
    return this.state.hasLib;
  }

  async submit (billingInfo) {

    return await new Promise(
      (resolve, reject) => {
        return reject('Transaction annulée');
      });
  }

  render () {
    return (<div className="row" ref="cashwayForm"/>);
  }
}

export default CashwayForm;
