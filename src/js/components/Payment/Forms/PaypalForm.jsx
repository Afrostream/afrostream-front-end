import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import * as UserActionCreators from '../../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './../CountrySelect';
import classSet from 'classnames';
import config from '../../../../../config/client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class PaypalForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {hasLib: false};
  }

  hasLib() {
    return this.state.hasLib;
  }

  static propTypes = {
    selected: React.PropTypes.bool
  };

  static defaultProps = {
    selected: false
  };

  componentDidUpdate() {
    $('.recurly-cc-number').payment('formatCardNumber');
    $('.recurly-cc-exp').payment('formatCardExpiry');
    $('.recurly-cc-cvc').payment('formatCardCVC');
  }

  componentDidMount() {
    $('.recurly-cc-number').payment('formatCardNumber');
    $('.recurly-cc-exp').payment('formatCardExpiry');
    $('.recurly-cc-cvc').payment('formatCardCVC');
    //Detect si le payment via la lib recurly est dispo
    let recurlyLib = window['recurly'];

    this.setState({
      hasLib: recurlyLib
    });

    if (recurlyLib && !recurlyLib.configured) {
      recurlyLib.configure(config.recurly.key);
    }
  }

  async submit(billingInfo, currentPlan) {

    const self = this;

    let recurlyInfo = {description: 'afrostreamambassadeurs'};

    return await new Promise(
      (resolve, reject) => {
        let recurlyLib = self.state.hasLib;
        debugger;
        recurlyLib.paypal(recurlyInfo, (err, token)=> {
          // send any errors to the error function below
          if (err) {
            debugger;
            reject(err);
          }
          debugger;
          resolve(_.merge({
            'recurly-token': token.id,
            //NEW BILLING API
            billingProvider: 'recurly',
            subOpts: {
              customerBankAccountToken: token.id//,
              //couponCode: self.refs.couponCode.value
            }
          }, recurlyInfo));
        });
      }
    );
  }

  onHeaderClick() {
    debugger;
    let clickHeader = ReactDOM.findDOMNode(this);
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'paypal', bubbles: true}));
    }
  }

  renderPromoCode() {
    return (
      <div className="form-group col-md-6">
        <label className="form-label" htmlFor="coupon_code">{config.dict.payment.promo.label}</label>
        <input
          type="text"
          className="form-control coupon-code"
          data-billing="coupon_code"
          name="coupon_code"
          id="coupon_code"
          ref="couponCode"
          placeholder={config.dict.payment.promo.placeHolder}
          disabled={this.state.disabledForm}/>
      </div>
    );
  }

  getForm() {
    if (!this.props.selected) return;

    return (
      <div className="row" ref="goCardlessForm">
        <button>Click here to pay via paypal</button>
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
            <label className="form-label">{config.dict.payment.creditCard.label}</label>
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
