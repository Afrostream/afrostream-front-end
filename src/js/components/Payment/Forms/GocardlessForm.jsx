import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import classSet from 'classnames';
import config from '../../../../../config/client';
import CountrySelect from './../CountrySelect';
import iban from './iban-validator';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class GocardlessForm extends React.Component {

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

  componentDidMount() {
    //Detect si le payment via la lib gocardless est dispo
    this.setState({
      hasLib: window['GoCardless']
    });
  }

  validate() {
    this.refs.iban.value = iban.printFormat(this.refs.iban.value, ' ');
    return iban.isValid(this.refs.iban.value);
  }

  async submit(billingInfo) {

    return await new Promise(
      (resolve, reject) => {
        window['GoCardless'].customerBankAccountTokens.create({
          publishable_access_token: config.gocardless.key,
          customer_bank_account_tokens: {
            iban: this.refs.iban.value,
            country_code: this.refs.country.value(),
            account_holder_name: `${billingInfo.first_name} ${billingInfo.last_name}`
          }
        }, (response) => {
          if (response.error) {
            let error = {
              message: '',
              fields: []
            };
            _.forEach(response.error.errors, (value)=> {
              error.fields.push(value.field);
              error.message += `${value.field} ${value.message}`;
            });
            reject(error);
          } else {
            resolve({
              billingProvider: 'gocardless',
              subOpts: {
                customerBankAccountToken: response.customer_bank_account_tokens.id
              }
            })
          }
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
          <label className="form-label" htmlFor="number">IBAN</label>
          <input
            type="tel"
            className="form-control"
            data-billing="iban"
            name="iban"
            id="iban"
            ref="iban"
            onChange={::this.validate}
            placeholder="ex. FR14 2004 1010 0505 0001 3M02 606" required/>
        </div>
        <CountrySelect ref="country"/>
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
            <label className="form-label">Payment par virement</label>
            <img src="/images/payment/virement.jpg"/>
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

export default GocardlessForm;
