import React, { PropTypes } from 'react'
import ReactDOM from'react-dom'
import classSet from 'classnames'
import config from '../../../../../config'
import { getI18n } from '../../../../../config/i18n'
import CountrySelect from './../CountrySelect'
import ModalGocardlessMandat from './../../Modal/ModalGocardlessMandat'
import IBAN from 'iban'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const {gocardless} = config

class GocardlessForm extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      modal: false,
      modalData: null
    }
  }

  async submit (billingInfo) {

    let self = this
    let ibanValue = self.refs.iban.value
    let countryValue = self.refs.country.value()
    return await new Promise(
      (resolve, reject) => {
        const gcLib = window['GoCardless']
        const tokenData = {
          iban: ibanValue,
          country_code: countryValue,
          account_holder_name: `${billingInfo.firstName} ${billingInfo.lastName}`
        }
        let error = {
          message: '',
          fields: []
        }
        gcLib.customerBankAccountTokens.create({
          publishable_access_token: gocardless.key,
          customer_bank_account_tokens: tokenData
        }, (response) => {
          if (response.error) {
            _.forEach(response.error.errors, (value)=> {
              error.fields.push(value.field)
              error.message += `${value.field} ${value.message}`
            })

            self.setState({
              modal: false
            })

            return reject(error)

          } else {
            self.setState({
              modal: true,
              modalData: tokenData
            })
            let element = ReactDOM.findDOMNode(this)
            element.addEventListener('acceptmandat', function () {
              self.setState({
                modal: false
              })
              return resolve({
                billingProviderName: 'gocardless',
                subOpts: {
                  customerBankAccountToken: response.customer_bank_account_tokens.id,
                  iban: ibanValue
                }
              })
            })
            element.addEventListener('cancelmandat', function () {
              self.setState({
                modal: false
              })
              error.message = getI18n().payment.errors.cancelled
              return reject(error)
            })
          }
        })
      })
  }

  static propTypes = {
    selected: React.PropTypes.bool,
    planCode: React.PropTypes.string,
    planLabel: React.PropTypes.string
  }

  static defaultProps = {
    selected: false,
    planCode: null,
    planLabel: null
  }

  validate () {
    this.refs.iban.value = IBAN.printFormat(this.refs.iban.value, ' ')
    return IBAN.isValid(this.refs.iban.value)
  }

  onHeaderClick () {
    let clickHeader = ReactDOM.findDOMNode(this)
    if (clickHeader) {
      clickHeader.dispatchEvent(new CustomEvent('changemethod', {'detail': 'gocardless', bubbles: true}))
    }
  }

  getForm () {
    if (!this.props.selected) return
    return (
      <div className="row" ref="goCardlessForm">
        <div className="form-group col-md-6">
          <label className="form-label" htmlFor="number">IBAN</label>
          <input
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
    )
  }

  render () {

    let classHeader = {
      'accordion-toggle': true,
      'collapsed': !this.props.selected
    }

    let classPanel = {
      'panel': true,
      'collapsed': !this.props.selected
    }


    return (
      <div className={classSet(classPanel)}>
        {this.state.modal ?
          <ModalGocardlessMandat ref="modal" {...this.props} data={this.state.modalData}/> : ''}
        <div className="payment-method-details">
          <div className={classSet(classHeader)} onClick={::this.onHeaderClick}>
            <label className="form-label">{getI18n().payment.virement.label}</label>
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
    )
  }
}

export default GocardlessForm
