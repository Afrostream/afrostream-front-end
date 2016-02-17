import React, { PropTypes } from 'react';
import ReactDOM from'react-dom';
import classSet from 'classnames';
import config from '../../../../../config/client';
import CountrySelect from './../CountrySelect';

class GocardlessForm extends React.Component {

  static propTypes = {
    selected: React.PropTypes.bool
  };

  static defaultProps = {
    selected: false
  };

  async submit(billingInfo) {

    return await new Promise(
      (resolve, reject) => {
        GoCardless.customerBankAccountTokens.create({
          publishable_access_token: config.gocardless.key,
          customer_bank_account_tokens: {
            iban: $('#iban').val(),
            country_code: $('#country').val(),
            account_holder_name: `${billingInfo.first_name} ${billingInfo.last_name}`
          }
        }, (response) => {
          if (response.error) {
            reject(response.error.errors);
          } else {
            resolve({
              'customer_bank_account_token': response.customer_bank_account_tokens.id
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
      <div>
        <div className="row">
          <div className="form-group col-md-6">
            <label className="form-label" htmlFor="number">IBAN</label>
            <input
              type="tel"
              className="form-control"
              data-billing="iban"
              name="iban"
              id="iban"
              placeholder="ex. FR14 2004 1010 0505 0001 3M02 606" required/>
          </div>
          <CountrySelect />
        </div>
      </div>
    );
  }

  render() {
    let classHeader = {
      'accordion-toggle': true,
      'collapsed': !this.props.selected
    };

    return (
      <div className="panel">
        <div className="payment-method-details">
          <div className={classSet(classHeader)} onClick={::this.onHeaderClick}>
            <label className="form-label">Payment par virement</label>
            <img src="/images/payment/virement.jpg"/>
          </div>
        </div>

        {this.getForm()}

      </div>
    );
  }
}

export default GocardlessForm;
