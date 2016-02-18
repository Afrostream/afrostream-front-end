import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import * as UserActionCreators from '../../../actions/user';
import { connect } from 'react-redux';
import CountrySelect from './../CountrySelect';
import classSet from 'classnames';
import config from '../../../../../config/client';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class RecurlyForm extends React.Component {

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
    const cardNumber = $('.recurly-cc-number').val();
    const excludedCards = ['visaelectron', 'maestro'];

    //Excluded cart type message
    if (~excludedCards.indexOf($.payment.cardType(cardNumber))) {
      //$('#errors').text('Ce type ne carte n‘est pas pris en charge actuellement');
      $('.recurly-cc-number').addClass('has-error');
      throw new Error(config.dict.payment.errors.exludedCard);
    }
    let recurlyInfo = {
      'plan-code': billingInfo.internalPlanUuid,
      'first_name': billingInfo.firstName,
      'last_name': billingInfo.lastName,
      'email': billingInfo.email,
      // required attributes
      'number': self.refs.cardNumber.value,

      'month': $('.recurly-cc-exp').payment('cardExpiryVal').month,
      'year': $('.recurly-cc-exp').payment('cardExpiryVal').year,

      'cvv': self.refs.cvc.value,
      // optional attributes
      'starts_at': currentPlan.date,
      'unit-amount-in-cents': currentPlan.price,
      'coupon_code': self.refs.couponCode.value,
      'country': self.refs.country.value()
    };

    return await new Promise(
      (resolve, reject) => {
        let recurlyLib = self.state.hasLib;

        recurlyLib.token(recurlyInfo, (err, token)=> {
          // send any errors to the error function below
          if (err) {
            reject(err);
          }
          resolve(_.merge({
            'recurly-token': token.id,
            //NEW BILLING API
            billingProvider: 'recurly',
            subOpts: {
              customerBankAccountToken: token.id,
              couponCode: self.refs.couponCode.value
            }
          }, recurlyInfo));
        });
      });
  }

  onHeaderClick() {
    let clickHeader = ReactDOM.findDOMNode(this);
    if (clickHeader) {
      clickHeader.dispatchEvent(new Event('changemethod', {bubbles: true}));
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
        <div className="form-group col-md-6">
          <label className="form-label" htmlFor="number">{config.dict.payment.creditCard.number}</label>
          <input
            type="tel"
            className="form-control recurly-cc-number card-number"
            ref="cardNumber"
            data-billing="number"
            name="number"
            id="number"
            autoComplete="cc-number"
            placeholder={config.dict.payment.creditCard.placeHolder} required/>
        </div>
        <CountrySelect ref="country"/>
        <div className="form-group col-md-4">
          <label className="form-label" htmlFor="month">{config.dict.payment.creditCard.exp}</label>
          <input type="tel" className="form-control recurly-cc-exp" data-billing="month"
                 name="month" id="month"
                 autoComplete="cc-exp"
                 placeholder={config.dict.payment.creditCard.expPlaceHolder} required/>
        </div>
        <div className="form-group col-md-4">
          <label className="form-label" htmlFor="cvv">{config.dict.payment.creditCard.cvv}</label>
          <input type="tel" className="form-control recurly-cc-cvc" data-billing="cvv"
                 ref="cvc"
                 name="cvv" id="cvv" autoComplete="off"
                 placeholder={config.dict.payment.creditCard.cvcPlaceHolder} required/>
        </div>

        {this.renderPromoCode()}

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
            <img src="/images/payment/bank-cards.png"/>
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

export default RecurlyForm;