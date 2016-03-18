import React from 'react';
import ReactDOM from'react-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';
import * as ModalActionCreators from '../../actions/modal';
import * as CouponActionCreators from '../../actions/coupon';
import ModalComponent from './ModalComponent';
import {oauth2} from '../../../../config';
import MobileDetect from 'mobile-detect';
import _ from 'lodash';

if (process.env.BROWSER) {
  require('./ModalLogin.less');
}

@connect(({ Coupon }) => ({Coupon}))
class ModalCoupon extends ModalComponent {

  constructor(props) {
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

  componentDidMount() {
    const userAgent = (window.navigator && navigator.userAgent) || '';
    this.setState({
      ua: new MobileDetect(userAgent)
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const {
      props: { dispatch,
        Coupon
        }
      } = this;

    const self = this;
    const coupon = Coupon.get('coupon');
    debugger;

    let formData = {
      coupon: this.refs.email.value
    };

    this.setState({
      loading: true,
      error: ''
    });

    return await dispatch(CouponActionCreators.validate(formData)).then((result) => {

      console.log('*** call made successfully ***');
      console.log(result.res.body);
      console.log('*** end of coupon result ***');
      debugger;

      if (typeof result.res.body.coupon !== 'undefined') {

        dispatch(ModalActionCreators.close());
        self.context.history.pushState(null, `/couponregister`);
      }

    }).catch((err) => {
      let errorText = 'il y a une erreur';
      console.log('*** there was an error ***');
      debugger;

      if (err.response.body.error === 'NOT FOUND') {

        errorText = 'Le coupon que vous avez soumis est incorrect ou a déjà été utilisé. ' +
          'Veuillez réessayer avec un autre coupon.';
      }

      this.setState({
        loading: false,
        error: errorText
      });

    });
  }

  getTitle(key = 'title') {
    let keyType = 'coupon';
    return oauth2.dict[keyType][key] || '';
  }

  getForm() {
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

    let formTemplate = (this.getRedeemCoupon() ? this.getRedeemCoupon() : '');

    return (
      <div className="notloggedin mode">
        <form noValidate="" onSubmit={::this.handleSubmit}>
          <div className="instructions">{this.getTitle('headerText')}</div>
          {formTemplate}
        </form>
      </div>
    );
  }

  getCoupon() {
    return (
      <div className="email">
        <label htmlFor="easy_email" className="sad-placeholder">
          {this.getTitle('emailPlaceholder')}
        </label>
        <div className="input-box">
          <i className="icon-budicon-5"></i>
          <input name="email" ref="email" id="easy_email" type="text" required
                 placeholder={this.getTitle('couponPlaceholder')}
                 title={this.getTitle('couponPlaceholder')}/>
        </div>
      </div>
    );
  }

  getRedeemCoupon() {
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

  render() {

    const { props: { Coupon } } = this;

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
