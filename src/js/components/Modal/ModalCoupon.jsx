import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { Link } from 'react-router'
import * as UserActionCreators from '../../actions/user'
import * as BillingActionCreators from '../../actions/billing'
import ModalComponent from './ModalComponent'
import { getI18n } from '../../../../config/i18n'
import MobileDetect from 'mobile-detect'
import SignUpButton from '../User/SignUpButton'
import { withRouter } from 'react-router'

@connect(({Billing, User}) => ({Billing, User}))
class ModalCoupon extends ModalComponent {

  constructor (props) {
    super(props)
    this.state = {
      success: false,
      loading: false,
      coupon: null,
      signInOrUp: null
    }
  }

  componentDidMount () {
    const {
      props: {location}
    } = this
    let {query} = location
    let code = query && query.code
    if (code) {
      this.refs.coupon.value = code
    }
    const userAgent = (window.navigator && navigator.userAgent) || ''
    this.setState({
      ua: new MobileDetect(userAgent)
    })
  }

  async finalyse () {

    const {
      props: {
        User,
        Billing,
        dispatch
      }
    } = this

    const user = User.get('user')
    const coupon = Billing.get('coupon')
    const billingInfo = {
      email: user.get('email'),
      id: user.get('_id'),
      internalPlanUuid: coupon.get('internalPlan').get('internalPlanUuid'),
      billingProviderName: coupon.get('campaign').get('provider').get('providerName'),
      firstName: user.get('firstName'),
      lastName: user.get('lastName'),
      subOpts: {
        couponCode: coupon.get('code')
      }
    }

    return await dispatch(BillingActionCreators.subscribe(billingInfo))
  }

  handleClose (e) {
    super.handleClose(e)
    this.props.history.push(`/`)
  }

  async handleSubmit (event) {
    event.preventDefault()

    const {
      props: {
        User,
        dispatch
      }
    } = this

    const self = this
    const user = User.get('user')

    let formData = {
      billingProviderName: 'afr',
      coupon: this.refs.coupon.value
    }

    this.setState({
      loading: true,
      error: '',
      internalPlanUuid: null,
      providerName: null
    })

    //Validate coupon
    return await dispatch(BillingActionCreators.validate(formData))
      .then(({
        res:{
          body:{
            coupon
          }
        }
      }) => {
        //coupon valid
        if (coupon && coupon.status === 'waiting') {
          if (!user) {
            return
          }
          return this.finalyse()
        }
        //coupon invalid
        throw new Error(self.getTitle('couponInvalid'))
      })
      //Get updated profile
      .then(()=> {
        this.setState({
          loading: false,
          signInOrUp: !user,
          success: user
        })
        return dispatch(UserActionCreators.getProfile())
      })
      .catch((err) => {
        console.log('Error coupon ', err)
        this.setState({
          success: false,
          loading: false,
          signInOrUp: false,
          error: err.message || err.error || self.getTitle('couponInvalid')
        })
      })
  }

  getTitle (key = 'title') {
    const {
      props: {
        params
      }
    } = this

    return getI18n(params.lang).coupon[key] || ''
  }

  getForm () {
    if (this.state.success) {
      return (<div className="notloggedin mode">
        <div className="instructions">{this.getTitle('successText')}</div>
        <button className="primary next" onClick={::this.handleClose}>{this.getTitle('next')}</button>
      </div>)
    }

    if (this.state.signInOrUp) {
      return (<div className="notloggedin mode">
        <SignUpButton className="primary next" target="showSignup" to={null} label={getI18n().signup.title}
                      cb={::this.finalyse}/>
        <SignUpButton className="primary next" target="showSignin" to={null} label={getI18n().signin.title}
                      cb={::this.finalyse}/>
      </div>)
    }

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
          <div className="spin-message"/>
        </div>
      </div>)
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
          <input name="email" ref="coupon" id="easy_email" type="text" className="input-coupon" required
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
