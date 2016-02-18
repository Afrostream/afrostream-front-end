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
    this.setState({
      hasLib: recurly
    });

    if (recurly && !recurly.configured) {
      recurly.configure(config.recurly.key);
    }
  }

  async submit(billingInfo, currentPlan) {

    const cardNumber = $('.recurly-cc-number').val();
    const excludedCards = ['visaelectron', 'maestro'];

    //Excluded cart type message
    if (~excludedCards.indexOf($.payment.cardType(cardNumber))) {
      //$('#errors').text('Ce type ne carte n‘est pas pris en charge actuellement');
      $('.recurly-cc-number').addClass('has-error');
      throw new Error('Ce type ne carte n‘est pas pris en charge actuellement');
    }

    let recurlyInfo = _.merge({
      // required attributes
      'number': this.refs.cardNumber.value,

      'month': $('.recurly-cc-exp').payment('cardExpiryVal').month,
      'year': $('.recurly-cc-exp').payment('cardExpiryVal').year,

      'cvv': this.refs.cvc.value,
      // optional attributes
      'starts_at': currentPlan.date,
      'country': this.refs.country.value()
    }, billingInfo);

    return await new Promise(
      (resolve, reject) => {
        recurly.token(recurlyInfo, (err, token)=> {
          // send any errors to the error function below
          if (err) {
            reject(err);
          }
          resolve({
            'recurly-token': token.id,
            //NEW BILLING API
            'providerName': 'recurly',
            'accountToken': token.id
          });
        });
      });
  }

  onHeaderClick() {
    let clickHeader = ReactDOM.findDOMNode(this);
    if (clickHeader) {
      clickHeader.dispatchEvent(new Event('changemethod', {bubbles: true}));
    }
  }

  getForm() {
    if (!this.props.selected) return;

    return (
      <div className="row" ref="goCardlessForm">
        <div className="form-group col-md-6">
          <label className="form-label" htmlFor="number">Numéro de carte</label>
          <input
            type="tel"
            className="form-control recurly-cc-number card-number"
            ref="cardNumber"
            data-billing="number"
            name="number"
            id="number"
            autoComplete="cc-number"
            placeholder="1234 5678 8901 1234" required/>
        </div>
        <CountrySelect ref="country"/>
        <div className="form-group col-md-4">
          <label className="form-label" htmlFor="month">Date de validité</label>
          <input type="tel" className="form-control recurly-cc-exp" data-billing="month"
                 name="month" id="month"
                 autoComplete="cc-exp"
                 placeholder="MM/AA" required/>
        </div>
        <div className="form-group col-md-4">
          <label className="form-label" htmlFor="cvv">Code sécurité</label>
          <input type="tel" className="form-control recurly-cc-cvc" data-billing="cvv"
                 ref="cvc"
                 name="cvv" id="cvv" autoComplete="off"
                 placeholder="123" required/>
        </div>
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
            <label className="form-label">Payment par carte bancaire</label>
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
