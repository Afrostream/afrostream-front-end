import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as ModalActionCreators from '../../actions/modal';
import * as BillingActionCreators from '../../actions/billing';
import ModalComponent from './ModalComponent';
import { oauth2 } from '../../../../config';
import MobileDetect from 'mobile-detect';

if (process.env.BROWSER) {
  require('./ModalLogin.less');
}

@connect(({Billing}) => ({Billing}))
class ModalCoupon extends ModalComponent {

  constructor (props) {
    super(props);
    this.state = {
      success: false,
      loading: false
    };
  }

  static contextTypes = {
    location: React.PropTypes.object,
    history: React.PropTypes.object
  };

  componentDidMount () {
    const userAgent = (window.navigator && navigator.userAgent) || '';
    this.setState({
      ua: new MobileDetect(userAgent)
    });
  }

  async handleSubmit (event) {
    event.preventDefault();

    const {
      props: {
        dispatch,
        Billing
      }
    } = this;

    const self = this;
    let errorText = self.getTitle('global');
    const coupon = Billing.get('coupon');

    let formData = {
      providerName: 'afr',
      coupon: this.refs.coupon.value
    };

    this.setState({
      loading: true,
      error: ''
    });

    return await dispatch(BillingActionCreators.validate(formData)).then(({res:{body:{coupon = {}}}}) => {

      if (coupon && coupon.status === 'waiting') {
        dispatch(ModalActionCreators.close());
        self.context.history.pushState(null, `/couponregister`);
      }
      else if (coupon && coupon.status !== 'waiting') {

        errorText = self.getTitle('couponInvalid');
      }

      this.setState({
        loading: false,
        error: errorText
      });

    }).catch(({response:{body:{error}}}) => {
      if (error === 'NOT FOUND') {

        errorText = self.getTitle('couponInvalid');

        this.setState({
          loading: false,
          error: errorText
        });
      }
    });
  }

  getTitle (key = 'title') {
    let keyType = 'coupon';
    return oauth2.dict[keyType][key] || '';
  }

  getForm () {
    if (this.state.loading) {
      return (<div className="loading mode">
        <div className="spinner spin-container">
          <div className="spinner-css">
            <span className="side sp_left">
            <span className="fill"/>
            </span>
            <span className="side sp_right">
            <span className="fill"/>
            </span>
          </div>
          <div className="spin-message">
            <span>&nbsp;</span>
          </div>
        </div>
      </div>);
    }

    if (this.state.success) {
      return (<div />);
    }

    let formTemplate = this.getRedeemCoupon();

    return (
      <div className="notloggedin mode">
        <form noValidate="" onSubmit={::this.handleSubmit}>
          <div className="instructions">{this.getTitle('headerText')}</div>
          {formTemplate}
        </form>
      </div>
    );
  }

  getCoupon () {
    return (
      <div className="coupon">
        <label htmlFor="easy_coupon" className="sad-placeholder">
          {this.getTitle('emailPlaceholder')}
        </label>
        <div className="input-box">
          <i className=""></i>
          <input name="coupon" ref="coupon" id="easy_coupon" type="text" required
                 placeholder={this.getTitle('couponPlaceholder')}
                 title={this.getTitle('couponPlaceholder')}/>
        </div>
      </div>
    );
  }

  getRedeemCoupon () {
    return (
      <div className="emailPassword">
        <div className="inputs-wrapper">
          <div className="inputs">
            {this.getCoupon()}
          </div>
        </div>
        <div className="action">
          <button type="submit" className="primary next">{this.getTitle('action')}</button>
        </div>
      </div>
    );
  }

  render () {

    var errClass = classNames({
      'error': true,
      'hide': !this.state.error
    });

    let ua = this.state.ua;

    let popupClass = classNames({
      'popup': true,
      'ios': ua && ua.is('iOS')
    });

    const classType = 'redeemCoupon';

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className={classType}>
            <div className={popupClass}>
              <div className="overlay active">
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
                      <div className="icon-container">
                        <div className="avatar">
                          <i className="avatar-guest icon-budicon-2"></i>
                        </div>
                      </div>
                      <h1>{this.getTitle()}</h1>
                      <h2 className={errClass}>{this.state.error}</h2>
                    </div>
                    <div className="mode-container">
                      {this.getForm()}
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

ModalCoupon.propTypes = {
  type: React.PropTypes.string,
  dispatch: React.PropTypes.func
};

export default ModalCoupon;
