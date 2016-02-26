import React from 'react';
import ReactDOM from'react-dom';
import ModalComponent from './ModalComponent';
import classNames from 'classnames';
import {dict,gocardless} from '../../../../config';

if (process.env.BROWSER) {
  require('./ModalGocardlessMandat.less');
}

class ModalGocardlessMandat extends ModalComponent {

  submit() {
    let element = ReactDOM.findDOMNode(this);
    if (element) {
      element.dispatchEvent(new Event('acceptmandat', {bubbles: true}));
    }
  }

  cancel() {
    let element = ReactDOM.findDOMNode(this);
    if (element) {
      element.dispatchEvent(new Event('cancelmandat', {bubbles: true}));
    }
  }

  i18n(key = 'title') {
    return dict.payment.virement.mandat[key] || '';
  }

  render() {

    let closeClass = classNames({
      'close': true,
      'icon-budicon-3': true,
      'hide': !this.props.closable
    });

    let dateNow = new Date().toLocaleDateString();

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
                      <h1>{this.i18n('title')}</h1>
                      <h2 >{this.i18n('info')}</h2>
                      <a className={closeClass} href="#" onClick={::this.handleClose}></a>
                    </div>
                    <div className="mode-container">
                      <div className="mode">
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label>{this.i18n('creancierLabel')}</label>
                          </div>
                          <div className="col-md-6">
                            {gocardless.creancier.id}
                          </div>
                        </div>
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label> {this.i18n('creancierName')}</label>
                          </div>
                          <div className="col-md-6">
                            {gocardless.creancier.name}
                          </div>
                        </div>
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label> {this.i18n('creancierAdress')}</label>
                          </div>
                          <div className="col-md-6">
                            {gocardless.creancier.adress}
                          </div>
                        </div>
                        <div className="divider"/>
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label>{this.i18n('ibanLabel')}</label>
                          </div>
                          <div className="col-md-6">
                            {this.props.data.iban}
                          </div>
                        </div>
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label> {this.i18n('ibanDetent')}</label>
                          </div>
                          <div className="col-md-6">
                            {this.props.data.account_holder_name}
                          </div>
                        </div>
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label>{this.i18n('ibanRef')}</label>
                          </div>
                          <div className="col-md-6">
                            {this.i18n('ibanRefDispo')}
                          </div>
                        </div>
                        <div className="divider"/>
                        <div className="row-fluid">
                          <div className="col-md-6">
                            <label>{this.i18n('ibanDate')}</label>
                          </div>
                          <div className="col-md-6">
                            {dateNow}
                          </div>
                        </div>
                        <div className="divider"/>
                        <div className="row-fluid cgu">
                          {this.i18n('cgu')}
                        </div>
                      </div>
                    </div>
                    <div className="action">
                      <button name="submit-btn" type="submit" className="primary next" onClick={::this.submit}>
                        {this.i18n('submit')}
                      </button>
                      <div className="options">
                        <a href="#" onClick={::this.cancel}
                           className="centered btn-small cancel">{this.i18n('cancel')}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ModalGocardlessMandat.propTypes = {
  data: React.PropTypes.object
};

ModalGocardlessMandat.defaultProps = {
  data: null
};

export default ModalGocardlessMandat;
