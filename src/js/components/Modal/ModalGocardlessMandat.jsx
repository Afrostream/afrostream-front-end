import React from 'react'
import ReactDOM from 'react-dom'
import ModalComponent from './ModalComponent'
import moment from 'moment'
import classNames from 'classnames'
import config from '../../../../config'
import {
  FormattedMessage,
} from 'react-intl'

const {gocardless} = config

if (process.env.BROWSER) {
  require('./ModalGocardlessMandat.less')
}

class ModalGocardlessMandat extends ModalComponent {

  constructor (props, context) {
    super(props, context)
  }


  submit () {
    let element = ReactDOM.findDOMNode(this)
    if (element) {
      element.dispatchEvent(new CustomEvent('acceptmandat', {bubbles: true}))
    }
  }

  cancel () {
    let element = ReactDOM.findDOMNode(this)
    if (element) {
      element.dispatchEvent(new CustomEvent('cancelmandat', {bubbles: true}))
    }
  }

  getI18n () {
    return 'payment.virement.mandat'
  }

  render () {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    })

    let dateNow = moment().format('L')

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default gocardless">
          <div className="signin">
            <div className="popup">
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <h1>{this.getTitle('title')}</h1>
                      <h2 >{this.getTitle('info')}</h2>
                      <a className={closeClass}  onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <div className="row">
                          <div className="col-md-12">
                            <label>{this.getTitle('creancierLabel')}</label>
                          </div>
                          <div className="col-md-12">
                            {gocardless.creancier.id}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label> {this.getTitle('creancierName')}</label>
                          </div>
                          <div className="col-md-12">
                            {gocardless.creancier.name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label> {this.getTitle('creancierAdress')}</label>
                          </div>
                          <div className="col-md-12">
                            {gocardless.creancier.adress}
                          </div>
                        </div>
                        <div className="divider"/>
                        <div className="row">
                          <div className="col-md-12">
                            <label>{this.getTitle('ibanLabel')}</label>
                          </div>
                          <div className="col-md-12">
                            {this.props.data.iban}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label> {this.getTitle('ibanDetent')}</label>
                          </div>
                          <div className="col-md-12">
                            {this.props.data.account_holder_name}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-12">
                            <label>{this.getTitle('ibanRef')}</label>
                          </div>
                          <div className="col-md-12">
                            {this.getTitle('ibanRefDispo')}
                          </div>
                        </div>
                        <div className="divider"/>
                        <div className="row">
                          <div className="col-md-12">
                            <label>{this.getTitle('ibanDate')}</label>
                          </div>
                          <div className="col-md-12">
                            {dateNow}
                          </div>
                        </div>
                        <div className="divider"/>
                        <div className="row-fluid cgu">
                          {this.getTitle('cgu')}
                        </div>
                      </div>
                    </div>
                    <div className="action">
                      <button name="submit-btn" type="submit" className="primary next" onClick={::this.submit}>
                        {this.getTitle('submit')}
                      </button>
                      <div className="options">
                        <a  onClick={::this.cancel}
                           className="centered btn-small cancel">{this.getTitle('cancel')}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

ModalGocardlessMandat.propTypes = {
  data: React.PropTypes.object
}

ModalGocardlessMandat.defaultProps = {
  data: null
}

export default ModalGocardlessMandat
