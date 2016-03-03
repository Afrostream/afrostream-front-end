import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import classSet from 'classnames';
import {dict} from '../../../../../config';
import RecurlyForm from './RecurlyForm'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class PaypalForm extends RecurlyForm {

  constructor(props) {
    super(props);
  }

  async submit(billingInfo, currentPlan) {

    const self = this;
    let recurlyInfo = {
      'description': billingInfo.internalPlanUuid
    };

    return await new Promise(
      (resolve, reject) => {
        let recurlyLib = self.state.hasLib;
        recurlyLib.paypal(recurlyInfo, (err, token)=> {
          // send any errors to the error function below
          if (err) {
            return reject(err);
          }
          return resolve(_.merge({
            //NEW BILLING API
            billingProvider: 'recurly',
            subOpts: {
              customerBankAccountToken: token.id
            }
          }, recurlyInfo));
        });
      }
    );
  }

  onHeaderClick() {
    let clickHeader = ReactDOM.findDOMNode(this);
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'paypal', bubbles: true}));
    }
  }

  getForm() {
    if (!this.props.selected) return;

    return (

      <div className="row" ref="goCardlessForm">
        {this.renderPromoCode()}
        <h5 className="col-md-12">{dict.payment.paypal.paypalText}</h5>
      </div>
    );
  }

  render() {

    if (!this.state.hasLib) {
      return (<div />);
    }

    let classHeader = {
      'accordion-toggle': true,
      'collapsed': !this.props.selected
    };

    let classPanel = {
      'panel': true,
      'collapsed': !this.props.selected
    };

    return (
      <div className={classSet(classPanel)}>
        <div className="payment-method-details">
          <div className={classSet(classHeader)} onClick={::this.onHeaderClick}>
            <label className="form-label">{dict.payment.paypal.label}</label>
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
    );
  }
}

export default PaypalForm;
