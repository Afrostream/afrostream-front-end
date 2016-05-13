import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'
import * as ModalActionCreators from '../../actions/modal'
import * as BillingActionCreators from '../../actions/billing'
import ModalComponent from './ModalComponent'
import { dict, oauth2 } from '../../../../config'
import MobileDetect from 'mobile-detect'
import { withRouter } from 'react-router'

if (process.env.BROWSER) {
  require('./ModalLogin.less')
}

@connect(({Billing}) => ({Billing}))
class ModalCoupon extends ModalComponent {

  constructor (props) {
    super(props)
    this.state = {
      success: false,
      loading: false
    }
  }

  componentDidMount () {
    const userAgent = (window.navigator && navigator.userAgent) || ''
    this.setState({
      ua: new MobileDetect(userAgent)
    })
  }

  async handleSubmit (event) {
    event.preventDefault()

    const {
      props: {
        dispatch,
        Billing
      }
    } = this

    const self = this
    let errorText = self.getTitle('global')
    const coupon = Billing.get('coupon')

    let formData = {
      providerName: 'afr',
      coupon: this.refs.coupon.value
    }

    this.setState({
      loading: true,
      error: ''
    })

    return await dispatch(BillingActionCreators.validate(formData)).then(({res:{body:{coupon = {}}}}) => {

      if (coupon && coupon.status === 'waiting') {
        dispatch(ModalActionCreators.close())
        self.props.history.push(`/couponregister`)
      }
      else if (coupon && coupon.status !== 'waiting') {

        errorText = self.getTitle('couponInvalid')
      }

      this.setState({
        loading: false,
        error: errorText
      })

    }).catch(({response:{body:{error}}}) => {
      if (error === 'NOT FOUND') {

        errorText = self.getTitle('couponInvalid')

        this.setState({
          loading: false,
          error: errorText
        })
      }
    })
  }

  getTitle (key = 'title') {
    const {
      props: {
        params
      }
    } = this

    return dict(params.lang).coupon[key] || ''
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
            <span>&nbsp</span>
          </div>
        </div>
      </div>)
    }

    if (this.state.success) {
      return (<div />)
    }

    let formTemplate = this.getRedeemCoupon()

    return (
      <div className="notloggedin mode">
        <form noValidate="" onSubmit={::this.handleSubmit}>
          <div className="instructions">{this.getTitle('headerText')}</div>
          {formTemplate}
        </form>
      </div>
    )
  }

  getCoupon () {
    return (
      <div className="email">
        <label htmlFor="easy_email" className="sad-placeholder">
          {this.getTitle('emailPlaceholder')}
        </label>
        <div className="input-box">
          <i className="icon-barcode"></i>
          <input name="email" ref="coupon" id="easy_email" type="text" required
                 placeholder={this.getTitle('couponPlaceholder')}
                 title={this.getTitle('couponPlaceholder')}/>
        </div>
      </div>
    )
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
    )
  }

  render () {

    var errClass = classNames({
      'error': true,
      'hide': !this.state.error
    })

    let ua = this.state.ua

    let popupClass = classNames({
      'popup': this.props.modal,
      'ios': ua && ua.is('iOS')
    })

    let overlayClass = classNames({
      'overlay': this.props.modal,
      'widget': !this.props.modal,
      'active': true
    })

    const classType = 'redeemCoupon'

    return (
      <div className="lock-container">
        <div id="lock" className="lock theme-default">
          <div className={classType}>
            <div className={popupClass}>
              <div className={overlayClass}>
                <div className="centrix">
                  <div id="onestep" className="panel onestep active">
                    {/*HEADER*/}
                    <div className="header top-header ">
                      <div className="bg-gradient"></div>
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
  dispatch: React.PropTypes.func,
  location: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired
}

export default withRouter(ModalCoupon)
